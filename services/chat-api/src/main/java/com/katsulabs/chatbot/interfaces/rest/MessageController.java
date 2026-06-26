package com.katsulabs.chatbot.interfaces.rest;

import com.katsulabs.chatbot.application.SendMessageUseCase;
import com.katsulabs.chatbot.infrastructure.auth.AuthContext;
import com.katsulabs.chatbot.interfaces.rest.dto.SendMessageRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/conversations/{conversationId}/messages")
public class MessageController {

    private final SendMessageUseCase sendMessageUseCase;

    public MessageController(SendMessageUseCase sendMessageUseCase) {
        this.sendMessageUseCase = sendMessageUseCase;
    }

    @PostMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter sendMessage(
            @PathVariable String conversationId,
            @RequestBody SendMessageRequest request,
            HttpServletRequest httpRequest
    ) {
        String userId = (String) httpRequest.getAttribute(AuthContext.USER_ID_ATTRIBUTE);
        SseEmitter emitter = new SseEmitter(60_000L);

        try {
            var result = sendMessageUseCase.streamReply(userId, conversationId, request.content(), chunk -> {
                try {
                    if (chunk.delta() != null) {
                        emitter.send(SseEmitter.event()
                                .name("delta")
                                .data(Map.of("delta", chunk.delta())));
                    }
                } catch (IOException e) {
                    emitter.completeWithError(e);
                }
            });

            emitter.send(SseEmitter.event()
                    .name("done")
                    .data(Map.of(
                            "conversation_id", conversationId,
                            "message_id", result.assistantMessageId()
                    )));
            emitter.complete();
        } catch (Exception ex) {
            emitter.completeWithError(ex);
        }

        return emitter;
    }
}
