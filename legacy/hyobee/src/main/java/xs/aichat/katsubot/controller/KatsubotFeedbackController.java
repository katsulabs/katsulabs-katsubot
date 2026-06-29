package xs.aichat.katsubot.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import xs.aichat.katsubot.dto.FeedbackResponse;
import xs.aichat.katsubot.dto.UpsertFeedbackBody;
import xs.aichat.katsubot.mapper.KatsubotResponseMapper;
import xs.aichat.v2.annotation.LoggedInUser;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.service.ChatService;

import javax.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/v1/conversations/{conversationId}/messages/{messageId}/feedback")
@RequiredArgsConstructor
public class KatsubotFeedbackController {

    private final ChatService chatService;

    @PutMapping
    public FeedbackResponse upsert(
            @LoggedInUser User user,
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @Valid @RequestBody UpsertFeedbackBody body
    ) {
        var legacyRequest = KatsubotResponseMapper.toLegacyFeedbackRequest(body);
        return KatsubotResponseMapper.toFeedbackResponse(
                chatService.feedback(conversationId, messageId, user.getUserId(), legacyRequest)
        );
    }

    @DeleteMapping("/{feedbackId}")
    public FeedbackResponse delete(
            @LoggedInUser User user,
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @PathVariable String feedbackId
    ) {
        return KatsubotResponseMapper.toFeedbackResponse(
                chatService.deleteFeedback(conversationId, messageId, user.getUserId(), feedbackId)
        );
    }
}
