package xs.aichat.v2.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import xs.aichat.v2.constant.AichatSessionKeys;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.exception.HyobeeException;

import javax.servlet.http.HttpSession;

@Service
@RequiredArgsConstructor
public class ChatSessionServiceImpl implements ChatSessionService {

    private final ChatUserService chatUserService;

    @Override
    public void updateJwtTeamCode(User user, String teamCode, HttpSession session) {
        if (session == null) {
            throw new HyobeeException(HttpStatus.UNAUTHORIZED.toString(), "세션이 없습니다.");
        }

        String effectiveTeamCode = chatUserService.activateViewableTeam(
                user.getUserId(),
                user.getCorpCode(),
                teamCode
        );

        session.setAttribute(AichatSessionKeys.JWT_TEAM_CODE, effectiveTeamCode);
        // 다음 startMessageStream 호출 시 스트림 JWT만 재발급 (일반 jwt는 로그인 팀 유지)
        session.removeAttribute(AichatSessionKeys.STREAM_JWT);
    }
}
