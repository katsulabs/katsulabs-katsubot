<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" session="true"%>
<%@ page import="xs.core.property.XtrmProperty" %>
<%@ page import="org.springframework.web.context.WebApplicationContext" %>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils" %>

<%
    response.addHeader("P3P","CP=\"IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT\"");
    String pEMail = request.getParameter("email");
//  String pEMail = "bp0068246@hyosung.com";
    String pLegacyCharset = request.getParameter("legacyCharset");
    String pClientUrl = request.getRequestURL().toString();

    WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(application);
    XtrmProperty xtrmProperty = (ctx != null) ? ctx.getBean("xtrmProperty", XtrmProperty.class) : null;
    String cloudServer = "https://hicloud.hyosung.com";
    if (xtrmProperty != null) {
        cloudServer = xtrmProperty.getString("AI_CHAT_HICLOUD_SERVER_URL", cloudServer);
    }

    String inputYn = request.getParameter("inputYn");
    String pIsSSO = request.getParameter("isSSO");
    String checkedFileInfos = request.getParameter("checkedFileInfos");
%>
<!DOCTYPE html>
<html>
<head>
    <title>HiCloud 파일 첨부</title>
    <script defer type="text/javascript" src="/html/xs/core/xui/js/jquery/core/jquery-3.5.1.min.js"></script>

    <script type="text/javaScript">
        function init_json(){
            var url = location.href;

            var inputYn= "<%=inputYn%>";

            if(inputYn != "Y"){
                document.popupForm.eMail.value = "<%=pEMail%>";
                document.popupForm.legacyCharset.value = "<%=pLegacyCharset%>";
                document.popupForm.returnTarget.value = "<%=pClientUrl%>";
                document.popupForm.isSSO.value = "<%=pIsSSO%>";
                document.popupForm.isFileNameCheck.value = "Y";
                document.popupForm.action = "<%=cloudServer%>/external/hicloudDownloadFilesJson/sso";
                document.popupForm.submit();
            } else {
                try {
                    var jobj = JSON.parse('<%=checkedFileInfos%>');
                    var fileObj = jobj.DATA;
                    opener.callBackFromHiCloud(fileObj);
                } catch (e) {
                    alert(e);
                }

                window.close();
            }

            document.popupForm.submit();
        }
    </script>
</head>

<body onload="init_json();">
<form id="popupForm" name="popupForm" method="post">
    <table>
        <tr>
            <td><input type="hidden" id="eMail" name="eMail"></td>
            <td><input type="hidden" id="serverUrl" name="serverUrl"></td>
            <td><input type="hidden" id="serverName" name="serverName"></td>
            <td><input type="hidden" id="returnTarget" name="returnTarget"></td>
            <td><input type="hidden" id="legacyCharset" name="legacyCharset"></td>
            <td><input type="hidden" id="isSSO" name="isSSO"></td>
            <td><input type="hidden" id="isFileNameCheck" name="isFileNameCheck"></td>
        </tr>
    </table>
</form>
</body>

</html>