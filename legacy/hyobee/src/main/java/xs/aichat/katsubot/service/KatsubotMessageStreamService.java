package xs.aichat.katsubot.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.Disposable;
import xs.aichat.v2.dto.ConversationParamStoreV2;
import xs.aichat.v2.dto.external.wrtn.request.SendMessageApiRequest;
import xs.aichat.v2.dto.internal.request.SendMessageRequest;
import xs.aichat.v2.external.ChatVendorClient;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * chat-web OpenAPI SSE 계약(event:delta / event:done)으로 벤더 스트림을 변환한다.
 */
@Slf4j
@Service
public class KatsubotMessageStreamService {

    private static final String DEFAULT_CHAT_CATEGORY = "internal_rules";

    private final ChatVendorClient chatVendorClient;
    private final ConversationParamStoreV2 conversationParamStoreV2;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, Disposable> subscriptionMap = new ConcurrentHashMap<>();

    public KatsubotMessageStreamService(
            @Qualifier("wtrnChatVendorClientV2") ChatVendorClient chatVendorClient,
            @Qualifier("conversationParamStoreV2") ConversationParamStoreV2 conversationParamStoreV2
    ) {
        this.chatVendorClient = chatVendorClient;
        this.conversationParamStoreV2 = conversationParamStoreV2;
    }

    public SseEmitter streamMessage(String userId, String conversationId, String content) {
        return streamMessage(userId, conversationId, content, null);
    }

    public SseEmitter streamMessage(String userId, String conversationId, String content, String chatCategory) {
        var emitter = new SseEmitter(0L);
        var resolvedCategory = resolveChatCategory(chatCategory);
        var request = buildSendMessageRequest(userId, conversationId, content, resolvedCategory);
        conversationParamStoreV2.put(conversationId, request);

        try {
            var apiRequest = SendMessageApiRequest.initialize(
                    conversationId,
                    userId,
                    resolvedCategory,
                    content,
                    "N"
            );

            String sessionId = UUID.randomUUID().toString();
            boolean[] streamFinished = {false};
            StringBuilder accumulatedText = new StringBuilder();
            Disposable subscription = chatVendorClient.startChatStream(
                    conversationId,
                    apiRequest,
                    chunk -> processChunk(emitter, chunk, conversationId, streamFinished, accumulatedText),
                    err -> {
                        log.error("katsubot SSE error (conversationId={})", conversationId, err);
                        sendError(emitter, "STREAM_ERROR", err.getMessage());
                        cleanup(sessionId);
                        emitter.complete();
                    },
                    () -> cleanup(sessionId)
            );
            subscriptionMap.put(sessionId, subscription);

            emitter.onCompletion(() -> cleanup(sessionId));
            emitter.onTimeout(() -> cleanup(sessionId));
            emitter.onError(ex -> cleanup(sessionId));
        } catch (Exception ex) {
            log.error("katsubot SSE start failed (conversationId={})", conversationId, ex);
            sendError(emitter, "STREAM_ERROR", ex.getMessage());
            emitter.complete();
        }

        return emitter;
    }

    private SendMessageRequest buildSendMessageRequest(
            String userId,
            String conversationId,
            String content,
            String chatCategory
    ) {
        var request = new SendMessageRequest();
        request.setConversationId(conversationId);
        request.setUserId(userId);
        request.setChatCategory(chatCategory);
        request.setMessage(content);
        return request;
    }

    private static String resolveChatCategory(String chatCategory) {
        if (chatCategory == null || chatCategory.isBlank()) {
            return DEFAULT_CHAT_CATEGORY;
        }
        return chatCategory.trim();
    }

    private void processChunk(
            SseEmitter emitter,
            String chunk,
            String conversationId,
            boolean[] streamFinished,
            StringBuilder accumulatedText
    ) {
        if (chunk == null || chunk.isBlank()) {
            return;
        }
        try {
            Map<String, Object> responseMap = objectMapper.readValue(chunk.trim(), new TypeReference<>() {});
            String status = String.valueOf(responseMap.getOrDefault("status", ""));

            switch (status) {
                case "error" -> {
                    String message = Objects.toString(
                            responseMap.getOrDefault("message", responseMap.getOrDefault("error", "stream error")),
                            "stream error"
                    );
                    sendError(emitter, "STREAM_ERROR", message);
                    emitter.complete();
                }
                case "done" -> finishStream(emitter, conversationId, responseMap, streamFinished, accumulatedText);
                case "response_chunk" -> {
                    String delta = extractDeltaText(responseMap);
                    if (delta != null && !delta.isEmpty()) {
                        accumulatedText.append(delta);
                        sendDelta(emitter, delta);
                    }
                }
                case "response_completed" -> {
                    String delta = extractDeltaText(responseMap);
                    if (delta != null && !delta.isEmpty()) {
                        accumulatedText.append(delta);
                        sendDelta(emitter, delta);
                    }
                    finishStream(emitter, conversationId, responseMap, streamFinished, accumulatedText);
                }
                default -> {
                    String delta = extractDeltaText(responseMap);
                    if (delta != null && !delta.isEmpty()) {
                        accumulatedText.append(delta);
                        sendDelta(emitter, delta);
                    }
                }
            }
        } catch (Exception ex) {
            log.warn("katsubot SSE chunk parse failed: {}", chunk, ex);
        }
    }

    private void finishStream(
            SseEmitter emitter,
            String conversationId,
            Map<String, Object> responseMap,
            boolean[] streamFinished,
            StringBuilder accumulatedText
    ) {
        if (streamFinished[0]) {
            return;
        }
        streamFinished[0] = true;
        String messageId = extractMessageId(responseMap);
        String title = extractTitle(responseMap);
        sendDone(emitter, conversationId, messageId, accumulatedText.toString(), title);
        emitter.complete();
    }

    private String extractDeltaText(Map<String, Object> responseMap) {
        Object text = responseMap.get("text");
        if (text != null && !String.valueOf(text).isEmpty()) {
            return String.valueOf(text);
        }
        Object message = responseMap.get("message");
        if (message != null && !String.valueOf(message).isEmpty()) {
            return String.valueOf(message);
        }
        return null;
    }

    private String extractMessageId(Map<String, Object> responseMap) {
        Object messageId = responseMap.get("message_id");
        if (messageId != null) {
            return String.valueOf(messageId);
        }
        return "";
    }

    private void sendDelta(SseEmitter emitter, String delta) {
        try {
            emitter.send(SseEmitter.event()
                    .name("delta")
                    .data(Map.of("delta", delta)));
        } catch (IOException ex) {
            emitter.completeWithError(ex);
        }
    }

    private String extractTitle(Map<String, Object> responseMap) {
        Object title = responseMap.get("title");
        if (title == null) {
            return null;
        }
        String text = String.valueOf(title);
        return text.isBlank() ? null : text;
    }

    private void sendDone(SseEmitter emitter, String conversationId, String messageId, String content, String title) {
        try {
            Map<String, String> payload = new HashMap<>();
            payload.put("conversation_id", conversationId);
            payload.put("message_id", messageId);
            if (content != null && !content.isEmpty()) {
                payload.put("content", content);
            }
            if (title != null && !title.isEmpty()) {
                payload.put("title", title);
            }
            emitter.send(SseEmitter.event()
                    .name("done")
                    .data(payload));
        } catch (IOException ex) {
            emitter.completeWithError(ex);
        }
    }

    private void sendError(SseEmitter emitter, String code, String message) {
        try {
            emitter.send(SseEmitter.event()
                    .name("error")
                    .data(Map.of("code", code, "message", message)));
        } catch (IOException ignored) {
            // ignore
        }
    }

    private void cleanup(String sessionId) {
        Disposable subscription = subscriptionMap.remove(sessionId);
        if (subscription != null && !subscription.isDisposed()) {
            subscription.dispose();
        }
    }
}
