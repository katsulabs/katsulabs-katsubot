package com.katsulabs.katsubot.infrastructure.persistence;

import com.katsulabs.katsubot.domain.model.MessageFeedback;
import com.katsulabs.katsubot.domain.port.FeedbackRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Profile("jpa")
public class JpaFeedbackRepository implements FeedbackRepository {

    private final SpringFeedbackRepository repository;

    public JpaFeedbackRepository(SpringFeedbackRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<MessageFeedback> findActiveByMessageIdAndUserId(String messageId, String userId) {
        return repository.findByMessageIdAndUserIdAndDeletedFalse(UUID.fromString(messageId), userId)
                .map(FeedbackPersistenceMapper::toDomain);
    }

    @Override
    public List<MessageFeedback> findActiveByMessageIdsAndUserId(List<String> messageIds, String userId) {
        var ids = messageIds.stream().map(UUID::fromString).toList();
        return repository.findByMessageIdInAndUserIdAndDeletedFalse(ids, userId).stream()
                .map(FeedbackPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<MessageFeedback> findByIdAndUserId(String feedbackId, String userId) {
        return repository.findByIdAndUserId(UUID.fromString(feedbackId), userId)
                .map(FeedbackPersistenceMapper::toDomain);
    }

    @Override
    public MessageFeedback save(MessageFeedback feedback) {
        var saved = repository.save(FeedbackPersistenceMapper.toEntity(feedback));
        return FeedbackPersistenceMapper.toDomain(saved);
    }
}
