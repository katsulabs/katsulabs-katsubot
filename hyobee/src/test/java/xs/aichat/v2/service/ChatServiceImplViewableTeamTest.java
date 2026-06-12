package xs.aichat.v2.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import xs.aichat.v2.constant.AichatSessionKeys;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.dto.internal.request.ConversationRequest;
import xs.aichat.v2.dto.internal.request.CreateConversationRequest;
import xs.aichat.v2.dto.internal.request.DeleteConversationRequest;
import xs.aichat.v2.dto.internal.response.ConversationItem;
import xs.aichat.v2.dto.internal.response.ConversationsResponse;
import xs.aichat.v2.dto.internal.response.CreateConversationResponse;
import xs.aichat.v2.dto.internal.response.DeleteConversationsResponse;
import xs.aichat.v2.external.ChatVendorClient;

import javax.servlet.http.HttpSession;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ChatServiceImpl viewable team 연동 테스트")
class ChatServiceImplViewableTeamTest {

    @Mock
    private ChatVendorClient chatVendorClient;

    @Mock
    private ChatFileService chatFileService;

    @Mock
    private ChatUserService chatUserService;

    @Mock
    private HttpSession session;

    @InjectMocks
    private ChatServiceImpl chatService;

    @Test
    @DisplayName("createConversation — WRTN 성공 후 stream team으로 conversations append")
    void createConversation_appendsConversationForStreamTeam() {
        var user = new User();
        user.setUserId("u1");
        user.setCorpCode("C1");

        var request = new CreateConversationRequest();
        request.setUserId("u1");
        request.setUserQuery("hello");
        request.setChatCategory("internal_rules");

        when(session.getAttribute(AichatSessionKeys.JWT_TEAM_CODE)).thenReturn("T9");
        when(chatVendorClient.createConversation(request))
                .thenReturn(CreateConversationResponse.of(100, "t", "internal_rules", null, null));

        chatService.createConversation(request, user, session);

        verify(chatUserService).appendConversation("u1", "C1", "T9", 100);
    }

    @Test
    @DisplayName("selectConversations — WRTN 조회 후 target_dept_code enrichment")
    void selectConversations_enrichesTargets() {
        var request = new ConversationRequest();
        request.setUserId("u1");
        var item = ConversationItem.of(1, "t", "cat", "c", "u", null);
        var response = ConversationsResponse.of(List.of(item), 1, 0, 20, false);
        when(chatVendorClient.selectConversations(request)).thenReturn(response);

        chatService.selectConversations(request, "LOGIN", "로그인팀", "en");

        verify(chatUserService).enrichConversationTargets("u1", "LOGIN", "로그인팀", "en", response.getContent());
    }

    @Test
    @DisplayName("deleteConversations — WRTN 삭제 후 DB conversations에서 제거")
    void deleteConversations_removesFromViewableTeams() {
        var user = new User();
        user.setUserId("u1");

        var request = new DeleteConversationRequest();
        request.setUserId("u1");
        request.setConversationIds(List.of("10", "20"));

        when(chatVendorClient.deleteConversations(request))
                .thenReturn(DeleteConversationsResponse.of(200, "u1", null, 2, List.of()));

        chatService.deleteConversations(request, user);

        verify(chatUserService).removeConversations(eq("u1"), eq(List.of(10, 20)));
    }
}
