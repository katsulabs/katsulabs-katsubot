package xs.aichat.service;

import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import xs.aichat.dto.VobLoginResult;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.exception.HyobeeException;
import xs.aichat.v2.service.ChatUserResolver;
import xs.core.property.XtrmProperty;
import xs.webbase.login.service.LoginService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

@Slf4j
@ExtendWith(MockitoExtension.class)
@DisplayName("hyobeeSSOServiceImpl.handleVobLogin 테스트")
class HyobeeSSOServiceImplTest {

    @Mock
    private XtrmProperty xtrmProperty;

    @Mock
    private ChatUserResolver chatUserResolver;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private LoginService loginService;

    private HyobeeSSOServiceImpl hyobeeSSOServiceImpl;

    private KeyPair keyPair;

    @BeforeEach
    void setUp() throws Exception {
        hyobeeSSOServiceImpl = spy(new HyobeeSSOServiceImpl(xtrmProperty, loginService, chatUserResolver));

        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        keyPair = generator.generateKeyPair();
    }

    @Test
    @DisplayName("정상 토큰 + 사용자 존재 시 success=true")
    void handleVobLogin_success() throws Exception {
        stubPublicKeyLookup();
        String token = createSignedToken(Map.of("samaccountname", "user01"));
        when(request.getParameter("id_token")).thenReturn(token);
        when(request.getHeader("Accept-Language")).thenReturn("ko-KR,ko;q=0.9,en;q=0.8");

        User foundUser = new User();
        foundUser.setUserId("user01");
        when(chatUserResolver.requireById("user01")).thenReturn(foundUser);

        VobLoginResult result = hyobeeSSOServiceImpl.handleVobLogin(request, response);
        logFrontendOutcome(result);

        assertTrue(result.isSuccess());
        assertNull(result.getErrorData());
        verify(loginService).loginHyobeeSSO(any(), eq(request), any(), eq("ko"), eq(response));
    }

    @Test
    @DisplayName("samaccountname 누락 시 사용자 아이디 오류 반환")
    void handleVobLogin_failWhenSamaccountnameMissing() throws Exception {
        stubPublicKeyLookup();
        String token = createSignedToken(new HashMap<>());
        when(request.getParameter("id_token")).thenReturn(token);

        VobLoginResult result = hyobeeSSOServiceImpl.handleVobLogin(request, response);
        logFrontendOutcome(result);

        assertFalse(result.isSuccess());
        assertEquals("로그인 정보 확인 중 오류가 발생했습니다.", result.getErrorData());
    }

    @Test
    @DisplayName("사용자 조회 실패 시 사용자 정보 오류 반환")
    void handleVobLogin_failWhenUserNotFound() throws Exception {
        stubPublicKeyLookup();
        String token = createSignedToken(Map.of("samaccountname", "missing-user"));
        when(request.getParameter("id_token")).thenReturn(token);
        when(chatUserResolver.requireById("missing-user"))
                .thenThrow(new HyobeeException(HttpStatus.UNAUTHORIZED.toString(), "팀 정보를 불러오지 못했습니다."));

        VobLoginResult result = hyobeeSSOServiceImpl.handleVobLogin(request, response);
        logFrontendOutcome(result);

        assertFalse(result.isSuccess());
        assertEquals("팀 정보를 불러오지 못했습니다.", result.getErrorData());
    }

    @Test
    @DisplayName("id_token 누락 시 실패 반환")
    void handleVobLogin_failWhenTokenMissing() {
        when(request.getParameter("id_token")).thenReturn(null);

        VobLoginResult result = hyobeeSSOServiceImpl.handleVobLogin(request, response);
        logFrontendOutcome(result);

        assertFalse(result.isSuccess());
        assertNotNull(result.getErrorData());
    }

    @Test
    @DisplayName("지원하지 않는 Accept-Language는 en으로 fallback")
    void handleVobLogin_fallbackLanguageToEnglish() throws Exception {
        stubPublicKeyLookup();
        String token = createSignedToken(Map.of("samaccountname", "user01"));
        when(request.getParameter("id_token")).thenReturn(token);
        when(request.getHeader("Accept-Language")).thenReturn("fr-FR,fr;q=0.9");

        User foundUser = new User();
        foundUser.setUserId("user01");
        when(chatUserResolver.requireById("user01")).thenReturn(foundUser);

        VobLoginResult result = hyobeeSSOServiceImpl.handleVobLogin(request, response);

        assertTrue(result.isSuccess());
        verify(loginService).loginHyobeeSSO(any(), eq(request), any(), eq("en"), eq(response));
    }

    @Test
    @DisplayName("잘못된 JWT 형식이면 실패 결과 반환")
    void handleVobLogin_failWhenJwtFormatInvalid() {
        when(request.getParameter("id_token")).thenReturn("invalid-token");

        VobLoginResult result = hyobeeSSOServiceImpl.handleVobLogin(request, response);

        assertFalse(result.isSuccess());
        assertTrue(
                result.getErrorData().contains("JWT")
                        || result.getErrorData().contains("SSO 처리 중 내부 오류")
        );
    }

    @Test
    @DisplayName("loginHyobeeSSO 내부 예외 발생 시 내부 오류 메시지 반환")
    void handleVobLogin_failWhenLoginServiceThrows() throws Exception {
        stubPublicKeyLookup();
        String token = createSignedToken(Map.of("samaccountname", "user01"));
        when(request.getParameter("id_token")).thenReturn(token);

        User foundUser = new User();
        foundUser.setUserId("user01");
        when(chatUserResolver.requireById("user01")).thenReturn(foundUser);
        when(loginService.loginHyobeeSSO(any(), any(), any(), any(), any()))
                .thenThrow(new RuntimeException("legacy login service error"));

        VobLoginResult result = hyobeeSSOServiceImpl.handleVobLogin(request, response);

        assertFalse(result.isSuccess());
        assertEquals("SSO 처리 중 내부 오류가 발생했습니다.", result.getErrorData());
    }

    private String createSignedToken(Map<String, Object> claims) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + 60_000);

        return Jwts.builder()
                .header().keyId("test-kid").and()
                .claims(claims)
                .issuedAt(now)
                .expiration(exp)
                .signWith(keyPair.getPrivate())
                .compact();
    }

    private void stubPublicKeyLookup() throws Exception {
        doReturn(keyPair.getPublic()).when(hyobeeSSOServiceImpl).getPublicKeyByKid("test-kid");
    }

    /**
     * VobLoginResult 기준으로 컨트롤러가 브라우저에 줄 응답을 테스트 로그에 남깁니다 (Maven/certain consoles UTF-8 아닐 때 깨짐 방지로 영문 태그 사용).
     */
    private void logFrontendOutcome(VobLoginResult result) {
        if (result.isSuccess()) {
            log.info("[TEST][browser response] HTTP 302 Location=/webapps/xs/aichat/main.jsp Set-Cookie loginType=SSO; Path=/");
        } else {
            log.info("[TEST][browser response] HTTP 403 header XTRM_ERROR_DATA={}", result.getErrorData());
        }
    }
}
