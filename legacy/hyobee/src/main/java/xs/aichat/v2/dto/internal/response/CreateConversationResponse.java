package xs.aichat.v2.dto.internal.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class CreateConversationResponse {

    @JsonProperty("conversation_id")
    private String conversationId;

    private String title;

    @JsonProperty("chat_category")
    private String chatCategory;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;
}

