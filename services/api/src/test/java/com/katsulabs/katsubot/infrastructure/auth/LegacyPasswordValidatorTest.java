package com.katsulabs.katsubot.infrastructure.auth;

import com.katsulabs.katsubot.infrastructure.auth.AuthProperties;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LegacyPasswordValidatorTest {

    private final LegacyPasswordValidator validator = new LegacyPasswordValidator();

    @Test
    void sha256HexMatchesLegacyFormat() {
        assertThat(validator.sha256Hex("hello")).isEqualTo(
                "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
        );
    }

    @Test
    void matchesAfterFiveRoundsWithEncptKeyInfo() {
        String encptKeyInfo = "company-key";
        String clientHash = "initial-client-hash";
        String dbHash = clientHash;
        for (int i = 0; i < 5; i++) {
            dbHash = validator.sha256Hex(dbHash + encptKeyInfo);
        }

        assertThat(validator.matches(clientHash, dbHash, encptKeyInfo)).isTrue();
        assertThat(validator.matches("wrong", dbHash, encptKeyInfo)).isFalse();
    }
}
