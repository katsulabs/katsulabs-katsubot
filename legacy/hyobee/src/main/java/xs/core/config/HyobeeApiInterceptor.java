package xs.core.config;

import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingResponseWrapper;
import xs.aichat.service.HyobeeJwtTokenService;
import xs.aichat.v2.exception.HyobeeException;
import xs.aichat.v2.util.JwtSessionHelper;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Optional;
import java.util.UUID;

/**
 * /xs/aichat/** 전용 인터셉터.
 * - 레거시 XtrmHandlerInterceptor의 jsonData/ENCRYPT_PARAMS 의존성에서 분리
 * - aichat v2 스타일(REST-ish, DTO, 외부 API 연동)에 맞는 가벼운 전처리/로깅만 담당
 */
@Slf4j
@RequiredArgsConstructor
public class HyobeeApiInterceptor implements HandlerInterceptor {

    private static final String REQUEST_UUID_KEY = "REQUEST_UUID";
    private static final String USER_ID_KEY = "USER_ID";
    private static final String PG_CODE_KEY = "PG_CODE";
    private static final String PU_CODE_KEY = "PU_CODE";
    private static final String CORP_CODE_KEY = "CORP_CODE";
    private static final String GBIS_CORP_CODE_KEY = "GBIS_CORP_CODE";
    private static final String DEPT_CODE_KEY = "DEPT_CODE";
    private static final String SESSION_JWT_ATTRIBUTE = "jwt";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String LOGIN_TYPE_COOKIE = "loginType";
    private static final String LOGIN_TYPE_SSO = "SSO";
    private static final String LOGIN_TYPE_NORMAL = "NORMAL";
    private static final int LOGIN_TYPE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

    private final HyobeeJwtTokenService hyobeeJwtTokenService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestUri = request.getRequestURI();
        HttpMethod httpMethod = HttpMethod.resolve(request.getMethod());

        // 요청 UUID 부여 (기존 XtrmHandlerInterceptor의 REQUEST_UUID 대체용)
        String requestId = UUID.randomUUID().toString();
        request.setAttribute(REQUEST_UUID_KEY, requestId);

        HttpSession session = request.getSession(false);
        String sessionUserId = Optional.ofNullable(session)
                .map(s -> s.getAttribute(USER_ID_KEY))
                .map(Object::toString)
                .orElse(null);

        String sessionJwt = extractSessionJwt(session);
        String headerJwt = extractHeaderJwt(request);

        ResolvedJwt resolvedJwt = resolveJwtToken(sessionJwt, headerJwt);
        String jwtToken = resolvedJwt.getToken();
        if (resolvedJwt.getClaims() != null) {
            String resolvedUserId = resolvedJwt.getClaims().getSubject();
            if (!StringUtils.hasText(sessionUserId) || resolvedJwt.isFromHeader()) {
                session = ensureSessionWithClaims(request, session, resolvedJwt.getClaims(), jwtToken);
                sessionUserId = resolvedUserId;
            }
        }

        if (!StringUtils.hasText(sessionUserId)) {
            throw new HyobeeException(HttpStatus.UNAUTHORIZED.toString(), "권한이 없는 사용자입니다. 로그인 해주세요.");
        }

        log.info("{} {} requestUuid={}, sessionUserId={}, query={}",
                httpMethod, requestUri, requestId, sessionUserId, request.getQueryString());

        if (session != null) {
            String refreshed = JwtSessionHelper.obtainAuthorizationJwt(session, hyobeeJwtTokenService);
            if (StringUtils.hasText(refreshed)) {
                jwtToken = refreshed;
            } else if (!StringUtils.hasText(jwtToken)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Cannot issue JWT token.");
                return false;
            }
            session.setAttribute(SESSION_JWT_ATTRIBUTE, jwtToken);
        } else if (!StringUtils.hasText(jwtToken)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Cannot issue JWT token.");
            return false;
        }
        ensureLoginTypeCookie(request, response);

        return true;
    }

    private Claims validateJwtOrNull(String jwtToken) {
        try {
            return hyobeeJwtTokenService.validateToken(jwtToken);
        } catch (Exception ignored) {
            return null;
        }
    }

    private String extractSessionJwt(HttpSession session) {
        return Optional.ofNullable(session)
                .map(s -> s.getAttribute(SESSION_JWT_ATTRIBUTE))
                .map(Object::toString)
                .filter(StringUtils::hasText)
                .orElse(null);
    }

    private String extractHeaderJwt(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(HttpHeaders.AUTHORIZATION))
                .filter(h -> h.startsWith(BEARER_PREFIX))
                .map(h -> h.substring(BEARER_PREFIX.length()).trim())
                .filter(StringUtils::hasText)
                .orElse(null);
    }

    private ResolvedJwt resolveJwtToken(String sessionJwt, String headerJwt) {
        if (StringUtils.hasText(headerJwt)) {
            Claims claims = validateJwtOrNull(headerJwt);
            if (claims != null) {
                return new ResolvedJwt(headerJwt, claims, true);
            }
        }

        if (StringUtils.hasText(sessionJwt)) {
            Claims claims = validateJwtOrNull(sessionJwt);
            if (claims != null) {
                return new ResolvedJwt(sessionJwt, claims, false);
            }
        }

        return new ResolvedJwt(null, null, false);
    }

    private HttpSession ensureSessionWithClaims(HttpServletRequest request, HttpSession session, Claims claims, String jwtToken) {
        HttpSession targetSession = (session != null) ? session : request.getSession(true);
        if (targetSession == null) {
            return null;
        }

        targetSession.setAttribute(USER_ID_KEY, claims.getSubject());
        targetSession.setAttribute(PG_CODE_KEY, claims.get("pgCode", String.class));
        targetSession.setAttribute(PU_CODE_KEY, claims.get("puCode", String.class));

        String corpCode = claims.get("corpCode", String.class);
        targetSession.setAttribute(CORP_CODE_KEY, corpCode);
        targetSession.setAttribute(GBIS_CORP_CODE_KEY, corpCode);
        targetSession.setAttribute(DEPT_CODE_KEY, claims.get("teamCode", String.class));
        targetSession.setAttribute(SESSION_JWT_ATTRIBUTE, jwtToken);

        return targetSession;
    }

    private void ensureLoginTypeCookie(HttpServletRequest request, HttpServletResponse response) {
        String currentLoginType = getCookieValue(request, LOGIN_TYPE_COOKIE);
        if (LOGIN_TYPE_SSO.equalsIgnoreCase(currentLoginType)) {
            return;
        }

        Cookie cookie = new Cookie(LOGIN_TYPE_COOKIE, LOGIN_TYPE_NORMAL);
        cookie.setPath("/");
        cookie.setMaxAge(LOGIN_TYPE_COOKIE_MAX_AGE);
        response.addCookie(cookie);
    }

    private String getCookieValue(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || name == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (cookie != null && name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    @Data
    @AllArgsConstructor
    private static class ResolvedJwt {

        private String token;

        private Claims claims;

        private boolean fromHeader;
    }
}

