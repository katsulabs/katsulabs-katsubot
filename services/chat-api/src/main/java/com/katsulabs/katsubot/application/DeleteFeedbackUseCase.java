package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.domain.model.MessageFeedback;
import com.katsulabs.katsubot.domain.port.ConversationRepository;
import com.katsulabs.katsubot.domain.port.FeedbackRepository;
import org.springframework.stereotype.Service;

@Service
public class DeleteFeedbackUseCase {

    private final ConversationRepository conversationRepository;
    private final FeedbackRepository feedbackRepository;

    public DeleteFeedbackUseCase(
            ConversationRepository conversationRepository,
            FeedbackRepository feedbackRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public MessageFeedback delete(
            String userId,
            String conversationId,
            String messageId,
            String feedbackId
    ) {
        var conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException(conversationId));

        if (!conversation.ownedBy(userId)) {
            throw new ForbiddenException("대화에 접근할 권한이 없습니다");
        }

        var feedback = feedbackRepository.findByIdAndUserId(feedbackId, userId)
                .filter(item -> !item.deleted())
                .filter(item -> item.messageId().equals(messageId))
                .filter(item -> item.conversationId().equals(conversationId))
                .orElseThrow(() -> new FeedbackNotFoundException(feedbackId));

        return feedbackRepository.save(feedback.markDeleted());
    }
}
