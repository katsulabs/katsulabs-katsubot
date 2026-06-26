package xs.webbase.main.controller;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * 외부 포털/IdP 로그아웃 콜백 등에서 사용하는 {@code /login?logout} 진입 처리.
 * SSO 로그인 사용자는 세션·로그인 화면 이동 없이 메인으로 유지한다.
 */
@Slf4j
@Controller
public class LoginLandingController {

	private static final String LOGIN_PAGE_REDIRECT = "redirect:/webapps/xs/webbase/login/login010.jsp";
	private static final String MAIN_PAGE_REDIRECT = "redirect:/webapps/xs/aichat/v2/aichat010.jsp";

	private static final String[] LOGIN_TYPE_COOKIE_NAMES = { "loginType", "LOGIN_TYPE", "isSSO", "IS_SSO" };
	private static final String LOGIN_TYPE_COOKIE = "loginType";

	@GetMapping("/login")
	public String login(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestParam(value = "logout", required = false) String logout) throws IOException {

		if (isSsoLoginByCookie(request)) {
			log.info("/login?logout skipped for SSO user (no logout, no login redirect)");
			HttpSession session = request.getSession(false);
			if (session != null && StringUtils.isNotEmpty((String) session.getAttribute("USER_ID"))) {
				return MAIN_PAGE_REDIRECT;
			}
			response.setStatus(HttpServletResponse.SC_NO_CONTENT);
			return null;
		}

		if (logout != null) {
			HttpSession session = request.getSession(false);
			if (session != null) {
				try {
					session.invalidate();
				} catch (IllegalStateException ignored) {
					// already invalidated
				}
			}
			clearLoginTypeCookie(response);
		}

		return LOGIN_PAGE_REDIRECT;
	}

	private boolean isSsoLoginByCookie(HttpServletRequest request) {
		for (String cookieName : LOGIN_TYPE_COOKIE_NAMES) {
			String value = getCookieValue(request, cookieName);
			if (isSsoLoginTypeValue(value)) {
				return true;
			}
		}
		return false;
	}

	private boolean isSsoLoginTypeValue(String raw) {
		if (StringUtils.isBlank(raw)) {
			return false;
		}
		String normalized = raw.trim().toUpperCase();
		return "SSO".equals(normalized)
				|| "Y".equals(normalized)
				|| "TRUE".equals(normalized)
				|| "1".equals(normalized);
	}

	private String getCookieValue(HttpServletRequest request, String name) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null || name == null) {
			return null;
		}
		for (Cookie cookie : cookies) {
			if (cookie != null && name.equals(cookie.getName())) {
				return cookie.getValue();
			}
		}
		return null;
	}

	private void clearLoginTypeCookie(HttpServletResponse response) {
		Cookie cookie = new Cookie(LOGIN_TYPE_COOKIE, "");
		cookie.setPath("/");
		cookie.setMaxAge(0);
		response.addCookie(cookie);
	}
}
