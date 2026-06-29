package com.katsulabs.katsubot.infrastructure.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public final class AuthContext {

    public static final String USER_ID_ATTRIBUTE = "katsubot.userId";
    public static final String BEARER_TOKEN_ATTRIBUTE = "katsubot.bearerToken";

    private AuthContext() {
    }

    public static String userId(HttpServletRequest request) {
        return (String) request.getAttribute(USER_ID_ATTRIBUTE);
    }

    public static String bearerToken(HttpServletRequest request) {
        Object token = request.getAttribute(BEARER_TOKEN_ATTRIBUTE);
        if (token instanceof String s && !s.isBlank()) {
            return s;
        }
        return null;
    }

    public static String currentBearerToken() {
        var attrs = RequestContextHolder.getRequestAttributes();
        if (attrs instanceof ServletRequestAttributes servletAttrs) {
            return bearerToken(servletAttrs.getRequest());
        }
        return null;
    }
}
