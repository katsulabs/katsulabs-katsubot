package com.katsulabs.katsubot.domain.model;

import java.time.Instant;
import java.util.UUID;

public record MessageFeedback(
        String id,
        String messageId,
        String conversationId,
        String userId,
        String feedbackType,
        Instant createdAt,
        boolean deleted
) {
    public static MessageFeedback create(
            String messageId,
            String conversationId,
            String userId,
            String feedbackType
    ) {
        return new MessageFeedback(
                UUID.randomUUID().toString(),
                messageId,
                conversationId,
                userId,
                feedbackType,
                Instant.now(),
                false
        );
    }

    public MessageFeedback withFeedbackType(String feedbackType) {
        return new MessageFeedback(id, messageId, conversationId, userId, feedbackType, createdAt, deleted);
    }

    public MessageFeedback markDeleted() {
        return new MessageFeedback(id, messageId, conversationId, userId, feedbackType, createdAt, true);
    }
}
