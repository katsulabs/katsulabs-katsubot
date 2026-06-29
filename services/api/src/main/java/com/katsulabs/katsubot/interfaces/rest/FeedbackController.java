package com.katsulabs.katsubot.interfaces.rest;

import com.katsulabs.katsubot.application.DeleteFeedbackUseCase;
import com.katsulabs.katsubot.application.UpsertFeedbackUseCase;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import com.katsulabs.katsubot.interfaces.rest.dto.FeedbackResponse;
import com.katsulabs.katsubot.interfaces.rest.dto.UpsertFeedbackRequest;
import com.katsulabs.katsubot.interfaces.rest.mapper.FeedbackResponseMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "feedback")
@RestController
@RequestMapping("/api/v1/conversations/{conversationId}/messages/{messageId}/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final UpsertFeedbackUseCase upsertFeedbackUseCase;
    private final DeleteFeedbackUseCase deleteFeedbackUseCase;

    @Operation(summary = "메시지 피드백 저장·수정")
    @PutMapping
    public FeedbackResponse upsert(
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @Valid @RequestBody UpsertFeedbackRequest request,
            HttpServletRequest httpRequest
    ) {
        return FeedbackResponseMapper.toResponse(upsertFeedbackUseCase.upsert(
                AuthContext.userId(httpRequest),
                conversationId,
                messageId,
                request.feedback_type()
        ));
    }

    @Operation(summary = "메시지 피드백 취소")
    @DeleteMapping("/{feedbackId}")
    public FeedbackResponse delete(
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @PathVariable String feedbackId,
            HttpServletRequest httpRequest
    ) {
        return FeedbackResponseMapper.toResponse(
                deleteFeedbackUseCase.delete(AuthContext.userId(httpRequest), conversationId, messageId, feedbackId));
    }
}
