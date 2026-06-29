package com.katsulabs.katsubot.infrastructure.gateway;

import tools.jackson.databind.ObjectMapper;
import com.katsulabs.katsubot.infrastructure.rag.RagServiceProperties;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.reactive.function.client.WebClient;

import static org.assertj.core.api.Assertions.assertThat;

class GatewayWrtnClientTest {

    private MockWebServer server;
    private GatewayWrtnClient client;

    @BeforeEach
    void setUp() throws Exception {
        server = new MockWebServer();
        server.start();

        var properties = new RagServiceProperties(server.url("/").toString().replaceAll("/$", ""), "direct");
        client = new GatewayWrtnClient(properties, WebClient.builder(), new ObjectMapper());

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setAttribute("katsubot.bearerToken", "test-jwt");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @AfterEach
    void tearDown() throws Exception {
        RequestContextHolder.resetRequestAttributes();
        server.shutdown();
    }

    @Test
    void listConversations_mapsGatewayPage() {
        server.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json")
                .setBody("""
                        {
                          "content": [
                            {
                              "conversation_id": 1576,
                              "title": "수신 테스트",
                              "chat_category": "general",
                              "created_at": "2026-01-01T00:00:00Z"
                            }
                          ],
                          "has_next": false
                        }
                        """));

        var conversations = client.listConversations("itx202501672");

        assertThat(conversations).hasSize(1);
        assertThat(conversations.getFirst().id()).isEqualTo("1576");
        assertThat(conversations.getFirst().title()).isEqualTo("수신 테스트");
    }
}
