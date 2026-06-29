/***************************************************************************************************************************************************************
* @classDescription 로그인
* @author HyosungITX Corp.
* @version 1.0
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Modification Information
* Date              Developer           Content
* ----------        -------------       -------------------------
* 2024/07/24        AICC R&D팀          신규생성
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Copyright (C) 2018 by HyosungITX Corp. All rights reserved.
****************************************************************************************************************************************************************/
"use strict";
/*******************************************************************************
 * Global Variable : 스크립트 영역에서 모두 접근할 수 있는 전역변수를 해당 영역에 모두 정의한다.
 ******************************************************************************/
let IMPORT						= "";
let mobjTooltip					= null;
let mcertificationCase			= "NONE";
let mcertificationEndDtTimer	= null;
let mcertificationRequest		= "";		//LOGIN,CHANGE_PWD
let mexpireTimeSec				= 180;

/*******************************************************************************
 * Document Ready : jquery에서 제공하는 함수를 이용하여 화면이 로드될 때 처리할 함수를 정의한다.
 ******************************************************************************/
function PageReady(){
	login010.completePageRender();
}
function PageUnload(){
	//@ TODO 필요시 페이지 종료전 로직 추가
}

/**
 * 클래스 구조의 스크립트 구조체 오브젝트 명을 정의한다.
 * 스크립트를 클래스 기반의 구조체로 정의하기 위해 해당 JavaScript의 클래스명은 파일명으로 정의한다.
 * @classDescription :
 */
let login010={
/*******************************************************************************
 * completePageRender Function : 화면이 초기 로드 시점에 처리할 사항을 정의한다.
 ******************************************************************************/
	completePageRender : function(){
		//페이지 상수 정의
		login010.setPageEnum();
		//탭 화면 디자인
		login010.defineTab();
		//그리드 디자인
		login010.defineGrid();
		//트리뷰 디자인
		login010.defineTree();
		//다이얼로그레이어 디자인
		login010.defineDialog();
		//파일업다운로드뷰어 디자인
		login010.defineFile();
		//초기데이터 설정
		login010.initPage();
		//이벤트 정의
		login010.defineEvent();
	},
// -----------------------------------------------------------------------
// ENUM: 열거형 class 상수 정의 [기본함수명:setPageEnum]
// -----------------------------------------------------------------------
	setPageEnum : function(){
		login010.enum = new Enumeration();
		login010.enum.setEnum("GENERATE_ENCRYPT_KEY_FAIL"		,""			        	                                            ,"login010.GENERATE_ENCRYPT_KEY_FAIL" 		,"");
		login010.enum.setEnum("CAPS_LOCK_ACTIVE"				,""			        	                                            ,"login010.CAPS_LOCK_ACTIVE" 				,"");
		login010.enum.setEnum("CHECK_DOMAIN_URL"				,"login010.CHECK_DOMAIN_URL_TITLE"	                                ,"login010.CHECK_DOMAIN_URL" 				,"");
		login010.enum.setEnum("CHECK_USE_AT_URL"				,"login010.CHECK_USE_AT_URL_TITLE"		                            ,"login010.CHECK_USE_AT_URL" 				,"");
		login010.enum.setEnum("CHECK_BEGIN_DATE_URL"			,"login010.CHECK_BEGIN_DATE_URL_TITLE"		                        ,"login010.CHECK_BEGIN_DATE_URL" 			,"");
		login010.enum.setEnum("CHECK_END_DATE_URL"				,"login010.CHECK_END_DATE_URL_TITLE"		                        ,"login010.CHECK_END_DATE_URL" 				,"");
		login010.enum.setEnum("LOGIN_DENY"						,""					                                                ,"login010.LOGIN_DENY" 				        ,"");
		login010.enum.setEnum("LOGIN_DENY_EUP"					,"EUP"				                                                ,"login010.LOGIN_DENY_EUP" 			        ,"");
		login010.enum.setEnum("LOGIN_IDA_AVAIL"					,"IDAA"				                                                ,"login010.LOGIN_IDA_AVAIL" 		        ,"");
		login010.enum.setEnum("LOGIN_IDA_AVAIL2"				,"IDAA2"			                                                ,"login010.LOGIN_IDA_AVAIL2" 		        ,"");
		login010.enum.setEnum("CURRENT_ACCESS_DT"				,""					                                                ,"login010.CURRENT_ACCESS_DT" 		        ,"");
		login010.enum.setEnum("LAST_ACCESS_DT"					,""					                                                ,"login010.LAST_ACCESS_DT" 			        ,"");
		login010.enum.setEnum("LOGIN_OK"						,""					                                                ,"login010.LOGIN_OK" 				        ,"");
		login010.enum.setEnum("PASSWORD_CHANGE"					,""					                                                ,"login010.PASSWORD_CHANGE" 		        ,"");
		login010.enum.setEnum("PASSWORD_CHANGE_ERROR"			,""					                                                ,"login010.PASSWORD_CHANGE_ERROR" 	        ,"");
		login010.enum.setEnum("TRY_LOGIN_AGAIN"					,""					                                                ,"login010.TRY_LOGIN_AGAIN" 		        ,"");
		login010.enum.setEnum("PASSWORD_DENY_INVALID"			,""					                                                ,"login010.PASSWORD_DENY_INVALID" 	        ,"");
		login010.enum.setEnum("PASSWORD_DENY_SAME_PREVIOUS"		,""					                                                ,"login010.PASSWORD_DENY_SAME_PREVIOUS" 	,"");
		login010.enum.setEnum("PASSWORD_DENY_SIMILAR_ID"		,""					                                                ,"login010.PASSWORD_DENY_SIMILAR_ID" 		,"");
		login010.enum.setEnum("PASSWORD_DENY_VERIFY"			,""					                                                ,"login010.PASSWORD_DENY_VERIFY" 			,"");
		login010.enum.setEnum("PASSWORD_DENY_DUPLICATE_WORD"	,""					                                                ,"login010.PASSWORD_DENY_DUPLICATE_WORD" 	,"");
		login010.enum.setEnum("PASSWORD_DENY_CONTINUOUS_WORD"	,""					                                                ,"login010.PASSWORD_DENY_CONTINUOUS_WORD" 	,"");

		login010.enum.setEnum("OTP_KEY_SUCCESS"					,""					                                                ,"login010.OTP_KEY_SUCCESS" 				,"");
		login010.enum.setEnum("OTP_KEY_CREATE"					,""					                                                ,"login010.OTP_KEY_CREATE" 				    ,"");
		login010.enum.setEnum("OTP_KEY_ERROR"					,""					                                                ,"login010.OTP_KEY_ERROR" 				    ,"");
		
		login010.enum.setEnum("CERTIFICATION_TYPE_EMPTY"		,"login010.CERTIFICATION_TYPE_EMPTY_TITLE"		                    ,"login010.CERTIFICATION_TYPE_EMPTY" 		,"");
		login010.enum.setEnum("CERTIFICATION_CODE_EMPTY"		,""				    	                                            ,"login010.CERTIFICATION_CODE_EMPTY" 		,"");
		login010.enum.setEnum("CERTIFICATION_CODE_LENGTH"		,""				    	                                            ,"login010.CERTIFICATION_CODE_LENGTH" 		,"");
		login010.enum.setEnum("CERTIFICATION_CODE_TYPE"			,""				    	                                            ,"login010.CERTIFICATION_CODE_TYPE" 		,"");
		login010.enum.setEnum("CERTIFICATION_TIME_EXPIRE"		,"login010.CERTIFICATION_TIME_EXPIRE_TITLE"		                    ,"login010.CERTIFICATION_TIME_EXPIRE" 		,"");
		login010.enum.setEnum("CERTIFICATION_EMAIL_SMS_NO"		,"login010.CERTIFICATION_EMAIL_SMS_NO_TITLE"	                    ,"login010.CERTIFICATION_EMAIL_SMS_NO" 		,"");
		login010.enum.setEnum("CERTIFICATION_EMAIL_NO"			,"login010.CERTIFICATION_EMAIL_NO_TITLE"	                        ,"login010.CERTIFICATION_EMAIL_NO" 			,"");
		login010.enum.setEnum("CERTIFICATION_SMS_NO"			,"login010.CERTIFICATION_SMS_NO_TITLE"	                            ,"login010.CERTIFICATION_SMS_NO" 			,"");
		login010.enum.setEnum("CERTIFICATION_SEND"				,"login010.CERTIFICATION_SEND_TITLE"		                        ,"login010.CERTIFICATION_SEND" 				,"");

		login010.enum.setEnum("VERIFY_BTN"				        ,""		                                                            ,"login010.VERIFY_BTN" 	            		,"");

	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// TAB: 탭버튼 구성을 위한 함수 정의 [기본함수명:defineTab + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineTab : function(){
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// GRID: 그리드 구성을 위한 함수 정의 [기본함수명:defineGrid + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineGrid : function(){
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// TREE: 트리뷰 구성을 위한 함수 정의 [기본함수명:defineTree + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineTree : function(){
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// DIALOG WINDOW: 레이어 팝업 창 구성을 위한 함수 정의 [기본함수명:defineDialog + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineDialog : function(){
		//2factor 인증
		$("#twoFactorAuthDialog").XuiWindow({
			title		: xui.message.get("login010.VERIFY_BTN"),
			width		: 360,
			height		: 360,
			modal		: true,
			resizable	: false,
			movable		: true,
			open		: function(param){
				mcertificationRequest = param;
				login010.stopCertificationEndDt();
			},
			close: function(){
				login010.stopCertificationEndDt();
			}
		});
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// FILE VIEWER : 레이어 팝업 창 구성을 위한 함수 정의 [기본함수명:defineFile + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineFile : function(){
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// INIT PAGE: 초기데이터 로드를 위한 함수 정의 [기본함수명:initPage + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	initPage : function(){
	    login010.backgroundEvent();
		// 회사정보 검색 및 2Factor인증여부 판단
		login010.selectDataCompanyInfo();
		// load Language
		login010.selectDataLoginPage();
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEFINE EVENT: 화면에 디자인 된 버튼 및 오브젝트 이벤트와 호출할 함수 정의
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineEvent : function(){
        $("#btnLogin").click(function(e){login010.loginData();});
        $("#userId",loginForm).keypress(function(e){if(e.which === xui.enum.ENTER_EVENT.getCode()){login010.loginData();}});
        $("#password",loginForm).keypress(function(e){login010.keypressPassword(e, this);});
        $("#btnChangePassword").click(function(e){login010.convertLoginForm("CHANGE");});
		$("#btnUpdatePassword").click(function(e){login010.changePassword();});
		$("#btnLoginBack").click(function(e){login010.convertLoginForm("");});
		$("#passwordNew",passwordChangeForm).focus(function(e){$(this).tooltip(login010.enum.PASSWORD_DENY_INVALID.getName(), "W");});

		$("#btnLoginBackOTP").click(function(e){login010.convertLoginForm("");});
        $("#otpCode",loginForm).keypress(function(e){if(e.which === xui.enum.ENTER_EVENT.getCode()){login010.loginData();}});
        $("#btnCreateOTP").click(function(e){login010.convertLoginForm("OTP");});
		$("#btnGetOTP").click(function(e){login010.createOTPKey(true);});
		$("#btnGetOTPRe").click(function(e){login010.createOTPKey(false);});

        $("#btnSms").click(function(){login010.sendCertificationNumber("SMS");});
        $("#btnEmail").click(function(){login010.sendCertificationNumber("EMAIL");});
        $("#btnCertification").click(function(){login010.confirmCertification();});
        $("#btnRefresh").click(function(){login010.refreshCertification();});
        $("#certificationNumber").keypress(function(e){if(e.which === xui.enum.ENTER_EVENT.getCode()){login010.confirmCertification();}});
        // 사용자 입력 착오 방지를 위해 입력 시점에 대문자를 일괄 소문자 처리
        $("#userId", loginForm).on("input", function(e) {$("#userId", loginForm).val($("#userId", loginForm).val().toLowerCase().trim());});
	},

/*******************************************************************************
 * Main Functions: 화면상에 주요 기능을 처리하는 함수를 정의한다.
 ******************************************************************************/
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// NEW FORM: 신규 데이터 처리에 대한 함수 정의 [기본함수명:newForm + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// SELECT: 조회 데이터 처리에 대한 함수 정의 [기본함수명:selectData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	selectDataCompanyInfo : function(){
		//데이터유효성 체크
		if (!login010.validationSelectDataCompanyInfo()) { return; }
		let param	= new xui.json();
		param.setURL("xs/webbase/login/selectDataCompanyInfo.json");
		param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
		param.setCallBack(function(response, request){
			if(!response.getErrorFlag()){
				login010.loadCompanyCode(response);
			}else{
				xui.dialog.error(xui.util.restoreXSS(response.getMsg()), xui.enum.ERROR.getName());
			}
		});
		xui.ajax.callService(param);
	},
	validationSelectDataCompanyInfo: function() {
		return true;
	},

    selectDataLoginPage : function(){
        //데이터유효성 체크
        if (!login010.validationSelectDataLoignClient()) { return; }

        // 초기 로드시 캐시에 언어 정보 존재시 언어 정보 값을 설정한다.
        var languageCode = $.cookie("languageCode");
        if( xui.valid.isEmpty(languageCode) ){ languageCode = xui.message.getLanguage() };
        let param	= new xui.json();
        param.setURL("/xs/core/api/initLoginPageLoad.json");
        param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
        param.setString("languageCode",languageCode);
        param.setCallBack(function(response, request){
            if(!response.getErrorFlag()){
                xui.syscode.load(response.getDataJsonObject("SYS_CODE"));
                xui.message.load(response.getDataJsonArray("MESSAGE_DATA"));
                response.setHeader("languageCode",languageCode);
                login010.loadLoginPage(response);
            }else{
                xui.dialog.error(xui.util.restoreXSS(response.getMsg()), xui.enum.ERROR.getName());
            }
        });
        xui.ajax.callService(param);
    },
    validationSelectDataLoignClient : function(){
        return true;
    },

// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// SAVE: 데이터 저장 처리에 대한 함수 정의 [기본함수명:saveData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// DELETE: 삭제 데이터 처리에 대한 함수 정의 [기본함수명:deleteDataContents + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// PRINT: 출력 및 레포트 데이터 처리에 대한 함수 정의 [기본함수명:printData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// EXCEL: 엑셀 IMPORT / EXPORT 처리에 대한 함수 정의 [기본함수명:exportData + (구분단어) importData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// CHART: 차트 데이터 처리에 대한 함수 정의 [기본함수명:chartData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// ETC: 기타 처리에 대한 함수 정의 [기본함수명:(의미단어) + Data]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------


/****************************************************************************************************************************************************************
 * User Functions: 별도 화면 처리를 위해 필요한 함수를 정의한다.
 ****************************************************************************************************************************************************************/
    /**
	* 로그인이 가능한지 체크하여 전체 화면을 활성화하고, 회사콤보박스를 로드함
	* @param {object} response URL을 이용한 검색결과 및 회사콤보 정보
	* @return 없음
	*/
	loadCompanyCode : function(response){
		if (!login010.validationLoadCompanyCode(response)) { return; }

		//인증방법
		mcertificationCase = response.getHeader("certificationCase");

		//인증번호 발송 시 만료 초
		mexpireTimeSec = response.getHeader("certNumberExpireSeconds");

		//로그인화면 컨트롤 활성화
		login010.enabildForm();

		//회사코드콤보박스로드
		let companyCodeList = response.getDataJsonArray("COMPANY_COMBO");
		xui.util.drawCombo("loginForm.companyCode", xui.util.copyObject([], companyCodeList));
		xui.util.drawCombo("passwordChangeForm.companyCode", xui.util.copyObject([], companyCodeList));
		xui.util.drawCombo("otpCreateForm.companyCode", xui.util.copyObject([], companyCodeList));

		//초기값 설정
		let companyCode = response.getString("companyCode");
		$("#companyCode", loginForm).valExt(companyCode);
		$("#companyCode", passwordChangeForm).valExt(companyCode);
		$("#companyCode", otpCreateForm).valExt(companyCode);

		// 쿠키값 설정
		login010.setCookie();
	},
	validationLoadCompanyCode : function(response){
		//도메인에 등록된 회사 또는 솔루션이 없는 경우
		if(response.getCount() === 0){
			xui.dialog.warning(login010.enum.CHECK_DOMAIN_URL.getName(), login010.enum.CHECK_DOMAIN_URL.getCode()); return false;
		}

		//미사용여부체크
		if(response.getString("useAt") === "N"){
			xui.dialog.warning(login010.enum.CHECK_USE_AT_URL.getName(), login010.enum.CHECK_USE_AT_URL.getCode()); return false;
		}

		//서비스 시작일 체크
		if(!xui.valid.isEmpty(response.getString("useBeginDate"))){
			xui.dialog.warning(login010.enum.CHECK_BEGIN_DATE_URL.getName() + xui.format.date.getData(response.getString("useBeginDate")), login010.enum.CHECK_BEGIN_DATE_URL.getCode()); return false;
		}

		//서비스 종료일 체크
		if(!xui.valid.isEmpty(response.getString("useEndDate"))){
			xui.dialog.warning(login010.enum.CHECK_END_DATE_URL.getName() + xui.format.date.getData(response.getString("useEndDate")), login010.enum.CHECK_END_DATE_URL.getCode()); return false;
		}

		return true;
	},

	/**
	* 로그인 진행이 가능하도록 화면 전체를 enabled 처리
	* @param 없음
	* @return 없음
	*/
	enabildForm : function(){
		xui.util.enableAll("loginForm");
		xui.util.enableAll("passwordChangeForm");

		// 인증 구분에 따른 화면 처리
		switch(mcertificationCase){
			case "OTP"  		:
				 xui.util.visibleElement(["loginForm.otpCode","passwordChangeForm.otpCode","loginForm.dividerCase","loginForm.btnCreateOTP"], true);
				 xui.util.enableAll("otpCreateForm");
				 break;
			case "SMS_MAIL"  	: break;
			default 			: break;
		}

	},


	/**
	* 인증방법에 따른 로그인 처리
	* @param 없음
	* @return 없음
	*/
	loginData : function(){
		// 인증 구분에 따른 로그인 처리
		switch(mcertificationCase){
			case "OTP"  		: login010.loginOTP(); break;
			case "SMS_MAIL"  	: login010.loginSMSMail(); break;
			default 			: login010.loginBase(); break;
		}
	},

	/**
	* 비밀번호변경
	* @param 없음
	* @return 없음
	*/
	changePassword : function(){
		// 인증 구분에 따른 로그인 처리
		switch(mcertificationCase){
			case "OTP"  		: login010.changePasswordUsingOTP(); break;
			default 			: login010.changePasswordEtc(); break;
		}
	},

	/**
	* 쿠키정보를 검색하여 아이디기억하기 체크박스 체크여부를 결정한다.
	* @param 없음
	* @return 없음
	*/
	setCookie : function(){
		let rememberId = $.cookie("rememberId");
		if(rememberId === "Y"){
			$("#rememberId").valExt($.cookie("rememberId"));
			$("#companyCode",loginForm).valExt($.cookie("companyCode"));
			$("#userId",loginForm).valExt($.cookie("userId"));
			$("#password",loginForm).focus();
		}else{
			$("#userId",loginForm).focus();
		}
		$("#password",loginForm).val("");
	},

	/**
	* 기억하기 선택에 따라 쿠키를 저장 및 삭제처리한다.
	* @param 없음
	* @return 없음
	*/
	procCookie : function(){
		if($("#rememberId").valExt() === "Y"){
			$.cookie("companyCode", $("#companyCode",loginForm).valExt(), {expires:30});
			$.cookie("userId", $("#userId",loginForm).valExt(), {expires:30});
			$.cookie("rememberId",$("#rememberId").valExt(), {expires:30});
		}else{
			$.removeCookie("companyCode");
			$.removeCookie("userId");
			$.removeCookie("rememberId");
		}
	},

	/**
	* 비밀번호 영역에 키 프레스 이벤트 발생 시 처리
	* @param {object} e 이벤트객체
	* @param {object} element 오브젝트객체
	* @return 없음
	*/
	keypressPassword : function(e, element){
		if(e.which === xui.enum.ENTER_EVENT.getCode()){
            login010.loginData();
        }else{
            login010.checkCapsLockActive(e, element);
        }
	},

	/**
	* 누르는 키의 대소문자 여부를 판단하여 CAPS_LOCK활성화를 툴팁으로 표시한다.
	* @param {object} e 이벤트객체
	* @param {object} element 오브젝트객체
	* @return 없음
	*/
    checkCapsLockActive : function(e, element){
    	let keycode = e.keyCode;
    	let shift = e.shiftKey;
    	if(((keycode >= 65 && keycode < 90) && !shift) || ((keycode >= 97 && keycode <= 112) && shift)){
			if(xui.valid.isEmpty(mobjTooltip)){
    			mobjTooltip = $(element).tooltip(login010.enum.CAPS_LOCK_ACTIVE.getName(), "W", 500);
    			setTimeout(function(){
    				mobjTooltip	= null;
    			}, 500);
    		}

    	} else {
    		login010.hideTooltip();
    	}
    },

    /**
	* 툴팁 숨김 처리
	* @param {object} response 로그인처리결과
	* @return 없음
	*/
    hideTooltip : function(){
    	if(!xui.valid.isEmpty(mobjTooltip)){
			try{mobjTooltip.hide();}catch(E){}
			mobjTooltip = null;
		}
    },

	/**
	* 로그인정보를 암호화하기 위한 OTP 형태의 키를 가져온다.
	* @param 없음
	* @return {string} 암호화키
	*/
	getOTPEncryptKey : function(){
		let param = new xui.json();
		let encryptKey = "";
		param.setURL("xs/webbase/login/createOTPEncryptKey.json");
		param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
		let response	= xui.ajax.callSync(param);
		if(!response.getErrorFlag()){
			encryptKey	= xui.util.replace(response.getString("ENCRYPT_KEY"), " ", "+");
		}else{
			xui.dialog.error(xui.util.restoreXSS(response.getMsg()), login010.enum.GENERATE_ENCRYPT_KEY_FAIL.getName());
		}
		return encryptKey;
	},

	/**
	* 로그인 처리
	* @param {object} response 로그인처리결과
	* @return 없음
	*/
    moveMainPage : function(response){

		//기억하기 여부에 따라 쿠키 처리
		login010.procCookie();

		//중복을 허용한 상태에서 중복로그인 경우 메시지 구분을 위한 처리
		if(response.getErrorCode() === login010.enum.LOGIN_IDA_AVAIL2.getCode()){
			xui.dialog.confirm(xui.util.restoreXSS(response.getMsg()), login010.enum.LOGIN_IDA_AVAIL2.getName(), function(isConfirm){
				if(isConfirm){
					xui.extends.menu.openMain(xui.extends.session.getMainPageUrl(), xui.extends.session.getErrorPageUrl());
				}
			});
		} else {
			let message = login010.enum.CURRENT_ACCESS_DT.getName() + ' ' + xui.format.datetime.getData(response.getString("currLoginDate")) + "<br/>" + login010.enum.LAST_ACCESS_DT.getName() + ' ' + xui.format.datetime.getData(response.getString("recentLoginDt"));
			let title = login010.enum.LOGIN_OK.getName();
			xui.dialog.success(message, title, function(){
				xui.extends.menu.openMain(xui.extends.session.getMainPageUrl(), xui.extends.session.getErrorPageUrl());
			});
		}
    },

	/**
	* 로그인 처리 결과 중복 로그인 확인 이거나, 비밀번호 변경 또는 그외 상태를 메시지로 출력한다.
	* @param {object} response 처리결과 정보
	* @return 없음
	*/
	confirmLoginStatus : function(response){
		if(response.getErrorCode() === login010.enum.LOGIN_IDA_AVAIL.getCode()){
			//증복 로그인 확인
			xui.dialog.warning(xui.util.restoreXSS(response.getMsg()), login010.enum.LOGIN_IDA_AVAIL.getName());
		} else if(response.getErrorCode() === login010.enum.LOGIN_DENY_EUP.getCode()){
			//비밀번호변경
			xui.dialog.confirm(xui.util.restoreXSS(response.getMsg()), login010.enum.LOGIN_DENY_EUP.getName(), function(){
				login010.convertLoginForm("CHANGE");
			});
		} else {
			xui.dialog.warning(xui.util.restoreXSS(response.getMsg()), login010.enum.LOGIN_DENY.getName());
		}
	},

	/**
	* 로그인 - 비밀번호 변경 -OTP발급 페이지 전환
	* @param {string} type 구분 코드
	* @return 없음
	*/
    convertLoginForm : function(type){
    	//기본 설정 진행
    	xui.util.visibleElement(["loginForm","btnLogin","divLoginCookie","btnGetOTP","btnGetOTPRe","btnLoginBackOTP","loginTxt","change-pw-format","passwordChangeForm","btnLoginBack","otpCreateForm","btnUpdatePassword"], false);
    	$("#login-format").removeClass("format--active");
    	$("#change-pw-format").removeClass("format--active");
		$("#otpCode", loginForm).valExt("");
		$("#otpCode", passwordChangeForm).valExt("");
		$("#otpCode", otpCreateForm).valExt("");
		$("#otpKey", otpCreateForm).valExt("");
		$(".page-info").hide();

    	if(type==="CHANGE"){
			xui.util.clearAll("passwordChangeForm", false, true);
    		$("#companyCode", passwordChangeForm).valExt($("#companyCode", loginForm).valExt());
			$("#userId", passwordChangeForm).valExt($("#userId", loginForm).valExt());
			$("#password", passwordChangeForm).valExt($("#password", loginForm).valExt());
			$("#change-pw-format").addClass("format--active");
			xui.util.visibleElement(["change-pw-format","passwordChangeForm","btnLoginBack","btnUpdatePassword"], true);
    	}else if (type==="OTP"){
			xui.util.clearAll("otpCreateForm", false, true);
			$("#companyCode", otpCreateForm).valExt($("#companyCode", loginForm).valExt());
			$("#userId", otpCreateForm).valExt($("#userId", loginForm).valExt());
			$("#password", otpCreateForm).valExt($("#password", loginForm).valExt());
			xui.util.visibleElement(["otpCreateForm","btnLoginBackOTP","btnGetOTP","btnGetOTPRe"], true);
    	}else{
			xui.util.visibleElement(["loginTxt","loginForm","divLoginCookie","btnLogin"], true);
			$(".page-info").show();
			$("#login-format").addClass("format--active");
    	}
    },

	/**
	* 비밀번호 변경 필수항목 체크
	* @param {string} type 구분 코드
	* @return 없음
	*/
	validationChangePassword : function(){
		if(!xui.valid.check("passwordChangeForm")){return false;}

		let strUserId = $("#userId", passwordChangeForm).valExt();						//사용자ID
		let strOldPassword = $("#passwordOld", passwordChangeForm).valExt();			//기존비밀번호
		let strNewPassword = $("#passwordNew", passwordChangeForm).valExt();			//새비밀번호
		let strCheckPassword = $("#passwordNewCheck", passwordChangeForm).valExt();		//새비밀번호체크

		//비밀번호와 변경비밀번호가 일치하는지 체크
    	if(strOldPassword === strNewPassword){ $("#passwordNew", passwordChangeForm).tooltip(login010.enum.PASSWORD_DENY_SAME_PREVIOUS.getName(), "E"); return false;}

		//계정 ID정보와 비밀번호 정보의 유사성 체크
		if(!login010.checkIdPasswordSimilar(strUserId, strNewPassword)){$("#passwordNew", passwordChangeForm).tooltip(login010.enum.PASSWORD_DENY_SIMILAR_ID.getName(), "E"); return false;}

		//비밀번호 확인 체크
    	if(strNewPassword != strCheckPassword){$("#passwordNewCheck", passwordChangeForm).tooltip(login010.enum.PASSWORD_DENY_VERIFY.getName(), "E"); return false;}

    	//비밀번호연속성 체크
    	if(!login010.checkPasswordArray(strNewPassword)){return false;}

    	return true;
	},

	/**
	* 계정 ID정보와 비밀번호 정보의 유사성 체크
	* @param {string} userId 사용자 ID
	* @param {string} passwordNew 신규 비밀번호
	* @return 없음
	*/
    checkIdPasswordSimilar : function(userId, passwordNew){
    	let isValid		= true;
    	let charArray	= [];
    	let len			= userId.length-3;
    	for(let i = 0; i < len; i++){
    		charArray.push(userId.substr(i, 4));
    	}
    	for(let j = 0; j < charArray.length; j++){
    		if(passwordNew.indexOf(charArray[j]) >= 0){
    			isValid	= false;
    			break;
    		}
    	}
    	return isValid;
    },

	/**
	* 주기성문자 및 동일문자 validation
	* @param {string} strNewPassword 비밀번호
	* @return 없음
	*/
    checkPasswordArray : function(strNewPassword){
        let SamePass_0 = 0; //동일문자 카운트
        let SamePass_1 = 0; //연속성(+) 카운드
        let SamePass_2 = 0; //연속성(-) 카운드
        let chr_pass_0;
        let chr_pass_1;
        let chr_pass_2;
        for(let i = 0; i < strNewPassword.length; i++){
            chr_pass_0 = strNewPassword.charAt(i);
            chr_pass_1 = strNewPassword.charAt(i+1);
            //동일문자 카운트
            if(chr_pass_0 == chr_pass_1){
                SamePass_0++;
            }
            chr_pass_2 = strNewPassword.charAt(i+2);
            //연속성(+) 카운드
            if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == 1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == 1){
                SamePass_1++;
            }
            //연속성(-) 카운드
            if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == -1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == -1){
                SamePass_2++;
            }
        }
        if(SamePass_0 > 1){
        	$("#passwordNewCheck", passwordChangeForm).tooltip(login010.enum.PASSWORD_DENY_DUPLICATE_WORD.getName(), "E");
            return false;
        }
        if(SamePass_1 > 1 || SamePass_2 > 1 ){
        	$("#passwordNewCheck", passwordChangeForm).tooltip(login010.enum.PASSWORD_DENY_CONTINUOUS_WORD.getName(), "E");
            return false;
        }
        return true;
    },

	/**
	* 숫자분을 mm:ss 포맷으로 변경해서 반환
	* @param {string} intMinute 문자형태의 분
	* @return 없음
	*/
    convertMinSec : function(certNumberExpireSeconds){
    	let minSec = parseInt(parseInt(certNumberExpireSeconds)/60);
    	minSec = xui.util.lpad(minSec,2,"0") + ":00";
    	return minSec;
    },

	//일반 로그인 처리
    loginBase : function(){
		if(!login010.validationLoginBase()){return;}			//데이터 유효성 체크

		let encryptKey	= login010.getOTPEncryptKey();			// OTP생성
		if(!xui.valid.isEmpty(encryptKey)){
			let param = new xui.json();
			param.setURL("/xs/webbase/login/loginBase.json");
			param.setString("companyCodeEncrypt", xui.util.encryptAES($("#companyCode", loginForm).valExt(), encryptKey));								//회사코드(암호화) 파라메터 세팅
			param.setString("userIdEncrypt"		, xui.util.encryptAES($("#userId", loginForm).valExt(), encryptKey));									//사용자ID(암호화) 파라메터 세팅
			param.setString("passwordEncrypt"	, xui.util.encryptAES(xui.util.encryptSHA256($("#password", loginForm).valExt()), encryptKey));			//비밀번호(암호화) 파라메터 세팅
			param.setString("languageCode"	    , $("#languageCode", loginForm).valExt());			                                                    //다국어 파라미터 세팅
			param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			param.setCallBack(function(response, request){
				if(!response.getErrorFlag()){
					login010.moveMainPage(response);
				}else{
					login010.confirmLoginStatus(response);
				}
			});
			xui.ajax.callService(param);
		}
	},
	validationLoginBase : function(){
		//공통 필수 체크
		if(!xui.valid.check("loginForm")){return false;}

		return true;
	},


	/**
	* 비밀번호변경
	* @param 없음
	* @return 없음
	*/
    changePasswordEtc : function(){
		//데이터 유효성 체크
		if(!login010.validationChangePassword()){return;}
		//변경확인
		xui.dialog.confirm(xui.enum.MOD_CONFIRM.getName(), login010.enum.PASSWORD_CHANGE.getName(), function(isConfirm){
			if(isConfirm){
				//암호화 키 생성
				var encryptKey = login010.getOTPEncryptKey();
				if(!xui.valid.isEmpty(encryptKey)){
					var param = new xui.json();
					param.setURL("/xs/webbase/login/changeUserPassword.json");
					param.setString("companyCodeEncrypt", xui.util.encryptAES($("#companyCode", passwordChangeForm).valExt(), encryptKey));							//회사코드(암호화) 파라메터 세팅
					param.setString("userIdEncrypt", xui.util.encryptAES($("#userId", passwordChangeForm).valExt(), encryptKey));								//사용자ID(암호화) 파라메터 세팅
					param.setString("passwordEncrypt", xui.util.encryptAES(xui.util.encryptSHA256($("#passwordNew", passwordChangeForm).valExt()), encryptKey));	//변경비밀번호(2중 암호화) 파라메터 세팅
					param.setString("passwordOldEncrypt", xui.util.encryptAES(xui.util.encryptSHA256($("#passwordOld", passwordChangeForm).valExt()), encryptKey));	//변경전비밀번호(2중 암호화) 파라메터 세팅
					param.setString("passwordNew", xui.util.encryptAES($("#passwordNew", passwordChangeForm).valExt(), encryptKey));							//변경비밀번호암호화) 파라메터 세팅
					param.setString("languageCode",$("#languageCode", loginForm).valExt());
					param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
					param.setCallBack(function(response, request){
						//에러 여부 확인
						if(!response.getErrorFlag()){
							xui.dialog.success(login010.enum.TRY_LOGIN_AGAIN.getName(), xui.enum.UPD_OK.getName(), function(){
								$("#companyCode", loginForm).valExt($("#companyCode", passwordChangeForm).valExt());
								$("#userId"		, loginForm).valExt($("#userId"		, passwordChangeForm).valExt());
								$("#password"	, loginForm).valExt("");
								$("#password"	, loginForm).focus();
								xui.util.clearAll("passwordChangeForm", false, true);
								$("#btnLoginBack").click();
							});
						}else{
							//에러코드별 후처리 및 메시지 표출
							xui.dialog.error(response.getMsg(), login010.enum.PASSWORD_CHANGE_ERROR.getName());
						}
					});
					//서비스 호출하여 결과값을 전송받는다.
					xui.ajax.callService(param);
				}
			}
		});
	},





	//OTP로그인 처리 시작 ****************************************************************************************************************

	//OTP를 이용한 로그인 처리
	loginOTP : function(){
		if(!login010.validationLoginOTP()){return;}				//데이터 유효성 체크

		let encryptKey	= login010.getOTPEncryptKey();			// OTP생성
		if(!xui.valid.isEmpty(encryptKey)){
			let param = new xui.json();
			param.setURL("/xs/webbase/login/loginOTP.json");
			param.setString("companyCodeEncrypt", xui.util.encryptAES($("#companyCode", loginForm).valExt(), encryptKey));								//회사코드(암호화) 파라메터 세팅
			param.setString("userIdEncrypt"		, xui.util.encryptAES($("#userId", loginForm).valExt(), encryptKey));									//사용자ID(암호화) 파라메터 세팅
			param.setString("passwordEncrypt"	, xui.util.encryptAES(xui.util.encryptSHA256($("#password", loginForm).valExt()), encryptKey));			//비밀번호(암호화) 파라메터 세팅
			param.setString("otpCodeEncrypt"	,xui.util.encryptAES($("#otpCode", loginForm).valExt(), encryptKey));									//OTP인증번호(암호화) 파라미터 세팅
			param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			param.setCallBack(function(response, request){
				if(!response.getErrorFlag()){
					login010.moveMainPage(response);
				}else{
					login010.confirmLoginStatus(response);
				}
			});
			xui.ajax.callService(param);
		}
	},
	validationLoginOTP : function(){
		//공통 필수 체크
		if(!xui.valid.check("loginForm")){return false;}

		let otpCode = $("#otpCode", loginForm).valExt();

		//인증번호 필수 항목 체크
		if(xui.valid.isEmpty(otpCode)){$("#otpCode", loginForm).tooltip(login010.enum.CERTIFICATION_CODE_EMPTY.getName(), "E");return false;}

	 	//OTP코드 길이 6자리인지 체크
		if(otpCode.length != 6){$("#otpCode", loginForm).tooltip(login010.enum.CERTIFICATION_CODE_LENGTH.getName(), "E");return false;}

		//OTP코드 숫자인지 체크
		if(!xui.valid.isNumeric(otpCode)){$("#otpCode", loginForm).tooltip(login010.enum.CERTIFICATION_CODE_TYPE.getName(), "E");return false;}

		return true;
	},

    //구글 OTP 발급재발급
    createOTPKey : function(isNew){
		if(!login010.validationCreateOTPKey(isNew)){return;}		//데이터 유효성 체크
		let encryptKey	= login010.getOTPEncryptKey();				// OTP생성
		if(!xui.valid.isEmpty(encryptKey)){
			let param = new xui.json();
			param.setURL("/xs/webbase/login/createOTPKey.json");
			param.setString("companyCodeEncrypt", xui.util.encryptAES($("#companyCode", otpCreateForm).valExt(), encryptKey));								//회사코드(암호화)
			param.setString("userIdEncrypt"		, xui.util.encryptAES($("#userId", otpCreateForm).valExt(), encryptKey));									//사용자ID(암호화)
			param.setString("passwordEncrypt"	, xui.util.encryptAES(xui.util.encryptSHA256($("#password", otpCreateForm).valExt()), encryptKey));			//비밀번호(암호화)
			param.setString("otpCodeEncrypt"	,xui.util.encryptAES($("#otpCode", otpCreateForm).valExt(), encryptKey));									//OTP인증번호(암호화) 파라미터 세팅
            param.setBoolean("isNew"			, isNew); 																									//신규인지 재발급인지
			param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			param.setCallBack(function(response, request){
				if(!response.getErrorFlag()){
                    xui.dialog.success(login010.enum.OTP_KEY_SUCCESS.getName(), xui.enum.PROC_OK.getName(), function(){
                        //만들어진 키를 클라이언트에 보여주기
                        $("#otpKey", otpCreateForm).valExt(response.getString("otpKey"));		//OTP키 보여주기
                    });
                }else{
					xui.dialog.error(xui.util.restoreXSS(response.getMsg()), login010.enum.OTP_KEY_ERROR.getName());
                }
			});
			xui.ajax.callService(param);
		}
	},
	validationCreateOTPKey : function(isNew){
    	if(!xui.valid.check("otpCreateForm")){return false;}

		let otpCode = $("#otpCode", otpCreateForm).valExt();
		//재발급이면 OTP키가 반드시 들어가야함
		if(!isNew){
			//OTP코드 길이 6자리인지 체크
			if(otpCode.length != 6){ $("#otpCode", otpCreateForm).tooltip(login010.enum.CERTIFICATION_CODE_LENGTH.getName(), "E"); return false;}

			//OTP코드 숫자인지 체크
			if(!xui.valid.isNumeric(otpCode)){ $("#otpCode", otpCreateForm).tooltip(login010.enum.CERTIFICATION_CODE_TYPE.getName(), "E"); return false;}
		}
		return true;
	},

	//구글 OTP코드 입력 후 비밀번호를 변경한다.
    changePasswordUsingOTP : function(){
		if(!login010.validationChangePassword()){return;}		//데이터 유효성 체크
		if(!login010.validationChangePwUsingOTP()){return;}		//데이터 유효성 체크
		xui.dialog.confirm(xui.enum.MOD_CONFIRM.getName(), login010.enum.PASSWORD_CHANGE.getName(), function(isConfirm){	//최종 재확인
			if(isConfirm){
				let encryptKey = login010.getOTPEncryptKey();		//암호화 키 생성
				if(!xui.valid.isEmpty(encryptKey)){
					let param = new xui.json();
					param.setURL("/xs/webbase/login/changeUserPasswordOTP.json");
					param.setString("companyCodeEncrypt", xui.util.encryptAES($("#companyCode", passwordChangeForm).valExt(), encryptKey));							//회사코드(암호화) 파라메터 세팅
					param.setString("userIdEncrypt", xui.util.encryptAES($("#userId", passwordChangeForm).valExt(), encryptKey));									//사용자ID(암호화) 파라메터 세팅
					param.setString("passwordEncrypt", xui.util.encryptAES(xui.util.encryptSHA256($("#passwordNew", passwordChangeForm).valExt()), encryptKey));	//변경비밀번호(2중 암호화) 파라메터 세팅
					param.setString("passwordOldEncrypt", xui.util.encryptAES(xui.util.encryptSHA256($("#passwordOld", passwordChangeForm).valExt()), encryptKey));	//변경전비밀번호(2중 암호화) 파라메터 세팅
					param.setString("passwordNew", xui.util.encryptAES($("#passwordNew", passwordChangeForm).valExt(), encryptKey));								//변경비밀번호암호화) 파라메터 세팅
					param.setString("otpCodeEncrypt", xui.util.encryptAES($("#otpCode", passwordChangeForm).valExt(), encryptKey));									//OTP인증번호(암호화) 파라미터 세팅
					param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
					param.setCallBack(function(response, request){
						if(!response.getErrorFlag()){
							xui.dialog.success(login010.enum.TRY_LOGIN_AGAIN.getName(), xui.enum.UPD_OK.getName(), function(){
								$("#companyCode", loginForm).valExt($("#companyCode", passwordChangeForm).valExt());
								$("#userId", loginForm).valExt($("#userId", passwordChangeForm).valExt());
								$("#password", loginForm).valExt("");
								$("#password", loginForm).focus();
								xui.util.clearAll("passwordChangeForm", false, true);
								$("#btnLoginBack").click();
							});
						}else{
							xui.dialog.error(xui.util.restoreXSS(response.getMsg()), login010.enum.PASSWORD_CHANGE_ERROR.getName());
						}
					});
					xui.ajax.callService(param);
				}
			}
		});
	},
	validationChangePwUsingOTP : function(){
		let otpCode = $("#otpCode", passwordChangeForm).valExt();     					//OTP코드

		//인증번호 필수 항목 체크
		if(xui.valid.isEmpty(otpCode)){$("#otpCode", loginForm).tooltip(login010.enum.CERTIFICATION_CODE_EMPTY.getName(), "E");return false;}

    	//OTP코드 길이 6자리인지 체크
		if(otpCode.length!=6){$("#otpCode", passwordChangeForm).tooltip(login010.enum.CERTIFICATION_CODE_LENGTH.getName(), "E"); return false;}

		//OTP코드 숫자인지 체크
		if(!xui.valid.isNumeric(otpCode)){$("#otpCode", passwordChangeForm).tooltip(login010.enum.CERTIFICATION_CODE_TYPE.getName(), "E"); return false;}

    	return true;
	},
	//OTP로그인 처리 종료 ****************************************************************************************************************



	//SMS_MAIL 로그인 처리 시작 **********************************************************************************************************
	// SMS_MAIL을 이용한 로그인 처리
	loginSMSMail : function(){
		//데이터 유효성 체크
		if(!login010.validationLoginSMSMail()){return;}

		let encryptKey	= login010.getOTPEncryptKey();			// OTP생성
		if(!xui.valid.isEmpty(encryptKey)){
			let param = new xui.json();
			param.setURL("/xs/webbase/login/loginSMSMail.json");
			param.setString("companyCodeEncrypt", xui.util.encryptAES($("#companyCode", loginForm).valExt(), encryptKey));								//회사코드(암호화) 파라메터 세팅
			param.setString("userIdEncrypt"	, xui.util.encryptAES($("#userId", loginForm).valExt(), encryptKey));										//사용자ID(암호화) 파라메터 세팅
			param.setString("passwordEncrypt", xui.util.encryptAES(xui.util.encryptSHA256($("#password", loginForm).valExt()), encryptKey));			//비밀번호(암호화) 파라메터 세팅
			param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			param.setCallBack(function(response, request){
				if(!response.getErrorFlag()){
					login010.choiceCertification(response);
				}else{
					login010.confirmLoginStatus(response);
				}
			});
			xui.ajax.callService(param);
		}
	},
	validationLoginSMSMail : function(){
		//공통 필수 체크
		if(!xui.valid.check("loginForm")){return false;}

		return true;
	},

	// 인증방법 선택 후 인증요청
	choiceCertification : function(response){
		let userMobileInfo = response.getString("userMobileInfo");
		let userEmailInfo = response.getString("userEmailInfo");

		//인증정보가 모두 없을 경우 체크
		if(xui.valid.isEmpty(userMobileInfo) && xui.valid.isEmpty(userEmailInfo)){xui.dialog.error(login010.enum.CERTIFICATION_EMAIL_SMS_NO.getName(), login010.enum.CERTIFICATION_EMAIL_SMS_NO.getCode()); return;}

		//인증매체 정보 유무에 따른 화면 설정
		$("#userMobileInfo").text(login010.enum.CERTIFICATION_SMS_NO.getName());
		$("#userEmailInfo").text(login010.enum.CERTIFICATION_EMAIL_NO.getName());
		//새로고침 버튼 숨김
		xui.util.visibleElement(["btnRefresh"], false);

		if(!xui.valid.isEmpty(userMobileInfo)){
			$("#userMobileInfo").text(userMobileInfo);
			$("#btnSms").removeClass("login-btn-disable");
		}
		if(!xui.valid.isEmpty(userEmailInfo)){
			$("#userEmailInfo").text(userEmailInfo);
			$("#btnEmail").removeClass("login-btn-disable");
		}

		//인증선택레이어 호출
		$("#twoFactorAuthDialog").api().open("LOGIN");
	},

	//인증번호발송요청
	sendCertificationNumber : function(certificationTypeCode){
		//데이터 유효성 체크
		if(!login010.validationSendCertificationNumber(certificationTypeCode)){return;}

		let encryptKey	= login010.getOTPEncryptKey();			// OTP생성
		if(!xui.valid.isEmpty(encryptKey)){
			let param = new xui.json();
			param.setURL("/xs/webbase/login/sendCertificationNumber.json");
			param.setString("companyCodeEncrypt", xui.util.encryptAES($("#companyCode", loginForm).valExt(), encryptKey));								//회사코드(암호화) 파라메터 세팅
			param.setString("userIdEncrypt"	, xui.util.encryptAES($("#userId", loginForm).valExt(), encryptKey));										//사용자ID(암호화) 파라메터 세팅
			param.setString("passwordEncrypt", xui.util.encryptAES(xui.util.encryptSHA256($("#password", loginForm).valExt()), encryptKey));			//비밀번호(암호화) 파라메터 세팅
            param.setString("certificationType"	, certificationTypeCode);																				//  인증요청 타입
			param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			param.setCallBack(function(response, request){
				if(!response.getErrorFlag()){
					login010.startCertificationNumber(response);
				}else{
					xui.dialog.error(xui.util.restoreXSS(response.getMsg()));
				}
			});
			xui.ajax.callService(param);
		}
	},
	validationSendCertificationNumber : function(certificationTypeCode){
		//버튼이 활성화상태인지 체크
		if(certificationTypeCode === "SMS"){
			if($("#btnSms").hasClass("login-btn-disable")){return false;}
		} else if(certificationTypeCode === "EMAIL"){
			if($("#btnEmail").hasClass("login-btn-disable")){return false;}
		}

		//공통 필수 체크
		if(!xui.valid.check("loginForm")){return false;}

		return true;
	},

	// 인증번호 정상발송과 카운트 시작
	startCertificationNumber : function(response){
		// 인증번호요청 버튼 비활성화
		$("#btnSms").addClass("login-btn-disable");
		$("#btnEmail").addClass("login-btn-disable");
		xui.util.visibleElement(["btnRefresh"], true);

		//화면 상단창에 인증번호 발송 표시
		$.toast({
			text					: login010.enum.CERTIFICATION_SEND.getName(),
			showHideTransition		: 'slide',
			stack					: 'fakse',
			hideAfter				: 3000,
			position				: 'top-center',
			allowToastClose			: false
		});

		//인증매체전송모드가 아닐 경우 화면에 표시
		if(!xui.valid.isEmpty(response.getBoolean("certificationAvailable"))){
			if(!response.getBoolean("certificationAvailable") && response.getString("certificationNumber") !== ""){
				alert(response.getString("certificationNumber"));
	    	}
		}

		//인증번호 입력을 받기 위한 화면 시작 진행
		login010.startCertificationEndDt();

		// 인증번호 입력화면으로 커서 이동
		$('#certificationNumber').focus();
	},

    //인증요청 시작에 따른 값 설정 및 화면 설정
    startCertificationEndDt : function() {
        login010.stopCertificationEndDt();
        let startDate  = "2099-12-31 12:" + login010.convertMinSec(mexpireTimeSec);
        let tDate = new Date(startDate);
        mcertificationEndDtTimer = setInterval(function(){
            tDate.setSeconds(tDate.getSeconds()-1);
            let jsonStartDate = xui.util.getJsonDateTime(tDate);
            $(".login-certifi-time").text(jsonStartDate.getString("strMinu"));
            if (jsonStartDate.getString("strMinu") === '00:00') {
                clearInterval(mcertificationEndDtTimer);
                mcertificationEndDtTimer = null;
                xui.dialog.warning(login010.enum.CERTIFICATION_TIME_EXPIRE.getName(), login010.enum.CERTIFICATION_TIME_EXPIRE.getCode(), function() {
                    $("#twoFactorAuthDialog").api().close();
                });
            }
        }, 1000);
    },

	//인증요청 종료에 따른  값 및 화면 초기화
    stopCertificationEndDt : function() {
        clearInterval(mcertificationEndDtTimer);
        mcertificationEndDtTimer = null;
        $(".login-certifi-time").text(login010.convertMinSec(mexpireTimeSec));
        $("#certificationNumber").valExt("");
    },

    //인증번호발송 새로고침
    refreshCertification : function(){
		if(!xui.valid.isEmpty($("#userMobileInfo").text())){
			$("#btnSms").removeClass("login-btn-disable");
		}
		if(!xui.valid.isEmpty($("#userEmailInfo").text())){
			$("#btnEmail").removeClass("login-btn-disable");
		}
		login010.stopCertificationEndDt();
		xui.util.visibleElement(["btnRefresh"], false);
    },

    //인증번호 확인을 통한 로그인
    confirmCertification : function(){
    	if(mcertificationRequest === "LOGIN"){
    		login010.loginCertificationNumber();
    	} else {
    		login010.changePwdCertificationNumber();
    	}
	},

	//인증번호 확인을 통한 로그인 처리
	loginCertificationNumber : function(){
		//데이터 유효성 체크
		if(!login010.validationLoginCertificationNumber()){return;}

		let encryptKey	= login010.getOTPEncryptKey();			// OTP생성
		if(!xui.valid.isEmpty(encryptKey)){
			let param = new xui.json();
			param.setURL("/xs/webbase/login/loginCertification.json");
			param.setString("companyCodeEncrypt", xui.util.encryptAES($("#companyCode", loginForm).valExt(), encryptKey));									//회사코드(암호화) 파라메터 세팅
			param.setString("userIdEncrypt"	, xui.util.encryptAES($("#userId", loginForm).valExt(), encryptKey));											//사용자ID(암호화) 파라메터 세팅
			param.setString("passwordEncrypt", xui.util.encryptAES(xui.util.encryptSHA256($("#password", loginForm).valExt()), encryptKey));				//비밀번호(암호화) 파라메터 세팅
			param.setString("certificationNumberEncrypt", xui.util.encryptAES($("#certificationNumber").valExt(), encryptKey));								//인증번호(암호화) 파라메터 세팅
			param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			param.setCallBack(function(response, request){
				if(!response.getErrorFlag()){
					//인증선택레이어 종료
					$("#twoFactorAuthDialog").api().close();
					login010.moveMainPage(response);
				}else{
					login010.confirmLoginStatus(response);
				}
			});
			xui.ajax.callService(param);
		}
	},
	validationLoginCertificationNumber : function(){
		//공통 필수 체크
		if(!xui.valid.check("loginForm")){return false;}

		//인증요청 여부 체크
		if(xui.valid.isEmpty(mcertificationRequest)){xui.dialog.warning(login010.enum.CERTIFICATION_TYPE_EMPTY.getName(), login010.enum.CERTIFICATION_TYPE_EMPTY.getCode()); return false;}

		//인증번호 입력 체크
		let certificationNumber = $("#certificationNumber").valExt();
		if(xui.valid.isEmpty(certificationNumber)){$("#certificationNumber").tooltip(login010.enum.CERTIFICATION_CODE_EMPTY.getName(), "E");return false;}

	 	//인증번호 길이 6자리인지 체크
		if(certificationNumber.length != 6){$("#certificationNumber").tooltip(login010.enum.CERTIFICATION_CODE_LENGTH.getName(), "E");return false;}

		return true;
	},

	//인증번호 확인을 통한 비밀번호변경
	changePwdCertificationNumber : function(){
		//데이터 유효성 체크
		if(!login010.validationChangePwdCertificationNumber()){return;}
	},
	validationChangePwdCertificationNumber : function(){
		//공통 필수 체크
		if(!xui.valid.check("passwordChangeForm")){return false;}

		return true;
	},



	//SMS_MAIL 로그인 처리 시작 **********************************************************************************************************



	//기본 로그인 처리 시작 **********************************************************************************************************

	//기본 로그인 처리 시작 **********************************************************************************************************

    // 로컬 DB에 VIEW_COM_SYS_CODE 없을 때 언어 콤보 최소 폴백
    fallbackLanguageOptions : function(){
        return [
            {code:"ko", codeName:"한국어"},
            {code:"en", codeName:"English"}
        ];
    },
    resolveLanguageOptions : function(){
        var langOptions = xui.syscode.get("SYS028");
        if(xui.valid.isEmpty(langOptions)){
            langOptions = login010.fallbackLanguageOptions();
        }
        return langOptions;
    },

    // 메시지, 초기 다국어 콤보 로드
    loadLoginPage : function(response){
        var languageCode = response.getHeader("languageCode");
        xui.util.drawCombo($("#languageCode"), login010.resolveLanguageOptions());
        login010.unDefineEventLang();
        $("#languageCode").valExt(languageCode);
        login010.defineEventLang();
        xui.com.elementLabelScan(document.head);
        xui.com.elementLabelScan(document.body);
    },

    defineEventLang : function(){
        $("#languageCode").on('change', function(e){login010.changeLocale($(this).valExt());});
    },

    unDefineEventLang : function(){
        $("#languageCode").off('change');
    },

    /**
    *   Lanuguage 변경
    *   다국어 처리
    *   @param {String} languageCode 변경된 언어정보
    */
    changeLocale : function(languageCode){
        var param	= new xui.json();
        param.setURL("/xs/webbase/login/changeLocale.json");
        param.setString("languageCode", languageCode);
        param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
        param.setCallBack(function(response, request){
            if(!response.getErrorFlag()){
                var sysCode = response.getDataJsonObject("SYS_CODE");
                if(!xui.valid.isEmpty(sysCode)){
                    xui.syscode.load(sysCode);
                }
                xui.message.load(response.getDataJsonArray("MESSAGE_DATA"));
                $.cookie("languageCode",languageCode, {expires:30});
                response.setHeader("languageCode",languageCode);
                login010.loadLoginPage(response);
            }else{
                xui.dialog.error(xui.util.restoreXSS(response.getMsg()), xui.enum.ERROR.getName());
            }
        });
        xui.ajax.callService(param);
    },

    backgroundEvent : function(){
        ////////////////////////////////////////////////////////////////////////
        // `` 1. 배경 애니메이션 ↓↓↓↓↓↓↓
        ////////////////////////////////////////////////////////////////////////
        var bgline = document.querySelector('.line-image');
        var gradientBg = document.querySelector('.index-bg-gradient-l');
        var scaleFactor = 0.1;
        document.addEventListener('mousemove', (event) => {
            var x = (event.clientX - window.innerWidth / 2) * scaleFactor;
            var y = (event.clientY - window.innerHeight / 2) * scaleFactor;
            // var mouseX = event.clientX; // 마우스 포인터의 X 좌표
            // var windowWidth = window.innerWidth; // 브라우저 창의 너비
            // var rotateAngle = (mouseX / windowWidth - 0.5) * 30;
            bgline.style.transform = `perspective(1000px) translate(${x}px, ${y}px) translate(-50%,-55%)`;
            gradientBg.style.transform = `perspective(1000px) translate(${-x / 2}px, ${-y / 2}px) translate(-50%,-55%)`;
        });
    },

	/**
	 * Sample(해당 함수는 삭제하지 말고 그대로)
	 */
    sample : function () {

    },
};