package xs.aichat.v2.dto.external.wrtn.error;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import xs.aichat.util.JsonAdapter;
import xs.aichat.v2.exception.ExternalApiException;

@Slf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class UpstreamErrorMapper {

    private static final int MAX_BODY_SNIP = 800;

    public static ExternalApiException fromHttpError(JsonAdapter jsonAdapter, HttpStatus status, String body) {
        log.error("Upstream API Error: status={}, body={}", status, body);
        var http = status != null ? status : HttpStatus.BAD_GATEWAY;
        if (body != null && !body.isBlank()) {
            try {
                ApiErrorResponse root = jsonAdapter.fromJson(body, ApiErrorResponse.class);
                if (root.getError() != null) {
                    return fromEnvelope(http, root);
                }
            } catch (Exception ignored) {
            }
        }
        var msg = body != null && !body.isBlank()
                ? trim(body, MAX_BODY_SNIP)
                : http.getReasonPhrase();
        return new ExternalApiException(http, String.valueOf(http.value()), msg, null, null);
    }

    public static ExternalApiException fromEnvelope(HttpStatus fallbackStatus, ApiErrorResponse root) {
        log.error("Upstream API Error: {}", root);
        var err = root.getError();
        var st = fallbackStatus != null ? fallbackStatus : HttpStatus.BAD_GATEWAY;
        var vendorCode = err != null ? err.getCode() : null;
        if (vendorCode != null) {
            HttpStatus byCode = HttpStatus.resolve(vendorCode);
            if (byCode != null) {
                st = byCode;
            }
        }
        var msg = err != null && err.getMessage() != null ? err.getMessage() : "외부 API 오류";
        // HEADER.ERROR_CODE = 벤더 error.code (422 등), 없으면 HTTP 상태 숫자
        var codeForHeader = vendorCode != null ? String.valueOf(vendorCode) : String.valueOf(st.value());
        var type = err != null ? err.getType() : null;
        return new ExternalApiException(st, codeForHeader, msg, vendorCode, type);
    }

    private static String trim(String s, int max) {
        return s.length() <= max ? s : s.substring(0, max) + "...";
    }
}
