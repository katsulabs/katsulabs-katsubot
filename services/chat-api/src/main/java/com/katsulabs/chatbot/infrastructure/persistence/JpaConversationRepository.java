package com.katsulabs.chatbot.infrastructure.persistence;

import com.katsulabs.chatbot.domain.model.Conversation;
import com.katsulabs.chatbot.domain.port.ConversationRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Profile("jpa")
public class JpaConversationRepository implements ConversationRepository {

    private final SpringConversationRepository repository;

    public JpaConversationRepository(SpringConversationRepository repository) {
        this.repository = repository;
    }

    @Override
    public Conversation save(Conversation conversation) {
        var saved = repository.save(ConversationPersistenceMapper.toEntity(conversation));
        return ConversationPersistenceMapper.toDomain(saved);
    }

    @Override
    public Optional<Conversation> findById(String id) {
        return repository.findById(UUID.fromString(id)).map(ConversationPersistenceMapper::toDomain);
    }

    @Override
    public List<Conversation> findByUserId(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ConversationPersistenceMapper::toDomain)
                .toList();
    }
}
