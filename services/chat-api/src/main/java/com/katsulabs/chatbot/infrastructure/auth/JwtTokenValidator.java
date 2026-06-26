package com.katsulabs.chatbot.infrastructure.auth;

import java.util.Optional;

/**
 * 레거시 Hyobee JWT 검증 (HMAC HS512, {@code SECRET_KEY} UTF-8 바이트).
 */
public interface JwtTokenValidator {

    Optional<AuthenticatedUser> validate(String token);
}
