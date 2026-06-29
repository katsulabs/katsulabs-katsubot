package xs.webbase.login.dto;

import lombok.AllArgsConstructor;
import lombok.Value;
import lombok.experimental.Accessors;

/**
 * OTP 복호화 후 로그인 검증·DB 조회에 사용하는 평문 자격 증명.
 */
@Value
@AllArgsConstructor
@Accessors(fluent = true)
public class LoginCredentials {
    String companyCode;
    String userId;
    String password;
    String languageCode;
}
