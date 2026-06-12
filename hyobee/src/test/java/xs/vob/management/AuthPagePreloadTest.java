package xs.vob.management;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.util.ReflectionTestUtils;
import xs.core.property.XtrmProperty;

import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthPagePreload JSP 게이트 테스트")
class AuthPagePreloadTest {

    private static final String MENU_KEY = "2025052912000000001";

    private AuthPagePreload authPagePreload;

    private XtrmProperty xtrmProperty;

    @BeforeEach
    void setUp() {
        authPagePreload = new AuthPagePreload();
        xtrmProperty = buildProperty();
        ReflectionTestUtils.setField(authPagePreload, "mobjXtrmConfig", xtrmProperty);
    }

    @Nested
    @DisplayName("checkValidSession")
    class ValidSession {

        @Test
        @DisplayName("세션이 없으면 false")
        void failsWhenSessionMissing() {
            boolean valid = invokeCheckValidSession("/app/page.jsp", null);
            assertThat(valid).isFalse();
        }

        @Test
        @DisplayName("USER_ID가 있으면 true")
        void passesWhenUserIdPresent() {
            var session = sessionWithUser();
            boolean valid = invokeCheckValidSession("/app/page.jsp", session);
            assertThat(valid).isTrue();
        }
    }

    @Nested
    @DisplayName("checkRequestMenuInfo")
    class RequestMenuInfo {

        @Test
        @DisplayName("menuKey가 비어 있으면 false")
        void failsWhenMenuKeyEmpty() {
            assertThat(invokeCheckRequestMenuInfo("")).isFalse();
            assertThat(invokeCheckRequestMenuInfo(null)).isFalse();
        }

        @Test
        @DisplayName("menuKey가 있으면 true")
        void passesWhenMenuKeyPresent() {
            assertThat(invokeCheckRequestMenuInfo(MENU_KEY)).isTrue();
        }
    }

    @Nested
    @DisplayName("checkValidAuthorization")
    class ValidAuthorization {

        @Test
        @DisplayName("AUTH_MENU_INFO에 menuKey가 포함되면 true")
        void passesWhenMenuAuthorized() {
            var session = sessionWithUser();
            session.setAttribute("AUTH_MENU_INFO", MENU_KEY + "||1||0||0||0||0||0||0||0");

            assertThat(invokeCheckValidAuthorization(MENU_KEY, session)).isTrue();
        }

        @Test
        @DisplayName("권한 목록에 menuKey가 없으면 false")
        void failsWhenMenuNotAuthorized() {
            var session = sessionWithUser();
            session.setAttribute("AUTH_MENU_INFO", "other-menu||1||0||0||0||0||0||0||0");

            assertThat(invokeCheckValidAuthorization(MENU_KEY, session)).isFalse();
        }
    }

    @Nested
    @DisplayName("checkValidationBeforePageLoad")
    class PageLoadValidation {

        @Test
        @DisplayName("세션 없이 보호 페이지 접근 시 403")
        void forbiddenWhenSessionMissing() throws Exception {
            MockHttpServletRequest request = protectedPageRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();

            authPagePreload.checkValidationBeforePageLoad(request, response, null);

            assertThat(response.getStatus()).isEqualTo(HttpStatus.FORBIDDEN.value());
            assertThat(response.getHeader("XTRM_ERROR_DATA")).isNotBlank();
        }

        @Test
        @DisplayName("로그인 페이지는 세션 없이도 통과")
        void allowsLoginPageWithoutSession() throws Exception {
            MockHttpServletRequest request = new MockHttpServletRequest(
                    "GET",
                    "/webapps/xs/webbase/login/login.jsp"
            );
            request.setContextPath("");
            MockHttpServletResponse response = new MockHttpServletResponse();

            authPagePreload.checkValidationBeforePageLoad(request, response, null);

            assertThat(response.getStatus()).isEqualTo(200);
        }

        @Test
        @DisplayName("menuKey 누락 시 403")
        void forbiddenWhenMenuKeyMissing() throws Exception {
            MockHttpServletRequest request = protectedPageRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();
            var session = sessionWithUser();

            authPagePreload.checkValidationBeforePageLoad(request, response, session);

            assertThat(response.getStatus()).isEqualTo(HttpStatus.FORBIDDEN.value());
        }
    }

    private MockHttpServletRequest protectedPageRequest() {
        MockHttpServletRequest request = new MockHttpServletRequest(
                "GET",
                "/webapps/xs/protected/page.jsp?popupAt=N"
        );
        request.setContextPath("");
        request.setQueryString("popupAt=N");
        return request;
    }

    private MockHttpSession sessionWithUser() {
        var session = new MockHttpSession();
        session.setAttribute("USER_ID", "user01");
        return session;
    }

    private XtrmProperty buildProperty() {
        Properties props = new Properties();
        props.setProperty("SERVICE_MODE", "local");
        props.setProperty("LOGIN_PAGE_URL", "webapps/xs/webbase/login/login.jsp");
        props.setProperty("MAIN_PAGE_URL", "webapps/xs/aichat/main.jsp");
        props.setProperty("ERROR_PAGE_URL", "webapps/xs/error.jsp");
        props.setProperty("CLOUD_PAGE_URL", "webapps/xs/cloud.jsp");
        props.setProperty("AI_CHAT_HICLOUD_ATTACH_URL", "webapps/xs/aichat/attach.jsp");
        props.setProperty("AI_CHAT_URL", "webapps/xs/aichat/main.jsp");
        var property = new XtrmProperty();
        property.setProperties(props);
        return property;
    }

    private boolean invokeCheckValidSession(String requestUri, MockHttpSession session) {
        return ReflectionTestUtils.invokeMethod(authPagePreload, "checkValidSession", requestUri, session);
    }

    private boolean invokeCheckRequestMenuInfo(String menuKey) {
        return ReflectionTestUtils.invokeMethod(authPagePreload, "checkRequestMenuInfo", menuKey);
    }

    private boolean invokeCheckValidAuthorization(String menuKey, MockHttpSession session) {
        return ReflectionTestUtils.invokeMethod(authPagePreload, "checkValidAuthorization", menuKey, session);
    }
}
