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

    <style>
        html,
        body {
            width: 100%;
            min-width: unset;
            max-width: unset;
            height: auto;
            min-height: unset;
            max-height: unset;
            overflow: unset;
        }
    </style>
</head>
<body id="reportDetailBody">
    <div class="journal-report">
        <div class="journal-report-cover">
            <div class="journal-report-utility">
                <span class="journal-report-text">효성기술원 XX팀</span>
                <span class="journal-report-text">발행일 : YYYY.MM.DD X요일</span>
                <span class="journal-report-text">기간 : YYYY-MM-DD ~ YYYY.MM.DD</span>
                <div class="journal-report-button">Print</div>
                <div class="journal-report-button">Share</div>
                <div class="journal-report-button">Download</div>
            </div>
            <p class="journal-report-heading">제목</p>
            <div class="journal-report-overview">
                <p class="journal-report-title">OVERVIEW</p>
                <ul class="journal-report-list">
                    <li class="journal-report-item">
                        <p class="journal-report-key"><span class="--emphasis">XXXX</span> 관련 기사</p>
                        <span class="journal-report-value">
                            <span class="journal-report-count">N</span>
                            <span class="journal-report-unit">건</span>
                        </span>
                    </li>
                    <li class="journal-report-item">
                        <p class="journal-report-key"><span class="--emphasis">XXXX</span> 관련 기사</p>
                        <span class="journal-report-value">
                            <span class="journal-report-count">N</span>
                            <span class="journal-report-unit">건</span>
                        </span>
                    </li>
                    <li class="journal-report-item">
                        <p class="journal-report-key"><span class="--emphasis">XXXX</span> 관련 기사</p>
                        <span class="journal-report-value">
                            <span class="journal-report-count">N</span>
                            <span class="journal-report-unit">건</span>
                        </span>
                    </li>
                    <li class="journal-report-item">
                        <p class="journal-report-key"><span class="--emphasis">XXXX</span> 관련 기사</p>
                        <span class="journal-report-value">
                            <span class="journal-report-count">N</span>
                            <span class="journal-report-unit">건</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="journal-report-container">
            <div class="journal-report-content">
                <p class="journal-report-category">Subject</p>
                <p class="journal-report-heading">제목</p>
                <div class="journal-report-hashtags">
                    <span class="journal-report-hashtag">#Hashtag</span>
                    <span class="journal-report-hashtag">#Hashtag</span>
                    <span class="journal-report-hashtag">#Hashtag</span>
                </div>
                <div class="journal-report-graph">
                    <div class="journal-report-graph-circle" style="--percentage: 30%;">
                        <span class="journal-report-graph-value">25%</span>
                        <span class="journal-report-graph-legend">text</span>
                    </div>
                    <div class="journal-report-graph-circle" style="--percentage: 30%;">
                        <span class="journal-report-graph-value">25%</span>
                        <span class="journal-report-graph-legend">text</span>
                    </div>
                    <div class="journal-report-graph-circle" style="--percentage: 30%;">
                        <span class="journal-report-graph-value">25%</span>
                        <span class="journal-report-graph-legend">text text text text text text text text</span>
                    </div>
                    <div class="journal-report-graph-circle" style="--percentage: 10%;">
                        <span class="journal-report-graph-value">25%</span>
                        <span class="journal-report-graph-legend">text</span>
                    </div>
                </div>
                <p class="journal-report-description">설명 <span class="--emphasis">설명</span> 설명</p>
                <div class="journal-report-grid">
                    <div class="journal-report-board --article">
                        <p class="journal-report-title">제목</p>
                        <span class="journal-report-count">3</span>
                        <ul class="journal-report-list">
                            <li class="journal-report-item">내용</li>
                            <li class="journal-report-item">내용</li>
                            <li class="journal-report-item">내용</li>
                        </ul>
                    </div>
                    <div class="journal-report-board --thesis">
                        <p class="journal-report-title">제목</p>
                        <span class="journal-report-count">3</span>
                        <ul class="journal-report-list">
                            <li class="journal-report-item">내용</li>
                            <li class="journal-report-item">내용</li>
                            <li class="journal-report-item">내용</li>
                        </ul>
                    </div>
                    <div class="journal-report-board --patent">
                        <p class="journal-report-title">제목</p>
                        <span class="journal-report-count">0</span>
                        <p class="journal-report-message">최근 발행된 XX가 없습니다.</p>
                    </div>
                </div>
            </div>
            <div class="journal-report-content">
                <p class="journal-report-category">Subject</p>
                <p class="journal-report-heading">제목</p>
            </div>
            <div class="journal-report-content">
                <p class="journal-report-category">Subject</p>
                <p class="journal-report-heading">제목</p>
            </div>
        </div>
        <div class="journal-report-footer">
            <div class="journal-report-button">Print</div>
            <div class="journal-report-button">Share</div>
            <div class="journal-report-button">Download</div>
        </div>

        <i class="journal-report-progress" style="--progress: 0%;"></i>
        <div class="journal-report-cta"></div>
    </div>

    <!-- [D][기술원] 테스트 -->
    <div class="tag_test_page">테스트</div>

    <script type="text/javascript" src="/html/xs/core/xui/js/jquery/core/jquery-3.5.1.min.js"></script>
    <script type="text/javascript">
        (function(){
            // 원형 그래프 테스트
            var values = [40, 30, 20, 10];
            var max = Math.max(...values);

            $(".journal-report-graph-circle").each(function(item){
              var $value = values[item];
              $(this).css({"--ratio": $value / max});
            });

            // 연관 저널 랜덤 이미지 적용
            // $('.journal-item').each(function(){
            //     var randomNum = Math.floor(Math.random() * 10);
            //     $(this).addClass('--type' + randomNum);
            // });

            $(".journal-report-cta").click(function(){
                $('html, body').animate({ scrollTop: 0 }, 400);
            });

            $(window).on('scroll', function(){
                const scrollTop = $(window).scrollTop();
                const docHeight = $(document).height();
                const winHeight = $(window).height();

                const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

                // progress
                $('.journal-report-progress').css('--progress', scrollPercent + '%');

                // cta
                if ( scrollTop > 0 ) $(".journal-report-cta").addClass('--active');
                else $(".journal-report-cta").removeClass('--active');
            });
        })();
    </script>
    <!-- [D][기술원] 테스트 -->
</body>
</html>