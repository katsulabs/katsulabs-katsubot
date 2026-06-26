/***************************************************************************************************************************************************************
* @classDescription 메인화면
* @author HyosungITX Corp.
* @version 1.0
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Modification Information
* Date              Developer           Content
* ----------        -------------       -------------------------
* 2019/01/19        xtrmAI팀             신규생성
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Copyright (C) 2018 by HyosungITX Corp. All rights reserved.
****************************************************************************************************************************************************************/

/***************************************************************************************************************************************************************
 * Global Variable : 스크립트 영역에서 모두 접근할 수 있는 전역변수를 해당 영역에 모두 정의한다.
 ***************************************************************************************************************************************************************/
"use strict";
var IMPORT					= "";
var gobjMenuList			= null;		//권한 보유한 모든 메뉴정보

var mstrSessionUserId		= "";
var mstrSessionUserName		= "";
var mstrAuthGroupName		= "";
var mstrOfficialPositionName= "";

var mobjWindow				= null;
var mobjSitemap				= null;
var mobjUL					= null;

var mobjTabbarController	= null;

var misUserLogout			= false;

/***************************************************************************************************************************************************************
 * Document Ready : jquery에서 제공하는 함수를 이용하여 화면이 로드될 때 처리할 함수를 정의한다.
 ***************************************************************************************************************************************************************/
/* Required, DO NOT REMOVE*/
function PageBeforeReady(){
	xui.com.setRequestPrefix();						//define server common resource default request prefix	default :
	xui.com.setLocale();							//define localization language set						default : 'kr'				support ["kr", "en"]
	xui.com.setDateDelimiter();						//define date format delimiter							default : '-'				support ["-", "/", "."]
	xui.com.setCalendarWeekStartDay();				//define week start day in calendar module				default : 'monday'			support ["monday", "sunday"]
	xui.com.setXSSRestoreTarget(["INPUT","TEXTAREA"]);	//define Whitelist Tagname of XSS Restore Target		default : []				ex) ["INPUT", "TEXTAREA"]
}
function PageReady(){
	main010.completePageRender();
};
function PageUnload(){
};
/**
 * 클래스 구조의 스크립트 구조체 오브젝트 명을 정의한다.
 * 스크립트를 클래스 기반의 구조체로 정의하기 위해 해당 JavaScript의 클래스명은 파일명으로 정의한다.
 * @classDescription :
 */
var main010={
/***************************************************************************************************************************************************************
 * completePageRender Function : 화면이 초기 로드 시점에 처리할 사항을 정의한다.
 ***************************************************************************************************************************************************************/
	completePageRender : function(){
		//페이지 상수 정의
		main010.setPageEnum();
		//탭 화면 디자인
		main010.defineTab();
		//툴바 화면 디자인
		main010.defineToolbar();
		//그리드 디자인
		main010.defineGrid();
		//트리뷰 디자인
		main010.defineTree();
		//다이얼로그 레이어 화면 디자인
		main010.defineDialog();
		//초기데이터설정
		main010.initPage();
		//이벤트 정의
		main010.defineEvent();
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ENUM: 열거형 class 상수 정의 [기본함수명:setPageEnum]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	setPageEnum : function(){
		main010.enum	= new Enumeration();
		main010.enum.setEnum("RE_LOGIN_NOT_FOUND_SESSION"	,""	,"main010.RE_LOGIN_NOT_FOUND_SESSION"                           ,"");
		main010.enum.setEnum("WELCOME_USER"					,""	,"main010.WELCOME_USER"                                         ,"");
		main010.enum.setEnum("LOGOUT_CONFIRM"				,""	,"main010.LOGOUT_CONFIRM"                                       ,"");
		main010.enum.setEnum("CLOSE_PAGE_LOGOUT"			,""	,"main010.CLOSE_PAGE_LOGOUT"                                       ,"");
		main010.enum.setEnum("CLOSE_PAGE"					,""	,"main010.CLOSE_PAGE"                                       ,"");
		main010.enum.setEnum("LOGOUT"						,""	,"main010.LOGOUT"                                               ,"");
	},

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// TAB: 탭버튼 구성을 위한 함수 정의 [기본함수명:defineTab + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineTab : function(){
		var tabbarController = $("#div_main").XuiTabbar({
			position	: "top",								//탭 바가 생성될 position (top or bottom) (optional) Default top
			customClass	: "xui-global-tabbar",
			height		: 40,
			onContentLoad : function(tabId, param, contentWindow){
				if (param != null) {
					contentWindow.contentsOpenIdentifier = param;
				}
			},
			onActive : function(tabId, prevTabId, param){
				if(xui.extends.menu.isOpen(prevTabId)){
					var prevContentWindow	= xui.extends.menu.getMenuContentWindow(prevTabId);
					if(!xui.valid.isEmpty(prevContentWindow) && typeof(prevContentWindow.PageLeave) === "function"){
						prevContentWindow.PageLeave.call("", param);
					}
				}
				var contentWindow			= xui.extends.menu.getMenuContentWindow(tabId);
				if(!xui.valid.isEmpty(contentWindow) && typeof(contentWindow.PageEnter) === "function"){
					if(param != null) {
						contentWindow.contentsOpenIdentifier = param;
					}
					contentWindow.PageEnter.call("", param);
				}
			},
			onBeforeClose : function(tabId){
			}
		});
		xui.extends.menu._loadMainTabbar(tabbarController);
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// TOOLBAR: 툴바 구성을 위한 함수 정의 [기본함수명:defineToolbar + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineToolbar:function(){
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GRID: 그리드 구성을 위한 함수 정의 [기본함수명:defineGrid + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineGrid : function(){

	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// TREE: 트리뷰 구성을 위한 함수 정의 [기본함수명:defineTree + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineTree : function(){
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DIALOG WINDOW: 레이어 팝업 창 구성을 위한 함수 정의  [기본함수명:defineDialog + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineDialog : function(){

	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// INIT PAGE: 초기데이터 로드를 위한 함수 정의 [기본함수명:initPage + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	initPage : function(){
		//달력의 주 시작일자를 일요일 or 월요일 세팅
		xui.com.setCalendarWeekStartDay("sunday");
		mobjWindow = $(window);
		mobjSitemap = $("#rootSiteMap").parent();
		mstrSessionUserId = xui.extends.session.getUserId();
		mstrSessionUserName	 = xui.extends.session.getUserName();
		mstrAuthGroupName = xui.extends.session.getAuthGroupName();
		mstrOfficialPositionName = xui.extends.session.getOfficialPositionName();

		//사용자정보 화면에 표시
		main010.setUserInfo();

        main010.setLangCombo();

		//main top tabbar controller
		mobjTabbarController = $("#div_main").api();
		var mainMenuKey = xui.extends.menu.getMainKey();

		//세션정보를 체크해서 없을 경우 로그인화면으로 이동시킨다.
		if(xui.valid.isEmpty(mstrSessionUserId)){
			//로그인 화면으로 이동시키는 부분을 에러페이지로 넘어가게 수정(SSO 연동)
			xui.com._redirectErrorPage("error", xui.message.get("main010.enum.CLOSE_PAGE"), "Session not found 111");
			/*xui.dialog.error(main010.enum.RE_LOGIN_NOT_FOUND_SESSION.getName(), "Session not found", function(){
				window.location.href = xui.com.getContextPath();
			});*/
		}else{
			//메뉴bar데이터load
			main010.loadMenuData(true);
			// 권한 정보에 등록된 mainMenu를 open 한다.
            //메뉴정보가 없을 경우 초기 메인화면으로 설정
            main010.openMenuByKey(mainMenuKey);
		}

	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEFINE EVENT: 화면에 디자인 된 버튼 및 오브젝트 이벤트와 호출할 함수 정의
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineEvent : function(){
	    $("#btnLogout").click(function(e) { main010.logout(true); });																//로그아웃
        $("#logo").click(function(e) { main010.openWindow("LOGO"); });																//메인화면새로고침

        $("#btnSurvey").click(function(e) { main010.openWindow("SURVEY"); });												   		//Survey
        $("#btnVocChatbot").click(function(e) { main010.openWindow("AI_CHAT"); });												   	//AI Chat

        $("#btnDictionary").click(function(e) { main010.openWindow("DICTIONARY"); });												//용어사전
        $("#userInfoArea").click(function(e) { main010.openWindow("MY_INFO"); });													//마이페이지

        $("#languageCode").change(function(){main010.changeLocale($(this).valExt())})
	},

/***************************************************************************************************************************************************************
 * Main Functions: 화면상에 주요 기능을 처리하는 함수를 정의한다.
 ***************************************************************************************************************************************************************/
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// NEW FORM: 신규 데이터 처리에 대한 함수 정의 [기본함수명:newForm + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SELECT: 조회 데이터 처리에 대한 함수 정의 [기본함수명:selectData + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SAVE: 데이터 저장 처리에 대한 함수 정의 [기본함수명:saveData + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DELETE: 삭제 데이터 처리에 대한 함수 정의 [기본함수명:deleteData + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// PRINT: 출력 및 레포트 데이터 처리에 대한 함수 정의 [기본함수명:printData + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
/***************************************************************************************************************************************************************
 * User Functions: 별도 화면 처리를 위해 필요한 함수를 정의한다.
 ***************************************************************************************************************************************************************/
	/**
	 * 화면에 사용자의 기본정보를 표시한다.
	 * @param 없음
	 * @returns 없음
	 */
	setUserInfo : function(){
		$("#sessionUserId").valExt(mstrSessionUserId);
        $("#companyCode").valExt(xui.extends.session.getCompanyCode());
        $("#userInfo").text(mstrSessionUserName + "(" + mstrAuthGroupName + ") " + mstrOfficialPositionName);
        $("#authGroup").valExt(xui.extends.session.getAuthGroup());
	},

	/**
	 * 사이트맵과 사이드 메뉴를 화면에 표시한다.
	 * @param {boolean} isInit 초기표시여부로 true일 경우 이벤트 정의를 포함한다.
	 * @returns 없음
	 */
	loadMenuData : function(isInit){
//		var menuList					= xui.extends.menu.getAllMenu();
		var menuList					= '';
		if(menuList.length > 0){
			var menuTreeData			= xui.util.getTreeData(menuList, "*****", "menuKey", "upperMenuKey");
			//메인메뉴 로드
            main010.loadMainMenu(menuTreeData);
			//사이트맵 메뉴 로드
			main010.loadSitemap(menuTreeData);
			if(xui.valid.isEmpty(isInit)){
				isInit	= false;
			}
			if(isInit){
                $(".xui-global-tabbar").XuiContext({
                    contents			: [
                        {
                            id			: "closeMenu",
                            icon		: "xfi xfi-ico_0013_close_bold",
                            text		: xui.message.get("xui.CLOSE"),
                            authType	: xui.enum.AUTH_TYPE_NONE.getCode(),
                            onClick		: function(element){
                                var menuKey	= xui.util.replace(element.id, "tab-content-", "");
                                $("#div_main").api().close(menuKey);
                            }
                        },
                        {
                            id			: "closeAllMenu",
                            icon		: "xfi xfi-ico_0042_delete",
                            text		: xui.message.get("xui.CLOSE_ALL"),
                            authType	: xui.enum.AUTH_TYPE_NONE.getCode(),
                            onClick		: function(element){
                                $("#div_main").api().closeAll();
                                main010.openWindow("LOGO");
                            }
                        }
                    ],
                    onBeforeShow		: function(element, event){
                        var doShow		= true, tabId = element.id;
                        if(xui.valid.isEmpty(tabId)){
                            doShow		= false;
                        }
                        return doShow;
                    }
                });
			}
		}
	},

	/**
	 * 메인메뉴를 로드한다.
	 * @param {object} treeData 1레벨 메뉴 목록
	 * @retrun 없음
	 */
	loadMainMenu : function(treeData){
		var mainMenu = "";
	    // 20241207 JJH 메뉴 화면표출여부 컬럼이 Y인 경우에만 화면에 보이도록 변경
		treeData.forEach(menuItem => { if(menuItem["screenVisibleAt"] === "Y") {mainMenu += "<li><span>" + menuItem.menuName + "</span></li>"} });
		$("#mainMenu").html(mainMenu);

		var gnbExpandedFlag = false;

		//이벤트 삽입
		$(".gnb ul > li").click(function(e){
		    e.preventDefault();
			$(".gnb ul > li.on").removeClass("on");
			$(this).parent().addClass("on");
			$(".gnb-list-wrap").addClass("on");

			if ( gnbExpandedFlag === false ) {
			    $(".gnb-list-wrap .gnb-list-layer .depth").css("height", $("#rootSiteMap").height() + "px");
			    gnbExpandedFlag = true;
            }

			//사이트맵 활성화
			$(".gnb-list-layer div.depth.on").removeClass("on");

            var menuText = $(this).text();
                var menuTextList = $(".gnb-list-layer").find(".depth > .title");
                for(var i=0;i<menuTextList.length;i++){
                    if($(menuTextList[i]).text() == menuText){
                        $(menuTextList[i].parentNode).addClass("on");
                    }
                }
            });
	    },

	loadSitemap : function(menuTreeData){
		var size = menuTreeData.length;
		var siteMap = '';
		for(var i=0; i<size; i++){
			var menuItems = xui.util.restoreXSS(menuTreeData[i]);
			// 화면표출여부가 N인경우 메뉴에 보이기 않게 설정한다.
			if(menuItems["screenVisibleAt"]==="N") continue;
			var menuName = menuItems["menuName"];
			siteMap += '<div class="depth">' +
					   '	<div class="title">' + menuName + '</div>' +
					   '		<div class="depth1">' +
					   '			<div class="group">' +
					   					main010.getSitemapDept01(menuItems) +
					   '			</div>' +
					   '		</div>' +
					   '	</div>' +
					   '</div>';
		}
		$("#rootSiteMap").html(siteMap);
        // $("#rootSiteMap").css("height","600px");
		// $(".gnb-list-wrap .gnb-list-layer .depth").css("height", $("#rootSiteMap").height() + "px");
		mobjUL							= document.querySelectorAll("ul.level2");
	},

	openMenuByKey : function(menuKey, param, index){
	    //하나의 탭으로 재사용하기 위해 isSelf 옵션을 추가하고 true 설정함 2014-11-14 LYH
        xui.extends.menu.open(menuKey, param, index, true);
        // 메뉴 Layer 접기
        $(".gnb-list-wrap").removeClass("on");

//		if(!xui.valid.isEmpty(menuKey)){
//			if($("#div_main").api().isExist(menuKey)){
//				$("#div_main").api().active(menuKey);
//			}else{
//				//하나의 탭으로 재사용하기 위해 isSelf 옵션을 추가하고 true 설정함 2014-11-14 LYH
//				xui.extends.menu.open(menuKey, param, index, true);
//				// 메뉴 Layer 접기
//				$(".gnb-list-wrap").removeClass("on");
//			}
//		}
	},




	setChildMenuTitle : function(tabId, contentWindow){
		var doc							= contentWindow.document;
		var menuTitleElement			= doc.getElementById("xui-menu-title");
		console.log(menuTitleElement);
		if(!xui.valid.isEmpty(menuTitleElement)){
			var split					= (contentWindow.xui.extends.menu.getFullName(tabId)).split("&gt;");
			var icon					= contentWindow.xui.extends.menu.getIcon(tabId);
			var size					= split.length;
			if(xui.valid.isEmpty(icon)){
				icon					= "xfi xfi xfi-ico_0036_home";
			}
			if(size > 0){
				var titleHtml			= "<p>" + split[size-1] + "</p>";
				titleHtml				+= "<i class='" + icon + "'></i>";
				titleHtml				+= "<p>";
				for(var i = 0; i < size; i++){
					if(i < size-1){
						titleHtml		+= split[i];
						titleHtml		+= "<i class='xfi xfi-ico_0003_arrow_next_line_nor'></i>";
					}else{
						titleHtml		+= "<strong>" + split[i] + "</strong>";
					}
				}
				titleHtml				+= "</p>";
				$(menuTitleElement).prepend(titleHtml);
			}
		}
	},




	/**
	 * 로그아웃 처리
	 * @param {boolean} isConfirm  확인메시지 출력 후 로그아웃 처리할지 여부 false로 설정할 경우 메시지 없이 바로 로그아웃 처리
	 * @returns 없음
	 */
	logout : function(isConfirm){
		var param	= new xui.json();
		param.setURL("/xs/webbase/login/logout.json");
		param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());

		if(isConfirm){ // 로그아웃 버튼을 클릭하여 정상적으로 로그아웃을 시도할 떄
			misUserLogout = true;
			xui.dialog.confirm(main010.enum.LOGOUT_CONFIRM.getName(), main010.enum.LOGOUT.getName(), function(isConfirm){
				if(isConfirm){
					xui.ajax.callSync(param);
					//로그인 화면으로 이동시키는 부분을 에러페이지로 넘어가게 수정(SSO 연동)
					//window.location.href = xui.com.getContextPath();
					xui.com._redirectErrorPage("error",main010.enum.CLOSE_PAGE_LOGOUT.getName(), "LOGOUT");
				}
			});
		}else{
			param.setString("userId", $("#sessionUserId").valExt());
			xui.ajax.callSync(param);
		}
	},

	/**
	 * 탭 내부적으로 열린 에러페이지에서 확인버튼 클릭 시 호출되는 함수
	 */
	closeErrorPage : function(){
		$("#div_main").api().close($("#div_main").api().getActive());
	},


	snbFilter : function snbFilter(){
		 $('.snbToggle').on('click', function(){
			 if( $(".snb").is(':visible') ) {
				 $('.snbToggle').removeClass('xfi-ico_0122_fold_left');
				 $('.snbToggle').addClass('xfi-ico_0030_sitemap');
				 $(".snb").hide();
				 $(".gnb").width('100%');
			 }else{
				 $('.snbToggle').removeClass('xfi-ico_0030_sitemap');
				 $('.snbToggle').addClass('xfi-ico_0122_fold_left');
				 $(".snb").show();
				 $(".gnb").width('calc(100% - 60px)');
			 }
	     });
	},


	/**
	 * 사이트맵 레이어 표시를 토글 형태로 처리한다.
	 * @param 없음
	 * @returns 없음
	 */
	toggleSiteMap : function(){
		var sitemap	= $("#rootSiteMap").parent();
		if(sitemap.hasClass("on")){
			sitemap.removeClass("on");
			$(this).parent().removeClass("on");
			$(".gnb ul > li.on").removeClass("on");
		}else{
			sitemap.addClass("on");
			$(this).parent().addClass("on");
			main010.adjustSitemapFlexbox();
		}
	},
	adjustSitemapFlexbox : function(){
		if(mobjSitemap.hasClass("on")){
			var child					= null;
			var prev					= null;
			var wrapped					= false;
			mobjUL.forEach(function(ul, ulIdx, ulParent){
				ul.parentNode.classList.remove("wrapped");
				child					= ul.querySelectorAll("li.level2");
				child.forEach(function(li, liIdx, liParent){
					li.classList.remove("wrapped");
					prev				= li.previousElementSibling;
					if(prev !== null){
						if(!wrapped){
							if(prev.offsetTop > li.offsetTop){
								li.classList.add("wrapped");
								wrapped		= true;
							}
						}else{
							li.classList.add("wrapped");
						}
					}
				});
				if(wrapped){
					ul.parentNode.classList.add("wrapped");
				}
				wrapped					= false;
			});
		}
	},

	/**
	 * 사용자 상세정보 레이어 표시를 토글 형태로 처리한다.
	 * @param 없음
	 * @returns 없음
	 */
	toggleUserInfoLayer : function(){
		if($("#userIconHover").hasClass("xui-invisible")){
			$("#userIconHover").removeClass("xui-invisible");
		}else{
			$("#userIconHover").addClass("xui-invisible");
		}
	},

	// 회사 변경시 session info change
    switchSessionInfo : function(targetCompanyCode){
        if(xui.valid.isEmpty(targetCompanyCode)) return;
        var params	= new xui.json();
        params.setURL("/xs/core/api/sessionSwitch.json");
        params.setString("userId", xui.extends.session.getUserId());
        params.setString("companyCode",targetCompanyCode);
        params.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
        var response = xui.ajax.callSync(params);
        if(!response.getErrorFlag()){
            window.location.reload();
        }
    },

	getSitemapDept01 : function(menuItems){
		var siteSubMap = '';
		var count = 0;
		var size = menuItems["items"].length;
		if(size > 0){
			for(var i=0; i<size; i++){
				var menuItem = menuItems["items"][i];
			    // 화면표출여부가 N인경우 메뉴에 보이기 않게 설정한다.
			    if(menuItem["screenVisibleAt"]==="N") continue;

				var menuName = menuItem["menuName"];
				var menuKey = menuItem["menuKey"];

				if(menuItem["items"].length > 0){
//				    if(count % 2 === 0 )
				    if(count === 0 || count === 3 || count === 5 || count === 7 )
				        siteSubMap += '</div><div class="group">';

                    siteSubMap +=	'<div class="depth2">' +
                                    '	<div class="title">' + menuName + '</div>' +
                                        main010.getSitemapDept02(menuItem["items"]) +
                                    '</div>';
                    count++;

					//그룹으로 묶어서 횡으로 표시될 수 있도록 메뉴 건수를 계산한다.
//					count += menuItem["items"].length;
//					var baseCount = 8;
//
////					$("#rootSiteMap").css("height","630px");
//					if(count >= baseCount){siteSubMap += '</div><div class="group">';count = 0;}
//					siteSubMap +=	'<div class="depth2">' +
//					  			 	'	<div class="title">' + menuName + '</div>' +
//					   					main010.getSitemapDept02(menuItem["items"]) +
//					  				'</div>';

				} else {
					siteSubMap +=	'<div class="menu" onclick=javascript:main010.openMenuByKey("' + menuKey + '")>' +
						   			'	<span xui-tooltip-title="' + menuName + '">' + menuName + '</span>' +
						   			'</div>';
				}
			}
		}
		return siteSubMap;
	},

	getSitemapDept02 : function(menuItems){
		var siteSubMap = '';
		var size = menuItems.length;
		if(size > 0){
			for(var i=0; i<size; i++){
				var menuItem = menuItems[i];
				var menuName = menuItem["menuName"];
				var menuKey  = menuItem["menuKey"];
				siteSubMap +=	'<div class="menu")>' +
				                '<div style="width:100%" onclick=javascript:main010.openMenuByKey("' + menuKey + '")>' +
					   			'	<span xui-tooltip-title="' + menuName + '" >' + menuName + '</span>' +
					   			'</div>' +
					   			'</div>';
			}
		}
		return siteSubMap;
	},

	/**
	 * 메인화면에서 업무별 팝업 화면을 호출한다.
	 * @param {string} caseBiz 업무구분자 (LOGO:메인화면로그클릭,
										COMPANY_SWITCH:회사변경클릭)
	 * @param {string} param01 파라메터
	 * @param {string} param02 파라메터
	 * @param {string} param03 파라메터
	 * @retrun 없음
	 */
	openWindow: function(caseBiz, param01, param02, param03) {
		if (xui.valid.isEmpty(param01)) { param01 = ""; }
		if (xui.valid.isEmpty(param02)) { param02 = ""; }
		if (xui.valid.isEmpty(param03)) { param03 = ""; }

		switch (caseBiz) {
			case "LOGO":
			    xui.extends.menu.openMain(xui.extends.session.getMainPageUrl(), xui.extends.session.getErrorPageUrl());
				break;
			case "SURVEY":
			    window.open(location.protocol + "//" + location.host + "/webapps/xs/vob/survey/survey010.jsp?popupAt=Y&menuKey=2024122615022328314", "SURVEY");
			    break;
			case "AI_CHAT":
				window.open("/webapps/xs/aichat/main.jsp", "AI_CHAT");
			    break;
			case "AI_SEARCH":
			    main010.openMenuByKey("2024122019365550130", param01, param02, param03);
			    break;
		    case "DICTIONARY":
                main010.openMenuByKey("2024110710522097794");
		        break;
		    case "MY_INFO":
                main010.openMenuByKey("2024110620523893058");
		        break;
		    case "MY_REG_VOC":
                main010.openMenuByKey("2024110620524300519");
		        break;
		    case "MY_INTER_VOC":
                main010.openMenuByKey("2024110620525005278");
		        break;
		    case "MY_FEEDBACK":
                main010.openMenuByKey("2024110620525656955");
		        break;
		    case "MY_READ_VOC":
                main010.openMenuByKey("2024110620530584595");
		        break;
		    case "MY_SEARCH":
                main010.openMenuByKey("2024110620531096777");
		        break;
		    case "MY_QUESTION":
                main010.openMenuByKey("2024122414123062624");
		        break;
			default:
				xui.dialog.confirm("I'm preparing<br/>(" + caseBiz + "," + param01 + "," + param02 + "," + param03 + ")", xui.enum.CONFIRM.getName());
		}
	},

    setLangCombo : function(langData){
        var userLang = xui.extends.session.getLanguage();
        // 사용자 언어설정 값 세팅
        if(!xui.valid.isEmpty(userLang)){
            $("#languageCode").valExt(userLang);
        }
        // 동적으로 html width 핸들링을 위하여 추가.
        var languageCode         = document.getElementById("languageCode");
        languageCode.style.width = (xui.util.getByte(languageCode.value)*10 + 10) + 'px';
    },

    changeLocale : function(languageCode){
        var param	= new xui.json();
        param.setURL("/xs/webbase/login/changeLocale.json");
        param.setString("languageCode", languageCode);
        param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
        param.setCallBack(function(response, request){
            if(!response.getErrorFlag()){
                xui.extends.menu.openMain(xui.extends.session.getMainPageUrl(), xui.extends.session.getErrorPageUrl());
            }
        });
        xui.ajax.callService(param);
    },

	/**
	 * Sample(해당 함수는 삭제하지 말고 그대로)
	 */
	sample : function(){

	}
};