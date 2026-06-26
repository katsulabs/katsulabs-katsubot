package com.katsulabs.chatbot.infrastructure.persistence;

import com.katsulabs.chatbot.domain.model.Conversation;
import com.katsulabs.chatbot.domain.model.Message;
import com.katsulabs.chatbot.domain.model.MessageRole;
import com.katsulabs.chatbot.infrastructure.persistence.entity.ConversationEntity;
import com.katsulabs.chatbot.infrastructure.persistence.entity.MessageEntity;
import com.katsulabs.chatbot.infrastructure.persistence.entity.MessageRoleEntity;

import java.util.List;
import java.util.UUID;

final class ConversationPersistenceMapper {

    private ConversationPersistenceMapper() {
    }

    static ConversationEntity toEntity(Conversation conversation) {
        var entity = new ConversationEntity(
                UUID.fromString(conversation.id()),
                conversation.userId(),
                conversation.title(),
                conversation.createdAt()
        );
        entity.replaceMessages(conversation.messages().stream()
                .map(ConversationPersistenceMapper::toEntity)
                .toList());
        return entity;
    }

    static MessageEntity toEntity(Message message) {
        return new MessageEntity(
                UUID.fromString(message.id()),
                toEntityRole(message.role()),
                message.content(),
                message.createdAt()
        );
    }

    static Conversation toDomain(ConversationEntity entity) {
        return new Conversation(
                entity.getId().toString(),
                entity.getUserId(),
                entity.getTitle(),
                entity.getCreatedAt(),
                entity.getMessages().stream()
                        .map(message -> toDomain(message, entity.getId().toString()))
                        .toList()
        );
    }

    static Message toDomain(MessageEntity entity, String conversationId) {
        return new Message(
                entity.getId().toString(),
                conversationId,
                toDomainRole(entity.getRole()),
                entity.getContent(),
                entity.getCreatedAt()
        );
    }

    private static MessageRoleEntity toEntityRole(MessageRole role) {
        return role == MessageRole.USER ? MessageRoleEntity.USER : MessageRoleEntity.ASSISTANT;
    }

    private static MessageRole toDomainRole(MessageRoleEntity role) {
        return role == MessageRoleEntity.USER ? MessageRole.USER : MessageRole.ASSISTANT;
    }
}
