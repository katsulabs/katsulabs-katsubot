package com.katsulabs.chatbot.interfaces.rest.dto;

import java.time.Instant;

public record ConversationResponse(
        String id,
        String title,
        Instant created_at
) {
}
