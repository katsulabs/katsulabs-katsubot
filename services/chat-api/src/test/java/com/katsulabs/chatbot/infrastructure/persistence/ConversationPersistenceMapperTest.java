package com.katsulabs.chatbot.infrastructure.persistence;

import com.katsulabs.chatbot.domain.model.Conversation;
import com.katsulabs.chatbot.domain.model.Message;
import com.katsulabs.chatbot.domain.model.MessageRole;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class ConversationPersistenceMapperTest {

    @Test
    void roundTripsConversationAndMessages() {
        String conversationId = UUID.randomUUID().toString();
        var conversation = new Conversation(
                conversationId,
                "user-1",
                "제목",
                Instant.parse("2026-06-26T00:00:00Z"),
                List.of(
                        new Message(UUID.randomUUID().toString(), conversationId, MessageRole.USER, "질문", Instant.parse("2026-06-26T00:01:00Z")),
                        new Message(UUID.randomUUID().toString(), conversationId, MessageRole.ASSISTANT, "답변", Instant.parse("2026-06-26T00:01:01Z"))
                )
        );

        var entity = ConversationPersistenceMapper.toEntity(conversation);
        var restored = ConversationPersistenceMapper.toDomain(entity);

        assertThat(restored.id()).isEqualTo(conversation.id());
        assertThat(restored.userId()).isEqualTo("user-1");
        assertThat(restored.messages()).hasSize(2);
        assertThat(restored.messages().getFirst().content()).isEqualTo("질문");
    }
}
