package com.katsulabs.chatbot.infrastructure.auth;

import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LegacyJwtTokenValidatorTest {

    private static final String TEST_SECRET = "yZp3n4W8LkqS1tDbE9mV0rXuA7wC2pTfG5hQ8jR3xU6sNcKdF4vB1zYeH0aMiOwP";

    @Test
    void validatesHyobeeStyleHs512Token() {
        var signingKey = LegacyJwtTokenValidator.resolveSigningKey(TEST_SECRET);
        String token = Jwts.builder()
                .subject("bp0006080")
                .claim("corpCode", "00")
                .claim("pgCode", "H")
                .claim("puCode", "H01")
                .claim("teamCode", "13400")
                .signWith(signingKey, Jwts.SIG.HS512)
                .compact();

        var validator = new LegacyJwtTokenValidator(new AuthProperties(false, "dev-token", TEST_SECRET));
        var user = validator.validate(token);

        assertThat(user).isPresent();
        assertThat(user.get().userId()).isEqualTo("bp0006080");
        assertThat(user.get().corpCode()).isEqualTo("00");
        assertThat(user.get().teamCode()).isEqualTo("13400");
    }

    @Test
    void rejectsTokenWhenSecretNotConfigured() {
        var validator = new LegacyJwtTokenValidator(new AuthProperties(false, "dev-token", null));
        assertThat(validator.validate("any.jwt.token")).isEmpty();
    }

    @Test
    void rejectsMalformedToken() {
        var validator = new LegacyJwtTokenValidator(new AuthProperties(false, "dev-token", TEST_SECRET));
        assertThat(validator.validate("not-a-jwt")).isEmpty();
    }
}
