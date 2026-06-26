"use strict";

var gIsPrivacyPage 	= false;		// 개인정보권한 판단  
var gBlnMenuServiceInfo = "";		// 서비스코드 (구독형)
var gStrMenuServiceName = "";		// 서비스이름 (구독형)

//세션정보를 session객체에 생성
xui.extends.session.getSessionInfoByKey("ALL");

class _webbaseCmmn {
    constructor() {
        this.enum = new Enumeration();
        this.enum.setEnum("NONE"			, ""			, ""			, "");
        
        this.autoBox = [];
    }

    /**
	 * 화면에서 조회조건 영역에 펼침/숨김 옵션 추가
	 * @param	없음
	 * @returns	없음
	 */ 			
	addToggleSearchArea(){
		//첫번째 searchbox 하위에 xui-actions에 버튼을 동적으로 추가하고 해당 영역의 searchForm에 토글 기능을 적용한다.
		var searchboxList  = $("div.searchbox");
		if(searchboxList.length > 0){
			var searchbox = $(searchboxList[0]);
			//다이얼로그 상태의 조회영역은 적용하지 않는다.
			if(searchbox.parent().hasClass("dialog")){return;}
			//토글 동적 아이콘 추가
			var xuiActions = searchbox.find("div.xui-actions");
			var btnFilterCloseList = searchbox.find("button[id='btnFilterClose']");
			var searchFormList = searchbox.find("form[id='searchForm']");
			//검색폼이 있고 토글버튼이 없을 경우 아이콘 및 이벤트 삽입
			if(searchFormList.length > 0 && btnFilterCloseList.length === 0){
				var minusClassName = "xfi-ico_0159_minus";
				var plusClassName = "xfi-ico_0041_add";
				var btnClassName = minusClassName;
				var searchForm = $(searchFormList[0]).parent();
				if(searchForm.hasClass("xui-invisible")){btnClassName = plusClassName;}
				//토글버튼이 없을 경우 추가
				xuiActions.append($("<button type='button' class='xui-button btn-toggle allowed' id='btnFilterClose' authtype='N'><i class='xfi " + btnClassName + "' aria-hidden='true'></i></button>"));	
				if(searchFormList.length > 0){
					var btnFilterClose = searchbox.find("button[id='btnFilterClose']")[0];

					//이벤트적용
					if(!xui.valid.isEmpty(btnFilterClose)){
						btnFilterClose.addEventListener('click', function () {
							var icon = $(this.children);
							if(icon.hasClass(minusClassName)){
								icon.removeClass(minusClassName);
								icon.addClass(plusClassName);
								searchForm.addClass("xui-invisible");
							} else {
								icon.removeClass(plusClassName);
								searchForm.removeClass("xui-invisible");
								icon.addClass(minusClassName);
							}
						});					
					}
				}
			}
		}
	}

    /**
	 * 스크롤이벤트를 이용하여 TOP Button 표시
	 * @param	className	스크롤이 발생하는 Class 이름
	 * @returns	없음
	 */ 
	setAutoTopButton(className){
		$("." + className).scroll(function() {
			if($("." + className).scrollTop() > 0){
				$("#btnTop").removeClass("xui-invisible");
				$("#btnTop").click(function(){
			        $("." + className).scrollTop(0);
				});
			} else {
				$("#btnTop").addClass("xui-invisible");
			}
		});			
	}

	/**
	* 다이얼로그 높이 설정
	* @param {String} fileName 팝업윈도우파일명
	* @param {int} height 높이값
	* @retrun 없음
	*/	
	setDialogHeight (fileName, height){
		var dialogId = fileName + "_xuiwindow_dialog";
		var parentDialogDoc = parent.document.getElementById(dialogId);
		$(parentDialogDoc).css("height",height + "px");
	}
};

var webbaseCmmn	= new _webbaseCmmn();
_webbaseCmmn	= null;



$(window).ready(function () {
	//조회 조건 접기 기능 통합 적용
	webbaseCmmn.addToggleSearchArea();

	//화면에 스크롤이 생길 경우 위로 올라가기 버튼 생성
	webbaseCmmn.setAutoTopButton("document-body");			
	webbaseCmmn.setAutoTopButton("contents-container");			
	webbaseCmmn.setAutoTopButton("contents-popup");
	
});


$(document).mouseup(function(e){
	//GNB 메뉴 Layer
	var gnbList = top.window.$(".gnb-list-wrap");
	if(gnbList.has(e.target).length === 0){
		gnbList.removeClass("on");
		top.window.$(".gnb ul > li.on").removeClass("on");
	}

	//자동완성 레이어
	if(top.webbaseCmmn.autoBox.length > 0){
		// 만약 클릭한 곳이 레이어 발생하는 페이지가 아닌 경우에만 닫는다.
		if(e.target.id !== "keyword" && e.target.id !== "keywordAuto"){
			top.webbaseCmmn.autoBox[0].addClass("xui-invisible");
		}
	}

	//Cubee Max Layer 줄이기
	if(!xui.valid.isEmpty($("#botChat")) && $("#botChat").hasClass("max")){
		var chatbot = $(".chatbot .bot");
		if(chatbot.has(e.target).length === 0){
			$("#botChat").removeClass("max");
			$("#botChat .btn-i").addClass("maximize02");
			$("#botChat .btn-i").removeClass("close_fullscreen");
		}	
	}
});


/**
 * 차트 테마설정
 */
function am4themesVocBase(target) {
  if(target instanceof am4core.ColorSet){
    target.list = [
      am4core.color("#3F4EF4"),
      am4core.color("#5F6CF3"),
      am4core.color("#7A88F9"),
      am4core.color("#969FF2"),
      am4core.color("#62309A"),
      am4core.color("#824CCB"),
      am4core.color("#B26EEE"),
      am4core.color("#C68BFD"),
      am4core.color("#0D599E"),
      am4core.color("#1D89B9"),
      am4core.color("#6BA7CA"),
      am4core.color("#9FC0D6"),
      am4core.color("#016C4D"),
      am4core.color("#14937C"),
      am4core.color("#56BF99"),
      am4core.color("#7BE1A2")
    ];
  }
}
function am4themesVocGrade(target) {
  if(target instanceof am4core.ColorSet){
    target.list = [
      am4core.color("#FA375E"),
      am4core.color("#FFBB3D"),
      am4core.color("#2DB4F3")
    ];
  }
}
function am4themesVocType(target) {
  if(target instanceof am4core.ColorSet){
    target.list = [
      am4core.color("#3F4EF4"),
      am4core.color("#62309A"),
      am4core.color("#0D599E"),
      am4core.color("#016C4D"),
      am4core.color("#9C1D16"),
    ];
  }

}
