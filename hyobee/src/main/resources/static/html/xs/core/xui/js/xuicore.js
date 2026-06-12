
(function(){
	
	"use strict";
	
	window.addEventListener("dragover", (function(e){
		e = e || event;
		e.preventDefault();
	}), false);
	window.addEventListener("drop", (function(e){
		e = e || event;
		e.preventDefault();
	}), false);
	/*Define browser window resizing event*/
	window.addEventListener("resize", (function(e){
		/*Close active directive module*/
		xuic.__COM.closeActiveDirective();
		/*Call Resizing event Defined by developer in menu page dependency source (skip exception)*/
		try{resizeWindow();}catch(E){}
	}));
	/*Define global click event*/
	window.addEventListener("click", (function(e){
		xuic.__COM.closeActiveDirective(e.target);
	}), true);
	/*Define xui tooltip feature*/
	window.addEventListener("mouseover", (function(e){
		xuic.__COM.showTitleToolTip(e.target);
	}));
	/*Define global keydown event*/
	document.onkeydown = (function(e){
		/*Only operate when application service mode is real mode
		 * Disable browser refresh function, Disable browser history back with backspace, Disable browser developer tool
		 * Extension copy functionality with Ctrl+C
		*/
		var allow						= xuic.__COM._allowGloabalKeyEvent(e);
		/*enter or space or esc*/
		xuic.__COM._closeTopDialog(e);
		
		return allow;
	});
	/*Disabled browser history back*/
	history.pushState(null, null, location.href);
	window.onpopstate = (function(){
		history.go(1);
	});
	/*Pre process before page loading*/
	xuic.__DCL = (function(){
		if(!this.DCL && document.body != null){
			this.DCL					= true;
			/*Load directive module(ex. Calendar)*/
			xuic.__DIRECTIVE.loadAllDirective();
		}
	});
	
	xuic.__CONFIG.appServiceMode		= top.xuic.__CONFIG.appServiceMode	|| "DEV";
	xuic.__CONFIG.dateDelimiter			= "-";
	xuic.__CONFIG.weekStartDay			= top.xuic.__CONFIG.weekStartDay	|| "monday";
	xuic.__ACTIVE_PICKER_ELEMENT		= null;
	xuic.__CONFIG.defaultLang			= "ko";

	//다른 시스템에서 open할 때 opener 객체의 xuic 객체 접근에서 문제가 발생하는 부분에 대해 try catch문을 이용하여 처리하지 않도록 처리
	if(opener != null && typeof(opener) !== "undefined"){
		try{
			if(typeof(opener.top.xuic) !== "undefined"){
				if(typeof(opener.top.xuic.__CONFIG.appServiceMode) !== "undefined"){
					xuic.__CONFIG.appServiceMode	= opener.top.xuic.__CONFIG.appServiceMode;
				}
				if(typeof(opener.top.xuic.__CONFIG.dateDelimiter) !== "undefined"){
					xuic.__CONFIG.dateDelimiter		= opener.top.xuic.__CONFIG.dateDelimiter;
				}
				if(typeof(opener.top.xuic.__CONFIG.weekStartDay) !== "undefined"){
					xuic.__CONFIG.weekStartDay		= opener.top.xuic.__CONFIG.weekStartDay;
				}
			}
		}catch(e){
			opener = null;
		}
	}
	
	/*like java enum class feature api*/
	xuic.__Enumeration = (function(enumeration){
		this.enumeration				= enumeration;
	});
	xuic.__Enumeration.prototype = {
		getCode : function(){
			return this.enumeration.code;
		},
		getName : function(){
			var returnValue = this.enumeration.name;
			var textLabel   = xui.message.get(this.enumeration.name);
			if(!xui.valid.isEmpty(textLabel)){
				returnValue = textLabel;
			}
			return returnValue;
		},
		getParentCode : function(){
			return this.enumeration.pcode;
		}
	};
	xuic.__ENUMERATION = function (init){
		if(init){
			this.setEnum("WRONG_DATA_FORMAT"		,""		,"잘못된 입력입니다."																,"");
			this.setEnum("EMPTY_DATA_FILL"			,""		,"필수 입력 항목입니다."																,"");
			this.setEnum("BEGIN_BIGGER_THAN_END"	,""		,"시작이 종료보다 클 수 없습니다."														,"");
			this.setEnum("MAX_OVER_Y"				,""		,"년을 초과(경과)할 수 없습니다."														,"");
			this.setEnum("MAX_OVER_M"				,""		,"개월을 초과(경과)할 수 없습니다."														,"");
			this.setEnum("MAX_OVER_D"				,""		,"일을 초과(경과)할 수 없습니다."														,"");
			this.setEnum("MIN_SHORT_Y"				,""		,"년 이상 가능합니다."																,"");
			this.setEnum("MIN_SHORT_M"				,""		,"개월 이상 가능합니다."																,"");
			this.setEnum("MIN_SHORT_D"				,""		,"일 이상 가능합니다."																,"");
			this.setEnum("PASSWORD_DENY_INVALID"	,""		,"잘못된 비밀번호 입력입니다.<br/>영문자+숫자+특수문자 조합 8글자 이상 20글자 이하<br/>반복 문자 허용X"	,"");
			this.setEnum("AUTH_TYPE_SELECT"			,"R"	,"조회 권한"																		,"");
			this.setEnum("AUTH_TYPE_SAVE"			,"S"	,"저장 권한"																		,"");
			this.setEnum("AUTH_TYPE_CREATE"			,"C"	,"생성 권한"																		,"");
			this.setEnum("AUTH_TYPE_UPDATE"			,"U"	,"수정 권한"																		,"");
			this.setEnum("AUTH_TYPE_DELETE"			,"D"	,"삭제 권한"																		,"");
			this.setEnum("AUTH_TYPE_OUTPUT"			,"O"	,"출력 권한"																		,"");
			this.setEnum("AUTH_TYPE_ETC"			,"E"	,"기타 권한"																		,"");
			this.setEnum("AUTH_TYPE_ADMIN"			,"A"	,"ADMIN 권한"																		,"");
			this.setEnum("AUTH_TYPE_NONE"			,"N"	,"권한 체크하지 않음"																	,"");
		}
	};
	xuic.__ENUMERATION.prototype = {
		setEnum : function(name, code, codeName, pcode){
			var _this					= this;
			_this[name]					= new xuic.__Enumeration({"code":code, "name":codeName, "pcode":pcode});
		}
	};
	
	xuic.__ENUM							= new xuic.__ENUMERATION(true);
	
	function __i18n(){
		this.default					= "kr";
		this.kr	= {
			monthsShort			: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
			months				: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
			daysShort			: ["일","월","화","수","목","금","토"],
			days				: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
			hours				: "시",
			minutes				: "분",
			seconds				: "초",
			save				: "저장",
			apply				: "확인",
			cancel				: "취소",
			selectAll			: "전체선택",
			goFirst				: "처음",
			goLast				: "끝",
			goPrev				: "이전",
			goNext				: "다음",
			goNextGroup			: "다음그룹",
			goPrevGroup			: "이전그룹",
			sum					: "합계",
			avg					: "평균",
			min					: "최소",
			max					: "최대",
			foldAll				: "전체접기",
			spreadAll			: "전체펼치기",
			findNode			: "노드검색",
			emptyData			: "데이터가 존재하지 않습니다.",
			dragAndDrop			: "Drag & Drop",
			or					: "또는",
			browse				: "파일첨부",
			filesOrFoldersHere	: "파일을 여기에 내려놓아주세요.",
			clearAll			: "전체삭제",
			clear				: "삭제",
			add					: "추가",
			upload				: "업로드",
			download			: "다운로드",
			error				: "에러",
			byte				: "b",
			kilobyte			: "Kb",
			megabyte			: "Mb",
			gigabyte			: "Gb",
			allDownload			: "전체다운로드",
			showConfig			: "설정정보",
			sortOrder			: "정렬순서",
			recentDate			: "최근일시",
			pastDate			: "과거일시",
			smallSize			: "작은크기",
			bigSize				: "큰크기",
			fileName			: "이름",
			fileExtension		: "확장자",
			movePage			: "페이지 이동"
		};
		this.en	= {
			monthsShort			: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
			months				: ["January","February","March","April","May","June","July","August","September","October","November","December"],
			daysShort			: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
			days				: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Monday"],
			hours				: "Hours",
			minutes				: "Minutes",
			seconds				: "Seconds",
			save				: "Save",
			apply				: "Apply",
			cancel				: "Cancel",
			selectAll			: "All",
			goFirst				: "Go first",
			goLast				: "Go last",
			goPrev				: "Previous",
			goNext				: "Next",
			goNextGroup			: "Next group",
			goPrevGroup			: "Prev group",
			sum					: "Sum",
			avg					: "Avg",
			min					: "Min",
			max					: "Max",
			foldAll				: "Fold all",
			spreadAll			: "Spread All",
			findNode			: "Find node",
			emptyData			: "Empty Data",
			dragAndDrop			: "Drag & drop",
			or					: "or",
			browse				: "Browse files",
			filesOrFoldersHere	: "files or folders here",
			clearAll			: "Clear all",
			clear				: "Clear",
			add					: "Add",
			upload				: "Upload",
			download			: "Download",
			error				: "error",
			byte				: "B",
			kilobyte			: "KB",
			megabyte			: "MB",
			gigabyte			: "GB",
			allDownload			: "All Download",
			showConfig			: "Show Congiruation",
			sortOrder			: "Sort Order",
			recentDate			: "Recent Date",
			pastDate			: "Past Date",
			smallSize			: "Small Size",
			bigSize				: "Big Size",
			fileName			: "Name",
			fileExtension		: "Extension",
			movePage			: "Move page"
		};
		this.vi	= {
			monthsShort			: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
			months				: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
			daysShort			: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
			days				: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
			hours				: "thành phố",
			minutes				: "phút",
			seconds				: "ngọn nến",
			save				: "cứu",
			apply				: "kiểm tra",
			cancel				: "hủy bỏ",
			selectAll			: "Chọn tất cả",
			goFirst				: "Đầu tiên",
			goLast				: "kết thúc",
			goPrev				: "trước",
			goNext				: "Kế tiếp",
			goNextGroup			: "Tập đoàn Daum",
			goPrevGroup			: "Nhóm trước",
			sum					: "tổng cộng",
			avg					: "trung bình",
			min					: "tối thiểu",
			max					: "tối đa",
			foldAll				: "Sự sụp đổ hoàn toàn",
			spreadAll			: "Mở rộng tất cả",
			findNode			: "Tìm kiếm nút",
			emptyData			: "Dữ liệu không tồn tại.",
			dragAndDrop			: "Kéo và thả",
			or					: "hoặc",
			browse				: "Đính kèm tập tin",
			filesOrFoldersHere	: "Vui lòng thả tập tin vào đây.",
			clearAll			: "Xóa tất cả",
			clear				: "xóa bỏ",
			add					: "phép cộng",
			upload				: "Tải lên",
			download			: "Tải xuống",
			error				: "lỗi",
			byte				: "b",
			kilobyte			: "Kb",
			megabyte			: "Mb",
			gigabyte			: "Gb",
			allDownload			: "Tải xuống tất cả",
			showConfig			: "Thông tin cài đặt",
			sortOrder			: "Sắp xếp thứ tự",
			recentDate			: "Ngày và giờ gần đây",
			pastDate			: "thời gian qua",
			smallSize			: "kích thước nhỏ",
			bigSize				: "Kích thước lớn",
			fileName			: "tên",
			fileExtension		: "sự mở rộng",
			movePage			: "Di chuyển trang"
		};
	};
	__i18n.prototype = {
		getLabel : function(key, locale){
			var label									= null;
			if(!xuic.__VALID.checkIsEmpty(locale)){
				locale									= this.default;
			}
			locale										= this.getLocale(locale);
			if(!xuic.__VALID.checkIsEmpty(key) && locale.hasOwnProperty(key)){
				label									= locale[key];
			}
			return label;
		},
		getLocale : function(key){
			var locale									= this[this.default];
			var languageCode									= xuic.__CONFIG.defaultLang;
			if(!xuic.__VALID.checkIsEmpty(xuic.__COM)){
				languageCode = xuic.__COM.getLanguage();
			}
			if(languageCode !== xuic.__CONFIG.defaultLang){
				locale = this.en;
			}
			return locale;
		},
		getDefaultName : function(){
			return this.default;
		},
		getDefaultLocale : function(){
			return this[this.default];
		},
		setDefaultLocale : function(locale){
			var valid									= true;
			if(!xuic.__VALID.checkIsEmpty(locale) && this.hasOwnProperty(locale)){
				this.default							= locale;
				setTimeout(function(){
					xuic.__DIRECTIVE.redrawDirective();
				},300);
			}else{
				valid									= false;
			}
			return valid;
		}
	};

	/*application locale feature api*/
	xuic.__i18n											= new __i18n();
	__i18n												= null;

	function __Directive(){
		this.DATETIME_DIRECTIVE							= {
			YEAR_PICKER						: {controlSecond:false	,double:false	},
			MONTH_PICKER					: {controlSecond:false	,double:false	},
			DATE_PICKER						: {controlSecond:false	,double:false	},
			DATETIME_PICKER					: {controlSecond:false	,double:false	},
			DATETIME_SECOND_PICKER			: {controlSecond:true	,double:false	},
			TIME_PICKER						: {controlSecond:false	,double:false	},
			TIME_SECOND_PICKER				: {controlSecond:true	,double:false	},
			DOUBLE_YEAR_PICKER				: {controlSecond:false	,double:true	},
			DOUBLE_MONTH_PICKER				: {controlSecond:false	,double:true	},
			DOUBLE_DATE_PICKER				: {controlSecond:false	,double:true	},
			DOUBLE_DATETIME_PICKER			: {controlSecond:false	,double:true	},
			DOUBLE_DATETIME_SECOND_PICKER	: {controlSecond:true	,double:true	},
			DOUBLE_TIME_PICKER				: {controlSecond:false	,double:true	},
			DOUBLE_TIME_SECOND_PICKER		: {controlSecond:true	,double:true	}
		};
	};
	__Directive.prototype = {
		showDirective : function(element, name){
			if(xuic.__VALID.checkIsElement(element) && element.controller.isEnable()){
				if(!xuic.__VALID.checkIsEmpty(name)){
					var directive						= null;
					if(this.DATETIME_DIRECTIVE.hasOwnProperty(name)){
						directive						= this.DATETIME_DIRECTIVE[name];
					}else if(this.hasOwnProperty(name)){
						directive						= this[name];
					}
					if(!xuic.__VALID.checkIsEmpty(directive)){
						directive.picker.show(element,{"centering":false});
						xuic.__ACTIVE_PICKER_ELEMENT	= element;
					}
					directive							= null;
				}
			}
		},
		hideDirective : function(name){
			if(!xuic.__VALID.checkIsEmpty(name)){
				var directive							= null;
				if(this.DATETIME_DIRECTIVE.hasOwnProperty(name)){
					directive							= this.DATETIME_DIRECTIVE[name];
				}else if(this.hasOwnProperty(name)){
					directive							= this[name];
				}
				if(!xuic.__VALID.checkIsEmpty(directive)){
					directive.picker.hide();
					xuic.__ACTIVE_PICKER_ELEMENT		= null;
				}
				directive								= null;
			}else if(xuic.__ACTIVE_PICKER_ELEMENT != null){
				xuic.__COM.closeActiveDirective();
			}
		},
		getDirective : function(name){
			var directive								= null;
			if(!xuic.__VALID.checkIsEmpty(name)){
				var directive							= null;
				if(this.DATETIME_DIRECTIVE.hasOwnProperty(name)){
					directive							= this.DATETIME_DIRECTIVE[name];
				}else if(this.hasOwnProperty(name)){
					directive							= this[name];
				}
			}
			return directive;
		},
		loadAllDirective : function(){
			/*Define dhx calendar & time picker module*/
			var defaultLocaleSet				= xuic.__i18n.getDefaultLocale();
			// 20241219 JJH 언어 설정이 한국어 이외일 경우 캘린더에 표기되는 언어를 영어로 표기되도록 변경
			if( xuic.__COM.getLanguage() != "ko" ){
				defaultLocaleSet["daysShort"]   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
				defaultLocaleSet["monthsShort"] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				defaultLocaleSet["months"] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				defaultLocaleSet["cancel"] = "Cancel";
			}
			dhx.i18n.setLocale("calendar"		, defaultLocaleSet);
			dhx.i18n.setLocale("timepicker"		, defaultLocaleSet);
			dhx.i18n.setLocale("vault"			, defaultLocaleSet);
			var dateDirective					= this.DATETIME_DIRECTIVE;
			var directive						= null;
			for(var name in dateDirective){
				directive						= null;
				if(xuic.__VALID.checkIsEmpty(dateDirective[name].picker)){
					directive					= dateDirective[name];
					directive.picker			= new dhx.Popup({"css":"xui-picker-box"});
					directive.picker.name		= name;
					directive.picker.events.on("BeforeShow", function(element){
						return xuic.__DIRECTIVE._beforeShowDirective(this, element);
					});
					directive.picker.events.on("AfterShow", function(element){
						xuic.__DIRECTIVE._afterShowDirective(this, element);
					});
					directive.picker.events.on("BeforeHide", function(fromOuterClick, e){
						return xuic.__DIRECTIVE._beforeHideDirective(this, fromOuterClick, e);
					});
					directive.picker.events.on("AfterHide", function(){
						xuic.__DIRECTIVE._afterHideDirective(this);
					});
					var pickerWrapperElement	= document.createElement("div");
					pickerWrapperElement.id		= name;
					pickerWrapperElement.classList.add("xui-picker-container");
					if(directive.double){
						pickerWrapperElement.classList.add("double");
					}
					pickerWrapperElement.appendChild(document.createElement("div"));
					if(directive.double){
						pickerWrapperElement.appendChild(document.createElement("div"));
					}
					directive.picker.attachHTML(pickerWrapperElement.outerHTML);
					directive.picker.show();
				}
			}
			defaultLocaleSet					= null;
			dateDirective						= null;
			directive							= null;
		},
		_beforeShowDirective : function(picker, element){
			if(typeof(element) !== "undefined"){
				picker.activeElement						= element;
				var controller								= element.controller;
				var controllerConfig						= controller.config;
				if(controllerConfig.picker){
					controller.checkValid(true, true);
					var objTargetElement					= xuic.__DOM.getDblPickerElement(element), objRegexpInfo = xuic.__REGEXP.getFormatRegexp(controllerConfig.format, controllerConfig.controlSecond), validLength = -1, objDisabledFn = null, strLeftValue = "", strRightValue = "", objLeftValue = null, objRightValue = null;
					if(objTargetElement[0] != null){
						element								= objTargetElement[0];
					}else{
						objTargetElement[0]					= element;
					}
					strLeftValue							= objTargetElement[0].value.trim();
					if(controllerConfig.double){
						strRightValue						= objTargetElement[1].value.trim();
						picker.activeElementLeft			= objTargetElement[0];
						picker.activeElementRight			= objTargetElement[1];
						var intMaxTerm						= objTargetElement[0].getAttribute("max");
						var intMinTerm						= objTargetElement[0].getAttribute("min");
						if(!xuic.__VALID.checkIsEmpty(intMaxTerm)){
							intMaxTerm						= objTargetElement[1].getAttribute("max");
						}
						if(!xuic.__VALID.checkIsEmpty(intMinTerm)){
							intMinTerm						= objTargetElement[1].getAttribute("min");
						}
						if(!xuic.__VALID.checkIsEmpty(intMaxTerm)){
							intMaxTerm						= parseInt(intMaxTerm,10);
						}else{
							intMaxTerm						= 0;
						}
						if(!xuic.__VALID.checkIsEmpty(intMinTerm)){
							intMinTerm						= parseInt(intMinTerm,10);
						}else{
							intMinTerm						= 0;
						}
						if(intMaxTerm > 0){
							picker._uiLeft.config.maxterm	= intMaxTerm;
							picker._uiRight.config.maxterm	= intMaxTerm;
						}
						if(intMinTerm > 0){
							picker._uiLeft.config.minterm	= intMinTerm;
							picker._uiRight.config.minterm	= intMinTerm;
						}
					}
					switch(controllerConfig.format){
						case "YEAR"		:
							validLength						= 4;
							break;
						case "MONTH"	:
							if(!xuic.__VALID.checkIsEmpty(strLeftValue)){
								strLeftValue				= strLeftValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
							}
							if(!xuic.__VALID.checkIsEmpty(strRightValue)){
								strRightValue				= strRightValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
							}
							validLength						= 6;
							break;
						case "DATE"		:
							if(!xuic.__VALID.checkIsEmpty(strLeftValue)){
								strLeftValue				= strLeftValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
							}
							if(!xuic.__VALID.checkIsEmpty(strRightValue)){
								strRightValue				= strRightValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
							}
							validLength						= 8;
							break;
						case "DATETIME"	:
							if(!xuic.__VALID.checkIsEmpty(strLeftValue)){
								strLeftValue				= strLeftValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
								objLeftValue				= new Date(xuic.__UTIL.replaceAll(strLeftValue, xuic.__CONFIG.dateDelimiter, "/"));
							}
							if(!xuic.__VALID.checkIsEmpty(strRightValue)){
								strRightValue				= strRightValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
								objRightValue				= new Date(xuic.__UTIL.replaceAll(strRightValue, xuic.__CONFIG.dateDelimiter, "/"));
							}
							if(controllerConfig.controlSecond){
								validLength					= 14;
							}else{
								validLength					= 12;
							}
							break;
						case "TIME"		:
							if(!xuic.__VALID.checkIsEmpty(strLeftValue)){
								strLeftValue				= strLeftValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
							}
							if(!xuic.__VALID.checkIsEmpty(strRightValue)){
								strRightValue				= strRightValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
							}
							if(controllerConfig.controlSecond){
								validLength					= 6;
							}else{
								validLength					= 4;
							}
							break;
						default			:
							break;
					}
					var exceptRegexp						= xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER");
					if(controllerConfig.double){
						xuic.__DIRECTIVE.reLink(picker, (strLeftValue.replace(exceptRegexp, "").length === validLength ? strLeftValue : ""), (strRightValue.replace(exceptRegexp, "").length === validLength ? strRightValue : ""));
					}else{
						if(!xuic.__VALID.checkIsEmpty(objLeftValue)){
							picker._uiLeft.setValue(objLeftValue);
						}else{
							if(strLeftValue.replace(exceptRegexp, "").length === validLength){
								picker._uiLeft.setValue(strLeftValue);
							}else{
								picker._uiLeft.clear();
								element.value				= "";
							}
						}
					}

                    // (2025.12) 캘린더 open 시, 값이 없다면 현재 날짜가 포함된 달력을 표시하기 위해 추가
                    // 캘린더가 이미 생성되어 있는 경우, 표시할 달을 설정
                    if(typeof(picker._uiLeft) !== "undefined" && picker._uiLeft != null){
                        var dateToShow = null;
                        // 입력 필드에 유효한 값이 있는지 확인
                        if(!xuic.__VALID.checkIsEmpty(objLeftValue)){
                            // Date 객체가 있으면 그 날짜 사용
                            dateToShow = objLeftValue;
                        } else if(strLeftValue.replace(exceptRegexp, "").length === validLength){
                            // 유효한 문자열 값이 있으면 Date 객체로 변환
                            try {
                                dateToShow = new Date(xuic.__UTIL.replaceAll(strLeftValue, xuic.__CONFIG.dateDelimiter, "/"));
                            } catch(e) {
                                dateToShow = null;
                            }
                        }
                        // 값이 없으면 오늘 날짜로, 있으면 해당 날짜로 표시
                        if(typeof(picker._uiLeft.showDate) === "function"){
                            picker._uiLeft.showDate(dateToShow || new Date());
                        }
                    }
                    // 더블 피커(범위 선택)인 경우 오른쪽 캘린더도 처리
                    if(typeof(picker._uiRight) !== "undefined" && picker._uiRight != null){
                        var dateToShow = null;
                        // 오른쪽 입력 필드에 유효한 값이 있는지 확인
                        if(!xuic.__VALID.checkIsEmpty(objRightValue)){
                            dateToShow = objRightValue;
                        } else if(strRightValue && strRightValue.replace(exceptRegexp, "").length === validLength){
                            try {
                                dateToShow = new Date(xuic.__UTIL.replaceAll(strRightValue, xuic.__CONFIG.dateDelimiter, "/"));
                            } catch(e) {
                                dateToShow = null;
                            }
                        }
                        if(typeof(picker._uiRight.showDate) === "function"){
                            picker._uiRight.showDate(dateToShow || new Date());
                        }
                    }

					objTargetElement						= null;
					objRegexpInfo							= null;
					validLength								= null;
					objDisabledFn							= null;
					strLeftValue							= null;
					strRightValue							= null;
					objLeftValue							= null;
					objRightValue							= null;
					exceptRegexp							= null;
				}
				xuic.__ACTIVE_PICKER_ELEMENT				= picker.activeElement;
				controller									= null;
				controllerConfig							= null;
			}
			return true;
		},
		_afterShowDirective : function(picker, element){
			if(typeof(picker._uiLeft) === "undefined"){
				var pickerWrapperElement											= document.getElementById(picker.name);
				var objConfig														= {
					mode			: "calendar",
					dateFormat		: "%Y" + xuic.__CONFIG.dateDelimiter + "%m" + xuic.__CONFIG.dateDelimiter + "%d",
					dateDelimiter	: xuic.__CONFIG.dateDelimiter,
					weekStart		: xuic.__CONFIG.weekStartDay,
					value			: null,
					range			: false,
					timePicker		: false,
					timeFormat		: 24,
					controlSecond	: false,
					thisMonthOnly	: false,
					maxterm			: 0,
					minterm			: 0,
					mark			: function(date){
						var objDay													= date.getDay();
						return objDay == 0 ? "sunday" : objDay == 6 ? "saturday" : "";
					},
					disabledDates	: function(date){
						return false;
					}
				};
				switch(picker.name){
					case "YEAR_PICKER" :
						objConfig.mode												= "year";
						objConfig.timePicker										= false;
						objConfig.dateFormat										= "%Y";
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("YEAR_PICKER").picker;
								if(_picker.isVisible() && _picker.activeElement != null){
									_picker.activeElement.controller.setData(_picker._uiLeft.getValue());
									xuic.__DIRECTIVE.hideDirective("YEAR_PICKER");
								}
							}
						});
						break;
					case "MONTH_PICKER" :
						objConfig.mode												= "month";
						objConfig.timePicker										= false;
						objConfig.dateFormat										= "%Y" + xuic.__CONFIG.dateDelimiter + "%m";
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("MONTH_PICKER").picker;
								if(_picker.isVisible() && _picker.activeElement != null){
									_picker.activeElement.controller.setData(_picker._uiLeft.getValue());
									xuic.__DIRECTIVE.hideDirective("MONTH_PICKER");
								}
							}
						});
						break;
					case "DATE_PICKER" :
						objConfig.mode												= "calendar";
						objConfig.timePicker										= false;
						objConfig.dateFormat										= "%Y" + xuic.__CONFIG.dateDelimiter + "%m" + xuic.__CONFIG.dateDelimiter + "%d";
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DATE_PICKER").picker;
								if(_picker.isVisible() && _picker.activeElement != null){
									_picker.activeElement.controller.setData(_picker._uiLeft.getValue());
									xuic.__DIRECTIVE.hideDirective("DATE_PICKER");
								}
							}
						});
						break;
					case "DATEDAY_PICKER" :
						objConfig.mode												= "calendar";
						objConfig.timePicker										= false;
						objConfig.dateFormat										= "%Y" + xuic.__CONFIG.dateDelimiter + "%m" + xuic.__CONFIG.dateDelimiter + "%d";
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DATEDAY_PICKER").picker;
								if(_picker.isVisible() && _picker.activeElement != null){
									_picker.activeElement.controller.setData(_picker._uiLeft.getValue());
									xuic.__DIRECTIVE.hideDirective("DATEDAY_PICKER");
								}
							}
						});
						break;
					case "DATETIME_PICKER" :
						objConfig.mode												= "calendar";
						objConfig.timePicker										= true;
						objConfig.dateFormat										= "%Y" + xuic.__CONFIG.dateDelimiter + "%m" + xuic.__CONFIG.dateDelimiter + "%d";
						objConfig.controlSecond										= false;
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DATETIME_PICKER").picker;
								if(_picker.isVisible() && _picker.activeElement != null){
									var objDate										= _picker._uiLeft.getValue();
									if(objDate != null){
										_picker.activeElement.controller.setData(objDate + " " + _picker._uiLeft["_timepicker"].getValue());
										_picker._uiLeft._currentViewMode 			= "timepicker";
									}
								}
							}
						});
						picker._uiLeft._timepicker.events.on("Change", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DATETIME_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElement != null){
								var strDate											= _picker._uiLeft.getValue();
								if(strDate != null){
									_picker.activeElement.controller.setData(strDate + " " + this.getValue());
								}
							}
						});
						picker._uiLeft._timepicker.events.on("Save", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DATETIME_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElement != null){
								var strDate											= _picker._uiLeft.getValue();
								if(strDate != null){
									_picker.activeElement.controller.setData(strDate + " " + this.getValue());
								}
								_picker.hide();
							}
						});
						break;
					case "DATETIME_SECOND_PICKER" :
						objConfig.mode												= "calendar";
						objConfig.timePicker										= true;
						objConfig.dateFormat										= "%Y" + xuic.__CONFIG.dateDelimiter + "%m" + xuic.__CONFIG.dateDelimiter + "%d";
						objConfig.controlSecond										= true;
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DATETIME_SECOND_PICKER").picker;
								if(_picker.isVisible() && _picker.activeElement != null){
									var objDate										= _picker._uiLeft.getValue();
									if(objDate != null){
										_picker.activeElement.controller.setData(objDate + " " + _picker._uiLeft["_timepicker"].getValue());
										_picker._uiLeft._currentViewMode 			= "timepicker";
									}
								}
							}
						});
						picker._uiLeft._timepicker.events.on("Change", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DATETIME_SECOND_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElement != null){
								var strDate											= _picker._uiLeft.getValue();
								if(strDate != null){
									_picker.activeElement.controller.setData(strDate + " " + this.getValue());
								}
							}
						});
						picker._uiLeft._timepicker.events.on("Save", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DATETIME_SECOND_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElement != null){
								var strDate											= _picker._uiLeft.getValue();
								if(strDate != null){
									_picker.activeElement.controller.setData(strDate + " " + this.getValue());
								}
								_picker.hide();
							}
						});
						break;
					case "TIME_PICKER" :
						objConfig.controlSecond										= false;
						picker._uiLeft												= new dhx.Timepicker(pickerWrapperElement.firstChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							var _picker												= xuic.__DIRECTIVE.getDirective("TIME_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElement != null){
								_picker.activeElement.controller.setData(_picker._uiLeft.getValue());
							}
						});
						break;
					case "TIME_SECOND_PICKER" :
						objConfig.controlSecond										= true;
						picker._uiLeft												= new dhx.Timepicker(pickerWrapperElement.firstChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							var _picker												= xuic.__DIRECTIVE.getDirective("TIME_SECOND_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElement != null){
								_picker.activeElement.controller.setData(_picker._uiLeft.getValue());
							}
						});
						break;
					case "DOUBLE_YEAR_PICKER" :
						objConfig.mode												= "year";
						objConfig.timePicker										= false;
						objConfig.dateFormat										= "%Y";
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiRight												= new dhx.Calendar(pickerWrapperElement.lastChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DOUBLE_YEAR_PICKER").picker;
								if(_picker.isVisible()){
									if(_picker.activeElementLeft != null){
										_picker.activeElementLeft.controller.setData(_picker._uiLeft.getValue());
										var from									= xuic.__UTIL.getNumberOnly(_picker._uiLeft.getValue());
										var to										= xuic.__UTIL.getNumberOnly(_picker._uiRight.getValue());
										if(!xuic.__VALID.checkIsEmpty(to)){
											if(parseInt(from) > parseInt(to)){
												_picker.activeElementRight.controller.setData("");
											}
										}
									}
								}
							}
						});
						picker._uiRight.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DOUBLE_YEAR_PICKER").picker;
								if(_picker.isVisible()){
									if(_picker.activeElementRight != null){
										_picker.activeElementRight.controller.setData(_picker._uiRight.getValue());
										var from									= xuic.__UTIL.getNumberOnly(_picker._uiLeft.getValue());
										var to										= xuic.__UTIL.getNumberOnly(_picker._uiRight.getValue());
										if(!xuic.__VALID.checkIsEmpty(from)){
											if(parseInt(from) > parseInt(to)){
												_picker.activeElementLeft.controller.setData("");
											}
										}
									}
								}
							}
						});
						picker._uiLeft.link(picker._uiRight);
						break;
					case "DOUBLE_MONTH_PICKER" :
						objConfig.mode												= "month";
						objConfig.timePicker										= false;
						objConfig.dateFormat										= "%Y" + xuic.__CONFIG.dateDelimiter + "%m";
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiRight												= new dhx.Calendar(pickerWrapperElement.lastChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DOUBLE_MONTH_PICKER").picker;
								if(_picker.isVisible()){
									if(_picker.activeElementLeft != null){
										_picker.activeElementLeft.controller.setData(_picker._uiLeft.getValue());
										var from									= xuic.__UTIL.getNumberOnly(_picker._uiLeft.getValue());
										var to										= xuic.__UTIL.getNumberOnly(_picker._uiRight.getValue());
										if(!xuic.__VALID.checkIsEmpty(to)){
											if(parseInt(from) > parseInt(to)){
												_picker.activeElementRight.controller.setData("");
											}
										}
									}
								}
							}
						});
						picker._uiRight.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DOUBLE_MONTH_PICKER").picker;
								if(_picker.isVisible()){
									if(_picker.activeElementRight != null){
										_picker.activeElementRight.controller.setData(_picker._uiRight.getValue());
										var from									= xuic.__UTIL.getNumberOnly(_picker._uiLeft.getValue());
										var to										= xuic.__UTIL.getNumberOnly(_picker._uiRight.getValue());
										if(!xuic.__VALID.checkIsEmpty(from)){
											if(parseInt(from) > parseInt(to)){
												_picker.activeElementLeft.controller.setData("");
											}
										}
									}
								}
							}
						});
						picker._uiLeft.link(picker._uiRight);
						break;
					case "DOUBLE_DATE_PICKER" :
						objConfig.mode												= "calendar";
						objConfig.timePicker										= false;
						objConfig.dateFormat										= "%Y" + xuic.__CONFIG.dateDelimiter + "%m" + xuic.__CONFIG.dateDelimiter + "%d";
						if(!xui.valid.isEmpty(xuic.__COM) && !xuic.__COM.isDefaultDateFormat()){
							var languageCode = xuic.__COM.getLanguage();
							// 다국어 처리 나중에
							// if(languageCode === "en"){
							//	 objConfig.dateFormat										= "%m" + xuic.__CONFIG.dateDelimiter + "%d" + xuic.__CONFIG.dateDelimiter + "%Y";
							// }else if(languageCode === "vi"){
							//	 objConfig.dateFormat										= "%d" + xuic.__CONFIG.dateDelimiter + "%m" + xuic.__CONFIG.dateDelimiter + "%Y";
							// }
						}
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiRight												= new dhx.Calendar(pickerWrapperElement.lastChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DOUBLE_DATE_PICKER").picker;
								if(_picker.isVisible()){
									if(_picker.activeElementLeft != null){
										_picker.activeElementLeft.controller.setData(_picker._uiLeft.getValue());
										var from									= xuic.__UTIL.getNumberOnly(_picker._uiLeft.getValue());
										var to										= xuic.__UTIL.getNumberOnly(_picker._uiRight.getValue());
										if(!xuic.__VALID.checkIsEmpty(to)){
											if(parseInt(from) > parseInt(to)){
												_picker.activeElementRight.controller.setData("");
												xuic.__DIRECTIVE.reLink(_picker, undefined, "");
											}
										}
									}
								}
							}
						});
						picker._uiRight.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DOUBLE_DATE_PICKER").picker;
								if(_picker.isVisible()){
									if(_picker.activeElementRight != null){
										_picker.activeElementRight.controller.setData(_picker._uiRight.getValue());
										var from									= xuic.__UTIL.getNumberOnly(_picker._uiLeft.getValue());
										var to										= xuic.__UTIL.getNumberOnly(_picker._uiRight.getValue());
										if(!xuic.__VALID.checkIsEmpty(from)){
											if(parseInt(from) > parseInt(to)){
												_picker.activeElementLeft.controller.setData("");
												xuic.__DIRECTIVE.reLink(_picker, "", undefined);
											}
										}
									}
								}
							}
						});
						picker._uiLeft.link(picker._uiRight);
						picker._uiLeft.config.linkCalendarRight = picker._uiRight;
						picker._uiRight.config.linkCalendarLeft = picker._uiLeft;
						break;
					case "DOUBLE_DATETIME_PICKER" :
						objConfig.mode												= "calendar";
						objConfig.timePicker										= true;
						objConfig.dateFormat										= "%Y" + xuic.__CONFIG.dateDelimiter + "%m" + xuic.__CONFIG.dateDelimiter + "%d";
						objConfig.controlSecond										= false;
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiRight												= new dhx.Calendar(pickerWrapperElement.lastChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_PICKER").picker;
								if(_picker.isVisible()){
									if(_picker.activeElementLeft != null){
										var objDate									= _picker._uiLeft.getValue();
										if(objDate != null){
											_picker.activeElementLeft.controller.setData(objDate + " " + _picker._uiLeft["_timepicker"].getValue());
											_picker._uiLeft._currentViewMode		= "timepicker";
										}
									}
								}
							}
						});
						picker._uiRight.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_PICKER").picker;
								if(_picker.isVisible()){
									if(_picker.activeElementRight != null){
										var objDate									= _picker._uiRight.getValue();
										if(objDate != null){
											_picker.activeElementRight.controller.setData(objDate + " " + _picker._uiRight["_timepicker"].getValue());
											_picker._uiRight._currentViewMode		= "timepicker";
										}
									}
								}
							}
						});
						picker._uiLeft._timepicker.events.on("Change", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElementLeft != null){
								var strDate											= _picker._uiLeft.getValue();
								if(strDate != null){
									_picker.activeElementLeft.controller.setData(strDate + " " + this.getValue());
								}
							}
						});
						picker._uiLeft._timepicker.events.on("Save", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElementLeft != null){
								var strDate											= _picker._uiLeft.getValue();
								if(strDate != null){
									_picker.activeElementLeft.controller.setData(strDate + " " + this.getValue());
								}
							}
						});
						picker._uiRight._timepicker.events.on("Change", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElementRight != null){
								var strDate											= _picker._uiRight.getValue();
								if(strDate != null){
									_picker.activeElementRight.controller.setData(strDate + " " + this.getValue());
								}
							}
						});
						picker._uiRight._timepicker.events.on("Save", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElementRight != null){
								var strDate											= _picker._uiRight.getValue();
								if(strDate != null){
									_picker.activeElementRight.controller.setData(strDate + " " + this.getValue());
								}
							}
						});
						picker._uiLeft.link(picker._uiRight);
						picker._uiLeft.config.linkCalendarRight = picker._uiRight;
						picker._uiRight.config.linkCalendarLeft = picker._uiLeft;
						break;
					case "DOUBLE_DATETIME_SECOND_PICKER" :
						objConfig.mode												= "calendar";
						objConfig.timePicker										= true;
						objConfig.dateFormat										= "%Y" + xuic.__CONFIG.dateDelimiter + "%m" + xuic.__CONFIG.dateDelimiter + "%d";
						objConfig.controlSecond										= true;
						picker._uiLeft												= new dhx.Calendar(pickerWrapperElement.firstChild, objConfig);
						picker._uiRight												= new dhx.Calendar(pickerWrapperElement.lastChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_SECOND_PICKER").picker;
								if(_picker.isVisible()){
									if(_picker.activeElementLeft != null){
										var objDate									= _picker._uiLeft.getValue();
										if(objDate != null){
											_picker.activeElementLeft.controller.setData(objDate + " " + _picker._uiLeft["_timepicker"].getValue());
											_picker._uiLeft._currentViewMode 		= "timepicker";
										}
									}
								}
							}
						});
						picker._uiRight.events.on("Change", function(date, oldDate, click){
							if(click){
								var _picker											= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_SECOND_PICKER").picker;
								if(_picker.isVisible()){
									if(_picker.activeElementRight != null){
										var objDate									= _picker._uiRight.getValue();
										if(objDate != null){
											_picker.activeElementRight.controller.setData(objDate + " " + _picker._uiRight["_timepicker"].getValue());
											_picker._uiRight._currentViewMode 		= "timepicker";
										}
									}
								}
							}
						});
						picker._uiLeft._timepicker.events.on("Change", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_SECOND_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElementLeft != null){
								var strDate											= _picker._uiLeft.getValue();
								if(strDate != null){
									_picker.activeElementLeft.controller.setData(strDate + " " + this.getValue());
								}
							}
						});
						picker._uiLeft._timepicker.events.on("Save", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_SECOND_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElementLeft != null){
								var strDate											= _picker._uiLeft.getValue();
								if(strDate != null){
									_picker.activeElementLeft.controller.setData(strDate + " " + this.getValue());
								}
							}
						});
						picker._uiRight._timepicker.events.on("Change", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_SECOND_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElementRight != null){
								var strDate											= _picker._uiRight.getValue();
								if(strDate != null){
									_picker.activeElementRight.controller.setData(strDate + " " + this.getValue());
								}
							}
						});
						picker._uiRight._timepicker.events.on("Save", function(){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_DATETIME_SECOND_PICKER").picker;
							if(_picker.isVisible() && _picker.activeElementRight != null){
								var strDate											= _picker._uiRight.getValue();
								if(strDate != null){
									_picker.activeElementRight.controller.setData(strDate + " " + this.getValue());
								}
							}
						});
						picker._uiLeft.link(picker._uiRight);
						picker._uiLeft.config.linkCalendarRight = picker._uiRight;
						picker._uiRight.config.linkCalendarLeft = picker._uiLeft;
						break;
					case "DOUBLE_TIME_PICKER" :
						objConfig.controlSecond										= false;
						picker._uiLeft												= new dhx.Timepicker(pickerWrapperElement.firstChild, objConfig);
						picker._uiRight												= new dhx.Timepicker(pickerWrapperElement.lastChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_TIME_PICKER").picker;
							if(_picker.isVisible()){
								if(_picker.activeElementLeft != null){
									_picker.activeElementLeft.controller.setData(_picker._uiLeft.getValue());
								}
							}
						});
						picker._uiRight.events.on("Change", function(date, oldDate, click){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_TIME_PICKER").picker;
							if(_picker.isVisible()){
								if(_picker.activeElementRight != null){
									_picker.activeElementRight.controller.setData(_picker._uiRight.getValue());
								}
							}
						});
						break;
					case "DOUBLE_TIME_SECOND_PICKER" :
						objConfig.controlSecond										= true;
						picker._uiLeft												= new dhx.Timepicker(pickerWrapperElement.firstChild, objConfig);
						picker._uiRight												= new dhx.Timepicker(pickerWrapperElement.lastChild, objConfig);
						picker._uiLeft.events.on("Change", function(date, oldDate, click){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_TIME_SECOND_PICKER").picker;
							if(_picker.isVisible()){
								if(_picker.activeElementLeft != null){
									_picker.activeElementLeft.controller.setData(_picker._uiLeft.getValue());
								}
							}
						});
						picker._uiRight.events.on("Change", function(date, oldDate, click){
							var _picker												= xuic.__DIRECTIVE.getDirective("DOUBLE_TIME_SECOND_PICKER").picker;
							if(_picker.isVisible()){
								if(_picker.activeElementRight != null){
									_picker.activeElementRight.controller.setData(_picker._uiRight.getValue());
								}
							}
						});
						break;
					default :
						break;
				}
				picker._uiLeft.config.disabledDates									= objConfig.disabledDates;
				if(typeof(picker._uiRight) !== "undefined"){
					picker._uiRight.config.disabledDates							= objConfig.disabledDates;
				}
				picker.hide();
			}
		},
		_beforeHideDirective : function(picker, outerClick, evt){
			return true;
		},
		_afterHideDirective : function(picker){
			if(xuic.__VALID.checkIsElement(picker.activeElement)){
				var _html															= picker._html;
				if(_html.indexOf("DATETIME") >= 0){
					picker._uiLeft._currentViewMode									= "calendar";
					if(_html.indexOf("DOUBLE") >= 0){
						picker._uiRight._currentViewMode							= "calendar";
					}
				}
				if(_html.indexOf("DOUBLE") >= 0){
					picker._uiLeft.config.maxterm									= 0;
					picker._uiRight.config.maxterm									= 0;
					picker._uiLeft.config.minterm									= 0;
					picker._uiRight.config.minterm									= 0;
				}
				picker.activeElement												= null;
				xuic.__ACTIVE_PICKER_ELEMENT										= null;
			}
		},
		redrawDirective : function(){
			/*Redraw dhx calendar & time picker module when changed config option or locale*/
			var defaultLocaleSet													= xuic.__i18n.getDefaultLocale();
			dhx.i18n.setLocale("calendar"	,defaultLocaleSet);
			dhx.i18n.setLocale("timepicker"	,defaultLocaleSet);
			dhx.i18n.setLocale("vault"		,defaultLocaleSet);
			var _this																= this;
			var directiveGroup														= _this.DATETIME_DIRECTIVE;
			for(var name in directiveGroup){
				var picker															= directiveGroup[name]["picker"], calendar = picker._uiLeft, timepicker = null;
				if(typeof(calendar) !== "undefined"){
					timepicker														= calendar["_timepicker"];
					if(typeof(timepicker) !== "undefined"){
						timepicker["_hoursSlider"].config.label						= xuic.__i18n.getLabel("hours");
						timepicker["_hoursSlider"].paint();
						timepicker["_minutesSlider"].config.label					= xuic.__i18n.getLabel("minutes");
						timepicker["_minutesSlider"].paint();
						if(typeof(timepicker["_secondsSlider"]) !== "undefined"){
							timepicker["_secondsSlider"].config.label				= xuic.__i18n.getLabel("seconds");
							timepicker["_secondsSlider"].paint();
						}
					}else if(typeof(calendar["_hoursSlider"]) !== "undefined"){
						calendar["_hoursSlider"].config.label						= xuic.__i18n.getLabel("hours");
						calendar["_hoursSlider"].paint();
						calendar["_minutesSlider"].config.label						= xuic.__i18n.getLabel("minutes");
						calendar["_minutesSlider"].paint();
						if(typeof(calendar["_secondsSlider"]) !== "undefined"){
							calendar["_secondsSlider"].config.label					= xuic.__i18n.getLabel("seconds");
							calendar["_secondsSlider"].paint();
						}
					}
					if(typeof(calendar.config.dateFormat) !== "undefined"){
						calendar.config.dateFormat									= calendar.config.dateFormat.replace(calendar.config.dateDelimiter, xuic.__CONFIG.dateDelimiter);
						calendar.config.dateDelimiter								= xuic.__CONFIG.dateDelimiter;
					}
					calendar.config.weekStart										= xuic.__CONFIG.weekStartDay;
					calendar.paint();
					if(name.indexOf("DOUBLE") >= 0){
						calendar													= picker._uiRight;
						if(typeof(calendar) !== "undefined"){
							timepicker												= calendar["_timepicker"];
							if(typeof(timepicker) !== "undefined"){
								timepicker["_hoursSlider"].config.label				= xuic.__i18n.getLabel("hours");
								timepicker["_hoursSlider"].paint();
								timepicker["_minutesSlider"].config.label			= xuic.__i18n.getLabel("minutes");
								timepicker["_minutesSlider"].paint();
								if(typeof(timepicker["_secondsSlider"]) !== "undefined"){
									timepicker["_secondsSlider"].config.label		= xuic.__i18n.getLabel("seconds");
									timepicker["_secondsSlider"].paint();
								}
							}else if(typeof(calendar["_hoursSlider"]) !== "undefined"){
								calendar["_hoursSlider"].config.label				= xuic.__i18n.getLabel("hours");
								calendar["_hoursSlider"].paint();
								calendar["_minutesSlider"].config.label = xuic.__i18n.getLabel("minutes");
								calendar["_minutesSlider"].paint();
								if(typeof(calendar["_secondsSlider"]) !== "undefined"){
									calendar["_secondsSlider"].config.label			= xuic.__i18n.getLabel("seconds");
									calendar["_secondsSlider"].paint();
								}
							}
							if(typeof(calendar.config.dateFormat) !== "undefined"){
								calendar.config.dateFormat							= calendar.config.dateFormat.replace(calendar.config.dateDelimiter, xuic.__CONFIG.dateDelimiter);
								calendar.config.dateDelimiter						= xuic.__CONFIG.dateDelimiter;
							}
							calendar.config.weekStart								= xuic.__CONFIG.weekStartDay;
							calendar.paint();
						}
					}
				}
			}
		},
		reLink : function(picker, leftValue, rightValue){
			var left																= picker._uiLeft, right = picker._uiRight
			if(!xuic.__VALID.checkIsEmpty(left) && !xuic.__VALID.checkIsEmpty(right)){
				var disabled														= left.config.disabledDates;
				if(picker.name !== "DOUBLE_TIME_PICKER" && picker.name !== "DOUBLE_TIME_SECOND_PICKER"){
					left._unlink();
				}
				if(typeof(leftValue) !== "undefined"){
					if(!xuic.__VALID.checkIsEmpty(leftValue)){
						left.setValue(leftValue);
					}else{
						left.clear();
					}
				}
				if(typeof(rightValue) !== "undefined"){
					if(!xuic.__VALID.checkIsEmpty(rightValue)){
						right.setValue(rightValue);
					}else{
						right.clear();
					}
				}
				if(picker.name !== "DOUBLE_TIME_PICKER" && picker.name !== "DOUBLE_TIME_SECOND_PICKER"){
					left.link(right);
				}
				if(disabled != null){
					left.config.disabledDates										= disabled;
					right.config.disabledDates										= disabled;
				}
			}
		}
	};

	/*directive feature api*/
	xuic.__DIRECTIVE	= new __Directive();
	__Directive			= null;

	function __Regexp(){
		this.CMMN	= {
			"ALL_NUMBER"					: /[0-9]/g,
			"EXCEPT_NUMBER"					: /[^0-9]/g,
			"ALL_BLANK"						: /\s/g,
			"ALL_KOREAN"					: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g,
			"EXCEPT_KOREAN"					: /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g,
			"ALL_ENGLISH"					: /[a-zA-Z]/g,
			"EXCEPT_ENGLISH"				: /[^a-zA-Z]/g,
			"ALL_SPECIAL_CHAR"				: /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/g,
			"EXCEPT_SPECIAL_CHAR"			: /[^\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/g,
			"ALL_HTML_TAG"					: /(<([^>]+)>)/ig
		};
		this.VALID	= {
			"COMPLETE_KOREAN"				: /[^가-힣\x20]/gi,
			"PASSWORD_DEFAULT"				: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/,
			"SAME_WORD_FOUR"				: /(\w)\1\1\1/g,
			"YEAR"							: /^(?:19|20|21)[0-9]{2}$/,
			"MONTH"							: /^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])$/,
			"MONTH_FORMAT"					: new RegExp('^((?:19|20|21)[0-9]{2})' + xuic.__CONFIG.dateDelimiter + '(0[1-9]|1[012])$'),
			"DATE"							: /^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/,
			"DATEDAY"						: /^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])\((월요일|화요일|수요일|목요일|금요일|토요일|일요일)\)$/,
			"DATE_FORMAT"					: new RegExp('^((?:19|20|21)[0-9]{2})' + xuic.__CONFIG.dateDelimiter + '(0[1-9]|1[012])' + xuic.__CONFIG.dateDelimiter + '(0[1-9]|[12][0-9]|3[0-1])$'),
			"DATEDAY_FORMAT"				: new RegExp('^((?:19|20|21)[0-9]{2})' + xuic.__CONFIG.dateDelimiter + '(0[1-9]|1[012])' + xuic.__CONFIG.dateDelimiter + '(0[1-9]|[12][0-9]|3[0-1])\\((월요일|화요일|수요일|목요일|금요일|토요일|일요일)\\)$'),
			"TIME"							: /^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/,
			"TIME_FORMAT"					: /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/,
			"TIME_SECOND"					: /^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/,
			"TIME_SECOND_FORMAT"			: /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
			"DATETIME"						: /^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/,
			"DATETIME_FORMAT"				: new RegExp('^((?:19|20|21)[0-9]{2})' + xuic.__CONFIG.dateDelimiter + '(0[1-9]|1[012])' + xuic.__CONFIG.dateDelimiter + '(0[1-9]|[12][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$'),
			"DATETIME_SECOND"				: /^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/,
			"DATETIME_SECOND_FORMAT"		: new RegExp('^((?:19|20|21)[0-9]{2})' + xuic.__CONFIG.dateDelimiter + '(0[1-9]|1[012])' + xuic.__CONFIG.dateDelimiter + '(0[1-9]|[12][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$'),
			"NUMBER"						: /^(?:0|(-?[1-9]{1}([0-9]*)?))$/,
			"CURRENCY"						: /^(?:0|(-?[1-9]{1,3}(([\,][0-9]{3})*)?))$/,
			"DECIMAL_ROUND1"				: /^(?:0|-?[0][\.][0-9]{1}|-?[1-9](?:[0-9])*[\.][0-9]{1})$/,
			"DECIMAL_ROUND2"				: /^(?:0|-?[0][\.][0-9]{2}|-?[1-9](?:[0-9])*[\.][0-9]{2})$/,
			"DECIMAL_ROUND3"				: /^(?:0|-?[0][\.][0-9]{3}|-?[1-9](?:[0-9])*[\.][0-9]{3})$/,
			"DECIMAL_ROUND4"				: /^(?:0|-?[0][\.][0-9]{4}|-?[1-9](?:[0-9])*[\.][0-9]{4})$/,
			"DECIMAL_ROUND5"				: /^(?:0|-?[0][\.][0-9]{5}|-?[1-9](?:[0-9])*[\.][0-9]{5})$/,
			"DECIMAL_ROUND6"				: /^(?:0|-?[0][\.][0-9]{1}|-?[1-9](?:[0-9])*[\.][0-9]{6})$/,
			"DECIMAL_ROUND7"				: /^(?:0|-?[0][\.][0-9]{2}|-?[1-9](?:[0-9])*[\.][0-9]{7})$/,
			"DECIMAL_ROUND8"				: /^(?:0|-?[0][\.][0-9]{3}|-?[1-9](?:[0-9])*[\.][0-9]{8})$/,
			"DECIMAL_ROUND9"				: /^(?:0|-?[0][\.][0-9]{4}|-?[1-9](?:[0-9])*[\.][0-9]{9})$/,
			"DECIMAL_ROUND10"				: /^(?:0|-?[0][\.][0-9]{5}|-?[1-9](?:[0-9])*[\.][0-9]{10})$/,
			"BIZ"							: /^([0-9]{3})([0-9]{2})([0-9]{5})$/,
			"BIZ_FORMAT"					: /^([0-9]{3})-([0-9]{2})-([0-9]{5})$/,
			"CORP"							: /^([0-9]{6})([0-9]{7})$/,
			"CORP_FORMAT"					: /^([0-9]{6})-([0-9]{7})$/,
			"JURI"							: /^([0-9]{6})([0-9]{7})$/,
			"JURI_FORMAT"					: /^([0-9]{6})-([0-9]{7})$/,
			"IHID"							: /^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))([0-9]{1})([0-9]{6})$/,
			"IHID_FORMAT"					: /^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))-([0-9]{1})([0-9]{6})$/,
			"PHONE_REGULAR"					: /^(0(?:2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|50[0-9]{1}|60|70|80))([0-9]{3,4})([0-9]{4})$/,
			"PHONE_REGULAR_FORMAT"			: /^(0(?:2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|50[0-9]{1}|60|70|80))-([0-9]{3,4})-([0-9]{4})$/,
			"PHONE_MOBILE"					: /^(?:(010[0-9]{4})|(01[1|2|5|6|7|8|9][0-9]{3,4}))([0-9]{4})$/,
			"PHONE_MOBILE_FORMAT"			: /^(?:(010-[0-9]{4})|(01[1|2|5|6|7|8|9]-[0-9]{3,4}))-([0-9]{4})$/,
			"PHONE_BIZ"						: /^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)([0-9]{4})$/,
			"PHONE_BIZ_FORMAT"				: /^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)-([0-9]{4})$/,
			"PHONE_ZEROSEVENZERO"			: /^(070)([2-9]{1}[0-9]{3})([0-9]{4})$/,
			"PHONE_ZEROSEVENZERO_FORMAT"	: /^(070)-([2-9]{1}[0-9]{3})-([0-9]{4})$/,
			"PHONE_LOCAL_EXTENTION"			: /^([0-9]{4,5})$/,
			"PHONE_LOCAL_EXTENTION_FORMAT"	: /^([0-9]{4,5})$/,
			"CARD_ALL"						: /^(?:(9[0|4|5]{2}[0-9]{14})|(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|44[0-9]|560|561|564|565)[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11})|([0-9]{16}))$/,
			"CARD_BC"						: /^(9[0|4|5]{2})([0-9]{4})([0-9]{4})([0-9]{4})$/,
			"CARD_BC_FORMAT"				: /^(9[0|4|5]{2})-([0-9]{4})-([0-9]{4})-([0-9]{4})$/,
			"CARD_VISA"						: /^(4[0-9]{3}[0-9]{4}[0-9]{4}[0-9]{1}(?:[0-9]{3})?)$/,
			"CARD_VISA_FORMAT"				: /^(4[0-9]{3}-[0-9]{4}-[0-9]{4}-[0-9]{1}(?:[0-9]{3})?)$/,
			"CARD_MASTER"					: /^(5[1-5][0-9]{2}[0-9]{4}[0-9]{4}[0-9]{4})$/,
			"CARD_MASTER_FORMAT"			: /^(5[1-5][0-9]{2}-[0-9]{4}-[0-9]{4}-[0-9]{4})$/,
			"CARD_DISCOVER"					: /^(6(?:011|44[0-9]|560|561|564|565)[0-9]{4}[0-9]{4}[0-9]{4})$/,
			"CARD_DISCOVER_FORMAT"			: /^(6(?:011|44[0-9]|560|561|564|565)-[0-9]{4}-[0-9]{4}-[0-9]{4})$/,
			"CARD_AMEX"						: /^(3[47][0-9]{2}[0-9]{6}[0-9]{5})$/,
			"CARD_AMEX_FORMAT"				: /^(3[47][0-9]{2}-[0-9]{6}-[0-9]{5})$/,
			"CARD_DINERS"					: /^(3(?:0[0-5]|[68][0-9])[0-9]{1}[0-9]{6}[0-9]{4})$/,
			"CARD_DINERS_FORMAT"			: /^(3(?:0[0-5]|[68][0-9])[0-9]{1}-[0-9]{6}-[0-9]{4})$/,
			"CARD_JCB"						: /^((?:2131|1800|35[0-9]{3})[0-9]{3}[0-9]{4}[0-9]{4})$/,
			"CARD_JCB_FORMAT"				: /^((?:2131-|1800-|35[0-9]{2}-[0-9]{1})[0-9]{3}-[0-9]{4}-[0-9]{4})$/,
			"CARD_REGULAR"					: /^([0-9]{4}[0-9]{4}[0-9]{4}[0-9]{4})$/,
			"CARD_REGULAR_FORMAT"			: /^([0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4})$/,
			"EMAIL"							: /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/,
			"IP_ALL"						: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
			"IPV4"							: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
			"IPV6"							: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
			"POST"							: /^([0-9]{5})$/,
			"POST_OLD"						: /^([0-9]{3})([0-9]{3})$/,
			"POST_OLD_FORMAT"				: /^([0-9]{3})-([0-9]{3})$/,
			"CAR"							: /^((?:서울|부산|대구|인천|대전|광주|울산|제주|경기|강원|충남|충북|전남|전북|경남|경북|세종)[0-9]{2}|[0-9]{2,3})((?:가|나|다|라|마|거|너|더|러|머|버|서|어|저|고|노|도|로|모|보|소|오|조|구|누|두|루|무|부|수|우|주|바|사|아|자|허|배|호|하|국|합|육|해|공))([0-9]{4})$/,
			"URL"							: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
			"URL_INCLUDE_PROTOCOL"			: /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
			"HTML"							: /<(\"[^\"]*\"|'[^']*'|[^'\">])*>/
		};
		this.KEYEVENT	= {
			"YEAR"							: {pattern:"$1"																			,regexp:/^((?:19|20|21)[0-9]{2})$/																																										},
			"MONTH"							: {pattern:"$1" + xuic.__CONFIG.dateDelimiter + "$2"											,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?$/																																						},
			"DATE"							: {pattern:"$1" + xuic.__CONFIG.dateDelimiter + "$2" + xuic.__CONFIG.dateDelimiter + "$3"			,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?$/																															},
			"DATETIME"						: {pattern:"$1" + xuic.__CONFIG.dateDelimiter + "$2" + xuic.__CONFIG.dateDelimiter + "$3 $4:$5"		,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?(0[0-9]|1[0-9]|2[0-3])?([0-5][0-9])?$/																						},
			"DATETIME_SECOND"				: {pattern:"$1" + xuic.__CONFIG.dateDelimiter + "$2" + xuic.__CONFIG.dateDelimiter + "$3 $4:$5:$6"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?(0[0-9]|1[0-9]|2[0-3])?([0-5][0-9])?([0-5][0-9])?$/																			},
			"TIME"							: {pattern:"$1:$2"																		,regexp:/^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])?$/																																							},
			"TIME_SECOND"					: {pattern:"$1:$2:$3"																	,regexp:/^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])?([0-5][0-9])?$/																																			},
			"CURRENCY"						: {pattern:","																			,regexp:/\B(?=([0-9]{3})+(?![0-9]))/g																																									},
			"BIZ"							: {pattern:"$1-$2-$3"																	,regexp:/^([0-9]{3})([0-9]{2})?([0-9]{0,5})$/																																							},
			"CORP"							: {pattern:"$1-$2"																		,regexp:/^([0-9]{6})([0-9]{0,7})$/																																										},
			"JURI"							: {pattern:"$1-$2"																		,regexp:/^([0-9]{6})([0-9]{0,7})$/																																										},
			"IHID"							: {pattern:"$1-$2"																		,regexp:/^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))([0-9]{0,7})$/																															},
			"PHONE_REGULAR"					: {pattern:"$1-$2-$3"																	,regexp:/^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|050[0-9]{1}|060|070|080)([0-9]{3,4})?([0-9]{4})$/																											},
			"PHONE_MOBILE"					: {pattern:"$1-$2-$3"																	,regexp:/^(01[0|1|2|5|6|7|8|9])([0-9]{3,4})?([0-9]{4})$/																																					},
			"PHONE_BIZ"						: {pattern:"$1-$2"																		,regexp:/^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)([0-9]{0,4})$/																									},
			"PHONE_ZEROSEVENZERO"			: {pattern:"$1-$2-$3"																	,regexp:/^(070)([2-9]{1}[0-9]{3})?([0-9]{4})$/																																							},
			"PHONE_LOCAL_EXTENTION"			: {pattern:"$1"																			,regexp:/^([0-9]{4,5})$/																																												},
			"CARD_BC"						: {pattern:"$1-$2-$3-$4"																,regexp:/^(9[0|4|5]{2})([0-9]{4})?([0-9]{4})?([0-9]{4})?$/																																				},
			"CARD_VISA"						: {pattern:"$1-$2-$3-$4"																,regexp:/^(4[0-9]{3})([0-9]{4})?([0-9]{4})?([0-9]{1}(?:[0-9]{3})?)$/																																	},
			"CARD_MASTER"					: {pattern:"$1-$2-$3-$4"																,regexp:/^(5[1-5][0-9]{2})([0-9]{4})?([0-9]{4})?([0-9]{4})?$/																																			},
			"CARD_DISCOVER"					: {pattern:"$1-$2-$3-$4"																,regexp:/^(6(?:011|44[0-9]|560|561|564|565))([0-9]{4})?([0-9]{4})?([0-9]{4})?$/																															},
			"CARD_AMEX"						: {pattern:"$1-$2-$3"																	,regexp:/^(3[47][0-9]{2})([0-9]{6})?([0-9]{5})?$/																																						},
			"CARD_DINERS"					: {pattern:"$1-$2-$3"																	,regexp:/^(3(?:0[0-5]|[68][0-9])[0-9]{1})([0-9]{6})?([0-9]{4})?$/																																		},
			"CARD_JCB"						: {pattern:"$1-$2-$3-$4"																,regexp:/^(?:2131|1800|35[0-9]{2})([0-9]{3,4})?([0-9]{4})?([0-9]{4})?$/																																	},
			"CARD_REGULAR"					: {pattern:"$1-$2-$3-$4"																,regexp:/^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$/																																					},
			"IP"							: {pattern:"$1.$2"																		,regexp:/([0-9]{3})([0-9]{1})/																																											}
		};
		this.FORMAT	= {
			"YEAR"							: {pattern:"$1"																			,regexp:/^((?:19|20|21)[0-9]{2})$/																																										},
			"MONTH"							: {pattern:"$1" + xuic.__CONFIG.dateDelimiter + "$2"											,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])$/																																						},
			"DATE"							: {pattern:"$1" + xuic.__CONFIG.dateDelimiter + "$2" + xuic.__CONFIG.dateDelimiter + "$3"			,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/																																},
			"DATEDAY"						: {pattern:"$1" + xuic.__CONFIG.dateDelimiter + "$2" + xuic.__CONFIG.dateDelimiter + "$3" + "(" + "$4" + ")"  ,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])\((월요일|화요일|수요일|목요일|금요일|토요일|일요일)\)$/															},
			"DATETIME"						: {pattern:"$1" + xuic.__CONFIG.dateDelimiter + "$2" + xuic.__CONFIG.dateDelimiter + "$3 $4:$5"		,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/																							},
			"DATETIME_SECOND"				: {pattern:"$1" + xuic.__CONFIG.dateDelimiter + "$2" + xuic.__CONFIG.dateDelimiter + "$3 $4:$5:$6"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])?$/																				},
			"TIME"							: {pattern:"$1:$2"																		,regexp:/^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/																																							},
			"TIME_SECOND"					: {pattern:"$1:$2:$3"																	,regexp:/^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/																																				},
			"CURRENCY"						: {pattern:","																			,regexp:/\B(?=([0-9]{3})+(?![0-9]))/g																																									},
			"BIZ"							: {pattern:"$1-$2-$3"																	,regexp:/^([0-9]{3})([0-9]{2})([0-9]{0,5})$/																																							},
			"CORP"							: {pattern:"$1-$2"																		,regexp:/^([0-9]{6})([0-9]{0,7})$/																																										},
			"JURI"							: {pattern:"$1-$2"																		,regexp:/^([0-9]{6})([0-9]{0,7})$/																																										},
			"IHID"							: {pattern:"$1-$2$3"																	,regexp:/^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))([0-9]{1})([0-9]{6})$/																													},
			"PHONE_REGULAR"					: {pattern:"$1-$2-$3"																	,regexp:/^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|050[0-9]{1}|060|070|080)([0-9]{3,4})([0-9]{4})$/																											},
			"PHONE_MOBILE"					: {pattern:"$1-$2-$3"																	,regexp:/^(01[0|1|2|5|6|7|8|9])([0-9]{3,4})([0-9]{4})$/																																						},
			"PHONE_BIZ"						: {pattern:"$1-$2"																		,regexp:/^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)([0-9]{0,4})$/																									},
			"PHONE_ZEROSEVENZERO"			: {pattern:"$1-$2-$3"																	,regexp:/^(070)([2-9]{1}[0-9]{3})([0-9]{4})$/																																							},
			"PHONE_LOCAL_EXTENTION"			: {pattern:"$1"																			,regexp:/^([0-9]{4,5})$/																																												},
			"CARD_BC"						: {pattern:"$1-$2-$3-$4"																,regexp:/^(9[0|4|5]{2})([0-9]{4})([0-9]{4})([0-9]{4})$/																																					},
			"CARD_VISA"						: {pattern:"$1-$2-$3-$4"																,regexp:/^(4[0-9]{3})([0-9]{4})([0-9]{4})([0-9]{1}(?:[0-9]{3}))$/																																		},
			"CARD_MASTER"					: {pattern:"$1-$2-$3-$4"																,regexp:/^(5[1-5][0-9]{2})([0-9]{4})([0-9]{4})([0-9]{4})$/																																				},
			"CARD_DISCOVER"					: {pattern:"$1-$2-$3-$4"																,regexp:/^(6(?:011|44[0-9]|560|561|564|565))([0-9]{4})([0-9]{4})([0-9]{4})$/																															},
			"CARD_AMEX"						: {pattern:"$1-$2-$3"																	,regexp:/^(3[47][0-9]{2})([0-9]{6})([0-9]{5})$/																																							},
			"CARD_DINERS"					: {pattern:"$1-$2-$3"																	,regexp:/^(3(?:0[0-5]|[68][0-9])[0-9]{1})([0-9]{6})([0-9]{4})$/																																			},
			"CARD_JCB"						: {pattern:"$1-$2-$3-$4"																,regexp:/^(?:2131|1800|35[0-9]{2})([0-9]{3,4})([0-9]{4})([0-9]{4})$/																																	},
			"CARD_REGULAR"					: {pattern:"$1-$2-$3-$4"																,regexp:/^([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{4})$/																																					},
			"IP"							: {pattern:"$1.$2.$3.$4"																,regexp:/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))$/	},
			"POST"							: {pattern:"$1-$2"																		,regexp:/^([0-9]{3})([0-9]{3})$/																																										},
			"CAR"							: {pattern:"$1$2$3$4"																	,regexp:/^([가-힣]{2}[0-9]{2}|[0-9]{2,3})([가-힣]{1})([0-9]{1})([0-9]{3})$/																																},
			"IHID_MASKING"					: {pattern:"$1-$2******"																,regexp:/^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))([0-9]{1})([0-9]{6})$/																													},
			"PHONE_REGULAR_MASKING"			: {pattern:"$1-****-$3"																	,regexp:/^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|050[0-9]{1}|060|070|080)([0-9]{3,4})([0-9]{4})$/																											},
			"PHONE_MOBILE_MASKING"			: {pattern:"$1-****-$3"																	,regexp:/^(01[0|1|2|5|6|7|8|9])([0-9]{3,4})([0-9]{4})$/																																						},
			"PHONE_BIZ_MASKING"				: {pattern:"$1-****"																	,regexp:/^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)([0-9]{0,4})$/																									},
			"PHONE_ZEROSEVENZERO_MASKING"	: {pattern:"$1-****-$3"																	,regexp:/^(070)([2-9]{1}[0-9]{3})([0-9]{4})$/																																							},
			"CARD_BC_MASKING"				: {pattern:"$1-****-****-$4"															,regexp:/^(9[0|4|5]{2})([0-9]{4})([0-9]{4})([0-9]{4})$/																																					},
			"CARD_VISA_MASKING"				: {pattern:"$1-****-****-$4"															,regexp:/^(4[0-9]{3})([0-9]{4})([0-9]{4})([0-9]{1}(?:[0-9]{3}))$/																																		},
			"CARD_MASTER_MASKING"			: {pattern:"$1-****-****-$4"															,regexp:/^(5[1-5][0-9]{2})([0-9]{4})([0-9]{4})([0-9]{4})$/																																				},
			"CARD_DISCOVER_MASKING"			: {pattern:"$1-****-****-$4"															,regexp:/^(6(?:011|44[0-9]|560|561|564|565))([0-9]{4})([0-9]{4})([0-9]{4})$/																															},
			"CARD_AMEX_MASKING"				: {pattern:"$1-******-$3"																,regexp:/^(3[47][0-9]{2})([0-9]{6})([0-9]{5})$/																																							},
			"CARD_DINERS_MASKING"			: {pattern:"$1-******-$3"																,regexp:/^(3(?:0[0-5]|[68][0-9])[0-9]{1})([0-9]{6})([0-9]{4})$/																																			},
			"CARD_JCB_MASKING"				: {pattern:"$1-****-****-$4"															,regexp:/^(?:2131|1800|35[0-9]{2})([0-9]{3,4})([0-9]{4})([0-9]{4})$/																																	},
			"CARD_REGULAR_MASKING"			: {pattern:"$1-****-****-$4"															,regexp:/^([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{4})$/																																					},
			"EMAIL_MASKING"					: {pattern:"$1****$3"																	,regexp:/^([\w.]{3})(?:[\w.]*)(@.*)$/																																									},
			"CAR_MASKING"					: {pattern:"$1$2$3***"																	,regexp:/^([가-힣]{2}[0-9]{2}|[0-9]{2,3})([가-힣]{1})([0-9]{1})([0-9]{3})$/																																},
		};
		this.BANK	= {
			"002"							: {name:"KDB_ALL"				,pattern:""												,regexp:/^(?:([0-9]{3})(?:11|13|19|20|22)([0-9]{5})([0-9]{1})|(?:011|013|019|020|022)([0-9]{7})([0-9]{1})([0-9]{3})|(?:010|036)([0-9]{8})([0-9]{3}))$/																																																								},
			"002_0"							: {name:"KDB_OLD"				,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:11|13|19|20|22))([0-9]{5})([0-9]{1})$/																																																																														},
			"002_1"							: {name:"KDB_NEW"				,pattern:"$1-$2-$3-$4"									,regexp:/^((?:011|013|019|020|022)([0-9]{7}))([0-9]{1})([0-9]{3})$/																																																																													},
			"002_2"							: {name:"KDB_NEW_IN_ONLY"		,pattern:"$1-$2-$3"										,regexp:/^((?:010|036))([0-9]{8})([0-9]{3})$/																																																																																		},
			"003"							: {name:"IBK_ALL"				,pattern:""												,regexp:/^(?:([0-9]{8})([0-9]{2})|([0-9]{3})([0-9]{8})|([0-9]{3})(?:01|02|03|04|06|07|13)([0-9]{6})([0-9]{1})|([0-9]{3})([0-9]{6})(?:01|02|03|04|06|07|13)([0-9]{2})([0-9]{1}))$/																																																	},
			"003_0"							: {name:"IBK_WHOLE_LIFE_01"		,pattern:"$1-$2"										,regexp:/^([0-9]{8})([0-9]{2})$/																																																																																					},
			"003_1"							: {name:"IBK_WHOLE_LIFE_02"		,pattern:"$1-$2"										,regexp:/^([0-9]{3})([0-9]{8})$/																																																																																					},
			"003_2"							: {name:"IBK_NONE_ADDITIONAL"	,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:01|02|03|04|06|07|13))([0-9]{6})([0-9]{1})$/																																																																												},
			"003_3"							: {name:"IBK_ADDITIONAL"		,pattern:"$1-$2-$3-$4-$5"								,regexp:/^([0-9]{3})([0-9]{6})((?:01|02|03|04|06|07|13))([0-9]{2})([0-9]{1})$/																																																																										},
			"004"							: {name:"KB_ALL"				,pattern:""												,regexp:/^(?:(0[0-9]{2})([0-9]{3,4})([0-9]{4})|(9[0-9]{10})|([0-9]{3})(?:01|04|05|21|24|25|26)([0-9]{4})([0-9]{2})([0-9]{1})|([0-9]{4})(?:92)([0-9]{7})([0-9]{1}))$/																																																				},
			"004_0"							: {name:"KB_CUSTOM"				,pattern:"$1-$2-$3"										,regexp:/^(0[0-9]{2})([0-9]{3,4})([0-9]{4})$/																																																																																		},
			"004_1"							: {name:"KB_WHOLE_LIFE"			,pattern:"$1"											,regexp:/^(9[0-9]{10})$/																																																																																							},
			"004_2"							: {name:"KB_01"					,pattern:"$1-$2-$3-$4-$5"								,regexp:/^([0-9]{3})((?:01|04|05|21|24|25|26))([0-9]{4})([0-9]{2})([0-9]{1})$/																																																																										},
			"004_3"							: {name:"KB_VIRTUAL"			,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{4})((?:92))([0-9]{7})([0-9]{1})$/																																																																																	},
			"005"							: {name:"KEB_OLD_ALL"			,pattern:""												,regexp:/^(?:([0-9]{3})(?:11|13|15|18|19|22|23|24|26|29|33|38|39|70|73|74|75|77)([0-9]{5})([0-9]{1})|(?:600,601,610,611,620,621,630,631,700,703,704,705,707,710,711,712,713,714,715,716,810,811,814,815,817,818)([0-9]{6})([0-9]{3}))$/																																				},
			"005_0"							: {name:"KEB_OLD_01"			,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:11|13|15|18|19|22|23|24|26|29|33|38|39|70|73|74|75|77))([0-9]{5})([0-9]{1})$/																																																																				},
			"005_1"							: {name:"KEB_OLD_02"			,pattern:"$1-$2-$3"										,regexp:/^((?:600,601,610,611,620,621,630,631,700,703,704,705,707,710,711,712,713,714,715,716,810,811,814,815,817,818))([0-9]{6})([0-9]{3})$/																																																										},
			"006"							: {name:"KB_OLD_ALL"			,pattern:""												,regexp:/^(?:([0-9]{4})(?:06|18)([0-9]{5})([0-9]{1})|([0-9]{4})(?:01|02|25|37|90)([0-9]{7})([0-9]{1}))$/																																																																			},
			"006_0"							: {name:"KB_OLD_01"				,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{4})((?:06|18))([0-9]{5})([0-9]{1})$/																																																																																},
			"006_1"							: {name:"KB_OLD_02"				,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{4})((?:01|02|25|37|90))([0-9]{7})([0-9]{1})$/																																																																														},
			"007"							: {name:"SUHYUP_ALL"			,pattern:""												,regexp:/^(?:([0-9]{3})(?:01|02|03|06|08|13|61|62|63|67)([0-9]{5})([0-9]{1})|(?:101|102|103|106|108|113|114|167|201|202|206|208|209)([0-9]{8})([0-9]{1})|(0)([0-9]{11})|([0-9]{3})(?:40)([0-9]{8})([0-9]{1}))$/																																										},
			"007_0"							: {name:"SUHYUP_01"				,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:01|02|03|06|08|13|61|62|63|67))([0-9]{5})([0-9]{1})$/																																																																										},
			"007_1"							: {name:"SUHYUP_02"				,pattern:"$1-$2-$3"										,regexp:/^((?:101|102|103|106|108|113|114|167|201|202|206|208|209))([0-9]{8})([0-9]{1})$/																																																																							},
			"007_2"							: {name:"SUHYUP_CUSTOM"			,pattern:"$1-$2"										,regexp:/^(0)([0-9]{11})$/																																																																																							},
			"007_3"							: {name:"SUHYUP_VIRTUAL"		,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:40))([0-9]{8})([0-9]{1})$/																																																																																	},
			"011"							: {name:"NH_BANK_ALL"			,pattern:""												,regexp:/^(?:([0-9]{3,4})(?:01|02|04|05|06|10|12|14|17|21|24|28|31|34|43|45|46|47|49|59|79|80|81|86|87|88)([0-9]{5})([0-9]{1})|(?:028|031|043|046|079|081|086|087|088|301|302|304|305|306|310|312|314|317|321|324|334|345|347|349|359|380)([0-9]{4})([0-9]{4})([0-9]{1})([1-2]{1})|([0-9]{6})(?:64,65)([0-9]{5})([0-9]{1})|(?:790,791)([0-9]{4})([0-9]{4})([0-9]{2})([0-9]{1}))$/	},
			"011_0"							: {name:"NH_BANK_01"			,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3,4})((?:01|02|04|05|06|10|12|14|17|21|24|28|31|34|43|45|46|47|49|59|79|80|81|86|87|88))([0-9]{5})([0-9]{1})$/																																																														},
			"011_1"							: {name:"NH_BANK_02"			,pattern:"$1-$2-$3-$4-$5"								,regexp:/^((?:028|031|043|046|079|081|086|087|088|301|302|304|305|306|310|312|314|317|321|324|334|345|347|349|359|380))([0-9]{4})([0-9]{4})([0-9]{1})([1-2]{1})$/																																																					},
			"011_2"							: {name:"NH_BANK_VIRTUAL_OLD"	,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{6})((?:64,65))([0-9]{5})([0-9]{1})$/																																																																																},
			"011_3"							: {name:"NH_BANK_VIRTUAL_NEW"	,pattern:"$1-$2-$3-$4-$5"								,regexp:/^((?:790,791))([0-9]{4})([0-9]{4})([0-9]{2})([0-9]{1})$/																																																																													},
			"012"							: {name:"NH_CENTER_ALL"			,pattern:""												,regexp:/^(?:(?:028|351|352|354|355|356|360|384|394|398)([0-9]{4})([0-9]{4})([0-9]{1})([345]{1})|([0-9]{6})(?:51|52|55|56)([0-9]{5})([0-9]{1})|([0-9]{6})(?:66|67)([0-9]{5})([0-9]{1})|(?:792)([0-9]{4})([0-9]{4})([0-9]{2})([0-9]{1}))$/																																			},
			"012_0"							: {name:"NH_CENTER_01"			,pattern:"$1-$2-$3-$4-$5"								,regexp:/^((?:028|351|352|354|355|356|360|384|394|398))([0-9]{4})([0-9]{4})([0-9]{1})([345]{1})$/																																																																					},
			"012_1"							: {name:"NH_CENTER_02"			,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{6})((?:51|52|55|56))([0-9]{5})([0-9]{1})$/																																																																															},
			"012_2"							: {name:"NH_CENTER_VIRTUAL_OLD"	,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{6})((?:66|67))([0-9]{5})([0-9]{1})$/																																																																																},
			"012_3"							: {name:"NH_CENTER_VIRTUAL_NEW"	,pattern:"$1-$2-$3-$4-$5"								,regexp:/^((?:792))([0-9]{4})([0-9]{4})([0-9]{2})([0-9]{1})$/																																																																														},
			"020"							: {name:"WOORI_01_ALL"			,pattern:""												,regexp:/^(?:([0-9]{1})(?:002|003|004|005|006|007)([0-9]{3})([0-9]{6})|([0-9]{3})([0-9]{6})(?:18|92)([0-9]{2})([0-9]{1})|([0-9]{3})(?:01|02|04|05|06|07|08)([0-9]{5})([0-9]{1})|([0-9]{3})([0-9]{6})(?:01|02|03|04|12|13|15)([0-9]{2})([0-9]{1})|([0-9]{3})(?:01|04|05|09|21|24|25)([0-9]{6})([0-9]{1}))$/																			},
			"020_0"							: {name:"WOORI_01_01"			,pattern:"$1-$2-$3"										,regexp:/^([0-9]{1})((?:002|003|004|005|006|007))([0-9]{3})([0-9]{6})$/																																																																												},
			"020_1"							: {name:"WOORI_01_02"			,pattern:"$1-$2-$3-$4-$5"								,regexp:/^([0-9]{3})([0-9]{6})((?:18|92))([0-9]{2})([0-9]{1})$/																																																																														},
			"020_2"							: {name:"WOORI_OLD_SANGUP"		,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:01|02|04|05|06|07|08))([0-9]{5})([0-9]{1})$/																																																																												},
			"020_3"							: {name:"WOORI_OLD_HANIL"		,pattern:"$1-$2-$3-$4-$5"								,regexp:/^([0-9]{3})([0-9]{6})((?:01|02|03|04|12|13|15))([0-9]{2})([0-9]{1})$/																																																																										},
			"020_4"							: {name:"WOORI_OLD_PYEONGHWA"	,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:01|04|05|09|21|24|25))([0-9]{6})([0-9]{1})$/																																																																												},
			"021"							: {name:"SHINHAN_JOHEUNG_ALL"	,pattern:""												,regexp:/^(?:([0-9]{3})(?:01|02|03|04|05|06|07|08|09|61)([0-9]{5})([0-9]{1})|([0-9]{3})(?:81)([0-9]{7})([0-9]{1})|([0-9]{3})(?:82)([0-9]{8}))$/																																																										},
			"021_0"							: {name:"SHINHAN_JOHEUNG_01"	,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:01|02|03|04|05|06|07|08|09|61))([0-9]{5})([0-9]{1})$/																																																																										},
			"021_1"							: {name:"SHINHAN_JOHEUNG_02"	,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:81))([0-9]{7})([0-9]{1})$/																																																																																	},
			"021_2"							: {name:"SHINHAN_JOHEUNG_03"	,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})((?:82))([0-9]{8})$/																																																																																			},
			"023"							: {name:"SC_JAEIL_ALL"			,pattern:""												,regexp:/^(?:([0-9]{3})(?:10|15|20|30)([0-9]{6})|([0-9]{3})(?:16)([0-9]{9))$/																																																																										},
			"023_0"							: {name:"SC_JAEIL_01"			,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})((?:10|15|20|30))([0-9]{6})$/																																																																																	},
			"023_1"							: {name:"SC_JAEIL_VIRTUAL"		,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})((?:16))([0-9]{9)$/																																																																																				},
			"026"							: {name:"SHINHAN_OLD_ALL"		,pattern:""												,regexp:/^(?:([0-9]{3})(?:01|02|03|04|05|11|12|13|99)([0-9]{5})([0-9]{1})|([0-9]{3})(?:901)([0-9]{7})([0-9]{1}))$/																																																																	},
			"026_0"							: {name:"SHINHAN_OLD_01"		,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:01|02|03|04|05|11|12|13|99))([0-9]{5})([0-9]{1})$/																																																																											},
			"026_1"							: {name:"SHINHAN_OLD_02"		,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:901))([0-9]{7})([0-9]{1})$/																																																																																	},
			"027"							: {name:"CITY_ALL"				,pattern:""												,regexp:/^(?:([0-9]{3})([0-9]{5})(?:01|03|05|06|07|11|13|15|21|23|24|25|26|27|29|31|33|41|42|43|51|53|55|63|71|81|91|92|99)([0-9]{1})([0-9]{2})|([0-9]{1})([0-9]{6})([0-9]{1})(?:18|24|25|41)([0-9]{2})|([0-9]{3})([0-9]{5})(?:01|03|05|06|07|11|13|15|21|23|24|25|26|27|29|31|33|41|42|43|51|53|55|63|71|81|91|92|99)([0-9]{1}))$/													},
			"027_0"							: {name:"CITY_01"				,pattern:"$1-$2-$3-$4-$5"								,regexp:/^([0-9]{3})([0-9]{5})((?:01|03|05|06|07|11|13|15|21|23|24|25|26|27|29|31|33|41|42|43|51|53|55|63|71|81|91|92|99))([0-9]{1})([0-9]{2})$/																																																									},
			"027_1"							: {name:"CITY_02"				,pattern:"$1-$2-$3-$4-$5"								,regexp:/^([0-9]{1})([0-9]{6})([0-9]{1})((?:18|24|25|41))([0-9]{2})$/																																																																												},
			"027_2"							: {name:"CITY_HANMI"			,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})([0-9]{5})((?:01|03|05|06|07|11|13|15|21|23|24|25|26|27|29|31|33|41|42|43|51|53|55|63|71|81|91|92|99))([0-9]{1})$/																																																												},
			"031"							: {name:"DEAGU_ALL"				,pattern:""												,regexp:/^(?:([0-9]{3})(?:01|02|04|05|06|07|08|10|12|13|14|19|20|21|25|27|28)([0-9]{6})|([0-9]{3})(?:01|02|04|05|07|08|19|20|21|25|27|28)([0-9]{6})([0-9]{1})|(?:501|502|504|505|508|519|520|521|525|527|528)([0-9]{2})([0-9]{6})([0-9]{1})|([0-9]{3})(?:01|02|04|05|06|07|08|19|20|21|25|27|28)([0-9]{6})([0-9]{3}))$/																},
			"031_0"							: {name:"DEAGU_01"				,pattern:"$1-$2-$3-"									,regexp:/^([0-9]{3})((?:01|02|04|05|06|07|08|10|12|13|14|19|20|21|25|27|28))([0-9]{6})$/																																																																							},
			"031_1"							: {name:"DEAGU_02"				,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:01|02|04|05|07|08|19|20|21|25|27|28))([0-9]{6})([0-9]{1})$/																																																																									},
			"031_2"							: {name:"DEAGU_03"				,pattern:"$1-$2-$3-$4"									,regexp:/^((?:501|502|504|505|508|519|520|521|525|527|528))([0-9]{2})([0-9]{6})([0-9]{1})$/																																																																							},
			"031_3"							: {name:"DEAGU_04"				,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:01|02|04|05|06|07|08|19|20|21|25|27|28))([0-9]{6})([0-9]{3})$/																																																																								},
			"032"							: {name:"BUSAN_ALL"				,pattern:""												,regexp:/^(?:([0-9]{3})(?:01|02|03|09|11|12|13)([0-9]{6})([0-9]{1})|(?:101|102|103|109|112|113)([0-9]{4})([0-9]{4})([0-9]{2}))$/																																																													},
			"032_0"							: {name:"BUSAN_01"				,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:01|02|03|09|11|12|13))([0-9]{6})([0-9]{1})$/																																																																												},
			"032_1"							: {name:"BUSAN_02"				,pattern:"$1-$2-$3-$4"									,regexp:/^((?:101|102|103|109|112|113))([0-9]{4})([0-9]{4})([0-9]{2})$/																																																																												},
			"034"							: {name:"GWNAGJU_ALL"			,pattern:""												,regexp:/^(?:([0-9]{3})(?:101|103|107|108|109|121|122|123|124|127|716)([0-9]{5})([0-9]{1})|([0-9]{3})(?:731)([0-9]{6})|([0-9]{1})(?:101|103|107|109|121|127)([0-9]{9}))$/																																																			},
			"034_0"							: {name:"GWNAGJU_01"			,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})((?:101|103|107|108|109|121|122|123|124|127|716))([0-9]{5})([0-9]{1})$/																																																																							},
			"034_1"							: {name:"GWNAGJU_02"			,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})((?:731))([0-9]{6})$/																																																																																			},
			"034_2"							: {name:"GWNAGJU_03"			,pattern:"$1-$2-$3"										,regexp:/^([0-9]{1})((?:101|103|107|109|121|127))([0-9]{9})$/																																																																														},
			"035"							: {name:"JEJU_ALL"				,pattern:""												,regexp:/^(?:([0-9]{2})(?:01|02|03|04|05|13)([0-9]{6}))$/																																																																															},
			"035_0"							: {name:"JEJU_01"				,pattern:"$1-$2-$3"										,regexp:/^([0-9]{2})((?:01|02|03|04|05|13))([0-9]{6})$/																																																																																},
			"037"							: {name:"JEONBUK_ALL"			,pattern:""												,regexp:/^(?:([0-9]{3})(?:01|02|03|11|12|13|15|21|22|23|35|36|37)([0-9]{7})|([0-9]{1})(?:011|012|013|021|023)([0-9]{2})([0-9]{7}))$/																																																												},
			"037_0"							: {name:"JEONBUK_01"			,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})((?:01|02|03|11|12|13|15|21|22|23|35|36|37))([0-9]{7})$/																																																																										},
			"037_1"							: {name:"JEONBUK_02"			,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{1})((?:011|012|013|021|023))([0-9]{2})([0-9]{7})$/																																																																													},
			"039"							: {name:"GYEONGNAM_ALL"			,pattern:""												,regexp:/^(?:([0-9]{3})(?:01|03|07|09|20|21|22|32|35|)([0-9]{7})|(?:201|203|207|209|220|221|222|232|235)([0-9]{9})([0-9]{1}))$/																																																														},
			"039_0"							: {name:"GYEONGNAM_01"			,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})((?:01|03|07|09|20|21|22|32|35|))([0-9]{7})$/																																																																													},
			"039_1"							: {name:"GYEONGNAM_02"			,pattern:"$1-$2-$3"										,regexp:/^((?:201|203|207|209|220|221|222|232|235))([0-9]{9})([0-9]{1})$/																																																																											},
			"045"							: {name:"MG_ALL"				,pattern:""												,regexp:/^(?:([0-9]{4})(?:09|10|13|37)([0-9]{6})([0-9]{1})|([0-9]{4})(?:801|802|803|804|805|806|807|808|809|810|851|852|853|854|855|856|857|858|859|860)([0-9]{6})([0-9]{1})|(?:9002|9003|9004|9005|9072|9090|9091|9092|9093|9200|9202|9205|9207|9208|9209|9210|9212)([0-9]{8})([0-9]{1}))$/																						},
			"045_0"							: {name:"MG_01"					,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{4})((?:09|10|13|37))([0-9]{6})([0-9]{1})$/																																																																															},
			"045_1"							: {name:"MG_02"					,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{4})((?:801|802|803|804|805|806|807|808|809|810|851|852|853|854|855|856|857|858|859|860))([0-9]{6})([0-9]{1})$/																																																														},
			"045_2"							: {name:"MG_03"					,pattern:"$1-$2-$3"										,regexp:/^((?:9002|9003|9004|9005|9072|9090|9091|9092|9093|9200|9202|9205|9207|9208|9209|9210|9212))([0-9]{8})([0-9]{1})$/																																																															},
			"048"							: {name:"CU_ALL"				,pattern:""												,regexp:/^(?:([0-9]{5})(?:12|13|14)([0-9]{5,6})([0-9]{1})|([0-9]{3})([0-9]{3})([0-9]{4)|([0-9]{3})([0-9]{4})([0-9]{4})|(?:110|131|132|133|134|135|136|137|138|170|171|173|174|177|178|182|731|910)([0-9]{3})([0-9]{5})([0-9]{1}))$/																																					},
			"048_0"							: {name:"CU_01"					,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{5})((?:12|13|14))([0-9]{5,6})([0-9]{1})$/																																																																															},
			"048_1"							: {name:"CU_02"					,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})([0-9]{3})([0-9]{4)$/																																																																																			},
			"048_2"							: {name:"CU_03"					,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})([0-9]{4})([0-9]{4})$/																																																																																			},
			"048_3"							: {name:"CU_04"					,pattern:"$1-$2-$3-$4"									,regexp:/^((?:110|131|132|133|134|135|136|137|138|170|171|173|174|177|178|182|731|910))([0-9]{3})([0-9]{5})([0-9]{1})$/																																																																},
			"050"							: {name:"FSB_ALL"				,pattern:""												,regexp:/^(?:([0-9]{3})([0-9]{2})(?:13|21|22|23)([0-9]{6})([0-9]{1}))$/																																																																												},
			"050_0"							: {name:"FSB_01"				,pattern:"$1-$2-$3-$4-$5"								,regexp:/^([0-9]{3})([0-9]{2})((?:13|21|22|23))([0-9]{6})([0-9]{1})$/																																																																												},
			"053"							: {name:"CITY_OLD_ALL"			,pattern:""												,regexp:/^(?:(?:0|5)([0-9]{6})([0-9]{2})([0-9]{1})|([0-9]{2})(?:[0156][0-9]|2[0-1]|30|3[2-8]|[49][1-6]|7[0-1]|7[3-8]|8[0-1]|8[3-8]|99)([0-9]{5})([0-9]{1}))$/																																																						},
			"053_0"							: {name:"CITY_OLD_01"			,pattern:"$1-$2-$3-$4"									,regexp:/^((?:0|5))([0-9]{6})([0-9]{2})([0-9]{1})$/																																																																																	},
			"053_1"							: {name:"CITY_OLD_02"			,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{2})((?:[0156][0-9]|2[0-1]|30|3[2-8]|[49][1-6]|7[0-1]|7[3-8]|8[0-1]|8[3-8]|99))([0-9]{5})([0-9]{1})$/																																																																},
			"064"							: {name:"NFCF_ALL"				,pattern:""												,regexp:/^(?:([0-9]{5})(?:21|22|27|30|32)([0-9]{6})|([0-9]{3})(?:11|12|13|14|15)([0-9]{7}))$/																																																																						},
			"064_0"							: {name:"NFCF_01"				,pattern:"$1-$2-$3"										,regexp:/^([0-9]{5})((?:21|22|27|30|32))([0-9]{6})$/																																																																																},
			"064_1"							: {name:"NFCF_02"				,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})((?:11|12|13|14|15))([0-9]{7})$/																																																																																},
			"071"							: {name:"POST_ALL"				,pattern:""												,regexp:/^(?:([0-9]{6})(?:01|02|03|05|06|52)([0-9]{6}))$/																																																																															},
			"071_0"							: {name:"POST_01"				,pattern:"$1-$2-$3"										,regexp:/^([0-9]{6})((?:01|02|03|05|06|52))([0-9]{6})$/																																																																																},
			"088"							: {name:"SHINHAN_ALL"			,pattern:""												,regexp:/^(?:(?:10[0-9]|11[0-9]|12[0-9]|13[0-9]14[0-9]|15[0-9]|16[0-1]|268|269|298)([0-9]{8})([0-9]{1})|(?:560(?!901)|561(?!901)|562(?!901))([0-9]{3})([0-9]{7})([0-9]{1}))$/																																																		},
			"088_0"							: {name:"SHINHAN_01"			,pattern:"$1-$2-$3"										,regexp:/^((?:10[0-9]|11[0-9]|12[0-9]|13[0-9]14[0-9]|15[0-9]|16[0-1]|268|269|298))([0-9]{8})([0-9]{1})$/																																																																			},
			"088_1"							: {name:"SHINHAN_02"			,pattern:"$1-$2-$3-$4"									,regexp:/^((?:560(?!901)|561(?!901)|562(?!901)))([0-9]{3})([0-9]{7})([0-9]{1})$/																																																																									},
			"081"							: {name:"KEB_ALL"				,pattern:""												,regexp:/^([0-9]{3})([0-9]{9})(?:01|02|04|05|07|08|37|60|94)$/																																																																														},
			"081_0"							: {name:"KEB_01"				,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})([0-9]{9})((?:01|02|04|05|07|08|37|60|94))$/																																																																													},
			"084"							: {name:"WOORI_02_ALL"			,pattern:""												,regexp:/^([0-9]{1})(?:002|003|004|005|006|007)([0-9]{3})([0-9]{6})$/																																																																												},
			"084_0"							: {name:"WOORI_02_01"			,pattern:"$1-$2-$3"										,regexp:/^([0-9]{1})((?:002|003|004|005|006|007))([0-9]{3})([0-9]{6})$/																																																																												},
			"089"							: {name:"KBANK_ALL"				,pattern:""												,regexp:/^(?:(?:9)([0-9]{9})|([0-9]{3})([0-9]{3})([0-9]{6})|([0-9]{2})(01[0|1|6|7|8|9])([0-9]{4})([0-9]{4})|([7|9]{1}[0-9]{2})([0-9]{4})([0-9]{3})([0-9]{4})|([0-9]{3})([0-9]{4})([0-9]{3})([0-9]{4}))$/																																											},
			"089_0"							: {name:"KBANK_01"				,pattern:"$1-$2"										,regexp:/^((?:9))([0-9]{9})$/																																																																																						},
			"089_1"							: {name:"KBANK_02"				,pattern:"$1-$2-$3"										,regexp:/^([0-9]{3})([0-9]{3})([0-9]{6})$/																																																																																			},
			"089_2"							: {name:"KBANK_CUSTOM"			,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{2})(01[0|1|6|7|8|9])([0-9]{4})([0-9]{4})$/																																																																															},
			"089_3"							: {name:"KBANK_04"				,pattern:"$1-$2-$3-$4"									,regexp:/^([7|9]{1}[0-9]{2})([0-9]{4})([0-9]{3})([0-9]{4})$/																																																																														},
			"089_4"							: {name:"KBANK_05"				,pattern:"$1-$2-$3-$4"									,regexp:/^([0-9]{3})([0-9]{4})([0-9]{3})([0-9]{4})$/																																																																																},
			"090"							: {name:"KAKAO_ALL"				,pattern:""												,regexp:/^(?:([0-9]{4})([0-9]{2})([0-9]{7}))$/																																																																																		},
			"090_0"							: {name:"KAKAO_01"				,pattern:"$1-$2-$3"										,regexp:/^([0-9]{4})([0-9]{2})([0-9]{7})$/																																																																																			}
		};
	};
	__Regexp.prototype	= {
		setRegexp : function(group, name, regexp){
			if(!xuic.__VALID.checkIsEmpty(group) && !xuic.__VALID.checkIsEmpty(name) && !xuic.__VALID.checkIsEmpty(regexp)){
				if(!this.hasOwnProperty(group)){
					this[group]		= {};
				}
				this[group][name]	= regexp;
			}
		},
		getRegexp : function(group, name){
			var regexp	= null;
			if(!xuic.__VALID.checkIsEmpty(group) && !xuic.__VALID.checkIsEmpty(name) && this.hasOwnProperty(group) && this[group].hasOwnProperty(name)){
				regexp	= this[group][name];
			}
			return regexp;
		},
		setCmmnRegexp : function(name, regexp){
			this.setRegexp("CMMN", name, regexp);
		},
		getCmmnRegexp : function(name){
			return this.getRegexp("CMMN", name);
		},
		setValidRegexp : function(name, regexp){
			this.setRegexp("VALID", name, regexp);
		},
		getValidRegexp : function(name){
			return this.getRegexp("VALID", name);
		},
		setKeyEventRegexp : function(name, regexp){
			this.setRegexp("KEYEVENT", name, regexp);
		},
		getKeyEventRegexp : function(name){
			return this.getRegexp("KEYEVENT", name);
		},
		setFormatRegexp : function(name, regexp){
			this.setRegexp("FORMAT", name, regexp);
		},
		getFormatRegexp : function(name, controlSecond, isMasking, data){
			if(!xuic.__VALID.checkIsEmpty(name)){
				if(xuic.__VALID.checkIsEmpty(controlSecond)){
					controlSecond	= true;
				}
				if(!xuic.__VALID.checkIsEmpty(data)){
					data			= data.toString();
					var oneChar		= data.substr(0,1), twoChar = data.substr(0,2), threeChar = data.substr(0,3), fourChar = data.substr(0,4);
					if(name === "PHONE"){
						if(oneChar === "1"){
							name	+= "_BIZ";
						}else if(twoChar === "01"){
							name	+= "_MOBILE";
						}else if(threeChar === "070"){
							name	+= "_ZEROSEVENZERO";
						}else if(data.length === 4 || data.length === 5){
							name	+= "_LOCAL_EXTENTION";
						}else{
							name	+= "_REGULAR";
						}
					}else if(name === "CARD"){
						if(fourChar === "2131" || fourChar === "1800" || twoChar === "35"){
							name	+= "_JCB";
						}else if(twoChar === "34" || twoChar === "37"){
							name	+= "_AMEX";
						}else if(twoChar === "30" || twoChar === "36" || twoChar === "38"){
							name	+= "_DINERS";
						}else if(oneChar === "9"){
							name	+= "_BC";
						}else if(oneChar === "4"){
							name	+= "_VISA";
						}else if(oneChar === "5"){
							name	+= "_MASTER";
						}else if(fourChar === "6011" || fourChar === "6560" || fourChar === "6561" || fourChar === "6564" || fourChar === "6565" || threeChar === "644"){
							name	+= "_DISCOVER";
						}else{
							name	+= "_REGULAR";
						}
					}
				}
				if(controlSecond && name.indexOf("_SECOND") < 0 && name.indexOf("TIME") >= 0){
					name			+= "_SECOND";
				}
				if(isMasking && name.indexOf("_MASKING") < 0){
					name			+= "_MASKING";
				}
			}
			return this.getRegexp("FORMAT", name);
		},
		setBankRegexp : function(name, regexp){
			this.setRegexp("BANK", name, regexp);
		},
		getBankRegexp : function(name){
			return this.getRegexp("BANK", name);
		},
		checkValid : function(data, name){
			var regexp	= this.getValidRegexp(name);
			var isValid	= false;
			if(regexp !== null){
				isValid	= regexp.test(data);
			}
			return isValid;
		},
		getFormatPatternData : function(data, name, controlSecond, isMasking){
			var regexp	= this.getFormatRegexp(name, controlSecond, isMasking, data);
			if(regexp !== null){
				data	= data.replace(regexp.regexp, regexp.pattern);
			}
			return data;
		},
		getKeyEventPatternData : function(data, name){
			var regexp	= this.getKeyEventRegexp(name);
			if(regexp !== null){
				data	= data.replace(regexp.regexp, regexp.pattern);
			}
			return data;
		}
	};

	/*regexp feature api*/
	xuic.__REGEXP	= new __Regexp();
	__Regexp		= null;

	function __Com(){
		this.XSS_RESTORE_TARGET	= [];
	};
	__Com.prototype	= {
		setXSSRestoreTarget : function(tagList){
			if(typeof(opener) !== "undefined" && opener !== null){
				this.XSS_RESTORE_TARGET			= opener.top.xuic.__COM.getXSSRestoreTarget();
			}else{
				if(typeof(tagList) !== "undefined"){
					if(Array.isArray(tagList)){
						this.XSS_RESTORE_TARGET	= tagList;
					}
				}else if(top.document !== document){
					this.XSS_RESTORE_TARGET		= top.xuic.__COM.getXSSRestoreTarget();
				}
			}
		},
		getXSSRestoreTarget : function(){
			return this.XSS_RESTORE_TARGET;
		},
		checkIsXSSRestoreTarget : function(tagname){
			tagname	= tagname.toUpperCase();
			return this.XSS_RESTORE_TARGET.indexOf(tagname) >= 0;
		},
		setDateDelimiter : function(delimiter){
			if(!xuic.__VALID.checkIsEmpty(delimiter) && delimiter.length == 1){
				/*Only available 3types delimiter*/
				var validList				= ["-","/","."];
				if(validList.indexOf(delimiter) >= 0){
					xuic.__CONFIG.dateDelimiter	= delimiter;
					var regexpProto			= xuic.__REGEXP;
					regexpProto.setRegexp("VALID"		,"MONTH_FORMAT"				,new RegExp('^((?:19|20|21)[0-9]{2})' + delimiter + '(0[1-9]|1[012])$')																																);
					regexpProto.setRegexp("VALID"		,"DATE_FORMAT"				,new RegExp('^((?:19|20|21)[0-9]{2})' + delimiter + '(0[1-9]|1[012])' + delimiter + '(0[1-9]|[12][0-9]|3[0-1])$')																					);
					//regexpProto.setRegexp("VALID"		,"DATEDAY"	  			,/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])\((월요일|화요일|수요일|목요일|금요일|토요일|일요일)\)$/)							);
					regexpProto.setRegexp("VALID"		,"DATEDAY_FORMAT"			,new RegExp('^((?:19|20|21)[0-9]{2})' + delimiter + '(0[1-9]|1[012])' + delimiter + '(0[1-9]|[12][0-9]|3[0-1])\\((월요일|화요일|수요일|목요일|금요일|토요일|일요일)\\)$')							);
					regexpProto.setRegexp("VALID"		,"DATETIME_FORMAT"			,new RegExp('^((?:19|20|21)[0-9]{2})' + delimiter + '(0[1-9]|1[012])' + delimiter + '(0[1-9]|[12][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$')												);
					regexpProto.setRegexp("VALID"		,"DATETIME_SECOND_FORMAT"	,new RegExp('^((?:19|20|21)[0-9]{2})' + delimiter + '(0[1-9]|1[012])' + delimiter + '(0[1-9]|[12][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$')									);
					regexpProto.setRegexp("KEYEVENT"	,"MONTH"					,{pattern:"$1" + delimiter + "$2"								,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?$/																				}	);
					regexpProto.setRegexp("KEYEVENT"	,"DATE"						,{pattern:"$1" + delimiter + "$2" + delimiter + "$3"			,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?$/													}	);
					regexpProto.setRegexp("KEYEVENT"	,"DATETIME"					,{pattern:"$1" + delimiter + "$2" + delimiter + "$3 $4:$5"		,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?(0[0-9]|1[0-9]|2[0-3])?([0-5][0-9])?$/				}	);
					regexpProto.setRegexp("KEYEVENT"	,"DATETIME_SECOND"			,{pattern:"$1" + delimiter + "$2" + delimiter + "$3 $4:$5:$6"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?(0[0-9]|1[0-9]|2[0-3])?([0-5][0-9])?([0-5][0-9])?$/	}	);
					regexpProto.setRegexp("FORMAT"		,"MONTH"					,{pattern:"$1" + delimiter + "$2"								,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])$/																				}	);
					regexpProto.setRegexp("FORMAT"		,"DATE"						,{pattern:"$1" + delimiter + "$2" + delimiter + "$3"			,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/														}	);
					regexpProto.setRegexp("FORMAT"		,"DATEDAY"					,{pattern:"$1" + delimiter + "$2" + delimiter + "$3" + "(" + "$4" + ")"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])\((월요일|화요일|수요일|목요일|금요일|토요일|일요일)\)$/														}	);
					regexpProto.setRegexp("FORMAT"		,"DATETIME"					,{pattern:"$1" + delimiter + "$2" + delimiter + "$3 $4:$5"		,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/					}	);
					regexpProto.setRegexp("FORMAT"		,"DATETIME_SECOND"			,{pattern:"$1" + delimiter + "$2" + delimiter + "$3 $4:$5:$6"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])?$/		}	);
					setTimeout(function(){
						xuic.__DIRECTIVE.redrawDirective();
					},100);
				}
			}
		},

		changeDateFormat : function(languageCode){
			if(!xuic.__VALID.checkIsEmpty(xuic.__COM) && !xuic.__COM.isDefaultDateFormat()){

				var languageCode = xuic.__COM.getLanguage();
				var delimiter		   = xuic.__CONFIG.dateDelimiter;
				var regexpProto			= xuic.__REGEXP;
				if(languageCode === "vi"){
					regexpProto.setRegexp("VALID"		,"MONTH_FORMAT"				,new RegExp('^(0[1-9]|1[012])' + delimiter + '((?:19|20|21)[0-9]{2})$')																																);
					regexpProto.setRegexp("VALID"		,"DATE_FORMAT"				,new RegExp('^(0[1-9]|[12][0-9]|3[0-1])' + delimiter + '(0[1-9]|1[012])' + delimiter + '((?:19|20|21)[0-9]{2})$')																					);
					regexpProto.setRegexp("VALID"		,"DATEDAY"					,new RegExp('^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])\\((Chủ Nhật|Thứ Hai|Thứ Ba|Thứ Tư|Thứ Năm|Thứ Sáu|Thứ Bảy)\\)$')												   	);
					regexpProto.setRegexp("VALID"		,"DATEDAY_FORMAT"			,new RegExp('^(0[1-9]|[12][0-9]|3[0-1])' + delimiter + '(0[1-9]|1[012])' + delimiter + '((?:19|20|21)[0-9]{2})\\((Chủ Nhật|Thứ Hai|Thứ Ba|Thứ Tư|Thứ Năm|Thứ Sáu|Thứ Bảy)\\)$')							);
					regexpProto.setRegexp("VALID"		,"DATETIME_FORMAT"			,new RegExp('^(0[1-9]|[12][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])' + delimiter + '(0[1-9]|1[012])' + delimiter + '((?:19|20|21)[0-9]{2})$')												);
					regexpProto.setRegexp("VALID"		,"DATETIME_SECOND_FORMAT"	,new RegExp('^(0[1-9]|[12][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])' + delimiter + '(0[1-9]|1[012])' + delimiter + '((?:19|20|21)[0-9]{2})$')									);
					regexpProto.setRegexp("KEYEVENT"	,"MONTH"					,{pattern:"$2" + delimiter + "$1"								,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?$/																				}	);
					regexpProto.setRegexp("KEYEVENT"	,"DATE"						,{pattern:"$3" + delimiter + "$2" + delimiter + "$1"			,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?$/													}	);
					regexpProto.setRegexp("KEYEVENT"	,"DATETIME"					,{pattern:"$4:$5" + delimiter + "$3" + delimiter + "$2" + delimiter + "$1"		,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?(0[0-9]|1[0-9]|2[0-3])?([0-5][0-9])?$/				}	);
					regexpProto.setRegexp("KEYEVENT"	,"DATETIME_SECOND"			,{pattern:"$4:$5:$6" + delimiter + "$3" + delimiter + "$2" + delimiter + "$1"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?(0[0-9]|1[0-9]|2[0-3])?([0-5][0-9])?([0-5][0-9])?$/	}	);
					regexpProto.setRegexp("FORMAT"		,"MONTH"					,{pattern:"$2" + delimiter + "$1"								,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])$/																				}	);
					regexpProto.setRegexp("FORMAT"		,"DATE"						,{pattern:"$3" + delimiter + "$2" + delimiter + "$1"			,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/														}	);
					regexpProto.setRegexp("FORMAT"		,"DATEDAY"					,{pattern:"$3" + delimiter + "$2" + delimiter + "$1" + "(" + "$4" + ")"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])\((Chủ Nhật|Thứ Hai|Thứ Ba|Thứ Tư|Thứ Năm|Thứ Sáu|Thứ Bảy)\)$/														}	);
					regexpProto.setRegexp("FORMAT"		,"DATETIME"					,{pattern:"$3 $4:$5" + delimiter + "$2" + delimiter + "$1"		,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/					}	);
					regexpProto.setRegexp("FORMAT"		,"DATETIME_SECOND"			,{pattern:"$4:$5:$6 $3" + delimiter + "$2" + delimiter + "$1"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])?$/		}	);
					setTimeout(function(){
						xuic.__DIRECTIVE.redrawDirective();
					},100);
				}else if(languageCode === "en"){
					regexpProto.setRegexp("VALID"		,"MONTH_FORMAT"				,new RegExp('^(0[1-9]|1[012])' + delimiter + '((?:19|20|21)[0-9]{2})$')																																);
					regexpProto.setRegexp("VALID"		,"DATE_FORMAT"				,new RegExp('^(0[1-9]|1[012])' + delimiter + '(0[1-9]|[12][0-9]|3[0-1])' + delimiter + '((?:19|20|21)[0-9]{2})$')																					);
					regexpProto.setRegexp("VALID"		,"DATEDAY"					,new RegExp('^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])\\((Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Monday)\\)$')											 	);
					regexpProto.setRegexp("VALID"		,"DATEDAY_FORMAT"			,new RegExp('^(0[1-9]|1[012])' + delimiter + '(0[1-9]|[12][0-9]|3[0-1])' + delimiter + '((?:19|20|21)[0-9]{2})\\((Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Monday)\\)$')							);
					regexpProto.setRegexp("VALID"		,"DATETIME_FORMAT"			,new RegExp('^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]) (0[1-9]|1[012])' + delimiter + '(0[1-9]|[12][0-9]|3[0-1])' + delimiter + '((?:19|20|21)[0-9]{2})$')												);
					regexpProto.setRegexp("VALID"		,"DATETIME_SECOND_FORMAT"	,new RegExp('^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]) (0[1-9]|1[012])' + delimiter + '(0[1-9]|[12][0-9]|3[0-1])' + delimiter + '((?:19|20|21)[0-9]{2})$')									);
					regexpProto.setRegexp("KEYEVENT"	,"MONTH"					,{pattern:"$2" + delimiter + "$1"								,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?$/																				}	);
					regexpProto.setRegexp("KEYEVENT"	,"DATE"						,{pattern:"$2" + delimiter + "$3" + delimiter + "$1"			,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?$/													}	);
					regexpProto.setRegexp("KEYEVENT"	,"DATETIME"					,{pattern:"$4:$5" + delimiter + "$2" + delimiter + "$3" + delimiter + "$1"		,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?(0[0-9]|1[0-9]|2[0-3])?([0-5][0-9])?$/				}	);
					regexpProto.setRegexp("KEYEVENT"	,"DATETIME_SECOND"			,{pattern:"$4:$5:$6" + delimiter + "$2" + delimiter + "$3" + delimiter + "$1"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])?(0[1-9]|[12][0-9]|3[0-1])?(0[0-9]|1[0-9]|2[0-3])?([0-5][0-9])?([0-5][0-9])?$/	}	);
					regexpProto.setRegexp("FORMAT"		,"MONTH"					,{pattern:"$2" + delimiter + "$1"								,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])$/																				}	);
					regexpProto.setRegexp("FORMAT"		,"DATE"						,{pattern:"$2" + delimiter + "$3" + delimiter + "$1"			,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/														}	);
					regexpProto.setRegexp("FORMAT"		,"DATEDAY"					,{pattern:"$2" + delimiter + "$3" + delimiter + "$1" + "(" + "$4" + ")"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])\((Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Monday)\)$/														}	);
					regexpProto.setRegexp("FORMAT"		,"DATETIME"					,{pattern:"$4:$5 $2" + delimiter + "$3" + delimiter + "$1"		,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/					}	);
					regexpProto.setRegexp("FORMAT"		,"DATETIME_SECOND"			,{pattern:"$4:$5:$6 $2" + delimiter + "$3" + delimiter + "$1"	,regexp:/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])?$/		}	);
					setTimeout(function(){
						xuic.__DIRECTIVE.redrawDirective();
					},100);
				}
			}
		},

		setCalendarWeekStartDay : function(dayName){
			if(!xuic.__VALID.checkIsEmpty(dayName)){
				var allowDays				= ["monday","sunday"];
				if(allowDays.indexOf(dayName.toLowerCase())){
					xuic.__CONFIG.weekStartDay	= dayName.toLowerCase();
					setTimeout(function(){
						xuic.__DIRECTIVE.redrawDirective();
					},100);
				}
			}
		},
		getDateDelimiter : function(){
			return xuic.__CONFIG.dateDelimiter;
		},
		showMessageTip : function(element, message, type, expire, icon, width, height){
			element					= xuic.__DOM.getElement(element);
			var popup				= null;
			if(xuic.__VALID.checkIsElement(element) && !xuic.__VALID.checkIsEmpty(message)){
				if(xuic.__VALID.checkIsEmpty(type)){
					type			= "";
				}
				if(xuic.__VALID.checkIsEmpty(expire)){
					expire			= 0;
				}
				if(xuic.__VALID.checkIsEmpty(icon)){
					icon			= "";
				}
				if(xuic.__VALID.checkIsEmpty(width)){
					width			= 600;
				}
				if(xuic.__VALID.checkIsEmpty(height)){
					height			= 200;
				}
				var strClass		= "tooltip";
				switch(type){
					case "E" :
						strClass	+= "-error";
						icon		= (icon === "" ? "" : icon);
						break;
					case "I" :
						strClass	+= "-info";
						icon		= (icon === "" ? "" : icon);
						break;
					case "W" :
						strClass	+= "-warning";
						icon		= (icon === "" ? "" : icon);
						break;
					default	:
						icon		= (icon === "" ? "" : icon);
						break;
				}
				popup				= new dhx.Popup({css: "xui-tooltip-box"});
				popup.attachHTML("<div class='xui-tooltip-container " + strClass + "' style='max-width:" + width + "px;max-height:" + height + "px;'><i class='" + icon + "' style='" + (xuic.__VALID.checkIsEmpty(icon) ? "display:none;" : "") + "margin-right:10px;'></i>" + message + "</div>");
				popup.events.on("Click", function(e){
					this.hide();
				});
				popup.events.on("AfterHide", function(e){
					this.destructor();
				});
				popup.show(element,{"centering":false});
				if(expire > 0){
					function fn(objPopup, expire){
						return new Promise(function(resolve){
							setTimeout(function(){
								if(!xuic.__VALID.checkIsEmpty(objPopup)){
									objPopup.hide();
								}
								resolve();
							}, expire);
						});
					}
					fn(popup, expire);
				}
			}
			return popup;
		},
		showTitleToolTip : function(element){
			var tooltip		= element.getAttribute("xui-tooltip-title");
			if(!xuic.__VALID.checkIsEmpty(tooltip)){
				try{
					tooltip = xuic.__UTIL._recursiveXSS(tooltip);
					dhx.tooltip(tooltip,{node:element,possition:"bottom"});
				}catch(E){}
			}
		},
		closeActiveDirective : function(target){
			if(xuic.__ACTIVE_PICKER_ELEMENT != null){
				var controller				= xuic.__ACTIVE_PICKER_ELEMENT.controller;
				var doClose					= true;
				var outerClick				= true;
				var node					= null;
				if(controller.config.combo){
					node					= controller.config.picker;
					if(controller.config.openAutoCompletion){
						node				= controller.config.autoInputContainer;
					}
				}else{
					node					= (controller.getPicker()).picker._popup;
				}
				if(target){
					outerClick				= (controller.element !== target);
					if(outerClick){
						while(target){
							if(target === node){
								outerClick	= false;
								return;
							}
							target			= target.parentNode;
						}
					}
					if(!outerClick){
						doClose				= false;
					}
				}else{
					doClose					= true;
				}
				if(doClose){
					if(controller.config.combo && controller.config.openAutoCompletion){
						controller.hideAutoCompletion();
					}else{
						controller.hidePicker();
					}
				}
			}
		},
		getLanguage : function(){
			var languageCode = "";
			if(typeof $.fn["valExt"] === 'function' && !xuic.__VALID.checkIsEmpty($("#languageCode").valExt())){
				languageCode = $("#languageCode").valExt();
			}
			if(xuic.__VALID.checkIsEmpty(languageCode)){
				languageCode = xui.extends.session.getLanguage();
			}
			if(xuic.__VALID.checkIsEmpty(languageCode)){
				languageCode = navigator.language.split('-')[0];
			}
			return languageCode;
		},
		isDefaultDateFormat : function(){
			var returnValue = true;
			// 다국어 처리 나중에
			// var languageCode = xuic.__COM.getLanguage();
			// if(languageCode === "en"){
			//	 returnValue = false;
			// }else if(languageCode === "vi"){
			//	 returnValue = false;
			// }
			return returnValue;
		},
		getRegexp : function(){

		},
		_allowGloabalKeyEvent : function(e){
			var allow						= true;
			var keycode						= (e.which) ? e.which : e.keyCode;
			if(top.xuic.__APP_SERVICE_MODE === "REAL"){
				if((e.ctrlKey && (keycode === 78 || keycode === 82)) || keycode === 116){
					e.keyCode				= 0;
					allow					= false;
				}else if(keycode === 8){
					if(e.srcElement != null){
						if((e.srcElement.type != "text" && e.srcElement.type != "textarea" && e.srcElement.type != "password") || e.srcElement.readOnly){
							allow			= false;
						}
					}
				}else if(keycode === 67 && e.ctrlKey){
					/*if there are exist masking value in text control dom element, Copy text value without masking on clipboard*/
					if(window.clipboardData){
						if(e.target.tagName == "INPUT"){
							var originValue	= e.target.controller.getData();
							if(!xuic.__VALID.checkIsEmpty(originValue)){
								e.preventDefault();
								window.clipboardData.setData("Text", originValue);
							}
						}
					}
				}else if(keycode === 123){
					allow					= false;
				}else if(keycode === 27){
					xuic.__COM.closeActiveDirective();
				}
				e.cancelBubble				= true;
				e.returnValue				= allow;
			}
			return allow;
		},
		_closeTopDialog : function(e){
			var keycode						= (e.which) ? e.which : e.keyCode;
			var dialog						= null;
			var targetDialog				= null;
			var blnAlert					= false;
			var apply						= null;
			var reject						= null;
			if(keycode === 13 || keycode === 32){
				dialog						= top.document.querySelectorAll(".xui-message-box");
				if(!xuic.__VALID.checkIsEmpty(dialog) && dialog.length > 0){
					blnAlert				= true;
					targetDialog			= dialog[dialog.length - 1];
				}
			}else if(keycode === 27){
				dialog						= top.document.querySelectorAll(".xui-message-box,.xui-dialog-window");
				if(!xuic.__VALID.checkIsEmpty(dialog) && dialog.length > 0){
					for(var i = dialog.length - 1; i >= 0; i--){
						if(dialog[i].classList.contains("xui-dialog-window")){
							if(!dialog[i].classList.contains("xui-invisible")){
								targetDialog		= dialog[i];
								break;
							}else{
								continue;
							}
						}else{
							targetDialog	= dialog[i];
							blnAlert		= true;
							break;
						}
					}
				}
				if(xuic.__VALID.checkIsEmpty(targetDialog)){
					dialog					= document.querySelectorAll(".xui-dialog-window");
					if(!xuic.__VALID.checkIsEmpty(dialog) && dialog.length > 0){
						for(var i = dialog.length - 1; i >= 0; i--){
							if(!dialog[i].classList.contains("xui-invisible")){
								targetDialog		= dialog[i];
								break;
							}else{
								continue;
							}
						}
					}
				}
				if(xuic.__VALID.checkIsEmpty(targetDialog)){
					var targetWindow		= window.parent;
					while(top.window !== targetWindow){
						dialog				= targetWindow.document.querySelectorAll(".xui-dialog-window");
						if(!xuic.__VALID.checkIsEmpty(dialog) && dialog.length > 0){
							for(var i = dialog.length - 1; i >= 0; i--){
								if(!dialog[i].classList.contains("xui-invisible")){
									targetDialog	= dialog[i];
									break;
								}else{
									continue;
								}
							}
						}
						if(!xuic.__VALID.checkIsEmpty(targetDialog)){
							break;
						}else{
							targetWindow	= window.parent;
						}
					}
				}
			}
			if(!xuic.__VALID.checkIsEmpty(targetDialog)){
				if(!blnAlert){
					targetDialog			= targetDialog.querySelector(".xui-dialog-wrapper").firstElementChild;
					targetDialog.dialogController.close();
				}else{
					apply					= targetDialog.querySelector(".dhx_alert__apply-button");
					reject					= apply;
					if(xuic.__VALID.checkIsEmpty(apply)){
						apply				= targetDialog.querySelector(".dhx_alert__confirm-aply");
						reject				= targetDialog.querySelector(".dhx_alert__confirm-reject");
					}
					if(keycode === 27 && !xuic.__VALID.checkIsEmpty(reject)){
						reject.click();
					}else{
						apply.click();
					}
				}
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		}
	};

	/*Core Common feature api*/
	xuic.__COM		= new __Com();
	__Com			= null;

	function __Valid(){

	};
	__Valid.prototype	= {
		checkIsEmpty : function(data){
			return (typeof(data) === "undefined" || data == null || (this.checkIsString(data) && data.trim().length === 0));
		},
		checkIsArray : function(data){
			return Array.isArray(data);
		},
		checkIsJson : function(data, enableString){
			var blnReturnValue				= false;
			if(!this.checkIsEmpty(data) && !this.checkIsArray(data)){
				if(this.checkIsString(data)){
					if(enableString){
						try{blnReturnValue	= (JSON.parse(data)).constructor == {}.constructor;}catch(E){}
					}
				}else{
					if(data.constructor == {}.constructor){blnReturnValue = true;}
					else{try{blnReturnValue	= (JSON.parse(JSON.stringify(data))).constructor == {}.constructor;}catch(E){}}
				}
			}
			return blnReturnValue;
		},
		checkIsElement : function(data){
			return (data instanceof Element);
		},
		checkIsHTMLCollection : function(data){
			return (data instanceof HTMLCollection);
		},
		checkIsString : function(data){
			return (typeof(data) === "string");
		},
		checkExistKorean : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data			= data.toString().trim();
				blnReturnValue	= data.length > data.replace(xuic.__REGEXP.getCmmnRegexp("ALL_KOREAN"),"").length;
			}
			return blnReturnValue;
		},
		checkExistEnglish : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data			= data.toString().trim();
				blnReturnValue	= data.length > data.replace(xuic.__REGEXP.getCmmnRegexp("ALL_ENGLISH"),"").length;
			}
			return blnReturnValue;
		},
		checkExistNumber : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data			= data.toString().trim();
				blnReturnValue	= data.length > data.replace(xuic.__REGEXP.getCmmnRegexp("ALL_NUMBER"),"").length;
			}
			return blnReturnValue;
		},
		checkExistSpecialChar : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data			= data.toString().trim();
				blnReturnValue	= data.length > data.replace(xuic.__REGEXP.getCmmnRegexp("ALL_SPECIAL_CHAR"), "").length;
			}
			return blnReturnValue;
		},
		checkIsCompleteKorean : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) === "string"){
				/*
				blnReturnValue	= true;
				for(var i = 0; i < data.length; i++){
					var chr = data.substr(i,1);
					chr = escape(chr);
					if(chr.charAt(1) == "u"){	// 한글인 경우에만 완성형 문자 체크
						chr = chr.substr(2, (chr.length - 1));
						if((chr < "AC00") || (chr > "D7A3")){
							blnReturnValue = false;
							break;
						}
					}
				}
				*/
				blnReturnValue	= !xuic.__REGEXP.checkValid(data.toString().trim(), "COMPLETE_KOREAN");
			}
			return blnReturnValue;
		},
		checkIsYear : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				blnReturnValue	= xuic.__REGEXP.checkValid(data.toString().trim(), "YEAR");
			}
			return blnReturnValue;
		},
		checkIsMonth : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				var blnFormat	= (data.indexOf(xuic.__CONFIG.dateDelimiter) >= 0);
				blnReturnValue	= xuic.__REGEXP.checkValid(data.toString().trim(), "MONTH" + (blnFormat ? "_FORMAT" : ""));
				blnFormat		= null;
			}
			return blnReturnValue;
		},
		checkIsDate : function(data){
			var blnReturnValue		= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				var blnFormat		= (data.indexOf(xuic.__CONFIG.dateDelimiter) >= 0);
				blnReturnValue		= xuic.__REGEXP.checkValid(data.toString().trim(), "DATE" + (blnFormat ? "_FORMAT" : ""));
				/*
				if(blnReturnValue){
					data			= data.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					var yyyy		= parseInt(data.substr(0,4), 10), mm = parseInt(data.substr(4,2), 10), dd = parseInt(data.substr(6), 10), objDate = new Date(yyyy, mm-1, dd);
					blnReturnValue	= (objDate.getFullYear() == yyyy && objDate.getMonth()+1 == mm && objDate.getDate() == dd);
					yyyy			= null;
				}
				*/
				blnFormat			= null;
			}
			return blnReturnValue;
		},
		checkIsDateday : function(data){
			var blnReturnValue		= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				var blnFormat		= (data.indexOf(xuic.__CONFIG.dateDelimiter) >= 0);
				blnReturnValue		= xuic.__REGEXP.checkValid(data.toString().trim(), "DATEDAY" + (blnFormat ? "_FORMAT" : ""));
				blnFormat			= null;
			}
			return blnReturnValue;
		},
		checkIsDatetime : function(data){
			var blnReturnValue			= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data					= data.toString().trim();
				var blnFormat			= (data.indexOf(xuic.__CONFIG.dateDelimiter) >= 0);
				var date				= blnFormat ? data.substr(0,10) : data.substr(0,8);
				var time				= blnFormat ? data.substr(11) : data.substr(8);
				if(!this.checkIsEmpty(date) && !this.checkIsEmpty(time)){
					blnReturnValue		= this.checkIsDate(date);
					if(blnReturnValue){
						blnReturnValue	= this.checkIsTime(time);
					}
				}
				blnFormat				= null;
				date					= null;
				time					= null;
			}
			return blnReturnValue;
		},
		checkIsTime : function(data){
			var blnReturnValue			= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data					= data.toString().trim();
				var blnFormat			= (data.indexOf(":") >= 0);
				var blnControlSecond	= (data.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "").length > 4);
				blnReturnValue			= xuic.__REGEXP.checkValid(data.toString().trim(), "TIME" + (blnControlSecond ? "_SECOND" : "") + (blnFormat ? "_FORMAT" : ""));
				blnFormat				= null;
				blnControlSecond		= null;
			}
			return blnReturnValue;
		},
		checkIsNumber : function(data, currency){
			var blnReturnValue				= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data						= data.toString().trim();
				if(data.substr(0,1) === "-"){
					data					= data.substr(1);
				}
				if(data.length === 1){
					blnReturnValue			= (data.length == data.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "").length);
				}else{
					if(data.substr(0,1) !== "0"){
						if(currency){
							blnReturnValue	= (data.length == data.replace(/[^0-9\,]/g, "").length);
						}else{
							blnReturnValue	= (data.length == data.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "").length);
						}
					}
				}
			}
			return blnReturnValue;
		},
		checkIsNumeric : function(data){
			var blnReturnValue = false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data = data.toString().trim();
				blnReturnValue	= (data.length == data.replace(/[^0-9\,]/g, "").length);
			}
			return blnReturnValue;
		},
		checkIsDecimal : function(data, currency, round){
			var blnReturnValue			= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data					= data.toString().trim();
				var blnMinus			= (data.substr(0,1) === "-");
				if(blnMinus){
					data				= data.substr(1);
				}
				var objSplit			= data.split(".");
				if(this.checkIsEmpty(round) || isNaN(round)){
					round				= 2;
				}
				round																= parseInt(round,10);
				if(objSplit.length == 2 && objSplit[1].length === round && (round >= 1 && round <= 10)){
					var integer			= objSplit[0];
					var decimal			= objSplit[1];
					var exceptRegexp	= xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER");
					blnReturnValue		= xuic.__REGEXP.checkValid(((blnMinus ? "-" : "") + integer.replace(exceptRegexp, "") + "." + decimal), "DECIMAL_ROUND" + round);
					integer				= null;
					decimal				= null;
					exceptRegexp		= null;
				}
				blnMinus				= null;
				objSplit				= null;
			}
			return blnReturnValue;
		},
		checkIsBiz : function(data){
			var blnReturnValue		= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data				= data.toString().trim();
				var blnFormat		= (data.indexOf("-") >= 0);
				blnReturnValue		= xuic.__REGEXP.checkValid(data, "BIZ" + (blnFormat ? "_FORMAT" : ""));
				if(blnReturnValue){
					data			= data.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					var multiply	= [1,3,7,1,3,7,1,3,5], valueMap = data.split("").map(function(item){return parseInt(item, 10);}), checkSum = 0;
					for (var i = 0; i < multiply.length; i++){
						checkSum	+= multiply[i] * valueMap[i];
					}
					checkSum		+= parseInt((multiply[8]*valueMap[8])/10, 10);
					blnReturnValue	= Math.floor(valueMap[9]) === (10-(checkSum%10));
					//LYH 20211215 오타로 인한 오류 수정
					multiply		= null;
				}
				blnFormat			= null;
			}
			return blnReturnValue;
		},
		checkIsCorp : function(data){
			var blnReturnValue		= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data				= data.toString().trim();
				var blnFormat		= (data.indexOf("-") >= 0);
				blnReturnValue		= xuic.__REGEXP.checkValid(data, "CORP" + (blnFormat ? "_FORMAT" : ""));
				if(blnReturnValue){
					data			= data.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					var corpData = data.split("");
					var checkList = new Array(1,2,1,2,1,2,1,2,1,2,1,2);
					var sumNumber  = 0;
					var checkDigit = 0;
					for (i = 0; i < 12; i++){
						sumNumber += eval(corpData[i]) * eval(checkList[i]);
					}  
					checkDigit = 10 - (sumNumber % 10);
					checkDigit = checkDigit % 10;
					if (checkDigit != corpData[12]){
						blnReturnValue = false;
					}  
				}
			}
			return blnReturnValue;
		},
		checkIsJuri : function(data){
			var blnReturnValue		= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data				= data.toString().trim();
				var blnFormat		= (data.indexOf("-") >= 0);
				blnReturnValue		= xuic.__REGEXP.checkValid(data, "JURI" + (blnFormat ? "_FORMAT" : ""));
				if(blnReturnValue){
					var _add		= (blnFormat ? 1 : 0);
					var a			= parseInt(data.substr(0,1),10), b = parseInt(data.substr(1,1),10), c = parseInt(data.substr(2,1),10), d = parseInt(data.substr(3,1),10), e = parseInt(data.substr(4,1),10), f = parseInt(data.substr(5,1),10);
					var g			= parseInt(data.substr(6+_add,1),10), h = parseInt(data.substr(7+_add,1),10), i = parseInt(data.substr(8+_add,1),10), j = parseInt(data.substr(9+_add,1),10), k = parseInt(data.substr(10+_add,1),10), l = parseInt(data.substr(11+_add,1),10), m = parseInt(data.substr(12+_add,1),10);
					blnReturnValue	= ((10-((a*1+b*2+c*1+d*2+e*1+f*2+g*1+h*2+i*1+j*2+k*1+l*2)%10)) === m);
					_add			= null;
					a				= null;
					g				= null;
				}
				blnFormat			= null;
			}
			return blnReturnValue;
		},
		checkIsIhid : function(data){
			var blnReturnValue			= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data					= data.toString().trim();
				var blnFormat			= (data.indexOf("-") >= 0);
				blnReturnValue			= xuic.__REGEXP.checkValid(data, "IHID" + (blnFormat ? "_FORMAT" : ""));
				if(blnReturnValue){
					var _add			= (blnFormat ? 1 : 0);
					var a				= parseInt(data.substr(0,1),10), b = parseInt(data.substr(1,1),10), c = parseInt(data.substr(2,1),10), d = parseInt(data.substr(3,1),10), e = parseInt(data.substr(4,1),10), f = parseInt(data.substr(5,1),10);
					var g				= parseInt(data.substr(6+_add,1),10), h = parseInt(data.substr(7+_add,1),10), i = parseInt(data.substr(8+_add,1),10), j = parseInt(data.substr(9+_add,1),10), k = parseInt(data.substr(10+_add,1),10), l = parseInt(data.substr(11+_add,1),10), m = parseInt(data.substr(12+_add,1),10);
					var date			= (a + "" + b + "" + c + "" + d + "" + e + "" + f);
					if((g == 0 || g == 9)){
						date			= "18" + date;
					}else if((g == 1 || g == 2)){
						date			= "19" + date;
					}else if((g == 3 || g == 4)){
						date			= "20" + date;
					}else if((g == 5 || g == 6)){
						date			= "21" + date;
					}
					blnReturnValue		= xuic.__VALID.checkIsDate(date);
					if(blnReturnValue){
						//LYH 20211215 주민번호 체크 공식 문제로 공식 수정
						blnReturnValue	= ((11 - ((2*a + 3*b + 4*c + 5*d + 6*e + 7*f+ 8*g+ 9*h + 2*i + 3*j + 4*k + 5*l) % 11)) % 10) === m;
					}
					_add				= null;
					a					= null;
					g					= null;
					date				= null;
				}
				blnFormat				= null;
			}
			return blnReturnValue;
		},
		checkIsPhone : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data			= data.toString().trim();
				var regexp		= "PHONE", blnFormat = (data.indexOf("-") >= 0);
				if(data.substr(0,1) === "1"){
					regexp		+= "_BIZ";
				}else if(data.substr(0,2) === "01"){
					regexp		+= "_MOBILE";
				}else if(data.substr(0,3) === "070"){
					regexp		+= "_ZEROSEVENZERO";
				}else if(data.length === 4 || data.length === 5){
					regexp		+= "_LOCAL_EXTENTION";
				}else{
					regexp		+= "_REGULAR";
				}
				regexp			+= (blnFormat ? "_FORMAT" : "");
				blnReturnValue	= xuic.__REGEXP.checkValid(data, regexp);
				regexp			= null;
			}
			return blnReturnValue;

		},
		checkIsCard : function(data){
			var blnReturnValue					= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				data							= data.toString().trim();
				var regexp						= xuic.__REGEXP.getValidRegexp("CARD_ALL");
				if(!this.checkIsEmpty(regexp)){
					var blnFormat				= (data.indexOf("-") >= 0), temp = data.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), ""), match = regexp.exec(temp);
					if(match){
						blnReturnValue			= true;
						var types				= [
							{regexpName:"CARD_BC"				},
							{regexpName:"CARD_VISA"				},
							{regexpName:"CARD_MASTER"			},
							{regexpName:"CARD_DISCOVER"			},
							{regexpName:"CARD_AMEX"				},
							{regexpName:"CARD_DINERS"			},
							{regexpName:"CARD_JCB"				},
							{regexpName:"CARD_REGULAR"			},
							{regexpName:"CARD_BC_FORMAT"		},
							{regexpName:"CARD_VISA_FORMAT"		},
							{regexpName:"CARD_MASTER_FORMAT"	},
							{regexpName:"CARD_DISCOVER_FORMAT"	},
							{regexpName:"CARD_AMEX_FORMAT"		},
							{regexpName:"CARD_DINERS_FORMAT"	},
							{regexpName:"CARD_JCB_FORMAT"		},
							{regexpName:"CARD_REGULAR_FORMAT"	}
						];
						var len					= match.length;
						for(var i = 1; i < len; i++){
							if(match[i]){
								blnReturnValue	= xuic.__REGEXP.checkValid(data, types[(i-1) + (blnFormat ? 8 : 0)].regexpName);
								break;
							}
						}
					}
					if(blnReturnValue){
						/*Extra validation with the Luhn Algorithm*/
						var digits				= temp.split(""), len = digits.length, sum = 0;
						for(var i = 0; i < len; i++) {
							digits[i]			= parseInt(digits[i], 10);
						}
						for(var i = len-1; i >= 0; i--){
							if((len%2 === 0 && (i+1)%2 === 1) || (len%2 === 1 && (i+1)%2 === 0)){
								sum				+= ((digits[i]*2) > 9 ? (digits[i]*2)-9 : (digits[i]*2));
							}else{
								sum				+= digits[i];
							}
						}
						blnReturnValue			= (sum%10 === 0);
						digits					= null;
						len						= null;
						sum						= null;
					}
					blnFormat					= null;
					temp						= null;
					match						= null;
				}
				regexp							= null;
			}
			return blnReturnValue;
		},
		checkIsEmail : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				blnReturnValue	= xuic.__REGEXP.checkValid(data.toString().trim(), "EMAIL");
			}
			return blnReturnValue;
		},
		checkIsIp : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				blnReturnValue	= xuic.__REGEXP.checkValid(data.toString().trim(), "IP_ALL");
			}
			return blnReturnValue;
		},
		checkIsPost : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				var blnFormat	= (data.indexOf("-") >= 0);
				blnReturnValue	= xuic.__REGEXP.checkValid(data.toString().trim(), "POST" + (data.length > 5 || blnFormat ? "_OLD" : "") + (blnFormat ? "_FORMAT" : ""));
				blnFormat		= null;
			}
			return blnReturnValue;
		},
		checkIsCar : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				blnReturnValue	= xuic.__REGEXP.checkValid(data.toString().trim(), "CAR");
			}
			return blnReturnValue;
		},
		checkIsAccount : function(data, bankcode){
			var blnReturnValue					= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object" && !this.checkIsEmpty(bankcode) && typeof(bankcode) !== "object"){
				data							= data.toString().replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
				var regexp_primary				= xuic.__REGEXP.getBankRegexp(bankcode);
				if(!this.checkIsEmpty(regexp_primary)){
					var objRegexpInfo			= null;
					var regexp					= null;
					var match					= regexp_primary.regexp.exec(strValue);
					if(match){
						var len					= match.length;
						for(var i = 1; i < len; i++){
							if(match[i]){
								objRegexpInfo	= xuic.__REGEXP_BANK[bankcode + "_" + (i-1)];
								regexp			= objRegexpInfo.regexp;
								break;
							}
						}
						len						= null;
					}
					if(!this.checkIsEmpty(objRegexpInfo)){
						blnReturnValue			= objRegexpInfo.regexp.test(data);
					}
					objRegexpInfo				= null;
					regexp						= null;
					match						= null;
				}
				regexp_primary					= null;
			}
			return blnReturnValue;
		},
		checkIsUrl : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				blnReturnValue	= xuic.__REGEXP.checkValid(data.toString().trim(), "URL");
			}
			return blnReturnValue;
		},
		checkIsCompleteUrl : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				blnReturnValue	= xuic.__REGEXP.checkValid(data.toString().trim(), "URL_INCLUDE_PROTOCOL");
			}
			return blnReturnValue;
		},
		checkIsHtml : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				blnReturnValue	= xuic.__REGEXP.checkValid(data.toString().trim(), "HTML");
			}
			return blnReturnValue;
		},
		checkValidPassword : function(data){
			var blnReturnValue	= false;
			if(!this.checkIsEmpty(data) && typeof(data) !== "object"){
				blnReturnValue	= (xuic.__REGEXP.checkValid(data.toString().trim(), "PASSWORD_DEFAULT") && !(xuic.__REGEXP.checkValid(data.toString().trim(), "SAME_WORD_FOUR")));
			}
			return blnReturnValue;
		}
	};

	/*core validation feature api*/
	xuic.__VALID	= new __Valid();
	__Valid			= null;

	function __Util(){

	};
	__Util.prototype	= {
		replaceAll : function(data, slice, replace){
			if(xuic.__VALID.checkIsString(data) && xuic.__VALID.checkIsString(slice) && xuic.__VALID.checkIsString(replace)){
				data	= data.split(slice).join(replace);
			}
			return data;
		},
		getNumberOnly : function(data){
			if(!xuic.__VALID.checkIsEmpty(data)){
				data	= data.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
			}
			return data;
		},
		generateRandomChar : function(length, onlyNumber){
			var returnValue			= "";
			if(!xuic.__VALID.checkIsNumber(length) || length <= 0){
				length				= 10;
			}
			var possibleCharacter	= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			if(onlyNumber){
				possibleCharacter	= "0123456789";
			}
			for(var i = 0; i < length; i++){
				returnValue			+= possibleCharacter.charAt(Math.floor(Math.random() * possibleCharacter.length));
			}
			possibleCharacter		= null;
			return returnValue;
		},
		generateUUID : function(){
			return uuid();
		},
		getAbsolutePosition : function(node, target, position){
			var returnValue		= null;
			if(xuic.__VALID.checkIsElement(node) && xuic.__VALID.checkIsElement(target)){
				var positions	= ["top","bottom","left","right"];
				if(xuic.__VALID.checkIsEmpty(position) || positions.indexOf(position) < 0){
					position	= "bottom";
				}
				var rect		= target.getBoundingClientRect(), posLeft = rect.left + window.pageXOffset, posRight = rect.right + window.pageXOffset, posTop = rect.top + window.pageYOffset, posBottom = rect.bottom + window.pageYOffset;
				var fitPosition	= this._calcPosition({left:posLeft,right:posRight,top:posTop,bottom:posBottom}, position, node.offsetWidth, node.offsetHeight), left = fitPosition.left, top = fitPosition.top;
				returnValue		= {"left":left,"top":top};
				positions		= null;
				rect			= null;
				fitPosition		= null;
			}
			return returnValue;
		},
		rpad : function(data, length, extra){
			if(!xuic.__VALID.checkIsEmpty(data)){
				data			= data.toString().trim();
				if(data.length < length){
					var len		= length - data.length;
					for(var i = 0; i < len; i++){
						data	= data + extra;
					}
					len			= null;
				}
			}
			return data;
		},
		lpad : function(data, length, extra){
			if(!xuic.__VALID.checkIsEmpty(data)){
				data			= data.toString().trim();
				if(data.length < length){
					var len		= length - data.length;
					for(var i = 0; i < len; i++){
						data	= extra + data;
					}
					len			= null;
				}
			}
			return data;
		},
		convertSecondToTimeformat : function(data, controlSecond){
			if(!xuic.__VALID.checkIsEmpty(data)){
				data				= data.toString().trim();
				if(xuic.__VALID.checkIsEmpty(controlSecond)){
					controlSecond	= true;
				}
				data				= parseInt(data.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), ""));
				var hour			= Math.floor(data / 3600);
				var min				= Math.floor((data % 3600) / 60);
				var sec				= data % 60;
				data				= xuic.__UTIL.lpad(hour, 2, "0") + ":" + xuic.__UTIL.lpad(min, 2, "0") + (controlSecond ? ":" + xuic.__UTIL.lpad(sec, 2, "0") : "");
				hour				= null;
				min					= null;
				sec					= null;
			}
			return data;
		},
		convertTimeformatToSecond : function(data){
			if(!xuic.__VALID.checkIsEmpty(data)){
				data		= data.toString().trim().replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
				var hour,minute,second;
				if(data.length === 4){
					hour	= parseInt(data.substr(0,2));
					minute	= parseInt(data.substr(2,2));
					data	= hour*3600 + minute*60;
				}else if(data.length === 6){
					hour	= parseInt(data.substr(0,2));
					minute	= parseInt(data.substr(2,2));
					second	= parseInt(data.substr(4));
					data	= hour*3600 + minute*60 + second;
				}
				hour		= null;
				minute		= null;
				second		= null;
			}
			return data;
		},
		convertDateToHumanDatetime : function(data, format){
			if(!xuic.__VALID.checkIsEmpty(data) && data instanceof Date){
				var year					= data.getFullYear();
				var month					= this.lpad(data.getMonth() + 1	, 2	, "0");
				var day						= this.lpad(data.getDate()		, 2	, "0");
				var hour					= this.lpad(data.getHours()		, 2	, "0");
				var minute					= this.lpad(data.getMinutes()	, 2	, "0");
				var second					= this.lpad(data.getSeconds()	, 2	, "0");
				data						= year + month + day + hour + minute + second;
				if(format === true){
					data					= xuic.__FORMAT.datetime.getData(data, data);
				}
			}
			return data;
		},
		convertHumanDatetimeToDate : function(data){
			if(!xuic.__VALID.checkIsEmpty(data)){
				data						= this.rpad(data.toString(), 14, "0");
				var year					= parseInt(data.substr(0,4));
				var month					= parseInt(data.substr(4,2)) - 1;
				var day						= parseInt(data.substr(6,2));
				var hour					= parseInt(data.substr(8,2));
				var minute					= parseInt(data.substr(10,2));
				var second					= parseInt(data.substr(12));
				data						= new Date(year, month, day, hour, minute, second);
			}
			return data;
		},
		convertUnixTimestampToHumanDatetime : function(data, format){
			if(!xuic.__VALID.checkIsEmpty(data)){
				if(xuic.__VALID.checkIsString(data)){
					data					= parseInt(xuic.__UTIL.getNumberOnly(data), 10);
				}
				data						= this.convertDateToHumanDatetime(new Date(data * 1000), format);
			}
			return data;
		},
		convertHumanDatetimeToUnixTimestamp : function(data){
			if(!xuic.__VALID.checkIsEmpty(data)){
				data						= this.convertHumanDatetimeToDate(data).getUnixTime();
			}
			return data;
		},
		copyObject : function(target, copy, deep){
			if(!xuic.__VALID.checkIsEmpty(target) && !xuic.__VALID.checkIsEmpty(copy)){
				var clone, src, _clone, isArray, _this = this;
				if(typeof(target) !== "object" && !(typeof(target) === "function" && typeof(target.nodeType) !== "number")){
					target					= {};
				}
				if(xuic.__VALID.checkIsEmpty(deep)){
					deep					= false;
				}
				for(var attr in copy){
					clone					= copy[attr];
					if(clone == null){
						continue;
					}
					if(attr === "__proto__" || target === clone){
						continue;
					}
					isArray					= Array.isArray(clone);
					if(deep && (this._whetherPlain(clone) || isArray)){
						src					= target[attr];
						if(isArray && !Array.isArray(src)){
							_clone			= [];
						}else if(!isArray && !this._whetherPlain(src)){
							_clone			= {};
						}else{
							_clone			= src;
						}
						isArray				= false;
						target[attr]		= _this.copyObject(_clone, clone, deep);
						if(typeof(target[attr]) === "undefined" && typeof(_clone) !== "undefined"){
							target[attr]	= _clone;
						}
					}else if(typeof(clone) !== "undefined"){
						target[attr]		= clone;
					}
				}
			}
			return target;
		},
		compareObject : function(data, compareData){
			var isCorrespond						= false;
			if(!xuic.__VALID.checkIsEmpty(data) && !xuic.__VALID.checkIsEmpty(compareData)){
				if(xuic.__VALID.checkIsArray(data) && xuic.__VALID.checkIsArray(compareData)){
					if(data.length === compareData.length){
						if(data.length > 0 && compareData.length > 0){
							isCorrespond			= true;
							for(var i = 0; i < data.length; i++){
								if(data[i] !== compareData[i]){
									isCorrespond	= false;
									break;
								}
							}
						}else if(data.length === 0 && compareData.length === 0){
							isCorrespond			= true;
						}
					}
				}else if(xuic.__VALID.checkIsJson(data) && xuic.__VALID.checkIsJson(compareData)){
					isCorrespond					= true;
					var jsonSize					= Object.keys(data).length;
					var compareJsonSize				= Object.keys(compareData).length;
					if(jsonSize > 0){
						for(var key in data){
							if(!compareData.hasOwnProperty(key) || data[key] !== compareData[key]){
								isCorrespond		= false;
								break;
							}
						}
					}else if(jsonSize !== compareJsonSize){
						isCorrespond				= false;
					}
				}else if(data === compareData){
					isCorrespond					= true;
				}
			}
			return isCorrespond;
		},
		quickSort : function(target, arg01, left, right){
			if(xuic.__VALID.checkIsArray(target) && target.length > 1){
				if(xuic.__VALID.checkIsJson(target[0])){
					target	= this._quickSortJsonArray(target, arg01, left, right);
				}else{
					target	= this._quickSortArray(target, arg01, left);
				}
			}
			return target;
		},
		binarySearch : function(data, propertyKey, doSort, fromIndex, toIndex){
			var returnValue		= -1;
			if(xuic.__VALID.checkIsArray(data) && data.length > 1){
				if(xuic.__VALID.checkIsJson(data[0])){
					returnValue	= this._binarySearchJsonArray(data, propertyKey, doSort, fromIndex, toIndex);
				}else{
					returnValue	= this._binarySearchArray(data, doSort, fromIndex, toIndex);
				}
			}
			return returnValue;
		},
		multipleFieldSort : function(target, sortOption){
			if(xuic.__VALID.checkIsArray(target) && target.length > 1){
				if(xuic.__VALID.checkIsJson(target[0])){
					if(xuic.__VALID.checkIsArray(sortOption) && sortOption.length > 0 && xuic.__VALID.checkIsJson(sortOption[0])){
						if(sortOption[0].hasOwnProperty("name") && sortOption[0].hasOwnProperty("orderby")){
							var _this				= this;
							target.sort(function(a,b){
								var i				= 0;
								var result			= 0;
								var _size			= sortOption.length;
								var orderby			= 1;
								var key				= null;
								var _a				= null;
								var _b				= null;
								while(i < _size && result === 0){
									orderby			= sortOption[i]["orderby"];
									if(isNaN(orderby)){
										orderby		= (orderby === "asc" ? 1 : -1);
									}
									key				= sortOption[i]["name"];
									_a				= a[key];
									_b				= b[key];
									if(!xuic.__VALID.checkIsEmpty(_a) && !xuic.__VALID.checkIsEmpty(_b)){
										_a			= _a.toString();
										_b			= _b.toString();
										_a = xuic.__UTIL.replaceAll(_a,":","");
										_a = xuic.__UTIL.replaceAll(_a,"-","");
										_a = xuic.__UTIL.replaceAll(_a,"/","");
										_a = xuic.__UTIL.replaceAll(_a,",","");
										_a = xuic.__UTIL.replaceAll(_a,"%","");
										_b = xuic.__UTIL.replaceAll(_b,":","");
										_b = xuic.__UTIL.replaceAll(_b,"-","");
										_b = xuic.__UTIL.replaceAll(_b,"/","");
										_b = xuic.__UTIL.replaceAll(_b,",","");
										_b = xuic.__UTIL.replaceAll(_b,"%","");
										if(_a.match(/(\d+)/g) !== null && _b.match(/(\d+)/g) !== null){
											result	= (Number((_a.match(/(\d+)/g) || [0])[0]) - Number((_b.match(/(\d+)/g) || [0])[0]));
										}
										result		= orderby * (result === 0 ? (_a < _b ? -1 : (_a > _b ? 1 : 0)) : result);
									}else{
										if(xuic.__VALID.checkIsEmpty(_a)){
											result	= 1;
										}else{
											result	= -1;
										}
									}
									i++;
								}
								return result;
							});
						}
					}
				}
			}
			return target;
		},
		debounce : function(func, delay){
			var inDebounce;
			return function(){
				var context							= this;
				var args							= arguments;
				clearTimeout(inDebounce);
				inDebounce							= setTimeout(function(){
					func.apply(context, args);
				}, delay);
			}
		},
		throttle : function(func, limit){
			var lastFunc;
			var lastRan;
			return function(){
				var context							= this;
				var args							= arguments;
				if(!lastRan){
					func.apply(context, args);
					lastRan							= Date.now();
				}else{
					clearTimeout(lastFunc);
					lastFunc						= setTimeout(function(){
						if((Date.now() - lastRan) >= limit){
							func.apply(context, args);
							lastRan					= Date.now()
						}
					}, limit - (Date.now() - lastRan));
				}
			}
		},
		_recursiveXSS : function(data, xss){
			if(xuic.__VALID.checkIsArray(data)){
				for(var i = 0; i < data.length; i++){
					data[i]							= this._recursiveXSS(data[i], xss);
				}
			}else if(xuic.__VALID.checkIsJson(data)){
				var keys							= Object.keys(data);
				for(var i = 0; i < keys.length; i++){
					data[keys[i]]					= this._recursiveXSS(data[keys[i]], xss);
				}
			}else{
				if(!xuic.__VALID.checkIsEmpty(data)){
					if(xss){
						data						= this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(data, "&", "&amp;"), "<", "&lt;"), ">", "&gt;"), "(", "&#40;"), ")", "&#41;"), "'", "&#39;"), "%", "&#37;"), "\"", "&#34;");
					}else{
						data						= this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(data, "&lt;", "<"), "&gt;", ">"), "&#40;", "("), "&#41;", ")"), "&#39;", "'"), "&#37;", "%"), "&#34;", "\""), "&amp;", "&");
					}
				}
			}
			return data;
		},
		_calcPosition : function(pos, configPosition, width, height){
			var _a = configPosition === "bottom" || configPosition === "top"
				? this._placeBottomOrTop(pos, configPosition, width, height)
				: this._placeRightOrLeft(pos, configPosition, width, height), left = _a.left, top = _a.top;
			return {
				left: Math.round(left) + "px",
				top: Math.round(top) + "px",
				minWidth: Math.round(width) + "px",
				position: "absolute"
			};
		},
		_placeBottomOrTop : function(pos, configPosition, width, height){
			var _a									= this._getWindowBorders(), rightBorder = _a.rightBorder, bottomBorder = _a.bottomBorder;
			var bottomDiff							= bottomBorder - pos.bottom - height;
			var left, top;
			var topDiff								= pos.top - height;
			if(configPosition === "bottom"){
				if(bottomDiff >= 0){
					top								= pos.bottom;
				}else if(topDiff >= 0){
					top								= topDiff;
				}
			}else{
				if(topDiff >= 0){
					top								= topDiff;
				}else if(bottomDiff >= 0){
					top								= pos.bottom;
				}
			}
			if(bottomDiff < 0 && topDiff < 0){
				top									= bottomDiff > topDiff ? pos.bottom : topDiff;
			}
			var leftDiff							= rightBorder - pos.left - width, rightDiff = pos.right - width;
			if(leftDiff >= 0){
				left								= pos.left;
			}else if(rightDiff >= 0){
				left								= rightDiff;
			}else{
				left								= rightDiff > leftDiff ? pos.left : rightDiff;
			}
			return {left:left,top:top};
		},
		_placeRightOrLeft : function(pos, configPosition, width, height){
			var _a									= this._getWindowBorders(), rightBorder = _a.rightBorder, bottomBorder = _a.bottomBorder;
			var rightDiff							= rightBorder - pos.right - width, leftDiff = pos.left - width;
			var left, top;
			if(configPosition === "right"){
				if(rightDiff >= 0){
					left							= pos.right;
				}else if(leftDiff >= 0){
					left							= leftDiff;
				}
			}else{
				if(leftDiff >= 0){
					left							= leftDiff;
				}else if(rightDiff >= 0){
					left							= pos.right;
				}
			}
			if(leftDiff < 0 && rightDiff < 0){
				left								= leftDiff > rightDiff ? leftDiff : pos.right;
			}
			var bottomDiff							= pos.bottom - height, topDiff = bottomBorder - pos.top - height;
			if(topDiff >= 0){
				top									= pos.top;
			}else if(bottomDiff > 0){
				top									= bottomDiff;
			}else{
				top									= bottomDiff > topDiff ? bottomDiff : pos.top;
			}
			return {left:left,top:top};
		},
		_getWindowBorders : function(){
			return {
				rightBorder:window.pageXOffset + window.innerWidth,
				bottomBorder:window.pageYOffset + window.innerHeight
			};
		},
		_whetherPlain : function(data){
			var class2type							= {}, hasOwn = class2type.hasOwnProperty, fnToString = hasOwn.toString, ObjectFunctionString = fnToString.call(Object);
			var proto, Ctor;
			var toString	= Object.prototype.toString;
			if(!data || toString.call(data) !== "[object Object]"){
				return false;
			}
			proto = Object.getPrototypeOf(data);
			if(!proto){
				return true;
			}
			Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
			return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
		},
		_quickSortArray:function(target, left, right){
			var size								= target.length;
			if(!xuic.__VALID.checkIsNumber(left)){
				left								= 0;
			}
			if(!xuic.__VALID.checkIsNumber(right)){
				right								= size-1;
			}
			var idx									= this._partition(target, left, right);
			if(left < idx - 1){
				this._quickSortArray(target, left, idx-1);
			}
			if(idx < right){
				this._quickSortArray(target, idx, right);
			}
			return target;
		},
		_quickSortJsonArray:function(target, propertyKey, left, right){
			if(!xuic.__VALID.checkIsEmpty(propertyKey)){
				var size							= target.length;
				var propertyKeySet					= Object.keys(target[0]);
				if(propertyKeySet.length > 0 && propertyKeySet.indexOf(propertyKey) >= 0){
					if(!xuic.__VALID.checkIsNumber(left)){
						left						= 0;
					}
					if(!xuic.__VALID.checkIsNumber(right)){
						right						= size-1;
					}
					var idx							= this._partitionJson(target, propertyKey, left, right);
					if(left < idx - 1){
						this._quickSortJsonArray(target, propertyKey, left, idx-1);
					}
					if(idx < right){
						this._quickSortJsonArray(target, propertyKey, idx, right);
					}
				}
			}
			return target;
		},
		_partition:function(_array, _left, _right){
			var pivot								= _array[Math.floor((_right + _left) / 2)],
				left								= _left,
				right								= _right;

			while(left <= right){
				if(isNaN(pivot)){
					while(_array[left].localeCompare(pivot)	< 0){left++;}
					while(_array[right].localeCompare(pivot) > 0){right--;}
				}else{
					while(_array[left]	< pivot){left++;}
					while(_array[right] > pivot){right--;}
				}
				if(left <= right){
					this._swap(_array, left, right);
					left++;
					right--;
				}
			}
			return left;
		},
		_partitionJson:function(_array, propertyKey, _left, _right){
			var pivot								= _array[Math.floor((_right + _left) / 2)][propertyKey],
				left								= _left,
				right								= _right;

			while(left <= right){
				if(isNaN(pivot)){
					while(_array[left][propertyKey].localeCompare(pivot) < 0){left++;}
					while(_array[right][propertyKey].localeCompare(pivot) > 0){right--;}
				}else{
					while(_array[left][propertyKey]	< pivot){left++;}
					while(_array[right][propertyKey] > pivot){right--;}
				}
				if(left <= right){
					this._swap(_array, left, right);
					left++;
					right--;
				}
			}
			return left;
		},
		_swap:function(_array, _firstIdx, _secondIdx){
			var temp								= _array[_firstIdx];
			_array[_firstIdx]						= _array[_secondIdx];
			_array[_secondIdx]						= temp;
		},
		_binarySearchArray : function(data, doSort, rangeFirstValue, rangeLastValue){
			if(!xuic.__VALID.checkIsArray(data) || !xuic.__VALID.checkIsNumber(rangeFirstValue)){
				return -1;
			}
			if(xuic.__VALID.checkIsEmpty(doSort)){
				doSort								= false;
			}
			if(!xuic.__VALID.checkIsNumber(rangeLastValue)){
				rangeLastValue						= rangeFirstValue;
			}
			if(doSort){
				data								= this.quickSort(data);
			}
			var returnIndex							= -1;
			var min 								= 0;
			var max 								= data.length - 1;
			var guess								= 0;
			var target								= -1;
			while(max >= min){
				guess								= Math.floor((max + min) / 2);
				target								= data[guess];
				if(target >= rangeFirstValue && target <= rangeLastValue){
					returnIndex						= guess;
					break;
				}else if(target < rangeFirstValue){
					min								= guess + 1;
				}else{
					max								= guess - 1;
				}
			}
			return returnIndex;
		},
		_binarySearchJsonArray : function(data, propertyKey, doSort, rangeFirstValue, rangeLastValue){
			if(!xuic.__VALID.checkIsArray(data) || !xuic.__VALID.checkIsNumber(rangeFirstValue)){
				return -1;
			}
			if(xuic.__VALID.checkIsEmpty(doSort)){
				doSort								= false;
			}
			if(!xuic.__VALID.checkIsNumber(rangeLastValue)){
				rangeLastValue						= rangeFirstValue;
			}
			if(doSort){
				data								= this.quickSort(data, propertyKey);
			}
			/*JSON 체크*/
			var max 								= data.length - 1;
			var intReturnIdx						= -1;
			var min 								= 0;
			var guess								= 0;
			var target								= -1;
			while(max >= min){
				guess								= Math.floor((max + min) / 2);
				target								= data[guess][propertyKey];
				if(target >= rangeFirstValue && target <= rangeLastValue){
					intReturnIdx					= guess;
					break;
				}else if(target < rangeFirstValue){
					min								= guess + 1;
				}else{
					max								= guess - 1;
				}
			}
			return intReturnIdx;
		}
	};

	/*core static util feature api*/
	xuic.__UTIL		= new __Util();
	__Util			= null;

	function __Dom(){

	};
	__Dom.prototype	= {
		getElement : function(element){
			var objElement			= element;
			if(xuic.__VALID.checkIsString(element)){
				var objSplit		= element.split(".");
				if(objSplit.length > 1){
					var parent		= document.getElementById(objSplit[0]);
					if(xuic.__VALID.checkIsElement(parent)){
						objElement	= parent.querySelector("#" + objSplit[1]);
					}
				}else{
					objElement		= document.getElementById(element);
				}
			}
			if(!xuic.__VALID.checkIsElement(objElement)){
				objElement			= element;
			}
			return objElement;
		},
		getElementByClass : function(element){
			var htmlCollection			= element;
			if(xuic.__VALID.checkIsString(element)){
				var objSplit			= element.split(".");
				if(objSplit.length > 1){
					var parent			= document.getElementById(objSplit[0]);
					if(xuic.__VALID.checkIsElement(parent)){
						htmlCollection	= parent.getElementsByClassName(objSplit[1]);
					}
				}else{
					htmlCollection		= document.getElementsByClassName(element);
				}
			}
			if(xuic.__VALID.checkIsHTMLCollection(htmlCollection) && htmlCollection.length > 0){
				htmlCollection			= htmlCollection[0];
			}
			return htmlCollection;
		},
		getElementsList : function(element, includeOwn){
			var domList			= [], objElement = xuic.__DOM.getElement(element);
			if(xuic.__VALID.checkIsElement(objElement)){
				var collection	= objElement.getElementsByTagName("*");
				if(collection.length > 0){
					domList		= [].slice.call(collection);
				}
				if(includeOwn){
					domList.unshift(objElement);
				}
			}
			return domList;
		},
		getDblPickerElement : function(element){
			var dblElementList				= [null,null];
			if(xuic.__VALID.checkIsElement(element)){
				var link					= element.getAttribute("link");
				if(!xuic.__VALID.checkIsEmpty(link)){
					var form				= element.form;
					link					= (xuic.__VALID.checkIsElement(form) ? form.querySelector("#" + link) : document.getElementById(link));
					if(xuic.__VALID.checkIsElement(link)){
						if(!element.classList.contains("from") && !link.classList.contains("from") && !element.classList.contains("to") && !link.classList.contains("to")){
							dblElementList	= [element,link];
							element.classList.add("from");
							link.classList.add("to");
						}else if(link.classList.contains("from")){
							dblElementList	= [link,element];
						}else{
							dblElementList	= [element,link];
						}
					}
				}
			}
			return dblElementList;
		},
		getElementDecimalRoundSize : function(element){
			var round				= null;
			if(xuic.__VALID.checkIsElement(element)){
				var objClassList	= element.classList;
				for(var i = 0; i < objClassList.length; i++){
					if(objClassList[i].substr(0,5) === "round"){
						round		= objClassList[i].substr(5);
						break;
					}
				}
				if(!xuic.__VALID.checkIsEmpty(round) && !isNaN(round)){
					round			= parseInt(round,10);
				}else{
					round			= 2;
				}
			}
			return round;
		},
		getElementFormatName : function(element){
			var format					= null;
			if(xuic.__VALID.checkIsElement(element)){
				if(element.className.indexOf("xuiform_") >= 0){
					var objClassList	= element.classList;
					for(var i = 0; i < objClassList.length; i++){
						if(objClassList[i].indexOf("xuiform_") >= 0){
							format		= xuic.__UTIL.replaceAll(objClassList[i], "xuiform_", "").toUpperCase();
							break;
						}
					}
				}
			}
			return format;
		},
		getElementFormatMaxLength : function(element, format){
			var maxLength				= 0;
			if(xuic.__VALID.checkIsEmpty(format)){
				format					= xuic.__DOM.getElementFormatName(element);
			}
			if(format != null){
				switch(format){
					case "YEAR"		:
						maxLength		= 4;
						break;
					case "MONTH"	:
						maxLength		= 7;
						break;
					case "DATE"		:
						maxLength		= 10;
						break;
					case "DATETIME"	:
						if(element.classList.contains("second")){
							maxLength	= 19;
						}else{
							maxLength	= 16;
						}
						break;
					case "TIME"		:
						if(element.classList.contains("second")){
							maxLength	= 8;
						}else{
							maxLength	= 5;
						}
						break;
					case "NUMBER"	:
						break;
					case "DECIMAL"	:
						break;
					case "BIZ"		:
						maxLength		= 12;
						break;
					case "CORP"		:
						maxLength		= 14;
						break;
					case "JURI"		:
						maxLength		= 14;
						break;
					case "IHID"		:
						maxLength		= 14;
						break;
					case "PHONE"	:
						maxLength		= 14;
						break;
					case "CARD"		:
						maxLength		= 19;
						break;
					case "EMAIL"	:
						maxLength		= 50;
						break;
					case "IP"		:
						maxLength		= 15;
						break;
					case "POST"		:
						maxLength		= 7;
						break;
					case "CAR"		:
						maxLength		= 9;
						break;
					case "ACCOUNT"	:
						maxLength		= 19;
						break;
					default	:
						break;
				}
			}
			return maxLength;
		},
		getIndex : function(element){
			var index	= 0;
			while(element !== null){
				element	= element.previousSibling;
				index++;
			}
			return (index - 1);
		}
	};

	/*DOM element handling feature api*/
	xuic.__DOM		= new __Dom();
	__Dom			= null;

	function __Format(format){
		this.name	= format.substr(0,1).toUpperCase() + format.substr(1);
	};
	__Format.prototype	= {
		getData : function(data, invalidReturn, extra01, extra02){
			var _this					= this;
			var format					= _this.name;
			var returnValue				= xuic.__VALID.checkIsEmpty(invalidReturn) ? data : invalidReturn;
			var regexp					= null;

			if(!xuic.__VALID.checkIsEmpty(data)){
				if(typeof(invalidReturn) === "undefined"){
					invalidReturn		= data;
				}
				if(format === "Filesize"){
					if(xuic.__VALID.checkIsEmpty(extra01)){
						extra01			= true;
					}
					if(extra01){
						data			= parseFloat(data);
						if(!isNaN(data) && data > 0){
							var i		= Math.floor(Math.log(data) / Math.log(1024));
							data		= (data / Math.pow(1024,i)).toFixed(2) * 1 + ["B","Kb","Mb","Gb","Tb","Pb","Eb","Zb","Yb"][i];
						}
					}else{
						var _pow		= {"Y":8,"Z":7,"E":6,"P":5,"T":4,"G":3,"M":2,"K":1};
						var _char		= xuic.__UTIL.replaceAll(xuic.__UTIL.replaceAll(data.toUpperCase().replace(/[0-9]/g, ""), "B", ""), ".", "");
						data			= (parseFloat(data.replace(/[^-\.0-9]/g, ""))*Math.pow(1024,_pow[_char])).toFixed();
					}
				}else if(format === "Number"){
					data				= data.toString();
					if(xuic.__VALID.checkIsEmpty(extra01)){
						extra01			= true;
					}
					var blnMinus		= (data.substr(0,1) === "-");
					data				= data.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					while(data.length >= 2 && data.substr(0,1) === "0"){
						data			= data.substr(1);
					}
					if(extra01){
						var regexp		= xuic.__REGEXP.getFormatRegexp("CURRENCY");
						data			= data.replace(regexp.regexp,regexp.pattern);
					}
					if(blnMinus && data === "0"){
						data			= "";
					}
					if(!xuic.__VALID.checkIsEmpty(data)){
						data			= (blnMinus ? "-" : "") + data;
					}
				}else if(format === "Decimal"){
					data				= data.toString();
					if(xuic.__VALID.checkIsEmpty(extra01)){
						extra01			= true;
					}
					if(xuic.__VALID.checkIsEmpty(extra02)){
						extra02			= 2;
					}
					var intRoundSize	= extra02, blnMinus = (data.substr(0,1) === "-");
					data				= data.replace(/[-]/g, "");
					var objSplit		= data.split("."), len = objSplit.length, strInteger = "", strDecimal = "";
					for(var i = 0; i < len; i++){
						if(i == 0){
							strInteger	= (objSplit[i] + "").replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
						}else{
							strDecimal	+= (objSplit[i] + "").replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");}
					}
					if(xuic.__VALID.checkIsEmpty(strInteger)){
						strInteger		= "0";
					}
					if(strDecimal.length > intRoundSize){
						strDecimal		= strDecimal.substr(0, intRoundSize);
					}
					for(var i = intRoundSize - strDecimal.length; i > 0; i--){
						strDecimal		+= "0";
					}
					if(extra01){
						var regexpInfo	= xuic.__REGEXP.getFormatRegexp("CURRENCY");
						strInteger		= strInteger.replace(regexpInfo.regexp,regexpInfo.pattern);
					}
					data				= (strInteger + "." + strDecimal);
					if(data.length >= 2){
						while(data.substr(0,1) === "0" && data.substr(1,1) !== "." && data.length >= 2){
							data		= data.substr(1);
						}
					}
					if(data === "."){
						data			= "";
					}
					if(!xuic.__VALID.checkIsEmpty(data)){
						data			= (blnMinus ? "-" : "") + data;
					}
				}else if(format === "Dateday"){
						// 연도, 월, 일 추출
						var year  = parseInt(data.slice(0, 4));
						var month = parseInt(data.slice(4, 6)) - 1; // JavaScript에서 월은 0부터 시작합니다.
						var day   = parseInt(data.slice(6, 8));
						// Date 객체 생성
						var date  = new Date(year, month, day);

						// 요일 구하기
						var dayOfWeek	= xuic.__i18n.kr.days[date.getDay()];
						var languageCode = xuic.__COM.getLanguage();

						if( "en" === languageCode ){ dayOfWeek	= xuic.__i18n.en.days[date.getDay()]; }
						if( "vi" === languageCode ){ dayOfWeek	= xuic.__i18n.vi.days[date.getDay()]; }

						data		  = data + '(' + dayOfWeek + ')';
				}else if(format === "Datetime"){
					if(xuic.__VALID.checkIsEmpty(extra01)){
						data			= data.toString().replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
						if(data.length === 12){
							extra01		= false;
						}else if(data.length === 14){
							extra01		= true;
						}
					}
				}else if(format === "Time"){
					if(xuic.__VALID.checkIsEmpty(extra01)){
						data			= data.toString().replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
						if(data.length === 4){
							extra01		= false;
						}else if(data.length === 6){
							extra01		= true;
						}
					}
				}else if(extra02){
					if(format !== "CAR" && format !== "EMAIL"){
						data			= data.toString().replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					}
				}
				if(format !== "Filesize"){
					if(xuic.__VALID.checkIsEmpty(extra01)){
						extra01			= true;
					}
					if(xuic.__VALID.checkIsEmpty(extra02)){
						extra02			= false;
					}
					if(!xuic.__VALID["checkIs" + format].call(xuic.__VALID, data, extra01, extra02)){
						returnValue		= invalidReturn;
					}else{
						regexp			= xuic.__REGEXP.getFormatRegexp(format.toUpperCase(), extra01, extra02, data);
						if(!xuic.__VALID.checkIsEmpty(regexp)){
							data		= data.replace(regexp.regexp, regexp.pattern);
						}
						returnValue		= data;
					}
				}else{
					returnValue			= data;
				}
			}
			return returnValue;
		},
		getMaskingData : function(data, invalidReturn, extra01){
			return this.getData(data, invalidReturn, extra01, true);
		},
		getUnformatData : function(data, invalidReturn){
			var format		= this.name.toUpperCase();
			var returnValue	= "";
			if(format === "FILESIZE"){
				returnValue	= this.getData(data, invalidReturn, false);
			}else{
				returnValue	= this.getData(data, invalidReturn);
			}
			if(format !== "CAR" && format !== "EMAIL" && format !== "NUMBER" && format !== "DECIMAL" && format !== "IP" && format !== "DATEDAY" ){
				returnValue	= xuic.__UTIL.getNumberOnly(returnValue);
			}else if(format === "NUMBER" || format === "DECIMAL"){
				returnValue	= returnValue.replace(/[,]/g, "");
				//PostgreSQL에서 number와 float 형변환을 하지 않을 경우 insert/update 오류가 발생하여 형변환 처리 
				if(returnValue !== "" && format === "NUMBER"){
					returnValue = parseInt(returnValue, 10);
				} else if(returnValue !== "" && format === "DECIMAL"){
					returnValue = parseFloat(returnValue);
				}	
			}
			return returnValue;
		}
	};

	/*DOM element handling feature api*/
	xuic.__FORMAT						= {};
	var formatList						= ["year","month","date","dateday","time","datetime","number","decimal","biz","corp","juri","ihid","phone","card","email","ip","post","car","filesize","account"];
	for(var i in formatList){
		xuic.__FORMAT[formatList[i]]	= new __Format(formatList[i]);
	}
	__Format							= null;

	xuic.__INPUT_TEXT_CONTROLLER		= function(element){
		if(xuic.__VALID.checkIsEmpty(element.controller)){
			element.setAttribute("autocomplete", "off");
			var parentLabel															= element.parentNode;
			var classList															= element.classList;
			var config																= {};
			if(classList.contains("small")){
				parentLabel.classList.add("small");
			}
			config.id																= element.id;
			config.disabled															= false;
			config.visible															= true;
			config.title															= element.getAttribute("xui-tooltip-title");
			config.format															= xuic.__DOM.getElementFormatName(element);
			config.search															= classList.contains("search");
			config.filter															= classList.contains("filter");
			config.refresh															= classList.contains("refresh");
			config.picker															= classList.contains("picker");
			config.controlSecond													= classList.contains("second");
			config.currency															= classList.contains("currency");
			config.masking															= classList.contains("masking");
			config.required															= classList.contains("required");
			config.maxlength														= element.getAttribute("maxlength");
			config.isSet															= false;
			var link																= element.getAttribute("link");
			config.double															= !xuic.__VALID.checkIsEmpty(link);
			if(xuic.__VALID.checkIsEmpty(config.title)){
				config.title														= element.getAttribute("title");
				if(xuic.__VALID.checkIsEmpty(config.title)){
					config.title													= element.id;
				}
			}
			if(!xuic.__VALID.checkIsEmpty(config.format)){
				config.maxlength													= xuic.__DOM.getElementFormatMaxLength(element, config.format);
				if(config.maxlength > 0){
					element.setAttribute("maxlength", config.maxlength);
				}
				switch(config.format){
					case "NUMBER"	:
						element.style.setProperty("text-align", "right");
						break;
					case "DECIMAL"	:
						element.style.setProperty("text-align", "right");
						break;
					case "FILESIZE"	:
						element.style.setProperty("text-align", "right");
						break;
					default	:
						break;
				}
			}else if(!xuic.__VALID.checkIsEmpty(config.maxlength)){
				config.maxlength													= parseInt(config.maxlength);
			}
			if(config.double){
				var dblElement														= xuic.__DOM.getDblPickerElement(element);
				if(xuic.__VALID.checkIsArray(dblElement) && dblElement.length === 2){
					if(element === dblElement[0]){
						config.direction											= "L";
					}else if(element === dblElement[1]){
						config.direction											= "R";
					}
				}
			}
			element.addEventListener("focus", function(e){
				var controller														= this.controller;
				this.parentNode.classList.add("xui-focus");
				if(controller.config.picker){
					if(xuic.__VALID.checkIsEmpty(controller.readyClick) || controller.readyClick){
						controller.showPicker();
					}
				}else{
					xuic.__COM.closeActiveDirective();
				}
			});
			element.addEventListener("click", function(e){
				e.cancelBubble														= true;
				var controller														= this.controller;
				if(controller.config.picker){
					if(!controller.readyClick){
						if(xuic.__ACTIVE_PICKER_ELEMENT !== null && xuic.__ACTIVE_PICKER_ELEMENT === this){
							controller.hidePicker();
						}else{
							controller.showPicker();
						}
					}
				}else if(controller.config.search || controller.config.filter || controller.config.refresh){
					var rect														= e.target.getBoundingClientRect();
					if(xuic.__CONFIG.browserName === "MSIE"){
						if(e.clientX < 0 && e.clientY < 0 && !controller.config.disabled){
							e.target.fromIcon										= true;
						}else{
							e.target.fromIcon										= false;
						}
					}else{
						var x														= (e.target.offsetWidth - (e.clientX - rect.left));
						var y														= e.clientY - rect.top;
						if(xuic.__CONFIG.browserName === "MSIE"){
							clientX													= clientX;
							clientY													= clientY;
						}
						if(x >= 10 && x <= 26 && y >= 6 && y <= 26 && !controller.config.disabled){
							e.target.fromIcon										= true;
						}else{
							e.target.fromIcon										= false;
						}
					}
				}
				controller.readyClick												= false;
				if(this.classList.contains("xui-tree-edit-element")){
					this.focus();
				}
			});
			element.addEventListener("mousedown", function(e){
				if(xuic.__VALID.checkIsEmpty(this.controller.readyClick)){
					this.controller.readyClick										= true;
				}
			});
			element.addEventListener("blur", function(e){
				var controller														= this.controller;
				if(!xuic.__VALID.checkIsEmpty(controller.config.format)){
					controller.setData(this.value, false, true);
					controller.checkValid(false, true);
				}
				this.parentNode.classList.remove("xui-focus");
				delete controller.readyClick;
			});
			element.addEventListener("keyup", function(e){
				var controller														= this.controller;
				var allowKeyCodeList												= [8,32,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,96,97,98,99,100,101,102,103,104,105,106,107,109,110,111,186,187,188,189,190,191,222];
				var keycode															= e.keyCode;
				if(allowKeyCodeList.indexOf(e.keyCode) >= 0 && !(e.ctrlKey && keycode === 65)){
					if(controller.config.format !== null){
						controller.autoFormat(e);
					}
				}
				controller.config.isSet												= false;
			});
			if(xuic.__VALID.checkIsElement(parentLabel) && parentLabel.tagName === "LABEL"){
				if(config.search){
					parentLabel.classList.add("search");
				}else if(config.filter){
					parentLabel.classList.add("filter");
				}else if(config.refresh){
					parentLabel.classList.add("refresh");
				}else if(config.picker){
					if(config.double){
						if(classList.contains("xuiform_time")){
							parentLabel.classList.add("timepicker");
						}else{
							parentLabel.classList.add("doublepicker");
						}
					}else{
						if(classList.contains("xuiform_year")){
							parentLabel.classList.add("yearpicker");
						}else if(classList.contains("xuiform_month")){
							parentLabel.classList.add("monthpicker");
						}else if(classList.contains("xuiform_date")){
							parentLabel.classList.add("datepicker");
						}else if(classList.contains("xuiform_dateday")){
							parentLabel.classList.add("datedaypicker");
						}else if(classList.contains("xuiform_datetime")){
							parentLabel.classList.add("datetimepicker");
						}else if(classList.contains("xuiform_time")){
							parentLabel.classList.add("timepicker");
						}
					}
				}else if(element.type === "password"){
					parentLabel.classList.add("password");
				}
			}
			this.origin																= "";
			this.config																= config;
			this.element															= element;
			element.controller														= this;
			this.setRequired();
			this.setDisabled();
			this.setVisible();
			if(!xuic.__VALID.checkIsEmpty(this.element.value)){
				this.setData(this.element.value);
			}

			return this;
		}else{
			return element.controller;
		}
	};
	xuic.__INPUT_TEXT_CONTROLLER.prototype	= {
		setData : function(data, doCallChange, checkValid){
			if(typeof(data) !== "undefined"){
				if(xuic.__VALID.checkIsEmpty(doCallChange)){
					doCallChange													= true;
				}
				if(xuic.__VALID.checkIsEmpty(checkValid)){
					checkValid														= false;
				}
				var isChange														= false;
				if(data === null){data												= "";}
				data																= data.toString().trim();
				if(xuic.__COM.checkIsXSSRestoreTarget(this.element.tagName)){
					data															= xuic.__UTIL._recursiveXSS(data, false);
				}
				var strFormatValue													= data;
				var strUnformatValue												= data;
				this.element.value													= strFormatValue;
				if(!xuic.__VALID.checkIsEmpty(data)){
					if(!xuic.__VALID.checkIsEmpty(this.config.format)){
						if((this.config.format === "BIZ" || this.config.format === "CORP" || this.config.format === "JURI" || this.config.format === "IHID" || this.config.format === "PHONE" || this.config.format === "CARD" || this.config.format === "EMAIL" || this.config.format === "IP" || this.config.format === "CAR") && this.config.masking){
							strUnformatValue										= strUnformatValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
							strFormatValue											= xuic.__FORMAT[this.config.format.toLowerCase()].getMaskingData(strUnformatValue, (checkValid ? "" : data));
						}else{
							if(this.config.format === "TIME"){
								strUnformatValue									= xuic.__UTIL.rpad(strUnformatValue	, (this.config.controlSecond ? 6 : 4)	, "0");
								strFormatValue										= xuic.__UTIL.rpad(strFormatValue	, (this.config.controlSecond ? 6 : 4)	, "0");
							}
							if(this.config.format === "DECIMAL" || this.config.format === "NUMBER"){
								strFormatValue										= xuic.__FORMAT[this.config.format.toLowerCase()].getData(data, (checkValid ? "" : data), this.config.currency, xuic.__DOM.getElementDecimalRoundSize(this.element));
								if(!xuic.__VALID.checkIsEmpty(strFormatValue)){
									strUnformatValue								= strFormatValue.replace(/[,]/g, "");
								}
							}else if(this.config.format === "DATETIME" || this.config.format === "TIME"){
								strFormatValue										= xuic.__FORMAT[this.config.format.toLowerCase()].getData(data, (checkValid ? "" : data), this.config.controlSecond);
							}else{
								strFormatValue										= xuic.__FORMAT[this.config.format.toLowerCase()].getData(data, (checkValid ? "" : data));
							}
							if(this.config.format !== "CAR" && this.config.format !== "EMAIL" && this.config.format !== "NUMBER" && this.config.format !== "DECIMAL" && this.config.format !== "IP"){
								strUnformatValue									= strFormatValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
							}
						}
					}
				}
				this.element.value													= strFormatValue;
				this.config.isSet													= true;
				if(this.origin !== strUnformatValue){
					isChange														= true;
				}
				this.origin															= strUnformatValue;
				if(doCallChange && isChange){
					var ce															= new Event("change");
					this.element.dispatchEvent(ce);
				}
			}
		},
		getData : function(format){
			var returnData															= this.element.value;
			if(!xuic.__VALID.checkIsEmpty(this.config.format)){
				if(!format){
					returnData														= xuic.__FORMAT[this.config.format.toLowerCase()].getUnformatData(returnData, returnData);
				}else{
					returnData														= xuic.__FORMAT[this.config.format.toLowerCase()].getData(returnData, returnData);
				}
			}
			return returnData;
		},
		setRequired : function(required){
			if(xuic.__VALID.checkIsEmpty(required)){
				required															= this.element.classList.contains("required");
			}
			if(required){
				this.element.classList.add("required");
				this.element.parentNode.classList.add("required");
			}else{
				this.element.parentNode.classList.remove("required");
				this.element.classList.remove("required");
			}
			this.config.required													= required;
		},
		setDisabled : function(disabled){
			if(xuic.__VALID.checkIsEmpty(disabled)){
				disabled															= this.element.readOnly;
			}
			if(disabled){
				this.element.parentNode.classList.add("xui-disabled");
			}else{
				this.element.parentNode.classList.remove("xui-disabled");
			}
			this.element.readOnly													= disabled;
			this.config.disabled													= disabled;
		},
		setVisible : function(visible){
			if(xuic.__VALID.checkIsEmpty(visible)){
				if(this.element.classList.contains("xui-invisible") || this.element.style.getPropertyValue("display") === "none"){
					visible															= false;
				}else{
					visible															= true;
				}
				this.element.classList.remove("xui-invisible");
				this.element.style.setProperty("display", "");
			}
			if(!visible){
				this.element.parentNode.classList.add("xui-invisible");
			}else{
				this.element.parentNode.classList.remove("xui-invisible");
			}
			this.config.visible														= visible;
		},
		isEnable : function(){
			return !(this.config.disabled);
		},
		isVisible : function(){
			return this.config.visible;
		},
		showPicker : function(){
			var picker																= this.getPicker();
			if(!xuic.__VALID.checkIsEmpty(picker) && this.isEnable()){
				xuic.__COM.closeActiveDirective(this.element);
				picker.picker.show(this.element,{"centering":false});
			}
		},
		hidePicker : function(){
			var picker																= this.getPicker();
			if(!xuic.__VALID.checkIsEmpty(picker)){
				picker.picker.hide();
			}
		},
		checkValid : function(invalidClear, showMessage){
			var isValid																= true;
			var strValue															= this.element.value.trim();
			var strInvalidMessage													= "";
			if(!xuic.__VALID.checkIsEmpty(strValue)){
				if(this.element.type === "password" && this.element.classList.contains("account")){
					isValid															= xuic.__VALID.checkValidPassword(strValue);
					if(!isValid){
						if(!xuic.__VALID.checkIsEmpty(this.config.title)){
							strInvalidMessage										= xuic.__ENUM.PASSWORD_DENY_INVALID.getName();
						}
					}
				}
				var strLeftValue													= null, strRightValue = null, strFormatName = null, strFnName = null, objValidFn = null, objExtraArg01 = null, objExtraArg02 = null;
				if(isValid && !this.config.masking || strValue.indexOf("*") < 0){
					if(!xuic.__VALID.checkIsEmpty(this.config.format)){
						strFormatName												= (this.config.format.substr(0,1).toUpperCase() + this.config.format.substr(1).toLowerCase());
						objValidFn													= xuic.__VALID["checkIs" + strFormatName];
						switch(strFormatName){
							case "Number"	:
								objExtraArg01										= this.config.currency;
								break;
							case "Decimal"	:
								objExtraArg01										= this.config.currency;
								objExtraArg02										= xuic.__DOM.getElementDecimalRoundSize(this.element);
								break;
							default			:
								break;
						}
						if(typeof(objValidFn) === "function"){
							if(!objValidFn.call(xuic.__VALID, strValue, objExtraArg01, objExtraArg02)){
								isValid												= false;
								strInvalidMessage									= xuic.__ENUM.WRONG_DATA_FORMAT.getName();
							}
						}
					}
					if(isValid && this.config.maxlength > 0 && strValue.length > this.config.maxlength){
						isValid														= false;
						if(!xuic.__VALID.checkIsEmpty(this.config.title)){
							strInvalidMessage										= this.config.title + "의 길이가 초과되었습니다. [최대(" + this.config.maxlength + "),입력값(" + strValue.length + ")]";
						}
					}
				}
				if(this.config.double){
					var objCoupleElementList										= xuic.__DOM.getDblPickerElement(this.element);
					if(xuic.__VALID.checkIsArray(objCoupleElementList) && objCoupleElementList.length > 0){
						if(xuic.__VALID.checkIsElement(objCoupleElementList[0])){
							strLeftValue											= objCoupleElementList[0].controller.getData();
						}
						if(xuic.__VALID.checkIsElement(objCoupleElementList[1])){
							strRightValue											= objCoupleElementList[1].controller.getData();
						}
					}
				}
				if(isValid && !xuic.__VALID.checkIsEmpty(strLeftValue) && !xuic.__VALID.checkIsEmpty(strRightValue)){
					var intMaxTerm													= this.element.getAttribute("max");
					var intMinTerm													= this.element.getAttribute("min");
					if(!xuic.__VALID.checkIsEmpty(intMaxTerm)){
						intMaxTerm													= parseInt(intMaxTerm,10);
					}else{
						intMaxTerm													= 0;
					}
					if(!xuic.__VALID.checkIsEmpty(intMinTerm)){
						intMinTerm													= parseInt(intMinTerm,10);
					}else{
						intMinTerm													= 0;
					}
					strLeftValue													= parseInt(strLeftValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), ""), 10);
					strRightValue													= parseInt(strRightValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), ""), 10);
					if(strLeftValue > strRightValue){
						isValid														= false;
						strInvalidMessage											= xuic.__ENUM.BEGIN_BIGGER_THAN_END.getName();
					}
					if(intMaxTerm > 0 && (strRightValue - strLeftValue) >= intMaxTerm){
						isValid														= false;
						if(this.config.format === "YEAR"){
							strInvalidMessage										= intMaxTerm + xuic.__ENUM.MAX_OVER_Y.getName();
						}else if(this.config.format === "MONTH"){
							strInvalidMessage										= intMaxTerm + xuic.__ENUM.MAX_OVER_M.getName();
						}else if(this.config.format === "DATE"){
							strInvalidMessage										= intMaxTerm + xuic.__ENUM.MAX_OVER_D.getName();
						}
					}
					if(intMinTerm > 0 && (strRightValue - strLeftValue + 1) < intMinTerm){
						isValid														= false;
						if(this.config.format === "YEAR"){
							strInvalidMessage										= "최소 " + intMinTerm + xuic.__ENUM.MIN_SHORT_Y.getName();
						}else if(this.config.format === "MONTH"){
							strInvalidMessage										= "최소 " + intMinTerm + xuic.__ENUM.MIN_SHORT_M.getName();
						}else if(this.config.format === "DATE"){
							strInvalidMessage										= "최소 " + intMinTerm + xuic.__ENUM.MIN_SHORT_D.getName();
						}
					}
				}
				if(!isValid){
					if(invalidClear){
						this.setData("", false, false);
					}
					if(showMessage && strInvalidMessage !== ""){
						xuic.__COM.showMessageTip(this.element, strInvalidMessage, "E", 5000);
					}
				}
			}else if(this.config.required){
				isValid																= false;
				if(showMessage){
					xuic.__COM.showMessageTip(this.element, xuic.__ENUM.EMPTY_DATA_FILL.getName(), "E", 5000);
				}
			}
			return isValid;
		},
		autoFormat : function(evt){
			var keycode																= ((evt.which) ? evt.which : evt.keyCode), element = this.element, controllerConfig = this.config;
			var strValue															= element.value.trim(), objRegexpInfo = xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + (controllerConfig.controlSecond ? "_SECOND" : "")), objPicker = element.controller.getPicker();
			var originalValue														= element.value.trim();
			var objCalendar															= null, objValidFn = null, objExtraArg01 = null, objExtraArg02 = null, validLength = -1, blnOnlyNumber = true;
			if(!xuic.__VALID.checkIsEmpty(objPicker)){
				objPicker															= objPicker["picker"];
				objCalendar															= objPicker._uiLeft;
				if(controllerConfig.direction === "R"){
					objCalendar														= objPicker._uiRight;
				}
			}
			/*Back space key event or masking value status*/
			if(keycode === 8 || (controllerConfig.masking && strValue.indexOf("*") >= 0)){
				if(controllerConfig.masking){
					delete element.origin;
				}
				if(controllerConfig.picker && strValue === ""){
					if(controllerConfig.double){
						xuic.__DIRECTIVE.reLink(objPicker, (controllerConfig.direction === "L" ? "" : undefined), (controllerConfig.direction === "R" ? "" : undefined));
					}else{
						objCalendar.clear();
					}
					element.controller.setData("", false, false);
				}
				return;
			}
			switch(controllerConfig.format){
				case "YEAR"		:
					validLength														= 4;
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					break;
				case "MONTH"	:
					validLength														= 6;
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					if(!xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
					}
					break;
				case "DATE"		:
					validLength														= 8;
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					if(!xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern).replace(xuic.__CONFIG.dateDelimiter+xuic.__CONFIG.dateDelimiter,xuic.__CONFIG.dateDelimiter);
					}
					break;
				case "DATETIME"	:
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					if(!xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern).replace(xuic.__CONFIG.dateDelimiter+xuic.__CONFIG.dateDelimiter,xuic.__CONFIG.dateDelimiter).replace("::",":").replace(" :","");
					}
					if(controllerConfig.controlSecond){
						validLength													= 14;
					}else{
						validLength													= 12;
					}
					break;
				case "TIME"		:
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					if(!xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern).replace("::",":").replace(" :","");
					}
					if(controllerConfig.controlSecond){
						validLength													= 6;
					}else{
						validLength													= 4;
					}
					break;
				case "NUMBER"	:
					blnOnlyNumber													= false;
					var blnMinus													= (strValue.substr(0,1) === "-");
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					while(strValue.length >= 2 && strValue.substr(0,1) === "0"){
						strValue													= strValue.substr(1);
					}
					if(controllerConfig.currency){
						var regexpInfo												= xuic.__REGEXP.getFormatRegexp("CURRENCY");
						strValue													= strValue.replace(regexpInfo.regexp,regexpInfo.pattern);
					}
					if(blnMinus && strValue === "0"){
						strValue													= "";
					}
					strValue														= (blnMinus ? "-" + strValue : strValue);
					break;
				case "DECIMAL"	:
					blnOnlyNumber													= false;
					var intRoundSize												= xuic.__DOM.getElementDecimalRoundSize(element), blnMinus = (strValue.substr(0,1) === "-"), blnDot = (strValue.indexOf(".") >= 0);
					strValue														= strValue.replace(/[-]/g, "");
					var objSplit													= strValue.split("."), len = objSplit.length, strInteger = "", strDecimal = "";
					for(var i = 0; i < len; i++){
						if(i == 0){strInteger										= (objSplit[i] + "").replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");}
						else{strDecimal												+= (objSplit[i] + "").replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");}
					}
					if(strDecimal.length > intRoundSize){
						strDecimal													= strDecimal.substr(0, intRoundSize);
					}
					if(controllerConfig.currency){
						var regexpInfo												= xuic.__REGEXP.getFormatRegexp("CURRENCY");
						strInteger													= strInteger.replace(regexpInfo.regexp,regexpInfo.pattern);
					}
					strValue														= (strInteger + (blnDot ? ("." + strDecimal) : ""));
					if(strValue.length >= 2){
						while(strValue.substr(0,1) === "0" && strValue.substr(1,1) !== "." && strValue.length >= 2){
							strValue												= strValue.substr(1);
						}
					}
					if(strValue === "."){
						strValue													= "";
					}
					strValue														= blnMinus ? ("-" + strValue) : strValue;
					objSplit														= strValue.split(".");
					if(objSplit.length >= 2 && objSplit[1].length >= intRoundSize){
						validLength													= strValue.length;
					}
					break;
				case "BIZ"		:
					validLength														= 10;
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					if(!xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
					}
					break;
				case "CORP"		:
					validLength														= 13;
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					if(!xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
					}
					break;
				case "JURI"		:
					validLength														= 13;
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					if(!xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
					}
					break;
				case "IHID"		:
					validLength														= 13;
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					if(!xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
					}
					break;
				case "PHONE"	:
					blnOnlyNumber													= false;
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					var objSplit													= null, _splitlen = 3, strOne = strValue.substr(0,1), strTwo = strValue.substr(0,2), strThree = strValue.substr(0,3);
					if(strOne === "1"){
						strValue													= strValue.substr(0,8);
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_BIZ");
						_splitlen													= 2;
					}else if(strTwo === "01"){
						strValue													= strValue.substr(0,11);
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_MOBILE");
					}else if(strThree === "070"){
						strValue													= strValue.substr(0,11);
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_ZEROSEVENZERO");
					}else{
						strValue													= strValue.substr(0,12);
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_REGULAR");
					}
					if(strValue.length >= 3 && !xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern).replace("--", "-").replace("--", "-");
					}
					objSplit														= strValue.split("-");
					if(objSplit.length >= _splitlen){
						var _replacesize											= objSplit[_splitlen-1].length - 4;
						if(_replacesize > 0){
							strValue												= strValue.substr(0,strValue.length-_replacesize);
						}
						if(objSplit[_splitlen-1].length >= 4){
							validLength												= strValue.length;
						}
					}
					break;
				case "CARD"		:
					blnOnlyNumber													= false;
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
					var objSplit													= null, _splitLen = 4, _checklen = 4, strOne = strValue.substr(0,1), strTwo = strValue.substr(0,2), strThree = strValue.substr(0,3), strFour = strValue.substr(0,4);
					if(strFour === "2131" || strFour === "1800" || strTwo === "35"){
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_JCB");
					}else if(strTwo === "34" || strTwo === "37"){
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_AMEX");
						_splitlen													= 3;
						_checklen													= 5;
					}else if(strTwo === "30" || strTwo === "36" || strTwo === "38"){
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_DINERS");
						_splitlen													= 3;
					}else if(strOne === "9"){
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_BC");
					}else if(strOne === "4"){
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_VISA");
					}else if(strOne === "5"){
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_MASTER");
					}else if(strFour === "6011" || strFour === "6560" || strFour === "6561" || strFour === "6564" || strFour === "6565" || strThree === "644"){
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_DISCOVER");
					}else{
						objRegexpInfo												= xuic.__REGEXP.getKeyEventRegexp(controllerConfig.format + "_REGULAR");
					}
					if(strValue.length >= 4 && !xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern).replace("--", "-").replace("--", "-");
					}
					objSplit														= strValue.split("-");
					if(objSplit.length >= _splitlen && objSplit[_splitlen-1].length >= _checklen){
						validLength													= strValue.length;
					}
					break;
				case "EMAIL"	:
					blnOnlyNumber													= false;
					var lastdot														= strValue.lastIndexOf("."), split = strValue.indexOf("@");
					if(lastdot >= 0 && split >= 2 && lastdot > split && strValue.substr(lastdot+1).length >= 2){
						validLength													= strValue.length;
					}
					break;
				case "IP"		:
					blnOnlyNumber													= false;
					strValue														= strValue.replace(/[^0-9\.]/g, "");
					if(!xuic.__VALID.checkIsEmpty(objRegexpInfo)){
						strValue													= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
					}
					var objSplit													= strValue.split(".");
					if(objSplit.length >= 4 && objSplit[3].length > 0){
						strValue													= (objSplit[0] + "." + objSplit[1] + "." + objSplit[2] + "." + objSplit[3]);
						validLength													= strValue.length;
					}
					break;
				case "POST"		:
					blnOnlyNumber													= false;
					strValue														= strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "").substr(0,6);
					if(strValue.length >= 6){
						if(!xuic.__VALID.checkIsEmpty(objRegexpInfo)){
							strValue												= strValue.replace(objRegexpInfo.regexp, objRegexpInfo.pattern);
						}
					}
					break;
				case "CAR"		:
					blnOnlyNumber													= false;
					var lastFour													= strValue.substr(strValue.length-4);
					if(lastFour.length === 4 && !isNaN(lastFour)){
						validLength													= strValue.length;
					}
					break;
				case "ACCOUNT"	:
					blnOnlyNumber													= false;
					break;
				default	:
					break;
			}
			if(blnOnlyNumber){
				originalValue														= originalValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
			}
			if(strValue !== originalValue || strValue === ""){
				if(strValue === ""){
					element.controller.setData(strValue, false, false);
				}else{
					element.value													= strValue;
				}
			}
			if(validLength >= 0){
				var valueLen														= (blnOnlyNumber ? strValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "").length : strValue.length);
				if(valueLen === validLength){
					if(controllerConfig.picker){
						if(!xuic.__VALID.checkIsEmpty(element.value)){
							switch(controllerConfig.format){
								case "DATETIME"	:
									objCalendar.setValue(new Date(xuic.__UTIL.replaceAll(element.value, xuic.__CONFIG.dateDelimiter, "/")));
									break;
								default			:
									objCalendar.setValue(element.value, false, false);
									break;
							}
						}else{
							if(controllerConfig.double){
								xuic.__DIRECTIVE.reLink(objPicker, (controllerConfig.direction === "L" ? "" : undefined), (controllerConfig.direction === "R" ? "" : undefined));
							}else{
								objCalendar.clear();
							}
							element.controller.setData("", false, false);
						}
					}
				}
			}
		},
		getPicker : function(){
			return (this.config.picker ? xuic.__DIRECTIVE.getDirective((this.config.double ? "DOUBLE_" : "") + this.config.format + (this.config.controlSecond ? "_SECOND" : "") + "_PICKER") : null);
		},
		_getController : function(){
			return this;
		}
	};
	xuic.__INPUT_ETC_CONTROLLER	= function(element){
		if(xuic.__VALID.checkIsEmpty(element.controller)){
			element.setAttribute("autocomplete", "off");
			var parentLabel															= element.parentNode;
			var type																= element.type;
			switch(type){
				case "hidden"	:
					break;
				case "password" :
					break;
				case "file"		:
					break;
				case "image"	:
					break;
				case "range"	:
					break;
				case "reset"	:
					break;
				case "search"	:
					break;
				case "submit"	:
					break;
			}
			var classList															= element.classList;
			var config																= {};
			config.id																= element.id;
			config.type																= type;
			config.disabled															= false;
			config.visible															= true;
			config.title															= element.getAttribute("xui-tooltip-title");
			config.required															= classList.contains("required");
			config.maxlength														= element.getAttribute("maxlength");
			if(xuic.__VALID.checkIsEmpty(config.title)){
				config.title														= element.getAttribute("title");
				if(xuic.__VALID.checkIsEmpty(config.title)){
					config.title													= element.id;
				}
			}
			if(!xuic.__VALID.checkIsEmpty(config.maxlength)){
				config.maxlength													= parseInt(config.maxlength);
			}
			this.origin																= "";
			this.config																= config;
			this.element															= element;
			element.controller														= this;
			this.setRequired();
			this.setDisabled();
			this.setVisible();
			if(!xuic.__VALID.checkIsEmpty(this.element.value)){
				this.setData(this.element.value);
			}

			return this;
		}else{
			return element.controller;
		}
	};
	xuic.__INPUT_ETC_CONTROLLER.prototype	= {
		setData : function(data, doCallChange){
			if(typeof(data) !== "undefined"){
				if(xuic.__VALID.checkIsEmpty(doCallChange)){
					doCallChange													= true;
				}
				if(data === null){data												= "";}
				data																= data.toString().trim();
				if(xuic.__COM.checkIsXSSRestoreTarget(this.element.tagName)){
					data															= xuic.__UTIL._recursiveXSS(data, false);
				}
				var isChange														= false;
				this.element.value													= data;
				if(this.origin !== data){
					isChange														= true;
				}
				this.origin															= data;
				if(doCallChange && isChange){
					var ce															= new Event("change");
					this.element.dispatchEvent(ce);
				}
			}
		},
		getData : function(){
			return this.origin;
		},
		setDisabled : function(disabled){
			if(xuic.__VALID.checkIsEmpty(disabled)){
				disabled															= this.element.disabled;
			}
			this.element.disabled													= disabled;
			this.config.disabled													= disabled;
		},
		setVisible : function(visible){
			if(xuic.__VALID.checkIsEmpty(visible)){
				if(this.element.classList.contains("xui-invisible") || this.element.style.getPropertyValue("display") === "none"){
					visible															= false;
					this.element.classList.add("xui-invisible");
				}else{
					visible															= true;
					this.element.classList.remove("xui-invisible");
				}
				this.element.style.setProperty("display", "");
			}else{
				if(!visible){
					this.element.classList.add("xui-invisible");
				}else{
					this.element.classList.remove("xui-invisible");
				}
			}
			this.config.visible														= visible;
		},
		setRequired : function(required){
			if(xuic.__VALID.checkIsEmpty(required)){
				required															= this.element.classList.contains("required");
			}
			if(required){
				this.element.classList.add("required");
				this.element.parentNode.classList.add("required");
			}else{
				this.element.parentNode.classList.remove("required");
				this.element.classList.remove("required");
			}
			this.config.required													= required;
		},
		isEnable : function(){
			return !(this.config.disabled);
		},
		isVisible : function(){
			return this.config.visible;
		},
		checkValid : function(invalidClear, showMessage){
			var isValid																= true;
			var strValue															= this.element.value.trim();
			var strInvalidMessage													= "";
			if(!xuic.__VALID.checkIsEmpty(strValue)){
				if(this.config.maxlength > 0 && strValue.length > this.config.maxlength){
					isValid															= false;
					if(!xuic.__VALID.checkIsEmpty(this.config.title)){
						strInvalidMessage											= this.config.title + "의 길이가 초과되었습니다. [최대(" + this.config.maxlength + "),입력값(" + strValue.length + ")]";
					}
				}
				if(!isValid){
					if(invalidClear){
						strValue													= "";
					}
					if(showMessage && strInvalidMessage !== ""){
						xuic.__COM.showMessageTip(this.element, strInvalidMessage, "E", 5000);
					}
				}
			}else if(this.config.required){
				isValid																= false;
				if(showMessage){
					xuic.__COM.showMessageTip(this.element, xuic.__ENUM.EMPTY_DATA_FILL.getName(), "E", 5000);
				}
			}
			return isValid;
		},
		_getController : function(){
			return this;
		}
	};
	xuic.__COMBO_CONTROLLER	= function(element){
		if(xuic.__VALID.checkIsEmpty(element.controller)){
			element.setAttribute("autocomplete", "off");
			var parentLabel															= element.parentNode;
			var classList															= element.classList;
			var config																= {};
			if(classList.contains("small")){
				parentLabel.classList.add("small");
			}
			config.id																= element.id;
			config.combo															= true;
			config.disabled															= false;
			config.visible															= true;
			config.title															= element.getAttribute("xui-tooltip-title");
			config.optionData														= {};
			config.options															= [];
			config.groupCode														= element.getAttribute("groupCode");
			config.headText															= element.getAttribute("headText");
			config.headValue														= element.getAttribute("headValue");
			config.child															= element.getAttribute("child");
			config.autoInput														= element.getAttribute("autoInput");
			config.multiple															= classList.contains("multi");
			config.filter															= classList.contains("filter");
			config.required															= classList.contains("required");
			config.checkedList														= [];
			config.picker															= null;
			config.open																= false;
			config.openAutoCompletion												= false;
			if(!xuic.__VALID.checkIsEmpty(config.child)){
				config.child														= this._getChildElement(element);
			}
			if(!xuic.__VALID.checkIsEmpty(config.autoInput)){
				config.autoInput													= this._getAutoCompletionElement(element);
			}
			if(xuic.__VALID.checkIsEmpty(config.title)){
				config.title														= element.getAttribute("title");
				if(xuic.__VALID.checkIsEmpty(config.title)){
					config.title													= element.id;
				}
			}
			if(!config.filter){
				element.setAttribute("readonly", true);
			}
			element.addEventListener("focus", function(e){
				var controller														= this.controller;
				this.parentNode.classList.add("xui-focus");
				if(xuic.__VALID.checkIsEmpty(this.readyClick)){
					controller.showPicker();
				}
			});
			element.addEventListener("click", function(e){
				var controller														= this.controller;
				if(!controller.readyClick){
					if(controller.config.open){
						controller.hidePicker();
					}else{
						controller.showPicker();
					}
				}
				controller.readyClick												= false;
				if(this.classList.contains("xui-tree-edit-element")){
					this.focus();
				}
			});
			element.addEventListener("mousedown", function(e){
				if(xuic.__VALID.checkIsEmpty(this.controller.readyClick)){
					this.controller.readyClick										= true;
				}
			});
			element.addEventListener("blur", function(e){
				this.parentNode.classList.remove("xui-focus");
				delete this.controller.readyClick;
			});
			element.addEventListener("keyup", function(e){
				var controller														= this.controller;
				if(controller.config.filter && controller.isEnable()){
					controller.filterCombo(e);
				}
			});
			element.addEventListener("keydown", function(e){
				e.cancelBubble														= true;
				var keycode															= (e.which) ? e.which : e.keyCode;
				if(keycode === 38 || keycode === 40){
					var controller													= this.controller;
					var focused														= null;
					var focus														= null;
					if(controller.config.open){
						focused														= controller.config.picker.querySelector(".current");
						if(keycode === 38){
							if(focused === null){
								focus												= controller.config.picker.querySelector(".xui-combo-option:last-child");
							}else{
								focus												= focused.previousElementSibling;
							}
							if(focus === null){
								focus												= controller.config.picker.querySelector(".xui-combo-option:last-child");
							}
						}else if(keycode === 40){
							if(focused === null){
								focus												= controller.config.picker.querySelector(".xui-combo-option:first-child");
							}else{
								focus												= focused.nextElementSibling;
							}
							if(focus === null){
								focus												= controller.config.picker.querySelector(".xui-combo-option:first-child");
							}
						}
						if(focused !== null){
							focused.classList.remove("current");
						}
						focus.classList.add("current");
					}else if(keycode === 40){
						controller.showPicker();
					}
				}else if(keycode === 13 || keycode === 32){
					var controller													= this.controller;
					var current														= controller.config.picker.querySelector(".current");
					if(current !== null){
						if(controller.config.multiple){
							current.click();
						}else{
							if(keycode === 13){
								this.controller.setData(current.getAttribute("optionValue"));
								this.controller.hidePicker();
							}
						}
					}
				}else if(keycode === 27){
					var controller													= this.controller;
					if(controller.config.open){
						controller.hidePicker();
					}
				}
			});
			this.selected_li														= [];
			this.origin																= "";
			if(config.multiple){
				element.origin														= [];
			}
			this.config																= config;
			this.element															= element;
			element.controller														= this;
			this._createControllerOthers();
			this.setRequired();
			this.setDisabled();
			this.setVisible();
			if(!xuic.__VALID.checkIsEmpty(this.element.value)){
				this.setData(this.element.value);
			}

			return this;
		}else{
			return element.controller;
		}
	};
	xuic.__COMBO_CONTROLLER.prototype	= {
		setData : function(data, doCallChange){
			if(typeof(data) !== "undefined" && Object.keys(this.config.optionData).length > 0){
				if(xuic.__VALID.checkIsEmpty(doCallChange)){
					doCallChange													= true;
				}
				if(data === null){data												= "";}
				var isChange														= false;
				var optionData														= this.config.optionData;
				var code															= null;
				var codeName														= null;
				var li																= null;
				var li_size															= null;
				var checkbox														= null;
				if(this.config.multiple){
					if(!xuic.__VALID.checkIsArray(data) && xuic.__VALID.checkIsString(data)){
						if(!xuic.__VALID.checkIsEmpty(data)){
							data													= [data];
						}else{
							data													= [];
						}
					}
					if(xuic.__VALID.checkIsArray(data)){
						code														= [];
						codeName													= [];
						for(var key in optionData){
							if(data.indexOf(key) >= 0){
								code.push(key);
								codeName.push(optionData[key].codeName);
							}
						}
					}
					if(code !== null && codeName !== null){
						li															= this.config.picker.querySelectorAll(".xui-combo-option"), li_size = li.length;
						if(code.length === 0){
							checkbox												= li[0].firstElementChild.firstElementChild;
							if(xuic.__VALID.checkIsElement(checkbox)){
								checkbox.checked									= false;
								this._checkMultiOptionData(checkbox);
							}
						}else{
							for(var i = 1; i < li_size; i++){
								checkbox											= li[i].firstElementChild.firstElementChild;
								checkbox.checked									= (code.indexOf(checkbox.value) >= 0);
								this._checkMultiOptionData(checkbox);
							}
						}
						if(code !== this.origin){
							isChange												= true;
						}
						this.origin													= code;
					}
				}else{
					if(optionData.hasOwnProperty(data)){
						code														= data;
						codeName													= optionData[data].codeName;
					}else if(data === ""){
						code														= this.config.options[0].code;
						codeName													= this.config.options[0].codeName;
					}
					li																= this.config.picker.querySelector("li[optionValue=\"" + code + "\"]");
					if(xuic.__VALID.checkIsElement(li)){
						if(this.selected_li.length > 0){
							if(this.selected_li[0] !== li){
								this.selected_li[0].classList.remove("selected");
								li.classList.add("selected");
								this.selected_li[0]									= li;
							}
						}else{
							li.classList.add("selected");
							this.selected_li[0]										= li;
						}
					}
					if(code !== null && codeName !== null){
						this.element.value											= codeName;
						if(this.origin !== code){
							isChange												= true;
						}
						this.origin													= code;
					}
				}
				if(isChange && !xuic.__VALID.checkIsEmpty(this.config.child) && !xuic.__VALID.checkIsEmpty(this.config.child.controller)){
					var childElement												= this.config.child;
					childElement.controller.clearOption([]);
					if(!xuic.__VALID.checkIsEmpty(this.origin) && this.config.optionData.hasOwnProperty(this.origin)){
						//22.03.15 KSH 콤보박스 중분류 로드시 최상위 코드정보를 접근하여 발생되는 문제(다른화면에 영향 ...)를 해결하기 위해 클론형태로 복사해서 처리하는 방식으로 변경 
						//childElement.controller.loadOption(this.config.optionData[this.origin].items); 기존코드

						var codeData								= [];
						xuic.__UTIL.copyObject(codeData, this.config.optionData[this.origin].items);
						childElement.controller.loadOption(codeData);
					}
				}
				if(doCallChange && isChange){
					var ce															= new Event("change");
					ce.data															= this.config.optionData[this.origin];
					this.element.dispatchEvent(ce);
				}
			}
		},
		getData : function(){
			return this.origin;
		},
		getTextData : function(value){
			var returnValue															= value;
			if(xuic.__VALID.checkIsEmpty(value)){
				value																= this.getData();
			}
			if(this.config.optionData.hasOwnProperty(value)){
				returnValue															= this.config.optionData[value].codeName;
			}
			return returnValue;
		},
		setDisabled : function(disabled){
			if(xuic.__VALID.checkIsEmpty(disabled)){
				disabled															= this.element.disabled;
			}
			if(disabled){
				this.element.parentNode.classList.add("xui-disabled");
			}else{
				this.element.parentNode.classList.remove("xui-disabled");
			}
			this.element.disabled													= disabled;
			this.config.disabled													= disabled;
		},
		setVisible : function(visible){
			if(xuic.__VALID.checkIsEmpty(visible)){
				if(this.element.classList.contains("xui-invisible") || this.element.style.getPropertyValue("display") === "none"){
					visible															= false;
				}else{
					visible															= true;
				}
				this.element.classList.remove("xui-invisible");
				this.element.style.setProperty("display", "");
			}
			if(!visible){
				this.element.parentNode.classList.add("xui-invisible");
			}else{
				this.element.parentNode.classList.remove("xui-invisible");
			}
			this.config.visible														= visible;
		},
		setRequired : function(required){
			if(xuic.__VALID.checkIsEmpty(required)){
				required															= this.element.classList.contains("required");
			}
			if(required){
				this.element.classList.add("required");
				this.element.parentNode.classList.add("required");
			}else{
				this.element.parentNode.classList.remove("required");
				this.element.classList.remove("required");
			}
			this.config.required													= required;
		},
		isEnable : function(){
			return !(this.config.disabled);
		},
		isVisible : function(){
			return this.config.visible;
		},
		showPicker : function(){
			var picker																= this.config.picker;
			if(!xuic.__VALID.checkIsEmpty(picker) && this.isEnable()){
				xuic.__COM.closeActiveDirective();
				picker.style.minWidth												= this.element.offsetWidth + "px";
				this.element.parentNode.classList.add("on");
				document.body.appendChild(picker);
				picker.classList.add("on");

                // TODO:PB 공통 xui-combo-theme 커스텀 테스트
                // trigger에 [data-xui-combo-theme] 값이 있을 경우, target class 값에 추가
                var triggerTheme = this.element.dataset.xuiComboTheme;
                if ( triggerTheme ) picker.classList.add( triggerTheme );

				this.config.open													= true;
				var pos																= xuic.__UTIL.getAbsolutePosition(picker, this.element, "bottom");
				var downRemain														= null;
				var upRemain														= null;
				var elementHeight													= null;
				if(pos != null){
					var rect														= this.element.getBoundingClientRect();
					var docRect														= document.body.getBoundingClientRect();
					var p_top														= parseInt(pos.top.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), ""), 10);
					elementHeight													= parseInt(rect.height.toFixed());
					downRemain														= docRect.height - (rect.top + elementHeight);
					upRemain														= docRect.height - downRemain - elementHeight;
					if(downRemain < picker.offsetHeight + 50 || upRemain < picker.offsetHeight + 50){
						picker.style.maxHeight										= (downRemain > upRemain ? downRemain - 50 : upRemain - 50) + "px"; 
					}
					pos																= xuic.__UTIL.getAbsolutePosition(picker, this.element, "bottom");
					//위로 콤보박스 펼쳐질 때 겹치지 않게 높이 조정
					if(downRemain > upRemain){
						picker.style.top											= pos.top;
					} else {
						picker.style.top											= parseInt(xuic.__UTIL.getNumberOnly(pos.top)) - 4 + "px";
					}
					
					picker.style.left												= pos.left;
				}
				xuic.__ACTIVE_PICKER_ELEMENT										= this.element;
			}
		},
		hidePicker : function(){
			var picker																= this.config.picker;
			if(!xuic.__VALID.checkIsEmpty(picker) && this.config.open){
				this.element.parentNode.classList.remove("on");
				picker.classList.remove("on");

                // TODO:PB 공통 xui-combo-theme 커스텀 테스트
                // trigger에 [data-xui-combo-theme] 값이 있을 경우, target class 값에 추가
                var triggerTheme = this.element.dataset.xuiComboTheme;
                if ( triggerTheme ) picker.classList.remove( triggerTheme );

				this.config.open													= false;
				xuic.__ACTIVE_PICKER_ELEMENT										= null;
				if(this.config.filter){
					var li															= this.config.picker.getElementsByTagName("li");
					for(var i = 0; i < li.length; i++){
						li[i].classList.remove("xui-invisible");
					}
				}
				var current															= this.config.picker.querySelector(".current");
				if(xuic.__VALID.checkIsElement(current)){
					current.classList.remove("current");
				}
				this.config.picker													= picker.parentNode.removeChild(picker);
				if(this.config.multiple){
					this.setData(this.config.checkedList);
				}else if(this.config.filter){
					this.setData(this.getData());
				}
			}
		},
		showAutoCompletion : function(){
			var autoInputContainer													= this.config.autoInputContainer;
			if(!xuic.__VALID.checkIsEmpty(autoInputContainer) && this.isEnable()){
				xuic.__COM.closeActiveDirective();
				autoInputContainer.style.minWidth									= this.config.autoInput.offsetWidth + "px";
				document.body.appendChild(autoInputContainer);
				autoInputContainer.classList.add("on");
				this.config.openAutoCompletion										= true;
				var pos																= xuic.__UTIL.getAbsolutePosition(autoInputContainer, this.config.autoInput, "bottom");
				if(pos != null){
					var rect														= this.config.autoInput.getBoundingClientRect();
					var docRect														= document.body.getBoundingClientRect();
					var p_top														= parseInt(pos.top.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), ""), 10);
					/*down*/
					if(rect.top + parseInt(rect.height.toFixed()) <= p_top){
						autoInputContainer.style.maxHeight							= (docRect.height - p_top - 50) + "px";
					/*up*/
					}else{
						autoInputContainer.style.maxHeight							= (docRect.height - (docRect.height - rect.top + 50)) + "px";
					}
					pos																= xuic.__UTIL.getAbsolutePosition(autoInputContainer, this.config.autoInput, "bottom");
					autoInputContainer.style.top									= pos.top;
					autoInputContainer.style.left									= pos.left;
				}
				xuic.__ACTIVE_PICKER_ELEMENT										= this.element;
			}
		},
		hideAutoCompletion : function(){
			var autoInputContainer													= this.config.autoInputContainer;
			if(!xuic.__VALID.checkIsEmpty(autoInputContainer) && this.config.openAutoCompletion){
				autoInputContainer.classList.remove("on");
				this.config.openAutoCompletion										= false;
				xuic.__ACTIVE_PICKER_ELEMENT										= null;
				this.config.autoInputContainer										= autoInputContainer.parentNode.removeChild(autoInputContainer);
			}
		},
		loadOption : function(optionData){
			var options																= [];
			if(!xuic.__VALID.checkIsEmpty(optionData) && optionData.length > 0){
				options																= optionData;
			}
			this.config.optionData													= {};
			var multiple															= this.config.multiple;
			var div, ul, li, label, input, span, classes;
			if(this.config.picker !== null){
				ul																	= this.config.picker.firstChild;
				ul.innerHTML														= "";
			}else{
				div																	= document.createElement("div");
				if(this.config.multiple){
					div.className													= "xui-combo-container multiple";
				}else{
					div.className													= "xui-combo-container";
				}
				ul																	= document.createElement("ul");
				div.appendChild(ul);
				this.config.picker													= div;
			}
			this.config.picker.linkelement											= this.element;
			if(xuic.__VALID.checkIsArray(options)){
				if(!this.config.multiple && this.config.headValue !== null && this.config.headText !== null && (options.length === 0 || options[0].code !== this.config.headValue)){
					options.unshift({code:this.config.headValue,codeName:this.config.headText});
				}
				if(this.config.multiple && (options.length === 0 || options[0].code !== "*")){
					options.unshift({code:"*",codeName:xuic.__i18n.getLabel("selectAll")});
				}
				this.config.options													= options;
				for(var i = 0; i < options.length; i++){
					classes															= xuic.__VALID.checkIsEmpty(options[i].classes) ? "" : options[i].classes;
					options[i].codeName												= xuic.__UTIL._recursiveXSS(options[i].codeName, false); 
					this.config.optionData[options[i].code]							= options[i];
					li																= document.createElement("li");
					li.setAttribute("optionValue", options[i].code);
					li.className													= "xui-combo-option " + classes;
					if(multiple){
						label														= document.createElement("label");
						label.className												= "xui-checkbox-label";
						input														= document.createElement("input");
						input.type													= "checkbox";
						input.id													= options[i].code;
						input.setAttribute("xui-tooltip-title", options[i].codeName);
						input.value													= options[i].code;
						input.onclick												= function(e){
							e.cancelBubble											= true;
							this.parentNode.parentNode.parentNode.parentNode.linkelement.controller._checkMultiOptionData(this);
						};
						span														= document.createElement("span");
						span.appendChild(document.createTextNode(options[i].codeName));
						label.appendChild(input);
						label.appendChild(span);
						li.appendChild(label);
						li.onclick													= function(e){
							e.preventDefault();
							var checkbox											= this.firstElementChild.firstElementChild;
							checkbox.checked										= !checkbox.checked;
							if(checkbox.value !== "*" || this.nextElementSibling != null){
								this.parentNode.parentNode.linkelement.controller._checkMultiOptionData(checkbox);
							}
						};
					}else{
						li.className												= "xui-combo-option";
						span														= document.createElement("span");
						span.appendChild(document.createTextNode(options[i].codeName));
						li.appendChild(span);
						li.onclick													= function(e){
							var controller											= this.parentNode.parentNode.linkelement.controller;
							controller.setData(this.getAttribute("optionValue"));
							controller.hidePicker();
						};
					}
					ul.appendChild(li);
				}
			}
			document.body.appendChild(this.config.picker);
			if(this.config.multiple){
				this.origin															= [];
				this.element.value													= "";
			}else{
				if(xuic.__VALID.checkIsArray(options)){
					if(options.length > 0){
						this.origin													= options[0].code;
						this.setData(this.origin);
					}else{
						this.origin													= "";
						this.element.value											= "";
					}
				}else{
					this.origin														= "";
					this.element.value												= "";
				}
				if(!xuic.__VALID.checkIsEmpty(this.config.child) && !xuic.__VALID.checkIsEmpty(this.config.child.controller)){
					var childElement												= this.config.child;
					childElement.controller.clearOption([]);
					if(!xuic.__VALID.checkIsEmpty(this.origin) && this.config.optionData.hasOwnProperty(this.origin)){
						//22.03.16 KSH 콤보박스 중분류 로드시 최상위 코드정보를 접근하여 발생되는 문제(다른화면에 영향 ...)를 해결하기 위해 클론형태로 복사해서 처리하는 방식으로 변경 
						//childElement.controller.loadOption(this.config.optionData[this.origin].items); 기존코드
						var codeData								= [];
						xuic.__UTIL.copyObject(codeData, this.config.optionData[this.origin].items);
						childElement.controller.loadOption(codeData);
					}
				}
			}
			this.config.picker														= this.config.picker.parentNode.removeChild(this.config.picker);
			this._createAutoCompletion();
		},
		clearOption : function(){
			this.loadOption();
			if(!xuic.__VALID.checkIsEmpty(this.config.child)){
				var childElement													= this.config.child;
				while(!xuic.__VALID.checkIsEmpty(childElement)){
					childElement.controller.loadOption();
					childElement													= childElement.controller.config.child;
				}
			}
		},
		filterCombo : function(evt){
			var keycode																= (evt.which) ? evt.which : evt.keyCode;
			if(keycode !== 38 && keycode !== 40 && keycode !== 13 && keycode !== 27){
				if(!this.config.open){
					this.showPicker();
				}
				var li																= this.config.picker.getElementsByTagName("li");
				var current															= this.config.picker.querySelector("li.current");
				var value															= this.element.value.trim();
				if(current !== null){
					current.classList.remove("current");
				}
				if(value === ""){
					for(var i = 0; i < li.length; i++){
						li[i].classList.remove("xui-invisible");
					}
				}else{
					var code;
					for(var i = 0; i < li.length; i++){
						code														= li[i].getAttribute("optionValue");
						if(!xuic.__VALID.checkIsEmpty(code)){
							if(this.config.optionData[code].codeName.indexOf(value) >= 0 || this.config.optionData[code].code.indexOf(value) >= 0){
								li[i].classList.remove("xui-invisible");
							}else{
								li[i].classList.add("xui-invisible");
							}
						}else{
							li[i].classList.add("xui-invisible");
						}
					}
				}
			}
		},
		checkValid : function(invalidClear, showMessage){
			var isValid																= true;
			var value																= this.getData();
			if(this.config.required && xuic.__VALID.checkIsEmpty(value)){
				isValid																= false;
				if(showMessage){
					xuic.__COM.showMessageTip(this.element, xuic.__ENUM.EMPTY_DATA_FILL.getName(), "E", 5000);
				}
			}
			return isValid;
		},
		setItemClass : function(code, classes){
			if(!xuic.__VALID.checkIsEmpty(classes)){
				var li																= this.config.picker.getElementsByTagName("li");
				for(var i = 0; i < li.length; i++){
					if(li[i].classList.getAttribute("optionValue") === code){
						li[i].classList.add(classes);
						break;
					}
				}
			}
		},
		_checkMultiOptionData : function(checkbox){
			var optionData															= this.config.optionData;
			var li																	= this.config.picker.firstElementChild.getElementsByTagName("li"), size = li.length;
			var value																= checkbox.value, checked = checkbox.checked;
			var dataList															= [], checkInput;
			this.config.checkedList													= [];
			for(var i = 1; i < size; i++){
				checkInput															= li[i].firstElementChild.firstElementChild;
				if(value === "*"){
					checkInput.checked												= checked;
				}
				if(checkInput.checked){
					dataList.push(checkInput.value);
					this.config.checkedList.push(checkInput.value);
					checkInput.parentNode.classList.add("checked");
				}else{
					checkInput.parentNode.classList.remove("checked");
				}
			}
			checkInput																= li[0].firstElementChild.firstElementChild;
			checkInput.checked														= (dataList.length === size-1);
			if(checkInput.checked){
				checkInput.parentNode.classList.add("checked");
			}else{
				checkInput.parentNode.classList.remove("checked");
			}
			if(dataList.length === 1){
				this.element.value													= optionData[dataList[0]].codeName;
			}else if(dataList.length > 1){
				this.element.value													= optionData[dataList[0]].codeName + " and " + (dataList.length-1) + " Others";
			}else{
				this.element.value													= "";
			}
		},
		_getChildElement : function(element){
			var childElement														= null;
			var childId																= element.getAttribute("child");
			if(!xuic.__VALID.checkIsEmpty(childId)){
				var form															= element.form;
				if(xuic.__VALID.checkIsEmpty(form)){
					form															= document.body;
				}
				childElement														= form.querySelector("#" + childId);
				if(childElement === this.element){
					childElement													= null;
				}
			}
			return childElement;
		},
		_getAutoCompletionElement : function(element){
			var autoCompletionElement												= null;
			var elementId															= element.getAttribute("autoInput");
			if(!xuic.__VALID.checkIsEmpty(elementId)){
				var form															= element.form;
				if(xuic.__VALID.checkIsEmpty(form)){
					form															= document.body;
				}
				autoCompletionElement												= form.querySelector("#" + elementId);
			}
			return autoCompletionElement;
		},
		_createControllerOthers : function(){
			if(!xuic.__VALID.checkIsEmpty(this.config.child) && xuic.__VALID.checkIsEmpty(this.element.parent)){
				var childElement													= this.config.child;
				var controller														= null;
				var parent															= this.element;
				while(!xuic.__VALID.checkIsEmpty(childElement)){
					childElement.parent												= parent;
					controller														= new xuic.__COMBO_CONTROLLER(childElement);
					controller.config.parent										= parent;
					parent															= childElement;
					childElement													= this._getChildElement(childElement);
				}
			}
		},
		_createAutoCompletion : function(){
			if(xuic.__VALID.checkIsElement(this.config.autoInput)){
				var div, ul, li, label, input, span;
				if(!xuic.__VALID.checkIsEmpty(this.config.autoInputContainer)){
					ul																= this.config.autoInputContainer.firstChild;
					ul.innerHTML													= "";
				}else{
					div																= document.createElement("div");
					div.className													= "xui-autocompletion-container";
					ul																= document.createElement("ul");
					div.appendChild(ul);
					this.config.autoInputContainer									= div;
				}
				this.config.autoInputContainer.linkelement							= this.element;
				var codeData														= [];
				var treeData														= [];
				for(var code in this.config.optionData){
					if(!xuic.__VALID.checkIsEmpty(code)){
						codeData.push(this.config.optionData[code]);
					}
				}
				if(codeData.length === 0){
					codeData														= null;
				}
				if(!xuic.__VALID.checkIsEmpty(codeData)){
					var newCodeData													= [];
					var serialize													= function(accumulator, value){
						accumulator.push(value);
						if(value.hasOwnProperty("items")){
							for(var j = 0; j < value.items.length; j++){
								serialize(accumulator, value.items[j]);
							}
						}
					}
					for(var i = 0; i < codeData.length; i++){
						serialize(newCodeData, codeData[i]);
					}
					var treeData													= new dhx.TreeCollection();
					treeData._root													= codeData[0].parent;
					treeData.parse(newCodeData);
					var fullCode													= "";
					var fullCodeName												= "";
					treeData.forEach(function(item){
						fullCode													= item.code;
						fullCodeName												= item.codeName;
						treeData.eachParent(item.id, function(parentItem){
							fullCode												= parentItem.code		+ "," + fullCode;
							fullCodeName											= parentItem.codeName	+ ">" + fullCodeName;
						});
						treeData.update(item.id, {"fullCode":fullCode,"fullCodeName":fullCodeName});
					});
					codeData														= treeData.getItems(treeData.getRoot());
					for(var i = 0; i < codeData.length; i++){
						this.config.optionData[codeData[i].code]					= codeData[i];
					}
					this.config.treeData											= treeData;
				}
				var _this															= this;
				this.config.autoInput.addEventListener("keydown", function(e){
					if(!xuic.__VALID.checkIsEmpty(_this.autoInputTimeout)){
						clearTimeout(_this.autoInputTimeout);
					}
					_this.autoInputTimeout											= setTimeout(function(){
						var inputValue												= e.target.controller.getData();
						var docFrag													= document.createDocumentFragment();
						var _li														= null;
						var _a														= null;
						var doShow													= false;
						if(!xuic.__VALID.checkIsEmpty(inputValue)){
							/*
							_this.config.treeData.forEach(function(item, idx, array){
								if(item.fullCodeName.indexOf(inputValue) >= 0 || item.fullCode.indexOf(inputValue) >= 0){
									doShow											= true;
									_li												= document.createElement("li");
									_li.fullCode									= item.fullCode;
									_a												= document.createElement("a");
									_a.href											= "#";
									_a.appendChild(document.createTextNode(item.fullCodeName));
									_li.appendChild(_a);
									_li.addEventListener("click", function(e){
										var codeList								= this.fullCode.split(",");
										var root									= this.parentNode.parentNode.linkelement;
										var child									= this.parentNode.parentNode.linkelement;
										for(var i = 0; i < codeList.length; i++){
											if(!xuic.__VALID.checkIsEmpty(child)){
												child.controller.setData(codeList[i]);
												child								= child.controller.config.child;
											}
										}
										root.controller.config.autoInput.controller.setData(this.textContent);
										root.controller.hideAutoCompletion();
									});
									docFrag.appendChild(_li);
								}
							});
							*/
							
							// 중복 발생으로 인해 로직변경 by 전주원 2021.03.17
							var findSentence = [];
							_this.config.treeData.forEach(function(item, idx, array){
								if(item.fullCodeName.indexOf(inputValue) >= 0 || item.fullCode.indexOf(inputValue) >= 0){
									findSentence.push({
										fullCode		: item.fullCode,
										fullCodeName	: item.fullCodeName
									});
								}
							});
							if ( findSentence.length > 0 ) {
								// 중복제거
								var uniqueSentence = [];
								findSentence.map(item => {
									if(uniqueSentence.find(object => {
										if(object.fullCode === item.fullCode) {
											return true;
										} else {
											return false;
										}
									})){
									} else {
										uniqueSentence.push(item);
									}
								});
								for ( var x=0; x < uniqueSentence.length; x++ ) {
									var item										= uniqueSentence[x];
									doShow											= true;
									_li												= document.createElement("li");
									_li.fullCode									= item.fullCode;
									_a												= document.createElement("a");
									_a.href											= "#";
									_a.appendChild(document.createTextNode(item.fullCodeName));
									_li.appendChild(_a);
									_li.addEventListener("click", function(e){
										var codeList								= this.fullCode.split(",");
										var root									= this.parentNode.parentNode.linkelement;
										var child									= this.parentNode.parentNode.linkelement;
										
										for(var i = 0; i < codeList.length; i++){
											if(!xuic.__VALID.checkIsEmpty(child)){
												child.controller.setData(codeList[i]);
												child								= child.controller.config.child;
											}
										}
										root.controller.config.autoInput.controller.setData(this.textContent);
										root.controller.hideAutoCompletion();
									});
									docFrag.appendChild(_li);
								}
							}
							
						}
						_this.config.autoInputContainer.firstChild.innerHTML		= "";
						_this.config.autoInputContainer.firstChild.appendChild(docFrag);
						if(doShow){
							_this.showAutoCompletion();
						}else{
							_this.hideAutoCompletion();
						}
						clearTimeout(_this.autoInputTimeout);
						_this.autoInputTimeout										= null;
					}, 200);
				});
			}
		},
		_getController : function(){
			return this;
		}
	};
	xuic.__CHECKBOX_CONTROLLER	= function(element){
		if(xuic.__VALID.checkIsEmpty(element.controller)){
			var classList															= element.classList;
			var config																= {};
			config.id																= element.id;
			config.disabled															= false;
			config.visible															= true;
			config.title															= element.getAttribute("xui-tooltip-title");
			config.onValue															= element.getAttribute("on");
			config.offValue															= element.getAttribute("off");
			if(xuic.__VALID.checkIsEmpty(config.onValue)){
				config.onValue														= element.value;
			}
			if(xuic.__VALID.checkIsEmpty(config.offValue)){
				config.offValue														= "";
			}
			config.required															= classList.contains("required");
			if(xuic.__VALID.checkIsEmpty(config.title)){
				config.title														= element.getAttribute("title");
				if(xuic.__VALID.checkIsEmpty(config.title)){
					config.title													= element.id;
				}
			}
			element.addEventListener("focus", function(e){
				xuic.__COM.closeActiveDirective();
			});
			element.addEventListener("click", function(e){
				var controller														= this.controller;
				controller.origin													= (this.checked ? controller.config.onValue : controller.config.offValue);
				if(!this.checked){
					this.parentNode.classList.remove("checked");
				}else{
					this.parentNode.classList.add("checked");
				}
			});
			this.origin																= "";
			this.config																= config;
			this.element															= element;
			element.controller														= this;
			this.setRequired();
			this.setDisabled();
			this.setVisible();
			this.setData(element.checked ? config.onValue : config.offValue, false);

			return this;
		}else{
			return element.controller;
		}
	};
	xuic.__CHECKBOX_CONTROLLER.prototype	= {
		setData : function(data, doCallChange){
			if(typeof(data) !== "undefined"){
				if(xuic.__VALID.checkIsEmpty(doCallChange)){
					doCallChange													= true;
				}
				var isChange														= false;
				if(data === null){data												= "";}
				if(data === this.config.onValue || data === true || data === "1"){
					this.element.checked											= true;
					this.element.parentNode.classList.add("checked");
					if(this.config.onValue !== this.origin){
						isChange													= true;
					}
					this.origin														= this.config.onValue;
				}else if(data === this.config.offValue || data === false || data === "" || data === "0"){
					this.element.checked											= false;
					this.element.parentNode.classList.remove("checked");
					if(this.config.offValue !== this.origin){
						isChange													= true;
					}
					this.origin														= this.config.offValue;
				}
				if(this.element.checked){
					this.element.parentNode.classList.add("checked");
				}else{
					this.element.parentNode.classList.remove("checked");
				}
				if(doCallChange && isChange){
					var ce															= new Event("change");
					this.element.dispatchEvent(ce);
				}
			}
		},
		getData : function(){
			return this.origin;
		},
		getTextData : function(){
			return (this.element.checked ? this.config.title : "");
		},
		setDisabled : function(disabled){
			if(xuic.__VALID.checkIsEmpty(disabled)){
				disabled															= this.element.disabled;
			}
			if(disabled){
				this.element.parentNode.classList.add("xui-disabled");
			}else{
				this.element.parentNode.classList.remove("xui-disabled");
			}
			this.element.disabled													= disabled;
			this.config.disabled													= disabled;
		},
		setVisible : function(visible){
			if(xuic.__VALID.checkIsEmpty(visible)){
				if(this.element.classList.contains("xui-invisible") || this.element.style.getPropertyValue("display") === "none"){
					visible															= false;
				}else{
					visible															= true;
				}
				this.element.classList.remove("xui-invisible");
				this.element.style.setProperty("display", "");
			}
			if(!visible){
				this.element.parentNode.classList.add("xui-invisible");
			}else{
				this.element.parentNode.classList.remove("xui-invisible");
			}
			this.config.visible														= visible;
		},
		setRequired : function(required){
			if(xuic.__VALID.checkIsEmpty(required)){
				required															= this.element.classList.contains("required");
			}
			if(required){
				this.element.classList.add("required");
				this.element.parentNode.classList.add("required");
			}else{
				this.element.parentNode.classList.remove("required");
				this.element.classList.remove("required");
			}
			this.config.required													= required;
		},
		isEnable : function(){
			return !(this.config.disabled);
		},
		isChecked : function(){
			return this.element.checked;
		},
		isVisible : function(){
			return this.config.visible;
		},
		checkValid : function(invalidClear, showMessage){
			var isValid																= true;
			var value																= this.getData();
			if(this.config.required && xuic.__VALID.checkIsEmpty(value)){
				isValid																= false;
				if(showMessage){
					xuic.__COM.showMessageTip(this.element, xuic.__ENUM.EMPTY_DATA_FILL.getName(), "E", 5000);
				}
			}
			return isValid;
		},
		_getController : function(){
			return this;
		}
	};
	xuic.__RADIO_CONTROLLER	= function(element){
		if(xuic.__VALID.checkIsEmpty(element.controller)){
			var classList															= element.classList;
			var config																= {};
			config.id																= element.name;
			config.disabled															= false;
			config.visible															= true;
			config.title															= element.getAttribute("xui-tooltip-title");
			config.required															= classList.contains("required");
			if(xuic.__VALID.checkIsEmpty(config.title)){
				config.title														= element.getAttribute("title");
				if(xuic.__VALID.checkIsEmpty(config.title)){
					config.title													= element.id;
				}
			}
			element.onfocus = function(e){
				xuic.__COM.closeActiveDirective();
			};
			var clickFunction														= element.onclick;
			element.onclick = function(e){
				var controller														= this.controller;
				controller.setData(this.value, false);
			};
			if(typeof(clickFunction) === "function"){
				element.addEventListener("click", clickFunction);
			}
			this.origin																= "";
			this.config																= config;
			this.element															= element;
			element.controller														= this;
			if(!element.creation){
				this._createControllerOthers();
			}
			return this;
		}else{
			return element.controller;
		}
	};
	xuic.__RADIO_CONTROLLER.prototype	= {
		setData : function(data, doCallChange){
			if(typeof(data) !== "undefined"){
				if(xuic.__VALID.checkIsEmpty(doCallChange)){
					doCallChange													= true;
				}
				var isChange														= false;
				if(data === null){data												= "";}
				var form															= this.element.form;
				if(xuic.__VALID.checkIsEmpty(form)){
					form															= this.element.parentNode.parentNode;
				}
				var radioGroup														= form.querySelectorAll("input[name=" + this.element.name + "]");
				var value															= "";
				var check															= false;
				if(!xuic.__VALID.checkIsEmpty(radioGroup) && radioGroup.length > 0){
					if(!xuic.__VALID.checkIsEmpty(data)){
						if(this.origin !== data){
							isChange												= true;
						}
						for(var i = 0; i < radioGroup.length; i++){
							if(radioGroup[i].value === data){
								value												= radioGroup[i].value;
								break;
							}
						}
						for(var i = 0; i < radioGroup.length; i++){
							check													= (radioGroup[i].value === value);
							radioGroup[i].checked									= check;
							radioGroup[i].controller.origin							= value;
							if(check){
								radioGroup[i].parentNode.classList.add("checked");
							}else{
								radioGroup[i].parentNode.classList.remove("checked");
							}
						}
					}else if(data === "" || data === "0" || data === false){
						if(this.origin !== ""){
							isChange												= true;
						}
						for(var i = 0; i < radioGroup.length; i++){
							radioGroup[i].checked									= false;
							radioGroup[i].controller.origin							= "";
						}
					}
					if(doCallChange && isChange){
						var ce														= new Event("change");
						this.element.dispatchEvent(ce);
					}
				}
			}
		},
		getData : function(){
			return this.origin;
		},
		getTextData : function(){
			var returnValue															= "";
			var form																= this.element.form;
			if(xuic.__VALID.checkIsEmpty(form)){
				form																= this.element.parentNode.parentNode;
			}
			var radioGroup															= form.querySelectorAll("input[name=" + this.element.name + "]");
			for(var i = 0; i < radioGroup.length; i++){
				if(radioGroup[i].checked){
					returnValue														= radioGroup[i].controller.title;
					break;
				}
			}
			return returnValue;
		},
		setDisabled : function(disabled){
			if(xuic.__VALID.checkIsEmpty(disabled)){
				disabled															= this.element.disabled;
			}
			var elementList															= this.element.parentNode.parentNode.querySelectorAll("input[name='" + this.element.name + "']");
			for(var i = 0; i < elementList.length; i++){
				if(disabled){
					elementList[i].parentNode.classList.add("xui-disabled");
				}else{
					elementList[i].parentNode.classList.remove("xui-disabled");
				}
				elementList[i].disabled												= disabled;
				if(!xuic.__VALID.checkIsEmpty(elementList[i].controller)){
					elementList[i].controller.config.disabled						= disabled;
				}
			}
		},
		setVisible : function(visible){
			if(xuic.__VALID.checkIsEmpty(visible)){
				if(this.element.classList.contains("xui-invisible") || this.element.style.getPropertyValue("display") === "none"){
					visible															= false;
				}else{
					visible															= true;
				}
				this.element.classList.remove("xui-invisible");
				this.element.style.setProperty("display", "");
			}
			var elementList															= this.element.parentNode.parentNode.querySelector("input[name=" + this.element.name + "]");
			for(var i = 0; i < elementList.length; i++){
				if(!visible){
					elementList[i].parentNode.classList.add("xui-invisible");
				}else{
					elementList[i].parentNode.classList.remove("xui-invisible");
				}
				if(!xuic.__VALID.checkIsEmpty(elementList[i].controller)){
					elementList[i].controller.config.visible						= visible;
				}
			}
		},
		setRequired : function(required){
			if(xuic.__VALID.checkIsEmpty(required)){
				required															= this.element.classList.contains("required");
			}
			if(required){
				this.element.classList.add("required");
				this.element.parentNode.classList.add("required");
			}else{
				this.element.parentNode.classList.remove("required");
				this.element.classList.remove("required");
			}
			this.config.required													= required;
		},
		isEnable : function(){
			return !(this.config.disabled);
		},
		isVisible : function(){
			return this.config.visible;
		},
		checkValid : function(invalidClear, showMessage){
			var isValid																= true;
			var value																= this.getData();
			if(this.config.required && xuic.__VALID.checkIsEmpty(value)){
				isValid																= false;
				if(showMessage){
					xuic.__COM.showMessageTip(this._getFirstElement(), xuic.__ENUM.EMPTY_DATA_FILL.getName(), "E", 5000);
				}
			}
			return isValid;
		},
		_createControllerOthers : function(){
			var form																= this.element.form;
			if(xuic.__VALID.checkIsEmpty(form)){
				form																= this.element.parentNode.parentNode;
			}
			var radioGroup															= form.querySelectorAll("input[name=" + this.element.name + "]");
			var classList															= null;
			var config																= {};
			var checkedElement														= null;
			for(var i = 0; i < radioGroup.length; i++){
				if(radioGroup[i] !== this.element && !radioGroup[i].creation){
					radioGroup[i].creation											= true;
					new xuic.__RADIO_CONTROLLER(radioGroup[i]);
				}
				checkedElement														= radioGroup[i].checked ? radioGroup[i] : checkedElement;
			}
			if(!this.element.creation){
				this.setRequired();
				this.setDisabled();
				this.setVisible();
				this.setData(xuic.__VALID.checkIsEmpty(checkedElement) ? "" : checkedElement.value, false);
				this.element.creation												= true;
			}
		},
		_getFirstElement : function(){
			var firstElement														= this.element;
			var form																= this.element.form;
			if(xuic.__VALID.checkIsEmpty(form)){
				form																= this.element.parentNode.parentNode;
			}
			var radioGroup															= form.querySelectorAll("input[name=" + this.element.name + "]");
			if(radioGroup.length > 0){
				firstElement														= radioGroup[0];
			}
			return firstElement;
		},
		_getController : function(){
			return this;
		}
	};
	xuic.__TOGGLE_CONTROLLER	= function(element){
		if(xuic.__VALID.checkIsEmpty(element.controller)){
			var classList															= element.classList;
			var config																= {};
			config.id																= element.id;
			config.disabled															= false;
			config.visible															= true;
			config.title															= element.getAttribute("xui-tooltip-title");
			config.onValue															= element.getAttribute("on");
			config.offValue															= element.getAttribute("off");
			if(xuic.__VALID.checkIsEmpty(config.onValue)){
				config.onValue														= element.value;
			}
			if(xuic.__VALID.checkIsEmpty(config.offValue)){
				config.offValue														= "";
			}
			config.required															= classList.contains("required");
			if(xuic.__VALID.checkIsEmpty(config.title)){
				config.title														= element.getAttribute("title");
				if(xuic.__VALID.checkIsEmpty(config.title)){
					config.title													= element.id;
				}
			}
			element.addEventListener("focus", function(e){
				xuic.__COM.closeActiveDirective();
			});
			element.addEventListener("click", function(e){
				var controller														= this.controller;
				controller.origin													= (this.checked ? controller.config.onValue : controller.config.offValue);
				if(!this.checked){
					this.parentNode.classList.remove("checked");
				}else{
					this.parentNode.classList.add("checked");
				}
			});
			this.origin																= config.offValue;
			this.config																= config;
			this.element															= element;
			element.controller														= this;
			this.setRequired();
			this.setDisabled();
			this.setVisible();
			this.setData(element.checked ? config.onValue : config.offValue, false);

			return this;
		}else{
			return element.controller;
		}
	};
	xuic.__TOGGLE_CONTROLLER.prototype	= {
		setData : function(data, doCallChange){
			if(typeof(data) !== "undefined"){
				if(xuic.__VALID.checkIsEmpty(doCallChange)){
					doCallChange													= true;
				}
				if(data === null){data												= "";}
				var isChange														= false;
				if(data == this.config.onValue || data === true || data === "1"){
					this.element.checked											= true;
					if(this.config.onValue !== this.origin){
						isChange													= true;
					}
					this.origin														= this.config.onValue;
				}else if(data === this.config.offValue || data === false || data === "" || data === "0"){
					this.element.checked											= false;
					if(this.config.offValue !== this.origin){
						isChange													= true;
					}
					this.origin														= this.config.offValue;
				}
				if(this.element.checked){
					this.element.parentNode.classList.add("checked");
				}else{
					this.element.parentNode.classList.remove("checked");
				}
				if(doCallChange && isChange){
					var ce															= new Event("change");
					this.element.dispatchEvent(ce);
				}
			}
		},
		getData : function(){
			return this.origin;
		},
		getTextData : function(){
			return (this.element.checked ? this.config.title : "");
		},
		setDisabled : function(disabled){
			if(xuic.__VALID.checkIsEmpty(disabled)){
				disabled															= this.element.disabled;
			}
			if(disabled){
				this.element.classList.add("xui-disabled");
			}else{
				this.element.classList.remove("xui-disabled");
			}
			this.element.disabled													= disabled;
			this.config.disabled													= disabled;
		},
		setVisible : function(visible){
			if(xuic.__VALID.checkIsEmpty(visible)){
				if(this.element.classList.contains("xui-invisible") || this.element.style.getPropertyValue("display") === "none"){
					visible															= false;
				}else{
					visible															= true;
				}
				this.element.classList.remove("xui-invisible");
				this.element.style.setProperty("display", "");
			}
			if(!visible){
				this.element.parentNode.classList.add("xui-invisible");
			}else{
				this.element.parentNode.classList.remove("xui-invisible");
			}
			this.config.visible														= visible;
		},
		setRequired : function(required){
			if(xuic.__VALID.checkIsEmpty(required)){
				required															= this.element.classList.contains("required");
			}
			if(required){
				this.element.classList.add("required");
				this.element.parentNode.classList.add("required");
			}else{
				this.element.parentNode.classList.remove("required");
				this.element.classList.remove("required");
			}
			this.config.required													= required;
		},
		isEnable : function(){
			return !(this.config.disabled);
		},
		isChecked : function(){
			return this.element.checked;
		},
		isVisible : function(){
			return this.config.visible;
		},
		checkValid : function(invalidClear, showMessage){
			var isValid																= true;
			return isValid;
		},
		_getController : function(){
			return this;
		}
	};
	xuic.__BUTTON_CONTROLLER	= function(element){
		if(xuic.__VALID.checkIsEmpty(element.controller)){
			var objClassList														= element.classList;
			var config																= {};
			config.id																= element.id;
			config.disabled															= false;
			config.visible															= true;
			config.authType															= element.getAttribute("authType");
			this.origin																= "";
			this.config																= config;
			this.element															= element;
			element.controller														= this;
			this.setDisabled();
			this.setVisible();

			return this;
		}else{
			return element.controller;
		}
	};
	xuic.__BUTTON_CONTROLLER.prototype	= {
		setData : function(data){
			if(typeof(data) !== "undefined"){

			}
		},
		getData : function(){
			return this.origin;
		},
		clickButton : function(){

		},
		setDisabled : function(disabled){
			if(xuic.__VALID.checkIsEmpty(disabled)){
				disabled															= this.element.disabled;
			}
			if(disabled){
				this.element.classList.add("xui-disabled");
			}else{
				this.element.classList.remove("xui-disabled");
			}
			this.element.disabled													= disabled;
			this.config.disabled													= disabled;
		},
		setVisible : function(visible){
			if(xuic.__VALID.checkIsEmpty(visible)){
				if(this.element.classList.contains("xui-invisible") || this.element.style.getPropertyValue("display") === "none"){
					visible															= false;
				}else{
					visible															= true;
				}
				this.element.classList.remove("xui-invisible");
				this.element.style.setProperty("display", "");
			}
			if(!visible){
				this.element.classList.add("xui-invisible");
			}else{
				this.element.classList.remove("xui-invisible");
			}
			this.config.visible														= visible;
		},
		isEnable : function(){
			return !(this.config.disabled);
		},
		isVisibled : function(){
			return this.config.visible;
		},
		checkAuth : function(fnAuth){
			var isValid																= true;
			if(!xuic.__VALID.checkIsEmpty(this.config.authType)){
				var authType														= this.config.authType;
				switch(authType){
					case xuic.__ENUM.AUTH_TYPE_SAVE.getCode()		:
						isValid														= !(fnAuth[xuic.__ENUM.AUTH_TYPE_SAVE.getCode()] || fnAuth[xuic.__ENUM.AUTH_TYPE_CREATE.getCode()] || fnAuth[xuic.__ENUM.AUTH_TYPE_UPDATE.getCode()]);
						break;
					case xuic.__ENUM.AUTH_TYPE_CREATE.getCode()	:
						isValid														= (!fnAuth[xuic.__ENUM.AUTH_TYPE_SAVE.getCode()] && !fnAuth[xuic.__ENUM.AUTH_TYPE_CREATE.getCode()]);
						break;
					case xuic.__ENUM.AUTH_TYPE_UPDATE.getCode()	:
						isValid														= (!fnAuth[xuic.__ENUM.AUTH_TYPE_SAVE.getCode()] && !fnAuth[xuic.__ENUM.AUTH_TYPE_UPDATE.getCode()]);
						break;
					default		:
						isValid														= !(fnAuth[authType]);
						break;
				}
			}
			if(!isValid){
				this.element.classList.add("allowed");
			}else{
				this.element.parentNode.removeChild(this.element);
			}
			return !(isValid);
		},
		checkValid : function(invalidClear, showMessage){
			var isValid																= true;
			return isValid;
		},
		_getController : function(){
			return this;
		}
	};
	xuic.__TEXTAREA_CONTROLLER	= function(element){
		if(xuic.__VALID.checkIsEmpty(element.controller)){
			var classList															= element.classList;
			var config																= {};
			config.id																= element.id;
			config.disabled															= false;
			config.visible															= true;
			config.required															= classList.contains("required");
			config.title															= element.getAttribute("xui-tooltip-title");
			config.isSet															= false;
			config.maxlength														= element.getAttribute("maxlength");
			if(xuic.__VALID.checkIsEmpty(config.title)){
				config.title														= element.getAttribute("title");
				if(xuic.__VALID.checkIsEmpty(config.title)){
					config.title													= element.id;
				}
			}
			if(!xuic.__VALID.checkIsEmpty(config.maxlength)){
				config.maxlength													= parseInt(config.maxlength);
			}
			element.addEventListener("keyup", function(e){
				var controller														= this.controller;
				controller.config.isSet												= false;
			});
			this.origin																= "";
			this.config																= config;
			this.element															= element;
			element.controller														= this;
			if(!xuic.__VALID.checkIsEmpty(element.getAttribute("value"))){
				this.setData(element.getAttribute("value"), false);
			}
			this.setRequired();
			this.setDisabled();
			this.setVisible();
			if(!xuic.__VALID.checkIsEmpty(this.element.value)){
				this.setData(this.element.value);
			}
			
			return this;
		}else{
			return element.controller;
		}
	};
	xuic.__TEXTAREA_CONTROLLER.prototype	= {
		setData : function(data, doCallChange, allowHtml){
			if(typeof(data) !== "undefined"){
				if(data === null){data												= "";}
				data																= data.toString().trim();
				if(xuic.__COM.checkIsXSSRestoreTarget(this.element.tagName)){
					data															= xuic.__UTIL._recursiveXSS(data, false);
				}
				if(xuic.__VALID.checkIsEmpty(doCallChange)){
					doCallChange													= true;
				}
				var isChange														= false;
				this.element.value													= data;
				if(this.origin !== this.value){
					isChange														= true;
				}
				this.origin															= data;
				if(doCallChange && isChange){
					var ce															= new Event("change");
					this.element.dispatchEvent(ce);
				}
				this.config.isSet													= true;
			}
		},
		getData : function(onlyText){
			return (xuic.__VALID.checkIsEmpty(this.origin) ? this.element.value : (this.config.isSet ? this.origin : this.element.value));
		},
		getByte : function(){
			var bytes																= 0;
			var data																= this.getData();
			if(!xuic.__VALID.checkIsEmpty(data)){
				var len																= data.length;
				for(var i = 0; i < len; i++){
					if(escape(data.charAt(i)).length > 4){
						bytes														= (bytes + 2);
					}else{
						bytes++;
					}
				}
			}
			return bytes;
		},
		setDisabled : function(disabled){
			if(xuic.__VALID.checkIsEmpty(disabled)){
				disabled															= this.element.readOnly;
			}
			if(disabled){
				this.element.parentNode.classList.add("xui-disabled");
			}else{
				this.element.parentNode.classList.remove("xui-disabled");
			}
			this.element.readOnly													= disabled;
			this.config.disabled													= disabled;
		},
		setVisible : function(visible){
			if(xuic.__VALID.checkIsEmpty(visible)){
				if(this.element.classList.contains("xui-invisible") || this.element.style.getPropertyValue("display") === "none"){
					visible															= false;
				}else{
					visible															= true;
				}
				this.element.classList.remove("xui-invisible");
				this.element.style.setProperty("display", "");
			}
			if(!visible){
				this.element.parentNode.classList.add("xui-invisible");
			}else{
				this.element.parentNode.classList.remove("xui-invisible");
			}
			this.config.visible														= visible;
		},
		setRequired : function(required){
			if(xuic.__VALID.checkIsEmpty(required)){
				required															= this.element.classList.contains("required");
			}
			if(required){
				this.element.classList.add("required");
				this.element.parentNode.classList.add("required");
			}else{
				this.element.parentNode.classList.remove("required");
				this.element.classList.remove("required");
			}
			this.config.required													= required;
		},
		isEnable : function(){
			return !(this.config.disabled);
		},
		isVisible : function(){
			return this.config.visible;
		},
		checkValid : function(invalidClear, showMessage){
			var isValid																= true;
			var strValue															= this.element.value.trim();
			var strInvalidMessage													= "";
			if(!xuic.__VALID.checkIsEmpty(strValue)){
				var bytes															= this.getByte();
				if(this.config.maxlength > 0 && bytes > this.config.maxlength){
					isValid															= false;
					if(!xuic.__VALID.checkIsEmpty(this.config.title)){
						strInvalidMessage											= this.config.title + "의 길이가 초과되었습니다. [최대(" + this.config.maxlength + "),입력값(" + bytes + ")]";
					}
				}
				if(!isValid){
					if(invalidClear){
						strValue													= "";
					}
					if(showMessage && strInvalidMessage !== ""){
						xuic.__COM.showMessageTip(this.element, strInvalidMessage, "E", 5000);
					}
				}
			}else if(this.config.required){
				isValid																= false;
				if(showMessage){
					xuic.__COM.showMessageTip(this.element, xuic.__ENUM.EMPTY_DATA_FILL.getName(), "E", 5000);
				}
			}
			return isValid;
		},
		_getController : function(){
			return this;
		}
	};
	xuic.__DEFAULT_CONTROLLER	= function(element){
		if(xuic.__VALID.checkIsEmpty(element.controller)){
			var classList															= element.classList;
			var config																= {};
			config.id																= element.id;
			config.visible															= true;
			config.title															= element.getAttribute("xui-tooltip-title");
			config.format															= xuic.__DOM.getElementFormatName(element);	/**/
			config.search															= classList.contains("search");				/**/
			config.filter															= classList.contains("filter");				/**/
			config.refresh															= classList.contains("refresh");			/**/
			config.controlSecond													= classList.contains("second");				/**/
			config.currency															= classList.contains("currency");			/**/
			config.masking															= classList.contains("masking");			/**/
			config.required															= classList.contains("required");			/**/
			config.maxlength														= element.getAttribute("maxlength");		/**/
			var link																= element.getAttribute("link");
			config.double															= !xuic.__VALID.checkIsEmpty(link);			/**/
			if(xuic.__VALID.checkIsEmpty(config.title)){
				config.title														= element.getAttribute("title");
				if(xuic.__VALID.checkIsEmpty(config.title)){
					config.title													= element.id;
				}
			}
			if(!xuic.__VALID.checkIsEmpty(config.format)){
				config.maxlength													= xuic.__DOM.getElementFormatMaxLength(element, config.format);
				if(config.maxlength > 0){
					element.setAttribute("maxlength", config.maxlength);
				}
				switch(config.format){
					case "NUMBER"	:
						element.style.setProperty("text-align", "right");
						break;
					case "DECIMAL"	:
						element.style.setProperty("text-align", "right");
						break;
					case "FILESIZE"	:
						element.style.setProperty("text-align", "right");
						break;
					default	:
						break;
				}
			}else if(!xuic.__VALID.checkIsEmpty(config.maxlength)){
				config.maxlength													= parseInt(config.maxlength);
			}
			element.addEventListener("click", function(e){
				e.cancelBubble														= true;
				var controller														= this.controller;
				if(controller.config.search || controller.config.filter || controller.config.refresh){
					var rect														= e.target.getBoundingClientRect();
					var x															= (e.target.offsetWidth - (e.clientX - rect.left));
					var y															= e.clientY - rect.top;
					if(x >= 10 && x <= 22 && y >= 6 && y <= 19 && !controller.config.disabled){
						e.target.fromIcon											= true;
					}else{
						e.target.fromIcon											= false;
					}
				}
			});
			this.origin																= "";
			this.config																= config;
			this.element															= element;
			this.element.value														= this.element.textContent;
			element.controller														= this;
			this.setRequired();
			this.setVisible();

			return this;
		}else{
			return element.controller;
		}
	};
	xuic.__DEFAULT_CONTROLLER.prototype	= {
		setData : function(data, doCallChange, checkValid){
			if(typeof(data) !== "undefined"){
				if(xuic.__VALID.checkIsEmpty(doCallChange)){
					doCallChange													= true;
				}
				if(xuic.__VALID.checkIsEmpty(checkValid)){
					checkValid														= false;
				}
				var isChange														= false;
				if(data === null){data												= "";}
				data																= data.toString().trim();
				if(xuic.__COM.checkIsXSSRestoreTarget(this.element.tagName)){
					data															= xuic.__UTIL._recursiveXSS(data, false);
				}
				var strFormatValue													= data;
				var strUnformatValue												= data;
				this.element.value													= strFormatValue;
				if(!xuic.__VALID.checkIsEmpty(data)){
					if(!xuic.__VALID.checkIsEmpty(this.config.format)){
						if((this.config.format === "BIZ" || this.config.format === "JURI" || this.config.format === "IHID" || this.config.format === "PHONE" || this.config.format === "CARD" || this.config.format === "EMAIL" || this.config.format === "IP" || this.config.format === "CAR") && this.config.masking){
							strUnformatValue										= strUnformatValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
							strFormatValue											= xuic.__FORMAT[this.config.format.toLowerCase()].getMaskingData(strUnformatValue, (checkValid ? "" : data));
						}else{
							if(this.config.format === "TIME"){
								strUnformatValue									= xuic.__UTIL.rpad(strUnformatValue	, (this.config.controlSecond ? 6 : 4)	, "0");
								strFormatValue										= xuic.__UTIL.rpad(strFormatValue	, (this.config.controlSecond ? 6 : 4)	, "0");
							}
							if(this.config.format === "DECIMAL" || this.config.format === "NUMBER"){
								strFormatValue										= xuic.__FORMAT[this.config.format.toLowerCase()].getData(data, data, this.config.currency, xuic.__DOM.getElementDecimalRoundSize(this.element));
								if(!xuic.__VALID.checkIsEmpty(strFormatValue)){
									strUnformatValue								= strFormatValue.replace(/[,]/g, "");
								}
							}else if(this.config.format === "DATETIME" || this.config.format === "TIME"){
								strFormatValue										= xuic.__FORMAT[this.config.format.toLowerCase()].getData(data, (checkValid ? "" : data), this.config.controlSecond);
							}else{
								strFormatValue										= xuic.__FORMAT[this.config.format.toLowerCase()].getData(data, data);
							}
							if(this.config.format !== "CAR" && this.config.format !== "EMAIL" && this.config.format !== "NUMBER" && this.config.format !== "DECIMAL" && this.config.format !== "IP"){
								strUnformatValue									= strFormatValue.replace(xuic.__REGEXP.getCmmnRegexp("EXCEPT_NUMBER"), "");
							}
						}
					}
				}
				this.element.value													= strFormatValue;
				this.element.textContent											= strFormatValue;
				this.element.setAttribute("xui-tooltip-title", strFormatValue);
				if(this.origin !== strUnformatValue){
					isChange														= true;
				}
				this.origin															= strUnformatValue;
				if(doCallChange && isChange){
					var ce															= new Event("change");
					this.element.dispatchEvent(ce);
				}
			}
		},
		getData : function(format){
			var returnData															= this.element.value;
			if(!xuic.__VALID.checkIsEmpty(this.config.format)){
				if(!format){
					returnData														= xuic.__FORMAT[this.config.format.toLowerCase()].getUnformatData(returnData, returnData);
				}else{
					returnData														= xuic.__FORMAT[this.config.format.toLowerCase()].getData(returnData, returnData);
				}
			}
			return returnData;
		},
		setRequired : function(required){
			if(xuic.__VALID.checkIsEmpty(required)){
				required															= this.element.classList.contains("required");
			}
			if(required){
				this.element.classList.add("required");
			}else{
				this.element.classList.remove("required");
			}
			this.config.required													= required;
		},
		setDisabled : function(disabled){
		},
		setVisible : function(visible){
			if(xuic.__VALID.checkIsEmpty(visible)){
				if(this.element.classList.contains("xui-invisible") || this.element.style.getPropertyValue("display") === "none"){
					visible															= false;
				}else{
					visible															= true;
				}
				this.element.style.setProperty("display", "");
			}
			if(!visible){
				this.element.classList.add("xui-invisible");
			}else{
				this.element.classList.remove("xui-invisible");
			}
			this.config.visible														= visible;
		},
		isEnable : function(){
			return true;
		},
		isVisible : function(){
			return this.config.visible;
		},
		checkValid : function(invalidClear, showMessage){
			var isValid																= true;
			var strValue															= this.element.value.toString().trim();
			var strInvalidMessage													= "";
			if(!xuic.__VALID.checkIsEmpty(strValue)){
				var strLeftValue													= null, strRightValue = null, strFormatName = null, strFnName = null, objValidFn = null, objExtraArg01 = null, objExtraArg02 = null;
				if(isValid && !this.config.masking || strValue.indexOf("*") < 0){
					if(!xuic.__VALID.checkIsEmpty(this.config.format)){
						strFormatName												= (this.config.format.substr(0,1).toUpperCase() + this.config.format.substr(1).toLowerCase());
						objValidFn													= xuic.__VALID["checkIs" + strFormatName];
						switch(strFormatName){
							case "Number"	:
								objExtraArg01										= this.config.currency;
								break;
							case "Decimal"	:
								objExtraArg01										= this.config.currency;
								objExtraArg02										= xuic.__DOM.getElementDecimalRoundSize(this.element);
								break;
							default			:
								break;
						}
						if(typeof(objValidFn) === "function"){
							if(!objValidFn.call(xuic.__VALID, strValue, objExtraArg01, objExtraArg02)){
								isValid												= false;
								strInvalidMessage									= xuic.__ENUM.WRONG_DATA_FORMAT.getName();
							}
						}
					}
					if(isValid && this.config.maxlength > 0 && strValue.length > this.config.maxlength){
						isValid														= false;
						if(!xuic.__VALID.checkIsEmpty(this.config.title)){
							strInvalidMessage										= this.config.title + "의 길이가 초과되었습니다. [최대(" + this.config.maxlength + "),입력값(" + strValue.length + ")]";
						}
					}
				}
				if(!isValid){
					if(invalidClear){
						this.setData("", false, false);
					}
					if(showMessage && strInvalidMessage !== ""){
						xuic.__COM.showMessageTip(this.element, strInvalidMessage, "E", 5000);
					}
				}
			}else if(this.config.required){
				isValid																= false;
				if(showMessage){
					xuic.__COM.showMessageTip(this.element, xuic.__ENUM.EMPTY_DATA_FILL.getName(), "E", 5000);
				}
			}
			return isValid;
		},
		_getController : function(){
			return this;
		}
	};
	xuic.__VSCROLL_CONTROLLER	= function(config, element){
		if(xuic.__VALID.checkIsEmpty(element.vsController)){
			this.element															= xuic.__DOM.getElement(element);
			if(xuic.__VALID.checkIsElement(this.element)){
				this.virtualContainer												= document.createElement("div");
				this.virtualContainer.className										= "xui-virtual-container";
				this.element.appendChild(this.virtualContainer);
				config.baseId														= this.element.id;
				config.renderHtml													= xuic.__VALID.checkIsEmpty(config.renderHtml)			?	""		:	config.renderHtml;
				config.onBeforeRendering											= xuic.__VALID.checkIsEmpty(config.onBeforeRendering)	?	null	:	(typeof(config.onBeforeRendering) === "function" ? config.onBeforeRendering : null);
				config.margin														= xuic.__VALID.checkIsEmpty(config.margin)				?	0		:	config.margin;
				config.containerHeight												= this.element.offsetHeight;
				config.dataList														= [];
				this.config															= config;
				this.status															= {};
				this.status.DOM_ELEMENT_START_POSITION								= [];
				this.status.DOM_ELEMENT_DATA										= [];
				this.element.vsController											= this;
				
				this.element.addEventListener("scroll", xuic.__UTIL.throttle((function(e){
					this.vsController._renderingVirtualItem();
				}), 100));
				
				return this;
			}
		}else{
			return element.vsController;
		}
	};
	xuic.__VSCROLL_CONTROLLER.prototype	= {
		clear : function(){
			
		},
		load : function(data){
			if(xuic.__VALID.checkIsArray(data) && data.length > 0){
				this.config.dataList				= data;
			}
		},	
		add : function(item){
			if(xuic.__VALID.checkIsElement(item) || xuic.__VALID.checkIsJson(item)){
				item								= [item];
			}
			if(xuic.__VALID.checkIsArray(item) && item.length > 0){
				var stopFlag						= false;
				var wrapper							= null;
				var docFrag							= document.createDocumentFragment();
				var innerHtml						= "";
				var size							= data.length;
				var json							= null;
				var renderHtml						= "";
				var s_pos							= 0;
				var e_pos							= 0;
				var container						= null;
				var plusHeight						= 0;
				var returnHtml						= "";
				for(var i = 0; i < size; i++){
					if(!stopFlag){
						if(xuic.__VALID.checkIsString(item[i])){
							wrapper					= document.createElement("div");
							wrapper.innerHTML		= item[i];
							while(wrapper.children.length > 0){
								docFrag.appendChild(wrapper.firstElementChild);
							}
						}else if(xuic.__VALID.checkIsElement(item[i])){
							docFrag.appendChild(item[i]);
						}else if(xuic.__VALID.checkIsJson(item[i])){
							if(typeof(this.config.onBeforeRendering) === "function"){
								returnHtml			= this.config.onBeforeRendering.call(this, item[i]);
								if(!xuic.__VALID.checkIsEmpty(returnHtml)){
									wrapper				= document.createElement("div");
									wrapper.innerHTML	= returnHtml;
									while(wrapper.children.length > 0){
										docFrag.appendChild(wrapper.firstElementChild);
									}
								}
							}else if(!xuic.__VAILD.checkIsEmpty(this.config.renderHtml)){
								wrapper				= document.createElement("div");
								wrapper.innerHTML	= this._parse(item[i]);
								while(wrapper.children.length > 0){
									docFrag.appendChild(wrapper.firstElementChild);
								}
							}
						}
						while(docFrag.children.length > 0){
							container				= docFrag.firstElementChild; 
							container.setAttribute("elementIndex", this.status.DOM_ELEMENT_START_POSITION.length);
							this.virtualContainer.appendChild(container);
							s_pos					= 0;
							e_pos					= 0;
							if(this.status.DOM_ELEMENT_DATA.length > 0){
								s_pos				= this.status.DOM_ELEMENT_DATA[this.status.DOM_ELEMENT_DATA.length-1].e_pos + this.config.margin;
								e_pos				= s_pos + container.offsetHeight;
							}else{
								s_pos				= 0;
								e_pos				= container.offsetHeight;
							}
							this.status.DOM_ELEMENT_DATA.push({"element":container,"s_pos":s_pos,"e_pos":e_pos});
							this.status.DOM_ELEMENT_START_POSITION.push(s_pos);
							plusHeight				+= e_pos;
						}
					}
				}
				this.virtualContainer.style.height	= plusHeight + "px";
				this.element.scrollTop				= this.element.scrollHeight;
				this._renderingVirtualItem();
				wrapper								= null;
				docFrag								= null;
				innerHtml							= null;
				size								= null;
				json								= null;
				renderHtml							= null;
				s_pos								= null;
				e_pos								= null;
				container							= null;
				plusHeight							= null;
				returnHtml							= null;
			}
		},
		_afterAdded : function(){
			
		},
		_parse : function(data){
			var renderHtml	= this.config.renderHtml + "";
			for(var keyName in data){
				renderHtml	= renderHtml.split("$${" + keyName + "}").join(json[keyName]);
			}
			return renderHtml;
		},
		_renderingVirtualItem : function(){
			if(this.status.DOM_ELEMENT_START_POSITION.length > 0){
				var intScrollTop					= this.element.scrollTop;
				var intTotalHeight					= this.virtualContainer.offsetHeight;
				var intTotalCount					= this.status.DOM_ELEMENT_START_POSITION.length;
				var _from							= intScrollTop;
				var _to								= intScrollTop + this.config.containerHeight;
				if(_from < 0){
					_from							= 0;
				}
				if(_to > intTotalHeight){
					_to								= intTotalHeight;
				}
				var intTargetIdx					= xuic.__UTIL.binarySearch(this.status.DOM_ELEMENT_START_POSITION, null, false, _from, _to);
				if(intTargetIdx >= 0){
					var s_search					= intTargetIdx - 2;
					var e_search					= intTargetIdx + 2;
					var s_find						= -1;
					var e_find						= -1;
					if(s_search < 0){
						s_search					= 0;
					}
					if(e_search > intTotalCount){
						e_search					= intTotalCount;
					}
					for(var i = s_search; i < e_search; i++){
						if(i < intTotalCount){
							if(this.status.DOM_ELEMENT_DATA[i]["e_pos"] >= _from){
								s_find				= i-1;
								if(s_find < 0){s_find = 0;}
								break;
							}
						}
					}
					for(var j = e_search; j >= 0; j--){
						if(j < intTotalCount){
							if(this.status.DOM_ELEMENT_DATA[j]["s_pos"] <= _to){
								e_find				= j+1;
								if(e_find >= intTotalCount){e_find = intTotalCount-1;}
								break;
							}
						}
					}
					while(this.virtualContainer.firstChild != null){
						this.virtualContainer.removeChild(this.virtualContainer.firstChild);
					}
					for(var k = s_find; k <= e_find; k++){
						if(typeof(this.status.DOM_ELEMENT_DATA[k]) !== "undefined"){
							if(typeof(this.status.DOM_ELEMENT_DATA[k]["element"]) !== "undefined"){
								this.virtualContainer.appendChild(this.status.DOM_ELEMENT_DATA[k]["element"]);
							}
						}
					}
					if(intScrollTop > 0){
						var intTop					= this.status.DOM_ELEMENT_START_POSITION[s_find] - 10;
						if(intTop < 0){
							intTop					= 0;
						}
						this.talkVirtualBox.style.top = (intTop + "px");
					}
				}
			}
		},
		_renewVirtualStatus : function(element){
			var index								= parseInt(element.getAttribute("elementIndex"), 10);
			var elementData							= this.status.DOM_ELEMENT_DATA[index];
			var prevHeight							= elementData.e_pos - elementData.s_pos;
			var currHeight							= element.offsetHeight;
			var gap									= 0;
			//높이 변화가 일어났을 때.
			if(prevHeight != currHeight){
				gap									= currHeight - prevHeight;
				var size							= this.status.DOM_ELEMENT_START_POSITION.length;
				var _sPos							= -1;
				var _ePos							= -1;
				var objData							= null;
				var totalHeight;
				for(var i = index; i < size; i++){
					objData							= this.status.DOM_ELEMENT_DATA[i];
					_sPos							= objData["s_pos"];
					_ePos							= objData["e_pos"];
					if(i === index){
						objData["e_pos"]			= _ePos + gap;
					}else{
						objData["s_pos"]			= _sPos + gap;
						objData["e_pos"]			= _ePos + gap;
						this.status.DOM_ELEMENT_START_POSITION[i] = _sPos + gap;
					}
					if(i === size-1){
						totalHeight					= _ePos + gap;
					}
				}
				this.talkMainBox.style.height		= (totalHeight + "px");
			}
			this._renderingVirtualItem();
			if(gap > 0){
				this.talkMainContainer.scrollTop	= this.talkMainContainer.scrollTop + gap;
			}
		},
		_renderItem : function(){
			
		}
	};
}());