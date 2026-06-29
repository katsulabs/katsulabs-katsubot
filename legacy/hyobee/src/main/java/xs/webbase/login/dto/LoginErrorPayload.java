package xs.webbase.login.dto;

import lombok.AllArgsConstructor;
import lombok.Value;
import lombok.experimental.Accessors;

/**
 * 로그인·SSO 오류 응답 (HEADER + 선택적 DATA).
 */
@Value
@AllArgsConstructor
@Accessors(fluent = true)
public class LoginErrorPayload {
    String errorCode;
    String errorMessage;
    String errorMessageSub;

    public static LoginErrorPayload of(String errorCode, String errorMessage) {
        return new LoginErrorPayload(errorCode, errorMessage, null);
    }

    public static LoginErrorPayload withSub(String errorCode, String errorMessage, String errorMessageSub) {
        return new LoginErrorPayload(errorCode, errorMessage, errorMessageSub);
    }
}
