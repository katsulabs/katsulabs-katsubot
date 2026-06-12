package xs.testutil;

import xs.core.handler.app.XtrmArgumentResolveMap;
import xs.core.dto.ApiEnvelope;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Objects;

/**
 * 테스트 편의를 위해 ApiEnvelope / XtrmArgumentResolveMap 세팅을 캡슐화한 헬퍼.
 */
public final class XtrmTestSupport {

    private XtrmTestSupport() {
    }

    public static ApiEnvelope emptyJson() {
        return new ApiEnvelope();
    }

    public static ApiEnvelope jsonWithStrings(String... keyValues) {
        if (keyValues == null || keyValues.length == 0) {
            return emptyJson();
        }
        if (keyValues.length % 2 != 0) {
            throw new IllegalArgumentException("keyValues must be even-length (key/value pairs).");
        }

        ApiEnvelope json = emptyJson();
        for (int i = 0; i < keyValues.length; i += 2) {
            String key = Objects.requireNonNull(keyValues[i], "key must not be null");
            String value = Objects.requireNonNull(keyValues[i + 1], "value must not be null");
            json.setString(key, value);
        }
        return json;
    }

    public static XtrmArgumentResolveMap argumentMap(ApiEnvelope params) {
        XtrmArgumentResolveMap map = new XtrmArgumentResolveMap();
        map.setParams(params != null ? params : emptyJson());
        return map;
    }

    public static XtrmArgumentResolveMap argumentMapEmpty() {
        return argumentMap(null);
    }

    public static XtrmArgumentResolveMap argumentMapWithStrings(String... keyValues) {
        return argumentMap(jsonWithStrings(keyValues));
    }

    public static XtrmArgumentResolveMap loginRequest(HttpServletRequest request, HttpSession session) {
        XtrmArgumentResolveMap map = new XtrmArgumentResolveMap();
        map.setRequest(request);
        map.setSession(session);
        map.setParams(emptyJson());
        return map;
    }
}
