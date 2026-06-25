package xs.aichat.v2.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import xs.aichat.v2.dto.ConversationDeptMapping;
import xs.aichat.v2.dto.Team;
import xs.aichat.v2.dto.internal.response.ConversationItem;
import xs.aichat.v2.mapper.UserMapper;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("ChatUserService target_dept_code enrichment")
class ChatUserServiceEnrichConversationsTest {

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private ChatUserServiceImpl service;

    @Test
    @DisplayName("conversations 배열에 포함된 대화는 해당 dept_code")
    void usesMappedDeptWhenConversationListed() {
        var mapping = new ConversationDeptMapping();
        mapping.setConversationId(10);
        mapping.setDeptCode("TEAM_A");
        when(userMapper.findConversationDeptMappingsByUserId("u1")).thenReturn(List.of(mapping));
        when(userMapper.findViewableTeamsById("u1", "ko"))
                .thenReturn(List.of(Team.of("TEAM_A", "A팀")));

        var item = ConversationItem.of(10, "제목", "cat", "c", "u", null);

        service.enrichConversationTargets("u1", "LOGIN_DEPT", "로그인부서", "ko", List.of(item));

        assertThat(item.getTargetDeptCode()).isEqualTo("TEAM_A");
        assertThat(item.getTitle()).isEqualTo("(A팀)제목");
    }

    @Test
    @DisplayName("conversations 배열에 없으면 로그인 dept_code·prefix 없음")
    void usesLoginDeptWhenNotInConversationsArray() {
        when(userMapper.findConversationDeptMappingsByUserId("u1")).thenReturn(List.of());
        when(userMapper.findViewableTeamsById("u1", "ko"))
                .thenReturn(List.of(Team.of("TEAM_ACTIVE", "활성팀")));

        var item = ConversationItem.of(99, "6월 4일 특허 추천", "cat", "c", "u", null);

        service.enrichConversationTargets("u1", "LOGIN_DEPT", "로그인부서", "ko", List.of(item));

        assertThat(item.getTargetDeptCode()).isEqualTo("LOGIN_DEPT");
        assertThat(item.getTitle()).isEqualTo("6월 4일 특허 추천");
    }

    @Test
    @DisplayName("viewable 행 없으면 로그인 dept_code")
    void usesLoginDeptWhenNoViewableRows() {
        when(userMapper.findConversationDeptMappingsByUserId("u1")).thenReturn(List.of());
        when(userMapper.findViewableTeamsById("u1", "ko")).thenReturn(List.of());

        var item = ConversationItem.of(1, "t", "cat", "c", "u", null);

        service.enrichConversationTargets("u1", "LOGIN_DEPT", "로그인부서", "ko", List.of(item));

        assertThat(item.getTargetDeptCode()).isEqualTo("LOGIN_DEPT");
        assertThat(item.getTitle()).isEqualTo("t");
    }

    @Test
    @DisplayName("target_dept_code가 로그인 부서와 같으면 title prefix 없음")
    void skipsTitlePrefixWhenTargetIsLoginDept() {
        var mapping = new ConversationDeptMapping();
        mapping.setConversationId(10);
        mapping.setDeptCode("LOGIN_DEPT");
        when(userMapper.findConversationDeptMappingsByUserId("u1")).thenReturn(List.of(mapping));
        when(userMapper.findViewableTeamsById("u1", "ko"))
                .thenReturn(List.of(Team.of("LOGIN_DEPT", "로그인부서")));

        var item = ConversationItem.of(10, "제목", "cat", "c", "u", null);

        service.enrichConversationTargets("u1", "LOGIN_DEPT", "로그인부서", "ko", List.of(item));

        assertThat(item.getTargetDeptCode()).isEqualTo("LOGIN_DEPT");
        assertThat(item.getTitle()).isEqualTo("제목");
    }
}
