package xs.aichat.v2.external;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import xs.aichat.util.JsonAdapter;
import xs.aichat.v2.dto.external.wrtn.request.*;
import xs.aichat.v2.dto.external.wrtn.rnd.JournalsApiRequest;
import xs.aichat.v2.dto.external.wrtn.rnd.MessageSourcesApiRequest;
import xs.aichat.v2.dto.internal.request.*;
import xs.aichat.v2.dto.internal.rnd.JournalsRequest;
import xs.aichat.v2.dto.internal.rnd.MessageSourcesRequest;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class WrtnRequestMapper {

    public static ConversationsApiRequest toApiRequest(ConversationRequest request) {
        return ConversationsApiRequest.of(
                request.getUserId(),
                request.getPage(),
                request.getSize()
        );
    }

    public static MessagesApiRequest toApiRequest(MessageRequest request) {
        return MessagesApiRequest.of(
                request.getUserId(),
                request.getConversationId(),
                request.getCursor(),
                request.getSize()
        );
    }

    public static CreateConversationApiRequest toApiRequest(CreateConversationRequest request) {
        return CreateConversationApiRequest.of(
                request.getUserId(),
                request.getUserQuery(),
                request.getChatCategory()
        );
    }

    public static DeleteConversationsApiRequest toApiRequest(DeleteConversationRequest request) {
        return DeleteConversationsApiRequest.of(
                request.getUserId(),
                request.getConversationIds()
        );
    }

    public static FeedbackApiRequest toApiRequest(FeedbackRequest request) {
        return FeedbackApiRequest.of(
                request.getFeedbackType()
        );
    }

    public static MessageSourcesApiRequest toApiRequest(MessageSourcesRequest request) {
        return MessageSourcesApiRequest.of(
                request.getUserId(),
                request.getDocType(),
                request.getSortBy(),
                request.getSortOrder(),
                request.getPage(),
                request.getSize()
        );
    }

    public static JournalsApiRequest toApiRequest(JournalsRequest request) {
        var rawDocTypes = request.getDocTypes();
        var decodedDocTypes = "";

        if (rawDocTypes != null) {
            decodedDocTypes = URLDecoder.decode(rawDocTypes, StandardCharsets.UTF_8);
            decodedDocTypes = decodedDocTypes.replace("%2C", ",");
        }
        return JournalsApiRequest.of(
                request.getStartDate(),
                request.getEndDate(),
                decodedDocTypes,
                request.getKeyword(),
                request.getCreator(),
                request.getSourceUrl(),
                request.getJournalId(),
                "latest", // 설정 부분 없어 하드코딩
                request.getPage(),
                normalizeSize(request.getSize())
        );
    }

    public static Map<String, Object> toNonEmptyQueryParams(JsonAdapter jsonAdapter, Object requestDto) {
        Map<String, Object> rawParams = jsonAdapter.toMap(requestDto);
        var queryParams = new LinkedHashMap<String, Object>();
        rawParams.forEach((key, value) -> {
            if (value == null) {
                return;
            }
            if (value instanceof String && ((String) value).isBlank()) {
                return;
            }
            queryParams.put(key, value);
        });
        return queryParams;
    }

    private static int normalizeSize(int size) {
        return size <= 0 ? 20 : size;
    }
}
