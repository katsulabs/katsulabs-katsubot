"use strict";
/***************************************************************************************************************************************************************
 * Global Variable : 로그인 라우팅 관련 전역변수를 정의한다.
 ***************************************************************************************************************************************************************/
var pendingLoginRedirectOnErrorDialog = false;

/***************************************************************************************************************************************************************
 * Login Routing Functions : aichat 로그인 분기/리다이렉트 관련 함수를 정의한다.
 ***************************************************************************************************************************************************************/
aichat010.isUnauthorizedError = function(err) {
    var msg = (err && err.message) ? String(err.message) : "";
    return msg.indexOf("HTTP 401") !== -1
        || msg.indexOf("401 UNAUTHORIZED") !== -1
        || msg.indexOf("권한이 없는 사용자입니다") !== -1;
};

aichat010.getCookieValue = function(name) {
    var escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var match = document.cookie.match(new RegExp("(?:^|; )" + escaped + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : "";
};

aichat010.isSsoLoginByCookie = function() {
    var raw = aichat010.getCookieValue("loginType")
        || aichat010.getCookieValue("LOGIN_TYPE")
        || aichat010.getCookieValue("isSSO")
        || aichat010.getCookieValue("IS_SSO");

    if (!raw) {
        return false;
    }

    var normalized = String(raw).trim().toUpperCase();
    return normalized === "SSO"
        || normalized === "Y"
        || normalized === "TRUE"
        || normalized === "1";
};

aichat010.redirectToLoginPage = function() {
    var baseUrl = xui.com.getContextPath() || "";
    var normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    if (aichat010.isSsoLoginByCookie()) {
        // voblogin은 POST 엔드포인트이므로 form submit으로 진입
        var form = document.createElement("form");
        form.method = "POST";
        form.action = normalizedBase + "/xs/vob/aichat/ssologin";
        form.style.display = "none";
        document.body.appendChild(form);
        form.submit();
        return;
    }

    window.location.href = normalizedBase + "/webapps/xs/webbase/login/login010.jsp";
};

aichat010.bindLoginRedirectOnErrorDialogConfirm = function() {
    if (aichat010._loginRedirectDialogBound) {
        return;
    }
    aichat010._loginRedirectDialogBound = true;

    document.addEventListener("click", function(e) {
        if (!pendingLoginRedirectOnErrorDialog) {
            return;
        }

        var target = e.target;
        if (!(target instanceof Element)) {
            return;
        }

        var confirmButton = target.closest(".xui-error-box .allowed");
        if (!confirmButton) {
            return;
        }

        pendingLoginRedirectOnErrorDialog = false;
        aichat010.redirectToLoginPage();
    });
};

aichat010.showErrorDialog = function(message, title) {
    var msg = message || "오류가 발생했습니다.";
    if (aichat010.isUnauthorizedError({ message: msg })) {
        pendingLoginRedirectOnErrorDialog = true;
        aichat010.bindLoginRedirectOnErrorDialogConfirm();
    }
    xui.dialog.error(msg, title || xui.enum.ERROR.getName());
};
