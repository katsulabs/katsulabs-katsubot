package com.katsulabs.katsubot.infrastructure.persistence;

import com.katsulabs.katsubot.domain.model.Conversation;
import com.katsulabs.katsubot.domain.port.ConversationRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
@Profile("in-memory")
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

    @Override
    public DeleteResult deleteByUserIdAndIds(String userId, List<String> conversationIds) {
        var results = new ArrayList<DeleteItem>();
        int deletedCount = 0;

        for (String conversationId : conversationIds) {
            var conversation = store.get(conversationId);
            if (conversation == null) {
                results.add(new DeleteItem(conversationId, false, "대화를 찾을 수 없습니다"));
                continue;
            }
            if (!conversation.ownedBy(userId)) {
                results.add(new DeleteItem(conversationId, false, "삭제 권한이 없습니다"));
                continue;
            }
            store.remove(conversationId);
            deletedCount++;
            results.add(new DeleteItem(conversationId, true, null));
        }

        return new DeleteResult(deletedCount, results);
    }
}
