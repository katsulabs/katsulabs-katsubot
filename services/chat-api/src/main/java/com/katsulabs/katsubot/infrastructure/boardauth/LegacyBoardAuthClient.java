package com.katsulabs.katsubot.infrastructure.boardauth;

import tools.jackson.databind.JsonNode;
import com.katsulabs.katsubot.domain.model.BoardAuthPage;
import com.katsulabs.katsubot.domain.port.BoardAuthPort;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import com.katsulabs.katsubot.infrastructure.legacy.LegacyBridgeProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Component
@Profile("legacy-bridge")
public class LegacyBoardAuthClient implements BoardAuthPort {

    private static final Logger log = LoggerFactory.getLogger(LegacyBoardAuthClient.class);

    private final WebClient webClient;
    private final LegacyBridgeProperties properties;

    public LegacyBoardAuthClient(WebClient.Builder webClientBuilder, LegacyBridgeProperties properties) {
        this.properties = properties;
        this.webClient = webClientBuilder.baseUrl(properties.baseUrl()).build();
    }

    @Override
    public BoardAuthPage listAccessibleBoards(String userId, int page, int size) {
        try {
            var requestSpec = webClient.get().uri(properties.boardAuthPath());
            String bearerToken = currentBearerToken();
            if (bearerToken != null) {
                requestSpec = requestSpec.header(HttpHeaders.AUTHORIZATION, "Bearer " + bearerToken);
            }

            JsonNode body = requestSpec
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block(Duration.ofSeconds(10));

            if (body == null) {
                return empty(page, size);
            }

            JsonNode content = body.has("content") ? body.get("content") : body.get("items");
            if (content == null || !content.isArray()) {
                return empty(page, size);
            }

            List<BoardAuthPage.BoardAuthItem> items = new ArrayList<>();
            for (JsonNode node : content) {
                String boardName = node.has("board_name")
                        ? node.get("board_name").asText()
                        : node.has("boardName") ? node.get("boardName").asText() : null;
                if (boardName != null && !boardName.isBlank()) {
                    items.add(new BoardAuthPage.BoardAuthItem(boardName));
                }
            }

            long total = body.has("totalElements") ? body.get("totalElements").asLong(items.size()) : items.size();
            boolean hasNext = body.has("hasNext") && body.get("hasNext").asBoolean(false);
            return new BoardAuthPage(items, total, page, size, hasNext);
        } catch (Exception ex) {
            log.warn("legacy board-auth bridge failed for userId={}: {}", userId, ex.getMessage());
            return empty(page, size);
        }
    }

    private static BoardAuthPage empty(int page, int size) {
        return new BoardAuthPage(List.of(), 0, page, size, false);
    }

    private static String currentBearerToken() {
        var attrs = RequestContextHolder.getRequestAttributes();
        if (attrs instanceof ServletRequestAttributes servletAttrs) {
            Object token = servletAttrs.getRequest().getAttribute(AuthContext.BEARER_TOKEN_ATTRIBUTE);
            if (token instanceof String s && !s.isBlank()) {
                return s;
            }
        }
        return null;
    }
}
