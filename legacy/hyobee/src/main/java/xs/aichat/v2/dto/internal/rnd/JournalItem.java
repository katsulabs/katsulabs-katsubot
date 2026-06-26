package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JournalItem {

    private String id;

    @JsonProperty("source_id")
    private String sourceId;

    @JsonProperty("doc_type")
    private String docType;

    private String title;

    private String overview;

    private String author;

    @JsonProperty("source_table")
    private String sourceTable;

    @JsonProperty("source_info")
    private String sourceInfo;

    private String date;

    private String url;

    @JsonProperty("ai_summary")
    private JournalAiSummaryApiItem aiSummary;

}

