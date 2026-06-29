(function(){
	
	window.xui												= window.xui || {};
	
	"use strict";
	
	xui.USE_JQUERY											= false;
	if(jQuery){
		xui.USE_JQUERY										= true;
		jQuery(document).ready((function(){
			xui.com._initializeUI();
		}));
	}else{
		window.onload										= function(){
			xui.com._initializeUI();
		};
	}
	window.addEventListener("beforeunload", (function(){
		xui.com.closeAllWindow();
		try{
			if(typeof(PageUnload) === "function"){
				PageUnload();
			}
		}catch(E){
			console.log(E);
		}
	}));

	xui.__EnumerationExt = (function(enumerationExt){
		this.enumerationExt				= enumerationExt;
	});
	xui.__EnumerationExt.prototype = {
		getCode : function(){
			var returnValue = this.enumerationExt.code;
			var textLabel   = xui.message.get(this.enumerationExt.code);
			if(!xui.valid.isEmpty(textLabel)){
				returnValue = textLabel;
			}
			return returnValue;
		},
		getName : function(){
			var returnValue = this.enumerationExt.name;
			var textLabel   = xui.message.get(this.enumerationExt.name);
			if(!xui.valid.isEmpty(textLabel)){
				returnValue = textLabel;
			}
			return returnValue;
		},
		getParentCode : function(){
			return this.enumerationExt.pcode;
		}
	};
	xui.__ENUMERATIONEXT = function (init){
		if(init){
			this.setEnum("WRONG_DATA_FORMAT"		,""		,"xui.WRONG_DATA_FORMAT"																	,"");
			this.setEnum("EMPTY_DATA_FILL"			,""		,"xui.EMPTY_DATA_FILL"																		,"");
			this.setEnum("BEGIN_BIGGER_THAN_END"	,""		,"xui.BEGIN_BIGGER_THAN_END"																,"");
			this.setEnum("MAX_OVER_Y"				,""		,"xui.MAX_OVER_Y"																			,"");
			this.setEnum("MAX_OVER_M"				,""		,"xui.MAX_OVER_M"																	 		,"");
			this.setEnum("MAX_OVER_D"				,""		,"xui.MAX_OVER_D"																		 	,"");
			this.setEnum("MIN_SHORT_Y"				,""		,"xui.MIN_SHORT_Y"																			,"");
			this.setEnum("MIN_SHORT_M"				,""		,"xui.MIN_SHORT_M"																			,"");
			this.setEnum("MIN_SHORT_D"				,""		,"xui.MIN_SHORT_D"																			,"");
			this.setEnum("PASSWORD_DENY_INVALID"	,""		,"xui.PASSWORD_DENY_INVALID"																,"");
			this.setEnum("AUTH_TYPE_SELECT"			,"R"	,"xui.AUTH_TYPE_SELECT"																		,"");
			this.setEnum("AUTH_TYPE_SAVE"			,"S"	,"xui.AUTH_TYPE_SAVE"																		,"");
			this.setEnum("AUTH_TYPE_CREATE"			,"C"	,"xui.AUTH_TYPE_CREATE"																		,"");
			this.setEnum("AUTH_TYPE_UPDATE"			,"U"	,"xui.AUTH_TYPE_UPDATE"																		,"");
			this.setEnum("AUTH_TYPE_DELETE"			,"D"	,"xui.AUTH_TYPE_DELETE"																		,"");
			this.setEnum("AUTH_TYPE_OUTPUT"			,"O"	,"xui.AUTH_TYPE_OUTPUT"																		,"");
			this.setEnum("AUTH_TYPE_ETC"			,"E"	,"xui.AUTH_TYPE_ETC"																		,"");
			this.setEnum("AUTH_TYPE_ADMIN"			,"A"	,"xui.AUTH_TYPE_ADMIN"																		,"");
			this.setEnum("AUTH_TYPE_NONE"			,"N"	,"xui.AUTH_TYPE_NONE"																		,"");
		}
	};
	xui.__ENUMERATIONEXT.prototype = {
		setEnum : function(name, code, codeName, pcode){
			var _this					= this;
			_this[name]					= new xui.__EnumerationExt({"code":code, "name":codeName, "pcode":pcode});

			// 다국어 적용 여부 Y 일경우 xuicore의 enum 값도 다국어로 변경
			xuic.__ENUM[name] =_this[name];
		}
	};
	xui.__ENUMEXT						= new xui.__ENUMERATIONEXT(true);

	window.Enumeration = function(){return new xui.__ENUMERATIONEXT();}

	/*application common const */
	xui.enum = Enumeration();
	xui.enum.setEnum("MAIN_PAGE_VARIABLE"			,"main010"									,""																				,"");
	xui.enum.setEnum("ENTER_EVENT"					,13											,"xui.ENTER_EVENT"																,"");
	xui.enum.setEnum("CLICK_EVENT"					,1											,"xui.CLICK_EVENT"																,"");
	xui.enum.setEnum("BLUR_EVENT"					,0											,"xui.BLUR_EVENT"																,"");
	xui.enum.setEnum("ESC_EVENT"					,27											,"xui.ESC_EVENT"																,"");
	xui.enum.setEnum("TAB_EVENT"					,9											,"xui.TAB_EVENT"																,"");
	xui.enum.setEnum("BACKSPACE_EVENT"				,8											,"xui.BACKSPACE_EVENT"															,"");
	xui.enum.setEnum("AUTH_TYPE_SELECT"				,"R"										,"xui.AUTH_TYPE_SELECT"															,"");
	xui.enum.setEnum("AUTH_TYPE_SAVE"				,"S"										,"xui.AUTH_TYPE_SAVE"															,"");
	xui.enum.setEnum("AUTH_TYPE_CREATE"				,"C"										,"xui.AUTH_TYPE_CREATE"															,"");
	xui.enum.setEnum("AUTH_TYPE_UPDATE"				,"U"										,"xui.AUTH_TYPE_UPDATE"															,"");
	xui.enum.setEnum("AUTH_TYPE_DELETE"				,"D"										,"xui.AUTH_TYPE_DELETE"															,"");
	xui.enum.setEnum("AUTH_TYPE_OUTPUT"				,"O"										,"xui.AUTH_TYPE_OUTPUT"															,"");
	xui.enum.setEnum("AUTH_TYPE_ETC"				,"E"										,"xui.AUTH_TYPE_ETC"															,"");
	xui.enum.setEnum("AUTH_TYPE_ADMIN"				,"A"										,"xui.AUTH_TYPE_ADMIN"															,"");
	xui.enum.setEnum("AUTH_TYPE_NONE"				,"N"										,"xui.AUTH_TYPE_NONE"															,"");
	xui.enum.setEnum("TOOLBAR_LOAD_ERROR01"			,""											,"xui.TOOLBAR_LOAD_ERROR01"														,"");
	xui.enum.setEnum("TOOLBAR_LOAD_ERROR02"			,""											,"xui.TOOLBAR_LOAD_ERROR02"														,"");
	xui.enum.setEnum("GRID_ROWNUMBER"				,"ROWNUM"									,"xui.GRID_ROWNUMBER"															,"");
	xui.enum.setEnum("GRID_CHECKBOX"				,"CHECKBOX"									,"xui.GRID_CHECKBOX"															,"");
	xui.enum.setEnum("GRID_LOAD_ERROR01"			,""											,"xui.GRID_LOAD_ERROR01"														,"");
	xui.enum.setEnum("GRID_LOAD_ERROR02"			,""											,"xui.GRID_LOAD_ERROR02"														,"");
	xui.enum.setEnum("GRID_LOAD_ERROR03"			,""											,"xui.GRID_LOAD_ERROR03"														,"");
	xui.enum.setEnum("GRID_LOAD_ERROR04"			,""											,"xui.GRID_LOAD_ERROR04"														,"");
	xui.enum.setEnum("GRID_LOAD_ERROR05"			,""											,"xui.GRID_LOAD_ERROR05"														,"");
	xui.enum.setEnum("GRID_LOAD_ERROR06"			,""											,"xui.GRID_LOAD_ERROR06"														,"");
	xui.enum.setEnum("GRID_LOAD_ERROR07"			,""											,"xui.GRID_LOAD_ERROR07"														,"");
	xui.enum.setEnum("GRID_LOAD_ERROR08"			,""											,"xui.GRID_LOAD_ERROR08"														,"");
	xui.enum.setEnum("GRID_LOAD_ERROR09"			,""											,"xui.GRID_LOAD_ERROR09"														,"");
	xui.enum.setEnum("GRID_LOAD_ERROR10"			,""											,"xui.GRID_LOAD_ERROR10"														,"");
	xui.enum.setEnum("GRID_EXCEL_BIG_DATA"			,""											,"xui.GRID_EXCEL_BIG_DATA"													  	,"");
	xui.enum.setEnum("TREE_LOAD_ERROR01"			,""											,"xui.TREE_LOAD_ERROR01"														,"");
	xui.enum.setEnum("TREE_LOAD_ERROR02"			,""											,"xui.TREE_LOAD_ERROR02"														,"");
	xui.enum.setEnum("TREE_LOAD_ERROR03"			,""											,"xui.TREE_LOAD_ERROR03"														,"");
	xui.enum.setEnum("CHART_LOAD_ERROR01"			,""											,"xui.CHART_LOAD_ERROR01"								  		   				,"");
	xui.enum.setEnum("AUTOCOMPLETE_LOAD_ERROR01"	,""											,"xui.AUTOCOMPLETE_LOAD_ERROR01"												,"");
	xui.enum.setEnum("COUNT_DATA_SEARHED"			,""											,"xui.COUNT_DATA_SEARHED"								   		  				,"");
	xui.enum.setEnum("PAGE_OUT_OF_RANGE"			,""											,"xui.PAGE_OUT_OF_RANGE"														,"");
	xui.enum.setEnum("INVALID_PAGE_NUMBER"			,""											,"xui.INVALID_PAGE_NUMBER"														,"");
	xui.enum.setEnum("NO_DATA"						,""											,"xui.NO_DATA"																	,"");
	xui.enum.setEnum("TRANSACTION_INSERT"			,"I"										,"xui.TRANSACTION_INSERT"														,"");
	xui.enum.setEnum("TRANSACTION_UPDATE"			,"U"										,"xui.TRANSACTION_UPDATE"														,"");
	xui.enum.setEnum("TRANSACTION_DELETE"			,"D"										,"xui.TRANSACTION_DELETE"														,"");
	xui.enum.setEnum("TRANSACTION_NONE"				,"N"										,"xui.TRANSACTION_NONE"															,"");
	xui.enum.setEnum("ADD_CONFIRM"					,""											,"xui.ADD_CONFIRM"																,"");
	xui.enum.setEnum("MOD_CONFIRM"					,""											,"xui.MOD_CONFIRM"																,"");
	xui.enum.setEnum("SAVE_CONFIRM"					,""											,"xui.SAVE_CONFIRM"																,"");
	xui.enum.setEnum("DEL_CONFIRM"					,""											,"xui.DEL_CONFIRM"																,"");
	xui.enum.setEnum("DOWNLOAD_CONFIRM"				,""											,"xui.DOWNLOAD_CONFIRM"															,"");
	xui.enum.setEnum("ACTIVATE_CONFIRM"				,""											,"xui.ACTIVATE_CONFIRM"															,"");
	xui.enum.setEnum("DEACTIVATE_CONFIRM"			,""											,"xui.DEACTIVATE_CONFIRM"														,"");
	xui.enum.setEnum("REG_OK"						,"REG_OK"									,"xui.REG_OK"																	,"");
	xui.enum.setEnum("UPD_OK"						,"UPD_OK"									,"xui.UPD_OK"																	,"");
	xui.enum.setEnum("DEL_OK"						,"DEL_OK"									,"xui.DEL_OK"																	,"");
	xui.enum.setEnum("PROC_OK"						,"PROC_OK"									,"xui.PROC_OK"																	,"");
	xui.enum.setEnum("DETECT_ERROR"					,"DETECT_ERROR"								,"xui.DETECT_ERROR"																,"");
	xui.enum.setEnum("SELECT_OBJECT_NO_EXIST"		,""											,"xui.SELECT_OBJECT_NO_EXIST"													,"");
	xui.enum.setEnum("CHECK_OBJECT_NO_EXIST"		,""											,"xui.CHECK_OBJECT_NO_EXIST"													,"");
	xui.enum.setEnum("CHANGE_OBJECT_NO_EXIST"		,""											,"xui.CHANGE_OBJECT_NO_EXIST"													,"");
	xui.enum.setEnum("NOT_ALLOWED_EXTENSION"		,""											,"xui.NOT_ALLOWED_EXTENSION"													,"");
	xui.enum.setEnum("OVER_MAX_FILE_SIZE"			,""											,"xui.OVER_MAX_FILE_SIZE"														,"");
	xui.enum.setEnum("OVER_MAX_UPLOAD_SIZE"			,""											,"xui.OVER_MAX_UPLOAD_SIZE"														,"");
	xui.enum.setEnum("OVER_UPLOAD_SIZE_PER_FILE"	,""											,"xui.OVER_UPLOAD_SIZE_PER_FILE"												,"");
	xui.enum.setEnum("EXIST_FILE"					,""											,"xui.EXIST_FILE"																,"");
	xui.enum.setEnum("BIG_FILE_SIZE"				,""											,"xui.BIG_FILE_SIZE"															,"");
	xui.enum.setEnum("TAKE_SOME_TIME"				,""											,"xui.TAKE_SOME_TIME"															,"");
	xui.enum.setEnum("DISABLE_UPLOAD"				,""											,"xui.DISABLE_UPLOAD"															,"");
	xui.enum.setEnum("DUPLE_KEY_DATA_EXIST"			,""											,"xui.DUPLE_KEY_DATA_EXIST"														,"");
	xui.enum.setEnum("DUPLE_DEFINE_OBJECT"			,""											,"xui.DUPLE_DEFINE_OBJECT"														,"");
	xui.enum.setEnum("TARGET_NO_EXIST"				,""											,"xui.TARGET_NO_EXIST"															,"");
	xui.enum.setEnum("RESTORE_OK"					,""											,"xui.RESTORE_OK"																,"");
	xui.enum.setEnum("COPY_CONFIRM"					,""											,"xui.COPY_CONFIRM"																,"");
	xui.enum.setEnum("INIT_CONFIRM"					,""											,"xui.INIT_CONFIRM"																,"");
	xui.enum.setEnum("EXTENSION_CONFIRM"			,""											,"xui.EXTENSION_CONFIRM"														,"");
	xui.enum.setEnum("TEMP_SAVE_CONFIRM"			,""											,"xui.TEMP_SAVE_CONFIRM"														,"");
	xui.enum.setEnum("PROC_CONFIRM"					,""											,"xui.PROC_CONFIRM"																,"");
	xui.enum.setEnum("RMQ_ERROR01"					,""											,"xui.RMQ_ERROR01"																,"");
	xui.enum.setEnum("WRONG_ACCESS"					,""											,"xui.WRONG_ACCESS"																,"");
	xui.enum.setEnum("WRONG_ACCESS_LOG"				,"log"									    ,"xui.WRONG_ACCESS_LOG"																,"");

	xui.enum.setEnum("SUCCESS"						,""											,"xui.SUCCESS"																	,"");
	xui.enum.setEnum("SUCCESS_MSG"					,""											,"xui.SUCCESS_MSG"																,"");
	xui.enum.setEnum("ERROR"						,""											,"xui.ERROR"																	,"");
	xui.enum.setEnum("ERROR_MSG"					,""											,"xui.ERROR_MSG"																,"");
	xui.enum.setEnum("WARNING"						,""											,"xui.WARNING"																	,"");
	xui.enum.setEnum("WARNING_MSG"					,""											,"xui.WARNING_MSG"																,"");
	xui.enum.setEnum("ALERT"						,""											,"xui.ALERT"																	,"");
	xui.enum.setEnum("ALERT_MSG"					,""											,"xui.ALERT_MSG"																,"");
	xui.enum.setEnum("CONFIRM"						,""											,"xui.CONFIRM"																	,"");
	xui.enum.setEnum("CONFIRM_MSG"					,""											,"xui.CONFIRM_MSG"																,"");
	xui.enum.setEnum("PROMPT"						,""											,"xui.PROMPT"																	,"");
	xui.enum.setEnum("PROMPT_MSG"					,""											,"xui.PROMPT_MSG"																,"");
	xui.enum.setEnum("PROMPT_MSG"					,""											,"xui.PROMPT_MSG"																,"");
	xui.enum.setEnum("SECURITY_NO_COPY"				,""											,"xui.SECURITY_NO_COPY"															,"");
	xui.enum.setEnum("TREE_MENU_ALL_ASSIGNED"		,""											,"xui.TREE_MENU_ALL_ASSIGNED"													,"");
	xui.enum.setEnum("TREE_USER_NOT_ASSIGNED"		,""											,"xui.TREE_USER_NOT_ASSIGNED"													,"");
	xui.enum.setEnum("GRID_SELECTED_DATA"			,""											,"xui.GRID_SELECTED_DATA"														,"");
	xui.enum.setEnum("GRID_SELECTED_COMPANY_DATA"	,""											,"xui.GRID_SELECTED_COMPANY_DATA"												,"");
	xui.enum.setEnum("GRID_SELECTED_CODE_DATA"		,""											,"xui.GRID_SELECTED_CODE_DATA"													,"");
	xui.enum.setEnum("GRID_SELECTED_DETAIL_CODE_DATA",""										,"xui.GRID_SELECTED_DETAIL_CODE_DATA"											,"");
	xui.enum.setEnum("GRID_NO_DATA"					,""											,"xui.GRID_NO_DATA"																,"");
	xui.enum.setEnum("TREE_NO_DATA"					,""											,"xui.TREE_NO_DATA"																,"");
	xui.enum.setEnum("TREE_NO_DATA"					,""											,"xui.TREE_NO_DATA"																,"");
	xui.enum.setEnum("GRID_NO_EXCEL_DOWNLOAD"		,""											,"xui.GRID_NO_EXCEL_DOWNLOAD"													,"");
	xui.enum.setEnum("UPLOAD_SUCCESS"				,""											,"xui.UPLOAD_SUCCESS"															,"");

	xui.enum.setEnum("GRID_ERROR"					,""											,"xui.GRID_ERROR"																,"");
	xui.enum.setEnum("TREE_ERROR"					,""											,"xui.TREE_ERROR"																,"");
	xui.enum.setEnum("LOAD_ERROR"					,""											,"xui.LOAD_ERROR"																,"");

	xui.enum.setEnum("EXCEL_DOWNLOAD"				,""											,"xui.EXCEL_DOWNLOAD"															,"");
	xui.enum.setEnum("EXCEL_EXPORT"					,""											,"xui.EXCEL_EXPORT"																,"");
	xui.enum.setEnum("EXCEL_UPLOAD"					,""											,"xui.EXCEL_UPLOAD"																,"");
	xui.enum.setEnum("MENU_INFORMATION_SEARCH"		,""											,"xui.MENU_INFORMATION_SEARCH"													,"");
	xui.enum.setEnum("LOG_FILE_EXPLORER"			,""											,"xui.LOG_FILE_EXPLORER"														,"");
	xui.enum.setEnum("MENU_EXPLORER"				,""											,"xui.MENU_EXPLORER"															,"");
	xui.enum.setEnum("ICON_SEARCH"					,""											,"xui.ICON_SEARCH"																,"");
	xui.enum.setEnum("USER_INFORMATION_INQUIRY"		,""											,"xui.USER_INFORMATION_INQUIRY"													,"");
	xui.enum.setEnum("USER_INFORMATION"				,""											,"xui.USER_INFORMATION"															,"");
	xui.enum.setEnum("CUSTOMER_INFORMATION"			,""											,"xui.CUSTOMER_INFORMATION"														,"");
	xui.enum.setEnum("TEAM_INFORMATION"				,""											,"xui.TEAM_INFORMATION"															,"");
	xui.enum.setEnum("AUTHOR_INFORMATION"			,""											,"xui.AUTHOR_INFORMATION"														,"");
	xui.enum.setEnum("ORGANIZATION_INFORMATION_SEARCH" ,""										,"xui.ORGANIZATION_INFORMATION_SEARCH"											,"");

	xui.enum.setEnum("CANCEL_DELETE"				,""											,"xui.CANCEL_DELETE"															,"");
	xui.enum.setEnum("CUT_CANCEL"					,""											,"xui.CUT_CANCEL"																,"");
	xui.enum.setEnum("CUT"							,""											,"xui.CUT"																		,"");
	xui.enum.setEnum("CANCEL_EDIT"					,""											,"xui.CANCEL_EDIT"																,"");
	xui.enum.setEnum("CLOSE"						,""											,"xui.CLOSE"																	,"");
	xui.enum.setEnum("CLOSE_ALL"					,""											,"xui.CLOSE_ALL"																,"");
	xui.enum.setEnum("ADD_ROW"						,""											,"xui.ADD_ROW"																	,"");
	xui.enum.setEnum("DELETE_ROW"					,""											,"xui.DELETE_ROW"																,"");
	xui.enum.setEnum("COPY_CELL_CLIPBOARD"			,""											,"xui.COPY_CELL_CLIPBOARD"														,"");
	xui.enum.setEnum("COPY_ROW_CLIPBOARD"			,""											,"xui.COPY_ROW_CLIPBOARD"														,"");
	xui.enum.setEnum("PRINT_PREVIEW"				,""											,"xui.PRINT_PREVIEW"															,"");
	xui.enum.setEnum("REFRESH"						,""											,"xui.REFRESH"																	,"");
	xui.enum.setEnum("DEPT_TOP_NOT_CREATE"			,""											,"xui.DEPT_TOP_NOT_CREATE"														,"");
	xui.enum.setEnum("DEPT_TOP_NOT_DELETE"			,""											,"xui.DEPT_TOP_NOT_DELETE"														,"");

	xui.enum.setEnum("ADD"							,""											,"xui.ADD"																		,"");
	xui.enum.setEnum("ADD_CHILD"					,""											,"xui.ADD_CHILD"																,"");
	xui.enum.setEnum("DETAIL"						,""											,"xui.DETAIL"																	,"");
	xui.enum.setEnum("PASTE"						,""											,"xui.PASTE"																	,"");
	xui.enum.setEnum("ENTER_SEARCH_TERM"			,""											,"xui.ENTER_SEARCH_TERM"														,"");
	xui.enum.setEnum("COMPANY_INFORMATION_INQUIRY"	,""											,"xui.COMPANY_INFORMATION_INQUIRY"												,"");
	xui.enum.setEnum("SELECT"						,""											,"xui.SELECT"																	,"");
	xui.enum.setEnum("ATTACHMENT"					,""											,"xui.ATTACHMENT"																,"");
	xui.enum.setEnum("UPLOAD_LIMIT_MAXIMUM"			,""											,"xui.UPLOAD_LIMIT_MAXIMUM"														,"");
	xui.enum.setEnum("EXTENSION_RESTRICTIONS"		,""											,"xui.EXTENSION_RESTRICTIONS"													,"");
	xui.enum.setEnum("PER_FILE"						,""											,"xui.PER_FILE"																	,"");
	xui.enum.setEnum("ALL"							,""											,"xui.ALL"																		,"");
	xui.enum.setEnum("TOOLBAR_ERROR"				,""											,"xui.TOOLBAR_ERROR"															,"");
	xui.enum.setEnum("SERVERSIDE_SORT_FAILURE"		,""											,"xui.SERVERSIDE_SORT_FAILURE"													,"");
	xui.enum.setEnum("SHOW_MENU_RIGHT_CLICK"		,""											,"xui.SHOW_MENU_RIGHT_CLICK"													,"");
	xui.enum.setEnum("RECENT_VIEWS"					,""											,"xui.RECENT_VIEWS"																,"");
	xui.enum.setEnum("DOWNLOADFILE_ERROR"			,""											,"xui.DOWNLOADFILE_ERROR"														,"");
	xui.enum.setEnum("BUTTON"						,""											,"xui.BUTTON"																	,"");
	xui.enum.setEnum("PAGE_LOAD_FAILURE"			,""											,"xui.PAGE_LOAD_FAILURE"														,"");
	xui.enum.setEnum("SYNTAX_ERROR"					,""											,"xui.SYNTAX_ERROR"																,"");
	xui.enum.setEnum("MAIN_WELLCOME_USER"			,""											,"xui.MAIN_WELLCOME_USER"														,"");
	xui.enum.setEnum("BUTTON_DELETE"				,""											,"xui.BUTTON_DELETE"															,"");
	xui.enum.setEnum("BUTTON_NEW"					,""											,"xui.BUTTON_NEW"																,"");
	xui.enum.setEnum("BUTTON_SAVE"					,""											,"xui.BUTTON_SAVE"																,"");
	xui.enum.setEnum("BUTTON_CREATE"				,""											,"xui.BUTTON_CREATE"															,"");
	xui.enum.setEnum("BUTTON_UPDATE"				,""											,"xui.BUTTON_UPDATE"															,"");
	xui.enum.setEnum("BUTTON_CANCEL"				,""											,"xui.BUTTON_CANCEL"															,"");
	xui.enum.setEnum("BUTTON_CREATE_TA"				,""											,"xui.BUTTON_CREATE_TA"															,"");
	xui.enum.setEnum("BUTTON_EXCEL_DOWNLOAD"		,""											,"xui.BUTTON_EXCEL_DOWNLOAD"													,"");
	xui.enum.setEnum("BUTTON_EXCEL_UPLOAD"			,""											,"xui.BUTTON_EXCEL_UPLOAD"														,"");
	xui.enum.setEnum("BUTTON_CREATE_CUSTOMER_DATA"	,""											,"xui.BUTTON_CREATE_CUSTOMER_DATA"												,"");
	xui.enum.setEnum("BUTTON_REFRESH"				,""											,"xui.BUTTON_REFRESH"															,"");
	xui.enum.setEnum("BUTTON_SEARCH"				,""											,"xui.BUTTON_SEARCH"															,"");
	xui.enum.setEnum("BUTTON_CLEAR"					,""											,"xui.BUTTON_CLEAR"																,"");
	xui.enum.setEnum("BUTTON_PASSWORD_RESET"		,""											,"xui.BUTTON_PASSWORD_RESET"													,"");
	xui.enum.setEnum("BUTTON_UNLOCK"				,""											,"xui.BUTTON_UNLOCK"															,"");
	xui.enum.setEnum("BUTTON_FILE_SELECT"			,""											,"xui.BUTTON_FILE_SELECT"														,"");
	xui.enum.setEnum("BUTTON_EXCEL_TEMPLATE_DOWNLOAD",""										,"xui.BUTTON_EXCEL_TEMPLATE_DOWNLOAD"											,"");
	xui.enum.setEnum("BUTTON_AUTH_GROUP_MANAGEMENT"	,""											,"xui.BUTTON_AUTH_GROUP_MANAGEMENT"												,"");
	xui.enum.setEnum("BUTTON_MAINMENU_SET"			,""											,"xui.BUTTON_MAINMENU_SET"														,"");
	xui.enum.setEnum("BUTTON_EXCEL_DOWNLOAD_HISTROY",""											,"xui.BUTTON_EXCEL_DOWNLOAD_HISTROY"											,"");
	xui.enum.setEnum("BUTTON_MOVE_PAGE"				,""											,"xui.BUTTON_MOVE_PAGE"															,"");
	xui.enum.setEnum("BUTTON_LOGOUT"				,""											,"xui.BUTTON_LOGOUT"															,"");
	xui.enum.setEnum("BUTTON_USE_AT"				,""											,"xui.BUTTON_USE_AT"															,"");
	xui.enum.setEnum("BUTTON_USE"					,""											,"xui.BUTTON_USE"																,"");
	xui.enum.setEnum("BUTTON_NOT_USED"				,""											,"xui.BUTTON_NOT_USED"															,"");

	xui.enum.setEnum("BUTTON_PRINT"					,""											,"xui.BUTTON_PRINT"																,"");
	xui.enum.setEnum("BUTTON_PROCCESS"				,""											,"xui.BUTTON_PROCCESS"															,"");
	xui.enum.setEnum("BUTTON_APROVAL"				,""											,"xui.BUTTON_APROVAL"															,"");
	xui.enum.setEnum("BUTTON_APROVAL_REQ"			,""											,"xui.BUTTON_APROVAL_REQ"														,"");
	xui.enum.setEnum("BUTTON_REJECT"				,""											,"xui.BUTTON_REJECT"															,"");
	xui.enum.setEnum("BUTTON_LINK"					,""											,"xui.BUTTON_LINK"																,"");
	xui.enum.setEnum("RE_LOGIN_NOT_FOUND_SESSION"	,""											,"main010.RE_LOGIN_NOT_FOUND_SESSION"											,"");
	xui.enum.setEnum("CLOSE_PAGE"					,""											,"main010.CLOSE_PAGE"															,"");
	/* (2025.03) 팝업에 한해 session not Found 방지 (xui.ajax.getProperty 사용 시 sendRequest 무한재귀 발생하므로 ENUM에 정의함) */
	xui.enum.setEnum("POPUP_PAGE_PATH"				,""											,"/webapps/xs/vob/pop/"									                        ,"");

	// ai chat session 예외처리
//	xui.enum.setEnum("AI_CHAT_URL"				    ,""											,"/webapps/xs/aichat/"									,"");
	xui.enum.setEnum(""   							,""											,"xui.  "																		,"");

	/*application common formatter*/
	xui.format												= {};
	var formatList											= ["year","month","date","dateday","time","datetime","number","decimal","biz","corp","juri","ihid","phone","card","email","ip","post","car","filesize","account","numeric"];
	for(var i = 0; i < formatList.length; i++){
		xui.format[formatList[i]]							= xuic.__FORMAT[formatList[i]];
	}

	//LYH 201211229 신규 추가 디자인 모든 설정
	function _Chart(){
		this.chartList = [];
	};
	_Chart.prototype	= {
		addChart:function(chartObject){
			this.chartList.push(chartObject);
		},

		//차트객체 목록 전체 초기화
		removeAllChart:function(){
			if(this.chartList != null){
				for(const i in this.chartList){
					if(this.chartList[i]){
						this.chartList[i].dispose();
					}
					this.chartList[i]=null;
				}
				this.chartList = [];
			}
		},

		//차트객체 목록 직접 초기화 (ID 이용)
		removeChart:function(id){
			if(this.chartList != null){
				for(const i in this.chartList){
					if(this.chartList[i] && this.chartList[i].htmlContainer.id === id){
						this.chartList[i].dispose();
						this.chartList.splice(i,1); //배열에서 해당 인덱스 제거
						break;
					}
				}
			}
		},

		//차트 데이터가 없을 경우 디폴트 백그라운드 설정
		validChartData:function(elementId, data){
			//데이터 유무 체크
			if(xui.valid.isEmpty(data) || (xui.valid.isArray(data) && data.length == 0)){
				$("#" + elementId).addClass("xui-chart-nodata");
				$("#" + elementId).html("");
				return false;
			} else {
				$("#" + elementId).removeClass("xui-chart-area-bar");
				$("#" + elementId).removeClass("xui-chart-area-column");
				$("#" + elementId).removeClass("xui-chart-area-line");
				$("#" + elementId).removeClass("xui-chart-area-map");
				$("#" + elementId).removeClass("xui-chart-area-pie");
				$("#" + elementId).removeClass("xui-chart-area-word");
				$("#" + elementId).removeClass("xui-chart-area-word2");
				$("#" + elementId).removeClass("xui-chart-area-area");
				$("#" + elementId).removeClass("xui-chart-area-treemap");
				$("#" + elementId).removeClass("xui-chart-nodata");
				return true;
			}
		}
	}
	xui.chart	= new _Chart();
	_Chart		= null;



	//LYH 201211229 신규 추가 디자인 모든 설정
	function _Design(){
	};
	_Design.prototype	= {
		setSearchSpread : function(searchFormId){
			//검색영역 숨김옵션 필터 HTML 삽입
			var searchFormElement		= document.getElementById(searchFormId);
			var parentNode				= document.getElementById(searchFormId).parentElement;
			var filterHTMLString 		= "<div class='xui-filter-con'><div class='xui-btn-filter-con'><p class='btn-filter-close'></p></div></div>";
			var innerHtmlHelper 		= document.createElement('div');
			innerHtmlHelper.innerHTML	= filterHTMLString;
			parentNode.insertBefore(innerHtmlHelper.firstChild, searchFormElement);
			//searchFormId 기준 하단의 노드 탐색
			var firstNode = document.getElementById(searchFormId).parentElement.parentElement;

			// height 조정 대상 지정
			var searchForm 								= $("#" + searchFormId)[0];

			var changeBody 								= firstNode.nextSibling.nextElementSibling;

			// 검색폼 다음 노드가 테이블박스인 경우 그 다음 노드 탐색
			if(changeBody.querySelectorAll(".tablebox").length > 0){
				// 다음 차트, 혹은 컨텐츠가 있는 경우에만 넘어가고 아닌 경우에는 최초 노드를 지정
				if(changeBody.nextSibling.nextElementSibling){
					changeBody 							= changeBody.nextSibling.nextElementSibling;
				}
			}

			var searchFormHeight 						= searchForm.clientHeight;
			var changeBodyHeight 						= null;

			// form 태그 없는 경우 자바스크립트 예외 방지 조건문 추가
			if(changeBody.clientHeight){
				changeBodyHeight 						= changeBody.clientHeight;
			}

			changeBody.setAttribute("closeHeight", changeBodyHeight + searchFormHeight);
			changeBody.setAttribute("openHeight" , changeBodyHeight);

			var filterSuper 							= $(".xui-btn-filter-con");

			if(filterSuper.length !== 0){
				filterSuper.click(function(){
					var filterIcon 						= $(".xui-btn-filter-con > p");

					if(filterIcon.length !== 0){
						var className 					= $(filterIcon[0]).attr("class");
						var display,changeClassName;

						switch(className){
							case "btn-filter-close" : display = false, changeClassName = "btn-filter-open" ; break;
							case "btn-filter-open"  : display = true , changeClassName = "btn-filter-close"; break;
							default : break;
						}

						if(display){
							var shortBodyHeight 		= changeBody.getAttribute("openHeight");
							changeBody.style 			= "height: " + shortBodyHeight + "px !important;";
							searchForm.style.display 	= "block";
						}else{
							var longBodyHeight 			= changeBody.getAttribute("closeHeight");
							changeBody.style 			= "height: " + longBodyHeight + "px !important;";
							searchForm.style.display	= "none";
						}

						filterIcon.removeClass(className);
						filterIcon.addClass(changeClassName);

					}
				});
			}
		}
	}
	xui.design	= new _Design();
	_Design		= null;




	function _Dialog(){

	};
	_Dialog.prototype	= {
		/**
		 * Superseded function of window alert
		 * @param	{String}{required}		message			Message content data to show
		 * @param	{String}{required}		title			Message title
		 * @param	{function}{optional}	callback		Callback function when dialog close
		 * @param	{boolean}{optional}		skip			Skip showing message then call callback function
		 * @returns	{String}								Date format delimiter character
		 * @author	HyosungITX Corp.
		 */
		alert : function(message, title, callback, skip){
			if(!skip){
				this._showAlert(message, title, callback, "I");
			}else{
				callback.call("", true);
			}
		},
		/**
		 * Superseded function of window confirm
		 * @param	{String}{required}		message			Message content data to show
		 * @param	{String}{required}		title			Message title
		 * @param	{function}{optional}	callback		Callback function when dialog close
		 * @param	{boolean}{optional}		skip			Skip showing message then call callback function
		 * @returns	{String}								Date format delimiter character
		 * @author	HyosungITX Corp.
		 */
		confirm : function(message, title, callback, skip){
			if(!skip){
				this._showAlert(message, title, callback, "C");
			}else{
				callback.call("", true);
			}
		},
		/**
		 * Superseded function of window prompt
		 * @param	{String}{required}		message			Message content data to show
		 * @param	{String}{required}		title			Message title
		 * @param	{function}{optional}	callback		Callback function when dialog close
		 * @param	{String}{optional}		promptType		input control object type (only 'text', 'combo', 'radio')
		 * @param	{Object}{optional}		promptData		if promptType is combo or radio then their dataset(array)
		 * @param	{String}{optional}		promptClass		input control object additional class
		 * @param	{boolean}{optional}		skip			Skip showing message then call callback function
		 * @returns	{String}								Date format delimiter character
		 * @author	HyosungITX Corp.
		 */
		prompt : function(message, title, callback, promptType, promptData, promptClass, skip){
			if(!skip){
				this._showAlert(message, title, callback, "P", promptType, promptData, promptClass);
			}else{
				callback.call("", "");
			}
		},
		/**
		 * Superseded function of window alert
		 * @param	{String}{required}		message			Message content data to show
		 * @param	{String}{required}		title			Message title
		 * @param	{function}{optional}	callback		Callback function when dialog close
		 * @param	{boolean}{optional}		skip			Skip showing message then call callback function
		 * @returns	{String}								Date format delimiter character
		 * @author	HyosungITX Corp.
		 */
		error : function(message, title, callback, skip){
			if(!skip){
				this._showAlert(message, title, callback, "E");
			}else{
				callback.call("", true);
			}
		},
		/**
		 * Superseded function of window alert
		 * @param	{String}{required}		message			Message content data to show
		 * @param	{String}{required}		title			Message title
		 * @param	{function}{optional}	callback		Callback function when dialog close
		 * @param	{boolean}{optional}		skip			Skip showing message then call callback function
		 * @returns	{String}								Date format delimiter character
		 * @author	HyosungITX Corp.
		 */
		success : function(message, title, callback, skip){
			if(!skip){
				this._showAlert(message, title, callback, "S");
			}else{
				callback.call("", true);
			}
		},
		/**
		 * Superseded function of window alert
		 * @param	{String}{required}		message			Message content data to show
		 * @param	{String}{required}		title			Message title
		 * @param	{function}{optional}	callback		Callback function when dialog close
		 * @param	{boolean}{optional}		skip			Skip showing message then call callback function
		 * @returns	{String}								Date format delimiter character
		 * @author	HyosungITX Corp.
		 */
		warning : function(message, title, callback, skip){
			if(!skip){
				this._showAlert(message, title, callback, "W");
			}else if (skip === xui.enum.WRONG_ACCESS_LOG.getCode()){
//			    console.log("네트워크 연결 오류: 서버에 연결할 수 없습니다.");
			} else{
				callback.call("", true);
			}
		},
		/**
		 * Superseded function of window alert
		 * @param	{String}{required}		message			Message content data to show
		 * @param	{String}{optional}		title			Message title
		 * @param	{function}{optional}	callback		Callback function when dialog close
		 * @param	{String}{optional}		type			Message type (only 'I', 'C', 'P', 'E', 'S', 'W')
		 * @param	{String}{optional}		promptType		input control object type (only 'text', 'combo', 'radio')
		 * @param	{Object}{optional}		promptData		if promptType is combo or radio then their dataset(jsonArray : propertyKeySet = code, codeName)
		 * @param	{String}{optional}		promptClass		input control object additional class
		 * void
		 * @author	HyosungITX Corp.
		 */
		_showAlert : function(message, title, callback, type, promptType, promptData, promptClass){
			if(typeof(message) === "undefined"){
				message										= "undefined";
			}
			if(message === null){
				message										= "null";
			}
			var fnName										= "alert";
			var config										= {buttonsAlignment:"center"};
			var buttons										= [xuic.__i18n.getLabel("apply")];
			var customClass									= "xui-message-box ";
			var header										= "";
			if(typeof(title) === "function"){
				callback									= title;
				header										= "";
			} else {
				if(xui.valid.isEmpty(title)){
					switch(type){
						case "C"	:
							header = xui.enum.CONFIRM.getName();break;
						case "P"	:
							header = xui.enum.PROMPT.getName();break;
						case "S"	:
							header = xui.enum.SUCCESS.getName();break;
						case "E"	:
							header = xui.enum.ERROR.getName();break;
						case "W"	:
							header = xui.enum.WARNING.getName();break;
						case "I"	:
							header = xui.enum.ALERT.getName();break;
						default		:
							header = "";break;
					}
				} else {
					header = title;
				}
			}
			if(!xui.valid.isEmpty(header)){
				config.header								= header;
			}
			config.text										= xui.util.replace(message, "&lt;br/&gt;", "<br/>");
			switch(type){
				case "C"	:
					fnName									= "confirm";
					buttons.push(xuic.__i18n.getLabel("cancel"));
					customClass								+= "xui-confirm-box";
					break;
				case "P"	:
					fnName									= "confirm";
					buttons.push(xuic.__i18n.getLabel("cancel"));
					customClass								+= "xui-prompt-box";
					if(xui.valid.isEmpty(promptType)){
						promptType							= "text";
					}
					if(xui.valid.isEmpty(promptData)){
						promptData							= [];
					}
					if(xui.valid.isEmpty(promptClass)){
						promptClass							= "";
					}
					config["promptType"]					= promptType;
					config["promptData"]					= promptData;
					config["promptClass"]					= promptClass;
					break;
				case "S"	:
					customClass								+= "xui-success-box";
					break;
				case "E"	:
					customClass								+= "xui-error-box";
					break;
				case "W"	:
					customClass								+= "xui-warning-box";
					break;
				default		:
					customClass								+= "xui-alert-box";
					break;
			}
			config.css										= customClass;
			config.blockerCss								= "xui-dimmed";
			config.buttons									= buttons;
			config.afterShow								= function(obj){
				var motionIconContainer						= obj.firstElementChild;
				var animeData								= null;
				var params									= params = {container:motionIconContainer,renderer:"svg",loop:false,autoplay:true,};
				switch(type){
					case "C"	:
					case "P"	:
						params.animationData				= {"v":"5.6.5","fr":30,"ip":0,"op":30,"w":64,"h":64,"nm":"alert_question","ddd":0,"assets":[{"id":"comp_0","layers":[{"ddd":0,"ind":1,"ty":4,"nm":"ico","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[31.721,32,0],"ix":2},"a":{"a":0,"k":[11.721,18,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"hasMask":true,"masksProperties":[{"inv":false,"mode":"a","pt":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":10,"s":[{"i":[[0,0],[7.732,-4.527],[0,0],[0,0],[0,0]],"o":[[0,0],[-12.143,7.285],[0,0],[0,0],[0,0]],"v":[[-5.875,12.625],[-8.732,-9.348],[-13.435,17.19],[7.347,17.78],[7.606,13.313]],"c":true}]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":12,"s":[{"i":[[0,0],[7.732,-4.527],[0,0],[0,0],[0,0]],"o":[[0,0],[-12.143,7.285],[0,0],[0,0],[0,0]],"v":[[4.688,-3.813],[-8.732,-9.348],[-14.497,8.315],[7.347,17.78],[7.418,16.501]],"c":true}]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":14,"s":[{"i":[[0,0],[12.857,1.723],[0,0],[0,0],[0,0]],"o":[[0,0],[-22.081,1.035],[0,0],[0,0],[0,0]],"v":[[26.719,5.344],[9.768,-8.848],[-14.497,8.315],[7.347,17.78],[7.637,17.313]],"c":true}]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":18,"s":[{"i":[[0,0],[8.857,11.348],[0,0],[0,0],[0,0]],"o":[[0,0],[-24.206,-31.402],[0,0],[0,0],[0,0]],"v":[[30.125,33.25],[30.643,3.402],[-14.497,8.315],[7.347,17.78],[7.856,18.126]],"c":true}]},{"t":26,"s":[{"i":[[0,0],[8.857,11.348],[0,0],[0,0],[0,0]],"o":[[0,0],[-24.206,-31.402],[0,0],[0,0],[0,0]],"v":[[29.375,37.625],[30.643,3.402],[-14.497,8.315],[7.347,17.78],[7.186,37.281]],"c":true}]}],"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Mask 1"}],"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[14.668,36],[8.807,36],[8.807,30.14],[14.668,30.14]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,-6.597],[0,0],[0,5.894],[3.215,0],[0,-3.215],[0,0],[-6.463,0],[0,-6.463]],"o":[[0,0],[0,-9.511],[0,-3.215],[-3.215,0],[0,0],[0,-6.463],[6.463,0],[0,7.334]],"v":[[14.668,26.389],[8.807,26.389],[17.581,11.721],[11.721,5.86],[5.86,11.721],[0,11.721],[11.721,0],[23.442,11.721]],"c":true},"ix":2},"nm":"Path 2","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.364705882353,0.419607843137,0.941176470588,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"ico","np":4,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":30,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"bg","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":90,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[95,95,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0]],"o":[[0,0]],"v":[[63.816,-26.579]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.364705882353,0.419607843137,0.941176470588,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Shape 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[64,64],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":32,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"st","c":{"a":0,"k":[0.364705882353,0.419607843137,0.941176470588,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"op","nm":"Offset Paths 1","a":{"a":0,"k":-1,"ix":1},"lj":1,"ml":{"a":0,"k":4,"ix":3},"ix":3,"mn":"ADBE Vector Filter - Offset","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"bg Stroke","np":3,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[64,64],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":32,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"bg Fill","np":2,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":10,"s":[100]}],"ix":1},"e":{"a":0,"k":0,"ix":2},"o":{"a":0,"k":-180,"ix":3},"m":1,"ix":4,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":30,"st":0,"bm":0}]}],"layers":[{"ddd":0,"ind":1,"ty":0,"nm":"ico_alert_question","refId":"comp_0","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[32,32,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"w":64,"h":64,"ip":0,"op":30,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"Rectangle 1165","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[160.5,29.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[343,93],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":0,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"op","nm":"Offset Paths 1","a":{"a":0,"k":-0.5,"ix":1},"lj":1,"ml":{"a":0,"k":4,"ix":3},"ix":3,"mn":"ADBE Vector Filter - Offset","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Rectangle 1165 Stroke","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[343,93],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":0,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Rectangle 1165 Fill","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":30,"st":0,"bm":0}],"markers":[]};
						break;
					case "S"	:
						params.animationData				= {"v":"5.6.5","fr":30,"ip":0,"op":30,"w":64,"h":64,"nm":"alert_confirm","ddd":0,"assets":[{"id":"comp_0","layers":[{"ddd":0,"ind":1,"ty":4,"nm":"line","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":9,"s":[0]},{"t":10,"s":[100]}],"ix":11},"r":{"a":0,"k":-45,"ix":10},"p":{"a":0,"k":[33,25,0],"ix":2},"a":{"a":0,"k":[13,9,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.167,"y":0.167},"t":10,"s":[{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[0,0],[-0.011,0.068],[-0.008,0.007]],"c":false}]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.333,"y":0},"t":14,"s":[{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[0,0],[0,18],[-0.008,18.039]],"c":false}]},{"t":21,"s":[{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[0,0],[0,18],[26,17]],"c":false}]}],"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.364705882353,0.419607843137,0.941176470588,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":6,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Path 957","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":30,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"bg","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":90,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[95,95,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[64,64],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":32,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"st","c":{"a":0,"k":[0.364705882353,0.419607843137,0.941176470588,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"op","nm":"Offset Paths 1","a":{"a":0,"k":-1,"ix":1},"lj":1,"ml":{"a":0,"k":4,"ix":3},"ix":3,"mn":"ADBE Vector Filter - Offset","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"bg Stroke","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[64,64],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":32,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"bg Fill","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":10,"s":[100]}],"ix":1},"e":{"a":0,"k":0,"ix":2},"o":{"a":0,"k":-180,"ix":3},"m":1,"ix":3,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":30,"st":0,"bm":0}]}],"layers":[{"ddd":0,"ind":1,"ty":0,"nm":"ico_alert_confirm","refId":"comp_0","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[32,32,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"w":64,"h":64,"ip":0,"op":30,"st":0,"bm":0}],"markers":[]};
						break;
					case "E"	:
						params.animationData				= {"v":"5.6.5","fr":30,"ip":0,"op":30,"w":64,"h":64,"nm":"alert_err","ddd":0,"assets":[{"id":"comp_0","layers":[{"ddd":0,"ind":1,"ty":4,"nm":"ver line","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":11,"s":[0]},{"t":12,"s":[100]}],"ix":11},"r":{"a":0,"k":135,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[0,18,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":12,"s":[{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[0,35.886],[0,36]],"c":false}]},{"t":20,"s":[{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[0,0],[0,36]],"c":false}]}],"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.976470589638,0.266666680574,0.215686276555,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":7,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"ver line","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":30,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"ver line","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":17,"s":[0]},{"t":18,"s":[100]}],"ix":11},"r":{"a":0,"k":45,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[0,18,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":18,"s":[{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[0,0],[0,0.026]],"c":false}]},{"t":26,"s":[{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[0,0],[0,36]],"c":false}]}],"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.976470589638,0.266666680574,0.215686276555,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":7,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"ver line","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":30,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"bg","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":90,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[95,95,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[64,64],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":32,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"st","c":{"a":0,"k":[0.976470589638,0.266666680574,0.215686276555,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"op","nm":"Offset Paths 1","a":{"a":0,"k":-1,"ix":1},"lj":1,"ml":{"a":0,"k":4,"ix":3},"ix":3,"mn":"ADBE Vector Filter - Offset","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"bg Stroke","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[64,64],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":32,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"bg Fill","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":10,"s":[100]}],"ix":1},"e":{"a":0,"k":0,"ix":2},"o":{"a":0,"k":-180,"ix":3},"m":1,"ix":3,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":30,"st":0,"bm":0}]}],"layers":[{"ddd":0,"ind":1,"ty":0,"nm":"ico_alert_err","refId":"comp_0","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[32,32,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"w":64,"h":64,"ip":0,"op":30,"st":0,"bm":0}],"markers":[]};
						break;
					case "W"	:
						params.animationData				= {"v":"5.6.5","fr":30,"ip":0,"op":30,"w":64,"h":64,"nm":"alert_warning","ddd":0,"assets":[{"id":"comp_0","layers":[{"ddd":0,"ind":1,"ty":4,"nm":"line","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[32.5,26,0],"ix":2},"a":{"a":0,"k":[4.5,11.999,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"hasMask":true,"masksProperties":[{"inv":false,"mode":"a","pt":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":12,"s":[{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-1.188,-1.976],[-1.188,-0.416],[10,-0.419],[10,-1.979]],"c":true}]},{"t":20,"s":[{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-1.188,-1.976],[-1.188,24.646],[10,24.644],[10,-1.979]],"c":true}]}],"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Mask 1"}],"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0]],"o":[[0,0]],"v":[[-34.812,28.187]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.976470589638,0.266666680574,0.215686276555,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Shape 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[0,0],[1,23.997],[8,23.997],[9,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"op","nm":"Offset Paths 1","a":{"a":0,"k":-0.5,"ix":1},"lj":1,"ml":{"a":0,"k":4,"ix":3},"ix":3,"mn":"ADBE Vector Filter - Offset","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"line Stroke","np":3,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[0,0],[1,23.997],[8,23.997],[9,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.976470589638,0.266666680574,0.215686276555,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"line Fill","np":2,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":30,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"dot","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":21,"s":[0]},{"t":22,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[32.5,46.499,0],"ix":2},"a":{"a":0,"k":[4.5,4.5,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-2.484],[-2.484,0],[0,2.484],[2.484,0]],"o":[[0,2.484],[2.484,0],[0,-2.484],[-2.484,0]],"v":[[0,4.5],[4.5,9],[9,4.5],[4.5,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"op","nm":"Offset Paths 1","a":{"a":0,"k":-0.5,"ix":1},"lj":1,"ml":{"a":0,"k":4,"ix":3},"ix":3,"mn":"ADBE Vector Filter - Offset","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"dot Stroke","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-2.484],[-2.484,0],[0,2.484],[2.484,0]],"o":[[0,2.484],[2.484,0],[0,-2.484],[-2.484,0]],"v":[[0,4.5],[4.5,9],[9,4.5],[4.5,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.976470589638,0.266666680574,0.215686276555,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"dot Fill","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":30,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"bg","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":90,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[95,95,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[64,64],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":32,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"st","c":{"a":0,"k":[0.976470589638,0.266666680574,0.215686276555,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"op","nm":"Offset Paths 1","a":{"a":0,"k":-1,"ix":1},"lj":1,"ml":{"a":0,"k":4,"ix":3},"ix":3,"mn":"ADBE Vector Filter - Offset","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"bg Stroke","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[64,64],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":32,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"bg Fill","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":10,"s":[100]}],"ix":1},"e":{"a":0,"k":0,"ix":2},"o":{"a":0,"k":-180,"ix":3},"m":1,"ix":3,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":30,"st":0,"bm":0}]}],"layers":[{"ddd":0,"ind":1,"ty":0,"nm":"ico_alert_warning","refId":"comp_0","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[32,32,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"w":64,"h":64,"ip":0,"op":30,"st":0,"bm":0}],"markers":[]};
						break;
					default		:
						params.animationData				= {"v":"5.6.5","fr":30,"ip":0,"op":30,"w":64,"h":64,"nm":"alert_info","ddd":0,"assets":[{"id":"comp_0","layers":[{"ddd":0,"ind":1,"ty":4,"nm":"ico","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[32.5,32.5,0],"ix":2},"a":{"a":0,"k":[4.5,18.499,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"hasMask":true,"masksProperties":[{"inv":false,"mode":"a","pt":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":10,"s":[{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[0,-2.438],[0,-0.689],[9,-0.689],[9,-2.438]],"c":true}]},{"i":{"x":0.667,"y":1},"o":{"x":0.167,"y":0.167},"t":11,"s":[{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[0,-2.438],[0,9.811],[9,9.811],[9,-2.438]],"c":true}]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":15,"s":[{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[0,-2.438],[0,9.811],[9,9.811],[9,-2.438]],"c":true}]},{"t":26,"s":[{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[0,-2.438],[0,38.373],[9,38.373],[9,-2.438]],"c":true}]}],"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Mask 1"}],"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[1,36.998],[1,13.001],[8,13.001],[8,36.998]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,2.484],[-2.484,0],[0,-2.484],[2.484,0]],"o":[[0,-2.484],[2.484,0],[0,2.484],[-2.484,0]],"v":[[0,4.5],[4.5,0],[9,4.5],[4.5,9]],"c":true},"ix":2},"nm":"Path 2","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"op","nm":"Offset Paths 1","a":{"a":0,"k":-0.5,"ix":1},"lj":1,"ml":{"a":0,"k":4,"ix":3},"ix":4,"mn":"ADBE Vector Filter - Offset","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"ico Stroke","np":4,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[1,36.998],[1,13.001],[8,13.001],[8,36.998]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,2.484],[-2.484,0],[0,-2.484],[2.484,0]],"o":[[0,-2.484],[2.484,0],[0,2.484],[-2.484,0]],"v":[[0,4.5],[4.5,0],[9,4.5],[4.5,9]],"c":true},"ix":2},"nm":"Path 2","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.364705882353,0.419607843137,0.941176470588,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"ico Fill","np":3,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":30,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"bg","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":90,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[95,95,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[64,64],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":32,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"st","c":{"a":0,"k":[0.364705882353,0.419607843137,0.941176470588,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"op","nm":"Offset Paths 1","a":{"a":0,"k":-1,"ix":1},"lj":1,"ml":{"a":0,"k":4,"ix":3},"ix":3,"mn":"ADBE Vector Filter - Offset","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"bg Stroke","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[64,64],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":32,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"bg Fill","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":10,"s":[100]}],"ix":1},"e":{"a":0,"k":0,"ix":2},"o":{"a":0,"k":-180,"ix":3},"m":1,"ix":3,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":30,"st":0,"bm":0}]}],"layers":[{"ddd":0,"ind":1,"ty":0,"nm":"ico_alert_info","refId":"comp_0","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[32,32,0],"ix":2},"a":{"a":0,"k":[32,32,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"w":64,"h":64,"ip":0,"op":30,"st":0,"bm":0}],"markers":[]};
						break;
				}
				lottie.loadAnimation(params);
			};
			var messageDialog								= top.dhx[fnName](config).then(function(response){
				if(typeof(callback) === "function"){
					try{
						callback.call("", response);
					}catch(E){
						xui.dialog.error(E.stack, xui.enum.SYNTAX_ERROR.getName());
						console.log(E);
					}
				}
			});
		}
	};

	/*dialog message box feature api*/
	xui.dialog	= new _Dialog();
	_Dialog		= null;


	function _Com(){
		this.global_progress								= null;
		this.global_cover									= null;
		this.progress										= {};
		if(top.document === document){
			this._makeGloablProgress();
			this._makeGlobalCover();
		}else{
			this.global_progress							= top.xui.com.global_progress;
			this.global_cover								= top.xui.com.global_cover;
		}
		this.popup											= {};
		this.componentResource								= {
			"DHX"		: [
				"html/xs/core/xui/js/component/dhtmlx/suite/v5/core/dhtmlxcommon.js",
				"html/xs/core/xui/js/component/dhtmlx/suite/v5/core/dhtmlxcore.js",
				"html/xs/core/xui/js/component/dhtmlx/suite/v5/core/dhtmlxcontainer.js"
			],
			"GRID"		: [
				"html/xs/core/xui/js/component/dhtmlx/suite/v5/dhtmlxGrid/dhtmlxgrid.js"
			],
			"TREE"		: [
				"html/xs/core/xui/js/component/dhtmlx/suite/v5/dhtmlxTree/dhtmlxtree.js"
			],
			"PIVOT"		: [
				"html/xs/core/xui/js/component/dhtmlx/pivot/pivot.js"
			],
			"CHART"		: [
				"html/xs/core/xui/js/component/amChart/core.js",
				"html/xs/core/xui/js/component/amChart/maps.js",
				"html/xs/core/xui/js/component/amChart/charts.js",
				"html/xs/core/xui/js/component/amChart/plugins/annotation.js",
				"html/xs/core/xui/js/component/amChart/plugins/bullets.js",
				"html/xs/core/xui/js/component/amChart/plugins/forceDirected.js",
				"html/xs/core/xui/js/component/amChart/plugins/overlapBuster.js",
				"html/xs/core/xui/js/component/amChart/plugins/rangeSelector.js",
				"html/xs/core/xui/js/component/amChart/plugins/regression.js",
				"html/xs/core/xui/js/component/amChart/plugins/sliceGrouper.js",
				"html/xs/core/xui/js/component/amChart/plugins/sunburst.js",
				"html/xs/core/xui/js/component/amChart/plugins/timeline.js",
				"html/xs/core/xui/js/component/amChart/plugins/venn.js",
				"html/xs/core/xui/js/component/amChart/plugins/wordCloud.js",
				"html/xs/core/xui/js/component/amChart/themes/amcharts.js",
				"html/xs/core/xui/js/component/amChart/themes/amchartsdark.js",
				"html/xs/core/xui/js/component/amChart/themes/animated.js",
				"html/xs/core/xui/js/component/amChart/themes/dark.js",
				"html/xs/core/xui/js/component/amChart/themes/dataviz.js",
				"html/xs/core/xui/js/component/amChart/themes/frozen.js",
				"html/xs/core/xui/js/component/amChart/themes/kelly.js",
				"html/xs/core/xui/js/component/amChart/themes/material.js",
				"html/xs/core/xui/js/component/amChart/themes/microchart.js",
				"html/xs/core/xui/js/component/amChart/themes/moonrisekingdom.js",
				"html/xs/core/xui/js/component/amChart/themes/patterns.js",
				"html/xs/core/xui/js/component/amChart/themes/spiritedaway.js",
				"html/xs/core/xui/js/component/amChart/geodata/worldLow.js"
			],
			"AUDIO"		: [
				"html/xs/core/xui/js/opensources/howler/howler.js"
			],
			"HIGHLIGHT"	: [
				"html/xs/core/xui/js/opensources/rangy/rangy-core.js",
				"html/xs/core/xui/js/opensources/rangy/rangy-classapplier.js",
				"html/xs/core/xui/js/opensources/rangy/rangy-highlighter.js"
			]
		};
		this.defaultRequestPrefix	= "";
		this.setRequestPrefix();
		this.setLocale();
		this.setDateDelimiter();
		this.setCalendarWeekStartDay();
		this.setXSSRestoreTarget();
	};
	_Com.prototype	= {
		/**
		 *
		 */
		getAppServiceMode : function(){
			return top.xuic.__CONFIG.appServiceMode;
		},
		getAppMaxUploadSize : function(){
			return top.xuic.__APP_MAX_UPLOAD_SIZE;
		},
		getAppMaxUploadSizePerFile : function(){
			return top.xuic.__APP_MAX_UPLOAD_SIZE_PER_FILE;
		},
		/**
		 *
		 */
		getContextPath : function(){
			return xuic.__CONFIG.contextRoot;
		},
		/**
		 * Hyobee aichat v2·webbase 로그인 — VOB initClientPageLoad(VIEW_COM_CODE·AUTH_MENU) 생략 대상
		 */
		isHyobeeAichatStandalonePage : function(){
			var path = (document.location.pathname || "").toLowerCase();
			return path.indexOf("/webapps/xs/aichat/") >= 0
				|| path.indexOf("/webapps/xs/webbase/login/") >= 0;
		},
		isHyobeeLoginPage : function(){
			var path = (document.location.pathname || "").toLowerCase();
			return path.indexOf("/webapps/xs/webbase/login/") >= 0;
		},
		/**
		 * Scan all element from root to define default action
		 * @param	{DOMElement}{required}	rootElement		Root element to scan
		 * void
		 * @author	HyosungITX Corp.
		 */
		elementScan : function(root){
			if(xui.USE_JQUERY && root instanceof jQuery){
				root										= root[0];
			}
			var elementList									= xuic.__DOM.getElementsList(root);
			var element = null;
			var classList = null;
			var tagName = "";
			var controller = null;
			var child = null;
			for(var i in elementList){
				element										= elementList[i];
				if(!xui.valid.isEmpty(element.controller)){
					continue;
				}
				classList									= element.classList;
				tagName										= element.tagName;
				controller									= null;
				child										= null;
				switch(tagName){
					case "LABEL"	:
						child								= element.firstElementChild;
						if(classList.contains("xui-input-label")){
							controller						= new xuic.__INPUT_TEXT_CONTROLLER(child);
						}else if(classList.contains("xui-combo-label")){
							if(xui.valid.isEmpty(child.controller)){
								controller					= new xuic.__COMBO_CONTROLLER(child);
								controller.clearOption();
								if(classList.contains("xui-syscode")){
									controller.loadOption(xui.syscode.get(controller.config.groupCode));
								}else if(classList.contains("xui-gbiscode")){
									controller.loadOption(xui.code.getGbisCode(controller.config.groupCode));
								} else {
									controller.loadOption(xui.code.get(controller.config.groupCode));
								}
							}
						}else if(classList.contains("xui-checkbox-label")){
							controller						= new xuic.__CHECKBOX_CONTROLLER(child);
						}else if(classList.contains("xui-radio-label")){
							controller						= new xuic.__RADIO_CONTROLLER(child);
						}else if(classList.contains("xui-textarea-label")){
							controller						= new xuic.__TEXTAREA_CONTROLLER(child);
						}else if(classList.contains("xui-toggle-label")){
							controller						= new xuic.__TOGGLE_CONTROLLER(child);
						}
						break;
					case "BUTTON"	:
						controller							= new xuic.__BUTTON_CONTROLLER(element);
						controller.checkAuth(xui.extends.menu.fnAuth);
						break;
					case "INPUT"	:
						controller							= new xuic.__INPUT_ETC_CONTROLLER(element);
						break;
					default			:
						if(classList != null && classList.contains("xui-element")){
							controller						= new xuic.__DEFAULT_CONTROLLER(element);
						}
					break;
				}
			}
		},
		/**
		*  DOM 요소를 순회하며 다국어 처리
		*  @param	{DOMElement}{required}	rootElement		Root element to scan
		*/
		elementLabelScan : function(root){
			if(xui.USE_JQUERY && root instanceof jQuery){
				root										= root[0];
			}
			var elementList									= xuic.__DOM.getElementsList(root);
			var element	   = null;
			var mcText		= null;
			var mcTooltip	 = null;
			var mcPlaceholder = null;
			var mcHtml		= null;
			for(var i in elementList){
				element						= elementList[i];
				mcText					  = element.getAttribute("message-text");
				mcTooltip				   = element.getAttribute("message-tooltip");
				mcPlaceholder			   = element.getAttribute("message-placeholder");
				mcHtml					  = element.getAttribute("message-html");
				if(!xui.valid.isEmpty(mcText)){
					var textLabel = xui.message.get(mcText);
					element.innerText = textLabel;
				}
				if(!xui.valid.isEmpty(mcTooltip)){
					var textLabel = xui.message.get(mcTooltip);
					element.setAttribute("xui-tooltip-title", textLabel);
				}
				if(!xui.valid.isEmpty(mcPlaceholder)){
					var textLabel = xui.message.get(mcPlaceholder);
					element.placeholder = textLabel;
				}
				if(!xui.valid.isEmpty(mcHtml)){
					var textLabel = xui.message.get(mcHtml);
					element.innerHTML = xui.util.restoreXSS(textLabel);
				}
			}
		},
		/**
		 *
		 */
		showProgress : function(viewport, id){
			if(xui.valid.isEmpty(viewport)){
				if(!xui.valid.isEmpty(id)){
					viewport								= document.body;
				}else{
					id										= "xui_global_progress";
					viewport								= top.document.body;
				}
			}else{
				if(xui.USE_JQUERY && viewport instanceof jQuery){
					viewport								= viewport[0];
				}
				if(xui.valid.isString(viewport)){
					viewport								= xuic.__DOM.getElement(viewport);
				}
				if(xui.valid.isEmpty(id)){
					if(viewport === top.document.body){
						id									= "xui_global_progress";
					}else{
						id									= xui.util.generateRandomChar(20);
					}
				}
			}
			var progress									= null;
			if(id === "xui_global_progress"){
				if(!this.global_progress.progress.classList.contains("on")){
					if(!xui.valid.isEmpty(this.global_progress.viewport)){
						this.global_progress.viewport.appendChild(this.global_progress.progress);
						this.global_progress.progress.classList.add("on");
					}
				}
			}else{
				if(this.progress.hasOwnProperty(id)){
					progress								= this.progress[id];
				}else if(viewport.querySelector("#" + id) === null){
					this.progress[id]						= {};
					this.progress[id].progress				= document.createElement("div");
					this.progress[id].progress.id			= id;
					this.progress[id].progress.className	= "xui-progress";
					this.progress[id].progress.appendChild(document.createElement("progress"));
					this.progress[id].progress.firstChild.className		= "progress-circle";
					this.progress[id].viewport				= viewport;
					progress								= this.progress[id];
				}
				if(xui.valid.isElement(progress.progress)){
					progress.viewport.appendChild(progress.progress);
					progress.progress.classList.add("on");
				}
			}
		},
		hideProgress : function(id){
			if(xui.valid.isEmpty(id)){
				id											= "xui_global_progress";
			}
			if(id === "xui_global_progress"){
				if(xui.ajax._getRequestCount() === 0){
					this.global_progress.progress.classList.remove("on");
					try{
						this.global_progress.progress			= this.global_progress.viewport.removeChild(this.global_progress.progress);
					}catch(E){}
				}
			}else if(this.progress.hasOwnProperty(id) && xui.valid.isElement(this.progress[id].progress)){
				this.progress[id].progress.classList.remove("on");
				try{
					this.progress[id].progress				= this.progress[id].viewport.removeChild(this.progress[id].progress);
				}catch(E){}
			}
		},
		showModalCover : function(){
			if(!this.global_cover.cover.classList.contains("on")){
				this.global_cover.viewport.appendChild(this.global_cover.cover);
				this.global_cover.cover.classList.add("on");
			}
		},
		hideModalCover : function(){
			this.global_cover.cover.classList.remove("on");
			this.global_cover.cover							= this.global_cover.viewport.removeChild(this.global_cover.cover);
		},
		openWindow : function(url, name, width, height, resizable, modal, param, callback, fixMenukey){
			var menuKey = xui.extends.menu.getKey();
			if(url.substr(0,1) === "/"){url	= url.substr(1);}

			//고정 메뉴키 파라메터값이 존재할 경우에는 페이지의 메뉴키로 설정하지 않고 파라메터의 메뉴키로 치환한다.
			if(!xui.valid.isEmpty(fixMenukey)){menuKey = fixMenukey;}

			if(url.substr(0,4) !== "http" && url.substr(0,3) !== "www"){
				if(url.indexOf("menuKey=") < 0){
					if(url.indexOf("?") >= 0){
						url = (url + "&menuKey=" + menuKey + "&popupAt=Y");
					}else{
						url = (url + "?menuKey=" + menuKey + "&popupAt=Y");
					}
				}
				// (2025.03) key 파라미터를 url에 추가하여 백그라운드로 URL 페이지를 캡쳐하는 기능. = 부모창에서 팝을 호출하지 않는 케이스
				// 여러 팝업에서 pk 값을 공통적으로 사용하기 위해 명칭 "key"로 통일
				if(!xui.valid.isEmpty(param) && !xui.valid.isEmpty(param.getString("key"))){
					url += "&key=" + param.getString("key");
				}
				url = xui.com.getContextPath() + url;
			}
			if(xui.valid.isEmpty(param)){
				param										= new xui.json();
			}
			if(xui.valid.isEmpty(callback)){
				callback									= "";
			}
			if(xui.valid.isEmpty(width)){
				width										= 1280;
			}
			if(xui.valid.isEmpty(height)){
				height										= 960;
			}
			var intDualScreenLeft							= window.screenLeft		!= undefined ? window.screenLeft	: window.screenX;
			var intDualScreenTop							= window.screenTop		!= undefined ? window.screenTop		: window.screenY;
			var intFixedWidth								= window.innerWidth		? window.innerWidth					: document.documentElement.clientWidth	? document.documentElement.clientWidth	: screen.width;
			var intFixedHeight								= window.innerHeight	? window.innerHeight				: document.documentElement.clientHeight	? document.documentElement.clientHeight	: screen.height;
			var intSystemZoom								= intFixedWidth / window.screen.availWidth;
			var intLeft										= (intFixedWidth	- width)	/ 2 / intSystemZoom + intDualScreenLeft - 200;
			var intTop										= (intFixedHeight	- height)	/ 2 / intSystemZoom + intDualScreenTop;
			intLeft += 200;
			if(xui.util.getBrowserInfo("KIND") === "MSIE"){
				intTop	-= 83;
				width	-= 4;
				height	-= 1;
			}
			var option										= "location=no,directories=no,status=no,toolbar=no,menubar=no,resizable=" + (resizable ? "yes" : "no") + ",width=" + width + ",height=" + height + ",top=" + intTop + ",left=" + intLeft;
			if(xui.valid.isEmpty(name)){
				name										= xui.util.generateRandomChar();
			}
			top.xui.com.popup[name]							= {"popupWindow":(window.open(url, name, option)),"params":param,"callback":callback};
			if(modal){
				this.showModalCover();
				var _this									= this;
				top.xui.com.popup[name].popupWindow.addEventListener("beforeunload", function(evt){
					_this.hideModalCover();
				});
			}
			top.xui.com.popup[name].popupWindow.focus();
			return top.xui.com.popup[name].popupWindow;
		},
		getOpenedWindow : function(name){
			var objWindow									= null;
			if(top.xui.com.popup.hasOwnProperty(name)){
				objWindow									= top.xui.com.popup[name].popupWindow;
			}
			return objWindow;
		},
		getOpenerParameter : function(name){
			var param										= null;
			if(!xui.valid.isEmpty(name) && !xui.valid.isEmpty(opener)){
				if(opener.top.xui.com.popup.hasOwnProperty(name)){
					param									= opener.top.xui.com.popup[name].params;
				}
			}
			return param;
		},
		getOpenerCallback : function(name){
			var callback									= null;
			if(!xui.valid.isEmpty(name) && !xui.valid.isEmpty(opener)){
				if(opener.top.xui.com.popup.hasOwnProperty(name)){
					callback								= opener.top.xui.com.popup[name].callback;
				}
			}
			return callback;
		},
		closeWindow : function(name){
			top.xui.com.popup[name].popupWindow.close();
			delete top.xui.com.popup[name];
		},
		closeAllWindow : function(){
			var popupJson									= top.xui.com.popup;
			for(var name in popupJson){
				popupJson[name].popupWindow.close();
			}
		},
		resizeWindow : function(name, width, height){
			if(!xui.valid.isEmpty(name)){
				var popup									= null;
				var isExist									= false;
				if(top.xui.com.popup.hasOwnProperty(name)){
					popup									= top.xui.com.popup[name].popupWindow;
					isExist									= true;
				}else{
					popup									= window;
					while(!xui.valid.isEmpty(popup.opener)){
						popup								= popup.opener;
						if(popup.top.xui.com.popup.hasOwnProperty(name)){
							popup							= popup.top.xui.com.popup[name].popupWindow;
							isExist							= true;
							break;
						}
					}
				}
				if(isExist && !xui.valid.isEmpty(popup)){
					width									= width + 16;
					height									= height + 67;
					if(xui.util.getBrowserInfo("KIND") === "MSIE"){
						height								= height - 25;
					}
					popup.resizeTo(width, height);
				}
			}
		},

		/**
		 * Set default delimiter character of date format in application
		 * @param	{String}{required}		delimiter		Date format delimiter character
		 * void
		 * @author	HyosungITX Corp.
		 */
		setDateDelimiter : function(delimiter){
			xuic.__COM.setDateDelimiter(delimiter);
		},
		/**
		 *
		 */
		changeDateFormat : function(languageCode){
			xuic.__COM.changeDateFormat(languageCode);
		},
		/**
		 *
		 */
		setCalendarWeekStartDay : function(dayName){
			xuic.__COM.setCalendarWeekStartDay(dayName);
		},
		/**
		 * Get default delimiter character of date format in application
		 * @returns	{String}								Date format delimiter character
		 * @author	HyosungITX Corp.
		 */
		getDateDelimiter : function(){
			return xuic.__COM.getDateDelimiter();
		},
		/**
		 * Set default locale in application
		 * @param	{String}				Locale			variable name (ex. en,kr,...)
		 * void
		 * @author	HyosungITX Corp.
		 */
		setLocale : function(locale){
			xuic.__i18n.setDefaultLocale(locale);
		},
		/**
		 *
		 */
		setRequestPrefix : function(prefix){
			if(typeof(prefix) !== "undefined" && prefix != null && prefix !== ""){
				this.defaultRequestPrefix					= prefix;
			}else{
				if(opener != null){
					this.defaultRequestPrefix				= opener.top.xui.com.getRequestPrefix();
				}else if(top.document !== document){
					this.defaultRequestPrefix				= top.xui.com.getRequestPrefix();
				}
			}
			if(typeof(this.defaultRequestPrefix) === "undefined" || this.defaultRequestPrefix === ""){
				this.defaultRequestPrefix					= "/xs/core/api";
			}
		},
		/**
		 *
		 */
		getRequestPrefix : function(){
			return this.defaultRequestPrefix;
		},
		/**
		 *
		 */
		setXSSRestoreTarget : function(tagList){
			xuic.__COM.setXSSRestoreTarget(tagList);
		},
		/**
		 *
		 */
		_redirectErrorPage : function(errorCode, errorMsg, errorMsgSub){
			if(opener === null && top.document === document){
				this.closeAllWindow();
				var errorJson								= new xui.json();
				errorJson.setURL(this.getRequestPrefix() + "/redirectErrorPage.json");
				errorJson.setString("errorCode"		, errorCode		);
				errorJson.setString("errorMsg"		, errorMsg		);
				errorJson.setString("errorMsgSub"	, errorMsgSub	);
				errorJson.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
				errorJson.setCallBack(function(response, request){});
				var formData								= new xui._AjaxForm(errorJson);
				formData._setEncrypt();
				var form									= document.createElement("form");
				var input									= document.createElement("input");
				form.method									= "POST";
				form.action									= formData.url;
				form.target 								= "_self";
				form.style.height 							= "0px";
				form.style.display 							= "none";
				input.setAttribute("type", "text");
				input.setAttribute("name", "jsonData");
				form.appendChild(input);
				document.body.appendChild(form);
				input.value									= JSON.stringify(formData.request.getJson());
				form.submit();
			}else{
				if(opener !== null){
					opener.xui.com._redirectErrorPage(errorCode, errorMsg, errorMsgSub);
				}else{
					top.xui.com._redirectErrorPage(errorCode, errorMsg, errorMsgSub);
				}
			}
		},
		/**
		 * Common data caching, define default action about each elements and invoke init function of page
		 * private void
		 * @author	HyosungITX Corp.
		 */
		_initializeUI : function(){
			if(typeof(PageBeforeReady) === "function"){
				PageBeforeReady();
			}
			var _this										= this;
			xui._initiateTryCount							= 0;
			xui._globalInterval								= setInterval(function(){
				try{
					if(typeof(PageReady) === "function"){
						xui.L								= true;
						Promise.all([_this._loadGlobalServerData(),_this._loadPageResources()]).then(function(){
							/*menu page name setting*/
							if(!xui.valid.isEmpty(top.window[xui.enum.MAIN_PAGE_VARIABLE.getCode()])){
								top.window[xui.enum.MAIN_PAGE_VARIABLE.getCode()].setChildMenuTitle(xui.extends.menu.getKey(), window);
							}
							xui.com.elementScan(document.body);
							//언어별 Date포맷 적용은 나중에
							//xui.com.changeDateFormat(xui.message.getLanguage());
							xui.com.elementLabelScan(document.head);
							xui.com.elementLabelScan(document.body);
							try{
								PageReady();
							}catch(E){
								console.log(E);
								if(top.xuic.__CONFIG.appServiceMode === "REAL"){
									xui.dialog.error(xui.enum.LOAD_ERROR.getName(), xui.enum.PAGE_LOAD_FAILURE.getName());
								}else{
									xui.dialog.error(E.stack, xui.enum.PAGE_LOAD_FAILURE.getName());
								}
							}
						}, function(err){
							if(!xui.valid.isEmpty(err)){
								xui.dialog.error(err, xui.enum.PAGE_LOAD_FAILURE.getName());
								console.log(err);
							}
						});
					}
				}catch(E){
					console.log(E.stack);
				}finally{
					xui._initiateTryCount					= xui._initiateTryCount + 1;
					if(xui._initiateTryCount >= 100 || xui.L === true){
						clearInterval(xui._globalInterval);
						delete xui._globalInterval;
						delete xui.initiateTryCount;
					}
				}
			},100);
		},

		_loadGlobalServerData : function(){
			var _this										= this;
			return new Promise(function(resolve, reject){
				try{
					if(top.document === document && document.location.pathname !== _this.getContextPath()){
						if(xui.valid.isEmpty(window.opener) || xuic.__CONFIG.browserName === "MSIE"){
							var param						= new xui.json();
							if(xui.com.isHyobeeAichatStandalonePage()){
								param.setURL(xui.com.getRequestPrefix() + "/initAichatPageLoad.json");
								param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
								param.setCallBack(function(response, request){
									if(!response.getErrorFlag()){
										xui.message.load(response.getDataJsonArray("MESSAGE_DATA"));
										var sysCode = response.getDataJsonObject("SYS_CODE");
										if(sysCode){
											xui.syscode.load(sysCode);
										}
									}
									resolve(true);
								});
							}else{
								param.setURL(xui.com.getRequestPrefix() + "/initClientPageLoad.json");
								param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
								param.setSessionCheck(true);
								param.setCallBack(function(response, request){
									xui.com._setAppServiceMode(response.getString("SERVICE_MODE"));
									xui.com._setAppFileUploadConfiguration(parseInt(response.getString("MAX_UPLOAD_SIZE")), parseInt(response.getString("MAX_UPLOAD_SIZE_PER_FILE")));
									xui.dateutil._load(response.getDataJsonObject("PATTERN_DATE"));
									xui.code.load(response.getDataJsonObject("CMMN_CODE"));
									xui.syscode.load(response.getDataJsonObject("SYS_CODE"));
									xui.message.load(response.getDataJsonArray("MESSAGE_DATA"));
									xui.extends.menu.load(response);
									resolve(true);
								});
							}
							xui.ajax.callService(param);
						}else{
							xui.com._setAppServiceMode(opener.top.xuic.__CONFIG.appServiceMode);
							xui.com._setAppFileUploadConfiguration(opener.top.xuic.__APP_MAX_UPLOAD_SIZE, opener.top.xuic.__APP_MAX_UPLOAD_SIZE_PER_FILE);
							xui.dateutil._load();
							xui.code.code					= opener.top.xui.code.code;
							xui.syscode.code				= opener.top.xui.syscode.code;
							xui.message.message				= opener.top.xui.message.message;
							var authMenuData				= new xui.json();
							authMenuData.setDataJsonObject(opener.top.xui.extends.menu.authorizedMenu, 0, "AUTH_MENU_INFO");
							authMenuData.setDataJsonArray(opener.top.xui.extends.menu.authorizedMenuTree, "AUTH_MENU_TREE");
							xui.extends.menu.load(authMenuData);
							resolve(true);
						}
					}else{
						resolve(true);
					}
				}catch(E){
					reject(E);
				}
			});
		},

		_loadPageResources : function(){
			return new Promise(function(resolve, reject){
				try{
					if(!xui.valid.isEmpty(window.IMPORT)){
						var names							= IMPORT.split(",");
						var name							= "";
						var resource						= null;
						var resources						= [];
						var hasDhxCore						= false;
						var hasGrid							= names.indexOf("GRID") >= 0;
						var today						   = new Date();
						var strToday						= String(today.getFullYear())+String(today.getMonth()+1)+String(today.getDate());
						for(var i = 0; i < names.length; i++){
							name							= names[i].trim();
							if(xui.com.componentResource.hasOwnProperty(name)){
								if(name === "GRID" || name === "TREE"){
									hasDhxCore				= true;
								}
								resource					= xui.com.componentResource[name];
								for(var j = 0; j < resource.length; j++){
									resources.push(resource[j] + "?version=" + strToday);
								}
							}else if(name.substring(name.length-3) === ".js"){
								resources.push(name + "?version=" + strToday);
							}
						}
						if(resources.length > 0){
							if(hasDhxCore){
								resource					= xui.com.componentResource["DHX"];
								for(var j = resource.length - 1; j >= 0; j--){
									resources.unshift(resource[j]);
								}
							}
							xuic.__RESOURCE_LOADER.require(resources, function(){
								if(window.dhtmlx){
									dhtmlx.skin				= "material";
								}
								if(hasGrid){
									xui.com._loadGridGlobalObject();
									delete xui.com._loadGridGlobalObject;
								}
								resolve(true);
							});
						}else{
							resolve(true);
						}
					}else{
						resolve(true);
					}
				}catch(E){
					reject(E);
				}
			});
		},

		/**
		 * Set operation type of application
		 * @param	{String}{required}		serviceMode		Application service mode
		 * private void
		 * @author	HyosungITX Corp.
		 */
		_setAppServiceMode : function(serviceMode){
			if(!xui.valid.isEmpty(serviceMode)){
				serviceMode									= serviceMode.toUpperCase();
				var allowList								= ["LOCAL","DEV","REAL"];
				if(allowList.indexOf(serviceMode) >= 0){
					top.xuic.__CONFIG.appServiceMode				= serviceMode;
				}
			}
		},
		_setAppFileUploadConfiguration : function(maxSize, maxSizePerFile){
			if(!xui.valid.isEmpty(maxSize) && !xui.valid.isEmpty(maxSizePerFile) && xui.valid.isEmpty(top.xuic.__APP_MAX_UPLOAD_SIZE)){
				top.xuic.__APP_MAX_UPLOAD_SIZE				= maxSize;
				top.xuic.__APP_MAX_UPLOAD_SIZE_PER_FILE		= maxSizePerFile;
			}
		},
		_makeGloablProgress : function(){
			this.global_progress							= {};
			this.global_progress.progress					= document.createElement("div");
			this.global_progress.progress.id				= "xui_global_progress";
			this.global_progress.progress.className			= "xui-progress";
			this.global_progress.progress.appendChild(document.createElement("progress"));
			this.global_progress.progress.firstChild.className	= "progress-circle";
			this.global_progress.viewport					= top.document.body;
		},
		_makeGlobalCover : function(){
			this.global_cover								= {};
			this.global_cover.cover							= document.createElement("div");
			this.global_cover.cover.id						= "xui_global_cover";
			this.global_cover.cover.className				= "xui-cover";
			this.global_cover.viewport						= top.document.body;
		},
		_loadGridGlobalObject : function(){
			/*define grid cell controller*/
			window.eXcell_xuicell							= function(cell){this.cell = cell;};
			window.eXcell_xuicell_rownum					= function(cell){this.cell = cell;};
			window.eXcell_xuicell_checkbox					= function(cell){this.cell = cell;};
			window.eXcell_xuieditcell_text					= function(cell){this.cell = cell;};
			window.eXcell_xuieditcell_combo					= function(cell){this.cell = cell;};
			window.eXcell_xuieditcell_checkbox				= function(cell){this.cell = cell;};
			window.eXcell_xuieditcell_radio					= function(cell){this.cell = cell;};
			window.eXcell_xuieditcell_toggle				= function(cell){this.cell = cell;};
			window.eXcell_xuieditcell_button				= function(cell){this.cell = cell;};
			window.eXcell_xuieditcell_textarea				= function(cell){this.cell = cell;};
			window.eXcell_xuieditcell_iconbutton			= function(cell){this.cell = cell;};
			window.eXcell_xuicell_image						= function(cell){this.cell = cell;};
			window.eXcell_xuicell_chart						= function(cell){this.cell = cell;};
			window.eXcell_xuicell_summary					= function(cell){this.cell = cell;};
			window._xuigridSort								= function(_a, _b, order){
				var result									= 0;
				var orderby									= order === "asc" ? 1 : -1;
				if(!xui.valid.isEmpty(_a) && !xui.valid.isEmpty(_b)){
					_a										= _a.toString();
					_b										= _b.toString();
					_a = xui.util.replace(_a,":","");
					_a = xui.util.replace(_a,"-","");
					_a = xui.util.replace(_a,"/","");
					_a = xui.util.replace(_a,",","");
					_a = xui.util.replace(_a,"%","");
					_b = xui.util.replace(_b,":","");
					_b = xui.util.replace(_b,"-","");
					_b = xui.util.replace(_b,"/","");
					_b = xui.util.replace(_b,",","");
					_b = xui.util.replace(_b,"%","");
					if(_a.match(/(\d+)/g) !== null && _b.match(/(\d+)/g) !== null){
						result								= (Number((_a.match(/(\d+)/g) || [0])[0]) - Number((_b.match(/(\d+)/g) || [0])[0]));
					}
					result									= orderby * (result === 0 ? (_a < _b ? -1 : (_a > _b ? 1 : 0)) : result);
				}else{
					if(xui.valid.isEmpty(_a)){
						result								= 1;
					}else{
						result								= -1;
					}
				}
				return result;
			}
			eXcell_xuicell.prototype						= new eXcell;
			eXcell_xuicell_rownum.prototype					= new eXcell;
			eXcell_xuicell_checkbox.prototype				= new eXcell;
			eXcell_xuieditcell_text.prototype				= new eXcell;
			eXcell_xuieditcell_combo.prototype				= new eXcell;
			eXcell_xuieditcell_checkbox.prototype			= new eXcell;
			eXcell_xuieditcell_radio.prototype				= new eXcell;
			eXcell_xuieditcell_toggle.prototype				= new eXcell;
			eXcell_xuieditcell_button.prototype				= new eXcell;
			eXcell_xuieditcell_textarea.prototype			= new eXcell;
			eXcell_xuieditcell_iconbutton.prototype			= new eXcell;
			eXcell_xuicell_image.prototype					= new eXcell;
			eXcell_xuicell_chart.prototype					= new eXcell;
			eXcell_xuicell_summary.prototype				= new eXcell;

			/*define grid common cell api*/
			eXcell.prototype.checkValid = function(invalidClear, showMessage){
				var isValid									= true;
				if(this.isEditCell()){
					if(xui.valid.isEmpty(invalidClear)){
						invalidClear						= false;
					}
					if(xui.valid.isEmpty(showMessage)){
						showMessage							= false;
					}
					var row									= this.cell.parentNode;
					var grid								= row.grid;
					var gridController						= grid.element.gridController;
					if(!xui.valid.isEmpty(this.cell.config.controller) && typeof(this.cell.config.controller.checkValid) === "function"){
						isValid								= this.cell.config.controller.checkValid.call(this.cell.config.controller, invalidClear, showMessage);
						if(xui.valid.isEmpty(isValid)){
							isValid							= true;
						}
					}
					if(isValid && typeof(this.cell.config.validationFn) === "function"){
						isValid								= this.cell.config.validationFn.call(gridController, gridController.getRowIdx(row.idd), row.idd, gridController.getRowData(row.idd), this.cell._cellIndex, this.cell.config.id);
						if(xui.valid.isEmpty(isValid)){
							isValid							= true;
						}
					}
				}
				return isValid;
			};
			eXcell.prototype.getValue = function(){
				return this.cell.config.value;
			};
			eXcell.prototype.getOrigin = function(){
				return (typeof(this.cell.config.origin) !== "undefined" && this.cell.config.origin !== null) ? this.cell.config.origin : this.getValue();
			};
			eXcell.prototype.isDisabled = function(){
				return this.cell.config.disable;
			},
			eXcell.prototype.isVisible = function(){
				return this.cell.config.visible;
			},
			eXcell.prototype.isEditCell = function(){
				return this.cell.config.editCell;
			};
			eXcell.prototype.isNowEditing = function(){
				return (this.isEditCell() && this.cell.config.editing);
			};
			eXcell.prototype.editStart = function(){
				if(this.isEditCell() && !this.cell.config.always){
					this.cell.classList.add("active");
					this.cell.config.textElement.classList.add("xui-invisible");
					this.cell.config.controller.setVisible(true);
					this.cell.config.editing				= true;
				}
			};
			eXcell.prototype.editStop = function(){
				if(this.isEditCell() && !this.cell.config.always){
					this.cell.classList.remove("active");
					this.cell.config.controller.setVisible(false);
					this.cell.config.textElement.classList.remove("xui-invisible");
					this.cell.config.editing				= false;
				}
			};
			eXcell.prototype.focusEditCell = function(){
				var inputObject								= this.cell.querySelector("input");
				if(xui.valid.isEmpty(inputObject)){
					inputObject								= this.cell.querySelector("textarea");
				}
				if(!xui.valid.isEmpty(inputObject)){
					inputObject.scrollIntoView({block:"nearest"});
					inputObject.focus();
				}
			};
			eXcell.prototype.isCheckbox = function(){
				return this.cell.config.checkbox;
			};
			eXcell.prototype.isChecked = function(){
				return ((this.cell.config.checkbox || this.cell.config.radio) && this.cell.config.checked);
			};
			eXcell.prototype.convertValue = function(value){
				if(typeof(this.cell.config.convertFn) === "function"){
					var row									= this.cell.parentNode;
					var grid								= row.grid;
					var convertValue						= this.cell.config.convertFn.call(grid.element.gridController, grid.rowsBuffer.indexOf(row), row.idd, row._attrs, this.cell._cellIndex, this.cell.config.id);
					if(typeof(convertValue) !== "undefined" && convertValue !== null){
						value								= convertValue;
					}
				}
				return value;
			};
			eXcell.prototype.setCustomStyle = function(){
				if(typeof(this.cell.config.customStyleFn) === "function"){
					var row									= this.cell.parentNode;
					var grid								= row.grid;
					var styleObject							= this.cell.config.customStyleFn.call(grid.element.gridController, grid.rowsBuffer.indexOf(row), row.idd, row._attrs, this.cell._cellIndex, this.cell.config.id);
					if(xui.valid.isJson(styleObject)){
						for(var key in styleObject){
							this.cell.style.setProperty(key, styleObject[key]);
						}
					}
				}
			};
			eXcell.prototype.setCustomClass = function(){
				if(typeof(this.cell.config.customClassFn) === "function"){
					var row									= this.cell.parentNode;
					var grid								= row.grid;
					var className							= this.cell.config.customClassFn.call(grid.element.gridController, grid.rowsBuffer.indexOf(row), row.idd, row._attrs, this.cell._cellIndex, this.cell.config.id);
					if(!xui.valid.isEmpty(className)){
						className							= xui.util.replace(this.cell.className, " " + className, "") + " " + className;
						this.cell.className					= className;
					}
				}
			};
			eXcell.prototype.setEditVisible = function(){
				if(this.isEditCell() && typeof(this.cell.config.visibleFn) === "function"){
					var row									= this.cell.parentNode;
					var grid								= row.grid;
					var isVisible							= this.cell.config.visibleFn.call(grid.element.gridController, grid.rowsBuffer.indexOf(row), row.idd, row._attrs, this.cell._cellIndex, this.cell.config.id);
					if(xui.valid.isEmpty(isVisible)){
						isVisible							= true;
					}
					this.setVisible(isVisible);
				}
			};
			eXcell.prototype.setEditDisable = function(){
				if(this.isEditCell() && typeof(this.cell.config.disableFn) === "function"){
					var row									= this.cell.parentNode;
					var grid								= row.grid;
					var isDisable							= this.cell.config.disableFn.call(grid.element.gridController, grid.rowsBuffer.indexOf(row), row.idd, row._attrs, this.cell._cellIndex, this.cell.config.id);
					if(xui.valid.isEmpty(isDisable)){
						isDisable							= false;
					}
					this.setDisabled(isDisable);
				}
			};
			eXcell.prototype.setCellTooltip = function(){
				var config									= this.cell.config;
				var isCustomTooltip							= false;
				if(!config.escape){
					config.tooltip							= "";
					var firstElement						= this.cell.firstChild;
					if(xui.valid.isElement(firstElement)){
						if(firstElement.hasAttribute("xui-tooltip-title")){
							config.tooltip					= firstElement.getAttribute("xui-tooltip-title");
							config.value					= (firstElement.innerHTML).trim();
							if(!xui.valid.isEmpty(config.tooltip)){
								isCustomTooltip				= true;
								firstElement.removeAttribute("xui-tooltip-title");
							}
						}
					}
				}else{
					config.tooltip							= this.cell.innerHTML;
				}
				if(!xui.valid.isEmpty(config.tooltip)){
					this.cell.setAttribute("xui-tooltip-title", config.tooltip);
					if(isCustomTooltip){
						this.cell.classList.add("xui-tooltip-cell");
					}
				}
			};

			/*basic type*/
			eXcell_xuicell.prototype.setValue = function(value){
				this._loadConfig();
				if(xui.valid.isString(value)){
					value									= value.trim();
				}
				value										= this.convertValue(value);
				var config									= this.cell.config;
				if(!config.escape){
					value									= xui.util.restoreXSS(value);
				}
				config.value								= value;
				if(!xui.valid.isEmpty(config.format) && !xui.valid.isEmpty(xui.format[config.format])){
					value									= xui.format[config.format].getData(value);
				}
				this.cell.innerHTML							= value;
				this.setCellTooltip();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuicell.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: "default",
						value			: "",
						editCell		: false,
						disable			: false,
						visible			: true,
						checkbox		: false,
						escape			: !(!xui.valid.isEmpty(colModel.html) && colModel.html === true),
						format			: (!xui.valid.isEmpty(colModel.format)				? xui.util.replace(colModel.format, "xuiform_", "").toLowerCase()	: null	),
						statisticsType	: (!xui.valid.isEmpty(colModel.statisticsType)		? colModel.statisticsType											: null	),
						customClassFn	: (typeof(colModel.customClassFn)	=== "function"	? colModel.customClassFn											: null	),
						customStyleFn	: (typeof(colModel.customStyleFn)	=== "function"	? colModel.customStyleFn											: null	),
						convertFn		: (typeof(colModel.convertFn)		=== "function"	? colModel.convertFn												: null	)
					};
					if(!xui.valid.isEmpty(this.cell.config.statisticsType)){
						this.cell.classList.add("xuicell-statistics");
						this.cell.classList.add(this.cell.config.statisticsType.toLowerCase() + "Type");
					}
					this.cell.onmouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*row number type*/
			eXcell_xuicell_rownum.prototype.setValue = function(data){
				this._loadConfig();
				var rownum									= data;
				if(xui.valid.isEmpty(data)){
					var row									= this.cell.parentNode;
					var grid								= row.grid;
					var gridController						= grid.element.gridController;
					rownum									= grid.rowsBuffer.indexOf(row) + 1;
					if(rownum === 0){
						rownum								= data;
					}
					if(gridController.config.paging){
						var pageNumber						= gridController.getPage() - 1;
						if(pageNumber < 0){
							pageNumber						= 0;
						}
						var countPerPage					= gridController.getCountPerPage();
						rownum								+= (pageNumber * countPerPage);
					}
				}
				this.cell.config.value						= rownum;
				this.cell.config.origin						= rownum;
				this.cell.innerHTML							= rownum;
			};
			eXcell_xuicell_rownum.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					this.cell.config						= {
						id				: xui.enum.GRID_ROWNUMBER.getCode(),
						name			: xui.enum.GRID_ROWNUMBER.getName(),
						type			: "rownum",
						value			: "",
						editCell		: false,
						disable			: false,
						visible			: true,
						checkbox		: false
					};
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*checkbox type*/
			eXcell_xuicell_checkbox.prototype.setValue = function(value){
				this._loadConfig();
				if(!this.cell.config.render){
					this.cell.innerHTML						= '<label class="xui-checkbox-label"><input type="checkbox" class="" value="' + this.cell.config.checkValue + '"/><span></span></label>';
					this.cell.config.controller				= new xuic.__CHECKBOX_CONTROLLER(this.cell.firstChild.firstChild);
					this.cell.config.render					= true;
					this.cell.config.controller.element.addEventListener("click", function(e){
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						cell.config.value					= this.controller.getData();
						grid.callEvent("onCheck", [row.idd, cell._cellIndex, this.checked, e]);
					});
				}
				var check									= false;
				var disable									= false;
				if(typeof(value) !== "undefined" && value !== null){
					value									= value.toString();
					check									= (value === true || value === "1" || (value.length === 2 && value.substr(1) === "1") || value === this.cell.config.checkValue);
					disable									= (value.length === 2 && value.substr(0,1) === "1");
					this.cell.config.controller.setData(check);
					this.cell.config.controller.setDisabled(disable);
				}
				this.cell.config.checked					= check;
				this.cell.config.disable					= disable;
				this.cell.config.value						= (check ? this.cell.config.checkValue : this.cell.config.uncheckValue);
			};
			eXcell_xuicell_checkbox.prototype.setDisabled = function(value){
				if(!xui.valid.isEmpty(value)){
					value									= value.toString();
					if(value === "true"){
						value								= "1";
					}else if(value.length === 2){
						value								= value.substr(0,1);
					}
					value									= value + (this.isChecked() ? this.cell.config.checkValue : this.cell.config.uncheckValue);
					this.setValue(value);
					this.cell.config.disable				= !this.cell.config.controller.isEnable();
				}
			};
			eXcell_xuicell_checkbox.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					this.cell.config						= {
						id				: xui.enum.GRID_CHECKBOX.getCode(),
						name			: xui.enum.GRID_CHECKBOX.getName(),
						type			: "checkbox",
						value			: "0",
						checkValue		: "1",
						uncheckValue	: "0",
						render			: false,
						editCell		: false,
						disable			: false,
						visible			: true,
						checkbox		: true,
						checked			: false
					};
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*text edit type*/
			eXcell_xuieditcell_text.prototype.setValue = function(value){
				this._loadConfig();
				value										= this.convertValue(value);
				if(!this.cell.config.render){
					this.cell.innerHTML						= '<span class="xuicell-edit-text xui-invisible"></span><label class="xui-input-label"><input type="text" class="' + this.cell.config.format + " " + this.cell.config.editClass + ' xui-invisible"/></label>';
					this.cell.config.textElement			= this.cell.firstChild;
					this.cell.config.editElement			= this.cell.lastChild;
					this.cell.config.controller				= new xuic.__INPUT_TEXT_CONTROLLER(this.cell.lastChild.firstChild);
					if(this.cell.config.always){
						this.cell.config.controller.setVisible(true);
					}else{
						this.cell.config.textElement.classList.remove("xui-invisible");
					}
					this.cell.config.controller.element.addEventListener("keydown", function(e){
						var returnValue						= true;
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						var gridController					= grid.element.gridController;
						if(e.keyCode === xui.enum.TAB_EVENT.getCode()){
							var cell						= this.parentNode.parentNode;
							var row							= cell.parentNode;
							var grid						= row.grid;
							var prevCell					= (cell._cellIndex-1 >= 0								? grid.cells(row.idd, cell._cellIndex-1) 			: null);
							var nextCell					= (cell._cellIndex+1 < row.childNodes.length			? grid.cells(row.idd, cell._cellIndex+1) 			: null);
							var targetCell					= null;
							if(e.shiftKey){
								while(prevCell){
									if(prevCell.isEditCell()){
										targetCell			= prevCell;
										break;
									}
									prevCell				= (prevCell.cell._cellIndex-1 >= 0						? grid.cells(row.idd, prevCell.cell._cellIndex-1) 	: null);
								}
							}else{
								while(nextCell){
									if(nextCell.isEditCell()){
										targetCell			= nextCell;
										break;
									}
									nextCell				= (nextCell.cell._cellIndex+1 < row.childNodes.length	? grid.cells(row.idd, nextCell.cell._cellIndex+1) 	: null);
								}
							}
							if(!xui.valid.isEmpty(targetCell)){
								targetCell.cell.lastChild.firstChild.focus();
							}
							returnValue						= false;
						}else if(e.keyCode === xui.enum.ENTER_EVENT.getCode()){
							var cell						= this.parentNode.parentNode;
							var row							= cell.parentNode;
							var grid						= row.grid;
							var rowId						= row.idd;
							var rowIdx						= gridController.getRowIdx(rowId);
							var nextRowId					= gridController.getRowId(rowIdx + 1);
							var prevRowId					= gridController.getRowId(rowIdx - 1);
							var targetCell					= null;
							if(e.shiftKey){
								if(!xui.valid.isEmpty(prevRowId)){
									grid.showRow(prevRowId);
									targetCell				= row.previousElementSibling.childNodes[cell._cellIndex];
								}
							}else{
								if(!xui.valid.isEmpty(nextRowId)){
									grid.showRow(nextRowId);
									targetCell				= row.nextElementSibling.childNodes[cell._cellIndex];
								}
							}
							if(!xui.valid.isEmpty(targetCell)){
								targetCell.click();
								if(cell.config.always){
									targetCell.lastChild.firstChild.focus();
								}
							}
						}
						if(typeof(gridController.config.onKeydownEditCell) === "function"){
							var rtn							= gridController.config.onKeydownEditCell.call(gridController, e.keyCode, e.ctrlKey, e.shiftKey, e.altKey, gridController.getRowIdx(row.idd), row.idd, gridController.getRowData(row.idd), cell._cellIndex, cell.config.id, gridController.getCellData(row.idd, cell._cellIndex));
							if(!xui.valid.isEmpty(returnValue) && !rtn){
								returnValue					= rtn;
							}
						}
						if(!returnValue){
							e.preventDefault();
						}
						return returnValue;
					});
					this.cell.config.controller.element.addEventListener("keyup", function(e){
						var returnValue						= true;
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						var gridController					= grid.element.gridController;
						if(typeof(gridController.config.onKeyupEditCell) === "function"){
							var returnValue					= gridController.config.onKeyupEditCell.call(gridController, e.keyCode, e.ctrlKey, e.shiftKey, e.altKey, gridController.getRowIdx(row.idd), row.idd, gridController.getRowData(row.idd), cell._cellIndex, cell.config.id, gridController.getCellData(row.idd, cell._cellIndex));
							if(xui.valid.isEmpty(returnValue)){
								returnValue					= true;
							}
						}
						if(!returnValue){
							e.preventDefault();
						}
						return returnValue;
					});
					this.cell.config.controller.element.addEventListener("mousedown", function(e){
						e.cancelBubble						= true;
						this.parentNode.parentNode.click();
					});
					this.cell.config.controller.element.addEventListener("drag", function(e){
						e.cancelBubble						= true;
					});
					this.cell.config.controller.element.addEventListener("click", function(e){
						e.cancelBubble						= true;
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						var gridController					= grid.element.gridController;
						if(typeof(gridController.config.onClickEditCell) === "function"){
							gridController.config.onClickEditCell.call(this, gridController.getRowIdx(row.idd), row.idd, gridController.getRowData(row.idd), cell._cellIndex, cell.config.id, gridController.getCellData(row.idd, cell._cellIndex));
						}
					});
					this.cell.config.controller.element.onchange = function(e){
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						cell.config.value					= this.controller.getData(false);
						cell.config.textElement.textContent	= this.controller.getData(true);
						grid.element.gridController._afterEdit(row.idd, cell._cellIndex, e);
					};
					this.cell.config.origin					= value;
				}
				this.cell.config.value						= value;
				this.cell.config.controller.setData(value, this.cell.config.render);
				this.cell.config.render						= true;
				var textValue								= this.cell.config.controller.getData(true);
				//// LYH 20211221 Edit 모드일 경우 포맷이 값에 적용이 되지 않아 추가
				this.cell.config.controller.setData(textValue, this.cell.config.render);
				if(xui.valid.isEmpty(textValue)){textValue	= "";}
				//this.cell.config.textElement.innerHTML	= textValue;  // by ktk
				this.cell.config.textElement.textContent	= textValue;

				this.setEditDisable();
				this.setEditVisible();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuieditcell_text.prototype.setDisabled = function(disable){
				if(!xui.valid.isEmpty(disable)){
					this.cell.config.controller.setDisabled(disable);
					this.cell.config.disable				= disable;
				}
			};
			eXcell_xuieditcell_text.prototype.setVisible = function(visible){
				if(!xui.valid.isEmpty(visible)){
					this.cell.config.controller.setVisible(visible);
					this.cell.config.visible				= visible;
				}
			};
			eXcell_xuieditcell_text.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: colModel.edit.type,
						value			: "",
						origin			: "",
						render			: false,
						editCell		: true,
						disable			: false,
						visible			: true,
						checkbox		: false,
						always			: (gridConfig.editDiv					=== "C"),
						editing			: (gridConfig.editDiv					=== "C"),
						format			: (!xui.valid.isEmpty(colModel.format)					? colModel.format				: ""	),
						editClass		: (!xui.valid.isEmpty(colModel.edit.classes)			? colModel.edit.classes			: ""	),
						disableFn		: (typeof(colModel.edit.disableFn)		=== "function"	? colModel.edit.disableFn		: null	),
						visibleFn		: (typeof(colModel.edit.visibleFn)		=== "function"	? colModel.edit.visibleFn		: null	),
						validationFn	: (typeof(colModel.edit.validationFn)	=== "function"	? colModel.edit.validationFn	: null	),
						customClassFn	: (typeof(colModel.customClassFn)		=== "function"	? colModel.customClassFn		: null	),
						customStyleFn	: (typeof(colModel.customStyleFn)		=== "function"	? colModel.customStyleFn		: null	),
						convertFn		: (typeof(colModel.convertFn)			=== "function"	? colModel.convertFn			: null	)
					};
					if(gridConfig.rowHeight < 32){
						this.cell.config.editClass += " small";
					}
					this.cell.classList.add("xuicell-edit");
					this.cell.classList.add("text");
					if(this.cell.config.always){
						this.cell.classList.add("active");
					}
					if(gridConfig.rowDragMove){
						grid.dragger.removeDraggableItem(this.cell);
					}
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};
			/*combo edit type*/
			eXcell_xuieditcell_combo.prototype.setValue = function(value){
				this._loadConfig();
				value										= this.convertValue(value);
				if(!this.cell.config.render){
					this.cell.innerHTML						= '<span class="xuicell-edit-text xui-invisible"></span><label class="xui-combo-label"><input type="text" class="' + this.cell.config.editClass + ' xui-invisible" ' + (!xui.valid.isEmpty(this.cell.config.headText) ? this.cell.config.headText : "") + ' ' + (!xui.valid.isEmpty(this.cell.config.headValue) ? this.cell.config.headValue : "") + '/></label>';;
					this.cell.config.textElement			= this.cell.firstChild;
					this.cell.config.editElement			= this.cell.lastChild;
					this.cell.config.controller				= new xuic.__COMBO_CONTROLLER(this.cell.lastChild.firstChild);
					this.cell.config.controller.loadOption(this.cell.config.data);
					if(this.cell.config.always){
						this.cell.config.controller.setVisible(true);
					}else{
						this.cell.config.textElement.classList.remove("xui-invisible");
					}
					this.cell.config.controller.element.addEventListener("mousedown", function(e){
						var row								= this.parentNode.parentNode.parentNode;
						var grid							= row.grid;
						grid.element.gridController.select(row.idd, false, false);
					});
					this.cell.config.controller.element.addEventListener("click", function(e){
						e.cancelBubble						= true;
					});
					this.cell.config.controller.element.addEventListener("keydown", function(e){
						var returnValue						= true;
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						var gridController					= grid.element.gridController;
						if(e.keyCode === xui.enum.TAB_EVENT.getCode()){
							var cell						= this.parentNode.parentNode;
							var row							= cell.parentNode;
							var grid						= row.grid;
							var prevCell					= (cell._cellIndex-1 >= 0								? grid.cells(row.idd, cell._cellIndex-1) 			: null);
							var nextCell					= (cell._cellIndex+1 < row.childNodes.length			? grid.cells(row.idd, cell._cellIndex+1) 			: null);
							var targetCell					= null;
							if(e.shiftKey){
								while(prevCell){
									if(prevCell.isEditCell()){
										targetCell			= prevCell;
										break;
									}
									prevCell				= (prevCell.cell._cellIndex-1 >= 0						? grid.cells(row.idd, prevCell.cell._cellIndex-1) 	: null);
								}
							}else{
								while(nextCell){
									if(nextCell.isEditCell()){
										targetCell			= nextCell;
										break;
									}
									nextCell				= (nextCell.cell._cellIndex+1 < row.childNodes.length	? grid.cells(row.idd, nextCell.cell._cellIndex+1) 	: null);
								}
							}
							if(!xui.valid.isEmpty(targetCell)){
								targetCell.cell.lastChild.firstChild.focus();
							}
							returnValue						= false;
						}else if(e.keyCode === xui.enum.ENTER_EVENT.getCode()){
							var cell						= this.parentNode.parentNode;
							var row							= cell.parentNode;
							var grid						= row.grid;
							var rowId						= row.idd;
							var rowIdx						= gridController.getRowIdx(rowId);
							var nextRowId					= gridController.getRowId(rowIdx + 1);
							var prevRowId					= gridController.getRowId(rowIdx - 1);
							var targetCell					= null;
							if(e.shiftKey){
								if(!xui.valid.isEmpty(prevRowId)){
									grid.showRow(prevRowId);
									targetCell				= row.previousElementSibling.childNodes[cell._cellIndex];
								}
							}else{
								if(!xui.valid.isEmpty(nextRowId)){
									grid.showRow(nextRowId);
									targetCell				= row.nextElementSibling.childNodes[cell._cellIndex];
								}
							}
							if(!xui.valid.isEmpty(targetCell)){
								targetCell.click();
								if(cell.config.always){
									targetCell.lastChild.firstChild.focus();
								}
							}
						}
						if(typeof(gridController.config.onKeydownEditCell) === "function"){
							var rtn							= gridController.config.onKeydownEditCell.call(gridController, e.keyCode, e.ctrlKey, e.shiftKey, e.altKey, gridController.getRowIdx(row.idd), row.idd, gridController.getRowData(row.idd), cell._cellIndex, cell.config.id, gridController.getCellData(row.idd, cell._cellIndex));
							if(!xui.valid.isEmpty(returnValue) && !rtn){
								returnValue					= rtn;
							}
						}
						if(!returnValue){
							e.preventDefault();
						}
						return returnValue;
					});
					this.cell.config.controller.element.onchange = function(e){
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						cell.config.value					= this.controller.getData();
						cell.config.textElement.textContent	= this.controller.getTextData();
						grid.element.gridController._afterEdit(row.idd, cell._cellIndex, e);
					};
					this.cell.config.origin					= value;
				}
				this.cell.config.value						= value;
				this.cell.config.controller.setData(value, this.cell.config.render);
				this.cell.config.render						= true;
				this.cell.config.textElement.textContent	= this.cell.config.controller.getTextData();
				this.setEditDisable();
				this.setEditVisible();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuieditcell_combo.prototype.loadOption = function(data){
				this.cell.config.data						= data;
				this.cell.config.controller.loadOption(data);
			};
			eXcell_xuieditcell_combo.prototype.clearOption = function(){
				this.cell.config.controller.clearOption();
			};
			eXcell_xuieditcell_combo.prototype.setDisabled = function(disable){
				if(!xui.valid.isEmpty(disable)){
					this.cell.config.controller.setDisabled(disable);
					this.cell.config.disable				= disable;
				}
			};
			eXcell_xuieditcell_combo.prototype.setVisible = function(visible){
				if(!xui.valid.isEmpty(visible)){
					this.cell.config.controller.setVisible(visible);
					this.cell.config.visible				= visible;
				}
			};
			eXcell_xuieditcell_combo.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: colModel.edit.type,
						value			: "",
						origin			: "",
						render			: false,
						editCell		: true,
						disable			: false,
						visible			: true,
						checkbox		: false,
						always			: (gridConfig.editDiv					=== "C"),
						editing			: (gridConfig.editDiv					=== "C"),
						editClass		: (!xui.valid.isEmpty(colModel.edit.classes)			? colModel.edit.classes			: ""	),
						disableFn		: (typeof(colModel.edit.disableFn)		=== "function"	? colModel.edit.disableFn		: null	),
						visibleFn		: (typeof(colModel.edit.visibleFn)		=== "function"	? colModel.edit.visibleFn		: null	),
						validationFn	: (typeof(colModel.edit.validationFn)	=== "function"	? colModel.edit.validationFn	: null	),
						customClassFn	: (typeof(colModel.customClassFn)		=== "function"	? colModel.customClassFn		: null	),
						customStyleFn	: (typeof(colModel.customStyleFn)		=== "function"	? colModel.customStyleFn		: null	),
						convertFn		: (typeof(colModel.convertFn)			=== "function"	? colModel.convertFn			: null	),
						data			: (xui.valid.isArray(colModel.edit.data)				? colModel.edit.data			: []	),
						headText		: (!xui.valid.isEmpty(colModel.edit.headText)			? colModel.edit.headText		: ""	),
						headValue		: (!xui.valid.isEmpty(colModel.edit.headValue)			? colModel.edit.headValue		: ""	)
					};
					this.cell.classList.add("xuicell-edit");
					this.cell.classList.add("combo");
					if(this.cell.config.always){
						this.cell.classList.add("active");
					}
					if(gridConfig.rowDragMove){
						grid.dragger.removeDraggableItem(this.cell);
					}
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*checkbox edit type*/
			eXcell_xuieditcell_checkbox.prototype.setValue = function(value){
				this._loadConfig();
				value										= value.toString().trim();
				value										= this.convertValue(value);
				if(!this.cell.config.render){
					this.cell.innerHTML						= '<span class="xuicell-edit-text xui-invisible"></span><label class="xui-checkbox-label xui-invisible"><input type="checkbox" class="' + this.cell.config.editClass + '" value="' + this.cell.config.checkValue + '"/><span></span></label>';
					this.cell.config.textElement			= this.cell.firstChild;
					this.cell.config.editElement			= this.cell.lastChild;
					this.cell.config.controller				= new xuic.__CHECKBOX_CONTROLLER(this.cell.lastChild.firstChild);
					if(this.cell.config.always){
						this.cell.config.controller.setVisible(true);
					}else{
						this.cell.config.textElement.classList.remove("xui-invisible");
					}
					this.cell.config.controller.element.addEventListener("click", function(e){
						e.cancelBubble						= true;
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						grid.callEvent("onCheck", [row.idd, cell._cellIndex, this.checked, e]);
					});
					this.cell.config.controller.element.addEventListener("mousedown", function(e){
						e.cancelBubble						= true;
						this.parentNode.parentNode.click();
					});
					this.cell.config.controller.element.onchange = function(e){
						var value							= this.controller.getData();
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						cell.config.value					= value;
						cell.config.checked					= this.controller.isChecked();
						cell.config.textElement.textContent	= this.controller.getTextData();
						grid.element.gridController._afterEdit(row.idd, cell._cellIndex, e);
					};
				}
				var check									= false;
				var disable									= false;
				if(typeof(value) !== "undefined" && value !== null){
					value									= value.toString();
					check									= (value === true || value === "1" || (value.length === 2 && value.substr(1) === "1") || value === this.cell.config.checkValue);
					disable									= (value.length === 2 && value.substr(0,1) === "1");
					this.cell.config.controller.setData(check, this.cell.config.render);
					this.cell.config.controller.setDisabled(disable);
				}
				this.cell.config.render						= true;
				this.cell.config.textElement.textContent	= this.cell.config.controller.getTextData();
				this.cell.config.checked					= check;
				this.cell.config.disable					= disable;
				this.cell.config.value						= (check ? this.cell.config.checkValue : this.cell.config.uncheckValue);
				if(this.cell.config.origin === null){
					this.cell.config.origin					= (check ? this.cell.config.checkValue : this.cell.config.uncheckValue);
				}
				this.setEditDisable();
				this.setEditVisible();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuieditcell_checkbox.prototype.setDisabled = function(disable){
				if(!xui.valid.isEmpty(disable)){
					this.cell.config.controller.setDisabled(disable);
					this.cell.config.disable				= disable;
				}
			};
			eXcell_xuieditcell_checkbox.prototype.setVisible = function(visible){
				if(!xui.valid.isEmpty(visible)){
					this.cell.config.controller.setVisible(visible);
					this.cell.config.visible				= visible;
				}
			};
			eXcell_xuieditcell_checkbox.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: colModel.edit.type,
						value			: "",
						checkValue		: "1",
						uncheckValue	: "0",
						origin			: null,
						render			: false,
						editCell		: true,
						disable			: false,
						visible			: true,
						checkbox		: true,
						checked			: false,
						//LYH 20211224 R모드일 경우 C모드와 동일하게 처리하기 위해 추가
						always			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						editing			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						editClass		: (!xui.valid.isEmpty(colModel.edit.classes)			? colModel.edit.classes			: ""	),
						disableFn		: (typeof(colModel.edit.disableFn)		=== "function"	? colModel.edit.disableFn		: null	),
						visibleFn		: (typeof(colModel.edit.visibleFn)		=== "function"	? colModel.edit.visibleFn		: null	),
						validationFn	: (typeof(colModel.edit.validationFn)	=== "function"	? colModel.edit.validationFn	: null	),
						customClassFn	: (typeof(colModel.customClassFn)		=== "function"	? colModel.customClassFn		: null	),
						customStyleFn	: (typeof(colModel.customStyleFn)		=== "function"	? colModel.customStyleFn		: null	),
						convertFn		: (typeof(colModel.convertFn)			=== "function"	? colModel.convertFn			: null	)
					};
					this.cell.classList.add("xuicell-edit");
					if(this.cell.config.always){
						this.cell.classList.add("active");
					}
					if(gridConfig.rowDragMove){
						grid.dragger.removeDraggableItem(this.cell);
					}
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*radio edit type*/
			eXcell_xuieditcell_radio.prototype.setValue = function(value){
				this._loadConfig();
				value										= value.toString().trim();
				value										= this.convertValue(value);
				if(!this.cell.config.render){
					var innerHTML							= '<span class="xuicell-edit-text xui-invisible">' + value + '</span><div class="xuicell-edit-radiogroup">';
					var data								= this.cell.config.data;
					var inputId								= xui.util.replace((this.cell.parentNode.idd).replace(xuic.__REGEXP.getCmmnRegexp("ALL_NUMBER"), ""), "-", "") + "_" + this.cell.config.id;
					for(var i = 0; i < data.length; i++){
						innerHTML							+= '<label class="xui-radio-label"><input type="radio" name="' + inputId + '" class="' + this.cell.config.customClass + '" value="' + data[i].code + '"/><span>' + data[i].codeName + '</span></label>';
					}
					innerHTML								+= "</div>";
					this.cell.innerHTML						= innerHTML;
					xui.com.elementScan(this.cell.lastChild);
					this.cell.config.textElement			= this.cell.firstChild;
					this.cell.config.editElement			= this.cell.lastChild;
					this.cell.config.controller				= this.cell.lastChild.firstChild.firstChild.controller;
					this.cell.config.controller.setData(value);
					if(this.cell.config.always){
						this.cell.config.controller.setVisible(true);
					}else{
						this.cell.config.textElement.classList.remove("xui-invisible");
					}
					var inputElements						= this.cell.querySelectorAll("input[name=" + inputId + "]");
					for(var i = 0; i < inputElements.length; i++){
						inputElements[i].addEventListener("mousedown", function(e){
							var row							= this.parentNode.parentNode.parentNode;
							var grid						= row.grid;
							grid.element.gridController.select(row.idd, false, false);
						});
						inputElements[i].addEventListener("click", function(e){
							e.cancelBubble					= true;
						});
						inputElements[i].onchange = function(e){
							var value						= this.controller.getData();
							var cell						= this.parentNode.parentNode.parentNode;
							var row							= cell.parentNode;
							var grid						= row.grid;
							cell.config.value				= value;
							//cell.config.checked				= this.controller.isChecked();
							cell.config.checked				= this.controller.checked;
							cell.config.textElement.textContent	= this.controller.getTextData();
							grid.element.gridController._afterEdit(row.idd, cell._cellIndex, e);
						};
					}
					this.cell.config.origin					= value;
				}
				this.cell.config.controller.setData(value, this.cell.config.render);
				this.cell.config.render						= true;
				this.cell.config.value						= this.cell.config.controller.getData();
				this.cell.config.textElement.textContent	= this.cell.config.controller.getTextData();
				this.setEditDisable();
				this.setEditVisible();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuieditcell_radio.prototype.setDisabled = function(disable){
				if(!xui.valid.isEmpty(disable)){
					this.cell.config.controller.setDisabled(disable);
					this.cell.config.disable				= disable;
				}
			};
			eXcell_xuieditcell_radio.prototype.setVisible = function(visible){
				if(!xui.valid.isEmpty(visible)){
					this.cell.config.controller.setVisible(visible);
					this.cell.config.visible				= visible;
				}
			};
			eXcell_xuieditcell_radio.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: colModel.edit.type,
						value			: "",
						origin			: "",
						render			: false,
						editCell		: true,
						disable			: false,
						visible			: true,
						checkbox		: true,
						checked			: false,
						//LYH 20211224 R모드일 경우 C모드와 동일하게 처리하기 위해 추가
						always			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						editing			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						editClass		: (!xui.valid.isEmpty(colModel.edit.classes)			? colModel.edit.classes			: ""	),
						disableFn		: (typeof(colModel.edit.disableFn)		=== "function"	? colModel.edit.disableFn		: null	),
						visibleFn		: (typeof(colModel.edit.visibleFn)		=== "function"	? colModel.edit.visibleFn		: null	),
						validationFn	: (typeof(colModel.edit.validationFn)	=== "function"	? colModel.edit.validationFn	: null	),
						customClassFn	: (typeof(colModel.customClassFn)		=== "function"	? colModel.customClassFn		: null	),
						customStyleFn	: (typeof(colModel.customStyleFn)		=== "function"	? colModel.customStyleFn		: null	),
						convertFn		: (typeof(colModel.convertFn)			=== "function"	? colModel.convertFn			: null	),
						data			: (xui.valid.isArray(colModel.edit.data)				? colModel.edit.data			: []	)
					};
					this.cell.classList.add("xuicell-edit");
					if(this.cell.config.always){
						this.cell.classList.add("active");
					}
					if(gridConfig.rowDragMove){
						grid.dragger.removeDraggableItem(this.cell);
					}
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*toggle edit type*/
			eXcell_xuieditcell_toggle.prototype.setValue = function(value){
				this._loadConfig();
				value										= value.toString().trim();
				value										= this.convertValue(value);
				if(!this.cell.config.render){
					this.cell.innerHTML						= '<span class="xuicell-edit-text xui-invisible"></span><label class="xui-toggle-label xui-invisible"><input type="checkbox" class="' + this.cell.config.editClass + '" on="' + this.cell.config.checkValue + '" off="' + this.cell.config.uncheckValue + '"/><span></span></label>';
					this.cell.config.textElement			= this.cell.firstChild;
					this.cell.config.editElement			= this.cell.lastChild;
					this.cell.config.controller				= new xuic.__TOGGLE_CONTROLLER(this.cell.lastChild.firstChild);
					if(this.cell.config.always){
						this.cell.config.controller.setVisible(true);
					}else{
						this.cell.config.textElement.classList.remove("xui-invisible");
					}
					this.cell.config.controller.element.addEventListener("mousedown", function(e){
						e.cancelBubble						= true;
						this.parentNode.parentNode.click();
					});
					this.cell.config.controller.element.onchange = function(e){
						var value							= this.controller.getData();
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						cell.config.value					= value;
						cell.config.checked					= this.controller.isChecked();
						cell.config.textElement.textContent	= this.controller.getTextData();
						grid.element.gridController._afterEdit(row.idd, cell._cellIndex, e);
					};
				}
				var check									= false;
				var disable									= false;
				if(typeof(value) !== "undefined" && value !== null){
					value									= value.toString();
					check									= (value === true || value === "1" || (value.length === 2 && value.substr(1) === "1") || value === this.cell.config.checkValue);
					disable									= (value.length === 2 && value.substr(0,1) === "1");
					this.cell.config.controller.setData(check, this.cell.config.render);
					this.cell.config.controller.setDisabled(disable);
				}
				this.cell.config.render						= true;
				this.cell.config.textElement.textContent	= this.cell.config.controller.getTextData();
				this.cell.config.checked					= check;
				this.cell.config.disable					= disable;
				this.cell.config.value						= (check ? this.cell.config.checkValue : this.cell.config.uncheckValue);
				if(this.cell.config.origin === null){
					this.cell.config.origin					= (check ? this.cell.config.checkValue : this.cell.config.uncheckValue);
				}
				this.setEditDisable();
				this.setEditVisible();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuieditcell_toggle.prototype.setDisabled = function(disable){
				if(!xui.valid.isEmpty(disable)){
					this.cell.config.controller.setDisabled(disable);
					this.cell.config.disable				= disable;
				}
			};
			eXcell_xuieditcell_toggle.prototype.setVisible = function(visible){
				if(!xui.valid.isEmpty(visible)){
					this.cell.config.controller.setVisible(visible);
					this.cell.config.visible				= visible;
				}
			};
			eXcell_xuieditcell_toggle.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: colModel.edit.type,
						value			: "",
						checkValue		: "1",
						uncheckValue	: "0",
						origin			: null,
						render			: false,
						editCell		: true,
						disable			: false,
						visible			: true,
						checkbox		: true,
						checked			: false,
						//LYH 20211224 R모드일 경우 C모드와 동일하게 처리하기 위해 추가
						always			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						editing			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						editClass		: (!xui.valid.isEmpty(colModel.edit.classes)			? colModel.edit.classes			: ""	),
						disableFn		: (typeof(colModel.edit.disableFn)		=== "function"	? colModel.edit.disableFn		: null	),
						visibleFn		: (typeof(colModel.edit.visibleFn)		=== "function"	? colModel.edit.visibleFn		: null	),
						validationFn	: (typeof(colModel.edit.validationFn)	=== "function"	? colModel.edit.validationFn	: null	),
						customClassFn	: (typeof(colModel.customClassFn)		=== "function"	? colModel.customClassFn		: null	),
						customStyleFn	: (typeof(colModel.customStyleFn)		=== "function"	? colModel.customStyleFn		: null	),
						convertFn		: (typeof(colModel.convertFn)			=== "function"	? colModel.convertFn			: null	)
					};
					this.cell.classList.add("xuicell-edit");
					if(this.cell.config.always){
						this.cell.classList.add("active");
					}
					if(gridConfig.rowDragMove){
						grid.dragger.removeDraggableItem(this.cell);
					}
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*button edit type*/
			eXcell_xuieditcell_button.prototype.setValue = function(){
				this._loadConfig();
				if(!this.cell.config.render){
					var icon								= this.cell.config.icon;
					if(!xui.valid.isEmpty(icon)){
						icon								= '<i class="' + icon + '"></i>';
					}
					var text								= this.cell.config.text;
					var authType							= this.cell.config.authType;
					this.cell.innerHTML						= '<span class="xuicell-edit-text xui-invisible"></span><button class="xui-button contained ' + this.cell.config.editClass + ' xui-invisible" authType="' + authType + '">' + icon + text + '</button>';
					this.cell.config.textElement			= this.cell.firstChild;
					this.cell.config.editElement			= this.cell.lastChild;
					this.cell.config.controller				= new xuic.__BUTTON_CONTROLLER(this.cell.lastChild);
					this.cell.config.controller.checkAuth(xui.extends.menu.fnAuth);
					if(this.cell.config.always){
						this.cell.config.controller.setVisible(true);
					}else{
						this.cell.config.textElement.classList.remove("xui-invisible");
					}
					this.cell.lastChild.addEventListener("click", function(e){
						e.cancelBubble						= true;
						var cell							= this.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						var gridController					= grid.element.gridController;
						gridController.select(row.idd);
						if(typeof(gridController.config.onClickButton) === "function"){
							gridController.config.onClickButton.call(gridController, gridController.getRowIdx(row.idd), row.idd, gridController.getRowData(row.idd), cell._cellIndex, gridController.getCellId(cell._cellIndex), gridController.getCellData(row.idd, cell._cellIndex));
						}
					});
					this.cell.config.render					= true;
				}
				this.setEditDisable();
				this.setEditVisible();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuieditcell_button.prototype.setDisabled = function(disable){
				if(!xui.valid.isEmpty(disable)){
					this.cell.config.controller.setDisabled(disable);
					this.cell.config.disable				= disable;
				}
			};
			eXcell_xuieditcell_button.prototype.setVisible = function(visible){
				if(!xui.valid.isEmpty(visible)){
					this.cell.config.controller.setVisible(visible);
					this.cell.config.visible				= visible;
				}
			};
			eXcell_xuieditcell_button.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: colModel.edit.type,
						value			: "",
						render			: false,
						editCell		: true,
						disable			: false,
						visible			: true,
						checkbox		: false,
						//LYH 20211224 R모드일 경우 C모드와 동일하게 처리하기 위해 추가
						always			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						editing			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						icon			: (!xui.valid.isEmpty(colModel.edit.icon)				? colModel.edit.icon			: ""								),
						text			: (!xui.valid.isEmpty(colModel.edit.text)				? colModel.edit.text			: xui.enum.BUTTON.getName()								),
						authType		: (!xui.valid.isEmpty(colModel.edit.authType)			? colModel.edit.authType		: xui.enum.AUTH_TYPE_NONE.getCode()	),
						editClass		: (!xui.valid.isEmpty(colModel.edit.classes)			? colModel.edit.classes			: ""								),
						disableFn		: (typeof(colModel.edit.disableFn)		=== "function"	? colModel.edit.disableFn		: null								),
						visibleFn		: (typeof(colModel.edit.visibleFn)		=== "function"	? colModel.edit.visibleFn		: null								),
						validationFn	: (typeof(colModel.edit.validationFn)	=== "function"	? colModel.edit.validationFn	: null								),
						customClassFn	: (typeof(colModel.customClassFn)		=== "function"	? colModel.customClassFn		: null								),
						customStyleFn	: (typeof(colModel.customStyleFn)		=== "function"	? colModel.customStyleFn		: null								)
					};
					this.cell.classList.add("xuicell-edit");
					if(this.cell.config.always){
						this.cell.classList.add("active");
					}
					if(gridConfig.rowDragMove){
						grid.dragger.removeDraggableItem(this.cell);
					}
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*textarea edit type*/
			eXcell_xuieditcell_textarea.prototype.setValue = function(value){
				this._loadConfig();
				value										= this.convertValue(value);
				if(!this.cell.config.render){
					this.cell.innerHTML						= '<span class="xuicell-edit-text xui-invisible"></span><label class="xui-textarea-label xui-invisible"><textarea class="' + this.cell.config.editClass + '"></textarea></label>';
					this.cell.config.textElement			= this.cell.firstChild;
					this.cell.config.editElement			= this.cell.lastChild;
					this.cell.config.controller				= new xuic.__TEXTAREA_CONTROLLER(this.cell.lastChild.firstChild);
					if(this.cell.config.always){
						this.cell.config.controller.setVisible(true);
					}else{
						this.cell.config.textElement.classList.remove("xui-invisible");
					}
					this.cell.config.controller.element.addEventListener("keydown", function(e){
						var returnValue						= true;
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						var gridController					= grid.element.gridController;
						if(e.keyCode === xui.enum.TAB_EVENT.getCode()){
							var cell						= this.parentNode.parentNode;
							var row							= cell.parentNode;
							var grid						= row.grid;
							var prevCell					= (cell._cellIndex-1 >= 0								? grid.cells(row.idd, cell._cellIndex-1) 			: null);
							var nextCell					= (cell._cellIndex+1 < row.childNodes.length			? grid.cells(row.idd, cell._cellIndex+1) 			: null);
							var targetCell					= null;
							if(e.shiftKey){
								while(prevCell){
									if(prevCell.isEditCell()){
										targetCell			= prevCell;
										break;
									}
									prevCell				= (prevCell.cell._cellIndex-1 >= 0						? grid.cells(row.idd, prevCell.cell._cellIndex-1) 	: null);
								}
							}else{
								while(nextCell){
									if(nextCell.isEditCell()){
										targetCell			= nextCell;
										break;
									}
									nextCell				= (nextCell.cell._cellIndex+1 < row.childNodes.length	? grid.cells(row.idd, nextCell.cell._cellIndex+1) 	: null);
								}
							}
							if(!xui.valid.isEmpty(targetCell)){
								targetCell.cell.lastChild.firstChild.focus();
							}
							returnValue						= false;
						}else if(e.keyCode === xui.enum.ENTER_EVENT.getCode()){
							var cell						= this.parentNode.parentNode;
							var row							= cell.parentNode;
							var grid						= row.grid;
							var rowId						= row.idd;
							var rowIdx						= gridController.getRowIdx(rowId);
							var nextRowId					= gridController.getRowId(rowIdx + 1);
							var prevRowId					= gridController.getRowId(rowIdx - 1);
							var targetCell					= null;
							if(e.shiftKey){
								if(!xui.valid.isEmpty(prevRowId)){
									grid.showRow(prevRowId);
									targetCell				= row.previousElementSibling.childNodes[cell._cellIndex];
								}
							}else{
								if(e.altKey && !xui.valid.isEmpty(nextRowId)){
									grid.showRow(nextRowId);
									targetCell				= row.nextElementSibling.childNodes[cell._cellIndex];
								}
							}
							if(!xui.valid.isEmpty(targetCell)){
								targetCell.click();
								if(cell.config.always){
									targetCell.lastChild.firstChild.focus();
								}
							}
						}
						if(typeof(gridController.config.onKeydownEditCell) === "function"){
							var rtn							= gridController.config.onKeydownEditCell.call(gridController, e.keyCode, e.ctrlKey, e.shiftKey, e.altKey, gridController.getRowIdx(row.idd), row.idd, gridController.getRowData(row.idd), cell._cellIndex, cell.config.id, gridController.getCellData(row.idd, cell._cellIndex));
							if(!xui.valid.isEmpty(returnValue) && !rtn){
								returnValue					= rtn;
							}
						}
						if(!returnValue){
							e.preventDefault();
						}
						return returnValue;
					});
					this.cell.config.controller.element.addEventListener("keyup", function(e){
						var returnValue						= true;
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						var gridController					= grid.element.gridController;
						if(typeof(gridController.config.onKeyupEditCell) === "function"){
							var returnValue					= gridController.config.onKeyupEditCell.call(gridController, e.keyCode, e.ctrlKey, e.shiftKey, e.altKey, gridController.getRowIdx(row.idd), row.idd, gridController.getRowData(row.idd), cell._cellIndex, cell.config.id, gridController.getCellData(row.idd, cell._cellIndex));
							if(xui.valid.isEmpty(returnValue)){
								returnValue					= true;
							}
						}
						if(!returnValue){
							e.preventDefault();
						}
						return returnValue;
					});
					this.cell.config.controller.element.addEventListener("mousedown", function(e){
						e.cancelBubble						= true;
						this.parentNode.parentNode.click();
					});
					this.cell.config.controller.element.addEventListener("click", function(e){
						e.cancelBubble						= true;
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						var gridController					= grid.element.gridController;
						if(typeof(gridController.config.onClickEditCell) === "function"){
							gridController.config.onClickEditCell.call(this, gridController.getRowIdx(row.idd), row.idd, gridController.getRowData(row.idd), cell._cellIndex, cell.config.id, gridController.getCellData(row.idd, cell._cellIndex));
						}
					});
					this.cell.config.controller.element.onchange = function(e){
						var value							= this.controller.getData();
						var cell							= this.parentNode.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						cell.config.value					= value;
						cell.config.textElement.textContent	= value;
						grid.element.gridController._afterEdit(row.idd, cell._cellIndex, e);
					};
					this.cell.config.origin					= value;
				}
				this.cell.config.value						= value;
				this.cell.config.controller.setData(value, this.cell.config.render);
				this.cell.config.render						= true;
				this.cell.config.textElement.textContent	= this.cell.config.controller.getData();
				this.setEditDisable();
				this.setEditVisible();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuieditcell_textarea.prototype.setDisabled = function(disable){
				if(!xui.valid.isEmpty(disable)){
					this.cell.config.controller.setDisabled(disable);
					this.cell.config.disable				= disable;
				}
			};
			eXcell_xuieditcell_textarea.prototype.setVisible = function(visible){
				if(!xui.valid.isEmpty(visible)){
					this.cell.config.controller.setVisible(visible);
					this.cell.config.visible				= visible;
				}
			};
			eXcell_xuieditcell_textarea.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: colModel.edit.type,
						value			: "",
						origin			: "",
						render			: false,
						editCell		: true,
						disable			: false,
						visible			: true,
						checkbox		: false,
						//LYH 20211224 R모드일 경우 C모드와 동일하게 처리하기 위해 추가
						always			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						editing			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						editClass		: (!xui.valid.isEmpty(colModel.edit.classes)			? colModel.edit.classes			: ""	),
						disableFn		: (typeof(colModel.edit.disableFn)		=== "function"	? colModel.edit.disableFn		: null	),
						visibleFn		: (typeof(colModel.edit.visibleFn)		=== "function"	? colModel.edit.visibleFn		: null	),
						validationFn	: (typeof(colModel.edit.validationFn)	=== "function"	? colModel.edit.validationFn	: null	),
						customClassFn	: (typeof(colModel.customClassFn)		=== "function"	? colModel.customClassFn		: null	),
						customStyleFn	: (typeof(colModel.customStyleFn)		=== "function"	? colModel.customStyleFn		: null	),
						convertFn		: (typeof(colModel.convertFn)			=== "function"	? colModel.convertFn			: null	)
					};
					this.cell.classList.add("xuicell-edit");
					if(this.cell.config.always){
						this.cell.classList.add("active");
					}
					if(gridConfig.rowDragMove){
						grid.dragger.removeDraggableItem(this.cell);
					}
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*iconbutton edit type*/
			eXcell_xuieditcell_iconbutton.prototype.setValue = function(){
				this._loadConfig();
				if(!this.cell.config.render){
					this.cell.innerHTML						= '<span class="xuicell-edit-text xui-invisible"></span><button class="xui-icon-button ' + this.cell.config.editClass + ' xui-invisible" authType="' + this.cell.config.authType + '" style="color:' + this.cell.config.color + ';"></button>';
					this.cell.config.controller				= new xuic.__BUTTON_CONTROLLER(this.cell.lastChild);
					this.cell.config.controller.checkAuth(xui.extends.menu.fnAuth);
					this.cell.config.textElement			= this.cell.firstChild;
					this.cell.config.editElement			= this.cell.lastChild;
					if(this.cell.config.always){
						this.cell.config.controller.setVisible(true);
					}else{
						this.cell.config.textElement.classList.remove("xui-invisible");
					}
					this.cell.lastChild.addEventListener("click", function(e){
						e.cancelBubble						= true;
						var cell							= this.parentNode;
						var row								= cell.parentNode;
						var grid							= row.grid;
						var gridController					= grid.element.gridController;
						gridController.select(row.idd);
						if(typeof(gridController.config.onClickButton) === "function"){
							gridController.config.onClickButton.call(gridController, gridController.getRowIdx(row.idd), row.idd, gridController.getRowData(row.idd), cell._cellIndex, gridController.getCellId(cell._cellIndex), gridController.getCellData(row.idd, cell._cellIndex));
						}
					});
					this.cell.config.render					= true;
				}
				this.setEditDisable();
				this.setEditVisible();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuieditcell_iconbutton.prototype.setDisabled = function(disable){
				if(!xui.valid.isEmpty(disable)){
					if(disable){
						this.cell.config.editElement.classList.add("xui-disabled");
					}else{
						this.cell.config.editElement.classList.remove("xui-disabled");
					}
					this.cell.config.disable				= disable;
				}
			};
			eXcell_xuieditcell_iconbutton.prototype.setVisible = function(visible){
				if(!xui.valid.isEmpty(visible)){
					if(visible){
						this.cell.config.editElement.classList.remove("xui-invisible");
					}else{
						this.cell.config.editElement.classList.add("xui-invisible");
					}
					this.cell.config.visible				= visible;
				}
			};
			eXcell_xuieditcell_iconbutton.prototype.editStart = function(){
				if(!this.cell.config.always){
					this.cell.classList.add("active");
					this.cell.config.textElement.classList.add("xui-invisible");
					this.cell.config.editElement.classList.remove("xui-invisible");
					this.cell.config.editing				= true;
				}
			};
			eXcell_xuieditcell_iconbutton.prototype.editStop = function(){
				if(!this.cell.config.always){
					this.cell.classList.remove("active");
					this.cell.config.editElement.classList.add("xui-invisible");
					this.cell.config.textElement.classList.remove("xui-invisible");
					this.cell.config.editing				= false;
				}
			};
			eXcell_xuieditcell_iconbutton.prototype.checkValid = function(){
				return true;
			};
			eXcell_xuieditcell_iconbutton.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: colModel.edit.type,
						value			: "",
						render			: false,
						editCell		: true,
						disable			: false,
						visible			: true,
						checkbox		: false,
						//LYH 20211224 R모드일 경우 C모드와 동일하게 처리하기 위해 추가
						always			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						editing			: (gridConfig.editDiv					=== "C" || gridConfig.editDiv					=== "R" ),
						color			: (!xui.valid.isEmpty(colModel.edit.color)				? colModel.edit.color			: "rgba(0,0,0,0.6)"					),
						authType		: (!xui.valid.isEmpty(colModel.edit.authType)			? colModel.edit.authType		: xui.enum.AUTH_TYPE_NONE.getCode()	),
						editClass		: (!xui.valid.isEmpty(colModel.edit.classes)			? colModel.edit.classes			: ""								),
						disableFn		: (typeof(colModel.edit.disableFn)		=== "function"	? colModel.edit.disableFn		: null								),
						visibleFn		: (typeof(colModel.edit.visibleFn)		=== "function"	? colModel.edit.visibleFn		: null								),
						validationFn	: (typeof(colModel.edit.validationFn)	=== "function"	? colModel.edit.validationFn	: null								),
						customClassFn	: (typeof(colModel.customClassFn)		=== "function"	? colModel.customClassFn		: null								),
						customStyleFn	: (typeof(colModel.customStyleFn)		=== "function"	? colModel.customStyleFn		: null								)
					};
					this.cell.classList.add("xuicell-edit");
					if(this.cell.config.always){
						this.cell.classList.add("active");
					}
					if(gridConfig.rowDragMove){
						grid.dragger.removeDraggableItem(this.cell);
					}
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*image type*/
			eXcell_xuicell_image.prototype.setValue = function(value){
				this._loadConfig();
				value										= this.convertValue(value);
				if(!this.cell.config.render){
					this.cell.innerHTML						= '<div class="xuicell_image xui-invisible"><img src="' + this.cell.config.src + '" class="' + this.cell.config.editClass + '"/></div>';
					this.cell.config.imageContainer			= this.cell.firstChild;
					this.cell.config.render					= true;
				}
				if(!xui.valid.isEmpty(value)){
					this.cell.firstChild.classList.remove("xui-invisible");
				}else{
					this.cell.firstChild.classList.add("xui-invisible");
				}
				this.cell.firstChild.firstChild.setAttribute("src", value);
				this.setEditVisible();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuicell_image.prototype.setDisabled = function(disable){

			};
			eXcell_xuicell_image.prototype.setVisible = function(visible){
				if(!xui.valid.isEmpty(visible)){
					if(visible){
						this.cell.config.imageContainer.classList.remove("xui-invisible");
					}else{
						this.cell.config.imageContainer.classList.add("xui-invisible");
					}
					this.cell.config.visible				= visible;
				}
			};
			eXcell_xuicell_image.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: "image",
						value			: "",
						editCell		: false,
						disable			: false,
						visible			: true,
						checkbox		: false,
						src				: colModel.iamge.src,
						customClassFn	: (typeof(colModel.customClassFn)	=== "function"	? colModel.customClassFn	: null	),
						customStyleFn	: (typeof(colModel.customStyleFn)	=== "function"	? colModel.customStyleFn	: null	),
						convertFn		: (typeof(colModel.convertFn)		=== "function"	? colModel.convertFn		: null	)
					};
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*summary type*/
			eXcell_xuicell_summary.prototype.setValue = function(){
				this._loadConfig();
				var cell									= this.cell;
				var row										= cell.parentNode;
				var grid									= row.grid;
				var gridController							= grid.element.gridController;
				var idx										= gridController.config.plusIdx;
				var cellIndex								= cell._cellIndex;
				var objCell									= null;
				var value									= 0;
				var values									= 0;
				for(var i = cellIndex - 1; i >= idx; i--){
					objCell									= grid.cells(row.idd, i);
					if(objCell.cell.config.type !== "summary"){
						value								= objCell.getValue();
						if(!isNaN(value)){
							values							+= parseInt(value);
						}
					}else{
						break;
					}
				}
				cell.textContent							= values.toString();
				cell.config.value							= values.toString();
				this.setCustomStyle();
				this.setCustomClass();
			};
			eXcell_xuicell_summary.prototype.setDisabled = function(disable){

			};
			eXcell_xuicell_summary.prototype.setVisible = function(visible){
				if(!xui.valid.isEmpty(visible)){
					if(visible){
						this.cell.config.imageContainer.classList.remove("xui-invisible");
					}else{
						this.cell.config.imageContainer.classList.add("xui-invisible");
					}
					this.cell.config.visible				= visible;
				}
			};
			eXcell_xuicell_summary.prototype._loadConfig = function(){
				if(xui.valid.isEmpty(this.cell.config)){
					var grid								= this.cell.parentNode.grid;
					var gridController						= grid.element.gridController;
					var gridConfig							= gridController.config;
					var colModel							= gridConfig.colModel[this.cell._cellIndex - gridConfig.plusIdx];
					var colNames							= gridConfig.originColNames[gridConfig.originColNames.length-1][this.cell._cellIndex - gridConfig.plusIdx];
					this.cell.config						= {
						id				: colModel.name,
						name			: colNames,
						type			: "summary",
						value			: "",
						fromIdx			: gridController.getCellIdx(colModel.summary.from),
						toIdx			: gridController.getCellIdx(colModel.summary.to),
						summaryType		: (!xui.valid.isEmpty(colModel.summary.type)		? colModel.summary.type		: "SUM"	),
						editCell		: false,
						disable			: false,
						visible			: true,
						checkbox		: false,
						customClassFn	: (typeof(colModel.customClassFn)	=== "function"	? colModel.customClassFn	: null	),
						customStyleFn	: (typeof(colModel.customStyleFn)	=== "function"	? colModel.customStyleFn	: null	)
					};
					this.cell.mouseenter					= function(e){
						var evtTarget						= e.target;
						var targetController				= evtTarget.parentNode.grid.element.gridController;
						if(typeof(targetController.config.onMouseOver) === "function"){
							targetController.config.onMouseOver.call(targetController, evtTarget.parentNode.idd, evtTarget._cellIndex);
						}
					};
				}
			};

			/*define grid data parser*/
			dhtmlXGridObject.prototype._process_xtrmJson = function(xuidata){
				var gridController							= this.element.gridController;
				var gridConfig								= gridController.config;
				var data									= xuidata.DATA;
				var size									= data.length;
				var count									= gridController.getCount();
				var pageNumber								= gridController.getPage();
				var countPerPage							= gridController.getCountPerPage();
				var isPaging								= gridConfig.paging;
				var isAppend								= (gridConfig.scrollAppend && pageNumber);
				var rowId									= "";
				this._parsing								= true;
				for(var i = 0; i < size; i++){
					rowId									= xui.util.generateUUID();
					this.rowsBuffer[(count + i)]			= {
						idd			: rowId,
						data		: data[i],
						_parser		: this._process_xtrmJson_row,
						_locator	: this._get_js_data
					};
					this.rowsAr[rowId]						= data[i];
				}
				this.render_xtrmJson_dataset(count, count + size);
				this._parsing								= false;
			};
			dhtmlXGridObject.prototype.render_xtrmJson_dataset=function(s_rownum, e_rownum){
				var gridController							= this.element.gridController;
				var gridConfig								= gridController.config;
				if(this._srnd){
					e_rownum								= Math.min((this._get_view_size() + (this._srnd_pr || 0)), this.rowsBuffer.length)
				}
				s_rownum									= s_rownum || 0;
				e_rownum									= e_rownum || this.rowsBuffer.length;
				var row;
				for(var i = s_rownum; i < e_rownum; i++) {
					row										= this.render_row(i);
					if(!row.parentNode || !row.parentNode.tagName){
						this._insertRowAt(row, i);
						if(row._attrs.selected || row._attrs.select){
							this.selectRow(row, row._attrs.call ? true : false, true);
							row._attrs.selected				= row._attrs.select = null
						}
					}
				}
				this.setSizes();
			};
			dhtmlXGridObject.prototype._process_xtrmJson_row=function(row, data){
				var dataArray								= [];
				for(var i = 0; i < this.columnIds.length; i++){
					dataArray[i]							= data[this.columnIds[i]];
					if(!dataArray[i] && dataArray[i] !== 0){
						dataArray[i]						= ""
					}
				}
				row._attrs									= data;
				this._process_xtrmJson_some_row(row, dataArray);
				var rowDiv									= data["ROW_DIV"];
				if(rowDiv === "SUMMARY"){
					this.setRowAttribute(row.idd, "ROW_DIV", rowDiv);
					row._attrs["class"]						= "xuirow-statistics";

				}else{
					this.setRowAttribute(row.idd, "ROW_DIV", "NORMAL");
				}

				return row;
			};
			dhtmlXGridObject.prototype._process_xtrmJson_some_row = function(row, dataArray){
				for(var i = 0; i < row.childNodes.length; i++){
					row.childNodes[i]._attrs				= {}
				}
				this._fillRow_xtrmJson(row, dataArray);
				return row;
			};
			dhtmlXGridObject.prototype._fillRow_xtrmJson = function(row, dataArray){
				var gridController							= this.element.gridController;
				var gridConfig								= gridController.config;
				var size									= dataArray.length;
				var cell,cellIndex,value;
				for(var i = 0; i < row.childNodes.length; i++){
					if((i < size) || (this.defVal[i])){
						cellIndex							= row.childNodes[i]._cellIndex;
						value								= dataArray[i];
						cell								= this.cells4(row.childNodes[i]);
						if((this.defVal[cellIndex]) && xui.valid.isEmpty(value)){
							value							= this.defVal[cellIndex];
						}
						if(cell){
							cell.setValue(value);
						}
					}else{
						cell								= this.cells4(row.childNodes[i]);
						if(cell){
							cell.setValue("");
						}
						row.childNodes[i]._clearCell		= true;
					}
				}
				return row
			};
			dhtmlXGridObject.prototype._in_header_xui_text_filter = function(cell, idx){
				var customClass								= this.element.gridController.config.headerHeight < 32 ? "small" : "";
				cell.innerHTML								= "<label class='xui-input-label outlined'><input type='text' class='filter " + customClass + "'/><span></span></label>";
				var element									= cell.firstChild.firstChild;
				var controller								= new xuic.__INPUT_TEXT_CONTROLLER(element);
				var grid									= this;
				cell.onselectstart = function() {
					return (event.cancelBubble = true);
				};
				cell.onclick = cell.onmousedown = function(g) {
					(g || event).cancelBubble				= true;
					return true;
				};
				element.onkeydown = function(e){
					if(!xui.valid.isEmpty(this.controller._timer)){
						clearTimeout(this.controller._timer);
					}
					this.controller._timer = setTimeout(function(){
						grid.filterByCustomAll();
					}, 500);
				};
				if(!cell.parentNode.classList.contains("filter")){
					cell.parentNode.classList.add("filter");
				}
				if(!this.filters){
					this.filters							= [];
				}
				this.filters.push([element, idx]);
				this._filters_ready();
			};
			dhtmlXGridObject.prototype._in_header_xui_combo_filter = function(cell, idx) {
				var customClass								= this.element.gridController.config.headerHeight < 32 ? "small" : "";
				cell.innerHTML								= "<label class='xui-combo-label outlined'><input type='text' class='multi " + customClass + "'/></label>";
				var element									= cell.firstChild.firstChild;
				var controller								= new xuic.__COMBO_CONTROLLER(element);
				var grid									= this;
				cell.onselectstart = function() {
					return (event.cancelBubble = true);
				};
				cell.onclick = cell.onmousedown = function(g) {
					(g || event).cancelBubble				= true;
					return true;
				};
				element.onchange = function(e){
					grid.filterByCustomAll();
				};
				if(!cell.parentNode.classList.contains("filter")){
					cell.parentNode.classList.add("filter");
				}
				if(!this.filters){
					this.filters							= [];
				}
				this.filters.push([element, idx]);
				this._filters_ready();
			};
			dhtmlXGridObject.prototype._loadXuiComboFilter = function(filterElement, idx) {
				var collectValue							= this.collectValues(idx);
				if(xui.valid.isArray(collectValue)){
					var options								= [];
					for(var i = 0; i < collectValue.length; i++){
						options.push({code:collectValue[i],codeName:collectValue[i]});
					}
					filterElement.controller.loadOption(options);
				}
			};
			dhtmlXGridObject.prototype.filterByCustomAll = function(){
				this._build_m_order();
				var filterIndexes							= [];
				var filterValues							= [];
				var filters									= this.filters;
				for(var i = 0; i < filters.length; i++){
					filterIndexes.push(filters[i][1]);
					filterValues.push(filters[i][0].controller.getData());
				}
				if(!this.callEvent("onFilterStart", [filterIndexes, filterValues])){
					return;
				}
				this.filterByCustom(filterIndexes, filterValues);
				if(this._cssEven){
					this._fixAlterCss();
				}
				this.callEvent("onFilterEnd", [this.filters]);
				if(this._f_rowsBuffer && this.rowsBuffer.length === this._f_rowsBuffer.length){
					this._f_rowsBuffer						= null;
				}
			};
			dhtmlXGridObject.prototype.filterByCustom = function(filterIndexes, filterValues, c) {
				if(this._f_rowsBuffer){
					if(!c){
						this.rowsBuffer						= dhtmlxArray([].concat(this._f_rowsBuffer));
						if(this._fake){
							this._fake.rowsBuffer			= this.rowsBuffer
						}
					}
				}else{
					this._f_rowsBuffer						= [].concat(this.rowsBuffer);
				}
				if(!this.rowsBuffer.length){
					return;
				}
				this.dma(true);
				if(xui.valid.isArray(filterIndexes)){
					for(var i = 0; i < filterValues.length; i++){
						this._filterCustomA(filterIndexes[i], filterValues[i]);
					}
				}else{
					this._filterCustomA(filterIndexes, filterValues);
				}
				this.dma(false);
				this._reset_view();
				this.callEvent("onGridReconstructed", []);
				this.objBox.scrollTop						= 0;
				var gridConfig								= this.element.gridController.config;
				if(gridConfig.freezeColumnIdx >= 0){
					this._fake.objBox.scrollTop				= 0;
				}
			};
			dhtmlXGridObject.prototype._filterCustomA = function(filterIndexes, filterValues){
				if(filterIndexes.length === 0){
					return;
				}
				var gridController							= this.element.gridController;
				var blnSplice								= true;
				var g										= true;
				var value									= null;
				if(!this.rowsBuffer.length){
					return;
				}
				gridController.unselect();
				for(var i = this.rowsBuffer.length - 1; i >= 0; i--){
					blnSplice								= true;
					if(typeof(filterValues) === "string"){
						value								= this._get_cell_value(this.rowsBuffer[i], filterIndexes);
						if(g ? (value.toString().toLowerCase().indexOf(filterValues.toLowerCase()) == -1) : (!filterValues.call(this, value, this.rowsBuffer[i].idd))){
							this.rowsBuffer.splice(i, 1);
						}
					}else{
						if(filterValues.length > 0){
							for(var j = 0; j < filterValues.length; j++){
								value						= this._get_cell_value(this.rowsBuffer[i], filterIndexes);
								if(xui.valid.isArray(filterValues[j])){
									if(filterValues[j].length === 0){
										blnSplice			= false;
									}else{
										for(var k = 0; k < filterValues[j].length; k++){
											if(value.toString().toLowerCase() === filterValues[j][k].toString().toLowerCase()){
												blnSplice	= false;
												break;
											}
										}
									}
								}else{
									if(value.toString().toLowerCase() === filterValues[j].toString().toLowerCase()){
										blnSplice			= false;
										break;
									}
								}
							}
						}else{
							blnSplice						= false;
						}
						if(blnSplice){
							this.rowsBuffer.splice(i, 1);
						}
					}
				}
			};
			dhtmlXGridObject.prototype._unfilter = function(){
				var filterElementList	= Array.from(this.hdr.querySelectorAll("input"));
				for(var i = 0; i < filterElementList.length; i++){
					filterElementList[i].controller.setData("");
				}
				this.filterByCustomAll();
			};
			dhtmlXGridObject.prototype._update_xtrm_srnd_view = function(){
				var gridController							= this.element.gridController;
				var gridConfig								= gridController.config;
				var _this									= this;
				if(_this.rowsBuffer.length === 0){
					return;
				}
				if(xui.valid.isEmpty(_this.currentScrollTop)){
					_this.currentScrollTop					= _this.objBox.scrollTop;
				}
				var objTable								= _this.obj;
				var objTbody								= objTable.firstChild;
				var objFakeTable							= null;
				var objFakeTbody							= null;
				var objFirstTr								= objTbody.firstChild;
				var objFakeFirstTr							= null;
				var objLastTr								= objTbody.lastChild;
				var objFakeLastTr							= null;
				var objCreateElement						= null;
				var objRow									= null;
				var height									= (_this.rowsBuffer.length * gridConfig.rowHeight) + 2;
				if(gridConfig.freezeColumnIdx >= 0){
					objFakeTable							= _this._fake.obj;
					objFakeTbody							= objFakeTable.firstChild;
					objFakeFirstTr							= objFakeTbody.firstChild;
					objFakeLastTr							= objFakeTbody.lastChild;
				}
				if(_this.totalHeight !== height){
					objTable.style.setProperty("height", (height) + "px", "important");
					if(objFakeTable != null){
						objFakeTable.style.setProperty("height", (height) + "px", "important");
					}
					_this.totalHeight						= height;
				}
				if(!_this.virtualActive){
					objTbody.style.setProperty("width", "inherit");
					if(objTbody.lastChild.classList.contains("xuigrid_tr_last")){
						objTbody.removeChild(objTbody.lastChild);
					}
					objCreateElement						= document.createElement("tr");
					objCreateElement.className				= "xuigrid_tr_last";
					objTbody.appendChild(objCreateElement);
					objLastTr								= objCreateElement;
					if(objFakeTable != null){
						objFakeTbody.style.setProperty("width", "inherit");
						if(objFakeTbody.lastChild.classList.contains("xuigrid_tr_last")){
							objFakeTbody.removeChild(objFakeTbody.lastChild);
						}
						objCreateElement					= document.createElement("tr");
						objCreateElement.className			= "xuigrid_tr_last";
						objFakeTbody.appendChild(objCreateElement);
						objFakeLastTr						= objCreateElement;
					}
					objLastTr.style.setProperty("height", ((_this.rowsBuffer.length - _this.rowsCol.length) * gridConfig.rowHeight) + "px", "important");
					if(objFakeTbody != null){
						objFakeLastTr.style.setProperty("height", ((_this.rowsBuffer.length - _this.rowsCol.length) * gridConfig.rowHeight) + "px", "important");
					}
					_this.currentBeginRowIdx				= 0;
					_this.currentEndRowIdx					= _this.rowsCol.length;
					if(_this.currentEndRowIdx < 0){
						_this.currentEndRowIdx				= 0;
					}
					_this.currentOffsetHeight				= _this.objBox.offsetHeight;
					gridConfig.rowSizePerPage				= Math.ceil((_this.objBox.offsetHeight / gridConfig.rowHeight) + 2);
					_this.virtualActive						= true;
				}
				if(_this.objBox.offsetHeight != _this.currentOffsetHeight){
					_this.currentOffsetHeight 				= _this.objBox.offsetHeight;
					gridConfig.rowSizePerPage				= Math.ceil((_this.objBox.offsetHeight / gridConfig.rowHeight) + 2);
				}
				var min										= Math.floor(_this.objBox.scrollTop / _this._srdh);
				var max										= min + gridConfig.rowSizePerPage;
				if(_this.multiLine) {
					var pxHeight							= _this.objBox.scrollTop;
					min = 0;
					while(pxHeight > 0) {
						pxHeight							-= _this.rowsCol[min] ? _this.rowsCol[min].offsetHeight : _this._srdh;
						min++;
					}
					max										= min + gridConfig.rowSizePerPage;
					if(min > 0){
						min--;
					}
				}
				max											+= (_this._srnd_pr || 0);
				if(max > _this.rowsBuffer.length){
					max										= _this.rowsBuffer.length;
				}
				if(max == _this.rowsBuffer.length){
					min										= min-2;
					if(min < 0){
						min									= 0;
					}
				}
				if(min != _this.currentBeginRowIdx || max != _this.currentEndRowIdx){
					while(objTbody.childNodes.length > 2){
						objTbody.removeChild(objTbody.childNodes[1]);
						if(objFakeTbody !== null){
							objFakeTbody.removeChild(objFakeTbody.childNodes[1]);
						}
					}
					_this.rowsCol							= dhtmlxArray();
					var _idx								= 0;
					for(var i = min; i < max; i++){
						objRow								= _this._xtrm_render_row(i);
						objTbody.insertBefore(objRow[0], objTbody.lastChild);
						if(objFakeTbody != null){
							objFakeTbody.insertBefore(objRow[1], objFakeTbody.lastChild);
						}
						_this.rowsCol._dhx_insertAt(_idx, objRow[0]);
						_idx++;
					}
				}
				if(!xui.valid.isEmpty(objLastTr.idd)){
					objCreateElement						= document.createElement("tr");
					objTbody.appendChild(objCreateElement);
					objLastTr								= objCreateElement;
					if(objFakeTbody != null){
						objCreateElement					= document.createElement("tr");
						objFakeTbody.appendChild(objCreateElement);
						objFakeLastTr						= objCreateElement;
					}
				}
				if(max === _this.rowsBuffer.length){
					objFirstTr.style.setProperty("height", (min * gridConfig.rowHeight) + "px", "important");
					if(objFakeTbody != null){
						objFakeFirstTr.style.setProperty("height", (min * gridConfig.rowHeight) + "px", "important");
					}
					objLastTr.style.setProperty("height", "2px", "important");
					if(objFakeTbody != null){
						objFakeLastTr.style.setProperty("height", "2px", "important");
					}
				}else{
					objFirstTr.style.setProperty("height", (min * gridConfig.rowHeight) + "px", "important");
					if(objFakeTbody != null){
						objFakeFirstTr.style.setProperty("height", (min * gridConfig.rowHeight) + "px", "important");
					}
					objLastTr.style.setProperty("height", ((_this.rowsBuffer.length - max) * gridConfig.rowHeight) + "px", "important");
					if(objFakeTbody != null){
						objFakeLastTr.style.setProperty("height", ((_this.rowsBuffer.length - max) * gridConfig.rowHeight) + "px", "important");
					}
				}
				if(_this._fake){
					_this._fake.objBox.scrollTop			= _this.objBox.scrollTop;
				}
				_this.currentBeginRowIdx					= min;
				_this.currentEndRowIdx						= max;
				_this.currentScrollTop						= _this.objBox.scrollTop;
				objTable									= null;
				objTbody									= null;
				objFakeTable								= null;
				objFakeTbody								= null;
				objFirstTr									= null;
				objFakeFirstTr								= null;
				objLastTr									= null;
				objFakeLastTr								= null;
				objCreateElement							= null;
				min											= null;
				max											= null;
			};
			dhtmlXGridObject.prototype._xtrm_render_row = function(intRowIndex){
				var objRenderRow							= null;
				var objFakeRenderRow						= null;
				var blnIsFake								= false;
				if(!xui.valid.isEmpty(this._fake)){
					blnIsFake								= true;
				}
				objRenderRow								= this.render_row(intRowIndex);
				if(blnIsFake){
					objFakeRenderRow						= this._fake.render_row(intRowIndex);
				}
				if(objRenderRow == -1){
					return null;
				}
				if(!xui.valid.isEmpty(objRenderRow) && !xui.valid.isEmpty(objRenderRow.idd)){
					if(objRenderRow._attrs.selected || objRenderRow._attrs.select){
						this.selectRow(objRenderRow, false, true);
						objRenderRow._attrs.selected		= objRenderRow._attrs.select = null
					}
					if(blnIsFake){
						if(objFakeRenderRow._attrs.selected || objFakeRenderRow._attrs.select){
							this.selectRow(objFakeRenderRow, false, true);
							objFakeRenderRow._attrs.selected	= objFakeRenderRow._attrs.select = null;
						}
					}
					if(!this._cssSP){
						if(this._cssEven && intRowIndex % 2 == 0){
							objRenderRow.className			= this._cssEven + ((objRenderRow.className.indexOf("rowselected") != -1) ? " rowselected " : " ") + (objRenderRow._css || "");
							if(blnIsFake){
								objFakeRenderRow.className	= this._cssEven + ((objFakeRenderRow.className.indexOf("rowselected") != -1) ? " rowselected " : " ") + (objFakeRenderRow._css || "");
							}
						}else{
							if(this._cssUnEven && intRowIndex % 2 == 1){
								objRenderRow.className		= this._cssUnEven + ((objRenderRow.className.indexOf("rowselected") != -1) ? " rowselected " : " ") + (objRenderRow._css || "");
								if(blnIsFake){
									objFakeRenderRow.className	= this._cssUnEven + ((objFakeRenderRow.className.indexOf("rowselected") != -1) ? " rowselected " : " ") + (objFakeRenderRow._css || "");
								}
							}
						}
					}else{
						if(this._h2){
							var a							= this._h2.get[objRenderRow.idd];
							objRenderRow.className			+= " " + ((a.level % 2) ? (this._cssUnEven + " " + this._cssUnEven) : (this._cssEven + " " + this._cssEven)) + "_" + a.level + (this.rowsAr[a.id]._css || "");
						}
						if(blnIsFake){
							if(this._h2){
								var a						= this._h2.get[objFakeRenderRow.idd];
								objFakeRenderRow.className	+= " " + ((a.level % 2) ? (this._cssUnEven + " " + this._cssUnEven) : (this._cssEven + " " + this._cssEven)) + "_" + a.level + (this.rowsAr[a.id]._css || "");
							}
						}
					}
				}else{
					objRenderRow							= null;
					objFakeRenderRow						= null;
				}
				return [objRenderRow, objFakeRenderRow];
			};
			/*define grid data parser end*/
		}
	};















	/*application common feature api*/
	xui.com		= new _Com();
	_Com		= null;

	function _Message(){
		this.message = {};
		this.config  = {};
		this.config._messageSeparator = "**";
	};
	_Message.prototype	= {
		get : function(messageId, languageCode, fromDatabase){
			var messageContents								= "";
			var messageArray								= [];
			/*
			 *  언어설정 가져오는 방법
			 *  1. lang값이 없을 경우 id가 lang인 element가 존재한다면 해당 요소의 값을 가져온다. (로그인 페이지)
			 *  2. Login시 세션에 값을 넣어주기때문에 세션에서 가져온다.
			 *  3. 브라우저에서 제공하는 언어설정값을 가져온다. (크롬, 엣지 등)
			 */
			if(xui.valid.isEmpty(languageCode)){
				// languageCode = xui.extends.session.getLanguage();
				languageCode = this.getLanguage();
			}

			if(!xui.valid.isEmpty(messageId)){
				messageId = this.config._messageSeparator + messageId;
				if(fromDatabase){
					// 구현 필요
					// 메모리 상의 message 값을 가지고 오는게 아닌 서버에 조회하여 message 값을 가지고 온다.
					//this._load(messageId);
				}
				// 자식 iframe 내에 있을경우 부모 iframe 객체에 있는 message 목록을 가지고 온다.
				if(top.xui.message.message.hasOwnProperty(messageId)){
					xui.util.copyObject(messageArray, top.xui.message.message[messageId]);
					if(!xui.valid.isEmpty(languageCode)){
						messageArray = messageArray.filter((message) => message.languageCode == languageCode);
					}
					if(messageArray.length >= 1){
						messageContents = messageArray[0].messageContents;
					}
				// 팝업일 경우
				}else if(window.opener != null && "Y" === new URLSearchParams((new URL(window.location.href)).search).get("popupAt")){
					// 팝업의 부모창이 팝업일 경우
					if("Y" === new URLSearchParams((new URL(window.opener.location.href)).search).get("popupAt")){
						xui.util.copyObject(messageArray, window.opener.opener.top.xui.message.message[messageId]);
					// 일반 팝업
					}else{
						xui.util.copyObject(messageArray, window.opener.top.xui.message.message[messageId]);
					}
					if(!xui.valid.isEmpty(languageCode)){
						messageArray = messageArray.filter((message) => message.languageCode == languageCode);
					}
					if(messageArray.length >= 1){
						messageContents = messageArray[0].messageContents;
					}
				}
			}
			return messageContents;
		},
		// 메모리 상의 message 값을 가지고 오는게 아닌 서버에 조회하여 message 값을 가지고 온다.
		_load : function(messageId){

		},
		getLanguage : function(){
			var languageCode = "";

			if(xui.valid.isEmpty(languageCode)){
				languageCode = top.xui.extends.session.getLanguage();
			}
			if(xui.valid.isEmpty(languageCode) && typeof $.fn["valExt"] === 'function' && !xui.valid.isEmpty($("#languageCode").valExt())){
				languageCode = $("#languageCode").valExt();
			}
			if(xui.valid.isEmpty(languageCode)){
				languageCode = navigator.language.split('-')[0]; // 예: 'en-US'
			}
			return languageCode;
		},
		load : function(messageData, fromDatabase){
			var messageId									= "";
			if(typeof(messageData) !== "undefined" && xui.valid.isString(messageData)){
				fromDatabase								= true;
				if(xui.valid.isString(messageData)){
					groupCode								= messageData;
				}
			}
			if(fromDatabase){
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/getMessageData.json");
				param.setString("messageId", messageId);
				param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
				var response								= xui.ajax.callSync(param);
				var messageData								= response.getDataJsonObject();
				if(xui.valid.isEmpty(messageId)){
					top.xui.message.message						= messageData;
				}else{
					top.xui.message.message[groupCode]			= codeData[groupCode];
				}
			}else if(xui.valid.isJson(messageData)){
				// 메시지 ID에 constructor와 같은 예약어를 피하기 위해 key 값 앞에 **를 붙인다.
				Object.keys(messageData).forEach(key => {
					messageData[key].forEach(messsage =>{
						message.messageId = this.config._messageSeparator + message.messageId;
					});
				});
				top.xui.message.message							= messageData;
			}else if(xui.valid.isArray(messageData)){
				top.xui.message.message = xui.util.mapArrToObjByKey("messageId", messageData);
			}
		},
		remove : function(messageId){
			if(!xui.valid.isEmpty(messageId)){
				if(top.xui.message.message.hasOwnProperty(messageId)){
					delete top.xui.message.message[messageId];
				}
			}
		},
		isDefaultDateFormat : function(){
			var returnValue = true;
			// 다국어 처리 나중에
			// var languageCode = xui.message.getLanguage();
			// if(languageCode === "en"){
			//	 returnValue = false;
			// }else if(languageCode === "vi"){
			//	 returnValue = false;
			// }
			return returnValue;
		},
		getRegexp : function(){
			var regexp = /^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/;
			// 다국어 처리 나중에
			// var languageCode = xui.message.getLanguage();
			// if(languageCode === "en"){
			//	 regexp = /^(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])((?:19|20|21)[0-9]{2})$/;
			// }else if(languageCode == "vi"){
			//	 regexp = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])((?:19|20|21)[0-9]{2})$/;
			// }
			return regexp;
		}
	};

	/*message feature api*/
	xui.message	= new _Message();
	_Message	= null;


	function _Code(){
		this.code	= {};
	};
	_Code.prototype	= {
		get : function(groupCode, fromDatabase){
			var returnData									= [];
			var codeData									= null;
			if(!xui.valid.isEmpty(groupCode)){
				groupCode									= groupCode.split("_");
				var sectionCode								= "";
				var etc01Info								= "";
				var etc02Info								= "";
				var etc03Info								= "";
				var etc04Info								= "";
				var etc05Info								= "";
				for(var i = 0; i < groupCode.length; i++){
					switch(i.toString()){
						case "1"	:
							sectionCode						= groupCode[1];
							break;
						case "2"	:
							etc01Info						= groupCode[i];
							break;
						case "3"	:
							etc02Info						= groupCode[i];
							break;
						case "4"	:
							etc03Info						= groupCode[i];
							break;
						case "5"	:
							etc04Info						= groupCode[i];
							break;
						case "6"	:
							etc05Info						= groupCode[i];
							break;
						default		:
							break;
					}
				}
				groupCode									= groupCode[0];
				if(fromDatabase){
					this._load(groupCode);
				}
				if(top.xui.code.code.hasOwnProperty(groupCode)){
					codeData								= [];
					xui.util.copyObject(codeData, top.xui.code.code[groupCode]);
					if(sectionCode !== ""){
						var doAdd							= true;
						for(var i = 0; i < codeData.length; i++){
							doAdd							= true;
							if(sectionCode !== "" && codeData[i].codeSectionCode !== sectionCode){
								doAdd						= false;
							}
							if(etc01Info !== "" && codeData[i].etc01Info !== etc01Info){
								doAdd						= false;
							}
							if(etc02Info !== "" && codeData[i].etc02Info !== etc02Info){
								doAdd						= false;
							}
							if(etc03Info !== "" && codeData[i].etc03Info !== etc03Info){
								doAdd						= false;
							}
							if(etc04Info !== "" && codeData[i].etc04Info !== etc04Info){
								doAdd						= false;
							}
							if(etc05Info !== "" && codeData[i].etc05Info !== etc05Info){
								doAdd						= false;
							}
							if(doAdd){
								returnData.push(codeData[i]);
							}
						}
					}else{
						returnData							= codeData;
					}
				}
			}
			if(returnData.length === 0){
				returnData									= null;
			}
			return returnData;
		},
		getGbisCode : function(gbisGroupCode){
			var returnData									= [];
			var groupCode									= "";
			var codeData									= null;
			if(!xui.valid.isEmpty(gbisGroupCode)){
				groupCode								    = gbisGroupCode;
			}
			if(!xui.valid.isEmpty(groupCode)){
				if(top.xui.code.code.hasOwnProperty(groupCode)){
					codeData								= [];
					xui.util.copyObject(codeData, top.xui.code.code[groupCode]);
					for(var i = 0; i < codeData.length; i++){
						doAdd							= true;
						if(doAdd){
							returnData.push(codeData[i]);
						}
					}
				}
			}
			if(returnData.length === 0){
				returnData									= null;
			}
			return returnData;
		},
		getChild : function(groupCode, pCode){
			var returnData									= null;
			var codeData									= this.get(groupCode);
			if(!xui.valid.isEmpty(codeData) && !xui.valid.isEmpty(pCode)){
				var size									= codeData.length;
				for(var i = 0; i < size; i++){
					if(codeData[i].code === pCode){
						returnData							= codeData[i].items;
						break;
					}
				}
				if(xui.valid.isEmpty(returnData) || (xui.valid.isArray(returnData) && returnData.length === 0)){
					returnData								= null;
				}
			}
			return returnData;
		},
		load : function(codeData){
			var fromDatabase								= false;
			var groupCode									= "";
			if(typeof(codeData) !== "undefined" && xui.valid.isString(codeData)){
				fromDatabase								= true;
				if(xui.valid.isString(codeData)){
					groupCode								= codeData;
				}
			}
			if(fromDatabase){
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/getCmmnCodeData.json");
				param.setString("groupCode", groupCode);
				param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
				var response								= xui.ajax.callSync(param);
				codeData									= response.getDataJsonObject();
				for(var key in codeData){
					var rootNodeId							= codeData[key][0].codeSectionCode;
					codeData[key].splice(0,1);
					codeData[key]							= xui.util.getTreeData(codeData[key], rootNodeId, "nodeId", "parentNodeId");
				}
				if(xui.valid.isEmpty(groupCode)){
					top.xui.code.code						= codeData;
				}else{
					top.xui.code.code[groupCode]			= codeData[groupCode];
				}
			}else if(xui.valid.isJson(codeData)){
				var keys									= Object.keys(codeData);
				for(var i = 0; i < keys.length; i++){
					var rootNodeId							= codeData[keys[i]][0].codeSectionCode;
					codeData[keys[i]].splice(0,1);
					codeData[keys[i]]						= xui.util.getTreeData(codeData[keys[i]], rootNodeId, "nodeId", "parentNodeId");
				}
				top.xui.code.code							= codeData;
			}
		},
		remove : function(groupCode){
			if(!xui.valid.isEmpty(groupCode)){
				if(top.xui.code.code.hasOwnProperty(groupCode)){
					delete top.xui.code.code[groupCode];
				}
			}
		}
	};

	/*common code feature api*/
	xui.code	= new _Code();
	_Code		= null;


	function _SysCode(){
		this.syscode	= {};
	};
	_SysCode.prototype	= {
		get : function(groupCode, fromDatabase){
			var returnData									= [];
			var codeData									= null;
			if(!xui.valid.isEmpty(groupCode)){
				groupCode									= groupCode.split("_");
				var sectionCode								= "";
				var etc01Info								= "";
				var etc02Info								= "";
				var etc03Info								= "";
				var etc04Info								= "";
				var etc05Info								= "";
				for(var i = 0; i < groupCode.length; i++){
					switch(i.toString()){
						case "1"	:
							sectionCode						= groupCode[1];
							break;
						case "2"	:
							etc01Info						= groupCode[i];
							break;
						case "3"	:
							etc02Info						= groupCode[i];
							break;
						case "4"	:
							etc03Info						= groupCode[i];
							break;
						case "5"	:
							etc04Info						= groupCode[i];
							break;
						case "6"	:
							etc05Info						= groupCode[i];
							break;
						default		:
							break;
					}
				}
				groupCode									= groupCode[0];
				if(fromDatabase){
					this._load(groupCode);
				}
				if(top.xui.syscode.code.hasOwnProperty(groupCode)){
					codeData								= [];
					xui.util.copyObject(codeData, top.xui.syscode.code[groupCode]);
					if(sectionCode !== ""){
						var doAdd							= true;
						for(var i = 0; i < codeData.length; i++){
							doAdd							= true;
							if(sectionCode !== "" && codeData[i].codeSectionCode !== sectionCode){
								doAdd						= false;
							}
							if(etc01Info !== "" && codeData[i].etc01Info !== etc01Info){
								doAdd						= false;
							}
							if(etc02Info !== "" && codeData[i].etc02Info !== etc02Info){
								doAdd						= false;
							}
							if(etc03Info !== "" && codeData[i].etc03Info !== etc03Info){
								doAdd						= false;
							}
							if(etc04Info !== "" && codeData[i].etc04Info !== etc04Info){
								doAdd						= false;
							}
							if(etc05Info !== "" && codeData[i].etc05Info !== etc05Info){
								doAdd						= false;
							}
							if(doAdd){
								returnData.push(codeData[i]);
							}
						}
					}else{
						returnData							= codeData;
					}
				}
			}
			if(returnData.length === 0){
				returnData									= null;
			}
			return returnData;
		},
		getChild : function(groupCode, pCode){
			var returnData									= null;
			var codeData									= this.get(groupCode);
			if(!xui.valid.isEmpty(codeData) && !xui.valid.isEmpty(pCode)){
				var size									= codeData.length;
				for(var i = 0; i < size; i++){
					if(codeData[i].code === pCode){
						returnData							= codeData[i].items;
						break;
					}
				}
				if(xui.valid.isEmpty(returnData) || (xui.valid.isArray(returnData) && returnData.length === 0)){
					returnData								= null;
				}
			}
			return returnData;
		},
		load : function(codeData){
			var fromDatabase								= false;
			var groupCode									= "";
			if(typeof(codeData) !== "undefined" && xui.valid.isString(codeData)){
				fromDatabase								= true;
				if(xui.valid.isString(codeData)){
					groupCode								= codeData;
				}
			}
			if(fromDatabase){
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/getSysCodeData.json");
				param.setString("groupCode", groupCode);
				param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
				var response								= xui.ajax.callSync(param);
				codeData									= response.getDataJsonObject();
				for(var key in codeData){
					var rootNodeId							= codeData[key][0].codeSectionCode;
					codeData[key].splice(0,1);
					codeData[key]							= xui.util.getTreeData(codeData[key], rootNodeId, "nodeId", "parentNodeId");
				}
				if(xui.valid.isEmpty(groupCode)){
					top.xui.syscode.code					= codeData;
				}else{
					top.xui.syscode.code[groupCode]			= codeData[groupCode];
				}
			}else if(xui.valid.isJson(codeData)){
				var keys									= Object.keys(codeData);
				for(var i = 0; i < keys.length; i++){
					var rootNodeId							= codeData[keys[i]][0].codeSectionCode;
					codeData[keys[i]].splice(0,1);
					codeData[keys[i]]						= xui.util.getTreeData(codeData[keys[i]], rootNodeId, "nodeId", "parentNodeId");
				}
				top.xui.syscode.code						= codeData;
			}
		},
		remove : function(groupCode){
			if(!xui.valid.isEmpty(groupCode)){
				if(top.xui.syscode.code.hasOwnProperty(groupCode)){
					delete top.xui.syscode.code[groupCode];
				}
			}
		}
	};

	/*common code feature api*/
	xui.syscode	= new _SysCode();
	_SysCode	= null;




	function _Ajax(){
		this.requestCount	= 0;
		this.requestList	= {};
	};
	_Ajax.prototype	= {
		/**
		 * Asynchronous data communication with server by use jQuery ajax
		 */
		callService : function(parameter, showProgress){
			var returnValue									= null;
			if(xui.valid.isXuiJson(parameter)){
				var ajaxFormData							= new xui._AjaxForm(parameter);
				ajaxFormData._sendRequest(showProgress);
				if(ajaxFormData.async){
					returnValue								= ajaxFormData.promise;
				}else{
					returnValue								= ajaxFormData.response;
				}
			}
			return returnValue;
		},
		/**
		 * Synchronous data communication with server by use jQuery ajax
		 */
		callSync : function(parameter){
			if(xui.valid.isXuiJson(parameter)){
				parameter.setAsync(false);
				return this.callService(parameter, false);
			}
		},
		/**
		 * COM_FILES_EXT 확장으로 인한 파라미터 추가 extAt
		 * 'Y' : target table - COM_FILES_EXT
		 * 'N' : target table - COM_FILES
		 */
		downloadFile : function(fileGroupKey, fileKey, extAt){
			if(!xui.valid.isEmpty(fileGroupKey)){
				var isValid									= true;
				var param									= new xui.json();
				if(xui.valid.isArray(fileGroupKey) && fileGroupKey.length > 0 && xui.valid.isJson(fileGroupKey[0]) && (fileGroupKey[0].hasOwnProperty("fileGroupKey") || fileGroupKey[0].hasOwnProperty("filePathInfo"))){
					param.setDataJsonArray(fileGroupKey);
				}else if(xui.valid.isJson(fileGroupKey)){
					if(fileGroupKey.hasOwnProperty("fileGroupKey") || fileGroupKey.hasOwnProperty("filePathInfo")){
						param.setDataJsonObject(fileGroupKey);
					}else{
						isValid								= false;
					}
				}else if(xui.valid.isXuiJson(fileGroupKey)){
					if(!xui.valid.isEmpty(fileGroupKey.getString("fileGroupKey")) || !xui.valid.isEmpty(fileGroupKey.getString("filePathInfo"))){
						param								= fileGroupKey;
					}else{
						isValid								= false;
					}
				}else if(xui.valid.isString(fileGroupKey) && xui.valid.isString(fileKey)){
					param.setString("fileGroupKey"		,fileGroupKey);
					param.setString("fileKey"			,fileKey);
					if(xui.valid.isEmpty(extAt) || extAt === "N"){
						param.setString("extAt","N");
						param.setString("filePathInfo"		,fileGroupKey);
						param.setString("fileName"			,fileKey);
					}else if(extAt === 'Y'){
						param.setString("extAt",extAt);
					}
				}else{
					isValid									= false;
				}
				if(isValid){
					param.setURL(xui.com.getRequestPrefix() + "/downloadFile.json");
					param.setAuthType(xui.enum.AUTH_TYPE_OUTPUT.getCode());
					param.setCallBack(function(response, request){
						if(response.getErrorFlag()){
							xui.dialog.error(response.getMsg(), xui.enum.DOWNLOADFILE_ERROR.getName());
						}
					});
					var ajaxFormData						= new xui._AjaxForm(param);
					ajaxFormData._submitRequest();
				}
			}
		},
		readFile : function(fileGroupKey, fileKey, extAt, callbackFn){
			var returnValue									= null;
			if(!xui.valid.isEmpty(fileGroupKey)){
				if(xui.valid.isEmpty(fileKey)){
					fileKey									= "";
				}
				if(xui.valid.isEmpty(callbackFn)){
					callbackFn								= fileKey;
				}
				if(xui.valid.isEmpty(extAt)){
					extAt									= "N";
				}
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/readTextFile.json");
				param.setString("fileGroupKey"	, fileGroupKey);
				param.setString("fileKey"		, fileKey);
				param.setString("filePathInfo"	, fileGroupKey);
				param.setString("extAt"			, extAt);
				param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
				if(typeof(callbackFn) === "function"){
					param.setCallBack(function(response, request){
						callbackFn.call("", response);
					});
					returnValue								= this.callService(param);
				}else{
					returnValue								= this.callSync(param);
				}
			}
			return returnValue;
		},
		getFileStream : function(fileGroupKey, fileKey, extAt){
			return xui.com.getRequestPrefix() + "/getFileStream.json" + xui.ajax.convertGetMethodParam({"fileGroupKey":fileGroupKey,"fileKey":fileKey,"authType":xui.enum.AUTH_TYPE_NONE.getCode(),"extAt":extAt});
		},
		getProperty : function(key, defaultValue){
			var returnValue									= defaultValue;
			var param										= new xui.json();
			param.setURL(xui.com.getRequestPrefix() + "/getProperty.json");
			param.setString("PROPERTY_KEY"					,key);
			param.setString("PROPERTY_DEFAULT"				,defaultValue);
			param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			var response									= this.callSync(param);
			if(!response.getErrorFlag()){
				returnValue									= response.getObject(key);
			}
			return returnValue;
		},
		getDbmsUniqueKey : function(){
			var uniqueKey									= null;
			if(!this.requestList.hasOwnProperty("UNIQUE_KEY")){
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/getUniqueKey.json");
				param.setAsync(false);
				param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
				this.requestList.UNIQUE_KEY					= new xui._AjaxForm(param);
			}
			this.requestList.UNIQUE_KEY._sendRequest(false);
			if(!this.requestList.UNIQUE_KEY.response.getErrorFlag()){
				uniqueKey									= this.requestList.UNIQUE_KEY.response.getString("uniqueKey");
			}
			return uniqueKey;
		},
		convertGetMethodParam : function(param){
			var returnValue									= "";
			if(xui.valid.isJson(param)){
				var xtrmParam								= new xui.json();
				xtrmParam.setMethod("GET");
				xtrmParam.setURL("/");
				xtrmParam.setDataJsonObject(param);
				var ajaxFormData							= new xui._AjaxForm(xtrmParam);
				ajaxFormData.request.removeHeaderKey("URL");
				ajaxFormData.request.removeHeaderKey("ASYNC");
				ajaxFormData.request.removeHeaderKey("SESSION_CHECK");
				ajaxFormData.request.removeHeaderKey("METHOD");
				ajaxFormData._setEncrypt();
				var data									= ajaxFormData.request.getDataJsonObject();
				var keySet									= Object.keys(data);
				for(var i = 0; i < keySet.length; i++){
					if(i === 0){
						returnValue							+= "?" + keySet[i] + "=" + data[keySet[i]];
					}else{
						returnValue							+= "&" + keySet[i] + "=" + data[keySet[i]];
					}
				}
				if(!xui.valid.isEmpty(returnValue)){
					returnValue								+= "&ENCRYPT_PARAMS_KEY=" + ajaxFormData.request.getHeader("ENCRYPT_PARAMS_KEY");
				}else{
					returnValue								+= "?ENCRYPT_PARAMS_KEY=" + ajaxFormData.request.getHeader("ENCRYPT_PARAMS_KEY");
				}
				returnValue									+= "&ENCRYPT_PARAMS_VALUE=" + ajaxFormData.request.getHeader("ENCRYPT_PARAMS_VALUE");
			}
			return returnValue;
		},
		_exportExcel : function(parameter){
			if (xui.valid.isXuiJson(parameter)) {
				if (!gIsPrivacyPage) {
					var ajaxFormData 	= new xui._AjaxForm(parameter);
					ajaxFormData._submitRequest();
				}else {
					var config 			= {}
					config.param 		= parameter;
					xui.extends.popup.excelReasonPop(config, function () { });
				}
			}
		},
		_getRequestCount : function(){
			return top.xui.ajax.requestCount;
		},
		_increaseRequestCount : function(){
			top.xui.ajax.requestCount						= top.xui.ajax.requestCount + 1;
		},
		_decreaseRequestCount : function(){
			if(top.xui.ajax.requestCount > 0){
				top.xui.ajax.requestCount					= top.xui.ajax.requestCount - 1;
			}
		}
	};
	xui._AjaxForm	= function(parameter){
		if(xui.valid.isEmpty(parameter.getMethod())){
			parameter.setMethod("POST");
		}
		if(xui.valid.isEmpty(parameter.getAsync())){
			parameter.setAsync(true);
		}
		this.method											= parameter.getMethod();
		this.async											= parameter.getAsync();
		this.url											= parameter.getURL();
		this.callback										= parameter.getCallBack();
		this.grid											= parameter.getGridId();
		this.tree											= parameter.getTreeId();
		if(this.url.substr(0,1) === "/"){
			this.url										= this.url.substr(1);
		}
		this.url											= (xui.com.getContextPath() + this.url + "?menuKey=" + xui.extends.menu.getKey());
		if(!xui.valid.isEmpty(this.grid)){
			var gridController								= document.getElementById(this.grid).gridController;
			this.pageNumber									= gridController.getPage();
			parameter.setPageNo(gridController.getPage());
			parameter.setRowPerPage(gridController.getCountPerPage());
		}
		if(!xui.valid.isEmpty(this.tree)){
			var treeController								= document.getElementById(this.tree).treeController;
		}
		parameter.removeHeaderKey("CALL_BACK");
		this.request										= parameter;
	};
	xui._AjaxForm.prototype	= {
		_sendRequest : function(showProgress){
			if(xui.valid.isEmpty(showProgress)){
				showProgress								= true;
			}
			var _this										= this;
			this._setEncrypt();
			var ajaxOption									= {
				type		: this.method,
				url			: this.url,
				data		: {"jsonData" : JSON.stringify(this.request.getJson())},
				dataType	: "json",
				async		: this.async,
				beforeSend	: function(){
					if(showProgress){
						if(_this.grid){
							xui.com.showProgress(document.getElementById(_this.grid).parentNode, _this.grid + "_progress");
						}else if(_this.tree){
							xui.com.showProgress(_this.tree, _this.tree + "_progress");
						}else{
							xui.ajax._increaseRequestCount();
							xui.com.showProgress();
						}
					}
				},
				success:function(response){
					_this.response							= new xui.json(response);
					var strSqlNameSpace						= _this.response.getHeader("sqlNameSpace");
					var strSqlId							= _this.response.getHeader("sqlId");
					var strConnPoolName						= _this.response.getHeader("connPoolName");
					if(strSqlNameSpace !== "" && strSqlId !== ""){
						_this.request.setHeader("sqlNameSpace"	,strSqlNameSpace);
						_this.request.setHeader("sqlId"			,strSqlId);
						_this.request.setHeader("connPoolName"	,strConnPoolName);
					}
					strSqlNameSpace							= null;
					strSqlId								= null;
				},error:function(xhr, status, error){

                    if (xhr.status === 0) {
//                        console.log("네트워크 연결 오류: 서버에 연결할 수 없습니다.");
                        _this.response = new xui.json({
                            status: xhr.status,
                            statusText: "Connection refused",
                            message: "서버에 연결할 수 없습니다. 네트워크 상태를 확인하세요."
                        });
                    } else {
//                        console.log("서버 오류:", error);
                        _this.response = new xui.json({
                            status: xhr.status,
                            statusText: xhr.statusText,
                            message: error || "서버 오류가 발생했습니다."
                        });
                    }

//					_this.response							= new xui.json(error);
					_this.response.setErrorFlag(true);
					_this.response.setHeader("COUNT"		,0);
					_this.response.setHeader("TOT_COUNT"	,0);
				},complete:function(){
					var redirect							= false;
					//세션 expired -> error page redirect
					if(_this.response.getErrorFlag() && _this.response.getErrorCode() === "610"){
						redirect							= true;
					}
					// 리포트 팝업에 한해 session not Found 방지
					var loc = window.location.href;

                    if(redirect){
						// 로그인 화면 — 세션 없음이 정상; redirectErrorPage 금지
						if(xui.com.isHyobeeLoginPage()){
							return;
						}
						// Hyobee aichat — 세션 없으면 에러 페이지 대신 로그인으로
						if(xui.com.isHyobeeAichatStandalonePage()){
							var aichatPath = (document.location.pathname || "").toLowerCase();
							if(aichatPath.indexOf("/webapps/xs/aichat/") >= 0){
								window.location.href = (xui.com.getContextPath() + "webapps/xs/webbase/login/login.jsp").replace("//", "/");
								return;
							}
						}
						// 20241211 통합테스트 요청사항으로 메인화면에서 session not Found 핸들링하도록 요청에따른 처리
						//SSO연동으로 변경하면서 주석처리함 (25.04.18)
						/*if(!xui.valid.isEmpty(top.main010)){
							xui.dialog.error(top.main010.enum.RE_LOGIN_NOT_FOUND_SESSION.getName(), "Session not found", function(){
										 top.window.location.href = xui.com.getContextPath();
									 });
									 return;
						}*/
						xui.com._redirectErrorPage(_this.response.getErrorCode(), _this.response.getMsg(), _this.response.getString("ERROR_MSG_SUB"));
					}else{
						if(showProgress){
							if(_this.grid){
								xui.com.hideProgress(_this.grid + "_progress");
							}else if(_this.tree){
								xui.com.hideProgress(_this.tree + "_progress");
							}else{
								xui.ajax._decreaseRequestCount();
								xui.com.hideProgress();
							}
						}
						if(!xui.valid.isEmpty(_this.grid)){
							var gridController					= document.getElementById(_this.grid).gridController;
							gridController._setRequest(_this);
						}else if(!xui.valid.isEmpty(_this.tree)){
							var treeController					= document.getElementById(_this.tree).treeController;
							treeController._setRequest(_this);
						}
						_this.request.removeHeaderKey("ENCRYPT_PARAMS_KEY");
						_this.request.removeHeaderKey("ENCRYPT_PARAMS_VALUE");
						var obj = document.getElementById("xui-ajax-datetime");
						if(xui.valid.isElement(obj)){
							if(!_this.request.getTimeCheck()){
								obj.innerHTML = "";
							} else {
								if(_this.response.containsHeaderKey("CURRENT_DT") && !xui.valid.isEmpty(obj.controller)){
									obj.controller.setData( xui.enum.RECENT_VIEWS.getName() + " : " + xui.format.datetime.getData(_this.response.getHeader("CURRENT_DT"),_this.response.getHeader("CURRENT_DT")));
								}
							}
						}

						if(_this.async && typeof(_this.callback) === "function"){
							_this.callback.call("", _this.response, _this.request);
						}
					}
				}
			};
			_this.promise									= $.ajax(ajaxOption);
		},
		_submitRequest : function(){
			this._setEncrypt();
			if(xui.valid.isEmpty(this.frame)){
				this.frame									= document.createElement("iframe");
				this.frame.name								= xui.util.generateRandomChar();
				this.frame.style.display					= "none";
				this.frame.ajaxFormData						= this;
				this.callback								= function(response){
					if(!xui.valid.isEmpty(response)){
						response							= new xui.json(JSON.parse(response));
						if(response.getErrorFlag()){
							xui.dialog.error(response.getMsg(), response.getString("ERROR_MSG_SUB"), function(){
								xui.com.hideProgress();
							});
						}
						document.body.removeChild(this.frame);
						document.body.removeChild(this.form);
					}
				};
				this.frame.addEventListener("load", function(){
					if(typeof(this.ajaxFormData.callback) === "function"){
						var objRoot							= this.contentWindow.document.documentElement;
						this.ajaxFormData.callback.call(this.ajaxFormData, objRoot.textContent ? objRoot.textContent : objRoot.innerText);
					}
				});
				this.form									= document.createElement("form");
				this.form.id								= this.frame.name + "_form";
				this.form.method							= "POST";
				this.form.target							= this.frame.name;
				this.form.action							= this.url;
				this.form.style.display						= "none";
				this.formInput								= document.createElement("input");
				this.formInput.setAttribute("type", "text");
				this.formInput.setAttribute("name",	"jsonData");
				document.body.appendChild(this.frame);
				document.body.appendChild(this.form);
				this.form.appendChild(this.formInput);
			}
			this.formInput.value							= JSON.stringify(this.request.getJson());
			function intervalPromise(ajaxFormData){
				return new Promise(function(resolve, reject){
					ajaxFormData.intervalCount				= 0;
					ajaxFormData.interval					= setInterval(function(){
						if(document.cookie.indexOf("downloadFileToken") >= 0 || ajaxFormData.intervalCount > 6000){
							clearInterval(ajaxFormData.interval);
							$.removeCookie("downloadFileToken", {path:"/"});
							resolve(ajaxFormData);
						}
						ajaxFormData.intervalCount++;
					}, 100);
				});
			}
			intervalPromise(this).then(function(ajaxFormData){
				xui.com.hideProgress();
			}).catch(function(error){
				xui.com.hideProgress();
			});
			this.form.submit();
			xui.com.showProgress();
		},
		_setEncrypt : function(){
			var request										= this.request;
			this.encKey										= "";
			this.encValue									= "";
			var jsonData									= request.getJson();
			for(var key in jsonData){
				jsonData[key]								= this._makeRequestEncryptParam(key, jsonData[key]);
			}
			request.setHeader("ENCRYPT_PARAMS_KEY"			, xui.util.encryptSHA256(this.encKey)	);
			request.setHeader("ENCRYPT_PARAMS_VALUE"		, xui.util.encryptSHA256(this.encValue)	);
		},
		_makeRequestEncryptParam : function(key, data, encKey, encValue){
			if(xui.valid.isArray(data)){
				if(data.length > 0){
					for(var i in data){
						data[i]								= this._makeRequestEncryptParam("", data[i]);
					}
				}
			}else if(xui.valid.isJson(data)){
				for(var keyName in data){
					if(data[keyName] === null){
						data[keyName]						= "";
					}
					data[keyName]							= this._makeRequestEncryptParam(keyName, data[keyName]);
				}
			}else{
				this.encKey									+= key;
				if(data === null){
					data									= "";
				}else{
					/* 특수문자 치환 방식 변경 기존 클라이언트 > 치환 > 저장을 클라이언트 > 저장 > 조회 > 치환 > 반환으로 20231030
					if(xui.valid.isString(data)){
						data								= xui.util.cleanXSS(xui.util.restoreXSS(data));
					}
					*/
				}
				this.encValue								+= ("" + data);
			}
			return data;
		},
		_showCanvasProgress : function(percent){
			if(xui.valid.isEmpty(this.canvas)){
				this.canvas									= document.createElement("canvas");
				this.canvas.className						= "xui-progress-canvas xui-invisible";
				document.body.appendChild(this.canvas);
				this.ctx									= this.canvas.getContext("2d");
				this.ctx.clearRect(0, 0, 400, 400);
				this.ctx.strokeStyle						= "#f66";
				this.ctx.lineWidth							= 10;
				this.ctx.beginPath();
				this.ctx.stroke();
				this.ctx.font								= "32px NotoSans";
				this.ctx.fillStyle							= "#666";
				this.ctx.textAlign							= "center";
				this.ctx.textBaseline						= "middle";
			}
			this.ctx.arc(60, 60, 50, 0, Math.PI * 2 * percent / 100);
			this.ctx.fillText(percent + "%", 60, 60);
			this.canvas.classList.remove("xui-invisible");
		},
		_hideCanvasProgress : function(){
			if(!xui.valid.isEmpty(this.canvas)){
				document.body.removeChild(this.canvas);
			}
		}
	};

	/*common ajax communication feature api*/
	xui.ajax	= new _Ajax();
	_Ajax		= null;

	function _Valid(){

	};
	_Valid.prototype	= {
		/**
		 * Check validation all form values from root element to leaf
		 * @param	{Object}{required}		rootElement		Target root DOMElement to check validation (allowed string element id, DOMElement object, jQuery object)
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		check : function(rootElement, clearInvalidValue){
			var returnValue									= true;
			if(xui.USE_JQUERY && rootElement instanceof jQuery){
				rootElement									= rootElement[0];
			}
			if(xui.valid.isEmpty(clearInvalidValue)){
				clearInvalidValue							= false;
			}
			if(!xui.valid.isEmpty(rootElement.gridController)){
				returnValue									= rootElement.gridController.checkValidEditCell();
			}else{
				var objDomElementList						= xuic.__DOM.getElementsList(rootElement, true);
				var objElement								= null;
				var objController							= null;
				var strValue								= "";
				var isValid									= true;
				for(var i in objDomElementList){
					isValid									= true;
					objElement								= objDomElementList[i];
					objController							= objElement.controller;
					if(!xui.valid.isEmpty(objController) && !(objController instanceof xuic.__DEFAULT_CONTROLLER)){
						isValid								= objController.checkValid(clearInvalidValue, true);
					}
					returnValue								= (returnValue ? isValid : returnValue);
				}
			}
			return returnValue;
		},
		/**
		 * Return whether empty of data
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isEmpty : function(data){
			return xuic.__VALID.checkIsEmpty(data);
		},
		/**
		 * Return whether empty of data
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isEmptyJsonArray : function(data){
			if(xuic.__VALID.checkIsEmpty(data)){return true;}
			if(!xuic.__VALID.checkIsArray(data)){return true;}
			if(xuic.__VALID.checkIsArray(data)){
				if(data.length === 0){return true;}
				if(xuic.__VALID.checkIsEmpty(data[0])){return true;}
				if(!xuic.__VALID.checkIsJson(data[0])){return true;}
				if(data[0].constructor === Object && Object.keys(data[0]).length === 0){return true;}
			}
			return false;
		},
		/**
		 * Return whether data is array
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isArray : function(data){
			return xuic.__VALID.checkIsArray(data);
		},
		/**
		 * Return whether data is json object
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isJson : function(data, enableString){
			return xuic.__VALID.checkIsJson(data, enableString);
		},
		/**
		 * Return whether data is DOMElement
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isElement : function(data){
			return xuic.__VALID.checkIsElement(data);
		},
		/**
		 * Return whether data is HTMLCollection
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isHTMLCollection : function(data){
			return xuic.__VALID.checkIsHTMLCollection(data);
		},
		/**
		 * Return whether data is string
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isString : function(data){
			return xuic.__VALID.checkIsString(data);
		},
		/**
		 * Return whether data exist character of Korean
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		existKorean : function(data){
			return xuic.__VALID.checkExistKorean(data);
		},
		/**
		 * Return whether data exist character of English
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		existEnglish : function(data){
			return xuic.__VALID.checkExistEnglish(data);
		},
		/**
		 * Return whether data exist character of numeric
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		existNumber : function(data){
			return xuic.__VALID.checkExistNumber(data);
		},
		/**
		 * Return whether data exist character of special
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		existSpecialChar : function(data){
			return xuic.__VALID.checkExistSpecialChar(data);
		},
		/**
		 * Return whether data is complete type Korean
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isCompleteKorean : function(data){
			return xuic.__VALID.checkIsCompleteKorean(data);
		},
		/**
		 * Return whether data is year format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isYear : function(data){
			return xuic.__VALID.checkIsYear(data);
		},
		/**
		 * Return whether data is year-month format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isMonth : function(data){
			return xuic.__VALID.checkIsMonth(data);
		},
		/**
		 * Return whether data is date format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isDate : function(data){
			return xuic.__VALID.checkIsDate(data);
		},
		/**
		 * Return whether data is date-time format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isDatetime : function(data){
			return xuic.__VALID.checkIsDatetime(data);
		},
		/**
		 * Return whether data is time format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isTime : function(data){
			return xuic.__VALID.checkIsTime(data);
		},
		/**
		 * Return whether data is number format
		 * @param	{String}{required}		data			Data of validation target
		 * @param	{boolean}{optional}		currency		Whether allow currency format	(default : false)
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isNumber : function(data, currency){
			return xuic.__VALID.checkIsNumber(data, currency);
		},
		/**
		 * 숫자로 이루어진 문자열 체크
		 * @param	{String}{required}		data			체크할 문자열
		 * @returns	{boolean}
		 * @author	HyosungITX Corp.
		 */
		isNumeric : function(data){
			return xuic.__VALID.checkIsNumeric(data);
		},
		/**
		 * Return whether data is finite decimal format
		 * @param	{String}{required}		data			Data of validation target
		 * @param	{boolean}{optional}		currency		Whether allow currency format	(default : false)
		 * @param	{Number}{optional}		round			Allow decimal point size		(default : 2	)
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isDecimal : function(data, currency, round){
			return xuic.__VALID.checkIsDecimal(data, currency, round);
		},
		/**
		 * Return whether data is business registeration number format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isBiz : function(data){
			return xuic.__VALID.checkIsBiz(data);
		},
		isCorp : function(data){
			return xuic.__VALID.checkIsCorp(data);
		},
		/**
		 * Return whether data is juridical registeration number format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isJuri : function(data){
			return xuic.__VALID.checkIsJuri(data);
		},
		/**
		 * Return whether data is inhabitants identification number format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isIhid : function(data){
			return xuic.__VALID.checkIsIhid(data);
		},
		/**
		 * Return whether data is phone number format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isPhone : function(data){
			return xuic.__VALID.checkIsPhone(data);
		},
		/**
		 * Return whether data is credit card number format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isCard : function(data){
			return xuic.__VALID.checkIsCard(data);
		},
		/**
		 * Return whether data is email format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isEmail : function(data){
			return xuic.__VALID.checkIsEmail(data);
		},
		/**
		 * Return whether data is ip address format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isIp : function(data){
			return xuic.__VALID.checkIsIp(data);
		},
		/**
		 * Return whether data is post number format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isPost : function(data){
			return xuic.__VALID.checkIsPost(data);
		},
		/**
		 * Return whether data is car registeration number format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isCar : function(data){
			return xuic.__VALID.checkIsCar(data);
		},
		/**
		 * Return whether data is bank account number format
		 * @param	{String}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isAccount : function(data, bankcode){
			return xuic.__VALID.checkIsAccount(data, bankcode);
		},
		/**
		 * Return wheter data constructor is XTRM_JSON
		 * @param	{Object}{required}		data			Data of validation target
		 * @returns	{boolean}								Whether valid
		 * @author	HyosungITX Corp.
		 */
		isXuiJson : function(data){
			return (data instanceof xui.json);
		},

		/**
		 *
		 */
		isUrl : function(data){
			return xuic.__VALID.checkIsUrl(data);
		},

		isCompleteUrl : function(data){
			return xuic.__VALID.checkIsCompleteUrl(data);
		},

		/**
		 *
		 */
		isHtml : function(data){
			return xuic.__VALID.checkIsHtml(data);
		},

		/**
		 * 현재 페이지에 기능 권한권한이 있는지 여부 반환
		 */
		hasAuthSelect : function(){
			if(xui.valid.isEmpty(xui.extends.menu.fnAuth)){
				return false;
			} else {
				return xui.extends.menu.fnAuth.R;
			}
		},
		hasAuthSave : function(){
			if(xui.valid.isEmpty(xui.extends.menu.fnAuth)){
				return false;
			} else {
				return xui.extends.menu.fnAuth.S;
			}
		},
		hasAuthCreat : function(){
			if(xui.valid.isEmpty(xui.extends.menu.fnAuth)){
				return false;
			} else {
				return xui.extends.menu.fnAuth.C;
			}
		},
		hasAuthUpdate : function(){
			if(xui.valid.isEmpty(xui.extends.menu.fnAuth)){
				return false;
			} else {
				return xui.extends.menu.fnAuth.U;
			}
		},
		hasAuthDelete : function(){
			if(xui.valid.isEmpty(xui.extends.menu.fnAuth)){
				return false;
			} else {
				return xui.extends.menu.fnAuth.D;
			}
		},
		hasAuthOutput : function(){
			if(xui.valid.isEmpty(xui.extends.menu.fnAuth)){
				return false;
			} else {
				return xui.extends.menu.fnAuth.O;
			}
		},
		hasAuthEtc : function(){
			if(xui.valid.isEmpty(xui.extends.menu.fnAuth)){
				return false;
			} else {
				return xui.extends.menu.fnAuth.E;
			}
		},
		hasAuthAdmin : function(){
			if(xui.valid.isEmpty(xui.extends.menu.fnAuth)){
				return false;
			} else {
				return xui.extends.menu.fnAuth.A;
			}
		}
	};

	/*application validation feature api*/
	xui.valid	= new _Valid();
	_Valid		= null;

	function _Util(){

	};
	_Util.prototype	= {
		/**
		 *
		 */
		drawCombo : function(element, data, headText, headValue){
			if(xui.USE_JQUERY && element instanceof jQuery){
				element										= element[0];
			}
			element											= xuic.__DOM.getElement(element);
			if(xui.valid.isElement(element) && element.parentNode.classList.contains("xui-combo-label")){
				var comboOption								= xui.util.copyObject([], data);
				var controller								= element.controller;
				if(xui.valid.isEmpty(controller)){
					controller								= new xuic.__COMBO_CONTROLLER(element);
				}
				if(xui.valid.isArray(comboOption)){
					if(!xui.valid.isEmpty(headText) && typeof(headValue) !== "undefined" && headValue !== null){
						if((comboOption.length === 0 || (comboOption.length > 0 && comboOption[0].code !== headValue))){
							comboOption.unshift({code:headValue,codeName:headText});
						}
					}
					controller.loadOption(comboOption);
				}
			}
		},
		/**
		 *
		 */
		clearCombo : function(element){
			if(xui.USE_JQUERY && element instanceof jQuery){
				element										= element[0];
			}
			element											= xuic.__DOM.getElement(element);
			if(xui.valid.isElement(element) && element.parentNode.classList.contains("xui-combo-label")){
				var controller								= element.controller;
				if(!xui.valid.isEmpty(controller)){
					controller.clearOption();
				}
			}
		},
		/**
		 *
		 */
		getElementPosition : function(element){
			var returnValue									= null;
			if(xui.USE_JQUERY && element instanceof jQuery){
				element										= element[0];
			}
			element											= xuic.__DOM.getElement(element);
			if(xui.valid.isElement(element)){
				var rect									= element.getBoundingClientRect();
				returnValue									= [];
				returnValue.push(parseInt((rect.left).toFixed()));
				returnValue.push(parseInt((rect.top).toFixed()));
			}
			return returnValue;
		},
		/**
		 *
		 */
		setFormData : function(data, root, doCallFn, valid){
			var formData									= null;
			var	checkValid									= true;
			if(!xui.valid.isEmpty(valid)){checkValid = valid;}
			if(xui.valid.isEmpty(root)){
				root										= document.body;
			}else if(xui.USE_JQUERY && root instanceof jQuery){
				root										= root[0];
			}
			if(xui.valid.isEmpty(doCallFn)){
				doCallFn									= true;
			}
			var elementList									= xuic.__DOM.getElementsList(root);
			var controller									= null;
			var element										= null;
			if(xui.valid.isArray(elementList) && elementList.length > 0){
				formData									= {};
				if(xui.valid.isXuiJson(data)){
					data									= data.getDataJsonObject();
				}else if(xui.valid.isArray(data)){
					data									= data[0];
				}
				if(xui.valid.isJson(data)){
					for(var i = 0; i < elementList.length; i++){
						element								= elementList[i];
						controller							= element.controller;
						if(!xui.valid.isEmpty(controller)){
							if(data.hasOwnProperty(controller.config.id)){
								controller.setData(data[controller.config.id], doCallFn, checkValid);
							}
						}
					}
				}
			}
		},
		/**
		 *
		 */
		getFormData : function(root, format){
			var formData 									= null;
			if (!xui.valid.isEmpty(root)) {
				if (xui.USE_JQUERY && root instanceof jQuery) {
					root 									= root[0];
				}
				if (xui.valid.isEmpty(format)) {
					format 									= false;
				}
				var elementList 							= xuic.__DOM.getElementsList(root);
				var controller 								= null;
				var element 								= null;
				if (xui.valid.isArray(elementList) && elementList.length > 0) {
					formData 								= {};
					for (var i = 0; i < elementList.length; i++) {
						element 							= elementList[i];
						controller 							= element.controller;
						if (!xui.valid.isEmpty(controller)) {
							formData[controller.config.id] 	= controller.getData(format);
							// date format이고 default Language가 아닐 경우 재 변경
							if(controller.config.format == "DATE" && !xui.message.isDefaultDateFormat()){
								var regex = xui.message.getRegexp();
								if(xui.message.getLanguage() === "en"){
									// 영어 일 경우
									// 정규 표현식에 매칭되는 경우
									const match = formData[controller.config.id].match(regex);
									if (match) {
										const month = match[1];   // mm
										const day = match[2];	 // dd
										const year = match[3];	// yyyy
										// yyyymmdd 형식으로 반환
										formData[controller.config.id] = `${year}${month}${day}`;
									}
								}else if(xui.message.getLanguage() === "vi"){
									// 베트남어 일 경우
									// 정규 표현식에 매칭되는 경우
									const match = formData[controller.config.id].match(regex);
									if (match) {
										const day = match[1];   // dd
										const month = match[2]; // mm
										const year = match[3];  // yyyy
										// yyyymmdd 형식으로 반환
										formData[controller.config.id] = `${year}${month}${day}`;
									}
								}
							}
						}
					}
				}
			}
			return formData;
		},
		/**
		 *
		 */
		disableElement : function(target, disabled, clear, zeronum){
			if(!xui.valid.isEmpty(target)){
				if(xui.USE_JQUERY && target instanceof jQuery){
					target									= target[0];
				}
				if(xui.valid.isEmpty(disabled)){
					disabled								= true;
				}
				if(xui.valid.isEmpty(clear)){
					clear									= false;
				}
				if(xui.valid.isEmpty(zeronum)){
					zeronum									= false;
				}
				var targetList								= [];
				if(!xui.valid.isArray(target)){
					if(xui.valid.isElement(target)){
						targetList.push({"element":target,"disabled":disabled,"clear":clear,"zeronum":zeronum});
					}else if(xui.valid.isJson(target)){
						if(target.hasOwnProperty("id") && !xui.valid.isEmpty(target.id)){
							target.element					= xuic.__DOM.getElement(target.id);
							target.disabled					= (xui.valid.isEmpty(target.disabled)		? disabled	: target.disabled);
						}
						targetList.push(target);
					}else if(xui.valid.isString(target)){
						targetList.push({"element":xuic.__DOM.getElement(target),"disabled":disabled,"clear":clear,"zeronum":zeronum});
					}
				}else{
					for(var i in target){
						if(xui.valid.isElement(target[i])){
							target[i]						= {"element":target[i],"disabled":disabled,"clear":clear,"zeronum":zeronum};
						}else if(xui.valid.isJson(target[i])){
							if(target[i].hasOwnProperty("id") && !xui.valid.isEmpty(target[i].id)){
								target[i].element			= xuic.__DOM.getElement(target[i].id);
								target[i].disabled			= (xui.valid.isEmpty(target[i].disabled)	? disabled	: target[i].disabled);
								target[i].clear				= (xui.valid.isEmpty(target[i].clear) 		? clear		: target[i].clear);
								target[i].zeronum			= (xui.valid.isEmpty(target[i].zeronum)		? zeronum	: target[i].zeronum);
							}
						}else if(xui.valid.isString(target[i])){
							target[i]						= {"element":xuic.__DOM.getElement(target[i]),"disabled":disabled,"clear":clear,"zeronum":zeronum};
						}
					}
					targetList								= target;
				}
				var controller								= null;
				for(var i in targetList){
					controller								= targetList[i].element.controller;
					if(!xui.valid.isEmpty(controller)){
						controller.setDisabled(targetList[i].disabled);
						if(targetList[i].clear){
							if((controller.config.format === "NUMBER" || controller.config.format === "DECIMAL") && targetList[i].zeronum){
								controller.setData("0");
							}else{
								controller.setData("");
							}
						}
					}else if(xui.valid.isElement(targetList[i].element)){
						if(targetList[i].disabled){
							targetList[i].element.classList.add("xui-disabled");
							targetList[i].element.setAttribute("disabled", true);
						}else{
							targetList[i].element.classList.remove("xui-disabled");
							targetList[i].element.removeAttribute("disabled");
						}
					}
				}
			}
		},
		/**
		 *
		 */
		enableElement : function(target){
			this.disableElement(target, false);
		},
		/**
		 *
		 */
		disableAll : function(root, disabled, clear, zeronum){
			if(!xui.valid.isEmpty(root)){
				if(xui.USE_JQUERY && root instanceof jQuery){
					root									= root[0];
				}
				var elementList								= xuic.__DOM.getElementsList(root);
				if(xui.valid.isArray(elementList) && elementList.length > 0){
					xui.util.disableElement(elementList, disabled, clear, zeronum);
				}
			}
		},
		/**
		 *
		 */
		enableAll : function(root){
			this.disableAll(root, false);
		},
		/**
		 *
		 */
		clearElementValue : function(target, zeronum, includeHidden, doCallFn){
			if(!xui.valid.isEmpty(target)){
				if(xui.USE_JQUERY && target instanceof jQuery){
					target									= target[0];
				}
				if(xui.valid.isEmpty(zeronum)){
					zeronum									= false;
				}
				if(xui.valid.isEmpty(includeHidden)){
					includeHidden							= true;
				}
				if(xui.valid.isEmpty(doCallFn)){
					doCallFn								= true;
				}
				var targetList								= [];
				if(!xui.valid.isArray(target)){
					if(xui.valid.isElement(target)){
						targetList.push({"element":target,"zeronum":zeronum,"includeHidden":includeHidden});
					}else if(xui.valid.isJson(target)){
						if(!target.hasOwnProperty("element") && target.hasOwnProperty("id") && !xui.valid.isEmpty(target.id)){
							target.element					= xuic.__DOM.getElement(target.id);
						}
						targetList.push(target);
					}else if(xui.valid.isString(target)){
						targetList.push({"element":xuic.__DOM.getElement(target),"zeronum":zeronum,"includeHidden":includeHidden});
					}
				}else{
					for(var i in target){
						if(xui.valid.isElement(target[i])){
							target[i]						= {"element":target[i],"zeronum":zeronum,"includeHidden":includeHidden};
						}else if(xui.valid.isJson(target[i])){
							if(!target[i].hasOwnProperty("element") && target[i].hasOwnProperty("id") && !xui.valid.isEmpty(target[i].id)){
								target[i].element			= xuic.__DOM.getElement(target[i].id);
								target[i].zeronum			= (xui.valid.isEmpty(target[i].zeronum)			? zeronum 		: target[i].zeronum);
								target[i].includeHidden		= (xui.valid.isEmpty(target[i].includeHidden)	? includeHidden : target[i].includeHidden);
							}
						}else if(xui.valid.isString(target[i])){
							target[i]						= {"element":xuic.__DOM.getElement(target[i]),"zeronum":zeronum,"includeHidden":includeHidden};
						}
					}
					targetList								= target;
				}
				var controller								= null;
				for(var i in targetList){
					controller								= targetList[i].element.controller;
					if(!xui.valid.isEmpty(controller)){
						if(controller.config.type === "hidden" && !targetList[i].includeHidden){
							continue;
						}
						if((controller.config.format === "NUMBER" || controller.config.format === "DECIMAL") && targetList[i].zeronum){
							controller.setData("0", doCallFn);
						}else{
							controller.setData("", doCallFn);
						}
					}
				}
			}
		},
		/**
		 *
		 */
		clearAll : function(root, zeronum, includeHidden, doCallFn){
			if(!xui.valid.isEmpty(root)){
				if(xui.USE_JQUERY && root instanceof jQuery){
					root									= root[0];
				}
				var elementList								= xuic.__DOM.getElementsList(root);
				if(xui.valid.isArray(elementList) && elementList.length > 0){
					xui.util.clearElementValue(elementList, zeronum, includeHidden, doCallFn);
				}
			}
		},
		/**
		 *
		 */
		visibleElement : function(target, visible){
			if(!xui.valid.isEmpty(target)){
				if(xui.USE_JQUERY && target instanceof jQuery){
					target									= target[0];
				}
				if(xui.valid.isEmpty(visible)){
					visible									= true;
				}
				var targetList								= [];
				if(!xui.valid.isArray(target)){
					if(xui.valid.isElement(target)){
						targetList.push({"element":target,"visible":visible});
					}else if(xui.valid.isJson(target)){
						if(target.hasOwnProperty("id") && !xui.valid.isEmpty(target.id)){
							target.element					= xuic.__DOM.getElement(target.id);
							target.visible					= (xui.valid.isEmpty(target.visible)		? visible	: target.visible);
						}
						targetList.push(target);
					}else if(xui.valid.isString(target)){
						targetList.push({"element":xuic.__DOM.getElement(target),"visible":visible});
					}
				}else{
					for(var i in target){
						if(xui.valid.isElement(target[i])){
							target[i]						= {"element":target[i],"visible":visible};
						}else if(xui.valid.isJson(target[i])){
							if(target[i].hasOwnProperty("id") && !xui.valid.isEmpty(target[i].id)){
								target[i].element			= xuic.__DOM.getElement(target[i].id);
								target[i].visible			= (xui.valid.isEmpty(target[i].visible)		? visible	: target[i].visible);
							}
						}else if(xui.valid.isString(target[i])){
							target[i]						= {"element":xuic.__DOM.getElement(target[i]),"visible":visible};
						}
					}
					targetList								= target;
				}
				var controller								= null;
				for(var i in targetList){
					controller								= targetList[i].element.controller;
					if(!xui.valid.isEmpty(controller)){
						controller.setVisible(targetList[i].visible);
					}else{
						if(xui.valid.isElement(targetList[i].element)){
							if(targetList[i].visible){
								targetList[i].element.classList.remove("xui-invisible");
							}else{
								targetList[i].element.classList.add("xui-invisible");
							}
						}
					}
				}
			}
		},
		invisibleElement : function(target){
			this.visibleElement(target, false);
		},
		/**
		 *
		 */
		visibleAll : function(root, visible){
			if(!xui.valid.isEmpty(root)){
				if(xui.USE_JQUERY && root instanceof jQuery){
					root									= root[0];
				}
				var elementList								= xuic.__DOM.getElementsList(root);
				if(xui.valid.isArray(elementList) && elementList.length > 0){
					xui.util.visibleElement(elementList, visible);
				}
			}
		},
		/**
		 *
		 */
		invisibleAll : function(root){
			this.visibleAll(root, false);
		},
		/**
		 *
		 */
		getNumberOnly : function(data){
			return xuic.__UTIL.getNumberOnly(data);
		},
		/**
		 * Set default delimiter character of date format in application
		 * @param	{String}{required}		text			Target string data to replace
		 * @param	{String}{required}		slice			Target character to replaced
		 * @param	{String}{required}		replace			Character to be replaced
		 * @returns	{String}								Replaced string data
		 * @author	HyosungITX Corp.
		 */
		replace : function(text, slice, replace){
			return xuic.__UTIL.replaceAll(text, slice, replace);
		},
		removeTag : function(text){
			return text.replace(xuic.__REGEXP.getCmmnRegexp("ALL_HTML_TAG"), "");
		},
		removeBlank : function(text){
			return text.replace(xuic.__REGEXP.getCmmnRegexp("ALL_BLANK"), "");
		},
		removeNumber : function(text){
			return text.replace(xuic.__REGEXP.getCmmnRegexp("ALL_NUMBER"), "");
		},
		onlyNumber : function(text){
			return text.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
		},
		removeKorean : function(text){
			return text.replace(xuic.__REGEXP.getCmmnRegexp("ALL_KOREAN"), "");
		},
		onlyKorean : function(text){
			return text.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_KOREAN"), "");
		},
		removeEnglish : function(text){
			return text.replace(xuic.__REGEXP.getCmmnRegexp("ALL_ENGLISH"), "");
		},
		onlyEnglish : function(text){
			return text.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_ENGLISH"), "");
		},
		removeSpecialChar : function(text){
			return text.replace(xuic.__REGEXP.getCmmnRegexp("ALL_SPECIAL_CHAR"), "");
		},
		onlySpecialChar : function(text){
			return text.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_SPECIAL_CHAR"), "");
		},

		/**
		 *
		 */
		rpad:function(data, length, extra){
			return xuic.__UTIL.rpad(data, length, extra);
		},
		/**
		 *
		 */
		lpad : function(data , length, extra){
			return xuic.__UTIL.lpad(data, length, extra);
		},
		/**
		 * Return byte size of string data
		 * @param	{String}{required}		data			Target string data to get byte size
		 * @returns	{Number}								Data byte size
		 * @author	HyosungITX Corp.
		 */
		getByte : function(data){
			var bytes										= 0;
			if(!xui.valid.isEmpty(data)){
				var len										= data.length;
				for(var i = 0; i < len; i++){
					if(escape(data.charAt(i)).length > 4){
						bytes								= (bytes + 2);
					}else{
						bytes++;
					}
				}
			}
			return bytes;
		},
		/**
		 *
		 */
		convertSecondToTimeformat : function(data, controlSecond){
			return xuic.__UTIL.convertSecondToTimeformat(data, controlSecond);
		},
		/**
		 *
		 */
		convertTimeformatToSecond : function(data){
			return xuic.__UTIL.convertTimeformatToSecond(data);
		},
		/**
		 * Get query string url parameters
		 * @return	{Json object}							Json data of converted query string
		 * @author	HyosungITX Corp.
		 */
		convertGetParamToJson : function(){
			var returnValue									= {};
			var split										= null;
			window.location.search.substr(1).split("&").forEach(function(item){
				split										= item.split("=");
				if(split.length === 2){
					returnValue[split[0]]					= split[1];
				}
			});
			return returnValue;
		},
		/**
		 *
		 */
		cleanXSS : function(data){
			if(!xui.valid.isEmpty(data)){
				data										= this._recursiveXSS(data, true);
			}
			return data;
		},
		/**
		 *
		 */
		restoreXSS : function(data){
			if(!xui.valid.isEmpty(data)){
				data										= this._recursiveXSS(data, false);
			}
			return data;
		},
		/**
		 *
		 */
		generateRandomChar : function(length, onlyNumber){
			return xuic.__UTIL.generateRandomChar(length, onlyNumber);
		},
		/**
		 *
		 */
		generateUUID : function(){
			return xuic.__UTIL.generateUUID();
		},
		/**
		 *
		 */
		getTreeData : function(data, rootNodeId, key, parentKey){
			var treeData									= null;
			if(xui.valid.isArray(data) && data.length > 0 && !xui.valid.isEmpty(rootNodeId) && !xui.valid.isEmpty(key) && !xui.valid.isEmpty(parentKey)){
				if(xui.valid.isJson(data[0]) && data[0].hasOwnProperty(key) && data[0].hasOwnProperty(parentKey)){
					var convertData							= {};
					var jsonData							= null;
					var nodeId								= "";
					for(var i = 0; i < data.length; i++){
						jsonData							= data[i];
						nodeId								= jsonData[key];
						convertData[nodeId]					= convertData[nodeId] || {};
						convertData[nodeId]["id"]			= nodeId;
						convertData[nodeId]["items"]		= convertData[nodeId]["items"] || [];
						convertData[nodeId]["parent"]		= jsonData[parentKey];
						for(var keyName in jsonData){
							convertData[nodeId][keyName]	= jsonData[keyName];
						}
						convertData[jsonData[parentKey]]	= convertData[jsonData[parentKey]] || {"items":[]};
						if(convertData[jsonData[parentKey]].hasOwnProperty("items")){
							convertData[jsonData[parentKey]].items.push(convertData[nodeId]);
						}
					}
					if(convertData.hasOwnProperty(rootNodeId)){
						convertData[rootNodeId]["id"]		= rootNodeId;
						convertData							= convertData[rootNodeId];
						treeData							= convertData.items;
					}
				}
			}
			return treeData;
		},
		/**
		 *
		 */
		copyObject : function(target, copy, deep){
			return xuic.__UTIL.copyObject(target, copy, deep);
		},
		/**
		 *
		 */
		sortJsonArray : function(data, sortOption){
			var returnValue									= data;
			var sortOptionArray								= [];
			if(xui.valid.isArray(sortOption)){
				sortOptionArray								= sortOption;
			}else if(xui.valid.isJson(sortOption)){
				sortOptionArray.push(sortOption);
			}else if(xui.valid.isString(sortOption)){
				var sortOptionJson							= new Object();
				sortOptionJson.name							= sortOption;
				sortOptionJson.orderby						= "asc";
				sortOptionArray.push(sortOptionJson);
			}
			if(sortOptionArray.length > 0){
				if(!sortOptionArray[0].hasOwnProperty("orderby")){
					sortOptionArray[0].orderby				= "asc";
				}
				returnValue									= xuic.__UTIL.multipleFieldSort(data, sortOptionArray);
			}
			return returnValue;
		},
		/**
		 *
		 */
		compare : function(data, compareData){
			return xuic.__UTIL.compareObject(data, compareData);
		},
		/**
		 * Return browser info
		 * @param	{String}{optional}		type			Browser information type code (1.KIND, 2.VER)
		 * @returns {String|Json object}	browserInfo
		 * 													1. case when type code is 'KIND'	{String}		Browser name
		 * 													2. case when type code is 'VER'		{String}		Browser version
		 * 													3. case when type code is undefined	{Json object}	both of Borwser name and version
		 * @author	HyosungITX Corp.
		 */
		getBrowserInfo : function(type){
			var browserInfo									= null;
			switch(type){
				case "KIND"	: browserInfo					= xuic.__CONFIG.browserName;											break;
				case "VER"	: browserInfo					= xuic.__CONFIG.browserVersion;										break;
				default		: browserInfo					= {"KIND":xuic.__CONFIG.browserName,"VER":xuic.__CONFIG.browserVersion};	break;
			};
			return browserInfo;
		},
		/**
		 *
		 */
		encryptSHA256 : function(data){
			return SHA256(data);
		},
		/**
		 *
		 */
		encryptMD5 : function(data){
			return md5(data);
		},
		/**
		 *
		 */
		encryptAES : function(data, encKey, byte){
			if(!xui.valid.isEmpty(data) && !xui.valid.isEmpty(encKey)){
				if(xui.valid.isEmpty(byte)){
					byte									= 256;
				}
				if((byte === 128 && encKey.length === 16) || (byte === 192 && encKey.length === 24) || (byte === 256 && encKey.length === 32)){
					GibberishAES.size(byte);
					data									= GibberishAES.aesEncrypt(data, encKey);
				}
			}
			return data;
		},
		/**
		 *
		 */
		decryptAES : function(data, encKey, byte){
			if(!xui.valid.isEmpty(data) && !xui.valid.isEmpty(encKey)){
				if(xui.valid.isEmpty(byte)){
					byte									= 256;
				}
				if((byte === 128 && encKey.length === 16) || (byte === 192 && encKey.length === 24) || (byte === 256 && encKey.length === 32)){
					GibberishAES.size(byte);
					data									= GibberishAES.aesDecrypt(data, encKey);
				}
			}
			return data;
		},
		/**
		 *
		 */
		binarySearch : function(data, propertyKey, doSort, rangeFirstValue, rangeLastValue){
			return xuic.__UTIL.binarySearch(data, propertyKey, doSort, rangeFirstValue, rangeLastValue);
		},
		/**
		 *
		 */
		debounce : function(func, delay){
			return xuic.__UTIL.debounce(func, delay);
		},
		/**
		 *
		 */
		throttle : function(func, limit){
			return xuic.__UTIL.throttle(func, limit);
		},
		_recursiveXSS : function(data, xss){
			return xuic.__UTIL._recursiveXSS(data, xss);
		},
		getUrlParam : function (sname) {
			var params = location.search.substr(location.search.indexOf("?") + 1);
			var sval = "";
			params = params.split("&");
			for (var i = 0; i < params.length; i++) {
				var temp = params[i].split("=");
				if ([temp[0]] == sname) { sval = temp[1]; }
			}
			return sval;
		},
		getXuiColor : function (xuiColorName) {
			return "rgb(var(--" + xuiColorName + "))";
		},
		getJsonDateTime : function (tDate) {
			var year, mon, day, hour, min, sec, milsec;
			var result 	= new xui.json();
			year 		= tDate.getFullYear();
			mon 		= xui.util.lpad((tDate.getMonth() + 1) 	+ "", 2, "0");
			day 		= xui.util.lpad(tDate.getDate() 		+ "", 2, "0");
			hour 		= xui.util.lpad(tDate.getHours() 		+ "", 2, "0");
			min 		= xui.util.lpad(tDate.getMinutes() 		+ "", 2, "0");
			sec 		= xui.util.lpad(tDate.getSeconds() 		+ "", 2, "0");
			milsec 		= tDate.getMilliseconds() + "";
			result.setString("strYear", (year + "-" + mon + "-" + day));
			result.setString("strHour", (hour + ":" + min + ":" + sec));
			result.setString("strMinu", (min + ":" + sec));
			return result;
		},
		mapArrToObjByKey : function(code, array){
			return array.reduce((accumulator, current) => {
				const key = "**" + current[code];

				// 키가 누적 객체에 존재하는지 확인합니다.
				if (!accumulator[key]) {
					// 존재하지 않으면 새로운 배열을 초기화합니다.
					accumulator[key] = [];
				}

				// 현재 객체를 해당 키에 추가합니다.
				accumulator[key].push(current);
				return accumulator;
			}, {});
		}
	};

	/*application static util feature api*/
	xui.util	= new _Util();
	_Util		= null;

	function _DateUtil(){
		this.patternDate	= {};
		this.timeGapSeconds	= 0;
	};
	_DateUtil.prototype	= {
		getYear : function(){
			return this.getToday(false).substr(0,4);
		},
		getMonth : function(format){
			var date		= this.getToday(false).substr(0,6);
			if(format){
				var regexp	= xuic.__REGEXP.getFormatRegexp("MONTH");
				date		= date.replace(regexp.regexp, regexp.pattern);
			}
			return date;
		},
		getToday : function(format){
			return this._getCalcDate("TODAY", format);
		},
		getYesterday : function(format){
			return this._getCalcDate("ONE_DAY_AGO", format);
		},
		getTomorrow : function(format){
			return this._getCalcDate("ONE_DAY_NEXT", format);
		},
		getThreeDaysAgo : function(format){
			return this._getCalcDate("THREE_DAYS_AGO", format);
		},
		getThreeDaysLater : function(format){
			return this._getCalcDate("THREE_DAYS_NEXT", format);
		},
		getLastWeek : function(format){
			return this._getCalcDate("SEVEN_DAYS_AGO", format);
		},
		getNextWeek : function(format){
			return this._getCalcDate("SEVEN_DAYS_NEXT", format);
		},
		getTenDaysAgo : function(format){
			return this._getCalcDate("TEN_DAYS_AGO", format);
		},
		getTenDaysLater : function(format){
			return this._getCalcDate("TEN_DAYS_NEXT", format);
		},
		getHalfMonthAgo : function(format){
			return this._getCalcDate("HALF_MONTH_AGO", format);
		},
		getHalfMonthLater : function(format){
			return this._getCalcDate("HALF_MONTH_NEXT", format);
		},
		getLastMonth : function(format){
			return this._getCalcDate("ONE_MONTH_AGO", format);
		},
		getNextMonth : function(format){
			return this._getCalcDate("ONE_MONTH_NEXT", format);
		},
		getTwoMonthsAgo : function(format){
			return this._getCalcDate("TWO_MONTHS_AGO", format);
		},
		getTwoMonthsLater : function(format){
			return this._getCalcDate("TWO_MONTHS_NEXT", format);
		},
		getThreeMonthsAgo : function(format){
			return this._getCalcDate("THREE_MONTHS_AGO", format);
		},
		getThreeMonthsLater : function(format){
			return this._getCalcDate("THREE_MONTHS_NEXT", format);
		},
		getHalfYearAgo : function(format){
			return this._getCalcDate("SIX_MONTHS_AGO", format);
		},
		getHalfYearLater : function(format){
			return this._getCalcDate("SIX_MONTHS_NEXT", format);
		},
		getLastYear : function(format){
			return this._getCalcDate("ONE_YEAR_AGO", format);
		},
		getNextYear : function(format){
			return this._getCalcDate("ONE_YEAR_NEXT", format);
		},
		getThisWeekBegin : function(format){
			return this._getCalcDate("THIS_WEEK_BEGIN", format);
		},
		getThisWeekEnd : function(format){
			return this._getCalcDate("THIS_WEEK_END", format);
		},
		getNow : function(timeonly, format){
			var now											= null;
			var param										= new xui.json();
			param.setURL(xui.com.getRequestPrefix() + "/getDateTimeNow.json");
			param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			var response									= xui.ajax.callSync(param);
			//if(!xui.extends.valid.checkResponse(response, false)){return now;}		// 데이터 위변조 확인 by 2021.04.08
			if(!response.getErrorFlag()){
				now											= response.getString("current");
				if(timeonly){
					now										= now.substr(8);
				}
				if(format){
					var regexp								= null;
					if(timeonly){
						regexp								= xuic.__REGEXP.getFormatRegexp("TIME_SECOND");
					}else{
						regexp								= xuic.__REGEXP.getFormatRegexp("DATETIME");
					}
					now										= now.replace(regexp.regexp, regexp.pattern);
				}
			}
			return now;
		},
		getLastDay : function(baseDate, format){
			var lastDate									= null;
			var param										= new xui.json();
			param.setURL(xui.com.getRequestPrefix() + "/getLastDayOfMonth.json");
			param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			param.setString("baseDate", baseDate);
			var response									= xui.ajax.callSync(param);
			if(!response.getErrorFlag()){
				lastDate									= response.getString("lastDate");
				if(format){
					var regexp								= null;
					regexp									= xuic.__REGEXP.getFormatRegexp("DATE");
					lastDate								= lastDate.replace(regexp.regexp, regexp.pattern);
				}
			}
			return lastDate;
		},

		/**
		 * strDiffType ex) y:연도, M:월, d:일, H:시간, m:분, s:초
		 */
		getDiff : function(begin, end, diffType){
			var diff										= 0;
			if(!xui.valid.isEmpty(begin) && !xui.valid.isEmpty(end)){
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/getDateTimeDiff.json");
				param.setString("beginDateTime"				,xui.util.getNumberOnly(begin));
				param.setString("endDateTime"				,xui.util.getNumberOnly(end));
				param.setString("diffType"					,diffType);
				param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
				var response								= xui.ajax.callSync(param);
				if(!response.getErrorFlag()){
					diff									= Math.round(response.getInt("DIFF_COUNT")*100)/100;
				}
			}
			return diff;
		},
		getCalc : function(baseDate, addType, addCount, delimiter){
			var date										= baseDate;
			if(!xui.valid.isEmpty(baseDate)){
				if(xui.valid.isEmpty(delimiter)){
					delimiter								= "";
				}
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/getAddDate.json");
				param.setString("baseDate"					,baseDate);
				param.setString("addType"					,addType);
				param.setString("delimiter"					,delimiter);
				param.setInt("addCount"						,addCount);
				param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
				var response								= xui.ajax.callSync(param);
				if(!response.getErrorFlag()){
					date									= response.getString("ADD_DATE");
				}
			}
			return date;
		},
		checkValidInterval : function(begin, end, allowMax, diffType){
			var isValid										= false;
			if(!xui.valid.isEmpty(begin) && !xui.valid.isEmpty(end)){
				begin										= xui.util.getNumberOnly(begin);
				end											= xui.util.getNumberOnly(end);
				if(begin.length > 0 && end.length > 0 && begin.length === end.length){
					begin									= parseInt(begin, 10);
					end										= parseInt(end, 10);
					if(begin <= end){
						if(!xui.valid.isEmpty(allowMax) && !xui.valid.isEmpty(diffType) && allowMax < this.getDiff(begin + "", end + "", diffType)){
							isValid							= false;
						}else{
							isValid							= true;
						}
					}
				}
			}
			return isValid;
		},
		convertDateToHumanDatetime : function(data, format){
			return xuic.__UTIL.convertDateToHumanDatetime(data, format);
		},
		convertHumanDatetimeToDate : function(data){
			return xuic.__UTIL.convertHumanDatetimeToDate(data);
		},
		convertUnixTimestampToHumanDatetime : function(data, format){
			return xuic.__UTIL.convertUnixTimestampToHumanDatetime(data, format);
		},
		convertHumanDatetimeToUnixTimestamp : function(data){
			return xuic.__UTIL.convertHumanDatetimeToUnixTimestamp(data);
		},
		/**
		 * Set Calculated date data
		 * @param	{Json object}{optional}	patternDate		Calculated date group
		 * private void
		 * @author	HyosungITX Corp.
		 */
		_load : function(patternDate){
			if(xui.valid.isEmpty(patternDate)){
				if(xui.com.isHyobeeLoginPage && xui.com.isHyobeeLoginPage()){
					this.patternDate							= this.patternDate || {};
					return;
				}
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/getPatternDateData.json");
				param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
				var response								= xui.ajax.callSync(param);
				if(!response.getErrorFlag()){
					this.patternDate						= response.getDataJsonObject();
				}
			}else if(xui.valid.isJson(patternDate)){
				this.patternDate							= patternDate;
			}
			if(this.patternDate.hasOwnProperty("CURRENT")){
				var now										= this.patternDate.CURRENT;
				now											= xui.util.getNumberOnly(now);
				if(now.length === 14){
					var current								= new Date();
					var regexp								= xuic.__REGEXP.getFormatRegexp("DATETIME");
					now										= new Date(now.replace(regexp.regexp, regexp.pattern));
					this.timeGapSeconds						= parseInt((now-current)/1000);
				}
			}
		},
		/**
		 *
		 */
		_convertDate : function(data){
			if(!xui.valid.isEmpty(data)){
				if(xui.valid.isString(data)){
					data									= xui.util.getNumberOnly(data);
					var regexp								= xuic.__REGEXP.getFormatRegexp("DATETIME");
					data									= new Date(data.replace(regexp.regexp, regexp.pattern));
				}else if(data instanceof Date){
					data									= data.getFullYear().toString() + xui.util.lpad((data.getMonth()+1).toString(), 2, "0") + xui.util.lpad(data.getDate().toString(), 2, "0");
				}
			}
			return data;
		},
		/**
		 *
		 */
		_getCalcDate : function(key, format){
			var date										= null;
			var curr										= new Date();
			curr.setSeconds(curr.getSeconds() + this.timeGapSeconds);
			if(top.xui.dateutil.patternDate.TODAY !== this._convertDate(curr)){
				top.xui.dateutil._load();
			}
			if(top.xui.dateutil.patternDate.hasOwnProperty(key)){
				date										= top.xui.dateutil.patternDate[key];
				if(format){
					var regexp								= xuic.__REGEXP.getFormatRegexp("DATE");
					date									= date.replace(regexp.regexp, regexp.pattern);
				}
			}
			return date;
		}
	};

	/*application static util feature api*/
	xui.dateutil	= new _DateUtil();
	_DateUtil		= null;

	xui.extends		= {}
	function _ExtendSession(){
		var sessionInfo = "";
	};
	_ExtendSession.prototype	= {
		getCompanyCode : function(){
			return this.getSessionInfoByKey("COMPANY_CODE");
		},
		getCompanyName : function(){
			return this.getSessionInfoByKey("COMPANY_NAME");
		},
		getUserId : function(){
			return this.getSessionInfoByKey("USER_ID");
		},
		getUserName : function(){
			return this.getSessionInfoByKey("USER_NAME");
		},
		getDeptCode : function(){
			return this.getSessionInfoByKey("DEPT_CODE");
		},
		getFullDeptCode : function(){
			return this.getSessionInfoByKey("FULL_DEPT_CODE");
		},
		getDeptName : function(){
			return this.getSessionInfoByKey("DEPT_NAME");
		},
		getFullDeptName : function(){
			return this.getSessionInfoByKey("FULL_DEPT_NAME");
		},
		getAccessIp : function(){
			return this.getSessionInfoByKey("ACCESS_IP");
		},
		getAdminAt : function(){
			return this.getSessionInfoByKey("ADMIN_AT");
		},
		getAuthGroup : function(){
			return this.getSessionInfoByKey("AUTH_GROUP_INFO");
		},
		getAuthGroupName : function(){
			return this.getSessionInfoByKey("AUTH_GROUP_NAME_INFO");
		},
		getAuthMenu : function(){
			return this.getSessionInfoByKey("AUTH_MENU_INFO");
		},
		getLoginDateTime : function(){
			return this.getSessionInfoByKey("LOGIN_DATETIME");
		},
		getLocalExtentionNumber	: function(){
			return this.getSessionInfoByKey("LOCAL_EXTENTION_NUMBER");
		},
		getManageCompanyCode : function(){
			return this.getSessionInfoByKey("MANAGE_COMPANY_CODE");
		},
		getMainMenuKey : function(){
			return this.getSessionInfoByKey("MAIN_MENU_KEY");
		},
		getMenuInfo : function(){
			return this.getSessionInfoByKey("MENU_INFO");
		},
		getEtc01Info : function(){
			return this.getSessionInfoByKey("ETC_01_INFO");
		},
		getEtc02Info : function(){
			return this.getSessionInfoByKey("ETC_02_INFO");
		},
		getEtc03Info : function(){
			return this.getSessionInfoByKey("ETC_03_INFO");
		},
		getEtc04Info : function(){
			return this.getSessionInfoByKey("ETC_04_INFO");
		},
		getEtc05Info : function(){
			return this.getSessionInfoByKey("ETC_05_INFO");
		},
		getDefaultValue01 : function(){
			return this.getSessionInfoByKey("DEFAULT_VALUE_01");
		},
		getDefaultValue02 : function(){
			return this.getSessionInfoByKey("DEFAULT_VALUE_02");
		},
		getDefaultValue03 : function(){
			return this.getSessionInfoByKey("DEFAULT_VALUE_03");
		},
		getDefaultValue04 : function(){
			return this.getSessionInfoByKey("DEFAULT_VALUE_04");
		},
		getDefaultValue05 : function(){
			return this.getSessionInfoByKey("DEFAULT_VALUE_05");
		},
		getSystemLimitationTime : function(){
			return this.getSessionInfoByKey("SYSTEM_LIMITATIONTIME");
		},
		getTargetCompanyCode : function(){
			return this.getSessionInfoByKey("TARGET_COMPANY_CODE");
		},
		getTargetCompanyName : function(){
			return this.getSessionInfoByKey("TARGET_COMPANY_NAME");
		},
		getJsessionId : function(){
			return this.getSessionInfoByKey("XTRM_JSESSION_ID");
		},
		getLanguage : function(){
			return this.getSessionInfoByKey("LANGUAGE_CODE");
		},
		getCorpCode : function(){
			return this.getSessionInfoByKey("CORP_CODE");
		},
		getCorpName : function(){
			return this.getSessionInfoByKey("CORP_NAME");
		},
		getOfficialPositionCode : function(){
			return this.getSessionInfoByKey("OFFICIAL_POSITION_CODE");
		},
		getOfficialPositionName : function(){
			return this.getSessionInfoByKey("OFFICIAL_POSITION_NAME");
		},
		getPgCode : function(){
			return this.getSessionInfoByKey("PG_CODE");
		},
		getPuCode : function(){
			return this.getSessionInfoByKey("PU_CODE");
		},
		getGbisPuCode : function(){
			return this.getSessionInfoByKey("GBIS_PU_CODE");
		},
		getGbisCorpCode : function(){
			return this.getSessionInfoByKey("GBIS_CORP_CODE");
		},
		getMainPageUrl : function(){
			var mainPageUrl = this.getSessionInfoByKey("MAIN_PAGE_URL");
			if(xui.valid.isEmpty(mainPageUrl)){
				mainPageUrl = xui.ajax.getProperty("MAIN_PAGE_URL","");
			}
			return mainPageUrl;
		},
		getErrorPageUrl : function(){
			var errorPageUrl = this.getSessionInfoByKey("ERROR_PAGE_URL");
			if(xui.valid.isEmpty(errorPageUrl)){
				errorPageUrl = xui.ajax.getProperty("ERROR_PAGE_URL","");
			}
			return errorPageUrl;
		},
		getSessionInfoByKey : function(key){
			var returnValue = "";
			if(!xui.valid.isEmpty(key) && (key === "ALL")){
				var param = new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/getSessionInfo.json");
				param.setString("key", key);
				param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
				var response = xui.ajax.callSync(param);
				if(!response.getErrorFlag()){
					this.sessionInfo  = response.getDataJsonArray("DATA")[0];
					returnValue = JSON.stringify(this.sessionInfo);
				}
			} else {
				if(!xui.valid.isEmpty(this.sessionInfo)){
					if(!xui.valid.isEmpty(this.sessionInfo[key])){returnValue = this.sessionInfo[key];}
				}
			}
			return returnValue;
		},
		loadLang : function(languageCode){
			if(!xui.valid.isEmpty(this.sessionInfo)){
				this.sessionInfo[key] = languageCode;
			}
		}
	};

	/*application session extention util feature api*/
	xui.extends.session	= new _ExtendSession();
	_ExtendSession		= null;

	function _ExtendMenu(){
		this.mainTabbarController							= null;
		this.authorizedMenu									= {};
		this.authorizedMenuTree								= [];
		this.mainMenuKey									= "";
		this.menuKey										= "";
		this.fnAuth											= {}
		this.fnAuth[xui.enum.AUTH_TYPE_SELECT.getCode()]	= false;
		this.fnAuth[xui.enum.AUTH_TYPE_SAVE.getCode()]		= false;
		this.fnAuth[xui.enum.AUTH_TYPE_CREATE.getCode()]	= false;
		this.fnAuth[xui.enum.AUTH_TYPE_UPDATE.getCode()]	= false;
		this.fnAuth[xui.enum.AUTH_TYPE_DELETE.getCode()]	= false;
		this.fnAuth[xui.enum.AUTH_TYPE_OUTPUT.getCode()]	= false;
		this.fnAuth[xui.enum.AUTH_TYPE_ETC.getCode()]		= false;
		this.fnAuth[xui.enum.AUTH_TYPE_ADMIN.getCode()]		= false;
		this.fnAuth[xui.enum.AUTH_TYPE_NONE.getCode()]		= true;
		var queryString										= xui.util.convertGetParamToJson();
		if(xui.valid.isJson(queryString) && queryString.hasOwnProperty("menuKey")){
			this.menuKey									= queryString.menuKey;
		}
		if(!xui.valid.isEmpty(this.menuKey)){
			if(!xui.valid.isEmpty(window.opener)){
				if(!xui.valid.isEmpty(opener.top.xui.extends.menu)){
					if(opener.top.xui.extends.menu.authorizedMenu.hasOwnProperty(this.menuKey)){
						this.fnAuth									= opener.top.xui.extends.menu.authorizedMenu[this.menuKey];
					}
				}
			}else{
				if(!xui.valid.isEmpty(top.xui.extends.menu)){
					if(top.xui.extends.menu.authorizedMenu.hasOwnProperty(this.menuKey)){
						this.fnAuth							= top.xui.extends.menu.authorizedMenu[this.menuKey];
					}
				}
			}
		}
	};
	_ExtendMenu.prototype	= {
		openMain : function(mainPageUrl, errorPageUrl){
			window.location.href = xui.com.getContextPath()  + mainPageUrl;
		},
		//하나의 탭으로 재사용하기 위해 isSelf 옵션을 추가하고 true 설정함 2014-11-14 LYH
		open : function(key, param, openIndex, isSingleTab){

			if(xui.valid.isEmpty(isSingleTab)){isSingleTab = false;}

			if(!xui.valid.isEmpty(key)){
				var menuInfo								= null;
				var menuTree								= top.xui.extends.menu.authorizedMenuTree;
				for(var i in menuTree){
					if(menuTree[i].menuKey === key){
						menuInfo							= menuTree[i];
						break;
					}
				}
				if(!xui.valid.isEmpty(menuInfo) && !xui.valid.isEmpty(menuInfo.menuPathInfo)){
					var menuUrl								= (xui.com.getContextPath() + menuInfo.menuPathInfo).replace("//","/");
					if(!xui.valid.isEmpty(menuInfo.programParamContents)){
						menuUrl								= menuUrl + (menuUrl.indexOf("?") >= 0 ? "&" : "?") + menuInfo.programParamContents;
					}
					//if(!xui.valid.isEmpty(param)){
					//	menuUrl								+= (menuUrl.indexOf("?") >= 0 ? "&" : "?") + param;
					//}
					menuUrl									+= (menuUrl.indexOf("?") >= 0 ? "&menuKey=" : "?menuKey=") + key;
					var viewType							= menuInfo.viewTargetCode;
					switch(viewType){
						case "POPUP"	:
							top.xui.com.openWindow(menuUrl, menuInfo.menuName, menuInfo.popupWidthSize, menuInfo.popupVerticalSize, true, false);
							break;
						case "URL"		:
							var width						= menuInfo.width;
							var height						= menuInfo.height;
							var intLeft						= (intFixedWidth	- width)	/ 2 / intSystemZoom + intDualScreenLeft - 200;
							var intTop						= (intFixedHeight	- height)	/ 2 / intSystemZoom + intDualScreenTop;
							intLeft += 200;
							if(xui.util.getBrowserInfo("KIND") === "MSIE"){
								intTop	-= 83;
								width	-= 4;
								height	-= 1;
							}
							var option						= "location=no,directories=no,status=no,toolbar=no,menubar=no,resizable=yes,width=" + width + ",height=" + height + ",top=" + intTop + ",left=" + intLeft;
							top.window.open(menuUrl, menuInfo.menuName, option);
							break;
						default			:
							var prevTabId					= top.xui.extends.menu.mainTabbarController.getActive();
							if(!xui.valid.isEmpty(prevTabId) && prevTabId !== "_blank"){
								var prevContentWindow		= xui.extends.menu.getMenuContentWindow(prevTabId);
								if(!xui.valid.isEmpty(prevContentWindow) && typeof(prevContentWindow.PageLeave) === "function"){
									prevContentWindow.PageLeave.call("");
								}
								//하나의 탭으로 재사용하기 위해 isSelf 옵션을 추가하고 true 설정함 2014-11-14 LYH
								if(isSingleTab){
									top.xui.extends.menu.mainTabbarController.close(prevTabId, true);
								}
							}
							top.xui.extends.menu.mainTabbarController.add({
								id			: key,
								text		: menuInfo.menuName,
								active		: true,
								close		: (key !== this.getMainKey()),
								tabCss		: (key === this.getMainKey() ? "xui-home-menu" : ""),
								iframe		: true,
								content		: menuUrl,
								index		: openIndex
							}, param);
					}
				}
			}
		},
		close : function(key){
			if(this.isExist(key)){
				top.xui.extends.menu.mainTabbarController.close(key);
			}
		},
		active : function(key, param){
			if(this.isExist(key)){
				top.xui.extends.menu.mainTabbarController.active(key, param);
			}
		},
		isOpen : function(key){
			var isOpen										= false;
			if(this.isExist(key)){
				isOpen										= top.xui.extends.menu.mainTabbarController.isExist(key);
			}
			return isOpen;
		},
		isExist : function(key){
			var isExist										= false;
			var menuTree									= top.xui.extends.menu.authorizedMenuTree;
			for(var i in menuTree){
				if(menuTree[i].menuKey === key){
					isExist									= true;
					break;
				}
			}
			return isExist;
		},
		getAllMenu : function(){
			return top.xui.extends.menu.authorizedMenuTree;
		},
		getMainKey : function(){
			return top.xui.extends.menu.mainMenuKey;
		},
		getKey : function(){
			return this.menuKey;
		},
		getFullKey : function(key){
			if(xui.valid.isEmpty(key)){
				key											= this.getKey();
			}
			return this._getData(key, "fullMenuKey");
		},
		getName : function(key){
		    console.log("111111");
			if(xui.valid.isEmpty(key)){
				key											= this.getKey();
			}
			return this._getData(key, "menuName");
		},
		getFullName : function(key){
			if(xui.valid.isEmpty(key)){
				key											= this.getKey();
			}
			return this._getData(key, "fullMenuName");
		},
		getDesc : function(key){
			if(xui.valid.isEmpty(key)){
				key											= this.getKey();
			}
			return this._getData(key, "menuDesc");
		},
		getPath : function(key){
			if(xui.valid.isEmpty(key)){
				key											= this.getKey();
			}
			return this._getData(key, "menuPathInfo");
		},
		getIcon : function(key){
			if(xui.valid.isEmpty(key)){
				key											= this.getKey();
			}
			return this._getData(key, "iconClassName");
		},
		getProgramParamContents : function(key){
			if(xui.valid.isEmpty(key)){
				key											= this.getKey();
			}
			return this._getData(key, "programParamContents");
		},
		checkMenuAuth : function(key){
			var hasAuth										= false;
			var menuTree									= top.xui.extends.menu.authorizedMenuTree;
			for(var i in menuTree){
				if(menuTree[i].menuKey === key){
					hasAuth									= true;
					break;
				}
			}
			return hasAuth;
		},
		checkValidAuth : function(key, authType){
			var valid										= false;
			if(xui.valid.isEmpty(key)){
				key											= this.getKey();
			}
			if(!xui.valid.isEmpty(authType) && this.fnAuth.hasOwnProperty(authType)){
				valid										= this.fnAuth[authType];
				if(!valid){
					if(authType === xui.enum.AUTH_TYPE_CREATE.getCode() || authType === xui.enum.AUTH_TYPE_UPDATE.getCode()){
						valid								= this.fnAuth[xui.enum.AUTH_TYPE_SAVE.getCode()];
					}else if(authType === xui.enum.AUTH_TYPE_SAVE.getCode()){
						valid								= (this.fnAuth[xui.enum.AUTH_TYPE_CREATE.getCode()] && this.fnAuth[xui.enum.AUTH_TYPE_UPDATE.getCode()]);
					}
				}
			}
			return valid;
		},
		getMenuContentWindow : function(key){
			var contentWindow								= null;
			if(xui.valid.isEmpty(key)){
				key											= this.getKey();
			}
			var menuFrame									= top.document.getElementById(key);
			if(!xui.valid.isEmpty(menuFrame) && menuFrame.tagName === "IFRAME"){
				contentWindow								= menuFrame.contentWindow;
			}
			return contentWindow;
		},
		load : function(menuData){
			if(typeof(menuData) !== "undefined"){
				var _this									= this;
				var authMenuInfoData						= null;
				var authMenuTreeData						= null;
				if(xui.valid.isXuiJson(menuData)){
					authMenuInfoData						= menuData.getDataJsonObject("AUTH_MENU_INFO");
					authMenuTreeData						= menuData.getDataJsonArray("AUTH_MENU_TREE");
					if(xui.valid.isJson(authMenuInfoData)){
						this.authorizedMenu					= authMenuInfoData;
					}
					if(xui.valid.isArray(authMenuTreeData)){
						this.authorizedMenuTree				= authMenuTreeData;
						// 메뉴 파라메터 정보가 있을 경우 &amp; 문자를 & 로 치환
						var size							= authMenuTreeData.length;
						var programParam					= null;
						for(var i = 0; i < size; i++){
							if(i == 0){
								this.mainMenuKey			= authMenuTreeData[0].mainMenuKey;
							}
							programParam					= this.authorizedMenuTree[i].programParamContents;
							if(!xui.valid.isEmpty(programParam)){
								this.authorizedMenuTree[i].programParamContents	= xui.util.replace(programParam, "&amp;", "&");
							}
						}
					}
				}else{
					var param								= new xui.json();
					param.setURL(xui.com.getRequestPrefix() + "/getAuthMenuData.json");
					param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
					param.setCallBack(function(response, request){
						if(!response.getErrorFlag()){
							var authMenuInfoData			= response.getDataJsonObject("AUTH_MENU_INFO");
							var authMenuTreeData			= response.getDataJsonArray("AUTH_MENU_TREE");
							if(xui.valid.isJson(authMenuInfoData)){
								_this.authorizedMenu		= authMenuInfoData;
							}
							if(xui.valid.isArray(authMenuTreeData)){
								_this.authorizedMenuTree	= authMenuTreeData;
								if(authMenuTreeData.length > 0){
									_this.mainMenuKey		= authMenuTreeData[0].mainMenuKey;
								}
							}
							if(typeof(menuData) === "function"){
								menuData.call(this);
							}
						}
					});
					xui.ajax.callService(param);
				}
			}
		},
		_loadMainTabbar : function(tabbarController){
			top.xui.extends.menu.mainTabbarController		= tabbarController;
		},
		_getData : function(menuKey, key){
			var menuData									= null;
			var menuTree									= this.getAllMenu();
			if(xui.valid.isArray(menuTree) && menuTree.length > 0){
				for(var i in menuTree){
					if(menuTree[i].menuKey === menuKey){
						menuData							= menuTree[i];
						if(!xui.valid.isEmpty(key)){
							if(menuData.hasOwnProperty(key)){
								menuData					= menuData[key];
							}else{
								menuData					= null;
							}
						}
						break;
					}
				}
			}
			return menuData;
		}
	};

	/*application menu extention util feature api*/
	xui.extends.menu	= new _ExtendMenu();
	_ExtendMenu			= null;

	function _ExtendSearch(){

	};
	_ExtendSearch.prototype	= {
		searchDept : function(deptInfo, useAt, callback){
			if(typeof(useAt) === "function"){
				callback									= useAt;
				useAt										= "";
			}
			if(!xui.valid.isEmpty(deptInfo) && typeof(callback) === "function"){
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/selectDeptData.json");
				param.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
				param.setString("deptInfo"					,deptInfo);
				param.setString("useAt"						,useAt);
				param.setCallBack(function(response, request){
					callback.call("", response);
				});
				xui.ajax.callService(param);
			}
		},
		searchUser : function(userInfo, useAt, callback){
			if(typeof(useAt) === "function"){
				callback									= useAt;
				useAt										= "";
			}
			if(!xui.valid.isEmpty(userInfo) && typeof(callback) === "function"){
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/selectUserData.json");
				param.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
				param.setString("userInfo"					,userInfo);
				param.setString("accountUseAt"				,useAt);
				param.setCallBack(function(response, request){
					callback.call("", response);
				});
				xui.ajax.callService(param);
			}
		},
		searchCustomer : function(searchParam, callback){
			if(!xui.valid.isEmpty(searchParam) && typeof(callback) === "function"){
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/selectCustomerData.json");
				param.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
				param.setString("custInfo"					,searchParam.custInfo);
				param.setString("puCode"					,searchParam.puCode);
				param.setCallBack(function(response, request){
					callback.call("", response);
				});
				xui.ajax.callService(param);
			}
		}
	};

	/*application common search extention util feature api*/
	xui.extends.search		= new _ExtendSearch();
	_ExtendSearch			= null;

	function _ExtendPopup(){
		/*
		 * header, icon, title, param, width, height
		 */
		this.windowList		= {};
	};
	_ExtendPopup.prototype	= {
        openGbisPop : function(config, callbackFn){
            if(typeof(config) === "function"){
                callbackFn                                  = config;
                config                                      = {};
            }else if(xui.valid.isEmpty(config)){
                config                                      = {};
            }
            config.type                                     = "dialog";
            config.modal                                    = true;
            config.resizable                                = false;
            config.header                                   = xui.valid.isEmpty(config.header)  ?   true            :   config.header;
            config.title                                    = xui.valid.isEmpty(config.title)   ?   "No Title"      :   config.title;
            config.multi                                    = xui.valid.isEmpty(config.multi)   ?   false           :   config.multi;
            config.param                                    = xui.valid.isEmpty(config.param)   ?   null            :   config.param;
            config.width                                    = xui.valid.isEmpty(config.width)   ?   1000            :   config.width;
            config.height                                   = xui.valid.isEmpty(config.height)  ?   700             :   config.height;
            config.callWindow                               = window;
            config.callback                                 = callbackFn;
            config.popName                                  = xui.valid.isEmpty(config.popName) ? ""                :   config.popName;
            config.buttons                                  = xui.valid.isEmpty(config.buttonActive) || config.buttonActive === true ?[
	                {
	                    id          : "btnSelect",
	                    text        : xui.message.get("gbis.LBL_SEARCH"),
	                    authType    : xui.enum.AUTH_TYPE_NONE.getCode(),
	                    click       : function(){
	                        var xuiWindowObject                 = top.xui.extends.popup.windowList[config.popName+"Pop"];
	                        var pageVariable                    = xuiWindowObject.contentWindow[config.popName+"Pop"];
	                        pageVariable.selectItem();
	                    }
	                }
            ] : "";
            this._openPopupDialog1(config.popName+"Pop", config);
        },
		openDeptPop : function(config, callbackFn){
			if(typeof(config) === "function"){
				callbackFn									= config;
				config										= {};
			}else if(xui.valid.isEmpty(config)){
				config										= {};
			}
			config.type										= "dialog";
			config.modal									= true;
			config.resizable								= false;
			config.header									= xui.valid.isEmpty(config.header)	?	true			:	config.header;
			config.title									= xui.valid.isEmpty(config.title)	?	xui.enum.ORGANIZATION_INFORMATION_SEARCH.getName()	:	config.title;
			config.multi									= xui.valid.isEmpty(config.multi)	?	false			:	config.multi;
			config.param									= xui.valid.isEmpty(config.param)	?	null			:	config.param;
			config.width									= xui.valid.isEmpty(config.width)	?	720				:	config.width;
			config.height									= xui.valid.isEmpty(config.height)	?	740				:	config.height;
			config.callback									= callbackFn;
			config.sectionCode								= "dept";
			config.buttons									= [
				{
					id			: "btnSelect",
					text		: xui.enum.SELECT.getName(),
					authType	: xui.enum.AUTH_TYPE_NONE.getCode(),
					click		: function(){
						var xuiWindowObject					= top.xui.extends.popup.windowList["deptUserPop"];
						var pageVariable					= xuiWindowObject.contentWindow["deptUserPop"];
						pageVariable.selectItem();
					}
				}
			];
			this._openPopupDialog("deptUserPop", config);
		},
		openDeptUserPop : function(config, callbackFn){
			if(typeof(config) === "function"){
				callbackFn									= config;
				config										= {};
			}else if(xui.valid.isEmpty(config)){
				config										= {};
			}
			config.type										= "dialog";
			config.modal									= true;
			config.resizable								= false;
			config.header									= xui.valid.isEmpty(config.header)	?	true			:	config.header;
			config.title									= xui.valid.isEmpty(config.title)	?	xui.enum.USER_INFORMATION_INQUIRY.getName()	:	config.title;
			config.multi									= xui.valid.isEmpty(config.multi)	?	false			:	config.multi;
			config.param									= xui.valid.isEmpty(config.param)	?	null			:	config.param;
			config.width									= xui.valid.isEmpty(config.width)	?	720				:	config.width;
			config.height									= xui.valid.isEmpty(config.height)	?	740				:	config.height;
			config.callback									= callbackFn;
			config.sectionCode								= "user";
			config.buttons									= [
				{
					id			: "btnSelect",
					text		: xui.enum.SELECT.getName(),
					authType	: xui.enum.AUTH_TYPE_NONE.getCode(),
					click		: function(){
						var xuiWindowObject					= top.xui.extends.popup.windowList["deptUserPop"];
						var pageVariable					= xuiWindowObject.contentWindow["deptUserPop"];
						pageVariable.selectItem();
					}
				}
			];
			this._openPopupDialog("deptUserPop", config);
		},
		openUserPop : function(config, callbackFn){
			if(typeof(config) === "function"){
				callbackFn									= config;
				config										= {};
			}else if(xui.valid.isEmpty(config)){
				config										= {};
			}
			config.type										= "dialog";
			config.modal									= true;
			config.resizable								= false;
			config.header									= xui.valid.isEmpty(config.header)	?	true			:	config.header;
			config.title									= xui.valid.isEmpty(config.title)	?	xui.enum.USER_INFORMATION.getName()	:	config.title;
			config.multi									= xui.valid.isEmpty(config.multi)	?	false			:	config.multi;
			config.param									= xui.valid.isEmpty(config.param)	?	null			:	config.param;
			config.width									= xui.valid.isEmpty(config.width)	?	720				:	config.width; // 600
			config.height									= xui.valid.isEmpty(config.height)	?	722				:	config.height; // 740
			config.callback									= callbackFn;
			config.buttons									= [
				{
					id			: "btnSelect",
					text		: xui.enum.SELECT.getName(),
					authType	: xui.enum.AUTH_TYPE_NONE.getCode(),
					click		: function(){
						var xuiWindowObject					= top.xui.extends.popup.windowList["userPop"];
						var pageVariable					= xuiWindowObject.contentWindow["userPop"];
						pageVariable.selectItem();
					}
				}
			];
			this._openPopupDialog("userPop", config);
		},
		openCustomerPop : function(config, callbackFn){
			if(typeof(config) === "function"){
				callbackFn									= config;
				config										= {};
			}else if(xui.valid.isEmpty(config)){
				config										= {};
			}
			config.type										= "dialog";
			config.modal									= true;
			config.resizable								= false;
			config.header									= xui.valid.isEmpty(config.header)	?	true			:	config.header;
			config.title									= xui.valid.isEmpty(config.title)	?	xui.enum.CUSTOMER_INFORMATION.getName()	:	config.title;
			config.multi									= xui.valid.isEmpty(config.multi)	?	false			:	config.multi;
			config.param									= xui.valid.isEmpty(config.param)	?	null			:	config.param;
			config.width									= xui.valid.isEmpty(config.width)	?	810				:	config.width;
			config.height									= xui.valid.isEmpty(config.height)	?	740				:	config.height;
			config.callWindow							   = window;
			config.callback									= callbackFn;
			config.buttons									= [
				{
					id			: "btnSelect",
					text		: xui.enum.SELECT.getName(),
					authType	: xui.enum.AUTH_TYPE_NONE.getCode(),
					click		: function(){
						var xuiWindowObject					= top.xui.extends.popup.windowList["customerPop"];
						var pageVariable					= xuiWindowObject.contentWindow["customerPop"];
						pageVariable.selectItem();
					}
				}
			];
			this._openPopupDialog("customerPop", config);
		},
		openTeamPop : function(config, callbackFn){
			if(typeof(config) === "function"){
				callbackFn									= config;
				config										= {};
			}else if(xui.valid.isEmpty(config)){
				config										= {};
			}
			config.type										= "dialog";
			config.modal									= true;
			config.resizable								= false;
			config.header									= xui.valid.isEmpty(config.header)	?	true			:	config.header;
			config.title									= xui.valid.isEmpty(config.title)	?	xui.enum.TEAM_INFORMATION.getName()	:	config.title;
			config.multi									= xui.valid.isEmpty(config.multi)	?	false			:	config.multi;
			config.param									= xui.valid.isEmpty(config.param)	?	null			:	config.param;
			config.width									= xui.valid.isEmpty(config.width)	?	1000			:	config.width;
			config.height									= xui.valid.isEmpty(config.height)	?	700				:	config.height;
			config.callWindow							   = window;
			config.callback									= callbackFn;
			config.popName								  = xui.valid.isEmpty(config.popName) ?	""					:	config.popName;
			config.buttons									= [
				{
					id			: "btnSelect",
					text		: xui.enum.SELECT.getName(),
					authType	: xui.enum.AUTH_TYPE_NONE.getCode(),
					click		: function(){
						var xuiWindowObject					= top.xui.extends.popup.windowList["teamPop"+config.popName];
						var pageVariable					= xuiWindowObject.contentWindow["teamPop"+config.popName];
						pageVariable.selectItem();
					}
				}
			];
			this._openPopupDialog("teamPop"+config.popName, config);
		},
		openAuthorPop : function(config, callbackFn){
			if(typeof(config) === "function"){
				callbackFn									= config;
				config										= {};
			}else if(xui.valid.isEmpty(config)){
				config										= {};
			}
			config.type										= "dialog";
			config.modal									= true;
			config.resizable								= false;
			config.header									= xui.valid.isEmpty(config.header)	?	true			:	config.header;
			config.title									= xui.valid.isEmpty(config.title)	?	xui.enum.AUTHOR_INFORMATION.getName()	:	config.title;
			config.multi									= xui.valid.isEmpty(config.multi)	?	false			:	config.multi;
			config.param									= xui.valid.isEmpty(config.param)	?	null			:	config.param;
			config.width									= xui.valid.isEmpty(config.width)	?	910				:	config.width;
			config.height									= xui.valid.isEmpty(config.height)	?	740				:	config.height;
			config.callWindow							   = window;
			config.callback									= callbackFn;
			config.buttons									= [
				{
					id			: "btnSelect",
					text		: xui.enum.SELECT.getName(),
					authType	: xui.enum.AUTH_TYPE_NONE.getCode(),
					click		: function(){
						var xuiWindowObject					= top.xui.extends.popup.windowList["authorPop"];
						var pageVariable					= xuiWindowObject.contentWindow["authorPop"];
						pageVariable.selectItem();
					}
				}
			];
			this._openPopupDialog("authorPop", config);
		},
		openPasswordAuthenticationPop : function(config, callbackFn){
			if(typeof(config) === "function"){
				callbackFn									= config;
				config										= {};
			}else if(xui.valid.isEmpty(config)){
				config										= {};
			}
			config.type										= "dialog";
			config.modal									= true;
			config.resizable								= false;
			config.header									= xui.valid.isEmpty(config.header)	?	false			:	config.header;
			config.param									= xui.valid.isEmpty(config.param)	?	null			:	config.param;
			config.width									= xui.valid.isEmpty(config.width)	?	360				:	config.width;
			config.height									= xui.valid.isEmpty(config.height)	?	248				:	config.height;
			config.callback									= callbackFn;
			this._openPopupDialog("pwAuthPop", config);
		},
		openFontIconSearchPop : function(config, callbackFn){
			if(typeof(config) === "function"){
				callbackFn									= config;
				config										= {};
			}else if(xui.valid.isEmpty(config)){
				config										= {};
			}
			config.type										= "dialog";
			config.modal									= true;
			config.resizable								= false;
			config.header									= xui.valid.isEmpty(config.header)	?	true			:	config.header;
			config.title									= xui.valid.isEmpty(config.title)	?	xui.enum.ICON_SEARCH.getName()		:	config.title;
			config.param									= xui.valid.isEmpty(config.param)	?	null			:	config.param;
			config.width									= xui.valid.isEmpty(config.width)	?	1002			:	config.width;
			config.height									= xui.valid.isEmpty(config.height)	?	565				:	config.height;
			config.callback									= callbackFn;
			config.buttons									= [
				{
					id			: "btnSelect",
					text		: xui.enum.SELECT.getName(),
					authType	: xui.enum.AUTH_TYPE_NONE.getCode(),
					click		: function(){
						var xuiWindowObject					= top.xui.extends.popup.windowList["fontIconPop"];
						var pageVariable					= xuiWindowObject.contentWindow["fontIconPop"];
						pageVariable.selectItem();
					}
				}
			];
			this._openPopupDialog("fontIconPop", config);
		},
		openMenuFileExplorerPop : function(config, callbackFn){
			if(typeof(config) === "function"){
				callbackFn									= config;
				config										= {};
			}else if(xui.valid.isEmpty(config)){
				config										= {};
			}
			config.type										= "dialog";
			config.modal									= true;
			config.resizable								= false;
			config.header									= xui.valid.isEmpty(config.header)	?	true			:	config.header;
			config.title									= xui.valid.isEmpty(config.title)	?	xui.enum.MENU_EXPLORER.getName()		:	config.title;
			config.param									= xui.valid.isEmpty(config.param)	?	null			:	config.param;
			config.width									= xui.valid.isEmpty(config.width)	?	500				:	config.width;
			config.height									= xui.valid.isEmpty(config.height)	?	600				:	config.height;
			config.callback									= callbackFn;
			config.buttons									= [
				{
					id			: "btnSelect",
					text		: xui.enum.SELECT.getName(),
					authType	: xui.enum.AUTH_TYPE_NONE.getCode(),
					click		: function(){
						var xuiWindowObject					= top.xui.extends.popup.windowList["menuFileExplorerPop"];
						var pageVariable					= xuiWindowObject.contentWindow["menuFileExplorerPop"];
						pageVariable.selectItem();
					}
				}
			];
			this._openPopupDialog("menuFileExplorerPop", config);
		},
		openServerLogFileExplorerPop : function(config, callbackFn){
			if(typeof(config) === "function"){
				callbackFn									= config;
				config										= {};
			}else if(xui.valid.isEmpty(config)){
				config										= {};
			}
			config.type										= "dialog";
			config.modal									= true;
			config.resizable								= false;
			config.header									= xui.valid.isEmpty(config.header)	?	true			:	config.header;
			config.title									= xui.valid.isEmpty(config.title)	?	xui.enum.LOG_FILE_EXPLORER.getName()	:	config.title;
			config.param									= xui.valid.isEmpty(config.param)	?	null			:	config.param;
			config.width									= xui.valid.isEmpty(config.width)	?	1000			:	config.width;
			config.height									= xui.valid.isEmpty(config.height)	?	656				:	config.height;
			config.callback									= callbackFn;
			this._openPopupDialog("serverLogFileExplorerPop", config);
		},
		excelReasonPop : function(config, callbackFn){
			if (typeof (config) === "function") {
				callbackFn 		= config;
				config 			= {};
			} else if (xui.valid.isEmpty(config)) {
				config 			= {};
			}
			config.type 		= "dialog";
			config.modal 		= true;
			config.resizable 	= false;
			config.header 		= xui.valid.isEmpty(config.header) ? true : config.header;
			config.title 		= xui.valid.isEmpty(config.title) ? xui.enum.EXCEL_DOWNLOAD.getName() : config.title;
			config.param 		= xui.valid.isEmpty(config.param) ? null : config.param;
			config.width 		= xui.valid.isEmpty(config.width) ? 400 : config.width;
			config.height 		= xui.valid.isEmpty(config.height) ? 380 : config.height;
			config.callback 	= callbackFn;
			this._openPopupDialog("excelReasonPop", config);
		},
		openMenuPop : function(config, callbackFn){
			if (typeof (config) === "function") {
				callbackFn 		= config;
				config 			= {};
			} else if (xui.valid.isEmpty(config)) {
				config 			= {};
			}
			config.type 		= "dialog";
			config.modal 		= true;
			config.resizable 	= false;
			config.header 		= xui.valid.isEmpty(config.header) 	? true 				: config.header;
			config.title 		= xui.valid.isEmpty(config.title) 	? xui.enum.MENU_INFORMATION_SEARCH.getName() 	 : config.title;
			config.multi 		= xui.valid.isEmpty(config.multi) 	? false 			: config.multi;
			config.param 		= xui.valid.isEmpty(config.param) 	? null 				: config.param;
			config.width 		= xui.valid.isEmpty(config.width) 	? 550 				: config.width;
			config.height 		= xui.valid.isEmpty(config.height) 	? 750 				: config.height;
			config.callback 	= callbackFn;
			config.sectionCode 	= "menu";
			config.buttons 		= [
				{
					id: "btnSelect",
					text: xui.enum.SELECT.getName(),
					authType: xui.enum.AUTH_TYPE_NONE.getCode(),
					click: function () {
						var xuiWindowObject = top.xui.extends.popup.windowList["menuPop"];
						var pageVariable 	= xuiWindowObject.contentWindow["menuPop"];
						pageVariable.selectItem();
					}
				}
			];
			this._openPopupDialog("menuPop", config);
		},
		openSwitchCompanyPop : function(config, callbackFn) {
			if (typeof (config) === "function") {
				callbackFn 		= config;
				config 			= {};
			} else if (xui.valid.isEmpty(config)) {
				config 			= {};
			}
			config.type 		= "dialog";
			config.modal 		= true;
			config.resizable 	= false;
			config.header 		= xui.valid.isEmpty(config.header) ? true : config.header;
			config.title 		= xui.valid.isEmpty(config.title) ? xui.enum.COMPANY_INFORMATION_INQUIRY.getName() : config.title;
			config.multi 		= xui.valid.isEmpty(config.multi) ? false : config.multi;
			config.param 		= xui.valid.isEmpty(config.param) ? null : config.param;
			config.width 		= xui.valid.isEmpty(config.width) ? 550 : config.width;
			config.height 		= xui.valid.isEmpty(config.height) ? 700 : config.height;
			config.callback 	= callbackFn;
			config.buttons = [
				{
					id: "btnSelect",
					text: xui.enum.SELECT.getName(),
					authType: xui.enum.AUTH_TYPE_NONE.getCode(),
					click: function () {
						var xuiWindowObject = top.xui.extends.popup.windowList["switchCompanyPop"];
						var pageVariable 	= xuiWindowObject.contentWindow["switchCompanyPop"];
						pageVariable.selectItem();
					}
				}
			];
			this._openPopupDialog("switchCompanyPop", config);
		},
		_openPopupDialog : function(fileName, config){
			var xuiWindow									= null;
			if(xui.valid.isEmpty(top)) return;

			if(top.xui.extends.popup.windowList.hasOwnProperty(fileName)){
				delete top.xui.extends.popup.windowList[fileName];
				top.window.$(".dhx_popup").remove();
				top.window.$(".dhx_window__overlay").remove();
				top.window.$(".dhx_").remove();
			}


			if(top.xui.extends.popup.windowList.hasOwnProperty(fileName)){
				xuiWindow									= top.xui.extends.popup.windowList[fileName];
				for(var key in config){
					// contentWindow null 방어코드
					if(xuiWindow.contentWindow){
						if(xuiWindow.contentWindow.mobjConfig.hasOwnProperty(key)){
							xuiWindow.contentWindow.mobjConfig[key]	= config[key];
						}
					}else{
						return;
					}
				}
				xuiWindow.config.window.open();
			}else{
				var popupContainer							= top.document.createElement("div");
				popupContainer.id							= fileName + "_xuiwindow";
				top.document.body.appendChild(popupContainer);
				xuiWindow									= new top.xui.module.dialog({
					header			: config.header,
					title			: config.title,
					icon			: config.icon,
					url				: "webapps/xs/webbase/pop/" + fileName + ".jsp?menuKey=" + xui.extends.menu.getKey() + "&popupAt=Y",
					width			: config.width,
					height			: config.height,
					modal			: config.modal,
					resizable		: config.resizable,
					buttons			: config.buttons,
					closable		: true,
					movable			: true,
					onContentLoad	: function(name, param, contentWindow){
						var pageVariable					= contentWindow[fileName];
						var popupObject						= top.xui.extends.popup.windowList[fileName];
						popupObject.contentWindow			= contentWindow;
						contentWindow.mobjConfig			= popupObject.config;
					},
					open			: function(openParam){
						var xuiWindowObject					= top.xui.extends.popup.windowList[fileName];
						// contentWindow null 방어코드
						if(xuiWindowObject.contentWindow){
							var pageVariable					= xuiWindowObject.contentWindow[fileName];
							if(typeof(pageVariable.openPageWindow) === "function"){
								pageVariable.openPageWindow(fileName);
							}
						}else{
							return;
						}
					},
					close			: function(closeParam, openParam){
						if(top.xui.extends.popup.windowList.hasOwnProperty(fileName)){
							var xuiWindowObject					= top.xui.extends.popup.windowList[fileName];
							// contentWindow null 방어코드
							if(xuiWindowObject.contentWindow){
								var pageVariable					= xuiWindowObject.contentWindow[fileName];
								if(typeof(xuiWindowObject.config.callback) === "function"){
									xuiWindowObject.config.callback.call("", closeParam);
								}
							}else{
								return;
							}
						} else{
							return;
						}
					}
				}, popupContainer);
				config.window										= xuiWindow;
				top.xui.extends.popup.windowList[fileName]			= {};
				top.xui.extends.popup.windowList[fileName].config	= config;
				xuiWindow											= top.xui.extends.popup.windowList[fileName];
			}
		},

		//20251216 추가
		_openPopupDialog1: function(fileName, config) {
            if (!top)       return;

            var popupMap    = top.xui.extends.popup.windowList;
            var existing    = popupMap[fileName];

            // 1. 이미 존재 → 재사용
            if (existing) {

                // config 갱신
                for (var k in config) {
                    existing.config[k] = config[k];
                }

                var winEl   = existing.container;
                if (!winEl) return;

                winEl.classList.remove("xui-invisible");
                existing.window.open();

                // iframe 내부 openPageWindow 호출
                var iframe  = winEl.querySelector("iframe");
                if (iframe && iframe.contentWindow) {
                    var page = iframe.contentWindow[fileName];
                    if (page && typeof page.openPageWindow === "function") {
                        page.openPageWindow(fileName);
                    }
                }
                return;
            }

            // 2. 최초 생성
            var popupContainer  = document.createElement("div");
            popupContainer.id   = fileName + "_xuiwindow";
            top.document.body.appendChild(popupContainer);

            var xuiWindow = new top.xui.module.dialog({
                header              : config.header,
                title               : config.title,
                icon                : config.icon,
                url                 : "webapps/xs/webbase/pop/" + fileName + ".jsp?menuKey=" + xui.extends.menu.getKey() + "&popupAt=Y",
                width               : config.width,
                height              : config.height,
                modal               : config.modal,
                resizable           : config.resizable,
                buttons             : config.buttons,
                closable            : true,
                movable             : true,
                onContentLoad       : function(_, __, contentWindow) {
                    popupMap[fileName].contentWindow = contentWindow;
                    contentWindow.mobjConfig = popupMap[fileName].config;
                },
                open                : function() {
                    var obj = popupMap[fileName];
                    obj.container.classList.remove("xui-invisible");

                    var iframe = obj.container.querySelector("iframe");
                    if (iframe && iframe.contentWindow) {
                        var page = iframe.contentWindow[fileName];
                        if (page && typeof page.openPageWindow === "function") {
                            page.openPageWindow(fileName);
                        }
                    }
                },
                close               : function(param) {
                    var obj = popupMap[fileName];
                    obj.container.classList.add("xui-invisible");

                    if (typeof obj.config.callback === "function") {
                        obj.config.callback(param);
                    }
                }
            }, popupContainer);

            config.window					= xuiWindow;
            popupMap[fileName]              = {
                config              : config,
                window              : xuiWindow,
                container           : popupContainer,   // 핵심
                contentWindow       : null
            };
            xuiWindow                       = popupMap[fileName];
        },



		_openPopupWindow : function(){

		}
	};

	/*application common popup extention util feature api*/
	xui.extends.popup		= new _ExtendPopup();
	_ExtendPopup			= null;

	function _ExtendValid(){

	};
	_ExtendValid.prototype	= {
		checkPasswordAuthentication : function(callbackFn){
			xui.extends.popup.openPasswordAuthenticationPop(null, callbackFn);
		},
		/* 서버 -> view 응답데이터 위변조 체크 by 전주원 2021.04.08 */
		checkResponse : function(response, isTimeCheck) {
			var header 			= response.jsonData.HEADER;
			var strHeaderKey	= "";
			var strEncryptKey	= "";
			var strRequestId	= "";
			var resRequestId	= "";
			var blTimeCheck		= true;

			if(!xui.valid.isEmpty(isTimeCheck)){
				blTimeCheck		= isTimeCheck;
			}
			for (var key in header) {
				if ( key !== "REQUEST_ID" ) {
					strHeaderKey	+= key;
					strRequestId	+= header[key];
				}
			}
			strRequestId = strRequestId.replace(/ /gi, "+");
			for(var i = 0; i < 5; i++){
				strEncryptKey += strHeaderKey;
			}
			if (strEncryptKey.length > 32) {
				strEncryptKey = strEncryptKey.substring(0, 32);
			}
			strRequestId 	= xui.util.encryptAES(strRequestId, strEncryptKey);
			if (xui.valid.isEmpty(strRequestId) || xui.valid.isEmpty(header["REQUEST_ID"])) {
				xui.dialog.error(xui.enum.WRONG_ACCESS.getName(), xui.enum.ERROR.getName());
				return false;
			}
			strRequestId	= strRequestId.substring(0, 100);
			resRequestId	= header["REQUEST_ID"].substring(0, 100);
			if ( strRequestId !== resRequestId ) {
				xui.dialog.error(xui.enum.WRONG_ACCESS.getName(), xui.enum.ERROR.getName());
				return false;
			}
			// timeCheck 추가
			var nowDateTime = "";
			if (blTimeCheck) {
				nowDateTime = xui.dateutil.getNow();
				if(!xui.valid.isEmpty(response.jsonData.HEADER.CURRENT_DT)
						&& response.jsonData.HEADER.CURRENT_DT !== nowDateTime) {
					xui.dialog.error(xui.enum.WRONG_ACCESS.getName(), xui.enum.ERROR.getName());
					return false;
				}
			}
			return true;
		}

	};

	/*application common popup extention util feature api*/
	xui.extends.valid		= new _ExtendValid();
	_ExtendValid			= null;

	/*application common json constructor*/
	xui.json	= function(json){
		if(xui.valid.isEmpty(json)){
			json		= {"HEADER":{},"DATA":[{}]};
		}else if(xui.valid.isString(json) && xui.valid.isJson(json, true)){
			json		= JSON.parse(json);
		}
		if(!xui.valid.isEmpty(json.jsonData)){
			json		= json.jsonData;
		}
		this.jsonData	= json;
		this._createBaseGroup();

		return this;
	};
	xui.json.prototype	= {
		setJson : function(json){
			if(xui.valid.isJson(json) && json.hasOwnProperty("HEADER") && json.hasOwnProperty("DATA")){
				this.jsonData								= json;
			}
		},
		getJson : function(){
			return this.jsonData;
		},
		setHeader : function(key, value){
			this.jsonData.HEADER[key]						= value;
		},
		getHeader : function(key){
			var value										= "";
			if(this.jsonData.HEADER.hasOwnProperty(key)){
				value										= this.jsonData.HEADER[key];
			}
			return value;
		},
		setHeaderJson : function(json){
			if(xui.valid.isJson(json)){
				this.jsonData.HEADER						= json;
			}
		},
		getHeaderJson : function(){
			return this.jsonData.HEADER;
		},
		setAuthType : function(value){
			this.setHeader("AUTH_TYPE", value);
		},
		getAuthType : function(){
			return this.getHeader("AUTH_TYPE");
		},
		setSessionCheck : function(value){
			this.setHeader("SESSION_CHECK", value);
		},
		getSessionCheck : function(){
			var value										= this.getHeader("SESSION_CHECK");
			return (xui.valid.isEmpty(value) ? true : value);
		},
		setURL : function(value){
			this.setHeader("URL", value);
		},
		getURL : function(){
			return this.getHeader("URL");
		},
		setMethod : function(value){
			this.setHeader("METHOD", value);
		},
		getMethod : function(){
			return this.getHeader("METHOD");
		},
		setCallBack : function(fn){
			this.setHeader("CALL_BACK", fn);
		},
		getCallBack : function(){
			return this.getHeader("CALL_BACK");
		},
		setGridId : function(value){
			this.setHeader("GRID_ID", value);
		},
		getGridId : function(){
			return this.getHeader("GRID_ID");
		},
		setTreeId : function(value){
			this.setHeader("TREE_ID", value);
		},
		getTreeId : function(){
			return this.getHeader("TREE_ID");
		},
		setRowPerPage : function(value){
			this.setHeader("ROW_PER_PAGE", value);
		},
		getRowPerPage : function(dataGroup){
			var value										= "";
			if(!xui.valid.isEmpty(dataGroup) && this.jsonData.HEADER.hasOwnProperty(dataGroup + "_ROW_PER_PAGE")){
				value										= this.getHeader(dataGroup + "_ROW_PER_PAGE");
			}else{
				value										= this.getHeader("ROW_PER_PAGE");
			}
			if(xui.valid.isNumber(value)){
				value										= parseInt(value, 10);
			}
			return value;
		},
		setPageNo : function(value){
			this.setHeader("PAGE_NO", value);
		},
		getPageNo : function(dataGroup){
			var value										= "";
			if(!xui.valid.isEmpty(dataGroup) && this.jsonData.HEADER.hasOwnProperty(dataGroup + "_PAGE_NO")){
				value										= this.getHeader(dataGroup + "_PAGE_NO");
			}else{
				value										= this.getHeader("PAGE_NO");
			}
			if(xui.valid.isNumber(value)){
				value										= parseInt(value, 10);
			}
			if(value === ""){
				value										= 1;
			}
			return value;
		},
		setTimeCheck : function(value){
			this.setHeader("TIME_CHECK", value);
		},
		getTimeCheck : function(){
			if(xui.valid.isEmpty(this.getHeader("TIME_CHECK"))){
				return true;
			} else {
				return this.getHeader("TIME_CHECK");
			}
		},
		setAsync : function(value){
			this.setHeader("ASYNC", value);
		},
		getAsync : function(){
			return this.getHeader("ASYNC");
		},
		setErrorFlag : function(value){
			this.setHeader("ERROR_FLAG", value);
		},
		getErrorFlag : function(){
			var isError										= this.getHeader("ERROR_FLAG");
			if(isError === ""){
				isError										= false;
			}
			return isError;
		},
		setErrorCode : function(value){
			this.setHeader("ERROR_CODE", value);
		},
		getErrorCode : function(){
			return this.getHeader("ERROR_CODE");
		},
		setMsg : function(value){
			this.setHeader("ERROR_MSG", value);
		},
		getMsg : function(){
			return this.getHeader("ERROR_MSG");
		},
		getCount : function(dataGroup){
			var value										= "";
			if(!xui.valid.isEmpty(dataGroup) && this.jsonData.HEADER.hasOwnProperty(dataGroup + "_COUNT")){
				value										= this.getHeader(dataGroup + "_COUNT");
			}else{
				value										= this.getHeader("COUNT");
			}
			if(xui.valid.isNumber(value)){
			}
			if(value === 0 || value === ""){
				value										= this._getDataCount(dataGroup);
			}
			return value;
		},
		getTotCount : function(dataGroup){
			var value										= "";
			if(!xui.valid.isEmpty(dataGroup) && this.jsonData.HEADER.hasOwnProperty(dataGroup + "_TOT_COUNT")){
				value										= this.getHeader(dataGroup + "_TOT_COUNT");
			}else{
				value										= this.getHeader("TOT_COUNT");
			}
			if(xui.valid.isNumber(value)){
				value										= parseInt(value, 10);
			}
			if(value === 0 || value === ""){
				value										= this._getDataCount(dataGroup);
			}
			return value;
		},
		setInt : function(key, value, idx, dataGroup){
			if(!xui.valid.isEmpty(key) && xui.valid.isNumber(value, false)){
				this.setObject(key, parseInt(value), idx, dataGroup);
			}
		},
		setDecimal : function(key, value, idx, dataGroup){
			if(!xui.valid.isEmpty(key) && xui.valid.isDecimal(value, false, 2)){
				this.setObject(key, value, idx, dataGroup);
			}
		},
		setBoolean : function(key, value, idx, dataGroup){
			if(!xui.valid.isEmpty(key) && typeof(value) === "boolean"){
				this.setObject(key, value, idx, dataGroup);
			}
		},
		setString : function(key, value, idx, dataGroup){
			if(!xui.valid.isEmpty(key) && xui.valid.isString(value)){
				this.setObject(key, value, idx, dataGroup);
			}
		},
		setNull : function(key, value, idx, dataGroup){
			if(!xui.valid.isEmpty(key)){
				this.setObject(key, null, idx, dataGroup);
			}
		},
		setObject : function(key, value, idx, dataGroup){
			if(xui.valid.isEmpty(idx)){
				idx											= 0;
			}
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			if(!this.jsonData.hasOwnProperty(dataGroup)){
				this.jsonData[dataGroup]					= [{}];
			}
			if(xui.valid.isEmpty(this.jsonData[dataGroup][idx])){
				var _index									= idx;
				while(true){
					if(!xui.valid.isEmpty(this.jsonData[dataGroup][_index])){
						break;
					}else{
						this.jsonData[dataGroup].push({});
					}
					_index--;
				}
			}
			this.jsonData[dataGroup][idx][key]				= value;
		},
		getInt : function(key, idx, dataGroup){
			var value										= null;
			if(xui.valid.isEmpty(idx)){
				idx											= 0;
			}
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			var dataArray									= this.jsonData[dataGroup];
			if(xui.valid.isArray(dataArray) && (dataArray.length-1) >= idx && dataArray[idx].hasOwnProperty(key)){
				value										= dataArray[idx][key];
				if(!xui.valid.isEmpty(value) && !isNaN(value)){
					value									= parseInt(value);
				}
			}
			return value;
		},
		getDecimal : function(key, idx, dataGroup){
			var value										= null;
			if(xui.valid.isEmpty(idx)){
				idx											= 0;
			}
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			var dataArray									= this.jsonData[dataGroup];
			if(xui.valid.isArray(dataArray) && (dataArray.length-1) >= idx && dataArray[idx].hasOwnProperty(key)){
				value										= dataArray[idx][key];
				if(!xui.valid.isEmpty(value) && !isNaN(value)){
					value									= parseFloat(value);
				}
			}
			return value;
		},
		getBoolean : function(key, idx, dataGroup){
			var value										= null;
			if(xui.valid.isEmpty(idx)){
				idx											= 0;
			}
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			var dataArray									= this.jsonData[dataGroup];
			if(xui.valid.isArray(dataArray) && (dataArray.length-1) >= idx && dataArray[idx].hasOwnProperty(key)){
				value										= dataArray[idx][key];
				if(value === "true"){
					value									= true;
				}else if(value === "false"){
					value									= false;
				}
			}
			return value;
		},
		getString : function(key, idx, dataGroup){
			var value										= null;
			if(xui.valid.isEmpty(idx)){
				idx											= 0;
			}
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			var dataArray									= this.jsonData[dataGroup];
			if(xui.valid.isArray(dataArray) && (dataArray.length-1) >= idx && dataArray[idx].hasOwnProperty(key)){
				value										= (dataArray[idx][key]).toString();
			}
			return value;
		},
		getObject : function(key, idx, dataGroup){
			var value										= null;
			if(xui.valid.isEmpty(idx)){
				idx											= 0;
			}
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			var dataArray									= this.jsonData[dataGroup];
			if(xui.valid.isArray(dataArray) && (dataArray.length-1) >= idx && dataArray[idx].hasOwnProperty(key)){
				value										= dataArray[idx][key];
			}
			return value;
		},
		removeHeaderKey : function(key){
			if(this.jsonData.HEADER.hasOwnProperty(key)){
				delete this.jsonData.HEADER[key];
			}
		},
		removeDataKey : function(key, idx, dataGroup){
			if(xui.valid.isEmpty(idx)){
				idx											= 0;
			}
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			var dataArray									= this.jsonData[dataGroup];
			if(xui.valid.isArray(dataArray) && (dataArray.length-1) >= idx && dataArray[idx].hasOwnProperty(key)){
				delete dataArray[idx][key];
			}
		},
		setDataJsonArray : function(dataArray, dataGroup){
			if(xui.valid.isArray(dataArray)){
				if(dataArray.length > 0 && !xui.valid.isJson(dataArray[0])){
					return;
				}else{
					if(dataArray.length === 0){
						dataArray.push({});
					}
					if(xui.valid.isEmpty(dataGroup)){
						dataGroup							= "DATA";
					}
					this.jsonData[dataGroup]				= dataArray;
				}
			}
		},
		getDataJsonArray : function(dataGroup){
			var dataArray									= null;
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			if(this.jsonData.hasOwnProperty(dataGroup)){
				dataArray									= this.jsonData[dataGroup];
			}
			return dataArray;
		},
		setDataJsonObject : function(json, idx, dataGroup){
			if(xui.valid.isJson(json)){
				if(xui.valid.isEmpty(idx)){
					idx										= 0;
				}
				if(xui.valid.isEmpty(dataGroup)){
					dataGroup								= "DATA";
				}
				var dataArray								= this.jsonData[dataGroup];
				if(xui.valid.isEmpty(dataArray)){
					dataArray								= [];
					dataArray.push({});
					this.jsonData[dataGroup]				= dataArray;
				}
				if((dataArray.length) >= idx){
					this.jsonData[dataGroup][idx]			= json;
				}
			}
		},
		getDataJsonObject : function(dataGroup, idx){
			var value										= null;
			if(xui.valid.isEmpty(idx)){
				idx											= 0;
			}
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			var dataArray									= this.jsonData[dataGroup];
			if(xui.valid.isArray(dataArray) && (dataArray.length-1) >= idx){
				value										= dataArray[idx];
			}
			return value;
		},
		setBlankToNull : function(dataGroup, key){
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			var dataArray									= this.jsonData[dataGroup];
			if(xui.valid.isArray(dataArray) && dataArray.length > 0){
				var isExist									= false;
				if(!xui.valid.isEmpty(key)){
					isExist									= dataArray[0].hasOwnProperty(key);
				}
				for(var i in dataArray){
					if(isExist){
						if(xui.valid.isEmpty(dataArray[i][key])){
							dataArray[i][key]				= null;
						}
					}else{
						for(var jsonKey in dataArray[i]){
							if(xui.valid.isEmpty(dataArray[i][jsonKey])){
								dataArray[i][jsonKey]		= null;
							}
						}
					}
				}
			}
		},
		containsHeaderKey : function(key){
			return (!xui.valid.isEmpty(key) && this.jsonData.HEADER.hasOwnProperty(key));
		},
		containsKey : function(key, dataGroup){
			var value										= false;
			if(!xui.valid.isEmpty(key)){
				if(xui.valid.isEmpty(dataGroup)){
					dataGroup								= "DATA";
				}
				var dataArray								= this.jsonData[dataGroup];
				if(xui.valid.isArray(dataArray) && dataArray.length > 0){
					value									= dataArray[0].hasOwnProperty(key);
				}
			}
			return value;
		},
		containsDataGroupKey : function(key){
			return (!xui.valid.isEmpty(key) && key !== "HEADER" && this.jsonData.hasOwnProperty(key));
		},
		_getDataCount : function(dataGroup){
			var value										= 0;
			if(xui.valid.isEmpty(dataGroup)){
				dataGroup									= "DATA";
			}
			var dataArray									= this.jsonData[dataGroup];
			if(xui.valid.isArray(dataArray) && dataArray.length > 0 && Object.keys(dataArray[0]).length > 0){
				value										= dataArray.length;
			}
			return value;
		},
		_createBaseGroup : function(){
			if(xui.valid.isJson(this.jsonData)){
				if(!this.jsonData.hasOwnProperty("HEADER")){
					this.jsonData.HEADER					= {};
				}
				if(!this.jsonData.hasOwnProperty("DATA")){
					this.jsonData.DATA						= [{}];
				}
				if(!this.jsonData.HEADER.hasOwnProperty("ERROR_FLAG")){
					this.jsonData.HEADER.ERROR_FLAG			= false;
				}
				if(!this.jsonData.HEADER.hasOwnProperty("ERROR_CODE")){
					this.jsonData.HEADER.ERROR_CODE			= "";
				}
				if(!this.jsonData.HEADER.hasOwnProperty("ERROR_MSG")){
					this.jsonData.HEADER.ERROR_MSG			= "";
				}
			}
		}
	};

	/*application queue constructor*/
	xui.queue	= function(data){
		this.queue											= [];
		if(xui.valid.isArray(data)){
			this.addAll(data);
		}
		this._data											= {};
	};
	xui.queue.prototype	= {
		add : function(data, index){
			var success										= true;
			try{

			}catch(E){
				console.log(E);
				success										= false;
			}
			return success;
		},
		addAll : function(data){
			var success										= true;
			try{
				if(xui.valid.isArray(data)){
					var size								= data.length;
					for(var i = 0; i < size; i++){

					}
				}
			}catch(E){
				console.log(E);
				success										= false;
			}
			return success;
		},
		addFirst : function(data){
			return true;
		},
		addLast : function(data){
			return true;
		},
		clear : function(){

		},
		has : function(data){

		},
		forEach : function(fn){

		},
		get : function(index){

		},
		getFirst : function(){

		},
		getLast : function(){

		},
		remove : function(index){

		},
		peek : function(index){

		},
		isEmpty : function(){

		},
		offer : function(){

		},
		offerFirst : function(){

		},
		offerLast : function(){

		},




		enqueue : function(item){
			this.queue.push(item);
		},
		dequeue : function(){
			return this.queue.shift();
		}
	};

	/*stomp client rabbitmq communication feature api*/
	xui.rmq	= function(){
		this.WEBSOCKET_OBJECT								= null,
		this.STOMP_OBJECT									= null,
		this.DECLARE_QUEUE_ERROR_FLAG						= false,
		this.CONNECT_QUEUE_ERROR_FLAG						= false,
		this.RMQ_QUEUE_NAME									= null,
		this.RETRY_DECLARE_QUEUE_COUNT						= 0,
		this.RETRY_CONNECT_QUEUE_COUNT						= 0,
		this.CALL_BACK_OBJECT								= null
	};
	xui.rmq.prototype	= {
		beginCommunicationRMQ : function(callbackFn, localExtentionNumber, observerAt){
			if(typeof(callbackFn) === "function"){
				this.CALL_BACK_OBJECT						= callbackFn;
				this._declareRMQ(localExtentionNumber,observerAt);
			}else{
				xui.dialog.warning(xui.enum.RMQ_ERROR01.getName(), "WARNING");
			}
		},

		deleteRMQ : function(){
			var _this										= this;
			var param										= new xui.json();
			param.setURL(xui.com.getRequestPrefix() + "/deleteRMQ.json");
			param.setString("queueName", this.RMQ_QUEUE_NAME);
			param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			var response									= xui.ajax.callSync(param);
			this.WEBSOCKET_OBJECT							= null;
			this.DECLARE_QUEUE_ERROR_FLAG					= false;
			this.CONNECT_QUEUE_ERROR_FLAG					= false;
			this.RMQ_QUEUE_NAME								= null;
			this.RETRY_DECLARE_QUEUE_COUNT					= 0;
			this.RETRY_CONNECT_QUEUE_COUNT					= 0;
			this.CALL_BACK_OBJECT							= null;
			if(!response.getErrorFlag()){
				_this.STOMP_OBJECT.disconnect(function(){
					_this.STOMP_OBJECT						= null;
				});
			}else{
				xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
			}
		},

		sendRMQMessage: function(messageType, xtrmSendData, localExtentionNumber){
			var _this										= this;
			xtrmSendData.setURL(xui.com.getRequestPrefix() + "/offerDataRMQ.json");
			xtrmSendData.setString("sendType"			,messageType);
			if(xui.valid.isEmpty(xtrmSendData.getString("type"))){
				xtrmSendData.setString("type"			,messageType);
			}
			if(!xui.valid.isEmpty(localExtentionNumber)){
				xtrmSendData.setString("sendLocalExtentionNumber"	,localExtentionNumber);
			}else{
				xtrmSendData.setString("sendLocalExtentionNumber"	,xui.extends.session.getLocalExtentionNumber());
			}
			xtrmSendData.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
			xtrmSendData.setCallBack(function(response, param){
				if(!response.getErrorFlag()){
				}else{
				}
			});
			xui.ajax.callService(xtrmSendData);
		},

		_declareRMQ : function(localExtentionNumber, observerAt){
			var _this										= this;
			if(xui.valid.isEmpty(localExtentionNumber)){
				localExtentionNumber						= xui.extends.session.getLocalExtentionNumber();
			}
			if(!xui.valid.isEmpty(localExtentionNumber)){
				var param									= new xui.json();
				param.setURL(xui.com.getRequestPrefix() + "/declareRMQ.json");		/*request mapping Controller method URL*/
				param.setString("localExtentionNumber"	, localExtentionNumber);	/*내선번호*/
				param.setString("observerAt", observerAt);							/*옵저버모드 여부*/
				param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());				/*요청기능 권한코드(필수)*/
				param.setCallBack(function(response, request){
					if(response.getErrorFlag()){
						_this.DECLARE_QUEUE_ERROR_FLAG		= true;
						xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
					}else{
						_this.RMQ_QUEUE_NAME				= response.getString("queueName");
						_this._connectRMQ(response, request);
					}
				});
				xui.ajax.callService(param);
			}
		},

		_connectRMQ : function(response, request){
			var _this										= this;
			var strCompanyCode								= response.getString("companyCode");
			var strLocalExtentionNumber						= request.getString("localExtentionNumber");
			var strURL										= xui.util.replace(response.getString("url")," ", "+");
			var strId										= xui.util.replace(response.getString("id")," ", "+");
			var strPassword									= xui.util.replace(response.getString("password")," ", "+");
			var strEncryptKey								= "";
			for(var i = 0; i < 10; i++){
				strEncryptKey += strCompanyCode;
				strEncryptKey += strLocalExtentionNumber;
			}
			if(strEncryptKey.length > 32){strEncryptKey		= strEncryptKey.substring(0,32);}
			strURL											= xui.util.decryptAES(strURL		,strEncryptKey);
			strId											= xui.util.decryptAES(strId			,strEncryptKey);
			strPassword										= xui.util.decryptAES(strPassword	,strEncryptKey);
			this.WEBSOCKET_OBJECT 							= new WebSocket(strURL);
			this.STOMP_OBJECT								= Stomp.over(this.WEBSOCKET_OBJECT);
			this.STOMP_OBJECT.heartbeat.outgoing			= 10000;
			this.STOMP_OBJECT.heartbeat.incoming			= 0;
			this.STOMP_OBJECT.debug							= null;
			this.STOMP_OBJECT.connect(strId, strPassword, function(objConnection){
				_this._subscribeQMessage(_this.RMQ_QUEUE_NAME);
			}, function(objError){
				_this.CONNECT_QUEUE_ERROR_FLAG				= true;
			});
		},

		_subscribeQMessage : function(strQueueName){
			var _this										= this;
			this.STOMP_OBJECT.subscribe("/amq/queue/" + strQueueName, function(objMessage){
				var messageData								= new xui.json();
				messageData.setJson(JSON.parse(objMessage.body));
				_this.CALL_BACK_OBJECT.call("", messageData);
			});
		}
	};

	/*application common ui module api*/
	xui.module	= {};
	xui.module.tabbar	= function(config, element){
		if(!xui.valid.isEmpty(element.tabbarController)){
			element.tabbarController.destroy();
		}
		element												= xuic.__DOM.getElement(element);
		element.classList.add("xui-tabbar-container");
		element.tabbarController							= this;
		this.element										= element;

		var views											= xui.valid.isEmpty(config.views)		?	[]				:	xui.util.copyObject(config.views);
		config.mode											= xui.valid.isEmpty(config.position)	?	"top"			:	config.position;
		config.tabHeight									= xui.valid.isEmpty(config.height)		?	40				:	config.height;
		config.css											= xui.valid.isEmpty(config.customClass)	?	"xui-tabbar"	:	config.customClass;
		config.isFocus										= xui.valid.isEmpty(config.isFocus)		?	true			:	false;
		config.disabled										= [];
		config.closable										= [];
		config.views										= [{id:"_blank",tab:""}];
		config.noContent									= true;
		config.tabCount										= 0;
		this.config											= config;
		this.tabbar											= new dhx.Tabbar(element, config);
		this.tabbar.element									= element;

		this.param											= null;

		var _this											= this;
		/*tabbar click drag horizontal scrolling feature*/
		dhx.awaitRedraw().then(function(){
			var scrollElement								= _this.tabbar._view.node.body[0].el;
			scrollElement.parentNode.style.setProperty("height", _this.config.tabHeight + "px");
			scrollElement.addEventListener('mousedown', function(e){
				this.isDown									= true;
				this.startX									= e.pageX - this.offsetLeft;
				this.scrollLeftValue						= this.scrollLeft;
			});
			scrollElement.addEventListener('mouseleave', function(){
				this.isDown									= false;
			});
			scrollElement.addEventListener('mouseup', function(){
				this.isDown									= false;
			});
			scrollElement.addEventListener('mousemove', function(e){
				if(this.isDown){
					e.preventDefault();
					var x									= e.pageX - this.offsetLeft;
					var walk								= (x - this.startX);
					this.scrollLeft							= this.scrollLeftValue - walk;
				}
			});
			scrollElement.addEventListener("mousewheel", function(e){
				var delta	= Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				scrollElement.scrollLeft -= (delta * 30);
				e.preventDefault();
			});
		});
		this.tabbar.events.on("Change", function(activeId, prevId){
			var rootContainer								= this._container.lastChild, controller = this.element.tabbarController;
			var prevContentContainer						= rootContainer.querySelector("#tabcontent_" + prevId);
			var changeContentContainer						= rootContainer.querySelector("#tabcontent_" + activeId);
			prevContentContainer.classList.remove("on");
			if(!xui.valid.isEmpty(changeContentContainer)){changeContentContainer.classList.add("on");}
			this.config.activeView							= activeId;
			controller.config.activeTabContainer			= changeContentContainer;
			if(typeof(controller.config.onActive) === "function"){
				controller.config.onActive.call(controller, activeId, prevId, controller.param);
			}
			controller.param								= null;
		});
		this.tabbar.events.on("BeforeClose", function(id){
			var doClose										= true;
			var rootContainer								= this._container.lastChild;
			var contentContainer							= rootContainer.querySelector("#tabcontent_" + id);
			if(!xui.valid.isEmpty(contentContainer)){
				var controller								= this.element.tabbarController;
				var tabbarConfig							= this._all[id].config;
				if(typeof(controller.config.onBeforeClose) === "function"){
					doClose									= controller.config.onBeforeClose.call("", id);
					if(xui.valid.isEmpty(doClose)){
						doClose								= true;
					}
				}
				if(doClose && tabbarConfig.iframe && contentContainer.firstElementChild.tagName === "IFRAME"){
					contentContainer.firstElementChild.src	= "about:blank";
				}
			}
			return doClose;
		});
		this.tabbar.events.on("AfterClose", function(id){
			var rootContainer								= this._container.lastChild, controller = this.element.tabbarController;
			var contentContainer							= rootContainer.querySelector("#tabcontent_" + id);
			if(!xui.valid.isEmpty(contentContainer)){
				contentContainer.parentNode.removeChild(contentContainer);
			}
			if(controller.tabCount > 0){
				controller.tabCount--;
			}
			var views										= controller.config.views;
			for(var i = 0; i < views.length; i++){
				if(views[i].id === id){
					controller.config.views.splice(i,1);
					break;
				}
			}
		});
		this.add(views);

		return this;
	};
	xui.module.tabbar.prototype	= {
		add : function(views, param){
			if(!xui.valid.isEmpty(views)){
				if(xui.valid.isJson(views)){
					views									= [views];
				}
				if(xui.valid.isArray(views) && views.length > 0){
					if(!this.config.hasContainer){
						this.element.firstElementChild.setAttribute("style", "height:" + this.config.tabHeight + "px;");
						this.config.container				= document.createElement("div");
						this.config.container.id			= this.element.id + "_tabcontents_container";
						this.config.container.className		= "xui-tab-contents-container";
						this.config.container.setAttribute("style", "height:calc(100% - " + this.config.tabHeight + "px);");
						this.element.appendChild(this.config.container);
						this.config.container.style.height	= "calc(100% - " + this.config.tabHeight + "px);";
						this.config.hasContainer			= true;
					}
					var prevViews							= this.config.views;
					var prevLength							= prevViews.length;
					var size								= views.length;
					var newActiveTabId						= "";
					var doAdd								= true;
					if(prevLength > 0 && prevViews[0].id === "_blank"){
						this.tabbar.removeTab("_blank");
						prevLength							= prevLength - 1;
					}
					if(xui.valid.isEmpty(param)){
						param								= null;
					}
					for(var i = 0; i < size; i++){
						if(!this.isExist(views[i].id)){
							this.config.tabCount++;
							if(xui.valid.isEmpty(views[i].index)){
								views[i].index				= prevLength++;
							}
							if(xui.valid.isEmpty(views[i].id)){
								views[i].id					= xui.util.generateRandomChar(20);
							}
							if(xui.valid.isEmpty(views[i].text)){
								views[i].tab				= "TAB" + (this.config.tabCount);
							}else{
								views[i].tab				= xui.util.restoreXSS(views[i].text);
							}
							if(views[i].disabled){
								if(this.config.disabled.indexOf(views[i].id) < 0){
									this.config.disabled.push(views[i].id);
								}
							}
							if(views[i].close){
								if(this.config.closable.indexOf(views[i].id) < 0){
									this.config.closable.push(views[i].id);
								}
							}
							if(views[i].active){
								newActiveTabId				= views[i].id;
							}
							if(newActiveTabId === "" && i === size - 1){
								newActiveTabId				= views[i].id;
							}
							if(!xui.valid.isEmpty(newActiveTabId)){
								this.config.activeView		= newActiveTabId;
								this.tabbar.config.activeView	= newActiveTabId;
							}
							this.config.views.push(views[i]);
							var contentBox					= document.createElement("div");
							contentBox.id					= "tabcontent_" + views[i].id;
							contentBox.className			= "xui-tab-contents";
							this.config.container.appendChild(contentBox);
							var tabbarController			= this;
							if(views[i].iframe === true && !xui.valid.isEmpty(views[i].content) && views[i].content.indexOf(".jsp") >= 0){
								var iframeElement			= document.createElement("iframe");
								iframeElement.id			= views[i].id;
								iframeElement.name			= views[i].id;
								iframeElement.setAttribute("frameborder", "0");
								iframeElement.width			= "100%";
								iframeElement.height		= "100%";
								iframeElement.src			= views[i].content;
								iframeElement.onload		= function(){
									if(typeof(tabbarController.config.onContentLoad) === "function"){
										tabbarController.config.onContentLoad.call(tabbarController, this.name, param, this.contentWindow);
									}
								};
								contentBox.appendChild(iframeElement);
							}else{
								var contentElement			= document.getElementById(views[i].content);
								if(!xui.valid.isEmpty(contentElement)){
									contentBox.appendChild(contentElement.parentNode.removeChild(contentElement));
									contentElement.style.setProperty("display", "");
									contentElement.classList.remove("xui-invisible");
								}
							}
							this.tabbar.addTab(views[i], views[i].index);
						}
					}
					if(xui.valid.isElement(this.config.activeTabContainer)){
						this.config.activeTabContainer.classList.remove("on");
					}
					this.config.activeTabContainer			= document.getElementById("tabcontent_" + this.config.activeView);
					this.config.activeTabContainer.classList.add("on");
				}
			}
		},
		close : function(id, byForce){
			if(xui.valid.isEmpty(byForce)){
				byForce										= false;
			}
			if(byForce || this.isClosable(id)){
				this.tabbar.removeTab(id);
			}
		},
		closeAll : function(byForce){
			//OSH 20210101 탭을 모두 닫기할 때 진행중인 건이 존재할 경우 DIM 처리가 없어지는 않는 오류 수정 건
			var views										= this.config.views;
			for(var i = views.length-1; i > 0; i--){

				// 삭제 전 PageEnter(Live Ajax 호출) 함수 초기화
				// 작성일 : 2022.01.05
				var currentPage = xui.extends.menu.getMenuContentWindow(views[i-1].id);
				if(i != 1 && currentPage.PageEnter){
					currentPage.PageEnter = null;
				}

				this.close(views[i].id, byForce);
			}
		},
		active : function(id, param){
			if(xui.valid.isNumber(id) && id.length < 3){
				id											= this.tabbar.getId(id);
			}
			if(typeof(param) === "undefined"){
				param										= null;
			}
			if(this.isExist(id) && this.isEnabled(id)){
				var currActive								= this.getActive();
				this.param									= param;
				if(id === currActive){
					if(this.config.alwaysCallActive){
						if(typeof(this.config.onActive) === "function"){
							this.config.onActive.call(this, id, id, param);
						}
					}
					this.param								= null;
				}else{
					this.tabbar.setActive(id);
				}
			}
		},
		getActive : function(){
			return this.tabbar.getActive();
		},
		getAll : function(){
			var allTabData									= [];
			var cells										= this.tabbar._cells;
			for(var i = 0; i < cells.length; i++){
				allTabData.push(cells[i].id);
			}
			return allTabData;
		},
		isExist : function(id){
			var exist										= false;
			if(!xui.valid.isEmpty(id)){
				var views									= this.config.views;
				for(var i = 0; i < views.length; i++){
					if(views[i].id === id){
						exist								= true;
						break;
					}
				}
			}
			return exist;
		},
		setTitle : function(id, title){
			if(this.isExist(id) && !xui.valid.isEmpty(title)){
				var views									= this.config.views;
				var cell									= this.tabbar.getCell(id);
				cell.config.tab								= title;
				cell.config.text							= title;
				this.tabbar.paint();
				var _this									= this;
				dhx.awaitRedraw().then(function(){
					var tabCell								= _this.tabbar.element.querySelector("#tab-content-" + id);
					tabCell.click();
				});
			}
		},
		disable : function(id, disable){
			if(this.isExist(id)){
				if(disable){
					this.tabbar.disableTab(id);
					if(this.config.disabled.indexOf(id) < 0){
						this.config.disabled.push(id);
					}
				}else{
					this.tabbar.enableTab(id);
					if(this.config.disabled.indexOf(id) >= 0){
						this.config.disabled.splice(this.config.disabled.indexOf(id), 1);
					}
				}
			}
		},
		enable : function(id){
			this.disable(id, false);
		},
		isEnabled : function(id){
			var enabled										= false;
			if(!xui.valid.isEmpty(id)){
				enabled										= (this.config.disabled.indexOf(id) < 0);
			}
			return enabled;
		},
		isClosable : function(id){
			var closable									= false;
			if(!xui.valid.isEmpty(id)){
				closable									= (this.config.closable.indexOf(id) >= 0);
			}
			return closable;
		},
		destroy : function(){
			this.closeAll();
			this.tabbar.destructor();
			delete this.config;
			delete this.element;
			delete this.tabbar;
		}
	};

	xui.module.context	= function(config, element){
		if(!xui.valid.isEmpty(element.ctxController)){
			element.ctxController.destroy();
		}
		element												= xuic.__DOM.getElement(element);
		element.ctxController								= this;
		this.element										= element;
		this.config											= config;
		this.menuList										= {};
		this.contents										= [];
		this.ctx											= new dhx.ContextMenu(null, {css:"xui-context-box " + (!xui.valid.isEmpty(config.customClass) ? config.customClass : "")});
		this.ctx.element									= element;

		if(xui.valid.isArray(this.config.contents) && this.config.contents.length > 0){
			this._makeContext(config.contents, this.contents);
			this.ctx.data.parse(this.contents);
			delete this.contents;
		}
		this.ctx.events.on("Click", function(id){
			var controller									= this.element.ctxController;
			if(!xui.valid.isEmpty(controller) && controller.menuList.hasOwnProperty(id)){
				var clickFn									= controller.menuList[id].onclick;
				if(typeof(clickFn) === "function" && xui.valid.isElement(controller.targetElement)){
					clickFn.call(controller, controller.targetElement);
				}
			}
		});
		this.ctx.events.on("AfterShow", function(){
			var childNodes									= document.body.children;
			var widget										= null;
			if(xui.valid.isHTMLCollection(childNodes) && childNodes.length > 0){
				for(var i = 0; i < childNodes.length; i++){
					if(childNodes[i].getAttribute("dhx_widget_id") === this._uid){
						widget								= childNodes[i];
						break;
					}
				}
				if(!xui.valid.isEmpty(widget)){
					var controller							= (!xui.valid.isEmpty(this.controller) ? this.controller : this.element.ctxController);
					var config								= controller.config;
					if(typeof(config.onAfterShow) === "function"){
						config.onAfterShow.call(controller, widget);
					}
				}
			}
		});
		this.ctx.events.on("BeforeHide", function(){
			var childNodes									= document.body.children;
			var widget										= null;
			if(xui.valid.isHTMLCollection(childNodes) && childNodes.length > 0){
				for(var i = 0; i < childNodes.length; i++){
					if(childNodes[i].getAttribute("dhx_widget_id") === this._uid){
						widget								= childNodes[i];
						break;
					}
				}
				if(!xui.valid.isEmpty(widget)){
					var controller							= (!xui.valid.isEmpty(this.controller) ? this.controller : this.element.ctxController);
					var config								= controller.config;
					if(typeof(config.onBeforeHide) === "function"){
						config.onBeforeHide.call(this, widget);
					}
				}
			}
		});
		this.element.oncontextmenu							= function(e){
			e.preventDefault();
			var controller									= this.ctxController;
			var beforeShowFn								= controller.config.onBeforeShow;
			var doShow										= true;
			controller.targetElement						= e.target;
			if(typeof(beforeShowFn) === "function"){
				doShow										= beforeShowFn.call(controller, e.target, e);
				if(typeof(doShow) === "undefined"){
					doShow									= true;
				}
			}
			if(doShow){
				controller.ctx.showAt(e);
			}
		};
		return this;
	};
	xui.module.context.prototype	= {
		setValue : function(id, value){
			if(!xui.valid.isEmpty(id) && !xui.valid.isEmpty(value)){
				if(!xui.valid.isEmpty(this.ctx.data.getItem(id))){
					this.ctx.data.getItem(id).value			= value;
					this.ctx.paint();
				}
			}
		},
		setIcon : function(id, icon){
			if(!xui.valid.isEmpty(id) && !xui.valid.isEmpty(icon)){
				if(!xui.valid.isEmpty(this.ctx.data.getItem(id))){
					this.ctx.data.getItem(id).icon			= icon;
					this.ctx.paint();
				}
			}
		},
		disable : function(id){
			this.ctx.disable(id);
		},
		enable : function(id){
			this.ctx.enable(id);
		},
		isEnabled : function(id){
			return true;
		},
		setClickFunction : function(id, fn){
			if(typeof(fn) === "function"){
				var contents								= this.config.contents;
				if(this.menuList.hasOwnProperty(id)){
					this.menuList[id].onclick				= fn;
				}
				for(var i in contents){
					if(contents[i] === id){
						this.config.contents[i].onClick		= fn;
						break;
					}
				}
			}
		},
		destroy : function(){
			this.ctx.destructor();
			delete this.config;
			delete this.element;
			delete this.tabbar;
		},
		_makeContext : function(menu, contents){
			var content										= {}, authType, child, clickFn;
			for(var i in menu){
				authType									= !xui.valid.isEmpty(menu[i].authType) ? menu[i].authType : xui.enum.AUTH_TYPE_NONE.getCode();
				if(xui.extends.menu.checkValidAuth(xui.extends.menu.getKey(), authType)){
					content									= {}
					content.id								= !xui.valid.isEmpty(menu[i].id)			? menu[i].id				: xui.util.generateRandomChar();
					content.icon							= !xui.valid.isEmpty(menu[i].icon)			? menu[i].icon				: "";
					content.value							= !xui.valid.isEmpty(menu[i].text)			? menu[i].text				: "";
					content.html							= !xui.valid.isEmpty(menu[i].html)			? menu[i].html				: "";
					content.type							= !xui.valid.isEmpty(menu[i].separate)		? "separator"				: !xui.valid.isEmpty(menu[i].html)	? "customHTML" : "menuItem";
					child									= !xui.valid.isEmpty(menu[i].child)			? menu[i].child				: [];
					clickFn									= typeof(menu[i].onClick) === "function"	? menu[i].onClick			: null;
					if(child.length > 0){
						content.items						= [];
						this._makeContext(child, content.items);
					}
					this.menuList[content.id]				= content;
					if(clickFn != null){
						this.menuList[content.id].onclick	= clickFn;
					}
					contents.push(content);
				}
			}
			return;
		}
	};

	xui.module.dialog	= function(config, element){
		if(!xui.valid.isEmpty(element) && !xui.valid.isEmpty(element.dialogController)){
			element.dialogController.destroy();
		}
		element												= xuic.__DOM.getElement(element);

		if(xui.valid.isEmpty(element)){return;}

		element.dialogController							= this;
		this.element										= element;

		config.id											= xui.valid.isEmpty(config.id)										?	element.id + "_dialog"		:	config.id;
		config.url											= xui.valid.isEmpty(config.url)										?	null						:	config.url;
		config.modal										= xui.valid.isEmpty(config.modal)									?	false						:	config.modal;
		config.resizable									= xui.valid.isEmpty(config.resizable)								?	true						:	config.resizable;
		config.movable										= xui.valid.isEmpty(config.movable)									?	true						:	config.movable;
		config.closable										= xui.valid.isEmpty(config.closable)								?	true						:	config.closable;
		config.width										= xui.valid.isEmpty(config.width)									?	element.offsetWidth + 10	:	config.width;
		config.height										= xui.valid.isEmpty(config.height)									?	element.offsetHeight + 10	:	config.height;
		config.icon											= xui.valid.isEmpty(config.icon)									?	""							:	config.icon;
		config.title										= xui.valid.isEmpty(config.title)									?	""							:	config.title;
		config.header										= xui.valid.isEmpty(config.header)									?	true						:	config.header;
		config.footer										= (xui.valid.isArray(config.buttons) && config.buttons.length > 0)	?	true						:	false;
		config.open											= xui.valid.isEmpty(config.open)									?	null						:	config.open;
		config.close										= xui.valid.isEmpty(config.close)									?	null						:	config.close;
		config.css											= xui.valid.isEmpty(config.css)										?	"xui-dialog-window "		:	config.css + " xui-dialog-window ";

		if(!config.header){
			config.movable									= false;
			config.closable									= false;
			config.title									= null;
			config.icon										= null;
		}

		if(xui.valid.isEmpty(config.title)){
			config.css										+= "nohead ";
		}
		if(config.footer){
			config.css										+= "footer ";
		}

		this.status											= {};
		this.status.init									= false;
		this.status.userParam								= null;

		var offsetTop										= 0;
		var offsetLeft										= 0;
		if(!xui.valid.isEmpty(config.top)){
			if(!xui.valid.isArray(config.top)){
				offsetTop									= config.top;
			}else{
				if(config.top[0] === "top"){
					offsetTop								= config.top[1];
				}else if(config.top[0] === "bottom"){
					offsetTop								= (parseInt(document.body.offsetHeight, 10) - config.height) - config.top[1];
				}else{
					offsetTop								= (parseInt(document.body.offsetHeight, 10)/2) - (config.height/2) + config.top[1];
				}
			}
		}
		if(!xui.valid.isEmpty(config.left)){
			if(!xui.valid.isArray(config.left)){
				offsetLeft									= config.left;
			}else{
				if(config.left[0] === "left"){
					offsetLeft								= config.left[1];
				}else if(config.left[0] === "right"){
					offsetLeft								= (parseInt(document.body.offsetWidth, 10)) - (config.width) - config.left[1];
				}else{
					offsetLeft								= (parseInt(document.body.offsetWidth, 10)/2) - (config.width/2) + config.left[1];
				}
			}
		}
		if(offsetTop > 0){
			config.top										= offsetTop;
		}
		if(offsetLeft > 0){
			config.left										= offsetLeft;
		}
		config.html											= "<div id='" + config.id + "' class='xui-dialog-wrapper'></div>";
		this.config											= config;

		this.dialog											= new dhx.Window(this.config);
		this.dialog.element									= element;

		if(this.config.footer){
			this.dialog.footer.buttons						= this.config.buttons;
			this.dialog.footer.data.add({type:"spacer"});
			for(var i = 0; i < this.config.buttons.length; i++){
				if(!xui.valid.isEmpty(this.config.buttons[i].authType) && xui.extends.menu.checkValidAuth(xui.extends.menu.getKey(), this.config.buttons[i].authType)){
					if(xui.valid.isEmpty(this.config.buttons[i].icon)){
						this.config.buttons[i].icon			= "";
					}else{
						this.config.buttons[i].icon			= this.config.buttons[i].icon;
					}
					if(xui.valid.isEmpty(this.config.buttons[i].customClass)){
						this.config.buttons[i].customClass	= "xui-button ";
					}else if(this.config.buttons[i].customClass.indexOf("xui-button") < 0 && this.config.buttons[i].customClass.indexOf("xui-icon-button") < 0){
						this.config.buttons[i].customClass	= "xui-button " + this.config.buttons[i].customClass;
					}
					this.dialog.footer.data.add({
						type	: "button",
						icon	: this.config.buttons[i].icon,
						id		: this.config.buttons[i].id,
						view	: "flat",
						size	: "medium",
						color	: "primary",
						value	: this.config.buttons[i].text,
						click	: this.config.buttons[i].click,
						css		: this.config.buttons[i].customClass
					});
				}
			}
			this.dialog.footer.events.on("click", function(id){
				var buttons									= this.buttons;
				for(var i = 0; i < buttons.length; i++){
					if(buttons[i].id === id){
						if(typeof(buttons[i].click) === "function"){
							buttons[i].click.call("");
						}
						break;
					}
				}
			});
		}
		this.dialog.events.on("BeforeShow", function(){
			var dialogController							= this.element.dialogController;
			if(!this._init){
				return true;
			}else{
				this._popup.classList.remove("xui-invisible");
				if(!xui.valid.isEmpty(this._blocker)){
					this._blocker.classList.remove("xui-invisible");
				}
				if(typeof(dialogController.config.open) === "function"){
					dialogController.config.open.call(dialogController, dialogController.status.userParam);
				}
			}
		});
		this.dialog.events.on("AfterShow", function(){
			var dialogController							= this.element.dialogController;
			var wrapper										= document.getElementById(dialogController.config.id);
			if(wrapper !== null && !this._init){
				dialogController.element.style.setProperty("display", "");
				dialogController.element.classList.remove("xui-invisible");
				dialogController.element.style.setProperty("width", "100%");
				dialogController.element.style.setProperty("height","100%");
				wrapper.appendChild(dialogController.element);
				if(dialogController.config.header && !xui.valid.isEmpty(dialogController.config.icon)){
					this.header.data.update("title",{value:"",html:"<i class='" + dialogController.config.icon + "'></i>&nbsp;&nbsp;" + dialogController.config.title});
				}
				if(!xui.valid.isEmpty(dialogController.config.url)){
					wrapper.parentNode.style.setProperty("height", "100%");
					var url									= dialogController.config.url;
					if(url.indexOf("menuKey") < 0){
						url									= (url.indexOf("?") >= 0 ? url + "&menuKey=" + xui.extends.menu.getKey() : url + "?menuKey=" + xui.extends.menu.getKey());
					}
					var iframeElement						= document.createElement("iframe");
					iframeElement.id						= dialogController.element.id + "_frame";
					iframeElement.name						= dialogController.element.id + "_frame";
					iframeElement.setAttribute("frameborder", "0");
					iframeElement.width						= "100%";
					iframeElement.height					= "100%";
					iframeElement.src						= xui.com.getContextPath() + url;
					iframeElement.onload					= function(){
						if(typeof(dialogController.config.onContentLoad) === "function"){
							dialogController.config.onContentLoad.call(dialogController, this.name, dialogController.status.userParam, this.contentWindow);
						}
					};
					dialogController.element.appendChild(iframeElement);
				}
				this._init									= true;
			}
		});
		this.dialog.events.on("BeforeHide", function(){
			var dialogController							= this.element.dialogController;
			if(typeof(dialogController.config.close) === "function"){
				dialogController.config.close.call(dialogController, dialogController.status.closeParam, dialogController.status.userParam);
			}
			delete dialogController.status.userParam;
			delete dialogController.status.closeParam;
			this._popup.classList.add("xui-invisible");
			if(!xui.valid.isEmpty(this._blocker)){
				this._blocker.classList.add("xui-invisible");
			}
			return false;
		});
		this.open();
		return this;
	};
	xui.module.dialog.prototype									= {
		open : function(param){
			if(!xui.valid.isEmpty(param)){
				this.status.userParam						= param;
			}else{
				this.status.userParam						= null;
			}
			this.dialog.show();
		},
		close : function(param){
			if(!xui.valid.isEmpty(param)){
				this.status.closeParam						= param;
			}else{
				this.status.closeParam						= null;
			}
			this.dialog.hide();
		},
		isOpen : function(){
			return !(this.dialog._popup.classList.contains("xui-invisible"))
		},
		getContent : function(){
			var content										= null;
			var container									= document.getElementById(this.config.id);
			if(!xui.valid.isEmpty(container)){
				if(!xui.valid.isEmpty(this.config.url)){
					content									= container.firstChild.firstChild.contentWindow;
				}
			}
			return content;
		},
		visibleButton : function(id, visible){

		},
		destroy : function(){
			//var originElement								= document.createElement("div");
			//originElement.id								= this.element.id;
			//this.dialog.destructor();
			//originElement.style.setProperty("display", "none");
			//document.body.appendChild(originElement);
			delete this.status;
			delete this.config;
			delete this.element;
			delete this.dialog;
			$(".dhx_popup").remove();
			$(".dhx_window__overlay").remove();
		}
	};

	xui.module.tree	= function(config, element){
		if(!xui.valid.isEmpty(element.treeController)){
			element.treeController.destroy();
		}
		if(this._validTree(config)){
			/* Wrapping tree container element */
			element.innerHTML								= "";
			var container									= document.createElement("div"), title = element.getAttribute("xui-tooltip-title");
			container.className								= "xui-tree-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);
			if(xui.valid.isEmpty(title)){
				title										= element.id + "TREE";
				element.setAttribute("xui-tooltip-title", title);
			}
			element.classList.add("xui-tree");

			element.treeController							= this;
			this.element									= element;

			/* Define tree configuration */
			config.baseId									= element.id;
			config.title									= title;
			config.type										= "TREE";
			config.rootNodeId								= xui.valid.isEmpty(config.rootNodeId)			?	"*****"																					:	config.rootNodeId;
			config.spread									= xui.valid.isEmpty(config.spread)				?	false																					:	config.spread;
			config.spreadLevel								= xui.valid.isEmpty(config.spreadLevel)			?	0																						:	config.spreadLevel;
			config.button									= xui.valid.isEmpty(config.button)				?	true																					:	config.button;
			config.searchTitle								= xui.valid.isEmpty(config.searchTitle)			?	true																					:	config.searchTitle;
			config.dblClickOpen								= xui.valid.isEmpty(config.dblClickOpen)		?	true																					:	config.dblClickOpen;
			config.hideArrow								= xui.valid.isEmpty(config.hideArrow)			?	false																					:	config.hideArrow;
			config.calc										= xui.valid.isEmpty(config.calc)				?	false																					:	config.calc;
			config.dataKey									= xui.valid.isEmpty(config.dataKey)				?	{nodeId:"nodeId", parentNodeId:"parentNodeId", nodeTitle:"nodeTitle", useAt:"useAt"}	:	config.dataKey;
			config.nodeAddKey							   = xui.valid.isEmpty(config.nodeAddKey)			?	{}																						:	config.nodeAddKey;
			config.icon										= xui.valid.isEmpty(config.icon)				?	true																					:	config.icon;
			config.tooltip									= xui.valid.isEmpty(config.tooltip)				?	false																					:	config.tooltip;
			config.keyboard									= xui.valid.isEmpty(config.keyboard)			?	true																					:	config.keyboard;
			config.multiselect								= xui.valid.isEmpty(config.multiselect)			?	false																					:	config.multiselect;
			config.multiNodeSelect							= xui.valid.isEmpty(config.multiNodeSelect)		?	false																					:	config.multiNodeSelect;
			config.nodeDragMove								= xui.valid.isEmpty(config.nodeDragMove)		?	false																					:	config.nodeDragMove;
			config.removeAfterDrag							= xui.valid.isEmpty(config.removeAfterDrag)		?	false																					:	config.removeAfterDrag;
			config.dragBehavior								= xui.valid.isEmpty(config.dragBehavior)		?	"complex"																				:	config.dragBehavior;
			config.alwaysCallClick							= xui.valid.isEmpty(config.alwaysCallClick)		?	false																					:	config.alwaysCallClick;
			config.emptyrecords								= xui.valid.isEmpty(config.emptyrecords)		?	xui.enum.NO_DATA.getName()																:	config.emptyrecords;
			config.edit										= xui.valid.isEmpty(config.edit)				?	false																					:	config.edit;
			config.enableEditNode							= xui.valid.isEmpty(config.enableEditNode)		?	true																					:	config.enableEditNode;
			config.enableAddNode							= xui.valid.isEmpty(config.enableAddNode)		?	false																					:	config.enableAddNode;
			config.enableAddChildNode						= xui.valid.isEmpty(config.enableAddChildNode)	?	false																					:	config.enableAddChildNode;
			config.enableRemoveNode							= xui.valid.isEmpty(config.enableRemoveNode)	?	false																					:	config.enableRemoveNode;
			config.enableCutNode							= xui.valid.isEmpty(config.enableCutNode)		?	false																					:	config.enableCutNode;
			config.enablePasteNode							= xui.valid.isEmpty(config.enablePasteNode)		?	false																					:	config.enablePasteNode;
			config.context									= xui.valid.isEmpty(config.context)				?	[]																						:	config.context;
			config.leafNodeIcon								= xui.valid.isEmpty(config.leafNodeIcon)		?	"ico_tree_file_nor.svg"																	:	config.leafNodeIcon;
			config.openNodeIcon								= xui.valid.isEmpty(config.openNodeIcon)		?	"ico_folder_open.svg"																	:	config.openNodeIcon;
			config.closeNodeIcon							= xui.valid.isEmpty(config.closeNodeIcon)		?	"ico_folder_close.svg"																	:	config.closeNodeIcon;

			if(config.multiselect){
				this.element.classList.add("multi");
			}

			this.config										= config;

			this.status										= {};

			this.tree										= new dhtmlXTreeObject(element, "100%", "100%", config.rootNodeId);
			this.tree.element								= element;

			/*기본 skin 설정*/
			this.tree.setSkin("material");
			/*이미지 파일 root 경로 설정*/
			this.tree.setImagesPath(xui.com.getContextPath() + "html/xs/core/xui/img/tree/");
			/*트리 노드 라인별 이미지 파일 리스트 설정*/
			this.tree.setImageArrays("minus","ico_arrow_down_solid.svg","ico_arrow_down_solid.svg","ico_arrow_down_solid.svg","ico_arrow_down_solid.svg","ico_arrow_down_solid.svg");
			this.tree.setImageArrays("plus","ico_arrow_up_solid.svg","ico_arrow_up_solid.svg","ico_arrow_up_solid.svg","ico_arrow_up_solid.svg","ico_arrow_up_solid.svg");
			/*트리 노드 이미지 파일 리스트 설정*/
			this.tree.setStdImages(config.leafNodeIcon,config.openNodeIcon,config.closeNodeIcon);
			/*자식 leaf노드 카운트 계산*/
			this.tree.setChildCalcMode((this.config.calc ? "leafsrec" : "disabled"));
			/*노트 아이콘 나타내기 여부*/
			this.tree.enableTreeImages(this.config.icon);
			/*툴팁 노드 타이틀로 보여주기 여부*/
			this.tree.enableAutoTooltips(this.config.tooltip ? 1 : 0);
			/*키보드 가능 여부*/
			this.tree.enableKeyboardNavigation(this.config.keyboard);
			/*다중선택 가능 여부*/
			this.tree.enableMultiselection(this.config.multiNodeSelect, false);
			/*체크박스 모드*/
			this.tree.enableCheckBoxes(this.config.multiselect);
			/*체크박스 상하위 노드 동시선택*/
			this.tree.enableThreeStateCheckboxes(this.config.multiselect);
			/*드래그 앤 드랍 기능*/
			this.tree.enableDragAndDrop(this.config.nodeDragMove, true);
			this.tree.enableDragAndDropScrolling(this.config.nodeDragMove);
			if(this.config.nodeDragMove){
				this.tree.enableMercyDrag(!this.config.removeAfterDrag);
				/*드래그 앤 드랍 속성*/
				this.tree.setDragBehavior(this.config.dragBehavior);
			}
			/*노드 펼치기, 접기 전 이벤트*/
			this.tree.attachEvent("onOpenStart",function(id, state){
				return this.element.treeController._prevOpen(id, (state === 1 ? true : false));
			});
			/*노드 펼치기, 접기 후 이벤트*/
			this.tree.attachEvent("onOpenEnd",function(id, state){
				this.element.treeController._afterOpen(id, (state === 1 ? true : false));
			});
			/*노드 클릭 이벤트*/
			this.tree.attachEvent("onClick",function(id){
				return this.element.treeController._click(id, true);
			});
			/*노드 더블클릭 이벤트*/
			this.tree.attachEvent("onDblClick",function(id){
				this.element.treeController._dblClick(id);
			});
			/*노드 체크박스 체크 이벤트*/
			this.tree.attachEvent("onCheck",function(id, state){
				this.element.treeController._check(id, (state === 1 ? true : false));
			});
			/*키보드 네비게이션*/
			this.tree.attachEvent("onKeyPress", function(keycode, e){
				return this.element.treeController._keypress(keycode, e);
			});
			this.tree.attachEvent("onBeforeNodeDeleted", function(id){
				this.element.treeController._prevRemove(id);
			});
			/*노드 dnd 이벤트*/
			if(this.config.nodeDragMove){
				this.tree.attachEvent("onBeforeDrag",function(id){
					return this.element.treeController._dragStart(id, event);
				});
				this.tree.attachEvent("onDrag", function(sourceId, targetId, nextNodeId, source, target){
					return this.element.treeController._drag(sourceId, targetId, nextNodeId, source, target);
				});
				this.tree.attachEvent("onDrop",function(sourceId, targetId, nextNodeId, source, target){
					return this.element.treeController._drop(sourceId, targetId, nextNodeId, source, target);
				});
			}
			/*전체접기/전체펼치기 버튼 렌더링*/
			this._loadHeader();
			/*컨텍스트 메뉴*/
			this._loadCtx();

			return this;
		}
	};
	xui.module.tree.prototype	= {
		init : function(){
			this.status.prevId								= null;
			this.status.editId								= null;
			this.status.removeNodes							= {};
			if(!xui.valid.isEmpty(this.config.emptyContainer)){
				this.config.emptyContainer.classList.remove("on");
			}
			if(this.config.searchTitle){
				this.config.searchInput.controller.setData("");
			}
			this.tree.deleteChildItems(this.config.rootNodeId);
			this._resize();
			var idpull										= this.tree._idpull;
			for(var key in idpull){
				if(key !== this.config.rootNodeId){
					delete idpull[key];
				}
			}
		},
		loadData : function(data, key){
			if(!xui.valid.isEmpty(data)){
				if(xui.valid.isEmpty(key)){
					if(!xui.valid.isEmpty(this.config.dataGroupName)){
						key									= this.config.dataGroupName;
					}else{
						key									= "DATA";
					}
				}
				var loadData								= null;
				var prefix									= (key === "DATA" ? ""		: key + "_"	);
				var dataGroupName							= (key === "DATA" ? "DATA"	: key		);
				if(xui.valid.isXuiJson(data)){
					var size								= data.getCount(prefix);
					var
					loadData								= new xui.json();
					loadData.setHeader(prefix + "COUNT"		,data.getCount(dataGroupName));
					loadData.setHeader(prefix + "TOT_COUNT"	,data.getTotCount(dataGroupName));
					loadData.setDataJsonArray(data.getDataJsonArray(dataGroupName));
				}else if(xui.valid.isArray(data)){
					var size								= data.length;
					if(size > 0){
						if(Object.keys(data[0]).length === 0){
							size							= 0;
						}
					}
					loadData								= new xui.json();
					loadData.setDataJsonArray(data);
					loadData.setHeader(prefix + "COUNT"		,size);
					loadData.setHeader(prefix + "TOT_COUNT"	,size);
				}else if(xui.valid.isJson(data) && Object.keys(data).length > 0){
					loadData								= new xui.json();
					loadData.setDataJsonObject(data);
					loadData.setHeader(prefix + "COUNT"		,1);
					loadData.setHeader(prefix + "TOT_COUNT"	,1);
				}
				if(xui.valid.isXuiJson(loadData)){
					this._parseData(loadData.getJson());
					this.config.dataGroupName				= key;
				}
				this._resize();
			}
		},
		destroy : function(){
			if(!xui.valid.isEmpty(this.tree)){
				var parent									= this.element.parentNode.parentNode;
				var originElement							= document.createElement("div");
				originElement.id							= this.element.id;
				originElement.setAttribute("xui-tooltip-title", this.element.getAttribute("xui-tooltip-title"));
				this.tree.destructor();
				parent.innerHTML							= "";
				parent.appendChild(originElement);
				delete this.status;
				delete this.config;
				delete this.element;
				delete this.tree;
			}
		},
		getData : function(id){
			var nodeData									= null;
			id												= this.getId(id);
			if(!xui.valid.isEmpty(id)){
				if(!xui.valid.isArray(id)){
					id										= [id];
				}
				nodeData									= [];
				var nodeObject								= null;
				var jsonData								= null;
				for(var i = 0; i < id.length; i++){
					if(!xui.valid.isEmpty(id[i]) && id[i] !== this.config.rootNodeId){
						nodeObject							= this._getNodeFull(id[i]);
						jsonData							= xui.util.copyObject({}, nodeObject._attrs.data);
						jsonData["DATA_FLAG"]				= nodeObject._attrs.DATA_FLAG;
						jsonData["CREATED"]					= nodeObject._attrs.CREATED;
						if(!xui.valid.isEmpty(this.config.nodeAddKey)){
							var nodeAddKey = this.config.nodeAddKey;
							for(var key1 in nodeAddKey){
								jsonData[key1] = nodeObject._attrs.data[this.config.nodeAddKey[key1]];
							}
						}
						nodeData.push(jsonData);
					}
				}
				if(nodeData.length === 0){
					nodeData								= null;
				}else if(nodeData.length === 1){
					nodeData								= nodeData[0];
				}
			}
			return nodeData;
		},
		getAllData : function(){
			var nodeDataList								= [];
			var nodeObject									= this.tree._idpull;
			var rootNodeId									= this.config.rootNodeId;
			var data										= null;
			for(var nodeId in nodeObject){
				if(nodeId !== rootNodeId){
					var nodeData							= this.getData(nodeId);
					if(!xui.valid.isEmpty(nodeData)){
						nodeDataList.push(nodeData);
					}
				}
			}
			if(nodeDataList.length === 0){
				nodeDataList								= null;
			}
			return nodeDataList;
		},
		getCheckedData : function(withParent){
			var nodeDataList								= [];
			if(this.config.multiselect){
				var checkedNodes							= null;
				var nodeData								= null;
				if(xui.valid.isEmpty(withParent)){
					withParent								= false;
				}
				if(withParent){
					checkedNodes							= this.tree.getAllCheckedBranches();
				}else{
					checkedNodes							= this.tree.getAllChecked();
				}
				if(!xui.valid.isEmpty(checkedNodes)){
					checkedNodes							= checkedNodes.split(",");
					for(var i = 0; i < checkedNodes.length; i++){
						nodeData							= this.getData(checkedNodes[i]);
						if(!xui.valid.isEmpty(nodeData)){
							nodeDataList.push(nodeData);
						}
					}
				}
			}
			if(nodeDataList.length === 0){
				nodeDataList								= null;
			}
			return nodeDataList;
		},
		getChangedData : function(){
			var nodeDataList 								= [];
			var nodeObject 									= this.tree._idpull;
			var rootNodeId 									= this.config.rootNodeId;
			var nodeJson 									= null;
			for (var nodeId in nodeObject) {
				nodeJson 									= nodeObject[nodeId];
				if (nodeId !== rootNodeId && nodeJson._attrs.DATA_FLAG !== xui.enum.TRANSACTION_NONE.getCode()) {
					var nodeData 							= this.getData(nodeId);
					if (!xui.valid.isEmpty(nodeData)) {
						nodeDataList.push(nodeData);
					}
				}
			}
			for (var nodeId in this.status.removeNodes) {
				nodeDataList.push(this.status.removeNodes[nodeId]);
			}
			if (nodeDataList.length === 0) {
				nodeDataList 								= null;
			}
			return nodeDataList;
		},
		getChildData : function(id, onlyChild){
			var nodeDataList								= null;
			if(this.isExist(id)){
				nodeDataList								= [];
				if(xui.valid.isEmpty(onlyChild)){
					onlyChild								= true;
				}
				var childNodes								= null;
				if(!onlyChild){
					childNodes								= this.tree.getAllSubItems(id).split(",");
				}else{
					childNodes								= this.tree.getSubItems(id).split(",");
				}
				for(var i = 0; i < childNodes.length; i++){
					if(!xui.valid.isEmpty(childNodes[i])){
						nodeDataList.push(this.getData(childNodes[i]));
					}
				}
				if(nodeDataList.length === 0){
					nodeDataList							= null;
				}
			}
			return nodeDataList;
		},
		getChildCount : function(id, onlyChild){
			var count										= 0;
			if(this.isExist(id)){
				if(xui.valid.isEmpty(onlyChild)){
					onlyChild								= true;
				}
				var childNodes								= null;
				if(onlyChild){
					childNodes								= this.tree.getAllSubItems(id).split(",");
				}else{
					childNodes								= this.tree.getSubItems(id).split(",");
				}
				for(var i = 0; i < childNodes.length; i++){
					if(!xui.valid.isEmpty(childNodes[i])){
						count++;
					}
				}
			}
			return count;
		},
		getParentData : function(id, onlyParent){
			var nodeDataList								= null;
			if(this.isExist(id)){
				nodeDataList								= [];
				var parentNodeId							= this.getParentId(id);
				if(!xui.valid.isEmpty(parentNodeId) && parentNodeId !== this.config.rootNodeId){
					nodeDataList.push(this.getData(parentNodeId));
					if(xui.valid.isEmpty(onlyParent)){
						onlyParent							= true;
					}
					if(!onlyParent){
						parentNodeId						= this.getParentId(parentNodeId);
						while(parentNodeId !== this.config.rootNodeId){
							nodeDataList.push(this.getData(parentNodeId));
							parentNodeId					= this.getParentId(parentNodeId);
						}
					}
				}
				if(nodeDataList.length === 0){
					nodeDataList							= null;
				}else if(nodeDataList.length === 1){
					nodeDataList							= nodeDataList[0];
				}
			}
			return nodeDataList;
		},
		getLeafData : function(id){
			var nodeDataList								= [];
			if(xui.valid.isEmpty(id)){
				var leafNodes								= this.tree.getAllChildless();
				if(!xui.valid.isEmpty(leafNodes)){
					leafNodes								= leafNodes.split(",");
					for(var i = 0; i < leafNodes.length; i++){
						if(!xui.valid.isEmpty(leafNodes[i])){
							nodeDataList.push(this.getData(leafNodes[i]));
						}
					}
				}
			}else if(this.isExist(id)){
				var childNodes								= this.tree.getAllSubItems(id).split(",");
				for(var i = 0; i < childNodes.length; i++){
					if(!xui.valid.isEmpty(childNodes[i])){
						if(this.isLeaf(childNodes[i])){
							nodeDataList.push(this.getData(childNodes[i]));
						}
					}
				}
			}
			if(nodeDataList.length === 0){
				nodeDataList								= null;
			}
			return nodeDataList;
		},
		getParentId : function(id){
			var parentId									= null;
			if(this.isExist(id)){
				parentId									= this.tree.getParentId(id);
			}
			return parentId;
		},
		getId : function(id){
			var nodeId										= id;
			if(xui.valid.isEmpty(id)){
				nodeId										= this.tree.getSelectedItemId();
			}
			if(!xui.valid.isEmpty(nodeId)){
				if(this.config.multiNodeSelect && nodeId.indexOf(",") >= 0){
					nodeId									= nodeId.split(",");
					for(var i = 0; i < nodeId.length; i++){
						if(!this.isExist(nodeId[i])){
							nodeId.splice(i,1);
						}
					}
					if(nodeId.length === 0){
						nodeId								= null;
					}else if(nodeId.length === 1){
						nodeId								= nodeId[0];
					}
				}else if(!this.isExist(nodeId)){
					nodeId									= null;
				}
			}else{
				nodeId										= null;
			}
			return nodeId;
		},
		getTitle : function(id){
			var nodeTitle									= null;
			if(this.isExist(id)){
				nodeTitle									= this.tree.getItemText(id);
				nodeTitle									= nodeTitle.replace(xuic.__REGEXP.getCmmnRegexp("ALL_HTML_TAG"), "");
				if(this.config.calc && !this.isLeaf(id)){
					var lastIdx								= nodeTitle.lastIndexOf("[");
					if(lastIdx >= 0){
						nodeTitle							= nodeTitle.substr(0, lastIdx-1);
					}
				}
			}
			return nodeTitle;
		},
		getEditId : function(){
			return this.status.editId;
		},
		setData : function(id, data){
			if(this.isExist(id) && !xui.valid.isEmpty(data)){
				if(xui.valid.isArray(data) && data.length > 0){
					data									= data[0];
				}
				if(xui.valid.isJson(data)){
					var nodeObject							= this._getNodeFull(id);
					var nodeData							= this.getData(id);
					var changeId							= "";
					for(var key in data){
						if(nodeData.hasOwnProperty(key)){
							nodeData[key]					= data[key];
							if(key === this.config.dataKey.nodeId){
								changeId					= nodeData[key];
								this.tree.changeItemId(id, changeId);
								if(this.status.prevId === id){
									this.status.prevId		= changeId;
								}
							}
						}
					}
					nodeData["nodeId"]						= nodeData[this.config.dataKey.nodeId];
					nodeData["nodeTitle"]					= nodeData[this.config.dataKey.nodeTitle];
					nodeData["parentNodeId"]				= nodeData[this.config.dataKey.parentNodeId];
					nodeObject._attrs.data					= nodeData;
					this._compareAndReflect(this._getNodeFull(nodeData[this.config.dataKey.nodeId]), nodeData);
				}
			}
		},
		setChecked : function(id, checked){
			if(this.isExist(id) && this.config.multiselect){
				if(xui.valid.isEmpty(checked)){
					checked								= true;
				}
				var checkbox							   = this._getNodeFull(id).xui_checkbox;
				if(!xui.valid.isEmpty(checkbox) && checkbox.checked !== checkbox){
					checkbox.click();
				}
			}
		},
		getNodeInfo : function(id){
			var nodeInfo									= null;
			var node										= this._getNodeFull(id);
			if(!xui.valid.isEmpty(node)){
				var objNodeInfo								= node.span.parentNode.nextElementSibling;
				nodeInfo									= objNodeInfo.innerHTML;
			}
			return nodeInfo
		},
		setNodeInfo : function(id, data){
			var node										= this._getNodeFull(id);
			if(!xui.valid.isEmpty(node) && !xui.valid.isEmpty(data)){
				var objNodeInfo								= node.span.parentNode.nextElementSibling;
				objNodeInfo.innerHTML						= data;
			}
		},
		addNodeClass : function(id, classes){
			var node										= this._getNodeFull(id);
			if(!xui.valid.isEmpty(node) && !xui.valid.isEmpty(classes)){
				if(!xui.valid.isArray(classes)){
					classes									= classes.split(" ");
				}
				for(var i = 0; i < classes.length; i++){
					node.span.parentNode.classList.add(classes[i]);
				}
			}
		},
		removeNodeClass : function(id, classes){
			var node										= this._getNodeFull(id);
			if(!xui.valid.isEmpty(node) && !xui.valid.isEmpty(classes)){
				if(!xui.valid.isArray(classes)){
					classes									= classes.split(" ");
				}
				for(var i = 0; i < classes.length; i++){
					node.span.parentNode.classList.remove(classes[i]);
				}
			}
		},
		add : function(nodeId, newNodeId, newNodeTitle, isActive){
			if(this.isExist(nodeId) && !xui.valid.isEmpty(newNodeId)){
				if(xui.valid.isEmpty(newNodeTitle)){
					newNodeTitle							= "";
				}
				if(xui.valid.isEmpty(isActive)){
					isActive								= true;
				}
				var doAdd									= true;
				var nodeObject								= this._getNodeFull(nodeId);
				var parentNodeId							= this.getParentId(nodeId);
				var data									= this.getData(nodeId);
				var nodeLevel								= this.tree.getLevel(nodeId);
				var newNodeData								= {};
				for(var key in data){
					newNodeData[key]						= "";
				}
				if(typeof(this.config.onBeforeAdd) === "function"){
					doAdd									= this.config.onBeforeAdd.call(this, nodeId, parentNodeId, data);
					if(xui.valid.isEmpty(doAdd)){
						doAdd								= true;
					}
				}
				if(doAdd){
					newNodeData["nodeId"]					= newNodeId;
					newNodeData["nodeTitle"]				= newNodeTitle;
					newNodeData["nodeLevel"]				= nodeLevel;
					newNodeData["parentNodeId"]				= parentNodeId;
					newNodeData[this.config.dataKey.nodeId]	= newNodeId;
					newNodeData[this.config.dataKey.nodeTitle]		= newNodeTitle;
					newNodeData[this.config.dataKey.parentNodeId]	= parentNodeId;
					var newNodeJson							= {};
					newNodeJson["id"]						= newNodeId;
					newNodeJson["data"]						= newNodeData;
					newNodeJson["origin"]					= newNodeData;
					newNodeJson["DATA_FLAG"]				= xui.enum.TRANSACTION_INSERT.getCode();
					newNodeJson["CREATED"]					= "DOING";
					newNodeJson["EDITING"]					= false;
					if(this.config.dataKey.hasOwnProperty("useAt") && newNodeData.hasOwnProperty(this.config.dataKey.useAt)){
						newNodeJson["USE_AT"]				= newNodeData[this.config.dataKey.useAt];
					}else if(newNodeData.hasOwnProperty("useAt")){
						newNodeJson["USE_AT"]				= newNodeData["USE_AT"];
					}else{
						newNodeJson["USE_AT"]				= "Y";
					}
					if(xui.valid.isEmpty(newNodeJson["USE_AT"])){
						newNodeJson["USE_AT"]				= "Y";
					}
					newNodeJson["text"]						= newNodeTitle;
					if(this.config.spread || (this.config.spreadLevel > 0 && this.config.spreadLevel >= newNodeData.nodeLevel)){
						newNodeJson["open"]					= "1";
					}
					newNodeJson["tooltip"]					= newNodeData.nodeTitle;
					if(!xui.valid.isEmpty(this.config.nodeAddKey)){
						var nodeAddKey = this.config.nodeAddKey;
						for(var key1 in nodeAddKey){
							newNodeJson[key1] = "";
						}
					}
					var pointer								= new jsonPointer(newNodeJson);
					var parentNodeObject					= this._getNodeFull(parentNodeId);
					var preNodeObject						= null;
					var nextNodeObject						= null;
					for(var i = 0; i < parentNodeObject.childNodes.length; i++){
						if(parentNodeObject.childNodes[i].id === nodeId){
							if(i > 0){
								preNodeObject				= parentNodeObject.childNodes[i-1];
							}
							if(i < parentNodeObject.childNodes.length-1){
								nextNodeObject				= parentNodeObject.childNodes[i+1];
							}
							break;
						}
					}
					this._renderNode(pointer, parentNodeObject, nextNodeObject, null);
					this.tree._fixChildCountLabel(parentNodeObject);
					for(var i = 0; i < parentNodeObject.childNodes.length; i++){
						if(xui.valid.isEmpty(parentNodeObject.childNodes[i])){
							parentNodeObject.childNodes.splice(i,1);
						}
					}
					this._recursiveDraw(this._getNodeFull(newNodeId), null, null, data.nodeLevel);
					if(isActive){
						this.select(newNodeId);
						if(this.config.edit){
							this._editStart(newNodeId);
						}
					}
					var newNodeObject						= this._getNodeFull(newNodeId);
					newNodeObject.span.parentNode.parentNode.classList.add("created");
					newNodeObject.span.parentNode.nextElementSibling.innerHTML	= "<div class='createNode'></div>";
					this._resize();
					if(typeof(this.config.onAdded) === "function"){
						this.config.onAdded.call(this, newNodeId, parentNodeId, this.getData(newNodeId), this.getData(parentNodeId));
					}
				}
			}
		},
		insert : function(nodeId, newNodeId, newNodeTitle, isActive){
			if(this.isExist(nodeId) && !xui.valid.isEmpty(newNodeId)){
				if(xui.valid.isEmpty(newNodeTitle)){
					newNodeTitle							= "";
				}
				if(xui.valid.isEmpty(isActive)){
					isActive								= true;
				}
				var doAdd									= true;
				var nodeObject								= this._getNodeFull(nodeId);
				var data									= this.getData(nodeId);
				var nodeLevel								= this.tree.getLevel(nodeId) + 1;
				var newNodeData								= {};
				for(var key in data){
					newNodeData[key]						= "";
				}
				if(typeof(this.config.onBeforeAdd) === "function"){
					doAdd									= this.config.onBeforeAdd.call(this, nodeId, nodeId, data);
					if(xui.valid.isEmpty(doAdd)){
						doAdd								= true;
					}
				}
				if(doAdd){
					newNodeData["nodeId"]					= newNodeId;
					newNodeData["nodeTitle"]				= newNodeTitle;
					newNodeData["nodeLevel"]				= nodeLevel;
					newNodeData["parentNodeId"]				= nodeId;
					newNodeData[this.config.dataKey.nodeId]	= newNodeId;
					newNodeData[this.config.dataKey.nodeTitle]		= newNodeTitle;
					newNodeData[this.config.dataKey.parentNodeId]	= nodeId;
					var newNodeJson							= {};
					newNodeJson["id"]						= newNodeId;
					newNodeJson["data"]						= newNodeData;
					newNodeJson["origin"]					= newNodeData;
					newNodeJson["DATA_FLAG"]				= xui.enum.TRANSACTION_INSERT.getCode();
					newNodeJson["CREATED"]					= "DOING";
					newNodeJson["EDITING"]					= false;
					if(this.config.dataKey.hasOwnProperty("useAt") && newNodeData.hasOwnProperty(this.config.dataKey.useAt)){
						newNodeJson["USE_AT"]				= newNodeData[this.config.dataKey.useAt];
					}else if(newNodeData.hasOwnProperty("useAt")){
						newNodeJson["USE_AT"]				= newNodeData["USE_AT"];
					}else{
						newNodeJson["USE_AT"]				= "Y";
					}
					if(xui.valid.isEmpty(newNodeJson["USE_AT"])){
						newNodeJson["USE_AT"]				= "Y";
					}
					newNodeJson["text"]						= newNodeTitle;
					if(this.config.spread || (this.config.spreadLevel > 0 && this.config.spreadLevel >= newNodeData.nodeLevel)){
						newNodeJson["open"]					= "1";
					}
					newNodeJson["tooltip"]					= newNodeData.nodeTitle;
					if(!xui.valid.isEmpty(this.config.nodeAddKey)){
						var nodeAddKey = this.config.nodeAddKey;
						for(var key1 in nodeAddKey){
							newNodeJson[key1] = "";
						}
					}
					var pointer								= new jsonPointer(newNodeJson);
					var preNodeObject						= null;
					var nextNodeObject						= null;
					for(var i = 0; i < nodeObject.childNodes.length; i++){
						if(nodeObject.childNodes[i].id === nodeId){
							if(i > 0){
								preNodeObject				= nodeObject.childNodes[i-1];
							}
							if(i < parentNodeObject.childNodes.length-1){
								nextNodeObject				= nodeObject.childNodes[i+1];
							}
							break;
						}
					}
					this._renderNode(pointer, nodeObject, nextNodeObject, null);
					this.tree._fixChildCountLabel(nodeObject);
					for(var i = 0; i < nodeObject.childNodes.length; i++){
						if(xui.valid.isEmpty(nodeObject.childNodes[i])){
							nodeObject.childNodes.splice(i,1);
						}
					}
					this._recursiveDraw(this._getNodeFull(newNodeId), null, null, data.nodeLevel + 1);
					if(isActive){
						this.select(newNodeId);
						if(this.config.edit){
							this._editStart(newNodeId);
						}
					}
					var newNodeObject						= this._getNodeFull(newNodeId);
					newNodeObject.span.parentNode.parentNode.classList.add("created");
					newNodeObject.span.parentNode.nextElementSibling.innerHTML	= "<div class='createNode'></div>";
					this._resize();
					if(typeof(this.config.onAdded) === "function"){
						this.config.onAdded.call(this, newNodeId, nodeObject.id, this.getData(newNodeId), this.getData(nodeObject.id));
					}
				}
			}
		},
		remove : function(id){
			if(this.isExist(id)){
				var nodeData								= this.getData(id);
				var childNodeData							= this.getChildData(id, false);
				var targetAllIds							= [];
				var targetAllData							= [];
				var doRemove								= true;
				targetAllIds.push(id);
				targetAllData.push(nodeData);
				if(!xui.valid.isEmpty(childNodeData)){
					targetAllIds							= targetAllIds.concat(this.tree.getAllSubItems(id).split(","));
					targetAllData							= targetAllData.concat(childNodeData);
				}
				if(typeof(this.config.onBeforeRemove) === "function"){
					doRemove								= this.config.onBeforeRemove.call(this, targetAllIds, targetAllData);
					if(xui.valid.isEmpty(doRemove)){
						doRemove							= true;
					}
				}
				if(doRemove){
					this.tree.deleteItem(targetAllIds[0], false);
					delete this.tree._idpull[targetAllIds[0]];
					for(var i = 1; i < targetAllIds.length; i++){
						delete this.tree._idpull[targetAllIds[i]];
						if(this.config.edit && !this.status.removeNodes.hasOwnProperty(targetAllIds[i])){
							this.status.removeNodes[targetAllIds[i]]	= targetAllData[i];
						}
					}
					if(targetAllIds.indexOf(this.status.prevId) >= 0){
						this.status.prevId					= null;
					}
					if(typeof(this.config.onRemoved) === "function"){
						this.config.onRemoved.call(this, targetAllIds, targetAllData);
					}
				}
			}
		},
		removeChecked : function(){
			var checkedIds									= this.tree.getAllChecked();
			var checkedData									= this.getCheckedData();
			if(!xui.valid.isEmpty(checkedData)){
				checkedIds									= checkedIds.split(",");
				var doRemove								= true;
				if(typeof(this.config.onBeforeRemove) === "function"){
					doRemove								= this.config.onBeforeRemove.call(this, checkedIds, checkedData);
					if(xui.valid.isEmpty(doRemove)){
						doRemove							= true;
					}
				}
				if(doRemove){
					for(var i = 0; i < checkedIds.length; i++){
						if(this.config.edit && !this.status.removeNodes.hasOwnProperty(checkedIds[i])){
							this.status.removeNodes[checkedIds[i]]	= checkedData[i];
						}
						if(this.isExist(checkedIds[i])){
							this.tree.deleteItem(checkedIds[i], false);
						}
						delete this.tree._idpull[checkedIds[i]];
					}
					if(checkedIds.indexOf(this.status.prevId) >= 0){
						this.status.prevId					= null;
					}
					if(typeof(this.config.onRemoved) === "function"){
						this.config.onRemoved.call(this, checkedIds, checkedData);
					}
				}
			}
		},
		getLevel : function(id){
			var level										= -1;
			if(this.isExist(id)){
				level										= this.tree.getLevel(id);
			}
			return level;
		},
		spread : function(id, spread){
			if(this.isExist(id)){
				if(xui.valid.isEmpty(spread)){
					spread									= true;
				}
				if(spread){
					this.tree.openItem(id);
				}else{
					this.tree.closeItem(id);
				}
				this._resize();
			}
		},
		fold : function(id){
			this.spread(id, false);
		},
		spreadAll : function(spread){
			if(xui.valid.isEmpty(spread)){
				spread										= true;
			}
			if(spread){
				this.tree.openAllItems(this.config.rootNodeId);
			}else{
				this.tree.closeAllItems(this.config.rootNodeId);
			}
			this._resize();
		},
		foldAll : function(){
			this.spreadAll(false);
		},
		select : function(id, doCallFn, prevAllowed){
			if(this.isExist(id)){
				if(xui.valid.isEmpty(doCallFn)){
					doCallFn								= true;
				}
				if(xui.valid.isEmpty(prevAllowed)){
					prevAllowed								= false;
				}
				this.tree.selectItem(id, doCallFn, prevAllowed);
				this.tree.focusItem(id);
				this.focusTree();
			}
		},
		reselect : function(){
			if(this.isExist(this.status.prevId)){
				if(typeof(this.config.onClickData) !== "undefined"){
					this.config.onClickData.call(this, this.status.prevId, this.getParentId(this.status.prevId), this.status.prevId, this.getData(this.status.prevId));
				}
			}
		},
		unselect : function(){
			var id											= this.getId();
			var prevId										= this.status.prevId;
			if(!xui.valid.isEmpty(prevId) && !xui.valid.isEmpty(id) && id === prevId){
				var nodeObject								= this._getNodeFull(prevId);
				if(this.config.edit){
					if(this.isEditing(prevId)){
						this._editCancel(prevId);
					}
					nodeObject.span.parentNode.classList.remove("ready");
				}
				if(typeof(this.config.unSelectData) === "function"){
					this.config.unSelectData.call(this, prevId, this.getData(prevId));
				}
				this.tree.clearSelection();
				this.status.prevId							= null;
			}
		},
		stopEdit : function(cancel){
			if(this.config.edit){
				var editId									= this.getEditId();
				if(this.isEditing(editId)){
					if(xui.valid.isEmpty(cancel)){
						cancel								= true;
					}
					if(cancel){
						this._editCancel(editId);
					}else{
						this._editDone(editId);
					}
				}
			}
		},
		isRootNode : function(id){
			return this.config.rootNodeId === id;
		},
		isExist : function(id){
			return (this._getNodeFull(id) !== null);
		},
		isSpread : function(id){
			var isSpread									= false;
			if(this.isExist(id)){
				isSpread									= (this.tree.getOpenState(id) === 1);
			}
			return isSpread;
		},
		isLeaf : function(id){
			var isLeaf										= false;
			if(this.isExist(id)){
				isLeaf										= (this.tree.hasChildren(id) === 0);
			}
			return isLeaf;
		},
		isEditing : function(id){
			var editing										= false;
			if(this.isExist(id)){
				editing										= this._getNodeFull(id)._attrs.EDITING;
			}
			return editing;
		},
		isUsable : function(id){
			var usable										= false;
			if(this.isExist(id)){
				usable										= this._getNodeFull(id)._attrs.USE_AT === "Y";
			}
			return usable;
		},
		isDeleted : function(id){
			var deleted										= false;
			if(this.isExist(id)){
				deleted										= this._getNodeFull(id)._attrs.DATA_FLAG === xui.enum.TRANSACTION_DELETE.getCode();
			}
			return deleted;
		},
		focusTree : function(){
			this.tree.allTree.nextElementSibling.focus();
		},
		showTooltip : function(id, message, type, expire, icon, width, height){
			var tooltip										= null;
			if(this.isExist(id) && !xui.valid.isEmpty(message)){
				if(xui.valid.isEmpty(type)){
					type									= "";
				}
				if(xui.valid.isEmpty(expire)){
					expire									= 3000;
				}
				if(xui.valid.isEmpty(icon)){
					icon									= "";
				}
				tooltip										= xuic.__COM.showMessageTip(this._getNodeFull(id).span.parentNode, message, type, expire, icon, width, height);
			}
			return tooltip;
		},
		_loadHeader : function(){
			var docFrag										= null;
			var createElement								= null;
			if(this.config.button || this.config.searchTitle){
				this.element.classList.add("header");
				docFrag										= document.createDocumentFragment();
				createElement								= document.createElement("div");
				createElement.classList.add("xui-tree-header");
				docFrag.appendChild(createElement);

				createElement								= document.createElement("div");
				createElement.classList.add("buttons");
				docFrag.firstChild.appendChild(createElement);
				if(!this.config.button){
					createElement.classList.add("xui-invisible");
				}
				createElement								= document.createElement("div");
				createElement.setAttribute("xui-tooltip-title", xuic.__i18n.getLabel("foldAll"));
				docFrag.firstChild.firstChild.appendChild(createElement);
				createElement.style.setProperty("background", "url('" + xui.com.getContextPath() + "html/xs/core/xui/img/tree/ico_folder_close_off.svg') 0 center no-repeat");
				createElement.onclick						= function(e){
					var treeController						= this.parentNode.parentNode.nextElementSibling.treeController;
					treeController.foldAll();
				};
				this.config.foldButton						= createElement;
				createElement								= document.createElement("div");
				createElement.setAttribute("xui-tooltip-title", xuic.__i18n.getLabel("spreadAll"));
				docFrag.firstChild.firstChild.appendChild(createElement);
				createElement.style.setProperty("background", "url('" + xui.com.getContextPath() + "html/xs/core/xui/img/tree/ico_folder_open_off.svg') 0 center no-repeat");
				createElement.onclick						= function(e){
					var treeController						= this.parentNode.parentNode.nextElementSibling.treeController;
					treeController.spreadAll();
				};
				this.config.spreadButton					= createElement;
				if(this.config.searchTitle){
					createElement							= document.createElement("div");
					createElement.classList.add("search");
					docFrag.firstChild.appendChild(createElement);
					createElement							= document.createElement("label");
					createElement.classList.add("xui-input-label");
					docFrag.firstChild.lastChild.appendChild(createElement);
					// 찾기 아이콘 클릭 이벤트에 버그가 있어 클릭 이벤트 순서 변경 by 전주원  2021.03.23
					$(createElement).before().click(function(e){
						var onkeypressEvent		= jQuery.Event("keypress");
						onkeypressEvent.which	= xui.enum.ENTER_EVENT.getCode();
						$(e.target).children('input').trigger(onkeypressEvent);
					});
					createElement							= document.createElement("input");
					createElement.type						= "text";
					createElement.className					= "search";
					createElement.placeholder				= xui.enum.ENTER_SEARCH_TERM.getName();
					createElement.xui_tree					= this.element;
					createElement.setAttribute("xui-tooltip-title", xuic.__i18n.getLabel("findNode"));
					createElement.onkeypress				= function(e){
						e.cancelBubble						= true;
						if(e.which === xui.enum.ENTER_EVENT.getCode()){
							var treeController				= this.xui_tree.treeController;
							/*
							##### 원본
							var value						= xui.util.replace(this.controller.getData(), " ", "");
							var prevNodeId					= null;
							if((!xui.valid.isEmpty(treeController.status.prevId) && xui.util.replace(treeController.getTitle(treeController.status.prevId), " ", "").indexOf(value) < 0) || xui.valid.isEmpty(value)){
								treeController.unselect();
							}
							if(!xui.valid.isEmpty(value.trim())){
								treeController.tree.findItem(value.trim());
							}
							*/
							// 공백을 포함한 문자도 검색할 수 있도록 변경 by 전주원 2021.03.24
							var value						= this.controller.getData();
							var prevNodeId					= null;
							if((!xui.valid.isEmpty(treeController.status.prevId) && xui.util.replace(treeController.getTitle(treeController.status.prevId), " ", "").indexOf(value) < 0) || xui.valid.isEmpty(value)){
								treeController.unselect();
							}
							if(!xui.valid.isEmpty(value)){
								treeController.tree.findItem(value);
							}
						}
						this.focus();
						return true;
					};
					/*
					// 찾기 아이콘 클릭 이벤트에 버그가 있어 클릭 이벤트 순서 변경 by 전주원  2021.03.23
					createElement.onclick					= function(e){
						if(e.target.fromIcon){
							var treeController				= this.xui_tree.treeController;
							var value						= xui.util.replace(this.controller.getData(), " ", "");
							var prevNodeId					= null;
							if((!xui.valid.isEmpty(treeController.status.prevId) && xui.util.replace(treeController.getTitle(treeController.status.prevId), " ", "").indexOf(value) < 0) || xui.valid.isEmpty(value)){
								treeController.unselect();
							}
							if(!xui.valid.isEmpty(value.trim())){
								treeController.tree.findItem(value.trim());
							}
						}
					};
					*/
					docFrag.firstChild.lastChild.firstChild.appendChild(createElement);
					this.config.searchInput					= createElement;
				}
				this.element.parentNode.insertBefore(docFrag, this.element);
				xui.com.elementScan(this.element.parentNode);
			}
		},
		_loadCtx : function(){
			if(this.config.edit && this.config.enableEditNode)		{this.config.context.unshift({id:"modify_node"		,icon:"xfi xfi-ico_0018_edit"						,text:xui.enum.TRANSACTION_UPDATE.getName()			,sort:"0"	,authType:xui.enum.AUTH_TYPE_UPDATE.getCode()});	}
			if(this.config.edit && this.config.enableAddNode)		{this.config.context.unshift({id:"add_node"			,icon:"xfi xfi-ico_0041_add"						,text:xui.enum.ADD.getName()			,sort:"0"	,authType:xui.enum.AUTH_TYPE_CREATE.getCode()});	}
			if(this.config.edit && this.config.enableAddChildNode)	{this.config.context.unshift({id:"add_child_node"	,icon:"xfi xfi-ico_0040_subdirectory_arrow_right"	,text:xui.enum.ADD_CHILD.getName()		,sort:"0"	,authType:xui.enum.AUTH_TYPE_CREATE.getCode()});	}
			if(this.config.edit && this.config.enableCutNode)		{this.config.context.unshift({id:"cut_node"			,icon:"xfi xfi-ico_0070_content_cut"				,text:xui.enum.CUT.getName()		,sort:"0"	,authType:xui.enum.AUTH_TYPE_NONE.getCode()});		}
			if(this.config.edit && this.config.enablePasteNode)		{this.config.context.unshift({id:"paste_node"		,icon:"xfi xfi-ico_0071_content_paste"				,text:xui.enum.PASTE.getName()		,sort:"0"	,authType:xui.enum.AUTH_TYPE_NONE.getCode()});		}
			if(this.config.edit && this.config.enableRemoveNode)	{this.config.context.unshift({id:"remove_node"		,icon:"xfi xfi-ico_0042_delete"						,text:xui.enum.TRANSACTION_DELETE.getName()			,sort:"0"	,authType:xui.enum.AUTH_TYPE_DELETE.getCode()});	}
			if(this.config.context.length > 0){
				for(var i = 0; i < this.config.context.length; i++){
					if(xui.valid.isEmpty(this.config.context[i].sort)){
						this.config.context[i].sort			= i.toString();
					}
				}
				this.config.context							= xuic.__UTIL.quickSort(this.config.context, "sort");
				this.config.context.push(						 								{id:"close_menu"		,icon:"xfi xfi-ico_0013_close_bold"					,text:xui.enum.CLOSE.getName()			,sort:"99"	,authType:xui.enum.AUTH_TYPE_NONE.getCode()});
				var ctx										= new xui.module.context({contents:this.config.context, customClass:"xui-tree-context", onBeforeShow:function(element, e){
					if(xui.valid.isElement(this.ctx.xui_tree)){
						return this.ctx.xui_tree.treeController._prevShowCtx(this.targetElement, e);
					}
				}}, this.element.firstChild).ctx;
				ctx.events.detach("Click");
				ctx.xui_tree								= this.element;
				ctx.events.on("Click", function(id, e){
					if(xui.valid.isElement(this.xui_tree)){
						this.xui_tree.treeController._clickCtxItem(id, e);
					}
				});
				this.config.ctx								= ctx;
			}
		},
		_prevShowCtx : function(element, evt){
			xuic.__COM.closeActiveDirective();
			var target										= null;
			var isValid										= true;
			while(element){
				if(typeof(element.classList) !== "undefined" && element.classList.contains("dhxTextCell")){
					target									= element;
					break;
				}
				element										= element.parentNode;
			}
			this.config.ctxNodeId							= null;
			if(target !== null){
				var nodeObject								= target.parentObject;
				var dataFlag								= nodeObject._attrs.DATA_FLAG;
				if(nodeObject._attrs.DATA_FLAG === xui.enum.TRANSACTION_INSERT.getCode() && nodeObject._attrs.CREATED === "DOING"){
					isValid									= false;
				}else{
					this.config.ctxNodeId					= nodeObject.id;
					var doCallClickFn						= false;
					var prevNodeId							= this.status.prevId;
					if(prevNodeId !== this.config.ctxNodeId || (prevNodeId === this.config.ctxNodeId && this.config.alwaysCallClick)){
						doCallClickFn						= true;
					}
					this._click(this.config.ctxNodeId, false);
					this.select(this.config.ctxNodeId, false, false);
					if(doCallClickFn && typeof(this.config.onClickData) === "function"){
						this.config.onClickData.call(this, this.config.ctxNodeId, this.getParentId(this.config.ctxNodeId), prevNodeId, this.getData(this.config.ctxNodeId), true);
					}
					var ctxController						= this.config.ctx.element.ctxController;
					if(typeof(this.config.onBeforeContext) === "function"){
						isValid								= this.config.onBeforeContext.call(this, this.config.ctx, this.config.ctxNodeId, this.getData(this.config.ctxNodeId));
						if(xui.valid.isEmpty(isValid)){
							isValid							= true;
						}
					}
					if(isValid){
						if(this.config.enableRemoveNode){
							if(this.isDeleted(nodeObject.id)){
								ctxController.setValue("remove_node", xui.enum.CANCEL_DELETE.getName());
								ctxController.setIcon("remove_node", "xfi xfi-ico_0077_undo");
							}else{
								ctxController.setValue("remove_node", xui.enum.BUTTON_DELETE.getName());
								ctxController.setIcon("remove_node", "xfi xfi-ico_0042_delete");
							}
						}
						if(this.config.enableCutNode){
							if(this.tree.nodeCut.length > 0 && this.tree.nodeCut[0].id === nodeObject.id){
								ctxController.setValue("cut_node", xui.enum.CUT_CANCEL.getName());
								ctxController.setIcon("cut_node", "xfi xfi-ico_0077_undo");
							}else{
								ctxController.setValue("cut_node", xui.enum.CUT.getName());
								ctxController.setIcon("cut_node", "xfi xfi-ico_0070_content_cut");
							}
						}
						if(this.config.edit){
							if(this.isEditing(nodeObject.id)){
								ctxController.setValue("modify_node", xui.enum.CANCEL_EDIT.getName());
								ctxController.setIcon("modify_node", "xfi xfi-ico_0077_undo");
							}else{
								ctxController.setValue("modify_node", xui.enum.BUTTON_UPDATE.getName());
								ctxController.setIcon("modify_node", "xfi xfi-ico_0018_edit");
							}
						}
					}
				}
			}else{
				isValid										= false;
			}

			return isValid;
		},
		_clickCtxItem : function(id, evt){
			if(!xui.valid.isEmpty(this.config.ctxNodeId)){
				var _this									= this;
				var returnValue								= true;
				var nodeObject								= this._getNodeFull(this.config.ctxNodeId);
				var nodeId									= nodeObject.id;
				var childNodes								= null;
				switch(id){
					case "modify_node"		:
						if(this.isEditing(this.config.ctxNodeId)){
							this._editCancel(this.config.ctxNodeId);
						}else{
							this._editStart(this.config.ctxNodeId);
						}
						break;
					case "add_node"			:
						_this.add(nodeId, xui.dateutil.getNow() + xui.util.generateRandomChar(5, true), "", true);
						break;
					case "add_child_node"	:
						_this.insert(nodeId, xui.dateutil.getNow() + xui.util.generateRandomChar(5, true), "", true);
						break;
					case "cut_node"			:
						if(typeof(this.config.onBeforeCut) === "function"){
							returnValue						= this.config.onBeforeCut.call(this, nodeId, this.getParentId(nodeId), this.getData(nodeId));
							if(xui.valid.isEmpty(returnValue)){
								returnValue					= true;
							}
						}
						if(returnValue){
							if(this.tree.nodeCut.length > 0 && this.tree.nodeCut[0].id === nodeId){
								this.tree.clearCut();
							}else{
								this.tree.doCut();
							}
						}
						break;
					case "paste_node"		:
						this.tree.doPaste(nodeId);
						var pasteNodes						= this.tree.nodeCut;
						var changeNodes						= [];
						var data							= null;
						var originData						= null;
						for(var i = 0; i < pasteNodes.length; i++){
							changeNodes.push(pasteNodes[i].id);
							data									= this.getData(pasteNodes[i].id);
							data["parentNodeId"]					= this.config.ctxNodeId;
							data[this.config.dataKey.parentNodeId]	= this.config.ctxNodeId;
							this.setData(pasteNodes[i].id, data);
						}
						break;
					case "remove_node"		:
						this._delete(nodeId, !this.isDeleted(nodeId));
						break;
					default					:
						var menuList						= this.config.ctx.element.ctxController.menuList;
						if(menuList.hasOwnProperty(id)){
							var clickFn						= menuList[id].onclick;
							if(typeof(clickFn) === "function"){
								clickFn.call(this, nodeId, this.getData(nodeId));
							}
						}
						break;
				}
			}
		},
		_prevOpen : function(id, isOpen){
			xuic.__COM.closeActiveDirective();
			var returnValue									= true;
			var nodeData									= this.getData(id);
			if(!isOpen){
				if(typeof(this.config.onBeforeSpreadNode) === "function"){
					returnValue								= this.config.onBeforeSpreadNode.call(this, id, nodeData);
				}
			}else{
				if(typeof(this.config.onBeforeFoldNode) === "function"){
					returnValue								= this.config.onBeforeFoldNode.call(this, id, nodeData);
				}
			}
			if(xui.valid.isEmpty(returnValue)){
				returnValue									= true;
			}
			return returnValue;
		},
		_afterOpen : function(id, isOpen){
			this._resize();
			var nodeData									= this.getData(id);
			if(!isOpen){
				if(typeof(this.config.onFoldNode) === "function"){
					this.config.onFoldNode.call(this, id, nodeData);
				}
			}else{
				if(typeof(this.config.onSpreadNode) === "function"){
					this.config.onSpreadNode.call(this, id, nodeData);
				}
			}
		},
		_click : function(id, doCallFn){
			xuic.__COM.closeActiveDirective();
			var prevId										= this.status.prevId;
			if(!xui.valid.isEmpty(prevId)){
				if(id !== prevId){
					var nodeObject							= this._getNodeFull(prevId);
					if(this.config.edit){
						if(this.isEditing(prevId)){
							this._editCancel(prevId);
						}
						if(!xui.valid.isEmpty(nodeObject.span)){
							nodeObject.span.parentNode.classList.remove("ready");
						}
					}
					this.status.prevId						= null;
				}else if(!this.config.alwaysCallClick){
					doCallFn								= false;
				}
			}
			if(this.config.edit && !this.isEditing(id)){
				this._editReady(id);
			}
			if(doCallFn && typeof(this.config.onClickData) === "function"){
				this.config.onClickData.call(this, id, this.getParentId(id), prevId, this.getData(id), false);
			}
			this.status.prevId								= id;
			return true;
		},
		_dblClick : function(id){
			id												= this.getId(id);
			if(!xui.valid.isEmpty(id)){
				if(this.config.dblClickOpen){
					this.spread(id, !this.isSpread(id));
					this._resize();
				}
				if(typeof(this.config.onDblClickData) === "function"){
					this.config.onDblClickData.call(this, id, this.getParentId(id), this.status.prevId, this.getData(id));
				}
			}
		},
		_check : function(id, checked){
			var returnValue									= true;
			if(typeof(this.config.onClickCheckbox) === "function"){
				returnValue									= this.config.onClickCheckbox.call(this, id, this.getParentId(id), this.getData(id), checked);
				if(xui.valid.isEmpty(returnValue)){
					returnValue								= true;
				}
			}
			return returnValue;
		},
		_keypress : function(keycode, evt){
			if(!this.config.multiNodeSelect && this.config.edit){
				var nodeId									= this.getId();
				if(!xui.valid.isEmpty(nodeId)){
					var nodeObject							= this._getNodeFull(nodeId);
					var isEditing							= this.isEditing(nodeId);
					if(keycode >= 37 && keycode <= 40){
						if(isEditing){
							return false;
						}else{
							if(keycode === 38){
								var nextNode				= this.tree._getPrevVisibleNode(nodeObject);
								if(nextNode.id !== this.config.rootNodeId){
									this.select(nextNode.id);
								}
								return false;
							}else if(keycode === 40){
								var nextNode				= this.tree._getNextVisibleNode(nodeObject);
								if(nextNode.id !== this.config.rootNodeId){
									this.select(nextNode.id);
								}
								return false;
							}
						}
					}
					if(keycode === 113){
						this.config.ctxNodeId				= nodeId;
						this.config.ctx.events.fire("Click", ["modify_node"]);
					}else if(keycode === 46){
						if(this.config.enableRemoveNode){
							if(!isEditing){
								this.config.ctxNodeId		= nodeId;
								this.config.ctx.events.fire("Click", ["remove_node"]);
							}
						}
					}else if(evt.ctrlKey && keycode === 88){
						if(this.config.enableCutNode){
							if(!isEditing){
								this.config.ctxNodeId		= nodeId;
								this.config.ctx.events.fire("Click", ["cut_node"]);
							}
						}
					}else if(evt.ctrlKey && keycode === 86){
						if(this.config.enablePasteNode){
							if(!isEditing){
								this.config.ctxNodeId		= nodeId;
								this.config.ctx.events.fire("Click", ["paste_node"]);
							}
						}
					}else if(keycode === xui.enum.ENTER_EVENT.getCode()){
						if(isEditing){
							this._editDone(nodeId);
						}
						return false;
					}else if(keycode === xui.enum.ESC_EVENT.getCode()){
						if(isEditing){
							this._editCancel(nodeId);
						}
					}
				}
			}
			return true;
		},
		_dragStart : function(id, evt){
			if(this.config.edit && this.isEditing(id)){
				return false;
			}else{
				var prevId									= this.getId();
				var isExist									= false;
				if(!xui.valid.isEmpty(prevId)){
					isExist									= xui.valid.isArray(prevId) ? prevId.indexOf(id) >= 0 : prevId === id;
				}
				if(!isExist){
					this.select(id, true, (evt.ctrlKey && this.config.multiNodeSelect));
				}
				var returnValue								= true;
				if(typeof(this.config.onBeforeDragNode) === "function"){
					var nodeIds								= this.getId();
					var moveNodeData						= this.getData();
					if(!xui.valid.isArray(nodeIds)){
						nodeIds								= [nodeIds];
					}
					if(!xui.valid.isArray(moveNodeData)){
						moveNodeData						= [moveNodeData];
					}
					returnValue								= this.config.onBeforeDragNode.call(this, nodeIds, moveNodeData);
					if(xui.valid.isEmpty(returnValue)){
						returnValue							= false;
					}
				}
				return returnValue;
			}
		},
		_drag : function(sourceId, parentId, nextNodeId, source, target){
			var returnValue									= true;
			var sourceComponentElement						= source.element;
			var targetComponentElement						= target.element;
			var sourceController							= null, targetController = null;
			if(!xui.valid.isEmpty(sourceComponentElement.gridController)){
				sourceController							= sourceComponentElement.gridController;
			}else if(!xui.valid.isEmpty(sourceComponentElement.treeController)){
				sourceController							= sourceComponentElement.treeController;
			}
			if(!xui.valid.isEmpty(targetComponentElement.gridController)){
				targetController							= targetComponentElement.gridController;
			}else if(!xui.valid.isEmpty(targetComponentElement.treeController)){
				targetController							= targetComponentElement.treeController;
			}
			if(sourceController.config.type === "GRID"){
				if(typeof(this.config.onBeforeDropGridRow) === "function"){
					returnValue								= this.config.onBeforeDropGridRow.call(this, sourceId, sourceController.getRowData(sourceId), sourceController.config.baseId, parentId, (parentId === targetController.config.rootNodeId ? null : targetController.getData(parentId)), nextNodeId);
					if(xui.valid.isEmpty(returnValue)){
						returnValue							= true;
					}
				}
			}else if(sourceController.config.type === "TREE"){
				/*다른 tree 간 이동*/
				if(source === target){

				/*동일 tree 간 이동*/
				}else{

				}
				if(typeof(this.config.onBeforeDropNode) === "function"){
					var sourceNodeData 						= null;
					var targetData							= null;
					if(sourceController.config.rootNodeId !== sourceId){
						sourceNodeData						= sourceController.getData(sourceId);
					}
					if(targetController.config.rootNodeId !== parentId){
						targetData							= targetController.getData(parentId);
					}
					returnValue								= this.config.onBeforeDropNode.call(this, sourceId, parentId, sourceNodeData, targetData, nextNodeId, sourceController.config.baseId, targetController.config.baseId);
					if(xui.valid.isEmpty(returnValue)){
						returnValue							= true;
					}
				}
				if(returnValue){
					if(targetData == null){
						sourceNodeData.nodeLevel			= 1;
					}else{
						sourceNodeData.nodeLevel			= targetData.nodeLevel + 1;
					}
				}
			}
			return returnValue;
		},
		_drop : function(sourceId, parentId, nextNodeId, source, target){
			var returnValue									= true;
			var sourceComponentElement						= source.element;
			var targetComponentElement						= target.element;
			var sourceController							= null, targetController = null;
			if(!xui.valid.isEmpty(sourceComponentElement.gridController)){
				sourceController							= sourceComponentElement.gridController;
			}else if(!xui.valid.isEmpty(sourceComponentElement.treeController)){
				sourceController							= sourceComponentElement.treeController;
			}
			if(!xui.valid.isEmpty(targetComponentElement.gridController)){
				targetController							= targetComponentElement.gridController;
			}else if(!xui.valid.isEmpty(targetComponentElement.treeController)){
				targetController							= targetComponentElement.treeController;
			}
			var movedData									= null;
			if(sourceController.config.type === "GRID"){
				movedData									= [];
				var data									= sourceController.getRowData();
				if(!xui.valid.isArray(data)){
					movedData.push(data);
				}else{
					movedData								= data;
				}
				if(typeof(this.config.onDropGridRow) === "function"){
					var sourceRowData						= (sourceController.config.removeAfterDrag ? (sourceController.status.removeRows.hasOwnProperty(sourceId) ? sourceController.status.removeRows[sourceId] : null) : sourceController.getRowData(sourceId));
					returnValue								= this.config.onDropGridRow.call(this, sourceId, sourceRowData, sourceController.config.baseId, parentId, (parentId === targetController.config.rootNodeId ? null : targetController.getData(parentId)), nextNodeId);
					if(xui.valid.isEmpty(returnValue)){
						returnValue							= true;
					}
				}
			}else if(sourceController.config.type === "TREE"){
				/*다른 tree 간 이동*/
				if(source !== target){
					if(sourceController.config.removeAfterDrag){
						sourceController.status.prevId		= null;
					}
				}
				targetController.select(sourceId);
				if(typeof(targetController.config.onDropNode) === "function"){
					var sourceNodeData 						= null;
					var targetData							= null;
					if(sourceController.config.rootNodeId !== sourceId){
						sourceNodeData						= sourceController.getData(sourceId);
					}
					if(targetController.config.rootNodeId !== parentId){
						targetData							= targetController.getData(parentId);
					}
					returnValue								= targetController.config.onDropNode.call(this, sourceId, parentId, sourceNodeData, targetData, nextNodeId, sourceController.config.baseId, targetController.config.baseId);
					if(xui.valid.isEmpty(returnValue)){
						returnValue							= true;
					}
				}
				if(returnValue){
					var changeNodeLevel						= 1;
					if(targetData != null){
						changeNodeLevel						= parseInt(targetData.nodeLevel) + 1;
					}
					var nodeObject							= this._getNodeFull(sourceId);
					var nodeLineObject						= nodeObject.span.parentNode.parentNode;
					var classes								= nodeLineObject.classList;
					for(var i = 0; i < classes.length; i++){
						if(classes[i].indexOf("nodelevel") >= 0){
							nodeLineObject.classList.remove(classes[i]);
							nodeLineObject.classList.add("nodelevel" + changeNodeLevel);
							break;
						}
					}
				}
			}
			return returnValue;
		},
		_editReady : function(id){
			var nodeObject									= this._getNodeFull(id);
			if(!xui.valid.isEmpty(nodeObject)){
				nodeObject.span.parentNode.classList.add("ready");
			}
		},
		_editStart : function(id){
			var nodeObject									= this._getNodeFull(id);
			if(!xui.valid.isEmpty(nodeObject) && !this.isEditing(id)){
				this.status.editId							= id;
				var nodeData								= this.getData(id);
				var elementList								= xuic.__DOM.getElementsList(nodeObject.xui_edit.firstChild);
				var dataKey									= "";
				var focusElement							= null;
				for(var i = 0; i < elementList.length; i++){
					if(!xui.valid.isEmpty(elementList[i].controller)){
						if(focusElement == null){
							focusElement					= elementList[i];
						}
						dataKey								= elementList[i].getAttribute("dataKey");
						if(!xui.valid.isEmpty(dataKey) && nodeData.hasOwnProperty(dataKey)){
							elementList[i].controller.setData(nodeData[dataKey]);
						}else{
							elementList[i].controller.setData("");
						}
					}
				}
				nodeObject.span.parentNode.classList.remove("ready");
				nodeObject.span.parentNode.classList.add("editing");
				nodeObject._attrs.EDITING					= true;
				if(focusElement !== null){
					focusElement.focus();
					if(focusElement.tagName === "INPUT"){
						focusElement.select();
					}
				}
			}
		},
		_editDone : function(id){
			var nodeObject									= this._getNodeFull(id);
			if(!xui.valid.isEmpty(nodeObject) && this.isEditing(id)){
				var nodeData								= this.getData(id);
				var elementList								= xuic.__DOM.getElementsList(nodeObject.xui_edit.firstChild);
				var dataKey									= "";
				var value									= "";
				for(var i = 0; i < elementList.length; i++){
					if(!xui.valid.isEmpty(elementList[i].controller)){
						dataKey								= elementList[i].getAttribute("dataKey");
						if(!xui.valid.isEmpty(dataKey) && nodeData.hasOwnProperty(dataKey)){
							value							= elementList[i].controller.getData();
							if(dataKey === this.config.dataKey.nodeTitle){
								if(!xui.valid.isEmpty(value)){
									nodeData["nodeTitle"]	= value;
									nodeData[dataKey]		= value;
									this.tree.setItemText(id, value, value);
								}else{
									xuic.__COM.showMessageTip(elementList[i], xuic.__ENUM.EMPTY_DATA_FILL.getName(), "E", 5000);
								}
							}else{
								nodeData[dataKey]			= value;
							}
						}
					}
				}
				this.setData(nodeObject.id, nodeData);
				this._compareAndReflect(nodeObject, nodeData);
				nodeObject.span.parentNode.classList.remove("editing");
				nodeObject.span.parentNode.classList.add("ready");
				nodeObject._attrs.EDITING					= false;
				nodeObject._attrs.CREATED					= "DONE";
				if(typeof(this.config.onChangedEdit) === "function"){
					this.config.onChangedEdit.call(this, nodeObject.id, this.getParentId(nodeObject.id), this.getData(nodeObject.id), this.getParentData(nodeObject.id));
				}
				this.status.editId							= null;
				this.focusTree();
			}
		},
		_editCancel : function(id){
			var nodeObject									= this._getNodeFull(id);
			if(!xui.valid.isEmpty(nodeObject) && this.isEditing(id)){
				if(nodeObject._attrs.CREATED === "DOING"){
					this.remove(nodeObject.id);
				}else{
					var nodeData							= this.getData(id);
					var elementList							= xuic.__DOM.getElementsList(nodeObject.xui_edit.firstChild);
					var dataKey								= "";
					for(var i = 0; i < elementList.length; i++){
						if(!xui.valid.isEmpty(elementList[i].controller)){
							dataKey							= elementList[i].getAttribute("dataKey");
							if(!xui.valid.isEmpty(dataKey) && nodeData.hasOwnProperty(dataKey)){
								elementList[i].controller.setData(nodeData[dataKey]);
							}else{
								elementList[i].controller.setData("");
							}
						}
					}
					nodeObject.span.parentNode.classList.remove("editing");
					nodeObject.span.parentNode.classList.add("ready");
					nodeObject._attrs.EDITING				= false;
				}
				this.status.editId							= null;
				this.focusTree();
			}
		},
		_delete : function(id, deleted){
			if(!xui.valid.isEmpty(id)){
				if(xui.valid.isEmpty(deleted)){
					deleted									= true;
				}
				var nodeObject								= this._getNodeFull(id);
				var nodeData								= this.getData(id);
				var childNodeData							= this.getChildData(id, false);
				var targetAllIds							= [];
				var targetAllData							= [];
				targetAllIds.push(id);
				targetAllData.push(nodeData);
				if(!xui.valid.isEmpty(childNodeData)){
					targetAllIds							= targetAllIds.concat(this.tree.getAllSubItems(id).split(","));
					targetAllData							= targetAllData.concat(childNodeData);
				}
				if(nodeObject._attrs.DATA_FLAG === xui.enum.TRANSACTION_INSERT.getCode()){
					this.remove(id);
				}else{
					var doAction							= true;
					if(deleted){
						if(typeof(this.config.onBeforeRemove) === "function"){
							doAction						= this.config.onBeforeRemove.call(this, targetAllIds, targetAllData);
							if(xui.valid.isEmpty(doAction)){
								doAction					= true;
							}
						}
					}
					if(doAction){
						for(var i = targetAllIds.length-1; i >= 0; i--){
							nodeObject						= this._getNodeFull(targetAllIds[i]);
							if(deleted){
								nodeObject.span.parentNode.parentNode.classList.add("deleted");
								nodeObject.span.parentNode.nextElementSibling.innerHTML	= "<div class='deleteNode'></div>";
								nodeObject._attrs.DATA_FLAG	= xui.enum.TRANSACTION_DELETE.getCode();
							}else{
								nodeObject.span.parentNode.parentNode.classList.remove("deleted");
								nodeObject.span.parentNode.nextElementSibling.innerHTML	= "";
								nodeObject._attrs.DATA_FLAG	= xui.enum.TRANSACTION_NONE.getCode();
								this._compareAndReflect(nodeObject, targetAllData[i]);
							}
							if(typeof(this.config.onChangedEdit) === "function"){
								this.config.onChangedEdit.call(this, targetAllIds[i], this.getParentId(targetAllIds[i]), targetAllData[i], this.getParentData(targetAllIds[i]));
							}
						}
					}
				}
			}
		},
		_deleteCancel : function(id){
			this._delete(id, false);
		},
		_prevRemove : function(id){
			var nodeData									= this.getData(id);
			if(!xui.valid.isEmpty(nodeData)){
				var nodeDataFlag							= nodeData.DATA_FLAG;
				if(xui.valid.isEmpty(nodeDataFlag) || nodeDataFlag === xui.enum.TRANSACTION_NONE.getCode() || nodeDataFlag === xui.enum.TRANSACTION_UPDATE.getCode()){
					nodeData.DATA_FLAG						= xui.enum.TRANSACTION_DELETE.getCode();
					if(!this.status.removeNodes.hasOwnProperty(nodeData.nodeId)){
						this.status.removeNodes[nodeData.nodeId]	= nodeData;
					}
				}
			}
		},
		_setUseAt : function(nodeObject, useAt){
			nodeObject._attrs.USE_AT						= useAt;
			if(useAt === "N"){
				nodeObject.span.parentNode.classList.add("xui-strike-text");
			}else{
				nodeObject.span.parentNode.classList.remove("xui-strike-text");
			}
		},
		_compareAndReflect : function(nodeObject, nodeData){
			var nodeTitle									= nodeData[this.config.dataKey.nodeTitle];
			var dataFlag									= nodeObject._attrs.DATA_FLAG;
			if(this.config.edit && dataFlag !== xui.enum.TRANSACTION_INSERT.getCode() && dataFlag !== xui.enum.TRANSACTION_DELETE.getCode()){
				var originData								= nodeObject._attrs.origin;
				var changed									= false;
				for (var key in originData) {
					// 진현수 수정(2022.01.27) - tree커서 이동시 수정됨 상태 변경
					if (xui.util.restoreXSS(originData[key]) != xui.util.restoreXSS(nodeData[key])) {
						changed = true;
						break;
					}
				}
				var useAt									= nodeObject._attrs.USE_AT;
				if(nodeData.hasOwnProperty(this.config.dataKey.useAt)){
					useAt									= nodeData[this.config.dataKey.useAt];
				}
				this._setUseAt(nodeObject, useAt);
				if(changed){
					nodeObject._attrs.data					= nodeData;
					nodeObject._attrs.DATA_FLAG				= xui.enum.TRANSACTION_UPDATE.getCode();
					nodeObject.span.parentNode.parentNode.classList.add("changed");
					nodeObject.span.parentNode.nextElementSibling.innerHTML	= "<div class='changeNode'></div>";
				}else{
					nodeObject._attrs.data					= nodeData;
					nodeObject._attrs.DATA_FLAG				= xui.enum.TRANSACTION_NONE.getCode();
					nodeObject.span.parentNode.parentNode.classList.remove("changed");
					nodeObject.span.parentNode.nextElementSibling.innerHTML	= "";
				}
			}
		},
		_resize : function(){

		},
		_showEmpty : function(visible){
			if(xui.valid.isEmpty(this.config.emptyContainer)){
				this.config.emptyContainer					= document.createElement("div");
				this.config.emptyContainer.className		= "xui-tree-empty";
				this.config.emptyContainer.appendChild(document.createTextNode(this.config.emptyrecords));
				this.element.parentNode.appendChild(this.config.emptyContainer);
			}
			if(xui.valid.isEmpty(visible)){
				visible										= true;
			}
			if(visible){
				this.config.emptyContainer.classList.add("on");
			}else{
				this.config.emptyContainer.classList.remove("on");
			}
		},
		_hideEmpty : function(){
			this._showEmpty(false);
		},
		_parseData : function(data, parentId, level, start){
			var treeConfig									= this.config;
			var count										= data.HEADER.COUNT;
			data											= data.DATA;
			this.init();
			if(count === 0){
				this._showEmpty();
			}else{
				var treeData								= {};
				var jsonData								= null;
				var nodeId									= "";
				var classes									= [];
				var fullNodeId								= "full" + (this.config.dataKey.nodeId).substr(0,1).toUpperCase() + (this.config.dataKey.nodeId).substr(1);
				var fullNodeTitle							= "full" + (this.config.dataKey.nodeTitle).substr(0,1).toUpperCase() + (this.config.dataKey.nodeTitle).substr(1);
				var fullUseAt								= "";
				if(this.config.dataKey.hasOwnProperty("useAt")){
					fullUseAt								= "full" + (this.config.dataKey.useAt).substr(0,1).toUpperCase() + (this.config.dataKey.useAt).substr(1);
				}
				for(var i = 0; i < data.length; i++){
					jsonData								= data[i];
					nodeId									= jsonData.nodeId;
					treeData[nodeId]						= treeData[nodeId] || {};
					treeData[nodeId]["id"]					= nodeId;
					treeData[nodeId]["data"]				= jsonData;
					if(!xui.valid.isEmpty(this.config.nodeAddKey)){
						var nodeAddKey = this.config.nodeAddKey;
						for(var key1 in nodeAddKey){
							treeData[nodeId]["data"][key1]		  = jsonData[key1];
						}
					}
					treeData[nodeId]["origin"]				= jsonData;
					treeData[nodeId]["DATA_FLAG"]			= xui.enum.TRANSACTION_NONE.getCode();
					treeData[nodeId]["CREATED"]				= "DONE";
					treeData[nodeId]["EDITING"]				= false;
					treeData[nodeId]["item"]				= treeData[nodeId]["item"] || [];
					treeData[nodeId]["nodeInfo"]			= jsonData.nodeInfo	|| "";
					treeData[nodeId]["calcItem"]			= jsonData.calcItem	|| 0;
					if(jsonData.hasOwnProperty("calcItem") && !jsonData.hasOwnProperty("nodeInfo")){
						treeData[nodeId]["nodeInfo"]		= treeData[nodeId]["calcItem"];
					}
					if(jsonData.hasOwnProperty(fullNodeId)){
						jsonData[fullNodeId]				= xui.util.replace(jsonData[fullNodeId], "&gt;", ">");
					}
					if(jsonData.hasOwnProperty(fullNodeTitle)){
						jsonData[fullNodeTitle]				= xui.util.replace(jsonData[fullNodeTitle], "&gt;", ">");
					}
					if(!xui.valid.isEmpty(fullUseAt) && jsonData.hasOwnProperty(fullUseAt)){
						jsonData[fullUseAt]					= xui.util.replace(jsonData[fullUseAt], "&gt;", ">");
					}
					if(this.config.dataKey.hasOwnProperty("useAt") && jsonData.hasOwnProperty(this.config.dataKey.useAt)){
						treeData[nodeId]["USE_AT"]			= jsonData[this.config.dataKey.useAt];
					}else if(jsonData.hasOwnProperty("useAt")){
						treeData[nodeId]["USE_AT"]			= jsonData["useAt"];
					}else{
						treeData[nodeId]["USE_AT"]			= "Y";
					}
					if(xui.valid.isEmpty(treeData[nodeId]["USE_AT"])){
						treeData[nodeId]["USE_AT"]			= "Y";
					}
					treeData[nodeId]["text"]				= jsonData.nodeTitle;
					if(treeConfig.spread || (treeConfig.spreadLevel > 0 && treeConfig.spreadLevel >= jsonData.nodeLevel)){
						treeData[nodeId]["open"]			= "1";
					}else if(jsonData.hasOwnProperty("open")){
						treeData[nodeId]["open"]			= jsonData.open;
					}
					if(jsonData.hasOwnProperty("tooltip") && !xui.valid.isEmpty(jsonData.tooltip)){
						treeData[nodeId]["tooltip"]			= jsonData.tooltip;
					}
					if(treeConfig.multiselect){
						if(jsonData.hasOwnProperty("checked") && !xui.valid.isEmpty(jsonData.checked) && jsonData.checked == "1"){
							treeData[nodeId]["checked"]		= "1";
						}
						if(jsonData.hasOwnProperty("hidden") && !xui.valid.isEmpty(jsonData.hidden) && jsonData.hidden == "1"){
							treeData[nodeId]["nocheckbox"]	= "1";
						}
					}
					if(jsonData.hasOwnProperty("fileType") && !xui.valid.isEmpty(jsonData.fileType)){
						if(jsonData.hasOwnProperty("leafIconName") && !xui.valid.isEmpty(jsonData.leafIconName)){
							treeData[nodeId]["im0"]			= (jsonData.fileType === "D" ? this.tree.imageArray[2] : jsonData.leafIconName);
						}else{
							treeData[nodeId]["im0"]			= (jsonData.fileType === "D" ? this.tree.imageArray[2] : this.tree.imageArray[0]);
						}
					}
					if(jsonData.hasOwnProperty("classes")){
						classes								= jsonData.classes.split(" ");
					}else{
						classes								= [];
					}
					treeData[nodeId]["classes"]				= classes;
					treeData[jsonData.parentNodeId]			= treeData[jsonData.parentNodeId] || {item:[]};
					if(jsonData.hasOwnProperty("calcItem")){
						var parentData						= treeData[jsonData.parentNodeId];
						var calcItemValue					= treeData[nodeId]["calcItem"];
						while(!xui.valid.isEmpty(parentData)){
							parentData["calcItem"]			= parentData["calcItem"] + calcItemValue;
							parentData["nodeInfo"]			= parentData["calcItem"];
							if(parentData.hasOwnProperty("data")){
								parentData					= treeData[parentData.data.parentNodeId];
							}else{
								parentData					= null;
							}
						}
					}
					if(treeData[jsonData.parentNodeId].hasOwnProperty("item")){
						treeData[jsonData.parentNodeId].item.push(treeData[nodeId]);
					}
				}
				treeData[this.config.rootNodeId]["id"]		= treeConfig.rootNodeId;
				treeData									= treeData[this.config.rootNodeId];
				if(!this.tree.parsCount){
					this.tree.callEvent("onXLS", [this.tree, null]);
					this.tree.xmlstate						= 1;
				}
				var pointer									= new jsonPointer(treeData);
				if(!pointer.exists()){
					return;
				}
				this.skipLock								= true;
				var parentId								= pointer.get("id");
				/*deleting child items for refreshed branches*/
				if(this.tree._dynDeleteBranches[parentId]){
					this.tree.deleteChildItems(parentId);
					this.tree._dynDeleteBranches[parentId]--;
					if(!this.tree._dynDeleteBranches[parentId]){
						delete this.tree._dynDeleteBranches[parentId];
					}
				}
				var skey									= pointer.get("dhx_security");
				if(skey){
					dhtmlx.security_key						= skey;
				}
				this.tree.parsingOn							= parentId;
				this.tree.parsedArray						= new Array();
				this.tree.setCheckList						= "";
				this.tree.nodeAskingCall					= "";
				var temp									= this.tree._globalIdStorageFind(parentId);
				var preNode									= 0;
				if(!temp){
					return dhx4.callEvent("onDataStructureError",["XML refers to not existing parent"]);
				}
				this.tree.parsCount							= this.tree.parsCount ? (this.tree.parsCount + 1) : 1;
				this.tree.XMLloadingWarning					= 1;
				this.tree.npl								= 0;
				pointer.each("item", function(jp, i){
					temp.XMLload							= 1;
					this._renderNode(jp, temp, 0, preNode);
					this.tree.npl++;
				}, this, start);
				if(!level){
					pointer.each("userdata",function(jp){
						this.tree.setUserData(pointer.get("id"), jp.get("name"), jp.content());
					}, this);
					temp.XMLload							= 1;
					var parsedNodeTop						= this.tree._globalIdStorageFind(this.tree.parsingOn);
					for(var i = 0; i < this.tree.parsedArray.length; i++){
						temp.htmlNode.childNodes[0].appendChild(this.tree.parsedArray[i]);
					}
					this.tree.parsedArray					= [];
					this.tree.lastLoadedXMLId				= parentId;
					this.tree.XMLloadingWarning				= 0;
					var chArr								= this.tree.setCheckList.split(this.tree.dlmtr);
					for(var n = 0; n < chArr.length; n++){
						if(chArr[n]){
							this.tree.setCheck(chArr[n],1);
						}
					}
					if((this.tree.XMLsource)&&(this.tree.tscheck)&&(this.tree.smcheck)&&(temp.id!=this.tree.rootId)){
						if(temp.checkstate === 0){
							this.tree._setSubChecked(0, temp);
						}else if (temp.checkstate === 1){
							this.tree._setSubChecked(1, temp);
						}
					}
					this._recursiveDraw(null, start, null, 0);
					if(pointer.get("order") && pointer.get("order") !== "none"){
						this.tree._reorderBranch(temp, pointer.get("order"), true);
					}
					if(this.tree.nodeAskingCall != ""){
						this.tree.callEvent("onClick", [this.tree.nodeAskingCall, this.tree.getSelectedItemId()]);
					}
					if(this.tree._branchUpdate){
						this.tree._branchUpdateNext(pointer);
					}
				}
				if(this.tree.parsCount == 1){
					this.tree.parsingOn						= null;
					pointer.through("item", "open", null, function(jp){
						this.tree.openItem(jp.get("id"));
					}, this);
					if((!this.tree._edsbps)||(!this.tree._edsbpsA.length)){
						var that							= this.tree;
						window.setTimeout(function(){
							that.callEvent("onXLE",[that, parentId]);
						}, 1);
						this.tree.xmlstate					= 0;
					}
					this.tree.skipLock						= false;
				}
				this.tree.parsCount--;
				this.tree._p								= pointer;
				if(typeof(this.config.onLoadData) === "function"){
					this.config.onLoadData.call(this, data);
				}
			}

		},
		_renderNode : function(jp, temp, preNode, befNode){
			var id;
			var nodeJson									= jp.get_all();
			if(typeof(nodeJson.text) === "undefined" || nodeJson.text === null){
				nodeJson.text								= jp.sub("itemtext");
				if(nodeJson.text){
					if(typeof(nodeJson.text.d) !== "undefined"){
						nodeJson.text						= nodeJson.text.content();
					}
				}
			}
			var zST											= [];
			if(nodeJson.select){
				zST.push("SELECT");
			}
			if(nodeJson.top){
				zST.push("TOP");
			}
			if(nodeJson.call){
				this.tree.nodeAskingCall					= nodeJson.id;
			}
			if(nodeJson.checked == -1){
				zST.push("HCHECKED");
			}else if(nodeJson.checked){
				zST.push("CHECKED");
			}
			if(nodeJson.open){
				zST.push("OPEN");
			}

			var newNode										= this._attachChild(temp, nodeJson.id, nodeJson.text, 0, nodeJson.data.leafNodeIcon, nodeJson.data.openNodeIcon, nodeJson.data.closeNodeIcon, zST.join(","), nodeJson.child, (befNode || 0), preNode);
			if(nodeJson.style){
				if (newNode.span.style.cssText){
					newNode.span.style.cssText += (";" + nodeJson.style);
				}else{
					newNode.span.setAttribute("style", newNode.span.getAttribute("style") + "; " + nodeJson.style);
				}
			}
			if(nodeJson.nocheckbox){
				var check_node								= newNode.span.parentNode.previousSibling.previousSibling;
				check_node.style.display					= "none";
				newNode.nocheckbox							= true;
			}
			if(nodeJson.disabled){
				if(nodeJson.checked != null){
					this.tree._setCheck(newNode, nodeJson.checked);
				}
				this.tree.disableCheckbox(newNode, 1);
			}
			newNode._acc									= nodeJson.child || 0;
			if(this.tree.parserExtension){
				this.tree.parserExtension._parseExtension.call(this.tree, jp, nodeJson, (temp ? temp.id : 0));
			}
			this.tree.setItemColor(newNode, nodeJson.aCol, nodeJson.sCol);
			if(nodeJson.locked == "1"){
				this.tree.lockItem(newNode.id, true, true);
			}
			if((nodeJson.imwidth) || (nodeJson.imheight)){
				this.tree.setIconSize(nodeJson.imwidth, nodeJson.imheight, newNode);
			}
			if((nodeJson.closeable == "0") || (nodeJson.closeable == "1")){
				this.tree.setItemCloseable(newNode, nodeJson.closeable);
			}
			var zcall										= "";
			if(nodeJson.topoffset){
				this.tree.setItemTopOffset(newNode, nodeJson.topoffset);
			}
			if((!this.tree.slowParse) || (typeof(this.tree.waitUpdateXML) == "object")){
				if(jp.sub_exists("item")){
					zcall									= this.tree._parse(jp, nodeJson.id, 1);
				}
			}else{
				if((!newNode.childsCount) && jp.sub_exists("item")){
					newNode.unParsed						= jp.clone();
				}
				jp.each("userdata", function(_jp){
					this.tree.setUserData(nodeJson.id, _jp.get("name"), _jp.content());
				}, this);
			}
			if(zcall != ""){
				this.tree.nodeAskingCall					= zcall;
			}
			jp.each("userdata", function(_jp){
				this.tree.setUserData(jp.get("id"), _jp.get("name"), _jp.content());
			}, this);
		},
		_attachChild : function(parentObject, itemId, itemText, itemActionHandler, image1, image2, image3, optionStr, childs, beforeNode, afterNode){
			if(beforeNode && beforeNode.parentObject){
				parentObject = beforeNode.parentObject;
			}
			var Count										= parentObject.childsCount;
			var Nodes										= parentObject.childNodes;
			if(afterNode && afterNode.tr.previousSibling){
				if(afterNode.tr.previousSibling.previousSibling){
					beforeNode								= afterNode.tr.previousSibling.nodem;
				}else{
					optionStr								= optionStr.replace("TOP", "") + ",TOP";
				}
			}
			if(beforeNode){
				var ik, jk;
				for(ik = 0; ik < Count; ik++){
					if(Nodes[ik] == beforeNode){
						for(jk = Count; jk != ik; jk--){
							Nodes[1 + jk]					= Nodes[jk];
						}
						break;
					}
				}
				ik++;
				Count										= ik;
			}
			if(optionStr){
				var tempStr									= optionStr.split(",");
				for(var i = 0; i < tempStr.length; i++){
					switch(tempStr[i]){
						case "TOP":
							if(parentObject.childsCount > 0){
								beforeNode					= new Object;
								beforeNode.tr				= parentObject.childNodes[0].tr.previousSibling;
							}
							parentObject._has_top			= true;
							for(ik = Count; ik > 0; ik--){
								Nodes[ik]					= Nodes[ik - 1];
							}
							Count							= 0;
							break;
					}
				};
			};
			var node;
			if(!(node = this.tree._idpull[itemId]) || node.span != -1) {
				node										= Nodes[Count] = new dhtmlXTreeItemObject(itemId, itemText, parentObject, this.tree, itemActionHandler, 1);
				itemId										= Nodes[Count].id;
				parentObject.childsCount++;
			}
			if(image1){
				node.images[0]								= image1;
			}
			if(image2){
				node.images[1]								= image2;
			}
			if(image3){
				node.images[2]								= image3;
			}

			if(!node.htmlNode){
				node.label									= itemText;
				node.htmlNode								= this._createNode((this.tree.checkBoxOff ? 1 : 0), node);
				node.htmlNode.objBelong						= node;
			}
			var tr											= this.tree._drawNewTr(node.htmlNode);
			if((this.tree.XMLloadingWarning) || (this.tree._hAdI)){
				node.htmlNode.parentNode.parentNode.style.display = "none";
			}
			if((beforeNode) && beforeNode.tr && (beforeNode.tr.nextSibling)){
				parentObject.htmlNode.childNodes[0].insertBefore(tr, beforeNode.tr.nextSibling);
			}else if(this.tree.parsingOn == parentObject.id){
				this.tree.parsedArray[this.tree.parsedArray.length]	= tr;
			}else{
				parentObject.htmlNode.childNodes[0].appendChild(tr);
			}
			if((beforeNode) && (!beforeNode.span)){
				beforeNode									= null;
			}
			if(this.tree.XMLsource){
				if((childs) && (childs != 0)){
					node.XMLload							= 0;
				}else{
					node.XMLload							= 1;
				}
			}
			node.tr											= tr;
			tr.nodem										= node;
			if(parentObject.itemId == 0){
				tr.childNodes[0].className					= "hiddenRow";
			}
			if(optionStr){
				var tempStr									= optionStr.split(",");
				for(var i = 0; i < tempStr.length; i++){
					switch(tempStr[i]){
						case "SELECT":
							this.tree.selectItem(itemId, false);
							break;
						case "CALL":
							this.tree.selectItem(itemId, true);
							break;
						case "CHILD":
							node.XMLload					= 0;
							break;
						case "CHECKED":
							if (this.tree.XMLloadingWarning)
								this.tree.setCheckList		+= this.tree.dlmtr + itemId;
							else
								this.tree.setCheck(itemId, 1);
							break;
						case "HCHECKED":
							this.tree._setCheck(node, "unsure");
							break;
						case "OPEN":
							node.openMe						= 1;
							break;
					}
				};
			};
			if(!this.tree.XMLloadingWarning){
				if((this.tree._getOpenState(parentObject) < 0) && (!this.tree._hAdI)){
					this.tree.openItem(parentObject.id);
				}
				if(beforeNode){
					this.tree._correctPlus(beforeNode);
					this.tree._correctLine(beforeNode);
				}
				this.tree._correctPlus(parentObject);
				this.tree._correctLine(parentObject);
				this.tree._correctPlus(node);
				if(parentObject.childsCount >= 2){
					this.tree._correctPlus(Nodes[parentObject.childsCount - 2]);
					this.tree._correctLine(Nodes[parentObject.childsCount - 2]);
				}
				if(parentObject.childsCount != 2){
					this.tree._correctPlus(Nodes[0]);
				}
				if(this.tree.tscheck){
					this.tree._correctCheckStates(parentObject);
				}
				if(this.tree._onradh){
					if(this.tree.xmlstate == 1){
						var old								= this.tree.onXLE;
						this.tree.onXLE						= function(id){
							this.tree._onradh(itemId);
							if(old){
								old(id);
							}
						}
					}else{
						this.tree._onradh(itemId);
					}
				}

			}
			return node;
		},
		_createNode : function(acheck, itemObject, mode){
			var treeController								= itemObject.treeNod.element.treeController;
			var treeConfig									= treeController.config;
			var table										= document.createElement("div");
			table.cellSpacing								= 0;
			table.cellPadding								= 0;
			table.border									= 0;
			if(this.tree.hfMode){
				table.style.tableLayout						= "fixed";
			}
			table.style.margin								= 0;
			table.style.padding								= 0;
			var tbody										= document.createElement("div");
			var tr											= document.createElement("div");
			var td1											= document.createElement("div");
			td1.className									= "standartTreeImage";
			if(this.tree._txtimg){
				var img0									= document.createElement("div");
				img0.className								= "dhx_tree_textSign";
				td1.appendChild(img0);
			}else{
				var img0									= this.tree._getImg(itemObject.id);
				img0.border									= "0";
				if(img0.tagName == "IMG"){
					img0.align								= "absmiddle";
				}
				img0.style.padding							= 0;
				img0.style.margin							= 0;
				img0.style.width							= this.tree.def_line_img_x;
				td1.appendChild(img0);
			}
			var td11										= document.createElement("div");
			var inp											= document.createElement("label");
			inp.className									= "xui-checkbox-label";
			inp.onclick										= function(e){
				e.cancelBubble								= true;
			}
			inp.appendChild(document.createElement("input"));
			inp.firstChild.type								= "checkbox";
			inp.firstChild.onclick							= function(e){
				e.cancelBubble								= true;
				if(!this.treeNod.callEvent("onBeforeCheck",[this.parentObject.id, this.parentObject.checkstate])){
					return;
				}
				if(this.parentObject.dscheck){
					return true;
				}
				if(this.treeNod.tscheck){
					if(this.parentObject.checkstate == 1){
						this.treeNod._setSubChecked(false, this.parentObject);
					}else{
						this.treeNod._setSubChecked(true, this.parentObject);
					}
				}else{
					if(this.parentObject.checkstate == 1){
						this.treeNod._setCheck(this.parentObject, false);
					}else{
						this.treeNod._setCheck(this.parentObject, true);
					}
				}
				this.treeNod._correctCheckStates(this.parentObject.parentObject);
				return this.treeNod.callEvent("onCheck",[this.parentObject.id, this.parentObject.checkstate]);
			};
			inp.appendChild(document.createElement("span"));
			if(!acheck){
				td11.style.display							= "none";
			}else{
				td11.style.width							= "32px";
			}
			td11.appendChild(inp);
			if((!this.tree.cBROf) && (inp.tagName == "IMG")){
				inp.align									= "absmiddle";
			}
			inp.firstChild.treeNod							= this.tree;
			inp.firstChild.parentObject						= itemObject;
			itemObject.xui_checkbox							= inp.firstChild;

			var td12										= document.createElement("div");
			td12.className									= "standartTreeImage";
			var img											= this.tree._getImg(this.tree.timgen ? itemObject.id : this.tree.rootId);
			img.onmousedown									= this.tree._preventNsDrag;
			img.ondragstart									= this.tree._preventNsDrag;
			img.border										= "0";
			if(this.tree._aimgs){
				img.parentObject							= itemObject;
				if(img.tagName == "IMG"){
					img.align								= "absmiddle";
				}
				img.onclick									= this.tree.onRowSelect;
			}
			if(!mode){
				this.tree._setSrc(img, this.tree.iconURL + this.tree.imageArray[0]);
			}
			td12.appendChild(img);
			img.style.padding								= 0;
			img.style.margin								= 0;
			if(this.tree.timgen){
				td12.style.width							= img.style.width	= this.tree.def_img_x;
				img.style.height							= this.tree.def_img_y;
			}else{
				img.style.width								= "0px";
				img.style.height							= "0px";
				if(_isOpera || window._KHTMLrv){
					td12.style.display						= "none";
				}
			}
			var td2											= document.createElement("div");
			td2.className									= "dhxTextCell standartTreeRow";
			itemObject.span									= document.createElement("div");
			itemObject.span.className = "standartTreeRow";
			if(this.tree.mlitems){
				itemObject.span.style.width					= this.tree.mlitems;
				itemObject.span.style.display				= "block";
			}else{
				td2.noWrap									= true;
			}
			if(dhx4.isIE8){
				td2.style.width								= "99999px";
			}else if(!window._KHTMLrv){
				td2.style.width								= "100%";
			}
			itemObject.span.innerHTML						= itemObject.label;
			td2.appendChild(itemObject.span);
			td2.parentObject								= itemObject;
			td1.parentObject								= itemObject;
			td2.onclick										= this.tree.onRowSelect;
			td1.onclick										= this.tree.onRowClick;
			td2.ondblclick									= this.tree.onRowClick2;
			if(this.tree.ettip){
				var spanPos = itemObject.label.indexOf("<span");
				var title = ""
				if(spanPos >= 0){
					title = itemObject.label.substring(0, spanPos-1);
				} else {
					title = itemObject.label;
				}
				tr.setAttribute("xui-tooltip-title", title);
			}
			if(this.tree.dragAndDropOff){
				if(this.tree._aimgs){
					this.tree.dragger.addDraggableItem(td12, this.tree);
					td12.parentObject						= itemObject;
				}
				this.tree.dragger.addDraggableItem(td2, this.tree);
			}
			itemObject.span.style.paddingLeft				= "2px";
			itemObject.span.style.paddingRight				= "2px";
			td2.style.verticalAlign							= "";
			td2.style.fontSize								= "10pt";
			var editDiv										= document.createElement("div");
			var buttons										= document.createElement("div");
			var elements									= document.createElement("div");
			editDiv.className								= "xui-edit-container";
			buttons.className								= "xui-edit-buttons";
			elements.className								= "xui-edit-elements";
			var label										= document.createElement("label");
			label.className									= "xui-input-label";
			var editInput									= document.createElement("input");
			editInput.className								= "xui-tree-edit-element";
			editInput.id									= treeConfig.dataKey.nodeTitle + "_" + itemObject.id;
			editInput.type									= "text";
			editInput.setAttribute("dataKey", treeConfig.dataKey.nodeTitle);
			editInput.setAttribute("placeholder", xui.valid.isEmpty((itemObject.span.textContent).trim()) ? "NEW NAME" : (itemObject.span.textContent).trim());
			label.appendChild(editInput);
			var icon01										= document.createElement("i");
			var icon02										= document.createElement("i");
			var icon03										= document.createElement("i");
			//LYH 20211231 컨텍스트 메뉴에 정의된 아이콘이 명칭이 달라서 보이는 않는 부분 수
			icon01.className								= "xfi xfi-ico_edit";
			icon02.className								= "xfi xfi-ico_confirm";
			icon03.className								= "xfi xfi-ico_close_bold";
			icon01.onclick									= function(e){
				e.cancelBubble								= true;
				var nodeObject								= this.parentNode.parentNode.parentNode.parentObject;
				var treeController							= nodeObject.treeNod.element.treeController;
				treeController._editStart(nodeObject.id);
			}
			icon02.onclick									= function(e){
				e.cancelBubble								= true;
				var nodeObject								= this.parentNode.parentNode.parentNode.parentObject;
				var treeController							= nodeObject.treeNod.element.treeController;
				treeController._editDone(nodeObject.id);
			}
			icon03.onclick									= function(e){
				e.cancelBubble								= true;
				var nodeObject								= this.parentNode.parentNode.parentNode.parentObject;
				var treeController							= nodeObject.treeNod.element.treeController;
				treeController._editCancel(nodeObject.id);
			}
			elements.appendChild(label);
			buttons.appendChild(icon01);
			buttons.appendChild(icon02);
			buttons.appendChild(icon03);
			editDiv.appendChild(elements);
			editDiv.appendChild(buttons);
			var td3											= document.createElement("div");
			td3.className									= "node-info";
			td3.addEventListener("click", function(e){
				this.previousElementSibling.click();
			});
			td3.addEventListener("dblclick", function(e){
				this.previousElementSibling.ondblclick();
			});
			itemObject.xui_edit								= editDiv;
			td2.appendChild(editDiv);
			if(this.tree.ettip){
				var spanPos = itemObject.label.indexOf("<span");
				var title = ""
				if(spanPos >= 0){
					title = itemObject.label.substring(0, spanPos-1);
				} else {
					title = itemObject.label;
				}

				itemObject.span.setAttribute("xui-tooltip-title", title);
				td2.setAttribute("xui-tooltip-title", title);
			}
			tr.appendChild(td1);
			tr.appendChild(td11);
			tr.appendChild(td12);
			tr.appendChild(td2);
			tr.appendChild(td3);
			tbody.appendChild(tr);
			table.appendChild(tbody);

			return table;
		},
		_recursiveDraw : function(itemObject, start, visMode, nodeLevel){
			var _this										= this;
			var tempx										= null;
			if(!itemObject){
				tempx										= this.tree._globalIdStorageFind(this.tree.lastLoadedXMLId);
				this.tree.lastLoadedXMLId					= -1;
				if(!tempx){
					return 0;
				}
			}else{
				tempx										= itemObject;
			}
			if(tempx.id !== this.config.rootNodeId){
				var tr										= tempx.span.parentNode.parentNode;
				tr.classList.add("nodeline");
				tr.classList.add("nodelevel" + nodeLevel);
				if(tempx.childsCount === 0){
					tr.classList.add("leafnode");
				}
				if(!xui.valid.isEmpty(tempx.xui_edit)){
					xui.com.elementScan(tempx.xui_edit);
				}
				if(this.config.hideArrow){
					this.tree._openItem(tempx);
					tempx.closeble							= false;
					tempx.wsign								= true;
				}
				if(tempx._attrs.hasOwnProperty("USE_AT") && tempx._attrs.USE_AT !== "Y"){
					tempx.span.parentNode.classList.add("xui-strike-text");
				}
				if(tempx._attrs.hasOwnProperty("classes")){
					for(var i = 0; i < tempx._attrs.classes.length; i++){
						if(!xui.valid.isEmpty(tempx._attrs.classes[i])){
							tempx.span.parentNode.classList.add(tempx._attrs.classes[i]);
						}
					}
				}
				if(tempx._attrs.hasOwnProperty("nodeInfo") && !xui.valid.isEmpty(tempx._attrs.nodeInfo)){
					tempx.span.parentNode.nextElementSibling.innerHTML	= tempx._attrs.nodeInfo;
					if(typeof(this.config.onClickNodeInfo) === "function"){
						tempx.span.parentNode.nextElementSibling.classList.add("clickable");
						tempx.span.parentNode.nextElementSibling.addEventListener("click", function(e){
							_this.config.onClickNodeInfo.call(_this, tempx.id, tempx.parentObject.id, _this.getData(tempx.id));
						});
					}
				}
			}
			var acc											= 0;
			for(var i = (start ? start - 1 : 0); i < tempx.childsCount; i++){
				if((!this.tree._branchUpdate) || (this.tree._getOpenState(tempx) == 1)){
					if((!itemObject) || (visMode == 1)){
						tempx.childNodes[i].htmlNode.parentNode.parentNode.style.display	= "";
					}
				}
				if(tempx.childNodes[i].openMe == 1){
					this.tree._openItem(tempx.childNodes[i]);
					tempx.childNodes[i].openMe						= 0;
				}
				this._recursiveDraw(tempx.childNodes[i], null, null, nodeLevel + 1);
				if(this.tree.childCalc != null){
					if ((tempx.childNodes[i].unParsed) || ((!tempx.childNodes[i].XMLload) && (this.tree.XMLsource))){
						if(tempx.childNodes[i]._acc){
							tempx.childNodes[i].span.innerHTML		= tempx.childNodes[i].label + this.tree.htmlcA + tempx.childNodes[i]._acc + this.tree.htmlcB;
						}else{
							tempx.childNodes[i].span.innerHTML		= tempx.childNodes[i].label;
						}
					}
					if((tempx.childNodes[i].childNodes.length) && (this.tree.childCalc)){
						if(this.tree.childCalc == 1){
							tempx.childNodes[i].span.innerHTML		= tempx.childNodes[i].label + this.tree.htmlcA + tempx.childNodes[i].childsCount + this.tree.htmlcB;
						}
						if(this.tree.childCalc == 2){
							var zCount								= tempx.childNodes[i].childsCount - (tempx.childNodes[i].pureChilds || 0);
							if(zCount){
								tempx.childNodes[i].span.innerHTML	= tempx.childNodes[i].label + this.tree.htmlcA + zCount + this.tree.htmlcB;
							}
							if(tempx.pureChilds){
								tempx.pureChilds++;
							}else{
								tempx.pureChilds					= 1;
							}
						}
						if(this.tree.childCalc == 3){
							tempx.childNodes[i].span.innerHTML		= tempx.childNodes[i].label + this.tree.htmlcA + tempx.childNodes[i]._acc + this.tree.htmlcB;
						}
						if(this.tree.childCalc == 4){
							var zCount								= tempx.childNodes[i]._acc;
							if(zCount){
								tempx.childNodes[i].span.innerHTML	= tempx.childNodes[i].label + this.tree.htmlcA + zCount + this.tree.htmlcB;
							}
						}
					}else if(this.tree.childCalc == 4){
						acc++;
					}
					acc += tempx.childNodes[i]._acc;
					if(this.tree.childCalc == 3){
						acc++;
					}
				}
			};
			if((!tempx.unParsed) && ((tempx.XMLload) || (!this.tree.XMLsource))){
				tempx._acc									= acc;
			}
			this.tree._correctLine(tempx);
			this.tree._correctPlus(tempx);
			if((this.tree.childCalc) && (!itemObject)){
				this.tree._fixChildCountLabel(tempx);
			}
		},
		_setChecked : function(sNode, state){
			if(!sNode){
				return;
			}
			if(state == "unsure"){
				sNode.checkstate							= 2;
				sNode.xui_checkbox.checked					= false;
				sNode.xui_checkbox.indeterminate			= true;
			}else if(state){
				sNode.checkstate							= 1;
				sNode.xui_checkbox.indeterminate			= false;
				sNode.xui_checkbox.checked					= true;
			}else{
				sNode.checkstate							= 0;
				sNode.xui_checkbox.indeterminate			= false;
				sNode.xui_checkbox.checked					= false;
			}
			if (sNode.dscheck) sNode.checkstate = sNode.dscheck;
		},
		_setSubChecked : function(state, sNode){
			state											= dhx4.s2b(state);
			if(!sNode){
				return;
			}
			for(var i = 0; i < sNode.childsCount; i++){
				this._setSubChecked(state, sNode.childNodes[i]);
			};
			if(state){
				sNode.checkstate							= 1;
				sNode.xui_checkbox.indeterminate			= false;
				sNode.xui_checkbox.checked					= true;
			}else{
				sNode.checkstate							= 0;
				sNode.xui_checkbox.indeterminate			= false;
				sNode.xui_checkbox.checked					= false;
			}
			if(sNode.dscheck){
				sNode.checkstate							= sNode.dscheck;
			}
		},
		_setRequest : function(request){
			this.status.request								= request;
		},
		_getRequest : function(){
			return this.status.request;
		},
		_getNodeFull : function(id){
			var returnValue									= null;
			if(!xui.valid.isEmpty(id) && this.tree._idpull.hasOwnProperty(id)){
				returnValue									= this.tree._idpull[id];
			}
			return returnValue;
		},
		_validTree : function(config){
			var valid										= true;
			var validList									= [];
			validList.push({valid:!(xui.valid.isEmpty(config.rootNodeId))														,message:xui.enum.TREE_LOAD_ERROR01.getName()});
			validList.push({valid:!(xui.valid.isEmpty(config.dataKey) || !xui.valid.isJson(config.dataKey) || !config.dataKey.hasOwnProperty("nodeId") || !config.dataKey.hasOwnProperty("parentNodeId") || !config.dataKey.hasOwnProperty("nodeTitle"))	,message:xui.enum.TREE_LOAD_ERROR02.getName()});
			validList.push({valid:!(config.multiNodeSelect && config.edit)														,message:xui.enum.TREE_LOAD_ERROR03.getName()});
			for(var i in validList){
				valid										= validList[i].valid;
				if(!valid){
					xui.dialog.error(validList[i].message, xui.enum.TREE_ERROR.getName());
					break;
				}
			}
			return valid;
		}
	};

	xui.module.grid	= function(config, element){
		if(xui.valid.isEmpty(element)){return;}
		config.headerLineSize								= 1;
		if(xui.valid.isArray(config.colNames[0])){
			config.headerLineSize							= config.colNames.length;
		}else{
			config.colNames									= [config.colNames];
		}
		if(!xui.valid.isEmpty(element.gridController)){
			element.gridController.destroy();
		}
		if(this._validGrid(config)){
			/* Wrapping grid container element */
			element.innerHTML								= "";
			var container									= document.createElement("div"), title = element.getAttribute("xui-tooltip-title");
			container.className								= "xui-grid-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);
			if(xui.valid.isEmpty(title)){
				title										= element.id + "GRID";
				element.setAttribute("xui-tooltip-title", title);
			}
			element.classList.add("xui-grid");

			element.gridController							= this;
			this.element									= element;

			/* Define grid configuration */
			this.grid										= new dhtmlXGridObject(element);
			this.grid.element								= element;

			config.baseId									= this.element.id;
			config.title									= title;
			config.type										= "GRID";
			config.headerHeight								= xui.valid.isEmpty(config.headerHeight)		?	32										:	config.headerHeight;
			config.header									= xui.valid.isEmpty(config.header)				?	true									:	config.header;
			config.headerAlign								= xui.valid.isEmpty(config.headerAlign)			?	""										:	config.headerAlign;
			config.rowHeight								= xui.valid.isEmpty(config.rowHeight)			?	32										:	config.rowHeight;
			config.footerHeight								= xui.valid.isEmpty(config.footerHeight)		?	32										:	config.footerHeight;

			var defaultHeaderCss							= "text-align:" + config.headerAlign.toLowerCase() + ";height:" + config.headerHeight + "px;";
			var defaultActiveRowCss							= "";

			config.headerCss								= xui.valid.isEmpty(config.headerCss)			?	defaultHeaderCss						:	defaultHeaderCss + config.headerCss;
			config.oddRowClass								= xui.valid.isEmpty(config.oddRowClass)			?	"odd_row"								:	config.oddRowClass;
			config.evenRowClass								= xui.valid.isEmpty(config.evenRowClass)		?	"ev_row"								:	config.evenRowClass;
			config.activeRowCss								= xui.valid.isEmpty(config.activeRowCss)		?	defaultActiveRowCss						:	defaultActiveRowCss + config.activeRowCss;
			config.activeCellCss							= xui.valid.isEmpty(config.activeCellCss)		?	""										:	config.activeCellCss;
			config.freezeColumn								= xui.valid.isEmpty(config.freezeColumn)		?	""										:	config.freezeColumn;
			config.hover									= xui.valid.isEmpty(config.hover)				?	false									:	config.hover;
			config.hoverClass								= xui.valid.isEmpty(config.hoverClass)			?	"xuigrid-row-hover"						:	config.hoverClass;
			config.colNames									= xui.valid.isEmpty(config.colNames)			?	[]										:	config.colNames;
			config.colModel									= xui.valid.isEmpty(config.colModel)			?	[]										:	config.colModel;
			config.paging									= xui.valid.isEmpty(config.paging)				?	false									:	config.paging;
			config.pageViewSize								= xui.valid.isEmpty(config.pageViewSize)		?	5										:	config.pageViewSize;
			config.pagebarAlign								= xui.valid.isEmpty(config.pagebarAlign)		?	"left"									:	config.pagebarAlign;
			config.pageMoveLast								= xui.valid.isEmpty(config.pageMoveLast)		?	true									:	config.pageMoveLast;
			config.pageCustomMove							= xui.valid.isEmpty(config.pageCustomMove)		?	true									:	config.pageCustomMove;
			config.pageChangeCount							= xui.valid.isEmpty(config.pageChangeCount)		?	true									:	config.pageChangeCount;
			config.pageHideMore								= xui.valid.isEmpty(config.pageHideMore)		?	false									:	config.pageHideMore;
			config.smartRender								= xui.valid.isEmpty(config.smartRender)			?	true									:	config.smartRender;
			config.ratio									= xui.valid.isEmpty(config.ratio)				?	false									:	config.ratio;
			config.rowList									= xui.valid.isEmpty(config.rowList)				?	[50,100,150,200,250,300]				:	config.rowList;
			config.multiselect								= xui.valid.isEmpty(config.multiselect)			?	false									:	config.multiselect;
			config.multiRowSelect							= xui.valid.isEmpty(config.multiRowSelect)		?	false									:	config.multiRowSelect;
			config.rownumbers								= xui.valid.isEmpty(config.rownumbers)			?	false									:	config.rownumbers;
			config.colMove									= xui.valid.isEmpty(config.colMove)				?	false									:	config.colMove;
			config.dragBlock								= xui.valid.isEmpty(config.dragBlock)			?	false									:	config.dragBlock;
			config.scrollAppend								= xui.valid.isEmpty(config.scrollAppend)		?	false									:	config.scrollAppend;
			config.cellClick								= xui.valid.isEmpty(config.cellClick)			?	false									:	config.cellClick;
			config.alwaysCallClick							= xui.valid.isEmpty(config.alwaysCallClick)		?	false									:	config.alwaysCallClick;
			config.emptyrecords								= xui.valid.isEmpty(config.emptyrecords)		?	xui.enum.NO_DATA.getName()				:	config.emptyrecords;
			config.statusMsg								= xui.valid.isEmpty(config.statusMsg)			?	xui.enum.COUNT_DATA_SEARHED.getName()	:	config.statusMsg;
			config.statusBar								= xui.valid.isEmpty(config.statusBar)			?	false									:	config.statusBar;
			config.rowDragMove								= xui.valid.isEmpty(config.rowDragMove)			?	false									:	config.rowDragMove;
			config.removeAfterDrag							= xui.valid.isEmpty(config.removeAfterDrag)		?	true									:	config.removeAfterDrag;
			config.editDiv									= xui.valid.isEmpty(config.editDiv)				?	""										:	config.editDiv;
			config.context									= xui.valid.isEmpty(config.context)				?	[]										:	config.context;
			config.enableAddRow								= xui.valid.isEmpty(config.enableAddRow)		?	false									:	config.enableAddRow;
			config.enableRemoveRow							= xui.valid.isEmpty(config.enableRemoveRow)		?	false									:	config.enableRemoveRow;
			config.enableExportExcl							= xui.valid.isEmpty(config.enableExportExcl)	?	false									:	config.enableExportExcl;
			config.enableClipboard							= xui.valid.isEmpty(config.enableClipboard)		?	false									:	config.enableClipboard;
			config.enablePreview							= xui.valid.isEmpty(config.enablePreview)		?	false									:	config.enablePreview;
			config.enableRefresh							= xui.valid.isEmpty(config.enableRefresh)		?	false									:	config.enableRefresh;
			config.multiAllDisabled							= xui.valid.isEmpty(config.multiAllDisabled)	?	false									:	config.multiAllDisabled;
			config.multiselectColSize						= xui.valid.isEmpty(config.multiselectColSize)	?	40										:	config.multiselectColSize;
			config.excelTitle								= xui.valid.isEmpty(config.excelTitle)			?	""										:	config.excelTitle;
			config.excelSubTitle							= xui.valid.isEmpty(config.excelSubTitle)		?	""										:	config.excelSubTitle;
			config.excelStartRowIdx							= xui.valid.isEmpty(config.excelStartRowIdx)	?	1										:	config.excelStartRowIdx;
			config.excelStartCellIdx						= xui.valid.isEmpty(config.excelStartCellIdx)	?	1										:	config.excelStartCellIdx;
			config.exportFromClient							= xui.valid.isEmpty(config.exportFromClient)	?	false									:	config.exportFromClient;
			config.excelVisibleKey						  = xui.valid.isEmpty(config.excelVisibleKey)		?	true									:	config.excelVisibleKey;
			config.statistics								= xui.valid.isEmpty(config.statistics)			?	{}										:	config.statistics;
			config.enableStatistics							= false;
			//AutoHeight 속성 추가 LYH 20220712
			config.enableAutoHeight						 = xui.valid.isEmpty(config.enableAutoHeight)	?	false									:	config.enableAutoHeight;


			/* Statistics feature activate */
			if(!xui.valid.isEmpty(config.statistics.target) && xui.valid.isArray(config.statistics.target) && config.statistics.target.length > 0){
				if(!xui.valid.isArray(config.statistics.group)){
					config.statistics.group					= [];
				}
				if(!xui.valid.isArray(config.statistics.footer)){
					config.statistics.footer				= [];
				}
				config.enableStatistics						= true;
				/* other relative features all disable */
				config.paging								= false;
				config.multiRowSelect						= false;
				config.colMove								= false;
				config.dragBlock							= false;
				config.scrollAppend							= false;
				config.statusBar							= false;
				config.rowDragMove							= false;
				config.editDiv								= "";
				config.enableAddRow							= false;
				config.enableRemoveRow						= false;
				config.exportFromClient						= true;
				var index									= 0;
				var hasFooter								= false;
				for(var i = 0; i < config.colModel.length; i++){
					config.colModel[i].sort					= false;
					delete config.colModel[i].filter;
					delete config.colModel[i].edit;
					hasFooter								= false;
					for(var j = 0; j < config.statistics.group.length; j++){
						if(config.statistics.group[j].name === config.colModel[i].name){
							config.statistics.group[j].index		= i;
							break;
						}
					}
					for(var j = 0; j < config.statistics.target.length; j++){
						if(xui.valid.isEmpty(config.statistics.target[j].type)){
							config.statistics.target[j].type		= "SUM";
						}
						if(xui.valid.isEmpty(config.statistics.target[j].prefix)){
							config.statistics.target[j].prefix		= "";
						}
						if(xui.valid.isEmpty(config.statistics.target[j].suffix)){
							config.statistics.target[j].suffix		= "";
						}
						if(config.statistics.target[j].name === config.colModel[i].name){
							config.statistics.target[j].index		= i;
							config.colModel[i].statisticsType		= config.statistics.target[j].type;
						}
					}
					for(var j = 0; j < config.statistics.footer.length; j++){
						if(config.statistics.footer[j].name === config.colModel[i].name){
							if(xui.valid.isEmpty(config.statistics.footer[j].label)){
								config.statistics.footer[j].label	= "";
							}
							if(!xui.valid.isJson(config.statistics.footer[j].style)){
								config.statistics.footer[j].style	= {};
							}
							if(xui.valid.isEmpty(config.statistics.footer[j].colspan)){
								config.statistics.footer[j].colspan	= 1;
							}
							if(xui.valid.isEmpty(config.statistics.footer[j].format)){
								config.statistics.footer[j].format	= (!xui.valid.isEmpty(config.colModel[i].format) ? config.colModel[i].format : "");
							}
							if(xui.valid.isEmpty(config.statistics.footer[j].prefix)){
								config.statistics.footer[j].prefix	= "";
							}
							if(xui.valid.isEmpty(config.statistics.footer[j].suffix)){
								config.statistics.footer[j].suffix	= "";
							}
							config.statistics.footer[j].index		= i;
							hasFooter								= true;
							break;
						}
					}
					if(!hasFooter){
						config.statistics.footer.push({name:config.colModel[i].name,html:"",style:{},colspan:1,index:i});
					}
				}
				config.statistics.group						= xuic.__UTIL.quickSort(config.statistics.group, "index");
				config.statistics.target					= xuic.__UTIL.quickSort(config.statistics.target, "index");
				config.statistics.footer					= xuic.__UTIL.quickSort(config.statistics.footer, "index");
			}else{
				config.footerHeight							= 0;
			}

			config.originColNames							= xui.util.copyObject([], config.colNames, true);
			config.plusIdx									= 0;
			config.enableFilter								= false;
			config.removeHeaderList							= [];
			config.freezeColumnIdx							= -1;

			this.config										= config;

			/* Status variable */
			this.status										= {};
			this.status.prevRowId							= null;
			this.status.checkedCount						= 0;
			this.status.ctxRowIdx							= null;
			this.status.ctxCellIdx							= null;
			this.status.columnCheckboxStatus				= {};
			this.status.scrollTimeout						= null;
			this.status.removeRows							= {};
			this.status.virtualActive						= false;
			this.status.filtering							= false;
			this.status.request								= null;
			this.status.pageNumber							= 0;
			this.status.lastPageNumber						= 0;
			this.status.countPerPage						= ((xui.valid.isArray(this.config.rowList) && this.config.rowList.length > 0) ? this.config.rowList[0]	: 0);
			this.status.currentCount						= 0;
			this.status.totalCount							= 0;

			var _this										= this;
			var _colNames									= this.config.colNames;
			var _colModel									= this.config.colModel;

			if(this.config.rownumbers){
				this.config.plusIdx++;
			}
			if(this.config.multiselect){
				this.config.plusIdx++;
			}
			if(!xui.valid.isEmpty(this.config.freezeColumn)){
				for(var i = 0; i < _colModel.length; i++){
					if(_colModel[i].name === this.config.freezeColumn){
						this.config.freezeColumnIdx = (i + this.config.plusIdx);
						break;
					}
				}
			}
			/*기본 skin 설정*/
			this.grid.setSkin("material");
			/*이미지 파일 root 경로 설정*/
			this.grid.setImagesPath(xui.com.getContextPath() + "html/xs/core/xui/img/grid/");
			/*짝수,홀수 행  스타일 클래스 정의(짝수행 클래스명, 홀수행 클래스명)*/
			/*x축 틀고정 그리드일 시에 틀고정시킨 컬럼에 해당 클래스가 적용되지 않는 bug가 존재함으로 메소드 사용안하고 css자체적으로 해결함.*/
			if(this.config.evenRowClass !== "" || this.config.oddRowClass !== ""){
				this.grid.enableAlterCss(this.config.evenRowClass, this.config.oddRowClass);
			}
			/*마우스 hover ROW 스타일 클래스 정의*/
			if(this.config.hoverClass !== ""){
				/*this.grid.enableRowsHover(config.hover, config.hoverClass);*/
			}
			/*colspan 허용*/
			this.grid.enableColSpan(true);

			var alignList									= "";
			var columnNameList								= "";
			var valignList									= ""
			var columnFilterList							= ""
			var tooltipList									= ""
			var dataTypeList								= ""
			var sortList									= ""
			var widthList									= ""
			var visibleList									= ""
			var headerCtxList								= ""
			var resizeList									= ""
			var serializeList								= "";
			for(var i = 0; i < _colModel.length; i++){
				alignList									+= (xui.valid.isEmpty(_colModel[i].align)	? "center,"	: _colModel[i].align	+ ","	);
				columnNameList								+= (xui.valid.isEmpty(_colModel[i].name)	? ","		: _colModel[i].name		+ ","	);
				valignList									+= "middle,";
				if(!xui.valid.isEmpty(_colModel[i].filter)){
					this.config.enableFilter						= true;
					if(!xui.valid.isEmpty(_colModel[i].filter.type)){
						columnFilterList					+= "#xui_" + _colModel[i].filter.type + "_filter,";
					}else{
						columnFilterList					+= "#rspan,";
					}
				}else{
					columnFilterList						+= "#rspan,";
				}
				if(!xui.valid.isEmpty(_colModel[i].edit) && !xui.valid.isEmpty(_colModel[i].edit.type)){
					/*support type : text,combo,checkbox,radio,toggle,textarea,button,iconbutton*/
					tooltipList								+= "false,";
					_colModel[i].dtype						= "xuieditcell_" + _colModel[i].edit.type;
					dataTypeList							+= "xuieditcell_" + _colModel[i].edit.type + ",";
					if(_colModel[i].sort){
						sortList							+= "_xuigridSort,";
					}else{
						sortList							+= "na,";
					}
				}else if(!xui.valid.isEmpty(_colModel[i].chart) && !xui.valid.isEmpty(_colModel[i].chart.type)){
					/*support type : line,bar,pie*/
					tooltipList								+= "false,";
					_colModel[i].dtype						= "xuicell_chart";
					dataTypeList							+= "xuicell_chart,";
					sortList								+= "na,";
				}else if(!xui.valid.isEmpty(_colModel[i].image) && _colModel[i].image === true){
					/**/
					tooltipList								+= "false,";
					_colModel[i].dtype						= "xuicell_image";
					dataTypeList							+= "xuicell_image,";
					sortList								+= "na,";
				}else if(!xui.valid.isEmpty(_colModel[i].summary) && !xui.valid.isEmpty(_colModel[i].summary.from) && !xui.valid.isEmpty(_colModel[i].summary.to)){
					tooltipList								+= "false,";
					_colModel[i].dtype						= "xuicell_summary";
					dataTypeList							+= "xuicell_summary,";
					if(_colModel[i].sort){
						sortList							+= "_xuigridSort,";
					}else{
						sortList							+= "na,";
					}
				}else{
					tooltipList								+= "false,";
					_colModel[i].dtype						= "xuicell";
					dataTypeList							+= "xuicell,";
					if(_colModel[i].sort){
						sortList							+= "_xuigridSort,";
					}else{
						sortList							+= "na,";
					}
				}
				if(!_colModel[i].hidden){
					widthList								+= (xui.valid.isEmpty(_colModel[i].width)	? "100,"	: _colModel[i].width + ",");
					serializeList							+= (_colModel[i].excel === false			? "false,"	: "true,");
					visibleList								+= "false,";
					headerCtxList							+= "true,";
					if(i + this.config.plusIdx <= this.config.freezeColumnIdx){
						resizeList							+= "false,";
					}else{
						resizeList							+= (_colModel[i].resize === false			? "false,"	: "true,");
					}
				}else{
					widthList								+= "0,";
					serializeList							+= (_colModel[i].excel === true				? "true,"	: "false,");
					tooltipList								+= "false,";
					headerCtxList							+= "false,";
					resizeList								+= "false,";
					if(i + this.config.plusIdx <= this.config.freezeColumnIdx){
						visibleList							+= "false,";
					}else{
						visibleList							+= "true,";
					}
				}
			}
			this.config.colModel							= _colModel;
			if(this.config.enableFilter){
				this.config.headerLineSize++;
			}
			widthList										= (this.config.rownumbers ? (this.config.ratio ? "3," : this.config.multiselectColSize + ",")		: "") + (this.config.multiselect ? (this.config.ratio ? "3," : this.config.multiselectColSize + ",")		: "") + widthList.substr(0, widthList.length-1);
			alignList										= (this.config.rownumbers ? "center,"								: "") + (this.config.multiselect ? "center,"								: "") + alignList.substr(0, alignList.length-1);
			valignList										= (this.config.rownumbers ? "middle,"								: "") + (this.config.multiselect ? "middle,"								: "") + valignList.substr(0, valignList.length-1);
			dataTypeList									= (this.config.rownumbers ? "xuicell_rownum,"						: "") + (this.config.multiselect ? "xuicell_checkbox,"						: "") + dataTypeList.substr(0, dataTypeList.length-1);
			columnNameList									= (this.config.rownumbers ? xui.enum.GRID_ROWNUMBER.getCode() + ","	: "") + (this.config.multiselect ? xui.enum.GRID_CHECKBOX.getCode() + ","	: "") + columnNameList.substr(0, columnNameList.length-1);
			sortList										= (this.config.rownumbers ? "na,"									: "") + (this.config.multiselect ? "na," 									: "") + sortList.substr(0, sortList.length-1);
			visibleList										= (this.config.rownumbers ? "false," 								: "") + (this.config.multiselect ? "false," 								: "") + visibleList.substr(0, visibleList.length-1);
			serializeList									= (this.config.rownumbers ? "true,"									: "") + (this.config.multiselect ? "false," 								: "") + serializeList.substr(0, serializeList.length-1);
			tooltipList										= (this.config.rownumbers ? "false," 								: "") + (this.config.multiselect ? "false," 								: "") + tooltipList.substr(0, tooltipList.length-1);
			headerCtxList									= (this.config.rownumbers ? "false," 								: "") + (this.config.multiselect ? "false," 								: "") + headerCtxList.substr(0, headerCtxList.length-1);
			resizeList										= (this.config.rownumbers ? "false," 								: "") + (this.config.multiselect ? "false," 								: "") + resizeList.substr(0, resizeList.length-1);
			/*컬럼너비 정의. 퍼센트 너비 or px단위 너비 option에 따라 적용.*/
			if(this.config.ratio){
				this.grid.setInitWidthsP(widthList);
			}else{
				this.grid.setInitWidths(widthList);
			}
			var objWidthSplit								= widthList.split(",");
			this.config.totalFreezeWidth					= 0;
			this.config.totalUnfreezeWidth					= 0;
			for(var i = 0; i < objWidthSplit.length; i++){
				if(i <= this.config.freezeColumnIdx){
					this.config.totalFreezeWidth			+= parseInt(objWidthSplit[i]);
				}else{
					break;
				}
			}
			this.config.totalUnfreezeWidth					= 100 - this.config.totalFreezeWidth;
			/*컬럼 hidden 여부 정의*/
			this.grid.setColumnsVisibility(visibleList);
			/*헤더 생성*/
			this._drawHeader(columnFilterList);
			/*footer 생성*/
			this._drawFooter();
			/*데이터부 텍스트 가로정렬 정의*/
			this.grid.setColAlign(alignList);
			/*데이터부 텍스트 세로정렬 정의*/
			this.grid.setColVAlign(valignList);
			/*컬럼 정렬 타입 정의*/
			this.grid.setColSorting(sortList);
			/*컬럼의 데이터 타입 정의*/
			this.grid.setColTypes(dataTypeList);
			/*셀 에디팅 가능여부*/
			this.grid.setEditable(true);
			/*컬럼 ID 정의*/
			this.grid.setColumnIds(columnNameList);
			/**/
			this.grid.setSerializableColumns(serializeList);
			/**/
			this.grid.enableResizing(resizeList);
			/*ToolTip제어*/
			this.grid.enableTooltips(tooltipList);
			/*컬럼의 데이터 길이 판단하여 자동 리사이즈 기능*/
			this.grid.enableColumnAutoSize(true);
			/*drag & drop을 이용하여 컬럼 순서 이동 가능여부 정의*/
			this.grid.enableColumnMove(this.config.colMove);
			/*drag & drop 기능여부*/
			this.grid.enableDragAndDrop(this.config.rowDragMove);
			this.grid.enableMercyDrag(!this.config.removeAfterDrag);
			/*drag & drop을 셀 block 선택 가능여부 정의*/
			this.grid.enableBlockSelection(this.config.dragBlock);
			/*다중 선택 가능여부 정의*/
			this.grid.enableMultiselect(this.config.multiRowSelect);
			/*셀 선택 가능여부 정의*/
			this.grid.enableMarkedCells(this.config.cellClick);
			this.grid.enableCellIds(this.config.cellClick);
			/*행높이 정의*/
			this.grid.setAwaitedRowHeight(this.config.rowHeight);
			/*그리드 기본 스타일 정의  1.헤더 스타일 2.그리드 스타일 3.선택셀스타일 4.선택행스타일*/
			this.grid.setStyle(this.config.headerCss, "", this.config.activeCellCss, this.config.activeRowCss);
			/*스마트 렌더링 적용여부 정의. (대용량 데이터 바인딩 시 해당옵션 반드시 적용.)*/
			this.grid.enableSmartRendering(this.config.smartRender);
			/*헤더 숨김여부*/
			this.grid.setNoHeader(!this.config.header);
			/*AutoHeight 속성 추가 LYH 20220712 높이자동설정*/
			if(this.config.enableAutoHeight){
				this.grid.enableAutoHeight(this.config.enableAutoHeight);
			}
			/*x축 틀고정*/
			if(this.config.freezeColumnIdx >= 0){
				this.grid.splitAt(this.config.freezeColumnIdx + 1);
			}
			/*하단 툴바 생성*/
			if(this.config.paging){
				this.config.onChangePage					= function(pageNumber, countPerPage){
					var gridController						= document.getElementById(this.element.xui_grid).gridController;
					var requestForm							= gridController._getRequest();
					var requestJson							= requestForm.request;
					if(xui.valid.isXuiJson(requestJson)){
						var dataGroup						= gridController.config.dataGroupName;
						var prefix							= (dataGroup === "DATA" ? "" : dataGroup + "_");
						if(requestJson.containsHeaderKey(prefix + "PAGE_NO")){
							requestJson.setHeader(prefix + "PAGE_NO"		,pageNumber);
							requestJson.setHeader(prefix + "ROW_PER_PAGE"	,countPerPage);
							requestForm.request				= requestJson;
							requestForm._sendRequest();
						}
					}
					gridController.status.pageNumber		= pageNumber;
					gridController.status.countPerPage		= countPerPage;
				};
				this._loadPageBar();
			}else if(this.config.scrollAppend){
				this.config.onAppendData					= function(pageNumber){
					var gridController						= document.getElementById(this.element.xui_grid).gridController;
					var requestForm							= gridController._getRequest();
					var requestJson							= requestForm.request;
					if(xui.valid.isXuiJson(requestJson)){
						var dataGroup						= gridController.config.dataGroupName;
						var prefix							= (dataGroup === "DATA" ? "" : dataGroup + "_");
						if(requestJson.containsHeaderKey(prefix + "PAGE_NO")){
							requestJson.setHeader(prefix + "PAGE_NO"		,pageNumber);
							requestForm.request				= requestJson;
							requestForm._sendRequest();
						}
					}
					gridController.status.pageNumber		= pageNumber;
				};
				this._loadAppendBar();
				/*스크롤 이벤트 정의*/
				this.grid.attachEvent("onScroll", function(left, top){
					this.element.gridController._scroll(left, top);
				});
			}else if(this.config.statusBar){
				this._loadStatusBar();
			}
			/*그리드 생성 및 로드*/
			this.grid.init();
			/*통계 그리드일 시 footer coumn name define*/
			if(this.config.enableStatistics){
				var footerArray								= this.config.statistics.footer;
				var footerElement							= [];
				var normalFooter							= null;
				if(this.config.freezeColumnIdx >= 0){
					footerElement							= footerElement.concat(Array.from(this.grid._fake.ftr.querySelectorAll("td")));
					footerElement							= footerElement.concat(Array.from(this.grid.ftr.querySelectorAll("td")).slice(footerElement.length));
				}else{
					footerElement							= footerElement.concat(Array.from(this.grid.ftr.querySelectorAll("td")));
				}
				for(var i = 0; i < footerArray.length; i++){
					footerArray[i].cell						= footerElement[footerArray[i].cellIndex];
				}
			}
			/*틀고정일 시 스타일 bug. 헤더에 제거해야 할 row 제거*/
			if(this.config.removeHeaderList.length > 0){
				var removeTr								= null;
				for(var i = this.config.removeHeaderList.length-1; i >= 0; i--){
					removeTr								= this.grid._fake.hdr.firstChild.childNodes[this.config.removeHeaderList[i]+1];
					removeTr.parentNode.removeChild(removeTr);
				}
			}
			/*키보드 네비게이션 활성화*/
			this.grid.enableExcelKeyMap(true);
			/*컨텍스트 메뉴*/
			this._loadCtx();
			/*정렬 이벤트 정의*/
			this.grid.attachEvent("onBeforeSorting", function(columnIdx, columnType, orderby){
				this.element.gridController._prevSort(columnIdx, columnType, orderby, event);
			});
			/*클릭 이벤트 정의*/
			if(this.config.cellClick){
				this.grid.attachEvent("onCellMarked", function(rowId, cellIdx){
					return this.element.gridController._onCellMark(rowId, cellIdx, event, true, false);
				});
			}else{
				this.grid.attachEvent("onBeforeSelect", function(newRowId, prevRowId, cellIdx){
					return this.element.gridController._prevClick(newRowId, prevRowId, cellIdx);
				});
				this.grid.attachEvent("onRowSelect", function(rowId, cellIdx){
					this.element.gridController._afterClick(rowId, cellIdx, true, false);
				});
			}
			/**/
			if(this.config.multiRowSelect && this.config.editDiv === "R"){
				this.grid.attachEvent("onSelectStateChanged", function(newRowId, prevRowId){
					this.element.gridController._changeSelectState(newRowId, prevRowId, event);
				});
			}
			/*더블클릭 이벤트 정의*/
			if(typeof(this.config.onDblClickData) !== "undefined"){
				this.grid.attachEvent("onRowDblClicked", function(rowId, cellIdx){
					this.element.gridController._dblClick(rowId, cellIdx, event);
				});
			}
			/*체크박스 체크 이벤트 정의*/
			this.grid.attachEvent("onCheck", function(rowId, cellIdx, checked, event){
				this.element.gridController._check(rowId, cellIdx, checked, event);
			});
			/*마우스오버 이벤트 정의*/
			if(typeof(this.config.onMouseOver) === "function"){
				this.grid.attachEvent("onMouseOver", function(rowId, cellIdx, event){
					this.element.gridController._hover(rowId, cellIdx, event);
				});
			}
			/*Drag & Drop 으로 행 순서이동 기능*/
			if(this.config.rowDragMove){
				this.grid.rowToDragElement = function(strRowId){
					return "<i class='xfi xfi-ico_0069_content_copy'></i>";
				}
				this.grid.attachEvent("onBeforeDrag", function(rowId){
//					return this.element.gridController._dragStart(rowId, event);
                    var ctrl = this.element.gridController;
                    ctrl._dragStartRowId   = rowId;
                    ctrl._dragStartIndex   = this.getRowIndex(rowId); // ⭐ 유일하게 신뢰 가능
                    console.log("onBeforeDrag args:", rowId , this.getRowIndex(rowId));
                    return ctrl._dragStart(rowId, event);
				});
				this.grid.attachEvent("onDrag", function(sourceId, targetId, source, target, sourceIdx, targetIdx){
					return this.element.gridController._drag(sourceId, targetId, source, target, sourceIdx, targetIdx);
				});
				this.grid.attachEvent("onBeforeDrop", function(){
                    return false; // 🔥 dhtmlx 기본 이동 완전 차단
                });
				this.grid.attachEvent("onDrop", function(sourceId, targetId, dropId, source, target, sourceIdx, targetIdx){
//					console.log("drop args:", sourceIdx, targetIdx);
//                    console.log("real index:",
//                        this.getRowIndex(sourceId),
//                        this.getRowIndex(targetId)
//                    );
					this.element.gridController._drop(sourceId, targetId, dropId, source, target, sourceIdx, targetIdx);
					return false;
				});
			}
			/*행 삭제 전 이벤트*/
			this.grid.attachEvent("onBeforeRowDeleted", function(rowId){
				this.element.gridController._prevRemove(rowId);
			});
			/*필터 컬럼이 존재할 시 이벤트 정의*/
			if(this.config.enableFilter){
				this.grid.attachEvent("onFilterStart", function(indexes, values){
					this.element.gridController.status.virtualActive	= false;
					return true;
				});
				this.grid.attachEvent("onFilterEnd", function(el){
					this.element.gridController._afterFilter(el);
				});
			}
			/*그리드 데이터 존재하지 않는 빈공간 부분 클릭 이벤트 정의.*/
			this.grid.attachEvent("onEmptyClick", function(e){
				this.element.gridController._outerClick(e);
			});
			/**/
			this.grid.attachEvent("onResizeEnd", function(grid){
				grid.element.gridController._resize();
			});
			/*컬럼 순서 이동 시 이벤트*/
			if(this.config.colMove){
				this.grid.attachEvent("onAfterCMove", function(columnIdx, cellIdx){
					this.element.gridController._afterMoveColumn(columnIdx, cellIdx);
				});
			}
			/*헤더 우클릭 컬럼 숨기기 or 나타내기 체크박스 클릭 이벤트*/
			this.grid.attachEvent("onColumnHidden", function(columnIdx, visible){
				this.element.gridController._visibleColumn(columnIdx, !visible);
			});
			/*drag block 시작 이벤트*/
			if(this.config.dragBlock){
				this.grid.attachEvent("onBeforeBlockSelected", function(rowId, cellIdx){
					return this.element.gridController._prevBlockSelect(rowId, cellIdx);
				});
				/*drag block 완료 이벤트*/
				this.grid.attachEvent("onBlockSelected", function(){
					this.element.gridController._blockSelect(event);
				});
			}
			/*키보드 입력 이벤트*/
			this.grid.attachEvent("onKeyPress", function(keycode, ctrl, shift, ev){
				var returnValue								= true;
				var gridController							= this.element.gridController;
				if(typeof(gridController.config.onKeypress) === "function"){
					var rowId								= gridController.getRowId();
					if(xui.valid.isEmpty(rowId)){
						returnValue							= gridController.config.onKeypress.call(gridController, keycode, ctrl, shift, ev.altKey, null, null, null, null, null, null);
					}else{
						var cellIdx							= gridController.getCellIdx();
						var cellObject						= null;
						if(xui.valid.isEmpty(cellIdx)){
							returnValue						= gridController.config.onKeypress.call(gridController, keycode, ctrl, shift, ev.altKey, gridController.getRowIdx(rowId), rowId, gridController.getRowData(rowId), null, null, null);
						}else{
							cellObject						= this.cells(rowId, cellIdx);
							returnValue						= gridController.config.onKeypress.call(gridController, keycode, ctrl, shift, ev.altKey, gridController.getRowIdx(rowId), rowId, gridController.getRowData(rowId), cellIdx, gridController.getCellId(cellIdx), gridController.getCellData(rowId, cellIdx));
						}
					}
				}
				if(xui.valid.isEmpty(returnValue)){
					returnValue								= true;
				}
				return returnValue;
			});
			/*그리드 사이즈 변경 후 이벤트*/
			this.grid.attachEvent("onSetSizes", function(){
				var gridController							= this.element.gridController;
				var config									= gridController.config;
				var size									= 0;
				if(config.rownumbers){
					var dataCount							= gridController.getCount();
					if(dataCount >= 100000){
						size								= 60;
					}else if(dataCount >= 10000){
						size								= 50;
					}else{
						size								= 40;
					}
					this._setColumnSizeR(0, size);
				}
				if(config.multiselect){
					this._setColumnSizeR(config.plusIdx-1, config.multiselectColSize);
				}
				if(config.smartRender){
					this._update_xtrm_srnd_view();
				}
			});
			this.grid.attachEvent("onAfterSorting", function(column, type, orderby){
				/*20200924 해당기능 임시 disable
				var gridController							= this.element.gridController;
				var rowCount								= gridController.getCount();
				var pageNumber								= gridController.getPage();
				var rowPerPage								= gridController.getCountPerPage();
				var _plus									= (pageNumber - 1) * rowPerPage;
				for(var i = 0; i < rowCount; i++){
					gridController.setCellData(i, "ROWNUM", (i+1+_plus).toString());
				}
				*/
			});
			/*헤더 로우 높이 설정 및 체크박스 이벤트*/
			var headerElement								= this.element.getElementsByClassName("xhdr");
			var cellElement									= null, checkboxList = null, checkbox = null, columnName = null;
			var td											= null, tdIndex = null, tr = null, trIndex = null;
			var controller									= null;
			if(xui.valid.isHTMLCollection(headerElement)){
				for(var i = 0; i < headerElement.length; i++){
					cellElement												= headerElement[i].getElementsByClassName("hdrcell");
					if(xui.valid.isHTMLCollection(cellElement)){
						for(var j = 0; j < cellElement.length; j++){
							if(xui.valid.isElement(cellElement[j])){
								checkboxList								= cellElement[j].getElementsByClassName("xui-checkbox-label");
								if(xui.valid.isHTMLCollection(checkboxList)){
									for(var x = 0; x < checkboxList.length; x++){
										checkboxList[x].parentNode.style.setProperty("height", this.config.headerHeight + "px", "important");
										checkbox							= checkboxList[x].firstElementChild;
										if(!xui.valid.isEmpty(checkbox)){
											if(i === 0){
												controller					= new xuic.__CHECKBOX_CONTROLLER(checkbox);
												checkbox.xui_grid			= element;
												columnName					= xui.util.replace(checkbox.id, this.config.baseId + "_", "");
												this.status.columnCheckboxStatus[columnName].element	= checkbox;
												this.status.columnCheckboxStatus[columnName].controller	= controller;
												checkbox.addEventListener("click", function(e){
													e.cancelBubble			= true;
													var gridController		= this.xui_grid.gridController;
													var grid				= gridController.grid;
													var columnName			= xui.util.replace(this.id, this.xui_grid.id + "_", "");
													var cellIndex			= gridController.getCellIdx(columnName);
													var checked				= this.checked;
													var rowsBuffer			= grid.rowsBuffer;
													var cell				= null;
													var data				= null;
													if(cellIndex >= 0){
														if(typeof(gridController.config.onClickHeaderCheckbox) === "function"){
															gridController.config.onClickHeaderCheckbox.call(gridController, cellIndex, columnName, checked);
														}
														for(var y = 0; y < rowsBuffer.length; y++){
															if(xui.valid.isElement(rowsBuffer[y]) && gridController.getTotalCount() > 0){
																cell		= grid.cells2(y, cellIndex);
																if (cell.isDisabled && cell.isDisabled()) continue; // disable 제외
																cell.setValue((cell.isDisabled() ? "1" : "0") + (checked ? "1" : "0"));
															}else{
																data		= rowsBuffer[y].data[columnName];
																if(xui.valid.isEmpty(data) || data.length === 1){
																	data	= (checked ? "1" : "0");
																}else if(data.length === 2){
																	data	= data.substr(0,1) + (checked ? "1" : "0");
																}
																rowsBuffer[y].data[columnName] = data;
															}
														}
														gridController.status.columnCheckboxStatus[columnName].checkedCount	= (checked ? rowsBuffer.length : 0);
													}
												});
											}
										}
									}
								}
							}
						}
					}
				}
			}
			var headerContainerHeight						= 0;
			if(this.config.header){
				headerContainerHeight						= (this.config.headerLineSize * this.config.headerHeight);
			}
			if(this.config.paging || this.config.scrollAppend || this.config.statusBar){
				this.element.classList.add("bottom-bar");
			}
			/*HEADER, BODY 높이조정*/
			this.grid.objBox.style.setProperty("height", "calc(100% - " + (headerContainerHeight + this.config.footerHeight) + "px)", "important");
			if(this.config.freezeColumnIdx >= 0){
				this.grid._fake.element						= this.element;
				this.grid._fake.objBox.style.setProperty("height", "calc(100% - " + (headerContainerHeight + this.config.footerHeight) + "px)", "important");
			}
			if(this.config.enableStatistics){
				this.element.classList.add("footer");
				this.grid.ftr.parentNode.style.setProperty("height", this.config.footerHeight + "px", "important");
				if(this.config.freezeColumnIdx >= 0){
					this.grid._fake.ftr.parentNode.style.setProperty("height", this.config.footerHeight + "px", "important");
				}
			}
			this.element.setAttribute("data-headerheight", headerContainerHeight);
			this.element.setAttribute("data-rowheight", this.config.rowHeight);
			this.element.setAttribute("data-footerheight", this.config.footerHeight);

			//레이어팝업에서는 그리드를 감싸고 있는 DIV에 높이값을 설정해야 하는데 그럴 경우 상태영역까지 감싸기 때문에 상태영역인 60PX를 제거한 높이를 설정해야 함
			var parentHeight = this.element.parentElement.parentElement.style.height;
			if(!xui.valid.isEmpty(parentHeight)){
				parentHeight = Number(parentHeight.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"),""));
				this.element.style.height = (parentHeight - 60) + "px";
			}



			return this;
		}
	};
	xui.module.grid.prototype	= {
		init : function(completely){
			if(xui.valid.isEmpty(completely)){
				completely									= true;
			}
			var colModel									= this.config.colModel;
			this.grid.objBox.scrollTop						= 0;
			this.grid.objBox.scrollLeft						= 0;
			if(!xui.valid.isEmpty(this.config.freezeColumn)){
				this.grid._fake.objBox.scrollTop			= 0;
			}
			this._setCount(0);
			if(completely){
				this._setTotalCount(0);
				if(this.isExistRow("grid_empty_row")){
					var dataTypeList						= "";
					var dataAlignList						= "";
					for(var i = 0; i < colModel.length; i++){
						dataTypeList						+= (typeof(colModel[i].dtype) !== "undefined" ? colModel[i].dtype + "," : "xuicell,");
						dataAlignList						+= (typeof(colModel[i].align) !== "undefined" ? colModel[i].align + "," : "center,");
					}
					dataTypeList							= (this.config.rownumbers ? "xuicell_rownum," : "") + (this.config.multiselect ? "xuicell_checkbox," : "") + dataTypeList.substr(0, dataTypeList.length-1);
					dataAlignList							= (this.config.rownumbers ? "center," : "") + (this.config.multiselect ? "center," : "") + dataAlignList.substr(0, dataAlignList.length-1);
					this.grid.setColTypes(dataTypeList);
					this.grid.setColAlign(dataAlignList);
				}
				var toolbarController						= null;
				if(this.config.paging){
					toolbarController						= this.config.pageContainer.pageController;
				}else if(this.config.scrollAppend){
					toolbarController						= this.config.appendContainer.appendController;
				}else if(this.config.statusBar){
					toolbarController						= this.config.statusContainer.toolbarController;
					toolbarController.setValue("info", "");
				}
				if(!xui.valid.isEmpty(toolbarController)){
					toolbarController.init();
				}
				this.status.currentCount					= 0;
				this.status.totalCount						= 0;
				this.status.pageNumber						= 1;
				this.status.lastPageNumber					= 1;
				if(!xui.valid.isEmpty(this.status.statisticsData)){
					for(var keyName in this.status.statisticsData){
						this.status.statisticsData[keyName]	= "";
					}
					this.setFooterData(this.status.statisticsData);
				}
			}
			this.status.virtualActive						= false;
			this.status.removeRows							= {};
			this.status.prevRowId							= null;
			for(var key in this.status.columnCheckboxStatus){
				this.status.columnCheckboxStatus[key].checkedCount			= 0;
				if(xui.valid.isElement(this.status.columnCheckboxStatus[key].element)){
					this.status.columnCheckboxStatus[key].element.checked	= false;
					// 20230330, OSH, 페이지 이동시 indeterminate 상태도 해제되도록 변경
					this.status.columnCheckboxStatus[key].element.indeterminate	= false;
					if(key === xui.enum.GRID_CHECKBOX.getCode() && this.config.multiAllDisabled){
						continue;
					}
					this.status.columnCheckboxStatus[key].element.disabled	= false;
					this.status.columnCheckboxStatus[key].element.classList.remove("xui-disabled");
				}
			}
			this.grid.clearAll();
		},
		loadData : function(data, key){
			if(!xui.valid.isEmpty(data)){
				if(xui.valid.isEmpty(key)){
					if(!xui.valid.isEmpty(this.config.dataGroupName)){
						key									= this.config.dataGroupName;
					}else{
						key									= "DATA";
					}
				}
				var loadData								= null;
				if(xui.valid.isXuiJson(data)){
					var dataGroupName						= (!xui.valid.isEmpty(key) && key !== "DATA" ? key : "");
					loadData								= new xui.json();
					loadData.setHeader("COUNT"				,data.getCount(dataGroupName));
					loadData.setHeader("TOT_COUNT"			,data.getTotCount(dataGroupName));
					loadData.setHeader("PAGE_NO"			,data.getPageNo(dataGroupName));
					loadData.setDataJsonArray(data.getDataJsonArray(dataGroupName));
				}else if(xui.valid.isArray(data)){
					var size								= data.length;
					if(size > 0){
						if(Object.keys(data[0]).length === 0){
							size							= 0;
						}
					}
					loadData								= new xui.json();
					loadData.setDataJsonArray(data);
					loadData.setHeader("COUNT"				,size);
					loadData.setHeader("TOT_COUNT"			,size);
					loadData.setHeader("PAGE_NO"			,1);
				}else if(xui.valid.isJson(data) && Object.keys(data).length > 0){
					loadData								= new xui.json();
					loadData.setDataJsonObject(data);
					loadData.setHeader("COUNT"				,1);
					loadData.setHeader("TOT_COUNT"			,1);
					loadData.setHeader("PAGE_NO"			,1);
				}
				if(xui.valid.isXuiJson(loadData)){
					this.status.statisticsData				= {};
					if(this.config.enableStatistics){
						this.status.statisticsData			= {};
						if(loadData.getCount() > 0){
							var statisticsData				= this._getStatisticsData(loadData.getDataJsonArray());
							if(statisticsData.length > 0){
								this.status.statisticsData	= statisticsData.pop();
							}
							loadData.setDataJsonArray(statisticsData);
							loadData.setHeader("COUNT"		,statisticsData.length);
							loadData.setHeader("TOT_COUNT"	,statisticsData.length);
							loadData.setHeader("PAGE_NO"	,1);
						}
					}
					if(this.config.scrollAppend){
						this._parseDataAppend(loadData.getJson());
					}else{
						this._parseData(loadData.getJson());
					}
					this.config.dataGroupName				= key;
					this.setFooterData(this.status.statisticsData);

				}
				this._resize();
			}
		},
		destroy : function(){
			var parent										= this.element.parentNode.parentNode;
			var originElement								= document.createElement("div");
			originElement.id								= this.element.id;
			originElement.setAttribute("xui-tooltip-title", this.element.getAttribute("xui-tooltip-title"));
			this.grid.destructor();
			parent.innerHTML								= "";
			parent.appendChild(originElement);
			delete this.status;
			delete this.config;
			delete this.element;
			delete this.grid;
		},
		select : function(row, doCallFn, prevAllowed){
			if(!xui.valid.isEmpty(row)){
				var rowIds									= row;
				var prevRowId								= this.getRowId();
				if(xui.valid.isNumber(row)){
					rowIds									= this.getRowId(parseInt(row));
				}
				if(!xui.valid.isEmpty(rowIds)){
					rowIds									= rowIds.split(",");
					if(xui.valid.isEmpty(doCallFn)){
						doCallFn							= true;
					}
					if(xui.valid.isEmpty(prevAllowed)){
						prevAllowed							= false;
					}
					if(this.config.multiRowSelect){
						for(var i in rowIds){
							this.grid.selectRowById(rowIds[i], prevAllowed, false, doCallFn);
						}
					}else{
						if(!xui.valid.isEmpty(prevRowId) && prevRowId !== rowIds[0]){
							this.unselect();
						}
						this.grid.selectRowById(rowIds[0], false, true, doCallFn);
					}
				}
			}
		},
		reselect : function(){
			var rowId										= this.getRowId();
			var cellIdx										= this.getCellIdx();
			if(this.config.cellClick){
				if(!xui.valid.isEmpty(cellIdx)){
					if(typeof(this.config.onClickData) !== "undefined"){
						this.config.onClickData.call(this, this.getRowIdx(rowId), rowId, this.getRowData(rowId), cellIdx, this.getCellId(cellIdx), this.getCellData(rowId, cellIdx));
					}
				}
			}else{
				if(!xui.valid.isEmpty(rowId)){
					if(typeof(this.config.onClickData) === "function"){
						this.config.onClickData.call(this, this.getRowIdx(rowId), rowId, this.getRowData(rowId), cellIdx, this.getCellId(cellIdx), this.getCellData(rowId, cellIdx));
					}
				}
			}
		},
		unselect : function(){
			var rowIds										= this.getRowId();
			if(!xui.valid.isEmpty(rowIds)){
				this.grid.clearSelection();
				rowIds										= rowIds.split(",");
				if(this.config.editDiv === "R"){
					var colModel							= this.config.colModel;
					var cell								= null;
					for(var i = 0; i < rowIds.length; i++){
						for(var j = 0; j < colModel.length; j++){
							cell							= this.grid.cells(rowIds[i], j + this.config.plusIdx);
							if(cell.isEditCell() && cell.isNowEditing()){
								cell.editStop();
							}
						}
					}
				}
				this.status.prevRowId						= null;
			}
		},
		dblClick : function(row){
			var rowId										= this.getRowId(row);
			if(!xui.valid.isEmpty(rowId)){
				this.select(rowId, false, false);
				if(typeof(this.config.onDblClickData) === "function"){
					this.config.onDblClickData.call(this, this.getRowIdx(rowId), rowId, this.getRowData(rowId), 0, this.getCellId(0), this.getCellData(rowId, 0));
				}
			}
		},
		getRowId : function(row){
			var rowId										= row;
			if(xui.valid.isEmpty(row)){
				rowId										= this.grid.getSelectedRowId();
			}else if(!isNaN(row)){
				rowId										= this.grid.getRowId(row);
			}
			if(xui.valid.isEmpty(rowId) || rowId === -1){
				rowId										= null;
			}
			return rowId;
		},
		getRowIdx : function(row){
			var rowIdx										= null;
			row												= this.getRowId(row);
			if(!xui.valid.isEmpty(row)){
				rowIdx										= this.grid.getRowIndex(row);
			}
			return rowIdx;
		},
		isExistRow : function(row){
			var isExist										= false;
			if(!xui.valid.isEmpty(row)){
				if(!isNaN(row)){
					row										= this.getRowId(row);
				}
				if(!xui.valid.isEmpty(row) && xui.valid.isString(row)){
					isExist									= this.grid.doesRowExist(row);
				}
			}
			return isExist;
		},
		setFooterData : function(data){
			if(this.config.enableStatistics && xui.valid.isJson(data)){
				var footerArray								= this.config.statistics.footer;
				var cellData								= null;
				for(var i = 0; i < footerArray.length; i++){
					if(data.hasOwnProperty(footerArray[i].name)){
						cellData							= data[footerArray[i].name];
						if(!xui.valid.isEmpty(footerArray[i].format)){
							cellData						= xui.format[xui.util.replace(footerArray[i].format, "xuiform_", "").toLowerCase()].getData(cellData);
						}
						if(!xui.valid.isEmpty(cellData)){
							cellData						= footerArray[i].prefix + cellData + footerArray[i].suffix;
						}
						if(!xui.valid.isEmpty(footerArray[i].cell)){
							footerArray[i].cell.innerHTML	= cellData;
						}
					}
				}
			}
		},
		getFooterData : function(){
			var returnData									= null;
			if(this.config.enableStatistics){
				returnData									= {};
				returnData["ROWNUM"]						= null;
				var colModel								= this.config.colModel;
				var footerArray								= this.config.statistics.footer;
				var footerData								= this.status.statisticsData;
				var labelData								= "";
				var data									= "";
				for(var i = 0; i < footerArray.length; i++){
					if(footerData.hasOwnProperty(footerArray[i].name) || !xui.valid.isEmpty(footerArray[i].cell)){
						returnData[footerArray[i].name]		= footerArray[i].cell.textContent.trim();
					}else{
						returnData[footerArray[i].name]		= "";
					}
				}
				for(var i = 0; i < colModel.length; i++){
					if(!returnData.hasOwnProperty(colModel[i].name)){
						returnData[colModel[i].name]		= "";
					}
				}
				returnData["DATA_FLAG"]						= null;
				returnData["ROW_DIV"]						= "FOOTER";
				returnData["ROW_ID"]						= null;
			}
			return returnData;
		},
		setRowData : function(row, data){
			if(!xui.valid.isEmpty(data)){
				row											= this.getRowId(row);
				if(!xui.valid.isEmpty(row)){
					if(xui.valid.isArray(data)){
						data								= data[0];
					}
					var rowData								= this.getRowData(row);
					if(xui.valid.isArray(rowData)){
						rowData								= rowData[0];
					}
					for(var key in data){
						if(rowData.hasOwnProperty(key)){
							rowData[key]					= data[key];
						}
					}
					this.grid.setRowData(row, rowData);
				}
			}
		},
		getRowData : function(row){
			row												= this.getRowId(row);
			var rowData										= [];
			if(!xui.valid.isEmpty(row)){
				var dataFlag, data, rowDiv;
				row											= row.split(",");
				for(var id in row){
					data									= this.grid.getRowData(row[id]);
					dataFlag								= this.grid.getRowAttribute(row[id], "DATA_FLAG");
					rowDiv									= this.grid.getRowAttribute(row[id], "ROW_DIV");
					if(xui.valid.isEmpty(dataFlag)){
						dataFlag							= xui.enum.TRANSACTION_NONE.getCode();
					}
					if(xui.valid.isEmpty(rowDiv)){
						rowDiv								= "NORMAL";
					}
					data["DATA_FLAG"]						= dataFlag;
					data["ROW_ID"]							= row[id];
					data["ROW_DIV"]							= rowDiv;
					data["ROWNUM"]							= this.getRowIdx(row[id]) + 1;
					rowData.push(data);
				}
			}
			if(rowData.length === 0){
				rowData										= null;
			}else if(rowData.length === 1){
				rowData										= rowData[0];
			}
			return rowData;
		},
		setRowAttribute : function(row, name, value){
			row												= this.getRowId(row);
			if(!xui.valid.isEmpty(row) && !xui.valid.isEmpty(name)){
				if(typeof(value) === "undefined" || value === null){
					value									= "";
				}
				this.grid.setRowAttribute(row, name, value);
			}
		},
		setAllRowAttribute : function(name, value){
			if(!xui.valid.isEmpty(name)){
				if(typeof(value) === "undefined" || value === null){
					value									= "";
				}
				this.grid.startFastOperations();
				this.grid.forEachRow(function(rowId){
					this.grid.setRowAttribute(rowId, name, value);
				});
				this.grid.stopFastOperations();
			}
		},
		getAllData : function(){
			var rowDataList									= [], rowData;
			var count										= this.getCount();
			for(var i = 0; i < count; i++){
				rowData										= this.getRowData(i);
				if(rowData !== null){
					rowDataList.push(rowData);
				}
			}
			if(this.config.enableStatistics){
				rowDataList.push(this.getFooterData());
			}
			if(rowDataList.length === 0){
				rowDataList									= null;
			}
			return rowDataList;
		},
		getCheckedData : function(){
			var rowDataList									= null;
			if(this.config.multiselect && this.getCount() > 0){
				var checkedRows								= this.grid.getCheckedRows(this.config.plusIdx-1);
				if(!xui.valid.isEmpty(checkedRows)){
					rowDataList								= this.getRowData(checkedRows);
					if(xui.valid.isJson(rowDataList)){
						rowDataList							= [rowDataList];
					}
				}
			}
			return rowDataList;
		},
		getChangedData : function(){
			var rowDataList 								= [], rowData;
			var dataFlag 									= null;
			var count 										= this.getCount();
			this.grid.startFastOperations();
			for (var i = 0; i < count; i++) {
				dataFlag 									= this.grid.getRowAttribute(this.getRowId(i), "DATA_FLAG");
				if (!xui.valid.isEmpty(dataFlag) && dataFlag !== xui.enum.TRANSACTION_NONE.getCode()) {
					rowData = this.getRowData(i);
					if (!xui.valid.isEmpty(rowData)) {
						rowDataList.push(rowData);
					}
				}
			}
			this.grid.stopFastOperations();
			var removeRowSize 								= Object.keys(this.status.removeRows).length;
			if (removeRowSize > 0) {
				for (var rowId in this.status.removeRows) {
					rowDataList.push(this.status.removeRows[rowId]);
				}
			}
			if (rowDataList.length === 0) {
				rowDataList 								= null;
			}
			return rowDataList;
		},
		iterateChangedData : function(iterator){
			if(typeof(iterator) === "function"){
				var count									= this.getCount();
				var rowId									= null;
				var rowIdx									= null;
				var rowData									= null;
				var dataFlag								= null;
				this.grid.startFastOperations();
				for(var i = 0; i < count; i++){
					rowId									= this.getRowId(i);
					dataFlag								= this.grid.getRowAttribute(rowId, "DATA_FLAG");
					if(!xui.valid.isEmpty(dataFlag) && dataFlag !== xui.enum.TRANSACTION_NONE.getCode()){
						rowData								= this.grid.getRowData(rowId);
						rowData["DATA_FLAG"]				= dataFlag;
						iterator.call(this, i, rowId, rowData);
					}
				}
				this.grid.stopFastOperations();
				var removeRowSize							= Object.keys(this.status.removeRows).length;
				if(removeRowSize > 0){
					for(var removeRowId in this.status.removeRows){
						iterator.call(this, null, null, this.status.removeRows[removeRowId]);
					}
				}
			}
		},
		getCellId : function(cell){
			var columnId									= null;
			if(!isNaN(cell)){
				columnId									= this.grid.getColumnId(cell);
			}else if(this.grid.getColIndexById(cell) != -1){
				columnId									= cell;
			}
			return columnId;
		},
		getCellIdx : function(cell){
			var cellIdx										= null;
			if(xui.valid.isEmpty(cell)){
				cellIdx										= this.grid.getSelectedCellIndex();
			}else if(!xui.valid.isNumber(this.getCellId(cell))){
				cellIdx										= !isNaN(cell) ? cell : this.grid.getColIndexById(cell);
			}
			if(cellIdx === -1){
				cellIdx										= null;
			}
			return cellIdx;
		},
		getCellObject : function(row, cell){
			var cellObject									= null;
			row												= this.getRowId(row);
			cell											= this.getCellIdx(cell);
			if(!xui.valid.isEmpty(row) && !xui.valid.isEmpty(cell)){
				cellObject									= this.grid.cells(row, cell);
			}
			return cellObject;
		},
		checkValidEditCell : function(){
			var isValid										= true;
			var count										= this.getCount();
			var _beginCellIdx								= this.config.plusIdx;
			var _endCellIdx									= this.config.colModel.length + _beginCellIdx;
			var grid										= this.grid;
			var cell										= null;
			var valid										= false;
			if(count > 0){
				for(var i = 0; i < count; i++){
					for(var j = _beginCellIdx; j < _endCellIdx; j++){
						cell								= grid.cells(this.getRowId(i), j);
						if(typeof(cell.checkValid) === "function"){
							valid							= cell.checkValid(false, true);
							isValid							= (isValid ? valid : isValid);
						}
					}
				}
			}else{
				isValid										= false;
			}
			return isValid;
		},
		setCellData : function(row, cell, value){
			if(typeof(value) !== "undefined" && value !== null){
				if(xui.valid.isEmpty(row) && xui.valid.isEmpty(cell) && this.config.cellClick){
					var markedCells							= this.grid.getMarked();
					for(var i = 0; i < markedCells.length; i++){
						this.grid.cells(markedCells[i][0], markedCells[i][1]).setValue(value);
					}
				}else{
					row										= this.getRowId(row);
					cell									= this.getCellIdx(cell);
					if(!xui.valid.isEmpty(row) && !xui.valid.isEmpty(cell)){
						this.grid.cells(row, cell).setValue(value);
					}
				}
			}
		},
		getCellData : function(row, cell){
			var data										= null;
			if(xui.valid.isEmpty(row) && xui.valid.isEmpty(cell) && this.config.cellClick){
				data										= [];
				var markedCells								= this.grid.getMarked();
				for(var i = 0; i < markedCells.length; i++){
					data.push({"rowId":markedCells[i][0], "cellIdx":markedCells[i][1], "value":this.grid.cells(markedCells[i][0], markedCells[i][1]).getValue()});
				}
				if(data.length === 0){
					data									= null;
				}
			}else{
				row											= this.getRowId(row);
				cell										= this.getCellIdx(cell);
				if(!xui.valid.isEmpty(row) && xui.valid.isNumber(cell)){
					data									= this.grid.cells(row, cell).getValue();
				}
			}
			return data;
		},
		setAllCellData : function(cell, value){
			if(typeof(value) !== "undefined" && value !== null){
				cell										= this.getCellIdx(cell);
				if(xui.valid.isNumber(cell)){
					var count								= this.getCount();
					for(var i = 0; i < count; i++){
						this.setCellData(i, cell, value);
					}
				}
			}
		},
		mergeCell : function(row, cell, size, direction){
			row												= this.getRowId(row);
			cell											= this.getCellIdx(cell);
			var count										= this.getCount();
			if(!xui.valid.isEmpty(row) && xui.valid.isNumber(cell) && xui.valid.isNumber(size) && size > 1 && !xui.valid.isEmpty(direction) && count > 0){
				var rowIdx									= this.getRowIdx(row);
				direction									= direction.toUpperCase();
				switch(direction){
					case "ROWSPAN"	:
					case "ROW"		:
					case "R"		:
						if(rowIdx + (size - 1) <= count){
							this.grid.setRowspan(row, cell, size);
						}
						break;
					case "COLSPAN"	:
					case "COL"		:
					case "C"		:
						if(cell + (size - 1) <= (this.config.colModel.length + this.config.plusIdx)){
							this.grid.setColspan(row, cell, size);
						}
						break;
					default		:
						break;
				}
			}
		},
		insertRow : function(row, data, doClick, doCallFn){
			row												= this.getRowId(row);
			var count										= this.getCount();
			if(!xui.valid.isEmpty(row) || (xui.valid.isEmpty(row) && count === 0)){
				if(this.isExistRow("grid_empty_row")){
					this.init();
				}
				var rowIdx									= this.getRowIdx(row);
				if(xui.valid.isEmpty(rowIdx)){
					rowIdx									= -1;
				}
				var totalCount								= this.getTotalCount();
				if(xui.valid.isEmpty(data)){
					data									= [{}];
				}else if(xui.valid.isJson(data)){
					data									= [data];
				}
				if(xui.valid.isArray(data) && data.length > 0){
					if(this.config.paging && count + data.length > this.getCountPerPage()){
						xui.dialog.warning(xui.enum.GRID_LOAD_ERROR10.getName(), xui.enum.GRID_ERROR.getName());
						return null;
					}
					if(xui.valid.isEmpty(doClick)){
						doClick								= true;
					}
					if(xui.valid.isEmpty(doCallFn)){
						doCallFn							= true;
					}
					if(typeof(this.config.onBeforeRowAdd) === "function"){
						var blnReturn						= this.config.onBeforeRowAdd.call(this, rowIdx, row, this.getRowData(row), data);
						if(xui.valid.isEmpty(blnReturn)){
							blnReturn						= true;
						}
						if(!blnReturn){
							return null;
						}
					}
					if(this.isExistRow("grid_empty_row")){
						this.init();
					}
					this.unselect();
					var newRowIdList						= [];
					var newRowIdxList						= [];
					var newRowId							= "";
					var dataList							= [];
					var colModel							= this.config.colModel;
					var removeRowSize						= Object.keys(this.status.removeRows).length;
					var isRemovedRow						= false;
					var rownumber							= ((xui.valid.isEmpty(row) && count === 0) ? 1 : parseInt(this.getRowData(row).ROWNUM) + 1);
					var dataFlag							= null;
					for(var i = 0; i < data.length; i++){
						isRemovedRow						= false;
						newRowId							= xui.util.generateUUID();
						dataList							= [];
						if(this.config.rownumbers){
							dataList.push(rownumber++);
						}
						if(this.config.multiselect){
							if(data[i].hasOwnProperty("CHECKBOX")){
								dataList.push(data[i].CHECKBOX);
							}else{
								dataList.push("0");
							}
						}
						for(var j = 0; j < colModel.length; j++){
							if(data[i].hasOwnProperty(colModel[j].name)){
								dataList.push(data[i][colModel[j].name]);
							}else{
								dataList.push("");
							}
						}
						rowIdx++;
						this.grid.addRow(newRowId, dataList, rowIdx);
						newRowIdList.push(newRowId);
						newRowIdxList.push(rowIdx);
						if(removeRowSize > 0){
							for(var key in this.status.removeRows){
								if(xui.util.compare(data[i], this.status.removeRows[key])){
									isRemovedRow			= true;
									delete this.status.removeRows[key];
									break;
								}
							}
							if(isRemovedRow){
								dataFlag					= xui.enum.TRANSACTION_NONE.getCode();
							}else{
								dataFlag					= xui.enum.TRANSACTION_INSERT.getCode();
							}
						}else{
							dataFlag						= xui.enum.TRANSACTION_INSERT.getCode();
						}
						this.grid.setRowAttribute(newRowId, "DATA_FLAG", dataFlag);
						data[i].DATA_FLAG					= dataFlag;
					}
					this._setCount(count + data.length);
					this._setTotalCount(totalCount + data.length);
					/*추가된 행 자동선택*/
					this.scrollTo(newRowId);
					if(doClick){
						this.select(newRowId, doCallFn, false);
					}
					if(typeof(this.config.onRowAdded) === "function"){
						this.config.onRowAdded.call(this, newRowIdxList, newRowIdList, data);
					}
					if(this.config.enableFilter){
						this.grid.refreshFilters();
					}
					this.grid.setSizes();
				}
			}
		},
		appendRow : function(data, doClick, doCallFn){
			var rowId										= null;
			if(this.getCount() > 0){
				rowId										= this.getRowId(this.getCount()-1);
			}
			return this.insertRow(rowId, data, doClick, doCallFn);
		},
		removeRow : function(row){
			var rowIds										= this.getRowId(row);
			if(!xui.valid.isEmpty(rowIds)){
				rowIds										= rowIds.split(",");
				if(rowIds.length > 0){
					var rowIdxList							= [];
					var rowData								= [];
					var blnReturn							= true;
					for(var i in rowIds){
						rowIdxList.push(this.getRowIdx(rowIds[i]));
						rowData.push(this.getRowData(rowIds[i]));
					}
					if(typeof(this.config.onBeforeRowRemove) === "function"){
						blnReturn							= this.config.onBeforeRowRemove.call(this, rowIdxList, rowIds, rowData);
						if(typeof(blnReturn) === "undefined"){
							blnReturn						= true;
						}
					}
					if(blnReturn){
						var removeSize						= 0;
						var count							= this.getCount();
						var totalCount						= this.getTotalCount();
						var plusIdx							= this.config.plusIdx - 1;
						var checkStatus						= this.status.columnCheckboxStatus[xui.enum.GRID_CHECKBOX.getCode()];
						var cell							= null;
						for(var i = 0; i < rowIds.length; i++){
							if(this.config.multiselect){
								cell						= this.grid.cells(rowIds[i], plusIdx);
								if(cell.isChecked()){
									checkStatus.checkedCount	= checkStatus.checkedCount - 1;
								}
							}
							this.grid.deleteRow(rowIds[i]);
							removeSize++;
						}
						this._setCount(count - removeSize);
						this._setTotalCount(totalCount - removeSize);
						this.grid.setSizes();
						if(removeSize > 0){
							if(typeof(this.config.onRowRemoved) === "function"){
								this.config.onRowRemoved.call(this, rowIdxList, rowIds, rowData);
							}
						}
					}
				}
			}
		},
		removeCheckedRow : function(){
			if(this.config.multiselect){
				var checked									= this.grid.getCheckedRows(this.config.plusIdx-1);
				if(!xui.valid.isEmpty(checked)){
					this.removeRow(checked);
				}
			}
		},
		findRow : function(cell, dataList){
			var findRows									= null;
			if(!xui.valid.isEmpty(cell) && !xui.valid.isEmpty(dataList)){
				if(!xui.valid.isArray(cell)){
					cell									= [cell];
				}
				if(!xui.valid.isArray(dataList)){
					dataList								= [dataList];
				}
				if(cell.length === dataList.length){
					findRows								= [];
				}
				var size									= cell.length;
				var found									= null;
				for(var i = 0; i < size; i++){
					found									= this.grid.findCell(dataList[i], this.getCellIdx(cell[i]), false, true);
					if(found.length > 0){
						for(var j = 0; j < found.length; j++){
							if(findRows.indexOf(found[j][0]) < 0){
								findRows.push(found[j][0]);
							}
						}
					}
				}
				if(findRows.length === 0){
					findRows								= null;
				}
			}
			return findRows;
		},
		setHeaderName : function(headerNameList){
			if(xui.valid.isArray(headerNameList) && headerNameList.length > 0){
				if(!xui.valid.isArray(headerNameList[0])){
					headerNameList							= [headerNameList];
				}
				var previousColNames						= xui.util.copyObject([], this.config.colNames, true);
				this.config.colNames						= headerNameList;
				if(!this._validGrid(this.config)){
					this.config.colNames					= previousColNames;
				}else{
					this.config.originColNames				= xui.util.copyObject([], this.config.colNames, true);
					this._redrawHeader();
				}
			}
		},
		getHeaderName : function(cell){
			var name										= null;
			cell											= this.getCellIdx(cell);
			if(!xui.valid.isEmpty(cell)){
				name										= this.grid.getColLabel(cell, this.config.headerLineSize-1);
			}
			return name;
		},
		getCount : function(){
			var rowCount									= null;
			var toolbarController							= null;
			if(this.config.paging){
				toolbarController							= this.config.pageContainer.pageController;
			}else if(this.config.scrollAppend){
				toolbarController							= this.config.appendContainer.appendController;
			}
			if(!xui.valid.isEmpty(toolbarController)){
				rowCount									= toolbarController.getCount();
			}else{
				rowCount									= this.status.currentCount;
			}
			return rowCount;
		},
		getTotalCount : function(){
			var totalCount									= null;
			var toolbarController							= null;
			if(this.config.paging){
				toolbarController							= this.config.pageContainer.pageController;
			}else if(this.config.scrollAppend){
				toolbarController							= this.config.appendContainer.appendController;
			}
			if(!xui.valid.isEmpty(toolbarController)){
				totalCount									= toolbarController.getTotalCount();
			}else{
				totalCount									= this.status.totalCount;
			}
			return totalCount;
		},
		getCountPerPage : function(){
			var countPerPage								= null;
			var toolbarController							= null;
			if(this.config.paging){
				toolbarController							= this.config.pageContainer.pageController;
			}else if(this.config.scrollAppend){
				toolbarController							= this.config.appendContainer.appendController;
			}
			if(!xui.valid.isEmpty(toolbarController)){
				countPerPage								= toolbarController.getCountPerPage();
			}else{
				countPerPage								= this.status.countPerPage;
			}
			return countPerPage;
		},
		getPage : function(){
			var pageNumber									= null;
			var toolbarController							= null;
			if(this.config.paging){
				toolbarController							= this.config.pageContainer.pageController;
			}else if(this.config.scrollAppend){
				toolbarController							= this.config.appendContainer.appendController;
			}
			if(!xui.valid.isEmpty(toolbarController)){
				pageNumber									= toolbarController.getPage();
			}else{
				pageNumber									= this.status.pageNumber;
			}
			return pageNumber;
		},
		getLastPage : function(){
			var pageNumber									= null;
			var toolbarController							= null;
			if(this.config.paging){
				toolbarController							= this.config.pageContainer.pageController;
			}else if(this.config.scrollAppend){
				toolbarController							= this.config.appendContainer.appendController;
			}
			if(!xui.valid.isEmpty(toolbarController)){
				pageNumber									= toolbarController.getLastPage();
			}else{
				pageNumber									= this.status.pageNumber;
			}
			return pageNumber;
		},
		goPage : function(pageNumber, doCallFn){
			var toolbarController							= null;
			if(this.config.paging){
				toolbarController							= this.config.pageContainer.pageController;
			}
			if(!xui.valid.isEmpty(toolbarController)){
				if(xui.valid.isEmpty(doCallFn)){
					doCallFn								= true;
				}
				toolbarController.setPage(pageNumber, this.getCount(), this.getTotalCount(), this.getCountPerPage(), doCallFn);
			}
		},
		isPaging : function(){
			return (this.config.paging || this.config.scrollAppend);
		},
		isExistDupleValue : function(cell){
			var isExist										= false;
			cell											= this.getCellIdx(cell);
			if(!xui.valid.isEmpty(cell) && cell > 0){
				var cellValue								= null;
				var valueJson								= {};
				var count									= this.getCount();
				for(var i = 0; i < count; i++){
					cellValue								= this.getCellData(i, cell);
					if(!xui.valid.isEmpty(cellValue)){
						if(valueJson.hasOwnProperty(cellValue)){
							isExist							= true;
							break;
						}else{
							valueJson[cellValue]			= "";
						}
					}
				}
			}
			return isExist;
		},
		freezeColumn : function(cell){
			cell											= this.getCellIdx(cell)
			if(!xui.valid.isEmpty(cell)){
				this.config.freezeColumnIdx					= cell;
				this.config.freezeColumn					= this.getCellId(cell);
				this.grid.splitAt(cell);
			}
		},
		previewPrint : function(){
			this.grid.printView();
		},
		exportExcel : function(filename, fromClientData){
			if(this.config.enableExportExcl && this.getCount() > 0){
				if(xui.valid.isEmpty(fromClientData)){
					fromClientData							= this.config.exportFromClient;
				}
				var requestForm								= this._getRequest();
				var requestJson								= requestForm.request;
				if(xui.valid.isXuiJson(requestJson)){
					var _this								= this;
					xui.dialog.confirm(xui.enum.GRID_EXCEL_BIG_DATA.getName(), xui.enum.EXCEL_EXPORT.getName(), function(isConfirm){
						if(isConfirm){
							if(xui.valid.isEmpty(filename)){
								filename					= _this.config.title;
							}
							var gridInfo					= _this._getGridConfigData();
							var param						= new xui.json();
							param.setURL(xui.com.getRequestPrefix() + "/exportExcelGridData.json");
							param.setPageNo(1);
							param.setRowPerPage(99999999);
							param.setDataJsonArray(requestJson.getDataJsonArray());
							param.setString("excelFileName"			,filename);
							param.setString("title"					,_this.config.excelTitle);
							param.setString("subTitle"				,_this.config.excelSubTitle);
							param.setInt("rowIdx"					,_this.config.excelStartRowIdx);
							param.setInt("cellIdx"					,_this.config.excelStartCellIdx);
							param.setBoolean("excelVisibleKey"		,_this.config.excelVisibleKey);
							param.setString("menuKey"				,xui.extends.menu.menuKey); // 엑셀 다운로드 시 메뉴 키 추가 - 20220210, 오승현
							param.setString("COL_NAMES"				,gridInfo.COL_NAMES);
							param.setString("sqlNameSpace"			,requestJson.getHeader("sqlNameSpace"));
							param.setString("sqlId"					,requestJson.getHeader("sqlId"));
							param.setString("connPoolName"			,requestJson.getHeader("connPoolName"));
							param.setString("sessionCompanyCode"	,xui.extends.session.getCompanyCode());
							param.setString("sessionUserId"			,xui.extends.session.getUserId());
							if(fromClientData || xui.valid.isEmpty(param.getString("sqlNameSpace")) || xui.valid.isEmpty(param.getString("sqlId"))){
								param.setDataJsonArray(_this.getAllData(), "GRID_DATA");
								if(_this.config.enableStatistics){
									param.setDataJsonObject(_this.getFooterData(), param.getCount("GRID_DATA") - 1, "GRID_DATA");
									param.setObject("footerColspan"	,gridInfo.FOOTER_COLSPAN_INFO, 0, "FOOTER_INFO");
								}
							}
							param.setDataJsonArray(gridInfo.COL_MODEL, "COL_MODEL");
							param.setAuthType(xui.enum.AUTH_TYPE_OUTPUT.getCode());
							xui.ajax._exportExcel(param);
						}
					}, (this.getTotalCount() <= 30000));
				}
			}else{
				if(!this.config.enableExportExcl){
					xui.dialog.error("", xui.enum.GRID_NO_EXCEL_DOWNLOAD.getName());
				}else{
					xui.dialog.warning("", xui.enum.NO_DATA.getName());
				}
			}
		},
		setRowCss : function(row, css){
			if(!xui.valid.isEmpty(css)){
				row											= this.getRowId(row);
				if(!xui.valid.isEmpty(row)){
					this.grid.setRowTextStyle(row, css);
				}
			}
		},
		setCellCss : function(row, cell, css){
			if(!xui.valid.isEmpty(css)){
				if(xui.valid.isEmpty(row) && xui.valid.isEmpty(cell)){
					var markedCells							= this.grid.getMarked();
					for(var i = 0; i < markedCells.length; i++){
						this.grid.setCellTextStyle(markedCells[i][0], markedCells[i][1], css);
					}
				}else{
					row										= this.getRowId(row);
					cell									= this.getCellIdx(cell);
					if(!xui.valid.isEmpty(row) && xui.valid.isNumber(cell)){
						this.grid.setCellTextStyle(row, cell, css);
					}
				}
			}
		},
		setAllCellCss : function(cell, css){
			if(!xui.valid.isEmpty(css)){
				var count									= this.getCount();
				for(var i = 0; i < count; i++){
					this.setCellCss(css, i, cell);
				}
			}
		},
		check : function(row, cell, checked){
			if(xui.valid.isEmpty(checked)){
				checked										= true;
			}
			if(xui.valid.isEmpty(cell)){
				cell										= (this.config.multiselect ? this.config.plusIdx-1 : null);
			}else{
				cell										= this.getCellIdx(cell);
			}
			row												= this.getRowId(row);
			if(!xui.valid.isEmpty(row) && !xui.valid.isEmpty(cell)){
				var element									= this.grid.cells(row, cell);
				if(element.isCheckbox()){
					if (element.isDisabled && element.isDisabled()) return; // disable 제외
					element.setValue((checked ? "1" : "0"));
				}
			}
		},
		checkAll : function(cell, checked){
			var count										= this.getCount();
			for(var i = 0; i < count; i++){
				this.check(i, cell, checked);
			}
		},
		uncheck : function(row, cell){
			this.check(row, cell, false);
		},
		uncheckAll : function(cell){
			this.checkAll(cell, false);
		},
		uncheckHeaderCheckbox: function() {
			var status = this.status;
			if (!status || !status.columnCheckboxStatus) return;

			for (var key in status.columnCheckboxStatus) {
				var chkObj = status.columnCheckboxStatus[key];
				var el = chkObj.element;
				if (xui.valid.isElement(el)) {
					el.checked = false;
					el.indeterminate = false;
				}
				chkObj.checkedCount = 0;
			}
		},
		disableCheckbox : function(row, cell, disabled){
			if(xui.valid.isEmpty(disabled)){
				disabled									= true;
			}
			if(xui.valid.isEmpty(cell)){
				cell										= (this.config.multiselect? this.config.plusIdx-1 : null);
			}else{
				cell										= this.getCellIdx(cell);
			}
			row												= this.getRowId(row);
			if(!xui.valid.isEmpty(row) && !xui.valid.isEmpty(cell)){
				var element									= this.grid.cells(row, cell);
				if(element.isCheckbox()){
					element.setDisabled((disabled ? "1" : "0"));
				}
			}
		},
		enableCheckbox : function(row, cell){
			this.disableCheckbox(row, cell, false);
		},
		disableAllCheckbox : function(cell, disabled){
			var count										= this.getCount();
			for(var i = 0; i < count; i++){
				this.disableCheckbox(i, cell, disabled);
			}
		},
		enableAllCheckbox : function(cell){
			this.disableAllCheckbox(cell, false);
		},
		disableHeaderCheckbox : function(cell, disabled){
			if(!xui.valid.isEmpty(disabled)){
				disabled									= true;
			}
			if(xui.valid.isEmpty(cell)){
				cell										= (this.config.multiselect ? this.config.plusIdx-1 : null);
			}else{
				cell										= this.getCellIdx(cell);
			}
			if(!xui.valid.isEmpty(cell)){
				var columnName								= this.getCellId(cell);
				var checkbox								= null;
				if(this.status.columnCheckboxStatus.hasOwnProperty(columnName)){
					checkbox								= this.status.columnCheckboxStatus[columnName].element;
					if(xui.valid.isElement(checkbox)){
						checkbox.disabled					= disabled;
					}
				}
			}
		},
		enableHeaderCheckbox : function(cell){
			this.disableHeaderCheckbox(cell, false);
		},
		visibleColumn : function(cell, visible){
			cell											= this.getCellIdx(cell);
			if(!xui.valid.isEmpty(cell) && cell >= this.config.plusIdx){
				if(xui.valid.isEmpty(visible)){
					visible									= true;
				}
				this.grid.setColumnHidden(cell, !visible);
				var columnInfo								= this.config.colModel[cell - this.config.plusIdx];
				if(visible){
					this.grid.setColWidth(cell, columnInfo.width);
				}else{
					this.grid.setColWidth(cell, 0);
				}
			}
		},
		invisibleColumn : function(cell){
			this.visibleColumn(cell, false);
		},
		selectCell : function(row, cell, doCallFn){
			row												= this.getRowId(row);
			cell											= this.getCellIdx(cell);
			if(!xui.valid.isEmpty(row) && !xui.valid.isEmpty(cell)){
				if(xui.valid.isEmpty(doCallFn)){
					doCallFn								= true;
				}
				var prevRowId								= this.status.prevRowId;
				if(this.config.cellClick){
					this._onCellMark(row, cell, new Event("click"), doCallFn, false);
				}else{
					this._prevClick(row, this.status.prevRowId, cell);
				//	this._afterClick(row, cell, doCallFn, false); 220304 KSH smartRender로 인해 클릭 안되는 문제로 인하여 삭제
				}
				this.grid.selectCell(this.getRowIdx(row), cell, false, true, true);
				var objCell									= this.grid.cells(row, cell);
				if(!xui.valid.isEmpty(objCell) && objCell.isEditCell()){
					objCell.cell.click();  //220304 KSH smartRender로 인해 클릭 안되는 문제로 인하여 추가
					objCell.focusEditCell();
				}
			}
		},
		unselectCell : function(row, cell){
			row												= this.getRowId(row);
			cell											= this.getCellIdx(cell);
			if(!xui.valid.isEmpty(row) && !xui.valid.isEmpty(cell) && this.config.cellClick){
				this.grid.mark(row, cell, false);
			}
		},
		disableCell : function(row, cell, disabled){
			if(xui.valid.isEmpty(disabled)){
				disabled									= true;
			}
			row												= this.getRowId(row);
			cell											= this.getCellIdx(cell);
			if(!xui.valid.isEmpty(row) && !xui.valid.isEmpty(cell)){
				this.grid.cells(row, cell).setDisabled(disabled);
			}
		},
		enableCell : function(row, cell){
			this.disableCell(row, cell, false);
		},
		disableAllCell : function(cell, disabled){
			var count										= this.getCount();
			for(var i = 0; i < count; i++){
				this.disableCell(i, cell, disabled);
			}
		},
		enableAllCell : function(cell){
			this.disableAllCell(cell, false);
		},
		resizeGrid : function(){
			this.grid.setSizes();
		},
		scrollTo : function(row){
			row												= this.getRowId(row);
			if(!xui.valid.isEmpty(row)){
				if(this.config.enableAutoHeight){
					this.grid.getRowById(row).scrollIntoView();
				}else{
					this.grid.showRow(row);
				}
			}
		},
		showTooltip : function(row, cell, message, type, expire, icon, width, height){
			var tooltip										= null;
			row												= this.getRowId(row);
			cell											= this.getCellIdx(cell);
			if(!xui.valid.isEmpty(row) && !xui.valid.isEmpty(message)){
				if(xui.valid.isEmpty(cell)){
					cell									= 0;
				}
				if(xui.valid.isEmpty(type)){
					type									= "";
				}
				if(xui.valid.isEmpty(expire)){
					expire									= 3000;
				}
				if(xui.valid.isEmpty(icon)){
					icon									= "";
				}
				tooltip										= xuic.__COM.showMessageTip(this.grid.cells(row, cell).cell, message, type, expire, icon, width, height);
			}
			return tooltip;
		},
		setExcelTitle : function(title, subTitle){
			if(!xui.valid.isEmpty(title)){
				this.config.excelTitle						= title;
			}
			if(!xui.valid.isEmpty(subTitle)){
				this.config.excelSubTitle					= subTitle;
			}
		},
		setSmartRendering : function(enable){
			if(enable === true || enable === false){
				this.grid.enableSmartRendering(enable);
				this.config.smartRender						= enable;
			}
		},
		/**
		 * 20221121 JHS 그리드 컬럼 사이즈 변경
		 * @param {int or string} cell : cell index or name
		 * @param {string} value : a new width value
		 * @returns 없음
		 */
		setColWidth : function(cell, value){
			if(isNaN(cell)){
				cell = this.getCellIdx(cell);
			}
			this.grid.setColWidth(cell, value);
		},
		_validGrid : function(config){
			var valid										= true;
			var validList									= [];
			validList.push({valid:!(!config.cellClick && config.dragBlock && config.multiRowSelect)								,message:xui.enum.GRID_LOAD_ERROR01.getName()});
			validList.push({valid:!(config.scrollAppend && config.paging)														,message:xui.enum.GRID_LOAD_ERROR02.getName()});
			validList.push({valid:!(config.headerLineSize > 1 && config.colMove)												,message:xui.enum.GRID_LOAD_ERROR03.getName()});
			if(config.headerLineSize > 1){
				for(var i = 1; i < config.headerLineSize; i++){
					if(config.colNames[0].length !== config.colNames[i].length){
						validList.push({valid:false																				,message:xui.enum.GRID_LOAD_ERROR04.getName()});
						break;
					}
				}
			}
			validList.push({valid:!(config.colNames[0].length !== config.colModel.length)										,message:xui.enum.GRID_LOAD_ERROR05.getName()});
			if(!xui.valid.isEmpty(config.statistics)){
				validList.push({valid:!(config.colMove)																			,message:xui.enum.GRID_LOAD_ERROR06.getName()});
				var colModel								= config.colModel;
				var groupArray								= config.statistics.group;
				var targetArray								= config.statistics.target;
				var footerArray								= config.statistics.footer;
				var colSize									= colModel.length;
				var size									= 0;
				var has										= false;
				if(xui.valid.isArray(groupArray)){
					size									= groupArray.length;
					for(var i = 0; i < size; i++){
						has									= false;
						for(var j = 0; j < colSize; j++){
							if(!xui.valid.isEmpty(groupArray[i].name) && colModel[j].name === groupArray[i].name){
								has							= true;
								break;
							}
						}
						if(!has){
							validList.push({valid:false																			,message:xui.enum.GRID_LOAD_ERROR07.getName()});
							break;
						}
					}
				}
				if(xui.valid.isArray(targetArray)){
					size									= targetArray.length;
					for(var i = 0; i < size; i++){
						has									= false;
						for(var j = 0; j < colSize; j++){
							if(!xui.valid.isEmpty(targetArray[i].name) && colModel[j].name === targetArray[i].name){
								has							= true;
								break;
							}
						}
						if(!has){
							validList.push({valid:false																			,message:xui.enum.GRID_LOAD_ERROR08.getName()});
							break;
						}
					}
				}
				if(xui.valid.isArray(footerArray)){
					size									= footerArray.length;
					for(var i = 0; i < size; i++){
						has									= false;
						for(var j = 0; j < colSize; j++){
							if(!xui.valid.isEmpty(footerArray[i].name) && colModel[j].name === footerArray[i].name){
								has							= true;
								break;
							}
						}
						if(!has){
							validList.push({valid:false																			,message:xui.enum.GRID_LOAD_ERROR09.getName()});
							break;
						}
					}
				}
			}
			for(var i in validList){
				valid										= validList[i].valid;
				if(!valid){
					xui.dialog.error(validList[i].message, xui.enum.GRID_ERROR.getName());
					break;
				}
			}
			return valid;
		},
		_drawHeader : function(columnFilterList){
			var headerNameGroup								= "", headerCssGroup = "", headerClassGroup = "", _colModel = this.config.colModel, _colNames = this.config.colNames, headerCtxList = "";
			if(this.config.headerLineSize > 1){
				for(var i = _colNames.length-1; i >= 0; i--){
					for(var j = _colNames[i].length-1; j >= 0; j--){
						if(j > 0){
							if(_colNames[i][j] == _colNames[i][j-1]){
								this.config.colNames[i][j] = "#cspan";
							}
						}
					}
					if(i > 0){
						for(var k = _colNames[i].length-1; k >= 0; k--){
							if(_colNames[i][k] === _colNames[i-1][k]){
								this.config.colNames[i][k] = "#rspan";
							}
						}
					}
				}
				if(this.config.freezeColumnIdx >= 0){
					var blnRemoveHeaderRow;
					for(var y = 1; y < _colNames.length; y++){
						blnRemoveHeaderRow					= true;
						for(var x = 0; x < this.config.freezeColumnIdx; x++){
							if(_colNames[y][x] !== "#rspan"){
								blnRemoveHeaderRow = false;
								break;
							}
						}
						if(blnRemoveHeaderRow){
							this.config.removeHeaderList.push(y);
						}
					}
				}
			}
			this.grid.setDelimiter("||");
			for(var i = 0; i < _colNames.length; i++){
				headerNameGroup								= "";
				headerCssGroup								= "";
				headerClassGroup							= "";
				for(var j = 0; j < _colNames[i].length; j++){
					if(_colNames[i][j].indexOf("#rspan") >= 0 || _colNames[i][j].indexOf("#cspan") >= 0){
						if(_colNames[i][j].indexOf("#rspan") >= 0){headerNameGroup += "#rspan";}
						if(_colNames[i][j].indexOf("#cspan") >= 0){headerNameGroup += "#cspan";}
						headerNameGroup						+= "||";
						headerCssGroup						+= "text-align:center||";
						headerClassGroup					+= "||";
						if(i === 0){
							headerCtxList					+= "false,";
						}
					}else{
						if(!xui.valid.isEmpty(this.config.editDiv) && !xui.valid.isEmpty(_colModel[j].edit) && !xui.valid.isEmpty(_colModel[j].edit.headerCheckbox)){
							if(_colModel[j].edit.headerCheckbox === "disable"){
								headerNameGroup				+= _colNames[i][j] + "&nbsp;&nbsp;<label class=\"xui-checkbox-label\"><input type=\"checkbox\" class=\"xui-disabled\" id=\"" + this.config.baseId + "_" + _colModel[j].name + "\" disabled/><span>&nbsp;</span></label>||";
							}else{
								headerNameGroup				+= _colNames[i][j] + "&nbsp;&nbsp;<label class=\"xui-checkbox-label\"><input type=\"checkbox\" class=\"\" id=\"" + this.config.baseId + "_" + _colModel[j].name + "\"/><span>&nbsp;</span></label>||";
							}
							headerCssGroup					+= "text-align:" + (!xui.valid.isEmpty(this.config.headerAlign) ? this.config.headerAlign : this.config.colModel[j].align) + "||";
							headerClassGroup				+= "||";
							if(xui.valid.isEmpty(this.status.columnCheckboxStatus[_colModel[j].name])){
								this.status.columnCheckboxStatus[_colModel[j].name]				= {};
							}
							this.status.columnCheckboxStatus[_colModel[j].name].checkedCount	= 0;
							if(i === 0){
								if(!_colModel[j].hidden){
									headerCtxList			+= "true,";
								}else{
									headerCtxList			+= "false,";
								}
							}
						}else{
							headerNameGroup					+= _colNames[i][j] + "||";
							headerCssGroup					+= "text-align:" + (!xui.valid.isEmpty(this.config.headerAlign) ? this.config.headerAlign : this.config.colModel[j].align) + "||";
							headerClassGroup				+= (this.config.colModel[j].sort ? "xuihcell_sort" : "") + "||";
							if(i === 0){
								if(!_colModel[j].hidden){
									headerCtxList			+= "true,";
								}else{
									headerCtxList			+= "false,";
								}
							}
						}
					}
				}
				if(i == 0){
					headerCssGroup							= (this.config.rownumbers ? "text-align:center||" : "") + (this.config.multiselect ? "text-align:center||" : "") + headerCssGroup;
					headerClassGroup						= (this.config.rownumbers ? "||" : "") + (this.config.multiselect ? "||" : "") + headerClassGroup;
					this.grid.setHeader((this.config.rownumbers ? xui.message.get("enum.GRID_ROWNUMBER")+"||" : "") + (this.config.multiselect ? "<label class=\"xui-checkbox-label\"><input type=\"checkbox\" class=\"" + (this.config.multiAllDisabled ? "xui-disabled" : "") + "\" id=\"" + this.config.baseId + "_" + xui.enum.GRID_CHECKBOX.getCode() + "\" " + (this.config.multiAllDisabled ? "disabled" : "") + "/><span></span></label>||" : "") + headerNameGroup.substr(0, headerNameGroup.length-2), null, headerCssGroup.split("||"), headerClassGroup.split("||"));
					if(this.config.multiselect){
						this.status.columnCheckboxStatus[xui.enum.GRID_CHECKBOX.getCode()]				= {};
						this.status.columnCheckboxStatus[xui.enum.GRID_CHECKBOX.getCode()].checkedCount	= 0;
					}
				}else{
					headerCssGroup							= (this.config.rownumbers ? "text-align:center||" : "") + (this.config.multiselect ? "text-align:center||" : "") + headerCssGroup;
					headerClassGroup						= (this.config.rownumbers ? "||" : "") + (this.config.multiselect ? "||" : "") + headerClassGroup;
					this.grid.attachHeader((this.config.rownumbers ? "#rspan||" : "") + (this.config.multiselect ? "#rspan||" : "") + headerNameGroup.substr(0, headerNameGroup.length-2), headerCssGroup, "_aHead", headerClassGroup);
				}
			}
			this.grid.setDelimiter(",");

			if(this.config.enableFilter && !xui.valid.isEmpty(columnFilterList)){
				columnFilterList							= (this.config.rownumbers ? "#rspan," : "") + (this.config.multiselect ? "#rspan," : "") + columnFilterList.substr(0, columnFilterList.length-1);
				this.grid.attachHeader(columnFilterList);
			}

			/*헤더 컬럼 숨기기 메뉴 정의*/
			headerCtxList									= (this.config.rownumbers ? "false," : "") + (this.config.multiselect ? "false," : "") + headerCtxList;
			this._loadHeaderCtx(headerCtxList.substr(0, headerCtxList.length-1));

		},
		_redrawHeader : function(){
			var _colModel									= this.config.colModel, _colNames = this.config.colNames;
			if(this.config.headerLineSize > 1){
				for(var i = _colNames.length-1; i >= 0; i--){
					for(var j = _colNames[i].length-1; j >= 0; j--){
						if(j > 0){
							if(_colNames[i][j] == _colNames[i][j-1]){
								this.config.colNames[i][j] = "#cspan";
							}
						}
					}
					if(i > 0){
						for(var k = _colNames[i].length-1; k >= 0; k--){
							if(_colNames[i][k] === _colNames[i-1][k]){
								this.config.colNames[i][k] = "#rspan";
							}
						}
					}
				}
				if(this.config.freezeColumnIdx >= 0){
					var blnRemoveHeaderRow;
					for(var y = 1; y < _colNames.length; y++){
						blnRemoveHeaderRow					= true;
						for(var x = 0; x < this.config.freezeColumnIdx; x++){
							if(_colNames[y][x] !== "#rspan"){
								blnRemoveHeaderRow = false;
								break;
							}
						}
						if(blnRemoveHeaderRow){
							this.config.removeHeaderList.push(y);
						}
					}
				}
			}
			var currentHeaderElement						= this.grid.hdr;
			for(var i = 0; i < _colNames.length; i++){
				for(var j = 0; j < _colNames[i].length; j++){
					if(!(_colNames[i][j].indexOf("#rspan") >= 0 || _colNames[i][j].indexOf("#cspan") >= 0) && !(!xui.valid.isEmpty(this.config.editDiv) && !xui.valid.isEmpty(_colModel[j].edit) && !xui.valid.isEmpty(_colModel[j].edit.headerCheckbox))){
						this.grid.hdr.querySelector("tr:nth-child(" + (i+2) + ")").querySelector("td:nth-child(" + (this.config.plusIdx + j + 1) + ")").firstElementChild.innerHTML	= _colNames[i][j];
					}
				}
			}
		},
		_drawFooter : function(){
			if(this.config.enableStatistics){
				this.grid.setDelimiter("||");
				var footerArray								= this.config.statistics.footer;
				var footerLabel								= "";
				var footerStyle								= "";
				var label									= "";
				var style									= "";
				var colspan									= 1;
				var _idx									= 0;
				var cellIndex								= 0;
				footerArray[0].colspan						= footerArray[0].colspan + this.config.plusIdx;
				for(var i = 0; i < footerArray.length; i++){
					label									= footerArray[i].label;
					if(xui.valid.isEmpty(label)){
						label								= "&nbsp;";
					}
					style									= footerArray[i].style;
					style									= JSON.stringify(style);
					style									= style.substr(1, style.length-2);
					if(!xui.valid.isEmpty(style)){
						style								= xui.util.replace(style, "\"", "");
						style								= xui.util.replace(style, ",", ";");
						style								= xui.util.replace(style, ";;", ";");
					}
					colspan									= footerArray[i].colspan;
					footerLabel								+= label	+ "||";
					footerStyle								+= style	+ "||";
					footerArray[i].cellIndex				= cellIndex;
					for(var j = 0; j < colspan - 1; j++){
						if(i === 0 && j === 0){
							i								= i - this.config.plusIdx;
						}
						footerLabel							+= "#cspan||";
						footerStyle							+= style	+ "||";
						i++;
					}
					cellIndex++;
				}
				footerLabel									= footerLabel.substr(0, footerLabel.length-2).split("||");
				footerStyle									= footerStyle.substr(0, footerStyle.length-2).split("||");
				this.grid.attachFooter(footerLabel, footerStyle);
				this.grid.setDelimiter(",");
			}
		},
		_loadHeaderCtx : function(headerCtxList){
			this.config.headerContext						= [];
			headerCtxList									= headerCtxList.split(",");
			var headerName									= null;
			for(var i = 0; i < headerCtxList.length; i++){
				if(i >= this.config.plusIdx && headerCtxList[i] === "true"){
					headerName								= xui.util.replace(this.config.colNames[0][i - this.config.plusIdx], "<br/>", " ").replace(xuic.__REGEXP.getCmmnRegexp("ALL_HTML_TAG"),"");
					this.config.headerContext.push({id:this.config.colModel[i - this.config.plusIdx].name	,name:headerName});
				}
			}
			if(this.config.headerContext.length > 0 && xui.valid.isEmpty(this.headerCtx)){
				var container								= this.element.getElementsByClassName("xhdr");
				var afterShowFn								= function(containerElement){
					var parentNode							= containerElement.firstChild.firstChild;
					var lastNode							= parentNode.lastChild;
					if(lastNode.classList.contains("xui-header-ctx-container")){
						this.ctx.contentsElement			= parentNode.removeChild(lastNode);
					}
					parentNode.innerHTML					= "";
					parentNode.appendChild(this.ctx.contentsElement);
				};
				var beforeHideFn							= function(containerElement){
					this.contentsElement					= containerElement.firstChild.firstChild.removeChild(containerElement.firstChild.firstChild.firstChild);
				}
				var ctx										= new xui.module.context({customClass:"xui-grid-header-context",contents:[{id:this.config.baseId + "_header_ctx"	,html:"<div></div>"	,sort:"0"	,authType:xui.enum.AUTH_TYPE_NONE.getCode()}]	,onAfterShow:afterShowFn	,onBeforeHide:beforeHideFn}, container[container.length-1]).ctx;
				ctx.events.detach("Click");
				ctx.xui_grid								= this.element;
				this.headerCtx								= ctx;
				this.headerCtx.active						= false;
				var docFrag									= document.createDocumentFragment();
				var ul										= document.createElement("ul");
				ul.className								= "xui-header-ctx-container";
				var li, label, input, span;
				for(var i = 0; i < this.config.headerContext.length; i++){
					li										= document.createElement("li");
					li.id									= this.config.baseId + "_" + this.config.headerContext[i].id;
					label									= document.createElement("label");
					label.className							= "xui-checkbox-label";
					label.onclick							= function(e){
						e.cancelBubble						= true;
					};
					input									= document.createElement("input");
					input.type								= "checkbox"
					input.checked							= true;
					input.onclick							= function(e){
						var gridController					= ctx.xui_grid.gridController;
						var grid							= gridController.grid;
						var columnId						= xui.util.replace(this.parentNode.parentNode.id, gridController.config.baseId + "_", "");
						var cellIdx							= gridController.getCellIdx(columnId);
						var row								= grid.hdr.rows[1];
						for(var i = 0; i < row.cells.length; i++){
							var cell						= row.cells[i];
							if(cell._cellIndexS === cellIdx){
								var len						= cell.colSpan || 1;
								for(var j = 0; j < len; j++){
									grid.setColumnHidden(cellIdx*1+j,!this.checked);
								}
							}
						}
					};
					span									= document.createElement("span");
					span.appendChild(document.createTextNode(this.config.headerContext[i].name));
					label.appendChild(input);
					label.appendChild(span);
					li.appendChild(label);
					ul.appendChild(li);
				}
				docFrag.appendChild(ul);
				this.headerCtx.contentsElement				= docFrag;
			}
		},
		_loadCtx : function(){
			//LYH 20211222 행추가 아이콘 미표시로 이름 수정
			if(this.config.enableAddRow)	{this.config.context.push(	{id:"add_row"		,icon:"xfi xfi-ico_0064_row_add"	,text:xui.enum.ADD_ROW.getName()		,sort:"0"	,authType:xui.enum.AUTH_TYPE_CREATE.getCode()});	}
			if(this.config.enableRemoveRow)	{this.config.context.push(	{id:"remove_row"	,icon:"xfi xfi-ico_0065_row_remove"	,text:xui.enum.DELETE_ROW.getName()		,sort:"0"	,authType:xui.enum.AUTH_TYPE_DELETE.getCode()});	}
			if(this.config.enableClipboard)	{
				this.config.context.push(						 		{id:"copy_cell"		,icon:"xfi xfi-ico_0066_cell_copy"	,text:xui.enum.COPY_CELL_CLIPBOARD.getName()	,sort:"0"	,authType:xui.enum.AUTH_TYPE_NONE.getCode()});
				this.config.context.push(						 		{id:"copy_row"		,icon:"xfi xfi-ico_0067_row_copy"	,text:xui.enum.COPY_ROW_CLIPBOARD.getName()	,sort:"0"	,authType:xui.enum.AUTH_TYPE_NONE.getCode()});
			}
			if(this.config.enableExportExcl){this.config.context.push(	{id:"export_excel"	,icon:"xfi xfi-ico_0068_download"	,text:xui.enum.EXCEL_DOWNLOAD.getName()	,sort:"99"	,authType:xui.enum.AUTH_TYPE_OUTPUT.getCode()});	}
			if(this.config.enablePreview)	{this.config.context.push(	{id:"preview"		,icon:"xfi xfi-ico_0073_preview"	,text:xui.enum.PRINT_PREVIEW.getName()	,sort:"99"	,authType:xui.enum.AUTH_TYPE_OUTPUT.getCode()});	}
			if(this.config.enableRefresh)	{this.config.context.push(	{id:"refresh"		,icon:"xfi xfi-ico_0028_refresh"	,text:xui.enum.REFRESH.getName()		,sort:"99"	,authType:xui.enum.AUTH_TYPE_SELECT.getCode()});	}
			if(this.config.context.length > 0){
				for(var i = 0; i < this.config.context.length; i++){
					if(xui.valid.isEmpty(this.config.context[i].sort)){
						this.config.context[i].sort			= i.toString();
					}
				}
				this.config.context							= xuic.__UTIL.quickSort(this.config.context, "sort");
				this.config.context.push(								{id:"close_menu"	,icon:"xfi xfi-ico_0013_close_bold"	,text:xui.enum.CLOSE.getName()			,sort:"99"	,authType:xui.enum.AUTH_TYPE_NONE.getCode()});
				var ctxTargetContainer						= this.element.getElementsByClassName("objbox");
				if(xui.valid.isHTMLCollection(ctxTargetContainer) && ctxTargetContainer.length > 0){
					var ctx									= new xui.module.context({customClass:"xui-grid-context", contents:this.config.context, onBeforeShow:function(element, e){
						if(xui.valid.isElement(this.ctx.xui_grid)){
							return this.ctx.xui_grid.gridController._prevShowCtx(this.targetElement, e);
						}
					}}, ctxTargetContainer[ctxTargetContainer.length-1]).ctx;
					ctx.events.detach("Click");
					ctx.xui_grid							= this.element;
					ctx.events.on("Click", function(id, e){
						if(xui.valid.isElement(this.xui_grid)){
							this.xui_grid.gridController._clickCtxItem(id, e);
						}
					});
					this.config.ctx							= ctx;
				}
			}
		},
		_prevShowCtx : function(element, evt){
			xuic.__COM.closeActiveDirective();
			var isValid										= true;
			var gridConfig									= this.config;
			var grid										= this.grid;
			var ctx											= this.config.ctx;
			var ctxRowId									= null, ctxCellIdx = null, i = 0;
			var target										= element;
			while(target && target.tagName !== "TD"){
				target										= target.parentNode;
			}
			while(target !== null){
				target										= target.previousSibling;
				i++;
			}
			ctxCellIdx										= (i - 1);
			while(element){
				if(!xui.valid.isEmpty(element.idd)){
					ctxRowId								= element.idd;
					break;
				}
				element										= element.parentNode;
			}
			if(ctxRowId === "grid_empty_row"){
				ctxRowId									= null;
				ctxCellIdx									= -1;
			}
			if(xui.valid.isNumber(ctxCellIdx) && ctxCellIdx >= 0 && !xui.valid.isEmpty(ctxRowId)){
				var doCallClickFn							= false;
				var prevRowId								= this.status.prevRowId;
				if(prevRowId !== ctxRowId || (prevRowId === ctxRowId && this.config.alwaysCallClick)){
					doCallClickFn							= true;
				}
				this.selectCell(ctxRowId, ctxCellIdx, false);
				if(doCallClickFn && typeof(this.config.onClickData) === "function"){
					this.config.onClickData.call(this, this.getRowIdx(ctxRowId), ctxRowId, this.getRowData(ctxRowId), ctxCellIdx, this.getCellId(ctxCellIdx), this.getCellData(ctxRowId, ctxCellIdx), true);
				}
			}
			if(typeof(gridConfig.onBeforeContext) === "function"){
				isValid										= gridConfig.onBeforeContext.call(this, this.config.ctx, ctxRowId, ctxCellIdx, this.getRowData(ctxRowId));
				if(xui.valid.isEmpty(isValid)){
					isValid									= true;
				}
			}
			if(isValid){
				this.status.ctxRowId						= ctxRowId;
				this.status.ctxCellIdx						= ctxCellIdx;
				if(gridConfig.enableClipboard){
					if(ctxCellIdx < 0){
						ctx.disable("copy_cell");
						ctx.disable("copy_row");
					}else{
						ctx.enable("copy_cell");
						ctx.enable("copy_row");
					}
				}
				if(gridConfig.enablePreview){
					if(this.getCount() > 0){
						ctx.enable("preview");
					}else{
						ctx.disable("preview");
					}
				}
				if(gridConfig.enableExportExcl){
					if(this.getCount() > 0){
						ctx.enable("export_excel");
					}else{
						ctx.disable("export_excel");
					}
				}
				if(gridConfig.enableRemoveRow){
					if(ctxCellIdx < 0){
						ctx.disable("remove_row");
					}else{
						ctx.enable("remove_row");
					}
				}
			}
			return isValid;
		},
		_clickCtxItem : function(id, evt){
			var gridController								= this;
			var gridConfig									= gridController.config;
			var grid										= gridController.grid;
			var menuList									= null;
			switch(id){
				case "add_row"		:
					gridController.appendRow();
					break;
				case "remove_row"	:
					gridController.removeRow(gridController.status.ctxRowId);
					break;
				case "copy_cell"	:
					if(window.clipboardData){
						window.clipboardData.setData("Text", gridController.getCellData(gridController.getRowId(gridController.status.ctxRowIdx), gridController.status.ctxCellIdx));
					}
					break;
				case "copy_row"		:
					if(window.clipboardData){
						var colModel						= gridConfig.colModel;
						var value							= "";
						for(var i = 0; i < colModel.length; i++){
							value							+= gridController.getCellData(gridController.getRowId(gridController.status.ctxRowIdx), (i + gridConfig.plusIdx)) + ",";
						}
						if(value.length > 0){
							value							= value.substr(0, value.length-1);
						}
						window.clipboardData.setData("Text", value);
					}
					break;
				case "preview"		:
					gridController.previewPrint();
					break;
				case "export_excel"	:
					gridController.exportExcel();
					break;
				case "refresh"		:
					var valid								= false;
					if(typeof(gridConfig.onBeforeGridRefresh) === "function"){
						valid								= gridConfig.onBeforeGridRefresh.call(gridController);
						if(typeof(valid) === "undefined"){
							valid							= false;
						}
					}
					if(valid){
						var requestForm						= gridController._getRequest();
						requestForm._sendRequest();
					}
					break;
				case "close_menu"	:
					gridConfig.ctx._close();
					break;
				default				:
					menuList								= gridConfig.ctx.element.ctxController.menuList;
					if(menuList.hasOwnProperty(id)){
						var clickFn							= menuList[id].onclick;
						if(typeof(clickFn) === "function"){
							clickFn.call(gridConfig.ctx.element.ctxController, gridController.status.ctxRowId, gridController.status.ctxCellIdx);
						}
					}
					break;
			}
		},
		_loadPageBar : function(){
			var pageContainer								= document.createElement("div");
			pageContainer.xui_grid							= this.config.baseId;
			this.config.pageContainer						= pageContainer;
			pageContainer.id								= this.config.baseId + "_PAGING_BAR";
			pageContainer.className							= "xui-grid-pagebar";
			this.element.parentNode.appendChild(pageContainer);
			var pagebarConfig								= {};
			pagebarConfig.countPerPageList					= this.config.rowList;
			pagebarConfig.moveLast							= this.config.pageMoveLast;
			pagebarConfig.customMove						= this.config.pageCustomMove;
			pagebarConfig.changeCount						= this.config.pageChangeCount;
			pagebarConfig.hideMore							= this.config.pageHideMore;
			pagebarConfig.info								= true
			pagebarConfig.viewCount							= this.config.pageViewSize;
			pagebarConfig.align								= this.config.pagebarAlign;
			pagebarConfig.onChange							= this.config.onChangePage;
			new xui.module.pagebar(pagebarConfig, this.config.pageContainer);
		},
		_loadAppendBar : function(){
			var appendContainer								= document.createElement("div");
			appendContainer.xui_grid						= this.config.baseId;
			this.config.appendContainer						= appendContainer;
			appendContainer.id								= this.config.baseId + "_APPEND_BAR";
			appendContainer.className						= "xui-grid-appendbar";
			this.element.parentNode.appendChild(appendContainer);
			var appendbarConfig								= {};
			appendbarConfig.countPerPage					= this.config.rowList[0];
			appendbarConfig.onAppend						= this.config.onAppendData;
			new xui.module.appendbar(appendbarConfig, this.config.appendContainer);
		},
		_loadStatusBar : function(){
			var statusContainer								= document.createElement("div");
			statusContainer.xui_grid						= this.config.baseId;
			this.config.statusContainer						= statusContainer;
			statusContainer.id								= this.config.baseId + "_STATUS_BAR";
			statusContainer.className						= "xui-grid-statusbar";
			this.element.parentNode.appendChild(statusContainer);
			var statusbarConfig								= {};
			statusbarConfig.align							= "right";
			statusbarConfig.items							= [];
			statusbarConfig.items.push({id:"info",	type:"title"});
			new xui.module.toolbar(statusbarConfig, this.config.statusContainer);
		},
		_setCount : function(count){
			var toolbarController							= null;
			if(this.config.paging){
				toolbarController							= this.config.pageContainer.pageController;
			}else if(this.config.scrollAppend){
				toolbarController							= this.config.appendContainer.appendController;
			}
			if(!xui.valid.isEmpty(toolbarController)){
				toolbarController.setCount(count);
			}else{
				this.status.currentCount					= count;
			}
		},
		_setTotalCount : function(totalCount){
			var toolbarController							= null;
			if(this.config.paging){
				toolbarController							= this.config.pageContainer.pageController;
			}else if(this.config.scrollAppend){
				toolbarController							= this.config.appendContainer.appendController;
			}
			if(!xui.valid.isEmpty(toolbarController)){
				toolbarController.setTotalCount(totalCount);
			}else{
				this.status.totalCount						= totalCount;
			}
		},
		_prevClick : function(newRowId, prevRowId, cellIdx){
			xuic.__COM.closeActiveDirective();
			var valid										= true;
			if(newRowId !== "grid_empty_row"){
				if(this.config.editDiv === "R" && !xui.valid.isEmpty(prevRowId) && prevRowId !== 0 && newRowId !== prevRowId){
					this.grid.forEachCell(prevRowId, function(cellObj, idx){
						if(cellObj.isEditCell()){
							cellObj.editStop();
						}
					});
				}
			}else{
				valid										= false;
			}
			return valid;
		},
		_afterClick : function(rowId, cellIdx, doCallFn, context){
			if(this.getCount() > 0){
				var cell									= null;
				if(this.config.editDiv === "R"){
					var colModel							= this.config.colModel;
					for(var i = 0; i < colModel.length; i++){
						cell								= this.grid.cells(rowId, (i + this.config.plusIdx));
						if(cell.isEditCell()){
							if(!cell.isNowEditing()){
								cell.editStart();
							}
							if((i + this.config.plusIdx) === cellIdx){
								cell.focusEditCell();
							}
						}
					}
				}else if(this.config.editDiv === "C"){
					cell									= this.grid.cells(rowId, cellIdx);
					cell.focusEditCell();
				}
				if(this.status.prevRowId !== rowId || (this.status.prevRowId === rowId && this.config.alwaysCallClick)){
					if(xui.valid.isEmpty(doCallFn)){
						doCallFn							= true;
					}
					if(doCallFn && typeof(this.config.onClickData) === "function"){
						if(xui.valid.isEmpty(context)){
							context							= false;
						}
						this.config.onClickData.call(this, this.getRowIdx(rowId), rowId, this.getRowData(rowId), cellIdx, this.getCellId(cellIdx), this.getCellData(rowId, cellIdx), context);
					}
				}
				this.status.prevRowId						= rowId;
			}
		},
		_prevSort : function(columnIdx, columnType, orderby, evt){
			var _this										= this;
			var targetElement								= $(evt.target);
			var colspanSize									= targetElement.closest("td").attr("colspan");
			if(!xui.valid.isEmpty(colspanSize) && colspanSize > 1){
				return;
			}
			this.grid.setSortImgState(true, columnIdx, orderby, _this.config.headerLineSize);
			if(typeof(this.config.onServerSideSort) === "function"){
				var returnObject							= this.config.onServerSideSort.call(this, this.config.colModel[columnIdx - this.config.plusIdx].name, orderby);
				if(!xui.valid.isEmpty(returnObject)){
					if($.isFunction(returnObject.promise)){
						returnObject.then(function(response){
							if(xui.valid.isJson(response) && response.hasOwnProperty("jsonData")){
								var orderedData				= new xui.json(response);
								if(!orderedData.getErrorFlag()){
									_this.unselect();
									_this.loadData(orderedData);
									_this.grid.setSortImgState(true, columnIdx, orderby, _this.config.headerLineSize);
								}else{
									xui.dialog.error(orderedData.getMsg(), xui.enum.SERVERSIDE_SORT_FAILURE.getName());
								}
							}
						}).catch(function(error){
							xui.dialog.error(error, xui.enum.SERVERSIDE_SORT_FAILURE.getName());
						});
					}else{
						if(xui.valid.isXuiJson(returnObject) || xui.valid.isArray(returnObject)){
							_this.loadData(returnObject);
							_this.grid.setSortImgState(true, columnIdx, orderby, _this.config.headerLineSize);
						}
					}
				}else{
					this.grid.sortRows(columnIdx, "_xuigridSort", orderby);
				}
			}else{
				this.grid.sortRows(columnIdx, "_xuigridSort", orderby);
			}
		},
		_onCellMark : function(rowId, cellIdx, evt, doCallFn, context){
			xuic.__COM.closeActiveDirective();
			if(rowId === "grid_empty_row"){
				return false;
			}
			if(evt.target.tagName === "I"){
				evt.target.click();
				return false;
			}
			if(xui.valid.isEmpty(doCallFn)){
				doCallFn									= true;
			}
			if(doCallFn && typeof(this.config.onClickData) !== "undefined"){
				if(xui.valid.isEmpty(context)){
					context									= false;
				}
				this.config.onClickData.call(this, this.getRowIdx(rowId), rowId, this.getRowData(rowId), cellIdx, this.getCellId(cellIdx), this.getCellData(rowId, cellIdx), context);
			}
		},
		_changeSelectState : function(newRowId, prevRowId, evt){
			if(prevRowId != null){
				if(evt.ctrlKey){
					var unselectRowId						= "";
					if(newRowId == null){
						unselectRowId						= prevRowId;
					}else{
						prevRowId							= prevRowId.split(",");
						newRowId							= newRowId.split(",");
						if(newRowId.length < prevRowId.length){
							for(var i = 0; i < prevRowId.length; i++){
								if(newRowId.indexOf(prevRowId[i]) < 0){
									unselectRowId			= prevRowId[i];
									break;
								}
							}
						}
					}
					if(unselectRowId !== ""){
						var colModel						= this.config.colModel;
						var editType						= "";
						var value							= "";
						objGrid.forEachCell(unselectRowId, function(cellObj, idx){
							editType						= "";
							if(idx - this.config.plusIdx >= 0){
								if(!xui.valid.isEmpty(colModel[idx - this.config.plusIdx].edit)){
									editType				= colModel[idx - this.config.plusIdx].edit.type;
									if(!xui.valid.isEmpty(editType) && editType !== "checkbox" && editType !== "radio"){
										cellObj.setValue(cellObj.cell.firstElementChild.value);
										cellObj.cell.firstElementChild.style.display	= "none";
										cellObj.cell.lastElementChild.style.display		= "block";
									}
								}
							}
						});
					}
				}
			}
		},
		_dblClick : function(rowId, cellIdx, evt){
			if(rowId === "grid_empty_row"){
				return false;
			}
			if(evt.target.tagName !== "TD"){
				return false;
			}else{
				if(typeof(this.config.onDblClickData) !== "undefined"){
					this.config.onDblClickData.call(this, this.getRowIdx(rowId), rowId, this.getRowData(rowId), cellIdx, this.getCellId(cellIdx), this.getCellData(rowId, cellIdx));
				}
				return true;
			}
		},
		_check : function(rowId, cellIdx, checked, evt){
			xuic.__COM.closeActiveDirective();
			var config										= this.config;
			var status										= this.status;
			var colName										= this.getCellId(cellIdx);
			if(!status.columnCheckboxStatus.hasOwnProperty(colName)){
				status.columnCheckboxStatus[colName]				= {};
				status.columnCheckboxStatus[colName].checkedCount	= 0;
			}
			var checkCount											= status.columnCheckboxStatus[colName].checkedCount + (checked ? 1 : -1);
			status.columnCheckboxStatus[colName].checkedCount		= checkCount;
			if(xui.valid.isElement(status.columnCheckboxStatus[colName].element)){
				if(checkCount === this.getCount()){
					status.columnCheckboxStatus[colName].element.indeterminate	= false;
					status.columnCheckboxStatus[colName].controller.setData(true);
				}else if(checkCount > 0){
					status.columnCheckboxStatus[colName].controller.setData(false);
					status.columnCheckboxStatus[colName].element.indeterminate	= true;
				}else if(checkCount === 0){
					status.columnCheckboxStatus[colName].element.indeterminate	= false;
					status.columnCheckboxStatus[colName].controller.setData(false);
				}
			}
			if(colName !== xui.enum.GRID_CHECKBOX.getCode()){
				this._afterEdit(rowId, cellIdx, evt, checked);
			}else{
				if(typeof(this.config.onClickRowCheckbox) === "function"){
					this.config.onClickRowCheckbox.call(this, this.getRowIdx(rowId), rowId, this.getRowData(rowId), cellIdx, colName, this.getCellData(rowId, cellIdx));
				}
			}
		},
		_hover : function(rowId, cellIdx, evt){
			this.config.onMouseOver.call(this, rowId, cellIdx);
		},
		_afterEdit : function(rowId, cellIdx, evt, cellValue){
			var dataFlag									= this.grid.getRowAttribute(rowId, "DATA_FLAG");
			var colModel									= this.config.colModel;
			var cell										= null;
			var value										= "";
			var origin										= "";
			var isChanged									= false;
			for(var i = 0; i < colModel.length; i++){
				cell										= this.grid.cells(rowId, (i + this.config.plusIdx));
				if(cell.isEditCell()){
					value									= cell.getValue();
					origin									= cell.getOrigin();
					isChanged								= (!isChanged ? (value != origin) : isChanged);
				}
				if(isChanged){
					break;
				}
			}
			if(dataFlag !== xui.enum.TRANSACTION_INSERT.getCode()){
				if(isChanged){
					this.grid.setRowAttribute(rowId, "DATA_FLAG", xui.enum.TRANSACTION_UPDATE.getCode());
				}else{
					this.grid.setRowAttribute(rowId, "DATA_FLAG", xui.enum.TRANSACTION_NONE.getCode());
				}
			}
			if(typeof(this.config.onChangedEditCell) === "function"){
				if(typeof(cellValue) === "undefined" || cellValue === null){
					cellValue								= this.getCellData(rowId, cellIdx);
				}
				this.config.onChangedEditCell.call(this, evt.target, this.getRowIdx(rowId), rowId, this.getRowData(rowId), cellIdx, this.getCellId(cellIdx), cellValue);
			}
		},
		_scroll : function(left, top){
			if(this.status.scrollTimeout != null){
				clearTimeout(this.status.scrollTimeout);
				this.status.scrollTimeout					= null;
			}
			(function(obj){
				obj.controller.status.scrollTimeout 		= setTimeout(function(){
					var gridController						= obj.controller;
					var gridConfig							= gridController.config;
					if(obj.top >= gridController.grid.objBox.scrollHeight - gridController.grid.objBox.offsetHeight){
						var appendController				= gridConfig.appendContainer.appendController;
						appendController._appendHandler("more");
					}
				}, 300);
			}({controller:this,top:top}));
		},
		_dragStart : function(rowId, evt){
			var blnReturn									= true;
			var moveRowData									= [];
			var prevRowId									= this.getRowId();
			var prevSelectRows								= this.getRowData();
			var blnExist									= false;
			if(prevSelectRows != null){
				if(xui.valid.isJson(prevSelectRows)){
					prevSelectRows							= [prevSelectRows];
				}
				blnExist									= prevRowId.indexOf(rowId) >= 0;
				moveRowData									= prevSelectRows;
			}
			if(!evt.ctrlKey && !blnExist){
				this.unselect();
				this.select(rowId);
			}
			if(!blnExist){
				moveRowData.push(this.getRowData(rowId));
			}
			if(typeof(this.config.onBeforeDragRow) === "function"){
				blnReturn									= this.config.onBeforeDragRow.call(this, moveRowData);
				if(typeof(blnReturn) === "undefined"){
					blnReturn								= false;
				}
			}
			return blnReturn;
		},
		_drag : function(sourceId, targetId, source, target, sourceIdx, targetIdx){
			if(xui.valid.isEmpty(sourceIdx)){
				sourceIdx									= -1;
			}
			var blnReturn									= true;
			var sourceComponentElement						= source.element;
			var targetComponentElement						= target.element;
			var sourceController							= null, targetController = null;
			if(!xui.valid.isEmpty(sourceComponentElement.gridController)){
				sourceController							= sourceComponentElement.gridController;
			}else if(!xui.valid.isEmpty(sourceComponentElement.treeController)){
				sourceController							= sourceComponentElement.treeController;
			}
			if(!xui.valid.isEmpty(targetComponentElement.gridController)){
				targetController							= targetComponentElement.gridController;
			}else if(!xui.valid.isEmpty(targetComponentElement.treeController)){
				targetController							= targetComponentElement.treeController;
			}
			var movedData									= [];
			if(sourceController.config.type === "GRID"){
				movedData									= this.getRowData();
				if(!xui.valid.isJson(movedData)){
					movedData								= [movedData];
				}
				if(movedData.length === 0){
					movedData								= null;
				}
				if(typeof(this.config.onBeforeDropRow) === "function"){
					blnReturn								= this.config.onBeforeDropRow.call(this, movedData, sourceController.config.baseId);
				}
			}else if(sourceController.config.type === "TREE"){
				sourceId									= sourceId.split(",");
				for(var i = 0; i < sourceId.length; i++){
					movedData.push(sourceController.getData(sourceId[i]));
				}
				if(movedData.length === 0){
					movedData								= null;
				}
				if(typeof(this.config.onBeforeDropTreeNode) === "function"){
					blnReturn								= this.config.onBeforeDropTreeNode.call(this, sourceId, movedData, sourceController.config.baseId, targetController.getRowIdx(targetId), targetId, targetController.getRowData(targetId), targetIdx, targetController.getCellId(targetIdx), targetController.getCellData(targetId, targetIdx));
				}
			}
			if(typeof(blnReturn) === "undefined"){
				blnReturn									= true;
			}
			if(blnReturn){
				if(targetController instanceof xui.module.grid){
					if(targetController.isExistRow("grid_empty_row")){
						targetController.init();
					}
				}
			}
			return blnReturn;
		},
		onBeforeDrag: function(rowId){
            this.element.gridController._dragStartIndex =
                this.getRowIndex(rowId);
            return true;
        },
		_drop : function(sourceId, targetId, dropId, source, target, sourceIdx, targetIdx){
		    var startIdx = this._dragStartIndex;
            var endIdx   = this.grid.getRowIndex(targetId); // drop 기준 위치

			if(xui.valid.isEmpty(sourceIdx)){
				sourceIdx									= -1;
			}
			var blnReturn									= true;
			var sourceComponentElement						= source.element;
			var targetComponentElement						= target.element;
			var sourceController							= null, targetController = null;
			if(!xui.valid.isEmpty(sourceComponentElement.gridController)){
				sourceController							= sourceComponentElement.gridController;
			}else if(!xui.valid.isEmpty(sourceComponentElement.treeController)){
				sourceController							= sourceComponentElement.treeController;
			}
			if(!xui.valid.isEmpty(targetComponentElement.gridController)){
				targetController							= targetComponentElement.gridController;
			}else if(!xui.valid.isEmpty(targetComponentElement.treeController)){
				targetController							= targetComponentElement.treeController;
			}
			if(sourceController.config.type === "GRID"){
                var startIdx = this._dragStartIndex;

                // drop 의도 위치 (기본은 targetIdx)
                var dropIdx = (typeof endIdx === "number" && endIdx >= 0) ? endIdx : startIdx;

                if (startIdx === dropIdx) { return false; }// 같은 위치면 종료

                // 전체 rowId 목록 (이 시점이 가장 안정)
                var rowIds = this.grid.getAllRowIds().split(",");

                var moveRowId = sourceId;   // 이동 대상

                // 목표 rowId 계산
                var targetRowId = rowIds[dropIdx];

                if (!targetRowId) { return false; }

                var direction = "sibling";
                if (startIdx < dropIdx) {
                    // 위 → 아래 이동
                    direction                               = "after";
                    this.grid.moveRow(moveRowId,"down",targetRowId,this.grid);
                } else if (startIdx > dropIdx) {
                    // 아래 → 위 이동
                    direction = "sibling"; // 또는 "before" 개념
                    this.grid.moveRow(moveRowId,"up",targetRowId,this.grid);
                }

                // 이동 후 "전체 순서" 재구성
                var finalRowIds = this.grid.getAllRowIds().split(",");
                var movedData = finalRowIds.map(id => this.grid.getRowData(id) );
                if (movedData.length === 0) { movedData     = null; }

                if (typeof this.config.onDropRow === "function") {
                    blnReturn								= this.config.onDropRow.call(this, movedData, sourceController.config.baseId);
                }

                // dhtmlx 기본 Drag 이동 차단 (필수)
                return false;
			}else if(sourceController.config.type === "TREE"){
				sourceId									= sourceId.split(",");
				var sourceNodeData							= null;
				for(var i = 0; i < sourceId.length; i++){
					sourceNodeData							= (sourceController.config.removeAfterDrag ? (sourceController.status.removeNodes.hasOwnProperty(sourceId[i]) ? sourceController.status.removeNodes[sourceId[i]] : null) : sourceController.getData(sourceId[i]));
					movedData.push(sourceNodeData);
				}
				if(movedData.length === 0){
					movedData								= null;
				}
				if(typeof(this.config.onDropTreeNode) === "function"){
					blnReturn								= this.config.onDropTreeNode.call(this, sourceId, movedData, sourceController.config.baseId, targetController.getRowIdx(targetId), targetId, targetController.getRowData(targetId), targetIdx, targetController.getCellId(targetIdx), targetController.getCellData(targetId, targetIdx));
				}
			}
			if(typeof(blnReturn) === "undefined"){
				blnReturn									= true;
			}
			return blnReturn;
		},
		_prevRemove : function(rowId){
			var rowDataFlag									= this.grid.getRowAttribute(rowId, "DATA_FLAG");
			if(xui.valid.isEmpty(rowDataFlag) || rowDataFlag === xui.enum.TRANSACTION_NONE.getCode() || rowDataFlag === xui.enum.TRANSACTION_UPDATE.getCode()){
				var rowData									= this.getRowData(rowId);
				rowData.DATA_FLAG							= xui.enum.TRANSACTION_DELETE.getCode();
				this.status.removeRows[rowId]				= rowData;
			}
		},
		_afterRemove : function(){

		},
		_afterFilter : function(el){
			var filterElement								= null;
			var allChecked									= true;
			for(var i = 0; i < el.length; i++){
				filterElement								= el[i];
				if(!xui.valid.isEmpty(filterElement[0].combo)){
					if(filterElement[0].combo.getChecked().length > 0){
						allChecked							= false;
						break;
					}
				}else{
					if(!xui.valid.isEmpty(filterElement[0].value)){
						allChecked							= false;
						break;
					}
				}
			}
			var toolbarController							= null, ctxController = null;
			if(!xui.valid.isEmpty(this.config.ctx)){
				ctxController								= this.config.ctx.element.ctxController;
			}
			if(this.config.paging){
				toolbarController							= this.config.pageContainer.pageController;
			}else if(this.config.scrollAppend){
				toolbarController							= this.config.appendContainer.appendController;
			}
			if(!allChecked){
				this.status.filtering						= true;
				if(this.config.multiselect && !this.config.multiAllDisabled){
					this.status.columnCheckboxStatus[xui.enum.GRID_CHECKBOX.getCode()].element.disabled	= true;
					this.status.columnCheckboxStatus[xui.enum.GRID_CHECKBOX.getCode()].element.classList.add("xui-disabled");
				}
				if(!xui.valid.isEmpty(toolbarController)){
					toolbarController.disableAll();
				}
				if(this.config.enableExportExcl){
					ctxController.disable("export_excel");
				}
				if(this.config.enablePreview){
					ctxController.disable("preview");
				}
			}else{
				this.status.filtering						= false;
				if(this.config.multiselect && !this.config.multiAllDisabled){
					this.status.columnCheckboxStatus[xui.enum.GRID_CHECKBOX.getCode()].element.disabled	= false;
					this.status.columnCheckboxStatus[xui.enum.GRID_CHECKBOX.getCode()].element.classList.remove("xui-disabled");
				}
				if(!xui.valid.isEmpty(toolbarController)){
					toolbarController.enableAll();
				}
				if(this.config.enableExportExcl){
					ctxController.enable("export_excel");
				}
				if(this.config.enablePreview){
					ctxController.enable("preview");
				}
			}
			if(typeof(this.config.onFilterData) === "function"){
				this.config.onFilterData.call(this);
			}
			if(this.grid.getRowsNum() === 1 && this.config.editDiv === ""){
				this.grid.selectRow(0, true);
			}else{
				this.unselect();
			}
		},
		_outerClick : function(evt){
			xuic.__COM.closeActiveDirective();
			/*우클릭일 시*/
			if(evt.button == 2){
				this.status.ctxRowIdx						= null;
				this.status.ctxCellIdx						= null;
				if(evt.target.classList.contains("objbox")){
					if(!xui.valid.isEmpty(this.config.ctx)){
						var ctxController					= this.config.ctx.element.ctxController;
						if(this.config.enableClipboard){
							ctxController.disable("copy_cell");
							ctxController.disable("copy_row");
						}
						if(this.config.rowCount == 0){
							if(this.config.enableExportExcl){
								ctxController.disable("export_excel");
							}
							if(this.config.enablePreview){
								ctxController.disable("preview");
							}
							if(typeof(this.config.onBeforeGridRefresh) === "function"){
								ctxController.disable("refresh");
							}
						}else{
							if(this.config.enablePreview){
								ctxController.enable("preview");
							}
							if(this.config.enableExportExcl){
								ctxController.enable("export_excel");
							}
							if(typeof(this.config.onBeforeGridRefresh) === "function"){
								ctxController.enable("refresh");
							}
						}
						if(this.config.enableRemoveRow){
							ctxController.disable("remove_row");
						}
					}
				}
			}
			return true;
		},
		_afterMoveColumn : function(columnIdx, cellIdx){
			var colModel									= this.config.colModel;
			var colNames									= this.config.colNames;
			var newColModel									= [];
			var newColNames									= [];
			var plusIdx										= this.config.plusIdx;
			if(xui.valid.isArray(colNames[0])){
				colNames									= colNames[colNames.length-1];
			}
			/*이전으로 움직일 때*/
			if(columnIdx > cellIdx){
				for(var i = 0; i < (cellIdx - plusIdx); i++){
					newColModel.push(colModel[i]);
					newColNames.push(colNames[i]);
				}
				newColModel.push(colModel[columnIdx-plusIdx]);
				newColNames.push(colNames[columnIdx-plusIdx]);
				for(var j = newColModel.length-1; j < colModel.length; j++){
					if(j != columnIdx-plusIdx){
						newColModel.push(colModel[j]);
						newColNames.push(colNames[j]);
					}
				}
			/*이후로 움직일 때*/
			}else if(columnIdx < cellIdx){
				for(var i = 0; i <= cellIdx-plusIdx; i++){
					if(i != columnIdx-plusIdx){
						newColModel.push(colModel[i]);
						newColNames.push(colNames[i]);
					}
				}
				newColModel.push(colModel[columnIdx-plusIdx]);
				newColNames.push(colNames[columnIdx-plusIdx]);
				for(var j = newColNames.length; j < colModel.length; j++){
					newColModel.push(colModel[j]);
					newColNames.push(colNames[j]);
				}
			}
			this.config.colModel												= newColModel;
			this.config.colNames[this.config.colNames.length - 1]				= newColNames;
			this.config.originColNames[this.config.originColNames.length - 1]	= newColNames;
		},
		_visibleColumn : function(columnIdx, visible){
			var serialize									= "";
			var colModel									= this.config.colModel, plusIdx = this.config.plusIdx;
			this.config.colModel[columnIdx - plusIdx].hidden	= !visible;
			for(var i = 0; i < colModel.length; i++){
				if(!xui.valid.isEmpty(colModel[i].excel)){
					serialize								+= (colModel[i].excel.toString() + ",");
				}else{
					if(xui.valid.isEmpty(colModel[i].hidden)){
						this.config.colModel[i].hidden		= false;
					}
					serialize								+= (this.config.colModel[i].hidden).toString() + ",";
				}
			}
			serialize										= (this.config.rownumbers ? "true," : "") + (this.config.multiselect ? "false," : "") + serialize.substr(0, serialize.length-1);
			this.grid.setSerializableColumns(serialize);
		},
		_prevBlockSelect : function(rowId, cellIdx){
			var blnReturn									= true;
			if(typeof(this.config.onBeforeDragBlock) === "function"){
				blnReturn									= this.config.onBeforeDragBlock.call(this, rowId, cellIdx);
				if(typeof(blnReturn) === "undefined"){
					blnReturn								= false;
				}
			}
			return blnReturn;
		},
		_blockSelect : function(evt){
			var blocked										= this.grid.getSelectedBlock();
			var rowLen										= blocked.RightBottomRow - blocked.LeftTopRow + 1;
			var cellLen										= blocked.RightBottomCol - blocked.LeftTopCol + 1;
			if(!this.config.cellClick){
				this.grid._HideSelection();
				this.unselect();
				for(var i = 0; i < rowLen; i++){
					this.grid.selectRow(blocked.LeftTopRow + i, false, true);
				}
			}else{
				this.grid._HideSelection();
				if(!evt.ctrlKey){
					this.grid.unmarkAll();
				}
				for(var i = 0; i < rowLen; i++){
					for(var j = 0; j < cellLen; j++){
						this.grid.mark(this.grid.getRowId(blocked.LeftTopRow + i), blocked.LeftTopCol + j, true);
					}
				}
			}
			if(typeof(this.config.onDragBlocked) === "function"){
				this.config.onDragBlocked.call(this, blocked.LeftTopRow, blocked.RightBottomRow, blocked.LeftTopCol, blocked.RightBottomCol);
			}
		},
		_resize : function(){
			this.grid.callEvent("onSetSizes", []);
		},
		_parseData : function(data){
			var count										= parseInt(data.HEADER.COUNT, 10);
			var totalCount									= parseInt(data.HEADER.TOT_COUNT, 10);
			var pageNumber									= parseInt(data.HEADER.PAGE_NO, 10);
			var dataTypeList								= "";
			var dataAlignList								= "";
			if(count === 0){
				this.init();
				if(this.config.freezeColumnIdx === -1){
					var visibleIdx							= 0;
					for(var i = 0; i < this.config.colModel.length; i++){
						dataTypeList						+= "ro,";
						dataAlignList						+= "center,";
						if(!this.config.colModel[i].hidden){
							visibleIdx++;
						}
					}
					dataTypeList							= (this.config.rownumbers ? "ro," : "") + (this.config.multiselect ? "ro," : "") + dataTypeList.substr(0, dataTypeList.length-1);
					dataAlignList							= (this.config.rownumbers ? "center," : "") + (this.config.multiselect ? "center," : "") + dataAlignList.substr(0, dataAlignList.length-1);
					this.grid.setColAlign(dataAlignList);
					this.grid.setColTypes(dataTypeList);
					this.grid.addRow("grid_empty_row", this.config.emptyrecords);
					this.grid.setColspan("grid_empty_row", 0, visibleIdx + this.config.plusIdx);
					this.grid.enableRowsHover(false);
					if(this.config.smartRender){
						this.grid._update_xtrm_srnd_view();
					}
				}
				if(typeof(this.config.onLoadData) === "function"){
					if(this.config.paging || this.config.scrollAppend){
						this.config.onLoadData.call(this, count, totalCount, 1);
					}else{
						this.config.onLoadData.call(this, count, totalCount, null);
					}
				}
				if(this.config.statusBar){
					var toolbarController = null;
					if(!xui.valid.isEmpty(this.config.statusContainer) && !xui.valid.isEmpty(this.config.statusContainer.toolbarController)){
						toolbarController = this.config.statusContainer.toolbarController;
						toolbarController.setValue("info", count + this.config.statusMsg);
					}
				}
				data.DATA = [];
				this.grid.parse(data, "xtrmJson");
				return;
			}else{
				/*데이터가 100건 초과 시 스마트 렌더링 기능 적용.*/
				/* 20210203
				 * 명시적 옵션 해제했어도 데이터 개수가 100건이 넘어갈 시 강제 smartRendering 변경 기능 임시 제거
				if(!this.config.smartRender && count > 100){
					this.grid.enableSmartRendering(true);
					this.config.smartRender					= true;
				}
				*/
				this.init(false);
				for(var i = 0; i < this.config.colModel.length; i++){
					dataTypeList							+= (!xui.valid.isEmpty(this.config.colModel[i].dtype) ? this.config.colModel[i].dtype + "," : "xuicell,");
					dataAlignList							+= (!xui.valid.isEmpty(this.config.colModel[i].align) ? this.config.colModel[i].align + "," : "center,");
				}
				dataTypeList								= (this.config.rownumbers ? "xuicell_rownum," : "") + (this.config.multiselect ? "xuicell_checkbox," : "") + dataTypeList.substr(0, dataTypeList.length-1);
				dataAlignList								= (this.config.rownumbers ? "center," : "") + (this.config.multiselect ? "center," : "") + dataAlignList.substr(0, dataAlignList.length-1);
				this.grid.setColTypes(dataTypeList);
				this.grid.setColAlign(dataAlignList);
				/*this.grid.enableRowsHover(this.config.hover, this.config.hoverClass);*/
			}
			this.grid.parse(data, "xtrmJson");
			var toolbarController							= null, colModel = this.config.colModel;
			if(this.config.paging){
				toolbarController							= this.config.pageContainer.pageController;
				toolbarController.setPage(pageNumber, count, totalCount, toolbarController.getCountPerPage(), false);
			}else if(this.config.statusBar){
				toolbarController							= this.config.statusContainer.toolbarController;
				toolbarController.setValue("info", count + this.config.statusMsg);
			}else{
				this.status.currentCount					= count;
				this.status.totalCount						= totalCount;
				this.status.pageNumber						= pageNumber;
			}
			this.status.currentCount						= count;
			this.status.totalCount							= totalCount;
			this.status.pageNumber							= pageNumber;
			this.status.lastPageNumber						= (totalCount%this.status.countPerPage > 0 ? (parseInt((totalCount/this.status.countPerPage).toFixed()) + 1) : parseInt((totalCount/this.status.countPerPage).toFixed()));
			if(typeof(this.config.onLoadData) === "function"){
				if(this.config.paging || this.config.scrollAppend){
					this.config.onLoadData.call(this, count, totalCount, pageNumber);
				}else{
					this.config.onLoadData.call(this, count, totalCount, null);
				}
			}
			this._resize();
		},
		_parseDataAppend : function(data){
			var count										= parseInt(data.HEADER.COUNT, 10);
			var totalCount									= parseInt(data.HEADER.TOT_COUNT, 10);
			var pageNumber									= parseInt(data.HEADER.PAGE_NO, 10);
			var dataTypeList								= "";
			var toolbarController							= this.config.appendContainer.appendController, colModel = this.config.colModel;
			if(count === 0){
				this.init();
				if(this.config.freezeColumnIdx === -1){
					var visibleIdx							= 0;
					for(var i = 0; i < this.config.colModel.length; i++){
						dataTypeList						+= "ro,";
						if(!this.config.colModel[i].hidden){
							visibleIdx++;
						}
					}
					dataTypeList							= (this.config.rownumbers ? "ro," : "") + (this.config.multiselect ? "ro," : "") + dataTypeList.substr(0, dataTypeList.length-1);
					this.grid.setColTypes(dataTypeList);
					this.grid.addRow("grid_empty_row", this.config.emptyrecords);
					this.grid.setColspan("grid_empty_row", 0, visibleIdx + this.config.plusIdx);
					this.grid.enableRowsHover(false);
					if(this.config.smartRender){
						this.grid._update_xtrm_srnd_view();
					}
				}
				if(typeof(this.config.onLoadData) === "function"){
					this.config.onLoadData.call(this, count, totalCount, 1);
				}
				return;
			}else{
				this.grid.parse(data, "xtrmJson");
				toolbarController.setPage(pageNumber, count, totalCount, false);
				this.status.currentCount					= count;
				this.status.totalCount						= totalCount;
				this.status.pageNumber						= pageNumber;
				this.status.lastPageNumber					= (totalCount%this.status.countPerPage > 0 ? (parseInt((totalCount/this.status.countPerPage).toFixed()) + 1) : parseInt((totalCount/this.status.countPerPage).toFixed()));
				/*1개 row 높이만큼 스크롤 다운*/
				if(pageNumber > 1){
					this.grid.objBox.scrollTop				= parseInt(this.grid.objBox.scrollTop) + parseInt(this.config.rowHeight);
					if(this.config.freezeColumnIdx >= 0){
						this.grid._fake.objBox.scrollTop	= this.grid.objBox.scrollTop;
					}
				}
				if(typeof(this.config.onLoadData) === "function"){
					this.config.onLoadData.call(this, toolbarController.getCount(), totalCount, pageNumber);
				}
			}
		},
		_setRequest : function(request){
			this.status.request								= request;
		},
		_getRequest : function(){
			return this.status.request;
		},
		_getGridConfigData : function(){
			var columnInfo									= {};
			var gridWidth									= this.grid.objBox.offsetWidth;
			var colModel									= this.config.colModel;
			var colNames									= this.config.originColNames;
			var columnData									= [];
			var headerName									= "";
			var hidden										= null;
			var excel										= null;
			for(var i = 0; i < colModel.length; i++){
				hidden										= colModel[i].hidden;
				if(xui.valid.isEmpty(hidden)){
					hidden									= false;
				}
				excel										= colModel[i].excel;
				if(xui.valid.isEmpty(excel)){
					excel									= (hidden ? false : true);
				}
				columnData.push({name:colModel[i].name	,width:(this.config.ratio ? ((gridWidth*colModel[i].width)/100).toFixed() : colModel[i].width)	,align:(xui.valid.isEmpty(colModel[i].align) ? "center" : colModel[i].align)	,format:(xui.valid.isEmpty(colModel[i].format) ? "" : colModel[i].format)	,hidden:hidden	,excel:excel	,freezeColumn:(i > 0 && i === this.config.freezeColumnIdx)});
			}
			for(var i = 0; i < colNames.length; i++){
				for(var j = 0; j < colNames[i].length; j++){
					headerName								+= (xui.util.replace(xui.util.replace(colNames[i][j], "<br/>", "\n"), "<BR/>", "\n").replace(xuic.__REGEXP.getCmmnRegexp("ALL_HTML_TAG"), "") + ",");
				}
				headerName									= (headerName.substring(0,headerName.length - 1) + "||");
			}
			headerName										= headerName.substring(0, headerName.length - 2);
			columnInfo["COL_NAMES"]							= headerName;
			columnInfo["COL_MODEL"]							= columnData;
			if(this.config.enableStatistics){
				var footerInfo								= [];
				var footerArray								= this.config.statistics.footer;
				var colspan									= 1;
				for(var i = 0; i < footerArray.length; i++){
					colspan									= footerArray[i].colspan;
					if(i === 0){
						colspan								= colspan - this.config.plusIdx;
					}
					if(colModel[i].excel === true || !colModel[i].hidden){
						if(footerInfo.length === 0){
							colspan							= colspan + 1;
						}
						footerInfo.push(colspan);
					}
				}
				columnInfo["FOOTER_COLSPAN_INFO"]			= footerInfo;
			}
			return columnInfo;
		},
		_getStatisticsData : function(data){
			var returnData									= data;
			if(xui.valid.isArray(data) && data.length > 0){
				var accumulateCalcData						= {};
				var groupby									= this.config.statistics.group;
				var groupSize								= 0;
				var calcTarget								= this.config.statistics.target;
				var calcTargetSize							= calcTarget.length;
				var dataSize								= data.length - 1;
				var reducer									= null;
				var groupKeyList							= [];
				var targetKeyList							= [];
				var targetTypeList							= [];
				var totalCalcData							= {};

				accumulateCalcData["total"]					= {};
				accumulateCalcData["total"]["SUM"]			= {};
				accumulateCalcData["total"]["MIN"]			= {};
				accumulateCalcData["total"]["MAX"]			= {};
				accumulateCalcData["total"]["AVG"]			= {};
				accumulateCalcData["total"]["COUNT"]		= {};
				for(var i = 0; i < calcTargetSize; i++){
					targetKeyList.push(calcTarget[i].name);
					targetTypeList.push(calcTarget[i].type);
					for(var keyName in accumulateCalcData["total"]){
						accumulateCalcData["total"][keyName][calcTarget[i].name]				= 0;
					}
				}
				if(xui.valid.isArray(groupby) && groupby.length > 0){
					groupSize								= groupby.length;
					data									= xuic.__UTIL.multipleFieldSort(data, groupby);
					for(var i = 0; i < groupSize; i++){
						groupKeyList.unshift(groupby[i].name);
						accumulateCalcData[groupby[i].name]	= {};
						for(var j = 0; j < groupSize; j++){
							if(j <= i){
								accumulateCalcData[groupby[i].name][groupby[j].name]			= "";
							}
							for(var k = 0; k < calcTargetSize; k++){
								accumulateCalcData[groupby[i].name][calcTarget[k].name]			= 0;
								if(k === calcTargetSize - 1){
									accumulateCalcData[groupby[i].name]["count"]				= 0;
								}
							}
						}
					}
					var reducer								= function(accumulator, value, index, array){
						var keyName							= "";
						var detailKeyName					= "";
						var calcType						= "";
						var partCalc						= false;
						if(index === 0){
							for(var i = 0; i < groupSize; i++){
								keyName						= groupKeyList[i];
								for(var detail in accumulateCalcData[keyName]){
									if(detail !== "count"){
										accumulateCalcData[keyName][detail]						= value[detail];
									}else{
										accumulateCalcData[keyName][detail]						= 1;
									}
								}
							}
							for(var i = 0; i < calcTargetSize; i++){
								for(var type in accumulateCalcData["total"]){
									switch(type){
										case "SUM"		:
										case "MIN"		:
										case "MAX"		:
											accumulateCalcData["total"][type][targetKeyList[i]]	= value[targetKeyList[i]];
											break;
										case "COUNT"	:
											accumulateCalcData["total"][type][targetKeyList[i]]	= 1;
											break;
									}
								}
								accumulateCalcData["total"]["AVG"][targetKeyList[i]]			= accumulateCalcData["total"]["SUM"][targetKeyList[i]] / accumulateCalcData["total"]["COUNT"][targetKeyList[i]];
							}
						}else{
							for(var i = 0; i < groupSize; i++){
								keyName						= groupKeyList[i];
								partCalc					= false;
								for(var j = 0; j < groupSize; j++){
									if(j >= i){
										if(accumulateCalcData[keyName][groupKeyList[j]] !== value[groupKeyList[j]]){
											partCalc											= true;
											accumulateCalcData[keyName][keyName]				= accumulateCalcData[keyName][keyName] + "(소계)";
											accumulateCalcData[keyName]["ROW_DIV"]				= "SUMMARY";
											for(var k = 0; k < calcTargetSize; k++){
												if(targetTypeList[k] === "AVG"){
													accumulateCalcData[keyName][targetKeyList[k]]	= accumulateCalcData[keyName][targetKeyList[k]] / accumulateCalcData[keyName]["count"];
												}
											}
											accumulator.push(xui.util.copyObject({},accumulateCalcData[keyName]));
											for(var detail in accumulateCalcData[keyName]){
												if(detail !== "count"){
													accumulateCalcData[keyName][detail]			= value[detail];
												}else{
													accumulateCalcData[keyName][detail]			= 1;
												}
											}
											break;
										}
									}
								}
								if(!partCalc){
									/*누적*/
									accumulateCalcData[keyName]["count"]						= accumulateCalcData[keyName]["count"] + 1;
									for(var j = 0; j < calcTargetSize; j++){
										detailKeyName		= targetKeyList[j];
										calcType			= targetTypeList[j];
										if(!xui.valid.isEmpty(value[detailKeyName])){
											switch(calcType){
												case "SUM"		:
												case "AVG"		:
													accumulateCalcData[keyName][detailKeyName]	= !isNaN(value[detailKeyName]) ? accumulateCalcData[keyName][detailKeyName] + parseFloat(value[detailKeyName]) : accumulateCalcData[keyName][detailKeyName];
													break;
												case "MIN"		:
													accumulateCalcData[keyName][detailKeyName]	= !isNaN(value[detailKeyName]) ? (accumulateCalcData[keyName][detailKeyName] > parseFloat(value[detailKeyName]) ? parseFloat(value[detailKeyName]) : accumulateCalcData[keyName][detailKeyName]) : accumulateCalcData[keyName][detailKeyName];
													break;
												case "MAX"		:
													accumulateCalcData[keyName][detailKeyName]	= !isNaN(value[detailKeyName]) ? (accumulateCalcData[keyName][detailKeyName] < parseFloat(value[detailKeyName]) ? parseFloat(value[detailKeyName]) : accumulateCalcData[keyName][detailKeyName]) : accumulateCalcData[keyName][detailKeyName];
													break;
											}
										}
									}
								}
							}
							for(var i = 0; i < calcTargetSize; i++){
								for(var type in accumulateCalcData["total"]){
									switch(type){
										case "SUM"		:
											accumulateCalcData["total"][type][targetKeyList[i]]	= accumulateCalcData["total"][type][targetKeyList[i]] + value[targetKeyList[i]];
											break;
										case "MIN"		:
											accumulateCalcData["total"][type][targetKeyList[i]]	= accumulateCalcData["total"][type][targetKeyList[i]] > value[targetKeyList[i]] ? value[targetKeyList[i]] : accumulateCalcData["total"][type][targetKeyList[i]];
											break;
										case "MAX"		:
											accumulateCalcData["total"][type][targetKeyList[i]]	= accumulateCalcData["total"][type][targetKeyList[i]] < value[targetKeyList[i]] ? value[targetKeyList[i]] : accumulateCalcData["total"][type][targetKeyList[i]];
											break;
										case "COUNT"	:
											accumulateCalcData["total"][type][targetKeyList[i]]	= accumulateCalcData["total"][type][targetKeyList[i]] + 1;
											break;
									}
								}
								accumulateCalcData["total"]["AVG"][targetKeyList[i]]			= accumulateCalcData["total"]["SUM"][targetKeyList[i]] / accumulateCalcData["total"]["COUNT"][targetKeyList[i]];
							}
						}
						accumulator.push(value);
						return accumulator;
					};
					returnData								= data.reduce(reducer, []);
					for(var i = 0; i < groupSize; i++){
						keyName								= groupKeyList[i];
						accumulateCalcData[keyName][keyName]									= accumulateCalcData[keyName][keyName] + "(소계)";
						accumulateCalcData[keyName]["ROW_DIV"]									= "SUMMARY";
						for(var k = 0; k < calcTargetSize; k++){
							if(targetTypeList[k] === "AVG"){
								accumulateCalcData[keyName][targetKeyList[k]]					= accumulateCalcData[keyName][targetKeyList[k]] / accumulateCalcData[keyName]["count"];
							}
						}
						returnData.push(xui.util.copyObject({},accumulateCalcData[keyName]));
					}
				}else{
					var reducer								= function(accumulator, value, index, array){
						if(index === 0){
							for(var i = 0; i < calcTargetSize; i++){
								for(var type in accumulateCalcData["total"]){
									switch(type){
										case "SUM"		:
										case "MIN"		:
										case "MAX"		:
											accumulateCalcData["total"][type][targetKeyList[i]]	= value[targetKeyList[i]];
											break;
										case "COUNT"	:
											accumulateCalcData["total"][type][targetKeyList[i]]	= 1;
											break;
									}
								}
								accumulateCalcData["total"]["AVG"][targetKeyList[i]]			= accumulateCalcData["total"]["SUM"][targetKeyList[i]] / accumulateCalcData["total"]["COUNT"][targetKeyList[i]];
							}
						}else{
							for(var i = 0; i < calcTargetSize; i++){
								for(var type in accumulateCalcData["total"]){
									switch(type){
										case "SUM"		:
											accumulateCalcData["total"][type][targetKeyList[i]]	= accumulateCalcData["total"][type][targetKeyList[i]] + value[targetKeyList[i]];
											break;
										case "MIN"		:
											accumulateCalcData["total"][type][targetKeyList[i]]	= accumulateCalcData["total"][type][targetKeyList[i]] > value[targetKeyList[i]] ? value[targetKeyList[i]] : accumulateCalcData["total"][type][targetKeyList[i]];
											break;
										case "MAX"		:
											accumulateCalcData["total"][type][targetKeyList[i]]	= accumulateCalcData["total"][type][targetKeyList[i]] < value[targetKeyList[i]] ? value[targetKeyList[i]] : accumulateCalcData["total"][type][targetKeyList[i]];
											break;
										case "COUNT"	:
											accumulateCalcData["total"][type][targetKeyList[i]]	= accumulateCalcData["total"][type][targetKeyList[i]] + 1;
											break;
									}
								}
								accumulateCalcData["total"]["AVG"][targetKeyList[i]]			= accumulateCalcData["total"]["SUM"][targetKeyList[i]] / accumulateCalcData["total"]["COUNT"][targetKeyList[i]];
							}
						}
						accumulator.push(value);
						return accumulator;
					}
					returnData								= data.reduce(reducer, []);
				}
				var totalCalcTargetKey						= null;
				var totalCalcType							= null;
				for(var i = 0; i < calcTargetSize; i++){
					totalCalcTargetKey						= targetKeyList[i];
					totalCalcType							= targetTypeList[i];
					totalCalcData[totalCalcTargetKey]		= accumulateCalcData["total"][totalCalcType][totalCalcTargetKey];
				}
				returnData.push(totalCalcData);
			}
			return returnData;
		}
	};

	xui.module.pagebar	= function(config, element){
		element					= xuic.__DOM.getElement(element);
		element.pageController	= this;
		this.element			= element;
		this.config				= config;
		this.pagebar			= this._loadPageItem();
		this.active				= false;
	};
	xui.module.pagebar.prototype	= {
		init : function(completely){
			if(completely){
				var _s										= this.status.begin, _e = this.status.end;
				for(var i = _s; i <= _e; i++){
					this.pagebar.data.remove(i);
				}
				this.pagebar.data.add({id:"1",type:"navItem",value:1,icon:"",hidden:false,disabled:true,group:"pageNumber",twoState:true,active:false}, 4);
				this.status.begin							= 1;
				this.status.end								= 1;
				this.status.pageNumber						= 1;
				this.status.currentCount					= 0;
				this.status.totalCount						= 0;
				this.status.lastPageNumber					= 1;
				this.pagebar.disable(["first","prev","moreprev","morenext","next","last","countPerPage","go"]);
				this.pagebar.data.update("info", {value:"0 to 0, total : 0"});
				if(!this.config.moveLast){
					this.pagebar.hide(["first","last"]);
				}
				if(this.status.lastPageNumber <= this.config.viewCount || this.config.hideMore){
					this.pagebar.hide(["moreprev","morenext"]);
				}
				if(!this.config.changeCount){
					this.pagebar.hide("countPerPage");
				}
				if(!this.config.customMove){
					this.pagebar.hide(["go"]);
				}
				if(!this.config.info){
					this.pagebar.hide("info");
				}
				this.active									= false;
			}else{
				this.status.pageNumber						= 1;
				this.status.currentCount					= 0;
				this.status.totalCount						= 0;
				this.status.lastPageNumber					= 1;
			}
		},
		getPage : function(){
			return this.status.pageNumber;
		},
		getLastPage : function(){
			return this.status.lastPageNumber;
		},
		getCountPerPage : function(){
			return this.status.countPerPage;
		},
		getDuration : function(){
			return {begin:this.status.begin,end:this.status.end};
		},
		setCount : function(count){
			this.setPage(this.status.pageNumber, count, this.status.totalCount, this.status.countPerPage);
		},
		getCount : function(){
			return this.status.currentCount;
		},
		setTotalCount : function(totalCount){
			this.setPage(this.status.pageNumber, this.status.currentCount, totalCount, this.status.countPerPage);
		},
		getTotalCount : function(){
			return this.status.totalCount;
		},
		isActive : function(){
			return this.active;
		},
		setPage : function(pageNumber, count, totalCount, countPerPage, doCallFn, itemId){
			if(pageNumber <= 0){return;}
			if(xui.valid.isEmpty(countPerPage)){
				countPerPage								= this.status.countPerPage;
			}
			this.status.currentCount						= count;
			this.status.totalCount							= totalCount;
			this.status.lastPageNumber						= Math.ceil(totalCount/countPerPage);
			if(this.status.lastPageNumber <= 0){
				this.status.lastPageNumber					= 1;
			}
			var pagebar										= this.pagebar;
			var lastPageNumber								= this.getLastPage();
			var state										= pagebar.getState();
			var status										= this.getDuration(), _s = status.begin, _e = status.end, draw = false;
			var redrawStatus								= {};
			if(!xui.valid.isEmpty(itemId)){
				switch(itemId){
					case "first"	:
						if(_s !== pageNumber){
							draw							= true;
							redrawStatus.begin				= 1;
						}
						break;
					case "prev"		:
						if(_s > pageNumber){
							draw							= true;
							redrawStatus.begin				= pageNumber;
						}
						break;
					case "next"		:
						if(_e < pageNumber){
							draw							= true;
							redrawStatus.begin				= pageNumber - (this.config.viewCount-1);
						}
						break;
					case "last"		:
						if(_e !== pageNumber){
							draw							= true;
							redrawStatus.begin				= lastPageNumber - (this.config.viewCount-1);
						}
						break;
					case "moreprev"	:
						draw								= true;
						if(pageNumber + this.config.viewCount <= lastPageNumber){
							redrawStatus.begin				= pageNumber;
						}else{
							redrawStatus.begin				= lastPageNumber - this.config.viewCount;
						}
						break;
					case "morenext"	:
						draw								= true;
						redrawStatus.begin					= pageNumber - (this.config.viewCount-1);
						break;
					case "go"		:
						if(pageNumber < _s || pageNumber > _e){
							draw							= true;
							if(pageNumber + parseInt(((this.config.viewCount-1)/2).toFixed(0)) > lastPageNumber){
								redrawStatus.begin			= lastPageNumber - (this.config.viewCount-1);
							}else{
								redrawStatus.begin			= pageNumber - parseInt(((this.config.viewCount-1)/2).toFixed(0));
							}
						}
						break;
					case "goButton"	:
						break;
					default			:
						if(xui.valid.isNumber(itemId)){
							this.status.pageNumber			= pageNumber;
						}else{
							if(this.status.countPerPage !== countPerPage){
								draw						= true;
								redrawStatus.begin			= 1;
								this.status.countPerPage	= countPerPage;
							}
						}
						break;
				};
			}else{
				this.enableAll();
				draw										= true;
				if(!this.active){
					redrawStatus.begin						= pageNumber;
				}else{
					redrawStatus.begin						= this.status.begin;
				}
			}
			if(draw){
				if(redrawStatus.begin < 1){
					redrawStatus.begin						= 1;
				}else if(redrawStatus.begin > lastPageNumber){
					redrawStatus.begin						= lastPageNumber - (this.config.viewCount-1);
					if(redrawStatus.begin < 1){
						redrawStatus.begin					= 1;
					}
				}
				redrawStatus.end							= redrawStatus.begin + (this.config.viewCount-1);
				if(redrawStatus.end > lastPageNumber){
					redrawStatus.end						= lastPageNumber;
				}
				redrawStatus.pageNumber						= pageNumber;
				var addData									= null;
				for(var i = _s; i <= _e; i++){
					pagebar.data.remove(i);
				}
				for(var i = redrawStatus.end; i >= redrawStatus.begin; i--){
					addData									= {id:i.toString(),type:"navItem",value:i,icon:"",hidden:false,disabled:false,group:"pageNumber",twoState:true,active:false};
					if(i === redrawStatus.pageNumber){
						addData.active						= true;
					}
					pagebar.data.add(addData, this.config.align === "left" ? 3 : 4);
				}
				this.status.begin							= redrawStatus.begin;
				this.status.end								= redrawStatus.end;
			}
			this.status.pageNumber							= pageNumber;
			this.status.countPerPage						= countPerPage;
			this.status.lastPageNumber						= lastPageNumber;
			if(this.status.lastPageNumber > this.config.viewCount){
				if(this.status.begin > 1 && !this.config.hideMore){
					pagebar.show("moreprev");
				}else{
					pagebar.hide("moreprev");
				}
				if(this.status.end < lastPageNumber && !this.config.hideMore){
					pagebar.show("morenext");
				}else{
					pagebar.hide("morenext");
				}
			}else{
				pagebar.hide(["moreprev","morenext"]);
			}
			if(this.status.pageNumber === 1){
				pagebar.disable(["first","prev"]);
			}else{
				pagebar.enable(["first","prev"]);
			}
			if(this.status.pageNumber === this.status.lastPageNumber){
				pagebar.disable(["last","next"]);
			}else{
				pagebar.enable(["last","next"]);
			}
			if(this.status.currentCount > 0){
				if(xui.valid.isEmpty(itemId)){
					this.status.from						= ((pageNumber-1)*this.status.countPerPage+1);
					this.status.to							= this.status.from + this.status.currentCount - 1;
					this.status.from						= xui.format.number.getData(this.status.from);
					this.status.to							= xui.format.number.getData(this.status.to);
				}
				pagebar.data.update("info", {value:"TOTAL : " + this.status.to + " / " + xui.format.number.getData(this.status.totalCount)});
			}else{
				this.status.from							= 0;
				this.status.to								= 0;
				pagebar.data.update("info", {value:"TOTAL : 0 / " + xui.format.number.getData(this.status.totalCount)});
			}
			if(!xui.valid.isEmpty(itemId)){
				state.go									= "";
				state.pageNumber							= this.status.pageNumber;
				state.countPerPage							= this.status.countPerPage;
				pagebar.setState(state);
			}
			if(doCallFn && typeof(this.config.onChange) === "function"){
				this.config.onChange.call(this, this.status.pageNumber, this.status.countPerPage);
			}
			this.active										= true;
		},
		disable : function(id){
			this.pagebar.disable(id);
		},
		enable : function(id){
			this.pagebar.enable(id);
		},
		disableAll : function(){
			var itemList									= ["first","prev","moreprev","morenext","next","last","go","goButton"];
			for(var i = this.status.begin; i <= this.status.end; i++){
				itemList.push(i.toString());
			}
			this.pagebar.disable(itemList);
		},
		enableAll : function(){
			var itemList									= ["first","prev","moreprev","morenext","next","last","countPerPage","go","goButton"];
			for(var i = this.status.begin; i <= this.status.end; i++){
				itemList.push(i.toString());
			}
			this.pagebar.enable(itemList);
		},
		_loadPageItem : function(){
			var pagebar										= new dhx.Toolbar(this.element);
			var rowList										= [];
			var viewCount									= 1;
			var lastPageNumber								= 0;
			this.config.align								= xui.valid.isEmpty(this.config.align)				?	"center"						:	this.config.align;
			this.config.countPerPageList					= xui.valid.isEmpty(this.config.countPerPageList)	?	[50,100,150,200,250,300]		:	this.config.countPerPageList;
			this.config.countPerPage						= xui.valid.isEmpty(this.config.countPerPage)		?	this.config.countPerPageList[0]	:	this.config.countPerPage;
			this.config.moveLast							= xui.valid.isEmpty(this.config.moveLast)			?	true							:	this.config.moveLast;
			this.config.customMove							= xui.valid.isEmpty(this.config.customMove)			?	false							:	this.config.customMove;
			this.config.changeCount							= xui.valid.isEmpty(this.config.changeCount)		?	false							:	this.config.changeCount;
			this.config.info								= xui.valid.isEmpty(this.config.info)				?	false							:	this.config.info;
			this.config.hideMore							= xui.valid.isEmpty(this.config.hideMore)			?	false							:	this.config.hideMore;
			this.config.totalCount							= xui.valid.isEmpty(this.config.totalCount)			?	0								:	this.config.totalCount;
			this.config.viewCount							= xui.valid.isEmpty(this.config.viewCount)			?	5								:	this.config.viewCount;
			this.config.onChange							= xui.valid.isEmpty(this.config.onChange)			?	null							:	this.config.onChange;
			lastPageNumber									= parseInt((this.config.totalCount/this.config.countPerPageList[0]).toFixed(0));
			if(lastPageNumber <= 0){
				lastPageNumber								= 1;
			}
			for(var i = 0; i < this.config.countPerPageList.length; i++){
				rowList.push({id:"countPerPage_" + this.config.countPerPageList[i],value:this.config.countPerPageList[i]});
			}
			viewCount										= (this.config.viewCount > lastPageNumber ? lastPageNumber : this.config.viewCount);
			var pageNavData									= [];
			if(this.config.align === "center" || this.config.align === "right"){
				pageNavData.push({id:"spacingLeft"			,type:"spacer"			,value:""								,icon:""							,hidden:false										,disabled:false																		});
			}
			pageNavData.push({id:"first"					,type:"navItem"			,value:""								,icon:"xfi xfi-ico_0053_page_start"	,hidden:!this.config.moveLast						,disabled:true	,tooltip:xuic.__i18n.getLabel("goFirst")							});
			pageNavData.push({id:"prev"						,type:"navItem"			,value:""								,icon:"xfi xfi-ico_0055_page_prev"	,hidden:false										,disabled:true	,tooltip:xuic.__i18n.getLabel("goPrev")								});
			pageNavData.push({id:"moreprev"					,type:"navItem"			,value:"..."							,icon:""							,hidden:!(lastPageNumber > this.config.viewCount)	,disabled:true	,tooltip:xuic.__i18n.getLabel("goPrevGroup")						});
			for(var i = 0; i < viewCount; i++){
				pageNavData.push({id:(i+1).toString()		,type:"navItem"			,value:(i+1)							,icon:""							,hidden:false										,disabled:true	,group:"pageNumber"								,twoState:true		});
			}
			pageNavData.push({id:"morenext"					,type:"navItem"			,value:"..."							,icon:""							,hidden:!(lastPageNumber > this.config.viewCount)	,disabled:true	,tooltip:xuic.__i18n.getLabel("goNextGroup")						});
			pageNavData.push({id:"next"						,type:"navItem"			,value:""								,icon:"xfi xfi-ico_0056_page_next"	,hidden:false										,disabled:true	,tooltip:xuic.__i18n.getLabel("goNext")								});
			pageNavData.push({id:"last"						,type:"navItem"			,value:""								,icon:"xfi xfi-ico_0054_page_end"	,hidden:!this.config.moveLast						,disabled:true	,tooltip:xuic.__i18n.getLabel("goLast")								});
			pageNavData.push({id:"countPerPage"				,type:"selectButton"	,value:this.config.countPerPageList[0]	,icon:""							,hidden:!this.config.changeCount					,disabled:true	,items:rowList														});
			pageNavData.push({id:"countPerPageInfo"			,type:"title"			,value:"건씩 보기"							,icon:""							,hidden:!this.config.changeCount					,disabled:false																		});

			pageNavData.push({id:"goLabel"					,type:"title"			,value:"페이지 직접 이동"					,icon:""							,hidden:!this.config.customMove						,disabled:false																		});
			pageNavData.push({id:"go"						,type:"input"			,value:""								,icon:""							,hidden:!this.config.customMove						,disabled:true	,width:42	,tooltip:xuic.__i18n.getLabel("movePage")				});
			pageNavData.push({id:"goButton"					,type:"navItem"			,value:xui.enum.BUTTON_MOVE_PAGE.getName()								,icon:""							,hidden:!this.config.customMove						,disabled:true	,group:"goMove"		,active:true				,twoState:true		});
			if(this.config.align !== "right"){
				pageNavData.push({id:"spacingRight"			,type:"spacer"			,value:""								,icon:""							,hidden:false										,disabled:false																		});
			}
			pageNavData.push({id:"info"						,type:"title"			,value:"TOTAL : 0 / 0"						,icon:""							,hidden:!this.config.info							,disabled:false																		});
			pagebar.data.parse(pageNavData);
			pagebar.events.on("Click", function(id, e){
				this.element.pageController._pageHandler(id);
			});
			pagebar.events.on("InputBlur", function(id){
				this.element.pageController._pageHandler(id);
			});
			pagebar.events.on("InputKeyup", function(id){
				if(event.keyCode === xui.enum.ENTER_EVENT.getCode()){
					this.element.pageController._pageHandler(id);
				}
			});
			pagebar.element									= this.element;
			this.status										= {};
			this.status.pageNumber							= 1;
			this.status.lastPageNumber						= lastPageNumber;
			this.status.countPerPage						= this.config.countPerPage;
			this.status.begin								= 1;
			this.status.end									= viewCount;
			this.status.currentCount						= 0;
			this.status.totalCount							= this.config.totalCount;
			this.status.from								= 0;
			this.status.to									= 0;
			return pagebar;
		},
		_pageHandler : function(id){
			var pagebar										= this.pagebar;
			if(!pagebar.isDisabled(id)){
				var lastPage								= this.getLastPage();
				var state									= pagebar.getState();
				var status									= this.getDuration(), _s = status.begin, _e = status.end;
				var pageNumber								= parseInt(state.pageNumber, 10);
				switch(id){
					case "first"	:
						if(pageNumber > 1){
							pageNumber						= 1;
						}
						break;
					case "prev"		:
						if(pageNumber > 1){
							pageNumber--;
						}
						break;
					case "next"		:
						if(pageNumber < lastPage){
							pageNumber++;
						}
						break;
					case "last"		:
						if(pageNumber < lastPage){
							pageNumber						= lastPage;
						}
						break;
					case "moreprev"	:
						pageNumber							= (_s - this.config.viewCount);
						if(pageNumber < 1){
							pageNumber						= 1;
						}
						break;
					case "morenext"	:
						pageNumber							= (_e + this.config.viewCount);
						if(pageNumber > lastPage){
							pageNumber						= lastPage;
						}
						break;
					case "go"		:
						if(!xui.valid.isEmpty(state.go)){
							if(xui.valid.isNumber(state.go)){
								if(pageNumber !== parseInt(state.go, 10)){
									pageNumber				= parseInt(state.go, 10);
									if(pageNumber == 0 || lastPage < pageNumber){
										(function(obj){
											setTimeout(function(){
												obj.tooltip(xui.enum.PAGE_OUT_OF_RANGE.getName(), "E");
											}, 100);
										}($(this.element.querySelector(".dhx_input"))));
										pageNumber			= this.status.pageNumber;
									}
								}
							}else{
								(function(obj){
									setTimeout(function(){
										obj.tooltip(xui.enum.INVALID_PAGE_NUMBER.getName(), "E");
									}, 100);
								}($(this.element.querySelector(".dhx_input"))));
							}
						}
						break;
					case "goButton"	:
						break;
					default			:
						if(xui.valid.isNumber(id)){
							pageNumber						= parseInt(id);
						}else{
							pageNumber						= 1;
						}
						break;
				};
				this.setPage(pageNumber, this.getCount(), this.getTotalCount(), state.countPerPage, (this.status.pageNumber !== pageNumber || this.status.countPerPage !== state.countPerPage), id);
			}else{
				var _a;
				if(!isNaN(id)){
					pagebar.data.update(id, (_a = {}, _a["active"] = false, _a));
				}else{
					pagebar.data.update("go", (_a = {}, _a["value"] = "", _a));
				}
			}
		}
	};

	xui.module.toolbar	= function(config, element){
		if(!xui.valid.isEmpty(element.toolbarController)){
			element.toolbarController.destroy();
		}
		if(this._validToolbar(config)){
			element.innerHTML			= "";
			element.classList.add("xui-toolbar");
			element.toolbarController	= this;
			config.position				= xui.valid.isEmpty(config.position)	? "top"	: config.position;
			this.element				= element;
			this.config					= config;
			if(this.config.position === "top"){
				this.toolbar			= new dhx.Toolbar(element);
			}else if(this.config.position === "left"){
				this.toolbar			= new dhx.Sidebar(element);
			}
			this._loadItems();

			/* Define toolbar configuration */
			this.active					= false;
		}
	};
	xui.module.toolbar.prototype	= {
		init : function(completely){
		},
		destroy : function(){
			this.toolbar.destructor();
			delete this.config;
			delete this.element;
			delete this.toolbar;
		},
		show : function(id){

		},
		hide : function(id){

		},
		setValue : function(id, value){
			this.active										= true;
			this.toolbar.data.update(id, {value:value});
		},
		getValue : function(id){

		},
		setCount : function(id, count){

		},
		getCount : function(id){

		},
		isActive : function(){
			return this.active;
		},
		isEnable : function(id){

		},
		disable : function(id){

		},
		enable : function(id){

		},
		disableAll : function(){

		},
		enableAll : function(){

		},
		_loadItems : function(){
			/*
			type:button, customHTML, imageButton, input, selectButton, separator, spacer, title
			attribute:{
				"button"		: "type, id, css, hotkey, html, value, tooltip, count, countColor, items, group, twoState, active, multiClick, icon, view, size, color, full, circle, loading",
				"customHTML"	: "type, id, html, css, parent",
				"imageButton"	: "type, id, src, html, value, twoState, active, group, hotkey, count, countColor, size, tooltip",
				"input"			: "type, id, icon, placeholder, width, label, value, tooltip, inputType",
				"navItem"		: "type, id, css, html, value, tooltip, count, countColor, items, icon, size",
				"selectButton"	: "type, id, icon, html, value, items, size, tooltip",
				"separator"		: "type, id",
				"spacer"		: "type, id",
				"title"			: "type, id, html, value, css, tooltip"
			}
			align		: ""
			item		: [
				{id:""		,type:"input"			,value:""	,icon:""	,label:""	,placeholder:""},
				{id:""		,type:"selectButton"	,value:""	,icon:""	,data:[{id:"", value:""},{id:"", value:""}]},
				{id:""		,type:"separator"		,value:""	,icon:""},
				{id:""		,type:"navItem"			,value:""	,icon:""},
				{id:""		,type:"title"			,value:""	,icon:""},
				{id:""		,type:"customHTML"		,value:""	,icon:""	,html:""},
			],
			onClick		: function(){
			},
			onKeyPress	: function(){
			},
			onChange	: function(){
			}

			{
				id			: "first",
				type		: "customHTML",
				value		: "",
				html		: "<img src=\"" + xui.com.getContextPath() + "html/xs/core/xui/js/component/dhtmlx/suite/v5/dhtmlxGrid/imgs/dhxgrid_material/ar_left_abs.gif\"/>",
				tooltip		: "",
				icon		: "",
				count		: null,
				countColor	: null,
				view		: "flat",
				size		: "small",
				color		: "danger",
				full		: false,
				circle		: false,
				loading		: false,
				group		: "",
				twoState	: false,
				active		: false
			}
			*/
			this.config.align								= xui.valid.isEmpty(this.config.align)	?	"left"	:	this.config.align;
			if(this.config.align === "center" || this.config.align === "right"){
				this.config.items.unshift({id:"spacingLeft"	,type:"spacer"});
			}
			if(this.config.align === "center"){
				this.config.items.push({id:"spacingRight"	,type:"spacer"});
			}
			this.toolbar.data.parse(this.config.items);
		},
		_validToolbar : function(config){
			var valid										= true;
			var validList									= [];
			validList.push({valid:!xui.valid.isEmpty(config.items)	,message:xui.enum.TOOLBAR_LOAD_ERROR01.getName()});
			for(var i = 0; i < config.items.length; i++){
				if(xui.valid.isEmpty(config.items[i].id) || xui.valid.isEmpty(config.items[i].type)){
					validList.push({valid:false						,message:xui.enum.TOOLBAR_LOAD_ERROR02.getName()});
					break;
				}
			}
			for(var i in validList){
				valid										= validList[i].valid;
				if(!valid){
					xui.dialog.error(validList[i].message, xui.enum.TOOLBAR_ERROR.getName());
					break;
				}
			}
			return valid;
		}
	};

	xui.module.appendbar	= function(config, element){
		element						= xuic.__DOM.getElement(element);
		var appendbar				= this._loadAppendItem(config, element);
		this.config					= config;
		this.active					= false;
		this.element				= element;
		this.appendbar				= appendbar;
		element.appendController	= this;
	};
	xui.module.appendbar.prototype	= {
		init : function(completely){
			if(completely){
				this.appendbar.data.update("info", {value:"TOTAL : 0 / 0"});
				this.appendbar.disable("more");
				this.active									= false;
			}
			this.status.pageNumber							= 1;
			this.status.currentCount						= 0;
			this.status.totalCount							= 0;
			this.status.lastPageNumber						= 1;
		},
		getPage : function(){
			return this.status.pageNumber;
		},
		getLastPage : function(){
			return this.status.lastPageNumber;
		},
		getCountPerPage : function(){
			return this.status.countPerPage;
		},
		setCount : function(count){
			this.setPage(this.status.pageNumber, count, this.status.totalCount);
		},
		getCount : function(){
			return this.status.currentCount;
		},
		setTotalCount : function(totalCount){
			this.setPage(this.status.pageNumber, this.status.currentCount, totalCount);
		},
		getTotalCount : function(){
			return this.status.totalCount;
		},
		isActive : function(){
			return this.active;
		},
		setPage : function(pageNumber, count, totalCount, doCallFn){
			this.active										= true;
			var countPerPage								= this.status.countPerPage;
			this.status.pageNumber							= pageNumber;
			this.status.currentCount						= (pageNumber - 1) * countPerPage + count;
			this.status.totalCount							= totalCount;
			this.status.lastPageNumber						= Math.ceil(totalCount/countPerPage);
			if(this.status.lastPageNumber <= 0){
				this.status.lastPageNumber					= 1;
			}
			if(this.status.currentCount === this.status.totalCount){
				this.appendbar.disable(["more"]);
			}else{
				this.appendbar.enable(["more"]);
			}
			if(this.status.currentCount > 0){
				this.appendbar.data.update("info", {value:"TOTAL : " + xui.format.number.getData(this.status.currentCount) + " / " + xui.format.number.getData(this.status.totalCount)});
			}else{
				this.appendbar.data.update("info", {value:"TOTAL : 0 / " + xui.format.number.getData(this.status.totalCount)});
			}
			if(doCallFn && typeof(this.config.onAppend) === "function"){
				this.config.onAppend.call(this, pageNumber, this.status.countPerPage);
			}
		},
		disable : function(id){
			this.pagebar.disable(id);
		},
		enable : function(id){
			this.pagebar.enable(id);
		},
		disableAll : function(){
			var itemList									= ["more"];
			this.pagebar.disable(itemList);
		},
		enableAll : function(){
			var itemList									= ["more"];
			this.pagebar.enable(itemList);
		},
		_loadAppendItem : function(config, element){
			var appendbar									= new dhx.Toolbar(element.id);
			var appendNavData								= [];
			appendNavData.push({id:"spacingLeft"			,type:"spacer"	,value:""					,icon:""						,hidden:false	,disabled:true});
			appendNavData.push({id:"info"					,type:"title"	,value:"TOTAL : 0 / 0"			,icon:""						,hidden:false	,disabled:true});
			appendNavData.push({id:"more"					,type:"navItem"	,value:"more.."				,icon:"xfi xfi-ico_0041_add"	,hidden:false	,disabled:true});
			appendbar.data.parse(appendNavData);
			appendbar.events.on("Click", function(id, e){
				this.element.appendController._appendHandler(id);
			});
			appendbar.element								= element;
			this.status										= {};
			this.status.pageNumber							= 1;
			this.status.lastPageNumber						= 1;
			this.status.countPerPage						= config.countPerPage;
			this.status.currentCount						= 0;
			this.status.totalCount							= 0;
			this.onAppend									= config.onAppend;
			return appendbar;
		},
		_appendHandler : function(id){
			if(!this.appendbar.isDisabled(id)){
				var pageNumber								= this.getPage() + 1;
				this.setPage(pageNumber, 0, this.status.totalCount, true);
			}
		}
	};

	xui.module.file	= function(config, element){
		if(!xui.valid.isEmpty(element.fileController)){
			element.fileController.destroy();
		}
		if(this._validFile(config)){
			/* Wrapping file container element */
			element.innerHTML								= "";
			var container									= document.createElement("div"), title = element.getAttribute("xui-tooltip-title");
			container.id									= element.id + "_container";
			container.className								= "xui-file-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);
			if(xui.valid.isEmpty(title)){
				title										= element.id + "FILE";
				element.setAttribute("xui-tooltip-title", title);
			}
			element.classList.add("xui-file");
			element.fileController							= this;
			this.element									= element;

			/* Define file configuration */
			config.baseId									= this.element.id;
			config.title									= title;
			config.type										= "FILE";
			config.dialog									= xui.valid.isEmpty(config.dialog)				?	false																			:	config.dialog;
			config.width									= xui.valid.isEmpty(config.width)				?	600																				:	config.width;
			config.height									= xui.valid.isEmpty(config.height)				?	350																				:	config.height;
			config.modal									= xui.valid.isEmpty(config.modal)				?	false																			:	config.modal;
			config.mode										= xui.valid.isEmpty(config.mode)				?	"grid"																			:	config.mode;
			config.header									= xui.valid.isEmpty(config.header)				?	true																			:	config.header;
			config.upload									= xui.valid.isEmpty(config.upload)				?	true																			:	config.upload;
			config.download									= xui.valid.isEmpty(config.download)			?	true																			:	config.download;
			config.remove									= xui.valid.isEmpty(config.remove)				?	true																			:	config.remove;
			config.dnd										= xui.valid.isEmpty(config.dnd)					?	true																			:	config.dnd;
			config.uploadUrl								= xui.valid.isEmpty(config.uploadUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/uploadFile.json"		:	config.uploadUrl;
			config.downloadUrl								= xui.valid.isEmpty(config.downloadUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/downloadFile.json"	:	config.downloadUrl;
			config.previewUrl								= xui.valid.isEmpty(config.previewUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/getFileStream.json"	:	config.previewUrl;
			config.autoUpload								= xui.valid.isEmpty(config.autoUpload)			?	true																			:	config.autoUpload;
			config.autoRemove								= xui.valid.isEmpty(config.autoRemove)			?	true																			:	config.autoRemove;
			config.maxCount									= xui.valid.isEmpty(config.maxCount)			?	50																				:	config.maxCount;
			config.limitSize								= xui.valid.isEmpty(config.limitSize)			?	xui.com.getAppMaxUploadSize()													:	(xui.com.getAppMaxUploadSize() < config.limitSize ? xui.com.getAppMaxUploadSize() : config.limitSize);
			config.limitSizePerFile							= xui.valid.isEmpty(config.limitSizePerFile)	?	xui.com.getAppMaxUploadSizePerFile()											:	(xui.com.getAppMaxUploadSizePerFile() < config.limitSizePerFile ? xui.com.getAppMaxUploadSizePerFile() : config.limitSizePerFile);
			config.extraDropArea							= xui.valid.isEmpty(config.extraDropArea)		?	null																			:	config.extraDropArea;
			config.allowExtension							= xui.valid.isEmpty(config.allowExtension)		?	null																			:	config.allowExtension.map(item => item.toLowerCase());
			config.allowDuple								= xui.valid.isEmpty(config.allowDuple)			?	false																			:	config.allowDuple;

			if(config.dialog){container.classList.add("xui-invisible");}
			if(!config.upload){this.element.classList.add("disableUpload");}
			if(!config.download){this.element.classList.add("disableDownload");}
			if(!config.remove){this.element.classList.add("disableRemove");}
			if(!config.dnd){this.element.classList.add("disableDnd");}

			this.config										= config;

			/*dialog window 모드에 따른 생성*/
			this.dialogController							= this._createDialog(container);
			/*dhtmlx vault component load*/
			this.file										= new dhx.Vault(element, {
				uploader				: {
					target				: config.uploadUrl,
					downloadURL			: config.downloadUrl,
					autosend			: config.autoUpload,
					fieldName			: "xuifile",
					params				: "",
					singleRequest		: true,
					updateFromResponse	: true
				},
				progressBar				: {
					template			: function(percent, extra){
						return xui.format.filesize.getData(extra.current, extra.current) + "/" + xui.format.filesize.getData(extra.total, extra.total);
					}
				},
				mode					: config.mode,
				customScroll			: false,
				scaleFactor				: 4,
				toolbar					: config.header,
				enableDnd				: (config.upload && config.dnd)
			});
			this.file.element								= element;
			var _this										= this;
			dhx.awaitRedraw().then(function(){
				if(!config.upload){
					_this.file.uploader.unlinkDropArea();
					delete _this.file._layout.config.on;
					_this.file._layout.paint();
					_this._redraw();
				}
			});
			/*헤더 control*/
			this._drawHeader();
			/*파일 추가 전 event*/
			this.file.events.on("BeforeAdd", function(item){
				return this.element.fileController._beforeAdd(item);
			});
			/*파일 추가 후 event*/
			this.file.events.on("AfterAdd", function(item, evt){
				this.element.fileController._afterAdd(item);
			});
			/*파일 업로드 전 event*/
			this.file.events.on("BeforeUploadFile", function(files){
				return this.element.fileController._beforeUpload(files);
			});
			/*파일당 업로드 후 event*/
			this.file.events.on("UploadFile", function(item, extra){
				this.element.fileController._uploading(item, extra);
			});
			/*전체파일 업로드 중 event*/
			this.file.events.on("UploadComplete", function(item){
				this.element.fileController._finishUpload(item);
			});
			/*파일 삭제 전 event*/
			this.file.events.on("BeforeRemove", function(item){
				if(this.selectedItem === item.id){
					this.selectedItem						= null;
				}
				return true;
			});
			/*파일 삭제 후 event*/
			this.file.events.on("AfterRemove", function(){
				this.element.fileController._redraw();
			});
			/*파일 전체 삭제 후 event*/
			this.file.events.on("removeAll", function(){
				this.selectedItem							= null;
				this.element.fileController._redraw();
			});
			/*단일 파일 다운로드 전 event*/
			this.file.events.on("Download", function(item){
				if(!xui.valid.isEmpty(item.fileGroupKey) && !xui.valid.isEmpty(item.fileKey)){
					this.element.fileController.download(item.fileKey);
				}
			});
			this.status										= {};
			this.status.removeFiles							= {};
			this.status.size								= 0;
			this.status.count								= 0;
			this.status.validation							= "";
			this.status.helper								= xui.enum.UPLOAD_LIMIT_MAXIMUM.getName() + " " +  (this.config.maxCount <= 0 ? "<i class='xfi xfi-ico_0079_build'></i>" : xui.format.number.getData(this.config.maxCount)) + xui.enum.PER_FILE.getName() +  " " + xui.format.filesize.getData(this.config.limitSizePerFile) + " / " + xui.enum.ALL.getName() + " " + xui.format.filesize.getData(this.config.limitSize);
			if(xui.valid.isArray(this.config.allowExtension) && this.config.allowExtension.length > 0){
				this.status.helper							+= "<br/>"+xui.enum.EXTENSION_RESTRICTIONS.getName()+" : ";
				for(var i = 0; i < this.config.allowExtension.length; i++){
					this.status.helper						+= (this.config.allowExtension[i] + ",");
				}
				this.status.helper							= this.status.helper.substr(0, this.status.helper.length-1);
			}
			this.parent										= element.parentNode.parentNode;
			this.fileGroupKey								= null;

			return this;
		}
	};
	xui.module.file.prototype	= {
		init : function(){
			this.file.data.removeAll();
			this.status.removeFiles							= {};
			this.status.validation							= "";
			this.file.selectedItem							= null;
			this.fileGroupKey								= null;
		},
		destroy : function(){
			if(!xui.valid.isEmpty(this.file)){
				var originElement							= document.createElement("div");
				originElement.id							= this.element.id;
				originElement.setAttribute("xui-tooltip-title", this.element.getAttribute("xui-tooltip-title"));
				this.file.destructor();
				if(this.config.dialog){
					this.close();
					this.dialogController.destroy();
				}
				this.parent.innerHTML						= "";
				this.parent.appendChild(originElement);
				delete this.status;
				delete this.config;
				delete this.element;
				delete this.file;
			}
		},
		open : function(){
			if(this.config.dialog){
				this.dialogController.open();
			}
		},
		close : function(){
			if(this.config.dialog){
				this.dialogController.close();
			}
		},
		changeViewerMode : function(mode){
			if(!xui.valid.isEmpty(mode) && this.config.mode !== mode){
				mode										= mode.toLowerCase();
				if(mode === "grid" || mode === "list"){
					this.config.mode						= mode;
					this.file.config.mode					= mode;
					this.file.toolbar.data.update((mode === "grid" ? "list" : "grid") + "mode", {active:false});
					this.file.toolbar.data.update(mode + "mode", {active:true});
					this.file._vaultView.paint();
				}
			}
		},
		getData : function(fileKey){
			var data										= null;
			if(!xui.valid.isEmpty(fileKey)){
				if(this.isExist(fileKey)){
					var fileGroupKey						= this.getFileGroupKey();
					data									= this.file.data.find(function(item){
						return (item.fileGroupKey === fileGroupKey && item.fileKey === fileKey);
					});
				}
			}else if(!xui.valid.isEmpty(this.file.selectedItem)){
				data										= this.file.data.getItem(this.file.selectedItem);
			}
			if(xui.valid.isEmpty(data) || (xui.valid.isArray(data) && data.length === 0)){
				data										= null;
			}
			return data;
		},
		getAllData : function(){
			var data										= null;
			if(this.getCount() > 0){
				data										= this.file.data.serialize();
				if(xui.valid.isEmpty(data) || (xui.valid.isArray(data) && data.length === 0)){
					data									= null;
				}
			}
			return data;
		},
		getChangedData : function(){
			var data										= [];
			if(this.getCount() > 0){
				data										= this.file.data.findAll(function(item){
					if(item.DATA_FLAG !== xui.enum.TRANSACTION_NONE.getCode()){
						return true;
					}
				});
			}
			if(Object.keys(this.status.removeFiles).length > 0){
				if(xui.valid.isArray(data)){
					for(var key in this.status.removeFiles){
						data.push(this.status.removeFiles[key]);
					}
				}else{
					data									= xui.util.copyObject(data, this.status.removeFiles);
				}
			}
			if(data.length === 0){
				data										= null;
			}
			return data;
		},
		getUploadedData : function(){
			var data										= null;
			if(this.getCount() > 0){
				data										= this.file.data.findAll(function(item){
					if(item.DATA_FLAG !== xui.enum.TRANSACTION_INSERT.getCode()){
						return true;
					}
				});
				if(xui.valid.isEmpty(data) || (xui.valid.isArray(data) && data.length === 0)){
					data									= null;
				}
			}
			return data;
		},
		getUploadReadyData : function(){
			var data										= null;
			if(this.getCount() > 0){
				data										= this.file.data.findAll(function(item){
					if(item.DATA_FLAG === xui.enum.TRANSACTION_INSERT.getCode()){
						return true;
					}
				});
				if(xui.valid.isEmpty(data) || (xui.valid.isArray(data) && data.length === 0)){
					data									= null;
				}
			}
			return data;
		},
		setFileGroupKey : function(fileGroupKey){
			this.fileGroupKey = fileGroupKey;
		},
		getFileGroupKey : function(){
			return this.fileGroupKey;
		},
		getSize : function(){
			return this.status.size;
		},
		getCount : function(){
			return this.status.count;
		},
		getAvailableSize : function(){
			return this.config.limitSize;
		},
		getAvailableSizePerFile : function(){
			return this.config.limitSizePerFile;
		},
		getAvailableCount : function(){
			return this.config.maxCount;
		},
		addFile : function(){
			this.file.uploader.selectFile();
		},
		addUploadedFile : function(fileGroupKey, fileKey){
			var _this										= this;
			if(!xui.valid.isEmpty(fileGroupKey)){
				if(xui.valid.isEmpty(_this.fileGroupKey) || _this.fileGroupKey === fileGroupKey){
					var param								= new xui.json();
					param.setURL(xui.com.getRequestPrefix() + "/getUploadedFileData.json");
					param.setString("fileGroupKey"	,fileGroupKey);
					param.setString("fileKey"		,xui.valid.isEmpty(fileKey) ? "" : fileKey);
					param.setString("downloadUrl"	,_this.config.downloadUrl);
					param.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
					param.setCallBack(function(response, request){
						if(!response.getErrorFlag()){
							if(response.getCount() > 0){
								var data					= response.getDataJsonArray();
								for(var i = 0; i < data.length; i++){
									if(!xui.valid.isEmpty(data[i].preview)){
										data[i].preview		= _this.config.previewUrl + xui.ajax.convertGetMethodParam({"fileGroupKey":data[i].fileGroupKey,"fileKey":data[i].fileKey,"authType":xui.enum.AUTH_TYPE_NONE.getCode()});
									}
									_this.file.data.add(data[i]);
								}
								_this.fileGroupKey			= fileGroupKey;
							}
						}else{
							xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
						}
					});
					xui.ajax.callService(param);
				}
			}
		},
		upload : function(byForce){
			var _this										= this;
			if(_this.getCount() > 0 && _this.config.upload || byForce){
				if(!xui.valid.isEmpty(this.getUploadReadyData())){
					this.file.uploader.send();
				}
			}
		},
		download : function(fileKey, byForce){
			var _this										= this;
			if(_this.getCount() > 0 && (_this.config.download || byForce)){
				var file									= _this.getData(fileKey);
				if(!xui.valid.isEmpty(file)){
					var isValid								= true;
					if(typeof(_this.config.onBeforeDownload) === "function"){
						isValid								= this.config.onBeforeDownload.call(_this, file);
						if(xui.valid.isEmpty(isValid)){
							isValid							= true;
						}
					}
					if(isValid){
						xui.ajax.downloadFile([{"fileGroupKey":file.fileGroupKey,"fileKey":file.fileKey}]);
					}
				}
			}
		},
		downloadAll : function(byForce, showConfirm){
			var _this										= this;
			if(_this.getCount() > 0 && (_this.config.download || byForce)){
				var uploaded								= _this.getUploadedData();
				if(!xui.valid.isEmpty(uploaded)){
					var isValid								= true;
					if(typeof(_this.config.onBeforeDownload) === "function"){
						isValid								= _this.config.onBeforeDownload.call(_this, data);
						if(xui.valid.isEmpty(isValid)){
							isValid							= true;
						}
					}
					if(isValid){
						if(xui.valid.isEmpty(showConfirm)){
							showConfirm						= true;
						}
						for(var i = 0; i < data.length; i++){
							uploaded[i]						= {"fileGroupKey":uploaded[i].fileGroupKey,"fileKey":uploaded[i].fileKey};
						}
						xui.dialog.confirm(xui.enum.BIG_FILE_SIZE.getName() + "(" + xui.format.filesize.getData(_this.getSize()) + ") " + xui.enum.TAKE_SOME_TIME.getName(), xui.enum.DOWNLOAD_CONFIRM.getName(), function(isConfirm){
							if(isConfirm){
								xui.ajax.downloadFile(uploaded);
							}
						}, (!showConfirm || (_this.getSize() <= 1024*1024*100)));
					}
				}
			}
		},
		deleteFile : function(fileId, byForce){
			var _this										= this;
			if(_this.getCount() > 0 && (_this.config.remove || byForce)){
				var item									= this.file.data.getItem(fileId);
				if(!xui.valid.isEmpty(item)){
					if(item.DATA_FLAG !== xui.enum.TRANSACTION_INSERT.getCode()){
						this.status.removeFiles[fileId]		= xui.util.copyObject({}, item);
					}
					this.file.data.remove(fileId);
				}
			}
		},
		deleteUploadedFile : function(fileKey, byForce){
			var _this										= this;
			if(_this.getCount() > 0 && (_this.config.remove || byForce)){
				var file									= _this.getData(fileKey);
				if(!xui.valid.isEmpty(file)){
					var doDelete							= false;
					if(typeof(_this.config.onBeforeRemove) === "function"){
						doDelete							= _this.config.onBeforeRemove.call(_this, file);
						if(xui.valid.isEmpty(doDelete)){
							doDelete						= true;
						}
					}
					if(doDelete){
						var param							= new xui.json();
						param.setURL(xui.com.getRequestPrefix() + "/deleteFile.json");
						param.setString("fileGroupKey"	, file.fileGroupKey);
						param.setString("fileKey"		, file.fileKey);
						param.setAuthType(xui.enum.TRANSACTION_DELETE.getCode());
						param.setCallBack(function(response, request){
							if(!response.getErrorFlag()){
								if(isExist){
									_this.file.data.remove(file.id);
								}
							}else{
								xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
							}
						});
						xui.ajax.callService(param);
					}
				}
			}
		},
		deleteAll : function(byForce){
			var _this										= this;
			if(_this.getCount() > 0 && (_this.config.remove || byForce)){
				var allFileData								= this.getAllData();
				var uploaded								= _this.getUploadedData();
				var isValid									= true;
				if(typeof(_this.config.onBeforeRemove) === "function"){
					isValid									= _this.config.onBeforeRemove.call(_this, allFileData);
					if(xui.valid.isEmpty(isValid)){
						isValid								= true;
					}
				}
				if(isValid){
					if(!xui.valid.isEmpty(uploaded)){
						for(var i = 0; i < uploaded.length; i++){
							uploaded[i]						= {"fileGroupKey":uploaded[i].fileGroupKey,"fileKey":uploaded[i].fileKey};
						}
						var param							= new xui.json();
						param.setURL(xui.com.getRequestPrefix() + "/deleteFile.json");
						param.setDataJsonArray(uploaded);
						param.setAuthType(xui.enum.TRANSACTION_DELETE.getCode());
						param.setCallBack(function(response, request){
							if(!response.getErrorFlag()){
								_this.file.data.removeAll();
							}else{
								xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
							}
						});
						xui.ajax.callService(param);
					}else{
						_this.file.data.removeAll();
					}
				}
			}
		},
		isExist : function(fileKey){
			var exist										= false;
			var fileGroupKey								= this.getFileGroupKey();
			if(this.getCount() > 0 && !xui.valid.isEmpty(fileGroupKey) && !xui.valid.isEmpty(fileKey)){
				var file									= this.file.data.find(function(item){
					return (item.fileGroupKey === fileGroupKey && item.fileKey === fileKey);
				});
				exist										= !xui.valid.isEmpty(file);
			}
			return exist;
		},
		linkDropArea : function(element){
			element											= xuic.__DOM.getElement(element);
			if(xui.valid.isElement(element)){
				this.file.uploader.linkDropArea(element);
			}
		},
		_createDialog : function(container){
			var dialogController							= null;
			if(this.config.dialog){
				dialogController							= new xui.module.dialog({
					header				: true,
					title				: xui.enum.ATTACHMENT.getName(),
					width				: this.config.width,
					height				: this.config.height,
					modal				: this.config.modal,
					resizable			: false,
					closable			: true,
					movable				: true,
					open				: function(){
						if(typeof(this.config.onOpen) === "function"){
							return this.config.onOpen.call(dialogController);
						}
					},
					close				: function(){
						if(typeof(this.config.onClose) === "function"){
							return this.config.onClose.call(dialogController);
						}
					}
				}, container);
			}
			return dialogController;
		},
		_drawHeader : function(){
			if(this.config.header){
				var idx										= this.config.upload ? 2 : 1;
				var objFile									= this.file;
				if(this.config.download){
					this.file.toolbar.data.add({
						type			: "navItem",
						id				: "all-download",
						tooltip			: xuic.__i18n.getLabel("allDownload"),
						icon			: "xfi xfi-ico_0068_download",
						hidden			: true
					}, idx++);
				}
				this.file.toolbar.data.add({
					type				: "navItem",
					id					: "config",
					tooltip				: xuic.__i18n.getLabel("showConfig"),
					icon				: "xfi xfi-ico_0079_build"
				}, idx++);
				this.file.toolbar.data.add({
					type				: "navItem",
					id					: "calc",
					icon				: "xfi xfi-ico_0080_calculate"
				}, idx++);
				this.file.toolbar.data.add({
					type				: "separator"
				}, idx++);
				this.file.toolbar.data.add({
					id					: "listmode",
					type				: "navItem",
					icon				: "xfi xfi-ico_0037_reorder",
					group				: "viewmode",
					twoState			: true,
					active				: (this.config.mode === "list")
				}, idx++);
				this.file.toolbar.data.add({
					id					: "gridmode",
					type				: "navItem",
					icon				: "xfi xfi-ico_0081_view_module",
					group				: "viewmode",
					twoState			: true,
					active				: (this.config.mode === "grid")
				}, idx++);
				var sortItems								= [
					{id:"recentDate"	,value:xuic.__i18n.getLabel("recentDate")		,icon:"xfi xfi-ico_0100_sort_new"},
					{id:"pastDate"		,value:xuic.__i18n.getLabel("pastDate")			,icon:"xfi xfi-ico_0099_sort_old"},
					{id:"smallsize"		,value:xuic.__i18n.getLabel("smallSize")		,icon:"xfi xfi-ico_0101_sort_small"},
					{id:"bigsize"		,value:xuic.__i18n.getLabel("bigSize")			,icon:"xfi xfi-ico_0102_sort_large"},
					{id:"filename"		,value:xuic.__i18n.getLabel("fileName")			,icon:"xfi xfi-ico_0103_sort_name"},
					{id:"extension"		,value:xuic.__i18n.getLabel("fileExtension")	,icon:"xfi xfi-ico_0104_file_format"}
				];
				this.file.toolbar.data.add({
					type				: "selectButton",
					value				: sortItems[0].value,
					id					: "sort",
					icon				: "xfi xfi-ico_0100_sort_new",
					tooltip				: xuic.__i18n.getLabel("sortOrder"),
					items				: sortItems
				}, idx++);
				this.file.toolbar.data.add({
					type				: "input",
					value				: "",
					id					: "filter",
					label				: false,
					icon				: "xfi xfi-ico_0075_filter",
					placeholder			: "Search",
					hidden				: (((this.config.dialog && this.config.width <= 700) || this.element.offsetWidth <= 700) ? true : false)
				}, idx++);
				this.file.toolbar.events.on("Click", function(id, e){
					var fileController						= this._view.node.el.parentNode.parentNode.parentNode.fileController;
					fileController._clickToolbar(id, e);
				});
				this.file.toolbar.events.on("InputKeyup", function(id){
					var fileController						= this._view.node.el.parentNode.parentNode.parentNode.fileController;
					var inputValue							= this.getState()[id];
					var count								= fileController.getCount();
					if(count > 0){
						fileController.file.data.filter(function(item){
							if(!xui.valid.isEmpty(inputValue)){
								return item.name.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
							}else{
								return true;
							}
						});
					}
				});
				this.file.toolbar.data.add({
					type				: "navItem",
					id					: "all-remove",
					tooltip				: xuic.__i18n.getLabel("clearAll"),
					icon				: "xfi xfi-ico_0042_delete",
					hidden				: true
				}, (idx+2));
				var hideFeatures							= [];
				if(!this.config.upload){
					hideFeatures.push("add");
					hideFeatures.push("upload");
				}
				if(!this.config.download){
					hideFeatures.push("all-download");
				}
				if(!this.config.remove){
					hideFeatures.push("remove-all");
				}
				if(hideFeatures.length > 0){
					this.file.toolbar.hide(hideFeatures);
				}
			}
		},
		_clickToolbar : function(id, ev){
			switch(id){
				case "recentDate"	:
				case "pastDate"		:
					this.file.data.sort({
						by	: "createDt",
						dir	: (id === "recentDate" ? "desc" : "asc")
					});
					break;
				case "smallsize"	:
				case "bigsize"		:
					this.file.data.sort({
						by	: "size",
						dir	: (id === "bigsize" ? "desc" : "asc")
					});
					break;
				case "filename"		:
					this.file.data.sort({
						by	: "name",
						dir	: "asc"
					});
					break;
				case "extension"	:
					this.file.data.sort({
						rule : function(a, b){
							var aExt						= a.name.split(".").pop();
							var bExt						= b.name.split(".").pop();
							return aExt === bExt ? (a.name > b.name ? 1 : -1) : (aExt > bExt ? 1 : -1);
						}
					});
					break;
				case "all-download" :
					this.downloadAll(true);
					break;
				case "config"		:
					xuic.__COM.showMessageTip(ev.target, this.status.helper, "", 10000);
					break;
				case "gridmode"		:
					this.changeViewerMode("grid");
					break;
				case "listmode"		:
					this.changeViewerMode("list");
					break;
				case "calc"			:
					xuic.__COM.showMessageTip(ev.target, xui.format.filesize.getData(this.getSize()) + " / " + xui.format.filesize.getData(this.getAvailableSize()), "", 10000);
					break;
				case "all-remove"	:
					if(this.config.remove && this.getCount() > 0){
						var uploaded								= this.getUploadedData();
						if(this.config.autoRemove && !xui.valid.isEmpty(uploaded)){
							this.deleteAll();
							return;
						}
						if(!this.config.autoRemove && !xui.valid.isEmpty(uploaded)){
							var isValid								= true;
							if(typeof(this.config.onBeforeRemove) === "function"){
								isValid								= this.config.onBeforeRemove.call(this, uploaded);
								if(xui.valid.isEmpty(isValid)){
									isValid							= true;
								}
							}
							if(isValid){
								for(var i = 0; i < uploaded.length; i++){
									this.status.removeFiles[uploaded[i].id] = uploaded[i];
								}
								this.file.data.removeAll();
							}
						}else if(xui.valid.isEmpty(uploaded)){
							this.file.data.removeAll();
						}
					}
					break;
				default	:
					break;
			};
		},
		_removeFile : function(item){
			var dataFlag									= item.DATA_FLAG;
			if(dataFlag === xui.enum.TRANSACTION_INSERT.getCode()){
				this.file.data.remove(item.id);
			}else{
				if(this.config.autoRemove){
					this.deleteUploadedFile(item.fileGroupKey, item.fileKey);
				}else{
					this.status.removeFiles[item.id]		= xui.util.copyObject({}, item);
					this.file.data.remove(item.id);
				}
			}
		},
		_beforeAdd : function(item){
			var isValid										= true;
			var _this										= this;
			var config										= _this.config;
			if(config.upload || (!config.upload && item.DATA_FLAG !== xui.enum.TRANSACTION_INSERT.getCode())){
				if(!xui.valid.isEmpty(_this.timeout)){
					clearTimeout(_this.timeout);
					_this.timeout							= null;
				}
				var message									= "";
				if(xui.valid.isArray(config.allowExtension) && config.allowExtension.length > 0){
					var extension							= item.file.name.split(".").pop().toLowerCase();
					if(config.allowExtension.indexOf(extension) < 0){
						message								= item.file.name + xui.enum.NOT_ALLOWED_EXTENSION.getName();
						isValid								= false;
					}
				}
				if(isValid && config.limitSizePerFile < (item.size || item.file.size)){
					message									= item.file.name + xui.enum.OVER_UPLOAD_SIZE_PER_FILE.getName();
					isValid									= false;
				}
				if(isValid && config.limitSize <= (_this.status.size + (item.size || item.file.size))){
					message									= item.file.name + xui.enum.OVER_MAX_UPLOAD_SIZE.getName();
					isValid									= false;
				}
				if(isValid && config.maxCount <= _this.status.count){
					message									= item.file.name + xui.enum.OVER_MAX_FILE_SIZE.getName();
					isValid									= false;
				}
				if(isValid && !config.allowDuple){
					var findItem							= this.file.data.find(function(compareItem){
						if(
							((compareItem.name || compareItem.file.name) === (item.name || item.file.name)) ||
							(!xui.valid.isEmpty(item.fileGroupKey) && !xui.valid.isEmpty(item.fileKey) && item.fileGroupKey === compareItem.fileGroupKey && item.fileKey === compareItem.fileKey)
						)
						{
							return true;
						}
					});
					if(!xui.valid.isEmpty(findItem)){
						message								= (item.name || item.file.name) + " " + xui.enum.EXIST_FILE.getName();
						isValid								= false;
					}
				}
				if(!isValid){
					_this.status.validation					+= (message + "<br/>");
				}
			}else{
				message										= xui.enum.DISABLE_UPLOAD.getName();
				isValid										= false;
				_this.status.validation						+= (message + "<br/>");
			}
			if(!xui.valid.isEmpty(_this.status.validation)){
				_this.timeout								= setTimeout(function(){
					clearTimeout(_this.timeout);
					_this.timeout							= null;
					if(!xui.valid.isEmpty(_this.status.validation)){
						xuic.__COM.showMessageTip(_this.element.querySelector(".vault-topbar"), new String(_this.status.validation), "E", 10000);
						_this.status.validation				= "";
					}
				}, 100);
			}
			
			if(isValid){
				if(xui.valid.isEmpty(item.DATA_FLAG)){
					item.DATA_FLAG							= xui.enum.TRANSACTION_INSERT.getCode();
				}
				if(xui.valid.isEmpty(item.createDt)){
					var now									= new Date();
					item.createDt							= now.getFullYear() +
					xui.util.lpad(now.getMonth() + 1	,2	,"0") +
					xui.util.lpad(now.getDate()			,2	,"0") +
					xui.util.lpad(now.getHours()		,2	,"0") +
					xui.util.lpad(now.getMinutes()		,2	,"0") +
					xui.util.lpad(now.getSeconds()		,2	,"0") +
					xui.util.lpad(now.getMilliseconds(), 3	,"0");
				}
				if(typeof(config.onBeforeAdd) === "function"){
					isValid									= config.onBeforeAdd.call(this, item);
					if(xui.valid.isEmpty(isValid)){
						isValid								= true;
					}
				}
			}
			return isValid;
		},
		_afterAdd : function(item){
			if(typeof(this.config.onAdded) === "function"){
				this.config.onAdded.call(this, item);
			}
			this._redraw();
		},
		_beforeUpload : function(files){
			var isValid										= true;
			if(this.getCount() > 0 && !xui.valid.isEmpty(this.getUploadReadyData())){
				if(typeof(this.config.onBeforeUpload) === "function"){
					isValid									= this.config.onBeforeUpload.call(this, files);
					if(xui.valid.isEmpty(isValid)){
						isValid								= true;
					}
				}
			}else{
				isValid										= false;
			}
			return isValid;
		},
		_uploading : function(item, extra){
			var response									= new xui.json(extra);
			if(!response.getErrorFlag()){
				item.link									= this.config.downloadUrl;
				item.DATA_FLAG								= xui.enum.TRANSACTION_UPDATE.getCode();
				delete item.request;
			}else{
				xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
			}
		},
		_finishUpload : function(item){
			if(xui.valid.isJson(item)){
				item										= [item];
			}
			if(xui.valid.isArray(item)){
				this.fileGroupKey							= item[0].fileGroupKey;
				if(typeof(this.config.onUploaded) === "function"){
					this.config.onUploaded.call(this, item);
				}
			}
			this._redraw();
		},
		_getRequestFormData : function(fileWrappers, params){
			var fieldName									= this.file.uploader.config.fieldName;
			var formData									= new FormData();
			var brackets									= fileWrappers.length > 1 ? "[]" : "";
			var param										= new xui.json();
			for(var i = 0; i < fileWrappers.length; i++){
				formData.append(fieldName + brackets, fileWrappers[i].file, fileWrappers[i].file.name);
				param.setString("fileId"	,fileWrappers[i].id		,i);
				param.setString("fileName"	,fileWrappers[i].name	,i);
				if(fileWrappers[i].hasOwnProperty("requestData") && xui.valid.isJson(fileWrappers[i].requestData)){
					var keys								= Object.keys(fileWrappers[i].requestData);
					var size								= keys.length;
					for(var j = 0; j < size; j++){
						param.setObject(keys[j], fileWrappers[i].requestData[keys[j]], i);
					}
				}
			}
			param.setString("menuKey"		,xui.extends.menu.getKey());
			param.setString("subFilePath"	,"attachFile");
			param.setString("fileGroupKey"	,xui.valid.isEmpty(this.fileGroupKey) ? "" : this.fileGroupKey);
			param.setAuthType(xui.enum.AUTH_TYPE_CREATE.getCode());
			var ajaxFormData								= new xui._AjaxForm(param);
			ajaxFormData._setEncrypt();
			formData.append("jsonData", JSON.stringify(ajaxFormData.request.getJson()));
			return formData;
		},
		_redraw : function(){
			this.status.count								= this.file.data.getLength();
			this.status.size								= this.file.data.reduce(function(new_item, item){
				return new_item + (item.size || item.file.size);
			}, 0);
			if(this.config.header){
				var uploaded								= this.getUploadedData();
				var uploadReady								= this.getUploadReadyData(); 
				if(!this.config.upload || xui.valid.isEmpty(uploadReady)){
					this.file.toolbar.hide("upload");
					this.file.toolbar.hide("config");
				}else if(!xui.valid.isEmpty(uploadReady)){
					this.file.toolbar.show("upload");
					this.file.toolbar.show("config");
				}
				if(!this.config.download || xui.valid.isEmpty(uploaded)){
					this.file.toolbar.hide("all-download")
				}else if(!xui.valid.isEmpty(uploaded)){
					this.file.toolbar.show("all-download");
				}
				if(!this.config.remove || this.status.count === 0){
					this.file.toolbar.hide("all-remove");
				}else if(this.status.count > 0){
					this.file.toolbar.show("all-remove");
				}
				if(this.status.count > 1){
					var sortItem							= this.file.toolbar.data.getItem("sort");
					var sortId								= "";
					for(var i = 0; i < sortItem.items.length; i++){
						if(sortItem.items[i].value === sortItem.value){
							sortId							= sortItem.items[i].id;
							break;
						}
					}
					if(!xui.valid.isEmpty(sortId)){
						this._clickToolbar(sortId);
					}
				}
			}
		},
		_validFile : function(config){
			var isValid										= true;
			
			return isValid;
		}
	};
	/*	file(fileExt) 관련확장 개발 S*/
	xui.module.fileExt	= function(config, element){
		if(!xui.valid.isEmpty(element.fileController)){
			element.fileController.destroy();
		}
		if(this._validFile(config)){
			/* Wrapping file container element */
			element.innerHTML								= "";
			var container									= document.createElement("div"), title = element.getAttribute("xui-tooltip-title");
			container.id									= element.id + "_container";
			container.className								= "xui-file-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);
			if(xui.valid.isEmpty(title)){
				title										= element.id + "FILE";
				element.setAttribute("xui-tooltip-title", title);
			}
			element.classList.add("xui-file");
			element.fileController							= this;
			this.element									= element;
			
			/* Define file configuration */
			config.baseId									= this.element.id;
			config.title									= title;
			config.type										= "FILE";
			config.dialog									= xui.valid.isEmpty(config.dialog)				?	false																				:	config.dialog;
			config.width									= xui.valid.isEmpty(config.width)				?	600																					:	config.width;
			config.height									= xui.valid.isEmpty(config.height)				?	350																					:	config.height;
			config.modal									= xui.valid.isEmpty(config.modal)				?	false																				:	config.modal;
			config.mode										= xui.valid.isEmpty(config.mode)				?	"grid"																				:	config.mode;
			config.header									= xui.valid.isEmpty(config.header)				?	true																				:	config.header;
			config.upload									= xui.valid.isEmpty(config.upload)				?	true																				:	config.upload;
			config.download									= xui.valid.isEmpty(config.download)			?	true																				:	config.download;
			config.remove									= xui.valid.isEmpty(config.remove)				?	true																				:	config.remove;
			config.dnd										= xui.valid.isEmpty(config.dnd)					?	true																				:	config.dnd;
			config.uploadUrl								= xui.valid.isEmpty(config.uploadUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/tempUploadFileExt.json"	:	config.uploadUrl;
			config.downloadUrl								= xui.valid.isEmpty(config.downloadUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/downloadFileExt.json"		:	config.downloadUrl;
			config.previewUrl								= xui.valid.isEmpty(config.previewUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/getFileExtStream.json"	:	config.previewUrl;
			config.autoUpload								= xui.valid.isEmpty(config.autoUpload)			?	true																				:	config.autoUpload;
			config.autoRemove								= xui.valid.isEmpty(config.autoRemove)			?	true																				:	config.autoRemove;
			config.maxCount									= xui.valid.isEmpty(config.maxCount)			?	50																					:	config.maxCount;
			config.limitSize								= xui.valid.isEmpty(config.limitSize)			?	xui.com.getAppMaxUploadSize()														:	(xui.com.getAppMaxUploadSize() < config.limitSize ? xui.com.getAppMaxUploadSize() : config.limitSize);
			config.limitSizePerFile							= xui.valid.isEmpty(config.limitSizePerFile)	?	xui.com.getAppMaxUploadSizePerFile()												:	(xui.com.getAppMaxUploadSizePerFile() < config.limitSizePerFile ? xui.com.getAppMaxUploadSizePerFile() : config.limitSizePerFile);
			config.extraDropArea							= xui.valid.isEmpty(config.extraDropArea)		?	null																				:	config.extraDropArea;
			config.allowExtension							= xui.valid.isEmpty(config.allowExtension)		?	null																				:	config.allowExtension;
			config.allowDuple								= xui.valid.isEmpty(config.allowDuple)			?	false																				:	config.allowDuple;
			
			if(config.dialog){container.classList.add("xui-invisible");}
			if(!config.upload){this.element.classList.add("disableUpload");}
			if(!config.download){this.element.classList.add("disableDownload");}
			if(!config.remove){this.element.classList.add("disableRemove");}
			if(!config.dnd){this.element.classList.add("disableDnd");}
			
			this.config										= config;
			
			/*dialog window 모드에 따른 생성*/
			this.dialogController							= this._createDialog(container);
			/*dhtmlx vault component load*/
			this.file										= new dhx.Vault(element, {
				uploader				: {
					target				: config.uploadUrl,
					downloadURL			: config.downloadUrl,
					autosend			: config.autoUpload,
					fieldName			: "xuifile",
					params				: "",
					singleRequest		: true,
					updateFromResponse	: true
				},
				progressBar				: {
					template			: function(percent, extra){
						return xui.format.filesize.getData(extra.current, extra.current) + "/" + xui.format.filesize.getData(extra.total, extra.total);
					}
				},
				mode					: config.mode,
				customScroll			: false,
				scaleFactor				: 4,
				toolbar					: config.header,
				enableDnd				: (config.upload && config.dnd)
			});
			this.file.element								= element;
			var _this										= this;
			dhx.awaitRedraw().then(function(){
				if(!config.upload){
					_this.file.uploader.unlinkDropArea();
					delete _this.file._layout.config.on;
					_this.file._layout.paint();
					_this._redraw();
				}
			});
			/*헤더 control*/
			this._drawHeader();
			/*파일 추가 전 event*/
			this.file.events.on("BeforeAdd", function(item){
				return this.element.fileController._beforeAdd(item);
			});
			/*파일 추가 후 event*/
			this.file.events.on("AfterAdd", function(item, evt){
				this.element.fileController._afterAdd(item);
			});
			/*파일 업로드 전 event*/
			this.file.events.on("BeforeUploadFile", function(files){
				return this.element.fileController._beforeUpload(files);
			});
			/*파일당 업로드 후 event*/
			this.file.events.on("UploadFile", function(item, extra){
				this.element.fileController._uploading(item, extra);
			});
			/*전체파일 업로드 중 event*/
			this.file.events.on("UploadComplete", function(item){
				this.element.fileController._finishUpload(item);
			});
			/*파일 삭제 전 event*/
			this.file.events.on("BeforeRemove", function(item){
				if(this.selectedItem === item.id){
					this.selectedItem						= null;
				}
				return true;
			});
			/*파일 삭제 후 event*/
			this.file.events.on("AfterRemove", function(item){
				this.element.fileController._afterRemove(item);
			});
			/*파일 전체 삭제 후 event*/
			this.file.events.on("removeAll", function(){
				this.element.fileController._afterAllRemove();
				this.selectedItem							= null;
			});
			/*단일 파일 다운로드 전 event*/
			this.file.events.on("Download", function(item){
				if(!xui.valid.isEmpty(item.fileGroupKey) && !xui.valid.isEmpty(item.fileKey)){
					this.element.fileController.download(item.fileKey);
				}
			});
			this.status										= {};
			this.status.removeFiles							= {};
			this.status.size								= 0;
			this.status.count								= 0;
			this.status.validation							= "";
			this.status.helper								= "업로드제한 : 최대 " +  (this.config.maxCount <= 0 ? "<i class='xfi xfi-ico_0079_build'></i>" : xui.format.number.getData(this.config.maxCount)) + "개 / 1파일당 " + xui.format.filesize.getData(this.config.limitSizePerFile) + " / 전체 " + xui.format.filesize.getData(this.config.limitSize);
			if(xui.valid.isArray(this.config.allowExtension) && this.config.allowExtension.length > 0){
				this.status.helper							+= "<br/>확장자제한 : ";
				for(var i = 0; i < this.config.allowExtension.length; i++){
					this.status.helper						+= (this.config.allowExtension[i] + ","); 
				}
				this.status.helper							= this.status.helper.substr(0, this.status.helper.length-1);
			}
			this.parent										= element.parentNode.parentNode;
			this.fileGroupKey								= null;
			
			return this;
		}
	};
	xui.module.fileExt.prototype	= {
		init : function(){
			this.file.data.removeAll();
			this.status.removeFiles							= {};
			this.status.validation							= "";
			this.file.selectedItem							= null;
			this.fileGroupKey								= null;
		},
		destroy : function(){
			if(!xui.valid.isEmpty(this.file)){
				var originElement							= document.createElement("div");
				originElement.id							= this.element.id;
				originElement.setAttribute("xui-tooltip-title", this.element.getAttribute("xui-tooltip-title"));
				this.file.destructor();
				if(this.config.dialog){
					this.close();
					this.dialogController.destroy();
				}
				this.parent.innerHTML						= "";
				this.parent.appendChild(originElement);
				delete this.status;
				delete this.config;
				delete this.element;
				delete this.file;
			}
		},
		open : function(){
			if(this.config.dialog){
				this.dialogController.open();
			}
		},
		close : function(){
			if(this.config.dialog){
				this.dialogController.close();
			}
		},
		changeViewerMode : function(mode){
			if(!xui.valid.isEmpty(mode) && this.config.mode !== mode){
				mode										= mode.toLowerCase();
				if(mode === "grid" || mode === "list"){
					this.config.mode						= mode;
					this.file.config.mode					= mode;
					this.file.toolbar.data.update((mode === "grid" ? "list" : "grid") + "mode", {active:false});
					this.file.toolbar.data.update(mode + "mode", {active:true});
					this.file._vaultView.paint();
				}
			}
		},
		getData : function(fileKey){
			var data										= null;
			if(!xui.valid.isEmpty(fileKey)){
				if(this.isExist(fileKey)){
					var fileGroupKey						= this.getFileGroupKey();
					data									= this.file.data.find(function(item){
						return (item.fileGroupKey === fileGroupKey && item.fileKey === fileKey);
					});
				}else{
					data									= this.file.data.getItem(this.file.selectedItem);
				}
			}else if(!xui.valid.isEmpty(this.file.selectedItem)){
				data										= this.file.data.getItem(this.file.selectedItem);
			}
			if(xui.valid.isEmpty(data) || (xui.valid.isArray(data) && data.length === 0)){
				data										= null;
			}
			return data;
		},
		getAllData : function(){
			var data										= null;
			if(this.getCount() > 0){
				data										= this.file.data.serialize();
				if(xui.valid.isEmpty(data) || (xui.valid.isArray(data) && data.length === 0)){
					data									= null;
				}
			}
			return data;
		},
		getChangedData : function(){
			var data										= [];
			if(this.getCount() > 0){
				data										= this.file.data.findAll(function(item){
					if(item.DATA_FLAG !== xui.enum.TRANSACTION_NONE.getCode()){
						return true;
					}
				});
			}
			if(Object.keys(this.status.removeFiles).length > 0){
				if(xui.valid.isArray(data)){
					for(var key in this.status.removeFiles){
						data.push(this.status.removeFiles[key]);
					}
				}else{
					data									= xui.util.copyObject(data, this.status.removeFiles);
				}
			}
			if(data.length === 0){
				data										= null;
			}
			return data;
		},
		getUploadedData : function(){
			var data										= null;
			if(this.getCount() > 0){
				data										= this.file.data.findAll(function(item){
					if(item.DATA_FLAG !== xui.enum.TRANSACTION_INSERT.getCode()){
						return true;
					}
				});
				if(xui.valid.isEmpty(data) || (xui.valid.isArray(data) && data.length === 0)){
					data									= null;
				}
			}
			return data;
		},
		getUploadReadyData : function(){
			var data										= null;
			if(this.getCount() > 0){
				data										= this.file.data.findAll(function(item){
					if(item.DATA_FLAG === xui.enum.TRANSACTION_INSERT.getCode()){
						return true;
					}
				});
				if(xui.valid.isEmpty(data) || (xui.valid.isArray(data) && data.length === 0)){
					data									= null;
				}
			}
			return data;
		},
		setFileGroupKey : function(fileGroupKey){
			this.fileGroupKey = fileGroupKey;
		},
		getFileGroupKey : function(){
			return this.fileGroupKey;
		},
		getSize : function(){
			return this.status.size;
		},
		getCount : function(){
			return this.status.count;
		},
		getAvailableSize : function(){
			return this.config.limitSize;
		},
		getAvailableSizePerFile : function(){
			return this.config.limitSizePerFile;
		},
		getAvailableCount : function(){
			return this.config.maxCount;
		},
		addFile : function(){
			this.file.uploader.selectFile();
		},
		addUploadedFile : function(fileGroupKey, fileKey, statusAt){
			var _this										= this;
			if(!xui.valid.isEmpty(fileGroupKey)){
				if(xui.valid.isEmpty(_this.fileGroupKey) || _this.fileGroupKey === fileGroupKey){
					var param								= new xui.json();
					param.setURL(xui.com.getRequestPrefix() + "/getUploadedFileExtData.json");
					param.setString("fileGroupKey"	,fileGroupKey);
					param.setString("fileKey"		,xui.valid.isEmpty(fileKey) ? "" : fileKey);
					param.setString("downloadUrl"	,_this.config.downloadUrl);
					if(!xui.valid.isEmpty(statusAt)){
						param.setString("statusAt"	,statusAt);
					}
					param.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
					param.setCallBack(function(response, request){
						if(!response.getErrorFlag()){
							if(response.getCount() > 0){
								//LYH 20220609 첨부파일 화면 표시 특수문자 미 변경에 따른 restoreXSS 기능 추가
								var data					= xui.util.restoreXSS(response.getDataJsonArray());
								for(var i = 0; i < data.length; i++){
									if(!xui.valid.isEmpty(data[i].preview)){
										data[i].preview		= _this.config.previewUrl + xui.ajax.convertGetMethodParam({"fileGroupKey":data[i].fileGroupKey,"fileKey":data[i].fileKey,"authType":xui.enum.AUTH_TYPE_NONE.getCode()});
									}
									_this.file.data.add(data[i]);
								}
								_this.fileGroupKey			= fileGroupKey;
							}
						}else{
							xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
						}
					});
					xui.ajax.callService(param);
				}
			}
		},
		upload : function(byForce){
			var _this										= this;
			if(_this.getCount() > 0 && _this.config.upload || byForce){
				if(!xui.valid.isEmpty(this.getUploadReadyData())){
					this.file.uploader.send();
				}
			}
		},
		download : function(fileKey, byForce){
			var _this										= this;
			if(_this.getCount() > 0 && (_this.config.download || byForce)){
				var file									= _this.getData(fileKey);
				if(!xui.valid.isEmpty(file)){
					var isValid								= true;
					if(typeof(_this.config.onBeforeDownload) === "function"){
						isValid								= this.config.onBeforeDownload.call(_this, file);
						if(xui.valid.isEmpty(isValid)){
							isValid							= true;
						}
					}
					if(isValid){
						xui.ajax.downloadFile([{"fileGroupKey":file.fileGroupKey,"fileKey":file.fileKey}]);
					}
				}
			}
		},
		downloadAll : function(byForce, showConfirm){
			var _this										= this;
			if(_this.getCount() > 0 && (_this.config.download || byForce)){
				var uploaded								= _this.getUploadedData();
				if(!xui.valid.isEmpty(uploaded)){
					var isValid								= true;
					if(typeof(_this.config.onBeforeDownload) === "function"){
						isValid								= _this.config.onBeforeDownload.call(_this, data);
						if(xui.valid.isEmpty(isValid)){
							isValid							= true;
						}
					}
					if(isValid){
						if(xui.valid.isEmpty(showConfirm)){
							showConfirm						= true;
						}
						for(var i = 0; i < data.length; i++){
							uploaded[i]						= {"fileGroupKey":uploaded[i].fileGroupKey,"fileKey":uploaded[i].fileKey};
						}
						xui.dialog.confirm(xui.enum.BIG_FILE_SIZE.getName() + "(" + xui.format.filesize.getData(_this.getSize()) + ") " + xui.enum.TAKE_SOME_TIME.getName(), xui.enum.DOWNLOAD_CONFIRM.getName(), function(isConfirm){
							if(isConfirm){
								xui.ajax.downloadFile(uploaded);
							}
						}, (!showConfirm || (_this.getSize() <= 1024*1024*100)));
					}
				}
			}
		},
		deleteFile : function(fileId, byForce){
			var _this										= this;
			if(_this.getCount() > 0 && (_this.config.remove || byForce)){
				var item									= this.file.data.getItem(fileId);
				if(!xui.valid.isEmpty(item)){
					if(item.DATA_FLAG !== xui.enum.TRANSACTION_INSERT.getCode()){
						this.status.removeFiles[fileId]		= xui.util.copyObject({}, item);
					}
					this.file.data.remove(fileId);
				}
			}
		},
		deleteUploadedFile : function(fileKey, byForce){
			var _this										= this;
			if(_this.getCount() > 0 && (_this.config.remove || byForce)){
				var file									= _this.getData(fileKey);
				if(!xui.valid.isEmpty(file)){
					var doDelete							= true;
					if(typeof(_this.config.onBeforeRemove) === "function"){
						doDelete							= _this.config.onBeforeRemove.call(_this, file);
						if(xui.valid.isEmpty(doDelete)){
							doDelete						= true;
						}
					}
					if(doDelete){
						var param							= new xui.json();
						param.setURL(xui.com.getRequestPrefix() + "/tempDeleteFileExt.json");
						param.setString("fileGroupKey"	, file.fileGroupKey);
						param.setString("fileKey"		, file.fileKey);
						param.setString("fileStatus"	, "D");
						param.setAuthType(xui.enum.TRANSACTION_DELETE.getCode());
						param.setCallBack(function(response, request){
							if(!response.getErrorFlag()){
								_this.file.data.remove(file.id);
							}else{
								xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
							}
						});
						xui.ajax.callService(param);
					}
				}
			}
		},
		deleteAll : function(byForce){
			var _this										= this;
			if(_this.getCount() > 0 && (_this.config.remove || byForce)){
				var allFileData								= this.getAllData();
				var uploaded								= _this.getUploadedData();
				var isValid									= true;
				if(typeof(_this.config.onBeforeRemove) === "function"){
					isValid									= _this.config.onBeforeRemove.call(_this, allFileData);
					if(xui.valid.isEmpty(isValid)){
						isValid								= true;
					}
				}
				if(isValid){
					if(!xui.valid.isEmpty(uploaded)){
						for(var i = 0; i < uploaded.length; i++){
							uploaded[i]						= {"fileGroupKey":uploaded[i].fileGroupKey,"fileKey":uploaded[i].fileKey, "fileStatus":"D"};
						}
						var param							= new xui.json();
						param.setURL(xui.com.getRequestPrefix() + "/tempDeleteFileExt.json");
						param.setDataJsonArray(uploaded);
						param.setAuthType(xui.enum.TRANSACTION_DELETE.getCode());
						param.setCallBack(function(response, request){
							if(!response.getErrorFlag()){
								_this.file.data.removeAll();
							}else{
								xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
							}
						});
						xui.ajax.callService(param);
					}else{
						_this.file.data.removeAll();
					}
				}
			}
		},
		isExist : function(fileKey){
			var exist										= false;
			var fileGroupKey								= this.getFileGroupKey();
			if(this.getCount() > 0 && !xui.valid.isEmpty(fileGroupKey) && !xui.valid.isEmpty(fileKey)){
				var file									= this.file.data.find(function(item){
					return (item.fileGroupKey === fileGroupKey && item.fileKey === fileKey);
				});
				exist										= !xui.valid.isEmpty(file);
			}
			return exist;
		},
		linkDropArea : function(element){
			element											= xuic.__DOM.getElement(element);
			if(xui.valid.isElement(element)){
				this.file.uploader.linkDropArea(element);
			}
		},
		_createDialog : function(container){
			var dialogController							= null;
			if(this.config.dialog){
				dialogController							= new xui.module.dialog({
					header				: true,
					title				: xui.enum.ATTACHMENT.getName(),
					width				: this.config.width,
					height				: this.config.height,
					modal				: this.config.modal,
					resizable			: false,
					closable			: true,
					movable				: true,
					open				: function(){
						if(typeof(this.config.onOpen) === "function"){
							return this.config.onOpen.call(dialogController);
						}
					},
					close				: function(){
						if(typeof(this.config.onClose) === "function"){
							return this.config.onClose.call(dialogController);
						}
					}
				}, container);
			}
			return dialogController;
		},
		_drawHeader : function(){
			if(this.config.header){
				var idx										= this.config.upload ? 2 : 1;
				var objFile									= this.file;
				if(this.config.download){
					this.file.toolbar.data.add({
						type			: "navItem",
						id				: "all-download",
						tooltip			: xuic.__i18n.getLabel("allDownload"),
						icon			: "xfi xfi-ico_0068_download",
						hidden			: true
					}, idx++);
				}
				this.file.toolbar.data.add({
					type				: "navItem",
					id					: "config",
					tooltip				: xuic.__i18n.getLabel("showConfig"),
					icon				: "xfi xfi-ico_0079_build"
				}, idx++);
				this.file.toolbar.data.add({
					type				: "navItem",
					id					: "calc",
					icon				: "xfi xfi-ico_0080_calculate"
				}, idx++);
				this.file.toolbar.data.add({
					type				: "separator"
				}, idx++);
				this.file.toolbar.data.add({
					id					: "listmode",
					type				: "navItem",
					icon				: "xfi xfi-ico_0037_reorder",
					group				: "viewmode",
					twoState			: true,
					active				: (this.config.mode === "list")
				}, idx++);
				this.file.toolbar.data.add({
					id					: "gridmode",
					type				: "navItem",
					icon				: "xfi xfi-ico_0081_view_module",
					group				: "viewmode",
					twoState			: true,
					active				: (this.config.mode === "grid")
				}, idx++);
				var sortItems								= [
					{id:"recentDate"	,value:xuic.__i18n.getLabel("recentDate")		,icon:"xfi xfi-ico_0100_sort_new"},
					{id:"pastDate"		,value:xuic.__i18n.getLabel("pastDate")			,icon:"xfi xfi-ico_0099_sort_old"},
					{id:"smallsize"		,value:xuic.__i18n.getLabel("smallSize")		,icon:"xfi xfi-ico_0101_sort_small"},
					{id:"bigsize"		,value:xuic.__i18n.getLabel("bigSize")			,icon:"xfi xfi-ico_0102_sort_large"},
					{id:"filename"		,value:xuic.__i18n.getLabel("fileName")			,icon:"xfi xfi-ico_0103_sort_name"},
					{id:"extension"		,value:xuic.__i18n.getLabel("fileExtension")	,icon:"xfi xfi-ico_0104_file_format"}
				];
				this.file.toolbar.data.add({
					type				: "selectButton",
					value				: sortItems[0].value,
					id					: "sort",
					icon				: "xfi xfi-ico_0100_sort_new",
					tooltip				: xuic.__i18n.getLabel("sortOrder"),
					items				: sortItems
				}, idx++);
				this.file.toolbar.data.add({
					type				: "input",
					value				: "",
					id					: "filter",
					label				: false,
					icon				: "xfi xfi-ico_0075_filter",
					placeholder			: "Search",
					hidden				: (((this.config.dialog && this.config.width <= 700) || this.element.offsetWidth <= 700) ? true : false)
				}, idx++);
				this.file.toolbar.events.on("Click", function(id, e){
					var fileController						= this._view.node.el.parentNode.parentNode.parentNode.fileController;
					fileController._clickToolbar(id, e);
				});
				this.file.toolbar.events.on("InputKeyup", function(id){
					var fileController						= this._view.node.el.parentNode.parentNode.parentNode.fileController;
					var inputValue							= this.getState()[id];
					var count								= fileController.getCount();
					if(count > 0){
						fileController.file.data.filter(function(item){
							if(!xui.valid.isEmpty(inputValue)){
								return item.name.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
							}else{
								return true;
							}
						});
					}
				});
				this.file.toolbar.data.add({
					type				: "navItem",
					id					: "all-remove",
					tooltip				: xuic.__i18n.getLabel("clearAll"),
					icon				: "xfi xfi-ico_0042_delete",
					hidden				: true
				}, (idx+2));
				var hideFeatures							= [];
				if(!this.config.upload){
					hideFeatures.push("add");
					hideFeatures.push("upload");
				}
				if(!this.config.download){
					hideFeatures.push("all-download");
				}
				if(!this.config.remove){
					hideFeatures.push("remove-all");
				}
				if(hideFeatures.length > 0){
					this.file.toolbar.hide(hideFeatures);
				}
			}
		},
		_clickToolbar : function(id, ev){
			switch(id){
				case "recentDate"	:
				case "pastDate"		:
					this.file.data.sort({
						by	: "createDt",
						dir	: (id === "recentDate" ? "desc" : "asc")
					});
					break;
				case "smallsize"	:
				case "bigsize"		:
					this.file.data.sort({
						by	: "size",
						dir	: (id === "bigsize" ? "desc" : "asc")
					});
					break;
				case "filename"		:
					this.file.data.sort({
						by	: "name",
						dir	: "asc"
					});
					break;
				case "extension"	:
					this.file.data.sort({
						rule : function(a, b){
							var aExt						= a.name.split(".").pop();
							var bExt						= b.name.split(".").pop();
							return aExt === bExt ? (a.name > b.name ? 1 : -1) : (aExt > bExt ? 1 : -1);
						}
					});
					break;
				case "all-download" :
					this.downloadAll(true);
					break;
				case "config"		:
					xuic.__COM.showMessageTip(ev.target, this.status.helper, "", 10000);
					break;
				case "gridmode"		:
					this.changeViewerMode("grid");
					break;
				case "listmode"		:
					this.changeViewerMode("list");
					break;
				case "calc"			:
					xuic.__COM.showMessageTip(ev.target, xui.format.filesize.getData(this.getSize()) + " / " + xui.format.filesize.getData(this.getAvailableSize()), "", 10000);
					break;
				case "all-remove"	:
					if(this.config.remove && this.getCount() > 0){
						var uploaded								= this.getUploadedData();
						if(this.config.autoRemove && !xui.valid.isEmpty(uploaded)){
							this.deleteAll();
							return;
						}
						if(!this.config.autoRemove && !xui.valid.isEmpty(uploaded)){
							var isValid								= true;
							if(typeof(this.config.onBeforeRemove) === "function"){
								isValid								= this.config.onBeforeRemove.call(this, uploaded);
								if(xui.valid.isEmpty(isValid)){
									isValid							= true;
								}
							}
							if(isValid){
								for(var i = 0; i < uploaded.length; i++){
									this.status.removeFiles[uploaded[i].id] = uploaded[i];
								}
								this.file.data.removeAll();
							}
						}else if(xui.valid.isEmpty(uploaded)){
							this.file.data.removeAll();
						}
					}
					break;
				default	:
					break;
			};
		},
		_removeFile : function(item){
			var dataFlag									= item.DATA_FLAG;
			if(dataFlag === xui.enum.TRANSACTION_INSERT.getCode()){
				this.file.data.remove(item.id);
			}else{
				if(this.config.autoRemove){
					this.deleteUploadedFile(item.fileGroupKey, item.fileKey);
				}else{
					this.status.removeFiles[item.id]		= xui.util.copyObject({}, item);
					this.file.data.remove(item.id);
				}
			}
		},
		_beforeAdd : function(item){
			var isValid										= true;
			var _this										= this;
			var config										= _this.config;
			if(config.upload || (!config.upload && item.DATA_FLAG !== xui.enum.TRANSACTION_INSERT.getCode())){
				if(!xui.valid.isEmpty(_this.timeout)){
					clearTimeout(_this.timeout);
					_this.timeout							= null;
				}
				var message									= "";
				if(xui.valid.isArray(config.allowExtension) && config.allowExtension.length > 0){
				    var extension;
				    // 신규 첨부파일 추가가 아닌 수정 및 임시저장 케이스에서 file 공통 api 함수 호출 시 item 구조가 상이하여 분기처리함
				    if(!xui.valid.isEmpty(item.file)){
					    extension							= item.file.name.split(".").pop().toLowerCase();
				    }else{
				        extension							= item.name.split(".").pop().toLowerCase();
				    }
					if(config.allowExtension.indexOf(extension) < 0){
						message								= item.file.name + xui.enum.NOT_ALLOWED_EXTENSION.getName();
						isValid								= false;
					}
				}
				if(isValid && config.limitSizePerFile < (item.size || item.file.size)){
					message									= item.file.name + xui.enum.OVER_UPLOAD_SIZE_PER_FILE.getName();
					isValid									= false;
				}
				if(isValid && config.limitSize <= (_this.status.size + (item.size || item.file.size))){
					message									= item.file.name + xui.enum.OVER_MAX_UPLOAD_SIZE.getName();
					isValid									= false;
				}
				if(isValid && config.maxCount <= _this.status.count){
					message									= item.file.name + xui.enum.OVER_MAX_FILE_SIZE.getName();
					isValid									= false;
				}
				if(isValid && !config.allowDuple){
					var findItem							= this.file.data.find(function(compareItem){
						if(
							((compareItem.name || compareItem.file.name) === (item.name || item.file.name)) ||
							(!xui.valid.isEmpty(item.fileGroupKey) && !xui.valid.isEmpty(item.fileKey) && item.fileGroupKey === compareItem.fileGroupKey && item.fileKey === compareItem.fileKey)
						)
						{
							return true;
						}
					});
					if(!xui.valid.isEmpty(findItem)){
						message								= (item.name || item.file.name) + " " + xui.enum.EXIST_FILE.getName();
						isValid								= false;
					}
				}
				if(!isValid){
					_this.status.validation					+= (message + "<br/>");
				}
			}else{
				message										= xui.enum.DISABLE_UPLOAD.getName();
				isValid										= false;
				_this.status.validation						+= (message + "<br/>");
			}
			if(!xui.valid.isEmpty(_this.status.validation)){
				_this.timeout								= setTimeout(function(){
					clearTimeout(_this.timeout);
					_this.timeout							= null;
					if(!xui.valid.isEmpty(_this.status.validation)){
						xuic.__COM.showMessageTip(_this.element.querySelector(".vault-topbar"), new String(_this.status.validation), "E", 10000);
						_this.status.validation				= "";
					}
				}, 100);
			}
			
			if(isValid){
				if(xui.valid.isEmpty(item.DATA_FLAG)){
					item.DATA_FLAG							= xui.enum.TRANSACTION_INSERT.getCode();
				}
				if(xui.valid.isEmpty(item.createDt)){
					var now									= new Date();
					item.createDt							= now.getFullYear() +
					xui.util.lpad(now.getMonth() + 1	,2	,"0") +
					xui.util.lpad(now.getDate()			,2	,"0") +
					xui.util.lpad(now.getHours()		,2	,"0") +
					xui.util.lpad(now.getMinutes()		,2	,"0") +
					xui.util.lpad(now.getSeconds()		,2	,"0") +
					xui.util.lpad(now.getMilliseconds(), 3	,"0");
				}
				if(typeof(config.onBeforeAdd) === "function"){
					isValid									= config.onBeforeAdd.call(this, item);
					if(xui.valid.isEmpty(isValid)){
						isValid								= true;
					}
				}
			}
			return isValid;
		},
		_afterAdd : function(item){
			if(typeof(this.config.onAdded) === "function"){
				this.config.onAdded.call(this, item);
			}
			this._redraw();
		},
		_beforeUpload : function(files){
			var isValid										= true;
			if(this.getCount() > 0 && !xui.valid.isEmpty(this.getUploadReadyData())){
				if(typeof(this.config.onBeforeUpload) === "function"){
					isValid									= this.config.onBeforeUpload.call(this, files);
					if(xui.valid.isEmpty(isValid)){
						isValid								= true;
					}
				}
			}else{
				isValid										= false;
			}
			return isValid;
		},
		_uploading : function(item, extra){
			var response									= new xui.json(extra);
			if(!response.getErrorFlag()){
				item.link									= this.config.downloadUrl;
				item.DATA_FLAG								= xui.enum.TRANSACTION_UPDATE.getCode();
				delete item.request;
			}else{
				xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
			}
		},
		_finishUpload : function(item){
			if(xui.valid.isJson(item)){
				item										= [item];
			}
			if(xui.valid.isArray(item)){
				this.fileGroupKey							= item[0].fileGroupKey;
				if(typeof(this.config.onUploaded) === "function"){
					this.config.onUploaded.call(this, item);
				}
			}
			this._redraw();
		},
		/* onRemoved 사용을 위해 로직 추가 S */
		_afterRemove : function(item){
			if(xui.valid.isJson(item)){
				item										= [item];
			}
			if(xui.valid.isArray(item)){
				this.fileGroupKey							= item[0].fileGroupKey;
				if(typeof(this.config.onRemoved) === "function"){
					this.config.onRemoved.call(this, item);
				}
			}
			this._redraw();
		},
		_afterAllRemove : function(){
			if(typeof(this.config.onRemoved) === "function"){
				this.config.onRemoved.call(this);
			}
			this._redraw();
		},
		/* onRemoved 사용을 위해 로직 추가 E */
		_getRequestFormData : function(fileWrappers, params){
			var fieldName									= this.file.uploader.config.fieldName;
			var formData									= new FormData();
			var brackets									= fileWrappers.length > 1 ? "[]" : "";
			var param										= new xui.json();
			for(var i = 0; i < fileWrappers.length; i++){
				formData.append(fieldName + brackets, fileWrappers[i].file, fileWrappers[i].file.name);
				param.setString("fileId"	,fileWrappers[i].id		,i);
				param.setString("fileName"	,fileWrappers[i].name	,i);
				if(fileWrappers[i].hasOwnProperty("requestData") && xui.valid.isJson(fileWrappers[i].requestData)){
					var keys								= Object.keys(fileWrappers[i].requestData);
					var size								= keys.length;
					for(var j = 0; j < size; j++){
						param.setObject(keys[j], fileWrappers[i].requestData[keys[j]], i);
					}
				}
			}
			param.setString("menuKey"		,xui.extends.menu.getKey());
			param.setString("subFilePath"	,"attachFile");
			param.setString("fileGroupKey"	,xui.valid.isEmpty(this.fileGroupKey) ? "" : this.fileGroupKey);
			param.setAuthType(xui.enum.AUTH_TYPE_CREATE.getCode());
			var ajaxFormData								= new xui._AjaxForm(param);
			ajaxFormData._setEncrypt();
			formData.append("jsonData", JSON.stringify(ajaxFormData.request.getJson()));
			return formData;
		},
		_redraw : function(){
			this.status.count								= this.file.data.getLength();
			this.status.size								= this.file.data.reduce(function(new_item, item){
				return new_item + (item.size || item.file.size);
			}, 0);
			if(this.config.header){
				var uploaded								= this.getUploadedData();
				var uploadReady								= this.getUploadReadyData(); 
				if(!this.config.upload || xui.valid.isEmpty(uploadReady)){
					this.file.toolbar.hide("upload");
					this.file.toolbar.hide("config");
				}else if(!xui.valid.isEmpty(uploadReady)){
					this.file.toolbar.show("upload");
					this.file.toolbar.show("config");
				}
				if(!this.config.download || xui.valid.isEmpty(uploaded)){
					this.file.toolbar.hide("all-download")
				}else if(!xui.valid.isEmpty(uploaded)){
					this.file.toolbar.show("all-download");
				}
				if(!this.config.remove || this.status.count === 0){
					this.file.toolbar.hide("all-remove");
				}else if(this.status.count > 0){
					this.file.toolbar.show("all-remove");
				}
				if(this.status.count > 1){
					var sortItem							= this.file.toolbar.data.getItem("sort");
					var sortId								= "";
					for(var i = 0; i < sortItem.items.length; i++){
						if(sortItem.items[i].value === sortItem.value){
							sortId							= sortItem.items[i].id;
							break;
						}
					}
					if(!xui.valid.isEmpty(sortId)){
						this._clickToolbar(sortId);
					}
				}
			}
		},
		_validFile : function(config){
			var isValid										= true;
			
			return isValid;
		}
	};
	/*	file(fileExt) 관련확장 개발 E*/

	xui.module.pivot	= function(config, element){
		if(!xui.valid.isEmpty(element.pivotController)){
			element.pivotController.destroy();
		}
		if(this._validPivot(config)){
			/* Wrapping pivot container element */
			element.innerHTML								= "";
			var container									= document.createElement("div"), title = element.getAttribute("xui-tooltip-title");
			container.className								= "xui-pivot-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);
			if(xui.valid.isEmpty(title)){
				title										= element.id + "PIVOT";
				element.setAttribute("xui-tooltip-title", title);
			}
			element.classList.add("xui-pivot");
			
			element.pivotController							= this;
			this.element									= element;
			
			/* Define pivot configuration */
			config.baseId									= element.id;
			config.title									= title;
			config.type										= "PIVOT";
			
			
			this.config										= config;
			
			this.status										= {};
			
			this.pivot										= new dhx.Pivot(element, {
				fields		: config.fields,
				fieldList	: config.fieldList,
				layout		: config.layout
			});
			
			this.pivot.element								= element;
			
			return this;
		}
	};
	xui.module.pivot.prototype	= {
		destroy : function(){
			if(!xui.valid.isEmpty(this.pivot)){
				var parent									= this.element.parentNode.parentNode;
				var originElement							= document.createElement("div");
				originElement.id							= this.element.id;
				originElement.setAttribute("xui-tooltip-title", this.element.getAttribute("xui-tooltip-title"));
				this.pivot.destructor();
				parent.innerHTML							= "";
				parent.appendChild(originElement);
				delete this.status;
				delete this.config;
				delete this.element;
				delete this.pivot;
			}
		},
		init : function(){
			var elementId									= this.element.id;
			var originalConfig								= xui.util.copyObject({}, this.config);
			this.destroy();
			this.element									= document.getElementById(elementId);
			this.config										= originalConfig;
			var container									= document.createElement("div");
			container.className								= "xui-pivot-container";
			this.element.parentNode.insertBefore(container, this.element);
			container.appendChild(this.element);
			this.element.classList.add("xui-pivot");
			this.status										= {};
			this.pivot										= new dhx.Pivot(this.element, this.config);
			this.pivot.element								= this.element;
			this.element.pivotController					= this;
		},
		_validPivot : function(config){
			var isValid										= true;
			
			return isValid;
		}
	};
	
	/*
	 * TO BE Develope..
	 */
	xui.module.autocomplete	= function(config, element){
		if(!xui.valid.isEmpty(element.acController)){
			element.acController.destroy();
		}
		if(this._validAutocomplete(config, element)){
			element											= xuic.__DOM.getElement(element);
			element.classList.add("xui-autocomplete-container");
			element.acController							= this;
			
			this.element									= element;
			
			this.config										= config;
			
			this.tabbar										= new dhx.Tabbar(element, config);
			this.tabbar.element								= element;
			
			this.param										= null;
			
			return this;
		}
	};
	xui.module.autocomplete.prototype	= {
		destroy : function(){
			
		},
		_validAutocomplete : function(config, element){
			var isValid										= true;
			if(!xui.valid.isElement(element) || element.tagName !== "INPUT"){
				isValid										= false;
				xui.dialog.error(xui.enum.AUTOCOMPLETE_LOAD_ERROR01.getName(), "AUTOCOMPLETE ERROR");
			}
			return isValid;
		}
	};
	
	xui.module.audio	= function(config, element){
		if(this._validAudio(config)){
			/* Wrapping audio container element */
			element.innerHTML								= "";
			var container									= document.createElement("div"), title = element.getAttribute("xui-tooltip-title");
			container.className								= "xui-audio-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);
			if(xui.valid.isEmpty(title)){
				title										= element.id + "AUDIO";
				element.setAttribute("xui-tooltip-title", title);
			}
			element.classList.add("xui-audio");
			element.audioController							= this;
			this.element									= element;
			
			/* Define audio configuration */
			config.baseId									= element.id;
			config.title									= title;
			config.type										= "AUDIO";
			
			/*
			config.dialog									= xui.valid.isEmpty(config.dialog)				?	false																			:	config.dialog;
			config.width									= xui.valid.isEmpty(config.width)				?	600																				:	config.width;
			config.height									= xui.valid.isEmpty(config.height)				?	350																				:	config.height;
			config.modal									= xui.valid.isEmpty(config.modal)				?	false																			:	config.modal;
			config.mode										= xui.valid.isEmpty(config.mode)				?	"grid"																			:	config.mode;
			config.header									= xui.valid.isEmpty(config.header)				?	true																			:	config.header;
			config.upload									= xui.valid.isEmpty(config.upload)				?	true																			:	config.upload;
			config.download									= xui.valid.isEmpty(config.download)			?	true																			:	config.download;
			config.remove									= xui.valid.isEmpty(config.remove)				?	true																			:	config.remove;
			config.dnd										= xui.valid.isEmpty(config.dnd)					?	true																			:	config.dnd;
			config.uploadUrl								= xui.valid.isEmpty(config.uploadUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/uploadFile.json"		:	config.uploadUrl;
			config.downloadUrl								= xui.valid.isEmpty(config.downloadUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/downloadFile.json"	:	config.downloadUrl;
			config.previewUrl								= xui.valid.isEmpty(config.previewUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/getFileStream.json"	:	config.previewUrl;
			config.autoUpload								= xui.valid.isEmpty(config.autoUpload)			?	true																			:	config.autoUpload;
			config.autoRemove								= xui.valid.isEmpty(config.autoRemove)			?	true																			:	config.autoRemove;
			config.maxCount									= xui.valid.isEmpty(config.maxCount)			?	50																				:	config.maxCount;
			config.limitSize								= xui.valid.isEmpty(config.limitSize)			?	xui.com.getAppMaxUploadSize()													:	(xui.com.getAppMaxUploadSize() < config.limitSize ? xui.com.getAppMaxUploadSize() : config.limitSize);
			config.limitSizePerFile							= xui.valid.isEmpty(config.limitSizePerFile)	?	xui.com.getAppMaxUploadSizePerFile()											:	(xui.com.getAppMaxUploadSizePerFile() < config.limitSizePerFile ? xui.com.getAppMaxUploadSizePerFile() : config.limitSizePerFile);
			config.extraDropArea							= xui.valid.isEmpty(config.extraDropArea)		?	null																			:	config.extraDropArea;
			config.allowExtension							= xui.valid.isEmpty(config.allowExtension)		?	null																			:	config.allowExtension;
			*/
			
			this.config										= config;
			
			this.status										= {};
			
			return this;
		}
	};
	xui.module.audio.prototype	= {
		_validAudio : function(config){
			var isValid										= true;
			return isValid;
		}	
	};
	
	/*
	 * TO BE Develope..
	 */
	xui.module.chart	= function(config, element){
		if(this._validChart(config)){
			/* Wrapping chart container element */
			element.innerHTML								= "";
			var container									= document.createElement("div"), title = element.getAttribute("xui-tooltip-title");
			container.className								= "xui-chart-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);
			if(xui.valid.isEmpty(title)){
				title										= element.id + "CHART";
				element.setAttribute("xui-tooltip-title", title);
			}
			element.classList.add("xui-chart");
			element.chartController							= this;
			this.element									= element;
			
			/* Define chart configuration */
			config.baseId									= element.id;
			config.title									= title;
			config.type										= "CHART";
			
			config.chartType								= xui.valid.isEmpty(config.type)				?	""															:	config.type;
			
			/*
			config.dialog									= xui.valid.isEmpty(config.dialog)				?	false																			:	config.dialog;
			config.width									= xui.valid.isEmpty(config.width)				?	600																				:	config.width;
			config.height									= xui.valid.isEmpty(config.height)				?	350																				:	config.height;
			config.modal									= xui.valid.isEmpty(config.modal)				?	false																			:	config.modal;
			config.mode										= xui.valid.isEmpty(config.mode)				?	"grid"																			:	config.mode;
			config.header									= xui.valid.isEmpty(config.header)				?	true																			:	config.header;
			config.upload									= xui.valid.isEmpty(config.upload)				?	true																			:	config.upload;
			config.download									= xui.valid.isEmpty(config.download)			?	true																			:	config.download;
			config.remove									= xui.valid.isEmpty(config.remove)				?	true																			:	config.remove;
			config.dnd										= xui.valid.isEmpty(config.dnd)					?	true																			:	config.dnd;
			config.uploadUrl								= xui.valid.isEmpty(config.uploadUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/uploadFile.json"		:	config.uploadUrl;
			config.downloadUrl								= xui.valid.isEmpty(config.downloadUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/downloadFile.json"	:	config.downloadUrl;
			config.previewUrl								= xui.valid.isEmpty(config.previewUrl)			?	xui.com.getContextPath() + xui.com.getRequestPrefix() + "/getFileStream.json"	:	config.previewUrl;
			config.autoUpload								= xui.valid.isEmpty(config.autoUpload)			?	true																			:	config.autoUpload;
			config.autoRemove								= xui.valid.isEmpty(config.autoRemove)			?	true																			:	config.autoRemove;
			config.maxCount									= xui.valid.isEmpty(config.maxCount)			?	50																				:	config.maxCount;
			config.limitSize								= xui.valid.isEmpty(config.limitSize)			?	xui.com.getAppMaxUploadSize()													:	(xui.com.getAppMaxUploadSize() < config.limitSize ? xui.com.getAppMaxUploadSize() : config.limitSize);
			config.limitSizePerFile							= xui.valid.isEmpty(config.limitSizePerFile)	?	xui.com.getAppMaxUploadSizePerFile()											:	(xui.com.getAppMaxUploadSizePerFile() < config.limitSizePerFile ? xui.com.getAppMaxUploadSizePerFile() : config.limitSizePerFile);
			config.extraDropArea							= xui.valid.isEmpty(config.extraDropArea)		?	null																			:	config.extraDropArea;
			config.allowExtension							= xui.valid.isEmpty(config.allowExtension)		?	null																			:	config.allowExtension;
			*/
			
			this.config										= config;
			
			this.status										= {};
			
			return this;
		}
	};
	xui.module.chart.prototype	= {
		_validChart : function(config){
			var isValid										= true;
			if(xui.valid.isEmpty(config.type)){
				isValid										= false;
				xui.dialog.error(xui.enum.CHART_LOAD_ERROR01.getName(), "CHART ERROR");
			}
			return isValid;
		}
	};
	
	/*
	 * TO BE Develop..
	 */
	xui.module.calendar	= function(config, element){
		if(this._validCalendar(config)){
			/* Wrapping chart container element */
			element.innerHTML								= "";
			var container									= document.createElement("div"), title = element.getAttribute("xui-tooltip-title");
			container.className								= "xui-calendar-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);
			if(xui.valid.isEmpty(title)){
				title										= element.id + "CALENDAR";
				element.setAttribute("xui-tooltip-title", title);
			}
			element.classList.add("xui-calendar");
			element.calendarController						= this;
			this.element									= element;
			
			
			
			
			
			
			this.config										= config;
			
			this.status										= {};
			
			return this;
		}
	};
	xui.module.calendar.prototype	= {
		_validCalendar : function(config){
			
		}
	};

	/*Define jQuery Extends*/
	if(xui.USE_JQUERY){
		$.fn.extend({
			/* The style function */
			style : function(styleName, value, priority){
				/* DOM node */
				var node									= this.get(0);
				/* Ensure we have a DOM node */
				if(typeof(node) === "undefined"){
					return this;
				}
				/* CSSStyleDeclaration */
				var style									= this.get(0).style;
				/* Getter/Setter */
				if(typeof(styleName) !== "undefined"){
					if(typeof(value) !== "undefined"){
						/* Set style property */
						var priority						= typeof(priority) !== "undefined" && priority === true ? "important" : "";
						style.setProperty(styleName, value, priority);
						return this;
					}else{
						/* Get style property */
						return style.getPropertyValue(styleName);
					}
				}else{
					/* Get CSSStyleDeclaration */
					return style;
				}
			},
			/**
			 * Define extentional function of jQuery val
			 * Auto formatting and replacement
			 * @param	{String}{optional}	value		Value to set (case undefined is getter function, case defined is setter function)
			 * @param	{boolean}{optional}	validate	Whether check validation (only value is defined)
			 * @param	{boolean}{optional}	callChange	Whether invoke change function (only value is defined)
			 * @return
			 * @author	HyosungITX Corp.
			 */
			valExt : function(value, validate, callChange){
				var element									= this[0];
				if(xui.valid.isElement(element)){
					if(xui.valid.isEmpty(validate)){
						validate							= true;
					}
					if(xui.valid.isEmpty(callChange)){
						callChange							= true;
					}
					var _void								= (typeof(value) !== "undefined");
					var controller							= element.controller;
					if(!xui.valid.isEmpty(controller)){
						if(_void){
							controller.setData(value, callChange, validate);
						}else{
							var returnValue = controller.getData();
							// date format이고 default Language가 아닐 경우 재 변경
							if(controller.config.format == "DATE" && !xui.message.isDefaultDateFormat()){
								var regex = xui.message.getRegexp();
								if(xui.message.getLanguage() === "en"){
									// 영어 일 경우
									// 정규 표현식에 매칭되는 경우
									const match = returnValue.match(regex);
									if (match) {
										const month = match[1];   // mm
										const day = match[2];	 // dd
										const year = match[3];	// yyyy
										// yyyymmdd 형식으로 반환
										returnValue = `${year}${month}${day}`;
									}
								}else if(xui.message.getLanguage() === "vi"){
									// 베트남어 일 경우
									// 정규 표현식에 매칭되는 경우
									const match = returnValue.match(regex);
									if (match) {
										const day = match[1];   // dd
										const month = match[2]; // mm
										const year = match[3];  // yyyy
										// yyyymmdd 형식으로 반환
										returnValue = `${year}${month}${day}`;
									}
								}
							}
							return returnValue;
						}
					}else{
						if(_void){
							this.val(value);
						}else{
							return this.val();
						}
					}
				}
			},
			/**
			 * Show message tooltip around element
			 * @param	{String}{required}	message		Message data to show
			 * @param	{String}{optional}	type		Type to show
			 * @param	{Number}{optional}	expire		Delay time to auto hiding
			 * @param	{String}{optional}	icon		Icon to be displayed ahead
			 * void
			 * @author	HyosungITX Corp.
			 */
			tooltip : function(message, type, expire, icon){
				if(xui.valid.isEmpty(expire)){
					expire									= 3000;
				}
				return xuic.__COM.showMessageTip(this[0], message, type, expire, icon);
			},
			setRequired : function(required){
				if(xui.valid.isEmpty(required)){
					required								= true;
				}
				var controller								= this.api();
				if(!xui.valid.isEmpty(controller) && typeof(controller.setRequired) === "function"){
					controller.setRequired(required);
				}else{
					if(required){
						this[0].classList.add("required");
					}else{
						this[0].classList.remove("required");
					}
				}
			},
			api : function(){
				var controller								= null;
				var element									= this[0];
				if(!xui.valid.isEmpty(element.tabbarController)){
					controller								= element.tabbarController;
				}else if(!xui.valid.isEmpty(element.ctxController)){
					controller								= element.ctxController;
				}else if(!xui.valid.isEmpty(element.dialogController)){
					controller								= element.dialogController;
				}else if(!xui.valid.isEmpty(element.treeController)){
					controller								= element.treeController;
				}else if(!xui.valid.isEmpty(element.gridController)){
					controller								= element.gridController;
				}else if(!xui.valid.isEmpty(element.pivotController)){
					controller								= element.pivotController;
				}else if(!xui.valid.isEmpty(element.pageController)){
					controller								= element.pageController;
				}else if(!xui.valid.isEmpty(element.toolbarController)){
					controller								= element.toolbarController;
				}else if(!xui.valid.isEmpty(element.fileController)){
					controller								= element.fileController;
				}else if(!xui.valid.isEmpty(element.chartController)){
					controller								= element.chartController;
				}else if(!xui.valid.isEmpty(element.calendarController)){
					controller								= element.calendarController;
				}else if(!xui.valid.isEmpty(element.acController)){
					controller								= element.acController;
				}else if(!xui.valid.isEmpty(element.vsController)){
					controller								= element.vsController;
				}else if(!xui.valid.isEmpty(element.controller)){
					controller								= element.controller;
				}
				return controller;
			},
			/* 스크롤바 유무 판단 */
			hasScrollBar  : function(){
				return (this.prop("scrollHeight") == 0 && this.prop("clientHeight") == 0) || (this.prop("scrollHeight") > this.prop("clientHeight"));
			},			
			/* xui-tabbar */
			XuiTabbar : function(config){
				return new xui.module.tabbar(config, this[0]);
			},
			/* xui-contextmenu */
			XuiContext : function(config){
				return new xui.module.context(config, this[0]);
			},
			/* xui-dialogWindow */
			XuiWindow : function(config){
				return new xui.module.dialog(config, this[0]);
			},
			/* xui-tree */
			XuiTree : function(config){
				return new xui.module.tree(config, this[0]);
			},
			/* xui-grid */
			XuiGrid : function(config){
				return new xui.module.grid(config, this[0]);
			},
			/* xui-pagebar */
			XuiPagebar : function(config){
				return new xui.module.pagebar(config, this[0]);
			},
			/* xui-toolbar */
			XuiToolbar : function(config){
				return new xui.module.toolbar(config, this[0]);
			},
			/* xui-fileviewer */
			XuiFile : function(config){
				return new xui.module.file(config, this[0]);
			},
			/* xui-fileviewer extension*/
			XuiFileExt : function(config){
				return new xui.module.fileExt(config, this[0]);
			},
			/* xui-pivot-table */
			XuiPivot : function(config){
				return new xui.module.pivot(config, this[0]);
			},
			/* xui-chart */
			XuiChart : function(config){
				return new xui.module.chart(config, this[0]);
			},
			/* xui-calendar */
			XuiCalendar : function(config){
				return new xui.module.calendar(config, this[0]);
			}
		});
	}

}());