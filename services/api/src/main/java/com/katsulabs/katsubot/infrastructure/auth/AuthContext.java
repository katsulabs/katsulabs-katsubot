package com.katsulabs.katsubot.infrastructure.auth;

import jakarta.servlet.http.HttpServletRequest;

public final class AuthContext {

    public static final String USER_ID_ATTRIBUTE = "katsubot.userId";
    public static final String BEARER_TOKEN_ATTRIBUTE = "katsubot.bearerToken";

    private AuthContext() {
    }

    public static String userId(HttpServletRequest request) {
        return (String) request.getAttribute(USER_ID_ATTRIBUTE);
    }
}
