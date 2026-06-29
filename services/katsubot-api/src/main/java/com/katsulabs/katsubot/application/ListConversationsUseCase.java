package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.domain.model.Conversation;
import com.katsulabs.katsubot.domain.port.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListConversationsUseCase {

    private final ConversationRepository conversationRepository;

    public List<Conversation> listForUser(String userId) {
        return conversationRepository.findByUserId(userId);
    }
}
