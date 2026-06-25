package xs.aichat.v2.dto.external.wrtn.response;

import lombok.Data;

import java.util.List;

/**
 * 외부(Wrtn) API 응답: 게시판 권한 조회.
 */
@Data
public class BoardAuthApiResponse {

    private List<BoardAuthApiItem> content;
}
