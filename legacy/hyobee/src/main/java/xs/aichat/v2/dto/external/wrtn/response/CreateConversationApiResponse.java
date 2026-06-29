package xs.aichat.v2.dto.external.wrtn.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

/**
 * 외부(Wrtn) API 응답: 대화 생성.
 */
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CreateConversationApiResponse {

    private String conversationId;

    private String title;

    private String chatCategory;

    private String createdAt;

    private String updatedAt;
}
