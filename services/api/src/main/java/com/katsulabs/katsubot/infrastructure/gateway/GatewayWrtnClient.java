package com.katsulabs.katsubot.infrastructure.gateway;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.katsulabs.katsubot.application.ConversationNotFoundException;
import com.katsulabs.katsubot.application.ForbiddenException;
import com.katsulabs.katsubot.application.ListMessagesUseCase;
import com.katsulabs.katsubot.application.SendMessageUseCase;
import com.katsulabs.katsubot.domain.model.Conversation;
import com.katsulabs.katsubot.domain.model.MessageRole;
import com.katsulabs.katsubot.domain.model.RagStreamChunk;
import com.katsulabs.katsubot.domain.port.ConversationRepository;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import com.katsulabs.katsubot.infrastructure.rag.RagServiceProperties;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
@Profile("gateway")
@RequiredArgsConstructor
public class GatewayWrtnClient {

    private static final int MAX_CONVERSATION_PAGES = 20;

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

    public List<Conversation> listConversations(String userId) {
        var conversations = new ArrayList<Conversation>();
        int page = 0;
        while (page < MAX_CONVERSATION_PAGES) {
            final int currentPage = page;
            JsonNode body = exchange(
                    authGet(client().get()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/api/v1/conversations")
                                    .queryParam("user_id", userId)
                                    .queryParam("page", currentPage)
                                    .queryParam("size", 50)
                                    .build())),
                    JsonNode.class);
            JsonNode content = body.path("content");
            if (!content.isArray() || content.isEmpty()) {
                break;
            }
            for (JsonNode item : content) {
                conversations.add(toConversation(userId, item));
            }
            if (!body.path("has_next").asBoolean(false)) {
                break;
            }
            page++;
        }
        return conversations;
    }

    public Conversation createConversation(String userId, String title) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("user_id", userId);
        payload.put("user_query", title == null || title.isBlank() ? "새 대화" : title.trim());
        payload.put("chat_category", "general");

        JsonNode body = exchange(
                authBody(client().post().uri("/api/v1/conversations"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(payload),
                JsonNode.class);
        return toConversation(userId, body);
    }

    public ConversationRepository.DeleteResult deleteConversations(String userId, List<String> conversationIds) {
        Map<String, Object> payload = Map.of("user_id", userId, "conversation_ids", conversationIds);
        JsonNode body = exchange(
                authBody(client().method(org.springframework.http.HttpMethod.DELETE).uri("/api/v1/conversations"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(payload),
                JsonNode.class);

        int deletedCount = body.path("deleted_count").asInt(0);
        var results = new ArrayList<ConversationRepository.DeleteItem>();
        JsonNode items = body.path("results");
        if (items.isArray()) {
            for (JsonNode item : items) {
                String conversationId = String.valueOf(item.path("conversation_id").asInt());
                int status = item.path("status").asInt(404);
                boolean deleted = status >= 200 && status < 300;
                results.add(new ConversationRepository.DeleteItem(
                        conversationId,
                        deleted,
                        deleted ? null : "delete failed"));
            }
        }
        return new ConversationRepository.DeleteResult(deletedCount, results);
    }

    public void assertConversationOwned(String userId, String conversationId) {
        try {
            exchange(
                    authGet(client().get()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/api/v1/conversations/{conversationId}/messages")
                                    .queryParam("user_id", userId)
                                    .queryParam("size", 1)
                                    .build(conversationId))),
                    JsonNode.class);
        } catch (ConversationNotFoundException ex) {
            throw ex;
        }
    }

    public ListMessagesUseCase.MessagesPage listMessagesPage(
            String userId, String conversationId, int cursor, int size) {
        int pageSize = size <= 0 ? 20 : Math.min(size, 100);
        String gatewayCursor = cursor <= 0 ? null : String.valueOf(cursor);

        JsonNode body = exchange(
                authGet(client().get()
                        .uri(uriBuilder -> {
                            var builder = uriBuilder
                                    .path("/api/v1/conversations/{conversationId}/messages")
                                    .queryParam("user_id", userId)
                                    .queryParam("size", pageSize);
                            if (gatewayCursor != null) {
                                builder.queryParam("cursor", gatewayCursor);
                            }
                            return builder.build(conversationId);
                        })),
                JsonNode.class);
        JsonNode content = body.path("content");
        var messages = new ArrayList<ListMessagesUseCase.MessageView>();
        if (content.isArray()) {
            for (JsonNode item : content) {
                messages.add(toMessageView(item));
            }
        }

        boolean hasMore = body.path("has_next").asBoolean(false);
        Integer nextCursor = null;
        if (hasMore && body.hasNonNull("next_cursor")) {
            String raw = body.get("next_cursor").asText();
            if (!raw.isBlank()) {
                nextCursor = Integer.parseInt(raw);
            }
        }
        return new ListMessagesUseCase.MessagesPage(messages, hasMore, nextCursor);
    }

    public SendMessageUseCase.StreamResult streamReply(
            String userId,
            String conversationId,
            String content,
            Consumer<RagStreamChunk> chunkConsumer) {
        assertConversationOwned(userId, conversationId);

        Map<String, Object> payload = Map.of(
                "conversation_id", conversationId,
                "user_id", userId,
                "chat_category", "basic",
                "message", content);

        String responseBody = exchange(
                authBody(client().post()
                                .uri(uriBuilder -> uriBuilder
                                        .path("/api/v1/conversations/{conversationId}/ai-chat")
                                        .queryParam("web_search_enabled", "false")
                                        .build(conversationId)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.TEXT_EVENT_STREAM)
                        .bodyValue(payload),
                String.class);

        var buffer = new StringBuilder();
        if (responseBody != null) {
            for (String line : responseBody.split("\\r?\\n")) {
                if (line.isBlank()) {
                    continue;
                }
                try {
                    JsonNode node = objectMapper.readTree(line);
                    String status = node.path("status").asText("");
                    if ("response_chunk".equals(status)) {
                        String delta = node.path("text").asText("");
                        if (!delta.isEmpty()) {
                            buffer.append(delta);
                            chunkConsumer.accept(RagStreamChunk.delta(delta));
                        }
                    } else if ("error".equals(status)) {
                        throw new IllegalStateException(node.path("message").asText("stream failed"));
                    }
                } catch (ConversationNotFoundException | ForbiddenException | IllegalStateException ex) {
                    throw ex;
                } catch (Exception ignored) {
                    // skip malformed line
                }
            }
        }

        chunkConsumer.accept(RagStreamChunk.finished());
        String assistantMessageId = findLatestAssistantMessageId(userId, conversationId);
        return new SendMessageUseCase.StreamResult(assistantMessageId, buffer.toString());
    }

    private String findLatestAssistantMessageId(String userId, String conversationId) {
        JsonNode body = exchange(
                authGet(client().get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/api/v1/conversations/{conversationId}/messages")
                                .queryParam("user_id", userId)
                                .queryParam("size", 20)
                                .build(conversationId))),
                JsonNode.class);
        JsonNode content = body.path("content");
        if (!content.isArray()) {
            return "";
        }
        for (int i = content.size() - 1; i >= 0; i--) {
            JsonNode item = content.get(i);
            if ("assistant".equalsIgnoreCase(item.path("role").asText())) {
                return String.valueOf(item.path("message_id").asInt());
            }
        }
        return "";
    }

    private Conversation toConversation(String userId, JsonNode item) {
        String id = item.has("conversation_id")
                ? String.valueOf(item.get("conversation_id").asInt())
                : item.path("id").asText("");
        String title = item.path("title").asText("새 대화");
        Instant createdAt = parseInstant(item.path("created_at").asText(null));
        return new Conversation(id, userId, title, createdAt, List.of());
    }

    private static ListMessagesUseCase.MessageView toMessageView(JsonNode item) {
        ListMessagesUseCase.MessageFeedbackView feedbackView = null;
        JsonNode feedback = item.get("feedback");
        if (feedback != null && !feedback.isNull()) {
            feedbackView = new ListMessagesUseCase.MessageFeedbackView(
                    feedback.path("feedback_id").asText(""),
                    feedback.path("feedback_type").asText(""));
        }
        return new ListMessagesUseCase.MessageView(
                String.valueOf(item.path("message_id").asInt()),
                normalizeRole(item.path("role").asText("assistant")),
                item.path("content").asText(""),
                item.path("created_at").asText(""),
                feedbackView);
    }

    private static String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return MessageRole.ASSISTANT.name().toLowerCase();
        }
        return role.toLowerCase();
    }

    private static Instant parseInstant(String value) {
        if (value == null || value.isBlank()) {
            return Instant.now();
        }
        try {
            return Instant.parse(value);
        } catch (Exception ex) {
            return Instant.now();
        }
    }

    private <T> T exchange(WebClient.RequestHeadersSpec<?> spec, Class<T> bodyType) {
        try {
            return spec.retrieve().bodyToMono(bodyType).block();
        } catch (WebClientResponseException ex) {
            throw mapException(ex);
        }
    }

    private static RuntimeException mapException(WebClientResponseException ex) {
        if (ex.getStatusCode() == HttpStatus.NOT_FOUND) {
            return new ConversationNotFoundException("대화를 찾을 수 없습니다");
        }
        if (ex.getStatusCode() == HttpStatus.FORBIDDEN) {
            return new ForbiddenException("대화에 접근할 권한이 없습니다");
        }
        return new IllegalStateException(ex.getResponseBodyAsString().isBlank()
                ? "Gateway 요청 실패 (" + ex.getStatusCode().value() + ")"
                : ex.getResponseBodyAsString());
    }

    private static WebClient.RequestHeadersSpec<?> authGet(WebClient.RequestHeadersSpec<?> spec) {
        return withAuthorization(spec);
    }

    private static WebClient.RequestBodySpec authBody(WebClient.RequestBodySpec spec) {
        String bearerToken = AuthContext.currentBearerToken();
        if (bearerToken != null) {
            return spec.header(HttpHeaders.AUTHORIZATION, "Bearer " + bearerToken);
        }
        return spec;
    }

    private static WebClient.RequestHeadersSpec<?> withAuthorization(WebClient.RequestHeadersSpec<?> spec) {
        String bearerToken = AuthContext.currentBearerToken();
        if (bearerToken != null) {
            return spec.header(HttpHeaders.AUTHORIZATION, "Bearer " + bearerToken);
        }
        return spec;
    }

}
