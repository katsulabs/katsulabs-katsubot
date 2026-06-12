package xs.aichat.v2.dto.internal.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class FeedbackRequest {

    @JsonProperty("feedback_type")
    @NotBlank(message = "피드백 타입은 필수 값입니다.")
    private String feedbackType;
}

