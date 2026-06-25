package xs.vob.management;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import xs.core.enumeration.XtrmEnum;
import xs.core.extend.XtrmDefaultResource;
import xs.core.dto.ApiEnvelope;
import xs.core.utility.XtrmCmmnUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Service
public class AuthPagePreload extends XtrmDefaultResource {
	
	private static String CONTEXT_ROOT_PATH				= null;
	private static String LOGIN_PAGE_URL				= null;
	private static String MAIN_PAGE_URL					= null;
	private static String ERROR_PAGE_URL				= null;
	private static String CLOUD_PAGE_URL				= null;
	private static String AI_CHAT_HICLOUD_ATTACH_URL = null;
	private static String AI_CHAT_URL	= null;

	/**
	 * 페이지가 로드되기 전 java servlet page prelude를 통해 호출되는 메소드
	 * 요청정보 유효성, 세셩 및 권한 체크를 위해 호출된다.
	 */
	public void checkValidationBeforePageLoad(HttpServletRequest objRequest, HttpServletResponse objResponse, HttpSession objSession) throws IOException {
		CONTEXT_ROOT_PATH						= objRequest.getContextPath() + "/";
		LOGIN_PAGE_URL							= "/" + mobjXtrmConfig.getString("LOGIN_PAGE_URL");
		MAIN_PAGE_URL							= "/" + mobjXtrmConfig.getString("MAIN_PAGE_URL");
		ERROR_PAGE_URL							= "/" + mobjXtrmConfig.getString("ERROR_PAGE_URL");
		CLOUD_PAGE_URL							= "/" + mobjXtrmConfig.getString("CLOUD_PAGE_URL");
        AI_CHAT_HICLOUD_ATTACH_URL              = "/" + mobjXtrmConfig.getString("AI_CHAT_HICLOUD_ATTACH_URL");
		AI_CHAT_URL								= "/" + mobjXtrmConfig.getString("AI_CHAT_URL");

		String strRequestURI					= objRequest.getRequestURI();
		String[] objMenuInfo					= getRequestMenuInfo(objRequest);
		String strMenuKey						= objMenuInfo[0];
		
		ApiEnvelope objXtrmReturn					= new ApiEnvelope();
		objXtrmReturn.setResultHeader(false, XtrmEnum.REQUEST_OK.getCodeName(), XtrmEnum.REQUEST_OK.getCode());
		objXtrmReturn.setString("XTRM_ERROR_PAGE_URL", ERROR_PAGE_URL);

		// 예외 페이지 제외
		if (!CONTEXT_ROOT_PATH.equals(strRequestURI) &&
				!strRequestURI.contains(LOGIN_PAGE_URL) &&
				!strRequestURI.contains(MAIN_PAGE_URL) &&
				!strRequestURI.contains(ERROR_PAGE_URL) &&
				!strRequestURI.contains(CLOUD_PAGE_URL) &&
				!strRequestURI.contains(AI_CHAT_HICLOUD_ATTACH_URL) &&
                !strRequestURI.contains(AI_CHAT_URL)) {
			if (!checkValidSession(strRequestURI, objSession)) {
				objXtrmReturn.setResultHeader(true, XtrmEnum.ERROR_EXPIRED_SESSION.getCodeName(), XtrmEnum.ERROR_EXPIRED_SESSION.getCode());
				objXtrmReturn.setString("ERROR_MSG_SUB", "Session not found");
			} else if(!checkRequestMenuInfo(strMenuKey)) {
				objXtrmReturn.setResultHeader(true, XtrmEnum.ERROR_FORGERY_PARAMETER.getCodeName(), XtrmEnum.ERROR_FORGERY_PARAMETER.getCode());
				objXtrmReturn.setString("ERROR_MSG_SUB", "MenuKey not found");
			} else if(!checkValidAuthorization(strMenuKey, objSession)) {
				objXtrmReturn.setResultHeader(true, XtrmEnum.ERROR_NONE_FUNCAUTH.getCodeName(), XtrmEnum.ERROR_NONE_FUNCAUTH.getCode());
				objXtrmReturn.setString("ERROR_MSG_SUB", "None Authorization");
			}
		}
		if (objXtrmReturn.getErrorFlag()) {
			log.error("XTRM_RETURN: {}", objXtrmReturn);
			objResponse.setHeader("XTRM_ERROR_DATA", URLEncoder.encode((objXtrmReturn.toString()), StandardCharsets.UTF_8));
			objResponse.sendError(HttpStatus.FORBIDDEN.value());
		}
	}

	/**
	 * 메뉴 정보
	 * @param objRequest
	 * @return
	 */
	private String[] getRequestMenuInfo(HttpServletRequest objRequest){
		String[] objReturnValue					= new String[2];
		String strMenuKey						= "";
		String strPopupAt						= "N";
		String strRequestParameter				= objRequest.getQueryString();
		if (strRequestParameter != null) {
			ObjectNode queryStringJson			= XtrmCmmnUtil.convertQueryStringToJson(objRequest.getQueryString());
			if (queryStringJson.has("menuKey")) {
				strMenuKey						= queryStringJson.path("menuKey").asText();
			}
			if (queryStringJson.has("popupAt")) {
				strPopupAt						= queryStringJson.path("popupAt").asText();
				if ("".equals(strPopupAt)) {
					strPopupAt					= "N";
				}
			}
		}
		objReturnValue[0]						= strMenuKey;
		objReturnValue[1]						= strPopupAt;
		return objReturnValue;
	}

	/**
	 * 세션 유효성 체크
	 * @param strRequestURI
	 * @param objSession
	 * @return
	 */
	private boolean checkValidSession(String strRequestURI, HttpSession objSession){
		return objSession != null && objSession.getAttribute("USER_ID") != null;
	}

	/**
	 * 메뉴 유효성 체크
	 * @param strMenuKey
	 * @return
	 */
	private boolean checkRequestMenuInfo(String strMenuKey) {
		return strMenuKey != null && !strMenuKey.isEmpty();
	}

	/**
	 * 권한 유효성 체크
	 * @param strMenuKey
	 * @param objSession
	 * @return
	 */
	private boolean checkValidAuthorization(String strMenuKey, HttpSession objSession) {
		boolean blnReturnValue					= false;
		if(objSession != null && strMenuKey != null && strMenuKey.length() >= 19) {
			// MAIN_MENU_KEY 는 세션에서 등록하지 않음 
//			if(objSession.getAttribute("MAIN_MENU_KEY") != null && !strMenuKey.equals(objSession.getAttribute("MAIN_MENU_KEY").toString())){
			String strAuthMenuList = objSession.getAttribute("AUTH_MENU_INFO") == null ? "" : objSession.getAttribute("AUTH_MENU_INFO").toString();
			String[] objMenu = strAuthMenuList.split(",");
			for (String menu : objMenu) {
				if (menu.contains(strMenuKey)) {
					blnReturnValue = true;
					break;
				}
			}
		}
		return blnReturnValue;
	}

}
