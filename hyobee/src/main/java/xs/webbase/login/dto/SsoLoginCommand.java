package xs.webbase.login.dto;

/**
 * Hyobee SSO {@code loginHyobeeSSO} 입력.
 */
public record SsoLoginCommand(
		String samAccountName,
		String companyCode,
		String languageCode
) {
}
