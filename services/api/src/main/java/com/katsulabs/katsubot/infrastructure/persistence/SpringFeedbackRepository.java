package com.katsulabs.katsubot.infrastructure.persistence;

import com.katsulabs.katsubot.infrastructure.persistence.entity.MessageFeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpringFeedbackRepository extends JpaRepository<MessageFeedbackEntity, UUID> {

    Optional<MessageFeedbackEntity> findByMessageIdAndUserIdAndDeletedFalse(UUID messageId, String userId);

    List<MessageFeedbackEntity> findByMessageIdInAndUserIdAndDeletedFalse(List<UUID> messageIds, String userId);

    Optional<MessageFeedbackEntity> findByIdAndUserId(UUID id, String userId);
}
