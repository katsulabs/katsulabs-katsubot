package com.katsulabs.chatbot.application;

public class MessageNotFoundException extends RuntimeException {

    public MessageNotFoundException(String messageId) {
        super("메시지를 찾을 수 없습니다: " + messageId);
    }
}
