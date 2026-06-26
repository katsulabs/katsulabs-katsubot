package com.katsulabs.chatbot.application;

public class ConversationNotFoundException extends RuntimeException {

    private final String conversationId;

    public ConversationNotFoundException(String conversationId) {
        super("대화를 찾을 수 없습니다: " + conversationId);
        this.conversationId = conversationId;
    }

    public String conversationId() {
        return conversationId;
    }
}
