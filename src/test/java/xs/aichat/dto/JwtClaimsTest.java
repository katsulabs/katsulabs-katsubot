package xs.aichat.dto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import xs.aichat.util.JacksonJsonAdapter;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("JwtClaims record (TB-005 005b pilot)")
class JwtClaimsTest {

    private final JacksonJsonAdapter jsonAdapter = new JacksonJsonAdapter();

    @Test
    @DisplayName("of factory와 accessor가 claim 필드를 유지한다")
    void of_retainsFields() {
        var claims = JwtClaims.of("PG", "PU", "1000", "TEAM01", List.of("ROLE_USER"));

        assertThat(claims.pgCode()).isEqualTo("PG");
        assertThat(claims.puCode()).isEqualTo("PU");
        assertThat(claims.corpCode()).isEqualTo("1000");
        assertThat(claims.teamCode()).isEqualTo("TEAM01");
        assertThat(claims.roles()).containsExactly("ROLE_USER");
    }

    @Test
    @DisplayName("Jackson JsonAdapter toMap 직렬화에 record 필드가 포함된다")
    void serializesViaJsonAdapter() {
        var claims = JwtClaims.of("PG", "PU", "1000", "TEAM01", List.of("ROLE_ADMIN"));

        @SuppressWarnings("unchecked")
        var map = (java.util.Map<String, Object>) jsonAdapter.toMap(claims);

        assertThat(map)
                .containsEntry("pgCode", "PG")
                .containsEntry("puCode", "PU")
                .containsEntry("corpCode", "1000")
                .containsEntry("teamCode", "TEAM01")
                .containsEntry("roles", List.of("ROLE_ADMIN"));
    }
}
