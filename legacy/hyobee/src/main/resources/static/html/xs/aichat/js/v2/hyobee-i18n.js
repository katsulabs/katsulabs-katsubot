/***************************************************************************************************************************************************************
 * @classDescription Hyobee 채팅 i18n — com_message_lang 대신 HYOBEE_STATIC_MESSAGES 사용
 * @author HyosungITX Corp.
 ****************************************************************************************************************************************************************/
"use strict";

(function (global) {
    var SUPPORTED_LANGS = ["ko", "en", "zh"];
    var DEFAULT_LANG = "ko";

    function applyMessageTemplate(template, values) {
        return String(template || "").replace(/\{([a-zA-Z0-9_]+)\}/g, function (_, key) {
            return values && values[key] != null ? String(values[key]) : "";
        });
    }

    function resolveLanguage(languageCode) {
        if (languageCode) {
            return languageCode;
        }
        if (typeof xui !== "undefined" && xui.extends && xui.extends.session) {
            var sessionLang = xui.extends.session.getLanguage();
            if (sessionLang) {
                return sessionLang;
            }
        }
        if (typeof $ !== "undefined" && typeof $.cookie === "function") {
            var cookieLang = $.cookie("languageCode");
            if (cookieLang) {
                return cookieLang;
            }
        }
        if (typeof navigator !== "undefined" && navigator.language) {
            return navigator.language.split("-")[0];
        }
        return DEFAULT_LANG;
    }

    function normalizeLanguage(languageCode) {
        var lang = String(resolveLanguage(languageCode) || DEFAULT_LANG).toLowerCase();
        if (SUPPORTED_LANGS.indexOf(lang) >= 0) {
            return lang;
        }
        return DEFAULT_LANG;
    }

    function staticCatalog() {
        return global.HYOBEE_STATIC_MESSAGES || {};
    }

    function staticMsg(key, languageCode) {
        if (!key) {
            return "";
        }
        var catalog = staticCatalog();
        var lang = normalizeLanguage(languageCode);
        var bucket = catalog[lang] || catalog[DEFAULT_LANG] || {};
        var fallback = catalog[DEFAULT_LANG] || {};
        return bucket[key] || fallback[key] || key;
    }

    function msg(key, values, languageCode) {
        var template = staticMsg(key, languageCode);
        if (values != null && typeof values === "object" && !Array.isArray(values)) {
            return applyMessageTemplate(template, values);
        }
        return template;
    }

    function formatMsg(key, userName, languageCode) {
        return msg(key, null, languageCode).replace("{0}", userName || "");
    }

    function isHyobeeMessageKey(messageId) {
        return messageId && String(messageId).indexOf("hyobee.") === 0;
    }

    /** JSP message-text / xui.message.get 가 정적 hyobee 키를 조회하도록 연결 */
    function installXuiMessageHook() {
        if (typeof xui === "undefined" || !xui.message || xui.message._hyobeeStaticHook) {
            return;
        }
        var originalGet = xui.message.get.bind(xui.message);
        xui.message.get = function (messageId, languageCode, fromDatabase) {
            if (isHyobeeMessageKey(messageId)) {
                return staticMsg(messageId, languageCode);
            }
            return originalGet(messageId, languageCode, fromDatabase);
        };
        xui.message._hyobeeStaticHook = true;
    }

    function bootstrap() {
        installXuiMessageHook();
    }

    bootstrap();

    global.HyobeeI18n = {
        applyMessageTemplate: applyMessageTemplate,
        resolveLanguage: resolveLanguage,
        staticMsg: staticMsg,
        msg: msg,
        formatMsg: formatMsg,
        installXuiMessageHook: installXuiMessageHook
    };
})(window);
