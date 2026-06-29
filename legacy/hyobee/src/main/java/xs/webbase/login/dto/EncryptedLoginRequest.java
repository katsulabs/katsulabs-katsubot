package xs.webbase.login.dto;

import lombok.AllArgsConstructor;
import lombok.Value;
import lombok.experimental.Accessors;

/**
 * {@code loginBase.json} 수신 시 OTP 암호화 필드 (TB-006 Slice 1).
 */
@Value
@AllArgsConstructor
@Accessors(fluent = true)
public class EncryptedLoginRequest {
    String companyCodeEncrypt;
    String userIdEncrypt;
    String passwordEncrypt;
    String languageCode;
}
