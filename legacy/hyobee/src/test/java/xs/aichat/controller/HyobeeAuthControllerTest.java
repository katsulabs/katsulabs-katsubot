package xs.aichat.controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import xs.aichat.service.HyobeeJwtTokenService;
import xs.aichat.v2.dto.LoginUserCredentials;
import xs.aichat.v2.service.AichatUserLoginService;

import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Spring context ?? standalone MockMvc? ??? (xtrmProperty ? ???).
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("HyobeeAuthController API ???")
class HyobeeAuthControllerTest {

    private static final String AUTH_VERIFY_URL = "/xs/vob/aichat/auth/verify";
    private static final String AUTH_VERIFY1_URL = "/xs/vob/aichat/auth/verify1";
    private static final String AUTH_SESSION_TOKEN_URL = "/xs/vob/aichat/auth/session-token";

    private static final String AUTH_ENCRYPT_KEY_URL = "/xs/vob/aichat/auth/encrypt-key";
    private static final String AUTH_LOGIN_URL = "/xs/vob/aichat/auth/login";

    @Mock
    private HyobeeJwtTokenService jwtTokenService;

    @Mock
    private AichatUserLoginService aichatUserLoginService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        HyobeeAuthController controller = new HyobeeAuthController(jwtTokenService, aichatUserLoginService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Nested
    @DisplayName("GET /verify")
    class Verify {

        @Test
        @DisplayName("Authorization ?? ??? 401 ?? 400 (?? ?? ???)")
        void noAuthHeader_returns4xx() throws Exception {
            mockMvc.perform(get(AUTH_VERIFY_URL))
                    .andExpect(status().is4xxClientError());
        }

        @Test
        @DisplayName("Bearer ??? ??? 401")
        void noBearerPrefix_returns401() throws Exception {
            mockMvc.perform(get(AUTH_VERIFY_URL)
                            .header("Authorization", "InvalidToken"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.error").value("Missing or invalid Authorization header"));
        }

        @Test
        @DisplayName("??? ???? 200? valid true ??")
        void validToken_returns200() throws Exception {
            Claims claims = Jwts.claims()
                    .subject("user1")
                    .add("corpCode", "1000")
                    .add("pgCode", "PG01")
                    .add("puCode", "PU01")
                    .add("teamCode", "T001")
                    .add("roles", List.of("ROLE_USER"))
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + 3600000))
                    .build();

            when(jwtTokenService.validateToken(anyString())).thenReturn(claims);

            mockMvc.perform(get(AUTH_VERIFY_URL)
                            .header("Authorization", "Bearer valid.jwt.token"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.valid").value(true))
                    .andExpect(jsonPath("$.userId").value("user1"))
                    .andExpect(jsonPath("$.corpCode").value("1000"))
                    .andExpect(jsonPath("$.roles").isArray());
        }

        @Test
        @DisplayName("??? ???? 401 Token expired")
        void expiredToken_returns401() throws Exception {
            when(jwtTokenService.validateToken(anyString()))
                    .thenThrow(new io.jsonwebtoken.ExpiredJwtException(null, null, "expired"));

            mockMvc.perform(get(AUTH_VERIFY_URL)
                            .header("Authorization", "Bearer expired.token"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.valid").value(false))
                    .andExpect(jsonPath("$.error").value("Token expired"));
        }

        @Test
        @DisplayName("??? ???? 401 Invalid token")
        void invalidToken_returns401() throws Exception {
            when(jwtTokenService.validateToken(anyString()))
                    .thenThrow(new io.jsonwebtoken.JwtException("invalid"));

            mockMvc.perform(get(AUTH_VERIFY_URL)
                            .header("Authorization", "Bearer invalid.token"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.valid").value(false))
                    .andExpect(jsonPath("$.error").value("Invalid token"));
        }
    }

    @Nested
    @DisplayName("GET /verify1")
    class Verify1 {

        @Test
        @DisplayName("Authorization ??? 401 ?? 400")
        void noAuthHeader_returns4xx() throws Exception {
            mockMvc.perform(get(AUTH_VERIFY1_URL))
                    .andExpect(status().is4xxClientError());
        }

        @Test
        @DisplayName("??? ???? 200")
        void validToken_returns200() throws Exception {
            Claims claims = Jwts.claims()
                    .subject("user2")
                    .add("roles", List.of("ROLE_ADMIN"))
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + 3600000))
                    .build();
            when(jwtTokenService.validateToken(anyString())).thenReturn(claims);

            mockMvc.perform(get(AUTH_VERIFY1_URL)
                            .header("Authorization", "Bearer any.valid.token"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.valid").value(true))
                    .andExpect(jsonPath("$.userId").value("user2"));
        }
    }

    @Nested
    @DisplayName("POST /login")
    class Login {

        @Test
        @DisplayName("로그인 성공 시 JWT 반환")
        void success_returnsToken() throws Exception {
            MockHttpSession session = new MockHttpSession();
            var credentials = new LoginUserCredentials();
            credentials.setUserId("user01");

            when(aichatUserLoginService.loginWithEncryptedFields(any(), any(), any()))
                    .thenReturn(credentials);
            when(jwtTokenService.generateToken(anyString(), any(), any(), any(), any(), any()))
                    .thenReturn("issued.jwt.token");

            mockMvc.perform(post(AUTH_LOGIN_URL)
                            .session(session)
                            .contentType("application/json")
                            .content("""
                                    {
                                      "company_code_encrypt": "c",
                                      "user_id_encrypt": "u",
                                      "password_encrypt": "p"
                                    }
                                    """))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value("issued.jwt.token"));
        }
    }

    @Nested
    @DisplayName("GET /session-token")
    class SessionToken {

        @Test
        @DisplayName("세션 없으면 401")
        void noSession_returns401() throws Exception {
            mockMvc.perform(get(AUTH_SESSION_TOKEN_URL))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.error").value("Not logged in"));
        }

        @Test
        @DisplayName("로그인 세션이 있으면 JWT 반환")
        void loggedInSession_returnsToken() throws Exception {
            MockHttpSession session = new MockHttpSession();
            session.setAttribute("USER_ID", "user01");
            session.setAttribute("GBIS_CORP_CODE", "1000");
            session.setAttribute("PG_CODE", "PG01");
            session.setAttribute("PU_CODE", "PU01");
            session.setAttribute("DEPT_CODE", "T001");

            when(jwtTokenService.generateToken(anyString(), anyString(), anyString(), anyString(), anyString(), any()))
                    .thenReturn("issued.jwt.token");

            mockMvc.perform(get(AUTH_SESSION_TOKEN_URL).session(session))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value("issued.jwt.token"));
        }
    }
}

