package com.katsulabs.chatbot.application;

import com.katsulabs.chatbot.domain.model.MessageFeedback;
import com.katsulabs.chatbot.domain.port.ConversationRepository;
import com.katsulabs.chatbot.domain.port.FeedbackRepository;
import org.springframework.stereotype.Service;

@Service
public class UpsertFeedbackUseCase {

    private final ConversationRepository conversationRepository;
    private final FeedbackRepository feedbackRepository;

    public UpsertFeedbackUseCase(
            ConversationRepository conversationRepository,
            FeedbackRepository feedbackRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public MessageFeedback upsert(
            String userId,
            String conversationId,
            String messageId,
            String feedbackType
    ) {
        var conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException(conversationId));

        if (!conversation.ownedBy(userId)) {
            throw new ForbiddenException("대화에 접근할 권한이 없습니다");
        }

        boolean messageExists = conversation.messages().stream()
                .anyMatch(message -> message.id().equals(messageId));
        if (!messageExists) {
            throw new MessageNotFoundException(messageId);
        }

        var feedback = feedbackRepository.findActiveByMessageIdAndUserId(messageId, userId)
                .map(existing -> existing.withFeedbackType(feedbackType))
                .orElseGet(() -> MessageFeedback.create(messageId, conversationId, userId, feedbackType));

        return feedbackRepository.save(feedback);
    }
}
