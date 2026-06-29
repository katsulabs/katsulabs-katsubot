package com.katsulabs.katsubot.infrastructure.persistence;

import com.katsulabs.katsubot.domain.model.MessageFeedback;
import com.katsulabs.katsubot.infrastructure.persistence.entity.MessageFeedbackEntity;
import lombok.experimental.UtilityClass;

import java.util.UUID;

@UtilityClass
final class FeedbackPersistenceMapper {

    static MessageFeedbackEntity toEntity(MessageFeedback feedback) {
        return new MessageFeedbackEntity(
                UUID.fromString(feedback.id()),
                UUID.fromString(feedback.messageId()),
                UUID.fromString(feedback.conversationId()),
                feedback.userId(),
                feedback.feedbackType(),
                feedback.createdAt(),
                feedback.deleted()
        );
    }

    static MessageFeedback toDomain(MessageFeedbackEntity entity) {
        return new MessageFeedback(
                entity.getId().toString(),
                entity.getMessageId().toString(),
                entity.getConversationId().toString(),
                entity.getUserId(),
                entity.getFeedbackType(),
                entity.getCreatedAt(),
                entity.isDeleted()
        );
    }
}
