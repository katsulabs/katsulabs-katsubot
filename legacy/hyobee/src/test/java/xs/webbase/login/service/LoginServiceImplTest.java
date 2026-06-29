package xs.webbase.login.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import xs.core.api.service.ApiService;
import xs.core.property.XtrmProperty;
import xs.core.utility.XtrmCryptoUtil;
import xs.domain.certification.service.CertificationService;
import xs.aichat.v2.dto.LoginUserCredentials;
import xs.aichat.v2.service.AichatUserLoginService;
import xs.vob.cmmn.service.CmmnService;
import xs.vob.enumeration.MainEnum;
import xs.vob.management.dto.ComUser;
import xs.testutil.XtrmTestSupport;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("LoginServiceImpl 단위 테스트")
class LoginServiceImplTest {

    @Mock
    private CertificationService certificationService;

    @Mock
    private CmmnService cmmnService;

    @Mock
    private ApiService apiService;

    @Mock
    private AichatUserLoginService aichatUserLoginService;

    @Mock
    private xs.core.database.XtrmDAOWeb mobjXtrmDao;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpSession session;

    @Mock
    private HttpServletResponse response;

    private LoginServiceImpl loginService;

    private XtrmProperty xtrmProperty;

    private static final String ENCRYPT_KEY = "12345678901234567890123456789012";

    @BeforeEach
    void setUp() {
        loginService = new LoginServiceImpl();
        xtrmProperty = buildProperty("1000");

        ReflectionTestUtils.setField(loginService, "certificationService", certificationService);
        ReflectionTestUtils.setField(loginService, "cmmnService", cmmnService);
        ReflectionTestUtils.setField(loginService, "apiService", apiService);
        ReflectionTestUtils.setField(loginService, "aichatUserLoginService", aichatUserLoginService);
        ReflectionTestUtils.setField(loginService, "objXtrmConfig", xtrmProperty);
        ReflectionTestUtils.setField(loginService, "mobjXtrmDao", mobjXtrmDao);
        ReflectionTestUtils.setField(loginService, "mobjXtrmConfig", xtrmProperty);
    }

    private XtrmProperty buildProperty(String companyCode) {
        Properties props = new Properties();
        props.setProperty("COMPANY_CODE", companyCode);
        props.setProperty("SERVICE_MODE", "local");
        props.setProperty("DUPLICATION_LOGIN_AVAILABLE", "true");
        var property = new XtrmProperty();
        property.setProperties(props);
        return property;
    }

    @Nested
    @DisplayName("createOTPEncryptKey")
    class CreateOTPEncryptKey {

        @Test
        @DisplayName("세션에 ENCRYPT_KEY가 설정되고 32자 키가 반환됨")
        void setsSessionKeyAndReturnsKey() throws Exception {
            var params = XtrmTestSupport.emptyJson();

            var result = loginService.createOTPEncryptKey(params, session);

            assertThat(result.getString("ENCRYPT_KEY")).isNotBlank().hasSize(32);
            verify(session).setAttribute(eq("ENCRYPT_KEY"), any(String.class));
            assertThat(result.getErrorFlag()).isFalse();
        }
    }

    @Nested
    @DisplayName("loginOTP")
    class LoginOTP {

        @Test
        @DisplayName("aichat 전용에서는 OTP 미지원 메시지 반환")
        void returnsNotSupportedMessage() throws Exception {
            var params = XtrmTestSupport.emptyJson();

            var result = loginService.loginOTP(params, request, session);

            assertThat(result.getErrorFlag()).isTrue();
            assertThat(result.getErrorMsg()).contains("OTP 로그인 미지원");
        }
    }

    @Nested
    @DisplayName("loginSMSMail")
    class LoginSMSMail {

        @Test
        @DisplayName("aichat 전용에서는 SMS/메일 인증 미지원 메시지 반환")
        void returnsNotSupportedMessage() throws Exception {
            var params = XtrmTestSupport.emptyJson();

            var result = loginService.loginSMSMail(params, request, session);

            assertThat(result.getErrorFlag()).isTrue();
            assertThat(result.getErrorMsg()).contains("SMS/메일 인증 로그인 미지원");
        }
    }

    @Nested
    @DisplayName("sendCertificationNumber")
    class SendCertificationNumber {

        @Test
        @DisplayName("aichat 전용에서는 인증번호 발송 미지원 메시지 반환")
        void returnsNotSupportedMessage() throws Exception {
            var params = XtrmTestSupport.emptyJson();

            var result = loginService.sendCertificationNumber(params, request, session);

            assertThat(result.getErrorFlag()).isTrue();
            assertThat(result.getErrorMsg()).contains("인증번호 발송 미지원");
        }
    }

    @Nested
    @DisplayName("loginCertification")
    class LoginCertification {

        @Test
        @DisplayName("aichat 전용에서는 인증번호 로그인 미지원 메시지 반환")
        void returnsNotSupportedMessage() throws Exception {
            var params = XtrmTestSupport.emptyJson();

            var result = loginService.loginCertification(params, request, session);

            assertThat(result.getErrorFlag()).isTrue();
            assertThat(result.getErrorMsg()).contains("인증번호 로그인 미지원");
        }
    }

    @Nested
    @DisplayName("createOTPKey")
    class CreateOTPKey {

        @Test
        @DisplayName("aichat 전용에서는 OTP 발급 미지원 메시지 반환")
        void returnsNotSupportedMessage() throws Exception {
            var params = XtrmTestSupport.emptyJson();

            var result = loginService.createOTPKey(params, request, session);

            assertThat(result.getErrorFlag()).isTrue();
            assertThat(result.getErrorMsg()).contains("OTP 발급 미지원");
        }
    }

    @Nested
    @DisplayName("changePasswordOTP")
    class ChangePasswordOTP {

        @Test
        @DisplayName("aichat 전용에서는 OTP 비밀번호 변경 미지원 메시지 반환")
        void returnsNotSupportedMessage() throws Exception {
            var params = XtrmTestSupport.emptyJson();

            var result = loginService.changePasswordOTP(params, session);

            assertThat(result.getErrorFlag()).isTrue();
            assertThat(result.getErrorMsg()).contains("OTP 비밀번호 변경 미지원");
        }
    }

    @Nested
    @DisplayName("loginHyobeeSSO")
    class LoginHyobeeSSO {

        @Test
        @DisplayName("정상 사용자면 세션 생성 후 로그인 일시 반환")
        void successCreatesSessionAndReturnsLoginDate() throws Exception {
            var params = XtrmTestSupport.jsonWithStrings("samaccountname", "user01");
            var user = buildUser("user01");

            when(cmmnService.selectUserForLogin("1000", "user01", "ko")).thenReturn(user);
            when(session.getAttribute("LOGIN_DATETIME")).thenReturn("2026-05-29 10:00:00");

            var result = loginService.loginHyobeeSSO(params, request, session, "ko", response);

            assertThat(result.getErrorFlag()).isFalse();
            assertThat(result.getString("currLoginDate")).isEqualTo("2026-05-29 10:00:00");
            assertThat(params.getString("languageCode")).isEqualTo("ko");
            assertThat(params.getString("userId")).isEqualTo("user01");
            verify(apiService).createSessionAndUpdate(eq(user), eq(request), any());
        }

        @Test
        @DisplayName("DB에 없는 사용자면 403과 XTRM_ERROR_DATA 헤더")
        void failWhenUserNotFound() throws Exception {
            var params = XtrmTestSupport.jsonWithStrings("samaccountname", "missing-user");

            when(cmmnService.selectUserForLogin("1000", "missing-user", "ko")).thenReturn(null);

            var result = loginService.loginHyobeeSSO(params, request, session, "ko", response);

            assertThat(result.getErrorFlag()).isTrue();
            assertThat(result.getErrorCode()).isEqualTo(MainEnum.PASSWORD_CHANGE_ERROR02.getCode());
            verify(response).sendError(HttpStatus.FORBIDDEN.value());
            verify(response).setHeader(eq("XTRM_ERROR_DATA"), any(String.class));
        }

        @Test
        @DisplayName("acceptLanguage가 selectUserForLogin에 전달됨")
        void passesAcceptLanguageToUserLookup() throws Exception {
            var params = XtrmTestSupport.jsonWithStrings("samaccountname", "user01");
            var user = buildUser("user01");

            when(cmmnService.selectUserForLogin("1000", "user01", "en")).thenReturn(user);
            when(session.getAttribute("LOGIN_DATETIME")).thenReturn("2026-05-29 10:00:00");

            loginService.loginHyobeeSSO(params, request, session, "en", response);

            verify(cmmnService).selectUserForLogin("1000", "user01", "en");
            assertThat(params.getString("languageCode")).isEqualTo("en");
        }

        @Test
        @DisplayName("성공 시 companyCode는 설정값을 사용")
        void usesConfiguredCompanyCode() throws Exception {
            ReflectionTestUtils.setField(loginService, "mobjXtrmConfig", buildProperty("2000"));
            ReflectionTestUtils.setField(loginService, "objXtrmConfig", buildProperty("2000"));

            var params = XtrmTestSupport.jsonWithStrings("samaccountname", "user01");
            var user = buildUser("user01");

            when(cmmnService.selectUserForLogin("2000", "user01", "ko")).thenReturn(user);
            when(session.getAttribute("LOGIN_DATETIME")).thenReturn("2026-05-29 10:00:00");

            loginService.loginHyobeeSSO(params, request, session, "ko", response);

            assertThat(params.getString("companyCode")).isEqualTo("2000");
        }
    }

    @Nested
    @DisplayName("loginBase")
    class LoginBase {

        @Test
        @DisplayName("ENCRYPT_KEY 없으면 LOGIN_ENF 오류")
        void failWhenEncryptKeyMissing() throws Exception {
            when(session.getAttribute("ENCRYPT_KEY")).thenReturn(null);

            var result = loginService.loginBase(XtrmTestSupport.emptyJson(), request, session);

            assertThat(result.getErrorFlag()).isTrue();
            assertThat(result.getErrorCode()).isEqualTo(MainEnum.LOGIN_ENF.getCode());
        }

        @Test
        @DisplayName("암호화 파라미터 누락 시 LOGIN_EMPTY 오류")
        void failWhenEncryptedParamsEmpty() throws Exception {
            when(session.getAttribute("ENCRYPT_KEY")).thenReturn(ENCRYPT_KEY);

            var result = loginService.loginBase(XtrmTestSupport.emptyJson(), request, session);

            assertThat(result.getErrorFlag()).isTrue();
            assertThat(result.getErrorCode()).isEqualTo(MainEnum.LOGIN_EMPTY.getCode());
        }

        @Test
        @DisplayName("정상 복호화 후 UserMapper 세션 생성")
        void successDecryptsAndCreatesSession() throws Exception {
            when(session.getAttribute("ENCRYPT_KEY")).thenReturn(ENCRYPT_KEY);

            var params = XtrmTestSupport.jsonWithStrings(
                    "companyCodeEncrypt", XtrmCryptoUtil.encryptAES("1000", ENCRYPT_KEY),
                    "userIdEncrypt", XtrmCryptoUtil.encryptAES("user01", ENCRYPT_KEY),
                    "passwordEncrypt", XtrmCryptoUtil.encryptAES("secret", ENCRYPT_KEY),
                    "languageCode", "ko"
            );
            var credentials = new LoginUserCredentials();
            credentials.setUserId("user01");
            credentials.setCompanyCode("1000");

            when(aichatUserLoginService.validateDecryptedPassword("1000", "user01", "secret"))
                    .thenReturn(credentials);

            var result = loginService.loginBase(params, request, session);

            assertThat(result.getErrorFlag()).isFalse();
            assertThat(result.getString("currLoginDate")).isNotBlank();
            verify(aichatUserLoginService).establishChatSession(eq(session), eq(credentials), eq("ko"));
            verify(session).removeAttribute("ENCRYPT_KEY");
        }

        @Test
        @DisplayName("X-Forwarded-For 첫 IP를 클라이언트 IP로 사용")
        void usesFirstForwardedForIp() throws Exception {
            when(session.getAttribute("ENCRYPT_KEY")).thenReturn(ENCRYPT_KEY);
            when(request.getHeader("X-Forwarded-For")).thenReturn("203.0.113.1, 10.0.0.1");

            var params = XtrmTestSupport.jsonWithStrings(
                    "companyCodeEncrypt", XtrmCryptoUtil.encryptAES("1000", ENCRYPT_KEY),
                    "userIdEncrypt", XtrmCryptoUtil.encryptAES("user01", ENCRYPT_KEY),
                    "passwordEncrypt", XtrmCryptoUtil.encryptAES("secret", ENCRYPT_KEY),
                    "languageCode", "ko"
            );
            var credentials = new LoginUserCredentials();
            credentials.setUserId("user01");

            when(aichatUserLoginService.validateDecryptedPassword("1000", "user01", "secret"))
                    .thenReturn(credentials);

            var result = loginService.loginBase(params, request, session);

            assertThat(result.getErrorFlag()).isFalse();
            verify(request).getHeader("X-Forwarded-For");
            verify(session).setAttribute(eq("ACCESS_IP"), eq("203.0.113.1"));
        }
    }

    private ComUser buildUser(String userId) {
        var user = new ComUser();
        user.setUserId(userId);
        user.setRecentLoginDt(new Timestamp(System.currentTimeMillis()));
        return user;
    }
}

