package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.domain.model.Message;
import com.katsulabs.katsubot.domain.model.MessageFeedback;
import com.katsulabs.katsubot.domain.port.ConversationRepository;
import com.katsulabs.katsubot.domain.port.FeedbackRepository;
import com.katsulabs.katsubot.infrastructure.gateway.GatewayWrtnClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ListMessagesUseCase {

    private final ConversationRepository conversationRepository;
    private final FeedbackRepository feedbackRepository;
    private final GatewayWrtnClient gatewayWrtnClient;

    public ListMessagesUseCase(
            ConversationRepository conversationRepository,
            FeedbackRepository feedbackRepository,
            @Autowired(required = false) GatewayWrtnClient gatewayWrtnClient) {
        this.conversationRepository = conversationRepository;
        this.feedbackRepository = feedbackRepository;
        this.gatewayWrtnClient = gatewayWrtnClient;
    }

    public record MessageView(
            String id,
            String role,
            String content,
            String createdAt,
            MessageFeedbackView feedback
    ) {}

    public record MessageFeedbackView(String feedbackId, String feedbackType) {}

    public record MessagesPage(List<MessageView> messages, boolean hasMore, Integer nextCursor) {}

    public MessagesPage list(String userId, String conversationId, int cursor, int size) {
        if (gatewayWrtnClient != null) {
            return gatewayWrtnClient.listMessagesPage(userId, conversationId, cursor, size);
        }

        var conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException(conversationId));

        if (!conversation.ownedBy(userId)) {
            throw new ForbiddenException("대화에 접근할 권한이 없습니다");
        }

        var sorted = conversation.messages().stream()
                .sorted(Comparator.comparing(Message::createdAt))
                .toList();

        int from = Math.max(cursor, 0);
        int pageSize = size <= 0 ? 20 : Math.min(size, 100);
        int to = Math.min(from + pageSize, sorted.size());
        var slice = from >= sorted.size() ? List.<Message>of() : sorted.subList(from, to);

        var messageIds = slice.stream().map(Message::id).toList();
        Map<String, MessageFeedback> feedbackByMessageId = feedbackRepository
                .findActiveByMessageIdsAndUserId(messageIds, userId)
                .stream()
                .collect(Collectors.toMap(MessageFeedback::messageId, Function.identity(), (a, b) -> a));

        var views = slice.stream()
                .map(message -> toView(message, feedbackByMessageId.get(message.id())))
                .toList();

        boolean hasMore = to < sorted.size();
        Integer nextCursor = hasMore ? to : null;
        return new MessagesPage(views, hasMore, nextCursor);
    }

    private static MessageView toView(Message message, MessageFeedback feedback) {
        MessageFeedbackView feedbackView = null;
        if (feedback != null && !feedback.deleted()) {
            feedbackView = new MessageFeedbackView(feedback.id(), feedback.feedbackType());
        }
        return new MessageView(
                message.id(),
                message.role().name().toLowerCase(),
                message.content(),
                message.createdAt().toString(),
                feedbackView
        );
    }
}
