package xs.core.dto;

import xs.webbase.login.dto.EncryptedLoginRequest;
import xs.webbase.login.dto.LoginCredentials;
import xs.webbase.login.dto.LoginErrorPayload;
import xs.webbase.login.dto.LoginSuccessResponse;
import xs.webbase.login.dto.SessionCreationCommand;
import xs.webbase.login.dto.SsoLoginCommand;

/**
 * typed login DTO ↔ 레거시 {@link ApiEnvelope} wire format 경계 (TB-006).
 * 서비스 내부는 record, 컨트롤러/HTTP 응답은 본 Mapper로 envelope 조립.
 */
public final class EnvelopeMapper {

	private EnvelopeMapper() {
	}

	public static EncryptedLoginRequest toEncryptedLoginRequest(ApiRequest request) {
		if (request == null) {
			return new EncryptedLoginRequest("", "", "", "");
		}
		return new EncryptedLoginRequest(
				normalizePlus(request.getString("companyCodeEncrypt")),
				normalizePlus(request.getString("userIdEncrypt")),
				normalizePlus(request.getString("passwordEncrypt")),
				request.getString("languageCode"));
	}

	public static LoginCredentials toLoginCredentials(EncryptedLoginRequest encrypted, String companyCode,
			String userId, String password) {
		return new LoginCredentials(
				companyCode,
				userId,
				password,
				encrypted.languageCode());
	}

	public static SsoLoginCommand toSsoLoginCommand(ApiRequest request, String companyCode, String languageCode) {
		String samAccountName = request != null ? request.getString("samaccountname") : "";
		return new SsoLoginCommand(samAccountName, companyCode, languageCode);
	}

	public static SessionCreationCommand toSessionCreationCommand(ApiRequest request) {
		if (request == null) {
			return SessionCreationCommand.of("");
		}
		return SessionCreationCommand.of(request.getString("languageCode"), request.getBoolean("isMaster"));
	}

	public static ApiEnvelope toParams(LoginCredentials credentials) {
		ApiEnvelope params = new ApiEnvelope();
		if (credentials == null) {
			return params;
		}
		params.setString("companyCode", credentials.companyCode());
		params.setString("userId", credentials.userId());
		params.setString("password", credentials.password());
		params.setString("languageCode", credentials.languageCode());
		return params;
	}

	public static ApiEnvelope toParams(SsoLoginCommand command) {
		ApiEnvelope params = new ApiEnvelope();
		if (command == null) {
			return params;
		}
		params.setString("samaccountname", command.samAccountName());
		params.setString("companyCode", command.companyCode());
		params.setString("languageCode", command.languageCode());
		params.setString("userId", command.samAccountName());
		return params;
	}

	public static ApiEnvelope toParams(SessionCreationCommand command) {
		ApiEnvelope params = new ApiEnvelope();
		if (command == null) {
			return params;
		}
		params.setString("languageCode", command.languageCode());
		params.setBoolean("isMaster", command.masterLogin());
		return params;
	}

	public static ApiEnvelope success(LoginSuccessResponse response) {
		ApiEnvelope envelope = new ApiEnvelope();
		envelope.setResultHeader(false);
		if (response != null) {
			if (response.recentLoginDt() != null) {
				envelope.setString("recentLoginDt", response.recentLoginDt());
			}
			if (response.currLoginDate() != null) {
				envelope.setString("currLoginDate", response.currLoginDate());
			}
		}
		return envelope;
	}

	public static ApiEnvelope error(LoginErrorPayload error) {
		ApiEnvelope envelope = new ApiEnvelope();
		if (error == null) {
			envelope.setResultHeader(true);
			return envelope;
		}
		envelope.setResultHeader(true, safe(error.errorMessage()), safe(error.errorCode()));
		if (error.errorMessageSub() != null && !error.errorMessageSub().isEmpty()) {
			envelope.setString("ERROR_MSG_SUB", error.errorMessageSub());
		}
		return envelope;
	}

	public static String toXtrmErrorDataJson(LoginErrorPayload error) {
		return error(error).toString();
	}

	private static String normalizePlus(String value) {
		return value != null ? value.replace(" ", "+") : "";
	}

	private static String safe(String value) {
		return value != null ? value : "";
	}
}
