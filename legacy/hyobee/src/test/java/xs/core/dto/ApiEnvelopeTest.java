package xs.core.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

class ApiEnvelopeTest {

	private static final ObjectMapper MAPPER = new ObjectMapper();

	@Nested
	@DisplayName("empty wire format")
	class EmptyWireFormat {

		@Test
		void defaultHeaderAndSingleEmptyDataRow() throws Exception {
			ApiEnvelope node = new ApiEnvelope();

			assertThat(node.getErrorFlag()).isFalse();
			assertThat(node.getErrorCode()).isEmpty();
			assertThat(node.getErrorMsg()).isEmpty();
			assertThat(node.getCount()).isZero();

			ObjectNode parsed = (ObjectNode) MAPPER.readTree(node.toString());
			assertThat(parsed.has("HEADER")).isTrue();
			assertThat(parsed.has("DATA")).isTrue();
			assertThat(parsed.get("DATA").isArray()).isTrue();
			assertThat(parsed.get("DATA")).hasSize(1);
			assertThat(parsed.get("DATA").get(0).size()).isZero();
		}
	}

	@Nested
	@DisplayName("wire-format accessors")
	class AccessorParity {

		@Test
		void dataFieldsAndResultHeader() {
			ApiEnvelope node = new ApiEnvelope();
			node.setString("userId", "u1");
			node.setInt("age", 30);
			node.setBoolean("active", true);
			node.setHeader("COUNT", 1);
			node.setResultHeader(false, "ok", "200");

			assertThat(node.getString("userId")).isEqualTo("u1");
			assertThat(node.getInt("age")).isEqualTo(30);
			assertThat(node.getBoolean("active")).isTrue();
			assertThat(node.getHeaderInt("COUNT")).isEqualTo(1);
			assertThat(node.getErrorFlag()).isFalse();
			assertThat(node.getErrorMsg()).isEqualTo("ok");
			assertThat(node.getErrorCode()).isEqualTo("200");
			assertThat(node.getCount()).isZero();
		}

		@Test
		void parseHeaderDataEnvelopeFromString() {
			String json = "{\"HEADER\":{\"ERROR_FLAG\":true,\"ERROR_CODE\":\"E01\",\"ERROR_MSG\":\"fail\"},"
					+ "\"DATA\":[{\"samaccountname\":\"user01\"}]}";

			ApiEnvelope node = ApiEnvelope.parse(json);

			assertThat(node.getErrorFlag()).isTrue();
			assertThat(node.getErrorCode()).isEqualTo("E01");
			assertThat(node.getErrorMsg()).isEqualTo("fail");
			assertThat(node.getString("samaccountname")).isEqualTo("user01");
			assertThat(node.getCount()).isOne();
		}

		@Test
		void bareObjectWrapsIntoDataArray() {
			ApiEnvelope node = new ApiEnvelope("{\"foo\":\"bar\"}");

			assertThat(node.getString("foo")).isEqualTo("bar");
			assertThat(node.getCount()).isOne();
			assertThat(node.getErrorFlag()).isFalse();
		}

		@Test
		void multiIndexSetAndGet() {
			ApiEnvelope node = new ApiEnvelope();
			node.setString("id", "a", 0);
			node.setString("id", "b", 1);

			assertThat(node.getString("id", 0)).isEqualTo("a");
			assertThat(node.getString("id", 1)).isEqualTo("b");
			assertThat(node.isExistIndex(1)).isTrue();
		}
	}

	@Nested
	@DisplayName("ResponseHeader record")
	class ResponseHeaderBridge {

		@Test
		void roundTripsThroughApiEnvelope() {
			ApiEnvelope envelope = new ApiEnvelope();
			envelope.setString("userId", "u1");
			envelope.setResultHeader(false, "ok", "200");
			envelope.setHeader("COUNT", 1);

			ResponseHeader header = ResponseHeader.from(envelope);
			assertThat(header.isErrorFlag()).isFalse();
			assertThat(header.getErrorMsg()).isEqualTo("ok");
			assertThat(header.getCount()).isOne();

			ApiEnvelope restored = new ApiEnvelope();
			header.applyTo(restored);
			assertThat(restored.getErrorMsg()).isEqualTo("ok");
			assertThat(restored.getHeaderInt("COUNT")).isOne();
		}
	}

	@Nested
	@DisplayName("Jackson node boundaries")
	class NodeBoundaries {

		@Test
		void getDataObjectNodeReturnsDeepCopy() {
			ApiEnvelope node = new ApiEnvelope();
			node.setString("k", "v");

			ObjectNode row = node.getDataObjectNode();
			assertThat(row).isNotNull();
			row.put("k", "mutated");

			assertThat(node.getString("k")).isEqualTo("v");
		}

		@Test
		void setDataArrayNodeReplacesGroup() {
			ApiEnvelope node = new ApiEnvelope();
			ArrayNode rows = MAPPER.createArrayNode();
			ObjectNode row = MAPPER.createObjectNode();
			row.put("x", 1);
			rows.add(row);

			node.setDataArrayNode(rows);

			assertThat(node.getCount()).isOne();
			assertThat(node.getInt("x")).isOne();
		}
	}
}
