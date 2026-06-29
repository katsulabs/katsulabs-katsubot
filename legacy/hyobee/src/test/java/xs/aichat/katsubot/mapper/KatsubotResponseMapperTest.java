package xs.aichat.katsubot.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import xs.aichat.katsubot.dto.CreateConversationBody;
import xs.aichat.v2.dto.internal.response.ConversationItem;
import xs.aichat.v2.dto.internal.response.ConversationsResponse;
import xs.aichat.v2.dto.internal.response.MessageItem;
import xs.aichat.v2.dto.wrapper.ApiResponse;
import xs.aichat.v2.dto.wrapper.JsonDataWrapper;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("KatsubotResponseMapper")
class KatsubotResponseMapperTest {

    @Test
    @DisplayName("대화 생성 요청은 기본 chat_category internal_rules를 사용한다")
    void toLegacyCreateRequest_usesDefaultCategory() {
        var body = new CreateConversationBody();
        body.setTitle("테스트 대화");

        var legacy = KatsubotResponseMapper.toLegacyCreateRequest("user01", body);

        assertThat(legacy.getUserId()).isEqualTo("user01");
        assertThat(legacy.getUserQuery()).isEqualTo("테스트 대화");
        assertThat(legacy.getChatCategory()).isEqualTo("internal_rules");
    }

    @Test
    @DisplayName("CreateConversationBody chat_category를 legacy 요청에 반영한다")
    void toLegacyCreateRequest_usesBodyChatCategory() {
        var body = new CreateConversationBody();
        body.setTitle("저널 대화");
        body.setChatCategory("rnd_search");

        var legacy = KatsubotResponseMapper.toLegacyCreateRequest("user01", body);

        assertThat(legacy.getChatCategory()).isEqualTo("rnd_search");
    }

    @Test
    @DisplayName("ConversationItem을 OpenAPI Conversation으로 변환한다")
    void toConversationResponse_mapsIdAsString() {
        var item = ConversationItem.of(42, "제목", "internal_rules", "2026-01-01", "2026-01-02", "D001");

        var response = KatsubotResponseMapper.toConversationResponse(item);

        assertThat(response.getId()).isEqualTo("42");
        assertThat(response.getTitle()).isEqualTo("제목");
        assertThat(response.getCreatedAt()).isEqualTo("2026-01-01");
        assertThat(response.getChatCategory()).isEqualTo("internal_rules");
    }

    @Test
    @DisplayName("메시지 목록을 MessagesPage로 변환한다")
    void toMessagesPage_mapsMessages() {
        var message = MessageItem.of(
                7,
                "안녕",
                List.of(),
                null,
                "assistant",
                List.of(),
                null,
                "2026-01-01T00:00:00Z"
        );
        var wrapper = new JsonDataWrapper<>(new ApiResponse<>(null, List.of(message)));

        var page = KatsubotResponseMapper.toMessagesPage(wrapper, 0, 20);

        assertThat(page.getMessages()).hasSize(1);
        assertThat(page.getMessages().get(0).getId()).isEqualTo("7");
        assertThat(page.getMessages().get(0).getRole()).isEqualTo("assistant");
    }

    @Test
    @DisplayName("메시지 feedback Map을 요약 DTO로 변환한다")
    void toMessageResponse_mapsFeedbackSummary() {
        var message = MessageItem.of(
                9,
                "답변",
                List.of(),
                null,
                "assistant",
                List.of(),
                Map.of("feedback_id", "fb-1", "feedback_type", "like"),
                "2026-01-01T00:00:00Z"
        );

        var response = KatsubotResponseMapper.toMessageResponse(message);

        assertThat(response.getFeedback()).isNotNull();
        assertThat(response.getFeedback().getFeedbackId()).isEqualTo("fb-1");
        assertThat(response.getFeedback().getFeedbackType()).isEqualTo("like");
    }

    @Test
    @DisplayName("대화 목록 페이지를 배열로 변환한다")
    void toConversationResponses_mapsList() {
        var item = ConversationItem.of(1, "A", "internal_rules", "t1", "t2", null);
        var page = ConversationsResponse.of(List.of(item), 1, 0, 20, false);

        var responses = KatsubotResponseMapper.toConversationResponses(page);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getId()).isEqualTo("1");
    }
}
