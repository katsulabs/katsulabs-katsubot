package xs.core.api.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;
import xs.core.dto.ApiEnvelope;
import xs.core.property.XtrmProperty;
import xs.vob.cmmn.service.CmmnService;
import xs.vob.management.dto.ComUser;

import java.util.List;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("ApiServiceImpl#createSessionAndUpdate 단위 테스트")
class ApiServiceImplTest {

    private static final List<String> ESSENTIAL_SESSION_KEYS = List.of(
            "USER_ID",
            "AUTH_MENU_INFO",
            "LOGIN_DATETIME",
            "GBIS_CORP_CODE",
            "PG_CODE",
            "PU_CODE",
            "DEPT_CODE"
    );

    @Mock
    private CmmnService cmmnService;

    @Mock
    private xs.core.database.XtrmDAOWeb mobjXtrmDao;

    private ApiServiceImpl apiService;

    private XtrmProperty xtrmProperty;

    @BeforeEach
    void setUp() {
        apiService = new ApiServiceImpl();
        xtrmProperty = buildProperty();
        ReflectionTestUtils.setField(apiService, "cmmnService", cmmnService);
        ReflectionTestUtils.setField(apiService, "mobjXtrmDao", mobjXtrmDao);
        ReflectionTestUtils.setField(apiService, "mobjXtrmConfig", xtrmProperty);
    }

    @Nested
    @DisplayName("createSessionAndUpdate(2-arg)")
    class TwoArg {

        @Test
        @DisplayName("필수 세션 키를 설정하고 사용자 접속 정보를 갱신")
        void setsEssentialSessionKeysAndUpdatesUser() throws Exception {
            MockHttpServletRequest request = new MockHttpServletRequest();
            request.setRemoteAddr("127.0.0.1");
            var session = request.getSession(true);
            var user = buildUser();

            apiService.createSessionAndUpdate(user, request);

            for (String key : ESSENTIAL_SESSION_KEYS) {
                assertThat(session.getAttribute(key)).isNotNull();
            }
            assertThat(session.getAttribute("USER_ID")).isEqualTo("user01");
            assertThat(session.getAttribute("AUTH_MENU_INFO")).isEqualTo("menu-auth");
            assertThat(session.getAttribute("LOGIN_DATETIME")).isNotNull();
            assertThat(session.getAttribute("ACCESS_IP")).isEqualTo("127.0.0.1");
            assertThat(user.getLoginAt()).isEqualTo("Y");
            verify(cmmnService).updateUser(eq(user), eq(mobjXtrmDao));
        }

        @Test
        @DisplayName("X-Forwarded-For 첫 IP를 ACCESS_IP에 반영")
        void usesFirstForwardedForIp() throws Exception {
            MockHttpServletRequest request = new MockHttpServletRequest();
            request.addHeader("X-Forwarded-For", "203.0.113.10, 10.0.0.5");
            var session = request.getSession(true);
            var user = buildUser();

            apiService.createSessionAndUpdate(user, request);

            assertThat(session.getAttribute("ACCESS_IP")).isEqualTo("203.0.113.10");
            assertThat(user.getRecentConnectIp()).isEqualTo("203.0.113.10");
        }
    }

    @Nested
    @DisplayName("createSessionAndUpdate(3-arg)")
    class ThreeArg {

        @Test
        @DisplayName("languageCode를 세션 LANGUAGE_CODE에 반영")
        void setsLanguageCodeFromParams() throws Exception {
            MockHttpServletRequest request = new MockHttpServletRequest();
            var session = request.getSession(true);
            var user = buildUser();
            var params = new ApiEnvelope();
            params.setString("languageCode", "en");

            apiService.createSessionAndUpdate(user, request, params);

            assertThat(session.getAttribute("LANGUAGE_CODE")).isEqualTo("en");
            assertThat(session.getAttribute("USER_ID")).isEqualTo("user01");
        }

        @Test
        @DisplayName("2-arg와 동일하게 필수 세션 키를 설정")
        void setsSameEssentialKeysAsTwoArgOverload() throws Exception {
            MockHttpServletRequest request = new MockHttpServletRequest();
            var session = request.getSession(true);
            var user = buildUser();
            var params = new ApiEnvelope();
            params.setString("languageCode", "ko");

            apiService.createSessionAndUpdate(user, request, params);

            for (String key : ESSENTIAL_SESSION_KEYS) {
                assertThat(session.getAttribute(key)).isNotNull();
            }
        }
    }

    private XtrmProperty buildProperty() {
        Properties props = new Properties();
        props.setProperty("MAIN_PAGE_URL", "webapps/xs/aichat/main.jsp");
        props.setProperty("ERROR_PAGE_URL", "webapps/xs/error.jsp");
        var property = new XtrmProperty();
        property.setProperties(props);
        return property;
    }

    private ComUser buildUser() {
        var user = new ComUser();
        user.setUserId("user01");
        user.setCompanyCode("1000");
        user.setCompanyName("Hyosung");
        user.setUserName("Tester");
        user.setDeptCode("D001");
        user.setPgCode("PG01");
        user.setPuCode("PU01");
        user.setGbisCorpCode("CORP01");
        user.setCorpCode("CORP01");
        user.setAuthMenuList("menu-auth");
        return user;
    }
}
