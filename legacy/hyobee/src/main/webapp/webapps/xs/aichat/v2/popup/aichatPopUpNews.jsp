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
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/v2/popup/aichatPopUpNews.js?version=<%=System.currentTimeMillis() %>"></script>

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
    <div class="journal-detail --article --loading">
        <div class="journal-header">
            <p class="journal-heading">한글 제목</p>
            <p class="journal-breadcrumb">
                <span class="journal-breadcrumb-step --home">Hyobee</span>
                <span class="journal-breadcrumb-step" message-text="hyobee.journal.detail.menu.depth2"></span>
                <span class="journal-breadcrumb-step --current" message-text="hyobee.journal.detail.menu.depth3"></span>
            </p>
            <div class="journal-util">
                <div class="journal-view-count" style="display: none">0</div>
                <div class="journal-util-button" id="btn_share" style="display:none;">이 페이지를 공유</div>
                <div class="journal-util-button" id="btn_print" message-text="hyobee.journal.detail.action.print"></div>
                <div class="journal-util-button" id="btn_download" message-text="hyobee.journal.detail.action.download"></div>
            </div>
        </div>
        <div class="journal-main">
            <div class="journal-content">
                <div class="journal-title-group">
                    <p class="journal-title --ko" id="title"></p>
                    <div class="journal-focusables">
                        <!-- [D][기술원] 북마크 설정 시: .--active 추가
                        <div class="journal-bookmark"></div>
                        -->
                        <a href="#TBD" target="_blank" class="journal-share" id="url">
                            <span class="journal-tooltip" message-text="hyobee.journal.detail.tooltip.open_original.article"></span>
                        </a>
                    </div>
                </div>
                <p class="journal-title --en" id="title_en"></p>
                <ul class="journal-info-list">
                    <li class="journal-info-item">
                        <span class="journal-info-key" message-text="hyobee.journal.detail.lbl.reporter"></span>
                        <span class="journal-info-value" id="author"></span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key" message-text="hyobee.journal.detail.lbl.press"></span>
                        <span class="journal-info-value" id="source_table"></span>
                    </li>
                    <li class="journal-info-item">
                        <span class="journal-info-key" message-text="hyobee.journal.detail.lbl.publication_date"></span>
                        <span class="journal-info-value" id="date"></span>
                    </li>
                </ul>
                <div id="article0" class="journal-summary">
                    <p class="journal-summary-title" message-text="hyobee.journal.detail.lbl.ai_summary.title"></p>
                </div>
            </div>
            <div class="journal-section">
                <div id="article1" class="journal-article">
                    <div class="journal-article-title" id="news_main_topic"></div>
                    <!-- <p class="journal-article-subtitle" id="source_id"></p> -->
                    <div class="journal-detail-image">
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" id="image_url"/>
                        <span class="journal-detail-alt" id="media_name"></span>
                    </div>
                    <div id="content"></div>
                </div>
                <div id="article2" class="journal-article">
                    <div class="journal-article-title" message-text="hyobee.journal.detail.lbl.related_articles"></div>
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
                  </div>
                </div>
                <div id="article3" class="journal-article">
                    <p class="journal-article-title" message-text="hyobee.journal.detail.lbl.related_keywords"></p>
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
    <div id="journal-tooltip" style="display:none; position:absolute; pointer-events:none; z-index:9999;"></div>
    <div class="journal-navigator">
        <div data-id="article0" class="journal-navigator-button --active" tabIndex="0">
            <span class="journal-navigator-title" message-text="hyobee.journal.summary.title"></span>
        </div>
        <div data-id="article1" class="journal-navigator-button" tabIndex="0">
            <span class="journal-navigator-title" message-text="hyobee.journal.detail.lbl.article_content"></span>
        </div>
        <div data-id="article2" class="journal-navigator-button" tabIndex="0">
            <span class="journal-navigator-title" message-text="hyobee.journal.detail.lbl.related_journals"></span>
        </div>
        <div data-id="article3" class="journal-navigator-button" tabIndex="0">
            <span class="journal-navigator-title" message-text="hyobee.journal.section.related_keywords"></span>
        </div>
    </div>

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

                $container.stop(true).animate({ scrollTop: $target.position().top - ($container.innerHeight() / 2 - 60) }, 400);
            });

            // 컨텐츠 스크롤할 경우
            $('#journalDetailBody').on('scroll', function(){
                var $container = $(this);
                var scrollTop = $container.scrollTop();
                var scrollHeight = $container[0].scrollHeight;
                var clientHeight = $container.innerHeight();
                var isTop = scrollTop === 0;
                var isBottom = scrollTop + clientHeight >= scrollHeight - 1;
                var $buttons = $('.journal-navigator-button.xui-visible');

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
                    if ((articleTop - scrollTop) - ($container.innerHeight() / 2 - 60) < 1) {
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