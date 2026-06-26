package com.katsulabs.chatbot.infrastructure.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class BearerAuthFilter extends OncePerRequestFilter {

    private final AuthProperties authProperties;

    public BearerAuthFilter(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/actuator");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            writeUnauthorized(response, "Authorization Bearer 토큰이 필요합니다");
            return;
        }

        String token = authorization.substring("Bearer ".length()).trim();
        if (token.isEmpty()) {
            writeUnauthorized(response, "Authorization Bearer 토큰이 필요합니다");
            return;
        }

        if (authProperties.devBypass() && authProperties.devToken().equals(token)) {
            request.setAttribute(AuthContext.USER_ID_ATTRIBUTE, "dev-user");
            filterChain.doFilter(request, response);
            return;
        }

        writeUnauthorized(response, "유효하지 않은 토큰입니다");
    }

    private void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write("{\"code\":\"UNAUTHORIZED\",\"message\":\"" + escapeJson(message) + "\"}");
    }

    private static String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
