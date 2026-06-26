package com.katsulabs.chatbot.infrastructure.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "katsubot.auth")
public record AuthProperties(
        boolean devBypass,
        String devToken
) {
    public AuthProperties {
        if (devToken == null || devToken.isBlank()) {
            devToken = "dev-token";
        }
    }
}
