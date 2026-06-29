package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UpsertFeedbackBody {

    @NotBlank(message = "feedback_type은 필수입니다")
    @JsonProperty("feedback_type")
    private String feedbackType;
}
