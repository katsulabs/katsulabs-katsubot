package com.katsulabs.katsubot.domain.model;

import lombok.Getter;
import lombok.experimental.Accessors;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Accessors(fluent = true)
public class Conversation {

    private final String id;
    private final String userId;
    private final String title;
    private final Instant createdAt;
    private final List<Message> messages;

    public Conversation(String id, String userId, String title, Instant createdAt, List<Message> messages) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.createdAt = createdAt;
        this.messages = new ArrayList<>(messages);
    }

    public static Conversation create(String userId, String title) {
        return new Conversation(
                UUID.randomUUID().toString(),
                userId,
                title == null || title.isBlank() ? "새 대화" : title.trim(),
                Instant.now(),
                List.of()
        );
    }

    public List<Message> messages() {
        return List.copyOf(messages);
    }

    public Conversation addMessage(Message message) {
        var next = new ArrayList<>(messages);
        next.add(message);
        return new Conversation(id, userId, title, createdAt, next);
    }

    public boolean ownedBy(String userId) {
        return this.userId.equals(userId);
    }
}
