package xs.aichat.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import xs.aichat.config.HyobeePagePaths;
import xs.aichat.dto.VobLoginResult;
import xs.aichat.service.HyobeeSSOServiceImpl;
import xs.core.property.XtrmProperty;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/xs/vob/aichat")
public class HyobeeSSOController {

    private static final String LOGIN_TYPE_COOKIE = "loginType";

	private static final int LOGIN_TYPE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

	private final HyobeeSSOServiceImpl hyobeeSSOServiceImpl;

	private final XtrmProperty mobjXtrmConfig;

	@RequestMapping(value = "/ssologin", method = {RequestMethod.GET, RequestMethod.POST})
	public void ssologin(HttpServletRequest request, HttpServletResponse response) throws IOException {
		log.info("----------- 진입 --------------------");
		hyobeeSSOServiceImpl.ssoLogin(request, response);
	}

	@RequestMapping(value = "/voblogin", method = {RequestMethod.GET, RequestMethod.POST})
	public void voblogin(HttpServletRequest request, HttpServletResponse response) throws IOException {

		VobLoginResult result = hyobeeSSOServiceImpl.handleVobLogin(request, response);

		if (result.isSuccess()) {
            setLoginTypeCookie(response, "SSO");
			response.sendRedirect(HyobeePagePaths.mainPagePath(mobjXtrmConfig));
		} else {
			response.setHeader("XTRM_ERROR_DATA", result.getErrorData());
			response.sendError(HttpStatus.FORBIDDEN.value());
		}
	}

    private void setLoginTypeCookie(HttpServletResponse response, String loginType) {
        if (response == null) {
            return;
        }
        Cookie cookie = new Cookie(LOGIN_TYPE_COOKIE, loginType);
        cookie.setPath("/");
        cookie.setMaxAge(LOGIN_TYPE_COOKIE_MAX_AGE);
        response.addCookie(cookie);
    }

}
