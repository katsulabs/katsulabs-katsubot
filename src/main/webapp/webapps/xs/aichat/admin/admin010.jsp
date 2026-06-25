<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/webapps/xs/core/xui/xuiprelude.jsp" %>
<!DOCTYPE html>
<html>
<head>
    <title>Ask Hyobee Admin</title>
    <jsp:include page="/webapps/xs/core/xui/xuicore.jsp" flush="false"></jsp:include>
    <script defer src="${pageContext.request.contextPath}/html/xs/aichat/js/admin/admin010.js?version=<%=System.currentTimeMillis() %>"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/html/xs/aichat/css/admin010.css?version=<%=System.currentTimeMillis() %>"/>
</head>
<body class="aichat-admin">
    <div id="mainContainer" class="aichat-admin__main"></div>
</body>
</html>
