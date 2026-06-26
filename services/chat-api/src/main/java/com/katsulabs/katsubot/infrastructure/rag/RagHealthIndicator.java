package com.katsulabs.katsubot.infrastructure.rag;

import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Component
public class RagHealthIndicator implements HealthIndicator {

    private final WebClient webClient;
    private final RagServiceProperties properties;

    public RagHealthIndicator(WebClient.Builder webClientBuilder, RagServiceProperties properties) {
        this.properties = properties;
        this.webClient = webClientBuilder.baseUrl(properties.baseUrl()).build();
    }

    @Override
    public Health health() {
        try {
            String body = webClient.get()
                    .uri("/_health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(Duration.ofSeconds(5));

            if (body != null && body.contains("ok")) {
                return Health.up()
                        .withDetail("baseUrl", properties.baseUrl())
                        .build();
            }
            return Health.down()
                    .withDetail("baseUrl", properties.baseUrl())
                    .withDetail("response", body)
                    .build();
        } catch (Exception ex) {
            return Health.down(ex)
                    .withDetail("baseUrl", properties.baseUrl())
                    .build();
        }
    }
}
