package xs.aichat.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("InputValidator 단위 테스트")
class InputValidatorTest {

    @Nested
    @DisplayName("isValidUserId")
    class IsValidUserId {

        @Test
        @DisplayName("정상 userId는 true")
        void validReturnsTrue() {
            assertThat(InputValidator.isValidUserId("user01")).isTrue();
            assertThat(InputValidator.isValidUserId("hong")).isTrue();
        }

        @Test
        @DisplayName("null이면 false")
        void nullReturnsFalse() {
            assertThat(InputValidator.isValidUserId(null)).isFalse();
        }

        @Test
        @DisplayName("빈 문자열이면 false")
        void emptyReturnsFalse() {
            assertThat(InputValidator.isValidUserId("")).isFalse();
        }

        @Test
        @DisplayName("SQL 인젝션 패턴 포함 시 false")
        void sqlInjectionPatternReturnsFalse() {
            assertThat(InputValidator.isValidUserId("user' OR '1'='1")).isFalse();
            assertThat(InputValidator.isValidUserId("admin'; DROP TABLE users--")).isFalse();
        }
    }

    @Nested
    @DisplayName("isValidCorpCode")
    class IsValidCorpCode {

        @Test
        @DisplayName("정상 corp_code는 true")
        void validReturnsTrue() {
            assertThat(InputValidator.isValidCorpCode("1000")).isTrue();
        }

        @Test
        @DisplayName("union 등 위험 패턴이면 false")
        void dangerousPatternReturnsFalse() {
            assertThat(InputValidator.isValidCorpCode("1000 union select")).isFalse();
        }
    }

    @Nested
    @DisplayName("isValid (optional field)")
    class IsValidOptional {

        @Test
        @DisplayName("필수 아님 + null이면 true")
        void notRequiredNullReturnsTrue() {
            assertThat(InputValidator.isValidUserFullName(null)).isTrue();
            assertThat(InputValidator.isValidUserFullName("")).isTrue();
        }

        @Test
        @DisplayName("정상 값이면 true")
        void validValueReturnsTrue() {
            assertThat(InputValidator.isValidUserFullName("홍길동")).isTrue();
        }
    }
}

