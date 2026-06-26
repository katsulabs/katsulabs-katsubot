package xs.aichat.v2.external;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import xs.aichat.v2.dto.external.wrtn.response.*;
import xs.aichat.v2.dto.internal.response.*;

import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 외부 Wrtn API 응답 → 내부(우리 API) 응답 변환.
 * 메시지 목록은 {@link WrtnMessageApiResponseMapper} 사용.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class WrtnChatApiResponseMapper {

    // --- 대화 목록 조회 ---
    public static ConversationsResponse toInternalResponse(ConversationsApiResponse from) {
        if (from == null) {
            return null;
        }

        return ConversationsResponse.of(
                toInternalContents(from.getContent(), WrtnChatApiResponseMapper::toInternalItem),
                from.getPage(),
                from.getSize(),
                from.getTotalCount(),
                from.getHasNext(),
                from.getFirst(),
                from.getLast()
        );
    }

    private static ConversationItem toInternalItem(ConversationApiItem from) {
        if (from == null) {
            return null;
        }

        return ConversationItem.of(
                from.getConversationId(),
                from.getTitle(),
                from.getChatCategory(),
                from.getCreatedAt(),
                from.getUpdatedAt(),
                null
        );
    }

    // --- 대화 생성 ---
    public static CreateConversationResponse toInternalResponse(CreateConversationApiResponse from) {
        if (from == null) {
            return null;
        }

        return CreateConversationResponse.of(
                from.getConversationId(),
                from.getTitle(),
                from.getChatCategory(),
                from.getCreatedAt(),
                from.getUpdatedAt()
        );
    }

    // --- 대화 목록 삭제 ---
    public static DeleteConversationsResponse toInternalResponse(DeleteConversationsApiResponse from) {
        if (from == null) {
            return null;
        }

        return DeleteConversationsResponse.of(
                from.getStatus(),
                from.getUserId(),
                from.getDeletedDate(),
                from.getDeletedCount(),
                toInternalContents(from.getResults(), WrtnChatApiResponseMapper::toInternalItem));
    }

    private static DeleteConversationResultItem toInternalItem(DeleteConversationResultApiItem from) {
        if (from == null) {
            return null;
        }

        return DeleteConversationResultItem.of(
                from.getStatus(),
                from.getConversationId(),
                from.getChatCategory()
        );
    }

    // --- 게시판 권한 조회 ---
    public static BoardAuthResponse toInternalResponse(BoardAuthApiResponse from) {
        if (from == null) {
            return null;
        }

        return BoardAuthResponse.of(toInternalContents(from.getContent(), WrtnChatApiResponseMapper::toInternalItem));
    }

    private static BoardAuthItem toInternalItem(BoardAuthApiItem from) {
        if (from == null) {
            return null;
        }

        return BoardAuthItem.of(from.getBoardName());
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
