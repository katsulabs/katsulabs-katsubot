package xs.core.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import xs.webbase.login.dto.EncryptedLoginRequest;
import xs.webbase.login.dto.LoginCredentials;
import xs.webbase.login.dto.LoginErrorPayload;
import xs.webbase.login.dto.LoginSuccessResponse;
import xs.webbase.login.dto.SessionCreationCommand;
import xs.webbase.login.dto.SsoLoginCommand;

@DisplayName("EnvelopeMapper 로그인 DTO 변환")
class EnvelopeMapperTest {

	@Test
	@DisplayName("EncryptedLoginRequest는 ApiRequest에서 추출된다")
	void readsEncryptedLoginRequest() {
		ApiRequest request = new ApiRequest();
		request.setString("companyCodeEncrypt", "encCo");
		request.setString("userIdEncrypt", "encId");
		request.setString("passwordEncrypt", "encPw");
		request.setString("languageCode", "ko");

		EncryptedLoginRequest encrypted = EnvelopeMapper.toEncryptedLoginRequest(request);

		assertThat(encrypted.companyCodeEncrypt()).isEqualTo("encCo");
		assertThat(encrypted.userIdEncrypt()).isEqualTo("encId");
		assertThat(encrypted.passwordEncrypt()).isEqualTo("encPw");
		assertThat(encrypted.languageCode()).isEqualTo("ko");
	}

	@Test
	@DisplayName("LoginCredentials는 ApiEnvelope params bridge로 round-trip된다")
	void loginCredentialsRoundTrip() {
		LoginCredentials credentials = new LoginCredentials("1000", "user01", "secret", "ko");
		ApiEnvelope params = EnvelopeMapper.toParams(credentials);

		assertThat(params.getString("companyCode")).isEqualTo("1000");
		assertThat(params.getString("userId")).isEqualTo("user01");
		assertThat(params.getString("password")).isEqualTo("secret");
		assertThat(params.getString("languageCode")).isEqualTo("ko");
	}

	@Test
	@DisplayName("SsoLoginCommand는 samaccountname과 companyCode를 params에 반영한다")
	void ssoLoginCommandToParams() {
		SsoLoginCommand command = new SsoLoginCommand("user01", "1000", "en");
		ApiEnvelope params = EnvelopeMapper.toParams(command);

		assertThat(params.getString("samaccountname")).isEqualTo("user01");
		assertThat(params.getString("userId")).isEqualTo("user01");
		assertThat(params.getString("companyCode")).isEqualTo("1000");
		assertThat(params.getString("languageCode")).isEqualTo("en");
	}

	@Test
	@DisplayName("SessionCreationCommand는 languageCode와 isMaster를 params에 반영한다")
	void sessionCreationCommandToParams() {
		ApiEnvelope params = EnvelopeMapper.toParams(SessionCreationCommand.of("ko", true));

		assertThat(params.getString("languageCode")).isEqualTo("ko");
		assertThat(params.getBoolean("isMaster")).isTrue();
	}

	@Test
	@DisplayName("LoginSuccessResponse는 성공 envelope DATA에 매핑된다")
	void successResponseMapping() {
		ApiEnvelope envelope = EnvelopeMapper.success(
				new LoginSuccessResponse("2026-01-01 09:00:00", "2026-01-02 10:00:00"));

		assertThat(envelope.getErrorFlag()).isFalse();
		assertThat(envelope.getString("recentLoginDt")).isEqualTo("2026-01-01 09:00:00");
		assertThat(envelope.getString("currLoginDate")).isEqualTo("2026-01-02 10:00:00");
	}

	@Test
	@DisplayName("LoginErrorPayload는 HEADER와 ERROR_MSG_SUB를 설정한다")
	void errorPayloadMapping() {
		ApiEnvelope envelope = EnvelopeMapper.error(
				LoginErrorPayload.withSub("E01", "fail", "Check Account"));

		assertThat(envelope.getErrorFlag()).isTrue();
		assertThat(envelope.getErrorCode()).isEqualTo("E01");
		assertThat(envelope.getErrorMsg()).isEqualTo("fail");
		assertThat(envelope.getString("ERROR_MSG_SUB")).isEqualTo("Check Account");
	}
}
