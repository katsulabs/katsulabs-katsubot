package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.domain.model.Conversation;
import com.katsulabs.katsubot.domain.port.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateConversationUseCase {

    private final ConversationRepository conversationRepository;

    public Conversation create(String userId, String title) {
        return conversationRepository.save(Conversation.create(userId, title));
    }
}
