package xs.aichat.util;

import lombok.extern.slf4j.Slf4j;
import java.util.regex.Pattern;

/**
 * SQL Injection 취약점 방지를 위한 입력값 검증 유틸리티 클래스
 */
@Slf4j
public class InputValidator {

    // SQL Injection 공격 패턴: ' or '1' = '1' -- 같은 공격 문자 차단
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
        "('|;|--|/\\*|\\*/|xp_|exec|execute|union|select|insert|update|delete|drop|create|alter|grant|revoke|truncate|declare|cast|convert|or\\s+['\"]1['\"]\\s*=\\s*['\"]1)",
        Pattern.CASE_INSENSITIVE
    );

    /**
     * SQL Injection 패턴 검증
     * @param input 검증할 입력값
     * @param fieldName 필드명 (로그용)
     * @param required 필수 여부
     * @return 검증 통과 시 true
     */
    public static boolean isValid(String input, String fieldName, boolean required) {
        if (input == null || input.isEmpty()) {
            return !required; // 필수면 false, 선택이면 true
        }
        if (SQL_INJECTION_PATTERN.matcher(input).find()) {
            log.warn("SQL Injection 패턴이 발견된 {}: {}", fieldName, sanitizeLogOutput(input));
            return false;
        }
        return true;
    }

    // 편의 메서드들
    public static boolean isValidUserId(String userId) {
        return isValid(userId, "user_id", true);
    }

    public static boolean isValidPgCode(String pgCode) {
        return isValid(pgCode, "pg_code", true);
    }

    public static boolean isValidPuCode(String puCode) {
        return isValid(puCode, "pu_code", true);
    }

    public static boolean isValidTeamCode(String teamCode) {
        return isValid(teamCode, "team_code", true);
    }

    public static boolean isValidCorpCode(String corpCode) {
        return isValid(corpCode, "corp_code", true);
    }

    public static boolean isValidUserFullName(String userFullName) {
        return isValid(userFullName, "user_full_name", false);
    }

    public static boolean isValidUserFirstName(String userFirstName) {
        return isValid(userFirstName, "user_first_name", false);
    }

    /**
     * 로그 출력 시 민감한 정보를 마스킹하여 출력
     */
    private static String sanitizeLogOutput(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        return input.length() > 50 ? input.substring(0, 50) + "..." : input;
    }
}
