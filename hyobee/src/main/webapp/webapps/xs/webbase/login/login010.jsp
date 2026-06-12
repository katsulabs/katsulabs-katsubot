<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%
    String ctx = request.getContextPath();
    String qs = request.getQueryString();
    StringBuilder target = new StringBuilder(ctx).append("/webapps/xs/webbase/login/login.jsp");
    if (qs != null && !qs.isEmpty()) {
        target.append("?").append(qs);
    }
    String targetUrl = response.encodeRedirectURL(target.toString());
    String jsEscaped = targetUrl.replace("\\", "\\\\").replace("\"", "\\\"");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>C-Cube2.0</title>
    <script>
        window.location.replace("<%= jsEscaped %>");
    </script>
</head>
<body></body>
</html>
