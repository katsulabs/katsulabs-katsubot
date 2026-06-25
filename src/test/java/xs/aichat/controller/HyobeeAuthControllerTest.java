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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import xs.aichat.service.HyobeeJwtTokenService;

import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Spring context ?? standalone MockMvc? ??? (xtrmProperty ? ???).
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("HyobeeAuthController API ???")
class HyobeeAuthControllerTest {

    private static final String AUTH_VERIFY_URL = "/xs/vob/aichat/auth/verify";
    private static final String AUTH_VERIFY1_URL = "/xs/vob/aichat/auth/verify1";

    @Mock
    private HyobeeJwtTokenService jwtTokenService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        HyobeeAuthController controller = new HyobeeAuthController(jwtTokenService);
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
}

