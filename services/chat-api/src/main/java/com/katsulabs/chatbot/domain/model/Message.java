package com.katsulabs.chatbot.domain.model;

import java.time.Instant;
import java.util.UUID;

public record Message(
        String id,
        String conversationId,
        MessageRole role,
        String content,
        Instant createdAt
) {
    public static Message userMessage(String conversationId, String content) {
        return new Message(
                UUID.randomUUID().toString(),
                conversationId,
                MessageRole.USER,
                content,
                Instant.now()
        );
    }

    public static Message assistantMessage(String conversationId, String content) {
        return new Message(
                UUID.randomUUID().toString(),
                conversationId,
                MessageRole.ASSISTANT,
                content,
                Instant.now()
        );
    }
}
