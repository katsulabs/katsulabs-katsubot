package xs.aichat.v2.dto.external.wrtn.rnd;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalApiAiSummary {

    private String intro;

    private String body;

    private String conclusion;
}