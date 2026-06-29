package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor(staticName = "of")
public class BoardAuthPageResponse {

    private List<BoardAuthItemResponse> items;

    @JsonProperty("total_elements")
    private long totalElements;

    @JsonProperty("page_number")
    private int pageNumber;

    @JsonProperty("page_size")
    private int pageSize;

    @JsonProperty("has_next")
    private boolean hasNext;
}
