package com.katsulabs.katsubot.interfaces.rest;

import com.katsulabs.katsubot.application.ListMessagesUseCase;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import com.katsulabs.katsubot.interfaces.rest.dto.MessagesPageResponse;
import com.katsulabs.katsubot.interfaces.rest.dto.SendMessageRequest;
import com.katsulabs.katsubot.interfaces.rest.mapper.MessageResponseMapper;
import com.katsulabs.katsubot.interfaces.rest.sse.MessageSseStreamer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Tag(name = "messages")
@RestController
@RequestMapping("/api/v1/conversations/{conversationId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final ListMessagesUseCase listMessagesUseCase;
    private final MessageSseStreamer messageSseStreamer;

    @Operation(summary = "대화 메시지 히스토리")
    @GetMapping
    public MessagesPageResponse listMessages(
            @PathVariable String conversationId,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest
    ) {
        var page = listMessagesUseCase.list(AuthContext.userId(httpRequest), conversationId, cursor, size);
        return new MessagesPageResponse(
                page.messages().stream().map(MessageResponseMapper::toResponse).toList(),
                page.hasMore(),
                page.nextCursor()
        );
    }

    @Operation(summary = "메시지 전송 (SSE 스트림)")
    @PostMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter sendMessage(
            @PathVariable String conversationId,
            @Valid @RequestBody SendMessageRequest request,
            HttpServletRequest httpRequest
    ) {
        return messageSseStreamer.streamReply(
                AuthContext.userId(httpRequest),
                conversationId,
                request.content()
        );
    }
}
