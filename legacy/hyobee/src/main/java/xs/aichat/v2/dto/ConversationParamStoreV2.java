package xs.aichat.v2.dto;

import org.springframework.stereotype.Component;
import xs.aichat.v2.dto.internal.request.SendMessageRequest;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class ConversationParamStoreV2 {

    private final ConcurrentHashMap<String, SendMessageRequest> paramMap = new ConcurrentHashMap<>();

    public void put(String conversationId, SendMessageRequest request) {
        paramMap.put(conversationId, request);
    }

    public SendMessageRequest get(String conversationId) {
        return paramMap.get(conversationId);
    }

    public void remove(String conversationId) {
        paramMap.remove(conversationId);
    }

    public boolean containsKey(String conversationId) {
        return paramMap.containsKey(conversationId);
    }
}
