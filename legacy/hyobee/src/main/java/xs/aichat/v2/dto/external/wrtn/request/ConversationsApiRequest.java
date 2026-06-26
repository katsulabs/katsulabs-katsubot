package xs.aichat.v2.dto.external.wrtn.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 외부(Wrtn) API 요청: 대화 목록 조회.
 */
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@AllArgsConstructor(staticName = "of")
public class ConversationsApiRequest {

    private String userId;

    private int page;

    private int size;
}
