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
<body id="journalDetailBody">
    <!-- [D][기술원]
        1. 논문일 경우: .--thesis 추가
        2. 특허일 경우: .--patent 추가
        3. 기사일 경우: .--article 추가
    //-->
    <div class="journal-detail --thesis">
        <div class="journal-header">
            <p class="journal-heading">한글 제목</p>
            <p class="journal-breadcrumb">
                <span class="journal-breadcrumb-step --home">Hyobee</span>
                <span class="journal-breadcrumb-step">사내검색 - 오늘의 논문 추천</span>
                <span class="journal-breadcrumb-step --current">저널 상세</span>
            <p>
            <div class="journal-util">
                <div class="journal-view-count">0</div>
                <div class="journal-util-button">이 페이지를 공유</div>
                <div class="journal-util-button">인쇄</div>
                <div class="journal-util-button">다운로드</div>
            </div>
        </div>
        <div class="journal-main">
            <div class="journal-content">
                <div class="journal-title-group">
                    <p class="journal-title --ko">한글 제목</p>
                    <!-- [D][기술원] 북마크 설정 시: .--active 추가 //-->
                    <div class="journal-bookmark"></div>
                    <a href="#TBD" target="_blank" class="journal-share">
                        <span class="journal-tooltip">원본 논문 사이트가 새 창으로 열립니다.</span>
                    </a>
                </div>
                <p class="journal-title --en">영문 제목</p>
                <ul class="journal-info-list">
                    <li class="journal-info-item">
                        <span class="journal-info-key">저자</span>
                        <span class="journal-info-value">저자</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">학술지</span>
                        <span class="journal-info-value">학술지</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">연도</span>
                        <span class="journal-info-value">YYYY.MM.DD</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">발행기관</span>
                        <span class="journal-info-value">발행기관</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">권호사항</span>
                        <span class="journal-info-value">QWER1234</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">페이지</span>
                        <span class="journal-info-value">0</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">DOI.</span>
                        <a href="#TBD" target="_blank" class="journal-info-value">QWER1234</a>
                        <span class="journal-tooltip">원본 논문 사이트가 새 창으로 열립니다.</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">피인용</span>
                        <span class="journal-info-value">0</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">참고문헌</span>
                        <span class="journal-info-value">0</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">기자</span>
                        <span class="journal-info-value">기자</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">언론사</span>
                        <span class="journal-info-value">언론사</span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key">발행일</span>
                        <span class="journal-info-value">YYYY.MM.DD HH:mm</span>
                    </li>
                </ul>
                <div class="journal-summary">
                    <p class="journal-summary-title">AI 핵심요약</p>
                    <p class="journal-summary-paragraph">
                        description
                        <span class='--emphasis'>emphasis</span>
                        description
                    </p>
                    <div class="journal-summary-content">
                        <span class="journal-summary-tag">서론</span>
                        <p class="journal-summary-description">서론</p>
                    </div>
                    <div class="journal-summary-content">
                        <span class="journal-summary-tag">본론</span>
                        <p class="journal-summary-description">본론</p>
                    </div>
                    <div class="journal-summary-content">
                        <span class="journal-summary-tag">결론</span>
                        <p class="journal-summary-description">결론 <span class="--emphasis">결론</span> 결론</p>
                    </div>
                    <div class="journal-summary-content">
                        <span class="journal-summary-tag">문제점</span>
                        <p class="journal-summary-description">문제점</p>
                    </div>
                    <div class="journal-summary-content">
                        <span class="journal-summary-tag">해결책</span>
                        <p class="journal-summary-description">해결책</p>
                    </div>
                </div>
                <div class="journal-summary">
                    <p class="journal-summary-title">AI 핵심요약</p>
                </div>
            </div>
            <div class="journal-section">
                <div id="article0" class="journal-article">
                    <div class="journal-article-title">제목</div>
                    <p class="journal-article-subtitle">부제목</p>
                    <p class="journal-article-description">설명</p>
                    <div class="journal-article-acco-group">
                        <div class="journal-article-acco">
                            <p class="journal-article-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                        <div class="journal-article-acco-btn"></div>
                    </div>
                    <div class="journal-detail-image">
                        <img src="" alt="" />
                        <span class="journal-detail-alt">출처</span>
                    </div>
                    <div class="journal-article-title">
                        제목
                        <label class="xui-checkbox-label checked">
                            <input
                                type="checkbox"
                                id=""
                                name=""
                                class="checkbox-input"
                            />
                            <span  class="--emphasis">타 소재 포함</span>
                        </label>
                    </div>
                   <div class="journal-list">
                        <div class="journal-item" tabIndex="0">
                            <div class="journal-scroll">
                                <p class="journal-title">제목</p>
                                <p class="journal-author">저자</p>
                                <p class="journal-date">YYYY.MM.DD</p>
                            </div>
                        </div>
                        <div class="journal-item" tabIndex="0">
                            <div class="journal-scroll">
                                <p class="journal-title">제목</p>
                                <p class="journal-author">저자</p>
                                <p class="journal-date">YYYY.MM.DD</p>
                            </div>
                        </div>
                        <div class="journal-item" tabIndex="0">
                            <div class="journal-scroll">
                                <p class="journal-title">제목</p>
                                <p class="journal-author">저자</p>
                                <p class="journal-date">YYYY.MM.DD</p>
                            </div>
                        </div>
                        <!-- [S] 검색 결과가 없을 경우 -->
                        <div class="journal-item --empty">
                            <p class="journal-message">연관 저널이 존재하지 않습니다.</p>
                        </div>
                        <!-- [E] 검색 결과가 없을 경우 -->
                   </div>
               </div>
               <div id="article1" class="journal-article">
                    <div class="journal-article-title">제목</div>
                    <div class="journal-timelines">
                        <!-- [D][기술원] 시작일 ~ 종료일 날짜 비율을 var(--percent) 값으로 할당 //-->
                        <div class="journal-timeline" style="--percent: 10%;">
                            <div class="journal-timeline-state">상태</div>
                            <div class="journal-timeline-date">YYYY.MM.DD</div>
                        </div>
                        <div class="journal-timeline" style="--percent: 20%;">
                            <div class="journal-timeline-state">상태</div>
                            <div class="journal-timeline-date"></div>
                        </div>
                        <div class="journal-timeline" style="--percent: 60%;">
                            <div class="journal-timeline-state --active">상태</div>
                            <div class="journal-timeline-date">YYYY.MM.DD</div>
                        </div>
                    </div>
                    <table class="journal-table">
                        <caption class="journal-table-caption">
                            <span class="--text">table caption</span>
                            <a href="#tbd" target="_blank" class="--link">
                                <span class="journal-tooltip">특허 사이트가 새 창으로 열립니다.</span>
                            </a>
                            <span class="--legend">table legend</span>
                        </caption>
                        <thead>
                            <tr>
                                <th class="journal-table-heading">table heading</th>
                                <th class="journal-table-heading">table heading</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th class="journal-table-heading">table heading</th>
                                <td class="journal-table-data">table data</td>
                            </tr>
                            <tr>
                                <th class="journal-table-heading">table heading</th>
                                <td class="journal-table-data">table data</td>
                            </tr>
                            <tr>
                                <th class="journal-table-heading">table heading</th>
                                <td class="journal-table-data">table data</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="journal-table">
                        <caption class="journal-table-caption">
                            <span class="--text">table caption</span>
                            <a href="#tbd" target="_blank" class="--link"></a>
                            <span class="--legend">table legend</span>
                        </caption>
                        <colgroup>
                            <col style="width: 92px;" />
                            <col style="width: *;" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th class="journal-table-heading">table heading</th>
                                <th class="journal-table-heading">table heading</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th class="journal-table-heading">table heading</th>
                                <td class="journal-table-data">table data</td>
                            </tr>
                        </tbody>
                    </table>
                     <div class="journal-article-title">제목</div>
                     <div class="journal-graph">
                        <ul class="journal-graph-list">
                            <li class="journal-graph-item">
                                <span class="journal-graph-key">yyyy년</span>
                                <span class="journal-graph-value" style="--graph: 0%;"></span>
                                <span class="journal-graph-unit">0회</span>
                            </li>
                            <li class="journal-graph-item">
                                <span class="journal-graph-key">yyyy년</span>
                                <span class="journal-graph-value" style="--graph: 25%;"></span>
                                <span class="journal-graph-unit">25회</span>
                            </li>
                            <li class="journal-graph-item">
                                <span class="journal-graph-key">yyyy년</span>
                                <span class="journal-graph-value" style="--graph: 50%;"></span>
                                <span class="journal-graph-unit">50회</span>
                            </li>
                            <li class="journal-graph-item">
                                <span class="journal-graph-key">yyyy년</span>
                                <span class="journal-graph-value" style="--graph: 75%;"></span>
                                <span class="journal-graph-unit">75회</span>
                            </li>
                            <li class="journal-graph-item">
                                <span class="journal-graph-key">yyyy년</span>
                                <span class="journal-graph-value" style="--graph: 100%;"></span>
                                <span class="journal-graph-unit">100회</span>
                            </li>
                        </ul>
                     </div>
                </div>
                <div id="article2" class="journal-article">
                    <div class="journal-article-title">제목</div>
                   <div class="patent-list">
                        <div class="patent-item" tabIndex="0">
                            <div class="patent-scroll">
                                <p class="patent-title">제목</p>
                                <p class="patent-author">저자</p>
                                <p class="patent-date">YYYY.MM.DD</p>
                            </div>
                        </div>
                        <div class="patent-item" tabIndex="0">
                            <div class="patent-scroll">
                                <p class="patent-title">제목</p>
                                <p class="patent-author">저자</p>
                                <p class="patent-date">YYYY.MM.DD</p>
                            </div>
                        </div>
                        <div class="patent-item" tabIndex="0">
                            <div class="patent-scroll">
                                <p class="patent-title">제목</p>
                                <p class="patent-author">저자</p>
                                <p class="patent-date">YYYY.MM.DD</p>
                            </div>
                        </div>
                        <!-- [S] 검색 결과가 없을 경우 -->
                        <div class="patent-item --empty">
                            <p class="patent-message">연관 특허가 존재하지 않습니다.</p>
                        </div>
                        <!-- [E] 검색 결과가 없을 경우 -->
                   </div>
                    <div class="journal-article-title">제목</div>
                   <div class="news-list">
                       <div class="news-item" tabIndex="0">
                           <div class="news-scroll">
                               <p class="news-title">제목</p>
                               <p class="news-author">저자</p>
                               <p class="news-date">YYYY.MM.DD</p>
                           </div>
                       </div>
                       <div class="news-item" tabIndex="0">
                          <div class="news-scroll">
                              <p class="news-title">제목</p>
                              <p class="news-author">저자</p>
                              <p class="news-date">YYYY.MM.DD</p>
                          </div>
                      </div>
                      <div class="news-item" tabIndex="0">
                         <div class="news-scroll">
                             <p class="news-title">제목</p>
                             <p class="news-author">저자</p>
                             <p class="news-date">YYYY.MM.DD</p>
                         </div>
                     </div>
                     <!-- [S] 검색 결과가 없을 경우 -->
                     <div class="news-item --empty">
                         <p class="news-message">연관 기사가 존재하지 않습니다.</p>
                     </div>
                     <!-- [E] 검색 결과가 없을 경우 -->
                  </div>
                  <div class="journal-keywords">
                      <div class="journal-keyword">키워드</div>
                      <div class="journal-keyword">키워드</div>
                      <div class="journal-keyword">키워드</div>
                 </div>
                </div>
            </div>
        </div>
        <div class="journal-footer">
            <p class="journal-footer-logo">Ask Hyobee</p>
            <p class="journal-footer-copyright">ⓒ HYOSUNG ITX. ALL RIGHT RESERVED.</p>
        </div>
    </div>

    <!-- [D][기술원] article 개수만큼 버튼 추가 후, id 값 연결 필요(활성화 시: --active 추가) //-->
    <div class="journal-navigator">
        <div data-id="article0" class="journal-navigator-button --active" tabIndex="0">
            <span class="journal-navigator-title">제목</span>
        </div>
        <div data-id="article1" class="journal-navigator-button" tabIndex="0">
            <span class="journal-navigator-title">제목</span>
        </div>
        <div data-id="article2" class="journal-navigator-button" tabIndex="0">
            <span class="journal-navigator-title">제목</span>
        </div>
    </div>

    <!-- [D][기술원] 테스트 -->
    <div class="tag_test_page">테스트</div>

    <script type="text/javascript" src="/html/xs/core/xui/js/jquery/core/jquery-3.5.1.min.js"></script>
    <script type="text/javascript">
        (function(){
            // 연관 저널 랜덤 이미지 적용
            $('.journal-item').each(function(){
                var randomNum = Math.floor(Math.random() * 10);
                $(this).addClass('--type' + randomNum);
            });

            // 연관 특허 랜덤 이미지 적용
            $('.patent-item').each(function(){
                var randomNum = Math.floor(Math.random() * 6);
                $(this).addClass('--type' + randomNum);
            });

            // 우측 네비게이션 버튼 클릭하면 연결된 아티클로 이동
            $('.journal-navigator-button').on('click', function () {
                var $container = $('#journalDetailBody');
                var targetId = $(this).data('id');
                var $target = $('#' + targetId);

                $container.stop(true).animate({ scrollTop: $target.position().top - ($container.innerHeight() / 2) }, 400);
            });

            // 컨텐츠 스크롤할 경우
            $('#journalDetailBody').on('scroll', function(){
                var $container = $(this);
                var scrollTop = $container.scrollTop();
                var scrollHeight = $container[0].scrollHeight;
                var clientHeight = $container.innerHeight();
                var isTop = scrollTop === 0;
                var isBottom = scrollTop + clientHeight >= scrollHeight - 1;
                var $buttons = $('.journal-navigator-button');

                // 헤더 플로팅 시점
                $('.journal-header').toggleClass(
                    '--active',
                    scrollTop >  $('.journal-info-list').position().top
                );

                // 우측 네비게이션 활성화
                if (isTop) {
                    $buttons.removeClass('--active');
                    $buttons.first().addClass('--active');
                    return;
                }

                if (isBottom) {
                    $buttons.removeClass('--active');
                    $buttons.last().addClass('--active');
                    return;
                }

                let activeSet = false;
                $buttons.each(function(){
                    var $btn = $(this);
                    var $target = $('#' + $btn.data('id'));
                    var articleTop = $target.position().top;
                    if ((articleTop - scrollTop) - ($container.innerHeight() / 2) < 1) {
                        $buttons.removeClass('--active');
                        $btn.addClass('--active');
                        activeSet = true;
                    }
                });
                if (!activeSet) $buttons.first().addClass('--active');
            });

            // 아코디언
            $(".journal-article-acco-btn").click(function(){
                var target = $(this).closest(".journal-article-acco-group");
                target.toggleClass("--active");
            })
        })();
    </script>
    <!-- [D][기술원] 테스트 -->
</body>
</html>