package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.domain.model.Conversation;
import com.katsulabs.katsubot.domain.model.Message;
import com.katsulabs.katsubot.domain.model.MessageFeedback;
import com.katsulabs.katsubot.domain.port.ConversationRepository;
import com.katsulabs.katsubot.domain.port.FeedbackRepository;
import com.katsulabs.katsubot.infrastructure.persistence.InMemoryConversationRepository;
import com.katsulabs.katsubot.infrastructure.persistence.InMemoryFeedbackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UpsertFeedbackUseCaseTest {

    private UpsertFeedbackUseCase useCase;
    private ConversationRepository conversationRepository;
    private FeedbackRepository feedbackRepository;

    @BeforeEach
    void setUp() {
        conversationRepository = new InMemoryConversationRepository();
        feedbackRepository = new InMemoryFeedbackRepository();
        useCase = new UpsertFeedbackUseCase(conversationRepository, feedbackRepository);
    }

    @Test
    void upsertsFeedbackForAssistantMessage() {
        var conversation = Conversation.create("user-1", "테스트");
        var assistant = Message.assistantMessage(conversation.id(), "답변");
        conversation = conversation.addMessage(assistant);
        conversationRepository.save(conversation);

        var saved = useCase.upsert("user-1", conversation.id(), assistant.id(), "like");

        assertThat(saved.feedbackType()).isEqualTo("like");
        assertThat(feedbackRepository.findActiveByMessageIdAndUserId(assistant.id(), "user-1"))
                .map(MessageFeedback::feedbackType)
                .contains("like");
    }

    @Test
    void rejectsForeignConversation() {
        var conversation = conversationRepository.save(Conversation.create("user-1", "테스트"));

        assertThatThrownBy(() -> useCase.upsert("user-2", conversation.id(), "missing", "like"))
                .isInstanceOf(ForbiddenException.class);
    }
}
