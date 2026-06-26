package com.katsulabs.katsubot.interfaces.rest;

import com.katsulabs.katsubot.application.DeleteFeedbackUseCase;
import com.katsulabs.katsubot.application.UpsertFeedbackUseCase;
import com.katsulabs.katsubot.domain.model.MessageFeedback;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import com.katsulabs.katsubot.interfaces.rest.dto.FeedbackResponse;
import com.katsulabs.katsubot.interfaces.rest.dto.UpsertFeedbackRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/conversations/{conversationId}/messages/{messageId}/feedback")
public class FeedbackController {

    private final UpsertFeedbackUseCase upsertFeedbackUseCase;
    private final DeleteFeedbackUseCase deleteFeedbackUseCase;

    public FeedbackController(
            UpsertFeedbackUseCase upsertFeedbackUseCase,
            DeleteFeedbackUseCase deleteFeedbackUseCase
    ) {
        this.upsertFeedbackUseCase = upsertFeedbackUseCase;
        this.deleteFeedbackUseCase = deleteFeedbackUseCase;
    }

    @PutMapping
    public FeedbackResponse upsert(
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @Valid @RequestBody UpsertFeedbackRequest request,
            HttpServletRequest httpRequest
    ) {
        String userId = (String) httpRequest.getAttribute(AuthContext.USER_ID_ATTRIBUTE);
        return toResponse(upsertFeedbackUseCase.upsert(
                userId,
                conversationId,
                messageId,
                request.feedback_type()
        ));
    }

    @DeleteMapping("/{feedbackId}")
    public FeedbackResponse delete(
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @PathVariable String feedbackId,
            HttpServletRequest httpRequest
    ) {
        String userId = (String) httpRequest.getAttribute(AuthContext.USER_ID_ATTRIBUTE);
        return toResponse(deleteFeedbackUseCase.delete(userId, conversationId, messageId, feedbackId));
    }

    private static FeedbackResponse toResponse(MessageFeedback feedback) {
        return new FeedbackResponse(feedback.id(), feedback.messageId(), feedback.feedbackType());
    }
}
