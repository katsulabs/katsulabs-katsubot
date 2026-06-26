package com.katsulabs.chatbot.domain.model;

/**
 * 외부 RAG SSE 이벤트 한 건 (delta 또는 완료).
 */
public record RagStreamChunk(
        String delta,
        boolean done
) {
    public static RagStreamChunk delta(String text) {
        return new RagStreamChunk(text, false);
    }

    public static RagStreamChunk finished() {
        return new RagStreamChunk(null, true);
    }
}
