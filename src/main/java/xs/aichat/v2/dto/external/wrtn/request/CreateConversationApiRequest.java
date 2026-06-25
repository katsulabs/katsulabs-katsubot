package xs.aichat.v2.dto.external.wrtn.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 외부(Wrtn) API 요청: 대화 생성.
 */
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@AllArgsConstructor(staticName = "of")
public class CreateConversationApiRequest {

    private String userId;

    private String userQuery;

    private String chatCategory;
}
