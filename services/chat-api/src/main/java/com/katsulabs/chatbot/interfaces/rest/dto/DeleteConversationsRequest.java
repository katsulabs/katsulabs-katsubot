package com.katsulabs.chatbot.interfaces.rest.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record DeleteConversationsRequest(
        @NotEmpty(message = "conversation_ids는 필수입니다")
        List<String> conversation_ids
) {}
