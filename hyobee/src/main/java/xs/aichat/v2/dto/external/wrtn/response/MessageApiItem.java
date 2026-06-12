package xs.aichat.v2.dto.external.wrtn.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 외부(Wrtn) API 응답: 메시지 한 건.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class MessageApiItem {

    private int messageId;

    private String content;

    private List<SourceApiItem> sources;

    private SourceHeaderApiItem sourceHeaders;

    private String role;

    private List<Object> attachments;

    private FeedbackApiResponse feedback;

    private String createdAt;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceApiItem {

        private String sourceType;

        private String displayTitle;

        private String sourceTitle;

        private String url;

        private String sourceId;

        private String docType;

        private String snippet;

        private String author;

        private String date;

        private Double similarity;

        private String sourceName;

        private String meta;

        private String boardId; // doc_type=internal 일 때만 사용
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceHeaderApiItem {

        private int totalCount;

        private int paper;

        private int patent;

        private int article;

        private int internal;
    }
}
