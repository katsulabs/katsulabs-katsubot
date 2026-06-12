package xs.aichat.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import xs.aichat.v2.external.ChatVendorClient;
import xs.aichat.v2.service.ChatFileService;
import xs.aichat.v2.service.ChatServiceImpl;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("ChatServiceImpl 단위 테스트")
class ChatServiceImplTest {

    @Mock
    private ChatVendorClient chatVendorClient;

    @Mock
    private ChatFileService chatFileService;

    private ChatServiceImpl chatService;

    @BeforeEach
    void setUp() {
        chatService = new ChatServiceImpl(chatVendorClient, chatFileService);
    }

    @Nested
    @DisplayName("healthCheck")
    class HealthCheck {

        @Test
        @DisplayName("벤더 healthCheck 결과 그대로 반환")
        void returnsVendorHealthCheck() {
            Map<String, Object> body = new HashMap<>();
            body.put("status", "UP");
            when(chatVendorClient.healthCheck()).thenReturn(ResponseEntity.ok(body));

            ResponseEntity<Map<String, Object>> result = chatService.healthCheck();

            assertThat(result.getStatusCodeValue()).isEqualTo(200);
            assertThat(result.getBody()).containsEntry("status", "UP");
            verify(chatVendorClient).healthCheck();
        }
    }
}
