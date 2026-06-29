package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.domain.port.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeleteConversationsUseCase {

    private final ConversationRepository conversationRepository;

    public ConversationRepository.DeleteResult delete(String userId, List<String> conversationIds) {
        return conversationRepository.deleteByUserIdAndIds(userId, conversationIds);
    }
}
