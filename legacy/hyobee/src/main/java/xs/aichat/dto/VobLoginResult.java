package xs.aichat.dto;

import xs.core.dto.ApiEnvelope;

public record VobLoginResult(boolean successful, String errorData) {

    /** Lombok {@code isSuccess()} 호환 — SSO 테스트·컨트롤러 */
    public boolean isSuccess() {
        return successful;
    }

    /** Lombok {@code getErrorData()} 호환 */
    public String getErrorData() {
        return errorData;
    }

    public static VobLoginResult success() {
        return new VobLoginResult(true, null);
    }

    public static VobLoginResult fail(String errorMsg) {
        return new VobLoginResult(false, errorMsg);
    }

    public static VobLoginResult fail(ApiEnvelope json) {
        return fail(json.toString());
    }
}
