package xs.aichat.katsubot.mapper;

import xs.aichat.katsubot.dto.*;
import xs.aichat.v2.dto.internal.request.CreateConversationRequest;
import xs.aichat.v2.dto.internal.request.DeleteConversationRequest;
import xs.aichat.v2.dto.internal.request.FeedbackRequest;
import xs.aichat.v2.dto.internal.response.*;
import xs.aichat.v2.dto.wrapper.ApiResponse;
import xs.aichat.v2.dto.wrapper.JsonDataWrapper;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public final class KatsubotResponseMapper {

    private static final String DEFAULT_CHAT_CATEGORY = "internal_rules";
    private static final int DEFAULT_LIST_PAGE_SIZE = 50;

    private KatsubotResponseMapper() {
    }

    public static CreateConversationRequest toLegacyCreateRequest(String userId, CreateConversationBody body) {
        var request = new CreateConversationRequest();
        request.setUserId(userId);
        var title = body != null && body.getTitle() != null && !body.getTitle().isBlank()
                ? body.getTitle().trim()
                : "새 대화";
        request.setUserQuery(title);
        request.setChatCategory(resolveChatCategory(body != null ? body.getChatCategory() : null));
        return request;
    }

    private static String resolveChatCategory(String chatCategory) {
        if (chatCategory == null || chatCategory.isBlank()) {
            return DEFAULT_CHAT_CATEGORY;
        }
        return chatCategory.trim();
    }

    public static ConversationResponse toConversationResponse(ConversationItem item) {
        if (item == null) {
            return null;
        }
        return ConversationResponse.of(
                item.getConversationId(),
                item.getTitle(),
                item.getCreatedAt(),
                item.getChatCategory()
        );
    }

    public static List<ConversationResponse> toConversationResponses(ConversationsResponse page) {
        if (page == null || page.getContent() == null) {
            return List.of();
        }
        return page.getContent().stream()
                .map(KatsubotResponseMapper::toConversationResponse)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public static DeleteConversationRequest toLegacyDeleteRequest(String userId, DeleteConversationsBody body) {
        var request = new DeleteConversationRequest();
        request.setUserId(userId);
        request.setConversationIds(body.getConversationIds());
        return request;
    }

    public static xs.aichat.katsubot.dto.DeleteConversationsResponse toDeleteResponse(
            xs.aichat.v2.dto.internal.response.DeleteConversationsResponse legacy
    ) {
        if (legacy == null) {
            return xs.aichat.katsubot.dto.DeleteConversationsResponse.of(0, List.of());
        }
        var results = legacy.getResults() == null
                ? List.<DeleteConversationResult>of()
                : legacy.getResults().stream()
                        .map(KatsubotResponseMapper::toDeleteResult)
                        .collect(Collectors.toList());
        return xs.aichat.katsubot.dto.DeleteConversationsResponse.of(legacy.getDeletedCount(), results);
    }

    private static DeleteConversationResult toDeleteResult(DeleteConversationResultItem item) {
        if (item == null) {
            return DeleteConversationResult.of("", false, "unknown");
        }
        boolean deleted = item.getStatus() >= 200 && item.getStatus() < 300;
        return DeleteConversationResult.of(
                item.getConversationId() != null ? item.getConversationId() : "",
                deleted,
                deleted ? null : "delete failed"
        );
    }

    public static MessagesPageResponse toMessagesPage(
            JsonDataWrapper<ApiResponse<MessageItem>> wrapped,
            String cursor,
            int size
    ) {
        List<MessageItem> items = wrapped != null
                && wrapped.getJsonData() != null
                && wrapped.getJsonData().getData() != null
                ? wrapped.getJsonData().getData()
                : Collections.emptyList();

        int pageSize = size <= 0 ? 20 : Math.min(size, 100);
        var messages = items.stream()
                .map(KatsubotResponseMapper::toMessageResponse)
                .collect(Collectors.toList());

        boolean hasMore = messages.size() >= pageSize;
        String nextCursor = null;
        if (hasMore && !messages.isEmpty()) {
            nextCursor = messages.get(messages.size() - 1).getId();
        }
        return MessagesPageResponse.of(messages, hasMore, nextCursor);
    }

    public static MessageResponse toMessageResponse(MessageItem item) {
        if (item == null) {
            return null;
        }
        MessageFeedbackSummary feedbackSummary = null;
        if (item.getFeedback() instanceof Map<?, ?> feedbackMap) {
            Object feedbackId = feedbackMap.get("feedback_id");
            Object feedbackType = feedbackMap.get("feedback_type");
            if (feedbackId != null && feedbackType != null) {
                feedbackSummary = MessageFeedbackSummary.of(
                        String.valueOf(feedbackId),
                        String.valueOf(feedbackType)
                );
            }
        }
        return MessageResponse.of(
                item.getMessageId(),
                normalizeRole(item.getRole()),
                item.getContent(),
                item.getCreatedAt(),
                feedbackSummary
        );
    }

    private static String normalizeRole(String role) {
        if (role == null) {
            return "assistant";
        }
        var normalized = role.trim().toLowerCase();
        if ("user".equals(normalized) || "assistant".equals(normalized)) {
            return normalized;
        }
        return "assistant";
    }

    public static FeedbackRequest toLegacyFeedbackRequest(UpsertFeedbackBody body) {
        var request = new FeedbackRequest();
        request.setFeedbackType(body.getFeedbackType());
        return request;
    }

    public static xs.aichat.katsubot.dto.FeedbackResponse toFeedbackResponse(
            xs.aichat.v2.dto.internal.response.FeedbackResponse legacy
    ) {
        if (legacy == null) {
            return null;
        }
        return xs.aichat.katsubot.dto.FeedbackResponse.of(
                legacy.getFeedbackId(),
                legacy.getMessageId(),
                legacy.getFeedbackType()
        );
    }

    public static BoardAuthPageResponse toBoardAuthPage(BoardAuthResponse legacy, int page, int size) {
        if (legacy == null || legacy.getContent() == null) {
            return BoardAuthPageResponse.of(List.of(), 0, page, size, false);
        }
        var items = legacy.getContent().stream()
                .map(item -> BoardAuthItemResponse.of(item.getBoardName()))
                .collect(Collectors.toList());
        return BoardAuthPageResponse.of(
                items,
                legacy.getTotalElements(),
                legacy.getPageNumber(),
                legacy.getPageSize(),
                legacy.isHasNext()
        );
    }

    public static int defaultListPageSize() {
        return DEFAULT_LIST_PAGE_SIZE;
    }
}
