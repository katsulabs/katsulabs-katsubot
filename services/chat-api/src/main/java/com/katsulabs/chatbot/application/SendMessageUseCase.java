package com.katsulabs.chatbot.application;

import com.katsulabs.chatbot.domain.model.Message;
import com.katsulabs.chatbot.domain.model.RagCompletionRequest;
import com.katsulabs.chatbot.domain.model.RagStreamChunk;
import com.katsulabs.chatbot.domain.port.ConversationRepository;
import com.katsulabs.chatbot.domain.port.RagCompletionPort;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Service
public class SendMessageUseCase {

    private final ConversationRepository conversationRepository;
    private final RagCompletionPort ragCompletionPort;

    public SendMessageUseCase(ConversationRepository conversationRepository, RagCompletionPort ragCompletionPort) {
        this.conversationRepository = conversationRepository;
        this.ragCompletionPort = ragCompletionPort;
    }

    public record StreamResult(String assistantMessageId, String fullText) {}

    public StreamResult streamReply(String userId, String conversationId, String content, Consumer<RagStreamChunk> chunkConsumer) {
        var conversation = conversationRepository.findById(conversationId)
                .filter(c -> c.ownedBy(userId))
                .orElseThrow(() -> new ConversationNotFoundException(conversationId));

        var userMessage = Message.userMessage(conversationId, content);
        conversation = conversationRepository.save(conversation.addMessage(userMessage));

        var buffer = new StringBuilder();
        ragCompletionPort.streamCompletion(
                new RagCompletionRequest(conversationId, content, true),
                chunk -> {
                    if (chunk.delta() != null) {
                        buffer.append(chunk.delta());
                    }
                    chunkConsumer.accept(chunk);
                }
        );

        var assistantMessage = Message.assistantMessage(conversationId, buffer.toString());
        conversationRepository.save(conversation.addMessage(assistantMessage));

        return new StreamResult(assistantMessage.id(), buffer.toString());
    }
}
