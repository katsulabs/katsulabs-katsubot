package xs.aichat.v2.dto.external.wrtn.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 외부(Wrtn) API 요청: 게시판 권한 조회.
 */
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@AllArgsConstructor(staticName = "of")
public class BoardAuthApiRequest {

    private String pgCode;

    private String puCode;

    private String corpCode;

    private String teamCode;
}
