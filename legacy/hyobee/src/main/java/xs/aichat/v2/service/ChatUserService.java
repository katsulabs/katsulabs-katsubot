package xs.aichat.v2.service;

import xs.aichat.v2.dto.Team;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.dto.internal.response.ConversationItem;

import java.util.List;
import java.util.Optional;

public interface ChatUserService {

    Optional<User> findById(String userId);

    /** selectbox: is_deleted=false 인 조회 가능 팀 (세션 언어 dept_name) */
    List<Team> findViewableTeamsById(String userId, String languageCode);

    void assertViewableTeam(String userId, String teamCode);

    /** @return 세션 JWT에 반영할 teamCode (단일 권한은 DB skip, 다중 권한은 is_active 갱신) */
    String activateViewableTeam(String userId, String corpCode, String teamCode);

    void appendConversation(String userId, String corpCode, String teamCode, String conversationId);

    void removeConversations(String userId, List<String> conversationIds);

    /**
     * 대화 목록 BFF enrichment: target_dept_code, 타 부서 대화만 title에 (dept_name) prefix.
     * target_dept_code: conversations 배열에 있으면 해당 dept_code, 없으면 loginDeptCode.
     */
    void enrichConversationTargets(
            String userId,
            String loginDeptCode,
            String loginDeptName,
            String languageCode,
            List<ConversationItem> items
    );
}
