package com.katsulabs.chatbot.interfaces.rest;

import com.katsulabs.chatbot.application.CreateConversationUseCase;
import com.katsulabs.chatbot.domain.model.Conversation;
import com.katsulabs.chatbot.infrastructure.auth.AuthContext;
import com.katsulabs.chatbot.interfaces.rest.dto.ConversationResponse;
import com.katsulabs.chatbot.interfaces.rest.dto.CreateConversationRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
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

    public ConversationController(CreateConversationUseCase createConversationUseCase) {
        this.createConversationUseCase = createConversationUseCase;
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

    private static String userId(HttpServletRequest request) {
        return (String) request.getAttribute(AuthContext.USER_ID_ATTRIBUTE);
    }

    private static ConversationResponse toResponse(Conversation conversation) {
        return new ConversationResponse(conversation.id(), conversation.title(), conversation.createdAt());
    }
}
