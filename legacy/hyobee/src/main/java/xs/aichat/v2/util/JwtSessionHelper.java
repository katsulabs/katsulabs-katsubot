package xs.aichat.v2.util;

import io.jsonwebtoken.Claims;
import org.springframework.util.StringUtils;
import xs.aichat.service.HyobeeJwtTokenService;
import xs.aichat.v2.constant.AichatSessionKeys;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * WRTN 연동 JWT 세션 처리.
 * <ul>
 *   <li>일반 API: 로그인 시 DEPT_CODE</li>
 *   <li>SSE 채팅·RND 저널 목록: sidebar 콤보 JWT_TEAM_CODE (없으면 DEPT_CODE)</li>
 * </ul>
 */
public final class JwtSessionHelper {

    private JwtSessionHelper() {
    }

    /** 세션 UI 언어 (selectUserBase·VIEW_VOB_DEPT_INFO와 동일, 기본 ko) */
    public static String resolveLanguageCode(HttpSession session) {
        String languageCode = stringAttr(session, "LANGUAGE_CODE");
        if (!StringUtils.hasText(languageCode)) {
            return "ko";
        }
        return languageCode.toLowerCase();
    }

    /** 프로필 DEPT_NAME (세션, selectUserBase 기준) */
    public static String resolveLoginDeptName(HttpSession session) {
        return stringAttr(session, "DEPT_NAME");
    }

    /** 로그인 소속 팀 (프로필 DEPT_CODE) */
    public static String resolveLoginTeamCode(HttpSession session) {
        if (session == null) {
            return "";
        }
        Object deptCode = session.getAttribute("DEPT_CODE");
        return deptCode == null ? "" : deptCode.toString();
    }

    /** SSE 채팅용 팀 — 콤보 선택값 우선, 없으면 로그인 소속 */
    public static String resolveStreamTeamCode(HttpSession session) {
        if (session == null) {
            return "";
        }
        Object jwtTeamCode = session.getAttribute(AichatSessionKeys.JWT_TEAM_CODE);
        if (jwtTeamCode != null && StringUtils.hasText(jwtTeamCode.toString())) {
            return jwtTeamCode.toString();
        }
        return resolveLoginTeamCode(session);
    }

    /**
     * 일반 API / WRTN 호출용 JWT (로그인 DEPT_CODE).
     */
    public static String obtainAuthorizationJwt(HttpSession session, HyobeeJwtTokenService jwtService) {
        return obtainJwt(session, jwtService, resolveLoginTeamCode(session), AichatSessionKeys.JWT);
    }

    /**
     * startMessageStream SSE 채팅 전용 JWT (콤보 JWT_TEAM_CODE).
     */
    public static String obtainStreamAuthorizationJwt(HttpSession session, HyobeeJwtTokenService jwtService) {
        return obtainJwt(session, jwtService, resolveStreamTeamCode(session), AichatSessionKeys.STREAM_JWT);
    }

    private static String obtainJwt(
            HttpSession session,
            HyobeeJwtTokenService jwtService,
            String expectedTeamCode,
            String cacheKey
    ) {
        if (session == null || jwtService == null) {
            return null;
        }

        String userId = stringAttr(session, "USER_ID");
        if (!StringUtils.hasText(userId)) {
            return null;
        }

        String token = stringAttr(session, cacheKey);

        if (!isTokenValidForTeam(jwtService, token, expectedTeamCode)) {
            token = jwtService.generateToken(
                    userId,
                    stringAttr(session, "GBIS_CORP_CODE"),
                    stringAttr(session, "PG_CODE"),
                    stringAttr(session, "PU_CODE"),
                    expectedTeamCode,
                    List.of("ROLE_USER", "ROLE_ADMIN")
            );
            if (StringUtils.hasText(token)) {
                session.setAttribute(cacheKey, token);
            } else {
                session.removeAttribute(cacheKey);
                return null;
            }
        }

        return token;
    }

    private static boolean isTokenValidForTeam(
            HyobeeJwtTokenService jwtService,
            String token,
            String expectedTeamCode
    ) {
        if (!StringUtils.hasText(token)) {
            return false;
        }
        try {
            Claims claims = jwtService.validateToken(token);
            String claimTeamCode = claims.get("teamCode", String.class);
            return StringUtils.hasText(expectedTeamCode) && expectedTeamCode.equals(claimTeamCode);
        } catch (Exception ignored) {
            return false;
        }
    }

    private static String stringAttr(HttpSession session, String key) {
        Object value = session.getAttribute(key);
        return value == null ? "" : String.valueOf(value);
    }
}
