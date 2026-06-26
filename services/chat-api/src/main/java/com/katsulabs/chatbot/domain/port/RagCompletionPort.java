package com.katsulabs.chatbot.domain.port;

import com.katsulabs.chatbot.domain.model.RagCompletionRequest;
import com.katsulabs.chatbot.domain.model.RagStreamChunk;

import java.util.function.Consumer;

/**
 * 외부 RAG 서비스 클라이언트 Port.
 * <p>
 * RAG 구현·벡터 DB·에이전트 오케스트레이션은 chat-api 밖 별도 서비스에 두고,
 * 본 Port는 WRTN 연동({@code HyobeeChatApiClient})과 동일하게 HTTP/SSE 호출만 담당한다.
 */
public interface RagCompletionPort {

    /**
     * 스트리밍 완성 요청. {@code stream=false}이면 단일 응답을 한 번의 handler 호출로 전달할 수 있다.
     */
    void streamCompletion(RagCompletionRequest request, Consumer<RagStreamChunk> chunkHandler);
}
