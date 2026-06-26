package xs.aichat.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class DateUtils {

    public static final ZoneId KST_ZONE_ID = ZoneId.of("Asia/Seoul");
    private static final DateTimeFormatter YYYY_MM_DD = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // [핵심] 공백과 T를 모두 허용하고, 모든 요소를 선택적(Optional)으로 처리하는 포맷터
    private static final DateTimeFormatter UNIVERSAL_FORMATTER = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd")
            .appendOptional(DateTimeFormatter.ofPattern("'T'")) // T가 있으면 읽고
            .appendOptional(DateTimeFormatter.ofPattern(" "))   // 공백이 있어도 읽음
            .appendPattern("HH:mm:ss")
            .optionalStart()
            .appendFraction(ChronoField.NANO_OF_SECOND, 0, 9, true)
            .optionalEnd()
            .optionalStart()
            .appendPattern("XXX") // +00:00 형식
            .optionalEnd()
            .optionalStart()
            .appendOffsetId()      // Z 형식
            .optionalEnd()
            .toFormatter();

    public static LocalDateTime parseAny(String dateStr) {
        if (StringUtils.isBlank(dateStr)) {
            return null;
        }

        try {
            String normalized = dateStr.trim();

            // 날짜만 오는 케이스(예: 2024-04-30)
            // LocalDateTime + HH:mm:ss가 필수인 포맷터로 파싱하면 index 에러가 발생할 수 있어 선처리한다.
            if (normalized.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
                return java.time.LocalDate.parse(normalized, java.time.format.DateTimeFormatter.ISO_LOCAL_DATE)
                        .atStartOfDay();
            }

            // 1. 시간대 정보(+ 또는 Z)가 있는지 확인
            if (normalized.contains("+") || normalized.toUpperCase().contains("Z")) {
                // 시간대가 있다면 ZonedDateTime으로 읽어서 KST로 변환
                return ZonedDateTime.parse(normalized, UNIVERSAL_FORMATTER)
                        .withZoneSameInstant(KST_ZONE_ID)
                        .toLocalDateTime();
            } else {
                // 시간대가 없다면 바로 LocalDateTime으로 읽기
                return LocalDateTime.parse(normalized, UNIVERSAL_FORMATTER);
            }
        } catch (Exception e) {
            // 로그 기록: log.error("Parsing failed for: {}", dateStr, e);
            return null;
        }
    }

    public static String parseToDateString(String dateStr) {
        LocalDateTime ldt = parseAny(dateStr);
        return (ldt != null) ? ldt.format(YYYY_MM_DD) : null;
    }
}