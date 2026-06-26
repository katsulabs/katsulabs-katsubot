package com.katsulabs.chatbot.application;

import com.katsulabs.chatbot.domain.port.ConversationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeleteConversationsUseCase {

    private final ConversationRepository conversationRepository;

    public DeleteConversationsUseCase(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public ConversationRepository.DeleteResult delete(String userId, List<String> conversationIds) {
        return conversationRepository.deleteByUserIdAndIds(userId, conversationIds);
    }
}
