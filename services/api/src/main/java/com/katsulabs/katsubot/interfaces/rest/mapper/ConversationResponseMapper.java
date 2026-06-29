package com.katsulabs.katsubot.interfaces.rest.mapper;

import com.katsulabs.katsubot.domain.model.Conversation;
import com.katsulabs.katsubot.interfaces.rest.dto.ConversationResponse;

public final class ConversationResponseMapper {

    private ConversationResponseMapper() {
    }

    public static ConversationResponse toResponse(Conversation conversation) {
        return new ConversationResponse(conversation.id(), conversation.title(), conversation.createdAt());
    }
}
