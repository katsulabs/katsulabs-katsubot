<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- 우측 영역: 채팅 타입, 대화 영역, 입력창, 사용법 모달 등 --%>
<!-- [S] 우측 영역 -->
<div class="right chat-wrap">
    <!-- [D] 대화 영역 테마
        a. 사내 검색(파란색)일 경우: .--corp 추가
        b. 웹 검색(노란색)일 경우: .--web 추가
        c. 대화를 시작한 경우: .--ing 추가
    //-->
    <div class="container chat-container --corp" id="container">
        <div class="chat-type-group">
            <div class="chat-type --corp">
                <div id="intranet" data-id="internal_rules" class="chat-type-button active" message-text="hyobee.toggle.internal_search"></div>
                <div id="web" data-id="web_search" class="chat-type-button" message-text="hyobee.toggle.web_search"></div>
            </div>
        </div>
        <div class="chat-content">
            <div class="welcome-message"></div>
            <!-- [S] 대화 영역 -->
            <div class="chat-message-container">
                <!-- [D] 대화 영역 스크롤한 경우: .--active 추가 -->
                <div class="chat-scroller">
                    <i class="xfi xfi-ico_0188_arrow_down" id="ico_0188_arrow_down" aria-hidden="true"></i>
                </div>
                <!-- [D] 대화 유형 종류
                    a. 공통: .chat, .bubble
                        * 기본: .chat, .bubble
                        * 최신 질문 어팬드 시, .chat-message 요소에 .--space 추가
                        * 답변이 넘어옴과 동시에, chat-message 요소에 .--space 삭제
                        * 혹은 다른 방에 나갔다가 들어올 경우, chat-message 요소에 .--space 삭제
                    b. 질문
                        * 기본: .--q
                        * 최신(꼬리): .--last
                        * 최신(스크롤 여백): .--space
                        * 수정 모달: [data-role]
                        * 이미지: .image, .name, .data
                        * 파일: .file, .name, .data
                    c. 답변
                        * 기본: .--a
                        * 스켈레톤: .chat.--a.--empty, .chat.--a
                        * 개행: .--block
                        * 강조: .--emphasis
                        * 참조 모달: [data-role]
                        *  기타 도구: .util-box
                //-->
                <div class="chat-message" id="box"></div>
            </div>
            <!-- [E] 대화 영역-->
            <div class="user-interface">
                <div class="user-interface-wrap">
                    <div id="fileDisplayArea" class="file-list"></div>
                    <!-- [D] 입력된 값이 없을 경우: .--empty 추가 -->
                    <!-- [D] 입력된 값이 개행될 경우: .--wrap 추가 -->
                    <div class="user-field --empty">
                        <textarea id="inputArea" class="text-field" placeholder=""></textarea>
                        <input type="file" id="fileInput" multiple="" accept=".jpg,.jpeg,.png,.gif,.bmp,.doc,.docx,.hwp,.hwpx,.pdf,.xls,.xlsx,.ppt,.pptx,.txt" autocomplete="off" class="xui-invisible">
                        <div class="attached-files" id="attachedFiles" style="display: none;"></div>
                    </div>
                    <div class="tool-box">
                        <div class="add-file common-focusable" tabIndex="0">
                            <i class="xfi xfi-ico_0341_attachment" id="ico_0341_attachment" aria-hidden="true"></i>
                        </div>
                        <div class="h-cloud common-focusable-bgcolor" tabIndex="0">
                            <i class="xfi xfi-ico_0343_cloud_h" id="hicloud_add" aria-hidden="true"></i>
                        </div>
                        <div class="s-drive common-focusable-bgcolor" tabIndex="0" style="display: none;">
                            <i class="xfi xfi-ico_0344_cloud_s" id="ico_0344_cloud_s" aria-hidden="true"></i>
                        </div>
                        <!-- [D] 심층 검색 선택된 경우: .--active 추가 //-->
                        <!--
                        <div class="deep-search" tabIndex="0">
                            <i class="xfi xfi-ico_0337_insight" id="ico_0337_insight" aria-hidden="true"></i>
                        </div>
                        -->
                        <!-- [D] 20480 이상 시도할 경우: .--active 추가 //-->
                        <p class="feedback-message" message-text="hyobee.chat.input.max_length_hint"></p>
                        <!-- [D] 답변 생성 중지의 경우: .--stop 추가 //-->
                        <div class="enter-message common-focusable-stop" tabIndex="0">
                            <i class="xfi xfi-ico_0060_send" id="ico_0060_send" aria-hidden="true"></i>
                            <i class="xfi xfi-ico_0195_stop_circle_line" id="ico_0195_stop_circle_line" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 저널(수집 저널 현황) 영역: 기본은 숨김 -->
    <div class="container chat-container --corp" id="journalContainer" style="display:none;">
        <jsp:include page="journal.jsp" flush="false"/>
    </div>
    <jsp:include page="footer.jsp" flush="false"/>
</div>
<!-- [E] 우측 영역 -->

<!-- [S][기술원] 출처 영역 -->
<!-- [D][기술원] 출처 영역 노출 시: .--active 추가 //-->
<div class="journal-panel">
    <div class="journal-panel-head">
        <div class="journal-result">
            <p class="journal-result-message">
                <span class="journal-result-count">99999</span>개의 출처를 찾았습니다.
            </p>
            <div class="journal-sorting">
                <div class="journal-sorting-button" tabIndex="0" message-text="hyobee.chat.journal.source.tab.sort.similarity"></div>
                <!-- [D][기술원] 정렬 노출 시: .--active 추가 //-->
                <div class="journal-sorting-list">
                    <li class="journal-sorting-item" tabIndex="0" message-text="hyobee.chat.journal.source.tab.sort.similarity"></li>
                    <li class="journal-sorting-item" tabIndex="0" message-text="hyobee.chat.journal.source.tab.sort.latest"></li>
                </div>
            </div>
        </div>
        <div class="journal-panel-closer"></div>
    </div>
    <div class="journal-panel-body">
        <div class="journal-tab-list"></div>
        <div class="journal-tab-scroller">
            <div class="journal-tab-panel"></div>
            <!-- [D][기술원] 페이지네이션 추가 -->
            <div class="journal-pagination">
                <div class="journal-pagination-first" tabIndex="0"></div>
                <div class="journal-pagination-prev" tabIndex="0"></div>
                <div class="journal-pagination-button --active" tabIndex="0">1</div>
                <div class="journal-pagination-button" tabIndex="0">2</div>
                <div class="journal-pagination-next" tabIndex="0"></div>
                <div class="journal-pagination-last" tabIndex="0"></div>
            </div>
        </div>
    </div>
</div>
<!--// [E][기술원] 출처 영역 -->
