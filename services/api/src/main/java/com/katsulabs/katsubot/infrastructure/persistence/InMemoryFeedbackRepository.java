package com.katsulabs.katsubot.infrastructure.persistence;

import com.katsulabs.katsubot.domain.model.MessageFeedback;
import com.katsulabs.katsubot.domain.port.FeedbackRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
@Profile("in-memory")
public class InMemoryFeedbackRepository implements FeedbackRepository {

    private final Map<String, MessageFeedback> store = new ConcurrentHashMap<>();

    @Override
    public Optional<MessageFeedback> findActiveByMessageIdAndUserId(String messageId, String userId) {
        return store.values().stream()
                .filter(feedback -> feedback.messageId().equals(messageId))
                .filter(feedback -> feedback.userId().equals(userId))
                .filter(feedback -> !feedback.deleted())
                .findFirst();
    }

    @Override
    public List<MessageFeedback> findActiveByMessageIdsAndUserId(List<String> messageIds, String userId) {
        return store.values().stream()
                .filter(feedback -> messageIds.contains(feedback.messageId()))
                .filter(feedback -> feedback.userId().equals(userId))
                .filter(feedback -> !feedback.deleted())
                .toList();
    }

    @Override
    public Optional<MessageFeedback> findByIdAndUserId(String feedbackId, String userId) {
        var feedback = store.get(feedbackId);
        if (feedback == null || !feedback.userId().equals(userId)) {
            return Optional.empty();
        }
        return Optional.of(feedback);
    }

    @Override
    public MessageFeedback save(MessageFeedback feedback) {
        store.put(feedback.id(), feedback);
        return feedback;
    }
}
