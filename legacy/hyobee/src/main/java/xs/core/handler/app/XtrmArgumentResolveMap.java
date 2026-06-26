package xs.core.handler.app;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.multipart.MultipartFile;

import xs.core.dto.ApiEnvelope;

public class XtrmArgumentResolveMap {

	private HttpServletRequest request;
	private HttpServletResponse response;
	private HttpSession session;
	private ApiEnvelope params;
	private List<MultipartFile> multipart;

	public HttpServletRequest getRequest() {
		return request;
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}

	public HttpSession getSession() {
		return session;
	}

	public void setSession(HttpSession session) {
		this.session = session;
	}

	public ApiEnvelope getParams() {
		return params;
	}

	public void setParams(ApiEnvelope params) {
		this.params = params;
	}

	public List<MultipartFile> getMultipart() {
		return multipart;
	}

	public void setMultipart(List<MultipartFile> multipart) {
		this.multipart = multipart;
	}

}
