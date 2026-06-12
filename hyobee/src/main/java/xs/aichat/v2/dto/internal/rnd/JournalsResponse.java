package xs.aichat.v2.dto.internal.rnd;

import java.util.List;

public class JournalsResponse extends PageResponse<JournalItem> {

    private JournalsResponse(List<JournalItem> content, int totalElements, int pageNumber, int pageSize, boolean hasNext) {
        super(content, totalElements, pageNumber, pageSize, hasNext);
    }

    public static JournalsResponse of(List<JournalItem> content, int totalElements, int pageNumber, int pageSize, boolean hasNext) {
        return new JournalsResponse(content, totalElements, pageNumber, pageSize, hasNext);
    }
}

