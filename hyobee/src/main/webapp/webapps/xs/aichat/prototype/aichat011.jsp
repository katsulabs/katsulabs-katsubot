<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/webapps/xs/core/xui/xuiprelude.jsp" %>
<!DOCTYPE html>
<html>
<head>
    <title>Ask Hyobee</title>
    <!-- 공통include -->
    <jsp:include page="/webapps/xs/core/xui/xuicore.jsp" flush="false"></jsp:include>
    <!-- 화면script -->
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/xui-log.js?version=<%=System.currentTimeMillis() %>"></script>
    <!--
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/prototype/aichat010.js?version=<%=System.currentTimeMillis() %>"></script>
    -->
    <!-- 화면CSS -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/html/xs/aichat/css/aichat010.css?version=<%=System.currentTimeMillis() %>"/>

    <!-- 라이브러리 내재화-->
    <script src="${pageContext.request.contextPath}/html/xs/aichat/js/lib/marked.min.js"></script>
    <link rel="stylesheet" href="/html/xs/core/xui/js/opensources/katex/katex.min.css">
    <script src="/html/xs/core/xui/js/opensources/katex/katex.min.js"></script>
    <script src="/html/xs/core/xui/js/opensources/katex/contrib/auto-render.min.js"></script>
    <script src="/html/xs/core/xui/js/opensources/highlight/highlight.min.js"></script>
    <script type="text/javascript">
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll("pre code").forEach((block) => {
                hljs.highlightElement(block);
            });
        });
    </script>
</head>
<body id="aichatBody">
    <!-- [D][기술원] 기술원의 경우 .--journal 추가 //-->
  	<div class="window-popup --journal">
        <!-- [D] 펼침 상태일 경우: .--expanded 삭제 //-->
        <div class="contents aside">
            <!-- [S] 좌측 영역 -->
            <div class="left-unfolded">
                <div class="window-popup-header">
                    <div class="btn aside-button" tabIndex="0">
                        <i class="aside-button-stick"></i>
                        <i class="aside-button-stick"></i>
                        <i class="aside-button-stick"></i>
                    </div>
                    <b class="ask-cubee">Ask Hyobee</b>
                    <form action="#" id="searchForm" class="--offscreen">
                        <input type="hidden" class="required" id="user_id" name="user_id" value="" style="width: 50px;"/>
                        <input type="hidden" class="required" id="pg_code" name="pg_code" value="" style="width: 50px;"/>
                        <input type="hidden" class="required" id="pu_code" name="pu_code" value="" style="width: 50px;"/>
                        <input type="hidden" class="required" id="team_code" name="team_code" value="" style="width: 50px;"/>
                        <input type="hidden" class="required" id="corp_code" name="corp_code" value="" style="width: 50px;"/>
                        <input type="hidden" class="required" id="user_full_name" name="user_full_name" value="" style="width: 50px;"/>
                        <input type="hidden" class="required" id="user_first_name" name="user_first_name" value="" style="width: 50px;"/>
                    </form>
                </div>
                <div class="bottom">
                    <!-- [D] 비활성 상태의 경우: .--disabled 추가  //-->
                    <div class="window-popup-btn common-focusable-state" id="btn-write" tabIndex="0">
                        <i class="xfi xfi-ico_0018_edit" id="edit" aria-hidden="true"></i>
                        <div class="in-txt">새 대화 시작하기</div>
                    </div>
                    <div class="window-popup-btn common-focusable-state chat-history" id="" tabIndex="0">
                        <i class="xfi xfi-ico_0340_delete_history" id="" aria-hidden="true"></i>
                        <i class="xfi xfi-ico_0175_arrow_prev" id="" aria-hidden="true"></i>
                        <div class="in-txt">대화 삭제</div>
                    </div>
                    <!-- [S][기술원] 버튼 추가 -->
                    <div class="window-popup-btn common-focusable-state" id="" tabIndex="0">
                        <i class="xfi xfi-ico_0160_article" id="edit" aria-hidden="true"></i>
                        <div class="in-txt">저널</div>
                    </div>
                    <div class="window-popup-btn common-focusable-state" id="" tabIndex="0">
                        <i class="xfi xfi-ico_0324_ai_note" id="edit" aria-hidden="true"></i>
                        <div class="in-txt">리포트</div>
                    </div>
                    <!--// [E][기술원] 버튼 추가 -->
                    <!-- [S] 대화 이력이 있는 경우 -->
                    <!-- [D] 삭제 상태의 경우: .--delete 추가 //-->
                    <div class="current navigation">
                        <div class="sub-title">
                            <div class="div">
                                <input type="checkbox" id="checkbox-all" title="최근 대화 목록" class="navigation-item-checkbox" />
                                <label for="checkbox-all" class="navigation-item-label"></label>
                                최근 대화 목록
                            </div>
                            <div class="chat-delete common-focusable" tabIndex="-1">
                                <i class="xfi xfi-ico_0042_delete" id="btn-delete" aria-hidden="true"></i>
                            </div>
                            <div class="folder-button common-focusable">
                                <i class="xfi xfi-ico_0002_arrow_down_line_nor" id="" aria-hidden="true"></i>
                            </div>
                            <!--
                            <div class="btn3 chat-history common-focusable" tabIndex="0">
                                <i class="xfi xfi-ico_0225_history" id="" aria-hidden="true"></i>
                                <i class="xfi xfi-ico_0340_delete_history" id="" aria-hidden="true"></i>
                                <i class="xfi xfi-ico_0175_arrow_prev" id="" aria-hidden="true"></i>
                            </div>
                            -->
                        </div>
                        <div class="list-view navigation-list" id="chatHistory">
                            <!-- [D] 선택된 경우 .on 추가 //-->
                            <div class="list-view2-item on">
                                <input type="checkbox" id="checkbox-0" title="대화 삭제" class="navigation-item-checkbox" />
                                <label for="checkbox-0" class="navigation-item-label"></label>
                                <div class="list-view2 on" chat_category="internal_rules">
                                    <div class="text-area">aichat011.jsp</div>
                                </div>
                            </div>
                            <div class="list-view2-item">
                                <input type="checkbox" id="checkbox-1" title="대화 삭제" class="navigation-item-checkbox" />
                                <label for="checkbox-1" class="navigation-item-label"></label>
                                <div class="list-view2" chat_category="web_search">
                                    <div class="text-area">aichat011.jsp</div>
                                </div>
                            </div>
                            <!-- [S] 더보기 -->
                            <div class="list-view2-item more-button" tabIndex="0">더보기</div>
                            <!-- [E]  더보기 -->
                        </div>
                    </div>
                    <!-- [E] 대화 이력이 있는 경우 -->
                    <!-- [S] 대화 이력이 없는 경우 -->
                    <!-- [S][기술원] 문구 수정 -->
                    <div class="empty" id="noChatHistory">
                        대화 이력이 존재하지 않습니다.<br />
                        새 대화를 시작해보세요!
                    </div>
                    <!--// [E][기술원] 문구 수정 -->
                    <!-- [E] 대화 이력이 없는 경우 -->
                </div>
                <!-- [S] 관리자 진입 구좌 -->
                <div class="current-user">
                    <div class="current-user__content --theme0" style="--firstName: &quot;A&quot;;">
                        <div class="current-user__key">
                            <p class="current-user__name">aichat011.jsp</p>
                            <p class="current-user__position">aichat011.jsp</p>
                        </div>
                        <div class="current-user__value">
                            <p class="current-user__affiliate">aichat011.jsp</p>
                        </div>
                    </div>
                    <div class="current-user__utility">
                        <!-- [S] 260529 : 추천 저널 설정 -->
                        <button
                            type="button"
                            class="current-user__setting common-focusable"
                        ></button>
                        <div class="current-user__dropdown">
                            <div class="current-user__menu-list">
                                <div class="current-user__menu-item lang">
                                    <div class="current-user__menu-text">언어 설정</div>
                                    <div class="current-user__language">
                                        <div class="current-user__language-text">한국어</div>
                                        <div class="current-user__language-list">
                                            <div class="current-user__language-item">한국어</div>
                                            <div class="current-user__language-item">English</div>
                                            <div class="current-user__language-item">中國語</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="current-user__menu-item user">
                                    <div class="current-user__menu-text">개인화 설정</div>
                                </div>
                                <button
                                    type="button"
                                    class="current-user__menu-item reco"
                                >
                                    <span class="current-user__menu-text">추천 저널 설정</span>
                                </button>
                                <div class="current-user__menu-item feed">
                                    <div class="current-user__menu-text">피드백 및 오류 신고</div>
                                </div>
                                <div class="current-user__menu-item admin">
                                    <div class="current-user__menu-text">관리자 화면 접속</div>
                                </div>
                            </div>
                            <!-- [E] 260529 : 추천 저널 설정 -->
                        </div>
                    </div>
                </div>
                <!-- [E] 관리자 진입 구좌 -->
                <!-- [S] 시스템 관리자 UI 추가 -->
                <div class="owner xui-invisible">
                    <div class="xui-box">
                        <form>
                            <div class="row">
                                <div class="cell">
                                    <label class="xui-combo-label">
                                        <input type="text" class="" id="" name="" readonly />
                                    </label>
                                    <button type="button" class="xui-button sub allowed" id="" authtype="">로그아웃</button>
                                </div>
                            </div>
                        </form>
                   </div>
                </div>
                <!-- [E] 시스템 관리자 UI 추가 -->
            </div>
            <!-- [E] 좌측 영역 -->
  	        <!-- [S] 우측 영역 -->
            <div class="right chat-wrap">
                <!-- [D] 대화 영역 테마
                    a. 사내 검색(파란색)일 경우: .--corp 추가
                    b. 웹 검색(노란색)일 경우: .--web 추가
                    c. 대화를 시작한 경우: .--ing 추가
                //-->
                <div class="container chat-container --corp --ing" id="container">
                    <div class="chat-type-group">
                        <div class="chat-type --corp">
                            <div id="intranet" data-id="internal_rules" class="chat-type-button active">사내검색</div>
                            <div id="web" data-id="web_search" class="chat-type-button">웹검색</div>
                        </div>
                    </div>
                    <div class="chat-content">
                        <div class="welcome-message">aichat011.jsp</div>
                        <!-- [S][기술원] 버튼 추가 -->
                        <div class="journal-buttons --active">
                            <div class="journal-button --thesis" tabIndex="0">논문</div>
                            <div class="journal-button --patent" tabIndex="0">특허</div>
                            <div class="journal-button --article" tabIndex="0">기사</div>
                        </div>
                        <!--// [E][기술원] 버튼 추가 -->
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
                            <div class="chat-message"  id="box">
                                <!-- [S][기술원] 홈메인에서 추천(3) 클릭한 경우 -->
                                <div class="chat --a">
                                    <div class="bubble --block">
                                        <h3>홈메인에서 추천(3)을 클릭한 경우</h3>
                                        <div class="journal-reco">
                                            <div class="journal-reco-header">
                                                <p class="journal-reco-heading">제목</p>
                                                <div class="journal-reco-summary">
                                                    <div class="journal-reco-summary-button" tabIndex="0">AI 요약</div>
                                                    <!-- [D][기술원] 팝업 노출 시 .--active 추가 //-->
                                                    <!-- [S][기술원] AI 핵심 요약이 없거나 응답이 끊긴 경우 추가 -->
                                                    <div class="journal-reco-summary-dialog">
                                                        <p class="journal-reco-summary-title">AI 핵심요약</p>
                                                        <div class="journal-reco-summary-content">
                                                            <p class="journal-reco-summary-description">요약된 내용이 없습니다.</p>
                                                            <!--
                                                            <p class="journal-reco-summary-description">효비가 응답하지 않습니다. 다시 시도해주세요.</p>
                                                            <p class="journal-reco-summary-description">요약을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.</p>
                                                            -->
                                                        </div>
                                                        <div class="journal-reco-summary-content --notice">
                                                            <p class="journal-reco-summary-description">10초 후에 재시도 합니다.</p>
                                                            <div class="journal-reco-summary-retry" tabIndex="0">수동시작</div>
                                                        </div>
                                                    </div>
                                                    <!-- [E][기술원] AI 핵심 요약이 없거나 응답이 끊긴 경우 추가 -->
                                                </div>
                                                <div class="journal-reco-detail" tabIndex="0">상세보기</div>
                                            </div>
                                            <ul class="journal-reco-list">
                                                <li class="journal-reco-item">저널 : 이름</li>
                                                <li class="journal-reco-item">저자 : 이름</li>
                                                <li class="journal-reco-item">게제일 : YYYY년 MM월</li>
                                            </ul>
                                        </div>
                                        <div class="journal-reco">
                                            <div class="journal-reco-header">
                                                <p class="journal-reco-heading">제목</p>
                                                <div class="journal-reco-summary">
                                                    <div class="journal-reco-summary-button" tabIndex="0">AI 요약</div>
                                                    <!-- [D][기술원] 팝업 노출 시 .--active 추가 //-->
                                                    <div class="journal-reco-summary-dialog">
                                                        <p class="journal-reco-summary-title">AI 핵심요약</p>
                                                        <div class="journal-reco-summary-content">
                                                            <span class="journal-reco-summary-tag">서론</span>
                                                            <p class="journal-reco-summary-description">내용</p>
                                                        </div>
                                                        <div class="journal-reco-summary-content">
                                                            <span class="journal-reco-summary-tag">본론</span>
                                                            <p class="journal-reco-summary-description">내용</p>
                                                        </div>
                                                        <div class="journal-reco-summary-content">
                                                            <span class="journal-reco-summary-tag">결론</span>
                                                            <p class="journal-reco-summary-description">내용</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="journal-reco-detail" tabIndex="0">상세보기</div>
                                            </div>
                                            <ul class="journal-reco-list">
                                                <li class="journal-reco-item">저널 : 이름</li>
                                                <li class="journal-reco-item">저자 : 이름</li>
                                                <li class="journal-reco-item">게제일 : YYYY년 MM월</li>
                                            </ul>
                                        </div>
                                        <div class="journal-reco">
                                            <div class="journal-reco-header">
                                                <p class="journal-reco-heading">제목</p>
                                                <div class="journal-reco-summary">
                                                    <div class="journal-reco-summary-button" tabIndex="0">AI 요약</div>
                                                    <!-- [D][기술원] 팝업 노출 시 .--active 추가 //-->
                                                    <div class="journal-reco-summary-dialog">
                                                        <p class="journal-reco-summary-title">AI 핵심요약</p>
                                                        <div class="journal-reco-summary-content">
                                                            <span class="journal-reco-summary-tag">서론</span>
                                                            <p class="journal-reco-summary-description">내용</p>
                                                        </div>
                                                        <div class="journal-reco-summary-content">
                                                            <span class="journal-reco-summary-tag">본론</span>
                                                            <p class="journal-reco-summary-description">내용</p>
                                                        </div>
                                                        <div class="journal-reco-summary-content">
                                                            <span class="journal-reco-summary-tag">결론</span>
                                                            <p class="journal-reco-summary-description">내용</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="journal-reco-detail" tabIndex="0">상세보기</div>
                                            </div>
                                            <ul class="journal-reco-list">
                                                <li class="journal-reco-item">저널 : 이름</li>
                                                <li class="journal-reco-item">저자 : 이름</li>
                                                <li class="journal-reco-item">게제일 : YYYY년 MM월</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="util-box">
                                        <div class="feedback">
                                            <div class="feedback-button " tabIndex="0">
                                                <i class="xfi xfi-ico_0114_thumb_up" id="thumb_up" aria-hidden="true"></i>
                                            </div>
                                            <div class="feedback-button " tabIndex="0">
                                                <i class="xfi xfi-ico_0226_thumb_down" id="thumb_down" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <div class="copy common-focusable" tabIndex="0">
                                            <i class="xfi xfi-ico_0069_content_copy" name="content_copy" aria-hidden="true"></i>
                                        </div>
                                        <!-- [S] 출처 버튼 추가 -->
                                        <div class="journal-status-bar">
                                            <div class="journal-status-comment --all" tabIndex="0">
                                                출처
                                                <span class="journal-status-count">5</span>
                                            </div>
                                        </div>
                                        <!-- [E] 출처 버튼 추가 -->
                                    </div>
                                </div>
                                <!-- [S][기술원] 홈메인에서 추천(3) 클릭한 경우 -->
                                <!-- [S][기술원] 저널 검색한 경우 -->
                                <div class="chat --a">
                                    <div class="bubble --block">
                                        <div class="journal-status-bar">
                                            <div class="journal-status-button --thesis" tabIndex="0">0</div>
                                            <div class="journal-status-button --patent" tabIndex="0">99</div>
                                            <div class="journal-status-button --article" tabIndex="0">999</div>
                                            <div class="journal-status-button --corp" tabIndex="0">9999</div>
                                            <div class="journal-status-comment --all" tabIndex="0">
                                                <span class="journal-status-count">99999</span>개의 출처를 찾았습니다.
                                            </div>
                                        </div>
                                        <h3>저널 검색한 경우</h3>
                                    </div>
                                    <div class="util-box">
                                        <div class="feedback">
                                            <div class="feedback-button " tabIndex="0">
                                                <i class="xfi xfi-ico_0114_thumb_up" id="thumb_up" aria-hidden="true"></i>
                                            </div>
                                            <div class="feedback-button " tabIndex="0">
                                                <i class="xfi xfi-ico_0226_thumb_down" id="thumb_down" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <div class="copy common-focusable" tabIndex="0">
                                            <i class="xfi xfi-ico_0069_content_copy" name="content_copy" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                </div>
                                <!--// [E][기술원] 저널 검색한 경우 -->
                            </div>
                        </div>
                        <!-- [E] 대화 영역-->
                        <div class="user-interface">
                            <div class="user-interface-wrap">
                                <div id="fileDisplayArea" class="file-list">
                                </div>
                                <!-- [D] 입력된 값이 없을 경우: .--empty 추가 -->
                                <!-- [D] 입력된 값이 개행될 경우: .--wrap 추가 -->
                                <div class="user-field --empty">
                                    <textarea id="inputArea" class="text-field" placeholder="aichat011.jsp"></textarea>
                                    <!-- 숨겨진 파일 입력 요소 -->
                                    <input type="file" id="fileInput" multiple style="display: none;" accept=".jpg,.jpeg,.png,.gif,.bmp,.doc,.docx,.hwp,.hwpx,.pdf,.xls,.xlsx,.ppt,.pptx,.txt">
                                    <!-- 첨부된 파일 목록 -->
                                    <div class="attached-files" id="attachedFiles" style="display: none;">
                                    </div>
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
                                    <!-- [S][기술원] 버튼 추가 -->
                                    <div class="journal-search --active" tabIndex="0">
                                        <i class="xfi xfi-ico_0350_bulb" id="" aria-hidden="true"></i>
                                    </div>
                                    <!--// [E][기술원] 버튼 추가 -->
                                    <!-- [D] 심층 검색 선택된 경우: .--active 추가 //-->
                                    <!--
                                    <div class="deep-search" tabIndex="0">
                                        <i class="xfi xfi-ico_0337_insight" id="ico_0337_insight" aria-hidden="true"></i>
                                    </div>
                                    -->
                                    <!-- [D] 20480 이상 시도할 경우: .--active 추가 //-->
                                    <p class="feedback-message">20480자까지 입력 가능합니다.</p>
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
                 <div class="chat-info">
                      <div class="chat-info-message">Hyobee의 응답은 부정확할 수 있습니다.</div>
                      <div class="chat-info-group">
                          <div id="how_to_use" class="chat-info-message">사용법이 궁금하세요?</div>
                          <div id="howToUseModal" class="modal">
                              <div class="modal-content">
                                  <div class="tooltip-header">
                                      <b class="header-cubee">Hyobee 사용법을 알려드려요!</b>
                                      <div class="header-div">사용자의 검색 의도와 문맥을 빠르게 이해하여 관련성이 높은 답변을 제공하는 기능입니다.</div>
                                      <img class="divider-icon" alt="">
                                  </div>
                                  <div class="tooltip-list-view">
                                      <b class="list-b">사내검색</b>
                                      <div class="description">
                                          <div class="tooltip-div">
                                              <p class="tooltip-p">효성 업무 서식·규정 게시판 정보를 기반으로 답변을 도와드립니다.</p>
                                              <p class="tooltip-p">
                                                  <span>현재 </span>
                                                  <b class="tooltip-b" id='tooltip-name'>홍시원 팀장</b>
                                                  <span class="tooltip-b">님은 아래 게시판에 접근할 수 있습니다.</span>
                                              </p>
                                          </div>
                                          <div class="frame-parent" id="boardsAuth">
                                              <div class="wrapper">
                                                      <div class="tooltip-div">업무 서식 게시판</div>
                                              </div>
                                              <div class="wrapper">
                                                      <div class="tooltip-div">규정 게시판, 성분 연구팀 업무 게시판  </div>
                                              </div>
                                              <div class="wrapper">
                                                      <div class="tooltip-div">성분 연구팀 업무 게시판  </div>
                                              </div>
                                          </div>
                                          <div class="tooltip-div">
                                              <p class="tooltip-p">💡 궁금한 내용을 말씀해 주시면, 관련 게시판 링크와 함께 정확한 정보를 찾아드릴게요. </p>
                                              <p class="tooltip-p">💡 키워드와 요청사항을 구체적으로 말씀해주시면 더 정확한 답변이 가능합니다.</p>
                                          </div>
                                      </div>
                                      <img class="divider-icon" alt="">
                                  </div>
                                  <div class="tooltip-list-view">
                                      <b class="list-b">웹검색</b>
                                      <img class="divider-icon2" alt="">
                                      <div class="tooltip-description">
                                              <div class="tooltip-div">
                                                  <p class="tooltip-p">웹의 다양한 출처를 바탕으로 최신 정보를 빠르게 찾아드려요!</p>
                                                  <p class="tooltip-p">궁금한 주제나 키워드를 입력해 주세요. 최신 뉴스, 트렌드, 통계, 정책 등 웹 기반 자료를 중심으로 요약해드릴게요.</p>
                                                  <!--
                                                  <p class="tooltip-p">&nbsp;</p>

                                                  <p class="tooltip-p">💡 대화 중 언제든 채팅창 하단 토글을 이용해 심층 검색 모드를 선택할 수 있습니다.</p>
                                                  -->
                                              </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                       <i class="current-type-message"></i>
                 </div>
                 <div class="banner-message">내용이 복사되었습니다.</div>
                 <!-- <div class="toast-message">내용이 복사되었습니다.</div> -->
                 <!-- [S] 260529 : 추천 저널 설정 -->
                 <div class="common-dialog">
                    <div class="common-dialog__document">
                        <div class="common-dialog__head">
                            <p class="common-dialog__heading">추천저널 설정</p>
                            <button
                                type="button"
                                class="common-dialog__close"
                            ></button>
                        </div>
                        <div class="common-dialog__body">
                            <div class="common-dialog__content">
                                <p class="common-dialog__title">추천 대상 선택</p>
                                <div class="common-dialog__selection">
                                    <span class="common-dialog__select-text">팀</span>
                                    <div class="common-dialog__select">
                                        <div class="common-dialog__option">팀</div>
                                        <div class="common-dialog__option">팀</div>
                                        <div class="common-dialog__option">팀</div>
                                    </div>
                                </div>
                            </div>
                            <div class="common-dialog__buttons">
                                <button
                                    type="button"
                                    class="common-dialog__confirm"
                                >저장</button>
                            </div>
                        </div>
                    </div>
                 </div>
                 <!-- [E] 260529 : 추천 저널 설정 -->
            </div>
            <!-- [E] 우측 영역 -->
            <!-- [S][기술원] 출처 영역 -->
            <!-- [D][기술원] 출처 영역 노출 시: .--active 추가 //-->
            <div class="journal-panel --active">
                <div class="journal-panel-head">
                    <div class="journal-result">
                        <p class="journal-result-message">
                            <span class="journal-result-count">99999</span>개의 출처를 찾았습니다.
                        </p>
                        <div class="journal-sorting">
                            <div class="journal-sorting-button" tabIndex="0">유사도순</div>
                            <!-- [D][기술원] 정렬 노출 시: .--active 추가 //-->
                            <div class="journal-sorting-list">
                                <li class="journal-sorting-item" tabIndex="0">유사도순</li>
                                <li class="journal-sorting-item" tabIndex="0">최신순</li>
                            </div>
                        </div>
                    </div>
                    <div class="journal-panel-closer"></div>
                </div>
                <div class="journal-panel-body">
                    <div class="journal-tab-list">
                        <!-- [D][기술원] 선택된 경우: .--active 추가 //-->
                        <div class="journal-tab-button --all --active" tabIndex="0">
                            <span class="journal-tab-text">전체</span>
                            <span class="journal-tab-count">0</span>
                        </div>
                        <div class="journal-tab-button --thesis" tabIndex="0">
                            <span class="journal-tab-text">논문</span>
                            <span class="journal-tab-count">99</span>
                        </div>
                        <div class="journal-tab-button --patent" tabIndex="0">
                            <span class="journal-tab-text">특허</span>
                            <span class="journal-tab-count">999</span>
                        </div>
                        <div class="journal-tab-button --article" tabIndex="0">
                            <span class="journal-tab-text">기사</span>
                            <span class="journal-tab-count">9999</span>
                        </div>
                        <div class="journal-tab-button --corp" tabIndex="0">
                            <span class="journal-tab-text">사내검색</span>
                            <span class="journal-tab-count">99999</span>
                        </div>
                    </div>
                    <div class="journal-tab-scroller">
                        <div class="journal-notice">
                            <!-- [D] 260506: 다국어 적용 -->
                            <div class="journal-notice-message">Wipson 키워드 기반의 비실시간 정보입니다.</div>
                        </div>
                        <div class="journal-tab-panel">
                            <div class="journal-content" tabIndex="0">
                                <div class="journal-content-subject">
                                    <!-- [D][기술원] 유형
                                        1. 논문일 경우: .--thesis 추가
                                        2. 특허일 경우: .--patent 추가
                                        3. 기사일 경우: .--article
                                        4. 사내 검색일 경우: .--corp 추가
                                    //-->
                                    <span class="journal-content-type --thesis">논문</span>
                                    <span class="journal-content-key">QWER1234</span>
                                </div>
                                <p class="journal-content-title">제목</p>
                                <p class="journal-content-author">저자</p>
                                <div class="journal-content-info">
                                    <span class="journal-content-date">YYYY.MM.DD</span>
                                    <span class="journal-content-similar">
                                        <span class="journal-content-similar-text">유사도</span>
                                        <span class="journal-content-similar-value">0.0</span>
                                        <!-- [D][기술원] 유사도 프로그래스: --similar 변수에 퍼센트로 적용 //-->
                                        <span class="journal-content-similar-percent" style="--similar: 0%;"></span>
                                        <!-- [D][기술원] 보조 결과의 경우 -->
                                        <span class="similar-tag low">보조자료</span>
                                        <span class="similar-tag keyword">Keyword</span>
                                    </span>
                                </div>
                            </div>
                            <div class="journal-content" tabIndex="0">
                                <div class="journal-content-subject">
                                    <span class="journal-content-type --patent">특허</span>
                                    <span class="journal-content-key">QWER1234</span>
                                </div>
                                <p class="journal-content-title">제목</p>
                                <p class="journal-content-author">저자</p>
                                <div class="journal-content-info">
                                    <span class="journal-content-date">YYYY.MM.DD</span>
                                    <span class="journal-content-similar">
                                        <span class="journal-content-similar-text">유사도</span>
                                        <span class="journal-content-similar-value">0.33</span>
                                        <span class="journal-content-similar-percent" style="--similar: 33%;"></span>
                                    </span>
                                </div>
                            </div>
                            <div class="journal-content" tabIndex="0">
                                <div class="journal-content-subject">
                                    <span class="journal-content-type --article">기사</span>
                                    <span class="journal-content-key">QWER1234</span>
                                </div>
                                <p class="journal-content-title">제목</p>
                                <p class="journal-content-author">저자</p>
                                <div class="journal-content-info">
                                    <span class="journal-content-date">YYYY.MM.DD</span>
                                    <span class="journal-content-similar">
                                        <span class="journal-content-similar-text">유사도</span>
                                        <span class="journal-content-similar-value">0.5</span>
                                        <span class="journal-content-similar-percent" style="--similar: 50%;"></span>
                                    </span>
                                </div>
                            </div>
                            <div class="journal-content" tabIndex="0">
                                <div class="journal-content-subject">
                                    <span class="journal-content-type --corp">사내검색</span>
                                    <span class="journal-content-key">QWER1234</span>
                                </div>
                                <p class="journal-content-title">제목</p>
                                <p class="journal-content-author">저자</p>
                                <div class="journal-content-info">
                                    <span class="journal-content-date">YYYY.MM.DD</span>
                                    <span class="journal-content-similar --sub">
                                        <span class="journal-content-similar-text">유사도</span>
                                        <span class="journal-content-similar-value">0.99</span>
                                        <span class="journal-content-similar-percent" style="--similar: 99%;"></span>
                                    </span>
                                </div>
                            </div>
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
            </div>
            <!--// [E][기술원] 출처 영역 -->
        </div>
  	</div>
<div class="--offscreen">
    <form name="attachForm">
        <table>
            <tr>
                <td><input type="hidden" id="email" name="email"></td>
                <td><input type="hidden" id="inputYn" name="inputYn"></td>
                <td><input type="hidden" id="serverUrl" name="serverUrl"></td>
                <td><input type="hidden" id="serverName" name="serverName"></td>
                <td><input type="hidden" id="legacyCharset" name="legacyCharset"></td>
                <td><input type="hidden" id="isSSO" name="isSSO"></td>
            </tr>
        </table>
    </form>
</div>

    <!-- [D][기술원] 테스트 -->
    <div class="tag_test_page">테스트</div>

    <script type="text/javascript" src="/html/xs/core/xui/js/jquery/core/jquery-3.5.1.min.js"></script>
    <script type="text/javascript">
        (function(){
            // 기술원 활성화 토글
            $(".journal-search").click(function(){
                $(this).add(".journal-buttons").toggleClass("--active");
            })

            // AI 요약 클릭 시 툴팁 노출
            $(".journal-reco-summary-button").click(function( event ){
                event.stopPropagation();
                var $btn = $(this);
                var $dialog = $btn.siblings(".journal-reco-summary-dialog");
                $(".journal-reco-summary-dialog").removeClass("--active --top --bottom --left --right");
                var rect = this.getBoundingClientRect();
                var space = {
                    top: rect.top,
                    bottom: window.innerHeight - rect.bottom,
                    left: rect.left,
                    right: window.innerWidth - rect.right
                };

                var vertical = space.top > space.bottom ? "bottom" : "top";
                var horizontal = space.left > space.right ? "right" : "left";
                $dialog.addClass("--active").addClass("--" + vertical).addClass("--" + horizontal);

                $(document).on("click", function (e) {
                    if (!$(e.target).closest(".journal-reco-summary-dialog").length) {
                        $(".journal-reco-summary-dialog").removeClass("--active");
                    }
                });
            })

            // 출처 클릭 시 패널 노출
            $(".journal-status-button, .journal-status-comment").click(function(){
                var typeClass = $(this).attr("class")
                    .split(/\s+/)
                    .find(c => c.startsWith("--"))
                ;

                $(".journal-tab-button").removeClass("--active");
                $(".journal-tab-button." + typeClass).addClass("--active");
                $(".journal-panel").addClass("--active");
            });

            $(".journal-panel-closer").click(function(){
                $(".journal-panel").removeClass("--active");
                $(".journal-tab-button").removeClass("--active");
            })

            // 정렬 방법 드롭다운
            $(".journal-sorting-button").click(function(event){
                event.stopPropagation();
                $(this).siblings(".journal-sorting-list").addClass("--active");
                 $(document).on("click", function (e) {
                    if (!$(e.target).closest(".journal-sorting-list").length) {
                        $(".journal-sorting-list").removeClass("--active");
                    }
                });
            })

            // 탭
            $(".journal-tab-button").click(function(){
                $(".journal-tab-button").removeClass("--active");
                $(this).addClass("--active");
            })

            // [S] 260529 : 추천 저널 설정
            $(".current-user__setting").click(function(){$(this).add(".current-user__dropdown").toggleClass("active");});
            $(".current-user__language").click(function(){$(this).add(".current-user__language-list").toggleClass("active");});
            $(".current-user__menu-item.reco").click(function(){
                $(".current-user__setting, .current-user__dropdown, .current-user__language.current-user__language-list").removeClass("active");
                $(".common-dialog").addClass('active');
            });
            $(".common-dialog__close").click(function(){
                $(".common-dialog, .common-dialog__selection, .common-dialog__select").removeClass("active");
            })
            $(".common-dialog__selection").click(function(){$(this).add(".common-dialog__select").toggleClass("active");});
            // [E] 260529 : 추천 저널 설정
        })();
    </script>
    <!-- [D][기술원] 테스트 -->
</body>
</html>