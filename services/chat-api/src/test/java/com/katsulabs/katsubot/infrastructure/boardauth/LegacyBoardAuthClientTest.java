package com.katsulabs.katsubot.infrastructure.boardauth;

import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import com.katsulabs.katsubot.infrastructure.legacy.LegacyBridgeProperties;
import jakarta.servlet.http.HttpServletRequest;
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

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

class LegacyBoardAuthClientTest {

    private MockWebServer server;
    private LegacyBoardAuthClient client;

    @BeforeEach
    void setUp() throws IOException {
        server = new MockWebServer();
        server.start();
        var properties = new LegacyBridgeProperties(
                server.url("/").toString().replaceAll("/$", ""),
                "/xs/aichat/v2/board-auth"
        );
        client = new LegacyBoardAuthClient(WebClient.builder(), properties);
    }

    @AfterEach
    void tearDown() throws IOException {
        RequestContextHolder.resetRequestAttributes();
        server.shutdown();
    }

    @Test
    void forwardsBearerTokenAndParsesContent() throws InterruptedException {
        server.enqueue(new MockResponse()
                .setBody("{\"content\":[{\"board_name\":\"sales\"}],\"totalElements\":1,\"hasNext\":false}")
                .addHeader("Content-Type", "application/json"));

        bindRequestWithToken("legacy-jwt");

        var page = client.listAccessibleBoards("user-1", 0, 20);

        assertThat(page.items()).hasSize(1);
        assertThat(page.items().get(0).boardName()).isEqualTo("sales");

        RecordedRequest request = server.takeRequest();
        assertThat(request.getHeader("Authorization")).isEqualTo("Bearer legacy-jwt");
    }

    private static void bindRequestWithToken(String token) {
        HttpServletRequest request = new MockHttpServletRequest();
        request.setAttribute(AuthContext.BEARER_TOKEN_ATTRIBUTE, token);
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }
}
