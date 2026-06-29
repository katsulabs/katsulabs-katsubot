package com.katsulabs.katsubot.infrastructure.rag;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.katsulabs.katsubot.domain.model.RagCompletionRequest;
import com.katsulabs.katsubot.domain.model.RagStreamChunk;
import com.katsulabs.katsubot.domain.port.RagCompletionPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Consumer;

/**
 * 외부 AI Gateway HTTP/SSE 클라이언트.
 * URL만 바꿔 {@code katsulabs-ai-gateway}·dummy-rag 스텁을 교체한다.
 */
@Component
@RequiredArgsConstructor
public class RagHttpClient implements RagCompletionPort {

    private final RagServiceProperties properties;
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    private WebClient webClient;

    private WebClient client() {
        if (webClient == null) {
            webClient = webClientBuilder.baseUrl(properties.baseUrl()).build();
        }
        return webClient;
    }

    @Override
    public void streamCompletion(RagCompletionRequest request, Consumer<RagStreamChunk> chunkHandler) {
        if (!request.stream()) {
            var body = client().post()
                    .uri("/v1/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(completionBody(request))
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
            if (body != null && body.has("answer")) {
                chunkHandler.accept(RagStreamChunk.delta(body.get("answer").asText()));
            }
            chunkHandler.accept(RagStreamChunk.finished());
            return;
        }

        String sseBody = client().post()
                .uri("/v1/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.TEXT_EVENT_STREAM)
                .bodyValue(completionBody(request))
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

    private Map<String, Object> completionBody(RagCompletionRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("query", request.query());
        body.put("conversation_id", request.conversationId());
        body.put("stream", request.stream());
        body.put("mode", properties.mode());
        return body;
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
            // Gateway Phase 2+: {"source":{...}} — chat-api는 무시 (하위 호환)
        } catch (Exception ignored) {
            // malformed SSE line — skip
        }
    }
}
