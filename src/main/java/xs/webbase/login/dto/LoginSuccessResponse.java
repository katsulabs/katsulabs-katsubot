package xs.webbase.login.dto;

/**
 * {@code loginBase.json} / SSO 성공 시 DATA[0] 필드.
 */
public record LoginSuccessResponse(
		String recentLoginDt,
		String currLoginDate
) {
}
