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
var mintTargetSize = 30;
var mintMinScore = 0.4;
var misStream = true;		//스트림형태로 챗봇 답변을 표시할지 여부

// 호스트명 상수 정의
var host = {
    dev: 'ai-chatdev.hyosung.com',
    prod: 'ai-chat.hyosung.com'
};

var currentSearchType = "intranet"; // 기본값: 사내검색
var mobjConversationId = '';
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
// 채팅 이력 페이지네이션 관련 전역 변수
var chatHistoryCurrentPage = 0; // 현재 채팅 이력 페이지
var chatHistoryHasNext = false; // 다음 페이지 존재 여부

// 파일 업로드 관련 전역 변수
var attachedFiles = []; // 첨부된 모든 파일 목록 (로컬 + HiCloud 통합)
// 파일 검증 관련 상수는 FILE_VALIDATION 객체로 이동
var MAX_LENGTH = 20480; // 글자수 제한

//수식 블록 상태 추적
var isMathBlock = false;
var mathBuffer = [];
var isInlineMath = false;
var inlineBuffer = "";
var finalOutput = [];
var currentEnv = null;        // pmatrix, bmatrix 등 환경 이름
var inlineMathBuffer = [];

// 파일 검증 관련 상수
var FILE_VALIDATION = {
    MAX_COUNT: 3,
    MAX_SIZE: 20 * 1024 * 1024, // 20MB
    ALLOWED_EXTENSIONS: [
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', // 이미지 확장자
        '.doc', '.docx', '.hwp', '.hwpx', '.pdf', // 문서 확장자
        '.xls', '.xlsx', // 엑셀 확장자
        '.ppt', '.pptx', // 파워포인트 확장자 추가
        '.txt' // 텍스트 확장자 추가
    ],
    ALLOWED_TYPES: [
        'image/jpeg', 'image/png', 'image/gif', 'image/bmp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/x-hwp', 'application/haansofthwp', 'application/vnd.hancom.hwp', 'application/hwp',
        'application/x-hwpml', 'application/vnd.hancom.hwpx',
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint', // 구형 PPT (.ppt)
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // 신형 PPT (.pptx)
        'text/plain' // 텍스트 (.txt)
    ]
};
/***************************************************************************************************************************************************************
 * Document Ready : jquery에서 제공하는 함수를 이용하여 화면이 로드될 때 처리할 함수를 정의한다.
 ***************************************************************************************************************************************************************/
function PageReady(){
    aichat010.completePageRender();
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
                "무엇이 궁금하신가요?",
                "2026년 스판덱스 글로벌 시장 점유율 순위 알려줘",
                "폴리프로필렌(PP) 국내외 가격 추이 알려줘",
                "2026년 변압기 시장 글로벌 수요 전망 알려줘",
                "무엇을 찾고 계신가요?",
                "웹에서 최신 뉴스 찾아줘",
                "웹에서 검색한 결과를 우선 반영하여 최신 정보를 제공합니다.",
                "필요한 정보를 입력해 주세요"
            ],
            ""
        );
        aichat010.enum.setEnum("INTERNAL_PLACEHOLDER_MESSAGES"     ,"INFO",
            [
                "무엇이 궁금하신가요?",
                "사내 규정 검색해볼까요?",
                "사내검색은 효성 지주사 업무 서식/규정 게시판 정보를 활용하여 답변합니다.",
                "예시: 승격 기준 알려줘",
                "예시: 육아휴직에 대해 알려줘",
                "예시: 출장비 규정 알려줘"
            ],
            ""
        );
        aichat010.enum.setEnum("FILE_PLACEHOLDER_MESSAGES"     ,"INFO",
            [
                "각 20mb, 3개의 파일까지 업로드 가능합니다."
            ],
            ""
        );
        aichat010.enum.setEnum("FILE_NOT_FOUND"              ,"WARNING"                      ,"파일 정보가 없습니다."                  			        ,""			);
        aichat010.enum.setEnum("INVALID_FILE_TYPE"           ,"WARNING"                      ,"지원하지 않는 파일 형식입니다."           			        ,""			);
        aichat010.enum.setEnum("INVALID_FILE_TYPE_DETAIL"    ,"WARNING"                      ,"허용 형식: jpg, jpeg, png, gif, bmp, doc, docx, hwp, hwpx, pdf, xls, xlsx, ppt, pptx, txt",""         );
        aichat010.enum.setEnum("EXCEED_FILE_SIZE"            ,"WARNING"                      ,"업로드 용량 제한"           			                    ,""			);
        aichat010.enum.setEnum("EXCEED_FILE_SIZE_DETAIL"     ,"WARNING"                      ,"파일 크기가 20MB를 초과합니다."           			        ,""			);
        aichat010.enum.setEnum("EXCEED_FILE_COUNT"           ,"WARNING"                      ,"최대 3개의 파일만 첨부할 수 있습니다."           			    ,""			);
        aichat010.enum.setEnum("HICLOUD_DOWNLOAD_FAILED"     ,"WARNING"                      ,"HiCloud 파일 다운로드 중 오류가 발생했습니다."           		,""			);
        aichat010.enum.setEnum("HICLOUD_ATTACH_BLOCKED"		 ,"WARNING"					     ,"이 기능은 현재 대화방에서 사용할 수 없습니다."					,""			);
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

        // 사용자
        aichat010.setUserParams();

        //웰컴 인사
//		$("#welcome").html(xui.extends.session.getUserName() + xui.message.get("main010.WELCOME_USER"));

        // 초기화
        aichat010.searchAiBotInit(false, true);

        // 사내검색, 웹검색 구분
        aichat010.toggleSearchGubn(currentSearchType);
        // 채팅 이력 페이지 초기화
        chatHistoryCurrentPage = 0;
        aichat010.selectDataChatHistoryAll();

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

        //붙여넣기 함수
        aichat010.enableCustomPaste(".text-field");

        //웰컴 메세지
        aichat010.showWelcomeMessage("#user_full_name", ".welcome-message");

        // 접근 가능한 게시판 목록 조회
        aichat010.selectDataBoardsAuth();

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
            // 선택된 대화 목록 항목의 on 클래스 제거
            $(".list-view2-item").removeClass("on");
            aichat010.clearAttachedFiles();
            mobjCategory = '';

            $(".deep-search").removeClass("--active");
            aichat010.toggleExclusiveButton();

            aichat010.toggleSearchGubn("intranet");
            aichat010.searchAiBotInit(false, true);
            isNewChat=true;
        });

        // 대화 목록 전체 선택/해제
        $("#checkbox-all").click(function(e){
            var isChecked = $(this).prop('checked');
            // 모든 list-view2-item의 체크박스를 checkbox-all의 상태와 동일하게 설정
            $(".list-view2-item .navigation-item-checkbox").prop('checked', isChecked);
        });

        // 대화 목록 삭제
        $("#btn-delete").click(function(e){aichat010.deleteConversations();});

        // 채팅 이력 더보기 버튼 (동적 요소이므로 이벤트 위임 사용)
        $(document).on('click', '.more-button', function(e){
            chatHistoryCurrentPage++;
            aichat010.selectDataChatHistoryAll(chatHistoryCurrentPage, true);
        });

        //챗봇 이력 검색
        $("#historySearch").keypress(function(e){if(e.which === xui.enum.ENTER_EVENT.getCode()){aichat010.selectDataChatHistory();return false;}});

        // 사용법 모달
        $("#how_to_use").click(function(e){aichat010.initHowToUseModal(e);});

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

                // 삭제 버튼 활성화 토글
                $(".navigation-item-checkbox").on("input", function(){
                    const $checkboxes = $(".navigation-item-checkbox");
                    const anyChecked = $checkboxes.is(":checked");

                    if ( anyChecked ) {
                        $(".chat-delete").attr("tabIndex", "0");
                    } else {
                        $(".chat-delete").attr("tabIndex", "-1");
                    }
                })
            }
        });

        // [D] textarea 모션
        var $chatContainer = $(".chat-container");
        var $userField = $(".user-field");
        var $textarea = $(".text-field");
        var maxHeight = 240;

        $textarea.on("input", function() {
            var isChatting = $chatContainer.hasClass("--ing"); // ? 홈메인 : 대화 중
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

            xui.util.log(".feedbackBox-button", feedbackId, feedbackBox);

            // 이미 활성화된 상태라면 → 해제
            if (parentBtn.hasClass("--active")) {
                parentBtn.removeClass("--active");

                // 둘 다 해제된 경우 delete 호출
                if (feedbackBox.find(".feedback-button.--active").length === 0) {
                    aichat010.deleteDataFeedback(parentBtn, feedbackId);
                }
            } else {
                // 다른 버튼은 모두 해제
                feedbackBox.find(".feedback-button").removeClass("--active").attr("data-feedback", ""); // 속성 초기화

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
            //챗봇대화영역 초기화
            $('#box').empty();
            $(".list-view2-item").removeClass("on");
            //리스트 선택
            $(this).closest(".list-view2-item").addClass("on");
            //이벤트 생성
            mobjConversationId = $(this).attr("conversation_id");
            mobjCategory = $(this).attr("chat_category");

            // 다른 채팅방 선택 시 첨부 파일 목록 제거
            aichat010.clearAttachedFiles();

            aichat010.selectDataChatHistoryDetail(mobjConversationId);

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
        var sentence = $("#inputArea").val();   // shift+enter(줄바꿈) 질문 입력 시 화면에 적용하기 위해 .text -> .html로 변경
        xui.util.log("🙈 mobjCategory:", mobjCategory );
        xui.util.log("🙈 받은 데이터:", sentence );
        if (!aichat010.validationSearchBot(sentence)) return;

//        var chat_category = $(".toggle-option").data('id')? $(".toggle-option").data('id');
        var chat_category_doc = document.querySelector('.chat-type-button.active'); // 선택된 요소에 .selected 클래스가 있다고 가정
//        var chat_category = chat_category_doc?.dataset?.id || 'internal_rules';
        var chat_category = mobjCategory || chat_category_doc?.dataset?.id || 'internal_rules';

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
    selectDataChatHistoryAll: function(page, isAppend) {
        // 파라미터 기본값 설정
        if (typeof page === 'undefined') page = 0;
        if (typeof isAppend === 'undefined') isAppend = false;

        var historySearch = $("#historySearch").valExt();
        //조회 전 초기화 (최초 로드인 경우만)
        if (!isAppend) {
            $(".list-view2-item").removeClass("on");
        }

        //데이터유효성 체크
        if(!aichat010.validationSelectChatHistory()){return;}

        //서버에 전송할 파라미터 객체 생성
        var params = new xui.json();
        params.setURL("/xs/aichat/selectDataChatHistoryAll.json");		//request mapping Controller method URL
        params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());			//요청기능 권한코드(필수)
        params.setString("user_id", $("#user_id").val());	                //요청자 사용자 ID
        params.setInt("page", page)	;							            //페이지 번호 (0부터). 기본값 0.
        params.setInt("size", 20);   						                //가져올 페이지 개수. 기본값 20.
        params.setCallBack(function(response, request){
            if(!response.getErrorFlag()){
//                console.log("!! "+ response.getDataJsonObject().total_count);
                aichat010.setChatHistory(response, isAppend);
            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
        });
        xui.ajax.callService(params);
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

        //서버에 전송할 파라미터 객체 생성
        var params						= new xui.json();
        params.setURL("/xs/aichat/selectDataChatMessages.json");	//request mapping Controller method URL
        params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());		//요청기능 권한코드(필수)
        params.setString("user_id", $("#user_id").val());	    //요청자 사용자 ID
        params.setInt("cursor", requestCursor);					    //cursor 값
        params.setInt("size", 10);						    //가져올 메시지 개수. 기본값 20 (임시 10).
        params.setString("conversation_id",String(conversation_id));	    //대화방 ID
        params.setCallBack(function(response, request){
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
        });
        xui.ajax.callService(params);
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

        // 서버에 전송할 파라미터 객체 생성
        var params = aichat010.buildCreateConversationParams(message, chat_category);

        // 채팅방 생성 API 호출 (Promise 반환)
        return new Promise(function(resolve, reject) {
            params.setCallBack(function(response, request) {
                if (!response.getErrorFlag()) {
                    // conversation_id 추출 및 검증
                    try {
                        mobjConversationId = aichat010.extractConversationId(response);

                        // conversation_id를 로컬 변수에도 저장 (클로저 문제 방지)
                        var createdConversationId = mobjConversationId;

                        // 채팅방 생성 성공 후 파일 업로드 진행
                        aichat010.uploadFiles(filesToUpload)
                            .then(function(uploadedFiles) {
                                // 입력창 및 UI 초기화
                                aichat010.resetInputArea(chat_category);

                                // 스트리밍 시작 (메시지는 여기서 표시됨)
                                aichat010.selectDataChatStream(message, chat_category, createdConversationId, uploadedFiles);

                                // 채팅 완료 후 후처리
                                aichat010.completeConversation();

                                resolve();
                            })
                            .catch(function(error) {
                                console.error('❌ 파일 업로드 실패:', error);
                                xui.dialog.error("파일 업로드 중 오류가 발생했습니다: " + error.message);
                                reject(error);
                            });
                    } catch (error) {
                        // conversation_id 추출 실패
                        console.error('❌ conversation_id 추출 실패:', error);
                        xui.dialog.error("대화 목록이 생성되지 않았습니다.");
                        reject(error);
                    }
                } else {
                    console.error('❌ 채팅방 생성 실패 - 에러 플래그 발생');
                    var errorMsg = response.getMsg() || (response.jsonData && response.jsonData.message) || '채팅방 생성에 실패했습니다';
                    xui.dialog.error(errorMsg, xui.enum.ERROR.getName());
                    reject(new Error(errorMsg));
                }
            });
            xui.ajax.callService(params);
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
        aichat010.selectDataChatHistoryAll();
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

    // 채팅방 생성 API 파라미터 생성
    buildCreateConversationParams: function(message, chat_category) {
        var params = new xui.json();
        params.setURL("/xs/aichat/createConversation.json");
        params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
        params.setString("user_id", $("#user_id").val());
        params.setString("user_query", message);
        params.setString("chat_category", chat_category);
        return params;
    },

    // ==================== 공통 메서드 끝 ====================

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

        //서버에 전송할 파라미터 객체 생성
        var params						= new xui.json();
        params.setURL("/xs/aichat/deleteConversations.json");		//request mapping Controller method URL
        params.setAuthType(xui.enum.AUTH_TYPE_DELETE.getCode());		//요청기능 권한코드(필수)
        params.setString("user_id", $("#user_id").val());	    //요청자 사용자 ID
        params.setObject("conversation_ids", conversations)	;		//삭제할 대화 ID 목록
        params.setCallBack(function(response, request){
            if(!response.getErrorFlag()){
                chatHistoryCurrentPage = 0;
                aichat010.selectDataChatHistoryAll();
                aichat010.searchAiBotInit(false, true);

                // ✅ 체크된 체크박스 비활성화
//                $(".navigation").toggleClass("--delete");
//                $('#chatHistory')
//                    .find('input[type="checkbox"]:checked')
//                    .prop("disabled", true)
//                    .prop("checked", false); // 선택도 해제하고 싶다면 추가
            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
        });
        xui.ajax.callService(params);
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
        // 파라미터 기본값 설정

        //데이터유효성 체크
        if(!aichat010.validationSelectBoardsAuth()){return;}

        // SQL Injection 취약점 보완: 입력값 검증
        if (!aichat010.validateAichatParams()) {
            return;
        }

        //서버에 전송할 파라미터 객체 생성
        var params = new xui.json();
        params.setURL("/xs/aichat/selectDataBoardsAuth.json");		//request mapping Controller method URL
//        params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());	//요청기능 권한코드(필수)
        params.setString("corp_code", $("#corp_code").val());
        params.setInt("pg_code", $("#pg_code").val());
        params.setInt("pu_code", $("#pu_code").val());
        params.setInt("team_code", $("#team_code").val());
        params.setCallBack(function(response, request){
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

            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
        });
        xui.ajax.callService(params);
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
        // 화면 상태 확인
        var hasIngClass = $("#container").hasClass("--ing");

        // 데이터 유효성 체크
        if (!aichat010.validationChatStream()) return;

        // conversation_id 유효성 검증
        if (!conversation_id || conversation_id === 'undefined' || conversation_id === 'null') {
            xui.dialog.error("채팅방 ID가 유효하지 않습니다. 다시 시도해주세요.");
            return;
        }

        var _message = message;

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
        params.setString("pg_code", $("#pg_code").val());
        params.setString("pu_code", $("#pu_code").val());
        params.setString("team_code", $("#team_code").val());
        params.setString("corp_code", $("#corp_code").val());

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
        aichat010.appendMessage( $("<div/>").text(_message).html().replace(/\n/g, "<br>"), "", "0", "" );

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


        params.setURL("/xs/aichat/sendMessage.json");
        params.setMethod("POST");

        //params 먼저 서버에 저장
        params.setCallBack(function (response, request) {
            xui.util.log(response.getErrorFlag());
            if (!response.getErrorFlag()) {
                xui.util.log("✅ params 저장 완료, SSE 시작");

                //20251229 eventSource ---------------------------------------
                eventSource = new EventSource(`${baseUrl}/xs/aichat/messageStream.stream?conversation_id=` + mobjConversationId, { withCredentials: true });
                xui.util.log("SSE 연결 시도:", eventSource.url);

                // SSE 연결 성공
                eventSource.onopen = function() {
                    xui.util.log("✅ SSE 연결 성공");
                };

                var lineNo = 0;
                var searchKey = "";
                var answerData = "";

                // 메시지 수신 처리
                eventSource.onmessage = function(event) {
                    var outer = JSON.parse(event.data); // 첫 번째 파싱 → 문자열
                    var eventData = typeof outer === "string" ? JSON.parse(outer) : outer;
//                        xui.util.log("🙈 받은 데이터:", outer , "//" , typeof outer);
//                        xui.util.log("📩 받은 데이터:", eventData);
//                        xui.util.log("status 값 확인:", eventData.status);

                    switch (eventData.status.trim()) {
                        case "error":
                            console.error("🚨 오류:", eventData);
                            aichat010.loadErrorStream(eventData.message || "오류가 발생했습니다.");
                            eventSource.close();
                            $(".enter-message").removeClass('--stop');
                            aichat010.toggleInputAreaLock();
                            break;
                        case "user_requested":
                            xui.util.log("ℹ️ 사용자 요청 확인:", _message);
                            xui.util.log("ℹ️ 사용자 요청 확인:", eventData.user_message_id);
                            xui.util.log("ℹ️ 사용자 요청 확인:", eventData.ai_message_id);
                            searchKey = eventData.ai_message_id;
                            mobjAiMessageId = eventData.ai_message_id;

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
                            // 수식 처리 관련 변수 초기화
                            isMathBlock = false;
                            mathBuffer = [];
                            currentEnv = null;
                            finalOutput = [];
                            answerData = "";
                            break;
                        case "response_chunk":
                            lineNo++;

                            if (eventData.text) {
                                xui.util.log("💬 청크:", eventData.text);
                                // chunk 단위로는 원시 텍스트만 누적 (수식 처리는 완료 시 수행)
                                // 1) 링크 처리
                                var html = aichat010.extractReutersLinksFromHTML(eventData.text);
                                // 2) 최종 answerData 누적 (원시 텍스트)
                                answerData += html;
                                // 3) 렌더링 (수식 처리는 하지 않음 - 완료 시 처리)
                                aichat010.loadFindContentsStream(lineNo, searchKey, answerData);

                            } else if (eventData.sources) {
                                xui.util.log("📚 출처 청크 수신:", eventData.sources);
                                // sources 처리 로직 추가
                                var jsonText = aichat010.extractReutersSource2(eventData.sources);
                                answerData += jsonText;
                                aichat010.loadFindContentsStream(lineNo, searchKey, answerData);
                            } else {
                                console.warn("⚠️ 알 수 없는 response_chunk:", eventData);
                            }
                            break;
                        case "sources":
                            xui.util.log("💬 sources 수신", eventData.data);
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

                            // 1) 수식 블록 처리 (전체 텍스트에 대해)
                            var processedData = aichat010.wrapMathBlocks(answerData);

                            // 2) 수식이 적용된 텍스트로 다시 렌더링
                            aichat010.loadFindContentsStream(lineNo, searchKey, processedData);

                            //피드백 이벤트 생성
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
                            eventSource.close();
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
        });
        xui.ajax.callService(params);
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

        //서버에 전송할 파라미터 객체 생성
        var params						= new xui.json();
        params.setURL("/xs/aichat/stopStream.stream");		//request mapping Controller method URL
        params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
        params.setString("conversation_id", String(conversationId));	                // 강제 중지할 emitter 키(채팅방번호)
        params.setString("ai_message_id", String(aiMessageId));	                // 강제 중지할 emitter 키(채팅방번호)
        params.setCallBack(function(response, request){
            if(!response.getErrorFlag()){
                eventSource.close();
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
        });
        xui.ajax.callService(params);
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

        //서버에 전송할 파라미터 객체 생성
        var params = new xui.json();
        params.setURL("/xs/aichat/feedback.json");		//request mapping Controller method URL
        params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());			//요청기능 권한코드(필수)
        params.setString("conversation_id", conversation_id);	                //요청자 사용자 ID
        params.setString("message_id", String(message_id))	;							            //페이지 번호 (0부터). 기본값 0.
        params.setString("feedback_type", feedback_type);   						                //가져올 페이지 개수. 기본값 20.
        params.setCallBack(function(response, request){
            if(!response.getErrorFlag()){
                console.log("!! "+ response.getDataJsonObject().feedback_id);
                // $(element).data("feedback", response.getDataJsonObject().feedback_id);
                $(element).attr("data-feedback", response.getDataJsonObject().feedback_id);
            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
        });
        xui.ajax.callService(params);
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

        var conversation_id = mobjConversationId;
        var message_id = $(element).data('searchkey');
        var feedback_id = feedbackId;

        xui.util.log("deleteDataFeedback:", conversation_id, message_id, feedback_id);

        //서버에 전송할 파라미터 객체 생성
        var params = new xui.json();
        params.setURL("/xs/aichat/deleteFeedback.json");		//request mapping Controller method URL
        params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());			//요청기능 권한코드(필수)
        params.setString("conversation_id", conversation_id);	                //요청자 사용자 ID
        params.setString("message_id", String(message_id))	;							            //페이지 번호 (0부터). 기본값 0.
        params.setString("feedback_id", String(feedback_id));   						                //가져올 페이지 개수. 기본값 20.
        params.setCallBack(function(response, request){
            if(!response.getErrorFlag()){
                //                console.log("!! "+ response.getDataJsonObject().total_count);
                //$(element).data("feedback", "");
                $(element).attr("data-feedback", "");
            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
        });
        xui.ajax.callService(params);
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

        // 사용자 정보 표시 영역
        $(".current-user__name").text(userFullName);
        $(".current-user__position").text(position);
        // var decoded = deptName ? deptName.replace(/&gt;/g, '>') : '';
        $(".current-user__affiliate").text(deptName);

        // 프로필 영역
        var theme = Math.floor(Math.random() * 7);
        $(".current-user__content")
            .css({"--firstName": `"${ userFirstName }"`})
            .addClass(`--theme${ theme }`)
        ;

        var helpName = userFullName +' '+position;
        $("#tooltip-name").text(helpName);

        //관리자 버튼 노출 제어
//        var allowedGroups = ['2024120517295171470104', '2021010100000000000000'];
//
//        if (allowedGroups.includes(authGroupInfo)) {
//            $(".current-user__utility").removeClass('xui-invisible');
//        } else {
//            $(".current-user__utility").addClass('xui-invisible');
//        }

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

        // type에 따라 mobjCategory 강제 설정 (이전 값 유지하지 않음)
        if (type === 'web') {
            mobjCategory = "web_search";
        } else {
            mobjCategory = "internal_rules";
        }

        // 채팅 타입 테마 및 placeholder 업데이트
        aichat010.updateChatTypeAndPlaceholder(mobjCategory);
    },

    showWelcomeMessage : function(userSelector, messageSelector) {
        var userName = $(userSelector).val();
        var welcomeMessages = [
            `${userName}님, 반갑습니다!`,
            '무엇이 궁금하신가요?',
            `${userName}님, 안녕하세요!`,
        ];
        var randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        $(messageSelector).text(randomMessage);
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
        } else {
            $targets.removeClass('--web');
            $targets.addClass('--corp');
        }
    },

    /**
     * Placeholder만 설정 (테마 업데이트는 하지 않음)
     * @param {string} type - 'web' 또는 'internal'
     * @ 20251202 'file' 추가
     */
    setPlaceholder : function(type){
        var messages =  "";
        if (type === 'web') {
            messages = aichat010.enum.WEB_PLACEHOLDER_MESSAGES.getName();
        } else if (type === 'file'){
            messages = aichat010.enum.FILE_PLACEHOLDER_MESSAGES.getName();
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
            $("#container").removeClass("--ing");
            $("#box").empty("");

            // 새 대화 시작 시 변수 초기화
            mobjConversationId = '';
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
            $(".text-field").css("height", "100px");

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
    setChatHistory : function(response, isAppend){
        // 파라미터 기본값 설정
        if (typeof isAppend === 'undefined') isAppend = false;

        //.addClass("xui-invisible")
        $("#noChatHistory").removeClass("--active");
        $('.current.navigation').removeClass('--init');

        // has_next 확인 (응답 데이터의 메타 정보에서 가져오기)
//        var content = response.getDataJsonObject().content;
        var content = response.getDataJsonObject()?.content || [];

        var listHTML = "";
        var startIndex = isAppend ? $("#chatHistory .list-view2-item").length : 0;

        for (var i = 0; i < content.length; i++) {
            var checkboxIndex = startIndex + i;
            listHTML += '<div class="list-view2-item">'
                + '    <input type="checkbox" id="checkbox-' + checkboxIndex + '" title="대화 삭제" class="navigation-item-checkbox" id="' + content[i].conversation_id + '" />'
                + '    <label for="checkbox-' + checkboxIndex + '" class="navigation-item-label"></label>'
                + '    <div class="list-view2"'+' conversation_id=' + content[i].conversation_id+' chat_category=' + content[i].chat_category+'>'
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
        var responseData = response.getDataJsonObject();
        var hasNext = responseData?.has_next;

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
            $("#chatHistory").append('<div class="list-view2-item more-button">더보기</div>');
        }

        aichat010.defineEventChatHistory(content);

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

            // marked 라이브러리가 로드된 후에 이 코드를 작성
            // 1. 커스텀 렌더러 객체 생성
            var customRenderer = new marked.Renderer();

            // 2. paragraph 메서드를 재정의해서 <p> 태그를 제거
//            customRenderer.paragraph = (text) => {
//              // text만 반환하면 <p> 태그가 완전히 사라져.
//              // 줄바꿈이 필요하다면 text + '\n' 등을 반환할 수도 있어.
//              return text;
//            };
            customRenderer.hr = () => {
                return '<hr class="divider" style="display: block">';
            };

            // 3. marked.setOptions에 커스텀 렌더러 적용
            marked.setOptions({
                gfm: true,
                breaks: true, // 줄바꿈을 <br>로 처리해줘서 <p> 태그 남용을 약간 줄여줌
                headerIds: false,
                mangle: false,
                sanitize: false,
//                renderer: customRenderer // <<-- 여기서 커스텀 렌더러를 적용!
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
                    aichat010.appendMessage(marked.parse(contentHtml), "", message_id, "");
                }else{ // role이 "assistant" 이면
                    var contentHtml = '';

                    // 사내검색/웹 검색일때 출처 유형이 달라서 분기처리
                    if(mobjCategory == 'web_search') {contentHtml = aichat010.extractReutersLinksFromHTML(content);}
                    else {contentHtml = aichat010.extractReutersSource(content);}

                    contentHtml = aichat010.wrapMathBlocks(contentHtml);
                    aichat010.appendMessage("", marked.parse(contentHtml), message_id, feedbackHtml);

                    if (sources && sources.length > 0){
                        var temp_title ='';
                        if(sources[0].source_type == 'web') temp_title = sources[0].display_title ;
                        else temp_title = sources[0].display_title + '-' + sources[0].source_title;

                        var refHtml  = '<div class="source" data-id="' + message_id + '">'
                            + '    <div class="source-button"  data-role="modal-opener" data-target="sourceModal' + message_id + '" tabIndex="0">'
                            + temp_title
                            + '	<div class="source-num"> +'
                            + aichat010.renderSourceLinksCount(sources)
                            + '    </div></div>'
                            + '</div>';

                        var contentsRef = aichat010.renderSourceLinks(sources, message_id);
                        // 답변 블럭 안쪽으로 위치 이동
                        var $refHtml = $(refHtml);
                        $("#ans" + message_id).children().last().after($refHtml);
                        $refHtml.append(contentsRef);
                    }
                    // ------------ 출처 표기 end

                    feedbackHtml = aichat010.setMessageFeedback(message_id, feedback);
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
            var attachments = data[i].attachments || [];
            var feedback = data[i].feedback;
            var feedback_id = data[i].feedback.feedback_id;
            var feedback_type = data[i].feedback.feedback_type;

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
                    questionHtml = '<div class="chat --q" id="' + message_id + '" data-role="dialog">'
                        + '    <div class="bubble">'
                        + marked.parse(contentHtml)
                        + '    </div>'
                        + '</div>';
                    messagesHtml.push(questionHtml);
                }else{ // role이 "assistant" 이면
                    var contentHtml = '';
                    if(mobjCategory == 'web_search') {
                        contentHtml = aichat010.extractReutersLinksFromHTML(content);
                    } else {
                        contentHtml = aichat010.extractReutersSource(content);
                    }

                    // 피드백 HTML 생성 (DOM 추가 없이 HTML 문자열만)
                    feedbackHtml = aichat010.getMessageFeedbackHtml(message_id, feedback_id, feedback_type);
                    contentHtml = aichat010.wrapMathBlocks(contentHtml);
                    var answerIdText = 'id="ans' + message_id + '"';
                    answerHtml = '<div class="chat --a" id="' + message_id + '">'
                        + '    <div class="bubble --block" ' + answerIdText + '>'
                        + marked.parse(contentHtml)
                        + '	</div>'
                        + feedbackHtml
                        + '</div>';
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

        var feedback_id = feedback.feedback_id;
        var feedback_type = feedback.feedback_type;
        var feedbackHtml = aichat010.getMessageFeedbackHtml(message_id, feedback_id, feedback_type);

        $("#" + message_id).append(feedbackHtml);
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

        var feedbackHtml   = '<div class="util-box" searchKey="' + message_id +'">'
            + '  <div class="feedback">'
            + '      <div class="feedback-button ' + up_feedback_class +'" tabIndex="0" data-feedback="' + up_feedback_id +'" data-searchkey="' + message_id +'">'
            + '          <i class="xfi xfi-ico_0114_thumb_up" id="thumb_up" aria-hidden="true"></i>'
            + '      </div>'
            + '      <div class="feedback-button ' + down_feedback_class +'" tabIndex="0" data-feedback="' + down_feedback_id +'" data-searchkey="' + message_id +'">'
            + '          <i class="xfi xfi-ico_0226_thumb_down" id="thumb_down" aria-hidden="true"></i>'
            + '      </div>'
            + '  </div>'
            + '  <div class="copy common-focusable" tabIndex="0">'
            + '      <i class="xfi xfi-ico_0069_content_copy" name="content_copy" aria-hidden="true" data-searchkey="' + message_id +'"></i>'
            + '  </div>'
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
                var jsonReady = match.replace(/'/g, '"');

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
            var textContent = conversationDiv.text(); //.find('.text').text().trim();
            var htmlContent = conversationDiv.html();
            var markdown = aichat010.copyAsMarkdown(htmlContent);

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
    loadFindContentsStream : function(lineNo, searchKey, data){
        $("#waiting").remove();			//진행중 메시지 삭제 후 처리
//        console.log(lineNo);

        //첫번째 줄이 도착하면 처리중을 박스를 없애고 새로운 대화상자를 생성한다.
        if (lineNo === 1) {
            $("#waiting").remove();

            var answerIdText = "";
            if (!xui.valid.isEmpty(searchKey)) {
                answerIdText = 'id="ans' + searchKey + '"';
            }

            var answerHtml = '<div class="chat --a" id="' + searchKey + '">'
                + '    <div class="bubble" ' + answerIdText + '>'
                + '    </div>'
                + '</div>';
            $("#box").append(answerHtml);

            markdownMap[searchKey] = ""; // 초기화
        }

        // marked 라이브러리가 로드된 후에 이 코드를 작성
        // 1. 커스텀 렌더러 객체 생성
        var customRenderer = new marked.Renderer();

        // 2. paragraph 메서드를 재정의해서 <p> 태그를 제거
//        customRenderer.paragraph = (text) => {
//          // text만 반환하면 <p> 태그가 완전히 사라져.
//          // 줄바꿈이 필요하다면 text + '\n' 등을 반환할 수도 있어.
//          return text;
//        };

        customRenderer.hr = () => {
            return '<hr class="divider" style="display: block">';
        };

        // 3. marked.setOptions에 커스텀 렌더러 적용
        marked.setOptions({
            gfm: true,
            breaks: true, // 줄바꿈을 <br>로 처리해줘서 <p> 태그 남용을 약간 줄여줌
            headerIds: false,
            mangle: false,
            sanitize: false,
//            renderer: customRenderer // <<-- 여기서 커스텀 렌더러를 적용!
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
//            aichat010.testHiCloudResponse();
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
        row.append('<div class="file-name">' + (fileInfo.name || '') + '</div>');

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
        var params = new xui.json();
        params.setURL("/xs/aichat/cloudAttach.json");
        params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
        // HiCloud 파일 정보를 JSON 문자열로 전달
        params.setString("hiCloudFileInfos", JSON.stringify(hiCloudFileInfos));
        params.setCallBack(function(response, request) {
            var successCount = response.getInt("successCount") || 0;
            var failedCount = response.getInt("failedCount") || 0;
            var totalCount = response.getInt("totalCount") || 0;

            // 성공한 파일 목록 추출
            var downloadedFiles = [];
            try {
                var downloadedFilesArray = response.getDataJsonArray("downloadedFiles");
                if (downloadedFilesArray && downloadedFilesArray.length > 0) {
                    for (var i = 0; i < downloadedFilesArray.length; i++) {
                        downloadedFiles.push(downloadedFilesArray[i]);
                    }
                }
            } catch (e) {
                console.warn("서버 응답에서 downloadedFiles 파싱 실패:", e);
            }

            // 실패한 파일 목록 추출
            var failedFiles = [];
            try {
                var failedFilesArray = response.getDataJsonArray("failedFiles");
                if (failedFilesArray && failedFilesArray.length > 0) {
                    for (var i = 0; i < failedFilesArray.length; i++) {
                        failedFiles.push(failedFilesArray[i]);
                    }
                }
            } catch (e) {
                console.warn("서버 응답에서 failedFiles 파싱 실패:", e);
            }

            // 일부 파일이 실패한 경우 사용자에게 알림
            if (failedCount > 0) {
                var failedFileNames = failedFiles.map(function(f) {
                    try {
                        return decodeURIComponent(f.filename || '') || '알 수 없는 파일';
                    } catch (e) {
                        return '알 수 없는 파일';
                    }
                }).join(', ');
                xui.dialog.warning(
                    failedCount + "개 파일 다운로드 실패: " + failedFileNames,
                    aichat010.enum.HICLOUD_DOWNLOAD_FAILED.getName()
                );
            }

            // 성공한 파일이 하나라도 있으면 resolve, 모두 실패한 경우만 reject
            if (successCount > 0) {
                resolve({
                    downloadedFiles: downloadedFiles,
                    failedFiles: failedFiles,
                    successCount: successCount,
                    failedCount: failedCount
                });
            } else {
                xui.dialog.warning("", aichat010.enum.HICLOUD_DOWNLOAD_FAILED.getName());
                // reject(new Error(response.getMsg() || 'HiCloud 파일 다운로드 실패'));
            }
        });

        xui.ajax.callService(params);
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
                url: '/xs/aichat/uploadFiles.json',
                type: 'POST',
                data: formData,
                processData: false,  // FormData는 자동 처리 비활성화
                contentType: false,  // multipart/form-data는 브라우저가 자동 설정
                success: function(response) {
                    // 서버 응답에서 파일 정보 추출 (fileUrl, thumbnailUrl 등)
                    var fileInfos = new xui.json(response).getDataJsonArray()[0].fileInfo;

                    if (fileInfos) {
                        // 서버 응답으로 파일 정보 업데이트 (URL, 썸네일 등)
                        aichat010._updateFileInfoWithServerResponse(fileInfos, localFiles);
                    }

                    resolve(allFiles);
                },
                error: function(xhr, status, error) {
                    reject(new Error('업로드 요청 실패: ' + error));
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
                    var arr = (Array.isArray(fileObj)) ? fileObj : [fileObj];
                    if (window.aichat010 && typeof window.aichat010.callBackFromHiCloud === 'function') {
                        window.aichat010.callBackFromHiCloud(arr);
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
                    // cloudFileInfos에서 해당 파일 찾기
                    var matchedFile = cloudFileInfos.find(function(cf) {
                        return cf.fileId === downloadedFile.fileId || cf.downLoadUrl === downloadedFile.fileInfo;
                    });

                    if (matchedFile) {
                        var decodedFileName = decodeURIComponent(matchedFile.fileName || '');
                        var fileInfo = {
                            id: 'file-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9), // 고유 ID 생성
                            source: 'hicloud',                    // 파일 출처
                            file: null,                           // File 객체 없음 (서버에 이미 저장됨)
                            name: decodedFileName,
                            size: parseInt(matchedFile.fileSize) || 0,
                            type: 'application/octet-stream',     // MIME 타입 불명
                            extension: aichat010.getFileExtension(decodedFileName), // 확장자 (.pdf, .jpg 등)
                            folderUuid: matchedFile.fileId,       // HiCloud fileId를 folderUuid로 사용
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

    /**
     * HiCloud 테스트용 함수
     * 하드코딩된 파일 정보로 테스트
     */
    testHiCloudResponse: function() {
        // 테스트 데이터
        var testData = [
            {
                "downLoadUrl": "https://c-cube.hyosung.com/html/xs/vob/cmmn/img/country/US.gif",
                "fileId": "94c2af7d-4de7-43a4-b925-68d9cde5900f",
                "fileName": "us.jpg",
                "fileSize": "2517856"
            },
            {
                "downLoadUrl": "http://hicloud.hyosung.com/download/cloud/b3af7f8e-e799-410c-8fab-e7afb05df2af/content/bp0068246/T",
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
     * Sample(해당 함수는 삭제하지 말고 그대로)
     */
    sample : function(){
    }
};