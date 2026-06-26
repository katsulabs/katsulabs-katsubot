package xs.aichat.v2.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.Disposable;
import xs.aichat.v2.dto.*;
import xs.aichat.v2.dto.internal.request.*;
import xs.aichat.v2.dto.internal.request.MessageRequest;
import xs.aichat.v2.dto.internal.response.*;
import xs.aichat.v2.dto.wrapper.ApiResponse;
import xs.aichat.v2.dto.wrapper.JsonDataWrapper;
import org.springframework.http.HttpStatus;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.exception.HyobeeException;
import xs.aichat.v2.external.ChatVendorClient;
import xs.aichat.v2.util.JwtSessionHelper;

import javax.servlet.http.HttpSession;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * AI비서 서비스 구현체.
 * <p>
 * - 외부 챗봇 벤더(Wrtn 등)별 HTTP 상세 호출은 {@link xs.aichat.v2.external.ChatVendorClient}에 위임
 * </p>
 */
@Slf4j
@Service
public class ChatServiceImpl implements ChatService {

    private final ChatVendorClient chatVendorClient; // 챗봇 벤더 연동 추상화 (현재 구현: WrtnChatVendorClient)

    private final ChatUserService chatUserService;

    public ChatServiceImpl(
            @Qualifier("wtrnChatVendorClientV2") ChatVendorClient chatVendorClient,
            ChatUserService chatUserService
    ) {
        this.chatVendorClient = chatVendorClient;
        this.chatUserService = chatUserService;
    }

	// 외부 챗봇 벤더의 서비스 상태를 확인
	public ResponseEntity<Map<String, Object>> healthCheck() {
        return chatVendorClient.healthCheck();
	}

	// 모든 대화 목록을 페이징하여 조회
	@Override
	public ConversationsResponse selectConversations(
            ConversationRequest request,
            String loginDeptCode,
            String loginDeptName,
            String languageCode
    ) {
        var response = chatVendorClient.selectConversations(request);
        if (response.getContent() != null && !response.getContent().isEmpty()) {
            chatUserService.enrichConversationTargets(
                    request.getUserId(),
                    loginDeptCode,
                    loginDeptName,
                    languageCode,
                    response.getContent()
            );
        }
        return response;
	}

	// conversation_id를 기준으로 해당 대화방의 모든 메시지 목록을 조회
    @Override
    public JsonDataWrapper<ApiResponse<MessageItem>> selectMessages(MessageRequest request) {
        var messages = chatVendorClient.selectMessages(request);
        var apiResponse = new ApiResponse<MessageItem>();
        apiResponse.setHeader(null); // 헤더는 ApiResponseAdvice에서 채움
        apiResponse.setData(messages != null ? messages : Collections.emptyList());
        return new JsonDataWrapper<>(apiResponse);
    }

	// 새로운 대화방을 생성하고 conversation_id가 생성되어 반환됨
	@Override
	public CreateConversationResponse createConversation(
            CreateConversationRequest request,
            User user,
            HttpSession session
    ) {
        var response = chatVendorClient.createConversation(request);
        if (response.getConversationId() != null) {
            var teamCode = JwtSessionHelper.resolveStreamTeamCode(session);
            chatUserService.appendConversation(
                    user.getUserId(),
                    user.getCorpCode(),
                    teamCode,
                    response.getConversationId()
            );
        }
        return response;
    }

    // conversation_ids 배열로 삭제할 대화방 일괄 삭제
    @Override
    public DeleteConversationsResponse deleteConversations(DeleteConversationRequest request, User user) {
        assertDeleteRequestUser(request, user);
        var response = chatVendorClient.deleteConversations(request);
        chatUserService.removeConversations(
                user.getUserId(),
                parseConversationIds(request.getConversationIds())
        );
        return response;
    }

    private void assertDeleteRequestUser(DeleteConversationRequest request, User user) {
        if (request.getUserId() == null || !request.getUserId().equals(user.getUserId())) {
            throw new HyobeeException(
                    HttpStatus.FORBIDDEN.toString(),
                    "요청 사용자와 세션 사용자가 일치하지 않습니다."
            );
        }
    }

    private List<Integer> parseConversationIds(List<String> conversationIds) {
        if (conversationIds == null) {
            return List.of();
        }
        return conversationIds.stream()
                .map(String::trim)
                .filter(id -> !id.isEmpty())
                .map(id -> {
                    try {
                        return Integer.parseInt(id);
                    } catch (NumberFormatException ex) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

	// 접근 가능한 게시판 목록 조회
    @Override
    public BoardAuthResponse selectDataBoardsAuth(BoardAuthRequest request) {
        // SQL Injection 취약점 보완: 입력값 검증
//        String invalidField = validateAichatParams(request);
//        if (invalidField != null) {
//            XtrmJSON errorResponse = new XtrmJSON();
//            errorResponse.setResultHeader(true, "유효하지 않은 " + invalidField + " 값입니다.", "INVALID_INPUT");
//            return errorResponse;
//        }
        return chatVendorClient.selectDataBoardsAuth(request);
    }

	//****** 뤼튼 연동 AI 챗봇 SSE 전송 ************************************************************//

	// feedback
	/**
	 * feedback DTO 기반 서비스 메서드
	 * - 컨트롤러에서 DTO로 요청을 받고
	 * - 벤더 클라이언트로 DTO 그대로 위임
	 */
	@Override
	public FeedbackResponse feedback(String conversationId, String messageId, String userId, FeedbackRequest request) {
		return chatVendorClient.feedback(conversationId, messageId, userId, request);
	}

	@Override
	public FeedbackResponse deleteFeedback(String conversationId, String messageId, String userId, String feedbackId) {
		return chatVendorClient.deleteFeedback(conversationId, messageId, userId, feedbackId);
	}
}