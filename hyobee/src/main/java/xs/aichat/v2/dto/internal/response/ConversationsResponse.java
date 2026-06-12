package xs.aichat.v2.dto.internal.response;

import lombok.Getter;
import xs.aichat.v2.dto.internal.rnd.PageResponse;

import java.util.List;

@Getter
public class ConversationsResponse extends PageResponse<ConversationItem> {

    private ConversationsResponse(List<ConversationItem> content, long totalElements, int pageNumber, int pageSize, boolean hasNext) {
        super(content, totalElements, pageNumber, pageSize, hasNext);
    }

    public ConversationsResponse(List<ConversationItem> content, long totalElements, int pageNumber, int pageSize, boolean hasNext, boolean first, boolean last) {
        super(content, totalElements, pageNumber, pageSize, hasNext);
    }

    public static ConversationsResponse of(List<ConversationItem> content,  long totalElements, int pageNumber, int pageSize, boolean hasNext) {
        return new ConversationsResponse(content, totalElements, pageNumber, pageSize, hasNext);
    }

    public static ConversationsResponse of(List<ConversationItem> content,  long totalElements, int pageNumber, int pageSize, boolean hasNext, boolean first, boolean last) {
        return new ConversationsResponse(content, totalElements, pageNumber, pageSize, hasNext, first, last);
    }
}

