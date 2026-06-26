package com.katsulabs.chatbot.infrastructure.persistence;

import com.katsulabs.chatbot.domain.model.Conversation;
import com.katsulabs.chatbot.domain.port.ConversationRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryConversationRepository implements ConversationRepository {

    private final Map<String, Conversation> store = new ConcurrentHashMap<>();

    @Override
    public Conversation save(Conversation conversation) {
        store.put(conversation.id(), conversation);
        return conversation;
    }

    @Override
    public Optional<Conversation> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public List<Conversation> findByUserId(String userId) {
        return store.values().stream()
                .filter(c -> c.userId().equals(userId))
                .sorted((a, b) -> b.createdAt().compareTo(a.createdAt()))
                .toList();
    }
}
