package xs.core.config;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("${server.error.path:${error.path:/error}}")
public class XtrmErrorController extends BasicErrorController {

	public XtrmErrorController(ErrorAttributes errorAttributes, ServerProperties serverProperties, List<ErrorViewResolver> errorViewResolvers) {
		super(errorAttributes, serverProperties.getError(), errorViewResolvers);
	}

	@RequestMapping(produces = MediaType.TEXT_HTML_VALUE)
	public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
		log.info("ERROR_HTML PRINCIPAL: {}. REQUEST_URI: {}",
				request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "anonymous", request.getRequestURI());
		HttpStatus status = getStatus(request);
		Map<String, Object> model = Collections
				.unmodifiableMap(getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.TEXT_HTML)));
		response.setStatus(status.value());
		ModelAndView modelAndView = resolveErrorView(request, response, status, model);
		log.info("ERROR_HTML ERROR: {}", model);
//		return (modelAndView != null) ? modelAndView : new ModelAndView("/errorPage", model);
		return (modelAndView != null) ? modelAndView : new ModelAndView("forward:/webapps/xs/webbase/cmmn/error010.jsp", model);
	}

	@Override
	public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
		log.info("ERROR PRINCIPAL: {}. REQUEST_URI: {}",
				request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "anonymous", request.getRequestURI());
		return super.error(request);
	}

}
