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

    <!-- XUI / DHTMLX Grid (저널 그리드용) -->
    <script src="${pageContext.request.contextPath}/html/xs/core/xui/js/component/dhtmlx/suite/v5/core/dhtmlxcommon.js"></script>
    <script src="${pageContext.request.contextPath}/html/xs/core/xui/js/component/dhtmlx/suite/v5/core/dhtmlxcore.js"></script>
    <script src="${pageContext.request.contextPath}/html/xs/core/xui/js/component/dhtmlx/suite/v5/core/dhtmlxcontainer.js"></script>
    <script src="${pageContext.request.contextPath}/html/xs/core/xui/js/component/dhtmlx/suite/v5/dhtmlxGrid/dhtmlxgrid.js"></script>

    <!-- Hyobee v2 모듈 (TB-004 Phase 1 — defer 로드 순서 유지) -->
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/v2/hyobee-constants.js?version=<%=System.currentTimeMillis() %>"></script>
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/v2/hyobee-messages.js?version=<%=System.currentTimeMillis() %>"></script>
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/v2/hyobee-i18n.js?version=<%=System.currentTimeMillis() %>"></script>
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/v2/hyobee-api.js?version=<%=System.currentTimeMillis() %>"></script>
    <!-- 화면 전용 스크립트 (facade) -->
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/v2/aichat010.js?version=<%=System.currentTimeMillis() %>"></script>
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/v2/login-routing.js?version=<%=System.currentTimeMillis() %>"></script>
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/v2/journal.js?version=<%=System.currentTimeMillis() %>"></script>
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
<body>
  	<div class="window-popup">
        <!-- [D] 펼침 상태일 경우: .--expanded 삭제 //-->
        <div class="contents aside">
            <jsp:include page="/webapps/xs/aichat/v2/sidebar.jsp" flush="false"/>
            <jsp:include page="/webapps/xs/aichat/v2/messageContents.jsp" flush="false"/>
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
</body>
</html>