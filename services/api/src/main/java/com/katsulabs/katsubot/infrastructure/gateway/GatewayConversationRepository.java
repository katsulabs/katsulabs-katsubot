package com.katsulabs.katsubot.infrastructure.gateway;

import com.katsulabs.katsubot.domain.model.Conversation;
import com.katsulabs.katsubot.domain.port.ConversationRepository;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Repository
@Profile("gateway")
@RequiredArgsConstructor
public class GatewayConversationRepository implements ConversationRepository {

    private final GatewayWrtnClient gateway;

    @Override
    public Conversation save(Conversation conversation) {
        if (isLocalDraftId(conversation.id())) {
            return gateway.createConversation(conversation.userId(), conversation.title());
        }
        return conversation;
    }

    @Override
    public Optional<Conversation> findById(String id) {
        String userId = currentUserId();
        if (userId == null) {
            return Optional.empty();
        }
        return gateway.listConversations(userId).stream()
                .filter(conversation -> conversation.id().equals(id))
                .findFirst();
    }

    @Override
    public List<Conversation> findByUserId(String userId) {
        return gateway.listConversations(userId);
    }

    @Override
    public DeleteResult deleteByUserIdAndIds(String userId, List<String> conversationIds) {
        return gateway.deleteConversations(userId, conversationIds);
    }

    private static String currentUserId() {
        var attrs = RequestContextHolder.getRequestAttributes();
        if (attrs instanceof ServletRequestAttributes servletAttrs) {
            HttpServletRequest request = servletAttrs.getRequest();
            return AuthContext.userId(request);
        }
        return null;
    }

    private static boolean isLocalDraftId(String id) {
        try {
            Long.parseLong(id);
            return false;
        } catch (NumberFormatException ex) {
            return true;
        }
    }
}
