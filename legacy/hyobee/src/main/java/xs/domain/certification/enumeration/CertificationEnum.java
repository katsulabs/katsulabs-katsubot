package xs.domain.certification.enumeration;


import xs.core.module.XtrmMessageComponent;

public enum CertificationEnum {
	CERTIFICATION_TYPE_NO				("TYPE_NO"												,"CertEnum.TYPE_NO"                             ,""),
	CERTIFICATION_URL_NO				("URL_NO"												,"CertEnum.URL_NO"                              ,""),
	CERTIFICATION_TYPE_EMAIL			("EMAIL"													,"CertEnum.EMAIL"                               ,""),
	CERTIFICATION_TYPE_SMS				("SMS"													,"CertEnum.SMS"                               	,""),
	CERTIFICATION_SEND_OK				("SEND_OK"												,"CertEnum.SEND_OK"                             ,""),
	CERTIFICATION_SEND_FAIL				("SEND_FAIL"												,"CertEnum.SEND_FAIL"                           ,""),
	CERTIFICATION_CONFIRM_OK			("CONFIRM_OK"											,"CertEnum.CONFIRM_OK"                          ,""),
	CERTIFICATION_CONFIRM_FAIL			("CONFIRM_FAIL"											,"CertEnum.CONFIRM_FAIL"                        ,""),

	CERTIFICATION_EMPTY					("EMPTY"													,"CertEnum.EMPTY"                               ,""),
	CERTIFICATION_NONE_EXIST_EMAIL		("NEE"													,"CertEnum.NEE"                               	,""),
	CERTIFICATION_NONE_EXIST_MOBILE		("NES"													,"CertEnum.NES"                                 ,""),
	CERTIFICATION_EXPIRE_TIME			("ET"													,"CertEnum.ET"                               	,""),
	CERTIFICATION_CONFIRM_FAIL_COUNT	("FCT"													,"CertEnum.FCT"                               	,""),
	CERTIFICATION_INFO_EMPTY			("EMPINFO"												,"CertEnum.EMPINFO"                             ,""),

	CERTIFICATION_NOT_MATCH_CODE		("OTP_ERR_01"											,"CertEnum.OTP_ERR_01"                          ,""),
	CERTIFICATION_EXIST_OTP				("OTP_ERR_02"											,"CertEnum.OTP_ERR_02"                          ,""),
	CERTIFICATION_NO_EXIST_OTP			("OTP_ERR_03"											,"CertEnum.OTP_ERR_03"                          ,""),
	CERTIFICATION_FAIL_MAX_COUNT  		("OTP_ERR_05"											,"CertEnum.OTP_ERR_05"                          ,""),

	CERTIFICATION_OTP_KEY_INIT 			("OTP_MSG_01"											,"CertEnum.OTP_MSG_01"                          ,""),

	CERTIFICATION_INFO_001 				("CERTIFICATION_INFO_001"								,"CertEnum.CERTIFICATION_INFO_001"              ,""),
	CERTIFICATION_INFO_002 				("CERTIFICATION_INFO_002"								,"CertEnum.CERTIFICATION_INFO_002"              ,""),
	CERTIFICATION_INFO_003 				("CERTIFICATION_INFO_003"								,"CertEnum.CERTIFICATION_INFO_003"              ,""),

	SAMPLE								(""																,""																							,""		)
	;

	private String code;
	private String codeName;
	private String parentCode;

	private CertificationEnum(String code, String codeName, String parentCode){
		this.code		= code;
		this.codeName	= codeName;
		this.parentCode = parentCode;
	}
	public String getCode() {
		String messageLabel = XtrmMessageComponent.getMessage(code);
		if(!messageLabel.equals("")){
			return messageLabel;
		}
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getCodeName() {
		String messageLabel = XtrmMessageComponent.getMessage(codeName);
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
