package com.katsulabs.katsubot.infrastructure.admindb;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "katsubot.admin-db")
public record AdminDbProperties(
        String url,
        String username,
        String password
) {
    public boolean isConfigured() {
        return url != null && !url.isBlank();
    }
}
