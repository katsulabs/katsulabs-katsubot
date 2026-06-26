package xs.aichat.v2.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import xs.aichat.v2.dto.ConversationParamStoreV2;
import xs.aichat.v2.dto.internal.request.*;
import xs.aichat.v2.dto.internal.response.*;
import xs.aichat.v2.service.ChatStreamService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
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
@RequestMapping("/xs/aichat/v2/stream")
public class HyobeeStreamController {

    private final ConversationParamStoreV2 conversationParamStoreV2;

	private final ChatStreamService chatStreamService;

    public HyobeeStreamController(@Qualifier("conversationParamStoreV2") ConversationParamStoreV2 conversationParamStoreV2,
                                  ChatStreamService chatStreamService) {
        this.conversationParamStoreV2 = conversationParamStoreV2;
        this.chatStreamService = chatStreamService;
    }

    //****** 뤼튼 연동 AI 챗봇 ************************************************************************//

    /**
     * SSE 테스트 스트림 API 엔드포인트
     * - SSE(Server-Sent Events) 기능 테스트를 위한 샘플 스트림 전송
     * - Content-Type: text/event-stream
     */
    @GetMapping(value = "/chat.stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@RequestParam(required = false) String params, HttpServletResponse response) {
        // SSE 스트림을 위한 HTTP 헤더 설정
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no"); // Nginx 버퍼링 비활성화
        response.setHeader("Content-Encoding", "none"); // gzip 비활성화

        // SseEmitter 객체 생성 (무제한 연결 허용)
        var emitter = new SseEmitter(0L);
        chatStreamService.sendStream(emitter);
        return emitter;
    }

    /**
     * 실시간 채팅 스트림 API 엔드포인트
     * - SSE를 통한 실시간 AI 챗봇 응답 스트리밍
     * - Content-Type: text/event-stream
     */
    // params 먼저 수신해서 저장하고
    @PostMapping(value = "/sendMessageParam")
    public SendMessageResponse sendMessageParam(
            @RequestBody(required = false) SendMessageRequest request,
            HttpServletRequest httpRequest) {
        SendMessageRequest toStore = request;
        if (toStore == null) {
            // fallback: jsonData/body 형식이 아닐 때 파라미터로부터 DTO 생성 (xui.ajax 호환)
            toStore = new SendMessageRequest();
            toStore.setConversationId(httpRequest.getParameter("conversation_id"));
            toStore.setUserId(httpRequest.getParameter("user_id"));
            toStore.setMessage(httpRequest.getParameter("message"));
            toStore.setChatCategory(httpRequest.getParameter("chat_category"));
            toStore.setFiles(httpRequest.getParameter("files"));
        }
        var conversationId = toStore.getConversationId();
        if (conversationId == null || conversationId.isEmpty()) {
            log.warn("sendMessageParam: conversation_id 없음");
            return SendMessageResponse.of("ERROR");
        }
        if (conversationParamStoreV2.containsKey(conversationId)) {
            log.warn("⚠️ 기존 params 덮어씀 (conversationId={})", conversationId);
        }
        conversationParamStoreV2.put(conversationId, toStore);
        return SendMessageResponse.of("OK");
    }

    // SSE 스트림 시작
    @GetMapping(value = "/message", produces = MediaType.TEXT_EVENT_STREAM_VALUE) // 기본적으로 UTF-8, https://html.spec.whatwg.org/multipage/iana.html#text/event-stream
    public SseEmitter startMessageStream(@RequestParam("conversation_id") String conversationId, HttpServletResponse response) throws Exception {
        // SSE 스트림을 위한 HTTP 헤더 설정
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("X-Accel-Buffering", "no"); // Nginx 버퍼링 비활성화
        response.setHeader("Content-Encoding", "none"); // gzip 비활성화

        // 타임아웃 없음
        var emitter = new SseEmitter(0L);
        chatStreamService.startMessageStream(emitter, conversationId);

        return emitter;
    }

    /**
     * 스트림 중지 요청 API 엔드포인트
     * - POST /xs/aichat/stopStream.stream
     * - 사용자가 "중지" 버튼을 클릭한 경우 호출
     * - 내부 리소스 정리 및 벤더 API에 중단 요청 전송
     */
    @PostMapping("/interrupt")
    public StopMessageResponse interrupt(@RequestBody StopMessageRequest request) throws Exception {
        return chatStreamService.stopStream(request);
    }
}
