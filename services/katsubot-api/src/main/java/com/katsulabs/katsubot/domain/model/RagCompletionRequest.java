package com.katsulabs.katsubot.domain.model;

/**
 * 외부 RAG 서비스 호출 요청 (katsubot-api 도메인).
 * HTTP 계약은 {@code docs/rag-external-client.md} 참고.
 */
public record RagCompletionRequest(
        String conversationId,
        String query,
        boolean stream
) {
}
