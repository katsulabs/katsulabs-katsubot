package com.katsulabs.katsubot.infrastructure.gateway;

import tools.jackson.databind.ObjectMapper;
import com.katsulabs.katsubot.domain.model.RagStreamChunk;
import com.katsulabs.katsubot.infrastructure.rag.RagServiceProperties;
import java.util.ArrayList;
import java.util.List;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.reactive.function.client.WebClient;

import static org.assertj.core.api.Assertions.assertThat;

class GatewayWrtnClientTest {

    private static final String CONV_ID = "729a6287-ec1f-4e6d-a26a-0b1fed964896";
    private static final String MSG_ID = "e05bad10-b39d-4ad7-aca1-0933a93ef894";

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
    void listConversations_mapsUuidConversationId() {
        server.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json")
                .setBody("""
                        {
                          "content": [
                            {
                              "conversation_id": "%s",
                              "title": "수신 테스트",
                              "chat_category": "general",
                              "created_at": "2026-01-01T00:00:00Z"
                            }
                          ],
                          "has_next": false
                        }
                        """.formatted(CONV_ID)));

        var conversations = client.listConversations("itx202501672");

        assertThat(conversations).hasSize(1);
        assertThat(conversations.getFirst().id()).isEqualTo(CONV_ID);
        assertThat(conversations.getFirst().title()).isEqualTo("수신 테스트");
    }

    @Test
    void listMessagesPage_passesUuidCursorAndMapsResponse() throws Exception {
        server.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json")
                .setBody("""
                        {
                          "content": [
                            {
                              "message_id": "%s",
                              "content": "hello",
                              "role": "user",
                              "created_at": "2026-01-01T00:00:00Z"
                            }
                          ],
                          "has_next": true,
                          "next_cursor": "%s"
                        }
                        """.formatted(MSG_ID, MSG_ID)));

        var page = client.listMessagesPage("user-1", CONV_ID, MSG_ID, 20);

        RecordedRequest request = server.takeRequest();
        assertThat(request.getPath()).contains("cursor=" + MSG_ID);
        assertThat(page.messages()).hasSize(1);
        assertThat(page.messages().getFirst().id()).isEqualTo(MSG_ID);
        assertThat(page.hasMore()).isTrue();
        assertThat(page.nextCursor()).isEqualTo(MSG_ID);
    }

    @Test
    void streamReply_mapsWrtnSseChunks() {
        server.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json")
                .setBody("{\"content\":[],\"has_next\":false}"));
        server.enqueue(new MockResponse()
                .setHeader("Content-Type", "text/event-stream")
                .setBody("""
                        {"status":"response_chunk","text":"안"}
                        {"status":"response_chunk","text":"녕"}
                        {"status":"response_completed","message":""}
                        {"status":"done"}
                        """));
        server.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json")
                .setBody("""
                        {
                          "content": [
                            {
                              "message_id": "%s",
                              "content": "안녕",
                              "role": "assistant",
                              "created_at": "2026-01-01T00:00:00Z"
                            }
                          ],
                          "has_next": false
                        }
                        """.formatted(MSG_ID)));

        var chunks = new ArrayList<RagStreamChunk>();
        var result = client.streamReply("user-1", CONV_ID, "hi", chunks::add);

        assertThat(result.fullText()).isEqualTo("안녕");
        assertThat(result.assistantMessageId()).isEqualTo(MSG_ID);
        assertThat(chunks.stream().map(RagStreamChunk::delta).filter(d -> d != null).toList())
                .containsExactly("안", "녕");
    }
}
