package xs.aichat.v2.dto.internal.rnd;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import xs.aichat.v2.dto.external.wrtn.rnd.JournalApiAiSummary;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalAiSummaryApiItem {

    private String intro;

    private String body;

    private String conclusion;

    public static JournalAiSummaryApiItem of(JournalApiAiSummary aiSummary) {
        return new JournalAiSummaryApiItem(
                aiSummary.getIntro(),
                aiSummary.getBody(),
                aiSummary.getConclusion()
        );
    }
}

