package com.katsulabs.katsubot.infrastructure.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "katsubot.auth")
public record AuthProperties(
        boolean devBypass,
        String devToken,
        String jwtSecret
) {
    public AuthProperties {
        if (devToken == null || devToken.isBlank()) {
            devToken = "dev-token";
        }
        if (jwtSecret != null && jwtSecret.isBlank()) {
            jwtSecret = null;
        }
    }
}
