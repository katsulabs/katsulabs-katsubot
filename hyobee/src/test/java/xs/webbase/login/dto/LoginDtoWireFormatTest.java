package xs.webbase.login.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import xs.core.dto.ApiEnvelope;
import xs.core.dto.EnvelopeMapper;
import xs.vob.enumeration.MainEnum;

/**
 * Phase 0 Contract — 로그인 golden wire format (TB-006 Slice 0·1).
 */
@DisplayName("로그인 DTO wire format")
class LoginDtoWireFormatTest {

	private static final ObjectMapper MAPPER = new ObjectMapper();

	@Nested
	@DisplayName("loginBase")
	class LoginBase {

		@Test
		void successEnvelope() throws Exception {
			ApiEnvelope envelope = EnvelopeMapper.success(
					new LoginSuccessResponse("2026-05-01 08:00:00", "20260501120000"));

			JsonNode root = MAPPER.readTree(envelope.toString());
			assertThat(root.get("HEADER").get("ERROR_FLAG").asBoolean()).isFalse();
			assertThat(root.get("DATA").isArray()).isTrue();
			assertThat(root.get("DATA").get(0).get("recentLoginDt").asText())
					.isEqualTo("2026-05-01 08:00:00");
			assertThat(root.get("DATA").get(0).get("currLoginDate").asText())
					.isEqualTo("20260501120000");
		}

		@Test
		void enfErrorEnvelope() throws Exception {
			ApiEnvelope envelope = EnvelopeMapper.error(LoginErrorPayload.of(
					MainEnum.LOGIN_ENF.getCode(),
					MainEnum.LOGIN_ENF.getCodeName()));

			JsonNode root = MAPPER.readTree(envelope.toString());
			assertThat(root.get("HEADER").get("ERROR_FLAG").asBoolean()).isTrue();
			assertThat(root.get("HEADER").get("ERROR_CODE").asText())
					.isEqualTo(MainEnum.LOGIN_ENF.getCode());
		}

		@Test
		void emptyParamErrorEnvelope() throws Exception {
			ApiEnvelope envelope = EnvelopeMapper.error(LoginErrorPayload.of(
					MainEnum.LOGIN_EMPTY.getCode(),
					MainEnum.LOGIN_EMPTY.getCodeName()));

			JsonNode root = MAPPER.readTree(envelope.toString());
			assertThat(root.get("HEADER").get("ERROR_CODE").asText())
					.isEqualTo(MainEnum.LOGIN_EMPTY.getCode());
		}
	}

	@Nested
	@DisplayName("SSO 403")
	class SsoForbidden {

		@Test
		void errorWithSubMessage() throws Exception {
			ApiEnvelope envelope = EnvelopeMapper.error(LoginErrorPayload.withSub(
					MainEnum.PASSWORD_CHANGE_ERROR02.getCode(),
					"message",
					"Check Account"));

			JsonNode root = MAPPER.readTree(envelope.toString());
			assertThat(root.get("HEADER").get("ERROR_FLAG").asBoolean()).isTrue();
			assertThat(root.get("HEADER").get("ERROR_CODE").asText())
					.isEqualTo(MainEnum.PASSWORD_CHANGE_ERROR02.getCode());
			assertThat(root.get("DATA").get(0).get("ERROR_MSG_SUB").asText())
					.isEqualTo("Check Account");

			assertThat(EnvelopeMapper.toXtrmErrorDataJson(
					LoginErrorPayload.withSub(
							MainEnum.PASSWORD_CHANGE_ERROR02.getCode(),
							"message",
							"Check Account")))
					.isEqualTo(envelope.toString());
		}
	}
}
