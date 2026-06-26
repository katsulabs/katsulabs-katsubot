package com.katsulabs.chatbot.interfaces.rest.dto;

public record MessageResponse(
        String id,
        String role,
        String content,
        String created_at,
        MessageFeedbackSummaryResponse feedback
) {
    public record MessageFeedbackSummaryResponse(String feedback_id, String feedback_type) {}
}
