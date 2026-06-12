package xs.aichat.v2.service;

import org.springframework.http.ResponseEntity;
import xs.aichat.v2.dto.internal.request.*;
import xs.aichat.v2.dto.internal.request.MessageRequest;
import xs.aichat.v2.dto.internal.response.*;
import xs.aichat.v2.dto.wrapper.ApiResponse;
import xs.aichat.v2.dto.wrapper.JsonDataWrapper;

import xs.aichat.v2.dto.User;

import javax.servlet.http.HttpSession;
import java.util.Map;

public interface ChatService {

	//****** 뤼튼 연동 AI 챗봇 ************************************************************************//

	//api healthCheck
    ResponseEntity<Map<String, Object>> healthCheck();

	//최근 항목 전체조회
    ConversationsResponse selectConversations(
            ConversationRequest request,
            String loginDeptCode,
            String loginDeptName,
            String languageCode
    );

    // 메시지 조회 (DTO 기반) - JsonDataWrapper 반환으로 List 직렬화 시 컨버터 오류 방지
    JsonDataWrapper<ApiResponse<MessageItem>> selectMessages(MessageRequest request);

    //대화내용 실시간 채팅 : 초기채팅방 생성
    // (DTO 기반)
    CreateConversationResponse createConversation(
            CreateConversationRequest request,
            User user,
            HttpSession session
    );

    // 대화 목록 삭제 (n개)
    DeleteConversationsResponse deleteConversations(
            DeleteConversationRequest request,
            User user
    );

    // 접근 가능한 게시판 목록 조회
    BoardAuthResponse selectDataBoardsAuth(BoardAuthRequest request);
    //****** 뤼튼 연동 AI 챗봇 ************************************************************************//

    // feedback (DTO 기반)
    FeedbackResponse feedback(String conversationId, String messageId, String userId, FeedbackRequest request);

    // 피드백 취소 (DTO 기반)
    FeedbackResponse deleteFeedback(String conversationId, String messageId, String userId, String feedbackId);
}
