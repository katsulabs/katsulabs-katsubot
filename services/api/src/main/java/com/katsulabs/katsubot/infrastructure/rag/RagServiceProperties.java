package com.katsulabs.katsubot.infrastructure.rag;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "katsubot.rag")
public record RagServiceProperties(
        String baseUrl,
        String mode
) {
    public RagServiceProperties {
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "http://localhost:8090";
        }
        if (mode == null || mode.isBlank()) {
            mode = "direct";
        }
    }
}
