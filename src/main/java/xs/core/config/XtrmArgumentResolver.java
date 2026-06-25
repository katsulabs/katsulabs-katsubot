/********************************************************************************
 * @classDescription controller 호출 전 클라이언트에서 실어보낸 요청정보의 가공 및 후처리 클래스
 * 					 호출 순서는 client > XtrmInterceptor > XtrmArgumentResolver > Controller 순이다.
 * @author HyosungITX Corp.
 * @version 1.0
 * -------------------------------------------------------------------------------
 * Modification Information
 * Date				Developer			Content
 * -------			-------------		-------------------------
 * 2019/01/03		이정원				신규생성
 * -------------------------------------------------------------------------------
 * Copyright (C) 2019 by HyosungITX Corp. All rights reserved.
 *********************************************************************************/
package xs.core.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import xs.core.handler.app.XtrmArgumentResolveMap;
import xs.core.dto.ApiEnvelope;
import xs.core.dto.ApiRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class XtrmArgumentResolver implements HandlerMethodArgumentResolver {

	@Override
	public Object resolveArgument(MethodParameter objParams, ModelAndViewContainer objMavContainer,
			NativeWebRequest objNativeRequest, WebDataBinderFactory objBinderFactory) throws Exception {
		HttpServletRequest objRequest = (HttpServletRequest) objNativeRequest.getNativeRequest();
		HttpServletResponse objResponse = (HttpServletResponse) objNativeRequest.getNativeResponse();
		HttpSession objSession = objRequest.getSession();
		XtrmArgumentResolveMap objMapParams = new XtrmArgumentResolveMap();
		ApiRequest objXtrmJsonParams = new ApiRequest();
		Object param = objRequest.getAttribute("xtrmRequestParameter");
		// aichat 경로는 별도 로거 사용
		String requestURI = objRequest.getRequestURI();
		if (requestURI != null && requestURI.startsWith("/xs/aichat")) {
			org.slf4j.Logger aichatLogger = org.slf4j.LoggerFactory.getLogger("xs.aichat");
			aichatLogger.info("REQUEST_PARAMETER: {}, {}", objRequest, param);
		} else {
			log.info("REQUEST_PARAMETER: {}, {}", objRequest, param);
		}
		if (param == null || "".equals(param)) {
			objXtrmJsonParams.bindFromRequest(objRequest);
		} else {
			if (param instanceof ApiRequest) {
				objXtrmJsonParams = (ApiRequest) param;
			} else if (param instanceof ApiEnvelope) {
				objXtrmJsonParams = new ApiRequest((ApiEnvelope) param);
			} else {
				objXtrmJsonParams = new ApiRequest(param);
			}
		}
		objRequest.removeAttribute("xtrmRequestParameter");
		objMapParams.setRequest(objRequest);
		objMapParams.setResponse(objResponse);
		objMapParams.setSession(objSession);
		objMapParams.setParams(objXtrmJsonParams);
		if (ServletFileUpload.isMultipartContent(objRequest)) {
			MultipartFile objSingleFile = null;
			List<MultipartFile> objFileList = new ArrayList<>();
			MultipartHttpServletRequest objMultipartRequest = (MultipartHttpServletRequest) objRequest;
			objSingleFile = objMultipartRequest.getFile("xuifile");
			if (objSingleFile != null) {
				objFileList.add(objSingleFile);
			} else {
				objFileList = objMultipartRequest.getFiles("xuifile[]");
			}
			objMapParams.setMultipart(objFileList);
		}
		return objMapParams;
	}

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return XtrmArgumentResolveMap.class.isAssignableFrom(parameter.getParameterType());
//		return true;
	}

}
