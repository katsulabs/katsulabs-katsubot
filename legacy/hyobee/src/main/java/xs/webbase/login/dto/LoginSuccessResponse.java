package xs.webbase.login.dto;

import lombok.AllArgsConstructor;
import lombok.Value;
import lombok.experimental.Accessors;

/**
 * {@code loginBase.json} / SSO 성공 시 DATA[0] 필드.
 */
@Value
@AllArgsConstructor
@Accessors(fluent = true)
public class LoginSuccessResponse {
    String recentLoginDt;
    String currLoginDate;
}
