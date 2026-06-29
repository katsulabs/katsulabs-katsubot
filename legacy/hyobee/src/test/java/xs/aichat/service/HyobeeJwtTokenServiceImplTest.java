package xs.aichat.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import xs.aichat.util.JsonAdapter;
import xs.aichat.v2.service.ChatUserResolver;
import xs.core.property.XtrmProperty;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
@DisplayName("HyobeeJwtTokenServiceImpl ?? ???")
class HyobeeJwtTokenServiceImplTest {

    private static final String TEST_SECRET = "yZp3n4W8LkqS1tDbE9mV0rXuA7wC2pTfG5hQ8jR3xU6sNcKdF4vB1zYeH0aMiOwP";
    private static final String USER_ID = "bp0006080";
    private static final String CORP_CODE = "00";
    private static final String PG_CODE = "H";
    private static final String PU_CODE = "H01";
    private static final String TEAM_CODE = "13400";

    private XtrmProperty testXtrmConfig;
    private HyobeeJwtTokenServiceImpl jwtTokenService;

    @Mock
    private ChatUserResolver chatUserResolver;

    @Mock
    private JsonAdapter jsonAdapter;

    @BeforeEach
    void setUp() {
        Properties props = new Properties();
        props.setProperty("SECRET_KEY", TEST_SECRET);
        props.setProperty("EXPIRE_HOURS", String.valueOf(1000L * 60 * 60 * 24 * 365 * 10));

        testXtrmConfig = new XtrmProperty();
        testXtrmConfig.setProperties(props);

        jwtTokenService = new HyobeeJwtTokenServiceImpl(chatUserResolver, jsonAdapter, testXtrmConfig);
        jwtTokenService.init();
    }

    @Nested
    @DisplayName("generateToken")
    class GenerateToken {

        @Test
        @DisplayName("?? ?? ?? ? ? ???? ??")
        void returnsNonEmptyToken() {
            List<String> roles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");
            String token = jwtTokenService.generateToken(USER_ID, CORP_CODE, PG_CODE, PU_CODE, TEAM_CODE, roles);
            assertThat(token).isNotBlank();
        }

        @Test
        @DisplayName("??? ??? validateToken?? ?? ??")
        void generatedTokenCanBeValidated() {
            List<String> roles = Collections.singletonList("ROLE_USER");
            String token = jwtTokenService.generateToken(USER_ID, CORP_CODE, PG_CODE, PU_CODE, TEAM_CODE, roles);
            Claims claims = jwtTokenService.validateToken(token);

            assertThat(claims.getSubject()).isEqualTo(USER_ID);
            assertThat(claims.get("corpCode", String.class)).isEqualTo(CORP_CODE);
            assertThat(claims.get("pgCode", String.class)).isEqualTo(PG_CODE);
            assertThat(claims.get("puCode", String.class)).isEqualTo(PU_CODE);
            assertThat(claims.get("teamCode", String.class)).isEqualTo(TEAM_CODE);
        }

        @Test
        @DisplayName("roles? ? ????? ?? ?? ??")
        void acceptsEmptyRoles() {
            String token = jwtTokenService.generateToken(
                    USER_ID, CORP_CODE, PG_CODE, PU_CODE, TEAM_CODE, Collections.emptyList()
            );
            assertThat(token).isNotBlank();
        }
    }

    @Nested
    @DisplayName("validateToken")
    class ValidateToken {

        @Test
        @DisplayName("??? ??? Claims ??")
        void validTokenReturnsClaims() {
            String token = jwtTokenService.generateToken(
                    USER_ID, CORP_CODE, PG_CODE, PU_CODE, TEAM_CODE, Collections.emptyList()
            );
            Claims claims = jwtTokenService.validateToken(token);

            assertThat(claims).isNotNull();
            assertThat(claims.getSubject()).isEqualTo(USER_ID);
        }

        @Test
        @DisplayName("??? ??? ??? ??")
        void invalidSignatureThrows() {
            Properties otherProps = new Properties();
            otherProps.setProperty("SECRET_KEY", "other-secret-key-32bytes-minimum!!!");
            otherProps.setProperty("EXPIRE_HOURS", "24");

            XtrmProperty otherConfig = new XtrmProperty();
            otherConfig.setProperties(otherProps);

            HyobeeJwtTokenServiceImpl otherService = new HyobeeJwtTokenServiceImpl(chatUserResolver, jsonAdapter, otherConfig);
            otherService.init();

            String token = otherService.generateToken(USER_ID, CORP_CODE, PG_CODE, PU_CODE, TEAM_CODE, Collections.emptyList());
            assertThatThrownBy(() -> jwtTokenService.validateToken(token))
                    .isInstanceOf(SignatureException.class);
        }

        @Test
        @DisplayName("??? ??? ??? ??")
        void malformedTokenThrows() {
            assertThatThrownBy(() -> jwtTokenService.validateToken("not.a.valid.jwt"))
                    .isInstanceOf(Exception.class);
        }
    }
}
