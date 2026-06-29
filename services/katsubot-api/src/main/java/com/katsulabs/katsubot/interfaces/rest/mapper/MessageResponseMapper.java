package com.katsulabs.katsubot.interfaces.rest.mapper;

import com.katsulabs.katsubot.application.ListMessagesUseCase;
import com.katsulabs.katsubot.interfaces.rest.dto.MessageResponse;

public final class MessageResponseMapper {

    private MessageResponseMapper() {
    }

    public static MessageResponse toResponse(ListMessagesUseCase.MessageView view) {
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
