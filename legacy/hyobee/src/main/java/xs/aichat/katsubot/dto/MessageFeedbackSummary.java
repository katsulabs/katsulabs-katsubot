package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class MessageFeedbackSummary {

    @JsonProperty("feedback_id")
    private String feedbackId;

    @JsonProperty("feedback_type")
    private String feedbackType;
}
