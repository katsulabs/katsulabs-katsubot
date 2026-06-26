package com.katsulabs.chatbot.application;

import com.katsulabs.chatbot.domain.model.Conversation;
import com.katsulabs.chatbot.domain.port.ConversationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DeleteConversationsUseCaseTest {

    private DeleteConversationsUseCase useCase;
    private InMemoryConversationRepository repository;

    @BeforeEach
    void setUp() {
        repository = new InMemoryConversationRepository();
        useCase = new DeleteConversationsUseCase(repository);
    }

    @Test
    void deletesOwnedConversations() {
        var conversation = repository.save(Conversation.create("user-1", "테스트"));

        var result = useCase.delete("user-1", List.of(conversation.id()));

        assertThat(result.deletedCount()).isEqualTo(1);
        assertThat(repository.findById(conversation.id())).isEmpty();
    }

    @Test
    void skipsForeignConversation() {
        var conversation = repository.save(Conversation.create("user-1", "테스트"));

        var result = useCase.delete("user-2", List.of(conversation.id()));

        assertThat(result.deletedCount()).isZero();
        assertThat(result.results().getFirst().deleted()).isFalse();
    }

    private static final class InMemoryConversationRepository implements ConversationRepository {
        private final com.katsulabs.chatbot.infrastructure.persistence.InMemoryConversationRepository delegate =
                new com.katsulabs.chatbot.infrastructure.persistence.InMemoryConversationRepository();

        @Override
        public Conversation save(Conversation conversation) {
            return delegate.save(conversation);
        }

        @Override
        public java.util.Optional<Conversation> findById(String id) {
            return delegate.findById(id);
        }

        @Override
        public List<Conversation> findByUserId(String userId) {
            return delegate.findByUserId(userId);
        }

        @Override
        public DeleteResult deleteByUserIdAndIds(String userId, List<String> conversationIds) {
            return delegate.deleteByUserIdAndIds(userId, conversationIds);
        }
    }
}
