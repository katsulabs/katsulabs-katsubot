package xs.aichat.v2.external;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import xs.aichat.v2.dto.external.wrtn.response.MessageApiItem;
import xs.aichat.v2.dto.internal.response.MessageItem;
import xs.aichat.v2.dto.internal.response.FeedbackResponse;
import xs.aichat.v2.util.DocumentLinkBuilder;

import java.util.Collections;
import java.util.List;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;

/**
 * 외부 Wrtn 응답 → 내부 API 응답 변환.
 * (외부 스펙 변경과 내부 노출 형식을 분리하기 위한 레이어)
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class WrtnMessageApiResponseMapper {

    /**
     * 외부 API 메시지 목록을 내부 ChatMessageItem 목록으로 변환.
     *
     * @param apiItems   외부 API 응답의 content (null 가능)
     * @param contentFilter content 가공 함수 (예: 소스 필터), null이면 적용 안 함
     * @return 내부 API용 리스트 (null이면 빈 리스트)
     */
    public static List<MessageItem> toInternalResponse(
            List<MessageApiItem> apiItems,
            UnaryOperator<String> contentFilter) {
        if (apiItems == null || apiItems.isEmpty()) {
            return Collections.emptyList();
        }
        return apiItems.stream()
                .map(item -> toInternalItem(item, contentFilter))
                .collect(Collectors.toList());
    }

    /**
     * 외부 API 메시지 한 건 → 내부 ChatMessageItem.
     * feedback은 내부 정책에 따라 빈 문자열로 통일 (필요 시 변경 가능).
     */
    public static MessageItem toInternalItem(MessageApiItem from, UnaryOperator<String> contentFilter) {
        var sourceApiItems = from.getSources();
        if(from.getSources() == null || from.getSources().isEmpty()) {
            sourceApiItems = Collections.emptyList();
        }

        // content 내 source URL도 내부 랜딩 URL 규칙으로 일관되게 치환
        String content = replaceSourceUrlsInContent(from.getContent(), sourceApiItems);
        if (contentFilter != null) {
            content = contentFilter.apply(content);
        }

        var sources = sourceApiItems.stream()
                .map(MessageItem.SourceItem::of)
                .collect(Collectors.toList());

        return MessageItem.of(
                from.getMessageId(),
                content,
                sources,
                MessageItem.SourceHeader.of(
                        from.getSourceHeaders()
                ),
                from.getRole(),
                from.getAttachments(),
                from.getFeedback() == null ? StringUtils.EMPTY : FeedbackResponse.of(from.getFeedback()),
                from.getCreatedAt()
        );
    }

    private static String replaceSourceUrlsInContent(String content, List<MessageApiItem.SourceApiItem> sources) {
        if (content == null || content.isEmpty() || sources == null || sources.isEmpty()) {
            return content;
        }
        String replaced = content;
        for (var source : sources) {
            if (source == null) {
                continue;
            }
            String originalUrl = source.getUrl();
            if (originalUrl == null || originalUrl.isEmpty()) {
                continue;
            }

            String resolvedUrl = DocumentLinkBuilder.resolveSourceUrl(
                    source.getSourceType(),
                    source.getDocType(),
                    source.getSourceId(),
                    isInternalSource(source.getSourceType(), source.getDocType()) ? source.getBoardId() : null,
                    originalUrl
            );
            if (resolvedUrl == null || resolvedUrl.isEmpty() || originalUrl.equals(resolvedUrl)) {
                continue;
            }
            replaced = replaced.replace(originalUrl, resolvedUrl);
        }
        return replaced;
    }

    private static boolean isInternalSource(String sourceType, String docType) {
        return "internal".equalsIgnoreCase(docType != null ? docType : "")
                || "internal".equalsIgnoreCase(sourceType != null ? sourceType : "");
    }
}
