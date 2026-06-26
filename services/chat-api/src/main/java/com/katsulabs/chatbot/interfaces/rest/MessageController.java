package com.katsulabs.chatbot.interfaces.rest;

import com.katsulabs.chatbot.application.ConversationNotFoundException;
import com.katsulabs.chatbot.application.ListMessagesUseCase;
import com.katsulabs.chatbot.application.SendMessageUseCase;
import com.katsulabs.chatbot.infrastructure.auth.AuthContext;
import com.katsulabs.chatbot.interfaces.rest.dto.MessageResponse;
import com.katsulabs.chatbot.interfaces.rest.dto.MessagesPageResponse;
import com.katsulabs.chatbot.interfaces.rest.dto.SendMessageRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.Executor;

@RestController
@RequestMapping("/api/v1/conversations/{conversationId}/messages")
public class MessageController {

    private final SendMessageUseCase sendMessageUseCase;
    private final ListMessagesUseCase listMessagesUseCase;
    private final Executor sseExecutor;

    public MessageController(
            SendMessageUseCase sendMessageUseCase,
            ListMessagesUseCase listMessagesUseCase,
            @Qualifier("sseExecutor") Executor sseExecutor
    ) {
        this.sendMessageUseCase = sendMessageUseCase;
        this.listMessagesUseCase = listMessagesUseCase;
        this.sseExecutor = sseExecutor;
    }

    @GetMapping
    public MessagesPageResponse listMessages(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "0") int cursor,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest
    ) {
        String userId = (String) httpRequest.getAttribute(AuthContext.USER_ID_ATTRIBUTE);
        var page = listMessagesUseCase.list(userId, conversationId, cursor, size);
        return new MessagesPageResponse(
                page.messages().stream().map(MessageController::toResponse).toList(),
                page.hasMore(),
                page.nextCursor()
        );
    }

    @PostMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter sendMessage(
            @PathVariable String conversationId,
            @Valid @RequestBody SendMessageRequest request,
            HttpServletRequest httpRequest
    ) {
        String userId = (String) httpRequest.getAttribute(AuthContext.USER_ID_ATTRIBUTE);
        SseEmitter emitter = new SseEmitter(60_000L);

        sseExecutor.execute(() -> {
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
            } catch (ConversationNotFoundException ex) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("error")
                            .data(Map.of("code", "NOT_FOUND", "message", ex.getMessage())));
                } catch (IOException ignored) {
                    // ignore
                }
                emitter.completeWithError(ex);
            } catch (Exception ex) {
                emitter.completeWithError(ex);
            }
        });

        return emitter;
    }

    private static MessageResponse toResponse(ListMessagesUseCase.MessageView view) {
        MessageResponse.MessageFeedbackSummaryResponse feedback = null;
        if (view.feedback() != null) {
            feedback = new MessageResponse.MessageFeedbackSummaryResponse(
                    view.feedback().feedbackId(),
                    view.feedback().feedbackType()
            );
        }
        return new MessageResponse(view.id(), view.role(), view.content(), view.createdAt(), feedback);
    }
}
