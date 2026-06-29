package xs.aichat.katsubot.service;

import org.springframework.util.StringUtils;
import xs.aichat.v2.util.JwtSessionHelper;

import javax.servlet.http.HttpSession;

public final class KatsubotSessionHelper {

    private KatsubotSessionHelper() {
    }

    public static String resolveLoginTeamCode(HttpSession session, String fallbackTeamCode) {
        var loginDeptCode = JwtSessionHelper.resolveLoginTeamCode(session);
        if (StringUtils.hasText(loginDeptCode)) {
            return loginDeptCode;
        }
        return fallbackTeamCode;
    }

    public static String resolveLoginDeptName(HttpSession session, String fallbackTeamName) {
        var loginDeptName = JwtSessionHelper.resolveLoginDeptName(session);
        if (StringUtils.hasText(loginDeptName)) {
            return loginDeptName;
        }
        return fallbackTeamName;
    }

    public static String resolveLanguageCode(HttpSession session) {
        return JwtSessionHelper.resolveLanguageCode(session);
    }
}
