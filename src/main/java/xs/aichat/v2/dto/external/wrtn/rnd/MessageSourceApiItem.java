package xs.aichat.v2.dto.external.wrtn.rnd;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class MessageSourceApiItem {

    private String referenceIndex;

    private String sourceId;

    private String docType;

    private String docTypeLabel;

    private String title;

    private String author;

    private String date;

    private Double similarity;

    private String url;

    private String sourceName;

    private String boardId; // doc_type=internal 일 때만 사용
}

