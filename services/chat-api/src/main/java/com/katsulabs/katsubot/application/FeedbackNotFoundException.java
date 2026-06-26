package com.katsulabs.katsubot.application;

public class FeedbackNotFoundException extends RuntimeException {

    public FeedbackNotFoundException(String feedbackId) {
        super("피드백을 찾을 수 없습니다: " + feedbackId);
    }
}
