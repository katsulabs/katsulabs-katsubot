package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor(staticName = "of")
public class MessagesPageResponse {

    private List<MessageResponse> messages;

    @JsonProperty("has_more")
    private boolean hasMore;

    @JsonProperty("next_cursor")
    private String nextCursor;
}
