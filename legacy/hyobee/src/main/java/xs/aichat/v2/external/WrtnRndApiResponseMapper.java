package xs.aichat.v2.external;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import xs.aichat.v2.dto.external.wrtn.rnd.*;
import xs.aichat.v2.dto.internal.rnd.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import static xs.aichat.util.DateUtils.*;
import static xs.aichat.v2.util.DocumentLinkBuilder.buildJournalLandingPath;
import static xs.aichat.v2.util.DocumentLinkBuilder.resolveSourceUrl;

/**
 * 외부 Wrtn API 응답 → 내부(우리 API) 응답 변환.
 * 메시지 목록은 {@link WrtnMessageApiResponseMapper} 사용.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class WrtnRndApiResponseMapper {

    public static MessageSourcesResponse toInternalResponse(MessageSourcesApiResponse from) {
        if (from == null) {
            return null;
        }

        var messageSourceItems = toInternalContents(from.getSources(), WrtnRndApiResponseMapper::toMessageSourceItem);
        return MessageSourcesResponse.of(
                messageSourceItems,
                from.getTotalCount(),
                from.getPage(),
                from.getSize(),
                from.getHasNext()
        );
    }

    private static String resolveMessageSourceUrl(MessageSourceApiItem from) {
        if ("internal".equalsIgnoreCase(nullToEmpty(from.getDocType()))) {
            return resolveSourceUrl(null, from.getDocType(), from.getSourceId(), from.getBoardId(), from.getUrl());
        }
        return buildJournalLandingPath(from.getDocType(), from.getSourceId());
    }

    private static String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private static MessageSourceItem toMessageSourceItem(MessageSourceApiItem from) {
        if (from == null) {
            return null;
        }

        return new MessageSourceItem(
                from.getSourceId(),
                from.getDocType(),
                from.getTitle(),
                from.getAuthor(),
                parseToDateString(from.getDate()),
                // similarity가 null이면 -999.0, 아니면 소수점 2자리 반올림 처리
                from.getSimilarity() == null
                        ? -999.0
                        : BigDecimal.valueOf(from.getSimilarity())
                          .setScale(2, RoundingMode.HALF_UP)
                          .doubleValue(),
                resolveMessageSourceUrl(from),
                from.getSourceName(),
                "internal".equalsIgnoreCase(nullToEmpty(from.getDocType())) ? from.getBoardId() : null
        );
    }

    public static JournalsResponse toInternalResponse(JournalsApiResponse from) {
        if (from == null) {
            return null;
        }

        var journalItems = toInternalContents(from.getContent(), WrtnRndApiResponseMapper::toJournalItem);
        return JournalsResponse.of(
                journalItems,
                from.getTotalCount(),
                from.getPage(),
                from.getSize(),
                from.getHasNext()
        );
    }

    private static JournalItem toJournalItem(JournalApiItem from) {
        if (from == null) {
            return null;
        }

        return new JournalItem(
                from.getId(),
                from.getSourceId(),
                from.getDocType(),
                from.getTitle(),
                from.getOverview(),
                from.getAuthor(),
                from.getSourceTable(),
                from.getSourceInfo(),
//                parseToDateString(from.getDate()),
                from.getDate(),
                from.getUrl(),
                mapIfNotNull(from.getAiSummary(), JournalAiSummaryApiItem::of)
        );
    }

    private static <S, T> List<T> toInternalContents(
            List<S> items,
            Function<S, T> mapper
    ) {
        if (items == null || items.isEmpty()) {
            return Collections.emptyList();
        }
        return items.stream()
                .map(mapper)
                .collect(Collectors.toList());
    }

    private static <S, T> T mapIfNotNull(S from, Function<S, T> mapper) {
        return from == null ? null : mapper.apply(from);
    }
}
