package xs.aichat.v2.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.Disposable;
import xs.aichat.util.JsonAdapter;
import xs.aichat.v2.dto.ConversationParamStoreV2;
import xs.aichat.v2.dto.external.wrtn.request.SendMessageApiRequest;
import xs.aichat.v2.dto.external.wrtn.request.StopMessageApiRequest;
import xs.aichat.v2.dto.external.wrtn.response.StopMessageApiResponse;
import xs.aichat.v2.dto.internal.request.*;
import xs.aichat.v2.dto.internal.response.*;
import xs.aichat.v2.external.ChatVendorClient;
import xs.aichat.v2.util.DocumentLinkBuilder;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * AI비서 서비스 구현체.
 * <p>
 * - 외부 챗봇 벤더(Wrtn 등)별 HTTP 상세 호출은 {@link xs.aichat.v2.external.ChatVendorClient}에 위임
 * </p>
 */
@Slf4j
@Service
public class ChatStreamServiceImpl implements ChatStreamService {

    private final ChatVendorClient chatVendorClient; // 챗봇 벤더 연동 추상화 (현재 구현: WrtnChatVendorClient)

    private final ChatFileService chatFileService; // 업로드/삭제 등 파일 처리 담당 서비스

	private final ConversationParamStoreV2 conversationParamStoreV2;

	private final ObjectMapper objectMapper = new ObjectMapper();

	public ChatStreamServiceImpl(@Qualifier("wtrnChatVendorClientV2") ChatVendorClient chatVendorClient,
								 @Qualifier("conversationParamStoreV2") ConversationParamStoreV2 conversationParamStoreV2,
								 ChatFileService chatFileService) {
        this.chatVendorClient = chatVendorClient;
		this.conversationParamStoreV2 = conversationParamStoreV2;
		this.chatFileService = chatFileService;
	}

    // conversation_id 기준으로 SSE emitter/구독 정보를 관리하는 맵
	private final Map<String, SseEmitter> emitterMap = new ConcurrentHashMap<>();

    private final Map<String, Disposable> subscriptionMap = new ConcurrentHashMap<>();
    
    // emitter 완료 상태 추적 (중복 complete 방지)
    private final Map<String, Boolean> emitterCompletedMap = new ConcurrentHashMap<>();
    
    // conversationId별 업로드된 파일 ID 목록 (원본 파일 삭제용)
    private final Map<String, List<String>> conversationFileIdsMap = new ConcurrentHashMap<>();

	//conversationId 에 여러 sessionId 가 있을 수 있음 (연속 대화 지원)
	private Map<String, List<String>> conversationSessions = new ConcurrentHashMap<>();

    //****** 뤼튼 연동 AI 챗봇 ************************************************************************//

	//****** 뤼튼 연동 AI 챗봇 SSE 전송 ************************************************************//

	/**
	 * 실시간 채팅 스트림 처리
	 * - SSE를 통한 실시간 AI 챗봇 응답 스트리밍
	 * - WebClient 기반으로 벤더 API와 연결하여 스트림 데이터 수신
	 * - conversation_id 기준으로 emitter와 subscription 관리
	 * - 파일 첨부 시 Base64 인코딩하여 전송
	 * @param emitter SSE 연결을 위한 SseEmitter 객체
//	 * @param param JSON 문자열 형태의 요청 파라미터 (user_id, message, conversation_id, files 등)
	 */
	@Override
	public void startMessageStream(SseEmitter emitter, String conversationId) {
		// conversationId 기준으로 params 조회
//		log.info("objXtrmParams (conversationId={})", conversationId);
//		log.info("objXtrmParams (conversationId={}) \n {}"
//				, conversationId, paramStore.get(conversationId));
		if (Objects.isNull(conversationId)) {
			try {
				emitter.send(
						SseEmitter.event()
								.name("message")
								.data("{\"status\":\"error\",\"message\":\"params not found\"}")
				);
			} catch (IOException ignored) {}
			emitter.complete();
			return;
		}

		SendMessageRequest request = conversationParamStoreV2.get(conversationId);
		if (request == null) {
			try {
				sendSafe(emitter, "message",
						"{\"status\":\"error\",\"message\":\"params not found for conversation_id=" + conversationId + "\"}");
			} finally {
				emitter.complete();
			}
			return;
		}

		try {
			// SQL Injection 취약점 보완: 입력값 검증
			/*String invalidField = validateAichatParams(objXtrmParams);
			if (invalidField != null) {
				emitter.send(SseEmitter.event()
						.name("message")
						.data("{\"status\":\"error\",\"message\":\"유효하지 않은 " + invalidField + " 값입니다.\"}"));
				emitter.complete();
				return;
			}*/

			// null 방지: 프론트에서 누락된 필드는 빈 문자열로 Wrtn에 전달 (422 방지)
			SendMessageApiRequest apiRequest = SendMessageApiRequest.initialize(
					request.getConversationId(),
					request.getUserId(),
					request.getChatCategory(),
					request.getMessage(),
					"N"
			);

			// 업로드된 파일 처리
			// - 파일 ID 목록 파싱 (콤마 구분 문자열 -> 리스트)
			// - 파일을 읽어 Base64 인코딩 후 요청 바디에 첨부
			List<String> uploadedFileIds = parseUploadedFileIds(request.getFiles());
			if (!uploadedFileIds.isEmpty()) {
                // 파일 정보를 뤼튼 API 요청 바디에 첨부 (Base64 인코딩된 파일 데이터 포함)
                var attachments = chatFileService.attachFilesPayload(uploadedFileIds);
				if (!attachments.isEmpty()) {
					apiRequest.setFiles(attachments);
				}
//				log.debug("Request files: {}", uploadedFileIds);
				// conversationId별 파일 ID 목록 저장 (원본 파일 삭제용)
				conversationFileIdsMap.put(conversationId, uploadedFileIds);
			}

			// SSE 스트림은 conversationId가 아닌 sessionId 기준으로 관리
			String sessionId = UUID.randomUUID().toString();
			emitterMap.put(sessionId, emitter);
			conversationSessions.computeIfAbsent(conversationId, k -> new ArrayList<>()).add(sessionId);

			// WebClient 기반 SSE 스트림 시작
			// - ChatVendorClient 구현체(WrtnChatVendorClient)로 실제 벤더 API 호출 위임
			// - chunk 콜백: 수신한 데이터 청크를 처리하여 클라이언트로 전송
			// - error 콜백: 에러 발생 시 에러 메시지 전송 및 리소스 정리
			// - complete 콜백: 스트림 완료 시 리소스 정리 (done 상태를 받지 못한 경우에만)
			Disposable subscription = chatVendorClient.startChatStream(
					conversationId,
					apiRequest,
					chunk -> processChunk(emitter, chunk, conversationId),  // 청크 처리 콜백
					err -> {
						log.error("WebClient SSE 스트림 에러 (conversationId={})", conversationId, err);
						sendSafe(emitter, "message", "{\"status\":\"error\",\"message\":\"" + err.getMessage() + "\"}");
						//safeComplete(emitter, conversationId);
						cleanup(sessionId, conversationId);
						// 에러 발생 시에도 원본 파일 삭제 (전송 시도했으므로)
						deleteOriginalFilesForConversation(conversationId);
					},
					() -> {
						// 스트림 완료 시 처리
//						log.info("🟢 WebClient Flux 완료 콜백 호출");
						// "done" 상태를 받지 못한 경우에만 완료 처리
						// (정상적인 경우 "done" chunk에서 이미 완료됨)
						if (!isEmitterCompleted(conversationId)) {
							//safeComplete(emitter, conversationId);
							cleanup(sessionId, conversationId);
						} else {
//							log.debug("emitter는 이미 완료됨 (conversationId: {})", conversationId);
						}
						// 스트림 완료 후 원본 파일 삭제 (썸네일은 유지) - "done" 상태를 받지 못한 경우에만
						deleteOriginalFilesForConversation(conversationId);
					}
			);

			// 구독 정보 등록 (강제 중지를 위한 관리)
//			subscriptionMap.put(conversationId, subscription);
			// sessionId 기준으로 subscription 저장
			subscriptionMap.put(sessionId, subscription);

			// emitter 생명주기 이벤트 핸들러 등록
			// - onCompletion: 클라이언트가 연결을 종료한 경우
			// - onTimeout: 연결 타임아웃 발생 시
			// - onError: 연결 오류 발생 시
			emitter.onCompletion(() -> {
//				log.info("클라이언트가 SSE 연결을 종료했습니다 (conversationId: {})", conversationId);
//				log.info("클라이언트가 SSE 연결을 종료했습니다 (sessionId: {})", sessionId);
				cleanup(sessionId, conversationId);
			});
			emitter.onTimeout(() -> {
//				log.warn("SSE 연결 타임아웃 발생 (conversationId: {})", conversationId);
//				log.warn("SSE 연결 타임아웃 발생 (conversationId: {})", sessionId);
				cleanup(sessionId, conversationId);
			});
			emitter.onError(e -> {
//				log.error("SSE 연결 오류 발생 (conversationId: {}): {}", sessionId, e.getMessage(), e);
				cleanup(sessionId, conversationId);
			});
		} catch (Exception e) {
			try {
				emitter.send(SseEmitter.event().name("message").data("Exception: " + e.getMessage()));
			} catch (IOException ioException) {
//				log.error("SSE 전송 중 예외 발생", ioException);
			}
			emitter.completeWithError(e);
			conversationParamStoreV2.remove(conversationId);
		}
	}


	/**
	 * 스트림 중지 요청 처리
	 * - 사용자가 "중지" 버튼을 클릭한 경우 호출
	 * - 내부 리소스 정리 (emitter, subscription 해제)
	 * - 벤더 API에 중단 요청 전송
	 * @param request 중지 파라미터 (conversation_id, message_id, user_id 필수)
	 * @return StopMessageResponse 중지 결과 (returnStop: true/false)
	 * @throws Exception 중지 처리 중 예외 발생 시
	 */
	@Override
	public StopMessageResponse stopStream(StopMessageRequest request) throws Exception{
		String conversationId = request.getConversationId();

		SendMessageRequest prev = conversationParamStoreV2.get(conversationId);
		String userId = prev != null ? prev.getUserId() : null;

		// 내부 상태 정리
		// - emitter와 subscription 해제
		// - emitterMap, subscriptionMap에서 제거
		boolean stopped = stopStreamInternal(conversationId);
		
		// 벤더 API에 중단 요청 전송
		// - 필수 파라미터 검증 후 호출
		// - 벤더 서버에서도 스트림 생성 중단 처리
		try {
			StopMessageApiRequest apiRequest = StopMessageApiRequest.of(
					request.getConversationId(),
					request.getMessageId(),
					userId
			);

			StopMessageApiResponse apiResponse = chatVendorClient.interrupt(apiRequest);
		} catch (Exception e) {
//			log.error("❌ 중단 API 호출 실패: {}", e.getMessage(), e);
		}

        return StopMessageResponse.of(stopped);
	}

	/**
	 * 내부 스트림 상태 정리
	 * - subscription dispose: WebClient 구독 해제
	 * - emitter complete: SSE 연결 종료
	 * - Map에서 제거하여 메모리 누수 방지
	 * @param conversationId 대화 ID
	 * @return 정리 성공 여부 (subscription 또는 emitter가 존재했는지)
	 */
	private boolean stopStreamInternal(String conversationId) {
		List<String> sessions = conversationSessions.getOrDefault(conversationId, new ArrayList<>());

		if (sessions.isEmpty()) {
//			log.warn("중단할 session 없음 (conversationId = {})", conversationId);
			return false;
		}

		boolean stopped = false;

		for (String sessionId : sessions) {
			try {
				SseEmitter emitter = emitterMap.remove(sessionId);
				if (emitter != null) {
					emitter.complete();
				}

				Disposable sub = subscriptionMap.remove(sessionId);
				if (sub != null && !sub.isDisposed()) {
					sub.dispose();
				}

				stopped = true;
			} catch (Exception e) {
//				log.error("중단 중 오류 (sessionId: {})", sessionId, e);
			}
		}

		// session 목록 초기화
		conversationSessions.remove(conversationId);

		return stopped;
	}
	
	/**
	 * SSE chunk 데이터 처리
	 * - 벤더로부터 수신한 chunk 데이터를 파싱하여 상태별로 처리
	 * - JSON 파싱 후 status 필드에 따라 분기 처리
	 */
	private void processChunk(SseEmitter emitter, String chunk, String conversationId) {
		try {
			// chunk 유효성 검증
			if (chunk == null || chunk.trim().isEmpty()) {
				return;
			}

			// JSON 파싱
			Map<String, Object> responseMap;

			try {
				responseMap = objectMapper.readValue(chunk.trim(),new TypeReference<>() {});
			} catch (Exception parseErr) {
//				log.warn("⚠️ JSON 파싱 실패 chunk: {}", chunk);
				return; // JSON 형식이 아니면 무시
			}

			// status 필드 추출
			String status = (String) responseMap.getOrDefault("status", "");

			// 상태별 분기 처리
			switch (status) {
				case "error":
					log.error("SSE error status 수신 (conversationId={}): {}", conversationId, responseMap);
					sendSafe(emitter, "message", objectMapper.writeValueAsString(responseMap));
					safeComplete(emitter, conversationId);
					break;

				case "done":
//					log.info("✅ 완료 상태 수신: {}", status);
					String doneString = "{\"status\":\"done\"}";
					sendSafe(emitter, "message", doneString);
					// "done" 상태 수신 시 원본 파일 삭제 (썸네일은 유지)
					deleteOriginalFilesForConversation(conversationId);
					safeComplete(emitter, conversationId);
					break;

				case "response_completed":
//					log.info("📫 완료 상태 수신: {}", status);
					String responseString = "{\"status\":\"response_completed\",\"message\":\"\"}";
					sendSafe(emitter, "message", responseString);
					break;

				default:
					// 일반 메시지 chunk
//					log.debug("💬 chunk: {}", responseMap);
					convertSourceUrls(responseMap);
					sendSafe(emitter, "message", objectMapper.writeValueAsString(responseMap));
					break;
			}

		} catch (Exception e) {
//			log.error("❌ chunk 처리 중 예외 발생", e);
			sendSafe(emitter, "message", "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
			safeComplete(emitter, conversationId);
		}
	}

	@SuppressWarnings("unchecked")
	private void convertSourceUrls(Map<String, Object> responseMap) {
		if (responseMap == null) {
			return;
		}

		Object sources = responseMap.get("sources");
		if (!(sources instanceof List<?>)) {
			return;
		}

		for (Object sourceObj : (List<?>) sources) {
			if (!(sourceObj instanceof Map<?, ?>)) {
				continue;
			}

			Map<String, Object> source = (Map<String, Object>) sourceObj;
			String sourceType = toText(source.get("source_type"));
			String docType = toText(source.get("doc_type"));
			String sourceId = toText(source.get("source_id"));
			String boardId = isInternalDocType(sourceType, docType) ? toText(source.get("board_id")) : null;
			String fallbackUrl = toText(source.get("url"));

			String resolvedUrl = DocumentLinkBuilder.resolveSourceUrl(sourceType, docType, sourceId, boardId, fallbackUrl);
			source.put("url", resolvedUrl);
		}
	}

	private String toText(Object value) {
		if (value == null) {
			return null;
		}
		if (value instanceof JsonNode) {
			return ((JsonNode) value).asText();
		}
		return String.valueOf(value);
	}

	private boolean isInternalDocType(String sourceType, String docType) {
		return "internal".equalsIgnoreCase(docType != null ? docType : "")
				|| "internal".equalsIgnoreCase(sourceType != null ? sourceType : "");
	}

	/**
	 * 안전한 emitter.send() 호출
	 * - emitter가 null이거나 이미 완료된 경우 예외 처리
	 * - IllegalStateException, IOException 등 예외를 안전하게 처리
	 */
	private void sendSafe(SseEmitter emitter, String eventName, String data) {
		try {
			if (emitter != null) {
				emitter.send(SseEmitter.event().name(eventName).data(data));
			}
		} catch (IllegalStateException e) {
//			log.debug("⚠️ 이미 완료된 emitter에 send 시도 (무시)");
		} catch (IOException e) {
//			log.error("❌ SSE 전송 IOException", e);
		} catch (Exception e) {
//			log.error("❌ SSE 전송 중 예기치 못한 오류", e);
		}
	}

	/**
	 * emitter 완료 상태 확인
	 * - 중복 complete() 호출 방지를 위한 상태 확인
	 */
	private boolean isEmitterCompleted(String sessionId) {
		if (sessionId == null) {
			return false;
		}
		return Boolean.TRUE.equals(emitterCompletedMap.get(sessionId));
	}
	
	/**
	 * 안전한 emitter.complete() 호출
	 * - 중복 complete() 호출 방지 (conversationId 기준)
	 * - 완료 상태를 Map에 저장하여 중복 방지
	 */
	private void safeComplete(SseEmitter emitter, String sessionId) {
		if (emitter == null) {
			return;
		}
		
		// conversationId가 있으면 중복 완료 체크
		if (sessionId != null) {
			Boolean alreadyCompleted = emitterCompletedMap.putIfAbsent(sessionId, true);
			if (Boolean.TRUE.equals(alreadyCompleted)) {
//				log.debug("⚠️ 이미 완료된 emitter (conversationId: {})", sessionId);
				return;
			}
		}
		
		try {
			emitter.complete();
//			if (sessionId != null) {
//				log.debug("🟢 emitter 정상 완료 (conversationId: {})", sessionId);
//			} else {
//				log.debug("🟢 emitter 정상 완료");
//			}
		} catch (IllegalStateException e) {
			log.debug("이미 완료된 emitter (중복 complete 무시)");
		} catch (NullPointerException e) {
			// 클라이언트가 연결을 끊은 경우 발생할 수 있음
			// emitter.onCompletion() 콜백이 먼저 실행되어 emitter가 null이 된 상태
//			if (sessionId != null) {
//				log.info("⚠️ 클라이언트가 이미 연결을 끊은 emitter에 complete() 시도 (sessionId: {}) - 이는 정상적인 시나리오입니다", sessionId);
//			} else {
//				log.info("⚠️ 클라이언트가 이미 연결을 끊은 emitter에 complete() 시도 - 이는 정상적인 시나리오입니다");
//			}
		} catch (Exception e) {
			log.error("emitter.complete() 중 오류", e);
		}
	}

	/**
	 * 스트림 리소스 정리
	 * - subscription, emitter, 완료 상태 정보를 모두 제거
	 * - 메모리 누수 방지를 위한 정리 작업
//	 * @param searchKey conversation_id (정리할 리소스의 키)
	 */
	//conversationId를 인자로 추가하여 스토어 정리까지 통합
	private void cleanup(String sessionId, String conversationId) {
		try {
			// 1. WebClient 구독 해제를 가장 먼저 수행 (소켓 반환의 핵심)
			Disposable sub = subscriptionMap.remove(sessionId);
			if (sub != null && !sub.isDisposed()) {
				sub.dispose();
			}

			// 2. SSE Emitter 종료
			SseEmitter emitter = emitterMap.remove(sessionId);
			if (emitter != null) {
				try {
					emitter.complete();
				} catch (Exception ignored) {}
			}

			// 3. 관련 맵 및 스토어 정리
			emitterCompletedMap.remove(sessionId);
			if (conversationId != null) {
				conversationParamStoreV2.remove(conversationId);
			}
		} catch (Exception e) {
			// log.error("cleanup error", e);
		}
	}

	/**
	 * 업로드된 파일 ID 목록 파싱
	 * - 프론트에서 넘어온 파일명 목록(콤마 구분 문자열)을 개별 파일 ID 리스트로 변환
	 * - 실제 디코딩(URLDecoder)은 파일 서비스(ChatFileService)에서 한 번만 수행
	 */
	private List<String> parseUploadedFileIds(String encoded) {
		if (encoded == null || encoded.trim().isEmpty()) {
			return Collections.emptyList();
		}

		return Arrays.stream(encoded.split(","))
				.map(String::trim)
				.filter(it -> !it.isEmpty())
				.collect(Collectors.toList());
	}

	/**
	 * conversationId에 해당하는 원본 파일 삭제
	 * - 메시지 전송 완료 후 원본 파일만 삭제 (썸네일은 유지)
	 * - 중복 삭제 방지를 위해 Map에서 제거 후 처리
	 * @param conversationId 대화 ID
	 */
	private void deleteOriginalFilesForConversation(String conversationId) {
		// conversationId 유효성 검증
		if (conversationId == null || conversationId.isEmpty()) {
			return;
		}
		
		// Map에서 파일 ID 목록 가져오기 (동시에 제거하여 중복 삭제 방지)
		List<String> fileIds = conversationFileIdsMap.remove(conversationId);
		if (fileIds != null && !fileIds.isEmpty()) {
			try {
				// 파일 서비스를 통해 원본 파일 삭제 (썸네일은 유지)
				chatFileService.deleteOriginalFiles(fileIds);
//				log.info("메시지 전송 완료 후 원본 파일 삭제 완료 (conversationId: {})", conversationId);
			} catch (Exception e) {
//				log.error("원본 파일 삭제 중 오류 발생 (conversationId: {})", conversationId, e);
			}
		}
	}

	private String extractSearchKey(String params) {
		try {
			JsonNode obj = objectMapper.readTree(params);
			if (obj.isObject() && obj.has("searchKey")) {
				return obj.get("searchKey").asText();
			}
			return UUID.randomUUID().toString();
		} catch (Exception e) {
			return UUID.randomUUID().toString();
		}
	}

	//****** ↓↓ test 로직 ↓↓ **********************************************************************//
	//test 로직
	@Override
	public void sendStream(SseEmitter emitter) { // sse test
		new Thread(() -> {
			try {
				String[] chunks = {
						"효성그룹은", " 1966년에", " 창립된", " 대한민국의", " 대표적인",
						" 기업집단", " 입니다.", " 주요", " 사업", " 분야로는", " 섬유,"
				};

				String waitString = "답변을 찾는중..."+ " 🧐" + "<div id='chatLoading'></div>";
//                String waitJson = String.format("{\"status\":\"searching\",\"text\":\"%s\"}", waitString);
				Map<String, String> waitMap = new HashMap<>();
				waitMap.put("status", "searching");
				waitMap.put("text", waitString);
				emitter.send(SseEmitter.event()
						.name("message") // optional
						.data(waitMap));    // data: prefix 자동으로 붙음
				Thread.sleep(3000);  // 전송 간격 (0.3초)

				for (String chunk : chunks) {
//                    String json = String.format("{\"status\":\"response_chunk\",\"text\":\"%s\"}", chunk);
					Map<String, String> payload = new HashMap<>();
					payload.put("status", "response_chunk");
					payload.put("text", chunk);
//                    emitter.send(json); // 클라이언트로 데이터 전송
					//Spring의 SseEmitter.send(String)는 자동으로 data: prefix와 개행을 붙여주지 않아 개행추가
					// emitter.send(SseEmitter.event().data(json));
					emitter.send(SseEmitter.event()
							.name("message") // optional
							.data(payload));    // data: prefix 자동으로 붙음
					Thread.sleep(300);  // 전송 간격 (0.3초)
				}

				// 전송 완료 후 close 이벤트
				Map<String, String> endMap = new HashMap<>();
				waitMap.put("status", "completed");
//                emitter.send("{\"status\":\"completed\"}");
				emitter.send(SseEmitter.event()
						.name("message") // optional
						.data(endMap));    // data: prefix 자동으로 붙음
				emitter.complete();

			} catch (Exception e) {
//				log.error("SSE 전송 오류", e);
				emitter.completeWithError(e);
			}
		}).start();
	}


	private String getSourceFilterTest() {
		String input =
				"### 주요 사내 규정 요약\n\n" +
						"**취업규칙**\n" +
						"- 건강진단 및 예방접종 실시, 필요 시 근무 제한, 전환배치, 요양 권유, 사내 보건위생 유지비용 회사 부담\n" +
						"- 포상: 회사 이익 창출, 재난 예방, 혁신 기여, 문제점 발굴 및 개선, 귀감 되는 행동, 회사 명예 향상, 기타 특별 공로 시 포상 가능. 포상 절차와 시기는 별도 규정에 따름\n" +
						"- 징계: 태업, 범법행위, 기밀 누설, 금품 수수, 업무 태만, 무단 이탈 등 다양한 사유 발생 시 징계 조치 가능. 징계 종류 및 방법 규정\n" +
						"[{\"source_type\": \"internal\", \"display_title\": \"취업규칙_취업규칙_2022.01.01\", \"source_title\": \"취업규칙_취업규칙_2022.01.01\", \"url\": \"https://hope2.hyosung.com/WebSite/Basic/Board/BoardView.aspx?system=Board&fdid=12133&MsgId=134303\", \"snippet\": \"건강진단 및 예방접종을 실시한다. 81.2 회사는 건강진단 결과 필요하다고 인정될 경우 사원에 대하여 일정기간 취업의 금지, 전환배치, 근무시간의 단축, 요양의 권유 등 건강유지에 필요한 조치를 취할 수 있다. ...\"}]\n" +
						"**직제 및 업무분장규정**\n"; // JSON 배열이 포함된 문자열
		String returnInput= "" ;

		ObjectMapper mapper = new ObjectMapper();
		ArrayNode filteredArray = mapper.createArrayNode();

		try {
			// JSON 배열 시작 위치 탐색
			int startIndex = input.indexOf("[{");
			int endIndex = input.indexOf("}]", startIndex) + 2;

			if (startIndex != -1 && endIndex != -1) {
				String jsonArrayString = input.substring(startIndex, endIndex);

				// JSON 배열 파싱
				JsonNode arrayNode = mapper.readTree(jsonArrayString);

				if (arrayNode.isArray()) {
					for (JsonNode objNode : arrayNode) {
//						log.info("source_type: " + objNode.get("source_type").asText());
//						log.info("source_title: " + objNode.get("source_title").asText());
//						log.info("display_title: " + objNode.get("display_title").asText());
//						log.info("url: " + objNode.get("url").asText());
//						log.info("snippet: " + objNode.get("snippet").asText().substring(0, 100) + "...");
//						log.info("-----");

						ObjectNode filteredObj = mapper.createObjectNode();
						filteredObj.put("source_type", objNode.get("source_type").asText());
						filteredObj.put("source_title", objNode.get("source_title").asText());
						filteredObj.put("display_title", objNode.get("display_title").asText());
						filteredObj.put("url", objNode.get("url").asText());
						filteredArray.add(filteredObj);
					}
					// 필터링된 JSON 문자열 생성
					String filteredJsonString = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(filteredArray);

					// 원본 문자열에서 기존 JSON 배열을 필터링된 JSON으로 대체
					String updatedInput = input.substring(0, startIndex) + filteredJsonString + input.substring(endIndex);

					return updatedInput;
				}
			} else {
//				System.out.println("JSON 배열을 찾을 수 없습니다.");
				returnInput = input;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return returnInput;
	}


	private String getSorceFilter(String inputData) {
		String input = inputData; // JSON 배열이 포함된 문자열
		String returnInput= "" ;

		ObjectMapper mapper = new ObjectMapper();
		ArrayNode filteredArray = mapper.createArrayNode();

		try {
			// JSON 배열 시작 위치 탐색
			int startIndex = input.indexOf("[{");
			int endIndex = input.indexOf("}]", startIndex) + 2;

			if (startIndex != -1 && endIndex != -1) {
				String jsonArrayString = input.substring(startIndex, endIndex);
				// 작은따옴표 → 큰따옴표 (JSON 표준화)
//				jsonArrayString = jsonArrayString.replace("'", "\""); // 뤼튼 처리후 로직 숨김 20251123

				// JSON 배열 파싱
				JsonNode arrayNode = mapper.readTree(jsonArrayString);

				if (arrayNode.isArray()) {
					for (JsonNode objNode : arrayNode) {
//						log.info("source_type: " + objNode.get("source_type").asText());
//						log.info("source_title: " + objNode.get("source_title").asText());
//						log.info("display_title: " + objNode.get("display_title").asText());
//						log.info("url: " + objNode.get("url").asText());
//						log.info("snippet: " + objNode.get("snippet").asText().substring(0, 100) + "...");
//						log.info("-----");

						ObjectNode filteredObj = mapper.createObjectNode();
						filteredObj.put("source_type", objNode.get("source_type").asText());
						filteredObj.put("source_title", objNode.get("source_title").asText());
						filteredObj.put("display_title", objNode.get("display_title").asText());
						filteredObj.put("url", objNode.get("url").asText());
						filteredArray.add(filteredObj);
					}
					// 필터링된 JSON 문자열 생성
//					String filteredJsonString = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(filteredArray);
					String filteredJsonString = mapper.writeValueAsString(filteredArray);
//					log.info(filteredJsonString);

					// 원본 문자열에서 기존 JSON 배열을 필터링된 JSON으로 대체
					String updatedInput = input.substring(0, startIndex) + filteredJsonString + input.substring(endIndex);

					return updatedInput;
				}
			} else {
//				System.out.println("JSON 배열을 찾을 수 없습니다.");
				returnInput = input;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return returnInput;
	}

}