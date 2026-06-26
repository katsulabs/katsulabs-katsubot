package com.katsulabs.chatbot.infrastructure.rag;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.health.contributor.Status;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

class RagHealthIndicatorTest {

    private MockWebServer server;
    private RagHealthIndicator indicator;

    @BeforeEach
    void setUp() throws IOException {
        server = new MockWebServer();
        server.start();
        var properties = new RagServiceProperties(server.url("/").toString().replaceAll("/$", ""));
        indicator = new RagHealthIndicator(WebClient.builder(), properties);
    }

    @AfterEach
    void tearDown() throws IOException {
        if (server != null) {
            server.shutdown();
        }
    }

    @Test
    void health_upWhenRagReturnsOk() {
        server.enqueue(new MockResponse()
                .setBody("{\"status\":\"ok\"}")
                .addHeader("Content-Type", "application/json"));

        var health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.UP);
    }

    @Test
    void health_downWhenRagUnreachable() throws IOException {
        server.shutdown();

        var health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.DOWN);
        server = null;
    }
}
