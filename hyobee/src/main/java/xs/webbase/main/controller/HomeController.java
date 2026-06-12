package xs.webbase.main.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import xs.aichat.config.HyobeePagePaths;
import xs.core.property.XtrmProperty;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Locale;

@Slf4j
@Controller
@RequiredArgsConstructor
public class HomeController implements ErrorController {

	private final XtrmProperty mobjXtrmConfig;

	@GetMapping(value = "/")
	public String index(HttpServletRequest request, HttpServletResponse response, HttpMethod httpMethod, Locale locale,
			@RequestHeader MultiValueMap<String, String> headerMap, @RequestHeader("host") String host,
			@CookieValue(value = "XtrmCookie", required = false) String cookie) {
		HttpSession objSession = request.getSession();
		String userId = (String) objSession.getAttribute("USER_ID");
		log.info("=============================================== INDEX 세션정보 {}", userId);
		if (StringUtils.isEmpty(userId)) {
			return HyobeePagePaths.redirectToLoginPage(mobjXtrmConfig);
		}
		return HyobeePagePaths.redirectToMainPage(mobjXtrmConfig);
	}

}
