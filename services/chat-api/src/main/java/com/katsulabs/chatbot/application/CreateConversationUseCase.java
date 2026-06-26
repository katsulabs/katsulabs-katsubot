package com.katsulabs.chatbot.application;

import com.katsulabs.chatbot.domain.model.Conversation;
import com.katsulabs.chatbot.domain.port.ConversationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreateConversationUseCase {

    private final ConversationRepository conversationRepository;

    public CreateConversationUseCase(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Conversation create(String userId, String title) {
        return conversationRepository.save(Conversation.create(userId, title));
    }

    public List<Conversation> listForUser(String userId) {
        return conversationRepository.findByUserId(userId);
    }
}
