package xs.aichat.v2.dto.external.wrtn.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import java.util.List;

/**
 * 외부(Wrtn) API 응답: 대화 목록 삭제.
 */
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DeleteConversationsApiResponse {

    private int status;

    private String userId;

    private String deletedDate;

    private int deletedCount;

    private List<DeleteConversationResultApiItem> results;
}
