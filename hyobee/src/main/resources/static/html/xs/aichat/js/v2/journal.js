/***************************************************************************************************************************************************************
 * @classDescription v2 저널 영역 전환 스크립트 (journal.jsp)
 * @author HyosungITX Corp.
 * @version 1.0
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Modification Information
 * Date              Developer           Content
 * ----------        -------------       -------------------------
 * 2026/03/17        AI서비스팀             신규생성 (v2 저널 전환 분리)
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Copyright (C) 2018 by HyosungITX Corp. All rights reserved.
 ****************************************************************************************************************************************************************/
"use strict";

// v2에서는 전역 PageReady는 aichat010.js에서 사용하므로,
// journal.js에서는 PageReady를 정의하지 않는다. (충돌 방지)

/***************************************************************************************************************************************************************
 * Global Variable
 ***************************************************************************************************************************************************************/
var IMPORT          = "GRID";
var mobjXtrmParams  = null;
var isInitialized   = false; // 초기화 여부 체크 변수 추가

var journal = {
    /***************************************************************************************************************************************************************
     * completePageRender Function : 화면이 초기 로드 시점에 처리할 사항을 정의한다.
     ***************************************************************************************************************************************************************/
    completePageRender : function(){
        // 이미 초기화되었다면 다시 실행하지 않음
        if (this.isInitialized) {
            // (옵션) 영역을 다시 누를 때 데이터를 새로고침하고 싶다면 아래 주석 해제
            // journal.selectData(1, 10);
            return;
        }

        //페이지 상수 정의
        journal.setPageEnum();
        //탭 화면 디자인
        journal.defineTab();
        //툴바 화면 디자인
        journal.defineToolbar();
        //그리드 디자인
        journal.defineGrid();
        //트리뷰 디자인
        journal.defineTree();
        //다이얼로그 레이어 화면 디자인
        journal.defineDialog();
        //파일 화면 디자인
        journal.defineFile();
        //초기데이터설정
        journal.initPage();
        //이벤트 정의
        journal.defineEvent();

        // 공통 스크립트 실행 후 숨겨졌을 가능성이 있는 액션 영역 강제 표시
        setTimeout(function() {
            $(".xui-box-head .xui-actions").show();
            $(".xui-box-head .xui-actions button").show().css("display", "block");
        }, 200);

        this.isInitialized = true; // 초기화 완료 표시
    },
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ENUM: 열거형 class 상수 정의 [기본함수명:setPageEnum]
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    setPageEnum : function(){
    },
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    // TAB: 탭버튼 구성을 위한 함수 정의 [기본함수명:defineTab + (구분단어)]
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    defineTab : function(){
    },
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    // TOOLBAR: 툴바 구성을 위한 함수 정의 [기본함수명:defineToolbar + (구분단어)]
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    defineToolbar : function(){
    },
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    // GRID: 그리드 구성을 위한 함수 정의 [기본함수명:defineGrid + (구분단어)]
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    defineGrid : function(){
        $("#divGrid01").XuiGrid({
            ratio				: true,
            headerAlign			: "center",
            header				: true,
            headerHeight		: 44,
            rowHeight			: 44,
            footerHeight: 44,
            // paging bar가 항상 보이도록 그리드 높이를 고정 모드로 사용
            enableAutoHeight	: true,
            editDiv				: "",
            freezeColumn		: "",
            colNames: //"id", "구분", "번호", "제목", "내용", "작성자", "작성자 소속", "source_table", "일자", "AI 요약"
                [
                    aichat010.msg("hyobee.journal.grid.column.id"),
                    aichat010.msg("hyobee.journal.grid.column.type"),
                    aichat010.msg("hyobee.journal.grid.column.number"),
                    aichat010.msg("hyobee.journal.grid.column.title"),
                    aichat010.msg("hyobee.journal.grid.column.content"),
                    aichat010.msg("hyobee.journal.grid.column.author"),
                    aichat010.msg("hyobee.journal.grid.column.author_affiliation"),
                    aichat010.msg("hyobee.journal.grid.column.source_table"),
                    aichat010.msg("hyobee.journal.grid.column.date"),
                    aichat010.msg("hyobee.journal.grid.column.ai_summary")
                ],
            colModel:[
                { name:"id", width:0, align:"center", sort:true, hidden:true, excel:false, html: false, format:"", convertFn:journal.nullToHyphen },
                { name: "doc_type", width: 4.85, align: "center", sort: true, hidden: false, excel: true, html: true, format: "", convertFn:journal.typeFn },
                { name: "id", width: 12.12, align: "left", sort: true, hidden: false, excel: true, html: false, format: "", convertFn:journal.nullToHyphen },
                { name: "title", width: 21.21, align: "left", sort: true, hidden: false, excel: true, html: false, format: "", convertFn:journal.titleFn },
                { name: "overview", width: 36.36, align: "left", sort: true, hidden: false, excel: true, html: true, format: "", convertFn:journal.overviewFn },
                { name: "author", width: 13.94, align: "left", sort: true, hidden: false, excel: true, html: true, format: "", convertFn:journal.nullToHyphen },
                { name: "source_info", width: 13.94, align: "left", sort: true, hidden: false, excel: true, html: true, format: "", convertFn:journal.nullToHyphen },
                { name: "source_table", width: 13.94, align: "left", sort: true, hidden: true, excel: false, html: true, format: "", convertFn:journal.nullToHyphen },
                { name: "date", width: 9, align: "center", sort: true, hidden: false, excel: true, html: false, format: "", convertFn:journal.nullToHyphen },
                { name: "ai_summary", width: 4.85, align: "center", sort: true, hidden: true, excel: false, html: true, format: "", convertFn:journal.tooltipFn },
            ],
            onClickData:function(rowIdx, rowId, rowData, cellIdx, cellId, cellData, context){
                /*if(cellId === "selectCount"){
                    if(rowData.selectCount > 0){
                        myinfoMenu.viewListPopup(rowData);
                    }
                }else if(cellId !== "contentsLinkUrl"){
                    vobCmmn.openVocPopup(rowData.contentsKey);
                }*/
                // 1. 체크박스 컬럼(multiselect) 클릭 시 예외 처리
                if (cellId === "CHECKBOX") return;

                // AI 요약 컬럼 더블클릭 시에는 팝업 방지 (선택 사항)
                if (cellId === "ai_summary") return;

                if (!rowData || !rowData.doc_type) {
                    xui.dialog.alert("문서 타입 정보가 없습니다.");
                    return;
                }

                // 분기 처리를 담당할 함수 호출
                journal.openSmartPopup(rowData);
            },
            onDblClickData: function(rowIdx, rowId, rowData, cellIdx, cellId, cellData) {
            },
            headerCss: "",
            oddRowClass: "",
            evenRowClass: "",
            activeRowCss: "",
            activeCellCss: "",
            hoverClass: "",
            alwaysCallClick: true,                              //(옵션){boolean} 데이터 행 클릭 시 이미 선택되어 있는 행에도 이벤트 호출 여부 (Default : false)
            scrollAppend: false,                                //(옵션){boolean} scroll 최하단 이용 시 데이터 Append 기능(페이지)활성화 여부 (Default : false)
            paging: true,                                       //(옵션){boolean} 페이징 처리 여부 (Default : false)
            pageViewSize: 10,                                   //(옵션){number} 페이징 처리시 페이지 번호 표출 개수 설정
            pagebarAlign: "left",                               //(옵션){string} 페이징 처리시 목록 컴포넌트 정렬 위치
            pageMoveLast: true,                                 //(옵션){boolean} 페이징 처리시 처음/끝 이동 기능 활성화 여부
            pageCustomMove: true,                               //(옵션){boolean} 페이징 처리시 특정페이지 바로가기 이동 기능 활성화 여부
            pageChangeCount: true,                              //(옵션){boolean} 페이징 처리시 특정페이지 한페이지 표출건 수 변경 기능 활성화 여부
            pageHideMore: false,                                //(옵션){boolean} 페이징 처리시 페이지 그룹 이동 기능 활성화 여부
            rowList: [10, 20, 30, 50, 100, 200],                //(옵션){Object Array} 1개 페이지 당 표출되는 데이터 건수 콤보 데이터 (Default : [50, 100, 150, 200, 250, 300])
            colMove: false,                                     //(옵션){boolean} 컬럼 drag & drop 이동 가능 여부 (Default : false)
            dragBlock: false,                                   //(옵션){boolean} Block drag & drop 이동 가능 여부 (Default : false)
            cellClick: false,                                   //(옵션){boolean} 셀 클릭모드 (Default : false)
            statusBar: true,                                    //(옵션){boolean} 그리드 하단 상태바 표출 여부 (Default : false)
            statusMsg: xui.enum.GRID_SELECTED_DATA.getName(),   //(옵션){String} 그리드 하단 상태바 표출 메시지 (Default : '건의 데이터가 검색되었습니다.')
            emptyrecords: xui.enum.GRID_NO_DATA.getName(),      //(옵션){String} 그리드 데이터 조회 결과가 0건일 시 표출 메시지 (Default : '데이터가 존재하지 않습니다.')
            smartRender: false,                                  //(옵션){boolean} 스마트 렌더링 처리 여부(대용량 데이터 컨트롤 시 필수옵션) (Default : false)
            multiselect: true,                                 //(옵션){boolean} 다중 선택 가능 여부(체크박스) (Default : false)
            multiselectColSize: 44,                             //(옵션){number} multiselect 옵션 적용 시 체크박스 컬럼 너비
            multiAllDisabled: false,                            //(옵션){boolean} 헤더 전체 선택 체크박스 비활성화 여부 (Default : false)
            multiRowSelect: false,                              //(옵션){boolean} 다중 행 선택 가능 여부(ctrl or shift key & mouse click) (Default : false)
            rownumbers: false,                                  //(옵션){boolean} 줄번호 보이기 (Default : false)
            rowDragMove: false,                                 //(옵션){boolean} 로우 단위 Drag&drop 이동 기능 활성황 여부
            removeAfterDrag: false,                             //(옵션){boolean} 로우 단위 Drag&drop 이동 후 행 삭제 여부
            enableAddRow: false,                                //(옵션){boolean} 그리고 행 추가 기능 활성화 여부 (Default : false)
            enableRemoveRow: false,                             //(옵션){boolean} 그리드 행 삭제 가능여부 (Default : false)
            enableClipboard: false,                             //(옵션){boolean} 그리드 행/셀 데이터 클립보드 복사 기능 활성화 (Default : false)
            enablePreview: false,                               //(옵션){boolean} 그리드 인쇄 미리보기 기능 활성화 (Default : false)
            enableRefresh: false,                               //(옵션){boolean} 그리드 새로고침 기능 활성화 (Default : false)
            enableExportExcl: true,                            //(옵션){boolean} 그리드 엑셀 내려받기 가능여부 (Default : false)
            excelTitle: "엑셀 타이틀 영역",
            excelSubTitle: "엑셀 서브 타이틀 영역",
            exportFromClient: true,                             //(옵션){boolean} 그리드 데이터 엑셀 다운로드 시 Client 표출 데이터 기준 다운로드 여부 (Default : false)
            context: [{}]
        });

        // fetch 기반 페이지 조회를 위해 pagebar change 이벤트를 명시적으로 바인딩
        journal.bindPagingHandler();
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
    // --------------------------------------------------------------------------------------------------------------------------------------------------------------
    // FILE VIEWER : 레이어 팝업 창 구성을 위한 함수 정의 [기본함수명:defineFile + (구분단어)]
    // --------------------------------------------------------------------------------------------------------------------------------------------------------------
    defineFile : function(){
    },
    // --------------------------------------------------------------------------------------------------------------------------------------------------------------
    // PAGEBAR: 페이지바 구성을 위한 함수 정의 [기본함수명:definePageBar + (구분단어)]
    // --------------------------------------------------------------------------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    // INIT PAGE: 초기데이터 로드를 위한 함수 정의 [기본함수명:initPage + (구분단어)]
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    initPage : function() {
        var today = xui.dateutil.getToday(false);
        $("#requestDateFrom",searchForm).valExt(xui.dateutil.getCalc(today, "M", -3, ""));
        $("#requestDateTo",searchForm).valExt(today);

        // 저널 목록 최초 조회
        journal.selectData(1, 10);
    },
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    // DEFINE EVENT: 화면에 디자인 된 버튼 및 오브젝트 이벤트와 호출할 함수 정의
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------
    defineEvent : function(){
        // 조회 버튼 클릭 시 재조회
        $("#btnJournalSearch, #btnJournalSearchTop").click(function () {
            journal.selectData(1, 10);
        });

        $("#btnSearch").click(function(e){journal.selectData();});
        $("#btnReset").click(function(e){journal.resetSearchForm();});
        $("#btnExcel").click(function () {journal.downloadExcelApiMode(); });

        $("span",".setDate").click(function(e){journal.setDate($(this))});
    },

    /*******************************************************************************
     * Main Functions: 조회/유틸 함수
     ******************************************************************************/
    // 저널 목록 조회
    selectData : function(page, size){
        var gridApi = $("#divGrid01").api ? $("#divGrid01").api() : null;
        if (gridApi && typeof gridApi.init === "function" && !gridApi.__journalInitialized) {
            gridApi.init();
            gridApi.__journalInitialized = true;
            journal.bindPagingHandler();
        }

        var docTypeString = $(".form-group input[type='checkbox']:checked").map(function() {
            return $(this).data("id"); // data-id="paper" 등의 값을 가져옴
        }).get().join(",");

        var payload = {
            start_date: $("#requestDateFrom").val(),
            end_date: $("#requestDateTo").val(),
            doc_types: docTypeString,
            source_url: $("#source_url").val().trim(),
            journal_id: $("#journal_id").val().trim(),
            keyword: $("#keyword").val().trim(),
            creator: $("#creator").val().trim(),
            page: page || 1,
            size: size || 10
        };
        console.log(payload);

        var fetchJournals = function() {
            return journal.requestApi("/xs/aichat/v2/rnd/journals", {
                method: "GET",
                query: payload
            }).then(function(response) {
                // response는 { jsonData: { HEADER, DATA } } 형태이므로 xui.json 생성자가 자동 언랩핑한다.
                var responseJson = new xui.json(response || {});
                if (!responseJson.getErrorFlag()) {
                    journal.setGridData(responseJson);
                } else {
                    xui.dialog.error(responseJson.getMsg(), xui.enum.ERROR.getName());
                }
            });
        };

        var syncTeam = (typeof aichat010 !== "undefined"
            && typeof aichat010.syncViewableTeamBeforeStream === "function")
            ? aichat010.syncViewableTeamBeforeStream()
            : Promise.resolve();

        syncTeam.then(fetchJournals).catch(function(err) {
            xui.dialog.error(err.message || "수집 저널 현황 조회 중 오류가 발생했습니다.", xui.enum.ERROR.getName());
        });
    },

    bindPagingHandler : function() {
        var gridApi = $("#divGrid01").api ? $("#divGrid01").api() : null;
        if (!gridApi || !gridApi.config || !gridApi.config.pageContainer || !gridApi.config.pageContainer.pageController) {
            return;
        }

        var pageController = gridApi.config.pageContainer.pageController;
        if (pageController.__journalPagingBound) {
            return;
        }

        pageController.config.onChange = function(pageNumber, countPerPage) {
            journal.selectData(pageNumber, countPerPage);
        };
        pageController.__journalPagingBound = true;
    },

    // 그리드에 데이터 세팅
    setGridData : function(data){
        var gridApi = $("#divGrid01").api ? $("#divGrid01").api() : null;
        if (!gridApi) {
            return;
        }
        console.log(data);
        var rows = journal.extractRows(data);
        var header = journal.extractHeader(data);

        try {
            // dataGroupName 오염 방지: DATA 그룹 고정
            gridApi.loadData(data, "DATA");
            if (typeof gridApi.getCount === "function"
                && gridApi.getCount() === 0
                && rows.length > 0
                && gridApi.grid
                && typeof gridApi.grid.parse === "function") {
                // loadData가 0건으로 끝나는 환경 대비
                gridApi.grid.clearAll();
                gridApi.grid.parse(rows, "js");
                journal.syncPagingBar(gridApi, header, rows.length);
            }
        } catch (e) {
            var msg = (e && e.message) ? e.message : "";
            // xtrmJson parser 미등록 환경 fallback
            if (msg.indexOf("_process_") === -1 || !gridApi.grid || typeof gridApi.grid.parse !== "function") {
                throw e;
            }
            gridApi.grid.clearAll();
            gridApi.grid.parse(rows, "js");
            journal.syncPagingBar(gridApi, header, rows.length);
        }
         $("#divGrid01 td:not(.xui-tooltip-cell)").removeAttr("xui-tooltip-title");

        // 일부 환경에서 셀 렌더가 비는 현상 보정
        // journal.forceBindGridCells(rows);
    },

    extractRows : function(data) {
        var raw = (data && typeof data.getJson === "function") ? data.getJson() : data;
        if (raw && raw.jsonData) {
            raw = raw.jsonData;
        }
        if (!raw || !Array.isArray(raw.DATA)) {
            return [];
        }
        return raw.DATA;
    },

    extractHeader : function(data) {
        var raw = (data && typeof data.getJson === "function") ? data.getJson() : data;
        if (raw && raw.jsonData) {
            raw = raw.jsonData;
        }
        return (raw && raw.HEADER) ? raw.HEADER : {};
    },

    syncPagingBar : function(gridApi, header, currentCount) {
        if (!gridApi || !gridApi.config || !gridApi.config.paging) {
            return;
        }
        var pageContainer = gridApi.config.pageContainer;
        var pageController = pageContainer ? pageContainer.pageController : null;
        if (!pageController || typeof pageController.setPage !== "function") {
            return;
        }

        var pageNo = parseInt(header.PAGE_NO, 10);
        var totCount = parseInt(header.TOT_COUNT, 10);
        var rowPerPage = parseInt(header.ROW_PER_PAGE, 10);
        if (!pageNo || pageNo < 1) {
            pageNo = 1;
        }
        if (isNaN(totCount) || totCount < 0) {
            totCount = currentCount;
        }
        if (isNaN(rowPerPage) || rowPerPage <= 0) {
            rowPerPage = pageController.getCountPerPage ? pageController.getCountPerPage() : 20;
        }
        pageController.setPage(pageNo, currentCount, totCount, rowPerPage, false);
    },

    downloadExcel : function() {
        var gridApi = $("#divGrid01").api ? $("#divGrid01").api() : null;
        if (!gridApi || typeof gridApi.exportExcel !== "function") {
            xui.dialog.warning("", "다운로드 기능을 사용할 수 없습니다.");
            return;
        }

        var titleName = "수집 저널 현황";
        var subTitleName = xui.dateutil.getToday(true);
        if (typeof gridApi.setExcelTitle === "function") {
            gridApi.setExcelTitle(titleName, subTitleName);
        }
        gridApi.exportExcel(titleName);
    },


    downloadExcelApiMode : function() {
        var gridApi = $("#divGrid01").api ? $("#divGrid01").api() : null;
        if (!gridApi) return;

        // 1. 선택된(체크된) 데이터 가져오기
        var checkedData = gridApi.getCheckedData();
        if (!checkedData || checkedData.length === 0) {
            xui.dialog.warning("선택된 데이터가 없습니다.");
            return;
        }

        // [추가] 100개 초과 선택 체크
        var checkList = Array.isArray(checkedData) ? checkedData : [checkedData];
        if (checkList.length > 100) {
            xui.dialog.warning("데이터는 한 번에 최대 100개까지만 선택하여 다운로드할 수 있습니다.<br/>(현재 선택: " + checkList.length + "개)");
            return;
        }

        // 1. 데이터 복사 및 HTML 태그 제거 로직 추가
        var selectedData = [];
        var rawData = Array.isArray(checkedData) ? checkedData : [checkedData];

        // HTML 태그 제거를 위한 정규식
        var regexHtml = /<[^>]*>?/gm;

        rawData.forEach(function(item) {
            // 원본 데이터 보존을 위해 객체 복사
            var newItem = xui.util.copyObject({}, item);

            // 특정 필드의 HTML 태그 제거
            if (newItem.doc_type) {
                newItem.doc_type = newItem.doc_type.replace(regexHtml, '').trim();
            }
            if (newItem.title) {
                newItem.title = newItem.title.replace(regexHtml, '').trim();
            }

            selectedData.push(newItem);
        });

        // (참고) 만약 getCheckedData가 단일 객체면 배열로 래핑
//        if (!Array.isArray(selectedData)) {
//            selectedData = [selectedData];
//        }

        // 2. 그리드 설정 정보 추출 (헤더 명칭, 컬럼 모델 등)
        var gridConfigData = gridApi._getGridConfigData();

        // 3. XUI 표준 전송 객체 생성
        var param = new xui.json();
        param.setURL(xui.com.getRequestPrefix() + "/exportExcelGridData.json");

        // 기본 메타 정보
        param.setString("excelFileName", "수집_저널_목록_" + xui.dateutil.getNow());
        param.setString("title", "수집 저널 현황");
        param.setBoolean("excelVisibleKey", true);

        // [중요] 쿼리 정보는 비우고, 선택된 데이터를 GRID_DATA라는 키로 직접 저장
        param.setDataJsonArray(selectedData, "GRID_DATA");

        // 그리드 컬럼 구성 정보 (엑셀 레이아웃용)
        param.setDataJsonArray(gridConfigData.COL_MODEL, "COL_MODEL");
        param.setString("COL_NAMES", gridConfigData.COL_NAMES);

        // 출력 권한 설정
        param.setAuthType(xui.enum.AUTH_TYPE_OUTPUT.getCode());
        console.log(param);

        // 4. XUI 표준 엑셀 내보내기 실행
        xui.ajax._exportExcel(param);
    },

    // 파서 상태와 무관하게 표시 셀 텍스트를 최종 동기화
    forceBindGridCells : function(rows) {
        if (!Array.isArray(rows) || rows.length === 0) return;

        var keys = ["id", "doc_type", "id", "title", "overview", "author", "source_info", "source_table", "date", "ai_summary"];

        setTimeout(function() {
            var rowNodes = $("#divGrid01 .objbox table tbody tr");
            if (!rowNodes || rowNodes.length === 0) return;

            var rowCount = Math.min(rowNodes.length, rows.length);
            for (var r = 0; r < rowCount; r++) {
                var cells = $(rowNodes[r]).children("td");
                for (var c = 0; c < keys.length && c < cells.length; c++) {

                    // [수정 포인트] doc_type과 ai_summary는 건드리지 않음!
                    if (keys[c] === "doc_type" || keys[c] === "ai_summary") {
                        continue;
                    }

                    var value = rows[r] ? rows[r][keys[c]] : "";
                    cells[c].textContent = (value === null || typeof value === "undefined") ? "" : String(value);
                }
            }
        }, 0);
    },

    /**
     * journal 전용 REST 호출 헬퍼
     * - /xs/aichat/** 엔드포인트를 fetch로 호출
     */
    requestApi: function(path, options) {
        options = options || {};
        var method = options.method || "GET";
        var query = options.query || null;
        var body = options.body || null;
        var baseUrl = xui.com.getContextPath() || "";
        var normalizedBase = baseUrl;
        var normalizedPath = path || "";
        if (normalizedBase.endsWith("/") && normalizedPath.startsWith("/")) {
            normalizedPath = normalizedPath.substring(1);
        }
        if (!normalizedBase.endsWith("/") && !normalizedPath.startsWith("/")) {
            normalizedBase = normalizedBase + "/";
        }
        var url = normalizedBase + normalizedPath;
        if (method === "GET" && query) {
            // 값이 있는 것만 필터링 (null, undefined, 빈문자열 제외)
            var cleanQuery = Object.keys(query)
                .filter(key => query[key] !== "" && query[key] !== null && query[key] !== undefined)
                .reduce((obj, key) => {
                    obj[key] = query[key];
                    return obj;
                }, {});

            var qs = new URLSearchParams(cleanQuery).toString();
            if (qs) {
                url += (url.indexOf("?") === -1 ? "?" : "&") + qs;
            }
        }

        return fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: (method === "GET") ? null : (body ? JSON.stringify(body) : null)
        }).then(function(res) {
            if (!res.ok) {
                return res.text().then(function(text) {
                    var serverMsg = null;
                    try {
                        var errData = text ? JSON.parse(text) : null;
                        if (errData && Array.isArray(errData.DATA) && errData.DATA.length > 0) {
                            var firstData = errData.DATA[0] || {};
                            serverMsg = firstData.message || firstData.MESSAGE || null;
                        }
                        if (!serverMsg && errData && errData.HEADER) {
                            serverMsg = errData.HEADER.ERROR_MSG || errData.HEADER.errorMsg;
                        }
                    } catch (ignore) {}
                    throw new Error(serverMsg || ("HTTP " + res.status));
                });
            }
            return res.json();
        });
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
//               .addClass("--active " + directionClass)
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

    nullToHyphen: function (rowIdx, rowId, rowData, cellIdx, cellId, value) {
        var value = rowData[cellId];
        if (value === null || value === undefined || value === "") return "-";
        return value;
    },

    // col_1(구분) 예시
    typeFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var docType = rowData.doc_type;
//        xui.util.log("docType:",docType);
        var tagType = '';
        var textType = '';

        if ( docType === 'paper' ) {
            tagType = 'journal';
            textType = xui.message.get("hyobee.journal.type.paper");
        }
        else if ( docType === 'patent' ) {
            tagType = 'patent';
            textType = xui.message.get("hyobee.journal.type.patent");
        }
        else {
            tagType = 'news';
            textType = xui.message.get("hyobee.journal.type.article");
        }

        var returnValue = "<span class='tag' data-tag-type='" + tagType + "'>" + textType + "</span>"
        return returnValue;
    },

    titleFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var title = rowData.title || "";

        // 1. HTML 태그 제거 (정규식)
        var pureText = title.replace(/<[^>]*>?/gm, '');

        // 2. 따옴표 치환 (툴팁 속성이 깨지지 않도록 처리)
        var tooltipText = pureText.replace(/"/g, '&quot;');

        var returnValue = '<span class="--emphasis --underline" xui-tooltip-title="' + tooltipText + '">' + pureText + '</span>';
        return returnValue;
    },

    overviewFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var overviewRaw = rowData.overview || "";

        // 1. HTML 태그 제거 (정규식)
        var pureText = overviewRaw.replace(/<[^>]*>?/gm, '');

        // 2. 따옴표 치환 (툴팁 속성이 깨지지 않도록 처리)
        var tooltipText = pureText.replace(/"/g, '&quot;');

        // 3. 반환 HTML 구성
        // line-clamp 적용을 위해 클래스 추가 (grid-multiline-ellipsis)
        var returnValue =
               '<span class="--isFocusable grid-multiline-ellipsis" xui-tooltip-title="' + tooltipText + '">' +
                pureText +
               '</span>';

        return returnValue;
    },

    // col_7(AI 요약) 예시
    tooltipFn:function(rowIdx, rowId, rowData, cellIdx, cellId){
        var returnValue;
        // TODO:PB [AI비서] 실제 AI 요약 툴팁 필요
        returnValue =
            '<div class="xui-grid-button" tabIndex="0" onClick="journal.openRecoSummary(this,event)">' +
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
     * 조회조건 초기화
     * @param {boolean} isClear 조회조건 클리어 여부
     * @retrun 없음
     */
    resetSearchForm : function(){
        // 요청일자
        var today = xui.dateutil.getToday(false);
        $("#requestDateFrom",searchForm).valExt(xui.dateutil.getCalc(today, "M", -3, ""));
        $("#requestDateTo",searchForm).valExt(today);

        $(".form-group input[type='checkbox']").prop("checked", true);

        $("#source_url, #journal_id, #keyword, #creator", searchForm)
            .val("")
            .closest(".xui-input-label")
            .removeClass("notempty");
    },

    setDate: function(element) {
        var today = new Date();
        var stdDateTo = this.formatYYYYMMDD(today); // 오늘 (YYYYMMDD)
        var stdDateFrom = "";

        var btnDataId = $.trim(element.data("id"));
        xui.util.log("btnDataId : ", btnDataId);

        // 계산용 날짜 객체 생성
        var calcDate = new Date();

        switch(btnDataId) {
            case "6개월":
            case "6m":
                calcDate.setMonth(calcDate.getMonth() - 6);
                break;
            case "최근1년":
            case "1y":
                calcDate.setFullYear(calcDate.getFullYear() - 1);
                break;
            case "최근3년":
            case "3y":
                calcDate.setFullYear(calcDate.getFullYear() - 3);
                break;
            case "최근5년":
            case "5y":
                calcDate.setFullYear(calcDate.getFullYear() - 5);
                break;
            default:
                calcDate = today;
                break;
        }

        stdDateFrom = this.formatYYYYMMDD(calcDate);

        xui.util.log("stdDateFrom : ", stdDateFrom);
        console.log(stdDateFrom + " / " + stdDateTo);

        // 값 세팅
        $("#requestDateFrom").valExt(stdDateFrom);
        $("#requestDateTo").valExt(stdDateTo);
    },

    // YYYYMMDD 포맷으로 변환하는 보조 함수
    formatYYYYMMDD: function(date) {
        var y = date.getFullYear();
        var m = ("0" + (date.getMonth() + 1)).slice(-2);
        var d = ("0" + date.getDate()).slice(-2);
        return "" + y + m + d;
    },

    resolveDocType: function(rawDocType) {
        if (rawDocType === null || rawDocType === undefined) {
            return "";
        }
        var text = String(rawDocType).trim();
        if (!text) {
            return "";
        }

        // convertFn 결과(<span data-tag-type="...">)인 경우
        if (text.indexOf("<") >= 0) {
            var fromDataAttr = $(text).data("tag-type");
            if (fromDataAttr) return String(fromDataAttr).toLowerCase();
            text = text.replace(/<[^>]*>?/gm, "").trim();
        }

        var lowered = text.toLowerCase();
        if (lowered === "paper" || lowered === "journal" || lowered === "논문") return "paper";
        if (lowered === "patent" || lowered === "특허") return "patent";
        if (lowered === "article" || lowered === "news" || lowered === "기사") return "article";

        return lowered;
    },

    // 저널현황 상세팝업
    openSmartPopup: function(rowData) {
        var docType = journal.resolveDocType(rowData.doc_type);
        var id = rowData.id;

        if (docType === "internal") {
            var internalUrl = journal.resolveInternalBoardUrl(rowData);
            if (!internalUrl) {
                xui.dialog.alert("게시판 링크를 생성할 수 없습니다.");
                return;
            }
            window.open(internalUrl, "_blank");
            return;
        }

        var popupUrl = "";
        var popupTitle = "";

        // 1. doc_type에 따른 JSP 매핑 분기
        if (docType === "paper" || docType === "journal") {
            popupUrl = "/xs/aichat/v2/popup/aichatPopUpPaper.jsp";
            popupTitle = "논문 상세 정보";
        } else if (docType === "patent") {
            popupUrl = "/xs/aichat/v2/popup/aichatPopUpPatent.jsp";
            popupTitle = "특허 상세 정보";
        } else if (docType === "article" || docType === "news") {
            popupUrl = "/xs/aichat/v2/popup/aichatPopUpNews.jsp";
            popupTitle = "기사 상세 정보";
        } else {
            xui.dialog.alert("지원하지 않는 문서 타입입니다: " + docType);
            return;
        }

        // 2. 전체 URL 조립 (ContextPath 포함)
        var baseUrl = window.location.origin + "/webapps";
        var finalUrl = baseUrl + popupUrl + "?journal_id=" + id;

        // 3. 팝업 실행 (새 창 방식)
        var popupName = "popup_" + docType + "_" + id;
        // var specs = "width=1100, height=850, resizable=yes, scrollbars=yes, status=no";
        // var width = 1300;
        // var height = 850;
        // var left = (window.screen.width / 2) - (width / 2);
        // var top = (window.screen.height / 2) - (height / 2);
        // var specs = "width=" + width + ", height=" + height + ", left=" + left + ", top=" + top + ", resizable=yes";
        // window.open(finalUrl, popupName, specs, "_blank");
        window.open(finalUrl, "_blank");
    },

    resolveInternalBoardUrl: function(rowData) {
        var url = rowData && rowData.url != null ? String(rowData.url).trim() : "";
        if (url && /^https?:\/\//i.test(url)) {
            return url;
        }

        var msgId = rowData && rowData.id != null ? String(rowData.id).trim() : "";
        var boardId = rowData && (rowData.board_id || rowData.boardId) != null
            ? String(rowData.board_id || rowData.boardId).trim()
            : "";

        if (msgId && boardId) {
            return "https://hope2.hyosung.com/WebSite/Basic/Board/BoardView.aspx?system=Board"
                + "&fdid=" + encodeURIComponent(boardId)
                + "&MsgId=" + encodeURIComponent(msgId);
        }

        if (msgId && url) {
            var fdidMatch = url.match(/[?&]fdid=([^&#]+)/i);
            if (fdidMatch && fdidMatch[1]) {
                return "https://hope2.hyosung.com/WebSite/Basic/Board/BoardView.aspx?system=Board"
                    + "&fdid=" + encodeURIComponent(decodeURIComponent(fdidMatch[1]))
                    + "&MsgId=" + encodeURIComponent(msgId);
            }
        }

        return url || "";
    },

    /**
     * Sample(해당 함수는 삭제하지 말고 그대로)
     */
    sample : function(){
    }
};
