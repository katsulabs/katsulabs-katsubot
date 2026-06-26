package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageSourceItem {

    private String id;

    private String type;

    private String title;

    private String author;

    private String date;

    private Double similarity;

    private String url;

    @JsonProperty("source_name")
    private String sourceName;

    @JsonProperty("board_id")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String boardId;
}

