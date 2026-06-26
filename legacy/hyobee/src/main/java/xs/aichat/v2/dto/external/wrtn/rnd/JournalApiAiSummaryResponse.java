package xs.aichat.v2.dto.external.wrtn.rnd;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalApiAiSummaryResponse {

    @JsonProperty("ai_summary")
    private JournalApiAiSummary aiSummary;

    private Boolean cached;
}