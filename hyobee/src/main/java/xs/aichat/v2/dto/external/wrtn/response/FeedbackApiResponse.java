package xs.aichat.v2.dto.external.wrtn.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class FeedbackApiResponse {

    private String feedbackId;

    private String messageId;

    private String feedbackType;
}

