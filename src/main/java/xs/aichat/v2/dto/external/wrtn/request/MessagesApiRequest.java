package xs.aichat.v2.dto.external.wrtn.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 외부(Wrtn) API 요청: 메시지 목록 조회 파라미터.
 */
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@AllArgsConstructor(staticName = "of")
public class MessagesApiRequest {

    private String userId;

    private String conversationId;

    private Integer cursor;

    private Integer size;
}
