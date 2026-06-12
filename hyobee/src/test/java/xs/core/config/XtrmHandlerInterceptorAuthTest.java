package xs.core.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.util.ReflectionTestUtils;
import xs.core.enumeration.XtrmEnum;
import xs.core.dto.ApiEnvelope;
import xs.testutil.XtrmTestSupport;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@DisplayName("XtrmHandlerInterceptor 인증 분기 테스트")
class XtrmHandlerInterceptorAuthTest {

    private static final String MENU_KEY = "2025052912000000001";
    private static final String MENU_AUTH_ENTRY = MENU_KEY + "||1||0||0||0||0||0||0||0";

    private XtrmHandlerInterceptor interceptor;

    @BeforeEach
    void setUp() {
        interceptor = new XtrmHandlerInterceptor();
    }

    @Nested
    @DisplayName("checkValidSession")
    class ValidSession {

        @Test
        @DisplayName("세션이 없으면 false")
        void failsWhenSessionMissing() {
            var params = XtrmTestSupport.emptyJson();

            boolean valid = invokeCheckValidSession(params, null);

            assertThat(valid).isFalse();
        }

        @Test
        @DisplayName("USER_ID가 없으면 false")
        void failsWhenUserIdMissing() {
            var params = XtrmTestSupport.emptyJson();
            var session = new MockHttpSession();

            boolean valid = invokeCheckValidSession(params, session);

            assertThat(valid).isFalse();
        }

        @Test
        @DisplayName("USER_ID가 있으면 true")
        void passesWhenUserIdPresent() {
            var params = XtrmTestSupport.emptyJson();
            var session = sessionWithUser();

            boolean valid = invokeCheckValidSession(params, session);

            assertThat(valid).isTrue();
        }
    }

    @Nested
    @DisplayName("checkFuncAuthorization")
    class FuncAuthorization {

        @Test
        @DisplayName("AUTH_TYPE=N이면 권한 검사를 건너뜀")
        void passesWhenAuthTypeNone() {
            var params = paramsWithAuthType(XtrmEnum.AUTH_TYPE_NONE.getCode());
            var session = sessionWithUser();

            boolean authorized = invokeCheckFuncAuthorization(params, MENU_KEY, session);

            assertThat(authorized).isTrue();
        }

        @Test
        @DisplayName("조회 권한이 있으면 true")
        void passesWhenSelectAuthorized() {
            var params = paramsWithAuthType(XtrmEnum.AUTH_TYPE_SELECT.getCode());
            var session = sessionWithUser();
            session.setAttribute("AUTH_MENU_INFO", MENU_AUTH_ENTRY);

            boolean authorized = invokeCheckFuncAuthorization(params, MENU_KEY, session);

            assertThat(authorized).isTrue();
        }

        @Test
        @DisplayName("메뉴 권한이 없으면 false")
        void failsWhenMenuNotAuthorized() {
            var params = paramsWithAuthType(XtrmEnum.AUTH_TYPE_SELECT.getCode());
            var session = sessionWithUser();
            session.setAttribute("AUTH_MENU_INFO", "other-menu||1||0||0||0||0||0||0||0");

            boolean authorized = invokeCheckFuncAuthorization(params, MENU_KEY, session);

            assertThat(authorized).isFalse();
        }
    }

    @Nested
    @DisplayName("checkValidParameter")
    class ValidParameter {

        @Test
        @DisplayName("menuKey 형식이 잘못되면 false")
        void failsWhenMenuKeyInvalid() {
            var params = paramsWithAuthType(XtrmEnum.AUTH_TYPE_SELECT.getCode());

            boolean valid = invokeCheckValidParameter(params, "invalid-menu");

            assertThat(valid).isFalse();
        }

        @Test
        @DisplayName("AUTH_TYPE이 허용값이 아니면 false")
        void failsWhenAuthTypeNotAllowed() {
            var params = paramsWithAuthType("X");

            boolean valid = invokeCheckValidParameter(params, MENU_KEY);

            assertThat(valid).isFalse();
        }

        @Test
        @DisplayName("menuKey와 AUTH_TYPE이 유효하면 true")
        void passesWhenMenuKeyAndAuthTypeValid() {
            var params = paramsWithAuthType(XtrmEnum.AUTH_TYPE_SELECT.getCode());

            boolean valid = invokeCheckValidParameter(params, MENU_KEY);

            assertThat(valid).isTrue();
        }
    }

    private MockHttpSession sessionWithUser() {
        var session = new MockHttpSession();
        session.setAttribute("USER_ID", "user01");
        return session;
    }

    private ApiEnvelope paramsWithAuthType(String authType) {
        var params = XtrmTestSupport.emptyJson();
        params.setHeader("AUTH_TYPE", authType);
        return params;
    }

    private boolean invokeCheckValidSession(ApiEnvelope params, MockHttpSession session) {
        return ReflectionTestUtils.invokeMethod(interceptor, "checkValidSession", params, session);
    }

    private boolean invokeCheckFuncAuthorization(ApiEnvelope params, String menuKey, MockHttpSession session) {
        return ReflectionTestUtils.invokeMethod(interceptor, "checkFuncAuthorization", params, menuKey, session);
    }

    private boolean invokeCheckValidParameter(ApiEnvelope params, String menuKey) {
        return ReflectionTestUtils.invokeMethod(interceptor, "checkValidParameter", params, menuKey);
    }
}
