package xs.aichat.v2.service;

import xs.aichat.v2.dto.User;

import javax.servlet.http.HttpSession;

public interface ChatSessionService {

    /** WRTN JWT claim용 teamCode만 갱신 (DEPT_CODE·프로필은 변경하지 않음) */
    void updateJwtTeamCode(User user, String teamCode, HttpSession session);
}
