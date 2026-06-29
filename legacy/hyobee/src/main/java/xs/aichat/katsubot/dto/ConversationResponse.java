package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class ConversationResponse {

    private String id;

    private String title;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("chat_category")
    private String chatCategory;
}
