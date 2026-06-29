package com.katsulabs.katsubot.domain.port;

import com.katsulabs.katsubot.domain.model.MessageFeedback;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository {

    Optional<MessageFeedback> findActiveByMessageIdAndUserId(String messageId, String userId);

    List<MessageFeedback> findActiveByMessageIdsAndUserId(List<String> messageIds, String userId);

    Optional<MessageFeedback> findByIdAndUserId(String feedbackId, String userId);

    MessageFeedback save(MessageFeedback feedback);
}
