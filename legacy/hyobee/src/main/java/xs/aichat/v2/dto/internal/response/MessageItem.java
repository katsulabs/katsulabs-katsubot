package xs.aichat.v2.dto.internal.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import xs.aichat.v2.dto.external.wrtn.response.MessageApiItem;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import static xs.aichat.v2.util.DocumentLinkBuilder.resolveSourceUrl;

/**
 * 내부 API 응답: 프론트로 내보내는 메시지 한 건.
 * (외부 Wrtn 응답을 가공한 결과)
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor(staticName = "of")
public class MessageItem {

    @JsonProperty("message_id")
    private int messageId;

    private String content;

    private List<SourceItem> sources;

    @JsonProperty("source_headers")
    private SourceHeader sourceHeaders;

    private String role;

    private List<Object> attachments;

    private Object feedback;

    @JsonProperty("created_at")
    private String createdAt;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceItem {

        private String source_type;

        private String display_title;

        private String source_title;

        private String url;

        private String source_id;

        private String doc_type;

        private String author;

        private String date;

        private String source_name;

        private Double similarity;

        private String meta;

        public static SourceItem of(MessageApiItem.SourceApiItem item) {
            if (item == null) {
                return null;
            }

            return new SourceItem(
                    item.getSourceType(),
                    item.getDisplayTitle(),
                    item.getSourceTitle(),
                    resolveSourceUrl(
                            item.getSourceType(),
                            item.getDocType(),
                            item.getSourceId(),
                            isInternalSource(item.getSourceType(), item.getDocType()) ? item.getBoardId() : null,
                            item.getUrl()
                    ),
                    item.getSourceId(),
                    item.getDocType(),
                    item.getAuthor(),
                    item.getDate(),
                    item.getSourceName(),
                    // similarity가 null이면 -999.0, 아니면 소수점 2자리 반올림 처리
                    item.getSimilarity() == null
                            ? -999.0
                            : BigDecimal.valueOf(item.getSimilarity())
                              .setScale(2, RoundingMode.HALF_UP)
                              .doubleValue(),
                    item.getMeta()
            );
        }

        private static boolean isInternalSource(String sourceType, String docType) {
            return "internal".equalsIgnoreCase(docType != null ? docType : "")
                    || "internal".equalsIgnoreCase(sourceType != null ? sourceType : "");
        }
    }

    @Data
    @AllArgsConstructor(staticName = "of")
    public static class SourceHeader {

        @JsonProperty("total_count")
        private int total_count;

        private int paper;

        private int patent;

        private int article;

        private int internal;

        public static SourceHeader of(MessageApiItem.SourceHeaderApiItem item) {
            if (item == null) {
                return null;
            }

            return new SourceHeader(
                    item.getTotalCount(),
                    item.getPaper(),
                    item.getPatent(),
                    item.getArticle(),
                    item.getInternal()
            );
        }
    }
}
