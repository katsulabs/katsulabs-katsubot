package xs.aichat.v2.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import xs.aichat.v2.dto.ConversationDeptMapping;
import xs.aichat.v2.dto.Team;
import xs.aichat.v2.dto.User;

import java.util.List;

@Mapper
public interface UserMapper {

    User findById(@Param("userId") String userId);

    User findUserByIdAndCodes(@Param("userId") String userId,
                              @Param("pgCode") String pgCode,
                              @Param("puCode") String puCode,
                              @Param("corpCode") String corpCode,
                              @Param("teamCode") String teamCode
    );

    List<Team> findViewableTeamsById(
            @Param("userId") String userId,
            @Param("languageCode") String languageCode
    );

    List<ConversationDeptMapping> findConversationDeptMappingsByUserId(@Param("userId") String userId);

    String findActiveViewableDeptCode(@Param("userId") String userId);

    int countViewableTeamsByUserId(@Param("userId") String userId);

    List<String> findAllViewableTeamCodesByUserId(@Param("userId") String userId);

    int deactivateAllViewableTeams(@Param("userId") String userId);

    int activateViewableTeam(
            @Param("userId") String userId,
            @Param("corpCode") String corpCode,
            @Param("deptCode") String deptCode
    );

    int appendConversation(
            @Param("userId") String userId,
            @Param("corpCode") String corpCode,
            @Param("deptCode") String deptCode,
            @Param("conversationId") int conversationId
    );

    int removeConversations(
            @Param("userId") String userId,
            @Param("conversationIds") List<Integer> conversationIds
    );
}
