/***************************************************************************************************************************************************************
* @classDescription 그리드 템플릿 화면
* @author HyosungITX Corp.
* @version 1.0
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Modification Information
* Date              Developer           Content
* ----------        -------------       -------------------------
* 2021/12/15        xtrm개발팀            신규생성
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Copyright (C) 2018 by HyosungITX Corp. All rights reserved.
****************************************************************************************************************************************************************/

/*******************************************************************************
 * Global Variable : 스크립트 영역에서 모두 접근할 수 있는 전역변수를 해당 영역에 모두 정의한다.
 ******************************************************************************/
"use strict";
var IMPORT			= "GRID,\
		               html/xs/webbase/template/cmmn/js/templateCmmn.js";

/*******************************************************************************
 * Document Ready : jquery에서 제공하는 함수를 이용하여 화면이 로드될 때 처리할 함수를 정의한다.
 ******************************************************************************/
function PageReady(){
	aichat031.completePageRender();
}
function PageUnload(){
	//@ TODO 필요시 페이지 종료전 로직 추가
}

/**
 * 클래스 구조의 스크립트 구조체 오브젝트 명을 정의한다.
 * 스크립트를 클래스 기반의 구조체로 정의하기 위해 해당 JavaScript의 클래스명은 파일명으로 정의한다.
 * @classDescription :
 */
var aichat031={
/*******************************************************************************
 * completePageRender Function : 화면이 초기 로드 시점에 처리할 사항을 정의한다.
 ******************************************************************************/
	completePageRender : function(){
		//페이지 상수 정의
		aichat031.setPageEnum();
		//탭 화면 디자인
		aichat031.defineTab();
		//그리드 디자인
		aichat031.defineGrid();
		//트리뷰 디자인
		aichat031.defineTree();
		//다이얼로그레이어 디자인
		aichat031.defineDialog();
		//파일업다운로드뷰어 디자인
		aichat031.defineFile();
		//초기데이터 설정
		aichat031.initPage();
		//이벤트 정의
		aichat031.defineEvent();
	},
// -----------------------------------------------------------------------
// ENUM: 열거형 class 상수 정의 [기본함수명:setPageEnum]
// -----------------------------------------------------------------------
	setPageEnum : function(){
		aichat031.enum = new Enumeration();
		aichat031.enum.setEnum("name"							,"code"			,"codeName"						,"pcode");
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
		$("#divGrid01").XuiGrid({
			ratio: true,
			headerAlign: "center",
			editDiv: "",
			header: true,
			headerHeight: 44,
			rowHeight: 44,
			footerHeight: 44,
			colNames: ["작업 ID", "작업유형", "상태", "대상 게시판", "스킵", "성공", "실패", "조회시작일시", "조회종료일시", "실행시작일시", "실행종료일시", "실행 소요 시간", "관리자 ID "],
			colModel: [
			    {name: "col_0", width: 9, align: "center", sort: true, hidden: false, excel: true, html: false, format: ""}, // 144
			    {name: "col_1", width: 6, align: "center", sort: true, hidden: false, excel: true, html: false, format: "", convertFn:aichat031.typeTagFn}, // 96
			    {name: "col_2", width: 6, align: "center", sort: true, hidden: false, excel: true, html: false, format: "", convertFn:aichat031.stateTagFn}, // 96
			    {name: "col_3", width: 6, align: "right", sort: true, hidden: false, excel: true, html: true, format: ""}, // 96
			    {name: "col_4", width: 4.5, align: "right", sort: true, hidden: false, excel: true, html: true, format: ""}, // 72
			    {name: "col_5", width: 4.5, align: "right", sort: true, hidden: false, excel: true, html: false, format: ""}, // 72
			    {name: "col_6", width: 4.5, align: "right", sort: true, hidden: false, excel: true, html: false, format: "", convertFn:aichat031.failTagFn}, // 72
			    {name: "col_7", width: 9.5, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 152
			    {name: "col_8", width: 9.5, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 152
			    {name: "col_9", width: 9.5, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 152
			    {name: "col_10", width: 9.5, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 152
			    {name: "col_11", width: 7.5, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 120
			    {name: "col_12", width: 9, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 144
			],
			onClickData:function(rowIdx, rowId, rowData, cellIdx, cellId, cellData, context){
			    $('.xui-side-panel').addClass('--active');
			},
			headerCss: "",
			oddRowClass: "",
			evenRowClass: "",
			activeRowCss: "",
			activeCellCss: "",
			hoverClass: "",
			alwaysCallClick: true, //(옵션){boolean} 데이터 행 클릭 시 이미 선택되어 있는 행에도 이벤트 호출 여부 (Default : false)
			scrollAppend: false, //(옵션){boolean} scroll 최하단 이용 시 데이터 Append 기능(페이지)활성화 여부 (Default : false)
			paging: true, //(옵션){boolean} 페이징 처리 여부 (Default : false)
			pageViewSize: 5, //(옵션){number} 페이징 처리시 페이지 번호 표출 개수 설정
			pagebarAlign: "left", //(옵션){string} 페이징 처리시 목록 컴포넌트 정렬 위치
			pageMoveLast: true, //(옵션){boolean} 페이징 처리시 처음/끝 이동 기능 활성화 여부
			pageCustomMove: true, //(옵션){boolean} 페이징 처리시 특정페이지 바로가기 이동 기능 활성화 여부
			pageChangeCount: true, //(옵션){boolean} 페이징 처리시 특정페이지 한페이지 표출건 수 변경 기능 활성화 여부
			pageHideMore: false, //(옵션){boolean} 페이징 처리시 페이지 그룹 이동 기능 활성화 여부
			rowList: [50, 100, 150, 200, 250, 300], //(옵션){Object Array} 1개 페이지 당 표출되는 데이터 건수 콤보 데이터 (Default : [50, 100, 150, 200, 250, 300])
			colMove: false, //(옵션){boolean} 컬럼 drag & drop 이동 가능 여부 (Default : false)
			dragBlock: false, //(옵션){boolean} Block drag & drop 이동 가능 여부 (Default : false)
			scrollAppend: false, //(옵션){boolean} 스크롤 데이터 추가 방식 처리 여부 (Default : false)
			cellClick: false, //(옵션){boolean} 셀 클릭모드 (Default : false)
			statusBar: true, //(옵션){boolean} 그리드 하단 상태바 표출 여부 (Default : false)
			statusMsg: xui.enum.GRID_SELECTED_DATA.getName(), //(옵션){String} 그리드 하단 상태바 표출 메시지 (Default : '건의 데이터가 검색되었습니다.')
			emptyrecords: xui.enum.GRID_NO_DATA.getName(), //(옵션){String} 그리드 데이터 조회 결과가 0건일 시 표출 메시지 (Default : '데이터가 존재하지 않습니다.')
			smartRender: true, //(옵션){boolean} 스마트 렌더링 처리 여부(대용량 데이터 컨트롤 시 필수옵션) (Default : false)
			freezeColumn: "", //(옵션){string} 그리드 X축 틀 고정 기준컬럼 ID
			multiselect: false, //(옵션){boolean} 다중 선택 가능 여부(체크박스) (Default : false)
			multiselectColSize: 44, //(옵션){number} multiselect 옵션 적용 시 체크박스 컬럼 너비
			multiAllDisabled: false, //(옵션){boolean} 헤더 전체 선택 체크박스 비활성화 여부 (Default : false)
			multiRowSelect: false, //(옵션){boolean} 다중 행 선택 가능 여부(ctrl or shift key & mouse click) (Default : false)
			rownumbers: false, //(옵션){boolean} 줄번호 보이기 (Default : false)
			rowDragMove: false, //(옵션){boolean} 로우 단위 Drag&drop 이동 기능 활성황 여부
			removeAfterDrag: false, //(옵션){boolean} 로우 단위 Drag&drop 이동 후 행 삭제 여부
			enableAddRow: false, //(옵션){boolean} 그리고 행 추가 기능 활성화 여부 (Default : false)
			enableRemoveRow: false, //(옵션){boolean} 그리드 행 삭제 가능여부 (Default : false)
			enableClipboard: false, //(옵션){boolean} 그리드 행/셀 데이터 클립보드 복사 기능 활성화 (Default : false)
			enablePreview: false, //(옵션){boolean} 그리드 인쇄 미리보기 기능 활성화 (Default : false)
			enableRefresh: false, //(옵션){boolean} 그리드 새로고침 기능 활성화 (Default : false)
			enableExportExcl: false, //(옵션){boolean} 그리드 엑셀 내려받기 가능여부 (Default : false)
			excelTitle: "엑셀 타이틀 영역",
			excelSubTitle: "엑셀 서브 타이틀 영역",
			exportFromClient: true, //(옵션){boolean} 그리드 데이터 엑셀 다운로드 시 Client 표출 데이터 기준 다운로드 여부 (Default : false)
		    context: [{}]
		});

		$("#divGrid02").XuiGrid({
            ratio: true,
            headerAlign: "center",
            editDiv: "",
            header: true,
            headerHeight: 44,
            rowHeight: 44,
            footerHeight: 44,
            colNames: ["세부 ID", "재실행 ID", "상태", "재실행", "재실행여부", "게시판 ID", "대분류", "게시판 명", "조회시작", "조회종료", "실행시작", "실행종료", "로그 "],
            colModel: [
                {name: "col_13", width: 8.79, align: "center", sort: true, hidden: false, excel: true, html: false, format: ""}, // 104
                {name: "col_14", width: 8.79, align: "center", sort: true, hidden: false, excel: true, html: false, format: ""}, // 104
                {name: "col_15", width: 5.41, align: "center", sort: true, hidden: false, excel: true, html: false, format: "", convertFn:aichat031.stateTagFn}, // 64
                {name: "col_16", width: 5.41, align: "center", sort: true, hidden: false, excel: true, html: true, format: "", convertFn:aichat031.reRunButtonFn}, // 64
                {name: "col_17", width: 7.44, align: "center", sort: true, hidden: false, excel: true, html: true, format: "", convertFn:aichat031.reRunMarkFn}, // 88
                {name: "col_18", width: 8.11, align: "center", sort: true, hidden: false, excel: true, html: false, format: ""}, // 96
                {name: "col_19", width: 8.11, align: "center", sort: true, hidden: false, excel: true, html: false, format: ""}, // 96
                {name: "col_20", width: 10.82, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 128
                {name: "col_21", width: 6.76, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 80
                {name: "col_22", width: 6.76, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 80
                {name: "col_23", width: 6.76, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 80
                {name: "col_24", width: 6.76, align: "center", sort: true, hidden: false, excel: false, html: true, format: ""}, // 80
                {name: "col_25", width: 3.38, align: "center", sort: true, hidden: false, excel: false, html: true, format: "", convertFn:aichat031.logButtonFn}, // 40
            ],
            onClickData:function(rowIdx, rowId, rowData, cellIdx, cellId, cellData, context){},
            headerCss: "",
            oddRowClass: "",
            evenRowClass: "",
            activeRowCss: "",
            activeCellCss: "",
            hoverClass: "",
            alwaysCallClick: false, //(옵션){boolean} 데이터 행 클릭 시 이미 선택되어 있는 행에도 이벤트 호출 여부 (Default : false)
            scrollAppend: false, //(옵션){boolean} scroll 최하단 이용 시 데이터 Append 기능(페이지)활성화 여부 (Default : false)
            paging: true, //(옵션){boolean} 페이징 처리 여부 (Default : false)
            pageViewSize: 5, //(옵션){number} 페이징 처리시 페이지 번호 표출 개수 설정
            pagebarAlign: "left", //(옵션){string} 페이징 처리시 목록 컴포넌트 정렬 위치
            pageMoveLast: true, //(옵션){boolean} 페이징 처리시 처음/끝 이동 기능 활성화 여부
            pageCustomMove: true, //(옵션){boolean} 페이징 처리시 특정페이지 바로가기 이동 기능 활성화 여부
            pageChangeCount: true, //(옵션){boolean} 페이징 처리시 특정페이지 한페이지 표출건 수 변경 기능 활성화 여부
            pageHideMore: false, //(옵션){boolean} 페이징 처리시 페이지 그룹 이동 기능 활성화 여부
            rowList: [50, 100, 150, 200, 250, 300], //(옵션){Object Array} 1개 페이지 당 표출되는 데이터 건수 콤보 데이터 (Default : [50, 100, 150, 200, 250, 300])
            colMove: false, //(옵션){boolean} 컬럼 drag & drop 이동 가능 여부 (Default : false)
            dragBlock: false, //(옵션){boolean} Block drag & drop 이동 가능 여부 (Default : false)
            scrollAppend: false, //(옵션){boolean} 스크롤 데이터 추가 방식 처리 여부 (Default : false)
            cellClick: false, //(옵션){boolean} 셀 클릭모드 (Default : false)
            statusBar: true, //(옵션){boolean} 그리드 하단 상태바 표출 여부 (Default : false)
            statusMsg: xui.enum.GRID_SELECTED_DATA.getName(), //(옵션){String} 그리드 하단 상태바 표출 메시지 (Default : '건의 데이터가 검색되었습니다.')
            emptyrecords: xui.enum.GRID_NO_DATA.getName(), //(옵션){String} 그리드 데이터 조회 결과가 0건일 시 표출 메시지 (Default : '데이터가 존재하지 않습니다.')
            smartRender: true, //(옵션){boolean} 스마트 렌더링 처리 여부(대용량 데이터 컨트롤 시 필수옵션) (Default : false)
            freezeColumn: "", //(옵션){string} 그리드 X축 틀 고정 기준컬럼 ID
            multiselect: true, //(옵션){boolean} 다중 선택 가능 여부(체크박스) (Default : false)
            multiselectColSize: 40, //(옵션){number} multiselect 옵션 적용 시 체크박스 컬럼 너비
            multiAllDisabled: false, //(옵션){boolean} 헤더 전체 선택 체크박스 비활성화 여부 (Default : false)
            multiRowSelect: false, //(옵션){boolean} 다중 행 선택 가능 여부(ctrl or shift key & mouse click) (Default : false)
            rownumbers: true, //(옵션){boolean} 줄번호 보이기 (Default : false)
            rowDragMove: false, //(옵션){boolean} 로우 단위 Drag&drop 이동 기능 활성황 여부
            removeAfterDrag: false, //(옵션){boolean} 로우 단위 Drag&drop 이동 후 행 삭제 여부
            enableAddRow: false, //(옵션){boolean} 그리고 행 추가 기능 활성화 여부 (Default : false)
            enableRemoveRow: false, //(옵션){boolean} 그리드 행 삭제 가능여부 (Default : false)
            enableClipboard: false, //(옵션){boolean} 그리드 행/셀 데이터 클립보드 복사 기능 활성화 (Default : false)
            enablePreview: false, //(옵션){boolean} 그리드 인쇄 미리보기 기능 활성화 (Default : false)
            enableRefresh: false, //(옵션){boolean} 그리드 새로고침 기능 활성화 (Default : false)
            enableExportExcl: false, //(옵션){boolean} 그리드 엑셀 내려받기 가능여부 (Default : false)
            excelTitle: "엑셀 타이틀 영역",
            excelSubTitle: "엑셀 서브 타이틀 영역",
            exportFromClient: true, //(옵션){boolean} 그리드 데이터 엑셀 다운로드 시 Client 표출 데이터 기준 다운로드 여부 (Default : false)
            context: [{}]
        });
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
	    $("#divDialog01").XuiWindow({
            title: "수동 임베딩 실행",
            width: 840,
            height: 'auto',
            modal: true,
            resizable: false,
            movable: true,
            //buttons: [{
            //    id: "btnProcess02",
            //    text: "처리",
            //    authType: xui.enum.AUTH_TYPE_ETC.getCode(),
            //    click: function() {
            //        console.log("Click 처리");
            //    }
            //}, {
            //    id: "btnSave02",
            //    text: "저장",
            //    authType: xui.enum.AUTH_TYPE_SAVE.getCode(),
            //    click: function() {
            //        console.log("Click 저장");
            //    }
            //}],
            open: function(param) {
                //var message = "divDialog02 수신파라메터\n" + JSON.stringify(param);
                //console.log(aichat031.enum.DIALOG_OPEN.getName() + ":" + message);
            },
            close: function() {
                //var message = "divDialog02\n" + "close";
                //console.log(aichat031.enum.DIALOG_CLOSE.getName() + ":" + message);
            }
        });

        $("#divDialog02").XuiWindow({
            title: "게시판 임베딩 로그",
            width: 840,
            height: 'auto',
            modal: true,
            resizable: false,
            movable: true,
            //buttons: [{
            //    id: "btnProcess02",
            //    text: "처리",
            //    authType: xui.enum.AUTH_TYPE_ETC.getCode(),
            //    click: function() {
            //        console.log("Click 처리");
            //    }
            //}, {
            //    id: "btnSave02",
            //    text: "저장",
            //    authType: xui.enum.AUTH_TYPE_SAVE.getCode(),
            //    click: function() {
            //        console.log("Click 저장");
            //    }
            //}],
            open: function(param) {
                //var message = "divDialog02 수신파라메터\n" + JSON.stringify(param);
                //console.log(aichat031.enum.DIALOG_OPEN.getName() + ":" + message);
            },
            close: function() {
                //var message = "divDialog02\n" + "close";
                //console.log(aichat031.enum.DIALOG_CLOSE.getName() + ":" + message);
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
		aichat031.selectData();
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEFINE EVENT: 화면에 디자인 된 버튼 및 오브젝트 이벤트와 호출할 함수 정의
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineEvent : function(){
		 $("#test-button").click(function(e){
		 		$("#divDialog01").api().open(aichat031.createData01());
		 });
        $('.xui-side-panel__button').click(function(e){
            $('.xui-side-panel').removeClass('--active');
        });
		 $("[id*='divDialogButton_']").click(function(e){
		 		$("#divDialog02").api().open(aichat031.createData01());
		 });
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
	selectData : function(){
		//데이터유효성 체크
		if(!aichat031.validationSelectData()){return;}

        // TODO:PB [AI비서] UI 확인용 테스트
		var jsonData01 = aichat031.createData01();
		var jsonData02 = aichat031.createData02();

		$("#divGrid01").api().loadData(jsonData01);
        $("#divGrid02").api().loadData(jsonData02);
	},
    validationSelectData : function(){
    	return true;
    },
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// SAVE: 데이터 저장 처리에 대한 함수 정의 [기본함수명:saveData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// DELETE: 삭제 데이터 처리에 대한 함수 정의 [기본함수명:deleteData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// PRINT: 출력 및 레포트 데이터 처리에 대한 함수 정의 [기본함수명:printData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
 // --------------------------------------------------------------------------------------------------------------------------------------------------------------
 // EXCEL: 엑셀 IMPORT / EXPORT 처리에 대한 함수 정의 [기본함수명:exportData + (구분단어) importData + (구분단어)]
 // --------------------------------------------------------------------------------------------------------------------------------------------------------------
/****************************************************************************************************************************************************************
 * User Functions: 별도 화면 처리를 위해 필요한 함수를 정의한다.
 ****************************************************************************************************************************************************************/

    // TODO:PB [AI비서] UI 확인용 테스트
    createData01:function(){
		var jsonData = new xui.json();
		for (var i=0;i<3;i++){
			jsonData.setString("col_0","uuid",i);
			jsonData.setString("col_1","",i);
			jsonData.setString("col_2","",i);
			jsonData.setString("col_3","<div class='--emphasis --number'>0</div>",i);
			jsonData.setString("col_4","<div class='--emphasis --number'>0</div>",i);
			jsonData.setString("col_5","<div class='--emphasis --number'>0</div>",i);
			jsonData.setString("col_6","<div class='--emphasis --number'>0</div>",i);
			jsonData.setString("col_7","YYYY-MM-DD HH:mm:ss",i);
			jsonData.setString("col_8","YYYY-MM-DD HH:mm:ss",i);
			jsonData.setString("col_9","YYYY-MM-DD HH:mm:ss",i);
			jsonData.setString("col_10","YYYY-MM-DD HH:mm:ss",i);
			jsonData.setString("col_11","HH:mm:ss",i);
			jsonData.setString("col_12","이름(계정**)",i);
		}
		jsonData.setHeader("COUNT",100);
		jsonData.setHeader("ERROR_CODE","");
		jsonData.setHeader("ERROR_FLAG",false);
		jsonData.setHeader("ERROR_MSG","정상적으로 조회되었습니다.");
		jsonData.setHeader("PAGE_NO",1);
		jsonData.setHeader("ROW_PER_PAGE",50);
		jsonData.setHeader("TOT_COUNT",50);

    	return jsonData;
    },

    // TODO:QWEQWE
    // TODO:PB [AI비서] UI 확인용 테스트
    createData02:function(){
        var jsonData = new xui.json();
        for (var i=0;i<4;i++){
            jsonData.setString("col_13","uuid",i);
            jsonData.setString("col_14","uuid",i);
            jsonData.setString("col_15","",i);
            jsonData.setString("col_16","-",i);
            jsonData.setString("col_17","",i);
            jsonData.setString("col_18","nnnnnn",i);
            jsonData.setString("col_19","-",i);
            jsonData.setString("col_20","-",i);
            jsonData.setString("col_21","HH.mm.ss",i);
            jsonData.setString("col_22","HH.mm.ss",i);
            jsonData.setString("col_23","HH.mm.ss",i);
            jsonData.setString("col_24","HH.mm.ss",i);
            jsonData.setString("col_25","",i);
        }
        jsonData.setHeader("COUNT",100);
        jsonData.setHeader("ERROR_CODE","");
        jsonData.setHeader("ERROR_FLAG",false);
        jsonData.setHeader("ERROR_MSG","정상적으로 조회되었습니다.");
        jsonData.setHeader("PAGE_NO",1);
        jsonData.setHeader("ROW_PER_PAGE",50);
        jsonData.setHeader("TOT_COUNT",50);

        return jsonData;
    },

    // col_1(작업 유형) 예시
    typeTagFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var tagType = '';
        var textType = '';

        if ( rowIdx === 0 ) { tagType = 'manual'; textType = '수동'; }
        else if ( rowIdx === 1 ) { tagType = 'automatic'; textType = '자동'; }
        else { tagType = 're-run'; textType = '재실행'; }

        var returnValue = "<span class='tag' data-tag-type='" + tagType + "'>" + textType + "</span>"
		return returnValue;
    },

    // col_2(상태) 예시
    stateTagFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var tagType = '';
        var textType = '';
        var message = 'empty';

        if ( rowIdx === 0 ) { tagType = 'success'; textType = '성공'; }
        else if ( rowIdx === 1 ) { tagType = 'failed'; textType = '실패'; message = 'API Timeout'; }
        else if ( rowIdx === 2 ) { tagType = 'in-progress'; textType = '진행중'; }
        else { tagType = 'skip'; textType = '스킵'; }

        var returnValue = "<span class='tag' data-tag-type='" + tagType + "' data-hover-message='" + message + "' style=\"--message: '" + message + "'\">" + textType + "</span>";
        return returnValue;
	},

    // col_15(실패) 예시
	failTagFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var returnValue;

        if ( rowIdx === 0 ) returnValue = '<span class="--emphasis --number failed_grid">' + "2" + '</span>';
        else returnValue = '<span class="--emphasis --number">' + "0" + '</span>';

        return returnValue;
	},

    // col_16(재실행) 예시
    reRunButtonFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var returnValue;

        if ( rowIdx === 1 ) returnValue = '<div class="xui-grid-button" tabIndex="0"><i class="xfi xfi xfi-ico_0180_reset"></i></div>';
        else returnValue = '-';

        return returnValue;
    },

    // col_17(재실행 여부) 예시
    reRunMarkFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
            var returnValue

            if ( rowIdx === 0 ) returnValue = '<span class="xui-grid-mark"><i class="xfi xfi xfi-ico_0013_close_bold"></i></span>';
            else if ( rowIdx === 1 ) returnValue = '<span class="xui-grid-mark --positive"><i class="xfi xfi xfi-ico_0035_yes"></i></span>';
            else '-';

            return returnValue;
    },

    // col_25(로그) 예시
    logButtonFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
            var returnValue = '<div id="divDialogButton_' + rowIdx + '" class="xui-grid-button" tabIndex="0"><i class="xfi xfi xfi-ico_0026_note"></i></div>';
            return returnValue;
    },

	disableFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
		return true;
	},
	
	/**
	 * Sample(해당 함수는 삭제하지 말고 그대로)
	 */
    sample : function () {
	   
    },
};