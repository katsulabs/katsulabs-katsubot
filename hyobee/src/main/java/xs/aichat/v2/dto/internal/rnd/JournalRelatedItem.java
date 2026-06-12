package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JournalRelatedItem {

    private String title;
    private String journal; // "WORKS", "PATENT_DETAIL_SUMMARY" 등
    private String authors;
    private String url;

    @JsonProperty("doc_id")
    private String docId;

    @JsonProperty("doc_type")
    private String docType;

    private String date;
    private double score; // 유사도 점수
}