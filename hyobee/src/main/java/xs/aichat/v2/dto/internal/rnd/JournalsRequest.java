package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class JournalsRequest {

    @JsonProperty("start_date")
    private String startDate;

    @JsonProperty("end_date")
    private String endDate;

    @JsonProperty("doc_types")
    private String docTypes;

    @JsonProperty("source_url")
    private String sourceUrl;

    @JsonProperty("journal_id")
    private String journalId;

    private String keyword;

    private String creator;

    private int page;

    private int size;
}

