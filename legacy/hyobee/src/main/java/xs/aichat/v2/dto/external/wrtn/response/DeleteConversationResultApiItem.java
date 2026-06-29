package xs.aichat.v2.dto.external.wrtn.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

/**
 * 외부(Wrtn) API 응답: 삭제 결과 한 건.
 */
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DeleteConversationResultApiItem {

    private int status;

    private String conversationId;

    private String chatCategory;
}
