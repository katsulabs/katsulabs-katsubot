package xs.aichat.v2.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

import org.springframework.web.multipart.MultipartFile;
import xs.aichat.v2.annotation.LoggedInUser;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.dto.internal.request.*;
import xs.aichat.v2.dto.internal.request.MessageRequest;
import xs.aichat.v2.dto.internal.response.*;
import xs.aichat.v2.service.ChatFileService;
import xs.aichat.v2.dto.wrapper.ApiResponse;
import xs.aichat.v2.dto.wrapper.JsonDataWrapper;
import org.springframework.util.StringUtils;
import xs.aichat.v2.exception.HyobeeException;
import xs.aichat.v2.service.ChatService;
import xs.aichat.v2.service.ChatSessionService;
import xs.aichat.v2.util.JwtSessionHelper;

import javax.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import java.util.Collections;
import java.util.Map;

@Slf4j
@Validated
@CrossOrigin(
        origins = {
                "http://itxvob.hyosung.com:8080",
                "https://c-cubedev.hyosung.com",
                "https://ax-api-gateway.wrtn.ai/hyosung-groupware-chatbot",
                "https://ax-api-gateway.wrtn.ai/hsgc-demo"
        },
        allowCredentials = "true"
)  // 또는 특정 도메인
@RestController
@RequestMapping("/xs/aichat/v2")
@RequiredArgsConstructor
public class HyobeeChatController {

	private final ChatService chatService;

    private final ChatFileService chatFileService;

    private final ChatSessionService chatSessionService;

    //****** 뤼튼 연동 AI 챗봇 ************************************************************************//

	/**
	 * 벤더 상태 확인 API 엔드포인트
	 * - GET /xs/aichat/healthCheck.json
	 * - 외부 챗봇 벤더(Wrtn 등)의 서비스 상태 확인
	 * @return ResponseEntity<Map<String, Object>> 벤더 상태 정보
	 */
    @GetMapping(value = "/healthCheck.json")
	public ResponseEntity<Map<String, Object>> healthCheck() {
		return chatService.healthCheck();
	}

    // 대화 목록 전체 조회 API 엔드포인트
	/*@GetMapping(value = "/conversations")
	public ConversationsResponse selectConversations(
            @RequestParam("user_id") String userId,
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "20") int size
    ) {
        return chatService.selectConversations(ConversationRequest.of(userId, page, size));
	}*/
    @GetMapping(value = "/conversations")
    public ConversationsResponse selectConversations(
            @LoggedInUser User user,
            HttpSession session,
            @Valid ConversationRequest request
    ) {
        if (!user.getUserId().equals(request.getUserId())) {
            throw new HyobeeException(
                    HttpStatus.FORBIDDEN.toString(),
                    "요청 사용자와 세션 사용자가 일치하지 않습니다."
            );
        }
        var loginDeptCode = JwtSessionHelper.resolveLoginTeamCode(session);
        if (!StringUtils.hasText(loginDeptCode)) {
            loginDeptCode = user.getTeamCode();
        }
        var loginDeptName = JwtSessionHelper.resolveLoginDeptName(session);
        if (!StringUtils.hasText(loginDeptName)) {
            loginDeptName = user.getTeamName();
        }
        return chatService.selectConversations(
                request,
                loginDeptCode,
                loginDeptName,
                JwtSessionHelper.resolveLanguageCode(session)
        );
    }

    @GetMapping("/messages")
    public JsonDataWrapper<ApiResponse<MessageItem>> selectMessages(@Valid MessageRequest request) {
        return chatService.selectMessages(request);
    }

    @PostMapping(value = "/conversation")
    public CreateConversationResponse createConversation(
            @LoggedInUser User user,
            HttpSession session,
            @RequestBody @Valid CreateConversationRequest request
    ) {
        return chatService.createConversation(request, user, session);
    }

    @DeleteMapping(value = "/conversations")
    public DeleteConversationsResponse deleteConversations(
            @LoggedInUser User user,
            @RequestBody @Valid DeleteConversationRequest request
    ) {
        return chatService.deleteConversations(request, user);
    }

    // 접근 가능한 게시판 목록 조회
    @GetMapping(value = "/board-auth")
    public BoardAuthResponse selectDataBoardsAuth(BoardAuthRequest request) {
        return chatService.selectDataBoardsAuth(request);
    }

    /** WRTN JWT claim용 teamCode만 갱신 (프로필 DEPT_CODE는 유지) */
    @PutMapping(value = "/session/jwt-team-code")
    public void updateJwtTeamCode(
            @LoggedInUser User user,
            @Valid @RequestBody UpdateSessionDeptRequest request,
            HttpSession session
    ) {
        chatSessionService.updateJwtTeamCode(user, request.getCode(), session);
    }

    //******  뤼튼 연동 AI 챗봇 ***********************************************************************//

    /**
     * 단일 파일 업로드 API 엔드포인트
     * - Content-Type: multipart/form-data
     * - 파일을 로컬 저장소에 업로드하고, 이미지인 경우 썸네일 생성
     * @param file 업로드할 파일 (MultipartFile)
     * @return 업로드 결과 (fileUrl, thumbnailUrl, folderUuid 등 포함)
     */
    @PostMapping(value = "/uploadFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadFileItem uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        // multipart 요청에서 XtrmArgumentResolveMap#getParams()는 Gson JsonObject 등을 포함해
        // JacksonJsonAdapter#toMap 변환 시 실패할 수 있음. 업로드 서비스는 params 미사용이므로 빈 맵 전달.
        return chatFileService.uploadFile(file, Collections.emptyMap());
    }

    /**
     * 여러 파일 일괄 업로드 API 엔드포인트
     * - Content-Type: multipart/form-data
     * - 여러 파일을 한 번에 업로드 (각 파일별로 개별 처리)
     * - 성공/실패 개수를 집계하여 반환
     * @param files 업로드할 파일 배열 (MultipartFile[])
     * @return 업로드 결과 (totalCount, successCount, failCount, fileInfo 배열 등)
     */
    @PostMapping(value = "/uploadFiles", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadFilesResponse uploadFiles(@RequestParam("files") MultipartFile[] files) throws Exception {
        return chatFileService.uploadFiles(files, Collections.emptyMap());
    }

    /**
     * HiCloud 파일 다운로드 API 엔드포인트
     * - HiCloud에서 파일을 다운로드하여 로컬 저장소에 저장
     * - 이미지 파일인 경우 썸네일 자동 생성
     * @param request 요청 바디 (hiCloudFileInfos: JSON 배열 형태의 파일 정보)
     * @return 다운로드 결과 (totalCount, successCount, failedCount 등)
     */
    @PostMapping(value = "/cloudAttach", produces = MediaType.APPLICATION_JSON_VALUE)
    public Object cloudAttach(@RequestBody HiCloudAttachRequest request) throws Exception {
        var params = Collections.singletonMap(
                "hiCloudFileInfos",
                request != null ? request.getHiCloudFileInfos() : Collections.emptyList()
        );
        return chatFileService.downloadHiCloudFiles(params);
    }

    //******  피드백 ***********************************************************************//
    /**
     * 피드백 저장/수정 (신규 DTO 기반 엔드포인트)
     * 응답은 XtrmResponse(HEADER/DATA)로 AOP에서 래핑됨
     */
    @PutMapping("/conversations/{conversationId}/messages/{messageId}/feedback")
    public FeedbackResponse feedback(
            @PathVariable @NotBlank(message = "대화방 아이디는 필수 값입니다.") String conversationId,
            @PathVariable @NotBlank(message = "메시지 아이디는 필수 값입니다.") String messageId,
            @RequestParam("user_id") @NotBlank(message = "사용자 아이디는 필수입니다") String userId,
            @RequestBody FeedbackRequest request) {
        return chatService.feedback(conversationId, messageId, userId, request);
    }

    /**
     * 피드백 취소 흐름.
     * 1. 사용자가 이미 선택된 좋아요/싫어요 버튼 다시 클릭
     * 2. /feedback/{feedback_id} API 호출
     * 3. 피드백 데이터 논리 삭제
     * /api/v1/conversations/{conversation_id}/messages/{message_id}/feedback/{feedback_id}

     * 피드백 취소 (신규 DTO 기반 엔드포인트)
     * 응답은 XtrmResponse(HEADER/DATA)로 AOP에서 래핑됨
     */
    @DeleteMapping("/conversations/{conversationId}/messages/{messageId}/feedback/{feedbackId}")
    public FeedbackResponse deleteFeedback(
            @PathVariable @NotBlank(message = "대화방 아이디는 필수 값입니다.") String conversationId,
            @PathVariable @NotBlank(message = "메시지 아이디는 필수 값입니다.") String messageId,
            @PathVariable @NotBlank(message = "피드백 아이디는 필수입니다.") String feedbackId,
            @RequestParam("user_id") @NotBlank(message = "사용자 아이디는 필수입니다") String userId) {
        return chatService.deleteFeedback(conversationId, messageId, userId, feedbackId);
    }
}
