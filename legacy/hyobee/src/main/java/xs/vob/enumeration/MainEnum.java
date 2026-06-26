package xs.vob.enumeration;

import xs.vob.cmmn.service.CmmnServiceImpl;

public enum MainEnum {
	/* MAIN  */
//	LOGIN_SERVLET_MAPPING				("loginFromMain.json"											,""																										,""		),
	LOGIN_SERVLET_MAPPING				("loginBase.json"											,""																										,""		),
	LOGOUT_SERVLET_MAPPING				("logout.json"													,""																										,""		),
	INTERFACE_SERVLET_MAPPING			("/xs/interface"												,""																										,""		),
	VALID_CHECK_EXCLUDE_SERVLET_MAPPING	("/xs/core/api/getCompanyCodeData.json,/webapi,/editor","MainEnum.VALID_CHECK_EXCLUDE_SERVLET_MAPPING"															,""		),
	// 20250114 JJH 취약점 점검에서 getSessionInfo.json 호출시 취약에 대한 부분이 존재하여 우선 주석 처리
	//VALID_CHECK_EXCLUDE_SESSION_MAPPING	("/xs/webbase/login/,/xs/domain/certification,getSessionInfo.json,redirectErrorPage.json,getCompanyCodeData.json,initClientPageLoad.json,initLoginPageLoad.json"		,"MainEnum.VALID_CHECK_EXCLUDE_SESSION_MAPPING"		,""		),
	//VALID_CHECK_EXCLUDE_SESSION_MAPPING	("/xs/system/interfaces,/editor,..."		,"MainEnum.VALID_CHECK_EXCLUDE_SESSION_MAPPING"		,""		),
	VALID_CHECK_EXCLUDE_SESSION_MAPPING	("/xs/system/interfaces,/editor,/webapps/xs/webbase/pop/,/xs/core/api/getUploadedFileExtData.json,/xs/core/api/downloadFile.json" +
			",/xs/webbase/login/,/xs/domain/certification,redirectErrorPage.json,getCompanyCodeData.json,initClientPageLoad.json,initLoginPageLoad.json,/xs/aichat/,retrievetMailSandList.json"		,"MainEnum.VALID_CHECK_EXCLUDE_SESSION_MAPPING"		,""		),

	ACCESS_LOG_EXCLUDE_SERVLET_MAPPING	("/xs/core/api/,/editor,/xs/aichat/,/hsgc-demo/" +
											",/xs/webbase/login/selectDataCompanyInfo.json,/xs/webbase/login/createOTPEncryptKey.json"						,"MainEnum.ACCESS_LOG_EXCLUDE_SERVLET_MAPPING"		,""		),
	FILE_UPLOAD_SERVLET_MAPPING			("/xs/core/api/uploadFile.json"									,""																										,""		),
	FILE_DOWNLOAD_SERVLET_MAPPING		("/xs/core/api/downloadFile.json"								,""																										,""		),

	IMAGE_FILE_VIEW_SERVLET_MAPPING		("/xs/core/api/getImageFile.json"								,""																										,""		),
	EXPORT_EXCEL_SERVLET_MAPPING		("/xs/core/api/exportExcelGridData.json"						,""																										,""		),

	CERTIFATION_CODE_SERVLET_MAPPING	("/xs/webbase/certifation/getCertificationCode.json"			,""																										,""		),
	CERTIFATION_CONFIRM_SERVLET_MAPPING	("/xs/webbase/certification/confirmCertification.json"			,""																										,""		),

	EXCLUDE_PAGELOAD_SERVLET_MAPPING	("/xs/core/api/initClientPageLoad.json"							,""																										,""		),
	EXCLUDE_SESSION_SERVLET_MAPPING		("/xs/core/api/getSessionInfo.json"								,""																										,""		),
	EXCLUDE_PATTERN_SERVLET_MAPPING		("/xs/core/api/getPatternDateData.json"							,""																										,""		),

	SECTION_LOGIN						("LOGIN"														,""																										,""		),
	SECTION_LOGOUT						("LOGOUT"														,""																										,""		),
	SECTION_INTERFACE					("INTERFACE"													,""																										,""		),
	SECTION_UPLOAD						("UPLOAD"														,""																										,""		),
	SECTION_DOWNLOAD					("DOWNLOAD"														,""																										,""		),
	SECTION_AUTHORIZE					("AUTHORIZE"													,""																										,""		),

	LOGIN_EMPTY							("EMPTY"														,"MainEnum.LOGIN_OK"	                                                                                ,""		),
	LOGIN_ENF							("ENF"															,"MainEnum.LOGIN_ENF"	                                                                                ,""		),
	LOGIN_OK							("OK"															,"MainEnum.LOGIN_EMPTY"	                                                                                ,""		),
	LOGIN_NUI							("NUI"															,"MainEnum.NUI"	                                                                                        ,""		),
	LOGIN_NMP							("NMP"															,"MainEnum.LOGIN_NMP"	                                                                                ,""		),
	LOGIN_EUP							("EUP"															,"MainEnum.LOGIN_EUP"	                                                                                ,""		),
	LOGIN_PFO							("PFO"															,"MainEnum.LOGIN_PFO"	                                                                                ,""		),
	LOGIN_UTL							("UTL"															,"MainEnum.LOGIN_UTL"	                                                                                ,""		),
	LOGIN_EPW							("EPW"															,"MainEnum.LOGIN_EPW"	                                                                                ,""		),
	LOGIN_IDA_AVAIL						("IDAA"															,"MainEnum.LOGIN_IDA_AVAIL"	                                                                            ,""		),
	LOGIN_IDA_AVAIL2					("IDAA2"														,"MainEnum.LOGIN_IDA_AVAIL2"	                                                                        ,""		),
	LOGIN_NGR							("NGR"															,"MainEnum.LOGIN_NGR"	                                                                                ,""		),
	LOGIN_LNL							("LNL"															,"MainEnum.LOGIN_LNL"	                                                                                ,""		),
	LOGIN_VOC_AUTH						("VOC_AUTH"														,"MainEnum.LOGIN_VOC_AUTH"	                                                                            ,""		),
	LOGOUT_OK							("OUT"															,"MainEnum.LOGOUT_OK"	                                                                                ,""		),
	LOGIN_SSO_AUTH						("SSO_AUTH"														,"MainEnum.LOGIN_SSO_AUTH"	                                                                                ,""		),

	ALREADY_LOGOUT_STATUS				(""																,"MainEnum.ALREADY_LOGOUT_STATUS"                                                                       ,""		),

	PASSWORD_CHANGE_ERROR01				(""																,"MainEnum.PASSWORD_CHANGE_ERROR01"                                                                     ,""		),
	PASSWORD_CHANGE_ERROR02				(""																,"MainEnum.PASSWORD_CHANGE_ERROR02"                                                                     ,""		),
	PASSWORD_CHANGE_ERROR03				(""																,"MainEnum.PASSWORD_CHANGE_ERROR03"                                                                     ,""		),
	PASSWORD_CHANGE_ERROR04				(""																,"MainEnum.PASSWORD_CHANGE_ERROR04"                                                                     ,""		),
	PASSWORD_CHANGE_ERROR05				(""																,"MainEnum.PASSWORD_CHANGE_ERROR05"                                                                     ,""		),
	PASSWORD_CHANGE_ERROR06				(""																,"MainEnum.PASSWORD_CHANGE_ERROR06"                                                                     ,""		),
	PASSWORD_CHANGE_ERROR07				(""																,"MainEnum.PASSWORD_CHANGE_ERROR07"                                                                     ,""		),
	PASSWORD_CHANGE_ERROR08				(""																,"MainEnum.PASSWORD_CHANGE_ERROR08"                                                                     ,""		),
	PASSWORD_CHANGE_ERROR09				(""																,"MainEnum.PASSWORD_CHANGE_ERROR09"                                                                     ,""		),
	PASSWORD_CHANGE_ERROR10				(""																,"MainEnum.PASSWORD_CHANGE_ERROR10"                                                                     ,""		),
	IP_NUMBER_CHECK_001 				(""												    			,"MainEnum.IP_NUMBER_CHECK_001"                                                                         ,""		),
	// 접속구분 코드
	ACCESS_TYPE_LOG						("010"															,"MainEnum.ACCESS_TYPE_LOG"																				,""		),
	ACCESS_TYPE_MENU					("020"															,"MainEnum.ACCESS_TYPE_MENU"																			,""		),
	/* MAIN  */

	/* AUTH  */
	/* AUTH  */
	/* CALENDAR  */
	/* CALENDAR  */
	/* CODE  */
	GROUP_CODE_ALREADY_EXIST			(""																,"MainEnum.GROUP_CODE_ALREADY_EXIST"																	,""		),
	/* CODE  */
	/* COMPANY  */
	UPLOAD_PHOTE_ONLY_ONE				(""																,"MainEnum.UPLOAD_PHOTE_ONLY_ONE"																		,""		),
	/* COMPANY  */
	/* DEPT  */
	/* DEPT  */
	/* LOG  */
	OTHERS								(""																,"XtrmEnum.OTHERS"																						,""		),
	/* LOG  */
	/* LOGIN  */
	LIMIT_COUNT							(""																,"XtrmEnum.LIMIT_COUNT"																					,""		),
	/* LOGIN  */
	/* MENU */
	/* MENU */
	/* POPUP */
	/* POPUP */
	/* USER */
	PASSWORD_SET_USERID_PLEASE_CHANGE	(""																,"XtrmEnum.PASSWORD_SET_USERID_PLEASE_CHANGE"															,""		),

	EMPTY_DATA_EMPLOYMENT_DATE			(""																,"XtrmEnum.EMPTY_DATA_EMPLOYMENT_DATE"																	,""		),
	NOT_VALID_EMPLOYMENT_DATE			(""																,"XtrmEnum.NOT_VALID_EMPLOYMENT_DATE"																	,""		),
	NOT_VALID_EMPLOYMENT_DATE1			(""																,"XtrmEnum.NOT_VALID_EMPLOYMENT_DATE1"																	,""		),
	/* USER */

	/* 용어사전 */
	CONTENTS_STATUS_END					("030"															,"저장"																									,""		),
	CONTENTS_STATUS_DELETE				("090"															,"삭제"																									,""		),
	/* 용어사전 */

	/* 설문 관리 */
	EXISTS_ALREADY_USER				(""																	,"MainEnum.EXISTS_ALREADY_USER"																			,""		),

	// Report
	REPORT_SUMMARY_CODE					("010"															,"Report Summary Code"																					,""		),
	REPORT_DETAIL_CODE					("020"															,"Report Detail Code"																					,""		),
	// AI Search,
	NO_ANSWER							(""																,"aisearch010.NO_ANSWER"																				,""		),
	NO_ANSWER_AUTH						(""																,"aisearch010.NO_ANSWER_AUTH"																			,""		),
	NO_ANSWER_SEARCH					(""																,"aisearch010.NO_ANSWER_SEARCH"																			,""		),
	NO_KEYWORD							(""																,"aisearch010.NO_KEYWORD"																				,""		),
	NO_COMPLETE_CHAR					(""																,"aisearch010.NO_COMPLETE_CHAR"																			,""		),
	NO_PARENTHESES_CLOSED				(""																,"aisearch010.NO_PARENTHESES_CLOSED"																	,""		),
	CHAT_ERROR							(""																,"aisearch010.CHAT_ERROR"																				,""		),
	NO_SENTENCE							(""																,"aisearch020.NO_SENTENCE"																				,""		),
	NO_CONTENTS							(""																,"aisearch020.NO_CONTENTS"																				,""		),

	// AI검색 메시지,
	SEARCH_VALID_001					(""																,"SEARCH_VALID_001"																						,""		),
	SEARCH_VALID_002					(""																,"SEARCH_VALID_002"																						,""		),
	SEARCH_VALID_003					(""																,"SEARCH_VALID_003"																						,""		),

	//리포트 목차 관리,
	DELETE_VALID						(""																,"하위에 데이터가 있는 항목은 삭제할 수 없습니다."																						,""		),

	//시스템프롬프트,
	DUP_SAVE_SUCCESS					(""																,"중복된 프롬프트KEY를 제외하고 복사되었습니다."																						,""		),


	SAMPLE								(""																,""																								        ,""		)

			;

	private String code;
	private String codeName;
	private String parentCode;

	private MainEnum(String code, String codeName, String parentCode) {
		this.code = code;
		this.codeName = codeName;
		this.parentCode = parentCode;
	}
	public String getCode() {
		String messageLabel = CmmnServiceImpl.getMessage(code);
		if(!messageLabel.equals("")){
			return messageLabel;
		}
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getCodeName() {
		String messageLabel = CmmnServiceImpl.getMessage(codeName);
		if(!messageLabel.equals("")){
			return messageLabel;
		}
		return codeName;
	}
	public void setCodeName(String codeName) {
		this.codeName = codeName;
	}
	public String getParentCode() {
		return parentCode;
	}
	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}
}


