package xs.aichat.config;

import xs.core.property.XtrmProperty;

/**
 * Hyobee 화면 JSP 경로를 설정({@link XtrmProperty})에서 읽어 절대/redirect 경로로 변환한다.
 * 컨트롤러·SSO 리다이렉트에서 하드코딩된 .jsp 경로 노출을 줄이기 위한 단일 진입점.
 */
public final class HyobeePagePaths {

    private HyobeePagePaths() {
    }

    public static String loginPagePath(XtrmProperty config) {
        return toAbsolutePath(config.getString("LOGIN_PAGE_URL"));
    }

    public static String mainPagePath(XtrmProperty config) {
        return toAbsolutePath(config.getString("MAIN_PAGE_URL"));
    }

    public static String redirectToLoginPage(XtrmProperty config) {
        return "redirect:" + loginPagePath(config);
    }

    public static String redirectToMainPage(XtrmProperty config) {
        return "redirect:" + mainPagePath(config);
    }

    private static String toAbsolutePath(String configPath) {
        if (configPath == null || configPath.isEmpty()) {
            return "/";
        }
        return configPath.startsWith("/") ? configPath : "/" + configPath;
    }
}
