package xs.aichat.v2.dto.internal.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class BoardAuthItem {

    @JsonProperty("board_name")
    private String boardName;
}


