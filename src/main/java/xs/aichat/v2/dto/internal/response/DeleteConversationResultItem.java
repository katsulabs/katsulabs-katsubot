package xs.aichat.v2.dto.internal.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class DeleteConversationResultItem {

    private int status;

    @JsonProperty("conversation_id")
    private Long conversationId;

    @JsonProperty("chat_category")
    private String chatCategory;
}

