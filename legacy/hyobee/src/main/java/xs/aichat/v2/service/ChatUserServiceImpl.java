package xs.aichat.v2.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import xs.aichat.v2.dto.ConversationDeptMapping;
import xs.aichat.v2.dto.Team;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.dto.internal.response.ConversationItem;
import xs.aichat.v2.exception.HyobeeException;
import xs.aichat.v2.mapper.UserMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatUserServiceImpl implements ChatUserService {

    private final UserMapper userMapper;

    @Override
    public Optional<User> findById(String userId) {
        return Optional.ofNullable(userMapper.findById(userId));
    }

    @Override
    public List<Team> findViewableTeamsById(String userId, String languageCode) {
        var resolvedLanguage = StringUtils.hasText(languageCode) ? languageCode.toLowerCase() : "ko";
        var viewableTeamsById = userMapper.findViewableTeamsById(userId, resolvedLanguage);
        if (viewableTeamsById == null) {
            return List.of();
        }
        return viewableTeamsById;
    }

    @Override
    public void assertViewableTeam(String userId, String teamCode) {
        if (!StringUtils.hasText(teamCode)) {
            throw new HyobeeException(HttpStatus.BAD_REQUEST.toString(), "팀 코드가 필요합니다.");
        }

        var teamCodes = userMapper.findAllViewableTeamCodesByUserId(userId);
        if (teamCodes != null && teamCodes.stream().anyMatch(teamCode::equals)) {
            return;
        }

        var user = findById(userId)
                .orElseThrow(() -> new HyobeeException(
                        HttpStatus.UNAUTHORIZED.toString(),
                        "사용자 정보를 찾을 수 없습니다."
                ));
        if (!teamCode.equals(user.getTeamCode())) {
            throw new HyobeeException(HttpStatus.FORBIDDEN.toString(), "조회 권한이 없는 팀입니다.");
        }
    }

    @Override
    @Transactional
    public String activateViewableTeam(String userId, String corpCode, String teamCode) {
        assertViewableTeam(userId, teamCode);

        var teamCodes = userMapper.findAllViewableTeamCodesByUserId(userId);
        if (teamCodes != null && !teamCodes.isEmpty()) {
            userMapper.deactivateAllViewableTeams(userId);
            if (userMapper.activateViewableTeam(userId, corpCode, teamCode) > 0) {
                return teamCode;
            }
            throw new HyobeeException(
                    HttpStatus.NOT_FOUND.toString(),
                    "조회 가능 팀 메타데이터가 없습니다."
            );
        }

        // 단일 권한( chat_viewable_teams 행 없음 ): DB 갱신 없이 요청 teamCode를 세션에 사용
        log.debug("일반 사용자이므로 조회 팀 활성화 DB 갱신을 건너뜁니다. userId: {}, teamCode: {}", userId, teamCode);
        return teamCode;
    }

    @Override
    @Transactional
    public void appendConversation(String userId, String corpCode, String teamCode, String conversationId) {
        // 1. 권한 검증 (일반 유저/다중 권한 유저 공통 체크)
        assertViewableTeam(userId, teamCode);

        // 2. 다중 권한 설정 대상자인지 확인
        var teamCodes = userMapper.findAllViewableTeamCodesByUserId(userId);

        // 3. 다중 권한 테이블에 데이터가 존재하는 유저만 맵핑 데이터 추가/수정 진행
        if (teamCodes != null && !teamCodes.isEmpty()) {
            if (userMapper.appendConversation(userId, corpCode, teamCode, conversationId) > 0) {
                return;
            }
            throw new HyobeeException(
                    HttpStatus.NOT_FOUND.toString(),
                    "해당 팀의 대화 메타데이터가 없습니다."
            );
        }

        // 4. 일반 사용자(데이터가 없는 사람)는 다중 권한 매핑이 필요 없으므로 그냥 통과(Bypass)
        log.debug("일반 사용자이므로 대화 매핑 추가를 건너뜁니다. userId: {}, conversationId: {}", userId, conversationId);
    }

    @Override
    @Transactional
    public void removeConversations(String userId, List<String> conversationIds) {
        if (conversationIds == null || conversationIds.isEmpty()) {
            return;
        }
        userMapper.removeConversations(userId, conversationIds);
    }

    @Override
    public void enrichConversationTargets(
            String userId,
            String loginDeptCode,
            String loginDeptName,
            String languageCode,
            List<ConversationItem> items
    ) {
        if (items == null || items.isEmpty()) {
            return;
        }

        var mappings = userMapper.findConversationDeptMappingsByUserId(userId);
        Map<String, String> conversationToDept = new HashMap<>();
        if (mappings != null) {
            for (ConversationDeptMapping mapping : mappings) {
                if (mapping == null || mapping.getConversationId() == null) {
                    continue;
                }
                conversationToDept.putIfAbsent(mapping.getConversationId(), mapping.getDeptCode());
            }
        }

        Map<String, String> deptCodeToName = resolveDeptCodeToName(
                userId, loginDeptCode, loginDeptName, languageCode
        );

        for (ConversationItem item : items) {
            if (item == null) {
                continue;
            }
            String conversationId = item.getConversationId();
            String targetDept = StringUtils.hasText(conversationId) ? conversationToDept.get(conversationId) : null;
            // conversations 배열에 없으면 로그인 부서 = target (prefix·JWT 기본 부서)
            if (!StringUtils.hasText(targetDept)) {
                targetDept = loginDeptCode;
            }
            item.setTargetDeptCode(targetDept);

            if (!shouldPrefixTitleForOtherDept(loginDeptCode, targetDept)) {
                continue;
            }
            var deptName = deptCodeToName.get(targetDept);
            if (StringUtils.hasText(deptName)) {
                item.setTitle(prefixTitleWithDeptName(item.getTitle(), deptName));
            }
        }
    }

    /** 로그인 부서와 대상 부서가 다를 때만 목록 title에 (dept_name) prefix */
    private static boolean shouldPrefixTitleForOtherDept(String loginDeptCode, String targetDeptCode) {
        if (!StringUtils.hasText(loginDeptCode) || !StringUtils.hasText(targetDeptCode)) {
            return true;
        }
        return !loginDeptCode.equals(targetDeptCode);
    }

    private Map<String, String> resolveDeptCodeToName(
            String userId,
            String loginDeptCode,
            String loginDeptName,
            String languageCode
    ) {
        Map<String, String> deptCodeToName = new HashMap<>();
        var resolvedLanguage = StringUtils.hasText(languageCode) ? languageCode.toLowerCase() : "ko";
        var viewableDeptNames = userMapper.findViewableTeamsById(userId, resolvedLanguage);
        if (viewableDeptNames != null) {
            for (Team team : viewableDeptNames) {
                if (team == null || !StringUtils.hasText(team.getCode())) {
                    continue;
                }
                deptCodeToName.put(team.getCode(), team.getName());
            }
        }
        if (StringUtils.hasText(loginDeptCode) && StringUtils.hasText(loginDeptName)) {
            deptCodeToName.putIfAbsent(loginDeptCode, loginDeptName);
        }
        return deptCodeToName;
    }

    private static String prefixTitleWithDeptName(String title, String deptName) {
        var safeTitle = title != null ? title : "";
        var prefix = "(" + deptName + ")";
        if (safeTitle.startsWith(prefix)) {
            return safeTitle;
        }
        return prefix + safeTitle;
    }

}
