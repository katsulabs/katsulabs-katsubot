package xs.aichat.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import xs.aichat.v2.controller.HyobeeChatController;
import xs.aichat.v2.dto.internal.request.ConversationRequest;
import xs.aichat.v2.dto.internal.response.ConversationsResponse;
import xs.aichat.v2.service.ChatFileService;
import xs.aichat.v2.service.ChatService;
import xs.aichat.v2.service.ChatSessionService;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("HyobeeChatController 단위 테스트")
class HyobeeChatControllerTest {

    @Mock
    private ChatService chatService;

    @Mock
    private ChatFileService chatFileService;

    @Mock
    private ChatSessionService chatSessionService;

    @InjectMocks
    private HyobeeChatController hyobeeChatController;

    @Nested
    @DisplayName("healthCheck")
    class HealthCheck {

        @Test
        @DisplayName("서비스 healthCheck 결과 그대로 반환")
        void returnsServiceHealthCheck() {
            Map<String, Object> body = new HashMap<>();
            body.put("status", "UP");
            when(chatService.healthCheck()).thenReturn(ResponseEntity.ok(body));

            ResponseEntity<Map<String, Object>> result = hyobeeChatController.healthCheck();

            assertThat(result.getStatusCodeValue()).isEqualTo(200);
            assertThat(result.getBody()).containsEntry("status", "UP");
            verify(chatService).healthCheck();
        }
    }

    @Nested
    @DisplayName("selectConversations")
    class SelectConversations {

        @Test
        @DisplayName("서비스 호출 후 반환값 그대로 반환")
        void delegatesToServiceAndReturns() {
            var request = new ConversationRequest();
            var expected = ConversationsResponse.of(Collections.emptyList(), 0, 0, 20, false);
            when(chatService.selectConversations(any())).thenReturn(expected);

            var result = hyobeeChatController.selectConversations(request);

            assertThat(result).isSameAs(expected);
            verify(chatService).selectConversations(request);
        }
    }
}
