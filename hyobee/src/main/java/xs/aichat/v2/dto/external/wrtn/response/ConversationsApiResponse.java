package xs.aichat.v2.dto.external.wrtn.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import java.util.List;

/**
 * 외부(Wrtn) API 응답: 대화 목록 조회.
 */
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ConversationsApiResponse {

    private List<ConversationApiItem> content;

    private int page;

    private int size;

    private int totalCount;

    private Boolean hasNext;

    private Boolean first;

    private Boolean last;
}
