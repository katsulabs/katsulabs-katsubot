package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class DeleteConversationResult {

    @JsonProperty("conversation_id")
    private String conversationId;

    private boolean deleted;

    private String error;
}
