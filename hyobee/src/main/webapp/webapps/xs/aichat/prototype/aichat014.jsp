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
    <!-- [S][기술원] 그리드 테스트 -->
    <!-- <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/prototype/aichat014.js?version=<%=System.currentTimeMillis() %>"></script> -->
    <!--// [E][기술원] 그리드 테스트 -->
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
                        <i class="xfi xfi-ico_0325_sparkle" id="edit" aria-hidden="true"></i>
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
                                    <div class="text-area">aichat014.jsp</div>
                                </div>
                            </div>
                            <div class="list-view2-item">
                                <input type="checkbox" id="checkbox-1" title="대화 삭제" class="navigation-item-checkbox" />
                                <label for="checkbox-1" class="navigation-item-label"></label>
                                <div class="list-view2" chat_category="web_search">
                                    <div class="text-area">aichat014.jsp</div>
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
                            <p class="current-user__name">aichat014.jsp</p>
                            <p class="current-user__position">aichat014.jsp</p>
                        </div>
                        <div class="current-user__value">
                            <p class="current-user__affiliate">aichat014.jsp</p>
                        </div>
                    </div>
                    <div class="current-user__utility xui-invisible">
                        <a class="current-user__setting common-focusable" href="" target="_blank"></a>
                    </div>
                </div>
                <!-- [E] 관리자 진입 구좌 -->
            </div>
            <!-- [E] 좌측 영역 -->
  	        <!-- [S] 우측 영역 -->
            <div class="right chat-wrap">
                <!-- [S][기술원] -->
                <div class="journal-dashboard">
                    <div class="document-body">
                        <div class="xui-doc-wrapper">
                            <div class="contents-container">
                                <div class="xui-box searchbox">
                                    <div class="xui-box-head">
                                        <div class="xui-title" id="">
                                            <p>수집 저널 현황</p>
                                        </div>
                                        <div class="xui-actions">
                                            <button type="button" class="xui-button large" id="" style="display: block;">조회</button>
                                            <button type="button" class="xui-button base"  id="" style="display: block;">다운로드</button>
                                        </div>
                                    </div>
                                    <div class="xui-box-body">
                                        <form action="#" id="searchForm">
                                            <div class="row">
                                                <div class="cell s5">
                                                    <span class="th required" message-text="">기간 선택</span>
                                                    <label class="xui-input-label doublepicker required">
                                                        <input type="text" class="xuiform_date picker required from" id="requestDateFrom" name="requestDateFrom" message-tooltip="" xui-tooltip-title="" message-placeholder="" placeholder="FROM" link="requestDateTo" autocomplete="off" maxlength="10">
                                                    </label>
                                                    <p class="interval"></p>
                                                    <label class="xui-input-label doublepicker required">
                                                        <input type="text" class="xuiform_date picker required to" id="requestDateTo" name="requestDateTo" message-tooltip="" xui-tooltip-title="" message-placeholder="" placeholder="TO" link="requestDateFrom" autocomplete="off" maxlength="10">
                                                    </label>
                                                    <div class="setDate">
                                                        <span message-text="" message-tooltip="" xui-tooltip-title="">최근 1년</span>
                                                        <span message-text="" message-tooltip="" xui-tooltip-title="">최근 3년</span>
                                                        <span message-text="" message-tooltip="" xui-tooltip-title="">최근 5년</span>
                                                    </div>
                                                </div>
                                                <div class="cell s3">
                                                    <span class="th" message-text="">구분</span>
                                                    <div class="form-group" id="">
                                                        <label class="xui-checkbox-label checked">
                                                            <input type="checkbox" id="" name="" xui-tooltip-title="" on="" off="" checked="">
                                                            <span>Paper</span>
                                                        </label>
                                                        <label class="xui-checkbox-label checked">
                                                            <input type="checkbox" id="" name="" xui-tooltip-title="" on="" off="" checked="">
                                                            <span>Patent</span>
                                                        </label>
                                                        <label class="xui-checkbox-label checked">
                                                            <input type="checkbox" id="" name="" xui-tooltip-title="" on="" off="" checked="">
                                                            <span>News</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="cell s4">
                                                    <span class="th" message-text="">고유번호</span>
                                                    <label class="xui-input-label">
                                                        <input type="text" class="lang" id="" name="" message-tooltip="" xui-tooltip-title="" message-placeholder="" placeholder="DOI 또는 출원번호" autocomplete="off">
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="cell s3">
                                                    <span class="th" message-text="">번호</span>
                                                    <label class="xui-input-label">
                                                        <input type="text" class="lang" id="" name="" message-tooltip="" xui-tooltip-title="" message-placeholder="" placeholder="수집 번호 검색" autocomplete="off">
                                                    </label>
                                                </div>
                                                <div class="cell s5">
                                                    <span class="th long" message-text="">키워드 검색</span>
                                                    <label class="xui-input-label">
                                                        <input type="text" class="lang" id="" name="" message-tooltip="" xui-tooltip-title="" message-placeholder="" placeholder="제목, 내용 및 AI 핵심요약" autocomplete="off">
                                                    </label>
                                                </div>
                                                <div class="cell s4">
                                                    <span class="th" message-text="">작성자</span>
                                                    <label class="xui-input-label">
                                                        <input type="text" class="lang" id="" name="" message-tooltip="" xui-tooltip-title="" message-placeholder="" placeholder="이름 또는 기관" autocomplete="off">
                                                    </label>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div class="xui-doc-wrapper-row">
                                    <div class="xui-container">
                                        <div class="xui-box gridbox">
                                            <div class="xui-box-head">
                                                <div class="xui-title">
                                                    <p>저널 목록</p>
                                                </div>
                                            </div>
                                            <div class="xui-box-body h-auto">
                                                <div class="xui-grid-container">
                                                    <!-- [S][기술원] 목록으로 보기의 경우 -->
                                                    <div id="divGrid01" style="min-height: 930px; border: 1px solid red;"></div>
                                                    <div class="journal-reco-summary-dialog --active" style="top: 0 !important;">
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
                                                    <!--// [E][기술원] 목록으로 보기의 경우 -->
                                                    <!-- [S][기술원] 표지로 보기의 경우 -->
                                                    <div class="report-checkerboard">
                                                        <div class="report-checkerboard-list">
                                                            <li class="report-checkerboard-item">
                                                                <div class="report-checkerboard-cover">
                                                                    <span class="report-checkerboard-content">
                                                                        <span class="report-checkerboard-tag">통합</span>
                                                                        <span class="report-checkerboard-date">2026.01</span>
                                                                        <span class="report-checkerboard-title ellipsis">제목</span>
                                                                        <span class="report-checkerboard-period">2026-01-01 ~ 2026-01-01</span>
                                                                        <span class="report-checkerboard-team">팀</span>
                                                                    </span>
                                                                    <span class="report-checkerboard-buttons">
                                                                        <span class="report-checkerboard-button">읽기</span>
                                                                        <span class="report-checkerboard-button">다운로드</span>
                                                                    </span>
                                                                    <span class="report-checkerboard-overlay">
                                                                        <span class="report-checkerboard-description">내용</span>
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        </div>
                                                    </div>
                                                    <!--// [E][기술원] 표지로 보기의 경우 -->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="main-footer">
                                <footer>
                                    <div class="footer-inner">
                                        <div class="footer" id="btnLogo">
                                            <div class="footer-logo"></div>
                                            <!--
                                            <div class="service">C-Cube2.0</div>
                                            -->
                                        </div>
                                        <div class="footer-addr">
                                            <ul>
                                                <!-- <li><a href="#none" id="btnPrivatePolicy">개인정보처리방침</a></li> -->
                                                <li><address id="testLink">© 2024 by HYOSUNG ITX. All rights reserved.</address></li>
                                            </ul>
                                        </div>
                                    </div>
                                </footer>
                        </div>
                        </div>
                    </div>
                </div>
                <!-- [E][기술원] -->
            </div>
            <!-- [E] 우측 영역 -->
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
            // AI 요약 클릭 시 툴팁 노출
            $(".journal-reco-summary-button").click(function( event ){
                console.log("d");
                event.stopPropagation();
                $(this).siblings(".journal-reco-summary-dialog").addClass("--active");
                 $(document).on("click", function (e) {
                    if (!$(e.target).closest(".journal-reco-summary-dialog").length) {
                        $(".journal-reco-summary-dialog").removeClass("--active");
                    }
                });
            })
        })();
    </script>
    <!-- [D][기술원] 테스트 -->
</body>
</html>