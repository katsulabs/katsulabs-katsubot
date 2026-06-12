package xs.aichat.v2.dto.internal.rnd;

import java.util.List;

public class MessageSourcesResponse extends PageResponse<MessageSourceItem> {

    public MessageSourcesResponse(List<MessageSourceItem> content, long totalElements, int pageNumber, int pageSize, boolean hasNext) {
        super(content, totalElements, pageNumber, pageSize, hasNext);
    }

    public static MessageSourcesResponse of(List<MessageSourceItem> content, long totalElements, int pageNumber, int pageSize, boolean hasNext) {
        return new MessageSourcesResponse(content, totalElements, pageNumber, pageSize, hasNext);
    }

    public static MessageSourcesResponse of(List<MessageSourceItem> content) {
        return new MessageSourcesResponse(content, 0, 0, 0, false);
    }
}

