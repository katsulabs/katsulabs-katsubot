package com.katsulabs.chatbot.infrastructure.rag;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "katsubot.rag")
public record RagServiceProperties(
        String baseUrl
) {
    public RagServiceProperties {
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "http://localhost:8090";
        }
    }
}
