package com.katsulabs.katsubot.domain.port;

import com.katsulabs.katsubot.domain.model.RagCompletionRequest;
import com.katsulabs.katsubot.domain.model.RagStreamChunk;

import java.util.function.Consumer;

/**
 * 외부 AI Gateway({@code katsulabs-ai-gateway}) 클라이언트 Port.
 * <p>
 * LLM/RAG 구현은 katsubot-api 밖 별도 서비스에 두고,
 * 본 Port는 WRTN 연동({@code HyobeeChatApiClient})과 동일하게 HTTP/SSE 호출만 담당한다.
 * 설정: {@code katsubot.rag.base-url} → {@code RAG_SERVICE_BASE_URL}
 */
public interface RagCompletionPort {

    /**
     * 스트리밍 완성 요청. {@code stream=false}이면 단일 응답을 한 번의 handler 호출로 전달할 수 있다.
     */
    void streamCompletion(RagCompletionRequest request, Consumer<RagStreamChunk> chunkHandler);
}
