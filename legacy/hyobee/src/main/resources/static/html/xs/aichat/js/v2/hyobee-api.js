/***************************************************************************************************************************************************************
 * @classDescription Hyobee 채팅 REST API 헬퍼 (TB-004 Phase 1)
 * @author HyosungITX Corp.
 ****************************************************************************************************************************************************************/
"use strict";

(function (global) {
    var API_PATHS = {
        CONVERSATIONS: "/xs/aichat/v2/conversations",
        MESSAGES: "/xs/aichat/v2/messages",
        CONVERSATION: "/xs/aichat/v2/conversation",
        BOARD_AUTH: "/xs/aichat/v2/board-auth",
        STREAM_SEND_PARAM: "/xs/aichat/v2/stream/sendMessageParam",
        STREAM_MESSAGE: "/xs/aichat/v2/stream/message",
        STREAM_INTERRUPT: "/xs/aichat/v2/stream/interrupt",
        VIEWABLE_TEAMS: "/xs/aichat/v2/rnd/viewable-teams",
        JWT_TEAM_CODE: "/xs/aichat/v2/session/jwt-team-code",
        UPLOAD_FILES: "/xs/aichat/v2/uploadFiles",
        CLOUD_ATTACH: "/xs/aichat/v2/cloudAttach"
    };

    /**
     * aichat 전용 REST 호출 헬퍼
     * - /xs/aichat/** 엔드포인트에 대해 fetch + xui.json 래핑
     */
    function requestApi(path, options) {
        var baseUrl = xui.com.getContextPath() || "";
        options = options || {};
        var method = options.method || "GET";
        var query = options.query || null;
        var body = options.body || null;

        var normalizedBase = baseUrl;
        var normalizedPath = path || "";
        if (normalizedBase.endsWith("/") && normalizedPath.startsWith("/")) {
            normalizedPath = normalizedPath.substring(1);
        }
        if (!normalizedBase.endsWith("/") && !normalizedPath.startsWith("/")) {
            normalizedBase = normalizedBase + "/";
        }
        var url = normalizedBase + normalizedPath;
        if (query) {
            var qs = new URLSearchParams(query).toString();
            if (qs) {
                url += (url.indexOf("?") === -1 ? "?" : "&") + qs;
            }
        }

        return fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: (method === "GET") ? null : (body ? JSON.stringify(body) : null)
        }).then(function (res) {
            if (!res.ok) {
                return res.text().then(function (text) {
                    var serverMsg = null;
                    try {
                        var errData = text ? JSON.parse(text) : null;
                        if (errData && Array.isArray(errData.DATA) && errData.DATA.length > 0) {
                            var firstData = errData.DATA[0] || {};
                            serverMsg = firstData.message || firstData.MESSAGE || null;
                        }
                        if (!serverMsg && errData && errData.HEADER) {
                            serverMsg = errData.HEADER.ERROR_MSG || errData.HEADER.errorMsg;
                        }
                    } catch (ignore) {}
                    throw new Error(serverMsg || ("HTTP " + res.status));
                });
            }
            return res.text().then(function (text) {
                if (!text || !text.trim()) {
                    if (res.status === 204 || res.status === 205) {
                        return new xui.json({
                            HEADER: {
                                ERROR_FLAG: false,
                                ERROR_CODE: "",
                                ERROR_MSG: ""
                            },
                            DATA: []
                        });
                    }
                    return new xui.json({
                        HEADER: {
                            ERROR_FLAG: true,
                            ERROR_CODE: "EMPTY_RESPONSE",
                            ERROR_MSG: "조회된 데이터가 없습니다."
                        },
                        DATA: []
                    });
                }
                try {
                    var data = JSON.parse(text);
                    return new xui.json(data);
                } catch (e) {
                    throw new Error("Invalid JSON response: " + (text.substring(0, 200)));
                }
            });
        }).catch(function (err) {
            console.error("Fetch Error:", err);

            var code = "NETWORK_OR_RUNTIME_ERROR";
            var message = "통신 중 오류가 발생했습니다.";

            if (err && err.name === "AbortError") {
                code = "REQUEST_ABORTED";
                message = "요청이 취소되었거나 시간이 초과되었습니다.";
            } else if (err && err.name === "TypeError") {
                code = "NETWORK_ERROR";
                message = "네트워크 연결을 확인해 주세요.";
            } else if (err && err.message) {
                message = err.message;
            }
            var wrapped = new Error(message);
            wrapped.code = code;
            wrapped.cause = err;
            throw wrapped;
        });
    }

    global.HyobeeApi = {
        paths: API_PATHS,
        request: requestApi
    };
})(window);
