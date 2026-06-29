package xs.aichat.katsubot.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import xs.aichat.katsubot.dto.MessagesPageResponse;
import xs.aichat.katsubot.dto.SendMessageBody;
import xs.aichat.katsubot.mapper.KatsubotResponseMapper;
import xs.aichat.katsubot.service.KatsubotMessageStreamService;
import xs.aichat.v2.annotation.LoggedInUser;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.dto.internal.request.MessageRequest;
import xs.aichat.v2.service.ChatService;

import javax.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/v1/conversations/{conversationId}/messages")
@RequiredArgsConstructor
public class KatsubotMessageController {

    private final ChatService chatService;
    private final KatsubotMessageStreamService messageStreamService;

    @GetMapping
    public MessagesPageResponse listMessages(
            @LoggedInUser User user,
            @PathVariable String conversationId,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        var request = new MessageRequest();
        request.setConversationId(conversationId);
        request.setUserId(user.getUserId());
        request.setCursor(cursor);
        request.setSize(size);

        return KatsubotResponseMapper.toMessagesPage(chatService.selectMessages(request), cursor, size);
    }

    @PostMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter sendMessage(
            @LoggedInUser User user,
            @PathVariable String conversationId,
            @Valid @RequestBody SendMessageBody body
    ) {
        return messageStreamService.streamMessage(
                user.getUserId(),
                conversationId,
                body.getContent(),
                body.getChatCategory()
        );
    }
}
