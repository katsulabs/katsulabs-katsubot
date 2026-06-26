/***************************************************************************************************************************************************************
* @classDescription VOC 원문 상세
* @author HyosungITX Corp.
* @version 1.0
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Modification Information
* Date              Developer           Content
* ----------        -------------       -------------------------
* 2019/02/21        xtrmAI팀             신규생성
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Copyright (C) 2018 by HyosungITX Corp. All rights reserved.
****************************************************************************************************************************************************************/
"use strict";
/*******************************************************************************
 * Global Variable : 스크립트 영역에서 모두 접근할 수 있는 전역변수를 해당 영역에 모두 정의한다.
 ******************************************************************************/
var IMPORT			= "";
var mpositions01	= 0;		//summaryArea위치값
var mpositions02 	= 0;		//originalArea위치값
var mpositions03 	= 0;		//etcArea위치값

/*******************************************************************************
 * Document Ready : jquery에서 제공하는 함수를 이용하여 화면이 로드될 때 처리할 함수를 정의한다.
 ******************************************************************************/
function PageReady(){
	aichatPopUpNews.completePageRender();
}
function PageUnload(){
	//@ TODO 필요시 페이지 종료전 로직 추가
}

/**
 * 클래스 구조의 스크립트 구조체 오브젝트 명을 정의한다.
 * 스크립트를 클래스 기반의 구조체로 정의하기 위해 해당 JavaScript의 클래스명은 파일명으로 정의한다.
 * @classDescription :
 */
var aichatPopUpNews={
    msg: function(key){
        return xui.message.get(key);
    },
	/*******************************************************************************
	 * completePageRender Function : 화면이 초기 로드 시점에 처리할 사항을 정의한다.
	 ******************************************************************************/
	completePageRender : function(){
		//페이지 상수 정의
		aichatPopUpNews.setPageEnum();
		//탭 화면 디자인
		aichatPopUpNews.defineTab();
		//그리드 디자인
		aichatPopUpNews.defineGrid();
		//트리뷰 디자인
		aichatPopUpNews.defineTree();
		//다이얼로그레이어 디자인
		aichatPopUpNews.defineDialog();
		//파일업다운로드뷰어 디자인
		aichatPopUpNews.defineFile();
		//초기데이터 설정
		aichatPopUpNews.initPage();
		//이벤트 정의
		aichatPopUpNews.defineEvent();
	},
// -----------------------------------------------------------------------
// ENUM: 열거형 class 상수 정의 [기본함수명:setPageEnum]
// -----------------------------------------------------------------------
	setPageEnum : function(){
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
        aichatPopUpNews.setLoadingState(true);
		//부모창에서 받은 파라메터 정보
		xui.util.log("부모창에서 전달받은 뭐게");
		var journalId = aichatPopUpNews.getParameterByName("journal_id");
		xui.util.log("부모창에서 전달받은 ID:", journalId);

		//상세정보를 검색한다.
		aichatPopUpNews.selectData(journalId).then(function(result){
            // 상세 조회 실패(404 등) 시 연관문서 호출 중단
            if (result && result.ok) {
                aichatPopUpNews.selectRelatedItemData(journalId);
            }
        });

	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEFINE EVENT: 화면에 디자인 된 버튼 및 오브젝트 이벤트와 호출할 함수 정의
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineEvent : function(){
        // 인쇄 버튼 클릭 시 (.journal-detail 영역만 인쇄)
        $("#btn_print").on("click", function() {
            aichatPopUpNews.printContents(".journal-detail");
        });

        // 다운로드 버튼 클릭 시
        $("#btn_download").on("click", function() {
            aichatPopUpNews.downloadContents();
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
	selectData : function(journalId){
	    // PathVariable 형태로 호출하기 위해 URL에 ID를 포함합니다.
        var url = "/xs/aichat/v2/rnd/journal/" + journalId;

        return aichatPopUpNews.requestApi(url, {
            method: "GET",
        }).then(function(response) {
            // response는 { jsonData: { HEADER, DATA } } 형태이므로 xui.json 생성자가 자동 언랩핑한다.
            var responseJson = new xui.json(response || {});
            if (!responseJson.getErrorFlag()) {
                xui.util.log(responseJson);
                var dataList = response.jsonData.DATA;
                if (dataList && dataList.length > 0) {
                    var detailData = dataList[0].journal_detail; // 여기서 실제 데이터 추출
//                    xui.util.log(detailData);
                    aichatPopUpNews.setDetailData(detailData);
                    // 기본 상세 필드 매핑 이후 AI 요약 조회
                    aichatPopUpNews.selectAiSummaryData(journalId);
                } else {
                    aichatPopUpNews.setLoadingState(false);
                }
                return { ok: true };
            } else {
                aichatPopUpNews.setLoadingState(false);
                xui.dialog.error(responseJson.getMsg(), xui.enum.ERROR.getName());
                return { ok: false };
            }
        }).catch(function(err) {
            aichatPopUpNews.setLoadingState(false);
            xui.dialog.error(err.message || aichatPopUpNews.msg("hyobee.journal.error.status_load_failed"), xui.enum.ERROR.getName());
            return { ok: false };
        });
	},
	validationSelectData : function(journalId){
		return true;
	},

	selectRelatedItemData : function(journalId){
        // PathVariable 형태로 호출하기 위해 URL에 ID를 포함합니다.
        var url = "/xs/aichat/v2/rnd/journal/" + journalId + "/related-items";

        aichatPopUpNews.requestApi(url, {
            method: "GET",
        }).then(function(response) {
            // response는 { jsonData: { HEADER, DATA } } 형태이므로 xui.json 생성자가 자동 언랩핑한다.
            var responseJson = new xui.json(response || {});
            if (!responseJson.getErrorFlag()) {
                xui.util.log(responseJson);
                var dataList = response.jsonData.DATA;
                if (dataList && dataList.length > 0) {
                    var detailData = dataList[0].related_items || dataList[0].relatedItems || dataList[0].items || [];
                    xui.util.log(detailData);
                    aichatPopUpNews.setRelatedItemData(detailData);
                }
            } else {
                xui.dialog.error(responseJson.getMsg(), xui.enum.ERROR.getName());
            }
        }).catch(function(err) {
            xui.dialog.error(err.message || aichatPopUpNews.msg("hyobee.journal.error.related_load_failed"), xui.enum.ERROR.getName());
        });
    },

    /**
     * AI 요약 조회 (/ai-summary) 후 #article0 에 append
     */
    selectAiSummaryData: function(journalId) {
        var url = "/xs/aichat/v2/rnd/journal/" + journalId + "/ai-summary";
        aichatPopUpNews.requestApi(url, {
            method: "GET",
            query: {
                doc_type: "article"
            }
        }).then(function(response) {
            var responseJson = new xui.json(response || {});
            if (!responseJson.getErrorFlag()) {
                var payload = null;
                if (response && response.jsonData && Array.isArray(response.jsonData.DATA)) {
                    payload = response.jsonData.DATA.length > 0 ? response.jsonData.DATA[0] : null;
                } else if (response && response.ai_summary) {
                    payload = response;
                }
                aichatPopUpNews.renderAiSummary(payload);
            } else {
                aichatPopUpNews.renderAiSummary(null);
            }
        }).catch(function(err) {
            console.error("❌ ai-summary 조회 실패:", err);
            aichatPopUpNews.renderAiSummary(null);
        });
    },

    /**
     * #article0(.journal-summary)에 AI 요약 섹션 append
     */
    renderAiSummary: function(payload) {
        var $summary = $("#article0.journal-summary");
        if ($summary.length === 0) {
            return;
        }
        $summary.show();
        $summary.find(".journal-summary-content").remove();

        var sections = [];
        if (payload && Array.isArray(payload.ai_summary)) {
            sections = payload.ai_summary.slice().sort(function(a, b) {
                var ia = Number(a && a.idx);
                var ib = Number(b && b.idx);
                if (isNaN(ia)) ia = 0;
                if (isNaN(ib)) ib = 0;
                return ia - ib;
            });
        }
        if (!sections.length) {
            sections = [{ role: "OVERVIEW", content: "-" }];
        }

        var roleToLabel = {
            PURPOSE: aichatPopUpNews.msg("hyobee.journal.common.ai_summary.tag.objective"),
            METHOD: aichatPopUpNews.msg("hyobee.journal.common.ai_summary.tag.method"),
            PROBLEM: aichatPopUpNews.msg("hyobee.journal.common.ai_summary.tag.problem"),
            SOLUTION: aichatPopUpNews.msg("hyobee.journal.common.ai_summary.tag.solution"),
            OVERVIEW: ""
        };

        sections.forEach(function(section) {
            var content = (section && section.content != null) ? String(section.content) : "-";
            var roleKey = (section && section.role != null) ? String(section.role).toUpperCase() : "";
            var label = (section && section.label != null) ? String(section.label).trim() : "";
            if (!label) {
                label = roleToLabel[roleKey] || "";
            }
            var $row = $('<div class="journal-summary-content"></div>');
            if (roleKey !== "OVERVIEW" && label) {
                $row.append($('<span class="journal-summary-tag"></span>').text(label));
            }
            $row.append($('<p class="journal-summary-description"></p>').text(content || "-"));
            $summary.append($row);
        });
    },
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// SAVE: 데이터 저장 처리에 대한 함수 정의 [기본함수명:saveData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	saveDataFeedback : function(){
	},
	//저장처리전 필수체크
	validationSaveDataFeedback : function(){
	},

	//북마크 저장
	saveDataBookmark : function(){
	},
	validationSaveDataBookmark : function(contentsKey){
		return true;
	},

	saveDataSummary : function(type){
	},
	//저장처리전 필수체크
	validationSaveDataSummary : function(type){
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// DELETE: 삭제 데이터 처리에 대한 함수 정의 [기본함수명:deleteData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	deleteData : function(type){
	},
	validationDeleteData : function(){
		return true;
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// PRINT: 출력 및 레포트 데이터 처리에 대한 함수 정의 [기본함수명:printData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	printData : function(){
		vobCmmn.printData("rootWrapper");
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// EXCEL: 엑셀 IMPORT / EXPORT 처리에 대한 함수 정의 [기본함수명:exportData + (구분단어) importData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------

/****************************************************************************************************************************************************************
 * User Functions: 별도 화면 처리를 위해 필요한 함수를 정의한다.
 ****************************************************************************************************************************************************************/
    // URL에서 특정 파라미터 값을 추출하는 함수
    getParameterByName: function (name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
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

    setLoadingState: function(isLoading) {
        $(".journal-detail").toggleClass("--loading", !!isLoading);
    },

    /**
     * 히어로 이미지: 로드 완료 전까지는 기본 placeholder가 보이지 않도록 --pending 처리.
     * 실패 시 placehold.co로 대체 후 표시.
     */
    bindNewsHeroImage: function(imageUrl) {
        var defaultImageUrl = "";
        var $newsImage = $("#image_url");
        var $wrap = $newsImage.closest(".journal-detail-image");

        function reveal() {
            $wrap.removeClass("--pending");
        }

        if (imageUrl === undefined || imageUrl === null || imageUrl === "") {
            $newsImage.off("load.newsHero error.newsFallback");
            $wrap.removeClass("--pending").hide();
            return;
        }

        $wrap.addClass("--pending").show();

        $newsImage
            .off("load.newsHero error.newsFallback")
            .on("load.newsHero", function() {
                reveal();
            })
            .on("error.newsFallback", function() {
                var $img = $(this);
                $img.off("error.newsFallback load.newsHero");
                $img.on("load.newsHero", function() {
                    reveal();
                });
                $img.one("error", function() {
                    reveal();
                });
                $img.attr("src", defaultImageUrl);
                var fel = $img[0];
                if (fel && fel.complete && fel.naturalWidth > 0) {
                    reveal();
                }
            })
            .attr({
                src: imageUrl,
                decoding: "async",
                fetchpriority: "high"
            });

        var el = $newsImage[0];
        if (el && el.complete && el.naturalWidth > 0) {
            reveal();
        }
    },

    setDetailData: function(data) {
        if (!data) {
            aichatPopUpNews.setLoadingState(false);
            return;
        }

        // 1. 기본 텍스트 정보 매핑
        $("#title").text(data.title || aichatPopUpNews.msg("hyobee.journal.default.no_title"));
        $(".journal-heading").text(data.title || aichatPopUpNews.msg("hyobee.journal.default.no_title"));
        $("#source_id").text(data.source_id || "-");

        // url
        if (data.url === undefined || data.url === null || data.url === "") {
            $("#url").hide();
        } else {
            $("#url").attr("href", data.url);
        }

        // 발행일
        if (data.date === undefined || data.date === null) {
            $("#date").closest("li.journal-info-item").hide();
        } else {
            var dateOnly = data.date.split(" ")[0]; // "2026-02-13"만 추출
            $("#date").text(dateOnly);
        }

        // 저자
        if (data.author === undefined || data.author === null) {
            $("#author").closest("li.journal-info-item").hide();
        } else {
            $("#author").text(data.author);
        }

        // 언론사
        if (data.source_table === undefined || data.source_table === null) {
            $("#source_table").closest("li.journal-info-item").hide();
        } else {
            $("#source_table").text(data.source_info);
        }

        // 피인용 수
        var citingDocCount = data.citing_doc_count || 0;
        if (data.citing_doc_count === undefined || data.citing_doc_count === null) {
            $("#citing_doc_count").closest("li.journal-info-item").hide();
        } else {
            $("#citing_doc_count").text(citingDocCount);
        }

        // 제목
        if (data.news_main_topic === undefined || data.news_main_topic === null) {
            $("#news_main_topic").closest("li.journal-info-item").hide();
        } else {
            $("#news_main_topic").text(data.news_main_topic);
        }

        // 부제목 : 임시로 URL
        if (data.source_id === undefined || data.source_id === null) {
            $("#source_id").closest("li.journal-info-item").hide();
        } else {
            $("#source_id").text(data.source_id);
        }

        // 내용
//        $("#content").html(data.content || "");
        $("#content").html(
          data.content.split("\n\n").map(p => "<p class='journal-article-description'>" + p + "</p>").join("")
        );
        $("#content").html(
          data.content.split("\n").map(p => "<p class='journal-article-description'>" + p + "</p>").join("")
        );

        // AI 요약은 /ai-summary 별도 호출로 렌더링하므로 여기서 summary 영역을 숨기지 않는다.
        if (data.ai_summary !== undefined && data.ai_summary !== null) {
            $("#ai_intro").text(data.ai_summary.intro || "");
            $("#ai_body").text(data.ai_summary.body || "");
            $("#ai_conclusion").text(data.ai_summary.conclusion || "");
        }

        // 연관 키워드 처리
        var $keywordContainer = $(".journal-keywords"); // 클래스 선택자 사용

        if (data.keywords && data.keywords.length > 0) {
            var html = "";
            data.keywords.forEach(function(word) {
                // 기존 퍼블리싱 구조인 <div class="journal-keyword"> 로 생성
                html += '<div class="journal-keyword">' + word + '</div>';
            });
            $keywordContainer.html(html);
            $("#article3").show(); // 데이터가 있으면 영역 표시
        } else {
            $keywordContainer.html(""); // 데이터 없으면 비우기
            $("#article3").hide();      // 또는 영역 전체 숨김
        }

        // 우측 네비게이터 article 개수와 동일하게 노출
        // ---------------------------------------------------
        // 1. 기존 노출 로직 (article 개수와 동일하게 노출)
        $('.journal-navigator-button[data-id="article0"]').addClass('xui-visible');
        $('.journal-article:not([style*="none"])').each(function(){
             $('.journal-navigator-button[data-id="' + $(this).attr('id') + '"]').addClass('xui-visible');
        });

        // 2. 호버 위치 계산 로직
        // var $tooltip = $('#journal-tooltip');
        // $(document).on('mouseenter', '.journal-navigator-button.xui-visible', function() {
        //     var $this = $(this);
        //     var text = $this.find('.journal-navigator-title').text(); // span 내부 텍스트 추출
        //     var pos = $this.offset(); // 버튼의 전체 화면상 위치
        //     var width = $this.outerWidth(); // 버튼의 너비
        //     var height = $this.outerHeight(); // 버튼의 높이
        //     $tooltip.text(text).show();
        //     // 툴팁 위치 설정: 버튼의 top 중앙, 버튼의 왼쪽(left) 끝에서 툴팁 너비만큼 더 왼쪽으로
        //     $tooltip.css({
        //         top: pos.top + (height / 2) - ($tooltip.outerHeight() / 2) + 'px',
        //         left: pos.left - $tooltip.outerWidth() - 10 + 'px' // 버튼 왼쪽으로 10px 간격
        //     });
        // }).on('mouseleave', '.journal-navigator-button', function() {
        //     $tooltip.hide();
        // });

        // ---------------------------------------------------


        aichatPopUpNews.bindNewsHeroImage(data.image_url);
        aichatPopUpNews.setLoadingState(false);
    },

	/**
	 * setRelatedItemData : 연관저널 관련 함수
	 */
	setRelatedItemData: function (dataList) {
        var $wrapper = $("#article2");
        var $container = $wrapper.find(".news-list");

        // 데이터가 없으면 비우고 숨기기
        if (!dataList || dataList.length === 0) {
            $container.empty();
            $wrapper.hide();
            return;
        }
        var html = "";

        for (var i = 0; i < Math.min(dataList.length, 3); i++) {
            var item = dataList[i];
            var formattedDate = item.date ? item.date.substring(0, 10).replace(/-/g, '.') : "-";

            // 1. 공통 내부 컨텐츠 생성 (기존 div 구조 유지)
            var itemInnerHtml =
                '    <div class="news-item --type' + i + '" data-id="' + item.doc_id + '">' +
                '        <div class="news-scroll">' +
                '            <p class="news-title">' + (item.title || aichatPopUpNews.msg("hyobee.journal.default.no_title")) + '</p>' +
                '            <p class="news-author">' + (item.authors || aichatPopUpNews.msg("hyobee.journal.default.no_author_info")) + '</p>' +
                '            <p class="news-date">' + formattedDate + '</p>' +
                '        </div>' +
                '    </div>';

            var relatedItemsUrl = aichatPopUpNews.setRelatedItemsUrl(item.doc_type, item.doc_id);
            if (relatedItemsUrl && relatedItemsUrl.trim() !== "" && relatedItemsUrl !== "#") {
                // URL이 있을 때만 <a> 태그와 cursor:pointer 적용
                html += '<a href="' + relatedItemsUrl + '" target="_blank" class="news-link-wrapper" style="text-decoration:none; color:inherit; cursor:pointer;">';
                html += itemInnerHtml;
                html += '</a>';
            } else {
                // URL이 없으면 <a> 태그 없이 일반 div만 출력 (클릭 불가)
                html += '<div class="news-link-wrapper" style="cursor:default;">';
                html += itemInnerHtml;
                html += '</div>';
            }
        }
        $container.html(html);
        $wrapper.show();
    },

    setRelatedItemsUrl : function(doc_type, doc_id){
        var relatedItemsUrl ="";
        if (doc_type ==='paper'){
            relatedItemsUrl = '/webapps/xs/aichat/v2/popup/aichatPopUpPaper.jsp?journal_id=' +doc_id;
        } else if (doc_type ==='patent'){
            relatedItemsUrl = '/webapps/xs/aichat/v2/popup/aichatPopUpPatent.jsp?journal_id=' +doc_id;
        } else if (doc_type ==='article'){
            relatedItemsUrl = '/webapps/xs/aichat/v2/popup/aichatPopUpNews.jsp?journal_id=' +doc_id;
        } else {relatedItemsUrl ="";}

        return relatedItemsUrl;
    },

    /**
     * 상세 화면 인쇄
     * @param {String} selector 인쇄할 영역의 jQuery 선택자
     */
    printContents: function(selector) {
        // 1. 인쇄할 영역 설정 (JSP 구조상 .journal-detail 전체를 잡는 것이 좋습니다)
        var $target = $(selector || ".journal-detail");
        if ($target.length === 0) return;

        // 1. 파일명용 제목 추출 및 가공 (News-제목10자)
        var rawTitle = $("#title").text().trim() || aichatPopUpNews.msg("hyobee.news.detail");
        var cleanTitle = rawTitle.replace(/[/\\?%*:|"<>\s]/g, '_').substring(0, 10);
        var printTitle = "News-" + cleanTitle;

        // 2. 현재 페이지의 모든 CSS(link, style) 복사
        var headHtml = "";
        $("link[rel='stylesheet'], style").each(function() {
            headHtml += this.outerHTML;
        });

        var bodyHtml = $target.html();

        // 3. 새 창 열기
        var printWindow = window.open('', '_blank', 'width=1000,height=900');

        printWindow.document.write('<!DOCTYPE html><html><head><title>' + printTitle + '</title>');        printWindow.document.write(headHtml); // 모든 CSS 주입
        printWindow.document.write(headHtml);
        printWindow.document.write('<style>');
        // 인쇄 시 버튼 및 네비게이터 숨기기
        printWindow.document.write('  @media print { .journal-util, .journal-navigator, button, .xui-button { display: none !important; } }');
        printWindow.document.write('  body { background: #fff !important; padding: 20px; overflow: visible !important; }');
        printWindow.document.write('  .journal-detail { width: 100% !important; height: auto !important; box-shadow: none !important; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body id="journalDetailBody">'); // JSP와 동일한 ID 부여

        // JSP에 정의된 부모 클래스(--article)를 그대로 재현하여 디자인 깨짐 방지
        printWindow.document.write('    <div class="journal-detail --article">');
        printWindow.document.write(bodyHtml);
        printWindow.document.write('    </div>');
        printWindow.document.write('</body></html>');

        printWindow.document.close();

        // 4. 리소스 로딩 대기 후 실행 (핵심)
        $(printWindow).on("load", function() {
            // 이미지나 웹폰트가 로드될 수 있도록 0.5초 더 대기
            setTimeout(function() {
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            }, 500);
        });
    },

    /**
     * 상세 내용 텍스트 다운로드
     */
    downloadContents: function() {
        var title = $("#title").text() || aichatPopUpNews.msg("hyobee.common.detail");
        var author = $("#author_names").text() || "-";
        var date = $("#date").text() || "-";
//        var content = $("#content").html() || "";
        var content_html = $("#content").html() || "";

        // <p> 태그를 기준으로 문단을 나누고, 양쪽 공백 제거 후 다시 합치기
        var content = content_html
                    .replace(/<\/p>\s*<p>/g, "\n\n") // 문단 사이를 줄바꿈 두 개로
                    .replace(/<p>/g, "")             // 시작 <p> 제거
                    .replace(/<\/p>/g, "");          // 끝 </p> 제거

        console.log(content);


        // 텍스트 조립
        var fullText = "------------------------------------------\n";
        fullText += " " + aichatPopUpNews.msg("hyobee.common.title") + " : " + title + "\n";
        fullText += " " + aichatPopUpNews.msg("hyobee.common.author") + " : " + author + " | " + aichatPopUpNews.msg("hyobee.common.date") + " : " + date + "\n";
        fullText += "------------------------------------------\n\n";
        fullText += " [" + aichatPopUpNews.msg("hyobee.journal.detail.download.body_content") + "] \n" + content;

        // 파일 다운로드 실행
        var blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
        var link = document.createElement("a");
        var fileName = title.replace(/[/\\?%*:|"<>\s]/g, '_') + ".txt";

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // IE용 처리
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            // 크롬, 사파리 등 현대 브라우저용
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }
    },


	/**
	 * Sample(해당 함수는 삭제하지 말고 그대로)
	 */
	sample : function () {

	},
};