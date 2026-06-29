package com.katsulabs.katsubot.infrastructure.rag;

import tools.jackson.databind.ObjectMapper;
import com.katsulabs.katsubot.domain.model.RagCompletionRequest;
import com.katsulabs.katsubot.domain.model.RagStreamChunk;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class RagHttpClientTest {

    private MockWebServer server;
    private RagHttpClient client;

    @BeforeEach
    void setUp() throws IOException {
        server = new MockWebServer();
        server.start();
        var properties = new RagServiceProperties(server.url("/").toString().replaceAll("/$", ""), "direct");
        client = new RagHttpClient(properties, WebClient.builder(), new ObjectMapper());
    }

    @AfterEach
    void tearDown() throws IOException {
        server.shutdown();
    }

    @Test
    void nonStreamCompletion_emitsAnswerAndDone() {
        server.enqueue(new MockResponse()
                .setBody("{\"answer\":\"Hello\"}")
                .addHeader("Content-Type", "application/json"));

        var chunks = collectChunks(new RagCompletionRequest("conv-1", "hi", false));

        assertThat(chunks).containsExactly(
                RagStreamChunk.delta("Hello"),
                RagStreamChunk.finished()
        );
    }

    @Test
    void streamCompletion_emitsDeltaAndDone() {
        server.enqueue(new MockResponse()
                .setBody("data: {\"delta\":\"Hi\"}\n\ndata: {\"done\":true}\n\n")
                .addHeader("Content-Type", "text/event-stream"));

        var chunks = collectChunks(new RagCompletionRequest("conv-1", "hi", true));

        assertThat(chunks).anyMatch(c -> "Hi".equals(c.delta()));
        assertThat(chunks).anyMatch(RagStreamChunk::done);
    }

    @Test
    void streamCompletion_sendsModeInRequestBody() throws InterruptedException {
        server.enqueue(new MockResponse()
                .setBody("data: {\"delta\":\"Hi\"}\n\ndata: {\"done\":true}\n\n")
                .addHeader("Content-Type", "text/event-stream"));

        collectChunks(new RagCompletionRequest("conv-1", "hi", true));

        var recorded = server.takeRequest();
        assertThat(recorded.getPath()).isEqualTo("/v1/completions");
        assertThat(recorded.getBody().readUtf8()).contains("\"mode\":\"direct\"");
    }

    private List<RagStreamChunk> collectChunks(RagCompletionRequest request) {
        var chunks = new ArrayList<RagStreamChunk>();
        client.streamCompletion(request, chunks::add);
        return chunks;
    }
}
