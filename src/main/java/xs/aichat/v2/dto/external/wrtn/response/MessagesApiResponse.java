package xs.aichat.v2.dto.external.wrtn.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import java.util.List;

/**
 * 외부(Wrtn) API 응답: 메시지 목록 조회.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class MessagesApiResponse {

    private List<MessageApiItem> content;

    private Integer size;

    private Integer totalCount;

    private Boolean hasNext;

    private Boolean first;

    private Boolean last;

    private String nextCursor;
}
