package com.katsulabs.katsubot.infrastructure.legacy;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "katsubot.legacy")
public record LegacyBridgeProperties(
        String baseUrl,
        String boardAuthPath
) {
    public LegacyBridgeProperties {
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "http://localhost:8080";
        }
        if (boardAuthPath == null || boardAuthPath.isBlank()) {
            boardAuthPath = "/xs/aichat/v2/board-auth";
        }
    }
}
