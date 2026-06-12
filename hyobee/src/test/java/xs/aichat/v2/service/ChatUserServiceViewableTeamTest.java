package xs.aichat.v2.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.exception.HyobeeException;
import xs.aichat.v2.mapper.UserMapper;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ChatUserService 조회팀/대화 연동 테스트")
class ChatUserServiceViewableTeamTest {

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private ChatUserServiceImpl service;

    @Test
    @DisplayName("activateViewableTeam — 다중 권한: is_active 토글 후 선택 teamCode 반환")
    void activateViewableTeam_deactivatesThenActivates() {
        when(userMapper.findAllViewableTeamCodesByUserId("u1")).thenReturn(List.of("T1", "T2"));
        when(userMapper.activateViewableTeam("u1", "C1", "T2")).thenReturn(1);

        var effectiveTeamCode = service.activateViewableTeam("u1", "C1", "T2");

        assertThat(effectiveTeamCode).isEqualTo("T2");
        verify(userMapper).deactivateAllViewableTeams("u1");
        verify(userMapper).activateViewableTeam("u1", "C1", "T2");
    }

    @Test
    @DisplayName("activateViewableTeam — 다중 권한: 메타 activate 실패 시 예외")
    void activateViewableTeam_throwsWhenMultiPermissionActivateFails() {
        when(userMapper.findAllViewableTeamCodesByUserId("u1")).thenReturn(List.of("T1"));
        when(userMapper.activateViewableTeam("u1", "C1", "T1")).thenReturn(0);

        assertThatThrownBy(() -> service.activateViewableTeam("u1", "C1", "T1"))
                .isInstanceOf(HyobeeException.class);

        verify(userMapper).deactivateAllViewableTeams("u1");
        verify(userMapper).activateViewableTeam("u1", "C1", "T1");
    }

    @Test
    @DisplayName("activateViewableTeam — 단일 권한: DB skip 후 요청 teamCode 반환")
    void activateViewableTeam_skipsDbForSinglePermissionUser() {
        when(userMapper.findAllViewableTeamCodesByUserId("u1")).thenReturn(List.of());
        var user = new User();
        user.setTeamCode("MYDEPT");
        when(userMapper.findById("u1")).thenReturn(user);

        var effectiveTeamCode = service.activateViewableTeam("u1", "C1", "MYDEPT");

        assertThat(effectiveTeamCode).isEqualTo("MYDEPT");
        verify(userMapper, never()).deactivateAllViewableTeams(anyString());
        verify(userMapper, never()).activateViewableTeam(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("appendConversation — 메타 행 없으면 예외 (conversations만 갱신)")
    void appendConversation_throwsWhenNoRow() {
        when(userMapper.findAllViewableTeamCodesByUserId("u1")).thenReturn(List.of("T1"));
        when(userMapper.appendConversation("u1", "C1", "T1", 42)).thenReturn(0);

        assertThatThrownBy(() -> service.appendConversation("u1", "C1", "T1", 42))
                .isInstanceOf(HyobeeException.class);

        verify(userMapper).appendConversation("u1", "C1", "T1", 42);
    }

    @Test
    @DisplayName("appendConversation — 기존 행에 conversation_id append")
    void appendConversation_updatesExistingRow() {
        when(userMapper.findAllViewableTeamCodesByUserId("u1")).thenReturn(List.of("T1"));
        when(userMapper.appendConversation("u1", "C1", "T1", 42)).thenReturn(1);

        service.appendConversation("u1", "C1", "T1", 42);

        verify(userMapper).appendConversation("u1", "C1", "T1", 42);
    }

    @Test
    @DisplayName("removeConversations — userId 기준 mapper 호출")
    void removeConversations_callsMapper() {
        service.removeConversations("u1", List.of(1, 2));

        verify(userMapper).removeConversations(eq("u1"), eq(List.of(1, 2)));
    }

    @Test
    @DisplayName("assertViewableTeam — DB에 없으면 본인 dept만 허용")
    void assertViewableTeam_allowsOwnDeptWhenNoRows() {
        when(userMapper.findAllViewableTeamCodesByUserId("u1")).thenReturn(List.of());
        var user = new User();
        user.setTeamCode("MYDEPT");
        when(userMapper.findById("u1")).thenReturn(user);

        service.assertViewableTeam("u1", "MYDEPT");

        verify(userMapper).findById("u1");
    }
}
