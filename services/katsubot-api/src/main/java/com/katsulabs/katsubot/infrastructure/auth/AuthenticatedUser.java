package com.katsulabs.katsubot.infrastructure.auth;

public record AuthenticatedUser(
        String userId,
        String corpCode,
        String teamCode
) {
}
