package xs.aichat.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import xs.core.property.XtrmProperty;

import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("HyobeePagePaths 설정 기반 페이지 경로")
class HyobeePagePathsTest {

    @Test
    @DisplayName("LOGIN_PAGE_URL을 절대 경로로 변환")
    void loginPagePath() {
        XtrmProperty config = configWith(
                "LOGIN_PAGE_URL", "webapps/xs/webbase/login/login.jsp",
                "MAIN_PAGE_URL", "webapps/xs/aichat/main.jsp"
        );

        assertThat(HyobeePagePaths.loginPagePath(config))
                .isEqualTo("/webapps/xs/webbase/login/login.jsp");
    }

    @Test
    @DisplayName("MAIN_PAGE_URL을 절대 경로로 변환")
    void mainPagePath() {
        XtrmProperty config = configWith(
                "LOGIN_PAGE_URL", "webapps/xs/webbase/login/login.jsp",
                "MAIN_PAGE_URL", "webapps/xs/aichat/main.jsp"
        );

        assertThat(HyobeePagePaths.mainPagePath(config))
                .isEqualTo("/webapps/xs/aichat/main.jsp");
    }

    @Test
    @DisplayName("Spring redirect: 접두사 포함 경로")
    void redirectToMainPage() {
        XtrmProperty config = configWith(
                "LOGIN_PAGE_URL", "webapps/xs/webbase/login/login.jsp",
                "MAIN_PAGE_URL", "webapps/xs/aichat/main.jsp"
        );

        assertThat(HyobeePagePaths.redirectToMainPage(config))
                .isEqualTo("redirect:/webapps/xs/aichat/main.jsp");
    }

    private static XtrmProperty configWith(String... keyValues) {
        Properties props = new Properties();
        for (int i = 0; i < keyValues.length; i += 2) {
            props.setProperty(keyValues[i], keyValues[i + 1]);
        }
        var property = new XtrmProperty();
        property.setProperties(props);
        return property;
    }
}
