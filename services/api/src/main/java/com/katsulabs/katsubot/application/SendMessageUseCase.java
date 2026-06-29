package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.domain.model.Message;
import com.katsulabs.katsubot.domain.model.RagCompletionRequest;
import com.katsulabs.katsubot.domain.model.RagStreamChunk;
import com.katsulabs.katsubot.domain.port.ConversationRepository;
import com.katsulabs.katsubot.domain.port.RagCompletionPort;
import com.katsulabs.katsubot.infrastructure.gateway.GatewayWrtnClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Service
public class SendMessageUseCase {

    private final ConversationRepository conversationRepository;
    private final RagCompletionPort ragCompletionPort;
    private final GatewayWrtnClient gatewayWrtnClient;

    public SendMessageUseCase(
            ConversationRepository conversationRepository,
            RagCompletionPort ragCompletionPort,
            @Autowired(required = false) GatewayWrtnClient gatewayWrtnClient) {
        this.conversationRepository = conversationRepository;
        this.ragCompletionPort = ragCompletionPort;
        this.gatewayWrtnClient = gatewayWrtnClient;
    }

    public record StreamResult(String assistantMessageId, String fullText, String conversationTitle) {}

    public StreamResult streamReply(String userId, String conversationId, String content, Consumer<RagStreamChunk> chunkConsumer) {
        if (gatewayWrtnClient != null) {
            return gatewayWrtnClient.streamReply(userId, conversationId, content, chunkConsumer);
        }

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

        return new StreamResult(assistantMessage.id(), buffer.toString(), null);
    }
}
