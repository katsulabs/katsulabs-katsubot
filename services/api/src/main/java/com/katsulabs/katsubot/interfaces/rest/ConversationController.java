package com.katsulabs.katsubot.interfaces.rest;

import com.katsulabs.katsubot.application.CreateConversationUseCase;
import com.katsulabs.katsubot.application.DeleteConversationsUseCase;
import com.katsulabs.katsubot.application.ListConversationsUseCase;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import com.katsulabs.katsubot.interfaces.rest.dto.ConversationResponse;
import com.katsulabs.katsubot.interfaces.rest.dto.CreateConversationRequest;
import com.katsulabs.katsubot.interfaces.rest.dto.DeleteConversationsRequest;
import com.katsulabs.katsubot.interfaces.rest.dto.DeleteConversationsResponse;
import com.katsulabs.katsubot.interfaces.rest.mapper.ConversationResponseMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "conversations")
@RestController
@RequestMapping("/api/v1/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final CreateConversationUseCase createConversationUseCase;
    private final ListConversationsUseCase listConversationsUseCase;
    private final DeleteConversationsUseCase deleteConversationsUseCase;

    @Operation(summary = "새 대화 생성")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConversationResponse create(@RequestBody(required = false) CreateConversationRequest request, HttpServletRequest httpRequest) {
        String title = request == null ? null : request.title();
        return ConversationResponseMapper.toResponse(
                createConversationUseCase.create(AuthContext.userId(httpRequest), title));
    }

    @Operation(summary = "내 대화 목록")
    @GetMapping
    public List<ConversationResponse> list(HttpServletRequest httpRequest) {
        return listConversationsUseCase.listForUser(AuthContext.userId(httpRequest)).stream()
                .map(ConversationResponseMapper::toResponse)
                .toList();
    }

    @Operation(summary = "대화 일괄 삭제")
    @DeleteMapping
    public DeleteConversationsResponse delete(
            @Valid @RequestBody DeleteConversationsRequest request,
            HttpServletRequest httpRequest
    ) {
        var result = deleteConversationsUseCase.delete(AuthContext.userId(httpRequest), request.conversation_ids());
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
}
