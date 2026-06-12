package xs.webbase.login.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import xs.webbase.login.service.LoginService;
import xs.core.dto.ApiEnvelope;
import xs.testutil.XtrmTestSupport;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("LoginController 단위 테스트")
class LoginControllerTest {

    @Mock
    private LoginService loginService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpSession session;

    @InjectMocks
    private LoginController loginController;

    @Nested
    @DisplayName("selectDataCompanyInfo")
    class SelectDataCompanyInfo {

        @Test
        @DisplayName("서비스 호출 후 반환값 그대로 반환")
        void delegatesToServiceAndReturns() throws Exception {
            var expected = new ApiEnvelope();
            expected.setString("companyName", "테스트회사");
            when(loginService.selectDataCompanyInfo(any(), eq(request))).thenReturn(expected);

            var result = loginController.selectDataCompanyInfo(XtrmTestSupport.loginRequest(request, session));

            assertThat(result.toString()).isEqualTo(expected.toString());
            verify(loginService).selectDataCompanyInfo(any(), eq(request));
        }
    }

    @Nested
    @DisplayName("createOTPEncryptKey")
    class CreateOTPEncryptKey {

        @Test
        @DisplayName("서비스 호출 후 반환값 그대로 반환")
        void delegatesToServiceAndReturns() throws Exception {
            var expected = new ApiEnvelope();
            expected.setString("ENCRYPT_KEY", "test-key-32-chars----------------");
            when(loginService.createOTPEncryptKey(any(), eq(session))).thenReturn(expected);

            var result = loginController.createOTPEncryptKey(XtrmTestSupport.loginRequest(request, session));

            assertThat(result.toString()).isEqualTo(expected.toString());
            verify(loginService).createOTPEncryptKey(any(), eq(session));
        }
    }

    @Nested
    @DisplayName("loginBase")
    class LoginBase {

        @Test
        @DisplayName("서비스 호출 후 반환값 그대로 반환")
        void delegatesToServiceAndReturns() throws Exception {
            var expected = new ApiEnvelope();
            expected.setResultHeader(false, "OK");
            when(loginService.loginBase(any(), eq(request), eq(session))).thenReturn(expected);

            var result = loginController.loginBase(XtrmTestSupport.loginRequest(request, session));

            assertThat(result.toString()).isEqualTo(expected.toString());
            verify(loginService).loginBase(any(), eq(request), eq(session));
        }
    }

    @Nested
    @DisplayName("logout")
    class Logout {

        @Test
        @DisplayName("서비스 호출 후 반환값 그대로 반환")
        void delegatesToServiceAndReturns() throws Exception {
            var expected = new ApiEnvelope();
            expected.setResultHeader(false, "OUT");
            when(loginService.logout(any(), eq(session))).thenReturn(expected);

            var result = loginController.logout(XtrmTestSupport.loginRequest(request, session));

            assertThat(result.toString()).isEqualTo(expected.toString());
            verify(loginService).logout(any(), eq(session));
        }
    }

    @Nested
    @DisplayName("changeUserPassword")
    class ChangeUserPassword {

        @Test
        @DisplayName("서비스 호출 후 반환값 그대로 반환")
        void delegatesToServiceAndReturns() throws Exception {
            var expected = new ApiEnvelope();
            when(loginService.changeUserPassword(any(), eq(session))).thenReturn(expected);

            var result = loginController.changeUserPassword(XtrmTestSupport.loginRequest(request, session));

            assertThat(result.toString()).isEqualTo(expected.toString());
            verify(loginService).changeUserPassword(any(), eq(session));
        }
    }

    @Nested
    @DisplayName("changeLocale")
    class ChangeLocale {

        @Test
        @DisplayName("서비스 호출 후 반환값 그대로 반환")
        void delegatesToServiceAndReturns() throws Exception {
            var expected = new ApiEnvelope();
            when(loginService.changeLocale(any(), eq(request), eq(session))).thenReturn(expected);

            var result = loginController.changeLocale(XtrmTestSupport.loginRequest(request, session));

            assertThat(result.toString()).isEqualTo(expected.toString());
            verify(loginService).changeLocale(any(), eq(request), eq(session));
        }
    }

    @Nested
    @DisplayName("getEaiCorpHoldings")
    class GetEaiCorpHoldings {

        @Test
        @DisplayName("서비스 호출 후 반환값 그대로 반환")
        void delegatesToServiceAndReturns() throws Exception {
            var expected = new ApiEnvelope();
            when(loginService.getEaiCorpHoldings(any(), eq(request), eq(session))).thenReturn(expected);

            var result = loginController.getEaiCorpHoldings(XtrmTestSupport.loginRequest(request, session));

            assertThat(result.toString()).isEqualTo(expected.toString());
            verify(loginService).getEaiCorpHoldings(any(), eq(request), eq(session));
        }
    }
}

