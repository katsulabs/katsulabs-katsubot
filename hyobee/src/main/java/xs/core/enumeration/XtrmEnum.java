package xs.core.enumeration;

import xs.core.module.XtrmMessageComponent;
import xs.vob.cmmn.service.CmmnServiceImpl;

public enum XtrmEnum {
	CONSOL_LOG_EXCLUDE_LIST				("/xs/core/api/getSessionInfo.json"								,""												,""		),
	REQUEST_OK							("200"															,"XtrmEnum.REQUEST_OK"							,""		),
	ERROR_MESSAGE						(""																,"XtrmEnum.ERROR_MESSAGE"						,""		),	//운영서버 에러메시지
	ERROR_EXPIRED_SESSION				("610"															,"XtrmEnum.ERROR_EXPIRED_SESSION"				,""		),
	ERROR_FORGERY_PARAMETER				("640"															,"XtrmEnum.ERROR_FORGERY_PARAMETER"				,""		),
	ERROR_NONE_FUNCAUTH					("650"															,"XtrmEnum.ERROR_NONE_FUNCAUTH"					,""		),
	ERROR_UNDEFINED_USER				("660"															,"XtrmEnum.ERROR_UNDEFINED_USER"				,""		),
	ERROR_TOKEN							("670"															,"XtrmEnum.ERROR_TOKEN"							,""		),
	AUTH_TYPE_SELECT					("R"															,"XtrmEnum.AUTH_TYPE_SELECT"					,""		),	//기능권한유형
	AUTH_TYPE_SAVE						("S"															,"XtrmEnum.AUTH_TYPE_SAVE"						,""		),
	AUTH_TYPE_CREATE					("C"															,"XtrmEnum.AUTH_TYPE_CREATE"					,""		),
	AUTH_TYPE_UPDATE					("U"															,"XtrmEnum.AUTH_TYPE_UPDATE"					,""		),
	AUTH_TYPE_DELETE					("D"															,"XtrmEnum.AUTH_TYPE_DELETE"					,""		),
	AUTH_TYPE_OUTPUT					("O"															,"XtrmEnum.AUTH_TYPE_OUTPUT"					,""		),
	AUTH_TYPE_ETC						("E"															,"XtrmEnum.AUTH_TYPE_ETC"						,""		),
	AUTH_TYPE_ADMIN						("A"															,"XtrmEnum.AUTH_TYPE_ADMIN"						,""		),
	AUTH_TYPE_NONE						("N"															,"XtrmEnum.AUTH_TYPE_NONE"						,""		),
	SELECT_SUCCESS						(""																,"XtrmEnum.SELECT_SUCCESS"						,""		),	//정상처리결과메시지
	SAVE_SUCCESS						(""																,"XtrmEnum.SAVE_SUCCESS"						,""		),
	INSERT_SUCCESS						(""																,"XtrmEnum.INSERT_SUCCESS"						,""		),
	UPDATE_SUCCESS						(""																,"XtrmEnum.UPDATE_SUCCESS"						,""		),
	DELETE_SUCCESS						(""																,"XtrmEnum.DELETE_SUCCESS"						,""		),
	PROCESS_SUCCESS						(""																,"XtrmEnum.PROCESS_SUCCESS"						,""		),
	PROCESS_EMPTY						(""																,"XtrmEnum.PROCESS_EMPTY"						,""		),
	FAIL_CONNECT						(""																,"XtrmEnum.FAIL_CONNECT"						,""		),
	MENU_LIST_NONE						(""																,"XtrmEnum.MENU_LIST_NONE"						,""		),
	NONE_EXIST_FILE						("EXIST_FILE"													,"XtrmEnum.NONE_EXIST_FILE"						,""		),
	TRANSACTION_INSERT					("I"															,"XtrmEnum.TRANSACTION_INSERT"					,""		),
	TRANSACTION_UPDATE					("U"															,"XtrmEnum.TRANSACTION_UPDATE"					,""		),
	TRANSACTION_DELETE					("D"															,"XtrmEnum.TRANSACTION_DELETE"					,""		),
	TRANSACTION_NONE					("N"															,"XtrmEnum.TRANSACTION_NONE"					,""		),
	TRANSACTION_DIVISION_OMISSION		(""																,"XtrmEnum.TRANSACTION_DIVISION_OMISSION"		,""		),
	VALIDATED_AUTHENTICATION			(""																,"XtrmEnum.VALIDATED_AUTHENTICATION"			,""		),
	UNVALIDATED_AUTHENTICATION			(""																,"XtrmEnum.UNVALIDATED_AUTHENTICATION"			,""		),
	EMPTY_DATA							(""																,"XtrmEnum.EMPTY_DATA"							,""		),
	DUPLE_KEY_DATA						(""																,"XtrmEnum.DUPLE_KEY_DATA"						,""		),
	SEND_SUCCESS						(""																,"xui.SEND_SUCCESS"						,""		),

	RMQ_DECLARE_QUEUE_SUCCESS			("200"															,"XtrmEnum.RMQ_DECLARE_QUEUE_SUCCESS"			,""		),
	RMQ_DECLARE_QUEUE_FAIL				("-101"															,"XtrmEnum.RMQ_DECLARE_QUEUE_FAIL"				,""		),
	RMQ_CONNECT_SUCCESS					("202"															,"XtrmEnum.RMQ_CONNECT_SUCCESS"					,""		),
	RMQ_CONNECT_FAIL					("-101"															,"XtrmEnum.RMQ_CONNECT_FAIL"					,""		),
	RMQ_CONNECTION_FACTORY_NOT_EXIST	("-102"															,"XtrmEnum.RMQ_CONNECTION_FACTORY_NOT_EXIST"	,""		),
	RMQ_DISCONNECT_SUCCESS				("200"															,"XtrmEnum.RMQ_DISCONNECT_SUCCESS"				,""		),
	RMQ_DISCONNECT_FAIL					("-300"															,"XtrmEnum.RMQ_DISCONNECT_FAIL"					,""		),
	RMQ_CHANNEL_OPEN_SUCCESS			("200"															,"XtrmEnum.RMQ_CHANNEL_OPEN_SUCCESS"			,""		),
	RMQ_CHANNEL_OPEN_FAIL				("-102"															,"XtrmEnum.RMQ_CHANNEL_OPEN_FAIL"				,""		),
	RMQ_CHANNEL_CLOSE_SUCCESS			("200"															,"XtrmEnum.RMQ_CHANNEL_CLOSE_SUCCESS"			,""		),
	RMQ_CHANNEL_CLOSE_FAIL				("-300"															,"XtrmEnum.RMQ_CHANNEL_CLOSE_FAIL"				,""		),
	RMQ_DELETE_QUEUE_SUCCESS			("200"															,"XtrmEnum.RMQ_DELETE_QUEUE_SUCCESS"			,""		),
	RMQ_DELETE_QUEUE_FAIL				("-600"															,"XtrmEnum.RMQ_DELETE_QUEUE_FAIL"				,""		),
	RMQ_QUEUE_ACCESS_SUCCESS			("200"															,"XtrmEnum.RMQ_QUEUE_ACCESS_SUCCESS"			,""		),
	RMQ_QUEUE_ACCESS_FAIL				("-200"															,"XtrmEnum.RMQ_QUEUE_ACCESS_FAIL"				,""		),
	RMQ_SEND_MESSAGE_SUCCESS			("200"															,"XtrmEnum.RMQ_SEND_MESSAGE_SUCCESS"			,""		),
	RMQ_SEND_MESSAGE_FAIL				("200"															,"XtrmEnum.RMQ_SEND_MESSAGE_FAIL"				,""		),

	//배치 처리오류 메시지
	BATCH_ESSEINTIAL_PARAM_INVALID		(""																,"XtrmEnum.BATCH_ESSEINTIAL_PARAM_INVALID"		,""		),
	BATCH_ALREADY_RUNNING				(""																,"XtrmEnum.BATCH_ALREADY_RUNNING"				,""		),
	BATCH_EXECUTION_SUCCESS				(""																,"XtrmEnum.BATCH_EXECUTION_SUCCESS"				,""		),
	BATCH_EXECUTION_FAILED				(""																,"XtrmEnum.BATCH_EXECUTION_FAILED"				,""		),

	FILE_READ_ERROR_001					(""																,"XtrmEnum.FILE_READ_ERROR_001"					,""		),
	FILE_READ_ERROR_002					(""																,"XtrmEnum.FILE_READ_ERROR_002"					,""		),
	FILE_READ_ERROR_003					(""																,"XtrmEnum.FILE_READ_ERROR_003"					,""		),

	RESIDENT_REGISTRATION_PATTERN		("RR"															,"XtrmEnum.RESIDENT_REGISTRATION_PATTERN"		,""		),
	PASSPORT_PATTERN					("PP"															,"XtrmEnum.PASSPORT_PATTERN"					,""		),
	DRIVER_LICENSE_PATTERN				("DL"															,"XtrmEnum.DRIVER_LICENSE_PATTERN"				,""		),
	PHONE_PATTERN						("PH"															,"XtrmEnum.PHONE_PATTERN"						,""		),
	CARD_PATTERN						("CR"															,"XtrmEnum.CARD_PATTERN"						,""		),
	ACCOUNT_PATTERN						("AC"															,"XtrmEnum.ACCOUNT_PATTERN"						,""		),
	EMAIL_PATTERN						("EM"															,"XtrmEnum.EMAIL_PATTERN"						,""		),
	NAME_PATTERN						("NM"															,"XtrmEnum.NAME_PATTERN"						,""		),
	ADDRESS_PATTERN						("AD"															,"XtrmEnum.ADDRESS_PATTERN"						,""		),

	SAMPLE								(""																,""												,""		),
	CUSTOM_CODE						(""																,""												,""		),

	;

	private String code;
	private String codeName;
	private String parentCode;

	private XtrmEnum(String code, String codeName, String parentCode) {
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
	public String getCodeName(String code) {
		String messageLabel = CmmnServiceImpl.getMessage(code);
		if(!messageLabel.equals("")){
			return messageLabel;
		}
		return code;
	}
	public String getCodeName(String code, String locale) {
		String messageLabel = CmmnServiceImpl.getMessage(code, locale);
		if(!messageLabel.equals("")){
			return messageLabel;
		}
		return code;
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
