package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor(staticName = "of")
public class DeleteConversationsResponse {

    @JsonProperty("deleted_count")
    private int deletedCount;

    private List<DeleteConversationResult> results;
}
