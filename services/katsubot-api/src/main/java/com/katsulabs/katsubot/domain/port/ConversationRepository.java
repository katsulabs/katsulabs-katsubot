package com.katsulabs.katsubot.domain.port;

import com.katsulabs.katsubot.domain.model.Conversation;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository {

    Conversation save(Conversation conversation);

    Optional<Conversation> findById(String id);

    List<Conversation> findByUserId(String userId);

    DeleteResult deleteByUserIdAndIds(String userId, List<String> conversationIds);

    record DeleteResult(int deletedCount, List<DeleteItem> results) {}

    record DeleteItem(String conversationId, boolean deleted, String error) {}
}
