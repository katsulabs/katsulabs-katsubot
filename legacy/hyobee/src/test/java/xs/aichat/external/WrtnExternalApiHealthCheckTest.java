package xs.aichat.external;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

@Tag("external")
@DisplayName("외부 벤더(Wrtn) - _health 호출 테스트")
class WrtnExternalApiHealthCheckTest {

    @Test
    @DisplayName("GET {WRTN_BASEURL}/_health 결과 검사")
    void healthCheck_externalCall() throws Exception {
        boolean runExternal = Boolean.parseBoolean(System.getenv().getOrDefault("RUN_EXTERNAL_API_TESTS", "false"));
        Assumptions.assumeTrue(runExternal, "외부 API 테스트는 RUN_EXTERNAL_API_TESTS=true 일 때만 실행합니다.");

        String baseUrl = System.getenv().getOrDefault("WRTN_BASEURL", "https://ax-api-gateway.wrtn.ai/hsgc-demo");
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        String url = baseUrl + "/_health";

        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(10))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        assertThat(response.statusCode()).isBetween(200, 299);
        assertThat(response.body()).isNotBlank();

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> body = mapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});
        assertThat(body).isNotNull();

        if (body.containsKey("error")) {
            fail("External API returned error: " + body.get("error"));
        }
        if (body.containsKey("status")) {
            assertThat(body.get("status")).isNotNull();
        }
    }
}

