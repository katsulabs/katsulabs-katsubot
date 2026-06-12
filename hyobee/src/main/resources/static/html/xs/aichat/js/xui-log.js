/**
 * xui 공통 로그 유틸
 * ----------------------------------------
 * - 도메인 URL 기준 환경 판별
 * - 운영 도메인에서는 log / warn 차단
 * - error 는 운영에서도 출력
 * - jQuery 의존성 없음
 * - xui 로딩 순서 안전 (늦게 로드돼도 OK)

 [예시]
 xui.util.log("조회 시작", param);
 xui.util.warn("값 누락");
 xui.util.error("API 오류", err);

 xui.util.log("[VOC] 조회 시작");
 xui.util.log("[VOC]", rowData);
 xui.util.log("[VOC]", rowData.contentsKey, rowData.puCode);

 xui.util.log("[VOC][조회]", {
     key   : rowData.contentsKey,
     pu    : rowData.puCode,
     state : rowData.contentsStatusName
 });
 */

(function (window) {

    /**
     * xui.util 에 로그 함수 연결
     */
    function attachXuiLog() {

        if (!window.xui || !window.xui.util) {
            return false;
        }

        // 이미 정의돼 있으면 재정의하지 않음
        if (typeof window.xui.util.log === "function") {
            return true;
        }

        var host = window.location.hostname;

        // 🔴 운영 도메인 정의 (여기만 관리)
        var PROD_DOMAINS = [
            "ai-chat.hyosung.com",
            "c-cube.hyosung.com"
        ];

        function isProdDomain(hostname) {
            for (var i = 0; i < PROD_DOMAINS.length; i++) {
                var domain = PROD_DOMAINS[i];
                if (
                    hostname === domain ||
                    hostname.endsWith("." + domain)
                ) {
                    return true;
                }
            }
            return false;
        }

        var ENABLE_LOG = !isProdDomain(host);

        /**
         * log (개발/검증 전용)
         */
        window.xui.util.log = function () {
            if (!ENABLE_LOG) return;
            if (window.console && console.log) {
                console.log.apply(console, arguments);
            }
        };

        /**
         * warn (개발/검증 전용)
         */
        window.xui.util.warn = function () {
            if (!ENABLE_LOG) return;
            if (window.console && console.warn) {
                console.warn.apply(console, arguments);
            }
        };

        /**
         * error (운영에서도 허용)
         */
        window.xui.util.error = function () {
            if (window.console && console.error) {
                console.error.apply(console, arguments);
            }
        };

        /**
         * 환경 확인
         */
        window.xui.util.isProd = function () {
            return isProdDomain(host);
        };

        return true;
    }

    // 1️⃣ 즉시 시도
    if (attachXuiLog()) {
        return;
    }

    // 2️⃣ xui 로딩 완료 대기 (최대 3초)
    var retryCount = 0;
    var timer = setInterval(function () {
        retryCount++;

        if (attachXuiLog() || retryCount > 300) {
            clearInterval(timer);
        }
    }, 10);

})(window);
