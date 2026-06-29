package com.katsulabs.katsubot.infrastructure.persistence;

import com.katsulabs.katsubot.infrastructure.persistence.entity.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringConversationRepository extends JpaRepository<ConversationEntity, UUID> {

    List<ConversationEntity> findByUserIdOrderByCreatedAtDesc(String userId);
}
