package xs.core.config;

import java.util.Iterator;
import java.util.Optional;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;
import xs.core.api.service.ApiService;
import xs.core.database.XtrmDAOWeb;
import xs.core.enumeration.XtrmEnum;
import xs.core.dto.ApiEnvelope;
import xs.core.dto.ApiRequest;
import xs.core.property.XtrmProperty;
import xs.core.utility.XtrmCmmnUtil;
import xs.core.utility.XtrmCryptoUtil;
import xs.core.utility.extend.XtrmDateUtil;
import xs.vob.enumeration.MainEnum;

@SuppressWarnings("deprecation")
@Slf4j
@Component
public class XtrmHandlerInterceptor extends HandlerInterceptorAdapter {

	private String REQUEST_UUID;

	@Resource(name = "xtrmProperty")
	public XtrmProperty objXtrmConfig;

	@Autowired
	public XtrmDAOWeb objXtrmDao;

    @Autowired
    private ApiService apiService;

	@Override
	public boolean preHandle(HttpServletRequest objRequest, HttpServletResponse objResponse, Object objHandler) throws Exception {
		// 반환객체 생성
		boolean blnReturnValue					= true;
		// multipart file upload 여부
		boolean blnIsMultipart					= ServletFileUpload.isMultipartContent(objRequest);
		// 요청정보 UUID채번
		this.REQUEST_UUID = XtrmCmmnUtil.getUUID();
		// 요청정보 속성값에 채번된 UUID 세팅
		objRequest.setAttribute("REQUEST_UUID", this.REQUEST_UUID);

		// URI정보 추출
		String strRequestURI					= objRequest.getRequestURI();
		// client로부터 전달받은 요청정보 파라메터를 ApiEnvelope 형식으로 parsing(요청정보 로그 기록)
		ApiRequest objXtrmParams 			= new ApiRequest();
		objXtrmParams.bindFromRequest(objRequest);

		// 메뉴정보 추출
		String strMenuKey						= new String();
		if (blnIsMultipart) {
			strMenuKey							= objXtrmParams.getString("menuKey");
		} else {
			String[] objMenuInfo				= getRequestMenuInfo(objRequest);
			strMenuKey							= objMenuInfo[0];
		}

		HttpSession objSession					= objRequest.getSession(false);
		// 반환메시지JSON 생성
		ApiEnvelope objErrorJson				= new ApiEnvelope();

		// 에러코드
		String strErrorCode						= XtrmEnum.REQUEST_OK.getCode();
		// 에러메시지
		String strErrorMsg						= XtrmEnum.REQUEST_OK.getCodeName();
		// 에러메시지Sub
		String strErrorMsgSub					= new String();

		objErrorJson.setResultHeader(false, strErrorMsg, strErrorCode);

		// 유효성 체크 여부 설정
		boolean doCheckValid					= true;
		boolean doTokenCheck					= false;
		String[] split							= null;

		// 서블릿 예외
		if (MainEnum.VALID_CHECK_EXCLUDE_SERVLET_MAPPING.getCode().length() > 0) {
			split							= MainEnum.VALID_CHECK_EXCLUDE_SERVLET_MAPPING.getCode().split(",");
			for (int i = 0; i < split.length; i++) {
				if (strRequestURI.indexOf(split[i]) >= 0) {
					doCheckValid			= false;
					break;
				}
			}
		}
		// 세션 예외
		if (MainEnum.VALID_CHECK_EXCLUDE_SESSION_MAPPING.getCode().length() > 0) {
			split							= MainEnum.VALID_CHECK_EXCLUDE_SESSION_MAPPING.getCode().split(",");
			for (int i = 0; i < split.length; i++) {
				if (strRequestURI.indexOf(split[i]) >= 0) {
					doCheckValid			= false;
					break;
				}
			}
		}
		// 인터페이스
		if (MainEnum.INTERFACE_SERVLET_MAPPING.getCode().length() > 0) {
			split							= MainEnum.INTERFACE_SERVLET_MAPPING.getCode().split(",");
			for (int j = 0; j < split.length; j++) {
				if (strRequestURI.indexOf(split[j]) >= 0) {
					doCheckValid			= false;
					doTokenCheck			= true;
					break;
				}
			}
		}
		// 이미지 조회
		if (MainEnum.IMAGE_FILE_VIEW_SERVLET_MAPPING.getCode().length() > 0) {
			split							= MainEnum.IMAGE_FILE_VIEW_SERVLET_MAPPING.getCode().split(",");
			for (int j = 0; j < split.length; j++) {
				if (strRequestURI.indexOf(split[j]) >= 0) {
					doCheckValid			= false;
					break;
				}
			}
		}
		// 엑셀출력
		if (MainEnum.EXPORT_EXCEL_SERVLET_MAPPING.getCode().length() > 0) {
			split							= MainEnum.EXPORT_EXCEL_SERVLET_MAPPING.getCode().split(",");
			for (int j = 0; j < split.length; j++) {
				if (strRequestURI.indexOf(split[j]) >= 0) {
					doCheckValid			= false;
					break;
				}
			}
		}

		if (doCheckValid) {
			// 파라미터 위변조 여부 확인
			if (!checkParameterManipulation(objXtrmParams, objRequest.getMethod())) {
				blnReturnValue					= false;
				strErrorCode					= XtrmEnum.ERROR_FORGERY_PARAMETER.getCode();
				strErrorMsg						= XtrmEnum.ERROR_FORGERY_PARAMETER.getCodeName();
				strErrorMsgSub					= "Verify page address";
				// 세션 만료 여부 확인
			} else if (!checkValidSession(objXtrmParams, objSession)) {
				blnReturnValue					= false;
				strErrorCode					= XtrmEnum.ERROR_EXPIRED_SESSION.getCode();
				strErrorMsg						= XtrmEnum.ERROR_EXPIRED_SESSION.getCodeName();
				strErrorMsgSub					= "Session not found";
				// 요청기능 권한 보유 여부 확인
			} else if (!checkFuncAuthorization(objXtrmParams, strMenuKey, objSession)) {
				blnReturnValue					= false;
				strErrorCode					= XtrmEnum.ERROR_NONE_FUNCAUTH.getCode();
				strErrorMsg						= XtrmEnum.ERROR_NONE_FUNCAUTH.getCodeName();
				strErrorMsgSub					= "None Authorization";
//			}  else if(!checkValidMenukey(strMenuKey)){ // 20250314 kimsso roll back
			} else if(!checkValidParameter(objXtrmParams, strMenuKey)){// 20250113 JJH menuKey 검증 취약점 점검 로직 추가
				blnReturnValue					= false;
				strErrorCode					= XtrmEnum.ERROR_FORGERY_PARAMETER.getCode();
				strErrorMsg						= XtrmEnum.ERROR_FORGERY_PARAMETER.getCodeName();
				strErrorMsgSub					= "Verify page address";
			}
		}

		if (doTokenCheck) {
			// 토큰파라메터 유효성체크 (인터페이스 호출시 체크)
			if (!checkToken(objXtrmParams)) {
				blnReturnValue					= false;
				strErrorCode					= XtrmEnum.ERROR_TOKEN.getCode();
				strErrorMsg						= XtrmEnum.ERROR_TOKEN.getCodeName();
				strErrorMsgSub					= "Token invalid";
			}
		}

		// aichat 경로는 별도 로거 사용
		if (strRequestURI != null && strRequestURI.startsWith("/xs/aichat")) {
			org.slf4j.Logger aichatLogger = org.slf4j.LoggerFactory.getLogger("xs.aichat");
			aichatLogger.info("REQUEST_URL: {}, REQUEST_UUID: {}, SESSION_USER_ID: {}, XTRM_PARAMS: {}, ERROR_JSON: {}, MENU_KEY: {}, IS_MULTI_PART: {}, ERROR_MSG: {}",
					strRequestURI, objRequest.getAttribute("REQUEST_UUID"), objSession != null ? objSession.getAttribute("USER_ID") : null,
					objXtrmParams, objErrorJson, strMenuKey, blnIsMultipart, strErrorMsgSub);
		} else {
			log.info("REQUEST_URL: {}, REQUEST_UUID: {}, SESSION_USER_ID: {}, XTRM_PARAMS: {}, ERROR_JSON: {}, MENU_KEY: {}, IS_MULTI_PART: {}, ERROR_MSG: {}",
					strRequestURI, objRequest.getAttribute("REQUEST_UUID"), objSession != null ? objSession.getAttribute("USER_ID") : null,
					objXtrmParams, objErrorJson, strMenuKey, blnIsMultipart, strErrorMsgSub);
		}

		// 사용자 접촉 로그 기록
		registerUserAccessLog(strRequestURI, objRequest, objSession, objXtrmParams, objErrorJson, strMenuKey, blnIsMultipart);

		// 유효성 통과 불가 시
		if (!blnReturnValue) {
			// 에러결과세팅
			objErrorJson.setResultHeader(true, strErrorMsg, strErrorCode);
			objErrorJson.setString("ERROR_MSG_SUB", strErrorMsgSub);
			objResponse.setCharacterEncoding(objXtrmConfig.getString("CHARACTER_SET"));
			objResponse.getWriter().print(objErrorJson.toString());
		} else {
			objRequest.setAttribute("xtrmRequestParameter", objXtrmParams);
		}

		// 도메인으로 company_code 설정
		Optional<Object> nullableCompanyCode = Optional.ofNullable(objSession.getAttribute("COMPANY_CODE"));
		if (nullableCompanyCode.isEmpty()) {
			objXtrmParams.setString("solutionSectionCode", objXtrmConfig.getString("SOLUTION_SECTION_CODE"));
			objXtrmParams.setString("connectUrl", objRequest.getServerName());

			objSession.setAttribute("COMPANY_CODE", apiService.getCompanyCodeByDomain(objXtrmParams));
		}

		return blnReturnValue;
	}

	// 20250113 JJH menuKey 검증 취약점 점검 로직 추가
	private boolean checkValidParameter(ApiEnvelope objXtrmParams, String strMenuKey) {
		boolean blnReturnValue					= true;
		// 정규표현식 (년월일시분초)
		// 년월일시분초만 추출 (앞 17자리)
		if( strMenuKey != null && ! "".equals(strMenuKey) ){
			String regex = "^(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])\\d{5}$";
			if( strMenuKey.length() != 19 || ! Pattern.matches(regex, strMenuKey) ){
				blnReturnValue				= false;
			}
		}

		// 접근 구분 코드 AUTH_TYPE 검증 로직 추가.
		String authType = objXtrmParams.getHeaderString("AUTH_TYPE");
		String[] allowedAuthType = { "R", "S", "C", "U", "D", "O", "E", "A", "N" };
		boolean allowedCheck = false;
		for( String s : allowedAuthType ){
			if( s.equals(authType) ) {
				allowedCheck = true;
				break;
			}
		}
		if( ! allowedCheck ) blnReturnValue				= false;

		return blnReturnValue;
	}

	private boolean checkValidMenukey(String strMenuKey) {
		boolean blnReturnValue					= true;
		// 정규표현식 (년월일시분초)
		// 년월일시분초만 추출 (앞 17자리)
		if( strMenuKey != null && ! "".equals(strMenuKey) ){
			String regex = "^(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])\\d{5}$";
			if( strMenuKey.length() != 19 || ! Pattern.matches(regex, strMenuKey) ){
				blnReturnValue				= false;
			}
		}

		return blnReturnValue;
	}

	@Override
	public void postHandle(HttpServletRequest objRequest, HttpServletResponse objResponse, Object objHandler, ModelAndView objMav) throws Exception {
		if (objMav != null) {
			String mavName						= objMav.getViewName();
			if ("xtrmExportExcel".equals(mavName) || "xtrmDownloadFile".equals(mavName)) {
				objResponse.setHeader("Set-Cookie", "downloadFileToken=true; path=/");
			}
		}
	}

	@Override
	public void afterCompletion(HttpServletRequest objRequest, HttpServletResponse objResponse, Object objHandler, Exception objException) throws Exception {

	}

	private boolean checkParameterManipulation(ApiEnvelope objXtrmParams, String httpMethod) throws Exception {
		boolean blnReturnValue					= true;
		String strPrevEncryptParamsKey			= new String();
		String strPrevEncryptParamsValue		= new String();
		if (HttpMethod.POST.name().equals(httpMethod)) {
			strPrevEncryptParamsKey				= objXtrmParams.getHeaderString("ENCRYPT_PARAMS_KEY");
			strPrevEncryptParamsValue			= objXtrmParams.getHeaderString("ENCRYPT_PARAMS_VALUE");
			objXtrmParams.removeHeader("ENCRYPT_PARAMS_KEY");
			objXtrmParams.removeHeader("ENCRYPT_PARAMS_VALUE");
		} else if (HttpMethod.GET.name().equals(httpMethod)) {
			strPrevEncryptParamsKey				= objXtrmParams.getString("ENCRYPT_PARAMS_KEY");
			strPrevEncryptParamsValue			= objXtrmParams.getString("ENCRYPT_PARAMS_VALUE");
			objXtrmParams.removeKey("ENCRYPT_PARAMS_KEY");
			objXtrmParams.removeKey("ENCRYPT_PARAMS_VALUE");
		}
		ObjectNode jsonData						= objXtrmParams.getRoot();
		StringBuilder strCompareEncryptKey 		= new StringBuilder();
		StringBuilder strCompareEncryptValue	= new StringBuilder();
		Iterator<String> iter					= jsonData.fieldNames();
		String keyName							= new String();
		while (iter.hasNext()) {
			keyName								= iter.next();
			makeCompareInfo(keyName, jsonData.get(keyName), strCompareEncryptKey, strCompareEncryptValue);
		}
		String strCompareEncryptParamsKey 		= XtrmCryptoUtil.encryptSHA256(strCompareEncryptKey.toString(), "UTF-8");
		String strCompareEncryptParamsValue		= XtrmCryptoUtil.encryptSHA256(strCompareEncryptValue.toString(), "UTF-8");
		if (!strPrevEncryptParamsKey.equals(strCompareEncryptParamsKey) || !strPrevEncryptParamsValue.equals(strCompareEncryptParamsValue)) {
			blnReturnValue						= false;
		}
		return blnReturnValue;
	}

	private void makeCompareInfo(String keyName, JsonNode data, StringBuilder strCompareEncryptKey, StringBuilder strCompareEncryptValue) {
		if (data == null || data.isNull()) {
			if (!"ENCRYPT_PARAMS_KEY".equals(keyName) && !"ENCRYPT_PARAMS_VALUE".equals(keyName)) {
				strCompareEncryptKey.append(keyName);
				strCompareEncryptValue.append("");
			}
		} else if (data.isArray()) {
			for (int i = 0; i < data.size(); i++) {
				makeCompareInfo("", data.get(i), strCompareEncryptKey, strCompareEncryptValue);
			}
		} else if (data.isObject()) {
			Iterator<String> iter				= data.fieldNames();
			String dataKey						= new String();
			while (iter.hasNext()) {
				dataKey							= iter.next();
				makeCompareInfo(dataKey, data.get(dataKey), strCompareEncryptKey, strCompareEncryptValue);
			}
		} else {
			if (!"ENCRYPT_PARAMS_KEY".equals(keyName) && !"ENCRYPT_PARAMS_VALUE".equals(keyName)) {
				String value					= "";
				if (data.isTextual()) {
					value						= data.asText().replace("\r\n", "\n");
				} else if (data.isBoolean()) {
					value						= String.valueOf(data.asBoolean());
				} else if (data.isNumber()) {
					value						= String.valueOf(data.numberValue());
				} else {
					value						= data.toString().replace("\r\n", "\n");
				}
					if (keyName.toUpperCase().indexOf("ENCRYPT") >= 0) {
						value					= value.replace(" ", "+");
					}
				strCompareEncryptKey.append(keyName);
				strCompareEncryptValue.append(value);
			}
		}
	}

	private boolean checkValidSession(ApiEnvelope objXtrmParams, HttpSession objSession) {
		boolean blnReturnValue				= true;
		// 모든 세션 체크
		if (objSession == null || objSession.getAttribute("USER_ID") == null) {
			blnReturnValue					= false;
		}
		return blnReturnValue;
	}

	private boolean checkFuncAuthorization(ApiEnvelope objXtrmParams, String strMenuKey, HttpSession objSession) {
		boolean blnReturnValue					= true;
		if (objSession != null) {
			Object authMenuInfo					= objSession.getAttribute("AUTH_MENU_INFO");
			if (authMenuInfo != null) {
				String strRequestAuthTypeCode	= objXtrmParams.getHeaderString("AUTH_TYPE");
				if (strRequestAuthTypeCode == null || "".equals(strRequestAuthTypeCode)) {
					strRequestAuthTypeCode		= objXtrmParams.getString("authType");
				}
				if (!XtrmEnum.AUTH_TYPE_NONE.getCode().equals(strRequestAuthTypeCode)) {
					if (strMenuKey!=null&&!"".equals(strMenuKey)) {
						String strAuthMenuList	= authMenuInfo.toString();
						String[] objMenu		= strAuthMenuList.split(",");
						String strHasMenuAuth	= new String();
						for (int j = 0; j < objMenu.length; j++) {
							if (objMenu[j].indexOf(strMenuKey) >= 0) {
								strHasMenuAuth	= objMenu[j];
								break;
							}
						}
						if (!"".equals(strHasMenuAuth)) {
							String[] objAuth				= strHasMenuAuth.split("\\|\\|");
							boolean blnHasSelectAuth		= "1".equals(objAuth[1]);	// 조회권한보유여부
							boolean blnHasSaveAuth			= "1".equals(objAuth[2]);	// 저장권한보유여부
							boolean blnHasInsertAuth		= "1".equals(objAuth[3]);	// 등록권한보유여부
							boolean blnHasUpdateAuth		= "1".equals(objAuth[4]);	// 수정권한보유여부
							boolean blnHasDeleteAuth		= "1".equals(objAuth[5]);	// 삭제권한보유여부
							boolean blnHasPrintAuth			= "1".equals(objAuth[6]);	// 출력권한보유여부
							boolean blnHasEtcAuth			= "1".equals(objAuth[7]);	// 기타권한보유여부
							boolean blnHasAdminAuth			= "1".equals(objAuth[8]);	// 관리자권한보유여부
							// 조회권한
							if (XtrmEnum.AUTH_TYPE_SELECT.getCode().equals(strRequestAuthTypeCode)) {
								blnReturnValue	= blnHasSelectAuth;
								// 저장권한
							} else if (XtrmEnum.AUTH_TYPE_SAVE.getCode().equals(strRequestAuthTypeCode)) {
								blnReturnValue	= blnHasSaveAuth ? blnHasSaveAuth : (blnHasInsertAuth && blnHasUpdateAuth);
								// 등록권한
							} else if (XtrmEnum.AUTH_TYPE_CREATE.getCode().equals(strRequestAuthTypeCode)) {
								blnReturnValue	= blnHasSaveAuth ? blnHasSaveAuth : blnHasInsertAuth;
								// 수정권한
							} else if (XtrmEnum.AUTH_TYPE_UPDATE.getCode().equals(strRequestAuthTypeCode)) {
								blnReturnValue	= blnHasSaveAuth ? blnHasSaveAuth : blnHasUpdateAuth;
								// 삭제권한
							} else if (XtrmEnum.AUTH_TYPE_DELETE.getCode().equals(strRequestAuthTypeCode)) {
								blnReturnValue	= blnHasDeleteAuth;
								// 출력권한
							} else if (XtrmEnum.AUTH_TYPE_OUTPUT.getCode().equals(strRequestAuthTypeCode)) {
								blnReturnValue	= blnHasPrintAuth;
								// 기타권한
							} else if (XtrmEnum.AUTH_TYPE_ETC.getCode().equals(strRequestAuthTypeCode)) {
								blnReturnValue	= blnHasEtcAuth;
								// 관리자권한
							} else if (XtrmEnum.AUTH_TYPE_ADMIN.getCode().equals(strRequestAuthTypeCode)) {
								blnReturnValue	= blnHasAdminAuth;
								// 비정상적인 권한정보
							} else {
								blnReturnValue	= false;
							}
						} else {
							blnReturnValue		= false;
						}
					} else {
						blnReturnValue			= false;
					}
				}
			}
		}
		return blnReturnValue;
	}

	private void registerUserAccessLog(String strRequestURI, HttpServletRequest objRequest, HttpSession objSession, ApiEnvelope objXtrmParams, ApiEnvelope objXtrmReturn, String strMenuKey, boolean blnIsMultipart) throws Exception{
		boolean blnAccessLog  					= true;
		String[] objExcludeList					= MainEnum.ACCESS_LOG_EXCLUDE_SERVLET_MAPPING.getCode().split(",");
		String strAuthTypeCode					= objXtrmParams.getHeaderString("AUTH_TYPE");
		for (int i = 0; i < objExcludeList.length; i++) {
			//if (strRequestURI.indexOf(objExcludeList[i]) >= 0 && XtrmEnum.AUTH_TYPE_NONE.getCode().equals(strAuthTypeCode)) {
			//업무중심의 로그를 저장하기 위해 공통으로 처리하거나 권한체크가 필요없는 요청은 로그에 남기지 않는다.
			if (strRequestURI.indexOf(objExcludeList[i]) >= 0) {
				blnAccessLog				= false;
				break;
			}
		}

		boolean parameterCheck = true;
		if( !checkValidParameter(objXtrmParams,strMenuKey) ) parameterCheck = false;

		// 접근이력 대상 요청일 경우만 DB에 등록
//		if ( blnAccessLog && parameterCheck ) {
		if (blnAccessLog) {
			ApiEnvelope objXtrmLogParams		= new ApiEnvelope();
			String strCompanyCode				= objXtrmConfig.getString("COMPANY_CODE");
			String strUserId					= "";
			String strEncryptKey				= new String();
			String strSectionCode				= new String();
			if (isIndexOf(strRequestURI, MainEnum.LOGIN_SERVLET_MAPPING.getCode())) {
				strEncryptKey					= (String)objSession.getAttribute("ENCRYPT_KEY");
				strCompanyCode					= objXtrmParams.getString("companyCodeEncrypt").replace(" ", "+");
				strUserId						= objXtrmParams.getString("userIdEncrypt").replace(" ", "+");
				strCompanyCode					= XtrmCryptoUtil.decryptAES(strCompanyCode		,strEncryptKey);
				strUserId						= XtrmCryptoUtil.decryptAES(strUserId			,strEncryptKey);
//				strSectionCode					= MainEnum.SECTION_LOGIN.getCode();
				strSectionCode					= "LOGIN";
			} else if (isIndexOf(strRequestURI, MainEnum.INTERFACE_SERVLET_MAPPING.getCode())) {
				strUserId						= objXtrmParams.getHeaderString("REGISTER_ID");
				if (strUserId == null || "".equals(strUserId)) {strUserId = "";}
				strSectionCode					= MainEnum.SECTION_INTERFACE.getCode();
			} else if (isIndexOf(strRequestURI, MainEnum.LOGOUT_SERVLET_MAPPING.getCode())) {
				if (objSession != null) {
					if (objSession.getAttribute("USER_ID") != null) {
						strCompanyCode			= (String)objSession.getAttribute("COMPANY_CODE");
						strUserId				= (String)objSession.getAttribute("USER_ID");
					}
				}
				// MainEnum getCode로 값을 받을때 com_message_lang에 등록된 해당 값이 있으면 치환되서 받아옴
//				strSectionCode					= MainEnum.SECTION_LOGOUT.getCode();
				strSectionCode					= "LOGOUT";
			} else {
				if (objSession != null) {
					if (objSession.getAttribute("USER_ID") != null) {
						strCompanyCode			= (String)objSession.getAttribute("COMPANY_CODE");
						strUserId				= (String)objSession.getAttribute("USER_ID");
					}
				}

				if (isIndexOf(strRequestURI, MainEnum.FILE_UPLOAD_SERVLET_MAPPING.getCode())) {
					strSectionCode				= MainEnum.SECTION_UPLOAD.getCode();
				} else if (isIndexOf(strRequestURI, MainEnum.FILE_DOWNLOAD_SERVLET_MAPPING.getCode())) {
					strSectionCode				= MainEnum.SECTION_DOWNLOAD.getCode();
				} else if (isIndexOf(strRequestURI, MainEnum.CERTIFATION_CODE_SERVLET_MAPPING.getCode()) || isIndexOf(strRequestURI, MainEnum.CERTIFATION_CONFIRM_SERVLET_MAPPING.getCode())) {
					strSectionCode				= MainEnum.SECTION_AUTHORIZE.getCode();
				} else {
					strSectionCode				= strAuthTypeCode;
				}
			}

			objXtrmLogParams.setString("companyCode"				,strCompanyCode);
			//objXtrmLogParams.setString("accessDt"					,XtrmCmmnUtil.getFormatDateTime());
			objXtrmLogParams.setString("accessSectionCode"			,strSectionCode);
			objXtrmLogParams.setString("accessServerIp"				,XtrmCmmnUtil.getServerIPv4HostAddress());
			objXtrmLogParams.setString("requestUriInfo"				,strRequestURI);
			objXtrmLogParams.setString("requestUuidInfo"			,objRequest.getAttribute("REQUEST_UUID").toString());

			/**
			 * WEB - WAS 구성에 따른 IP 변경 (getRemoteAddr -> x-real-ip) - 2022.02.08 오승현
			 * 2024 웹 취약점 공인 IP 비교를 위한 소스 변경 - 20240819 JJH
			 * 1) 사용자 공인 IP,  X-Forwarded-For ( 1번째 IP가 client IP 이며 그 이후 IP는 거쳐온 proxy server ip 임 )
			 * 2) WEB NGINX location proxy-set-header x-real-ip 설정
			 * 3) WAS TOMCAT org.apache.catalina.valves.RemoteIpValve 설정
			 */
			String cilentIp = objRequest.getHeader("X-Forwarded-For");
			if( null != cilentIp && !cilentIp.isEmpty() ) {
				objXtrmLogParams.setString("requestClientIp"		,cilentIp.split(",")[0].trim());
			}else if(objRequest.getHeader("x-real-ip") == null) {
				objXtrmLogParams.setString("requestClientIp"		,objRequest.getRemoteAddr());
			}else {
				objXtrmLogParams.setString("requestClientIp"		,objRequest.getHeader("x-real-ip"));
			}

			objXtrmLogParams.setString("requestHeaderDetail"		,objXtrmParams.getHeaderObjectNode().toString());
			objXtrmLogParams.setString("requestBodyPartDetail"		,getSubstrByteString(String.valueOf(objXtrmParams.getDataObjectNode()), 4000));
			objXtrmLogParams.setString("responseHeaderDetail"		,objXtrmReturn.getHeaderObjectNode().toString());
			objXtrmLogParams.setString("responseBodyPartDetail"		,"");
			objXtrmLogParams.setString("etc01Info"					,objRequest.getServerName());
			objXtrmLogParams.setString("etc02Info"					,(String)objSession.getAttribute("MASTER_LOGIN_AT"));	// 마스터 로그인 사용자의 이용내역 추적을 위해 로그에 마스터 로그인 여부를 추가
			objXtrmLogParams.setString("etc03Info"					,"");
			objXtrmLogParams.setString("etc04Info"					,"");
			objXtrmLogParams.setString("etc05Info"					,"");
			objXtrmLogParams.setString("userId"						,strUserId);
			objXtrmLogParams.setString("sessionUserId"				,strUserId);
			objXtrmLogParams.setString("menuKey"					,strMenuKey);
			objXtrmLogParams.setValueToNull();
			// Access Log의 키는 DBMS키를 사용하지 않고 UUID로 변경한다.
			objXtrmLogParams.setString("logKey" , XtrmCmmnUtil.getUUID());


//			String companyCodestr = Optional.ofNullable(objXtrmLogParams.getString("sessionCompanyCode"))
//						.filter(s -> !s.isEmpty()).orElse(objXtrmLogParams.getString("companyCode"));
//			objXtrmLogParams.setString("sessionCompanyCode",companyCodestr);

			// 필수항목체크(회사코드와 사용자ID가 반드시 존재해야 접근일력을 저장한다.)
			if(!objXtrmLogParams.getErrorFlag()) {
				if (!objXtrmLogParams.getString("userId").equals("") && !objXtrmLogParams.getString("companyCode").equals("")) {
					objXtrmDao.insert("xs.core.api.ApiMapper", "insertUserAccessLog", objXtrmLogParams);
				}
			}

		}
	}

	private boolean checkToken(ApiEnvelope objXtrmParams) throws Exception {
		boolean blnReturnValue = false;
		String token = objXtrmParams.getHeaderString("TOKEN");
		if (token.equals("")) {
			token = objXtrmParams.getString("TOKEN");
		}
		if (!token.equals("")) {
			// 특수문자 치환 복원
			token.replaceAll("%26", "&").replaceAll("%2B", "+");
			ApiEnvelope baseDateTime = objXtrmDao.selectJson("xs.core.api.ApiMapper", "selectBaseDateTime", objXtrmParams);
			int diffMinute = XtrmDateUtil.getDateDiff(XtrmCryptoUtil.decryptAES(token), baseDateTime.getString("baseDateTime"), "s");
			if (diffMinute <= objXtrmConfig.getInt("TOKEN_VALID_TIME")) {
				blnReturnValue = true;
			}
		}
		return blnReturnValue;
	}

	private boolean isIndexOf(String base, String compare) {
		if (!compare.equals("") && base.indexOf(compare) >= 0) {
			return true;
		} else {
			return false;
		}
	}

	private String[] getRequestMenuInfo(HttpServletRequest objRequest) {
		String[] objReturnValue					= new String[2];
		String strMenuKey						= new String();
		String strPopupAt						= "N";
		String[] objQuerySet					= new String[]{};
		String strRequestParameter				= objRequest.getQueryString();
		if (strRequestParameter != null) {
			String[] objParams					= strRequestParameter.split("&");
			for (int i = 0; i < objParams.length; i++) {
				objQuerySet						= objParams[i].split("=");
				if (objQuerySet.length == 2) {
					if ("menuKey".equals(objQuerySet[0])) {
						strMenuKey				= objQuerySet[1];
						break;
					} else if ("popupAt".equals(objQuerySet[0])) {
						strPopupAt				= objQuerySet[1];
					}
				}
			}
			objReturnValue[0]					= strMenuKey;
			objReturnValue[1]					= strPopupAt;
		}
		return objReturnValue;
	}

	private String getSubstrByteString(String strText, int intCutSize) throws Exception {
		String strReturnValue					= strText;
		if (!strText.isEmpty()) {
			strText = strText.trim();
			if (strText.getBytes("UTF-8").length > intCutSize) {
				StringBuffer objSb				= new StringBuffer(intCutSize);
				int intIdx						= 0;
				for (char ch : strText.toCharArray()) {
					intIdx						+= String.valueOf(ch).getBytes("UTF-8").length;
					if (intIdx > intCutSize) {
						break;
					}
					objSb.append(ch);
				}
				strReturnValue					= objSb.toString();
			}
		}
		return strReturnValue;
	}
}
