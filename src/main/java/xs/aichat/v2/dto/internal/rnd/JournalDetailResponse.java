package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class JournalDetailResponse {

    @JsonProperty("journal_detail")
    private JournalDetail journalDetail;
}

