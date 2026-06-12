package xs.core.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import xs.aichat.service.HyobeeJwtTokenService;
import xs.aichat.v2.exception.HyobeeException;

import javax.servlet.http.Cookie;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("HyobeeApiInterceptor 단위 테스트")
class HyobeeApiInterceptorTest {

    @Mock
    private HyobeeJwtTokenService jwtTokenService;

    private HyobeeApiInterceptor interceptor;

    @BeforeEach
    void setUp() {
        interceptor = new HyobeeApiInterceptor(jwtTokenService);
    }

    @Test
    @DisplayName("세션 USER_ID만 있으면 JWT 재발급 후 통과")
    void preHandle_successWithSessionUserId() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/xs/aichat/v2/messages");
        var session = request.getSession(true);
        session.setAttribute("USER_ID", "user01");
        session.setAttribute("GBIS_CORP_CODE", "1000");
        session.setAttribute("PG_CODE", "PG01");
        session.setAttribute("PU_CODE", "PU01");
        session.setAttribute("DEPT_CODE", "T001");

        when(jwtTokenService.generateToken(anyString(), anyString(), anyString(), anyString(), anyString(), anyList()))
                .thenReturn("generated-jwt");

        MockHttpServletResponse response = new MockHttpServletResponse();

        boolean allowed = interceptor.preHandle(request, response, new Object());

        assertThat(allowed).isTrue();
        assertThat(session.getAttribute("jwt")).isEqualTo("generated-jwt");
        assertThat(request.getAttribute("REQUEST_UUID")).isNotNull();
    }

    @Test
    @DisplayName("유효한 Bearer JWT면 세션을 보강하고 통과")
    void preHandle_successWithBearerJwt() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/xs/aichat/v2/messages");
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer header-jwt");

        Claims claims = Jwts.claims()
                .subject("user01")
                .add("corpCode", "1000")
                .add("pgCode", "PG01")
                .add("puCode", "PU01")
                .add("teamCode", "T001")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .build();

        when(jwtTokenService.validateToken("header-jwt")).thenReturn(claims);

        MockHttpServletResponse response = new MockHttpServletResponse();

        boolean allowed = interceptor.preHandle(request, response, new Object());

        assertThat(allowed).isTrue();
        var session = request.getSession(false);
        assertThat(session).isNotNull();
        assertThat(session.getAttribute("USER_ID")).isEqualTo("user01");
        assertThat(session.getAttribute("DEPT_CODE")).isEqualTo("T001");
    }

    @Test
    @DisplayName("Bearer JWT가 무효하면 세션 JWT로 fallback")
    void preHandle_fallbackToSessionJwtWhenBearerInvalid() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/xs/aichat/v2/messages");
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer invalid-jwt");
        var session = request.getSession(true);
        session.setAttribute("USER_ID", "user01");
        session.setAttribute("jwt", "session-jwt");
        session.setAttribute("GBIS_CORP_CODE", "1000");
        session.setAttribute("PG_CODE", "PG01");
        session.setAttribute("PU_CODE", "PU01");
        session.setAttribute("DEPT_CODE", "T001");

        Claims claims = Jwts.claims()
                .subject("user01")
                .add("teamCode", "T001")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .build();

        when(jwtTokenService.validateToken("invalid-jwt")).thenThrow(new RuntimeException("invalid"));
        when(jwtTokenService.validateToken("session-jwt")).thenReturn(claims);

        MockHttpServletResponse response = new MockHttpServletResponse();

        boolean allowed = interceptor.preHandle(request, response, new Object());

        assertThat(allowed).isTrue();
        verify(jwtTokenService, atLeastOnce()).validateToken("session-jwt");
    }

    @Test
    @DisplayName("사용자 식별 불가면 401 HyobeeException")
    void preHandle_unauthorizedWhenUserMissing() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/xs/aichat/v2/messages");
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertThatThrownBy(() -> interceptor.preHandle(request, response, new Object()))
                .isInstanceOf(HyobeeException.class)
                .hasMessageContaining("권한이 없는 사용자입니다");
    }

    @Test
    @DisplayName("loginType=SSO 쿠키가 있으면 NORMAL 쿠키로 덮어쓰지 않음")
    void preHandle_keepSsoLoginTypeCookie() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/xs/aichat/v2/messages");
        request.setCookies(new Cookie("loginType", "SSO"));
        var session = request.getSession(true);
        session.setAttribute("USER_ID", "user01");
        session.setAttribute("GBIS_CORP_CODE", "1000");
        session.setAttribute("PG_CODE", "PG01");
        session.setAttribute("PU_CODE", "PU01");
        session.setAttribute("DEPT_CODE", "T001");

        when(jwtTokenService.generateToken(anyString(), anyString(), anyString(), anyString(), anyString(), anyList()))
                .thenReturn("generated-jwt");

        MockHttpServletResponse response = new MockHttpServletResponse();

        interceptor.preHandle(request, response, new Object());

        Cookie loginTypeCookie = response.getCookie("loginType");
        assertThat(loginTypeCookie).isNull();
    }

    @Test
    @DisplayName("loginType 쿠키가 없으면 NORMAL 쿠키 설정")
    void preHandle_setsNormalLoginTypeCookie() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/xs/aichat/v2/messages");
        var session = request.getSession(true);
        session.setAttribute("USER_ID", "user01");
        session.setAttribute("GBIS_CORP_CODE", "1000");
        session.setAttribute("PG_CODE", "PG01");
        session.setAttribute("PU_CODE", "PU01");
        session.setAttribute("DEPT_CODE", "T001");

        when(jwtTokenService.generateToken(anyString(), anyString(), anyString(), anyString(), anyString(), anyList()))
                .thenReturn("generated-jwt");

        MockHttpServletResponse response = new MockHttpServletResponse();

        interceptor.preHandle(request, response, new Object());

        Cookie loginTypeCookie = response.getCookie("loginType");
        assertThat(loginTypeCookie).isNotNull();
        assertThat(loginTypeCookie.getValue()).isEqualTo("NORMAL");
        assertThat(loginTypeCookie.getPath()).isEqualTo("/");
        assertThat(loginTypeCookie.getMaxAge()).isEqualTo(60 * 60 * 24 * 30);
    }
}
