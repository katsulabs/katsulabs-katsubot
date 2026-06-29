package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class FeedbackResponse {

    @JsonProperty("feedback_id")
    private String feedbackId;

    @JsonProperty("message_id")
    private String messageId;

    @JsonProperty("feedback_type")
    private String feedbackType;
}
