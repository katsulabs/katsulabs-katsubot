package com.katsulabs.chatbot.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "message_feedback")
public class MessageFeedbackEntity {

    @Id
    private UUID id;

    @Column(name = "message_id", nullable = false)
    private UUID messageId;

    @Column(name = "conversation_id", nullable = false)
    private UUID conversationId;

    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;

    @Column(name = "feedback_type", nullable = false, length = 20)
    private String feedbackType;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private boolean deleted;

    protected MessageFeedbackEntity() {
    }

    public MessageFeedbackEntity(
            UUID id,
            UUID messageId,
            UUID conversationId,
            String userId,
            String feedbackType,
            Instant createdAt,
            boolean deleted
    ) {
        this.id = id;
        this.messageId = messageId;
        this.conversationId = conversationId;
        this.userId = userId;
        this.feedbackType = feedbackType;
        this.createdAt = createdAt;
        this.deleted = deleted;
    }

    public UUID getId() {
        return id;
    }

    public UUID getMessageId() {
        return messageId;
    }

    public UUID getConversationId() {
        return conversationId;
    }

    public String getUserId() {
        return userId;
    }

    public String getFeedbackType() {
        return feedbackType;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public void setFeedbackType(String feedbackType) {
        this.feedbackType = feedbackType;
    }
}
