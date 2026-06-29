package com.katsulabs.katsubot.interfaces.rest.mapper;

import com.katsulabs.katsubot.domain.model.MessageFeedback;
import com.katsulabs.katsubot.interfaces.rest.dto.FeedbackResponse;

public final class FeedbackResponseMapper {

    private FeedbackResponseMapper() {
    }

    public static FeedbackResponse toResponse(MessageFeedback feedback) {
        return new FeedbackResponse(feedback.id(), feedback.messageId(), feedback.feedbackType());
    }
}
