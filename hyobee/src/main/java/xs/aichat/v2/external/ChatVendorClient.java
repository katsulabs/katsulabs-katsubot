package xs.aichat.v2.external;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.ResponseEntity;
import reactor.core.Disposable;
import xs.aichat.v2.service.ChatServiceImpl;
import xs.aichat.v2.dto.external.wrtn.request.*;
import xs.aichat.v2.dto.external.wrtn.response.StopMessageApiResponse;
import xs.aichat.v2.dto.internal.request.*;
import xs.aichat.v2.dto.internal.request.MessageRequest;
import xs.aichat.v2.dto.internal.response.*;
import xs.aichat.v2.dto.internal.rnd.*;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

/**
 * AI 챗봇 벤더 연동을 위한 인터페이스.
 * <p>
 * - 벤더별 URL, 파라미터, 응답 포맷 차이는 구현체에서 처리<br>
 * - 서비스 레이어({@link ChatServiceImpl})는 이 인터페이스만 바라보도록 하여 벤더 교체 시 서비스 코드 변경을 최소화한다.
 * </p>
 */
public interface ChatVendorClient {

    // 벤더 헬스 체크 호출.
    ResponseEntity<Map<String, Object>> healthCheck();

    // 대화(Conversation) 목록 조회.
    ConversationsResponse selectConversations(ConversationRequest request);

    // 특정 대화방(Conversation)에 대한 메시지 목록 조회 (DTO 기반).
    List<MessageItem> selectMessages(MessageRequest request);

    // 새 대화(Conversation) 생성 (DTO 기반).
    CreateConversationResponse createConversation(CreateConversationRequest request);

    // 대화(Conversation) 목록 삭제.
    DeleteConversationsResponse deleteConversations(DeleteConversationRequest request);

    // 접근 가능한 게시판 목록 조회
    BoardAuthResponse selectDataBoardsAuth(BoardAuthRequest request);

    /**
     * SSE 기반 실시간 채팅 스트림 시작.
     * <p>
     * - 벤더마다 SSE 구현 방식/엔드포인트가 다를 수 있으므로, 공통 콜백 인터페이스만 노출한다.<br>
     * - {@code onChunk} 에는 벤더에서 내려주는 원본 JSON 문자열(한 줄 단위)이 그대로 전달된다.
     * </p>
     *
     * @param conversationId 대화 ID
     * @param body           요청 바디(JSON 맵)
     * @param onChunk        스트림으로 수신되는 문자열 청크 콜백 (벤더 raw 응답)
     * @param onError        에러 콜백
     * @param onComplete     완료 콜백
     */
    Disposable startChatStream(
            String conversationId,
            SendMessageApiRequest body,
            Consumer<String> onChunk,
            Consumer<Throwable> onError,
            Runnable onComplete
    ) throws JsonProcessingException;

    // 응답 중단(Interrupt) 호출.
    StopMessageApiResponse interrupt(StopMessageApiRequest request) throws JsonProcessingException;

    // feedback (DTO 기반)
    FeedbackResponse feedback(String conversationId, String messageId, String userId, FeedbackRequest request);

    // 피드백 취소 (DTO 기반)
    FeedbackResponse deleteFeedback(String conversationId, String messageId, String userId, String feedbackId);

    // 메시지 출처 목록 조회
    MessageSourcesResponse selectMessageSources(
            String conversationId,
            String messageId,
            MessageSourcesRequest request
    );

    // 수집 저널 목록 조회
    JournalsResponse selectJournals(JournalsRequest request);

    // 수집 저널 목록 상세조회
    JournalDetailResponse selectJournalDetail(String request);

    // 수집 저널 목록 상세조회 - 연관저널
    JournalRelatedItemsResponse selectJournalRelatedItems(String request);

    // Wrtn AI 요약 원본 응답 (intro/body/conclusion)
    JournalAiSummaryApiResponse selectJournalAiSummary(String journalId);
}


