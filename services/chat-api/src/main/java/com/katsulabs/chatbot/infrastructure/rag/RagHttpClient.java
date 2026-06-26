package com.katsulabs.chatbot.infrastructure.rag;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.katsulabs.chatbot.domain.model.RagCompletionRequest;
import com.katsulabs.chatbot.domain.model.RagStreamChunk;
import com.katsulabs.chatbot.domain.port.RagCompletionPort;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.function.Consumer;

/**
 * 외부 RAG HTTP/SSE 클라이언트. URL만 바꿔 운영 RAG·스텁(dummy-rag)을 교체한다.
 */
@Component
public class RagHttpClient implements RagCompletionPort {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public RagHttpClient(RagServiceProperties properties, WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl(properties.baseUrl()).build();
        this.objectMapper = objectMapper;
    }

    @Override
    public void streamCompletion(RagCompletionRequest request, Consumer<RagStreamChunk> chunkHandler) {
        if (!request.stream()) {
            var body = webClient.post()
                    .uri("/v1/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "query", request.query(),
                            "conversation_id", request.conversationId(),
                            "stream", false
                    ))
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
            if (body != null && body.has("answer")) {
                chunkHandler.accept(RagStreamChunk.delta(body.get("answer").asText()));
            }
            chunkHandler.accept(RagStreamChunk.finished());
            return;
        }

        String sseBody = webClient.post()
                .uri("/v1/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.TEXT_EVENT_STREAM)
                .bodyValue(Map.of(
                        "query", request.query(),
                        "conversation_id", request.conversationId(),
                        "stream", true
                ))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (sseBody == null) {
            return;
        }
        for (String line : sseBody.split("\\r?\\n")) {
            if (!line.startsWith("data:")) {
                continue;
            }
            String payload = line.substring("data:".length()).trim();
            if (!payload.isEmpty()) {
                emitChunk(payload, chunkHandler);
            }
        }
    }

    private void emitChunk(String payload, Consumer<RagStreamChunk> chunkHandler) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            if (node.has("done") && node.get("done").asBoolean()) {
                chunkHandler.accept(RagStreamChunk.finished());
                return;
            }
            if (node.has("delta")) {
                chunkHandler.accept(RagStreamChunk.delta(node.get("delta").asText()));
            }
        } catch (Exception ignored) {
            // Phase 1: malformed SSE line — skip or log in Use Case layer
        }
    }
}
