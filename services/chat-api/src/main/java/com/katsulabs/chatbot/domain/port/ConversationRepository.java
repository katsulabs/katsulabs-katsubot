package com.katsulabs.chatbot.domain.port;

import com.katsulabs.chatbot.domain.model.Conversation;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository {

    Conversation save(Conversation conversation);

    Optional<Conversation> findById(String id);

    List<Conversation> findByUserId(String userId);
}
