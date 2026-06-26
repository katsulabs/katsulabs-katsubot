package xs.aichat.v2.dto.internal.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import xs.aichat.v2.dto.internal.rnd.PageResponse;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BoardAuthResponse extends PageResponse<BoardAuthItem> {

    private BoardAuthResponse(List<BoardAuthItem> content, long totalElements, int pageNumber, int pageSize, boolean hasNext) {
        super(content, totalElements, pageNumber, pageSize, hasNext);
    }

    public static BoardAuthResponse of(List<BoardAuthItem> content) {
        return new BoardAuthResponse(content, 0, 0, 0, false);
    }
}

