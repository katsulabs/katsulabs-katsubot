package xs.core.api.service;

import java.io.File;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;
import xs.core.enumeration.XtrmEnum;
import xs.core.dto.ApiEnvelope;
import xs.core.dto.ApiEnvelopes;
import xs.core.extend.XtrmDefaultResource;
import xs.core.handler.app.XtrmHttpSessionListener;
import xs.core.interfaces.XtrmFileMGInterface;

import xs.core.utility.XtrmCmmnUtil;
import xs.core.utility.XtrmCmmnUtilWeb;
import xs.core.utility.XtrmCryptoUtil;
import xs.core.utility.XtrmNIOFileUtil;
import xs.core.utility.extend.XtrmDateUtil;
import xs.aichat.v2.service.AichatUserLoginService;
import xs.vob.cmmn.service.CmmnService;
import xs.vob.enumeration.MainEnum;
import xs.vob.management.dto.ComUser;

@Slf4j
@Service
@SuppressWarnings("unchecked")
public class ApiServiceImpl extends XtrmDefaultResource implements ApiService {

	private static final ObjectMapper MAPPER = new ObjectMapper();

	@Autowired
	CmmnService cmmnService;

	@Autowired
	AichatUserLoginService aichatUserLoginService;

//	@Autowired
//	XtrmRMQComponent objRMQComponent;

	@Autowired
	XtrmFileMGInterface xtrmFileMGInterface;

	private List<Map<String, String>> toCodeList(ArrayNode dataArray) {
		if (dataArray == null) {
			return new ArrayList<>();
		}
		return MAPPER.convertValue(dataArray,
				MAPPER.getTypeFactory().constructCollectionType(List.class,
						MAPPER.getTypeFactory().constructMapType(LinkedHashMap.class, String.class, String.class)));
	}

	private ObjectNode toObjectNode(Object value) {
		return MAPPER.valueToTree(value);
	}

	//****** API 공통 관련 인터페이스  ************************************************************************//

	/**
	 * 세션을 변경하여 재로그인한다.
	 * (aichat 전용: 미사용 — 스텁 처리, 호출 시 성공만 반환)
	 */
	@Override
	public ApiEnvelope sessionSwitch(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setResultHeader(false, MainEnum.LOGIN_OK.getCodeName(), MainEnum.LOGIN_OK.getCode());
		return objXtrmReturn;
	}

	//세션객체를 생성하고 로그인 내역을 업데이트 한다.
	public void createSessionAndUpdate(ComUser objUser, HttpServletRequest objRequest) throws Exception{
		HttpSession objSession			= objRequest.getSession();
		//로그인 성공일시
		String strLoginDateTime			= XtrmCmmnUtil.getFormatDateTimeMilli("-", ":");
		Timestamp objLoginDateTime		= Timestamp.valueOf(strLoginDateTime);
		strLoginDateTime				= strLoginDateTime.replaceAll("[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]", "");
		strLoginDateTime				= strLoginDateTime.replaceAll("\\p{Z}", "");
		strLoginDateTime				= strLoginDateTime.substring(0,  strLoginDateTime.length()-3);

		//메뉴별기능권한정보
		String strAuthMenuList			= XtrmCmmnUtil.convertString(objUser.getAuthMenuList(), "");

		/**
		 * WEB - WAS 구성에 따른 IP 변경 (getRemoteAddr -> x-real-ip) - 2022.02.08 오승현
		 * 2024 웹 취약점 공인 IP 비교를 위한 소스 변경 - 20240819 JJH
		 * 1) 사용자 공인 IP,  X-Forwarded-For ( 1번째 IP가 client IP 이며 그 이후 IP는 거쳐온 proxy server ip 임 )
		 * 2) WEB NGINX location proxy-set-header x-real-ip 설정
		 * 3) WAS TOMCAT org.apache.catalina.valves.RemoteIpValve 설정
		 */
		String cilentIp = objRequest.getHeader("X-Forwarded-For");
		if( null != cilentIp && !cilentIp.isEmpty() ) {
			objUser.setRecentConnectIp(cilentIp.split(",")[0].trim());
		}else if(objRequest.getHeader("x-real-ip") == null) {
			objUser.setRecentConnectIp(objRequest.getRemoteAddr());
		}else {
			objUser.setRecentConnectIp(objRequest.getHeader("x-real-ip"));
		}

		objUser.setRecentConnectSessionIdInfo(objSession.getId());

		//세션 접속정보 세팅
		objSession.setAttribute("USER_ID"					,XtrmCmmnUtil.convertString(objUser.getUserId()						, ""));
		objSession.setAttribute("XTRM_JSESSION_ID"			,XtrmCmmnUtil.convertString(objUser.getRecentConnectSessionIdInfo()	, ""));
		objSession.setAttribute("COMPANY_CODE"				,XtrmCmmnUtil.convertString(objUser.getCompanyCode()				, ""));
		objSession.setAttribute("COMPANY_NAME"				,XtrmCmmnUtil.convertString(objUser.getCompanyName()				, ""));
		objSession.setAttribute("PU_CODE"					,XtrmCmmnUtil.convertString(objUser.getPuCode()						, ""));
		objSession.setAttribute("USER_NAME"					,XtrmCmmnUtil.convertString(objUser.getUserName()					, ""));
		objSession.setAttribute("DEPT_CODE"					,XtrmCmmnUtil.convertString(objUser.getDeptCode()					, ""));
		objSession.setAttribute("FULL_DEPT_CODE"			,XtrmCmmnUtil.convertString(objUser.getFullDeptCode()				, ""));
		objSession.setAttribute("DEPT_NAME"					,XtrmCmmnUtil.convertString(objUser.getDeptName()					, ""));
		objSession.setAttribute("FULL_DEPT_NAME"			,XtrmCmmnUtil.convertString(objUser.getFullDeptName()				, ""));
		objSession.setAttribute("ACCESS_IP"					,XtrmCmmnUtil.convertString(objUser.getRecentConnectIp()			, ""));
		
		objSession.setAttribute("PG_CODE"					,XtrmCmmnUtil.convertString(objUser.getPgCode()						, ""));
		objSession.setAttribute("PU_CODE"					,XtrmCmmnUtil.convertString(objUser.getPuCode()						, ""));
		objSession.setAttribute("GBIS_PU_CODE"				,XtrmCmmnUtil.convertString(objUser.getGbisPuCode()					, ""));
		objSession.setAttribute("MEETING_GRADE_MOD"			,XtrmCmmnUtil.convertString(objUser.getMeetingGradeMod()			, ""));
		objSession.setAttribute("DOCUMENT_AUTHORITY_FLAG"	,XtrmCmmnUtil.convertString(objUser.getDocumentAuthorityFlag()		, ""));
		objSession.setAttribute("UPDATE_YN"					,XtrmCmmnUtil.convertString(objUser.getUpdateYn()					, ""));
		// 슈퍼관리자 판단 여부
		objSession.setAttribute("ADMIN_AT"					,XtrmCmmnUtil.convertString(objUser.getAdminAt()					, ""));
		objSession.setAttribute("AUTH_GROUP_INFO"			,XtrmCmmnUtil.convertString(objUser.getAuthGroupList()				, ""));
		objSession.setAttribute("AUTH_GROUP_NAME_INFO"		,XtrmCmmnUtil.convertString(objUser.getAuthGroupNameList()			, ""));
		objSession.setAttribute("MENU_INFO"		    		,XtrmCmmnUtil.convertString(objUser.getMenuInfoList()             	, ""));
		objSession.setAttribute("SYSTEM_LIMITATIONTIME"		,XtrmCmmnUtil.convertString(objUser.getSystemLimitationtime()       , ""));
		objSession.setAttribute("DEFAULT_VALUE_01"		    ,XtrmCmmnUtil.convertString(objUser.getDefaultValue01()             , ""));
		objSession.setAttribute("DEFAULT_VALUE_02"		    ,XtrmCmmnUtil.convertString(objUser.getDefaultValue02()             , ""));
		objSession.setAttribute("DEFAULT_VALUE_03"		    ,XtrmCmmnUtil.convertString(objUser.getDefaultValue03()             , ""));
		objSession.setAttribute("DEFAULT_VALUE_04"		    ,XtrmCmmnUtil.convertString(objUser.getDefaultValue04()             , ""));
		objSession.setAttribute("DEFAULT_VALUE_05"		    ,XtrmCmmnUtil.convertString(objUser.getDefaultValue05()             , ""));
		objSession.setAttribute("AUTH_MENU_INFO"				,strAuthMenuList);
		objSession.setAttribute("LOGIN_DATETIME"				,strLoginDateTime);
		objSession.setAttribute("MAIN_PAGE_URL"				,mobjXtrmConfig.getString("MAIN_PAGE_URL"));
		objSession.setAttribute("ERROR_PAGE_URL"				,mobjXtrmConfig.getString("ERROR_PAGE_URL"));
		objSession.setAttribute("CTI_ID"						,XtrmCmmnUtil.convertString(objUser.getCtiId()						, ""));
		objSession.setAttribute("LOCAL_EXTENTION_NUMBER"		,XtrmCmmnUtil.convertString(objUser.getLocalExtentionNumber()		, ""));
		if(objUser.getVobAuthDataList()!=null){
			String[] vobAuthDataList = objUser.getVobAuthDataList().split(",");
			objSession.setAttribute("VOB_AUTH_DATA_LIST"			,vobAuthDataList);
		}
		objSession.setAttribute("CORP_CODE"					,XtrmCmmnUtil.convertString(objUser.getCorpCode()					, ""));
		objSession.setAttribute("GBIS_CORP_CODE"			,XtrmCmmnUtil.convertString(objUser.getGbisCorpCode()				, ""));

		XtrmHttpSessionListener.xtrmCreateSession((String)objSession.getAttribute("USER_ID"), objSession);

		//추가 접속정보 세팅
		objUser.setLoginAt("Y");
		objUser.setPasswordErrorCount(0);
		objUser.setRecentLoginDt(objLoginDateTime);

		//접속정보 업데이트
		cmmnService.updateUser(objUser, mobjXtrmDao);
	}

	//세션객체를 생성하고 로그인 내역을 업데이트 한다.
	public void createSessionAndUpdate(ComUser objUser, HttpServletRequest objRequest, ApiEnvelope objXtrmParams) throws Exception{
		HttpSession objSession			= objRequest.getSession();
		//로그인 성공일시
		String strLoginDateTime			= XtrmCmmnUtil.getFormatDateTimeMilli("-", ":");
		Timestamp objLoginDateTime		= Timestamp.valueOf(strLoginDateTime);
		strLoginDateTime				= strLoginDateTime.replaceAll("[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]", "");
		strLoginDateTime				= strLoginDateTime.replaceAll("\\p{Z}", "");
		strLoginDateTime				= strLoginDateTime.substring(0,  strLoginDateTime.length()-3);

		//메뉴별기능권한정보
		String strAuthMenuList			= XtrmCmmnUtil.convertString(objUser.getAuthMenuList(), "");

		/**
		 * WEB - WAS 구성에 따른 IP 변경 (getRemoteAddr -> x-real-ip) - 2022.02.08 오승현
		 * 2024 웹 취약점 공인 IP 비교를 위한 소스 변경 - 20240819 JJH
		 * 1) 사용자 공인 IP,  X-Forwarded-For ( 1번째 IP가 client IP 이며 그 이후 IP는 거쳐온 proxy server ip 임 )
		 * 2) WEB NGINX location proxy-set-header x-real-ip 설정
		 * 3) WAS TOMCAT org.apache.catalina.valves.RemoteIpValve 설정
		 */
		String cilentIp = objRequest.getHeader("X-Forwarded-For");
		if( null != cilentIp && !cilentIp.isEmpty() ) {
			objUser.setRecentConnectIp(cilentIp.split(",")[0].trim());
		}else if(objRequest.getHeader("x-real-ip") == null) {
			objUser.setRecentConnectIp(objRequest.getRemoteAddr());
		}else {
			objUser.setRecentConnectIp(objRequest.getHeader("x-real-ip"));
		}

		objUser.setRecentConnectSessionIdInfo(objSession.getId());

		//세션 접속정보 세팅
		objSession.setAttribute("USER_ID"					,XtrmCmmnUtil.convertString(objUser.getUserId()						, ""));
		objSession.setAttribute("XTRM_JSESSION_ID"			,XtrmCmmnUtil.convertString(objUser.getRecentConnectSessionIdInfo()	, ""));
		objSession.setAttribute("COMPANY_CODE"				,XtrmCmmnUtil.convertString(objUser.getCompanyCode()				, ""));
		objSession.setAttribute("COMPANY_NAME"				,XtrmCmmnUtil.convertString(objUser.getCompanyName()				, ""));
		objSession.setAttribute("PU_CODE"					,XtrmCmmnUtil.convertString(objUser.getPuCode()						, ""));
		objSession.setAttribute("CORP_CODE"					,XtrmCmmnUtil.convertString(objUser.getCorpCode()					, ""));
		objSession.setAttribute("CORP_NAME"					,XtrmCmmnUtil.convertString(objUser.getCorpName()					, ""));
		objSession.setAttribute("OFFICIAL_POSITION_CODE"	,XtrmCmmnUtil.convertString(objUser.getOfficialPositionCode()		, ""));
		objSession.setAttribute("OFFICIAL_POSITION_NAME"	,XtrmCmmnUtil.convertString(objUser.getOfficialPositionName()		, ""));
		objSession.setAttribute("USER_NAME"					,XtrmCmmnUtil.convertString(objUser.getUserName()					, ""));
		objSession.setAttribute("DEPT_CODE"					,XtrmCmmnUtil.convertString(objUser.getDeptCode()					, ""));
		objSession.setAttribute("FULL_DEPT_CODE"			,XtrmCmmnUtil.convertString(objUser.getFullDeptCode()				, ""));
		objSession.setAttribute("DEPT_NAME"					,XtrmCmmnUtil.convertString(objUser.getDeptName()					, ""));
		objSession.setAttribute("FULL_DEPT_NAME"			,XtrmCmmnUtil.convertString(objUser.getFullDeptName()				, ""));
		objSession.setAttribute("ACCESS_IP"					,XtrmCmmnUtil.convertString(objUser.getRecentConnectIp()			, ""));
		objSession.setAttribute("ETC_01_INFO"		   		,XtrmCmmnUtil.convertString(objUser.getEtc01Info()           	  	, ""));
		objSession.setAttribute("ETC_02_INFO"		    	,XtrmCmmnUtil.convertString(objUser.getEtc02Info()            		, ""));
		objSession.setAttribute("ETC_03_INFO"		   	 	,XtrmCmmnUtil.convertString(objUser.getEtc03Info()            		, ""));
		objSession.setAttribute("ETC_04_INFO"		   	 	,XtrmCmmnUtil.convertString(objUser.getEtc04Info()            		, ""));
		objSession.setAttribute("ETC_05_INFO"		    	,XtrmCmmnUtil.convertString(objUser.getEtc05Info()             		, ""));
		
		objSession.setAttribute("PG_CODE"					,XtrmCmmnUtil.convertString(objUser.getPgCode()						, ""));
		objSession.setAttribute("PU_CODE"					,XtrmCmmnUtil.convertString(objUser.getPuCode()						, ""));
		objSession.setAttribute("GBIS_PU_CODE"				,XtrmCmmnUtil.convertString(objUser.getGbisPuCode()					, ""));
		objSession.setAttribute("MEETING_GRADE_MOD"			,XtrmCmmnUtil.convertString(objUser.getMeetingGradeMod()			, ""));
		objSession.setAttribute("DOCUMENT_AUTHORITY_FLAG"	,XtrmCmmnUtil.convertString(objUser.getDocumentAuthorityFlag()		, ""));
		objSession.setAttribute("UPDATE_YN"					,XtrmCmmnUtil.convertString(objUser.getUpdateYn()					, ""));

		// 슈퍼관리자 판단 여부
		objSession.setAttribute("ADMIN_AT"					,XtrmCmmnUtil.convertString(objUser.getAdminAt()					, ""));
		objSession.setAttribute("AUTH_GROUP_INFO"			,XtrmCmmnUtil.convertString(objUser.getAuthGroupList()				, ""));
		objSession.setAttribute("AUTH_GROUP_NAME_INFO"		,XtrmCmmnUtil.convertString(objUser.getAuthGroupNameList()			, ""));
		objSession.setAttribute("MENU_INFO"		    		,XtrmCmmnUtil.convertString(objUser.getMenuInfoList()             	, ""));
		objSession.setAttribute("SYSTEM_LIMITATIONTIME"		,XtrmCmmnUtil.convertString(objUser.getSystemLimitationtime()       , ""));
		objSession.setAttribute("AUTH_MENU_INFO"			,strAuthMenuList);
		objSession.setAttribute("LOGIN_DATETIME"			,strLoginDateTime);
		objSession.setAttribute("MAIN_PAGE_URL"				,mobjXtrmConfig.getString("MAIN_PAGE_URL"));
		objSession.setAttribute("ERROR_PAGE_URL"			,mobjXtrmConfig.getString("ERROR_PAGE_URL"));
		objSession.setAttribute("CTI_ID"					,XtrmCmmnUtil.convertString(objUser.getCtiId()						, ""));
		objSession.setAttribute("LOCAL_EXTENTION_NUMBER"	,XtrmCmmnUtil.convertString(objUser.getLocalExtentionNumber()		, ""));
		objSession.setAttribute("LANGUAGE_CODE"				,objXtrmParams.getString("languageCode"));
		if(objUser.getVobAuthDataList()!=null){
			String[] vobAuthDataList = objUser.getVobAuthDataList().split(",");
			objSession.setAttribute("VOB_AUTH_DATA_LIST"			,vobAuthDataList);
		}
		objSession.setAttribute("CORP_CODE"					,XtrmCmmnUtil.convertString(objUser.getCorpCode()					, ""));
		objSession.setAttribute("GBIS_CORP_CODE"			,XtrmCmmnUtil.convertString(objUser.getGbisCorpCode()				, ""));

		// 마스터 로그인 사용자의 이용내역 추적을 위해 세션에 마스터 로그인 여부를 추가
		objSession.setAttribute("MASTER_LOGIN_AT"			,objXtrmParams.getBoolean("isMaster") ? "Y" : "N");

		// TODO: objSession.setMaxInactiveInterval() 처리 필요
		XtrmHttpSessionListener.xtrmCreateSession((String)objSession.getAttribute("USER_ID"), objSession);

		//추가 접속정보 세팅
		objUser.setLoginAt("Y");
		objUser.setPasswordErrorCount(0);
		objUser.setRecentLoginDt(objLoginDateTime);

		//접속정보 업데이트
		cmmnService.updateUser(objUser, mobjXtrmDao);
	}

	//****** API 공통 관련 인터페이스  ************************************************************************//

	//****** API 관리  ************************************************************************//
	/**
	 * 화면 로드 시 필요한 서버 기본 정보들을 반환한다. (Client 요청 시 사용)
	 */
	@Override
	public ApiEnvelope initClientPageLoad(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception {
		ApiEnvelope objXtrmReturn							= new ApiEnvelope();
		//Client에서 사용될 Configuration Property value
		objXtrmReturn.setString("SERVICE_MODE"				, mobjXtrmConfig.getString("SERVICE_MODE"));
		objXtrmReturn.setString("MAX_UPLOAD_SIZE"			, mobjXtrmConfig.getString("MAX_UPLOAD_SIZE"));
		objXtrmReturn.setString("MAX_UPLOAD_SIZE_PER_FILE"	, mobjXtrmConfig.getString("MAX_UPLOAD_SIZE_PER_FILE"));
		//계산된 날짜 데이터셋 세팅
		objXtrmReturn.setDataArrayNode(getPatternDateData(objXtrmParams).getDataArrayNode()		, "PATTERN_DATE");
		//공통코드 데이터셋 세팅
		objXtrmReturn.setDataArrayNode(getCmmnCodeData(objXtrmParams).getDataArrayNode()		, "CMMN_CODE");
		//시스템코드 데이터셋 세팅
		objXtrmReturn.setDataArrayNode(getSysCodeData(objXtrmParams).getDataArrayNode()			, "SYS_CODE");
		//다국어 데이터셋 세팅
		ApiEnvelope messageData = getMessageData(objXtrmParams);
		objXtrmReturn.setDataArrayNode(messageData.getDataArrayNode()			, "MESSAGE_DATA");
		//권한 관련 메뉴정보 데이터 세팅
		ApiEnvelope xtrmAuthMenuData						= getAuthMenuData(objXtrmParams, objSession);
		objXtrmReturn.setDataArrayNode(xtrmAuthMenuData.getDataArrayNode("AUTH_MENU_TREE")		, "AUTH_MENU_TREE");
		objXtrmReturn.setDataArrayNode(xtrmAuthMenuData.getDataArrayNode("AUTH_MENU_INFO")		, "AUTH_MENU_INFO");

		return objXtrmReturn;
	}

	/**
	 * Hyobee aichat·로그인 화면 — 다국어 메시지만 반환(com_message_lang).
	 * initClientPageLoad(VIEW_COM_CODE·AUTH_MENU 등) 없이 로컬·aichat 단독 기동 가능.
	 */
	@Override
	public ApiEnvelope initAichatPageLoad(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception {
		aichatUserLoginService.enrichSessionDisplayProfile(objSession);
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		ApiEnvelope messageData = getMessageData(objXtrmParams);
		objXtrmReturn.setDataArrayNode(messageData.getDataArrayNode(), "MESSAGE_DATA");
		return objXtrmReturn;
	}

	/**
	 * 로그인 화면 로드 시 서버 기본 정보들을 반환한다.
	 */
	@Override
	public ApiEnvelope initLoginPageLoad(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception {
		ApiEnvelope objXtrmReturn = initAichatPageLoad(objXtrmParams, objSession);
		try {
			ApiEnvelope sysCodeData = getSysCodeData(objXtrmParams);
			if (sysCodeData.getDataArrayNode() != null) {
				objXtrmReturn.setDataArrayNode(sysCodeData.getDataArrayNode(), "SYS_CODE");
			}
		} catch (Exception ex) {
			log.debug("initLoginPageLoad: SYS_CODE skipped ({})", ex.getMessage());
			attachFallbackLoginSysCode(objXtrmReturn);
		}
		return objXtrmReturn;
	}

	/** 로컬 DB에 VIEW_COM_SYS_CODE 없을 때 로그인 화면 언어 콤보(SYS028) 최소 폴백 */
	private void attachFallbackLoginSysCode(ApiEnvelope objXtrmReturn) {
		ArrayNode sys028 = JsonNodeFactory.instance.arrayNode();
		sys028.add(loginSysCodeRow("*****", "SYS028", "SYS028", "언어", "SYS028", ""));
		sys028.add(loginSysCodeRow("ko", "SYS028", "ko", "한국어", "ko", "SYS028"));
		sys028.add(loginSysCodeRow("en", "SYS028", "en", "English", "en", "SYS028"));
		ObjectNode grouped = JsonNodeFactory.instance.objectNode();
		grouped.set("SYS028", sys028);
		ArrayNode wrapper = JsonNodeFactory.instance.arrayNode();
		wrapper.add(grouped);
		objXtrmReturn.setDataArrayNode(wrapper, "SYS_CODE");
	}

	private static ObjectNode loginSysCodeRow(
			String code,
			String groupCode,
			String codeSectionCode,
			String codeName,
			String nodeId,
			String parentNodeId
	) {
		ObjectNode row = JsonNodeFactory.instance.objectNode();
		row.put("code", code);
		row.put("groupCode", groupCode);
		row.put("codeSectionCode", codeSectionCode);
		row.put("codeName", codeName);
		row.put("nodeId", nodeId);
		row.put("parentNodeId", parentNodeId);
		return row;
	}

	/**
	 * 공통코드 데이터를 반환한다. (Client 요청 시 사용)
	 */
	@Override
	public ApiEnvelope getCmmnCodeData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn							= new ApiEnvelope();
		ApiEnvelope codeData						        = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "getCmmnCodeData", objXtrmParams);
		if(codeData.getCount() > 0){
			List<Map<String, String>> objCodeList		= toCodeList(codeData.getDataArrayNode());
			Map<String, List<Map<String, String>>> objGroupby	= objCodeList.stream().collect(Collectors.groupingBy(c -> c.get("groupCode")));
			objXtrmReturn.setDataObjectNode(toObjectNode(objGroupby));
			objXtrmReturn.setHeader("COUNT"				,1);
			objXtrmReturn.setHeader("TOT_COUNT"			,1);
		}
		return objXtrmReturn;
	}

	/**
	 * 시스템코드 데이터를 반환한다. (Client 요청 시 사용)
	 */
	@Override
	public ApiEnvelope getSysCodeData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn							= new ApiEnvelope();
		ApiEnvelope codeData								= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "getSysCodeData", objXtrmParams);
		if(codeData.getCount() > 0){
			List<Map<String, String>> objCodeList		= toCodeList(codeData.getDataArrayNode());
			Map<String, List<Map<String, String>>> objGroupby	= objCodeList.stream().collect(Collectors.groupingBy(c -> c.get("groupCode")));
			objXtrmReturn.setDataObjectNode(toObjectNode(objGroupby));
			objXtrmReturn.setHeader("COUNT"				,1);
			objXtrmReturn.setHeader("TOT_COUNT"			,1);
		}
		return objXtrmReturn;
	}

	/**
	 * 그룹코드 리스트를 파라미터로 공통코드 반환 (Client 요청 시 사용)
	 */
	@Override
	public ApiEnvelope getCmmnCodeDataByGroupCodeList(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn							= new ApiEnvelope();
		ApiEnvelope objXtrmCodeData						= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "getCmmnCodeDataByGroupCodeList", objXtrmParams);
		if(objXtrmCodeData.getCount() > 0){
			List<Map<String, String>> objCodeList		= toCodeList(objXtrmCodeData.getDataArrayNode());
			Map<String, List<Map<String, String>>> objGroupby	= objCodeList.stream().collect(Collectors.groupingBy(c -> c.get("groupCode")));
			objXtrmReturn.setDataObjectNode(toObjectNode(objGroupby));
			objXtrmReturn.setHeader("COUNT"				,1);
			objXtrmReturn.setHeader("TOT_COUNT"			,1);
		}
		return objXtrmReturn;
	}

	/**
	 * 접속한 사용자의 권한정보에 따른 인가된 메뉴 데이터 반환
	 */
	@Override
	public ApiEnvelope getAuthMenuData(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception {
		// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)
		ApiEnvelope objXtrmReturn							= new ApiEnvelope();
		objXtrmParams.setString("solutionSectionCode", mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*"));
		ApiEnvelope xtrmMenuTreeData						= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "getAuthMenuTreeData", objXtrmParams);
		objXtrmReturn.setDataArrayNode(xtrmMenuTreeData.getDataArrayNode()	,"AUTH_MENU_TREE");
		Object objSessionMenuInfo						= (objSession != null ? objSession.getAttribute("AUTH_MENU_INFO") : null);
		ArrayNode objMenuDataArray						= JsonNodeFactory.instance.arrayNode();
		ObjectNode objMenuData							= JsonNodeFactory.instance.objectNode();
		if(objSessionMenuInfo != null){
			List<String> objAllMenuList					= Arrays.asList((objSessionMenuInfo.toString()).split(","));
			String[] objMenuInfo						= new String[]{};
			for(String menuInfo : objAllMenuList){
				objMenuInfo								= menuInfo.split("\\|\\|");
				if(objMenuInfo.length == 9){
					ObjectNode objMenuAuth				= JsonNodeFactory.instance.objectNode();
					objMenuAuth.put(XtrmEnum.AUTH_TYPE_SELECT.getCode()		, "1".equals(objMenuInfo[1]));
					objMenuAuth.put(XtrmEnum.AUTH_TYPE_SAVE.getCode()		, "1".equals(objMenuInfo[2]));
					objMenuAuth.put(XtrmEnum.AUTH_TYPE_CREATE.getCode()		, "1".equals(objMenuInfo[3]));
					objMenuAuth.put(XtrmEnum.AUTH_TYPE_UPDATE.getCode()		, "1".equals(objMenuInfo[4]));
					objMenuAuth.put(XtrmEnum.AUTH_TYPE_DELETE.getCode()		, "1".equals(objMenuInfo[5]));
					objMenuAuth.put(XtrmEnum.AUTH_TYPE_OUTPUT.getCode()		, "1".equals(objMenuInfo[6]));
					objMenuAuth.put(XtrmEnum.AUTH_TYPE_ETC.getCode()		, "1".equals(objMenuInfo[7]));
					objMenuAuth.put(XtrmEnum.AUTH_TYPE_ADMIN.getCode()		, "1".equals(objMenuInfo[8]));
					objMenuAuth.put(XtrmEnum.AUTH_TYPE_NONE.getCode()		, true);
					objMenuData.set(objMenuInfo[0], objMenuAuth);
				}
			}
			objMenuDataArray.add(objMenuData);
		}
		objXtrmReturn.setDataArrayNode(objMenuDataArray, "AUTH_MENU_INFO");
		return objXtrmReturn;
	}

	/**
	 * 사용자 즐겨찾기 메뉴 등록 및 추가
	 */
	@Override
	public ApiEnvelope saveUserBookmarkMenu(ApiEnvelope params) throws Exception {
		ApiEnvelope xtrmReturn								= new ApiEnvelope();
		String dataFlag									= params.getString("dataFlag");
		int processCount								= 0;
		if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(dataFlag)){
			processCount								= ApiEnvelopes.insert(mobjXtrmDao, "xs.core.api.ApiMapper", "insertComUserBookmark", params);
		}else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(dataFlag)){
			processCount								= ApiEnvelopes.delete(mobjXtrmDao, "xs.core.api.ApiMapper", "deleteComUserBookmark", params);
		}
		if(processCount == 0){
			xtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return xtrmReturn;
	}

	/**
	 * 사용자 즐겨찾기 메뉴 순서 변경
	 */
	@Override
	public ApiEnvelope updateUserBookmarkMenu(ApiEnvelope params) throws Exception {
		ApiEnvelope xtrmReturn								= new ApiEnvelope();
		int processCount								= ApiEnvelopes.updateList(mobjXtrmDao, "xs.core.api.ApiMapper", "updateComUserBookmark", params);
		if(processCount == 0){
			xtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return xtrmReturn;
	}

	/**
	 * 계산된 날짜 데이터셋을 반환한다. (Client 요청 시 사용)
	 */
	@Override
	public ApiEnvelope getPatternDateData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn							= new ApiEnvelope();
		ArrayNode objDateJsonArray						= JsonNodeFactory.instance.arrayNode();
		ObjectNode objDateJson							= JsonNodeFactory.instance.objectNode();
		String strCurrDate								= XtrmCmmnUtil.getFormatDate();
		objDateJson.put("TODAY"					, strCurrDate);
		objDateJson.put("ONE_DAY_AGO"			, XtrmCmmnUtil.getAddDate(strCurrDate, "d", -1));
		objDateJson.put("ONE_DAY_NEXT"			, XtrmCmmnUtil.getAddDate(strCurrDate, "d", 1));
		objDateJson.put("THREE_DAYS_AGO"		, XtrmCmmnUtil.getAddDate(strCurrDate, "d", -3));
		objDateJson.put("THREE_DAYS_NEXT"		, XtrmCmmnUtil.getAddDate(strCurrDate, "d", 3));
		objDateJson.put("SEVEN_DAYS_AGO"		, XtrmCmmnUtil.getAddDate(strCurrDate, "d", -7));
		objDateJson.put("SEVEN_DAYS_NEXT"		, XtrmCmmnUtil.getAddDate(strCurrDate, "d", 7));
		objDateJson.put("TEN_DAYS_AGO"			, XtrmCmmnUtil.getAddDate(strCurrDate, "d", -10));
		objDateJson.put("TEN_DAYS_NEXT"			, XtrmCmmnUtil.getAddDate(strCurrDate, "d", 10));
		objDateJson.put("HALF_MONTH_AGO"		, XtrmCmmnUtil.getAddDate(strCurrDate, "d", -15));
		objDateJson.put("HALF_MONTH_NEXT"		, XtrmCmmnUtil.getAddDate(strCurrDate, "d", 15));
		objDateJson.put("ONE_MONTH_AGO"			, XtrmCmmnUtil.getAddDate(strCurrDate, "M", -1));
		objDateJson.put("ONE_MONTH_NEXT"		, XtrmCmmnUtil.getAddDate(strCurrDate, "M", 1));
		objDateJson.put("TWO_MONTHS_AGO"		, XtrmCmmnUtil.getAddDate(strCurrDate, "M", -2));
		objDateJson.put("TWO_MONTHS_NEXT"		, XtrmCmmnUtil.getAddDate(strCurrDate, "M", 2));
		objDateJson.put("THREE_MONTHS_AGO"		, XtrmCmmnUtil.getAddDate(strCurrDate, "M", -3));
		objDateJson.put("THREE_MONTHS_NEXT"		, XtrmCmmnUtil.getAddDate(strCurrDate, "M", 3));
		objDateJson.put("SIX_MONTHS_AGO"		, XtrmCmmnUtil.getAddDate(strCurrDate, "M", -6));
		objDateJson.put("SIX_MONTHS_NEXT"		, XtrmCmmnUtil.getAddDate(strCurrDate, "M", 6));
		objDateJson.put("ONE_YEAR_AGO"			, XtrmCmmnUtil.getAddDate(strCurrDate, "y", -1));
		objDateJson.put("ONE_YEAR_NEXT"			, XtrmCmmnUtil.getAddDate(strCurrDate, "y", 1));
		objDateJson.put("THIS_WEEK_BEGIN"		, XtrmCmmnUtil.getFirstDayOfWeek(strCurrDate, ""));
		objDateJson.put("THIS_WEEK_END"			, XtrmCmmnUtil.getLastDayOfWeek(strCurrDate, ""));
		objDateJson.put("CURRENT"				, XtrmCmmnUtil.getFormatDateTime());
		objDateJsonArray.add(objDateJson);
		objXtrmReturn.setDataArrayNode(objDateJsonArray);
		objXtrmReturn.setHeader("COUNT"					,objDateJsonArray.size());
		objXtrmReturn.setHeader("TOT_COUNT"				,objDateJsonArray.size());

		return objXtrmReturn;
	}

	/**
	 * 프로퍼티 특정 키 정보를 반환한다. (Client 요청 시 사용)
	 */
	@Override
	public ApiEnvelope getProperty(ApiEnvelope objXtrmParams){
		ApiEnvelope objXtrmReturn			= new ApiEnvelope();
		String strPropertyKey			= objXtrmParams.getString("PROPERTY_KEY"	, 0, "");
		String strPropertyDefaultValue	= objXtrmParams.getString("PROPERTY_DEFAULT", 0, "");
		Object objReturnValue			= mobjXtrmConfig.getObject(strPropertyKey);
		if(objReturnValue == null || "".equals(objReturnValue.toString())){objReturnValue = strPropertyDefaultValue;}
		objXtrmReturn.setResultHeader(false);
		objXtrmReturn.setObject(strPropertyKey, objReturnValue);
		return objXtrmReturn;
	}

	/**
	 * 현재일시 정보를 반환한다. (Client 요청 시 사용)
	 */
	@Override
	public ApiEnvelope getDateTimeNow() {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setString("current", XtrmCmmnUtil.getFormatDateTime());
		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope getLastDayOfMonth(ApiEnvelope objXtrmParams) {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setString("lastDate", XtrmCmmnUtil.getLastDayOfMonth(objXtrmParams.getString("baseDate"), ""));
		return objXtrmReturn;
	}


	/**
	 * 두 날짜(시간) 사이의 계산 정보를 반환한다. (Client 요청 시 사용)
	 */
	@Override
	public ApiEnvelope getDateTimeDiff(ApiEnvelope objXtrmParams){
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String strBeginDateTime = objXtrmParams.getString("beginDateTime");
		String strEndDateTime	= objXtrmParams.getString("endDateTime");
		String strDiffType		= objXtrmParams.getString("diffType");
		Object objDiffCnt		= new Object();
		if("y".equals(strDiffType) || "M".equals(strDiffType) || "d".equals(strDiffType)){
			objDiffCnt			= XtrmCmmnUtil.getDateDiff(strBeginDateTime, strEndDateTime, strDiffType);
			objDiffCnt			= (int)objDiffCnt;
		}else if("H".equals(strDiffType) || "m".equals(strDiffType) || "s".equals(strDiffType)) {
			objDiffCnt			= XtrmCmmnUtil.getTimeDiff(strBeginDateTime, strEndDateTime, strDiffType);
			objDiffCnt			= (long)objDiffCnt;
		}
		objXtrmReturn.setResultHeader(false);
		objXtrmReturn.setObject("DIFF_COUNT", objDiffCnt);

		return objXtrmReturn;
	}

	/**
	 * 특정 일(시간)을 계산한 정보를 반환한다. (Client 요청 시 사용)
	 */
	@Override
	public ApiEnvelope getAddDate(ApiEnvelope objXtrmParams){
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String strBaseDate		= objXtrmParams.getString("baseDate");
		String strAddType		= objXtrmParams.getString("addType");
		int intAddCnt			= objXtrmParams.getInt("addCount");
		String strDelimiter		= objXtrmParams.getString("delimiter");
		objXtrmReturn.setResultHeader(false);
		objXtrmReturn.setString("ADD_DATE", XtrmCmmnUtil.getAddDate(strBaseDate, strDelimiter, strAddType, intAddCnt));
		return objXtrmReturn;
	}

	/**
	 * 특정 키 세션정보를 조회한다. (Client 요청 시 사용)
	 */
	@SuppressWarnings("null")
	@Override
	public ApiEnvelope getSessionInfo(ApiEnvelope objXtrmParams, HttpServletRequest objRequest){
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String strSessionKey	= objXtrmParams.getString("key");
		String strValue			= new String();
		Object objValue			= new Object();
		ObjectNode jsonObject	= JsonNodeFactory.instance.objectNode();
		HttpSession objSession	= objRequest.getSession(false);
		Date createDate = new Date(objRequest.getSession().getCreationTime());
		Date accessDate = new Date(objRequest.getSession().getLastAccessedTime());
		log.debug("세션생성일시: {},세션접근일시:{}, 세션경과(분):",
				XtrmCmmnUtil.convertFormatDate(createDate, "yyyy-MM-dd HH:mm:ss"),
				XtrmCmmnUtil.convertFormatDate(accessDate, "yyyy-MM-dd HH:mm:ss"),
				XtrmDateUtil.getDateDiff(createDate,accessDate,"m"));
		if("IS_EXPIRED_AT".equals(strSessionKey)) {
			if(objSession == null){
				strValue		= "Y";
			}else if(objSession.getAttribute("USER_ID") == null) {
				strValue		= "Y";
			}else {
				strValue		= "N";
			}
		}else if(objSession != null && objSession.getAttribute(strSessionKey) != null){
			if(objSession.getAttribute(strSessionKey) instanceof String){
				strValue			= objSession.getAttribute(strSessionKey).toString();
				jsonObject.put(strSessionKey, strValue);
			}else{//String이 아닌 Object일경우 Object로 받는경우 추가 24.11.26
				objValue			= objSession.getAttribute(strSessionKey);
				jsonObject.put(strSessionKey, MAPPER.valueToTree(objValue).toString());
			}
		}else if("ALL".equals(strSessionKey) && objSession != null) {
			Enumeration<String> attribute = objSession.getAttributeNames();
			while(attribute.hasMoreElements()) {
				strSessionKey 	= attribute.nextElement();
				strValue		= objSession.getAttribute(strSessionKey).toString();
				jsonObject.put(strSessionKey, strValue);
			}
		}

		//objXtrmReturn.setString(strSessionKey, strValue);
		//전체 세션 정보를 가져오기 위해 처리 김정환 수정 2022.02.08
		objXtrmReturn.setDataObjectNode(jsonObject);
		objXtrmReturn.setResultHeader(false);
		return objXtrmReturn;
	}

	/**
	 * 특정 키 세션정보를 조회한다. (Server 영역에서 사용)
	 */
	@Override
	public String getSessionInfo(String strAttributeKey){
		ApiEnvelope objXtrmParams	= new ApiEnvelope();
		objXtrmParams.setString("key", strAttributeKey);
		ApiEnvelope objXtrmReturn	= getSessionInfo(objXtrmParams, XtrmCmmnUtilWeb.getServletRequest());
		return objXtrmReturn.getString(strAttributeKey, 0, "");
	}

	/**
	 *
	 */
	@Override
	public ApiEnvelope getUniqueKey() throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "getUniqueKeyWithSequence", new ApiEnvelope());
	}

	@Override
	public ModelAndView exportExcelGridData(ApiEnvelope objXtrmParams) throws Exception {
		ArrayNode directData = objXtrmParams.getDataArrayNode("GRID_DATA");
		boolean hasDirectData = (directData != null && !directData.isEmpty());

		// 1. 쿼리 전문(executionSqlSpeciality)이 없으면 뷰에서 에러가 날 수 있음
		if (hasDirectData) {
			// 직접 데이터가 있을 경우, 쿼리 전문을 빈 문자열이나 주석 처리된 가짜 쿼리로 설정
			// 공통 엑셀 뷰가 "쿼리가 없으면 쿼리 실행을 건너뛰도록" 유도함
			if (objXtrmParams.getString("executionSqlSpeciality").isEmpty()) {
				objXtrmParams.setString("executionSqlSpeciality", "/* API_MODE_DIRECT_DATA */");
			}
		} else {
			// 기존 쿼리 방식 유지
			String sqlId = objXtrmParams.getString("sqlId");
			String sqlNamespace = objXtrmParams.getString("sqlNameSpace");

			if (!"".equals(sqlId) && !"".equals(sqlNamespace)) {
				HashMap<String, Object> objConvertMap = new HashMap<>();
				if (objXtrmParams.getDataArrayNode().size() > 0) {
					objConvertMap = MAPPER.convertValue(objXtrmParams.getDataObjectNode(), objConvertMap.getClass());
					String strSql = mobjXtrmDao.getSqlStatement(sqlNamespace, sqlId, objConvertMap);
					objXtrmParams.setString("executionSqlSpeciality", strSql);
				}
			}
		}

		// 2. 이력 저장 시 에러가 나면 HTML 에러 페이지가 반환되므로 try-catch로 감싸기
		try {
			ApiEnvelopes.insert(mobjXtrmDao, "xs.core.api.ApiMapper", "insertComExcel", objXtrmParams);
		} catch (Exception e) {
			// 이력 저장 실패해도 엑셀은 나오게 함
		}

		ModelAndView objMav = new ModelAndView("xtrmExportExcel");
		objMav.addObject("objXtrmDao", mobjXtrmDao);
		objMav.addObject("objXtrmConfig", mobjXtrmConfig);
		objMav.addObject("objXtrmParams", objXtrmParams);
		objMav.addObject("filename", objXtrmParams.getString("excelFileName"));

		return objMav;
	}

	@Override
	public ApiEnvelope importExcelGridData(ApiEnvelope objXtrmParams) throws Exception {
		throw new UnsupportedOperationException("aichat 전용 구성에서는 미지원");
	}

	@Override
	public ApiEnvelope readTextFile(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		String strFilePathInfo		= new String();
		ApiEnvelope xtrmFileData		= getUploadedFileData(objXtrmParams);
		objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());
		if(!xtrmFileData.getErrorFlag() && xtrmFileData.getCount() > 0){
			strFilePathInfo			= mobjXtrmConfig.getString("FILE_UPLOAD_ROOT_PATH") + xtrmFileData.getString("filePathInfo");
		}else{
			strFilePathInfo			= mobjXtrmConfig.getString("FILE_UPLOAD_ROOT_PATH") + objXtrmParams.getString("filePathInfo");
		}
		xtrmFileData				= XtrmNIOFileUtil.getFileInfo(strFilePathInfo);
		if(!xtrmFileData.getErrorFlag() && xtrmFileData.getCount() > 0){
			objXtrmReturn			= xtrmFileData;
		}else{
			xtrmFileData.setString("fileContents", new String(XtrmNIOFileUtil.readFile(strFilePathInfo), "UTF-8"));
		}
		return objXtrmReturn;
	}


	@Override
	public ApiEnvelope getUploadedFileData(ApiEnvelope objXtrmParams) throws Exception {
		List<String> fileGroupKeyList	= new ArrayList<>();
		List<String> fileKeyList		= new ArrayList<>();
		String fileGroupKey				= new String();
		String fileKey					= new String();
		int size						= objXtrmParams.getCount();
		String extAt                   = "N";
		for(int i = 0; i < size; i++){
			fileGroupKey				= objXtrmParams.getString("fileGroupKey", i);
			fileKey						= objXtrmParams.getString("fileKey"		, i);
			extAt						= objXtrmParams.getString("extAt"		, i);
			if(!"".equals(fileGroupKey) && fileGroupKeyList.indexOf(fileGroupKey) < 0){
				fileGroupKeyList.add(fileGroupKey);
			}
			if(!"".equals(fileKey) && fileKeyList.indexOf(fileKey) < 0){
				fileKeyList.add(fileKey);
			}
		}
		objXtrmParams.setObject("fileGroupKeyList"	,fileGroupKeyList);
		objXtrmParams.setObject("fileKeyList"		,fileKeyList);

		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		if(extAt.equals("Y")) {
			objXtrmReturn				= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "getUploadFileExtGroupList", objXtrmParams);
		} else {
			objXtrmReturn				= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "getUploadFileGroupList", objXtrmParams);
		}
		int count						= objXtrmReturn.getCount();
		String fileExtension			= new String();
		for(int i = 0; i < count; i++){
			fileExtension				= objXtrmReturn.getString("fileExtensionName", i);
			objXtrmReturn.setString("link"			, objXtrmParams.getString("downloadUrl", 0, "")		,i);
			objXtrmReturn.setString("status"		, "uploaded"										,i);
			objXtrmReturn.setString("DATA_FLAG"		, XtrmEnum.TRANSACTION_NONE.getCode()				,i);
			objXtrmReturn.setString("name"			, objXtrmReturn.getString("originalFileSubject", i)	,i);
			objXtrmReturn.setInt("size"				, objXtrmReturn.getInt("fileSize" ,i)				,i);
			if("png".equals(fileExtension) || "jpg".equals(fileExtension) || "jpeg".equals(fileExtension) || "gif".equals(fileExtension)){
				objXtrmReturn.setString("preview"	, "Y"	, i);
			}
		}
		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope uploadFile(List<MultipartFile> objFileList, ApiEnvelope objXtrmParams) throws Exception {
		//최종 반환객체 생성
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		//최초 반환정보 세팅
		objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());
		//DB처리 파라메터 객체
		ApiEnvelope objXtrmFileParams	= new ApiEnvelope();
		//업로드 Root 경로
		String strRootFilePath		= mobjXtrmConfig.getString("FILE_UPLOAD_ROOT_PATH");
		//sub 경로
		String strSubPath			= objXtrmParams.getString("subFilePath");
		//날짜정보와 session 정보를 조합하여 실제 업로드 경로 세팅 (Root/YYYY/MM/DD/userId/)
		String strRequestUserId		= getSessionInfo("USER_ID");
		String[] objCurrentDate		= XtrmCmmnUtil.getFormatDate("/").split("/");
		String strUploadRootPath	= strRootFilePath + "/" + strSubPath + "/" + objCurrentDate[0] + "/" + objCurrentDate[1] + "/" + objCurrentDate[2] + "/" + strRequestUserId + "/";
		//해당 경로 폴더 존재여부 체크 후 없을 시 생성
		XtrmNIOFileUtil.createDirectory(strUploadRootPath);
		//파일그룹키가 존재하지 않을 시 DB Sequence를 이용하여 채번한다.
		String strFileGroupKey	 	= objXtrmParams.getString("fileGroupKey", 0, "");
		if("".equals(strFileGroupKey)){
			strFileGroupKey			= getUniqueKey().getString("uniqueKey");
		}
		//파일갯수만큼 loop 처리
		String strFileFullPath		= new String();
		int intFileCount			= objFileList.size();
		long longFileSize			= 0;
		String strOriginalFileName	= new String();
		String strSafetyFileName	= new String();
		String strFileExtension		= new String();
		String strFileKey			= new String();
		MultipartFile objFile		= null;
		int paramSize				= objXtrmParams.getCount();
		for(int i = 0; i < intFileCount; i++){
			//파일
			objFile					= objFileList.get(i);
			//파일사이즈
			longFileSize			= objFile.getSize();
			//원본파일명
			strOriginalFileName		= objFile.getOriginalFilename();
			//확장자
			strFileExtension		= strOriginalFileName.substring(strOriginalFileName.lastIndexOf(".")+1);
			//안전파일명
			strSafetyFileName		= XtrmNIOFileUtil.getSafetyFileName() + "." + strFileExtension;
			//변경파일명을 포함한 파일 전체경로
			strFileFullPath			= (strUploadRootPath + strSafetyFileName).replaceAll("/", "\\\\");
			//임시파일을 move처리
			objFile.transferTo(new File(strFileFullPath));
			//파일정보 DB 저장 처리
			strFileKey				= getUniqueKey().getString("uniqueKey");
			objXtrmFileParams.setString("fileGroupKey"		,strFileGroupKey);
			objXtrmFileParams.setString("fileKey"			,strFileKey);
			objXtrmFileParams.setString("originalFileSubject"	,strOriginalFileName);
			objXtrmFileParams.setString("safetyFileName"	,strSafetyFileName);
			objXtrmFileParams.setString("filePathInfo"		,strFileFullPath);
			objXtrmFileParams.setLong("fileSize"			,longFileSize);
			objXtrmFileParams.setString("fileExtensionName"	,strFileExtension);
			objXtrmFileParams.setString("useAt"				,"Y");
			objXtrmFileParams.setInt("downloadCount"		,0);
			objXtrmFileParams.setString("createDt"			,XtrmCmmnUtil.getFormatDateTimeMilli());
			ApiEnvelopes.insert(mobjXtrmDao, "xs.core.api.ApiMapper", "insertComFiles", objXtrmFileParams);
			//파일그룹키와 파일키 정보를 반환정보에 세팅
			for(int j = 0; j < paramSize; j++){
				if(strOriginalFileName.equals(XtrmCmmnUtil.restoreXSSConst(objXtrmParams.getString("fileName", j)))){
					objXtrmReturn.setObject(objXtrmParams.getString("fileId", j), objXtrmFileParams.getDataObjectNode());
					break;
				}
			}
		}
		return objXtrmReturn;
	}

	@Override
	public ModelAndView downloadFile(ApiEnvelope objXtrmParams) throws Exception {
		objXtrmParams.setString("sessionCompanyCode"		,getSessionInfo("COMPANY_CODE"));
		objXtrmParams.setString("sessionUserId"				,getSessionInfo("USER_ID"));
		ModelAndView objMav = new ModelAndView("xtrmDownloadFile");
		objMav.addObject("objXtrmDao"		,mobjXtrmDao);
		objMav.addObject("objXtrmConfig"	,mobjXtrmConfig);
		objMav.addObject("objXtrmParams"	,objXtrmParams);

		return objMav;
	}


	@Override
	public ApiEnvelope deleteFile(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		//삭제 대상 파일 데이터 조회
		ApiEnvelope objXtrmFileData	= getUploadedFileData(objXtrmParams);
		int intFileCount			= objXtrmFileData.getCount();
		//파일 데이터 삭제처리
		int intProcessCount			= ApiEnvelopes.delete(mobjXtrmDao, "xs.core.api.ApiMapper", "deleteComFiles", objXtrmParams);
		if(intProcessCount > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		//실제 파일 삭제처리
		for(int i = 0; i < intFileCount; i++){
			XtrmNIOFileUtil.deleteFile(mobjXtrmConfig.getString("FILE_UPLOAD_ROOT_PATH") + objXtrmFileData.getString("filePathInfo", i));
		}
		return objXtrmReturn;
	}

	@Override
	public ModelAndView getFileStream(ApiEnvelope objXtrmParams) throws Exception {
		objXtrmParams.setString("sessionCompanyCode"	,getSessionInfo("COMPANY_CODE"));
		objXtrmParams.setString("sessionUserId"			,getSessionInfo("USER_ID"));
		ModelAndView objMav = new ModelAndView("xtrmFileStream");
		objMav.addObject("objXtrmDao"		,mobjXtrmDao);
		objMav.addObject("objXtrmConfig"	,mobjXtrmConfig);
		objMav.addObject("objXtrmParams"	,objXtrmParams);

		return objMav;
	}

	@Override
	public ApiEnvelope getUploadedFileExtData(ApiEnvelope objXtrmParams) throws Exception {
		List<String> fileGroupKeyList	= new ArrayList<>();
		List<String> fileKeyList		= new ArrayList<>();
		String fileGroupKey				= new String();
		String fileKey					= new String();
		int size						= objXtrmParams.getCount();
		for(int i = 0; i < size; i++){
			fileGroupKey				= objXtrmParams.getString("fileGroupKey", i);
			fileKey						= objXtrmParams.getString("fileKey"		, i);
			if(!"".equals(fileGroupKey) && fileGroupKeyList.indexOf(fileGroupKey) < 0){
				fileGroupKeyList.add(fileGroupKey);
			}
			if(!"".equals(fileKey) && fileKeyList.indexOf(fileKey) < 0){
				fileKeyList.add(fileKey);
			}
		}
		objXtrmParams.setObject("fileGroupKeyList"	,fileGroupKeyList);
		objXtrmParams.setObject("fileKeyList"		,fileKeyList);
		ApiEnvelope objXtrmReturn			= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "getUploadFileExtGroupList", objXtrmParams);
		int count						= objXtrmReturn.getCount();
		String fileExtension			= new String();
		for(int i = 0; i < count; i++){
			fileExtension				= objXtrmReturn.getString("fileExtensionName", i);
			objXtrmReturn.setString("link"			, mobjXtrmConfig.getString("FILE_UPLOAD_ROOT_PATH") + objXtrmReturn.getString("filePathInfo", 0, "")	,i);
			objXtrmReturn.setString("fileStatus"	, objXtrmReturn.getString("fileStatus", i)																,i);
			objXtrmReturn.setString("status"		, "uploaded"																							,i);
			objXtrmReturn.setString("DATA_FLAG"		, XtrmEnum.TRANSACTION_NONE.getCode()																	,i);
			objXtrmReturn.setString("name"			, objXtrmReturn.getString("originalFileName", i)														,i);
			objXtrmReturn.setInt("size"				, objXtrmReturn.getInt("fileSize" ,i)																	,i);
			if("png".equals(fileExtension) || "jpg".equals(fileExtension) || "jpeg".equals(fileExtension) || "gif".equals(fileExtension)){
				objXtrmReturn.setString("preview"	, "Y"	, i);
			}
		}
		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope tempUploadFileExt(List<MultipartFile> objFileList, ApiEnvelope objXtrmParams) throws Exception {
		//최종 반환객체 생성
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		//최초 반환정보 세팅
		objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());
		//DB처리 파라메터 객체
		ApiEnvelope objXtrmFileParams	= new ApiEnvelope();
		//업로드 Temp 경로
		String strTempFilePath		= mobjXtrmConfig.getString("FILE_UPLOAD_TEMP_PATH");
		//날짜정보와 session 정보를 조합하여 실제 업로드 경로 세팅 (Root/YYYY/MM/DD/userId/)
		String strRequestUserId		= getSessionInfo("USER_ID");
		String[] objCurrentDate		= XtrmCmmnUtil.getFormatDate("/").split("/");
		String strUploadTempPath	= strTempFilePath + "/" + objCurrentDate[0] + "/" + objCurrentDate[1] + "/" + objCurrentDate[2] + "/" + strRequestUserId + "/";
		String strTempRelativePath  = "/" + objCurrentDate[0] + "/" + objCurrentDate[1] + "/" + objCurrentDate[2] + "/" + strRequestUserId + "/";
		//해당 경로 폴더 존재여부 체크 후 없을 시 생성
		XtrmNIOFileUtil.createDirectory(strUploadTempPath);
		//파일그룹키가 존재하지 않을 시 DB Sequence를 이용하여 채번한다.
		String strFileGroupKey	 	= objXtrmParams.getString("fileGroupKey", 0, "");
		if("".equals(strFileGroupKey)){
			strFileGroupKey			= getUniqueKey().getString("uniqueKey");
		}
		//파일갯수만큼 loop 처리
		String strFileFullPath		= new String();
		String strFileRelativePath  = new String();
		int intFileCount			= objFileList.size();
		long longFileSize			= 0;
		String strOriginalFileName	= new String();
		String strSafetyFileName	= new String();
		String strFileExtension		= new String();
		String strFileKey			= new String();
		MultipartFile objFile		= null;
		int paramSize				= objXtrmParams.getCount();
		for(int i = 0; i < intFileCount; i++){
			//파일
			objFile					= objFileList.get(i);
			//파일사이즈
			longFileSize			= objFile.getSize();
			//원본파일명
			strOriginalFileName		= objFile.getOriginalFilename();
			//확장자
			strFileExtension		= strOriginalFileName.substring(strOriginalFileName.lastIndexOf(".")+1);
			//안전파일명
			strSafetyFileName		= XtrmNIOFileUtil.getSafetyFileName() + "." + strFileExtension;
			//변경파일명을 포함한 파일 전체경로
			strFileFullPath			= (strUploadTempPath + strSafetyFileName);
			//변경파일명을 포함한 파일 상대경로
			strFileRelativePath     = (strTempRelativePath + strSafetyFileName);
			//임시파일을 move처리
			File toFile = new File(strFileFullPath);
			toFile.setExecutable(true);
			toFile.setWritable(true);
			toFile.setReadable(true);
			objFile.transferTo(new File(strFileFullPath));
			//파일정보 DB 저장 처리
			strFileKey				= getUniqueKey().getString("uniqueKey");
			objXtrmFileParams.setString("fileGroupKey"		,strFileGroupKey);
			objXtrmFileParams.setString("fileKey"			,strFileKey);
			objXtrmFileParams.setString("originalFileName"	,strOriginalFileName);
			objXtrmFileParams.setString("safetyFileName"	,strSafetyFileName);
			objXtrmFileParams.setString("filePathInfo"		,strFileRelativePath);
			objXtrmFileParams.setLong("fileSize"			,longFileSize);
			objXtrmFileParams.setString("fileExtensionName"	,strFileExtension);
			objXtrmFileParams.setString("useAt"				,"Y");
			objXtrmFileParams.setString("fileStatus"		,"T"); //상태 T:임시
			objXtrmFileParams.setInt("downloadCount"		,0);
			objXtrmFileParams.setString("createDt"			,XtrmCmmnUtil.getFormatDateTimeMilli());
			ApiEnvelopes.insert(mobjXtrmDao, "xs.core.api.ApiMapper", "insertComFilesExt", objXtrmFileParams);
			//파일그룹키와 파일키 정보를 반환정보에 세팅
			for(int j = 0; j < paramSize; j++){
				if(strOriginalFileName.equals(XtrmCmmnUtil.restoreXSSConst(objXtrmParams.getString("fileName", j)))){
					objXtrmReturn.setObject(objXtrmParams.getString("fileId", j), objXtrmFileParams.getDataObjectNode());
					break;
				}
			}
		}
		return objXtrmReturn;
	}
	@Override
	public ApiEnvelope uploadFileExt(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();

		String strFileHandlingType  =  mobjXtrmConfig.getString("WEB_DAEMON_FILE_HANDLING_TYPE", "SELF");
		//file MG를 이용하여 파일 이중화 처리를 위한 리스트
		List<String> uploadList		= new ArrayList<>();

		//업로드 최종 경로
		String strUploadFileInfo	= "";
		String strTempFilePath		= mobjXtrmConfig.getString("FILE_UPLOAD_TEMP_PATH");
		String strRootFilePath		= mobjXtrmConfig.getString("FILE_UPLOAD_ROOT_PATH");

		for(int i=0; i<objXtrmParams.getCount(); i++){
			strUploadFileInfo = objXtrmParams.getString("filePathInfo", i);

			//실제 파일 이동처리
			XtrmNIOFileUtil.moveFile(strTempFilePath + strUploadFileInfo, strRootFilePath + strUploadFileInfo);

			//이동 후 파일 상태 data처리
			objXtrmParams.setString("fileStatus", "O", i);
			objXtrmParams.setString("realPathInfo", strUploadFileInfo, i);
			mobjXtrmDao.update("xs.core.api.ApiMapper", "updateComFilesExt", objXtrmParams.getDataObjectNode(i));

			//file MG를 이용하여 파일 이중화 처리를 위해 리스트 add
			uploadList.add(strRootFilePath + strUploadFileInfo);
		}

		switch(strFileHandlingType){
			case "SELF"			:
				//file upload 완료 됐으므로 SELF 일 경우 이벤트 없음.
				break;
			case "INTERFACE"	:
				// FILE MG로 REST 통신
				xtrmFileMGInterface.syncFile(uploadList, true);
				break;
		}
		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope tempDeleteFileExt(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		int intProcessCount	        = 0;

		//삭제 대상 파일 데이터 조회
		ApiEnvelope objXtrmFileData	= getUploadedFileExtData(objXtrmParams);

		for(int i=0; i<objXtrmFileData.getCount(); i++) {
			//파일EXT 데이터 상태가 임시(T)가 아니면 실제로 삭제하지 않고 삭제대상상태(D)로 업데이트 / 임시(T)이면 실제 삭제
			if(!"T".equals(objXtrmFileData.getDataObjectNode(i).path("fileStatus").asText())) {
				intProcessCount	+= mobjXtrmDao.update("xs.core.api.ApiMapper", "updateComFilesExt", objXtrmParams.getDataObjectNode(i));
			}else {
				//파일EXT 데이터 삭제처리
				intProcessCount	+= mobjXtrmDao.delete("xs.core.api.ApiMapper", "deleteComFilesExt", objXtrmParams.getDataObjectNode(i));
				//실제 파일 삭제처리
				XtrmNIOFileUtil.deleteFile(mobjXtrmConfig.getString("FILE_UPLOAD_ROOT_PATH") + objXtrmFileData.getDataObjectNode(i).path("filePathInfo").asText());
			}
		}
		if(intProcessCount > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope deleteFileExt(ApiEnvelope objXtrmParams) throws Exception {
		//파일, DATA 실제 삭제
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		//fileMG를 이용한 이중화 된 파일 삭제 리스트
		List<String> deleteList	= new ArrayList<>();

		String strFileHandlingType  =  mobjXtrmConfig.getString("WEB_DAEMON_FILE_HANDLING_TYPE", "SELF");
		String filePathInfo         = new String();

		int intProcessCount			= 0;
		for(int i = 0; i < objXtrmParams.getCount(); i++){
			filePathInfo = objXtrmParams.getString("filePathInfo", i);
			//파일 데이터 삭제처리
			intProcessCount		+= mobjXtrmDao.delete("xs.core.api.ApiMapper", "deleteComFilesExt", objXtrmParams.getDataObjectNode(i));
			//실제 파일 삭제처리
			XtrmNIOFileUtil.deleteFile(filePathInfo);

			deleteList.add(filePathInfo);
		}

		switch(strFileHandlingType){
			case "SELF"			:
				//file upload 완료 됐으므로 SELF 일 경우 이벤트 없음.
				break;
			case "INTERFACE"	:
				// FILE MG로 REST 통신
				xtrmFileMGInterface.deleteFile(deleteList);
				break;
		}

		if(intProcessCount > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope updateFileStatusExt(ApiEnvelope objXtrmParams) throws Exception {
		//파일, DATA 실제 삭제
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();

		int intProcessCount	= ApiEnvelopes.delete(mobjXtrmDao, "xs.core.api.ApiMapper", "updateComFilesExt", objXtrmParams);

		if(intProcessCount > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope selectDeptData(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectDeptData", objXtrmParams);
	}

	@Override
	public ApiEnvelope selectUserData(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectUserData", objXtrmParams);
	}

	@Override
	public ApiEnvelope selectCustomerData(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectCustomerData", objXtrmParams);
	}

	@Override
	public ApiEnvelope selectTeamData(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectTeamData", objXtrmParams);
	}

	/**
	 *
	 */
	@Override
	public ApiEnvelope declareRMQ(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception {
		ApiEnvelope objXtrmReturn				= new ApiEnvelope();
//		Channel objRMQChannel				= objRMQComponent.getRmqChannel();
//		if(objRMQChannel != null){
//			String strCompanyCode			= objSession.getAttribute("COMPANY_CODE").toString();
//			String strLocalExtentionNumber	= objXtrmParams.getString("localExtentionNumber");
//
//			String strEncryptKey = new String();
//			for(int i = 0; i < 10; i++){
//				strEncryptKey += strCompanyCode;
//				strEncryptKey += strLocalExtentionNumber;
//			}
//			if(strEncryptKey.length() > 32){strEncryptKey = strEncryptKey.substring(0, 32);}
//			String strRMQProtocol	= mobjXtrmConfig.getString("RMQ_CLIENT_PROTOCOL");
//			String strRMQHost		= mobjXtrmConfig.getString("RMQ_CLIENT_HOST");
//			String strRMQPort		= mobjXtrmConfig.getString("RMQ_CLIENT_PORT");
//			String strRMQUserId		= mobjXtrmConfig.getString("RMQ_CLIENT_USER_NAME");
//			String strRMQPassword	= mobjXtrmConfig.getString("RMQ_CLIENT_PASSWORD");
//			int intRMQTtl			= mobjXtrmConfig.getInt("RMQ_TTL");
//			String strAccessIp		= objSession.getAttribute("ACCESS_IP").toString();
//			String strSessionUserId	= objSession.getAttribute("USER_ID").toString();
//
//			String strURL			= strRMQProtocol + "://" 	+ strRMQHost + ":" + strRMQPort + "/ws";
//			String strRMQRoutingKey	= strCompanyCode + "_"		+ strLocalExtentionNumber;
//			String strRMQueueName	= new String();
//			if("Y".equals(objXtrmParams.getString("observerAt"))){
//				strRMQueueName		= strLocalExtentionNumber + "_" + XtrmCryptoUtil.encryptSHA256(strCompanyCode + strLocalExtentionNumber + strAccessIp, mobjXtrmConfig.getString("CHARACTER_SET")) + "_OBSERVER_" + strSessionUserId;
//			}else{
//				strRMQueueName		= strLocalExtentionNumber + "_" + XtrmCryptoUtil.encryptSHA256(strCompanyCode + strLocalExtentionNumber + strAccessIp, mobjXtrmConfig.getString("CHARACTER_SET"));
//			}
//			HashMap<String, Object> objXArgs = new HashMap<>();
//			objXArgs.put("x-expires", intRMQTtl);
//
//			objXtrmReturn.setResultHeader(false, XtrmEnum.RMQ_DECLARE_QUEUE_SUCCESS.getCodeName(), XtrmEnum.RMQ_DECLARE_QUEUE_SUCCESS.getCode());
//			objXtrmReturn.setString("companyCode"	,strCompanyCode);
//			objXtrmReturn.setString("url"			,XtrmCryptoUtil.encryptAES(strURL			,strEncryptKey));
//			objXtrmReturn.setString("id"			,XtrmCryptoUtil.encryptAES(strRMQUserId		,strEncryptKey));
//			objXtrmReturn.setString("password"		,XtrmCryptoUtil.encryptAES(strRMQPassword	,strEncryptKey));
//			objXtrmReturn.setString("queueName"		,strRMQueueName);
//
//			try{
//				objRMQComponent.declareQueue(objRMQChannel, strRMQueueName, strRMQRoutingKey, false, false, "Y".equals(objXtrmParams.getString("observerAt")), objXArgs);
//			}catch(Exception e){
//				objXtrmReturn.setResultHeader(true, XtrmEnum.RMQ_DECLARE_QUEUE_FAIL.getCodeName(), XtrmEnum.RMQ_DECLARE_QUEUE_FAIL.getCode());
//			}finally{
//				objRMQComponent.closeRmqChannel(objRMQChannel);
//			}
//		}else{
//			objXtrmReturn.setResultHeader(true, XtrmEnum.RMQ_DECLARE_QUEUE_FAIL.getCodeName(), XtrmEnum.RMQ_DECLARE_QUEUE_FAIL.getCode());
//		}

		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope deleteRMQ(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
//		String strQueueName		= objXtrmParams.getString("queueName");
//		objXtrmReturn.setResultHeader(false, XtrmEnum.RMQ_DELETE_QUEUE_SUCCESS.getCodeName(), XtrmEnum.RMQ_DELETE_QUEUE_SUCCESS.getCode());
//		try{
//			objRMQComponent.deleteQueue(strQueueName);
//		}catch(Exception e){
//			objXtrmReturn.setResultHeader(true, XtrmEnum.RMQ_DELETE_QUEUE_FAIL.getCodeName(), XtrmEnum.RMQ_DELETE_QUEUE_FAIL.getCode());
//		}
		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope offerDataRMQ(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn				= new ApiEnvelope();
//		ApiEnvelope objXtrmSendParams			= new ApiEnvelope();
//		String strSendLocalExtentionNumber	= objXtrmParams.getString("sendLocalExtentionNumber");
//		String strMessageType				= objXtrmParams.getString("sendType");
//		objXtrmSendParams.setDataJsonArray(objXtrmParams.getDataJsonArray());
//		objXtrmReturn.setResultHeader(false, XtrmEnum.RMQ_SEND_MESSAGE_SUCCESS.getCodeName(), XtrmEnum.RMQ_SEND_MESSAGE_SUCCESS.getCode());
//		try {
//			if(strMessageType.indexOf("MESSENGER") >= 0){
//				objRMQComponent.sendData(mobjXtrmConfig.getString("COMPANY_CODE") + "_" + strSendLocalExtentionNumber, objXtrmSendParams);
//			}else{
//				objRMQComponent.sendData(mobjXtrmConfig.getString("COMPANY_CODE") + "_" + strSendLocalExtentionNumber + "_APP_PARAM", objXtrmSendParams);
//			}
//		}catch(Exception e){
//			objXtrmReturn.setResultHeader(true, XtrmEnum.RMQ_SEND_MESSAGE_FAIL.getCodeName(), XtrmEnum.RMQ_SEND_MESSAGE_FAIL.getCode());
//		}
		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope readClobFile(ApiEnvelope objXtrmParams) throws Exception{
		String CLOB_FILE_ROOT_PATH	= mobjXtrmConfig.getString("CLOB_FILE_ROOT_PATH");
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		String strFileKey			= objXtrmParams.getString("fileKey"			,0, "");
		String strFileFullPath		= objXtrmParams.getString("fileFullPath"	,0, "");
		String strFileContents		= new String();
		boolean blnEncptAt			= objXtrmParams.getBoolean("encptAt"		,0, true);
		String strFileHandlingType  =  mobjXtrmConfig.getString("WEB_DAEMON_FILE_HANDLING_TYPE");

		if("".equals(strFileKey) && "".equals(strFileFullPath)){
			objXtrmReturn.setResultHeader(true, XtrmEnum.NONE_EXIST_FILE.getCodeName());
		}else{
			//objXtrmParams.setString("companyCode"	,mobjXtrmConfig.getString("COMPANY_CODE"));
			objXtrmParams.setString("filePathInfo"	,strFileFullPath);
			objXtrmReturn			= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectClobFileData", objXtrmParams);
			if(objXtrmReturn.getCount() == 1){
				strFileFullPath			= objXtrmReturn.getString("filePathInfo");
				byte[] objFileByteArray = null;

				switch(strFileHandlingType){
					case "SELF"			:
						objFileByteArray = XtrmNIOFileUtil.readFile(CLOB_FILE_ROOT_PATH + "/" + strFileFullPath);
						break;
					case "INTERFACE"	:
						// FILE MG로 REST 통신
						List<String> readFiles								= new ArrayList<>();
						readFiles.add(CLOB_FILE_ROOT_PATH + "/" + strFileFullPath);
						ApiEnvelope objXtrmMgReturn		= xtrmFileMGInterface.readFile(readFiles);

						JsonNode result = objXtrmMgReturn.getDataObjectNode().path("result");
						if (result.isArray()) {
							for (JsonNode filedata : result) {
								objFileByteArray = filedata.path("data").asText().getBytes();
							}
						}
						break;
				}

				if(objFileByteArray != null) {
					strFileKey			= objXtrmReturn.getString("fileKey", 0, "");
					if(!"".equals(strFileKey)){
						objXtrmParams.setString("fileKey", strFileKey);
						ApiEnvelopes.update(mobjXtrmDao, "xs.core.api.ApiMapper", "updateReadingCountClobFiles", objXtrmParams);
					}
					strFileContents		= new String(objFileByteArray, mobjXtrmConfig.getString("CHARACTER_SET"));
				}else{
					strFileContents		= objXtrmReturn.getString("sttSpeciality", 0, "");
				}
				if(!"".equals(strFileContents)){
					if(blnEncptAt){
						strFileContents = XtrmCryptoUtil.decryptAES(strFileContents.replaceAll(" ", "+"));
					}
					objXtrmReturn.setString("fileContents", strFileContents);
					objXtrmReturn.removeKey("sttSpeciality");
				}else{
					objXtrmReturn.setResultHeader(true, XtrmEnum.NONE_EXIST_FILE.getCodeName());
				}
			}else{
				objXtrmReturn.setResultHeader(true, XtrmEnum.NONE_EXIST_FILE.getCodeName());
			}
		}
		return objXtrmReturn;
	}

	//녹취파일 데이터 읽기
	@Override
	public ModelAndView readRecordFile(ApiEnvelope objXtrmParams) throws Exception {
		ModelAndView objMav = new ModelAndView("xtrmReadRecordView");
		objMav.addObject("objXtrmDao"		,mobjXtrmDao);
		objMav.addObject("objXtrmConfig"	,mobjXtrmConfig);
		objMav.addObject("objXtrmParams"	,objXtrmParams);
		return objMav;
	}
	//기 존재 세션 정보 반환
	@Override
	public ApiEnvelope getAlreadySessionData(HttpSession session, ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn							= new ApiEnvelope();
		boolean alreadyExist                            = false;
		if(XtrmHttpSessionListener.isAlreadyLogedIn(session)) {
			alreadyExist = true;
			session = XtrmHttpSessionListener.getSession(session);
		}
		log.info("반환된 세션 정보");
		log.info("기 존재 여부 : " + alreadyExist);
		log.info(session.getAttribute("USER_ID") + ": " + session.getId());

		objXtrmReturn.setBoolean("alreadyExist", alreadyExist);
		objXtrmReturn.setString("mainMenuKey", (String)session.getAttribute("MAIN_MENU_KEY"));

		return objXtrmReturn;
	}

	// Pu Info 조회
	// 20241223 JJH PG 조회 제거
	// 사용자의 보유한 데이터 권한에 따른 PuCode 목록 반환
	@Override
	public ApiEnvelope selectPuPgInfo(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn							= new ApiEnvelope();
		ApiEnvelope puList     = null;
		puList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectPuCode", objXtrmParams);
		objXtrmReturn.setDataArrayNode(puList.getDataArrayNode(),"puList");

		return objXtrmReturn;
	}

	// (2025.12) 데이터권한과 무관하게 마케팅 임직원(VOB049)이 작성한 PU를 기준으로 콤보박스 생성
	@Override
	public ApiEnvelope selectPuPgMarketingInfo(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		ApiEnvelope puList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectPuCodeMarketing", objXtrmParams);
		objXtrmReturn.setDataArrayNode(puList.getDataArrayNode(),"puList");
		return objXtrmReturn;
	}

	// Pu Code에 해당하는 Combo List 조회
	// Category, CorpCode List
	@Override
	public ApiEnvelope selectSearchCombo(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		String puCode          = objXtrmParams.getString("puCode");
		if( ! "".equals(puCode) ){
			String formList    = objXtrmParams.getString("formList");
			ApiEnvelope comboList = null;
			if( formList.indexOf("corpCode")>-1 ){
				comboList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectCorpCode", objXtrmParams);
				objXtrmReturn.setDataArrayNode(comboList.getDataArrayNode(),"corpCode");
				comboList = null;
			}

			if( formList.indexOf("categoryCode")>-1 ){
				comboList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectCategoryCode", objXtrmParams);
				objXtrmReturn.setDataArrayNode(comboList.getDataArrayNode(),"categoryCode");
				comboList = null;
			}
		}
		return objXtrmReturn;
	}

	//(2025.12) 데이터권한과 무관하게 마케팅 임직원(VOB049)이 작성한 PU를 기준으로 Category, CorpCode List 콤보박스 생성
	@Override
	public ApiEnvelope selectSearchComboMarketing(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		String puCode          = objXtrmParams.getString("puCode");
		if( ! "".equals(puCode) ){
			String formList    = objXtrmParams.getString("formList");
			ApiEnvelope comboList = null;
			if( formList.indexOf("corpCode")>-1 ){
				comboList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectCorpCodeMarketing", objXtrmParams);
				objXtrmReturn.setDataArrayNode(comboList.getDataArrayNode(),"corpCode");
				comboList = null;
			}

			if( formList.indexOf("categoryCode")>-1 ){
				comboList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectCategoryCode", objXtrmParams);
				objXtrmReturn.setDataArrayNode(comboList.getDataArrayNode(),"categoryCode");
				comboList = null;
			}
		}
		return objXtrmReturn;
	}

	// Pu Code에 해당하는 Combo List 조회
	public ApiEnvelope selectManagementCombo(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn							= new ApiEnvelope();

		String formList    = objXtrmParams.getString("formList");
		ApiEnvelope comboList = null;
		if( formList.indexOf("puCode")>-1 ){
			comboList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectPuCode", objXtrmParams);
			objXtrmReturn.setDataArrayNode(comboList.getDataArrayNode(),"puList");
			comboList = null;
		}
		if( formList.indexOf("corpCode")>-1 ){
			comboList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectCorpCode", objXtrmParams);
			objXtrmReturn.setDataArrayNode(comboList.getDataArrayNode(),"corpCode");
			comboList = null;
		}

		return objXtrmReturn;
	}

	@Override
	public ApiEnvelope getMessageData(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.core.api.ApiMapper", "selectMessageData", objXtrmParams);
	}

	@Override
	public String getCompanyCodeByDomain(ApiEnvelope objXtrmParam) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.cmmn.CmmnMapper", "selectCompanyCodeByDomain", objXtrmParam);
		return Optional.ofNullable(objXtrmReturn)
				.map(it -> it.getString("companyCode"))
				.orElse(mobjXtrmConfig.getString("COMPANY_CODE"));
	}


	//****** API 관리  ************************************************************************//
}