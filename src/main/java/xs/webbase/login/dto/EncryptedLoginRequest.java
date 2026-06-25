package xs.webbase.login.dto;

/**
 * {@code loginBase.json} 수신 시 OTP 암호화 필드 (TB-006 Slice 1).
 */
public record EncryptedLoginRequest(
		String companyCodeEncrypt,
		String userIdEncrypt,
		String passwordEncrypt,
		String languageCode
) {
}
