package xs.aichat.katsubot.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import xs.aichat.katsubot.dto.*;
import xs.aichat.katsubot.mapper.KatsubotResponseMapper;
import xs.aichat.katsubot.service.KatsubotSessionHelper;
import xs.aichat.v2.annotation.LoggedInUser;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.dto.internal.request.ConversationRequest;
import xs.aichat.v2.service.ChatService;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/v1/conversations")
@RequiredArgsConstructor
public class KatsubotConversationController {

    private final ChatService chatService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConversationResponse create(
            @LoggedInUser User user,
            HttpSession session,
            @RequestBody(required = false) CreateConversationBody body
    ) {
        var legacyRequest = KatsubotResponseMapper.toLegacyCreateRequest(user.getUserId(), body);
        var created = chatService.createConversation(legacyRequest, user, session);
        return ConversationResponse.of(
                String.valueOf(created.getConversationId()),
                created.getTitle(),
                created.getCreatedAt(),
                created.getChatCategory()
        );
    }

    @GetMapping
    public List<ConversationResponse> list(@LoggedInUser User user, HttpSession session) {
        var request = new ConversationRequest();
        request.setUserId(user.getUserId());
        request.setPage(0);
        request.setSize(KatsubotResponseMapper.defaultListPageSize());

        var page = chatService.selectConversations(
                request,
                KatsubotSessionHelper.resolveLoginTeamCode(session, user.getTeamCode()),
                KatsubotSessionHelper.resolveLoginDeptName(session, user.getTeamName()),
                KatsubotSessionHelper.resolveLanguageCode(session)
        );
        return KatsubotResponseMapper.toConversationResponses(page);
    }

    @DeleteMapping
    public DeleteConversationsResponse delete(
            @LoggedInUser User user,
            @Valid @RequestBody DeleteConversationsBody body
    ) {
        var legacyRequest = KatsubotResponseMapper.toLegacyDeleteRequest(user.getUserId(), body);
        return KatsubotResponseMapper.toDeleteResponse(chatService.deleteConversations(legacyRequest, user));
    }
}
