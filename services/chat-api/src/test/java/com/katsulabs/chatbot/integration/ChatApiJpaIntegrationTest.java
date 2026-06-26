package com.katsulabs.chatbot.integration;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import com.katsulabs.chatbot.infrastructure.auth.BearerAuthFilter;

import java.io.IOException;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles(value = {"jpa", "jpa-it"}, inheritProfiles = false)
@Testcontainers
class ChatApiJpaIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("katsubot")
            .withUsername("katsubot")
            .withPassword("katsubot");

    static MockWebServer ragServer;

    @LocalServerPort
    int port;

    @Autowired
    WebApplicationContext context;

    @Autowired
    BearerAuthFilter bearerAuthFilter;

    MockMvc mockMvc;

    @BeforeAll
    static void startRagServer() throws IOException {
        ragServer = new MockWebServer();
        ragServer.start();
    }

    @AfterAll
    static void stopRagServer() throws IOException {
        if (ragServer != null) {
            ragServer.shutdown();
        }
    }

    @DynamicPropertySource
    static void registerRagUrl(DynamicPropertyRegistry registry) {
        registry.add("katsubot.rag.base-url", () -> ragServer.url("/").toString().replaceAll("/$", ""));
    }

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .addFilters(bearerAuthFilter)
                .build();
    }

    @Test
    void persistsConversationCrudThroughJpa() throws Exception {
        var createResult = mockMvc.perform(post("/api/v1/conversations")
                        .header("Authorization", "Bearer dev-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"jpa-it\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("jpa-it"))
                .andReturn();

        var body = createResult.getResponse().getContentAsString();
        var conversationId = JsonPath.read(body, "$.id");

        mockMvc.perform(get("/api/v1/conversations")
                        .header("Authorization", "Bearer dev-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(conversationId));

        mockMvc.perform(get("/api/v1/conversations/" + conversationId + "/messages")
                        .header("Authorization", "Bearer dev-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messages").isArray());

        var deleteBody = "{\"conversation_ids\":[\"" + conversationId + "\"]}";
        mockMvc.perform(delete("/api/v1/conversations")
                        .header("Authorization", "Bearer dev-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deleteBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deleted_count").value(1));
    }

    @Test
    void persistsMessageHistoryThroughJpa() throws Exception {
        ragServer.enqueue(new MockResponse()
                .setBody("data: {\"delta\":\"integration\"}\n\ndata: {\"done\":true}\n\n")
                .addHeader("Content-Type", "text/event-stream"));

        var createResult = mockMvc.perform(post("/api/v1/conversations")
                        .header("Authorization", "Bearer dev-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"history-it\"}"))
                .andExpect(status().isCreated())
                .andReturn();

        var conversationId = JsonPath.read(createResult.getResponse().getContentAsString(), "$.id");

        mockMvc.perform(post("/api/v1/conversations/" + conversationId + "/messages")
                        .header("Authorization", "Bearer dev-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.TEXT_EVENT_STREAM)
                        .content("{\"content\":\"hello\"}"))
                .andExpect(status().isOk());

        String messagesBody = null;
        for (int attempt = 0; attempt < 30; attempt++) {
            var messagesResult = mockMvc.perform(get("/api/v1/conversations/" + conversationId + "/messages")
                            .header("Authorization", "Bearer dev-token"))
                    .andExpect(status().isOk())
                    .andReturn();
            messagesBody = messagesResult.getResponse().getContentAsString();
            if (messagesBody.contains("\"role\":\"assistant\"")) {
                break;
            }
            Thread.sleep(100);
        }
        if (messagesBody == null || !messagesBody.contains("\"role\":\"assistant\"")) {
            throw new AssertionError("assistant message not persisted in time");
        }
    }
}
