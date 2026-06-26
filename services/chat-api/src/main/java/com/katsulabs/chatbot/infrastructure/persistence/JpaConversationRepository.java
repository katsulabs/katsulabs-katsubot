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

    @Override
    public DeleteResult deleteByUserIdAndIds(String userId, List<String> conversationIds) {
        var results = new java.util.ArrayList<DeleteItem>();
        int deletedCount = 0;

        for (String conversationId : conversationIds) {
            UUID id;
            try {
                id = UUID.fromString(conversationId);
            } catch (IllegalArgumentException ex) {
                results.add(new DeleteItem(conversationId, false, "유효하지 않은 대화 ID입니다"));
                continue;
            }

            var entity = repository.findById(id);
            if (entity.isEmpty()) {
                results.add(new DeleteItem(conversationId, false, "대화를 찾을 수 없습니다"));
                continue;
            }
            if (!entity.get().getUserId().equals(userId)) {
                results.add(new DeleteItem(conversationId, false, "삭제 권한이 없습니다"));
                continue;
            }
            repository.deleteById(id);
            deletedCount++;
            results.add(new DeleteItem(conversationId, true, null));
        }

        return new DeleteResult(deletedCount, results);
    }
}
