/***************************************************************************************************************************************************************
 * @classDescription AI 검색
 * @author HyosungITX Corp.
 * @version 1.0
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Modification Information
 * Date              Developer           Content
 * ----------        -------------       -------------------------
 * 2025/10/16        AI서비스팀             신규생성
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Copyright (C) 2018 by HyosungITX Corp. All rights reserved.
 ****************************************************************************************************************************************************************/
"use strict";
/***************************************************************************************************************************************************************
 * Global Variable : 스크립트 영역에서 모두 접근할 수 있는 전역변수를 해당 영역에 모두 정의한다.
 ***************************************************************************************************************************************************************/
var IMPORT		 = "";
var _hyobeeConst   = HyobeeConstants;
var mintTargetSize = _hyobeeConst.mintTargetSize;
var mintMinScore   = _hyobeeConst.mintMinScore;
var misStream = true;		//스트림형태로 챗봇 답변을 표시할지 여부

var host = _hyobeeConst.host;

var currentSearchType = "intranet"; // 기본값: 사내검색
var mobjConversationId = '';
/** 이력 클릭/SSE 직전에 쓸 target_dept_code (목록 enrichment) */
var mobjTargetDeptCode = '';
var mobjAiMessageId = '';
var mobjCategory = '';
var eventSource = '';
var markdownMap = {}; // searchKey별 누적 마크다운 저장소
var isNewChat = true;
var isAutoScrollEnabled = true; // 스트리밍 중 자동 스크롤 활성화 여부
// 페이징 관련 전역 변수
var nextCursor = null; // 다음 페이지 cursor 값
var isLoadingMessages = false; // 메시지 로딩 중 플래그
var hasMoreMessages = true; // 더 불러올 메시지가 있는지 여부
var loadedCursors = []; // 이미 로드한 cursor 목록 (중복 요청 방지)
var scrollDebounceTimer = null; // 스크롤 디바운스 타이머
var isInitialLoad = false; // 초기 로드 중 플래그 (스크롤 이벤트 무시용)
var isFirstChatInNewConversation = false; // 최초 채팅방 생성 시 첫 메시지 전송 여부
var currentJournalSortBy = "similarity"; // 출처 패널 정렬 기준(similarity/date)
var currentJournalSortOrder = "desc"; // 출처 패널 정렬 방향
var currentMessageSourceContext = null; // 마지막 message source 조회 컨텍스트 {typeClass, messageId}
var currentMessageSourcePaging = null; // 마지막 message source 페이징 { page, size, totalCount, totalPage }
var messageSourceHeadersMap = {}; // message_id 별 source_headers 캐시
var messageJournalStatusVisibleMap = {}; // message_id 별 journal-status-bar 노출 여부
var currentStreamIsRndSearch = false; // 현재 SSE 요청 chat_category가 rnd_search 인지 여부
/** 저널(기술원) 기능 허용 여부 — activeJournalByCode에서 설정 */
var isAllowedJournal = false;
var JOURNAL_SIMILARITY = _hyobeeConst.JOURNAL_SIMILARITY;
// 채팅 이력 페이지네이션 관련 전역 변수
var chatHistoryCurrentPage = 0; // 현재 채팅 이력 페이지
var chatHistoryHasNext = false; // 다음 페이지 존재 여부

// 파일 업로드 관련 전역 변수
var attachedFiles = []; // 첨부된 모든 파일 목록 (로컬 + HiCloud 통합)
var MAX_LENGTH = _hyobeeConst.MAX_LENGTH;
var JOURNAL_ALLOWED_PU_CODES = _hyobeeConst.JOURNAL_ALLOWED_PU_CODES;
var JOURNAL_ALLOWED_CORP_CODES = _hyobeeConst.JOURNAL_ALLOWED_CORP_CODES;
var JOURNAL_ALLOWED_TEAM_CODES = _hyobeeConst.JOURNAL_ALLOWED_TEAM_CODES;

//수식 블록 상태 추적
var isMathBlock = false;
var mathBuffer = [];
var isInlineMath = false;
var inlineBuffer = "";
var finalOutput = [];
var currentEnv = null;        // pmatrix, bmatrix 등 환경 이름
var inlineMathBuffer = [];

var FILE_VALIDATION = _hyobeeConst.FILE_VALIDATION;

var misUserLogout			= false;
var chunkBuffer = "";       // 전역 변수 또는 상위 스코프에 버퍼 변수 선언

/***************************************************************************************************************************************************************
 * Document Ready : jquery에서 제공하는 함수를 이용하여 화면이 로드될 때 처리할 함수를 정의한다.
 ***************************************************************************************************************************************************************/
function PageReady(){
    aichat010.completePageRender();
    // 페이지를 떠날 때(탭 닫기, 새로고침 등) SSE 소켓 강제 해제
    $(window).on('beforeunload', function() {
        if (eventSource) {
            eventSource.close();
            eventSource = null;
        }
    });
}
/**
 * 클래스 구조의 스크립트 구조체 오브젝트 명을 정의한다.
 * 스크립트를 클래스 기반의 구조체로 정의하기 위해 해당 JavaScript의 클래스명은 파일명으로 정의한다.
 * @classDescription :
 */
var aichat010={
    /***************************************************************************************************************************************************************
     * SQL Injection 검증 유틸리티
     ***************************************************************************************************************************************************************/
    /**
     * SQL Injection 공격 패턴 검증
     * @param {string} input 검증할 입력값
     * @returns {boolean} SQL Injection 패턴이 발견되면 true
     */
    containsSqlInjection: function(input) {
        if (!input || input === '') {
            return false;
        }
        // SQL Injection 공격 패턴: ' or '1' = '1' -- 같은 공격 문자 차단
        var sqlInjectionPattern = /('|;|--|\/\*|\*\/|xp_|exec|execute|union|select|insert|update|delete|drop|create|alter|grant|revoke|truncate|declare|cast|convert|or\s+['"]1['"]\s*=\s*['"]1)/i;
        return sqlInjectionPattern.test(input);
    },

    /**
     * 입력값 검증 (SQL Injection만 체크)
     * @param {string} value 검증할 값
     * @param {string} fieldName 필드명
     * @param {boolean} required 필수 여부
     * @returns {boolean} 검증 통과 시 true
     */
    validateInput: function(value, fieldName, required) {
        if (!value || value === '') {
            return !required; // 필수면 false, 선택이면 true
        }
        if (aichat010.containsSqlInjection(value)) {
            console.warn('SQL Injection 패턴이 발견된 ' + fieldName + ':', value);
            return false;
        }
        return true;
    },

    /**
     * 숨김 추천 저널 요청 여부 — !{{hidden_chat:...}} 와 !!{{hidden_chat:...}} 모두 인식
     */
    messageHasHiddenChatMarker: function(msg) {
        if (msg == null) {
            return false;
        }
        // prefix/suffix가 있어도 본문 어딘가에 hidden_chat 마커가 있으면 true
        return /!+\s*\{\{\s*hidden_chat\s*:/i.test(String(msg));
    },

    /**
     * 메시지 템플릿의 {token}을 값으로 치환한다.
     * @param {string} template
     * @param {Object} values
     * @returns {string}
     */
    applyMessageTemplate: function(template, values) {
        return HyobeeI18n.applyMessageTemplate(template, values);
    },

    /**
     * 사용자 로케일이 한국어인지 여부
     */
    isKoreanLocale: function() {
        var appLang = "";
        try {
            appLang = (xui && xui.message && typeof xui.message.getLanguage === "function")
                ? String(xui.message.getLanguage() || "").toLowerCase()
                : "";
        } catch (e) {
            appLang = "";
        }

        if (appLang.indexOf("ko") === 0) {
            return true;
        }
        if (appLang) {
            return false;
        }

        // 앱 언어를 얻지 못한 경우에만 브라우저/문서 언어를 fallback으로 사용
        var docLang = (document.documentElement.lang || "").toLowerCase();
        var navLang = (navigator.language || "").toLowerCase();
        return docLang.indexOf("ko") === 0 || navLang.indexOf("ko") === 0;
    },

    /**
     * KST 기준 날짜를 추천 타이틀용 문구로 변환
     * - ko: yyyy년 m월 n주차
     * - non-ko: Week n, Month yyyy
     *
     * @param {string} [isoDate]
     */
    formatRecJournalDatePart: function(isoDate) {
        var d = isoDate ? new Date(isoDate) : new Date();
        if (isNaN(d.getTime())) {
            d = new Date();
        }

        // 1. KST 기준으로 연, 월, 일 추출
        // Intl.DateTimeFormat을 사용하여 타임존이 반영된 정확한 숫자를 가져옵니다.
        var f = new Intl.DateTimeFormat("ko-KR", {
            timeZone: "Asia/Seoul",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            weekday: "narrow"
        });

        var parts = f.formatToParts(d);
        var y = "";
        var m = "";
        var day = "";
        for (var i = 0; i < parts.length; i++) {
            if (parts[i].type === "year") y = parseInt(parts[i].value);
            if (parts[i].type === "month") m = parseInt(parts[i].value);
            if (parts[i].type === "day") day = parseInt(parts[i].value);
        }

        // 2. 해당 월 1일의 요일을 구함 (KST 기준)
        // 월은 0부터 시작하므로 m - 1
        var firstDayOfMonth = new Date(y, m - 1, 1);
        var startDayOfWeek = firstDayOfMonth.getDay(); // 0(일) ~ 6(토)

        // 3. 달력 행 기준 주차 계산
        // (현재 날짜 + 1일의 요일 오프셋 - 1) / 7 을 올림 처리
        var weekOfMonth = Math.ceil((day + startDayOfWeek) / 7);

        if (aichat010.isKoreanLocale()) {
            return aichat010.msg("hyobee.chat.journal.reco.date.format", {
                year: y,
                month: m,
                week: weekOfMonth
            });
        }

        var monthName = new Date(y, m - 1, 1).toLocaleString("en-US", { month: "long" });
        return aichat010.msg("hyobee.chat.journal.reco.date.format", {
            year: y,
            month: m,
            week: weekOfMonth,
            monthName: monthName
        });
    },

    /**
     * 추천 저널/특허 hidden_chat 마커 (기존 형식 유지).
     * 형식: !!{{hidden_chat:patent}}!!
     */
    buildHiddenChatMarker: function(docType) {
        var safeType = (docType || "paper").trim();
        return "!!{{hidden_chat:" + safeType + "}}!!";
    },

    /**
     * hidden_chat 직후에 붙는 조회 팀 마커 (호출 시점, WRTN user 메시지 저장 → 이력 재조회용).
     * 형식: !!{{view_team:TEAM_CODE|ENCODED_TEAM_NAME}}!!
     */
    buildViewTeamMarker: function(teamCode, teamName) {
        var safeCode = String(teamCode || "").trim();
        var safeName = encodeURIComponent(String(teamName || "").trim());
        if (!safeCode) {
            return "";
        }
        return "!!{{view_team:" + safeCode + "|" + safeName + "}}!!";
    },

    /**
     * view_team 마커에서 teamCode·teamName 추출
     */
    parseViewTeamFromMessage: function(userContent) {
        var content = String(userContent || "");
        var m = content.match(/view_team\s*:\s*([^|}\s]+)\|([^}]+)/i);
        var teamCode = m && m[1] ? String(m[1]).trim() : "";
        var teamName = "";
        if (m && m[2]) {
            try {
                teamName = decodeURIComponent(String(m[2]).trim());
            } catch (e) {
                teamName = String(m[2]).trim();
            }
        }
        return {
            teamCode: teamCode,
            teamName: teamName
        };
    },

    /**
     * hidden_chat(docType) + view_team(호출 시점 팀) 통합 파싱
     */
    parseHiddenChatContext: function(userContent) {
        var content = String(userContent || "");
        var typeMatch = content.match(/hidden_chat\s*:\s*([a-zA-Z0-9_-]+)/i);
        var docTypeRaw = typeMatch ? (typeMatch[1] || "") : "";
        var docType = docTypeRaw.toLowerCase();
        if (docType === "paper" || docType === "thesis" || docType === "journal") {
            docType = "paper";
        } else if (docType === "patent") {
            docType = "patent";
        } else if (docType === "article" || docType === "news") {
            docType = "article";
        } else {
            docType = "paper";
        }

        var team = aichat010.parseViewTeamFromMessage(content);
        var teamCode = team.teamCode;
        var teamName = team.teamName;

        // 구버전: hidden_chat:type|code|name (하위 호환)
        if (!teamName) {
            var legacy = content.match(/hidden_chat\s*:\s*[a-zA-Z0-9_-]+\|([^|}\s]+)\|([^}]+)/i);
            if (legacy) {
                teamCode = String(legacy[1]).trim();
                try {
                    teamName = decodeURIComponent(String(legacy[2]).trim());
                } catch (e) {
                    teamName = String(legacy[2]).trim();
                }
            }
        }

        return {
            docType: docType,
            teamCode: teamCode,
            teamName: teamName
        };
    },

    /**
     * user 본문의 hidden_chat:타입 → 추천 문구용 문서 타입 (paper/patent/article)
     */
    parseDocTypeFromHiddenChat: function(userContent) {
        return aichat010.parseHiddenChatContext(userContent).docType;
    },

    /**
     * hidden_chat 마커 바로 뒤에 view_team 마커 삽입 (없을 때만)
     */
    embedViewTeamAfterHiddenChatMessage: function(message) {
        if (!aichat010.messageHasHiddenChatMarker(message)) {
            return message;
        }
        if (/view_team\s*:/i.test(String(message))) {
            return message;
        }
        var teamMarker = aichat010.buildViewTeamMarker(
            aichat010.getSelectedViewableTeamCode(),
            aichat010.getSelectedViewableTeamName()
        );
        if (!teamMarker) {
            return message;
        }
        return String(message).replace(
            /(!+\{\{\s*hidden_chat\s*:[^}]+\}\}!+)/i,
            "$1" + teamMarker
        );
    },

    /**
     * 추천 저널 상단 타이틀 (서버 DateUtils.getFormatRecJournalsTitle 와 동일 패턴)
     * @param {string} [teamName] 기본 REC_JOURNAL_TEAM_NAME
     * @param {string} [isoDate] assistant created_at 등
     * @param {string} [docType] paper|patent|article
     */
    /** sidebar 조회 팀 콤보에서 선택한 팀 코드 */
    getSelectedViewableTeamCode: function() {
        var $combo = $("#viewable_team_code");
        if ($combo.length) {
            var code = $combo.valExt();
            if (code) {
                return code;
            }
        }
        return $("#team_code").val() || xui.extends.session.getDeptCode() || "";
    },

    /** sidebar 조회 팀 콤보에서 선택한 팀명 (추천 저널/특허 제목용) */
    getSelectedViewableTeamName: function() {
        var code = aichat010.getSelectedViewableTeamCode();
        if (code && aichat010._viewableTeamNameByCode && aichat010._viewableTeamNameByCode[code]) {
            return aichat010._viewableTeamNameByCode[code];
        }
        return xui.extends.session.getSessionInfoByKey("DEPT_NAME") || "";
    },

    /**
     * viewable-teams가 본인 dept_code 1개뿐이면 sidebar 팀 콤보·로그아웃 영역(.cell) 숨김
     */
    updateViewableTeamOwnerVisibility: function(comboData) {
        var $ownerCell = $("#viewable_team_code").closest(".cell");
        var $owner = $ownerCell.closest(".owner");
        if (!$ownerCell.length) {
            return;
        }

        var ownDeptCode = ($("#team_code").val() || xui.extends.session.getDeptCode() || "").trim();
        var shouldHide = Array.isArray(comboData)
            && comboData.length === 1
            && ownDeptCode
            && comboData[0].code === ownDeptCode;

        shouldHide = true;
        if (shouldHide) {
            $ownerCell.addClass("xui-invisible");
            $owner.addClass("xui-invisible");
        } else {
            $ownerCell.removeClass("xui-invisible");
            $owner.removeClass("xui-invisible");
        }
    },

    /** SSE 채팅 전송 직전 세션 JWT_TEAM_CODE를 대화 target 또는 콤보 선택값과 맞춤 */
    syncViewableTeamBeforeStream: function() {
        var teamCode = mobjTargetDeptCode || aichat010.getSelectedViewableTeamCode();
        return aichat010.applyViewableTeamSelection(teamCode);
    },

    formatRecJournalTitle: function(teamName, isoDate, docType) {
        var safeTeam = (teamName || "").trim() || xui.extends.session.getSessionInfoByKey("DEPT_NAME") || "";
        var safeType = (docType || "").trim().toLowerCase() || "paper";
        var datePart = aichat010.formatRecJournalDatePart(isoDate);
        var docTypeValue = aichat010.msg("hyobee.journal.type." + safeType + "_plural");
        return aichat010.msg("hyobee.chat.journal.reco.title.format", {
            team: safeTeam,
            datePart: datePart,
            docTypePlural: docTypeValue
        });
    },

    /**
     * 추천 저널 상단 타이틀 HTML
     * - img처럼 "일부 구간"만 bold 보이게 하기 위해 span에만 font-weight를 준다.
     * - 전체 문구를 <strong>으로 감싸지 않는다.
     *
     * @param {string} [teamName]
     * @param {string} [isoDate]
     * @param {string} [docType] paper/patent/article
     * @returns {string} <h3> 포함 HTML
     */
    buildRecJournalTitleHeadingHtml: function(teamName, isoDate, docType) {
        var titleText = aichat010.formatRecJournalTitle(teamName, isoDate, docType);
        var titleHtml = $("<div/>").text(titleText).html();
        return "<h3>" + titleHtml + "</h3>\n\n";
    },

    /**
     * journal ai-summary 응답에서 요약 본문 추출
     * - ApiResponseAdvice 래핑(DATA[0]) / 순수 DTO 둘 다 허용
     */
    extractJournalAiSummaryPayload: function(response) {
        var payload = null;

        if (response && typeof response.getDataJsonObject === "function") {
            payload = response.getDataJsonObject() || null;
        }
        if (!payload && response && typeof response.getDataJsonArray === "function") {
            var arr = response.getDataJsonArray() || [];
            payload = (arr && arr.length > 0) ? arr[0] : null;
        }
        if (!payload && response && typeof response === "object") {
            payload = response;
        }

        if (!payload || typeof payload !== "object") {
            return null;
        }
        return payload.ai_summary || payload.aiSummary || null;
    },

    /**
     * ai-summary API가 정상 응답했으나 표시할 요약 본문이 없는지
     * (null, 빈 배열, 구 객체 intro/body/conclusion 전부 공백 등)
     */
    isJournalAiSummaryPayloadEmpty: function(aiSummary) {
        if (aiSummary == null) {
            return true;
        }
        if (Array.isArray(aiSummary)) {
            if (aiSummary.length === 0) {
                return true;
            }
            var si;
            for (si = 0; si < aiSummary.length; si++) {
                var sec = aiSummary[si];
                var text = (sec && sec.content != null) ? String(sec.content).trim() : "";
                if (text !== "") {
                    return false;
                }
            }
            return true;
        }
        if (typeof aiSummary === "object") {
            var intro = (aiSummary.intro != null) ? String(aiSummary.intro).trim() : "";
            var body = (aiSummary.body != null) ? String(aiSummary.body).trim() : "";
            var conclusion = (aiSummary.conclusion != null) ? String(aiSummary.conclusion).trim() : "";
            return intro === "" && body === "" && conclusion === "";
        }
        return true;
    },

    /**
     * OVERVIEW 섹션은 태그(span)를 표시하지 않는다.
     */
    isJournalAiOverviewSection: function(section) {
        if (!section || typeof section !== "object") {
            return false;
        }
        var roleKey = (section.role != null) ? String(section.role).trim().toUpperCase() : "";
        return roleKey === "OVERVIEW";
    },

    /**
     * ai_summary 섹션의 태그 문구: label 우선, 없으면 role 기반 한글(없으면 role 문자열). OVERVIEW는 호출하지 않는다.
     */
    resolveJournalAiSummarySectionTag: function(section) {
        if (!section || typeof section !== "object") {
            return "";
        }
        var roleKey = (section.role != null) ? String(section.role).trim().toUpperCase() : "";
        var byRole = {
            PURPOSE: aichat010.msg("hyobee.journal.common.ai_summary.tag.objective"),
            METHOD: aichat010.msg("hyobee.journal.common.ai_summary.tag.method"),
            PROBLEM: aichat010.msg("hyobee.journal.common.ai_summary.tag.problem"),
            SOLUTION: aichat010.msg("hyobee.journal.common.ai_summary.tag.solution")
        };
        if (roleKey && byRole[roleKey]) {
            return byRole[roleKey];
        }
        // role이 없거나 매핑되지 않는 경우에만 서버 label을 사용한다.
        if (section.label != null && String(section.label).trim() !== "") {
            return String(section.label).trim();
        }
        return roleKey || "";
    },

    /**
     * doc_type → .journal-reco-summary-dialog.--thesis|--patent|--article (paper → thesis)
     */
    resolveJournalRecoSummaryDocTypeSuffix: function(docTypeRaw) {
        var t = (docTypeRaw != null ? String(docTypeRaw) : "").toLowerCase().trim();
        if (t === "patent") {
            return "patent";
        }
        if (t === "article" || t === "news") {
            return "article";
        }
        return "thesis";
    },

    /**
     * 툴팁 다이얼로그에 doc_type modifier 동기화 (태그 배경색 CSS용)
     */
    syncJournalRecoSummaryDialogDocTypeClass: function($panel, docTypeRaw) {
        if (!$panel || !$panel.length) {
            return;
        }
        var suffix = aichat010.resolveJournalRecoSummaryDocTypeSuffix(docTypeRaw);
        $panel.removeClass("--thesis --patent --article");
        $panel.addClass("--" + suffix);
    },

    /**
     * journal-reco summary tooltip 채우기
     * - 배열(ai_summary): 섹션 개수만큼 블록 생성. OVERVIEW는 태그 없이 본문만.
     * - 구버전 { intro, body, conclusion }: 블록 3개 + 서론/본론/결론 태그
     * @param {Object} [applyOptions] applyOptions.statusMessage — 제목 아래 단일 안내 문구만 표시(오류·데이터 없음 등)
     */
    applyJournalAiSummaryToDialog: function($dialog, aiSummary, fallbackIntro, applyOptions) {
        if (!$dialog || !$dialog.length) {
            return;
        }
        applyOptions = applyOptions || {};
        var $panel = $dialog.hasClass("journal-reco-summary-dialog")
            ? $dialog
            : $dialog.find(".journal-reco-summary-dialog").first();
        if (!$panel.length) {
            $panel = $dialog;
        }
        var $title = $panel.find(".journal-reco-summary-title");
        var $card = $panel.closest(".journal-reco");
        aichat010.syncJournalRecoSummaryDialogDocTypeClass($panel, $card.attr("data-doc-type"));

        if (applyOptions.statusMessage) {
            $panel.find(".journal-reco-summary-content").remove();
            var $statusBlock = $("<div class=\"journal-reco-summary-content\"></div>");
            $("<p class=\"journal-reco-summary-description\"></p>").text(String(applyOptions.statusMessage)).appendTo($statusBlock);
            $title.after($statusBlock);
            return;
        }

        if (Array.isArray(aiSummary)) {
            var sortedSections = aiSummary.slice().sort(function(a, b) {
                var ia = Number(a && a.idx);
                var ib = Number(b && b.idx);
                if (isNaN(ia)) {
                    ia = 0;
                }
                if (isNaN(ib)) {
                    ib = 0;
                }
                return ia - ib;
            });
            if (sortedSections.length === 0) {
                sortedSections = [{ role: "OVERVIEW", content: "-" }];
            }

            $panel.find(".journal-reco-summary-content").remove();

            var $anchor = $title;
            var si;
            for (si = 0; si < sortedSections.length; si++) {
                var sec = sortedSections[si];
                var text = (sec && sec.content != null) ? String(sec.content) : "";
                if (si === 0 && !text && fallbackIntro) {
                    text = String(fallbackIntro);
                }
                var isOverview = aichat010.isJournalAiOverviewSection(sec);
                var $block = $("<div class=\"journal-reco-summary-content\"></div>");
                if (!isOverview) {
                    var tagText = aichat010.resolveJournalAiSummarySectionTag(sec);
                    $("<span class=\"journal-reco-summary-tag\"></span>").text(tagText).appendTo($block);
                }
                $("<p class=\"journal-reco-summary-description\"></p>").text(text || "-").appendTo($block);
                $anchor.after($block);
                $anchor = $block;
            }
            return;
        }

        var intro = "";
        var body = "";
        var conclusion = "";
        if (aiSummary && typeof aiSummary === "object") {
            intro = (aiSummary.intro != null) ? String(aiSummary.intro) : "";
            body = (aiSummary.body != null) ? String(aiSummary.body) : "";
            conclusion = (aiSummary.conclusion != null) ? String(aiSummary.conclusion) : "";
        }

        if (!intro && fallbackIntro) {
            intro = String(fallbackIntro);
        }

        $panel.find(".journal-reco-summary-content").remove();

        var $rows = $panel.find(".journal-reco-summary-content");
        var texts = [intro, body, conclusion];
        var ri;
        for (ri = 0; ri < 3; ri++) {
            $rows.eq(ri).find(".journal-reco-summary-description").text(texts[ri] || "-");
        }
    },

    /**
     * aichat 전용 REST 호출 헬퍼 (HyobeeApi.request 위임)
     */
    requestApi: function(path, options) {
        return HyobeeApi.request(path, options);
    },

    /**
     * aichat 파라미터 통합 검증
     * @returns {boolean} 검증 통과 시 true
     */

    // TODO: 세션 클러스터링 시 이슈 발생으로 인한 주석처리
    validateAichatParams: function() {
        /*var userId = $("#user_id").val();
        var pgCode = $("#pg_code").val();
        var puCode = $("#pu_code").val();
        var teamCode = $("#team_code").val();
        var corpCode = $("#corp_code").val();

        if (!aichat010.validateInput(userId, "user_id", true) ||
            !aichat010.validateInput(pgCode, "pg_code", true) ||
            !aichat010.validateInput(puCode, "pu_code", true) ||
            !aichat010.validateInput(teamCode, "team_code", true) ||
            !aichat010.validateInput(corpCode, "corp_code", true)) {
            xui.dialog.warning("", aichat010.enum.ERROR_SQL_INJECTION.getName());
            return false;
        }*/
        return true;
    },

    /***************************************************************************************************************************************************************
     * completePageRender Function : 화면이 초기 로드 시점에 처리할 사항을 정의한다.
     ***************************************************************************************************************************************************************/
    completePageRender : function(){
        //페이지 상수 정의
        aichat010.setPageEnum();
        //탭 화면 디자인
        aichat010.defineTab();
        //툴바 화면 디자인
        aichat010.defineToolbar();
        //그리드 디자인
        aichat010.defineGrid();
        //트리뷰 디자인
        aichat010.defineTree();
        //다이얼로그 레이어 화면 디자인
        aichat010.defineDialog();
        //파일 화면 디자인
        aichat010.defineFile();
        //초기데이터설정
        aichat010.initPage();
        //이벤트 정의
        aichat010.defineEvent();
        // 출처 패널 탭(전체/논문/…) 마크업 — JSP 하드코딩 대신 한곳에서 생성
        aichat010.renderJournalTabList();
        // 파일 업로드 이벤트 초기화 (defineEvent 이후에 호출하여 이벤트 충돌 방지)
        aichat010.initFileUploadEvents();
    },
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ENUM: 열거형 class 상수 정의 [기본함수명:setPageEnum]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
    setPageEnum : function(){
        aichat010.enum		= new Enumeration();
        aichat010.enum.setEnum("NO_SENTENCE"				,"WARNING"					,"aisearch020.NO_SENTENCE"								,""			);
        aichat010.enum.setEnum("MAX_CHAR"					,"WARNING"					,"aisearch020.MAX_CHAR"									,""			);
        aichat010.enum.setEnum("NOT_FIND_CONTENTS"		    ,"WARNING"					,"aisearch020.NOT_FIND_CONTENTS"						,""			);
        aichat010.enum.setEnum("ERROR_ANSWER_SEARCH"		,"ERROR"					,"답변 생성시 문제가 발생했습니다.<br />잠시후 다시 한번 문의 해주시기 바랍니다."		,""			);
        aichat010.enum.setEnum("ERROR_SQL_INJECTION"		,"WARNING"					,"SQL Injection 패턴이 발견되었습니다."		,""			);
        aichat010.enum.setEnum("NOT_CLIPBOARD_API"		    ,"WARNING"					,"이 브라우저는 Clipboard API를 지원하지 않습니다."			,""			);
        aichat010.enum.setEnum("NOT_SELECT_CONVERSATIONS"   ,"WARNING"					,"삭제할 대화 목록이 선택되지 않았습니다."           			,""			);
        aichat010.enum.setEnum("WEB_PLACEHOLDER_MESSAGES"   ,"INFO",
            [
                aichat010.msg("hyobee.placeholder.web.q1"),
                aichat010.msg("hyobee.placeholder.web.q2"),
                aichat010.msg("hyobee.placeholder.web.q3"),
                aichat010.msg("hyobee.placeholder.web.q4"),
                aichat010.msg("hyobee.placeholder.web.q5"),
                aichat010.msg("hyobee.placeholder.web.q6"),
                aichat010.msg("hyobee.placeholder.web.q7"),
                aichat010.msg("hyobee.placeholder.web.q8")
            ],
            ""
        );
        aichat010.enum.setEnum("INTERNAL_PLACEHOLDER_MESSAGES"     ,"INFO",
            [
                aichat010.msg("hyobee.placeholder.internal.q1"),
                aichat010.msg("hyobee.placeholder.internal.q2"),
                aichat010.msg("hyobee.placeholder.internal.q3"),
                aichat010.msg("hyobee.placeholder.internal.q4"),
                aichat010.msg("hyobee.placeholder.internal.q5"),
                aichat010.msg("hyobee.placeholder.internal.q6")
            ],
            ""
        );
        aichat010.enum.setEnum("RND_PLACEHOLDER_MESSAGES"   ,"INFO",
            [
                aichat010.msg("hyobee.placeholder.rnd.q1")
            ],
            ""
        );
        aichat010.enum.setEnum("FILE_PLACEHOLDER_MESSAGES"     ,"INFO",
            [
                aichat010.msg("hyobee.placeholder.file.q1")
            ],
            ""
        );
        aichat010.enum.setEnum("FILE_NOT_FOUND"              ,"WARNING"     ,aichat010.msg("hyobee.file.error.not_found")              ,""         );
        aichat010.enum.setEnum("INVALID_FILE_TYPE"           ,"WARNING"     ,aichat010.msg("hyobee.file.error.invalid_type")           ,""         );
        aichat010.enum.setEnum("INVALID_FILE_TYPE_DETAIL"    ,"WARNING"     ,aichat010.msg("hyobee.file.error.invalid_type_detail")    ,""         );
        aichat010.enum.setEnum("EXCEED_FILE_SIZE"            ,"WARNING"     ,aichat010.msg("hyobee.file.error.size_limit")             ,""         );
        aichat010.enum.setEnum("EXCEED_FILE_SIZE_DETAIL"     ,"WARNING"     ,aichat010.msg("hyobee.file.error.size_exceeded")          ,""         );
        aichat010.enum.setEnum("EXCEED_FILE_COUNT"           ,"WARNING"     ,aichat010.msg("hyobee.file.error.count_exceeded")         ,""         );
        aichat010.enum.setEnum("HICLOUD_DOWNLOAD_FAILED"     ,"WARNING"     ,aichat010.msg("hyobee.file.error.hicloud_download_failed"),""         );
        aichat010.enum.setEnum("HICLOUD_ATTACH_BLOCKED"	   ,"WARNING"     ,aichat010.msg("hyobee.file.error.hicloud_attach_blocked") ,""         );

        aichat010.enum.setEnum("RE_LOGIN_NOT_FOUND_SESSION"	,""	,"main010.RE_LOGIN_NOT_FOUND_SESSION"                           ,"");
        aichat010.enum.setEnum("WELCOME_USER"					,""	,"main010.WELCOME_USER"                                         ,"");
        aichat010.enum.setEnum("LOGOUT_CONFIRM"				,""	,"main010.LOGOUT_CONFIRM"                                       ,"");
        aichat010.enum.setEnum("CLOSE_PAGE_LOGOUT"			,""	,"main010.CLOSE_PAGE_LOGOUT"                                       ,"");
        aichat010.enum.setEnum("CLOSE_PAGE"					,""	,"main010.CLOSE_PAGE"                                       ,"");
        aichat010.enum.setEnum("LOGOUT"						,""	,"main010.LOGOUT"                                               ,"");
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
    initPage : function(){

        // 세션 캐시 + 표시명(selectUserBase) 보강 후 프로필·팀 콤보 초기화
        aichat010.hydrateUserProfileFromServer();

        // 사용자
        aichat010.setUserParams();

        // 언어 설정 콤보 (sidebar)
        aichat010.initLanguageSelect();

        // 조회 가능 팀 콤보 (sidebar.owner)
        aichat010.loadViewableTeamsCombo();

        //웰컴 인사
//		$("#welcome").html(xui.extends.session.getUserName() + xui.message.get("main010.WELCOME_USER"));

        // 초기화
        aichat010.searchAiBotInit(false, true);

        // 사내검색, 웹검색 구분
        aichat010.toggleSearchGubn(currentSearchType);

        // 채팅 이력 페이지 초기화
        chatHistoryCurrentPage = 0;
        aichat010.selectConversations().then(function(result) {
            // conversations 실패 시(401 포함) 오류 팝업은 selectConversations에서 이미 처리 → board-auth 미호출
            if (!result || !result.ok) {
                return;
            }
            return aichat010.selectDataBoardsAuth();
        });

        // 파일 드래그 앤 드롭 이벤트
        aichat010.initFileUploadEvents();

        // HiCloud 팝업 콜백 바인딩
        aichat010._bindGlobalHiCloudCallback();

        // 스트리밍 중 스크롤 제어 이벤트
        aichat010._initStreamingScrollControl();

        // 2. 이벤트 위임으로 클릭 처리
        $(document).on('click', '.source-link', function () {
            const url = $(this).data('url');
            if (url) {
                window.open(url, '_blank');
            }
        });

        $(document).on('click', '.source-button', function () {
            const url = $(this).data('url');
            if (url) {
                window.open(url, '_blank');
            }
        });

        // 출처 모달 띄우는 위치 수정
        $(document).on('click', "[data-role='modal-opener']", function(e) {
            e.preventDefault();
            e.stopPropagation();

            const $openBtn = $(this);
            const $modal = $('#' + $openBtn.data('target'));

            $(".source-modal").not($modal).removeClass("show");

            // 위치
            const btnOffset = $openBtn.offset();
            const btnWidth = $openBtn.outerWidth();
            const btnHeight = $openBtn.outerHeight();

            const btnTop = btnOffset.top - $(window).scrollTop();
            const btnLeft = btnOffset.left - $(window).scrollLeft();

            const btnRight = btnLeft + btnWidth;
            const btnBottom = btnTop + btnHeight;

            const winWidth = $(window).width();
            const winHeight = $(window).height();

            // 상, 하
            const spaceTop = btnTop;
            const spaceBottom = winHeight - btnBottom;
            const vertical = (spaceBottom >= spaceTop) ? '--down' : '--up';

            // 좌, 우
            const spaceLeft = btnLeft;
            const spaceRight = winWidth - btnRight;
            const horizontal = (spaceRight >= spaceLeft) ? '--right' : '--left';

            // 적용
            if ( $modal.hasClass("show") ) {
                $modal.removeClass("show");
            } else {
                $modal.removeClass("--up --right --down --left");
                $modal.addClass(horizontal);
                $modal.addClass(vertical);
                $modal.addClass("show");
            }
        });

        $("body").click(function(e){
            if ($(e.target).closest("[data-role='modal-opener'], .source-modal").length) return;
            $(".source-modal.show").removeClass("show");
        });

        $(document).on('click', '.enter-message.--stop.common-focusable-stop', function () {
            aichat010.selectDataStopStream(mobjConversationId, mobjAiMessageId);

        });

        // 답변 피드백 토글
        $(document).on("click", ".feedback-button", function (e) {
            $(".feedback-button").removeClass("--active");
            $(this).addClass("--active");
        });

        if(xui.extends.session.getCorpCode() !== 'ITY2') {
            $("#btnLogout").addClass("xui-invisible");
            $("#btnLogout").click(function(e) {aichat010.logout(true); });			//로그아웃
        }

        //붙여넣기 함수
        aichat010.enableCustomPaste(".text-field");

        //웰컴 메세지
        aichat010.showWelcomeMessage("#user_full_name", ".welcome-message");

    },
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEFINE EVENT: 화면에 디자인 된 버튼 및 오브젝트 이벤트와 호출할 함수 정의
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
    defineEvent : function(){
        //검색조건 PU Combo 변경시
//		$("#puCode").change(function(e){aichat010.loadPuPgCombo();});

        // [D] 웰컴 메세지
        //  기존에 만들어주신 예시에,
        //  랜덤 이벤트 추가해 두었습니다.
//        var userName = xui.extends.session.getUserName();

//        var userName = $("#user_id").val();
//        var welcomeMessage = [
//            `${userName}님, 반갑습니다!`,
//            '무엇이 궁금하신가요?',
//            `${userName}님, 안녕하세요!`,
//        ];
//        var randomMessage = welcomeMessage[Math.floor(Math.random() * welcomeMessage.length)];
//        $(".welcome-message").text(randomMessage);

        //검색폼클릭
        $("#btnSearchForm").click(function(e) {aichat010.toggleSearchForm(e);});
        $("#btnSearchFormClose").click(function(e) {aichat010.toggleSearchForm(e);});

        //질의 입력
        $("#inputArea").keypress(function(e){
            if(e.which === xui.enum.ENTER_EVENT.getCode() && !e.shiftKey){
                if (!$(".user-field").hasClass("--empty")) {
                    aichat010.searchAiBot();
                }
                return false;
            }
        });

        //글자수 제한
        $("#inputArea").on("input", function () {
            var text = $(this).val();
            var length = text.length;

            if (length > MAX_LENGTH) {
                // 초과된 글자 잘라내기
                $(this).val(text.substring(0, MAX_LENGTH));
                xui.util.log("최대 "+MAX_LENGTH +"자까지 입력할 수 있습니다.");
                $(".feedback-message").addClass("--active");
            }else {
                $(".feedback-message").removeClass("--active");
            }
        });

        $("#imgSearch").click(function(e){aichat010.searchAiBot();});
        $("#inputArea").on("paste", function(e) {vobCmmn.setPasteText(e);});

        // 질의 입력 여부(보내기 버튼 상태 변경)
        $("#inputArea").on("input", function(e){
            $(".user-field").toggleClass("--empty", !(e.currentTarget.value));
        });

        //새대화 시작하기
        $("#btn-write").click(function(e){
            // 저널 모드였다면 ▶ 채팅 메인으로 전환
            $("#journalContainer").hide();
            $("#container").show();

            // 선택된 대화 목록 항목의 on 클래스 제거
            $(".list-view2-item").removeClass("on");
            aichat010.clearAttachedFiles();
            mobjCategory = '';

            // 이전 출처 패널 접기 + 아래 보기 버튼 숨김
             $('.journal-panel.--active').removeClass('--active');
             $('.chat-scroller.--active').removeClass('--active');

            $(".deep-search").removeClass("--active");
            aichat010.toggleExclusiveButton();

            aichat010.toggleSearchGubn("intranet");
            if (isAllowedJournal) {
                $("#container .journal-search").addClass("--active");
                $("#container .journal-buttons").addClass("--active");
            }
            aichat010.searchAiBotInit(false, true);
            isNewChat=true;
        });

        // 대화 목록 체크박스 변경 시 삭제 버튼 활성화 (동적 목록 대응: 이벤트 위임)
        $(document).on("input", ".navigation-item-checkbox", function(){
            if (!$(".navigation").hasClass("--delete")) {
                return;
            }
            aichat010.syncDeleteButtonState();
        });

        // 대화 목록 전체 선택/해제
        $("#checkbox-all").click(function(e){
            var isChecked = $(this).prop('checked');
            // 모든 list-view2-item의 체크박스를 checkbox-all의 상태와 동일하게 설정
            $(".list-view2-item .navigation-item-checkbox").prop('checked', isChecked);
            if ($(".navigation").hasClass("--delete")) {
                aichat010.syncDeleteButtonState();
            }
        });

        // 대화 목록 삭제
        $("#btn-delete").click(function(e){aichat010.deleteConversations();});

        // 채팅 이력 더보기 버튼 (동적 요소이므로 이벤트 위임 사용)
        $(document).on('click', '.more-button', function(e){
            chatHistoryCurrentPage++;
            aichat010.selectConversations(chatHistoryCurrentPage, true);
        });

        //챗봇 이력 검색
        $("#historySearch").keypress(function(e){if(e.which === xui.enum.ENTER_EVENT.getCode()){aichat010.selectDataChatHistory();return false;}});

        // 사용법 모달
        $("#how_to_use").click(function(e){aichat010.initHowToUseModal(e);});

        // 저널 버튼: 채팅 영역 숨기고 저널 영역 표시 (+ 필요 시 저널 초기 렌더링 호출)
        $("#btn-journal").click(function () {
            $("#container").hide();
            $("#journalContainer").show();
            $('.list-view2-item.on').removeClass('on');
            $('.journal-panel').removeClass('--active');

            // 저널용 스크립트가 있으면 초기 렌더링 수행
            if (typeof journal !== "undefined" && typeof journal.completePageRender === "function") {
                journal.completePageRender();
                // 버튼 강제 노출
                $("#journalContainer .xui-actions button").css("display", "block");
            }
        });

        // 대화 영역 모달
        // $("[data-role='modal-opener']").click(function(e){aichat010.initChatModal(e);});

        $(".chat-type-button").click(function(e){
            var clickedText = $(this).attr("id");
            aichat010.toggleSearchGubn( clickedText );
            aichat010.clearAttachedFiles();

            // 선택된 대화 목록 항목의 on 클래스 제거
            $(".list-view2-item").removeClass("on");
            mobjCategory = '';
            $(".deep-search").removeClass("--active");
            aichat010.toggleExclusiveButton();
            aichat010.searchAiBotInit(false, true);
            isNewChat=true;
        });

        // 우측 메뉴 토글
        $(".aside-button").click(function(e){
            $(".aside").toggleClass("--expanded");
            $(".navigation").toggleClass("--delete", false);
            $(".chat-history").toggleClass("--active", false);
        })

        // 최근 대화 목록 토글
        $(".folder-button").click(function(e){
            $(this).toggleClass('--active');
            $(".navigation-list").slideToggle();
        })

        //  대화 목록 히스토리 토글
        $(".chat-history").click(function(e){
            if ( $(".aside").hasClass("--expanded") ) {
                $(".aside").removeClass("--expanded");
            } else {
                $(this).toggleClass('--active');
                $(".navigation").toggleClass("--delete");

                if ($(".navigation").hasClass("--delete")) {
                    aichat010.syncDeleteButtonState();
                } else {
                    $(".navigation-item-checkbox").prop("checked", false);
                    $(".chat-delete").attr("tabIndex", "-1");
                }
            }
        });

        // [D] textarea 모션
        var $chatContainer = $("#container");
        var $userField = $(".user-field");
        var $textarea = $(".text-field");
        var maxHeight = 240;

        $textarea.on("input", function() {
            var isChatting = $chatContainer.hasClass("--ing"); // false: 홈(웰컴) / true: 대화 중
            var minHeight = isChatting ? 48 : 100;

            var value = $(this).val().trim();

            // 초기화
            if ( value === "" ) {
                this.style.height = minHeight + "px";
                if ( isChatting ) $userField.removeClass("--wrap");
                $userField.removeClass('--shadow');
                return;
            }

            // 높이 계산
            this.style.height = minHeight + "px";
            var newHeight = this.scrollHeight;

            if ( newHeight > maxHeight )  this.style.height = maxHeight + "px";
            else  this.style.height = newHeight + "px";

            // 대화 중일 경우 좌우 여백
            if ( isChatting ) {
                if ( newHeight > minHeight ) {
                    $userField.addClass("--wrap");
                } else {
                    $userField.removeClass("--wrap");
                }
            }

            if ( this.style.height === '240px' ) {
                $userField.addClass('--shadow');
            } else {
                $userField.removeClass('--shadow');
            }
        });

        // 심층 검색 토글
        $(".deep-search").click(function(e){
            $(this).toggleClass("--active");
            aichat010.toggleExclusiveButton();
        });

        // 대화 내용 상단 이동
        $(".chat-message").on("scroll", function () {
            var $chat = $(this);
            var scrollTop = $chat.scrollTop();
            var scrollHeight = $chat[0].scrollHeight;
            var clientHeight = $chat.outerHeight();

            var isBottom = scrollTop + clientHeight >= scrollHeight - 5;

            if (!isBottom) {
                $(".chat-scroller").addClass('--active');
            } else {
                $(".chat-scroller").removeClass('--active');
            }
        });

        // 대화 내용 스크롤 페이징 처리 (#box)
        $("#box").on("scroll", function () {
            var $box = $(this);
            var scrollTop = $box.scrollTop();
            var scrollHeight = $box[0].scrollHeight;
            var clientHeight = $box.outerHeight();

            // 디바운싱: 스크롤 이벤트가 너무 자주 발생하지 않도록
            if (scrollDebounceTimer) {
                clearTimeout(scrollDebounceTimer);
            }

            scrollDebounceTimer = setTimeout(function() {
                // 초기 로드 중이면 스크롤 이벤트 무시
                if (isInitialLoad) {
                    return;
                }

                // 최초 대화 생성 중이면 스크롤 페이징 무시 (중복 메시지 방지)
                if (isFirstChatInNewConversation) {
                    xui.util.log("⚠️ 최초 대화 생성 중이므로 스크롤 페이징 무시");
                    return;
                }

                // 스크롤이 상단에서 200px 이내에 있으면 이전 메시지 로드
                var isAtTop = scrollTop <= 200;
                // 상단에 도달했을 때만 이전 메시지 로드
                if (isAtTop && hasMoreMessages && !isLoadingMessages && mobjConversationId) {
                    // nextCursor가 유효하면 이전 메시지 로드
                    // 이미 로드한 cursor인지 확인 (중복 요청 방지)
                    var cursorKey = String(nextCursor);
                    if (loadedCursors.indexOf(cursorKey) === -1) {
                        aichat010.selectDataChatHistoryDetail(mobjConversationId, nextCursor, true);
                    }
                }
            }, 150); // 150ms 디바운스
        });

        // 대화 내용 하단 이동
        $(".chat-scroller").click(function(e){
            var $chat = $(".chat-message");
            $chat.animate({ scrollTop: $chat[0].scrollHeight }, 400);
            $(this).removeClass("--active");
        });

        // 답변 피드백 토글
//        $(".feedback-button").click(function (e) {
//            $(".feedback-button").removeClass("--active");
//            $(this).addClass("--active");
//        });

        if(xui.extends.session.getCorpCode() ==='ITY2') {
            $("#btnLogout").removeClass("xui-invisible");
            $("#btnLogout").click(function(e) {aichat010.logout(true); });			//로그아웃
        }

        // [S] 260529 : 추천 저널 설정
        $(".current-user__setting").click(function(){
            var $utility = $(this).closest(".current-user__utility");
            $(this).add($utility.find(".current-user__dropdown")).toggleClass("active");
        });
        $(".current-user__language").click(function(){
            $(this).add($(this).find(".current-user__language-list")).toggleClass("active");
        });
        $(".current-user__menu-item.reco").click(function(){
            if (!isAllowedJournal) {
                return;
            }
            var $utility = $(this).closest(".current-user__utility");
            $utility.find(".current-user__setting, .current-user__dropdown").removeClass("active");
            $utility.find(".current-user__language, .current-user__language-list").removeClass("active");
            aichat010.openRecJournalTeamDialog();
        });
        $(".common-dialog__close").click(function(){
            $(".common-dialog, .common-dialog__selection, .common-dialog__select").removeClass("active");
        });
        $(".common-dialog__selection").click(function(){
            $(this).add($(this).find(".common-dialog__select")).toggleClass("active");
        });
        $(".common-dialog").on("click", ".common-dialog__option", function(e) {
            e.stopPropagation();
            var code = $(this).data("team-code");
            var name = $(this).text();
            var $selection = $(this).closest(".common-dialog__selection");
            $selection.data("selected-team-code", code);
            $selection.find(".common-dialog__select-text").text(name);
            $selection.add($selection.find(".common-dialog__select")).removeClass("active");
        });
        $(".common-dialog__confirm").click(function() {
            var code = $(".common-dialog__selection").data("selected-team-code")
                || aichat010.getSelectedViewableTeamCode();
            var $combo = $("#viewable_team_code");
            if ($combo.length && code) {
                $combo.valExt(code, true, false);
            }
            aichat010.applyViewableTeamSelection(code).then(function() {
                $(".common-dialog, .common-dialog__selection, .common-dialog__select").removeClass("active");
            });
        });
        // [E] 260529 : 추천 저널 설정
    },

    defineEventChatFeedback: function () {

        $(".feedback-button").off("click").on("click", function(e) {
            e.stopPropagation();

            var parentBtn = $(this);
            var icon = parentBtn.find("i"); // 클래스명으로 타입 판별
            var type = "";
            if (icon.hasClass("xfi-ico_0114_thumb_up")) { type = "like"; }
            else if (icon.hasClass("xfi-ico_0226_thumb_down")) { type = "dislike"; }

            var feedbackBox = parentBtn.closest(".feedback");
            var feedbackId = parentBtn.data("feedback");
            // jQuery data()는 캐시될 수 있으므로, attr 값이 있으면 보정
            if (!feedbackId) {
                feedbackId = parentBtn.attr("data-feedback");
            }

            xui.util.log(".feedbackBox-button", feedbackId, feedbackBox);

            // 이미 활성화된 상태라면 → 해제
            if (parentBtn.hasClass("--active")) {
                parentBtn.removeClass("--active");

                // 둘 다 해제된 경우 delete 호출
                if (feedbackBox.find(".feedback-button.--active").length === 0) {
                    // PUT 응답으로 feedback_id가 아직 갱신되지 않았으면 DELETE 호출하지 않음
                    if (!feedbackId) {
                        return;
                    }
                    aichat010.deleteDataFeedback(parentBtn, feedbackId);
                }
            } else {
                // 다른 버튼은 모두 해제
                feedbackBox.find(".feedback-button")
                    .removeClass("--active")
                    .attr("data-feedback", "") // 속성 초기화
                    .each(function () { $(this).removeData("feedback"); });

                // 현재 버튼만 활성화
                parentBtn.addClass("--active");

                // 선택된 경우 save
                aichat010.saveDataFeedback(parentBtn, type);
            }


//            parentBtn.toggleClass("--active");
//            xui.util.log(".feedback-button", type, icon);
//            if (parentBtn.hasClass("--active")) {
//                // 선택된 경우 save
//                aichat010.saveDataFeedback(parentBtn, type);
//            } else {
//                // 해제된 경우 상태 확인
//                var feedbackBox = parentBtn.closest(".feedback");
//                var activeCount = feedbackBox.find(".feedback-button.--active").length;
//                var feedbackId = parentBtn.data("searchkey");
//                xui.util.log(".feedbackBox-button", feedbackId, feedbackBox);
//                if (activeCount === 0) {
//                    // 둘 다 해제된 경우 delete 호출
//                    aichat010.deleteDataFeedback(feedbackBox, feedbackId);
//                } else {
//                    // 한쪽만 해제된 경우 saveDataFeedback을 빈 값으로 처리하거나 무시
//                    aichat010.saveDataFeedback(parentBtn, "");
//                }
//            }
        });



        //복사 : 버블 이벤트 방지를 위해 off 이벤트 정의 후 click 이벤트 정의
        $("[name='content_copy']").off("click").click(function(e) {
            aichat010.copyFeedbackMessage($(this));
        });
    },

    defineEventChatHistory: function(data) {
        $(".list-view2").click(function(e) {
            // 수집 저널 화면이 열려 있었다면, 대화 목록 클릭 시 항상 채팅 화면으로 전환
            $("#journalContainer").hide();
            $("#container").show();
            // 다른 대화 선택 시 우측 저널 패널/탭은 닫는다.
            $(".journal-panel").removeClass("--active --no-tabs");
            $(".journal-tab-button").removeClass("--active");
            $(".journal-panel .journal-tab-list").show();

            //챗봇대화영역 초기화
            $('#box').empty();
            $(".list-view2-item").removeClass("on");
            //리스트 선택
            $(this).closest(".list-view2-item").addClass("on");
            //이벤트 생성
            mobjConversationId = $(this).attr("conversation_id");
            mobjTargetDeptCode = $(this).attr("data-target-dept-code") || "";
            var realChatCategory = $(this).attr("data-real-chat-category") || $(this).attr("chat_category");
            mobjCategory = realChatCategory;

            aichat010.syncJournalChrome();

            // conversation의 chat_category 기준으로 btn-rnd(journal-search) 활성 상태 동기화
            // - rnd_search 대화면 ON
            // - 그 외 카테고리면 OFF
            var isRndConversation = (mobjCategory === "rnd_search");
            $("#container .journal-search").toggleClass("--active", isRndConversation);
            $("#container .journal-buttons").toggleClass("--active", isRndConversation);
            if (!isRndConversation) {
                $(".journal-panel").removeClass("--active --no-tabs");
            }

            // 모드 전환에 맞춰 welcome message/placeholder 즉시 갱신
            var activeType = $('.chat-type-button.active').attr('id');
            var placeholderType = (activeType === 'web') ? 'web' : 'internal';
            aichat010.showWelcomeMessage("#user_full_name", ".welcome-message");
            aichat010.setPlaceholder(placeholderType);

            // 다른 채팅방 선택 시 첨부 파일 목록 제거
            aichat010.clearAttachedFiles();

            var openHistory = function() {
                aichat010.selectDataChatHistoryDetail(mobjConversationId);
            };
            if (mobjTargetDeptCode) {
                aichat010.applyViewableTeamSelection(mobjTargetDeptCode).then(openHistory);
            } else {
                openHistory();
            }

            //인풋창 초기화
            $(".user-field").addClass("--empty");
            $("#inputArea").val("");
            var value = $("#inputArea").val().trim();
            xui.util.log("value : " + value);
            // 초기화
            if ( value === "" ) {
                $(".text-field").css("height", "48px");
                $(".user-field").removeClass("--wrap");
                $(".user-field").removeClass('--shadow');
                return;
            }

            aichat010.updateChatTypeTheme(mobjCategory);
        });
    },
    /***************************************************************************************************************************************************************
     * Main Functions: 화면상에 주요 기능을 처리하는 함수를 정의한다.
     ***************************************************************************************************************************************************************/
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// NEW FORM: 신규 데이터 처리에 대한 함수 정의 [기본함수명:newForm + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
    newForm : function(){
    },
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SELECT: 조회 데이터 처리에 대한 함수 정의 [기본함수명:selectData + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
    //챗봇 검색
    searchAiBot: function() {
        // 저널 화면에서 입력한 경우에도, 질문이 들어가면 항상 채팅 메인 화면으로 전환
        $("#journalContainer").hide();
        $("#container").show();
        $(".user-field").removeClass("--wrap");
        $('.chat-scroller').removeClass('--active');

        var sentence = $("#inputArea").val();   // shift+enter(줄바꿈) 질문 입력 시 화면에 적용하기 위해 .text -> .html로 변경
        xui.util.log("🙈 mobjCategory:", mobjCategory );
        xui.util.log("🙈 받은 데이터:", sentence );
        if (!aichat010.validationSearchBot(sentence)) return;

        var isRndActive = $('#btn-rnd').closest('.journal-search').hasClass('--active');
        var chat_category = isRndActive ? 'rnd_search' : aichat010.resolveCurrentChatCategory();

        // 입력 창 높이 값 초기화
        $(".user-field").addClass("--empty").find("> textarea").css("height", "");

        // attachedFiles를 변수에 저장하여 초기화로부터 보호 (배열 복사)
        var filesToUpload = attachedFiles.slice();

        // 신규 채팅일 경우 채팅방을 먼저 생성
        if (isNewChat) {
            xui.util.log("🆕 신규 채팅 - 채팅방 먼저 생성");
            // 채팅방 생성 → 파일 업로드 → 메시지 전송 순서로 진행
            return aichat010.selectDataCreateConversation(sentence, chat_category, filesToUpload);
        }

        // 기존 채팅방이 있는 경우 - 파일 업로드 후 메시지 전송
        return aichat010.uploadFiles(filesToUpload)
            .then(function (uploadedFiles) {
                // 챗봇 화면 초기화 (파일 업로드 후)
                aichat010.searchAiBotInit(false, false);

                // 입력창 및 UI 초기화
                aichat010.resetInputArea(chat_category);

                // 기존 채팅방에 메시지 전송
                aichat010.selectDataChatStream(sentence, chat_category, mobjConversationId, uploadedFiles);

                // 첨부 파일 초기화
                aichat010.clearAttachedFiles();
            })
            .catch(function(error) {
                // 업로드 실패
                console.error('❌ 파일 업로드 실패:', error);
                xui.dialog.error("파일 업로드 중 오류가 발생했습니다: " + error.message);
            });
    },

    validationSearchBot : function(sentence){
        // 문장이 비어 있는지 체크
        if (xui.valid.isEmpty(sentence)) {
////            aichat010.appendMessage("", xui.util.restoreXSS(aichat010.enum.NO_SENTENCE.getName()));
//            xui.dialog.warning("", xui.util.restoreXSS(aichat010.enum.NO_SENTENCE.getName()));
            return false;
        }

        // 최대 문자 200바이트 이하인지 체크
        //var byteLength = new TextEncoder().encode(sentence).length;
        var byteLength = sentence.length;
        if (byteLength >= MAX_LENGTH) {
            xui.dialog.warning("", xui.util.restoreXSS(aichat010.enum.MAX_CHAR.getName()));
//            aichat010.appendMessage("", xui.util.restoreXSS(aichat010.enum.MAX_CHAR.getName()));
            return false;
        }

        return true;
    },


    // 대화 최근 항목 전체조회
    selectConversations: function(page, isAppend) {
        // 파라미터 기본값 설정
        if (typeof page === 'undefined') page = 0;
        if (typeof isAppend === 'undefined') isAppend = false;

        var historySearch = $("#historySearch").valExt();
        //조회 전 초기화 (최초 로드인 경우만)
        if (!isAppend) {
            $(".list-view2-item").removeClass("on");
        }

        //데이터유효성 체크
        if(!aichat010.validationSelectChatHistory()){
            return Promise.resolve({ ok: false, unauthorized: false });
        }

        // aichat 전용 REST 헬퍼로 호출 (xui.json, jsonData 쿼리 제거)
        var payload = {
            user_id: $("#user_id").val(),
            page: page,
            size: 20
        };

        return aichat010.requestApi("/xs/aichat/v2/conversations", {
            method: "GET",
            query: payload
        }).then(function(response) {
            // v2 컨트롤러는 HEADER/DATA 래핑 없이 DTO 응답을 직접 반환하므로
            // 기존 setChatHistory에 response 그대로 전달
            aichat010.setConversations(response, isAppend);
            return { ok: true, unauthorized: false };
        }).catch(function(err) {
            aichat010.showErrorDialog(err.message || "대화 이력 조회 중 오류가 발생했습니다.", xui.enum.ERROR.getName());
            return { ok: false, unauthorized: aichat010.isUnauthorizedError(err) };
        });
    },
    validationSelectChatHistory : function(){
        //프레임웍에서 지원하는 기본 유효성 체크

        //기타 개발자 정의 유효성 체크
        return true;
    },


    //대화내용 전체 조회
    selectDataChatHistoryDetail : function(conversation_id, cursor, isLoadMore){
        // 최초 채팅방 생성 시에만 메시지를 다시 로드하지 않음 (이미 클라이언트에서 표시했으므로)
        if (isFirstChatInNewConversation && !isLoadMore) {
            xui.util.log("⚠️ 최초 채팅방 생성 중이므로 메시지 로드 건너뜀");
            return;
        }

        //welcome메세지 안보이게 처리
        // container에 --ing 클래스 추가
        if (!isLoadMore) {
            // v2 메인 채팅 컨테이너에 진행 상태 표시
            $("#container").addClass("--ing");
            // 초기 로드 시 변수 초기화
            nextCursor = null;
            hasMoreMessages = true;
            isLoadingMessages = false;
            loadedCursors = []; // 로드한 cursor 목록 초기화
            isInitialLoad = true; // 초기 로드 시작
            loadedCursors.push("0"); // cursor=0은 이미 로드 예정이므로 추가
        }

        // 로딩 중이면 중복 요청 방지
        if (isLoadingMessages) {
            return;
        }

        // 더 이상 불러올 메시지가 없으면 중단
        if (!hasMoreMessages && isLoadMore) {
            return;
        }

        //데이터유효성 체크
        if(!aichat010.validationSelectChatHistoryDetail()){return;}

        isLoadingMessages = true;

        // 요청할 cursor를 loadedCursors에 추가 (중복 요청 방지)
        var requestCursor = cursor || 0;
        var cursorKey = String(requestCursor);

        // 초기 로드가 아닐 때만 중복 체크 (초기 로드는 항상 실행)
        if (isLoadMore) {
            if (loadedCursors.indexOf(cursorKey) === -1) {
                loadedCursors.push(cursorKey);
                xui.util.log("요청할 cursor 추가:", cursorKey, "loadedCursors:", loadedCursors);
            } else {
                xui.util.log("이미 로드한 cursor이므로 요청 취소:", cursorKey);
                isLoadingMessages = false;
                return; // 이미 로드한 cursor이면 요청하지 않음
            }
        } else {
            // 초기 로드 시에는 cursor를 추가만 하고 요청 진행
            if (loadedCursors.indexOf(cursorKey) === -1) {
                loadedCursors.push(cursorKey);
            }
        }

        aichat010.requestApi("/xs/aichat/v2/messages", {
            method: "GET",
            query: {
                user_id: $("#user_id").val(),
                cursor: requestCursor,
                size: 10,
                conversation_id: String(conversation_id)
            }
        }).then(function(response){
            isLoadingMessages = false;

            if(!response.getErrorFlag()){
                var responseData = response.getDataJsonArray();

                // API 응답 원본 구조 확인
//                xui.util.log("response.getDataJsonArray():", responseData);

                // next_cursor 조회
                var foundNextCursor = null;
                if (responseData && responseData.length > 0 && responseData[0]) {
                    var firstItem = responseData[0];
                    if (firstItem.next_cursor !== undefined || firstItem.nextCursor !== undefined) {
                        foundNextCursor = firstItem.next_cursor || firstItem.nextCursor;
                    }
                }

                if (foundNextCursor !== null && foundNextCursor !== undefined) {
                    nextCursor = foundNextCursor;
                    // nextCursor가 0이면 더 이상 이전 메시지가 없다는 의미
                    if (nextCursor === 0 || nextCursor === "0") {
                        hasMoreMessages = false;
                        nextCursor = null;
                    } else {
                        hasMoreMessages = true;
                    }
                }

                // 채팅 타입 테마 및 placeholder 업데이트
                aichat010.updateChatTypeAndPlaceholder(mobjCategory);

                if (isLoadMore) {
                    // 추가 로드: 기존 메시지 위에 추가
                    aichat010.prependChatContents(responseData);
                } else {
                    // 초기 로드: 기존 메시지 교체
                    aichat010.setChatContents(responseData);
                    isNewChat = false;
                }
            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
            xui.util.log("History : "+mobjCategory);

            // 초기 로드일 경우에만 하단으로 스크롤
            if (!isLoadMore) {
                // 대화 이력 조회할 경우 스크롤을 위한 하단 여백 초기화
                $("#box").removeClass("--space");
                $("#box")[0].scrollTo({
                    top: $("#box")[0].scrollHeight
                });
                // 초기 로드 완료 후 스크롤 이벤트 활성화 (약간의 지연 후)
                setTimeout(function() {
                    isInitialLoad = false;
                    // console.log("초기 로드 완료 - 스크롤 이벤트 활성화");
                }, 500); // 스크롤 애니메이션 완료 후
            }
            // 초기 로드 완료 후 스크롤 이벤트 활성화 (약간의 지연 후)
            setTimeout(function() {
                xui.util.log("스크롤 후 KaTex변환");

                // TODO:PB [AI비서] hljs 테스트
                $("pre").addClass("theme-base16-cupertino");
                $("pre code").each(function () {
                    hljs.highlightElement(this);
                });
                // TODO:PB [AI비서] KaTeX 테스트
                $('.math').each(function(){
                    renderMathInElement(this, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true}, // 블록 수식
                            {left: "$", right: "$", display: false}, // 인라인 수식
                            {left: "\\[", right: "\\]", display: true}, // 블록 수식 (LaTeX 스타일)
                            {left: "\\(", right: "\\)", display: false}, // 인라인 수식 (LaTeX 스타일)
                            {left: "\\begin{equation}", right: "\\end{equation}", display: true}, // 명시적 블록
                            {left: "\\begin{align}", right: "\\end{align}", display: true}, // 여러 줄 정렬
                            {left: "\\begin{cases}", right: "\\end{cases}", display: true} // 조건 수식
                        ]
                    });
                });
            }, 500); // 스크롤 애니메이션 완료 후

            $('.util-box').each(function(){
                var count = $(this).closest(".chat").find(".bubble .journal-status-count").text();
                if ( count > 1 ) $(this).find(".journal-status-count").text(count);
            })
        }).catch(function(err){
            isLoadingMessages = false;
            xui.dialog.error(err.message || "메시지 조회 중 오류가 발생했습니다.", xui.enum.ERROR.getName());
        });
    },
    validationSelectChatHistoryDetail : function(){
        //프레임웍에서 지원하는 기본 유효성 체크

        //기타 개발자 정의 유효성 체크
        return true;
    },

    /**
     * 신규 채팅방 생성 및 메시지 전송
     * - 처리 순서: 채팅방 생성 → 파일 업로드 → 메시지 전송
     * - Promise 기반 비동기 처리
     * @param {string} message 사용자 입력 메시지
     * @param {string} chat_category 채팅 카테고리 (intranet/web_search)
     * @param {Array} filesToUpload 업로드할 파일 목록
     * @returns {Promise} 채팅방 생성 및 메시지 전송 완료 시 resolve
     */
    // 신규 채팅: 채팅방 먼저 생성 → 파일 업로드 → 메시지 전송
    selectDataCreateConversation: function(message, chat_category, filesToUpload) {
        // 채팅방 생성 초기 설정
        aichat010.initNewConversation();

        // 데이터 유효성 체크
        if (!aichat010.validationSelectCreateConversation(message)) {
            return Promise.reject(new Error('메시지 유효성 검증 실패'));
        }

        // 채팅방 생성 API 호출 (Promise 반환)
        return aichat010.requestApi("/xs/aichat/v2/conversation", {
            method: "POST",
            body: {
                user_id: xui.extends.session.getUserId(),
                user_query: message,
                chat_category: chat_category
            }
        }).then(function(response){
            if (!response.getErrorFlag()) {
                // conversation_id 추출 및 검증
                try {
                    mobjConversationId = aichat010.extractConversationId(response);

                    // conversation_id를 로컬 변수에도 저장 (클로저 문제 방지)
                    var createdConversationId = mobjConversationId;

                    // 채팅방 생성 성공 후 파일 업로드 진행
                    return aichat010.uploadFiles(filesToUpload)
                        .then(function(uploadedFiles) {
                            // 입력창 및 UI 초기화
                            aichat010.resetInputArea(chat_category);

                            // 스트리밍 시작 (메시지는 여기서 표시됨)
                            aichat010.selectDataChatStream(message, chat_category, createdConversationId, uploadedFiles);

                            // 채팅 완료 후 후처리
                            aichat010.completeConversation();

                            return true;
                        });
                } catch (error) {
                    // conversation_id 추출 실패
                    console.error('❌ conversation_id 추출 실패:', error);
                    xui.dialog.error("대화 목록이 생성되지 않았습니다.");
                    return Promise.reject(error);
                }
            } else {
                console.error('❌ 채팅방 생성 실패 - 에러 플래그 발생');
                var errorMsg = response.getMsg() || (response.jsonData && response.jsonData.message) || '채팅방 생성에 실패했습니다';
                xui.dialog.error(errorMsg, xui.enum.ERROR.getName());
                return Promise.reject(new Error(errorMsg));
            }
        }).catch(function(err){
            // 상위에서 catch 하도록 그대로 throw
            return Promise.reject(err);
        });
    },

    validationSelectCreateConversation : function(data){
        //프레임웍에서 지원하는 기본 유효성 체크
        if(xui.valid.isEmpty(data)){
//            aichat010.appendMessage("",xui.util.restoreXSS(aisearch030.enum.NOT_FIND_CONTENTS.getName()), "", "");
            xui.dialog.warning("", xui.util.restoreXSS(aichat010.enum.NOT_FIND_CONTENTS.getName()));
            return false;
        }
        //기타 개발자 정의 유효성 체크
        return true;
    },

    // ==================== 공통 메서드 ====================

    // 채팅방 생성 초기 설정
    initNewConversation: function() {
        // v2 메인 채팅 컨테이너에 진행 상태 표시
        $("#container").addClass("--ing");
        isFirstChatInNewConversation = true;
        hasMoreMessages = false;
    },

    // 입력창 및 UI 초기화
    resetInputArea: function(chat_category) {
        $("#inputArea").val("");
        if (chat_category) {
            aichat010.updateChatTypeAndPlaceholder(chat_category);
        }
    },

    // 채팅 완료 후 후처리
    completeConversation: function() {
        chatHistoryCurrentPage = 0;
        aichat010.selectConversations();
        isNewChat = false;
        aichat010.clearAttachedFiles();
    },

    // conversation_id 추출 및 검증
    extractConversationId: function(response) {
        var resData = response.getDataJsonArray();

        if (!resData || resData.length === 0 || !resData[0]) {
            throw new Error('응답 데이터 없음');
        }

        var conversationId = resData[0].conversation_id || resData[0].conversationId;
        if (!conversationId) {
            throw new Error('conversation_id 없음');
        }

        return conversationId;
    },

    // 채팅방 생성 API 파라미터 생성 (legacy - no longer used)
    buildCreateConversationParams: function(message, chat_category) {
        var params = new xui.json();
        params.setURL("/xs/aichat/v2/conversation");
        params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
        params.setString("user_id", $("#user_id").val());
        params.setString("user_query", message);
        params.setString("chat_category", chat_category);
        return params;
    },

    // ==================== 공통 메서드 끝 ====================

    /**
     * 삭제 모드에서 체크박스 선택 상태에 따라 삭제 버튼 활성/비활성 동기화
     * @returns {void}
     */
    syncDeleteButtonState : function() {
        var anyChecked = $(".list-view2-item .navigation-item-checkbox:checked").length > 0;
        $(".chat-delete").attr("tabIndex", anyChecked ? "0" : "-1");
    },

    /**
     * 대화방 목록 삭제 처리
     * - 체크박스로 선택된 대화방들을 일괄 삭제
     * - 삭제 성공 시 채팅 이력 목록 갱신
     * @returns {void}
     */
    deleteConversations : function(){
        // 체크박스로 선택된 대화방 ID 목록 추출
        var conversations = $('#chatHistory')
            .find('input[type="checkbox"]:checked')
            .map(function () {
                return $(this)
                    .closest('.list-view2-item')
                    .find('.list-view2[conversation_id]')
                    .attr('conversation_id');
            })
            .get();

        // 데이터 유효성 체크 (선택된 대화방이 있는지 확인)
        if(!aichat010.validationDeleteConversations(conversations)){return;}

        // REST: DELETE + JSON body
        aichat010.requestApi("/xs/aichat/v2/conversations", {
            method: "DELETE",
            body: {
                user_id: $("#user_id").val(),
                conversation_ids: conversations
            }
        }).then(function(response){
            if(!response.getErrorFlag()){
                chatHistoryCurrentPage = 0;
                aichat010.selectConversations();
                aichat010.searchAiBotInit(false, true);
            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
        }).catch(function(err){
            xui.dialog.error(err.message || "대화 삭제 중 오류가 발생했습니다.", xui.enum.ERROR.getName());
        });
    },

    validationDeleteConversations : function(data){
        if (data.length === 0) {
//            xui.dialog.warning("", xui.util.restoreXSS(aichat010.enum.NOT_SELECT_CONVERSATIONS.getName()));
            return false;
        }

        return true;
    },

    // 대화 최근 항목 전체조회
    selectDataBoardsAuth: function() {
        //데이터유효성 체크
        if (!aichat010.validationSelectBoardsAuth()) {
            return Promise.resolve({ ok: false });
        }

        // SQL Injection 취약점 보완: 입력값 검증
        if (!aichat010.validateAichatParams()) {
            return Promise.resolve({ ok: false });
        }

        return aichat010.requestApi("/xs/aichat/v2/board-auth", {
            method: "GET"
        }).then(function(response){
            if(!response.getErrorFlag()){
                // 임의의 JSON 구조 정의
//                var mockResponse = {
//                    content: [
//                        { board_name: "그룹 공지사항" },
//                        { board_name: "AI 확인 게시물" },
//                        { board_name: "효성지주사 업무서식" },
//                        { board_name: "효성지주사 규정" }
//                    ]
//                };
//                var data = mockResponse;
//                var contentList = data?.content;
//
//                if (Array.isArray(contentList)) {
//                    contentList.forEach(function(item) {
//                        console.log("게시판 이름:", item.board_name);
//                    });
//                } else {
//                    console.warn("content가 배열이 아닙니다.");
//                }

                var data = response.getDataJsonObject();
                var contentList = data?.content;
                aichat010.setBoardsAuthList(contentList);
                return { ok: true };
            }
            aichat010.showErrorDialog(response.getMsg(), xui.enum.ERROR.getName());
            return { ok: false };
        }).catch(function(err){
            aichat010.showErrorDialog(err.message || "게시판 권한 조회 중 오류가 발생했습니다.", xui.enum.ERROR.getName());
            return { ok: false };
        });
    },
    validationSelectBoardsAuth : function(){
        //프레임웍에서 지원하는 기본 유효성 체크

        //기타 개발자 정의 유효성 체크
        return true;
    },

    /**
     * 실시간 채팅 스트림 처리
     * - SSE(Server-Sent Events)를 통한 실시간 AI 챗봇 응답 스트리밍
     * - EventSource를 사용하여 서버로부터 스트림 데이터 수신
     * - 파일 첨부 시 파일 정보를 파라미터에 포함
     * @param {string} message 사용자 입력 메시지
     * @param {string} chat_category 채팅 카테고리 (intranet/web_search)
     * @param {string} conversation_id 대화방 ID
     * @param {Array} uploadedFiles 업로드된 파일 목록
     * @returns {void}
     */
    // 대화내용 실시간 채팅 : 초기채팅방 생성 후 실시간 채팅
    selectDataChatStream: function(message, chat_category, conversation_id, uploadedFiles) {
        // [추가] 기존에 연결된 SSE가 있다면 강제로 닫음 -----20260416
        if (eventSource) {
            try {
                xui.util.log("🧹 기존 SSE 연결 강제 종료 및 소켓 회수");
                eventSource.close();
            } catch(e) {}
            eventSource = null; // 이 부분이 누락되면 소켓이 반환되지 않을 수 있습니다.
        }

        // 화면 상태 확인
        var hasIngClass = $("#container").hasClass("--ing");

        // 데이터 유효성 체크
        if (!aichat010.validationChatStream()) return;

        // conversation_id 유효성 검증
        if (!conversation_id || conversation_id === 'undefined' || conversation_id === 'null') {
            xui.dialog.error("채팅방 ID가 유효하지 않습니다. 다시 시도해주세요.");
            return;
        }

        var _message = aichat010.embedViewTeamAfterHiddenChatMessage(message);
        currentStreamIsRndSearch = (chat_category === "rnd_search");

        // SQL Injection 취약점 보완: 입력값 검증
        if (!aichat010.validateAichatParams()) {
            return;
        }

        // 서버에 전송할 파라미터 객체 생성
        var params = new xui.json();
        params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());  // 요청 기능 권한 코드
        params.setString("user_id", $("#user_id").val());         // 요청자 ID
        params.setString("message", _message);                        // 사용자 입력
        params.setString("conversation_id", String(conversation_id)); // 대화방 ID
        params.setString("chat_category", chat_category);         // 검색 구분

        // 업로드된 파일 정보 파라미터 설정
        // - UUID 폴더 구조: "folderUuid/filename" 형식으로 전달
        // - 콤마 구분 문자열로 변환하여 전송
        // - folderUuid가 없는 파일(undefined)은 제외
        if (uploadedFiles.length > 0) {
            var folderUuids = uploadedFiles
                .filter(function(file) {
                    return file.folderUuid != null && file.folderUuid !== undefined && file.folderUuid !== '';
                })
                .map(function (file) {
                    return encodeURIComponent(file.folderUuid);
                });

            if (folderUuids.length > 0) {
                params.setString("files", folderUuids.join(","));
            }

            // 이미지 파일인 경우 thumbnailId 추가 (첫 번째 이미지의 folderUuid 사용)
            var firstImageFile = uploadedFiles.find(function(file) {
                return (file.thumbnailId || file.folderUuid) && file.folderUuid != null && file.folderUuid !== undefined;
            });
            if (firstImageFile && (firstImageFile.thumbnailId || firstImageFile.folderUuid)) {
                params.setString("thumbnailId", firstImageFile.thumbnailId || firstImageFile.folderUuid);
            }
        }

        // 웹 검색 여부 및 기타 값 초기화
        if (chat_category === 'web_search') {
            params.setString("web_search_enabled", "true");
        } else {
            params.setString("web_search_enabled", "false");
        }

        xui.util.log("📩 파라미터 JSON:", JSON.stringify(params));

        // 최초 채팅 여부 확인 (메시지 추가 전 말풍선 개수 확인)
        var $existingChats = $('div.chat');
        var isFirstChat = $existingChats.length === 0;

        // 메시지 추가 전 현재 메시지 개수를 기억 (첫 번째 새 메시지 찾기 위함)
        var existingMessageCount = $existingChats.length;

        // 파일 메시지 먼저 표시 (첨부된 파일이 있는 경우)
        if (uploadedFiles && uploadedFiles.length > 0) {
            uploadedFiles.forEach(function(fileInfo) {
                xui.util.log('📎 파일 정보:', fileInfo.name, 'thumbnailBase64:', fileInfo.thumbnailBase64 ? '있음' : '없음');
                var fileMessage = aichat010.buildFileMessageHtml(fileInfo);
                aichat010.appendMessage(fileMessage, "", "0", "");
            });
        }

        // 사용자 메시지 표시
        //aichat010.appendMessage($("<div/>").text(_message).html(), "", "0" , "");
        // hidden_chat은 "초기 메시지" 역할만 하므로 UI에는 사용자 말풍선이 노출되지 않게 처리한다.
        var _messageForUi = _message;
        if (_messageForUi && String(_messageForUi).includes("!!{{hidden_chat:")) {
            _messageForUi = "";
        }
        aichat010.appendMessage(
            $("<div/>").text(_messageForUi).html().replace(/\n/g, "<br>"),
            "",
            "0",
            ""
        );

        // 모든 메시지 추가 후 스크롤 처리 (첫 번째 새 메시지 인덱스 전달)
        aichat010._handleChatScrollAfterMessage(isFirstChat, false, existingMessageCount);

        // 진행 상태 출력 (로딩 표시, 입력창 잠금)
        $(".enter-message").addClass('--stop');
        aichat010.toggleInputAreaLock();
        aichat010.setLoading();

        // 스트리밍 시작 시 자동 스크롤 활성화
        isAutoScrollEnabled = true;

        // EventSource 생성 및 SSE 연결 시작
        mobjConversationId = conversation_id;
        var baseUrl = window.location.origin;
        //20251229 로직 변경후 주석처리 --------------
        //var encodeUri = encodeURIComponent(JSON.stringify(params));
        //eventSource = new EventSource(`${baseUrl}/xs/aichat/messageStream.stream?params=` + encodeUri, { withCredentials: true });
        //20251229 로직 변경후 주석처리 --------------


        // params 저장 및 SSE 시작 전 — 콤보 선택 팀으로 스트림 JWT 동기화
        aichat010.syncViewableTeamBeforeStream().then(function() {
            return aichat010.requestApi("/xs/aichat/v2/stream/sendMessageParam", {
                method: "POST",
                body: params.getDataJsonObject() // DATA[0]만 전송
            });
        }).then(function (response) {
            xui.util.log(response.getErrorFlag());
            if (!response.getErrorFlag()) {
                xui.util.log("✅ params 저장 완료, SSE 시작");

                //20251229 eventSource ---------------------------------------
                eventSource = new EventSource(`${baseUrl}/xs/aichat/v2/stream/message?conversation_id=` + mobjConversationId, { withCredentials: true });
                xui.util.log("SSE 연결 시도:", eventSource.url);

                // SSE 연결 성공
                eventSource.onopen = function() {
                    xui.util.log("✅ SSE 연결 성공");
                };

                var lineNo = 0;
                var searchKey = "";
                var answerData = "";
                /** hidden_chat 추천저널: 완료 시 빈 answerData로 말풍선 덮어쓰기 방지 */
                var recJournalStreamMode = false;

                // 메시지 수신 처리
                eventSource.onmessage = function(event) {
                    var outer = JSON.parse(event.data); // 첫 번째 파싱 → 문자열
                    var eventData = typeof outer === "string" ? JSON.parse(outer) : outer;
                    // 안전 정규화: status 누락인데 data가 sources 배열 형태면 sources로 간주
                    if ((!eventData.status || String(eventData.status).trim() === "")
                        && eventData.data && Array.isArray(eventData.data)
                        && eventData.data.length > 0
                        && eventData.data[0] && (eventData.data[0].source_id || eventData.data[0].doc_type || eventData.data[0].source_type)) {
                        eventData.status = "sources";
                    }
//                        xui.util.log("🙈 받은 데이터:", outer , "//" , typeof outer);
//                        xui.util.log("📩 받은 데이터:", eventData);
//                        xui.util.log("status 값 확인:", eventData.status);

                    switch (eventData.status.trim()) {
                        case "error":
                            console.error("🚨 오류:", eventData);
                            chunkBuffer = ""; // // [20260424] 마지막에 버퍼에 남은 찌꺼기가 있다면 마저 합쳐줌
                            aichat010.loadErrorStream(eventData.message || "오류가 발생했습니다.");
                            if (eventSource) {
                                eventSource.close();
                                eventSource = null; // 명시적 null 대입
                            }
                            $(".enter-message").removeClass('--stop');
                            aichat010.toggleInputAreaLock();
                            break;
                        case "user_requested":
                            xui.util.log("ℹ️ 사용자 요청 확인:", _message);
                            xui.util.log("ℹ️ 사용자 요청 확인:", eventData.user_message_id);
                            xui.util.log("ℹ️ 사용자 요청 확인:", eventData.ai_message_id);
                            searchKey = eventData.ai_message_id;
                            mobjAiMessageId = eventData.ai_message_id;
                            if (searchKey) {
                                messageJournalStatusVisibleMap[String(searchKey)] = !!currentStreamIsRndSearch;
                            }

                            // uploadedFiles에 message_id 추가 및 localStorage 업데이트 - aichatThumbnailStorage.js 모듈 사용
                            // 필요시 아래 주석을 해제하여 사용하세요
                            // if (uploadedFiles && uploadedFiles.length > 0 && eventData.user_message_id) {
                            //     if (typeof AichatThumbnailStorage !== 'undefined') {
                            //         AichatThumbnailStorage.updateThumbnailKeysWithMessageId(
                            //             uploadedFiles,
                            //             eventData.user_message_id,
                            //             mobjConversationId
                            //         );
                            //     }
                            // }

                            break;
                        case "processing":
                            var $chatContainer = $(".chat.--a.--empty");

                            // 없으면 초기 구조 생성
                            if ($chatContainer.length === 0) {
                                aichat010.appendMessage(
                                    "",
                                    "<div class='chat --a --empty'><div class='bubble'></div></div>",
                                    "waiting"
                                );
                                $chatContainer = $(".chat.--a.--empty");
                            }

                            var message = eventData.text.trim();

                            // 새로운 청크 div 생성
                            var $newChunk = $("<div class='skeleton-message --active'></div>").text(message);

                            // 이전 active 제거
                            $chatContainer.find(".skeleton-message").removeClass("--active");

                            // bubble 앞에 누적 추가
                            $chatContainer.find(".bubble").before($newChunk);
                        case "searching":
                            xui.util.log("🔎 검색 중...");
                            //진행 상태 출력
                            break;
                        case "response_started":
                            xui.util.log("💬 응답 시작");
                            lineNo = 0;
                            recJournalStreamMode = false;
                            // 수식 처리 관련 변수 초기화
                            isMathBlock = false;
                            mathBuffer = [];
                            currentEnv = null;
                            finalOutput = [];
                            answerData = "";
                            chunkBuffer = ""; // // [20260424] 마지막에 버퍼에 남은 찌꺼기가 있다면 마저 합쳐줌
                            break;
                        case "response_chunk":
                            lineNo++;

                            // hidden_chat 추천저널은 response_chunk 단계에서 렌더링하지 않고
                            // sources 이벤트에서만 누적 append 처리한다.
                            var isHiddenRecJournalChunk = _message && String(_message).indexOf("!!{{hidden_chat:") >= 0;
                            if (isHiddenRecJournalChunk) {
                                break;
                            }

                            if (eventData.text) {
                                xui.util.log("💬 청크:", eventData.text);
                                // chunk 단위로는 원시 텍스트만 누적 (수식 처리는 완료 시 수행)

                                // 20260417 출처 깨지는거 임시 수정
                                var fullText = chunkBuffer + eventData.text;
                                /**
                                 * 수정된 정규식 패턴 설명:
                                 * \[\[       : [[ 로 시작
                                 * [\s\d\n]* : 숫자(\d), 공백/줄바꿈(\s, \n)이 0개 이상 포함됨
                                 * \]\]       : ]] 로 종료
                                 * \n?        : 패턴 바로 뒤에 붙는 줄바꿈 하나까지 세트로 제거
                                 */
                                var return_text = fullText.replace(/\[\[[\s\d\n]*\]\]\n?/g, '');

                                // 2) 미완성 패턴 감지 로직 보완
                                // 패턴이 [[2\n 까지만 들어온 경우도 버퍼에 담아야 합니다.
                                // [ 로 시작해서 그 뒤에 숫자나 줄바꿈만 있는 상태로 끝나는지 확인
                                var partialMatch = return_text.match(/\[+[\d\s\n]*$/);
                                if (partialMatch) {
                                    chunkBuffer = partialMatch[0];
                                    return_text = return_text.substring(0, partialMatch.index);
                                } else {
                                    // 미완성 패턴이 없으면 버퍼를 비웁니다.
                                    chunkBuffer = "";
                                }

                                // 1) 링크 처리
                                var html = aichat010.extractReutersLinksFromHTML(return_text);
                                // 2) 최종 answerData 누적 (원시 텍스트)
                                answerData += html;
                                // 3) 렌더링 (수식 처리는 하지 않음 - 완료 시 처리)
                                aichat010.loadFindContentsStream(lineNo, searchKey, answerData);

                            } else if (eventData.sources) {// 1차 분기: sources 존재 여부
                                xui.util.log("📚 출처 청크 수신:", eventData.sources);
                                var jsonText = aichat010.extractReutersSource2(eventData.sources);
                                answerData += jsonText;
                                aichat010.loadFindContentsStream(lineNo, searchKey, answerData);
                            } else {
                                console.warn("⚠️ 알 수 없는 response_chunk:", eventData);
                            }
                            break;
                        case "source_headers":
                            if (eventData.headers) {
                                // hidden_chat 추천 저널 스트림에서는 출처 탭(journal-status-bar) 불필요
                                if (_message && String(_message).indexOf("!!{{hidden_chat:") >= 0) {
                                    break;
                                }
                                if (recJournalStreamMode) {
                                    break;
                                }
                                // 출처 헤더 처리 (객체 그대로 전달)
                                var sourceHeader = aichat010.loadSourceHeader(eventData.headers, searchKey);
                                // Markdown 파싱 안정화를 위해 헤더 HTML 뒤에 빈 줄 2개를 보장
                                answerData = sourceHeader + "\n\n" + answerData;
                                // 렌더링
                                aichat010.loadFindContentsStream(lineNo, searchKey, answerData);
                            }
                            break;
                        case "sources":
                            xui.util.log("💬 sources 수신", eventData.data);

                            // 서버가 { status: "sources", data: [...] }로 내리는 경우 → response_chunk가 아님
                            var isHiddenRecJournalSources = _message && String(_message).indexOf("!!{{hidden_chat:") >= 0;
                            if (isHiddenRecJournalSources && eventData.data && Array.isArray(eventData.data) && eventData.data.length > 0) {
                                recJournalStreamMode = true;
                                var hiddenCtx = aichat010.parseHiddenChatContext(_message);
                                var headingHtmlSrc = aichat010.buildRecJournalTitleHeadingHtml(hiddenCtx.teamName, null, hiddenCtx.docType);
                                var $ansForJournal = $("#ans" + searchKey);
                                if (!$ansForJournal.length) {
                                    answerData = headingHtmlSrc;
                                    aichat010.loadFindContentsStream(1, searchKey, headingHtmlSrc, { bubbleBlock: true });
                                }
                                aichat010.appendRecJournalSourcesToAnswer(searchKey, eventData);
                                break;
                            }

                            aichat010.renderSourceLinksCount(eventData.data);

                            var temp_title = '';
                            if(eventData.data[0].source_type == 'web') temp_title = eventData.data[0].display_title ;
                            else temp_title = eventData.data[0].display_title + '-' + eventData.data[0].source_title;

                            var refHtml  = '<div class="source" data-id="' + searchKey + '">'
                                + '    <div class="source-button"  data-role="modal-opener" data-target="sourceModal' + searchKey + '" tabIndex="0">'
                                + temp_title
                                + '	<div class="source-num"> +'
                                + aichat010.renderSourceLinksCount(eventData.data)
                                + '    </div></div>'
                                + '</div>';
                            var contentsRef = aichat010.renderSourceLinks(eventData.data, searchKey);
                            // "출처 N" 상태바 클릭 시에도 타입별 탭 카운트가 유지되도록 캐시
                            var liveHeaders = aichat010.buildSourceHeadersFromSources(eventData.data);
                            aichat010.cacheSourceHeadersOnStatusBar(searchKey, liveHeaders);

                            $("#ans" + searchKey).append(refHtml);
                            $("#ans" + searchKey).append(contentsRef);

                            var $refHtml = $(refHtml);
//                                  $("#ans" + searchKey).children().last().after($refHtml);
//                                  $refHtml.append(contentsRef);

                            // 스타일
                            //$refHtml.prev().css({
                            $refHtml.css({
                                "display": "inline",
                                "margin-right": "8px"
                            });

                            break;
                        case "completed":
                        case "response_completed":
                            xui.util.log("✅ 전송 완료");
                            // [20260424] 마지막에 버퍼에 남은 찌꺼기가 있다면 마저 합쳐줌
                            if (chunkBuffer !== "") {
                                answerData += aichat010.extractReutersLinksFromHTML(chunkBuffer);
                                chunkBuffer = ""; // 비우기
                            }

                            // 1) 수식 블록 처리 (전체 텍스트에 대해)
                            var processedData = aichat010.wrapMathBlocks(answerData);

                            // 2) 수식이 적용된 텍스트로 다시 렌더링
                            //    추천 저널(hidden_chat)은 이미 .bubble --block + 카드로 그려졌고 answerData가 비어 있으면 초기화됨 → 건너뜀
                            if (!recJournalStreamMode) {
                                aichat010.loadFindContentsStream(lineNo, searchKey, processedData);
                            }
                            recJournalStreamMode = false;

                            //피드백 이벤트 생성 (.chat --a 직계 자식으로 util-box — JSP와 동일)
                            var feedbackHtml = aichat010.setMessageFeedback(searchKey, '');
//                                aichat010.appendMessage("", "", searchKey, feedbackHtml);

                            // TODO:PB [AI비서] hljs 테스트
                            $("pre").addClass("theme-base16-cupertino");
                            $("pre code").each(function () {
                                hljs.highlightElement(this);
                            });

                            // TODO:PB [AI비서] KaTeX 테스트
                            // DOM 업데이트 후 KaTeX 렌더링 (약간의 지연 필요)
                            setTimeout(function (){
                                // 특정 메시지 영역의 수식만 렌더링
                                $("#ans" + searchKey + " .math").each(function () {
                                    renderMathInElement(this, {
                                        delimiters: [
                                            {left: "$$", right: "$$", display: true}, // 블록 수식
                                            {left: "$", right: "$", display: false}, // 인라인 수식
                                            {left: "\\[", right: "\\]", display: true}, // 블록 수식 (LaTeX 스타일)
                                            {left: "\\(", right: "\\)", display: false}, // 인라인 수식 (LaTeX 스타일)
                                            {left: "\\begin{equation}", right: "\\end{equation}", display: true}, // 명시적 블록
                                            {left: "\\begin{align}", right: "\\end{align}", display: true}, // 여러 줄 정렬
                                            {left: "\\begin{cases}", right: "\\end{cases}", display: true} // 조건 수식
                                        ]
                                    });
                                });
                            }, 50);// DOM 업데이트 후 렌더링을 위해 약간의 지연

                            //초기화
                            lineNo = 0;
                            answerData = "";
                            // 수식 처리 관련 변수도 초기화
                            isMathBlock = false;
                            mathBuffer = [];
                            currentEnv = null;
                            finalOutput = [];
                            break;
                        case "done":
                            xui.util.log("✅ done done done");
                            if (eventSource) {
                                eventSource.close();
                                eventSource = null; // 명시적 null 대입
                            }

                            chunkBuffer = ""; // // [20260424] 마지막에 버퍼에 남은 찌꺼기가 있다면 마저 합쳐줌

                            aichat010.defineEventChatFeedback();
                            $(".enter-message").removeClass('--stop');
                            aichat010.toggleInputAreaLock();

                            // 수식 처리 관련 변수 초기화
                            isMathBlock = false;
                            mathBuffer = [];
                            currentEnv = null;
                            finalOutput = [];

                            // 최초 대화 완료 후 상태 초기화
                            if (isFirstChat) {
                                aichat010._handleFirstChatCompletion();
                                // 최초 채팅인 경우 스크롤하지 않음
                                $("#box").removeClass("--space");
                            } else {
                                // 기존 대화인 경우에도 스크롤하지 않음 (사용자 메시지 위치 유지)
                                $("#box").removeClass("--space");
                            }
                            break;
                        default:
                            // 처리 필요 없는 상태는 로깅만
                            xui.util.log("ℹ️ 처리할 필요 없는 상태:", eventData.status);
                            break;
                    }
                };

                // SSE 연결 오류 처리
                eventSource.onerror = function(e) {
                    console.error("❌ SSE 연결 오류:", e);
                    eventSource.close();
                    $(".enter-message").removeClass('--stop');
                    aichat010.toggleInputAreaLock();
                    aichat010.loadErrorStream("메시지 전송에 실패했습니다.");
                };
                //20251229 eventSource ---------------------------------------
            } else {
                // ❌ sendMessage 실패 → UI 롤백
                console.error("❌ params 전송 실패");
                $(".enter-message").removeClass('--stop');
                aichat010.toggleInputAreaLock();
                aichat010.loadErrorStream("메시지 전송에 실패했습니다.");
            }
        }).catch(function(err){
            console.error("❌ params 전송 실패:", err);
            $(".enter-message").removeClass('--stop');
            aichat010.toggleInputAreaLock();
            aichat010.loadErrorStream("메시지 전송에 실패했습니다.");
        });
    },


    validationChatStream : function(){
        //프레임웍에서 지원하는 기본 유효성 체크
//        if(xui.valid.isEmpty(data)){
////            aichat010.appendMessage("",xui.util.restoreXSS(aisearch030.enum.NOT_FIND_CONTENTS.getName()), "", "");
//            xui.dialog.warning("", xui.util.restoreXSS(aisearch030.enum.NOT_FIND_CONTENTS.getName()));
//            return false;
//        }
        //기타 개발자 정의 유효성 체크
        return true;
    },

    //대화 강제 중지
    selectDataStopStream : function(conversationId, aiMessageId){ // 인입되는 값은 ai_message_id
//        var conversations = $("#chatHistory").find('input[type="checkbox"]:checked').map(function(){return this.id;}).get();

        //데이터유효성 체크
        if(!aichat010.validationSelectDataStopStream(conversationId)){return;}
        xui.util.log("❌ SSE 연결 삭제:", aiMessageId);

        aichat010.requestApi("/xs/aichat/v2/stream/interrupt", {
            method: "POST",
            body: {
                conversation_id: String(conversationId),
                user_id: $("#user_id").val(),
                message_id: String(aiMessageId)
            }
        }).then(function(response){
            if(!response.getErrorFlag()){
                if (eventSource) {
                    eventSource.close();
                    eventSource = null; // 소켓 참조 해제
                    xui.util.log('클라이언트 SSE 종료 및 null 처리');
                }
                chunkBuffer = ""; // // [20260424] 마지막에 버퍼에 남은 찌꺼기가 있다면 마저 합쳐줌

                xui.util.log('클라이언트 SSE 종료');
                mobjAiMessageId = '';
                // 강제 중지할 경우 그방은 계속 대화를 이어갈수 있는가?
                // 채팅 강제 중지했을대 문구 노출 추가
                aichat010.appendMessage("","대화가 중지되었습니다. 다시 말씀해주세요", "", "");
                $(".enter-message").removeClass('--stop');
                aichat010.toggleInputAreaLock();
            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
        }).catch(function(err){
            xui.dialog.error(err.message || "중지 요청 중 오류가 발생했습니다.", xui.enum.ERROR.getName());
        });
    },

    validationSelectDataStopStream : function(data){
//        if (data.length === 0) {
//            xui.dialog.warning("", xui.util.restoreXSS(aichat010.enum.NOT_SELECT_CONVERSATIONS.getName()));
//            return false;
//        }

        return true;
    },


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SAVE: 데이터 저장 처리에 대한 함수 정의 [기본함수명:saveData + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
    //챗봇 피드백 등록
    saveDataFeedback : function(element, feedbackType){

        //데이터유효성 체크
        if(!aichat010.validationSaveDataFeedback()){return;}

        var conversation_id = mobjConversationId;
        var message_id = $(element).data("searchkey");
        var feedback_type = feedbackType;

        xui.util.log("saveDataFeedback:", element);
        xui.util.log("saveDataFeedback:", conversation_id, message_id, feedback_type);

        var url =
            `/xs/aichat/v2/conversations/${encodeURIComponent(conversation_id)}` +
            `/messages/${encodeURIComponent(String(message_id))}/feedback`;

        aichat010.requestApi(url, {
            method: "PUT",
            query: {
                user_id: $("#user_id").val()
            },
            body: {
                // 내부 FeedbackRequest는 feedbackType 필드를 가짐
                feedback_type: feedbackType
            }
        }).then(function(response){
            if(!response.getErrorFlag()){
                // $(element).data("feedback", response.getDataJsonObject().feedback_id);
                var newFeedbackId = response.getDataJsonObject().feedback_id;
                // attr + data() 캐시 둘 다 갱신해야 다음 클릭 delete가 바로 동작함
                $(element).attr("data-feedback", newFeedbackId);
                $(element).data("feedback", newFeedbackId);
            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
        }).catch(function(err){
            xui.dialog.error(err.message || "피드백 저장 중 오류가 발생했습니다.", xui.enum.ERROR.getName());
        });
    },
    validationSaveDataFeedback : function(){
        return true;
    },

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DELETE: 삭제 데이터 처리에 대한 함수 정의 [기본함수명:deleteData + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
    deleteDataFeedback : function(element, feedbackId){

        //데이터유효성 체크
//         if(!aichat010.validationSaveDataFeedback()){return;}
        if (!feedbackId) {
            return;
        }

        var conversation_id = mobjConversationId;
        var message_id = $(element).data('searchkey');
        var feedback_id = feedbackId;

        xui.util.log("deleteDataFeedback:", conversation_id, message_id, feedback_id);


        var url =
            `/xs/aichat/v2/conversations/${encodeURIComponent(conversation_id)}` +
            `/messages/${encodeURIComponent(String(message_id))}/feedback/${encodeURIComponent(feedback_id)}`;

        aichat010.requestApi(url, {
            method: "DELETE",
            query: {
                user_id: $("#user_id").val()
            }
        }).then(function(response){
            if(!response.getErrorFlag()){
                //                console.log("!! "+ response.getDataJsonObject().total_count);
                //$(element).data("feedback", "");
                $(element).attr("data-feedback", "").removeData("feedback");
            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
        }).catch(function(err){
            xui.dialog.error(err.message || "피드백 삭제 중 오류가 발생했습니다.", xui.enum.ERROR.getName());
        });
    },

// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// PRINT: 출력 및 레포트 데이터 처리에 대한 함수 정의 [기본함수명:printData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
    printData : function(){
    },
    // --------------------------------------------------------------------------------------------------------------------------------------------------------------
    // EXCEL: 엑셀 IMPORT / EXPORT 처리에 대한 함수 정의 [기본함수명:exportData + (구분단어) importData + (구분단어)]
    // --------------------------------------------------------------------------------------------------------------------------------------------------------------
    exportDataExcel : function(){
    },

    /***************************************************************************************************************************************************************
     * User Functions: 별도 화면 처리를 위해 필요한 함수를 정의한다.
     ***************************************************************************************************************************************************************/
    /**
     * GET /xs/aichat/v2/rnd/viewable-teams → sidebar 콤보·추천저널 다이얼로그 공통 목록
     */
    fetchViewableTeamsComboData: function() {
        return aichat010.requestApi("/xs/aichat/v2/rnd/viewable-teams", {
            method: "GET"
        }).then(function(response) {
            if (response.getErrorFlag()) {
                aichat010.showErrorDialog(response.getMsg(), xui.enum.ERROR.getName());
                return [];
            }

            var teams = response.getDataJsonArray("DATA") || [];
            return teams.map(function(team) {
                return {
                    code: team.code || team.CODE || "",
                    codeName: team.name || team.NAME || team.codeName || ""
                };
            }).filter(function(item) {
                return item.code;
            });
        });
    },

    storeViewableTeamComboData: function(comboData) {
        aichat010._viewableTeamNameByCode = {};
        comboData.forEach(function(item) {
            aichat010._viewableTeamNameByCode[item.code] = item.codeName;
        });
    },

    /** 추천저널 설정 다이얼로그 팀 옵션 렌더 */
    populateRecJournalTeamDialog: function(comboData) {
        var $select = $(".common-dialog__select");
        if (!$select.length) {
            return;
        }

        $select.empty();
        if (!Array.isArray(comboData) || comboData.length === 0) {
            aichat010.syncRecJournalTeamDialogSelection();
            return;
        }

        comboData.forEach(function(item) {
            $("<div/>")
                .addClass("common-dialog__option")
                .attr("data-team-code", item.code)
                .text(item.codeName || item.code)
                .appendTo($select);
        });
        aichat010.syncRecJournalTeamDialogSelection(aichat010.getSelectedViewableTeamCode());
    },

    /** 다이얼로그 표시 텍스트를 getSelectedViewableTeamCode 기준으로 맞춤 */
    syncRecJournalTeamDialogSelection: function(teamCode) {
        var $selection = $(".common-dialog__selection");
        if (!$selection.length) {
            return;
        }

        var code = teamCode || aichat010.getSelectedViewableTeamCode();
        var name = "";
        if (code && aichat010._viewableTeamNameByCode && aichat010._viewableTeamNameByCode[code]) {
            name = aichat010._viewableTeamNameByCode[code];
        } else {
            name = aichat010.getSelectedViewableTeamName();
        }

        $selection.data("selected-team-code", code);
        $selection.find(".common-dialog__select-text").text(name || code || "팀");
    },

    openRecJournalTeamDialog: function() {
        if (!isAllowedJournal) {
            return;
        }
        var showDialog = function(comboData) {
            if (Array.isArray(comboData) && comboData.length > 0) {
                aichat010.storeViewableTeamComboData(comboData);
                aichat010.populateRecJournalTeamDialog(comboData);
            } else {
                aichat010.syncRecJournalTeamDialogSelection();
            }
            $(".common-dialog").addClass("active");
        };

        if (aichat010._viewableTeamNameByCode && Object.keys(aichat010._viewableTeamNameByCode).length > 0) {
            var cachedComboData = Object.keys(aichat010._viewableTeamNameByCode).map(function(code) {
                return {
                    code: code,
                    codeName: aichat010._viewableTeamNameByCode[code]
                };
            });
            showDialog(cachedComboData);
            return;
        }

        aichat010.fetchViewableTeamsComboData()
            .then(showDialog)
            .catch(function(err) {
                xui.util.log("rec journal team dialog load failed: " + (err && err.message ? err.message : err));
                showDialog([]);
            });
    },

    /**
     * sidebar 조회 가능 팀 콤보 로드 (GET /xs/aichat/v2/rnd/viewable-teams)
     */
    loadViewableTeamsCombo: function() {
        var $combo = $("#viewable_team_code");
        var hasSidebarCombo = $combo.length
            && $combo[0].parentNode
            && $combo[0].parentNode.classList.contains("xui-combo-label");

        return aichat010.fetchViewableTeamsComboData().then(function(comboData) {
            if (comboData.length === 0) {
                return;
            }

            aichat010.updateViewableTeamOwnerVisibility(comboData);
            aichat010.storeViewableTeamComboData(comboData);
            aichat010.populateRecJournalTeamDialog(comboData);

            if (!hasSidebarCombo) {
                return;
            }

            xui.util.drawCombo($combo, comboData);

            var currentTeamCode = $("#team_code").val() || xui.extends.session.getDeptCode() || "";
            if (currentTeamCode) {
                $combo.valExt(currentTeamCode, true, false);
                aichat010.applyViewableTeamSelection(currentTeamCode);
            }

            $combo.off("change.viewableTeam").on("change.viewableTeam", function() {
                var selectedCode = $(this).valExt();
                aichat010.syncRecJournalTeamDialogSelection(selectedCode);
                aichat010.applyViewableTeamSelection(selectedCode).then(function() {
                    if ($("#journalContainer").is(":visible")
                        && typeof journal !== "undefined"
                        && typeof journal.selectData === "function") {
                        journal.selectData(1, 10);
                    }
                });
            });
        }).catch(function(err) {
            xui.util.log("viewable teams load failed: " + (err && err.message ? err.message : err));
        });
    },

    applyViewableTeamSelection: function(selectedCode) {
        if (!selectedCode) {
            return Promise.resolve();
        }

        return aichat010.requestApi("/xs/aichat/v2/session/jwt-team-code", {
            method: "PUT",
            body: {
                code: selectedCode
            }
        }).then(function(response) {
            if (response.getErrorFlag()) {
                aichat010.showErrorDialog(response.getMsg(), xui.enum.ERROR.getName());
            }
        }).catch(function(err) {
            aichat010.showErrorDialog(
                err.message || "조회 팀 설정 중 오류가 발생했습니다.",
                xui.enum.ERROR.getName()
            );
        });
    },

    /** 서버 HttpSession → xui.extends.session.sessionInfo (webbaseCmmn.js와 동일) */
    syncClientSessionInfo: function() {
        var param = new xui.json();
        param.setURL(xui.com.getRequestPrefix() + "/getSessionInfo.json");
        param.setString("key", "ALL");
        param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
        var response = xui.ajax.callSync(param);
        if (!response.getErrorFlag() && response.getDataJsonArray("DATA").length > 0) {
            xui.extends.session.sessionInfo = response.getDataJsonArray("DATA")[0];
        }
    },

    /**
     * 최초 진입 시 프로필 표시명 보강.
     * SSO createSession(selectUserForLogin)만으로 DEPT_NAME·직위가 비고, changeLocale(selectUserBase) 후에만 채워지는 경우 대비.
     */
    hydrateUserProfileFromServer: function() {
        aichat010.syncClientSessionInfo();
        var deptName = xui.extends.session.getSessionInfoByKey("DEPT_NAME");
        var position = xui.extends.session.getSessionInfoByKey("OFFICIAL_POSITION_NAME");
        if (!xui.valid.isEmpty(deptName) && !xui.valid.isEmpty(position)) {
            return;
        }
        var lang = xui.extends.session.getSessionInfoByKey("LANGUAGE_CODE");
        if (xui.valid.isEmpty(lang) && typeof $.cookie === "function") {
            lang = $.cookie("languageCode");
        }
        if (xui.valid.isEmpty(lang) || aichat010.LANGUAGE_OPTION_CODES.indexOf(lang) < 0) {
            lang = "ko";
        }
        var param = new xui.json();
        param.setURL("/xs/webbase/login/changeLocale.json");
        param.setString("languageCode", lang);
        param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
        var response = xui.ajax.callSync(param);
        if (response.getErrorFlag()) {
            return;
        }
        var sysCode = response.getDataJsonObject("SYS_CODE");
        if (sysCode) {
            xui.syscode.load(sysCode);
        }
        var messageData = response.getDataJsonArray("MESSAGE_DATA");
        if (messageData && messageData.length) {
            xui.message.load(messageData);
        }
        if (typeof $.cookie === "function") {
            $.cookie("languageCode", lang, { expires: 30 });
        }
        aichat010.syncClientSessionInfo();
    },

    /** 프로필 영역(이름/직급/팀)을 세션 값 기준으로 다시 그린다. */
    refreshUserProfileArea: function() {
        var userFullName = xui.extends.session.getSessionInfoByKey("USER_NAME") || "";
        var position = xui.extends.session.getSessionInfoByKey("OFFICIAL_POSITION_NAME") || "";
        var deptName = xui.extends.session.getSessionInfoByKey("DEPT_NAME") || "";

        $(".current-user__name").text(userFullName);
        $(".current-user__position").text(position);
        $(".current-user__affiliate").text(deptName);
        $("#user_full_name").val(userFullName);

        var helpName = (userFullName + " " + position).trim();
        if ($("#tooltip-name").length) {
            $("#tooltip-name").text(helpName);
        }
    },

    /** 지원 로케일(ko/en/zh) — SYS028·언어 드롭다운 공통 */
    LANGUAGE_OPTION_CODES: ["ko", "en", "zh"],

    /** sidebar 언어 드롭다운 초기화(세션 로케일 → 표시 라벨) */
    initLanguageSelect: function() {
        if (!$(".current-user__language").length) {
            return;
        }
        aichat010.ensureLanguageItemCodes();
        aichat010.refreshLanguageOptionLabels();
        var userLang = xui.extends.session.getLanguage();
        if (!xui.valid.isEmpty(userLang)) {
            aichat010.syncLanguageSelectUi(userLang);
        }
        aichat010.unDefineLanguageSelectEvent();
        aichat010.defineLanguageSelectEvent();
    },

    /** hyobee.locale.{code} 또는 SYS028 codeName으로 언어명 표기 */
    getLanguageOptionLabel: function(languageCode) {
        if (xui.valid.isEmpty(languageCode)) {
            return "";
        }
        var label = aichat010.msg("hyobee.locale." + languageCode);
        if (!xui.valid.isEmpty(label)) {
            return label;
        }
        var languages = xui.syscode.get("SYS028") || [];
        for (var i = 0; i < languages.length; i++) {
            if (languages[i].code === languageCode) {
                return languages[i].codeName || languageCode;
            }
        }
        return languageCode;
    },

    /** 드롭다운 항목(ko/en/zh) 라벨을 현재 UI 로케일 문구로 갱신 */
    refreshLanguageOptionLabels: function() {
        $(".current-user__language-item").each(function() {
            var code = $(this).attr("data-language-code");
            if (!xui.valid.isEmpty(code)) {
                $(this).text(aichat010.getLanguageOptionLabel(code));
            }
        });
    },

    /** JSP 항목에 data-language-code가 없을 때 표시문구 → SYS028 코드 매핑 */
    ensureLanguageItemCodes: function() {
        var $items = $(".current-user__language-item");
        if (!$items.length) {
            return;
        }
        var labelToCode = {
            "한국어": "ko",
            "english": "en",
            "中國語": "zh",
            "中国語": "zh",
            "日本語": "ja",
            "日语": "ja"
        };
        $items.each(function() {
            var $el = $(this);
            if (!xui.valid.isEmpty($el.attr("data-language-code"))) {
                return;
            }
            var text = ($el.text() || "").trim();
            var code = labelToCode[text] || labelToCode[text.toLowerCase()];
            if (!xui.valid.isEmpty(code)) {
                $el.attr("data-language-code", code);
            }
        });
    },

    /** 선택된 언어 코드에 맞게 상단 라벨·드롭다운 닫기 */
    syncLanguageSelectUi: function(languageCode) {
        if (xui.valid.isEmpty(languageCode)) {
            return;
        }
        $(".current-user__language-text").text(aichat010.getLanguageOptionLabel(languageCode));
        $(".current-user__language, .current-user__language-list").removeClass("active");
    },

    unDefineLanguageSelectEvent: function() {
        $(".current-user__language-list").off("click.languageSelect");
    },

    defineLanguageSelectEvent: function() {
        $(".current-user__language-list").on("click.languageSelect", ".current-user__language-item", function(e) {
            e.stopPropagation();
            var languageCode = $(this).attr("data-language-code");
            if (xui.valid.isEmpty(languageCode)) {
                return;
            }
            aichat010.changeLocale(languageCode);
        });
    },

    /**
     * 언어 변경 — POST /xs/webbase/login/changeLocale.json 후 메시지·동적 UI 갱신
     * @param {string} languageCode SYS028 코드 (ko, en, ja, …)
     */
    changeLocale: function(languageCode) {
        if (xui.valid.isEmpty(languageCode)) {
            return;
        }
        if (aichat010.LANGUAGE_OPTION_CODES.indexOf(languageCode) < 0) {
            return;
        }
        var currentLang = xui.extends.session.getLanguage() || "";
        if (currentLang === languageCode) {
            aichat010.syncLanguageSelectUi(languageCode);
            return;
        }

        var param = new xui.json();
        param.setURL("/xs/webbase/login/changeLocale.json");
        param.setString("languageCode", languageCode);
        param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
        param.setCallBack(function(response) {
            if (response.getErrorFlag()) {
                return;
            }
            xui.syscode.load(response.getDataJsonObject("SYS_CODE"));
            xui.message.load(response.getDataJsonArray("MESSAGE_DATA"));
            if (typeof $.cookie === "function") {
                $.cookie("languageCode", languageCode, { expires: 30 });
            }
            aichat010.refreshSessionAfterLocaleChange(languageCode);
            aichat010.applyLocaleToDynamicUi();
        });
        xui.ajax.callService(param);
    },

    /** changeLocale 후 세션 사용자명·부서명 등 다국어 필드 동기화 */
    refreshSessionAfterLocaleChange: function(languageCode) {
        if (!xui.valid.isEmpty(languageCode) && xui.extends.session.sessionInfo) {
            xui.extends.session.sessionInfo.LANGUAGE_CODE = languageCode;
        }
        aichat010.syncClientSessionInfo();
        aichat010.refreshUserProfileArea();
    },

    /** placeholder enum만 현재 로케일 메시지로 다시 채운다 */
    reloadPlaceholderEnums: function() {
        aichat010.enum.setEnum("WEB_PLACEHOLDER_MESSAGES", "INFO",
            [
                aichat010.msg("hyobee.placeholder.web.q1"),
                aichat010.msg("hyobee.placeholder.web.q2"),
                aichat010.msg("hyobee.placeholder.web.q3"),
                aichat010.msg("hyobee.placeholder.web.q4"),
                aichat010.msg("hyobee.placeholder.web.q5"),
                aichat010.msg("hyobee.placeholder.web.q6"),
                aichat010.msg("hyobee.placeholder.web.q7"),
                aichat010.msg("hyobee.placeholder.web.q8")
            ],
            ""
        );
        aichat010.enum.setEnum("INTERNAL_PLACEHOLDER_MESSAGES", "INFO",
            [
                aichat010.msg("hyobee.placeholder.internal.q1"),
                aichat010.msg("hyobee.placeholder.internal.q2"),
                aichat010.msg("hyobee.placeholder.internal.q3"),
                aichat010.msg("hyobee.placeholder.internal.q4"),
                aichat010.msg("hyobee.placeholder.internal.q5"),
                aichat010.msg("hyobee.placeholder.internal.q6")
            ],
            ""
        );
        aichat010.enum.setEnum("RND_PLACEHOLDER_MESSAGES", "INFO",
            [aichat010.msg("hyobee.placeholder.rnd.q1")],
            ""
        );
        aichat010.enum.setEnum("FILE_PLACEHOLDER_MESSAGES", "INFO",
            [aichat010.msg("hyobee.placeholder.file.q1")],
            ""
        );
    },

    /** changeLocale 성공 후 message-text·동적 문구·placeholder 등 재적용 */
    applyLocaleToDynamicUi: function() {
        aichat010.reloadPlaceholderEnums();

        var scanRoots = [
            document.querySelector(".left-unfolded"),
            document.querySelector("#container"),
            document.querySelector(".common-dialog"),
            document.querySelector(".chat-info"),
            document.querySelector(".banner-message")
            // document.querySelector(".footer") || document.querySelector("#footer") // 💡 footer 클래스 또는 ID 추가
        ];
        for (var i = 0; i < scanRoots.length; i++) {
            if (scanRoots[i]) {
                xui.com.elementLabelScan(scanRoots[i]);
            }
        }

        aichat010.renderJournalTabList();
        aichat010.updateJournalChromeLabels();
        aichat010.showWelcomeMessage("#user_full_name", ".welcome-message");
        aichat010.updateChatTypeAndPlaceholder(aichat010.resolveCurrentChatCategory());

        if (!xui.valid.isEmpty($("#user_id").val())) {
            chatHistoryCurrentPage = 0;
            aichat010.selectConversations();
        }

        aichat010.refreshLanguageOptionLabels();
        aichat010.syncLanguageSelectUi(xui.extends.session.getLanguage());
        aichat010.loadViewableTeamsCombo();
    },

    setUserParams: function() {

        var params = new URLSearchParams(window.location.search);
        // ?userId=bp0068246&pgCode=S&puCode=bp0068246&teamCode=74J47
//        var userId = params.get('userId'); //bp0068246
//        var pgCode = params.get('pgCode'); //S
//        var puCode = params.get('puCode'); //S01
//        var teamCode = params.get('teamCode'); //16761
//        var corpCode = params.get('corpCode'); //74J47
        var userId = xui.extends.session.getSessionInfoByKey("USER_ID") || params.get('userId') || ''; //bp0068246
        var pgCode = xui.extends.session.getSessionInfoByKey("PG_CODE") || params.get('pgCode') || ''; //S
        var puCode = xui.extends.session.getSessionInfoByKey("PU_CODE") || params.get('puCode') || ''; //S01
        var teamCode = xui.extends.session.getSessionInfoByKey("DEPT_CODE") || params.get('teamCode') || ''; //16761
        //var corpCode = xui.extends.session.getSessionInfoByKey("CORP_CODE") || params.get('corpCode') || ''; //H000
        var corpCode = xui.extends.session.getSessionInfoByKey("GBIS_CORP_CODE") || params.get('corpCode') || ''; //00
        var userFullName = xui.extends.session.getSessionInfoByKey("USER_NAME") || params.get('userFullName') || '';
        var userFirstName = userFullName ? userFullName.charAt(0) : '';
        var position = xui.extends.session.getSessionInfoByKey("OFFICIAL_POSITION_NAME") || params.get('position') || '';
        var affiliate = xui.extends.session.getSessionInfoByKey("FULL_DEPT_NAME") || params.get('fullDeptName') || '';
        var deptName = xui.extends.session.getSessionInfoByKey("DEPT_NAME") || params.get('deptName') || '';
        var authGroupInfo = xui.extends.session.getSessionInfoByKey("AUTH_GROUP_INFO") || params.get('authGroupInfo') || '';


        xui.util.log('userId : '+ userId);   //USER_ID
        xui.util.log('pgCode : '+ pgCode);   //PG_CODE
        xui.util.log('puCode : '+ puCode);   //PU_CODE
        xui.util.log('teamCode : '+ teamCode);   //DEPT_CODE
        xui.util.log('corpCode : '+ corpCode);   //CORP_CODE
        xui.util.log('isNewChat : '+ isNewChat);
//        xui.util.log('getSession : '+ xui.extends.session.getSessionInfoByKey("ALL"));
        xui.util.log('DEPT_NAME : '+ xui.extends.session.getSessionInfoByKey("DEPT_NAME"));
        xui.util.log('FULL_DEPT_NAME : '+ xui.extends.session.getSessionInfoByKey("FULL_DEPT_NAME"));
        xui.util.log('USER_NAME : '+ xui.extends.session.getSessionInfoByKey("USER_NAME"));
        xui.util.log('OFFICIAL_POSITION_NAME : '+ xui.extends.session.getSessionInfoByKey("OFFICIAL_POSITION_NAME"));
        xui.util.log('userFirstName : '+ userFirstName);
        xui.util.log('authGroupInfo : '+ authGroupInfo);   //2024120517295171470104, 2021010100000000000000

        $("#user_id").val(userId);
        $("#pg_code").val(pgCode);
        $("#pu_code").val(puCode);
        $("#team_code").val(teamCode);
        $("#corp_code").val(corpCode);
        $("#user_full_name").val(userFullName);
        $("#user_first_name").val(userFirstName);

        aichat010.activeJournalByCode(puCode, corpCode, teamCode);

        aichat010.refreshUserProfileArea();

        // 프로필 아바타 테마(최초 1회)
        var theme = Math.floor(Math.random() * 7);
        $(".current-user__content")
            .css({"--firstName": `"${ userFirstName }"`})
            .addClass(`--theme${ theme }`)
        ;

        //관리자 버튼 노출 제어
//        var allowedGroups = ['2024120517295171470104', '2021010100000000000000'];
//
//        if (allowedGroups.includes(authGroupInfo)) {
//            $(".current-user__utility").removeClass('xui-invisible');
//        } else {
//            $(".current-user__utility").addClass('xui-invisible');
//        }

    },

    activeJournalByCode: function() {
        var normalizedPuCode = xui.extends.session.getPuCode();
        var normalizedCorpCode = xui.extends.session.getGbisCorpCode();
        var normalizedTeamCode = xui.extends.session.getDeptCode();

        var isAllowedJournalPuCode = JOURNAL_ALLOWED_PU_CODES.indexOf(normalizedPuCode) > -1;
        var isAllowedJournalCorpCode = JOURNAL_ALLOWED_CORP_CODES.indexOf(normalizedCorpCode) > -1;
        var isAllowedJournalTeamCode = JOURNAL_ALLOWED_TEAM_CODES.indexOf(normalizedTeamCode) > -1;

        isAllowedJournal = isAllowedJournalPuCode && isAllowedJournalCorpCode && isAllowedJournalTeamCode; // TEST, PROD
        isAllowedJournal = isAllowedJournalTeamCode; // DEV
        aichat010.syncRecJournalSettingsMenuVisibility();
        if(isAllowedJournal) {
            $(".window-popup").addClass("--journal");

            // journal-reco 카드가 동적으로 주입될 수 있으므로 delegate 이벤트로 처리
            $(document)
                .off("click.journalRecoSummary")
                .on("click.journalRecoSummary", ".journal-reco-summary-button", function(event) {
                    event.stopPropagation();
                    $(this).closest('.chat').css('z-index', 2);
                    // 다른 카드의 tooltip이 켜져있을 수 있으므로, 먼저 전체 off 후 현재 것만 on
                    $(".journal-reco-summary-dialog").removeClass("--active -top --bottom --left --right");

                    var $btn = $(this);
                    var $dialog = $btn.siblings(".journal-reco-summary-dialog");

                    var rect = this.getBoundingClientRect();
                    var box = document.querySelector("#box");
                    var boxRect = box.getBoundingClientRect();

                    var space = {
                      up: rect.top - boxRect.top,
                      down: boxRect.bottom - rect.bottom,
                      left: rect.left - boxRect.left,
                      right: boxRect.right - rect.right,
                    };
                    var vertical = space.up > space.down ? "bottom" : "top";
                    var horizontal = space.left > space.right ? "right" : "left";
                    $dialog.addClass("--active --" + vertical + " --" + horizontal);

                    var $card = $btn.closest(".journal-reco");
                    var journalId = ($card.attr("data-journal-id") || "").trim();
                    if (!journalId) {
                        return;
                    }

                    // 조회 실패 후 단일 안내 문구만 있는 상태 → 제거하고 재조회
                    if ($dialog.attr("data-ai-summary-retryable") === "Y") {
                        $dialog.find(".journal-reco-summary-content").remove();
                        $dialog.removeAttr("data-ai-summary-retryable");
                        $dialog.removeAttr("data-ai-summary-loaded");
                    }

                    // 이미 로드된 카드면 재호출하지 않음
                    if ($dialog.attr("data-ai-summary-loaded") === "Y") {
                        return;
                    }
                    if ($dialog.attr("data-ai-summary-loading") === "Y") {
                        return;
                    }

                    $dialog.attr("data-ai-summary-loading", "Y");

                    // 로딩: doc_type modifier 유지 후 스켈레톤. 폴백 스니펫은 DOM 교체 전에 읽음
                    var $introDesc = $dialog.find(".journal-reco-summary-content").eq(0).find(".journal-reco-summary-description");
                    var fallbackIntro = ($introDesc.text() || "").trim();
                    aichat010.syncJournalRecoSummaryDialogDocTypeClass($dialog, $card.attr("data-doc-type"));
                    aichat010.requestApi(
                        "/xs/aichat/v2/rnd/journal/" + encodeURIComponent(journalId) + "/ai-summary",
                        {
                            method: "GET",
                            query: {
                                "doc_type": $card.attr("data-doc-type")
                            }
                        }
                    ).then(function(response) {
                        if (response && typeof response.getErrorFlag === "function" && response.getErrorFlag()) {
                            var hdrMsg = (typeof response.getMsg === "function" && response.getMsg())
                                ? String(response.getMsg()).trim()
                                : "";
                            $dialog.attr("data-ai-summary-retryable", "Y");
                            $dialog.removeAttr("data-ai-summary-loaded");
                            aichat010.applyJournalAiSummaryToDialog($dialog, null, fallbackIntro, {
                                statusMessage: hdrMsg || "요청을 처리하는 중 오류가 발생했습니다."
                            });
                            return;
                        }
                        var aiSummary = aichat010.extractJournalAiSummaryPayload(response);
                        if (aichat010.isJournalAiSummaryPayloadEmpty(aiSummary)) {
                            aichat010.applyJournalAiSummaryToDialog($dialog, null, fallbackIntro, {
                                statusMessage: "요약 정보를 불러오지 못했습니다."
                            });
                            $dialog.removeAttr("data-ai-summary-retryable");
                            $dialog.attr("data-ai-summary-loaded", "Y");
                            return;
                        }
                        aichat010.applyJournalAiSummaryToDialog($dialog, aiSummary, fallbackIntro);
                        $dialog.removeAttr("data-ai-summary-retryable");
                        $dialog.attr("data-ai-summary-loaded", "Y");
                    }).catch(function(err) {
                        $dialog.attr("data-ai-summary-retryable", "Y");
                        $dialog.removeAttr("data-ai-summary-loaded");
                        var statusMessage;
                        if (err && err.code === "NETWORK_ERROR") {
                            statusMessage = "잠시 후 다시 시도해주세요";
                        } else {
                            var errMsg = (err && err.message) ? String(err.message).trim() : "";
                            statusMessage = errMsg || "요청을 처리하는 중 오류가 발생했습니다.";
                        }
                        aichat010.applyJournalAiSummaryToDialog($dialog, null, fallbackIntro, {
                            statusMessage: statusMessage
                        });
                    }).finally(function() {
                        $dialog.removeAttr("data-ai-summary-loading");
                    });
                })
                .off("click.journalRecoSummaryOutside")
                .on("click.journalRecoSummaryOutside", function(e) {
                    // active dialog 기준으로 바깥 클릭 시 닫기
                    // - 비활성 dialog는 DOM 상에 존재하면서(겹침/숨김 방식 차이) 클릭 타겟이 안쪽으로 잡힐 수 있으므로,
                    //   "활성인 dialog" 내부인지로 판정한다.
                    var $activeDialog = $(".journal-reco-summary-dialog.--active");
                    if ($activeDialog.length === 0) {
                        return;
                    }
                    var isInsideActive = $(e.target).closest(".journal-reco-summary-dialog.--active").length > 0;
                    if (!isInsideActive) {
                        $activeDialog.removeClass("--active");
                        $activeDialog.closest('.chat')[0].style.removeProperty('z-index');
                    }
                });

            // 우측 패널 / 추천저널 카드 클릭 시 상세 팝업
            $(document)
                .off("click.journalOpenPopup")
                .on("click.journalOpenPopup", ".journal-panel .journal-content, .chat .journal-reco, .chat .journal-reco-detail", function(event) {
                    // 요약 버튼/요약 다이얼로그 내부 클릭은 팝업 열기 제외
                    if ($(event.target).closest(".journal-reco-summary-button, .journal-reco-summary-dialog").length) {
                        return;
                    }

                    var $card = $(this).closest(".journal-content, .journal-reco");
                    if (!$card.length) {
                        return;
                    }

                    var docType = $card.attr("data-doc-type") || "";
                    var journalId = $card.attr("data-journal-id") || "";

                    if (!docType || !journalId) {
                        return;
                    }

                    aichat010.openSmartPopup({
                        doc_type: docType,
                        id: journalId,
                        url: $card.attr("data-url") || "",
                        board_id: docType === "internal" ? ($card.attr("data-board-id") || "") : ""
                    });
                });

            // 기술원 활성화 토글 (저널 DOM은 syncJournalChrome으로 늦게 붙을 수 있어 위임)
            $(document)
                .off("click.journalSearchToggle")
                .on("click.journalSearchToggle", "#container .journal-search", function(){
                    $(this).add("#container .journal-buttons").toggleClass("--active");

                    var activeType = $('.chat-type-button.active').attr('id');
                    var placeholderType = (activeType === 'web') ? 'web' : 'internal';
                    aichat010.showWelcomeMessage("#user_full_name", ".welcome-message");
                    aichat010.setPlaceholder(placeholderType);
                });

            // 출처 클릭 시 패널 노출 (동적 렌더링 대응 delegate)
            $(document)
                .off("click.journalStatus")
                .on("click.journalStatus", ".journal-status-button, .journal-status-comment", function(){
                    var $clicked = $(this);
                    var typeClass = $(this).attr("class")
                        .split(/\s+/)
                        .find(c => c.startsWith("--"));

                    if (!typeClass) {
                        return;
                    }

                    $(".journal-tab-button").removeClass("--active");
                    $(".journal-tab-button." + typeClass).addClass("--active");
                    $(".journal-panel").addClass("--active");
                    $(".journal-panel .journal-tab-list").show();
                    $(".journal-panel").removeClass("--no-tabs");

                    // 클릭한 메시지의 source header 카운트를 패널 탭에 반영
                    var headerCounts = aichat010.extractSourceHeadersFromStatusBar($clicked);
                    if (headerCounts) {
                        aichat010.bindJournalPanelSourceHeaders(headerCounts);
                    }

                    // 클릭된 답변 블럭 기준으로 sources 조회
                    var messageId = $clicked.closest(".chat.--a").attr("id");
                    if (messageId) {
                        aichat010.fetchAndRenderMessageSources(typeClass, String(messageId), 1);
                    }
                });

            $(document)
                .off("click.journalPanelCloser")
                .on("click.journalPanelCloser", ".journal-panel-closer", function(){
                    $(".journal-panel").removeClass("--active");
                    $(".journal-tab-button").removeClass("--active");
                    $(".journal-panel .journal-tab-list").show();
                    $(".journal-panel").removeClass("--no-tabs");
                });

            // 패널 탭 클릭 시 active 전환 + 타입별 sources 재조회
            $(document)
                .off("click.journalPanelTab")
                .on("click.journalPanelTab", ".journal-tab-button", function() {
                    var $tab = $(this);
                    var typeClass = ($tab.attr("class") || "")
                        .split(/\s+/)
                        .find(c => c.startsWith("--"));

                    if (!typeClass) {
                        return;
                    }

                    $(".journal-tab-button").removeClass("--active");
                    $tab.addClass("--active");
                    $(".journal-panel .journal-tab-list").show();
                    $(".journal-panel").removeClass("--no-tabs");

                    // 마지막 조회 컨텍스트가 있을 때만 재조회
                    if (currentMessageSourceContext && currentMessageSourceContext.messageId) {
                        currentMessageSourceContext.typeClass = typeClass;
                        aichat010.fetchAndRenderMessageSources(
                            typeClass,
                            currentMessageSourceContext.messageId,
                            1
                        );
                    }
                });

            // 출처 정렬 드롭다운 토글
            $(document)
                .off("click.journalSortingToggle")
                .on("click.journalSortingToggle", ".journal-sorting-button", function(event) {
                    event.stopPropagation();
                    $(this).siblings(".journal-sorting-list").toggleClass("--active");
                });

            // 정렬 항목 선택 (유사도순/similarity, 최신순/date)
            $(document)
                .off("click.journalSortingItem")
                .on("click.journalSortingItem", ".journal-sorting-item", function() {
                    var text = ($(this).text() || "").trim();
                    var sortKey = String($(this).attr("message-text") || "");
                    var isLatest = sortKey === "hyobee.chat.journal.source.tab.sort.latest"
                        || sortKey === "hyobee.source.sort.latest"
                        || text.indexOf("최신") >= 0
                        || text.toLowerCase().indexOf("latest") >= 0;

                    if (isLatest) {
                        currentJournalSortBy = "date";
                        currentJournalSortOrder = "desc";
                    } else {
                        currentJournalSortBy = "similarity";
                        currentJournalSortOrder = "desc";
                    }

                    $(".journal-sorting-button").text(text || aichat010.msg("hyobee.chat.journal.source.tab.sort.similarity"));
                    $(".journal-sorting-list").removeClass("--active");

                    // 마지막으로 연 출처 패널 컨텍스트가 있으면 정렬 기준으로 재조회
                    if (currentMessageSourceContext && currentMessageSourceContext.messageId) {
                        aichat010.fetchAndRenderMessageSources(
                            currentMessageSourceContext.typeClass,
                            currentMessageSourceContext.messageId,
                            1
                        );
                    }
                });

            // 드롭다운 외부 클릭 시 닫기
            $(document)
                .off("click.journalSortingOutside")
                .on("click.journalSortingOutside", function(e) {
                    if (!$(e.target).closest(".journal-sorting").length) {
                        $(".journal-sorting-list").removeClass("--active");
                    }
                });

            // message source 페이지네이션 클릭
            $(document)
                .off("click.messageSourcePagination")
                .on("click.messageSourcePagination", ".journal-pagination-first, .journal-pagination-prev, .journal-pagination-button, .journal-pagination-next, .journal-pagination-last", function() {
                    var $btn = $(this);
                    if ($btn.hasClass("--passive") || $btn.hasClass("--active")) {
                        return;
                    }

                    var targetPage = Number($btn.attr("data-page"));
                    if (!targetPage || targetPage < 1) {
                        return;
                    }

                    if (currentMessageSourceContext && currentMessageSourceContext.messageId) {
                        aichat010.fetchAndRenderMessageSources(
                            currentMessageSourceContext.typeClass,
                            currentMessageSourceContext.messageId,
                            targetPage
                        );
                    }
                });

            $(document)
                .off("click.journalShortcut")
                .on("click.journalShortcut", "#container .journal-button", function(){
                    var doctype = $(this).attr("class")
                        .split(/\s+/)
                        .find(c => c.startsWith("--"))
                        .replace("--", "");

                    var dummySources = aichat010.getDummyJournalSourcesForDoctype(doctype);
                    doctype = doctype.replace("thesis", "paper");
                    var initialMessage = aichat010.buildHiddenChatMarker(doctype)
                        + aichat010.buildViewTeamMarker(
                            aichat010.getSelectedViewableTeamCode(),
                            aichat010.getSelectedViewableTeamName()
                        )
                        + "추천" + $(this).text() + "3개 보여줘.";

                    aichat010.renderMessageSourcePanel(dummySources);

                    $("#journalContainer").hide();
                    $("#container").show();
                    aichat010.searchAiBotInit(false, true);

                    var isRndActive = $('#btn-rnd').closest('.journal-search').hasClass('--active');
                    var chat_category = isRndActive ? 'rnd_search' : aichat010.resolveCurrentChatCategory();

                    aichat010.selectDataCreateConversation(initialMessage, chat_category, []);
                });
        }
        aichat010.syncJournalChrome();
    },

    /** #btn-rnd(rnd_search) 노출 사용자만 추천 저널 설정 메뉴 표시 */
    syncRecJournalSettingsMenuVisibility: function() {
        $(".current-user__menu-item.reco").toggleClass("xui-invisible", !isAllowedJournal);
    },

    /**
     * RND 안내 문구/placeholder 적용 여부
     * - 기술원 권한 + btn-rnd 활성 상태일 때만 true
     * - 웹검색 탭에서는 저널 모드 UI/문구를 쓰지 않음
     */
    isRndJournalModeEnabled: function() {
        if (currentSearchType === 'web') {
            return false;
        }
        return isAllowedJournal && $('#btn-rnd').closest('.journal-search').hasClass('--active');
    },

    // 저널현황 상세팝업
    openSmartPopup: function(rowData) {
        var docType = (rowData && rowData.doc_type ? String(rowData.doc_type) : "").toLowerCase();
        var id = rowData && rowData.id != null ? rowData.id : "";

        if (docType === "internal") {
            var internalUrl = aichat010.resolveInternalBoardUrl(rowData);
            if (!internalUrl) {
                xui.dialog.alert(aichat010.msg("hyobee.chat.journal.source.internal.link_unavailable") || "게시판 링크를 생성할 수 없습니다.");
                return;
            }
            window.open(internalUrl, "_blank");
            return;
        }

        var popupUrl = "";

        // doc_type에 따른 JSP 매핑 분기
        if (docType === "paper" || docType === "journal") {
            popupUrl = "/xs/aichat/v2/popup/aichatPopUpPaper.jsp";
        } else if (docType === "patent") {
            popupUrl = "/xs/aichat/v2/popup/aichatPopUpPatent.jsp";
        } else if (docType === "article" || docType === "news") {
            popupUrl = "/xs/aichat/v2/popup/aichatPopUpNews.jsp";
        } else {
            xui.dialog.alert("지원하지 않는 문서 타입입니다: " + docType);
            return;
        }

        if (!id) {
            xui.dialog.alert("저널 식별값이 없습니다.");
            return;
        }

        // 전체 URL 조립 (ContextPath 포함)
        var baseUrl = window.location.origin + "/webapps";
        var finalUrl = baseUrl + popupUrl + "?journal_id=" + encodeURIComponent(String(id));

        // 팝업 실행 (새 창 방식)
        window.open(finalUrl, "_blank");
    },

    /**
     * 사내검색(internal) hope2 게시판 URL
     * id → MsgId, board_id → fdid
     */
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

    escapeHtmlAttr: function(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    },

    /**
     * 기술원 저널 UI(논문/특허/기사 + RND 전구)는 사내검색·권한일 때만 DOM에 둠. 웹검색은 운영과 같이 해당 노드를 두지 않음.
     */
    syncJournalChrome: function() {
        var $main = $("#container");
        if (!$main.length) {
            return;
        }
        var $feedback = $main.find(".tool-box .feedback-message").first();
        if (!$feedback.length) {
            return;
        }
        var buttonsHtml = ''
            + '<div class="journal-buttons --active">'
            + '<div class="journal-button --thesis" tabindex="0">' + aichat010.msg("hyobee.journal.type.paper") + '</div>'
            + '<div class="journal-button --patent" tabindex="0">' + aichat010.msg("hyobee.journal.type.patent") + '</div>'
            + '<div class="journal-button --article" tabindex="0">' + aichat010.msg("hyobee.journal.type.article") + '</div>'
            + '</div>';
        var searchHtml = ''
            + '<div class="journal-search --active" tabindex="0">'
            + '<i class="xfi xfi-ico_0350_bulb" id="btn-rnd" aria-hidden="true"></i>'
            + '</div>';

        if (!isAllowedJournal || currentSearchType === 'web') {
            $main.find(".journal-buttons").remove();
            $main.find(".journal-search").remove();
            return;
        }

        if (!$main.find(".journal-buttons").length) {
            $main.find(".welcome-message").after(buttonsHtml);
        } else {
            aichat010.updateJournalChromeLabels();
        }
        if (!$main.find(".journal-search").length) {
            $feedback.before(searchHtml);
        }
    },

    /** 저널 유형 버튼(논문/특허/기사) 라벨을 현재 로케일로 갱신 */
    updateJournalChromeLabels: function() {
        var $buttons = $("#container .journal-buttons");
        if (!$buttons.length) {
            return;
        }
        $buttons.find(".journal-button.--thesis").text(aichat010.msg("hyobee.journal.type.paper"));
        $buttons.find(".journal-button.--patent").text(aichat010.msg("hyobee.journal.type.patent"));
        $buttons.find(".journal-button.--article").text(aichat010.msg("hyobee.journal.type.article"));
    },

    //검색폼 토글
    toggleSearchForm (e) {
        if($("#searchLayer").hasClass("xui-invisible")){
            $("#searchLayer").removeClass("xui-invisible")
        } else {
            $("#searchLayer").addClass("xui-invisible")
        }
    },

    //검색 대상 구분 토글
    toggleSearchGubn: function(type) {
        currentSearchType = type;

        // 활성화 클래스 토글
        $('#intranet, #web').removeClass('active');
        $('#' + type).addClass('active');
        $('.journal-panel.--active').removeClass('--active');

        // type에 따라 mobjCategory 강제 설정 (이전 값 유지하지 않음)
        if (type === 'web') {
            mobjCategory = "web_search";
        } else {
            mobjCategory = "internal_rules";
        }

        // 채팅 타입 테마 및 placeholder 업데이트
        aichat010.updateChatTypeAndPlaceholder(mobjCategory);
        aichat010.syncJournalChrome();
        aichat010.showWelcomeMessage("#user_full_name", ".welcome-message");
    },

    /**
     * 현재 활성화된 검색 버튼 기준 채팅 카테고리 반환
     * - web 버튼 활성: web_search
     * - intranet 버튼 활성: internal_rules
     */
    resolveCurrentChatCategory: function() {
        var activeCategory = $('.chat-type-button.active').attr('data-id');
        if (activeCategory === 'web_search' || activeCategory === 'internal_rules') {
            return activeCategory;
        }
        if (mobjCategory === 'web_search' || mobjCategory === 'internal_rules') {
            return mobjCategory;
        }
        return 'internal_rules';
    },

    showWelcomeMessage : function(userSelector, messageSelector) {
        if (aichat010.isRndJournalModeEnabled()) {
            $(messageSelector).text(aichat010.msg("hyobee.welcome.rnd_prompt"));
            return;
        }
        var userName = $(userSelector).val();
        var keys = [
            "hyobee.welcome.greeting1",
            "hyobee.welcome.greeting2",
            "hyobee.welcome.greeting3"
        ];
        var key = keys[Math.floor(Math.random() * keys.length)];
        var text = aichat010.msg(key);
        if (text.indexOf("{0}") >= 0) {
            text = text.replace("{0}", userName);
        }
        $(messageSelector).text(text);
    },

    /**
     * 채팅 타입에 따른 테마 클래스 업데이트
     * @param {string} type - 'web' 또는 'internal' (또는 'web_search' 또는 'internal_rules')
     */
    updateChatTypeTheme : function(type) {
        var $targets = $('.chat-container, .chat-type');

        // type이 'web_search' 또는 'web'이면 웹 테마, 그 외에는 사내 테마
        var isWeb = (type === 'web' || type === 'web_search');

        if (isWeb) {
            $targets.removeClass('--corp');
            $targets.addClass('--web');
            $("#inputArea").css({height: '100px'});
        } else {
            $targets.removeClass('--web');
            $targets.addClass('--corp');
            $("#inputArea").css({height: '100px'});
        }
    },

    /**
     * Placeholder만 설정 (테마 업데이트는 하지 않음)
     * @param {string} type - 'web' 또는 'internal'
     * @ 20251202 'file' 추가
     */
    setPlaceholder : function(type){
        var messages =  "";
        if (type === 'file') {
            messages = aichat010.enum.FILE_PLACEHOLDER_MESSAGES.getName();
        } else if (aichat010.isRndJournalModeEnabled()) {
            messages = aichat010.enum.RND_PLACEHOLDER_MESSAGES.getName();
        } else if (type === 'web') {
            messages = aichat010.enum.WEB_PLACEHOLDER_MESSAGES.getName();
        } else {
            messages = aichat010.enum.INTERNAL_PLACEHOLDER_MESSAGES.getName();
        }

        var randomMessage = messages[Math.floor(Math.random() * messages.length)];
        $("#inputArea").attr("placeholder", randomMessage);
    },

    /**
     * 채팅 타입에 따른 테마 및 placeholder 업데이트 (통합 함수)
     * @param {string} type - 'web_search', 'internal_rules', 'web', 'internal' 모두 가능
     */
    updateChatTypeAndPlaceholder : function(type) {
        // 1. 테마 업데이트
        aichat010.updateChatTypeTheme(type);

        // 2. Placeholder 업데이트 (타입 변환)
        var placeholderType = (type === 'web' || type === 'web_search') ? 'web' : 'internal';
        aichat010.setPlaceholder(placeholderType);
    },

    // 응답중일때 대화 입력 방지
    toggleInputAreaLock : function() {
        var isLocked = $(".enter-message").hasClass("--stop");

        $("#inputArea")
            .prop("disabled", isLocked)
            .css({
                "cursor": isLocked ? "default" : "text",
                // "caret-color": isLocked ? "transparent" : "auto"
            });

        if (isLocked) {
            $("#inputArea").val(""); // 입력값 초기화 (선택사항)
        }
    },

    //대화창에 메시지 표시
    appendMessage : function(question, answer, answerId, feedbackHtml){
        if(xui.valid.isEmpty(feedbackHtml)){feedbackHtml = "";}

        var return_text = answer.replace(/\[\[\d+\]\]\n?/g,'');
        answer = return_text.replace(/\[\[\d+\]\]/g,'');

        var questionHtml = "";
        var answerHtml = "";
        // 질의에 대한 말풍선
        questionHtml = '<div class="chat --q --last" id="' + answerId + '" data-role="dialog">'
            + '    <div class="bubble">'
            + question
            + '    </div>'
            + '</div>';

        //답변에 ID설정
        var answerIdText = "";
        if(!xui.valid.isEmpty(answerId)){answerIdText = 'id="ans' + answerId + '"';}

        answerHtml   = '<div class="chat --a" id="'+answerId+'">'
            + '    <div class="bubble --block" ' + answerIdText + '>'
            + answer
            + '	</div>'
            + '</div>';

        if(!xui.valid.isEmpty(question) && !xui.valid.isEmpty(answer)){
            $("#box").append(questionHtml + answerHtml);
        } else if(xui.valid.isEmpty(question) && !xui.valid.isEmpty(answer)){
            $("#box").append(answerHtml);
        } else if(!xui.valid.isEmpty(question) && xui.valid.isEmpty(answer)){
            $("#box").append(questionHtml);
        }

        $('div.chat.--q.--last').removeClass("--last");
        $('div.chat.--q').last().addClass("--last");

        //입력창 초기화
        $("#inputArea").text("");

        // 스크롤은 selectDataChatStream에서 모든 메시지 추가 후 처리
        // (여러 말풍선이 있을 때 첫 번째 말풍선으로 스크롤하기 위해)
    },

    //챗봇검색결과 초기화 함수
    searchAiBotInit: function(isSession, isNew) {
        $("#inputArea").val("");

        if(isNew === true) {
            $(".list-view2-item").removeClass("on");
            // v2 메인 채팅 영역 id는 container (운영 aichat010.jsp와 동일)
            $("#container").removeClass("--ing");
            $("#box").empty("");

            // 새 대화 시작 시 변수 초기화
            mobjConversationId = '';
            mobjTargetDeptCode = '';
            // mobjCategory는 현재 선택된 검색 타입 유지
            nextCursor = null;
            hasMoreMessages = true;
            isLoadingMessages = false;
            loadedCursors = [];
            isInitialLoad = false;
            isFirstChatInNewConversation = false; // 중복 메시지 방지 플래그 초기화

            // 현재 활성화된 검색 타입 확인 (없으면 기본값 intranet)
            var currentSearchType = $('.chat-type-button.active').attr('id');
            if (!currentSearchType) {
                currentSearchType = 'intranet';
            }
            aichat010.toggleSearchGubn(currentSearchType);

            isNewChat = true;
            xui.util.log(isNewChat);
            xui.util.log(mobjCategory);

            aichat010.showWelcomeMessage("#user_full_name", ".welcome-message");

            // 새 대화 시작 시 파일 업로드 이벤트 재초기화 (드래그 앤 드롭 이벤트 유지)
            aichat010.initFileUploadEvents();
        }
    },

    // 접근 가능한 게시판 목록 조회
    setBoardsAuthList : function(boardList) {
        var $container = $("#boardsAuth");

        // 기존 내용 초기화
        $container.empty();

        // 게시판 목록 순회하며 요소 추가
        if (Array.isArray(boardList) && boardList.length > 0) {
            $.each(boardList, function(index, item) {
                // "AI 확인 게시물" 제외
                if (item.board_name === "AI 확인 게시물") {
                    return true; // 다음 item으로 continue
                }
                var $wrapper = $("<div>").addClass("wrapper");
                var $tooltipDiv = $("<div>").addClass("tooltip-div").text(item.board_name);
                $wrapper.append($tooltipDiv);
                $container.append($wrapper);
            });
        } else {
            // 데이터가 없을 경우 안내 메시지 출력
            var $wrapper = $("<div>").addClass("wrapper");
            var $tooltipDiv = $("<div>").addClass("tooltip-div").text("조회가능 게시판이 없습니다.");
            $wrapper.append($tooltipDiv);
            $container.append($wrapper);
        }
    },

    //대화목록 데이터세팅
    setConversations : function(response, isAppend){
        // 파라미터 기본값 설정
        if (typeof isAppend === 'undefined') isAppend = false;

        //.addClass("xui-invisible")
        $("#noChatHistory").removeClass("--active");
        $('.current.navigation').removeClass('--init');

        // content 추출 (응답 형태가 HEADER/DATA 래핑이거나, 이중 래핑이 섞여도 방어)
        var content = [];
        if (response && typeof response.getDataJsonObject === "function") {
            var dataObj = response.getDataJsonObject();
            if (dataObj && dataObj.content) {
                content = dataObj.content;
            } else if (dataObj && dataObj.jsonData && dataObj.jsonData.DATA &&
                dataObj.jsonData.DATA[0] && dataObj.jsonData.DATA[0].content) {
                // (fallback) 일부 환경에서 이중 래핑 형태로 content가 더 깊이 들어가는 케이스
                content = dataObj.jsonData.DATA[0].content;
            }
        } else if (response && response.content) {
            content = response.content;
        } else if (response && response.DATA && response.DATA[0] && response.DATA[0].content) {
            content = response.DATA[0].content;
        }
        if (!Array.isArray(content)) {
            content = [];
        }
        var listHTML = "";
        var startIndex = isAppend ? $("#chatHistory .list-view2-item").length : 0;

        for (var i = 0; i < content.length; i++) {
            var checkboxIndex = startIndex + i;
            listHTML += '<div class="list-view2-item">'
                + '    <input type="checkbox" id="checkbox-' + checkboxIndex + '" title="대화 삭제" class="navigation-item-checkbox" id="' + content[i].conversation_id + '" />'
                + '    <label for="checkbox-' + checkboxIndex + '" class="navigation-item-label"></label>'
                + '    <div class="list-view2"'
                + ' conversation_id=' + content[i].conversation_id
                + ' chat_category=' + (content[i].chat_category === "rnd_search" ? "internal_rules" : content[i].chat_category)
                + ' data-real-chat-category=' + content[i].chat_category
                + (content[i].target_dept_code ? ' data-target-dept-code="' + content[i].target_dept_code + '"' : '')
                + '>'
                + '        <div class="text-area">'+ content[i].title + '</div>'
                + '    </div>'
                + '</div>';
        }

        //대화를 하지않았을때 처리
        if(xui.valid.isEmpty(listHTML) && !isAppend){
            // $("#noChatHistory").show();
            $("#noChatHistory").addClass("--active");
            $('.current.navigation').addClass('--init');
        }

        //화면에 세팅 (append 또는 replace)
        $("#chatHistory").removeClass("xui-invisible");
        if (isAppend) {
            $("#chatHistory").append(listHTML);
        } else {
            $("#chatHistory").html(listHTML);
        }

        // 더보기 버튼 표시/숨김
        // 기존 더보기 버튼 제거
        var responseData = null;
        if (response && typeof response.getDataJsonObject === "function") {
            responseData = response.getDataJsonObject();
        } else if (response && response.DATA && response.DATA[0]) {
            responseData = response.DATA[0];
        }

        var hasNext = responseData ? responseData.has_next : null;

        // has_next 값 확인 (boolean, string, undefined 모두 처리)
        var hasNextValue = false;
        if (hasNext === true || hasNext === 'true' || hasNext === 'True') {
            hasNextValue = true;
        }

        // 결과가 20개 미만이면 더보기 버튼 숨김
        if (content.length < 20) {
            hasNextValue = false;
        }

        chatHistoryHasNext = hasNextValue;

        $('.more-button').remove();
        if (chatHistoryHasNext) {
            $("#chatHistory").append('<div class="list-view2-item more-button">' + aichat010.msg("hyobee.conversation.more") + '</div>');
        }

        aichat010.defineEventChatHistory(content);

        if ($(".navigation").hasClass("--delete")) {
            aichat010.syncDeleteButtonState();
        }

        // 새로 대화 세션이 생기면 on 처리
        if (mobjConversationId !== undefined && mobjConversationId !== '') {
            $(".list-view2-item").first().addClass("on");
        }

        if (!isAppend) {
            $(".historyList").scrollTop(0);
        }
    },

    //챗봇 대화 내용세팅
    setChatContents : function(data) {
        for (var i = 0; i < data.length; i++) {
            var feedbackHtml = "";
            var role = data[i].role;
            var message_id = data[i].message_id;
            var sources = data[i].sources;
            var content = data[i].content;
            var sourceHeaders = data[i].source_headers;
            aichat010.shouldShowJournalStatusBar(message_id, data[i]);
            // 이력 조회 시 HTML 엔티티(&gt;, &lt; 등)로 저장된 내용을 복원
            content = aichat010.decodeHtmlEntities(content || "");
            var feedback = data[i].feedback;
            var attachments = data[i].attachments;

            // attachments에 conversation_id, message_id 추가 (썸네일 조회용)
            if (attachments && attachments.length > 0) {
                attachments.forEach(function(attachment) {
                    if (!attachment.conversation_id) {
                        attachment.conversation_id = mobjConversationId || data[i].conversation_id || '';
                    }
                    if (!attachment.message_id) {
                        attachment.message_id = message_id || '';
                    }
                });
            }

            marked.setOptions({
                gfm: true,
                breaks: true, // 줄바꿈을 <br>로 처리해줘서 <p> 태그 남용을 약간 줄여줌
                headerIds: false,
                mangle: false,
                sanitize: false
            });

            // data 안에 Markdown + HTML이 섞여 있는 경우
            try {
//                var message_content = marked.parse(content);
                if(role === 'user'){// role이 "user" 이면
                    if (attachments.length > 0) {
                        for (var j = 0; j < attachments.length; j++) {
                            var fileMessage = aichat010.buildFileMessageHtml(attachments[j]);
                            aichat010.appendMessage(fileMessage, "", message_id, "");
                        }
                    }

                    var contentHtml = aichat010.extractReutersLinksFromHTML(content);

                    if (content.includes("hidden_chat")) {
                        contentHtml = "";
                    }

                    aichat010.appendMessage(marked.parse(contentHtml), "", message_id, "");
                }else{ // role이 "assistant" 이면
                    var prevUserForJournal = aichat010.findPrevUserContentInHistory(data, i);
                    var journalBubbleInner = aichat010.buildHiddenRecJournalBubbleInnerHtmlFromHistory(
                        prevUserForJournal,
                        sources,
                        data[i].created_at
                    );

                    if (journalBubbleInner != null) {
                        // 스트리밍(hidden_chat + sources)과 동일: 저널 카드만, 기본 출처 링크 UI 생략
                        aichat010.appendMessage("", journalBubbleInner, message_id, feedbackHtml);
                        feedbackHtml = aichat010.setMessageFeedback(message_id, feedback);
                    } else {
                        var contentHtml = '';

                        var sourceHeadersHtml = '';
                        if (sourceHeaders != null) {
                            sourceHeadersHtml = aichat010.loadSourceHeader(sourceHeaders, message_id);
                        }

                        // 사내검색/웹 검색일때 출처 유형이 달라서 분기처리
                        if(mobjCategory === 'web_search') {contentHtml = aichat010.extractReutersLinksFromHTML(content);}
                        else {contentHtml = aichat010.extractReutersSource(content);}

                        contentHtml = aichat010.wrapMathBlocks(contentHtml);
                        aichat010.appendMessage("", sourceHeadersHtml + " " + marked.parse(contentHtml), message_id, feedbackHtml);

                        if (sources && sources.length > 0){
                            var temp_title ='';
                            if(sources[0].source_type === 'web') temp_title = sources[0].display_title ;
                            else temp_title = sources[0].display_title + '-' + sources[0].source_title;

                            var refHtml  = '<div class="source" data-id="' + message_id + '">'
                                + '    <div class="source-button"  data-role="modal-opener" data-target="sourceModal' + message_id + '" tabIndex="0">'
                                + temp_title
                                + '	<div class="source-num"> +'
                                + aichat010.renderSourceLinksCount(sources)
                                + '    </div></div>'
                                + '</div>';

                            var contentsRef = aichat010.renderSourceLinks(sources, message_id);
                            // history 렌더에서도 타입별 카운트를 상태바에 캐시
                            var historyHeaders = aichat010.buildSourceHeadersFromSources(sources);
                            aichat010.cacheSourceHeadersOnStatusBar(message_id, historyHeaders);
                            // 답변 블럭 안쪽으로 위치 이동
                            var $refHtml = $(refHtml);
                            $("#ans" + message_id).children().last().after($refHtml);
                            $refHtml.append(contentsRef);
                        }
                        // ------------ 출처 표기 end

                        feedbackHtml = aichat010.setMessageFeedback(message_id, feedback);
                    }
                }
            } catch (err) {
                console.error("Markdown parse error:", err);
                // 오류 방지를 위해 fallback 처리
                aichat010.appendMessage("", "Markdown parse error", message_id, "");
            }
        }

        //피드백 이벤트 생성
        aichat010.defineEventChatFeedback();
        //최하단으로 이동
        $(".container").scrollTop($(".container")[0].scrollHeight);
    },

    //챗봇 대화 내용을 상단에 추가 (페이징용)
    prependChatContents : function(data) {
        if (!data || data.length === 0) {
            return;
        }

        // 현재 스크롤 위치 저장
        var $box = $("#box");
        var scrollHeightBefore = $box[0].scrollHeight;
        var scrollTopBefore = $box[0].scrollTop;

        // 메시지를 역순으로 처리 (오래된 것부터)
        var messagesHtml = [];
        for (var i = 0; i < data.length; i++) {
            var feedbackHtml = "";
            var role = data[i].role;
            var message_id = data[i].message_id;
            var content = data[i].content;
            // 이력 조회 시 HTML 엔티티(&gt;, &lt; 등)로 저장된 내용을 복원
            content = aichat010.decodeHtmlEntities(content || "");
            var sources = data[i].sources;
            var attachments = data[i].attachments || [];
            var feedback = data[i].feedback;
            var feedback_id = data[i].feedback.feedback_id;
            var feedback_type = data[i].feedback.feedback_type;
            aichat010.shouldShowJournalStatusBar(message_id, data[i]);

            // attachments에 conversation_id, message_id 추가 (썸네일 조회용)
            if (attachments && attachments.length > 0) {
                attachments.forEach(function(attachment) {
                    if (!attachment.conversation_id) {
                        attachment.conversation_id = mobjConversationId || data[i].conversation_id || '';
                    }
                    if (!attachment.message_id) {
                        attachment.message_id = message_id || '';
                    }
                });
            }

            marked.setOptions({
                gfm: true,
                breaks: true,
                headerIds: false,
                mangle: false,
                sanitize: false,
            });

            try {
                var questionHtml = "";
                var answerHtml = "";

                if(role === 'user'){// role이 "user" 이면
                    if (attachments.length > 0) {
                        for (var j = 0; j < attachments.length; j++) {
                            var fileMessage = aichat010.buildFileMessageHtml(attachments[j]);
                            var fileQuestionHtml = '<div class="chat --q" id="' + message_id + '" data-role="dialog">'
                                + '    <div class="bubble">'
                                + fileMessage
                                + '    </div>'
                                + '</div>';
                            messagesHtml.push(fileQuestionHtml);
                        }
                    }

                    var contentHtml = aichat010.extractReutersLinksFromHTML(content);
                    if (content.includes("hidden_chat")) {
                        contentHtml = "";
                    }
                    questionHtml = '<div class="chat --q" id="' + message_id + '" data-role="dialog">'
                        + '    <div class="bubble">'
                        + marked.parse(contentHtml)
                        + '    </div>'
                        + '</div>';
                    messagesHtml.push(questionHtml);
                }else{ // role이 "assistant" 이면
                    var prevUserForJournalPrepend = aichat010.findPrevUserContentInHistory(data, i);
                    var journalInnerPrepend = aichat010.buildHiddenRecJournalBubbleInnerHtmlFromHistory(
                        prevUserForJournalPrepend,
                        sources,
                        data[i].created_at
                    );

                    // 피드백 HTML 생성 (DOM 추가 없이 HTML 문자열만)
                    feedbackHtml = aichat010.getMessageFeedbackHtml(message_id, feedback_id, feedback_type);
                    var answerIdText = 'id="ans' + message_id + '"';

                    if (journalInnerPrepend != null) {
                        answerHtml = '<div class="chat --a" id="' + message_id + '">'
                            + '    <div class="bubble --block" ' + answerIdText + '>'
                            + journalInnerPrepend
                            + '	</div>'
                            + feedbackHtml
                            + '</div>';
                    } else {
                        var contentHtml = '';
                        if(mobjCategory == 'web_search') {
                            contentHtml = aichat010.extractReutersLinksFromHTML(content);
                        } else {
                            contentHtml = aichat010.extractReutersSource(content);
                        }

                        contentHtml = aichat010.wrapMathBlocks(contentHtml);
                        answerHtml = '<div class="chat --a" id="' + message_id + '">'
                            + '    <div class="bubble --block" ' + answerIdText + '>'
                            + marked.parse(contentHtml)
                            + '	</div>'
                            + feedbackHtml
                            + '</div>';
                    }
                    messagesHtml.push(answerHtml);
                }
            } catch (err) {
                console.error("Markdown parse error:", err);
                var errorHtml = '<div class="chat --a" id="' + message_id + '">'
                    + '    <div class="bubble --block">'
                    + "Markdown parse error"
                    + '	</div>'
                    + '</div>';
                messagesHtml.push(errorHtml);
            }
        }

        // 첫 번째 메시지 앞에 추가
        var firstChild = $box.children().first();
        if (firstChild.length > 0) {
            $box.prepend(messagesHtml.join(''));
        } else {
            $box.html(messagesHtml.join(''));
        }

        // DOM 업데이트 후 스크롤 위치 조정 (약간의 지연 필요)
        setTimeout(function() {
            // 스크롤 위치 유지 (새로운 내용이 추가되어도 같은 위치 유지)
            var scrollHeightAfter = $box[0].scrollHeight;
            var scrollHeightDiff = scrollHeightAfter - scrollHeightBefore;
            $box[0].scrollTop = scrollTopBefore + scrollHeightDiff;
        }, 10);

        //피드백 이벤트 생성
        aichat010.defineEventChatFeedback();
    },


    // role이 "user" 이면 chatListHTML에 쌓고
    setMessageUser : function(message_id, data){
        //첫번째 줄이 도착하면 처리중을 박스를 없애고 새로운 대화상자를 생성한다.
        $("#waiting").remove();			//진행중 메시지 삭제 후 처리
        // 질의에 대한 말풍선
        var questionHtml = '<div class="chat --q --last" id="' + answerId + '">'
            + '    <div class="bubble">'
            + data
            + '    </div>'
            + '</div>';
        $("#box").append(questionHtml);
        //최하단으로 이동
        $(".container").scrollTop($(".container")[0].scrollHeight);

    },

    //요청한 결과를 화면에 로드
    // role이 "assistant" 이면 answereHtml에 쌓고
    setMessageAssistant : function(message_id, data){
        $("#waiting").remove();			//진행중 메시지 삭제 후 처리

        //답변에 ID설정
        var answerIdText = "";
        if(!xui.valid.isEmpty(answerId)){answerIdText = 'id="' + answerId + '"';}

        var answerHtml   = '<div class="chat --a" ' + answerIdText + '>'
            + '    <div class="bubble --block">'
            //                         + '		<div class="text">'
            + data
            //                         + '        </div>'
            + '	</div>'
            + '</div>';

        $("#box").append(answerHtml);

        //최하단으로 이동
        $(".container").scrollTop($(".container")[0].scrollHeight);
    },

    //요청한 결과를 화면에 로드
    setMessageFeedback : function(message_id, feedback){
        var safeFeedback = (feedback && typeof feedback === "object") ? feedback : {};
        var feedback_id = safeFeedback.feedback_id;
        var feedback_type = safeFeedback.feedback_type;
        var feedbackHtml = aichat010.getMessageFeedbackHtml(message_id, feedback_id, feedback_type);

        // id 값이 숫자/특수문자여도 안정적으로 매칭되도록 attr 비교로 찾는다.
        var key = String(message_id);
        var $chat = $("#box .chat.--a").filter(function() {
            return String($(this).attr("id")) === key;
        }).first();
        // SSE에서 response_chunk가 비거나 매우 짧은 경우 chat wrapper가 없을 수 있으므로 보강 생성
        if (!$chat.length && key) {
            var answerHtml = '<div class="chat --a" id="' + key + '">'
                + '    <div class="bubble --block" id="ans' + key + '"></div>'
                + '</div>';
            $("#box").append(answerHtml);
            $chat = $("#box .chat.--a").filter(function() {
                return String($(this).attr("id")) === key;
            }).first();
        }
        if ($chat.length) {
            $chat.append(feedbackHtml);
            // source_headers 캐시가 있으면 "출처 N" 카운트를 즉시 반영
            var mapped = messageSourceHeadersMap[key];
            if (mapped && mapped.total_count !== undefined && mapped.total_count !== null) {
                var total = Number(mapped.total_count);
                if (!isNaN(total)) {
                    $chat.find(".util-box .journal-status-count").text(total);
                }
            }
        }
        return feedbackHtml;
    },

    //피드백 HTML 문자열 생성 (DOM 추가 없이)
    getMessageFeedbackHtml : function(message_id, feedback_id, feedback_type){
        var up_feedback_class = '';
        var up_feedback_id = '';
        var down_feedback_class = '';
        var down_feedback_id = '';

        if(feedback_type === 'like'){
            up_feedback_class = '--active';
            up_feedback_id = feedback_id;
            down_feedback_class = '';
            down_feedback_id = '';
        } else if(feedback_type === 'dislike'){
            up_feedback_class = '';
            up_feedback_id = '';
            down_feedback_class = '--active';
            down_feedback_id = feedback_id;
        } else {
            up_feedback_class = '';
            up_feedback_id = '';
            down_feedback_class = '';
            down_feedback_id = '';
        }

        var sourceStatusBarHtml = "";
        if (aichat010.shouldShowJournalStatusBar(message_id)) {
            var sourceCountHtml = '<span class="journal-status-count"></span>';
            var sourceLabelTemplate = xui.message.get("hyobee.chat.journal.source");
            var sourceLabelHtml = aichat010.buildJournalStatusCommentHtml(sourceLabelTemplate, sourceCountHtml);
            sourceStatusBarHtml = ''
                + '  <div class="journal-status-bar">'
                + '      <div class="journal-status-comment --all" tabIndex="0">'
                +           sourceLabelHtml
                + '      </div>'
                + '  </div>';
        }

        var feedbackHtml   = '<div class="util-box" searchKey="' + message_id +'">'
            + '  <div class="feedback">'
            + '      <div class="feedback-button ' + up_feedback_class +'" tabIndex="0" data-feedback="' + up_feedback_id +'" data-searchkey="' + message_id +'">'
            + '          <i class="xfi xfi-ico_0114_thumb_up" id="thumb_up" aria-hidden="true"></i>'
            + '      </div>'
            + '      <div class="feedback-button ' + down_feedback_class +'" tabIndex="0" data-feedback="' + down_feedback_id +'" data-searchkey="' + message_id +'">'
            + '          <i class="xfi xfi-ico_0226_thumb_down" id="thumb_down" aria-hidden="true"></i>'
            + '      </div>'
            + '  </div>'
            + '  <div class="copy" tabIndex="0">'
            + '      <i class="xfi xfi-ico_0069_content_copy" name="content_copy" aria-hidden="true" data-searchkey="' + message_id +'"></i>'
            + '  </div>'
            +       sourceStatusBarHtml
            + '</div>';
        return feedbackHtml;
    },

    //요청한 결과를 화면에 로드 : 에러
    loadErrorStream : function(message_id){
        $("#waiting").remove();			//진행중 메시지 삭제 후 처리

        var answerHtml   = '<div class="chat --a" id="' + message_id + '">'
            + '    <div class="bubble --block">'
            +  aichat010.enum.ERROR_ANSWER_SEARCH.getName()
            + '	</div>'
            + '</div>';
        $("#box").append(answerHtml);

        //최하단으로 이동
        $(".container").scrollTop($(".container")[0].scrollHeight);
    },

    // 이거는 이전 대화이력을 전체 불러올때 출처 패턴이 달라서 별도 처리
    extractReutersLinksFromHTML : function(htmlString) {
        // xui.util.log(htmlString);

        // 괄호 제거: (<a ...>) → <a ...>
        var replacePattern = /\(\[([^\]]+)\]\(([^)]+)\)\)/g;
        htmlString = htmlString.replace(replacePattern, function(_, text, href) {
            var url = href;       // href 속성
            var domain = text;   // 링크 텍스트
            var refHtml   = '<div class="source">'
                + '    <div class="source-button"  data-role="modal-opener" data-target="sourceModal" data-url="' + url + '" xui-tooltip-title="'+url+'">'
                + domain
                + '</div>'
                + '</div>';
            return refHtml;
        });

        return htmlString;

        // 수정된 HTML 문자열 반환
//        return $html.html();
    },
    // HTML 엔티티(&gt;, &lt;, &amp; 등)를 실제 문자로 복원
    decodeHtmlEntities: function(str) {
        if (!str) return '';
        return String(str)
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
    },

    extractReutersSource: function(inputData) {
        var jsonString;

        // 1. 문자열로 변환
        if (typeof inputData === "object") {
            try {
                jsonString = JSON.stringify(inputData);
            } catch (e) {
                console.warn("❌ 객체 직렬화 실패:", e.message);
                return "";
            }
        } else if (typeof inputData === "string") {
            jsonString = inputData;
        } else {
            console.warn("❌ 입력 타입 오류:", typeof inputData);
            return "";
        }

//        var replacePattern = /\[{[^]*?}\]/g;
        var replacePattern = /\[\{[^]*?\}\]/g;
        jsonString = jsonString.replace(replacePattern, function(match) {
//            xui.util.log("🔍 원본 매치:", match);
            try {
                // 작은따옴표 → 큰따옴표로 변환
                // var jsonReady = match.replace(/'/g, '"');
                var jsonReady = match;

                // \xa0 → 공백으로 치환
                jsonReady = jsonReady.replace(/\\xa0/g, ' ');

                // JSON 파싱
                var parsedArray = JSON.parse(jsonReady);
                var item = parsedArray[0]; // 첫 번째 객체 사용

                // 안전한 텍스트 구성
                var displayTitle = item.display_title || "";
                var sourceTitle = item.source_title || "";
//                var domain = (displayTitle && sourceTitle) ? displayTitle + " | " + sourceTitle : "출처 없음";
                var domain = sourceTitle;
                var url = item.url;

                // HTML 생성
                var refHtml = '<div class="source">'
                    + '  <div class="source-button" data-role="modal-opener" data-target="sourceModal" data-url="' + url + '" xui-tooltip-title="'+url+'">'
                    +      domain
                    + '  </div>'
                    + '</div>';
                return refHtml;
            } catch (e) {
                console.warn("❌ JSON 파싱 실패:", match);
                return match; // 실패 시 원본 유지
            }
        });

        return jsonString;
    },

    extractReutersSource2: function(data) {
        xui.util.log("extractReutersSource2");
        var returnString = "";

        // 1. 배열인지 확인
        if (!Array.isArray(data)) {
            console.warn("❌ 예상한 배열이 아님:", data);
            return "";
        }

        // 2. HTML 렌더링
        var htmlList = data.map(item => {
            var displayTitle = item.display_title || "";
            var sourceTitle = item.source_title || "";
//            var domain = (displayTitle && sourceTitle)? `${displayTitle} | ${sourceTitle}`: "출처 없음";
            var domain = sourceTitle;
            var url = item.url;

            returnString = '<div class="source">'
                + '  <div class="source-button" data-role="modal-opener" data-target="sourceModal" data-url="' + url + '" xui-tooltip-title="'+url+'">'
                + domain
                + '  </div>'
                + '</div>';
        });

        return returnString;
    },

    extractRecJournalSources: function(data) {
        xui.util.log("extractRecJournalSources");

        // 1) { status, data: [...] } 또는 배열
        var items = data;
        if (data && !Array.isArray(data) && Array.isArray(data.data)) {
            items = data.data;
        }
        if (!Array.isArray(items)) {
            console.warn("❌ 예상한 배열이 아님:", data);
            return "";
        }

        // 2) JSP 마크업(.journal-reco)과 동일한 구조
        //    항목을 하나씩 append 하며 누적 생성
        var $parts = $("<div></div>");
        items.forEach(function(item) {
            var cardHtml = aichat010.buildRecJournalCardHtml(item);
            if (cardHtml) {
                $parts.append(cardHtml);
            }
        });

        return "\n\n" + $parts.html() + "\n\n";
    },

    buildRecJournalCardHtml: function(item) {
        if (!item || typeof item !== "object") {
            return "";
        }
        var escapeHtml = function(s) {
            if (s == null || s === undefined) {
                return "";
            }
            return String(s)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        };
        var escapeAttr = function(s) {
            return escapeHtml(s).replace(/'/g, "&#39;");
        };
        var formatPubDateYm = function(iso) {
            if (!iso || typeof iso !== "string") {
                return "";
            }
            var m = iso.match(/^(\d{4})-(\d{2})/);
            if (!m) {
                return escapeHtml(iso);
            }
            var year = m[1];
            var month = String(parseInt(m[2], 10));
            /*if (aichat010.isKoreanLocale()) {
                return aichat010.msg("hyobee.chat.journal.reco.date.ym.ko.format", {
                    year: year,
                    month: month
                });
            }*/
            var monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-US", { month: "long" });
            return aichat010.msg("hyobee.chat.journal.reco.date.ym.format", {
                year: year,
                month: month,
                monthName: monthName
            });
        };

        var docType = (item.doc_type != null ? String(item.doc_type) : (item.type != null ? String(item.type) : "paper")).toLowerCase();
        var sourceId = item.source_id != null ? String(item.source_id) : (item.id != null ? String(item.id) : "");
        var displayTitle = item.display_title || "";
        var sourceTitleHtml = item.source_title != null ? String(item.source_title) : "";
        var author = item.author || "";
        var docSuffix = aichat010.resolveJournalRecoSummaryDocTypeSuffix(docType);

        // 발행기관·출처·권리자 소속 등: API source_name 우선
        var orgOrInstitution = (item.source_name || item.sourceName || "").trim();

        var row1Label = aichat010.msg("hyobee.chat.journal.reco.institution");
        var row2Label = aichat010.msg("hyobee.chat.journal.reco.author");
        var row3Label = aichat010.msg("hyobee.chat.journal.reco.publish_date");
        if (docType === "patent") {
            row1Label = aichat010.msg("hyobee.chat.journal.reco.assignee_org");
            row2Label = aichat010.msg("hyobee.chat.journal.reco.author");
            row3Label = aichat010.msg("hyobee.chat.journal.reco.filing_date");
        } else if (docType === "article" || docType === "news") {
            row1Label = aichat010.msg("hyobee.chat.journal.reco.source_org");
            row2Label = aichat010.msg("hyobee.chat.journal.reco.reporter");
            row3Label = aichat010.msg("hyobee.chat.journal.reco.publish_date");
        } else if (docType === "internal") {
            row1Label = aichat010.msg("hyobee.chat.journal.reco.source");
            row2Label = aichat010.msg("hyobee.chat.journal.reco.writer");
            row3Label = aichat010.msg("hyobee.chat.journal.reco.publish_date");
        }

        return ''
            + '<div class="journal-reco" data-doc-type="' + escapeAttr(docType) + '" data-journal-id="' + escapeAttr(sourceId) + '">'
            + '  <div class="journal-reco-header">'
            + '    <p class="journal-reco-heading">' + sourceTitleHtml + '</p>'
            + '    <div class="journal-reco-summary">'
            + '      <div class="journal-reco-summary-button" tabIndex="0">' + aichat010.msg("hyobee.chat.journal.reco.ai_summary.button") + '</div>'
            + '      <div class="journal-reco-summary-dialog --' + docSuffix + '">'
            + '        <p class="journal-reco-summary-title">' + aichat010.msg("hyobee.chat.journal.reco.ai_summary.card_title") + '</p>'
            + '      </div>'
            + '    </div>'
            + '  </div>'
            + '  <ul class="journal-reco-list">'
            + '    <li class="journal-reco-item">' + row1Label + ' : ' + escapeHtml(orgOrInstitution || "-") + '</li>'
            + '    <li class="journal-reco-item">' + row2Label + ' : ' + escapeHtml(author || "-") + '</li>'
            + '    <li class="journal-reco-item">' + row3Label + ' : ' + (formatPubDateYm(item.date) || "-") + '</li>'
            + '  </ul>'
            + '</div>';
    },

    appendRecJournalSourcesToAnswer: function(searchKey, data) {
        if (!searchKey || xui.valid.isEmpty(searchKey)) {
            return;
        }
        var $ans = $("#ans" + searchKey);
        if (!$ans.length) {
            return;
        }

        var items = data;
        if (data && !Array.isArray(data) && Array.isArray(data.data)) {
            items = data.data;
        }
        if (!Array.isArray(items) || items.length === 0) {
            return;
        }

        // 카드가 한 번에 보이지 않도록 메시지별 큐에 넣고 순차 append
        if (!aichat010._recJournalCardQueueMap) {
            aichat010._recJournalCardQueueMap = {};
        }
        if (!aichat010._recJournalCardQueueRunningMap) {
            aichat010._recJournalCardQueueRunningMap = {};
        }
        if (!Array.isArray(aichat010._recJournalCardQueueMap[searchKey])) {
            aichat010._recJournalCardQueueMap[searchKey] = [];
        }

        var queueRef = aichat010._recJournalCardQueueMap[searchKey];
        items.forEach(function(item) {
            var sourceId = item && item.source_id != null ? String(item.source_id) : "";
            if (!sourceId) {
                queueRef.push(item);
                return;
            }
            var escapedSourceId = sourceId.replace(/"/g, '\\"');
            var existsInDom = $ans.find('.journal-reco[data-journal-id="' + escapedSourceId + '"]').length > 0;
            if (existsInDom) {
                return;
            }
            var existsInQueue = queueRef.some(function(qItem) {
                return qItem && qItem.source_id != null && String(qItem.source_id) === sourceId;
            });
            if (!existsInQueue) {
                queueRef.push(item);
            }
        });

        if (aichat010._recJournalCardQueueRunningMap[searchKey]) {
            return;
        }
        aichat010._recJournalCardQueueRunningMap[searchKey] = true;

        var appendNext = function() {
            var queue = aichat010._recJournalCardQueueMap[searchKey];
            var $target = $("#ans" + searchKey);
            if (!$target.length || !queue || queue.length === 0) {
                aichat010._recJournalCardQueueRunningMap[searchKey] = false;
                return;
            }

            var item = queue.shift();
            var sourceId = item && item.source_id != null ? String(item.source_id) : "";
            if (sourceId) {
                var escapedSourceId = sourceId.replace(/"/g, '\\"');
                if (!$target.find('.journal-reco[data-journal-id="' + escapedSourceId + '"]').length) {
                    var cardHtml = aichat010.buildRecJournalCardHtml(item);
                    if (cardHtml) {
                        $target.append(cardHtml);
                    }
                }
            } else {
                var cardHtmlNoId = aichat010.buildRecJournalCardHtml(item);
                if (cardHtmlNoId) {
                    $target.append(cardHtmlNoId);
                }
            }

            // 카드가 "한 장씩 생성"되는 것이 체감되도록 간격을 둔다.
            setTimeout(appendNext, 350);
        };

        setTimeout(appendNext, 200);
    },

    /**
     * /messages 이력 배열에서 특정 assistant 인덱스보다 앞에 있는 가장 가까운 user 메시지 본문
     */
    findPrevUserContentInHistory: function(data, assistantIndex) {
        if (!data || assistantIndex <= 0) {
            return "";
        }
        for (var j = assistantIndex - 1; j >= 0; j--) {
            if (data[j].role === "user") {
                return aichat010.decodeHtmlEntities(data[j].content || "");
            }
        }
        return "";
    },

    /**
     * hidden_chat( !{{hidden_chat:...}} ) 직전 user + assistant에 sources 가 있을 때 스트리밍과 동일한 버블 inner HTML
     * @param {string} [assistantCreatedAt] assistant 메시지 created_at (이력 조회 시 KST 날짜와 맞춤)
     * @returns {string|null} 이미 marked 파싱된 HTML 또는 해당 없으면 null
     */
    buildHiddenRecJournalBubbleInnerHtmlFromHistory: function(prevUserContentDecoded, sources, assistantCreatedAt) {
        if (!prevUserContentDecoded || String(prevUserContentDecoded).indexOf("!!{{hidden_chat:") < 0) {
            return null;
        }
        if (!sources || !sources.length) {
            return null;
        }
        var hiddenCtx = aichat010.parseHiddenChatContext(prevUserContentDecoded);
        var headingHtml = aichat010.buildRecJournalTitleHeadingHtml(hiddenCtx.teamName, assistantCreatedAt, hiddenCtx.docType);
        var journalCardsHtml = aichat010.extractRecJournalSources(sources);
        return marked.parse(headingHtml + journalCardsHtml);
    },

    /**
     * journal-status-comment 가 flex이고 letter-spacing 등으로 일반 공백이 거의 안 보일 수 있음 → &nbsp; 사용.
     * DB 템플릿을 {count} 기준으로 분할 후 각 구간을 span으로 감싼다.
     * @param {string} messageTemplate hyobee.chat.journal.source.found 원문
     * @param {string} countInnerHtml 이미 준비된 &lt;span class="journal-status-count"&gt;…&lt;/span&gt;
     */
    buildJournalStatusCommentHtml: function(messageTemplate, countInnerHtml) {
        var escapeBody = function(s) {
            return String(s || "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
        };
        var escapeSeg = function(raw) {
            var s = String(raw || "");
            var prefix = "";
            var suffix = "";
            var hadLeadingSpace = false;

            while (s.length && (s.charAt(0) === " " || s.charAt(0) === "\u00A0")) {
                prefix += "&nbsp;";
                s = s.slice(1);
                hadLeadingSpace = true;
            }
            while (s.length && (s.charAt(s.length - 1) === " " || s.charAt(s.length - 1) === "\u00A0")) {
                suffix = "&nbsp;" + suffix;
                s = s.slice(0, -1);
            }

            if (!hadLeadingSpace && s.length && /^[A-Za-z]/.test(s.charAt(0))) {
                prefix += "&nbsp;";
            }
            return prefix + escapeBody(s) + suffix;
        };

        var t = String(messageTemplate || "")
            .replace(/\uFF5B/g, "{")
            .replace(/\uFF5D/g, "}");
        var parts = t.split("{count}");
        var out = "";
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] !== "") {
                out += '<span>' + escapeSeg(parts[i]) + '</span>';
            }
            if (i < parts.length - 1) {
                out += countInnerHtml;
            }
        }
        return out;
    },

    /**
     * source_headers 계열 숫자 값을 정규화한다.
     * @param {Object} headers
     * @returns {{totalCount:number,paperCount:number,patentCount:number,articleCount:number,internalCount:number}}
     */
    normalizeSourceHeaderCounts: function(headers) {
        var toCount = function(value) {
            var n = Number(value);
            return isNaN(n) ? 0 : n;
        };
        return {
            totalCount: toCount(headers && headers.total_count),
            paperCount: toCount(headers && headers.paper),
            patentCount: toCount(headers && headers.patent),
            articleCount: toCount(headers && headers.article),
            internalCount: toCount(headers && headers.internal)
        };
    },

    inferRndSearchFromMessageData: function(messageData) {
        if (!messageData || typeof messageData !== "object") {
            return false;
        }
        if (String(messageData.chat_category || "") === "rnd_search") {
            return true;
        }
        var sources = messageData.sources;
        if (Array.isArray(sources)) {
            for (var i = 0; i < sources.length; i++) {
                var sourceType = String((sources[i] || {}).source_type || "").toLowerCase();
                if (sourceType === "rnd") {
                    return true;
                }
            }
        }
        return false;
    },

    shouldShowJournalStatusBar: function(messageId, messageData) {
        var key = messageId != null ? String(messageId) : "";
        if (!key) {
            return false;
        }
        if (Object.prototype.hasOwnProperty.call(messageJournalStatusVisibleMap, key)) {
            return !!messageJournalStatusVisibleMap[key];
        }
        if (messageData) {
            var inferred = aichat010.inferRndSearchFromMessageData(messageData);
            messageJournalStatusVisibleMap[key] = inferred;
            return inferred;
        }
        return false;
    },

    // 메시지 출처 헤더
    loadSourceHeader: function(headers, messageId) {
        if (!headers || typeof headers !== "object") {
            return '';
        }
        if (messageId && !aichat010.shouldShowJournalStatusBar(messageId)) {
            return '';
        }

        // source_headers JSON chunk를 탭 UI로 렌더링
        try {
            var counts = aichat010.normalizeSourceHeaderCounts(headers);
            var totalCount = counts.totalCount;
            var paperCount = counts.paperCount;
            var patentCount = counts.patentCount;
            var articleCount = counts.articleCount;
            var internalCount = counts.internalCount;

            // hyobee.chat.journal.source.found — 예: {count} sources found. / {count}개의… / 已找到{count}个来源
            // flex 레이아웃에서 텍스트 노드 공백이 없어지는 문제 → 문구 구간을 span으로 분리해 조립
            var countInnerHtml = '<span class="journal-status-count">' + totalCount + "</span>";
            var tpl = xui.message.get("hyobee.chat.journal.source.found");
            var statusCommentHtml = aichat010.buildJournalStatusCommentHtml(tpl, countInnerHtml);

            return ''
                + '<div class="journal-status-bar' + (totalCount < 1 ? ' --passive' : '') + '">'
                + '    <div class="journal-status-button --thesis' + (paperCount < 1 ? ' --passive' : '') + '" tabIndex="0">' + paperCount + '</div>'
                + '    <div class="journal-status-button --patent' + (patentCount < 1 ? ' --passive' : '') + '" tabIndex="0">' + patentCount + '</div>'
                + '    <div class="journal-status-button --article' + (articleCount < 1 ? ' --passive' : '') + '" tabIndex="0">' + articleCount + '</div>'
                + '    <div class="journal-status-button --corp' + (internalCount < 1 ? ' --passive' : '') + '" tabIndex="0">' + internalCount + '</div>'
                + '    <div class="journal-status-comment --all" tabIndex="0">'
                +         statusCommentHtml
                + '    </div>'
                + '</div>';
        } catch (e) {
            // JSON chunk가 아니면 기존 링크 치환 로직으로 진행
        }

        return "";

        // 수정된 HTML 문자열 반환
//        return $html.html();
    },

    /**
     * 출처 패널 상단 탭 정의 (표시명·CSS modifier만; 건수는 bindJournalPanelSourceHeaders에서 반영)
     */
    JOURNAL_TAB_DEFS: [
        { typeClass: "--all", labelKey: "hyobee.chat.journal.source.tab.header.all", active: true },
        { typeClass: "--thesis", labelKey: "hyobee.chat.journal.source.tab.header.paper" },
        { typeClass: "--patent", labelKey: "hyobee.chat.journal.source.tab.header.patent" },
        { typeClass: "--article", labelKey: "hyobee.chat.journal.source.tab.header.article" },
        { typeClass: "--corp", labelKey: "hyobee.chat.journal.source.tab.header.internal" }
    ],

    /**
     * .journal-tab-list가 비어 있을 때만 탭 버튼 DOM 생성 (기존 퍼블 마크업이 있으면 유지)
     */
    renderJournalTabList: function() {
        var $list = $(".journal-panel .journal-tab-list");
        if (!$list.length) {
            return;
        }
        var defs = aichat010.JOURNAL_TAB_DEFS;
        if ($list.children(".journal-tab-button").length) {
            $list.children(".journal-tab-button").each(function(index) {
                if (!defs[index]) {
                    return;
                }
                var label = defs[index].labelKey
                    ? aichat010.msg(defs[index].labelKey)
                    : (defs[index].label || "");
                $(this).find(".journal-tab-text").text(label);
            });
            return;
        }
        var html = "";
        for (var i = 0; i < defs.length; i++) {
            var d = defs[i];
            var activeClass = d.active ? " --active" : "";
            var label = d.labelKey ? aichat010.msg(d.labelKey) : (d.label || "");
            html += ""
                + '<div class="journal-tab-button ' + d.typeClass + activeClass + '" tabIndex="0">'
                + '<span class="journal-tab-text">' + label + '</span>'
                + '<span class="journal-tab-count">0</span>'
                + "</div>";
        }
        $list.html(html);
    },

    bindJournalPanelSourceHeaders: function(headers) {
        var $panel = $(".journal-panel");
        if (!$panel.length || !headers) {
            return;
        }
        var counts = aichat010.normalizeSourceHeaderCounts(headers);
        var totalCount = counts.totalCount;
        var paperCount = counts.paperCount;
        var patentCount = counts.patentCount;
        var articleCount = counts.articleCount;
        var internalCount = counts.internalCount;

        var setPanelCount = function(typeClass, count) {
            var $tab = $panel.find(".journal-tab-button." + typeClass);
            if (!$tab.length) return;

            var $count = $tab.find(".journal-tab-count");
            if ($count.length) {
                $count.text(count);
                if (count < 1) $tab.addClass('--passive');
                else $tab.removeClass('--passive');
            } else {
                $tab.attr("data-count", count);
            }
        };

        setPanelCount("--all", totalCount);
        setPanelCount("--thesis", paperCount);
        setPanelCount("--patent", patentCount);
        setPanelCount("--article", articleCount);
        setPanelCount("--corp", internalCount);

        // 패널 하단 결과 문구 카운트 동기화
        $panel.find(".journal-result-count").text(totalCount);
    },

    buildSourceHeadersFromSources: function(sources) {
        var list = Array.isArray(sources) ? sources : [];
        var headers = {
            total_count: list.length,
            paper: 0,
            patent: 0,
            article: 0,
            internal: 0
        };

        for (var i = 0; i < list.length; i++) {
            var item = list[i] || {};
            var docType = String(item.doc_type || item.docType || "").toLowerCase();
            var sourceType = String(item.source_type || item.sourceType || "").toLowerCase();

            if (docType === "paper" || docType === "journal") {
                headers.paper += 1;
            } else if (docType === "patent") {
                headers.patent += 1;
            } else if (docType === "article" || docType === "news") {
                headers.article += 1;
            } else if (docType === "internal" || sourceType === "internal") {
                headers.internal += 1;
            }
        }

        return headers;
    },

    cacheSourceHeadersOnStatusBar: function(messageId, headers) {
        if (!messageId || !headers) {
            return;
        }
        try {
            var key = String(messageId);
            messageSourceHeadersMap[key] = headers;
            var serialized = JSON.stringify(headers);
            var $chat = $("#container .chat.--a").filter(function() {
                return String($(this).attr("id")) === key;
            }).first();
            var $bar = $chat.find(".journal-status-bar").first();
            if ($bar.length) {
                $bar.attr("data-source-headers", serialized);
            }
        } catch (ignore) {
        }
    },

    /**
     * 메시지 내부 출처 상태바 DOM에서 source_headers 형태의 카운트를 추출
     * @param {jQuery} $statusRoot .journal-status-bar 또는 그 내부 요소
     * @returns {{total_count:number,paper:number,patent:number,article:number,internal:number}|null}
     */
    extractSourceHeadersFromStatusBar: function($statusRoot) {
        var $bar = $statusRoot && $statusRoot.hasClass("journal-status-bar")
            ? $statusRoot
            : ($statusRoot ? $statusRoot.closest(".journal-status-bar") : $());

        if (!$bar || !$bar.length) {
            return null;
        }

        var toCount = function(selector) {
            var value = Number(($bar.find(selector).first().text() || "").trim());
            return isNaN(value) ? 0 : value;
        };

        var total = Number(($bar.find(".journal-status-count").first().text() || "").trim());
        total = isNaN(total) ? 0 : total;

        var parsed = {
            total_count: total,
            paper: toCount(".journal-status-button.--thesis"),
            patent: toCount(".journal-status-button.--patent"),
            article: toCount(".journal-status-button.--article"),
            internal: toCount(".journal-status-button.--corp")
        };

        // 상태바가 "출처 N" 형태(버튼 없음)인 경우 data-source-headers 캐시를 우선 사용
        var hasTypeButtons = $bar.find(".journal-status-button").length > 0;
        var hasAnyTypedCount = parsed.paper > 0 || parsed.patent > 0 || parsed.article > 0 || parsed.internal > 0;
        if ((!hasTypeButtons || !hasAnyTypedCount) && parsed.total_count > 0) {
            var rawCached = ($bar.attr("data-source-headers") || "").trim();
            if (rawCached) {
                try {
                    var cached = JSON.parse(rawCached);
                    if (cached && typeof cached === "object") {
                        return {
                            total_count: Number(cached.total_count) || parsed.total_count,
                            paper: Number(cached.paper) || 0,
                            patent: Number(cached.patent) || 0,
                            article: Number(cached.article) || 0,
                            internal: Number(cached.internal) || 0
                        };
                    }
                } catch (ignore) {
                }
            }

            // DOM 캐시가 없으면 message_id 기반 메모리 캐시 사용
            var messageId = String($bar.closest(".chat.--a").attr("id") || "");
            var mapped = messageId ? messageSourceHeadersMap[messageId] : null;
            if (mapped && typeof mapped === "object") {
                return {
                    total_count: Number(mapped.total_count) || parsed.total_count,
                    paper: Number(mapped.paper) || 0,
                    patent: Number(mapped.patent) || 0,
                    article: Number(mapped.article) || 0,
                    internal: Number(mapped.internal) || 0
                };
            }
        }

        return parsed;
    },

    toMessageSourceDocType: function(typeClass) {
        switch (typeClass) {
            case "--thesis":
                return "paper";
            case "--patent":
                return "patent";
            case "--article":
                return "article";
            case "--corp":
                return "internal";
            case "--all":
                // 전체 조회는 doc_type/doc_types 파라미터를 보내지 않음(null 의미)
                return null;
            default:
                return "article";
        }
    },

    toMessageSourceTypeClass: function(docType) {
        switch ((docType || "").toLowerCase()) {
            case "paper":
                return "--thesis";
            case "patent":
                return "--patent";
            case "article":
                return "--article";
            case "internal":
                return "--corp";
            default:
                return "--article";
        }
    },

    toMessageSourceTypeLabel: function(docType) {
        switch ((docType || "").toLowerCase()) {
            case "paper":
                return aichat010.msg("hyobee.chat.journal.source.tab.item.paper");
            case "patent":
                return aichat010.msg("hyobee.chat.journal.source.tab.item.patent");
            case "article":
                return aichat010.msg("hyobee.chat.journal.source.tab.item.article");
            case "internal":
                return aichat010.msg("hyobee.chat.journal.source.tab.item.internal");
            default:
                return aichat010.msg("hyobee.chat.journal.source.tab.item.paper");
        }
    },

    fetchAndRenderMessageSources: function(typeClass, messageId, page) {
        var conversationId = mobjConversationId;
        var userId = $("#user_id").val();
        var docType = aichat010.toMessageSourceDocType(typeClass);
        var requestPage = page || 1;
        var requestSize = 10;

        currentMessageSourceContext = {
            typeClass: typeClass,
            messageId: String(messageId)
        };

        if (!conversationId || !messageId || !userId) {
            console.warn("❌ journal sources 조회 파라미터 누락:", {
                conversationId: conversationId,
                messageId: messageId,
                userId: userId
            });
            return;
        }

        var path = "/xs/aichat/v2/rnd/conversations/" + encodeURIComponent(conversationId)
            + "/messages/" + encodeURIComponent(messageId) + "/sources";

        var extractRows = function(response) {
            if (response && typeof response.getDataJsonArray === "function") {
                return response.getDataJsonArray() || [];
            }
            if (response && response.sources) {
                return response.sources || [];
            }
            return [];
        };

        var extractPaging = function(response, rows) {
            var pageNo = requestPage;
            var rowPerPage = requestSize;
            var totalCount = rows ? rows.length : 0;
            var isTotalCountKnown = false;
            var headerJson = (response && typeof response.getHeaderJson === "function")
                ? response.getHeaderJson()
                : null;

            if (response && typeof response.getPageNo === "function") {
                var parsedPage = Number(response.getPageNo());
                if (!isNaN(parsedPage) && parsedPage > 0) {
                    pageNo = parsedPage;
                }
            }
            if (response && typeof response.getRowPerPage === "function") {
                var parsedSize = Number(response.getRowPerPage());
                if (!isNaN(parsedSize) && parsedSize > 0) {
                    rowPerPage = parsedSize;
                }
            }
            if (response && typeof response.getTotCount === "function") {
                var parsedTotal = Number(response.getTotCount());
                if (!isNaN(parsedTotal) && parsedTotal > 0) {
                    totalCount = parsedTotal;
                    isTotalCountKnown = true;
                }
            }
            // 일부 응답은 TOT_COUNT를 비우거나 0으로 내려주므로, 헤더 원본 존재 여부를 같이 체크한다.
            if (headerJson && headerJson.TOT_COUNT !== undefined && headerJson.TOT_COUNT !== null && headerJson.TOT_COUNT !== "") {
                var headerTotal = Number(headerJson.TOT_COUNT);
                if (!isNaN(headerTotal) && headerTotal >= 0) {
                    totalCount = headerTotal;
                    isTotalCountKnown = true;
                }
            }

            var totalPage = 1;
            if (rowPerPage > 0) {
                if (isTotalCountKnown) {
                    totalPage = Math.ceil(totalCount / rowPerPage);
                } else {
                    // total 미제공 시: 현재 페이지가 꽉 찼으면 다음 페이지가 있다고 가정하여 페이지네이션 노출
                    var hasNextByRows = (rows && rows.length === rowPerPage);
                    totalPage = hasNextByRows ? (pageNo + 1) : pageNo;
                    totalCount = ((Math.max(pageNo, 1) - 1) * rowPerPage) + (rows ? rows.length : 0);
                }
            }
            if (!totalPage || totalPage < 1) {
                totalPage = 1;
            }

            return {
                page: pageNo,
                size: rowPerPage,
                totalCount: totalCount,
                totalPage: totalPage
            };
        };

        var requestByDocType = function(targetDocType) {
            var query = {
                user_id: userId,
                page: requestPage,
                size: requestSize,
                sort_by: currentJournalSortBy,
                sort_order: currentJournalSortOrder
            };
            // all(null)일 때는 doc_type 미전송
            if (targetDocType !== null && targetDocType !== undefined && targetDocType !== "") {
                query.doc_type = targetDocType;
            }

            return aichat010.requestApi(path, {
                method: "GET",
                query: query
            });
        };

        // 버튼별 단일 조회 (--all은 doc_type/doc_types 미전송)
        requestByDocType(docType)
            .then(function(response) {
                var rows = extractRows(response);
                var paging = extractPaging(response, rows);
                currentMessageSourcePaging = paging;
                aichat010.renderMessageSourcePanel(rows, paging);
            })
            .catch(function(err) {
                console.error("❌ journal sources 조회 실패:", err);
                currentMessageSourcePaging = {
                    page: requestPage,
                    size: requestSize,
                    totalCount: 0,
                    totalPage: 1
                };
                aichat010.renderMessageSourcePanel([], currentMessageSourcePaging);
            });
    },

    renderMessageSourcePanel: function(sources, paging) {
        var $panel = $(".journal-panel");
        var $target = $panel.find(".journal-tab-panel");
        if (!$target.length) {
            return;
        }

        if (!sources || !sources.length) {
            $target.html('<div class="journal-content"><p class="journal-content-title">조회된 출처가 없습니다.</p></div>');
            aichat010.renderMessageSourcePagination(paging);
            return;
        }

        var html = "";
        sources.forEach(function(item, idx) {
            var docType = item.doc_type || item.type || "";
            var isInternal = String(docType).toLowerCase() === "internal";
            var typeClass = aichat010.toMessageSourceTypeClass(docType);
            var typeLabel = aichat010.toMessageSourceTypeLabel(docType);
            var key = item.source_id || item.id || item.reference_index || (idx + 1);
            var sourceUrl = item.url || "";
            var boardId = isInternal ? (item.board_id || item.boardId || "") : "";
            var sourceName = item.source_name === undefined ? "" : item.source_name;
            var title = item.title || "";
            var author = item.author || "-";
            var date = item.date || "-";
            var similarityRaw = Number(item.similarity);
            var similarityValue = isNaN(similarityRaw) ? 0 : similarityRaw;
            var similarityText = similarityValue.toFixed(2);
            var similarityPercent = Math.max(0, Math.min(100, Math.round(similarityValue * 100)));
            var similarTagHtml = "";
            var similarityMetricHtml = "";

            if (similarityValue === JOURNAL_SIMILARITY.LOW_VALUE) {
                // -999.0일 때만 Keyword 태그 노출
                similarTagHtml = '<span class="similar-tag keyword">'
                    + aichat010.msg(JOURNAL_SIMILARITY.KEYWORD_TAG_KEY)
                    + '</span>';
            } else if (similarityValue <= JOURNAL_SIMILARITY.KEYWORD_THRESHOLD) {
                // 0.4 이상일 때만 보조자료 태그 노출
                similarTagHtml = '<span class="similar-tag low">'
                    + aichat010.msg(JOURNAL_SIMILARITY.LOW_TAG_KEY)
                    + '</span>';
            }

            if (similarityValue !== JOURNAL_SIMILARITY.LOW_VALUE) {
                similarityMetricHtml = ''
                    + '      <span class="journal-content-similar-text">'+ aichat010.msg("hyobee.chat.journal.source.tab.item.similarity") +'</span>'
                    + '      <span class="journal-content-similar-value">' + similarityText + '</span>'
                    + '      <span class="journal-content-similar-percent" style="--similar: ' + similarityPercent + '%;"></span>';
            }

            html += ''
                + '<div class="journal-content" tabIndex="0"'
                + ' data-doc-type="' + docType + '"'
                + ' data-journal-id="' + key + '"'
                + ' data-url="' + aichat010.escapeHtmlAttr(sourceUrl) + '"'
                + (isInternal ? ' data-board-id="' + aichat010.escapeHtmlAttr(boardId) + '"' : '')
                + '>'
                + '  <div class="journal-content-subject">'
                + '    <span class="journal-content-type ' + typeClass + '">' + typeLabel + '</span>'
                + '    <span class="journal-content-source-name">' + sourceName + '</span>'
                + '  </div>'
                + '  <p class="journal-content-title">' + title + '</p>'
                + '  <p class="journal-content-author">' + author + '</p>'
                + '  <div class="journal-content-info">'
                + '    <span class="journal-content-date">' + date + '</span>'
                + '    <span class="journal-content-similar">'
                +        similarityMetricHtml
                +        similarTagHtml
                + '    </span>'
                + '  </div>'
                + '</div>';
        });

        $target.html(html);
        aichat010.renderMessageSourcePagination(paging);
    },

    renderMessageSourcePagination: function(paging) {
        var $pagination = $(".journal-panel .journal-pagination");
        if (!$pagination.length) {
            return;
        }

        var page = paging && paging.page ? Number(paging.page) : 1;
        var totalPage = paging && paging.totalPage ? Number(paging.totalPage) : 1;
        var totalCount = paging && paging.totalCount ? Number(paging.totalCount) : 0;

        if (!page || page < 1) {
            page = 1;
        }
        if (!totalPage || totalPage < 1) {
            totalPage = 1;
        }
        if (isNaN(totalCount) || totalCount < 0) {
            totalCount = 0;
        }

        $(".journal-panel .journal-result-count").text(totalCount);

        if (totalPage <= 1) {
            $pagination.hide();
            return;
        }
        $pagination.show();

        var isFirstPage = page <= 1;
        var isLastPage = page >= totalPage;

        var startPage = Math.max(1, page - 2);
        var endPage = Math.min(totalPage, startPage + 4);
        startPage = Math.max(1, endPage - 4);

        var html = "";
        html += '<div class="journal-pagination-first' + (isFirstPage ? " --passive" : "") + '" tabIndex="0" data-page="1"></div>';
        html += '<div class="journal-pagination-prev' + (isFirstPage ? " --passive" : "") + '" tabIndex="0" data-page="' + Math.max(1, page - 1) + '"></div>';

        for (var p = startPage; p <= endPage; p++) {
            var activeClass = (p === page) ? " --active" : "";
            html += '<div class="journal-pagination-button' + activeClass + '" tabIndex="0" data-page="' + p + '">' + p + '</div>';
        }

        html += '<div class="journal-pagination-next' + (isLastPage ? " --passive" : "") + '" tabIndex="0" data-page="' + Math.min(totalPage, page + 1) + '"></div>';
        html += '<div class="journal-pagination-last' + (isLastPage ? " --passive" : "") + '" tabIndex="0" data-page="' + totalPage + '"></div>';

        $pagination.html(html);
    },

    /**
     * API 연동 전: 클릭한 journal-button 타입에 맞춰 journal-content(3개) 더미 데이터를 생성한다.
     * @param {string} doctype - journal-button 클릭 값(thesis/patent/article)
     * @returns {Array<Object>}
     */
        getDummyJournalSourcesForDoctype: function(doctype) {
        var orderMap = {
            thesis: ["paper", "patent", "internal"],
            patent: ["patent", "article", "internal"],
            article: ["article", "patent", "internal"]
        };

        var order = orderMap[doctype] || ["patent", "article", "internal"];
        var similarities = [0.33, 0.50, 0.99];

        return order.slice(0, 3).map(function(docType, idx) {
            return {
                doc_type: docType,
                source_id: "QWER1234-" + (idx + 1),
                title: "제목",
                author: "저자",
                date: "YYYY.MM.DD",
                similarity: similarities[idx] != null ? similarities[idx] : 0.33
            };
        });
    },

// ========================================================
// 스크롤 처리 관련 헬퍼 함수
// ========================================================
    /**
     * 메시지 추가 후 스크롤 처리
     * @param {boolean} isFirstChat - 최초 채팅 여부
     * @param {boolean} disableScroll - 스크롤 비활성화 여부 (기본: false)
     * @param {number} firstNewMessageIndex - 첫 번째 새 메시지의 인덱스
     */
    /**
     * 메시지 추가 후 스크롤 처리
     * @param {boolean} isFirstChat - 최초 채팅 여부
     * @param {boolean} disableScroll - 스크롤 비활성화 여부
     * @param {number} firstNewMessageIndex - 첫 번째 새 메시지의 인덱스
     */
    _handleChatScrollAfterMessage: function(isFirstChat, disableScroll, firstNewMessageIndex) {
        // 스크롤 완전 비활성화
        if (disableScroll) {
            return;
        }

        // 최초 채팅일 때는 아무 작업도 하지 않음 (스크롤 발생 방지)
        if (isFirstChat) {
            return;
        }

        // 기존 대화인 경우 방금 추가된 첫 번째 메시지를 스크롤 상단에 위치
        setTimeout(function() {
            var $box = $("#box");
            $box.addClass("--space");

            // 모든 채팅 메시지 가져오기
            var $allChats = $box.find('.chat');

            // 첫 번째 새 메시지 찾기 (인덱스가 제공된 경우)
            var $firstNewMsg = null;
            if (typeof firstNewMessageIndex === 'number' && firstNewMessageIndex >= 0) {
                $firstNewMsg = $allChats.eq(firstNewMessageIndex);
            }

            // 인덱스로 찾지 못한 경우 마지막 사용자 메시지 그룹에서 첫 번째 찾기
            if (!$firstNewMsg || $firstNewMsg.length === 0) {
                // .--last 클래스를 가진 사용자 메시지부터 역순으로 찾기
                var $userMsgs = $box.find('.chat.--q');
                var lastIndex = $userMsgs.length - 1;

                // 마지막 --last를 가진 메시지 찾기
                for (var i = lastIndex; i >= 0; i--) {
                    if ($userMsgs.eq(i).hasClass('--last')) {
                        $firstNewMsg = $userMsgs.eq(i);
                        break;
                    }
                }

                // 못 찾았으면 마지막 사용자 메시지 사용
                if (!$firstNewMsg || $firstNewMsg.length === 0) {
                    $firstNewMsg = $userMsgs.last();
                }
            }

            // 첫 번째 새 메시지를 찾았으면 해당 위치로 스크롤
            if ($firstNewMsg && $firstNewMsg.length > 0) {
                var container = $box[0];
                var msgOffset = $firstNewMsg[0].offsetTop;

                // 첫 번째 새 메시지를 스크롤 상단에 위치시킴
                container.scrollTo({
                    top: msgOffset - 116, // 여백(72 + 44) 조정
                    behavior: "smooth"
                });
            }
        }, 50);
    },

    /**
     * 최초 대화 완료 후 상태 초기화
     * 리프레시 없이 필요한 상태만 갱신하여 사용자 경험 개선
     */
    _handleFirstChatCompletion: function() {
        xui.util.log("🔄 최초 대화 완료 - 상태 초기화 시작");

        // 1. 전역 플래그 초기화
        isNewChat = false;
        isFirstChatInNewConversation = false; // 중복 메시지 방지 플래그 해제

        // 2. 컨테이너 상태 업데이트 (대화 중 상태로 변경)
        $("#container").addClass("--ing");

        // 3. --space 클래스 추가 (다음 메시지부터 정상 스크롤 활성화)
        setTimeout(function() {
            //$("#box").addClass("--space");
        }, 100);

        // 4. 대화 목록 갱신 (사이드바에 새 대화방 표시)
        // 이미 selectDataChatHistoryAll()이 호출되고 있으므로 중복 호출 방지

        xui.util.log("✅ 최초 대화 상태 초기화 완료");
    },

    /**
     * 스트리밍 중 스크롤 제어 초기화
     * 사용자가 수동으로 스크롤하면 자동 스크롤 비활성화
     */
    _initStreamingScrollControl: function() {
        var $container = $(".container");
        var userScrollTimeout = null;

        $container.on('scroll', function() {
            var scrollTop = this.scrollTop;
            var scrollHeight = this.scrollHeight;
            var clientHeight = this.clientHeight;

            // 하단에서 100px 이내면 자동 스크롤 활성화
            var isNearBottom = (scrollTop + clientHeight) >= (scrollHeight - 100);

            if (isNearBottom) {
                isAutoScrollEnabled = true;
            } else {
                // 사용자가 위로 스크롤했다면 자동 스크롤 비활성화
                isAutoScrollEnabled = false;
            }

            // 디바운스: 스크롤이 멈춘 후 일정 시간 후 상태 확인
            clearTimeout(userScrollTimeout);
            userScrollTimeout = setTimeout(function() {
                // 스크롤이 멈춘 후 위치 재확인
                var currentScrollTop = $container.scrollTop();
                var currentScrollHeight = $container[0].scrollHeight;
                var currentClientHeight = $container.outerHeight();
                isAutoScrollEnabled = (currentScrollTop + currentClientHeight) >= (currentScrollHeight - 100);
            }, 150);
        });
    },

// ========================================================
// 텍스트 복사, 붙여넣기 관련 기능 모음
// ========================================================
    //텍스트 복사기능
    copyFeedbackMessage : function(element){
        var searchKey = $(element).data('searchkey'); // "2"
        var conversationDiv = $('#ans'+searchKey); // id="2"인 div 찾기
        xui.util.log("copyFeedbackMessage:", searchKey, element);


        if (conversationDiv.length > 0) {
            // 1. 원본을 건드리지 않기 위해 복제본 생성
            var $clone = conversationDiv.clone();

            // 2. [추가된 고도화 디자인 요소 제거]
            // 화면 노출용 버튼, 다이얼로그, 숨겨진 요소 등 복사 시 불필요한 것들 삭제
            $clone.find('.journal-reco-summary-button, .journal-reco-summary-dialog, button, .xui-hidden').remove();

            // 3. 만약 'journal-reco-heading' 같은 클래스를 일반 텍스트(예: h3)처럼 취급하고 싶다면 태그 변환
            $clone.find('.journal-reco-heading').each(function() {
                $(this).replaceWith('<h3>' + $(this).html() + '</h3>');
            });
            // 4. HTML 태그 내부의 불필요한 공백/엔터 정리
            var htmlContent = $clone.html();

            var textContent = conversationDiv.text(); //.find('.text').text().trim();
//            var htmlContent = conversationDiv.html();
            console.log(htmlContent);

            // 2. HTML 태그 제거 로직 추가
            // <br>이나 <div> 등 줄바꿈 역할을 하는 태그를 실제 줄바꿈(\n)으로 변환 후 태그 제거
//            var cleanText = htmlContent
//                .replace(/<br\s*\/?>/gi, "\n")              // <br> 태그를 줄바꿈으로
//                .replace(/<\/p>/gi, "\n")                   // </p> 태그 뒤에 줄바꿈 추가
//                .replace(/<\/div>/gi, "\n")                 // </div> 태그 뒤에 줄바꿈 추가
//                .replace(/<[^>]*>?/gm, '')                  // 모든 나머지 HTML 태그 제거
//                .replace(/&nbsp;/gi, ' ')                   // 공백 특수문자 변환
//                .trim();                                    // 앞뒤 공백 제거
//            htmlContent = cleanText;
//            console.log(htmlContent);

            // [핵심] 공백 및 줄바꿈 정리 로직
            htmlContent = htmlContent
                .replace(/\s{2,}/g, ' ')                    // 연속된 2개 이상의 공백을 하나의 공백으로 축소
                .replace(/^\s+|\s+$/gm, '')                 // 각 줄의 앞뒤 공백 제거
                .replace(/<ul[^>]*>/gi, '') // ul 시작태그 제거 (속성 포함)
                .replace(/<ol[^>]*>/gi, '') // ol 시작태그 제거
                .replace(/<li>([\s\S]*?)<\/li>/gi, function(_, liContent) {
                    // li 내부의 공백을 제거하고 앞에 불렛(-) 추가
                    return '- ' + liContent.trim() + '\n';
                })
                .replace(/<\/ul>|<\/ol>/gi, '\n\n'); // 리스트가 끝나면 확실하게 두 줄 개행
            ;

            // 5. 기존 마크다운 파서 실행
            var markdown = aichat010.copyAsMarkdown(htmlContent);
            console.log("최종 마크다운:\n", markdown);

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(markdown)
                    .then(() => {
                        xui.util.log('✅ 복사 성공:', textContent);
                        // alert('내용이 복사되었습니다!');
                        $('.banner-message').addClass('--active');
                        $(".copy.common-focusable").addClass('--passive');
                        setTimeout(() => {
                            $('.banner-message').removeClass('--active');
                            $('.copy.common-focusable').removeClass('--passive');
                        }, 800);
                    })
                    .catch(err => {
                        console.error('복사 실패:', err);
                        aichat010.fallbackCopyTextToClipboard(markdown);
                    });
            } else {
                aichat010.fallbackCopyTextToClipboard(markdown);
            }
        } else {
            console.warn('대상 div를 찾을 수 없습니다.');
        }
    },

    // 로컬, http, 구형 브라우저 호환용 복사로직
    fallbackCopyTextToClipboard : function(text) {
        var tempInput = $('<textarea>');
        $('body').append(tempInput);
        tempInput.val(text).select();
        try {
            document.execCommand('copy');
            // alert('내용이 복사되었습니다!');
            $('.banner-message').addClass('--active');
            $(".copy.common-focusable").addClass('--passive');
            setTimeout(() => {
                $('.banner-message').removeClass('--active');
                $('.copy.common-focusable').removeClass('--passive');
            }, 800);
        } catch (err) {
            console.error('복사 실패:', err);
        }
        tempInput.remove();
    },

    // 복사 서식 적용
    copyAsMarkdown : function( htmlContent ) {
        if ( !htmlContent ) return '';

        // HTML entity
        htmlContent = htmlContent.replace(/&lt;/g, '%%LEFT%%');
        htmlContent = htmlContent.replace(/&gt;/g, '%%RIGHT%%');

        // h3
        htmlContent = htmlContent.replace(/<h1>([\s\S]*?)<\/h1>/gi,'[$1]\n');
        htmlContent = htmlContent.replace(/<h2>([\s\S]*?)<\/h2>/gi,'[$1]\n');
        htmlContent = htmlContent.replace(/<h3>([\s\S]*?)<\/h3>/gi,'[$1]\n');
        htmlContent = htmlContent.replace(/<h4>([\s\S]*?)<\/h4>/gi,'[$1]\n');
        htmlContent = htmlContent.replace(/<h5>([\s\S]*?)<\/h5>/gi,'[$1]\n');
        htmlContent = htmlContent.replace(/<h6>([\s\S]*?)<\/h6>/gi,'[$1]\n');

        // strong, em, b
        htmlContent = htmlContent.replace(/<strong>([\s\S]*?)<\/strong>/gi,'%%LEFT%%$1%%RIGHT%%');
        htmlContent = htmlContent.replace(/<em>([\s\S]*?)<\/em>/gi,'%%LEFT%%$1%%RIGHT%%');
        htmlContent = htmlContent.replace(/<b>([\s\S]*?)<\/b>/gi,'%%LEFT%%$1%%RIGHT%%');

        // (inline)code
        htmlContent = htmlContent.replace(/<code>([\s\S]*?)<\/code>/gi, '{ $1 }');

        // blockquotes
        htmlContent = htmlContent.replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi,'"$1"\n');

        // p
        htmlContent = htmlContent.replace(/<p>([\s\S]*?)<\/p>/gi, '$1');

        // ul, li
        // htmlContent = htmlContent.replace(/<ul>([\s\S]*?)<\/ul>/gi, function( _, ulContent ) {
        //     var liMarkdown = ulContent.replace(/<li>([\s\S]*?)<\/li>/gi, '- $1\n');
        //     return liMarkdown + '\n';
        // });

        // ol, li
        // htmlContent = htmlContent.replace(/<ol>([\s\S]*?)<\/ol>/gi, function( _, olContent ) {
        //     var count = 1;
        //     var liMarkdown = olContent.replace(/<li>([\s\S]*?)<\/li>/gi, function( _, liContent ){
        //         return (count++) + '. ' + liContent + '\n';
        //     });
        //     return liMarkdown + '\n';
        // });

        // ul, ol, li
        htmlContent = htmlContent
            .replace(/<ul>|<ol>/g, '')
            .replace(/<li>/g, '- ')
            .replace(/<\/li>/g, '\n')
            .replace(/<\/ul>|<\/ol>/g, '')
        ;

        // table
        htmlContent = htmlContent.replace(/<table>([\s\S]*?)<\/table>/gi, function( _, tableContent ) {
            var rows = tableContent.match(/<tr>([\s\S]*?)<\/tr>/gi) || [];
            var markdown = '';
            rows.forEach(( row, rowIndex ) => {
                // header
                var headers = row.match(/<th>([\s\S]*?)<\/th>/gi);
                if ( headers ) {
                    headers = headers.map(h => h.replace(/<th>([\s\S]*?)<\/th>/i, '$1').trim());
                    markdown += '| ' + headers.join(' | ') + ' |\n';
                    markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
                    // body
                } else {
                    var cells = row.match(/<td>([\s\S]*?)<\/td>/gi) || [];
                    cells = cells.map(c => c.replace(/<td>([\s\S]*?)<\/td>/i, '$1').trim());
                    markdown += '| ' + cells.join(' | ') + ' |\n';
                }
            });
            return markdown + '\n';
        });

        // 기타
        if ( typeof jQuery !== 'undefined' ) {
            var $wrapper = $('<div>').html(htmlContent);

            // 출처
            var counter = 1;
            $wrapper.find('.source').each(function() {
                var $sourceDiv = $(this);
                var markdown = '';
                $sourceDiv.find('.source-button').each(function() {
                    var $btn = $(this);
                    var text = $btn.text().trim();
                    var url = $btn.attr('data-url');
                    // 1개일 때
                    if ( url ) {
                        markdown += '\n' + '[source] ' + text + ': ' + url + '\n';
                        // 2개 이상일 때
                    } else {
                        $sourceDiv.find('.source-link').each(function() {
                            var linkText = $(this).text().trim();
                            var linkUrl = $(this).attr('data-url');
                            markdown += '\n' + '[source ' + (counter++) + '] ' + linkText + ': ' + linkUrl + '\n';
                        });
                    }
                });
                $sourceDiv.replaceWith(markdown);
            });

            // (block code)pre
            $wrapper.find('pre').each(function () {
                var $pre = $(this);
                var $code = $pre.find('code');
                let codeText = $code.length ? $code.text() : $pre.text();
                let language = '';
                // 블럭일 경우
                if ($code.length) {
                    const className = $code.attr('class') || '';
                    const match = className.match(/language-([a-zA-Z0-9]+)/);
                    if (match) language = match[1];
                }
                // 인라인일 경우
                let markdown = '';
                if (language) markdown += '%%RIGHT%%' + language + '\n';
                markdown += codeText.trim() + '\n';

                $pre.replaceWith(markdown);
            });

            // KaTeX
            $wrapper.find('.math').each(function () {
                const $el = $(this);

                // ✅ annotation(x-tex) 우선 사용
                const tex = $el.find('annotation[encoding="application/x-tex"]').first().text().trim();

                let formatted = '';

                if (tex) {
                    // LaTeX → 사람이 읽는 형태로 정규화
                    const normalized = tex.replace(/\\times/g, '×');

                    formatted = `{ ${normalized} }`;
                } else {
                    // fallback (KaTeX가 아닌 경우)
                    formatted = `{ ${$el.text().trim()} }`;
                }

                $el.replaceWith(formatted);
            });
            htmlContent = $wrapper.html();
        }

        // [추가] 변환되지 않고 남은 모든 HTML 태그 강제 제거 (텍스트만 남김)
        // 단, 위에서 줄바꿈 처리를 위해 사용한 특수문자나 구조는 유지해야 함
        htmlContent = htmlContent.replace(/<[^>]*>?/gm, '');

        // 줄바꿈 초기화
        htmlContent = htmlContent.replace(/\n{2,}/g, '\n');

        // br
        htmlContent = htmlContent.replace(/<br\s*\/?>/gi, '\n\n');

        // hr
        htmlContent = htmlContent.replace(/<hr\s*\/?>/gi, '\n\n--------------------------------------------------\n\n');

        // HTML entity
        htmlContent = htmlContent.replace(/%%LEFT%%/g, '<').replace(/%%RIGHT%%/g, '>');

        return htmlContent.trim();
    },

    //붙여넣기
    enableCustomPaste : function(selector) {
        var $textarea = $(selector);

        if ($textarea.length === 0) {
            xui.util.warn(`❗ Selector "${selector}"에 해당하는 요소가 없습니다.`);
            return;
        }

        $textarea.on("paste", function(event) {
            event.stopImmediatePropagation(); //다른 paste 핸들러까지 전부 차단 디버깅 지옥 😱
//            event.preventDefault();//이미지일 때만 preventDefault 해야 함

            var clipboardData = event.originalEvent.clipboardData || window.clipboardData;
            if (!clipboardData || !clipboardData.items) return;


            // 이미지 붙여넣기 처리
            var items = clipboardData.items;
            var imageHandled = false;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                if (item.kind === "file" && item.type.indexOf("image") !== -1) {
                    event.preventDefault(); // 이미지일 때만 기본 동작 차단
                    imageHandled = true;
                    var blob = item.getAsFile();
                    if (!blob) continue;

                    var file = new File(
                        [blob],
                        "clipboard_" + Date.now() + ".png",
                        { type: blob.type }
                    );

                    xui.util.log("📸 이미지 붙여넣기:", file.name, file.size);
                    aichat010.handleFiles([file]); // 배열로 전달 권장

                    return;
                }
            }

//            // 텍스트 붙여넣기 처리
//            var pastedText = clipboardData.getData("text").trim();
//            // 커서 위치에 붙여넣기 (undo 가능)
//            document.execCommand("insertText", false, pastedText);
            // 텍스트 처리 (textarea 안전 방식)
            var pastedText = clipboardData.getData("text");
            if (!pastedText) return;

            event.preventDefault();
            event.stopPropagation(); // 이게 핵심

            var textarea = this;
            textarea.focus(); // selection 튀는 거 방지

            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;

            textarea.value =
                textarea.value.substring(0, start) +
                pastedText +
                textarea.value.substring(end);

            textarea.selectionStart = textarea.selectionEnd =
                start + pastedText.length;

            $(".user-field").toggleClass("--empty", false);

        });

    },
    // ========================================================

    // 사용법 안내 모달
    initHowToUseModal : function(e) {
        e.preventDefault();

        var $modal = $('#howToUseModal');
        var $content = $modal.find('.modal-content');
        var $openBtn = $('#how_to_use');

        if ($modal.hasClass('show')) {
            $modal.removeClass('show').fadeOut(100);
        } else {
            $modal.fadeIn(100, function() {
                $modal.addClass('show');
            });
        }

        $('body').on('click', function(e) {
            if ($(e.target).closest('.modal-content').length) return;
            if ($modal.hasClass('show')) {
                $modal.removeClass('show').fadeOut(100);
            }
        });
    },

    // 로딩바
    setLoading : function(){
        var message = xui.message.get("aisearch010.GENERATING_RESPONSE");

        aichat010.appendMessage("", "" + "<div class='chat --a --empty'><div class='skeleton-message'></div><div class='bubble'></div></div>", "waiting");[]
        var $skeletonMessage = $(".skeleton-message");
        let index = 0;

        $skeletonMessage.removeClass("--active");

        setTimeout(() => {
            $skeletonMessage.text(message);
            $skeletonMessage.addClass("--active");
            index = (index + 1) % message.length;
        }, 1200);

    },

    // 출처 갯수
    renderSourceLinksCount : function(dataArray) {
        var count = '';
        if (Array.isArray(dataArray)) {
            count = dataArray.length;
        }else {
            count = '';
        }
        return count;
    },
    // 출처
    renderSourceLinks : function(dataArray, searchKey) {
//        xui.util.log(dataArray);

        // 결과 HTML을 담을 변수
        var htmlOutput = '';
        // 각 항목을 순회하며 HTML 생성
        dataArray.forEach(item => {
            var url = item.url;
            var display = item.display_title;
            var title = item.source_title;
            htmlOutput += '<div class="source-link" data-url="' + url + '" xui-tooltip-title="'+url+ '" tabIndex="0">' + display + ' - ' + title + '</div>\n';
        });

        var returnHtml = '<div id="sourceModal'+searchKey+'" class="source-modal --left --up">'
            + '  <div class="source-list" data-role="modal-content">'
            + htmlOutput
            + '  </div>'
            + '</div>';

        return returnHtml;

        // 예: 특정 요소에 삽입하려면 아래처럼 사용
        // $('#your-container').html(htmlOutput);
    },

    //katex 변환
    wrapMathBlocks : function(data) {
        var content = data;
        // 0) 보호: 이스케이프된 \$ 는 수식 구분에 사용되지 않도록 임시 토큰으로 치환
        content = content.replace(/\\\$/g, '__ESCAPED_DOLLAR__');

        // 1) $$ ... $$ (블록, 여러 줄 허용) — dotAll(s) 사용
        content = content.replace(/\$\$([\s\S]+?)\$\$/gs, (_, p1) => {
            return `<div class="math">$$${p1}$$</div>`;
        });

        // 2) 단일 $...$ 가운데 \begin{...} ... \end{...} 포함하면 블록으로 처리
        // (?<!\$) 와 (?!\$) 로 $$ 와 겹치지 않게 보장
        content = content.replace(/(?<!\$)\$([\s\S]*?\\begin\{[a-zA-Z*\-]+\}[\s\S]*?\\end\{[a-zA-Z*\-]+\})\$(?!\$)/gs, (_, p1) => {
            return `<div class="math">$${p1}$</div>`;
        });

        // 3) 달러 없이 직접 오는 \begin{ENV} ... \end{ENV} 블록 처리
        //    실제로 스트리밍에서 이런 케이스가 자주 발생함
//        content = content.replace(/\\begin\{([a-zA-Z*\-]+)\}[\s\S]*?\\end\{\1\}/gs,match => `<div class="math">${match}</div>`);

        // 3) 일반 인라인 단일 $...$ — $$ 와 겹치지 않게 (앞뒤에 추가 $가 없는 경우만)
        content = content.replace(/(?<!\$)\$([^\$]+?)\$(?!\$)/g, (_, p1) => {
            return `<span class="math">$${p1}$</span>`;
        });

        // 4) 원래 이스케이프된 \$ 복구
        content = content.replace(/__ESCAPED_DOLLAR__/g, '\\$');

//        content = content.replace(/\$(.+?)\$/g, (_, p1) => {
//            if (p1.includes('\\begin{cases}') || p1.includes('\\end{cases}') || p1.includes('\\begin{pmatrix}')) {
//                console.log("pass >> " +p1);
//                return `$${p1}$`; // 이미 처리됨
//            }
//            return `<span class="math">$${p1}$</span>`;
//        });

        return content;
    },

    //수식 블록 상태 추적
    processMathChunk: function (chunkText) {
        var trimmed = chunkText.trim();

        // ==============================
        // 1) $$ ... $$ 블록 토글
        // ==============================
        if (trimmed === "$$") {
            if (!isMathBlock) {
                // 블록 시작
                isMathBlock = true;
                currentEnv = "$$";
                mathBuffer = [];
            } else {
                // 블록 종료
                isMathBlock = false;
                const mathContent = mathBuffer.join("\n");
                finalOutput.push(`<div class="math">$$${mathContent}$$</div>`);
                mathBuffer = [];
                currentEnv = null;
            }
            return;
        }

        // 블록 내부 계속 쌓기
        if (isMathBlock && currentEnv === "$$") {
            mathBuffer.push(chunkText);
            return;
        }

        // ==============================
        // 2) \begin{xxx} 블록 시작 감지
        // ==============================
        if (!isMathBlock) {
            const beginMatch = chunkText.match(/\\begin\{([a-zA-Z*]+)\}/);
            if (beginMatch) {
                isMathBlock = true;
                currentEnv = beginMatch[1];
                mathBuffer = [chunkText];
                return;
            }
        }

        // ==============================
        // 3) \end{xxx} 블록 종료
        // ==============================
        if (isMathBlock && currentEnv !== "$$") {
            mathBuffer.push(chunkText);

            const endPattern = new RegExp(`\\\\end\\{${currentEnv}\\}`);
            if (endPattern.test(chunkText)) {
                const mathContent = mathBuffer.join("\n");
                finalOutput.push(`<div class="math">${mathContent}</div>`);
                isMathBlock = false;
                currentEnv = null;
                mathBuffer = [];
            }
            return;
        }

        // ==============================
        // 4) inline math 처리
        // ==============================
        let processed = chunkText;

        // \$ 보호
        processed = processed.replace(/\\\$/g, "__ESCAPED_DOLLAR__");

        // $...$ 인라인 수식 (앞뒤에 $$ 없음)
        processed = processed.replace(/(?<!\$)\$([^$]+?)\$(?!\$)/g, (_, p1) => {
            return `<span class="math">$${p1}$</span>`;
        });

        // 보호한 \$ 복원
        processed = processed.replace(/__ESCAPED_DOLLAR__/g, "\\$");

        // 일반 텍스트 push
        finalOutput.push(processed);
    },



// ========================================================
// stream 용
// ========================================================
    //요청한 결과를 화면에 로드
    loadMsgStream : function(searchKey, data){
        $("#waiting").remove();            //진행중 메시지 삭제 후 처리

        //답변에 ID설정
        var answerIdText = "";
        if(!xui.valid.isEmpty(searchKey)){answerIdText = 'id="' + searchKey + '"';}

        var answerHtml   = '<div class="chat --a" ' + answerIdText + '>'
            + '    <div class="bubble">'
            + data
            + '	</div>'
            + '</div>';

        $("#box").append(answerHtml);

        //최하단으로 이동
        $(".container").scrollTop($(".container")[0].scrollHeight);
    },

    //요청한 결과를 화면에 로드
    loadFindContentsStream : function(lineNo, searchKey, data, opts){
        opts = opts || {};
        $("#waiting").remove();			//진행중 메시지 삭제 후 처리

        //첫번째 줄이 도착하면 처리중을 박스를 없애고 새로운 대화상자를 생성한다.
        if (lineNo === 1) {
            $("#waiting").remove();

            var answerIdText = "";
            if (!xui.valid.isEmpty(searchKey)) {
                answerIdText = 'id="ans' + searchKey + '"';
            }

            var bubbleClass = opts.bubbleBlock ? "bubble --block" : "bubble";

            var answerHtml = '<div class="chat --a" id="' + searchKey + '">'
                + '    <div class="' + bubbleClass + '" ' + answerIdText + '>'
                + '    </div>'
                + '</div>';
            $("#box").append(answerHtml);

            markdownMap[searchKey] = ""; // 초기화
        }

        if (opts.bubbleBlock && searchKey && !xui.valid.isEmpty(searchKey)) {
            var $bubble = $("#ans" + searchKey);
            if ($bubble.length) {
                $bubble.addClass("--block");
            }
        }

        marked.setOptions({
            gfm: true,
            breaks: true, // 줄바꿈을 <br>로 처리해줘서 <p> 태그 남용을 약간 줄여줌
            headerIds: false,
            mangle: false,
            sanitize: false
        });

        // data 안에 Markdown + HTML이 섞여 있는 경우
        try {
            markdownMap[searchKey] = data; // 누적
            var html = marked.parse(markdownMap[searchKey]);
            $("#ans" + searchKey).html(html);
        } catch (err) {
            console.error("Markdown parse error:", err);
            // 오류 방지를 위해 fallback 처리
            $("#ans" + searchKey).text(markdownMap[searchKey]);
        }

        // 스트리밍 중에는 스크롤하지 않음 (done 이벤트에서만 스크롤)
        // 사용자가 편하게 스트리밍 내용을 읽을 수 있도록 함
    },

    //요청한 결과를 화면에 로드
    loadFindContentsRef : function(data, searchKey){
        var regex = /^\(\[([^\]]+)\]\(([^)]+)\)\)/;
        var match = markdownText.match(regex);
        var domain = '';
        var url = '';
        if (match) {
            domain = match[1]; // $1: 링크 텍스트
            url = match[2];  // $2: 링크 URL
        }

        xui.util.log("URL:", url);
        xui.util.log("Domain:", domain);

        // data-url="' + url + '" xui-tooltip-title="'+url+'">'

        var refHtml   = '<div class="source" data-id="' + searchKey + '" data-url="'+ url +'">'
            + '    <div class="source-button"  data-role="modal-opener" data-target="sourceModal" data-url="' + url + '" xui-tooltip-title="'+url+'" tabIndex="0">'
            + domain
            + '	<div class="source-num">'
            + aichat010.renderSourceLinksCount(data)
            + '    </div></div>'
            + '</div>';

        return refHtml;
    },

//    checkText : function(data, searchKey) {
//        // 마크다운 링크 패턴 확인용 정규식
//        var markdownLinkPattern = /\[[^\]]+\]\((https?:\/\/[^\)]+)\)/;
//
//        if (markdownLinkPattern.test(data)) {
//            return aichat010.loadFindContentsRef(data, searchKey);
//        }else{
//            return data;
//        }
//    },

// ========================================================




// ========================================================
//  파일 업로드 관련 함수들
// ========================================================
    // 파일 업로드 이벤트 초기화 (드래그 앤 드롭, 파일 선택, 버튼 클릭)
    initFileUploadEvents: function() {
        var fileInput = $('#fileInput');
        var inputArea = $('#inputArea');
        // 더 넓은 영역에 드래그 앤 드롭 적용 (UX 개선)
        var userInterface = $('.user-interface');
        var userField = $('.user-field');

        // 기존 이벤트 제거 (중복 등록 방지) - 네임스페이스 사용
        inputArea.off('dragover.fileupload dragleave.fileupload drop.fileupload');
        userInterface.off('dragover.fileupload dragleave.fileupload drop.fileupload');
        userField.off('dragover.fileupload dragleave.fileupload drop.fileupload');
        fileInput.off('change.fileupload');
        $('#ico_0341_attachment').off('click.fileupload');
        $('#hicloud_add').off('click.fileupload');
        $('#ico_0060_send').off('click.fileupload');

        // 드래그 앤 드롭 핸들러 함수 (재사용)
        var dragOverCounter = 0;

        var handleDragOver = function(e) {
            e.preventDefault();
            e.stopPropagation();
            dragOverCounter++;
            userInterface.addClass('drag-over');
            userField.addClass('drag-over');
        };

        var handleDragLeave = function(e) {
            e.preventDefault();
            e.stopPropagation();
            dragOverCounter--;
            // dragOverCounter가 0이 되었을 때만 클래스 제거 (자식 요소로 이동 시 방지)
            if (dragOverCounter <= 0) {
                dragOverCounter = 0;
                userInterface.removeClass('drag-over');
                userField.removeClass('drag-over');
            }
        };

        var handleDrop = function(e) {
            e.preventDefault();
            e.stopPropagation();
            dragOverCounter = 0;
            userInterface.removeClass('drag-over');
            userField.removeClass('drag-over');

            // 드롭된 파일 목록 추출 및 처리
            var files = e.originalEvent.dataTransfer.files;
            if (files && files.length > 0) {
                xui.util.log('드래그 앤 드롭 파일 추가:', files.length, '개');
                aichat010.handleFiles(files);
            }
        };

        // user-interface 전체 영역에 드래그 앤 드롭 이벤트 (넓은 영역)
        userInterface.on('dragover.fileupload', handleDragOver);
        userInterface.on('dragleave.fileupload', handleDragLeave);
        userInterface.on('drop.fileupload', handleDrop);

        // user-field 영역에도 드래그 앤 드롭 이벤트 (입력 영역)
        userField.on('dragover.fileupload', handleDragOver);
        userField.on('dragleave.fileupload', handleDragLeave);
        userField.on('drop.fileupload', handleDrop);

        // inputArea에도 드래그 앤 드롭 이벤트 (텍스트 입력 영역)
        inputArea.on('dragover.fileupload', handleDragOver);
        inputArea.on('dragleave.fileupload', handleDragLeave);
        inputArea.on('drop.fileupload', handleDrop);

        // 파일 추가 버튼 클릭 이벤트 (네임스페이스 사용)
        $('#ico_0341_attachment').on('click.fileupload', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        });

        // HiCloud 파일 추가 버튼 (실제 UI) (네임스페이스 사용)
        $('#hicloud_add').on('click.fileupload', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // mobjCategory가 'web_search'일 경우 팝업 차단 및 경고 메시지 출력
            if (mobjCategory === 'web_search') {
//                alert('이 기능은 현재 페이지에서 사용할 수 없습니다.');
//                xui.dialog.warning("", '이 기능은 현재 페이지에서 사용할 수 없습니다.'); //HICLOUD_ATTACH_BLOCKED
                var errorMsg = "HICLOUD_ATTACH_BLOCKED";
                xui.dialog.warning( aichat010.enum.HICLOUD_ATTACH_BLOCKED.getName(),errorMsg);
                return;
            }
            // 테스트: 하드코딩된 응답 사용
           // aichat010.testHiCloudResponse();
            // 실제: 팝업 열기
            aichat010.popupHiCloudAttach();
        });

        // 파일 입력 변경 시 (파일 선택 다이얼로그에서 선택한 파일 처리)
        fileInput.on('change.fileupload', function(e) {
            aichat010.handleFiles(this.files);
            // 파일 선택 후 input 값 초기화 (같은 파일 재선택 가능하도록)
            $(this).val('');
        });

        // 전송 버튼 클릭 이벤트 (네임스페이스 사용)
        $('#ico_0060_send').on('click.fileupload', function(e) {
            e.preventDefault();
            e.stopPropagation();
            aichat010.searchAiBot();
        });
    },

    // 파일 처리 (드래그 앤 드롭 또는 파일 선택으로 추가된 파일들 검증 및 등록)
    handleFiles: function(files) {
        if (!files || files.length === 0) return;

        // 파일 개수 제한 검증 (최대 개수 초과 시 경고)
        var countValidation = aichat010.validateFileCount(attachedFiles.length, files.length, true);
        if (!countValidation.valid) {
            return;
        }

        // 각 파일을 순회하며 검증 및 등록
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // 파일 유효성 검사 (확장자, MIME 타입, 크기)
            var validation = aichat010.validateFile(file, { checkMimeType: true, showDialog: true });
            if (!validation.valid) {
                continue;
            }

            // 파일 정보 객체 생성 후 attachedFiles에 추가 및 UI에 표시
            var fileInfo = aichat010._createFileInfo(file);
            attachedFiles.push(fileInfo);
            aichat010.addToFileDisplayArea(fileInfo);
        }

        // 파일 목록 표시 영역 슬라이드 다운
        if (attachedFiles.length > 0) {
            $('#attachedFiles').slideDown(200);
        }
    },

    /**
     * 파일 정보 객체 생성 헬퍼 함수
     * @param {File} file - File 객체
     * @param {string} source - 파일 출처 ('local' 또는 'hicloud')
     * @returns {Object} 파일 정보 객체
     */
    /**
     * 목록/미리보기에 표시할 파일명 (서버 업로드 후 name 이 uuid/파일명 형태일 때는 basename만)
     */
    _displayFileName: function(fileInfo) {
        if (!fileInfo) return '';
        var n = fileInfo.originalFilename || fileInfo.originalName || fileInfo.name || '';
        if (n.indexOf('/') >= 0) {
            n = n.split('/').pop();
        }
        if (n.indexOf('\\') >= 0) {
            n = n.split('\\').pop();
        }
        return n;
    },

    _createFileInfo: function(file, source) {
        return {
            id: 'file-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
            source: source || 'local',
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            extension: aichat010.getFileExtension(file.name),
            cloudFileId: null,
            cloudDownloadUrl: null
        };
    },

    /**
     * 파일 유효성 검사
     * @param {File|Object} file - File 객체
     * @param {Object} options - 검증 옵션 { checkMimeType: boolean, showDialog: boolean }
     * @returns {Object} { valid: boolean, error: string|null }
     */
    validateFile: function(file, options) {
        options = options || {};
        var checkMimeType = options.checkMimeType !== false; // 기본값 true
        var showDialog = options.showDialog !== false; // 기본값 true

        if (!file || !file.name) {
            return { valid: false, error: aichat010.enum.FILE_NOT_FOUND.getName() };
        }

        var fileName = file.name;
        var fileSize = file.size || 0;
        var fileType = file.type || '';

        // 1. 확장자 검사
        var fileExtension = aichat010.getFileExtension(fileName);
        var isAllowedExtension = FILE_VALIDATION.ALLOWED_EXTENSIONS.indexOf(fileExtension) !== -1;

        // 2. MIME 타입 검사 (옵션)
        var isAllowedType = false;
        if (checkMimeType && fileType) {
            isAllowedType = FILE_VALIDATION.ALLOWED_TYPES.indexOf(fileType) !== -1;
        }

        // 3. 확장자 또는 MIME 타입 중 하나라도 허용되면 통과
        if (!isAllowedExtension && !isAllowedType) {
            var errorMsg = aichat010.enum.INVALID_FILE_TYPE_DETAIL.getName() + "<br>파일명: " + fileName;
            if (showDialog) {
                xui.dialog.warning(errorMsg, aichat010.enum.INVALID_FILE_TYPE.getName());
            }
            return { valid: false, error: aichat010.enum.INVALID_FILE_TYPE.getName() };
        }

        // 4. 파일 크기 검사
        if (fileSize > FILE_VALIDATION.MAX_SIZE) {
            var sizeErrorMsg = aichat010.enum.EXCEED_FILE_SIZE_DETAIL.getName() + "<br>업로드 시도: " + fileName;
            if (showDialog) {
                xui.dialog.warning(sizeErrorMsg, aichat010.enum.EXCEED_FILE_SIZE.getName());
            }
            return { valid: false, error: aichat010.enum.EXCEED_FILE_SIZE.getName() };
        }

        return { valid: true, error: null };
    },

    /**
     * 파일 개수 제한 검증
     * @param {number} currentCount - 현재 첨부된 파일 개수
     * @param {number} additionalCount - 추가하려는 파일 개수
     * @param {boolean} showDialog - 다이얼로그 표시 여부
     * @returns {Object} { valid: boolean, error: string|null }
     */
    validateFileCount: function(currentCount, additionalCount, showDialog) {
        showDialog = showDialog !== false; // 기본값 true

        if (currentCount + additionalCount > FILE_VALIDATION.MAX_COUNT) {
            if (showDialog) {
                xui.dialog.warning("", aichat010.enum.EXCEED_FILE_COUNT.getName());
            }
            return { valid: false, error: aichat010.enum.EXCEED_FILE_COUNT.getName() };
        }
        return { valid: true, error: null };
    },

    /**
     * 파일 테이블에 파일 정보 추가
     * 로컬 파일과 HiCloud 파일을 모두 표시
     */
    addToFileDisplayArea: function(fileInfo) {
        if ($("#fileDisplayArea").length === 0) return;

        var row = aichat010._createFileRow(fileInfo);
        $("#fileDisplayArea").append(row);
        aichat010.setPlaceholder('file');

        // 파일 영역 표시
        $('#fileDisplayArea').addClass("--active");
        aichat010.toggleExclusiveButton();
    },

    // 파일 행(row) 생성
    _createFileRow: function(fileInfo) {
        var sourceClass = fileInfo.source === 'local' ? 'local-file' : 'hicloud-file';
        var row = $('<div class="file-item file-row ' + sourceClass + '" data-file-id="' + fileInfo.id + '" data-file-source="' + fileInfo.source + '">');

        // 미리보기 추가
        var previewDiv = aichat010._createFilePreview(fileInfo);
        row.append(previewDiv);

        // 파일명 추가
        row.append('<div class="file-name">' + (aichat010._displayFileName(fileInfo) || '') + '</div>');

        // 삭제 버튼 추가
        var deleteBtn = aichat010._createDeleteButton(fileInfo.id);
        row.append(deleteBtn);

        return row;
    },

    // 파일 미리보기 요소 생성
    _createFilePreview: function(fileInfo) {
        var extension = fileInfo.extension || '';
        var isImage = aichat010.isImageFile(fileInfo);
        var previewDiv = $('<div class="file-preview --' + extension.replace(/^\./, "") + (isImage ? ' --y' : '') + '"></div>');

        if (isImage) {
            if (fileInfo.file instanceof File) {
                // 로컬 파일: FileReader로 읽기
                aichat010._loadLocalImagePreview(fileInfo, previewDiv);
            } else if (fileInfo.cloudDownloadUrl) {
                // HiCloud 파일: URL 사용
                aichat010._loadCloudImagePreview(fileInfo, previewDiv);
            }
        }

        return previewDiv;
    },

    // 로컬 이미지 미리보기 로드
    _loadLocalImagePreview: function(fileInfo, previewDiv) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = $('<img style="display: block; width: 100%; height: 100%; object-fit: cover;" ' +
                'src="' + e.target.result + '" alt="' + (fileInfo.name || '') + '">');
            previewDiv.empty().append(img);
        };
        reader.onerror = function() {
            console.error('이미지 미리보기 로드 실패:', fileInfo.name);
        };
        reader.readAsDataURL(fileInfo.file);
    },

    // 클라우드 이미지 미리보기 로드
    _loadCloudImagePreview: function(fileInfo, previewDiv) {
        var img = $('<img style="display: block; width: 100%; height: 100%; object-fit: cover;" ' +
            'src="' + fileInfo.cloudDownloadUrl + '" alt="' + (fileInfo.name || '') + '">');
        previewDiv.empty().append(img);
    },

    // 삭제 버튼 생성
    _createDeleteButton: function(fileId) {
        var deleteBtn = $('<div class="file-delete"></div>');
        deleteBtn.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            aichat010.removeFromFileDisplayArea(fileId);
        });
        return deleteBtn;
    },

    // 파일 삭제 (X 버튼 클릭 시)
    removeFromFileDisplayArea: function(fileId) {
        // 배열에서 파일 제거
        attachedFiles = attachedFiles.filter(function(file) {
            return file.id !== fileId;
        });

        // DOM에서 제거
        $('#fileDisplayArea [data-file-id="' + fileId + '"]').remove();

        // 파일 영역 상태 업데이트
        aichat010._updateFileDisplayAreaState();
    },

    // 파일 영역 상태 업데이트
    _updateFileDisplayAreaState: function() {
        var hasFiles = $('#fileDisplayArea [data-file-id]').length > 0;

        if (!hasFiles) {
            $('#fileDisplayArea').removeClass("--active");
            aichat010.toggleExclusiveButton();
        }

        // 파일이 없으면 파일 목록 영역 숨김
        if (attachedFiles.length === 0) {
            $('#attachedFiles').hide();
            // 채팅 타입 테마 및 placeholder 업데이트
            aichat010.updateChatTypeAndPlaceholder(mobjCategory);
        }
    },

    /**
     * 파일명에서 확장자 추출
     * @param fileName 파일명
     * @return 확장자 (점 포함, 소문자) 예: '.pdf', '.jpg'
     */
    getFileExtension: function(fileName) {
        if (!fileName) return '';
        var lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1) return '';
        return fileName.substring(lastDotIndex).toLowerCase();
    },

    // 파일 메시지 HTML 생성
    buildFileMessageHtml: function(fileInfo) {
        if (!fileInfo) return '';

        // 원본 파일명 우선 사용 (UUID 경로가 아닌 실제 파일명)
        // 우선순위: originalFilename > originalName > (filename이 UUID 경로가 아닌 경우 filename) > (name이 UUID 경로가 아닌 경우 name)
        var name = fileInfo.originalFilename || fileInfo.originalName || '';

        // filename이 UUID 경로 형식이 아닌 경우에만 사용
        if (!name && fileInfo.filename) {
            if (fileInfo.filename.indexOf('/') === -1) {
                name = fileInfo.filename;
            }
        }

        // name이 UUID 경로 형식이 아닌 경우에만 사용
        if (!name && fileInfo.name) {
            if (fileInfo.name.indexOf('/') === -1) {
                name = fileInfo.name;
            }
        }

        // 모든 경우에 실패하면 빈 문자열
        if (!name) {
            name = '';
        }

        var typeHint = fileInfo.extension || fileInfo.file_type || fileInfo.type || '';
        var normalizedType = aichat010.normalizeFileType(typeHint);
        var isImage = aichat010.isImageFile(fileInfo);

        if (isImage) {
            return aichat010._buildImageFileHtml(fileInfo, name, normalizedType);
        } else {
            return aichat010._buildDefaultFileHtml(name, normalizedType);
        }
    },

    // 이미지 파일 HTML 생성
    _buildImageFileHtml: function(fileInfo, name, normalizedType) {
        var imageUrl = aichat010._getThumbnailUrl(fileInfo);
        var fileId = 'file-img-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);

        if (imageUrl) {
            var html = '<div class="file --' + normalizedType + '" id="' + fileId + '" '
                + 'style="background-image: url(\'' + imageUrl + '\'); background-size: cover; '
                + 'background-position: center; background-repeat: no-repeat; overflow: hidden; position: relative;">'
                + '</div>'
                + '<div class="name">' + name + '</div>'
                + '<div class="data">' + normalizedType + '</div>';

            // 배경 이미지 아이콘 숨기기
            aichat010._hideFileIconStyle(fileId);
            return html;
        } else {
            return aichat010._buildDefaultFileHtml(name, normalizedType);
        }
    },

    // 기본 파일 HTML 생성
    _buildDefaultFileHtml: function(name, normalizedType) {
        return '<div class="file --' + normalizedType + '"></div>'
            + '<div class="name">' + name + '</div>'
            + '<div class="data">' + normalizedType + '</div>';
    },

    /**
     * 썸네일 URL 가져오기
     * 우선순위: thumbnailBase64 > localStorage > thumbnailUrl > url
     * @private
     */
    _getThumbnailUrl: function(fileInfo) {
        // 1. 서버에서 전달받은 thumbnail_image (selectMessages에서 조회한 이미지) 우선
        if (fileInfo.thumbnail_image) {
            return 'data:image/png;base64,' + fileInfo.thumbnail_image;
        }

        // 2. Base64 썸네일
        if (fileInfo.thumbnailBase64) {
            return 'data:image/png;base64,' + fileInfo.thumbnailBase64;
        }

        // 3. localStorage에서 검색 - aichatThumbnailStorage.js 모듈 사용
        // 필요시 아래 주석을 해제하여 사용하세요
        // if (typeof AichatThumbnailStorage !== 'undefined') {
        //     var storedThumbnail = AichatThumbnailStorage.getThumbnailFromStorage(fileInfo);
        //     if (storedThumbnail) {
        //         return 'data:image/png;base64,' + storedThumbnail;
        //     }
        // }

        // 4. URL 필드에서 가져오기
        var imageUrl = fileInfo.thumbnailUrl || fileInfo.thumbnail ||
            fileInfo.url || fileInfo.fileUrl ||
            fileInfo.localFilePath || fileInfo.filePath;

        if (imageUrl) {
            return aichat010._normalizeImageUrl(imageUrl);
        }

        return null;
    },

    // localStorage 관련 함수들은 aichatThumbnailStorage.js 모듈로 분리됨
    // 필요시 AichatThumbnailStorage 모듈을 사용하세요

    // 이미지 URL 정규화 (상대경로 → 절대경로)
    _normalizeImageUrl: function(url) {
        if (!url) return null;

        // 이미 절대 경로이거나 data URL인 경우
        if (url.indexOf('http') === 0 || url.indexOf('data:') === 0) {
            return url;
        }

        // 절대 경로인 경우
        if (url.indexOf('/') === 0) {
            return url;
        }

        // 상대 경로인 경우 서버 경로 추가
        return '/xs/aichat/' + url;
    },

    // 파일 아이콘 스타일 숨기기
    _hideFileIconStyle: function(fileId) {
        setTimeout(function() {
            if ($('#' + fileId).length && !$('#file-image-thumbnail-style').length) {
                $('head').append(
                    '<style id="file-image-thumbnail-style">' +
                    '.chat .file[style*="background-image"]:before { display: none !important; }' +
                    '</style>'
                );
            }
        }, 0);
    },

    // 파일이 이미지인지 확인
    isImageFile: function(fileInfo) {
        if (!fileInfo) return false;

        var extension = (fileInfo.extension || '').toLowerCase();
        var type = (fileInfo.mime_type || '').toLowerCase();

        // 확장자로 확인
        var imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        if (imageExtensions.indexOf(extension) !== -1) {
            return true;
        }

        // MIME 타입으로 확인
        if (type.indexOf('image/') === 0) {
            return true;
        }

        return false;
    },

    normalizeFileType: function(type) {
        if (!type) return 'file';

        var normalized = String(type).trim();
        if (normalized.indexOf('/') > -1) {
            normalized = normalized.split('/').pop();
        }
        if (normalized.charAt(0) === '.') {
            normalized = normalized.substring(1);
        }

        return normalized || 'file';
    },

    /**
     * HiCloud 파일을 서버에 다운로드
     * @param {Array} cloudFileInfos - HiCloud 파일 정보 배열
     * @returns {Promise} 서버에 저장된 파일 정보
     */
    prepareCloudFiles: function(cloudFileInfos) {
        return new Promise(function(resolve, reject) {
            if (!cloudFileInfos || cloudFileInfos.length === 0) {
                resolve([]);
                return;
            }

            // 파일 검증 및 변환
            var result = aichat010._validateAndConvertCloudFiles(cloudFileInfos);
            if (!result.valid) {
                return;
            }

            // 서버에 파일 다운로드 요청
            aichat010._requestCloudFileDownload(result.files, resolve, reject);
        });
    },

    // HiCloud 파일 검증 및 변환 (확장자 검증 후 서버 다운로드용 정보 구성)
    _validateAndConvertCloudFiles: function(cloudFileInfos) {
        var hiCloudFileInfos = [];

        for (var i = 0; i < cloudFileInfos.length; i++) {
            var element = cloudFileInfos[i];
            var fileExtension = aichat010.getFileExtension(element.fileName);

            // 허용된 확장자인지 검증
            if (FILE_VALIDATION.ALLOWED_EXTENSIONS.indexOf(fileExtension) === -1) {
                var errorMsg = aichat010.enum.INVALID_FILE_TYPE_DETAIL.getName() +
                    "<br>파일명: " + element.fileName;
                xui.dialog.warning(errorMsg, aichat010.enum.INVALID_FILE_TYPE.getName());
                return { valid: false };
            }

            // 도메인에 따른 HiCloud URL 스킴 변환
            var downLoadUrl = element.downLoadUrl;
            try {
                var hostName = window.location && window.location.hostname;
                if (hostName &&
                    hostName.indexOf(host.dev) === 0 &&
                    typeof downLoadUrl === 'string') {
                    // dev 환경에서는 https -> http 로만 교체
                    downLoadUrl = downLoadUrl.replace(/^https:\/\//i, 'http://');
                }
            } catch (e) {
                // window 객체 접근 실패 등은 무시하고 원본 URL 사용
            }

            // 서버 다운로드 요청용 파일 정보 구성
            hiCloudFileInfos.push({
                fileId: element.fileId,
                fileName: element.fileName,
                downLoadUrl: downLoadUrl,
                fileSize: parseInt(element.fileSize) || 0
            });
        }

        return { valid: true, files: hiCloudFileInfos };
    },

    // 서버에 클라우드 파일 다운로드 요청 (HiCloud에서 서버로 파일 다운로드)
    _requestCloudFileDownload: function(hiCloudFileInfos, resolve, reject) {
        aichat010.requestApi("/xs/aichat/v2/cloudAttach", {
            method: "POST",
            body: { hiCloudFileInfos: hiCloudFileInfos }
        }).then(function(response) {
            if (response.getErrorFlag()) {
                xui.dialog.warning(
                    response.getMsg() || "",
                    aichat010.enum.HICLOUD_DOWNLOAD_FAILED.getName()
                );
                return;
            }

            // ApiResponseAdvice로 DATA[0]에 서비스 맵(totalCount, downloadedFiles 등)이 들어옴
            var payload = typeof response.getDataJsonObject === "function"
                ? response.getDataJsonObject()
                : null;
            if (!payload && response.jsonData && response.jsonData.DATA && response.jsonData.DATA[0]) {
                payload = response.jsonData.DATA[0];
            }
            if (!payload) {
                console.warn("HiCloud cloudAttach: DATA 페이로드 없음");
                xui.dialog.warning("", aichat010.enum.HICLOUD_DOWNLOAD_FAILED.getName());
                return;
            }

            var successCount = payload.successCount || 0;
            var failedCount = payload.failedCount || 0;
            var totalCount = payload.totalCount || 0;

            var downloadedFiles = Array.isArray(payload.downloadedFiles) ? payload.downloadedFiles : [];
            var failedFiles = Array.isArray(payload.failedFiles) ? payload.failedFiles : [];

            // 일부 파일이 실패한 경우 사용자에게 알림
            if (failedCount > 0) {
                var failedFileNames = failedFiles.map(function(f) {
                    try {
                        return decodeURIComponent(f.filename || "") || "알 수 없는 파일";
                    } catch (e) {
                        return "알 수 없는 파일";
                    }
                }).join(", ");
                xui.dialog.warning(
                    failedCount + "개 파일 다운로드 실패: " + failedFileNames,
                    aichat010.enum.HICLOUD_DOWNLOAD_FAILED.getName()
                );
            }

            if (successCount > 0) {
                resolve({
                    downloadedFiles: downloadedFiles,
                    failedFiles: failedFiles,
                    successCount: successCount,
                    failedCount: failedCount,
                    totalCount: totalCount
                });
            } else {
                xui.dialog.warning("", aichat010.enum.HICLOUD_DOWNLOAD_FAILED.getName());
            }
        }).catch(function(err) {
            xui.dialog.warning(
                (err && err.message) ? err.message : "",
                aichat010.enum.HICLOUD_DOWNLOAD_FAILED.getName()
            );
            if (typeof reject === "function") {
                reject(err);
            }
        });
    },

    /**
     * 전송 버튼 클릭 시 모든 파일 처리
     * 로컬 파일은 서버에 업로드하고, HiCloud 파일은 이미 서버에 저장되어 있으므로 그대로 사용
     * @param {Array} filesToUpload - 업로드할 파일 목록
     * @returns {Promise} 업로드된 파일 정보
     */
    uploadFiles: function(filesToUpload) {
        var files = filesToUpload || attachedFiles;

        if (files.length === 0) {
            return Promise.resolve([]);
        }

        // 파일 개수 검증
        var countValidation = aichat010.validateFileCount(0, files.length);
        if (!countValidation.valid) {
            return Promise.reject(new Error(countValidation.error));
        }

        // 파일 분류 (로컬 파일과 HiCloud 파일 구분)
        var localFiles = files.filter(function(f) { return f.source === 'local'; });
        var hicloudFiles = files.filter(function(f) { return f.source === 'hicloud'; });

        // 로컬 파일이 없으면 바로 반환 (HiCloud 파일만 있는 경우)
        if (localFiles.length === 0) {
            return Promise.resolve(files);
        }

        // FormData 생성 (multipart/form-data 형식으로 파일 전송 준비)
        var formData = aichat010._createUploadFormData(localFiles);
        if (!formData) {
            return Promise.reject(new Error('파일 FormData 생성 실패'));
        }

        // Ajax로 로컬 파일 업로드 (/xs/aichat/uploadFiles.json)
        return aichat010._uploadLocalFilesToServer(formData, localFiles, files);
    },

    // FormData 생성 (multipart/form-data 형식으로 파일 데이터 구성)
    _createUploadFormData: function(localFiles) {
        var formData = new FormData();
        for (var i = 0; i < localFiles.length; i++) {
            var fileInfo = localFiles[i];
            if (!(fileInfo.file instanceof File)) {
                xui.dialog.warning("", aichat010.enum.FILE_NOT_FOUND.getName());
                return null;
            }
            // FormData에 파일 추가 (키: 'files', 값: File 객체, 파일명)
            formData.append('files', fileInfo.file, fileInfo.name);
        }
        return formData;
    },

    // 서버로 파일 업로드 (Ajax POST 요청, multipart/form-data)
    _uploadLocalFilesToServer: function(formData, localFiles, allFiles) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                // url: '/xs/aichat/uploadFiles.json',
                url: '/xs/aichat/v2/uploadFiles',
                type: 'POST',
                data: formData,
                processData: false,  // FormData는 자동 처리 비활성화
                contentType: false,  // multipart/form-data는 브라우저가 자동 설정
                success: function(response) {
                    var json = new xui.json(response);
                    var fileInfos = [];

                    try {
                        var dataArray = json.getDataJsonArray();
                        if (dataArray && dataArray.length > 0 && dataArray[0] && dataArray[0].fileInfo) {
                            fileInfos = dataArray[0].fileInfo;
                        }
                    } catch (e) {
                        // xui.json 파싱 실패 시 하위 호환용 직접 파싱
                        var rawData = response && response.DATA;
                        if (rawData && rawData.length > 0 && rawData[0] && rawData[0].fileInfo) {
                            fileInfos = rawData[0].fileInfo;
                        }
                    }

                    if (fileInfos && fileInfos.length > 0) {
                        // 서버 응답으로 파일 정보 업데이트 (URL, 썸네일 등)
                        aichat010._updateFileInfoWithServerResponse(fileInfos, localFiles);
                        resolve(allFiles);
                        return;
                    }

                    reject(new Error('업로드 응답에 fileInfo가 없습니다.'));
                },
                error: function(xhr, status, error) {
                    var errorMessage = '업로드 요청 실패: ' + error;
                    if (xhr && xhr.responseJSON && xhr.responseJSON.HEADER && xhr.responseJSON.HEADER.ERROR_MSG) {
                        errorMessage = xhr.responseJSON.HEADER.ERROR_MSG;
                    }
                    reject(new Error(errorMessage));
                }
            });
        });
    },

    // 서버 응답으로 파일 정보 업데이트 (fileUrl, thumbnailUrl, thumbnailBase64 등)
    _updateFileInfoWithServerResponse: function(serverFileInfos, localFiles) {
        serverFileInfos.forEach(function(meta, index) {
            var fileInfo = localFiles[index];
            if (!fileInfo) return;

            // URL 정보 업데이트 (서버에 저장된 파일 경로)
            fileInfo.url = meta.fileUrl || meta.url;
            fileInfo.fileUrl = meta.fileUrl || meta.url;

            // UUID 폴더 정보 업데이트
            if (meta.folderUuid) {
                fileInfo.folderUuid = meta.folderUuid;
            }

            // 실제 저장된 파일명 업데이트 (서버에서 생성한 고유 파일명)
            if (meta.savedFilename) {
                fileInfo.savedFilename = meta.savedFilename;
            }

            // 원본 파일명 유지 (버블 표시용)
            if (meta.originalFilename) {
                fileInfo.originalFilename = meta.originalFilename;
                fileInfo.originalName = meta.originalFilename; // 호환성
            }

            // 파일 경로 업데이트 (UUID 폴더 경로 포함, startstream 전송용)
            if (meta.filePath) {
                fileInfo.filePath = meta.filePath;
                // file.name을 실제 저장된 파일 경로로 업데이트 (startstream에서 사용)
                // 단, 원본 파일명은 originalFilename에 유지
                fileInfo.name = meta.filePath;
            } else if (meta.folderUuid && meta.savedFilename) {
                fileInfo.filePath = meta.folderUuid + "/" + meta.savedFilename;
                fileInfo.name = fileInfo.filePath;
            }

            // 썸네일 정보 업데이트 (이미지 파일인 경우)
            if (meta.thumbnailBase64) {
                fileInfo.thumbnailBase64 = meta.thumbnailBase64;
                // 썸네일 Base64를 localStorage에 저장 (캐싱) - aichatThumbnailStorage.js 모듈 사용
                // 필요시 아래 주석을 해제하여 사용하세요
                // if (typeof AichatThumbnailStorage !== 'undefined') {
                //     AichatThumbnailStorage.saveThumbnailToStorage(meta, fileInfo);
                // }
            }

            if (meta.thumbnailUrl || meta.thumbnail) {
                fileInfo.thumbnailUrl = meta.thumbnailUrl || meta.thumbnail;
                fileInfo.thumbnail = meta.thumbnailUrl || meta.thumbnail;
            }

            // thumbnailId 업데이트 (folderUuid와 동일)
            if (meta.thumbnailId) {
                fileInfo.thumbnailId = meta.thumbnailId;
            } else if (meta.folderUuid) {
                fileInfo.thumbnailId = meta.folderUuid;
            }
        });
    },

    // 썸네일을 localStorage에 저장 (Base64 인코딩된 썸네일 이미지 캐싱)
    // 주석처리: aichatThumbnailStorage.js 모듈로 분리됨
    // _saveThumbnailToStorage: function(meta, fileInfo) {
    //     if (typeof AichatThumbnailStorage !== 'undefined') {
    //         AichatThumbnailStorage.saveThumbnailToStorage(meta, fileInfo);
    //         return;
    //     }
    //     
    //     var fileName = meta.originalFilename || fileInfo.name || '';
    //     if (!fileName) return;
    //
    //     var fileNameOnly = fileName.split('/').pop().split('\\').pop();
    //     var keys = aichat010._generateThumbnailKeys(fileInfo, fileNameOnly);
    //
    //     try {
    //         // localStorage에 썸네일 Base64와 파일명 저장
    //         localStorage.setItem(keys.primary, meta.thumbnailBase64);
    //         localStorage.setItem(keys.primary + '_name', fileNameOnly);
    //     } catch (e) {
    //         console.warn('썸네일 localStorage 저장 실패:', e);
    //     }
    // },

    /**
     * 파일 첨부 상태 초기화
     * 전역 변수 및 UI 모두 초기화
     */
    clearAttachedFiles: function() {
        attachedFiles = [];
        $('#fileList').empty();
        $('#attachedFiles').hide();
        $('#fileDisplayArea').empty().removeClass("--active");
    },


    // ==================== HiCloud 파일 처리 ====================

    /**
     * HiCloud 파일 첨부 팝업 호출
     * JSP에서 이동된 로직
     */
    popupHiCloudAttach: function() {
        var popTitle = "HiCloud첨부";
        var url = "/webapps/xs/aichat/aichatPopup.jsp";

        // 팝업 창 열기
        window.open(url, popTitle, "toolbar=no, width=1020, height=620, directories=no, status=no, scrollbars=yes, resizable=no, location=no");

        // 전달 파라미터 설정
        if (document.attachForm) {
            document.attachForm.target = popTitle;
            document.attachForm.action = url;
            document.attachForm.inputYn.value = "N";
            document.attachForm.isSSO.value = "Y";
            document.attachForm.email.value = "";
            document.attachForm.method = "post";
            document.attachForm.submit();
        }
    },

    /**
     * HiCloud 팝업 전역 콜백 바인딩
     * 팝업에서 window.opener.callBackFromHiCloud() 호출 시 진입
     */
    _bindGlobalHiCloudCallback: function(){
        if (typeof window.callBackFromHiCloud !== 'function') {
            window.callBackFromHiCloud = function(fileObj){
                try {
                    var fileInfoList = (Array.isArray(fileObj)) ? fileObj : [fileObj];
                    if (window.aichat010 && typeof window.aichat010.callBackFromHiCloud === 'function') {
                        window.aichat010.callBackFromHiCloud(fileInfoList);
                    }
                } catch (e) {
                    xui.dialog.warning("", aichat010.enum.HICLOUD_DOWNLOAD_FAILED.getName());
                }
            };
        }
    },

    // HiCloud 팝업에서 파일 선택 완료 시 호출되는 콜백
    callBackFromHiCloud: function(cloudFileInfos) {
        if (!cloudFileInfos || cloudFileInfos.length === 0) {
            xui.dialog.warning("", aichat010.enum.FILE_NOT_FOUND.getName())
            return;
        }

        // 파일 개수 제한 검증
        var countValidation = aichat010.validateFileCount(attachedFiles.length, cloudFileInfos.length);
        if (!countValidation.valid) {
            return;
        }

        // 서버에서 HiCloud 파일 다운로드 (서버가 HiCloud에서 파일을 받아 AI_CHAT_UPLOAD_PATH에 저장)
        aichat010.prepareCloudFiles(cloudFileInfos)
            .then(function(result) {
                // result는 { downloadedFiles, failedFiles, successCount, failedCount } 형태
                var downloadedFiles = result.downloadedFiles || [];
                var failedFiles = result.failedFiles || [];

                // 성공한 파일만 attachedFiles에 추가
                $.each(downloadedFiles, function(index, downloadedFile) {
                    // 서버 응답의 fileId 는 저장용 folderUuid 이므로 HiCloud fileId 와 비교하지 않음.
                    // 동일 downLoadUrl 이 여러 개일 때 find 가 항상 첫 행만 고르는 버그 방지: URL + 파일명으로 매칭.
                    var matchedFile = aichat010._matchHiCloudSourceFile(cloudFileInfos, downloadedFile);
                    // 전부 성공해 개수가 같을 때만 순서 기반 보조 매칭 (일부 실패 시 인덱스는 어긋남)
                    if (!matchedFile && downloadedFiles.length === cloudFileInfos.length && index < cloudFileInfos.length) {
                        matchedFile = cloudFileInfos[index];
                    }

                    if (matchedFile) {
                        var decodedFileName = decodeURIComponent(matchedFile.fileName || '');
                        // 서버가 저장 시 발급한 폴더 UUID(응답 fileId / folderUuid). HiCloud fileId와 다름.
                        var serverFolderKey = downloadedFile.folderUuid || downloadedFile.fileId;
                        var fileInfo = {
                            id: 'file-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9), // 고유 ID 생성
                            source: 'hicloud',                    // 파일 출처
                            file: null,                           // File 객체 없음 (서버에 이미 저장됨)
                            name: decodedFileName,
                            size: parseInt(matchedFile.fileSize) || 0,
                            type: 'application/octet-stream',     // MIME 타입 불명
                            extension: aichat010.getFileExtension(decodedFileName), // 확장자 (.pdf, .jpg 등)
                            folderUuid: serverFolderKey,
                            thumbnailId: serverFolderKey,
                            // HiCloud 원본 정보
                            cloudFileId: matchedFile.fileId,
                            cloudDownloadUrl: matchedFile.downLoadUrl
                        };

                        attachedFiles.push(fileInfo);

                        // 파일 UI 표시
                        aichat010.addToFileDisplayArea(fileInfo);
                    }
                });
            })
            .catch(function(error) {
                xui.dialog.warning("", aichat010.enum.HICLOUD_DOWNLOAD_FAILED.getName());
            });
    },

    /** HiCloud 다운로드 결과(downloadedFile)와 팝업에서 넘어온 원본 행 매칭 */
    _matchHiCloudSourceFile: function(cloudFileInfos, downloadedFile) {
        if (!cloudFileInfos || !downloadedFile) {
            return null;
        }
        var dfUrl = (downloadedFile.fileInfo || "").trim();
        var dfNameRaw = downloadedFile.filename || "";
        var dfName = dfNameRaw;
        try {
            dfName = decodeURIComponent(dfNameRaw.replace(/\+/g, " "));
        } catch (e) {
            dfName = dfNameRaw;
        }
        var matchUrlAndName = cloudFileInfos.find(function(cf) {
            var cfUrl = (cf.downLoadUrl || cf.downloadUrl || "").trim();
            if (cfUrl !== dfUrl) {
                return false;
            }
            var cfNameRaw = cf.fileName || "";
            var cfName = cfNameRaw;
            try {
                cfName = decodeURIComponent(cfNameRaw.replace(/\+/g, " "));
            } catch (e2) {
                cfName = cfNameRaw;
            }
            return cfName === dfName;
        });
        if (matchUrlAndName) {
            return matchUrlAndName;
        }
        // URL 이 동일한 테스트 데이터 등: 파일명만으로 유일하면 매칭
        var sameUrl = cloudFileInfos.filter(function(cf) {
            return (cf.downLoadUrl || cf.downloadUrl || "").trim() === dfUrl;
        });
        if (sameUrl.length <= 1) {
            return sameUrl[0] || null;
        }
        return sameUrl.find(function(cf) {
            var cfNameRaw = cf.fileName || "";
            var cfName = cfNameRaw;
            try {
                cfName = decodeURIComponent(cfNameRaw.replace(/\+/g, " "));
            } catch (e3) {
                cfName = cfNameRaw;
            }
            return cfName === dfName;
        }) || null;
    },

    /**
     * HiCloud 테스트용 함수
     * 하드코딩된 파일 정보로 테스트
     */
    testHiCloudResponse: function() {
        // 테스트 데이터
        var testData = [
            {
                "downLoadUrl": "http://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png",
                "fileId": "94c2af7d-4de7-43a4-b925-68d9cde5900f",
                "fileName": "us.jpg",
                "fileSize": "2517856"
            },
            {
                "downLoadUrl": "http://httpbin.org/image/png",
                "fileId": "b3af7f8e-e799-410c-8fab-e7afb05df2af",
                "fileName": "(기준정보)%20주간부문통합리더미팅_3월2주차_210309.jpg",
                "fileSize": "2169878"
            }
        ];

        // callBackFromCloud 호출
        aichat010.callBackFromHiCloud(testData);
    },

// ==============================================
// 심층검색
// ==============================================

    // 심층검색 버튼 활성화 시 파일 첨부 막기
    toggleExclusiveButton : function() {
//        var $file = $(fileSelector);
//        var $deep = $(deepSelector);

        if ($('.deep-search').hasClass('--active')) {
            xui.util.log("deep-search active");
            $('.add-file').addClass('disabled').css('pointer-events', 'none').css('opacity', '0.5');
        }else if ($('.file-list').hasClass('--active')) {
            xui.util.log("file-list active");
            $('.deep-search').addClass('disabled').css('pointer-events', 'none').css('opacity', '0.5');
        } else {
            xui.util.log("not active");
            $('.deep-search').removeClass('disabled').css('pointer-events', '').css('opacity', '');
            $('.add-file').removeClass('disabled').css('pointer-events', '').css('opacity', '');

        }
    },
// ==============================================
     /**
     * 로그아웃 처리
     * @param {boolean} isConfirm  확인메시지 출력 후 로그아웃 처리할지 여부 false로 설정할 경우 메시지 없이 바로 로그아웃 처리
     * @returns 없음
     */
    logout : function(isConfirm){
        var param	= new xui.json();
        param.setURL("/xs/webbase/login/logout.json");
        param.setAuthType(xui.enum.AUTH_TYPE_NONE.getCode());
        xui.util.log(param);

        if(isConfirm){ // 로그아웃 버튼을 클릭하여 정상적으로 로그아웃을 시도할 떄
            misUserLogout = true;
            xui.dialog.confirm(aichat010.enum.LOGOUT_CONFIRM.getName(), aichat010.enum.LOGOUT.getName(), function(isConfirm){
                if(isConfirm){
                    xui.ajax.callSync(param);
                    //로그인 화면으로 이동시키는 부분을 에러페이지로 넘어가게 수정(SSO 연동)
                    //window.location.href = xui.com.getContextPath();
                    xui.com._redirectErrorPage("error",aichat010.enum.CLOSE_PAGE_LOGOUT.getName(), "LOGOUT");
                }
            });
        }else{
            param.setString("userId", $("#sessionUserId").valExt());
            xui.ajax.callSync(param);
        }
    },

    /**
     * @param {string} key
     * @param {Object} [values] plain object일 때 {name} 토큰을 치환 (applyMessageTemplate과 동일)
     */
    msg: function(key, values) {
        return HyobeeI18n.msg(key, values);
    },

    formatMsg : function(key, userName) {
        return HyobeeI18n.formatMsg(key, userName);
    },

    /**
     * Sample(해당 함수는 삭제하지 말고 그대로)
     */
    sample : function(){
    }
};