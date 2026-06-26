package com.katsulabs.chatbot.infrastructure.auth;

public record AuthenticatedUser(
        String userId,
        String corpCode,
        String teamCode
) {
}
