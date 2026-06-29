package com.katsulabs.katsubot.infrastructure.rag;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class RagHealthIndicator implements HealthIndicator {

    private final WebClient.Builder webClientBuilder;
    private final RagServiceProperties properties;

    private WebClient webClient;

    private WebClient client() {
        if (webClient == null) {
            webClient = webClientBuilder.baseUrl(properties.baseUrl()).build();
        }
        return webClient;
    }

    @Override
    public Health health() {
        try {
            String body = client().get()
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
