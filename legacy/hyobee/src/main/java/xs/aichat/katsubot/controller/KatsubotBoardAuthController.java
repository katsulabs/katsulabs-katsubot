package xs.aichat.katsubot.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xs.aichat.katsubot.dto.BoardAuthPageResponse;
import xs.aichat.katsubot.mapper.KatsubotResponseMapper;
import xs.aichat.v2.dto.internal.request.BoardAuthRequest;
import xs.aichat.v2.service.ChatService;

@RestController
@RequestMapping("/api/v1/board-auth")
@RequiredArgsConstructor
public class KatsubotBoardAuthController {

    private final ChatService chatService;

    @GetMapping
    public BoardAuthPageResponse listBoardAuth(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        var legacy = chatService.selectDataBoardsAuth(new BoardAuthRequest());
        return KatsubotResponseMapper.toBoardAuthPage(legacy, page, size);
    }
}
