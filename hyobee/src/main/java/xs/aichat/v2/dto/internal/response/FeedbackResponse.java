package xs.aichat.v2.dto.internal.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import xs.aichat.v2.dto.external.wrtn.response.FeedbackApiResponse;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {

    @JsonProperty("feedback_id")
    private String feedbackId;

    @JsonProperty("message_id")
    private String messageId;

    @JsonProperty("feedback_type")
    private String feedbackType;

    public static FeedbackResponse of(FeedbackApiResponse response) {
        return new FeedbackResponse(response.getFeedbackId(), response.getMessageId(), response.getFeedbackType());
    }
}


