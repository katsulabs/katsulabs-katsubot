package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.domain.model.RagCompletionRequest;
import com.katsulabs.katsubot.domain.model.RagStreamChunk;
import com.katsulabs.katsubot.domain.port.ConversationRepository;
import com.katsulabs.katsubot.domain.port.RagCompletionPort;
import com.katsulabs.katsubot.infrastructure.persistence.InMemoryConversationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SendMessageUseCaseTest {

    private ConversationRepository repository;
    private SendMessageUseCase useCase;
    private List<RagCompletionRequest> ragRequests;

    @BeforeEach
    void setUp() {
        repository = new InMemoryConversationRepository();
        ragRequests = new ArrayList<>();
        RagCompletionPort ragPort = (request, handler) -> {
            ragRequests.add(request);
            handler.accept(RagStreamChunk.delta("답변"));
            handler.accept(RagStreamChunk.finished());
        };
        useCase = new SendMessageUseCase(repository, ragPort, null);
    }

    @Test
    void streamsRagReplyAndPersistsMessages() {
        var conversation = repository.save(
                com.katsulabs.katsubot.domain.model.Conversation.create("user-1", "테스트")
        );

        var chunks = new ArrayList<RagStreamChunk>();
        var result = useCase.streamReply("user-1", conversation.id(), "질문", chunks::add);

        assertThat(result.fullText()).isEqualTo("답변");
        assertThat(ragRequests).hasSize(1);
        assertThat(ragRequests.getFirst().query()).isEqualTo("질문");
        assertThat(chunks).isNotEmpty();

        var saved = repository.findById(conversation.id()).orElseThrow();
        assertThat(saved.messages()).hasSize(2);
    }

    @Test
    void rejectsForeignConversation() {
        var conversation = repository.save(
                com.katsulabs.katsubot.domain.model.Conversation.create("owner", "테스트")
        );

        assertThatThrownBy(() -> useCase.streamReply("other", conversation.id(), "질문", c -> {}))
                .isInstanceOf(ConversationNotFoundException.class);
    }
}
