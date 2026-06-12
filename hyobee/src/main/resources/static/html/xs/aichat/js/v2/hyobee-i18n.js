/***************************************************************************************************************************************************************
 * @classDescription Hyobee 채팅 i18n 헬퍼 (TB-004 Phase 1)
 * @author HyosungITX Corp.
 ****************************************************************************************************************************************************************/
"use strict";

(function (global) {
    function applyMessageTemplate(template, values) {
        return String(template || "").replace(/\{([a-zA-Z0-9_]+)\}/g, function (_, key) {
            return values && values[key] != null ? String(values[key]) : "";
        });
    }

    function msg(key, values) {
        var template = xui.message.get(key);
        if (values != null && typeof values === "object" && !Array.isArray(values)) {
            return applyMessageTemplate(template, values);
        }
        return template;
    }

    function formatMsg(key, userName) {
        return msg(key).replace("{0}", userName || "");
    }

    global.HyobeeI18n = {
        applyMessageTemplate: applyMessageTemplate,
        msg: msg,
        formatMsg: formatMsg
    };
})(window);
