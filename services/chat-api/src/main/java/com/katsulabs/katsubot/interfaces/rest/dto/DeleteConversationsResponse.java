package com.katsulabs.katsubot.interfaces.rest.dto;

import java.util.List;

public record DeleteConversationsResponse(
        int deleted_count,
        List<DeleteConversationResult> results
) {
    public record DeleteConversationResult(String conversation_id, boolean deleted, String error) {}
}
