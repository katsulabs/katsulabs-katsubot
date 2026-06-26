package xs.webbase.login.dto;

/**
 * {@link xs.core.api.service.ApiServiceImpl#createSessionAndUpdate} 3-arg 보강값.
 */
public record SessionCreationCommand(
		String languageCode,
		boolean masterLogin
) {

	public static SessionCreationCommand of(String languageCode) {
		return new SessionCreationCommand(languageCode, false);
	}

	public static SessionCreationCommand of(String languageCode, boolean masterLogin) {
		return new SessionCreationCommand(languageCode, masterLogin);
	}
}
