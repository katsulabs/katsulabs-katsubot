package com.katsulabs.katsubot.interfaces.rest.sse;

import com.katsulabs.katsubot.application.ConversationNotFoundException;
import com.katsulabs.katsubot.application.SendMessageUseCase;
import com.katsulabs.katsubot.domain.model.RagStreamChunk;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.function.Consumer;

@Component
@RequiredArgsConstructor
public class MessageSseStreamer {

    private static final long SSE_TIMEOUT_MS = 60_000L;

    private final SendMessageUseCase sendMessageUseCase;
    @Qualifier("sseExecutor")
    private final Executor sseExecutor;

    public SseEmitter streamReply(String userId, String conversationId, String content) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT_MS);

        sseExecutor.execute(() -> {
            try {
                var result = sendMessageUseCase.streamReply(userId, conversationId, content, deltaChunkHandler(emitter));

                emitter.send(SseEmitter.event()
                        .name("done")
                        .data(Map.of(
                                "conversation_id", conversationId,
                                "message_id", result.assistantMessageId()
                        )));
                emitter.complete();
            } catch (ConversationNotFoundException ex) {
                sendErrorEvent(emitter, "NOT_FOUND", ex.getMessage());
                emitter.completeWithError(ex);
            } catch (Exception ex) {
                sendErrorEvent(emitter, "STREAM_ERROR", ex.getMessage() != null ? ex.getMessage() : "메시지 스트리밍에 실패했습니다.");
                emitter.completeWithError(ex);
            }
        });

        return emitter;
    }

    private static Consumer<RagStreamChunk> deltaChunkHandler(SseEmitter emitter) {
        return chunk -> {
            try {
                if (chunk.delta() != null) {
                    emitter.send(SseEmitter.event()
                            .name("delta")
                            .data(Map.of("delta", chunk.delta())));
                }
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        };
    }

    private static void sendErrorEvent(SseEmitter emitter, String code, String message) {
        try {
            emitter.send(SseEmitter.event()
                    .name("error")
                    .data(Map.of("code", code, "message", message)));
        } catch (IOException ignored) {
            // ignore
        }
    }
}
