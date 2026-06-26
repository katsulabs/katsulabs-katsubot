package com.katsulabs.katsubot.interfaces.rest;

import com.katsulabs.katsubot.application.CreateConversationUseCase;
import com.katsulabs.katsubot.application.DeleteConversationsUseCase;
import com.katsulabs.katsubot.domain.model.Conversation;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import com.katsulabs.katsubot.interfaces.rest.dto.ConversationResponse;
import com.katsulabs.katsubot.interfaces.rest.dto.CreateConversationRequest;
import com.katsulabs.katsubot.interfaces.rest.dto.DeleteConversationsRequest;
import com.katsulabs.katsubot.interfaces.rest.dto.DeleteConversationsResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/conversations")
public class ConversationController {

    private final CreateConversationUseCase createConversationUseCase;
    private final DeleteConversationsUseCase deleteConversationsUseCase;

    public ConversationController(
            CreateConversationUseCase createConversationUseCase,
            DeleteConversationsUseCase deleteConversationsUseCase
    ) {
        this.createConversationUseCase = createConversationUseCase;
        this.deleteConversationsUseCase = deleteConversationsUseCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConversationResponse create(@RequestBody(required = false) CreateConversationRequest request, HttpServletRequest httpRequest) {
        String userId = userId(httpRequest);
        String title = request == null ? null : request.title();
        return toResponse(createConversationUseCase.create(userId, title));
    }

    @GetMapping
    public List<ConversationResponse> list(HttpServletRequest httpRequest) {
        String userId = userId(httpRequest);
        return createConversationUseCase.listForUser(userId).stream()
                .map(ConversationController::toResponse)
                .toList();
    }

    @DeleteMapping
    public DeleteConversationsResponse delete(
            @Valid @RequestBody DeleteConversationsRequest request,
            HttpServletRequest httpRequest
    ) {
        var result = deleteConversationsUseCase.delete(userId(httpRequest), request.conversation_ids());
        return new DeleteConversationsResponse(
                result.deletedCount(),
                result.results().stream()
                        .map(item -> new DeleteConversationsResponse.DeleteConversationResult(
                                item.conversationId(),
                                item.deleted(),
                                item.error()
                        ))
                        .toList()
        );
    }

    private static String userId(HttpServletRequest request) {
        return (String) request.getAttribute(AuthContext.USER_ID_ATTRIBUTE);
    }

    private static ConversationResponse toResponse(Conversation conversation) {
        return new ConversationResponse(conversation.id(), conversation.title(), conversation.createdAt());
    }
}
