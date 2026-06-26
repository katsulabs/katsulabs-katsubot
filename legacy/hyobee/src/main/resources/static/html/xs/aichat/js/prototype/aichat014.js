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
	aichat014.completePageRender();
}
function PageUnload(){
	//@ TODO 필요시 페이지 종료전 로직 추가
}

/**
 * 클래스 구조의 스크립트 구조체 오브젝트 명을 정의한다.
 * 스크립트를 클래스 기반의 구조체로 정의하기 위해 해당 JavaScript의 클래스명은 파일명으로 정의한다.
 * @classDescription :
 */
var aichat014={
/*******************************************************************************
 * completePageRender Function : 화면이 초기 로드 시점에 처리할 사항을 정의한다.
 ******************************************************************************/
	completePageRender : function(){
		//페이지 상수 정의
		aichat014.setPageEnum();
		//탭 화면 디자인
		aichat014.defineTab();
		//그리드 디자인
		aichat014.defineGrid();
		//트리뷰 디자인
		aichat014.defineTree();
		//다이얼로그레이어 디자인
		aichat014.defineDialog();
		//파일업다운로드뷰어 디자인
		aichat014.defineFile();
		//초기데이터 설정
		aichat014.initPage();
		//이벤트 정의
		aichat014.defineEvent();
	},
// -----------------------------------------------------------------------
// ENUM: 열거형 class 상수 정의 [기본함수명:setPageEnum]
// -----------------------------------------------------------------------
	setPageEnum : function(){
		aichat014.enum = new Enumeration();
		aichat014.enum.setEnum("name"							,"code"			,"codeName"						,"pcode");
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
			colNames: ["구분", "번호", "제목", "내용", "작성자", "일자", "AI 요약"],
			colModel: [
			    {name: "col_0", width: 4.85, align: "center", sort: true, hidden: false, excel: true, html: false, format: "", convertFn:aichat014.typeFn},
			    {name: "col_1", width: 12.12, align: "left", sort: true, hidden: false, excel: true, html: false, format: ""},
			    {name: "col_2", width: 21.21, align: "left", sort: true, hidden: false, excel: true, html: false, format: "", convertFn:aichat014.titleFn},
			    {name: "col_3", width: 36.36, align: "left", sort: true, hidden: false, excel: true, html: true, format: ""},
			    {name: "col_4", width: 13.94, align: "left", sort: true, hidden: false, excel: true, html: true, format: ""},
			    {name: "col_5", width: 6.67, align: "center", sort: true, hidden: false, excel: true, html: false, format: ""},
			    {name: "col_6", width: 4.85, align: "center", sort: true, hidden: false, excel: true, html: false, format: "", convertFn:aichat014.tooltipFn}
            ],
			onClickData:function(rowIdx, rowId, rowData, cellIdx, cellId, cellData, context){
                $(".journal-reco-summary-button.--active").removeClass("--active");
                $(".journal-reco-summary-dialog.--active").removeClass("--active");
            },
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
		aichat014.selectData();
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEFINE EVENT: 화면에 디자인 된 버튼 및 오브젝트 이벤트와 호출할 함수 정의
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineEvent : function(){
        $(document).on("mousedown", function(e){
            aichat014.closeRecoSummary(e);
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
		if(!aichat014.validationSelectData()){return;}

        // TODO:PB [AI비서] UI 확인용 테스트
		var jsonData01 = aichat014.createData01();
		$("#divGrid01").api().loadData(jsonData01);
		$("#divGrid01 td").removeAttr("xui-tooltip-title");
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
		for (var i=0;i<20;i++){
			jsonData.setString("col_0","",i);
			jsonData.setString("col_1","QWER-1234",i);
			jsonData.setString("col_2","제목",i);
			jsonData.setString("col_3","내용",i);
			jsonData.setString("col_4","이름",i);
			jsonData.setString("col_5","YYYY-MM-DD",i);
			jsonData.setString("col_6","",i);
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

    openRecoSummary:function( btn, event ){
        event.stopPropagation();

           $(".journal-reco-summary-button.--active").removeClass("--active");
           $(".journal-reco-summary-dialog.--active").removeClass("--active --up --down");

           var $btn = $(btn);
           var $grid = $btn.closest(".objbox");

           var btnTop = $btn.offset().top;
           var gridTop = $grid.offset().top;
           var gridHeight = $grid.outerHeight();
           var gridMiddle = gridTop + (gridHeight / 2);
           var directionClass = btnTop < gridMiddle ? "--down" : "--up";

            $btn
                .find("> i").addClass("--active")
               .closest(".xui-grid-button")
               .siblings(".journal-reco-summary-dialog")
               .addClass("--active " + directionClass)
           ;
    },

    closeRecoSummary: function( e ) {
        if (
            !$(e.target).closest(".journal-reco-summary-dialog").length &&
            !$(e.target).closest(".journal-reco-summary-button").length
        ) {
            $(".journal-reco-summary-button.--active").removeClass("--active");
            $(".journal-reco-summary-dialog.--active").removeClass("--active");
        }
    },

    // col_1(구분) 예시
    typeFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var tagType = '';
        var textType = '';

        if ( rowIdx === 0 ) { tagType = 'journal'; textType = '논문'; }
        else if ( rowIdx === 1 ) { tagType = 'patent'; textType = '특허'; }
        else { tagType = 'news'; textType = '기사'; }

        var returnValue = "<span class='tag' data-tag-type='" + tagType + "'>" + textType + "</span>"
		return returnValue;
    },

    // col_3(제목) 예시
	titleFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var returnValue;
        // TODO:PB [AI비서] 실제 상세 페이지 경로 필요
        returnValue = '<a href="#TBD" target="_blank" class="--emphasis --isFocusable">' + "제목" + '</span>';
        return returnValue;
	},

    // col_7(AI 요약) 예시
    tooltipFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var returnValue;
        // TODO:PB [AI비서] 실제 AI 요약 툴팁 필요
        returnValue =
            '<div class="xui-grid-button" tabIndex="0" onClick="aichat014.openRecoSummary(this,event)">' +
            '    <i class="xfi xfi xfi-ico_0118_eye --inGridIconButton journal-reco-summary-button" style="color:#808080;"></i>' +
            '</div>' +
            '<div class="journal-reco-summary-dialog">' +
            '    <p class="journal-reco-summary-title">제목</p>' +
            '    <div class="journal-reco-summary-content">' +
            '        <span class="journal-reco-summary-tag">서론</span>' +
            '        <p class="journal-reco-summary-description">내용</p>' +
            '    </div>' +
            '    <div class="journal-reco-summary-content">' +
            '        <span class="journal-reco-summary-tag">본론</span>' +
            '        <p class="journal-reco-summary-description">내용</p>' +
            '    </div>' +
            '    <div class="journal-reco-summary-content">' +
            '        <span class="journal-reco-summary-tag">결론</span>' +
            '        <p class="journal-reco-summary-description">내용</p>' +
            '    </div>' +
            '</div>'
        ;
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