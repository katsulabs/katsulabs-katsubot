package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessageResponse {

    private String id;

    private String role;

    private String content;

    @JsonProperty("created_at")
    private String createdAt;

    private MessageFeedbackSummary feedback;
}
