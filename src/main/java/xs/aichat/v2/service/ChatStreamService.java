package xs.aichat.v2.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import xs.aichat.v2.dto.internal.request.*;
import xs.aichat.v2.dto.internal.response.*;

public interface ChatStreamService {
    //****** 뤼튼 연동 AI 챗봇 SSE 전송 ***************************************************************//
    //SSE test
    void sendStream(SseEmitter emitter);

    // SSE 시작
    void startMessageStream(SseEmitter emitter, String conversationId) throws Exception;

    // SSE 중지
    StopMessageResponse stopStream(StopMessageRequest request) throws Exception;
}
