package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;
import xs.aichat.enumeration.AiSummarySectionRole;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 프론트로 최종 내려가는 /xs/aichat/v2/rnd/journal/{journalId}/ai-summary 응답 DTO.
 *
 * - Wrtn 원본 intro/body/conclusion 은 {@link JournalAiSummaryApiItem} 로 받고,
 *   이 클래스에서는 도메인 역할(role) + label + content 로 변환해 노출한다.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@AllArgsConstructor
public class JournalAiSummaryResponse {

    @JsonProperty("doc_type")
    private String docType;

    @JsonProperty("ai_summary")
    private List<AiSummarySection> aiSummary;

    public static JournalAiSummaryResponse from(String docType, JournalAiSummaryApiItem apiResponse) {
        var sections = new ArrayList<AiSummarySection>();

        if (apiResponse == null) {
            sections.add(new AiSummarySection(
                    0,
                    AiSummarySectionRole.OVERVIEW,
                    null,
                    "요약된 데이터가 존재하지 않습니다."
            ));

            return new JournalAiSummaryResponse(docType, sections);
        }

        var intro = apiResponse.getIntro();
        var body = apiResponse.getBody();
        var conclusion = apiResponse.getConclusion();

        var lowerDocType = docType != null ? docType.toLowerCase() : "";

        switch (lowerDocType) {
            case "paper":
                if (StringUtils.hasText(intro)) {
                    sections.add(new AiSummarySection(
                            0,
                            AiSummarySectionRole.OVERVIEW,
                            null,
                            intro
                    ));
                }
                if (StringUtils.hasText(body)) {
                    sections.add(new AiSummarySection(
                            1,
                            AiSummarySectionRole.PURPOSE,
                            "연구 목적",
                            body
                    ));
                }
                if (StringUtils.hasText(conclusion)) {
                    sections.add(new AiSummarySection(
                            2,
                            AiSummarySectionRole.METHOD,
                            "연구 방법",
                            conclusion
                    ));
                }
                break;
            case "patent":
                if (StringUtils.hasText(intro)) {
                    sections.add(new AiSummarySection(
                            0,
                            AiSummarySectionRole.PROBLEM,
                            "문제점",
                            body
                    ));
                }
                if (StringUtils.hasText(body)) {
                    sections.add(new AiSummarySection(
                            1,
                            AiSummarySectionRole.SOLUTION,
                            "해결책",
                            conclusion
                    ));
                }
                break;
            case "article":
            default:
                if (StringUtils.hasText(intro)) {
                    sections.add(new AiSummarySection(
                            0,
                            AiSummarySectionRole.OVERVIEW,
                            null,
                            intro
                    ));
                }
                break;
        }

        var sortedAiSummary = sections.stream()
                .sorted(Comparator.comparingInt(AiSummarySection::getIdx))  // int idx
                .collect(Collectors.toList());

        return new JournalAiSummaryResponse(docType, sortedAiSummary);
    }
}

