package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Wrtn /api/v2/rnd/journal/{journalId}/ai-summary 원본 응답을 받기 위한 DTO.
 * - ai_summary: intro/body/conclusion 구조 유지
 * - cached 등 기타 필드는 현재 사용하지 않아 무시한다.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@AllArgsConstructor
public class JournalAiSummaryApiResponse {

    @JsonProperty("ai_summary")
    private JournalAiSummaryApiItem aiSummary;
}

