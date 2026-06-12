package xs.aichat.v2.dto.internal.rnd;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import xs.aichat.enumeration.AiSummarySectionRole;

/**
 * /xs/aichat/v2/rnd/journal/{journalId}/ai-summary 에서 사용하는
 * 역할/라벨/콘텐츠 단위의 요약 섹션 DTO.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiSummarySection {

    private int idx;

    private AiSummarySectionRole role; // PURPOSE / METHOD / PROBLEM / SOLUTION / OVERVIEW

    private String label;            // 화면에 찍을 한글 라벨 (예: "연구 목적", "문제점"). article 등에서는 null 가능.

    private String content;          // 실제 텍스트
}

