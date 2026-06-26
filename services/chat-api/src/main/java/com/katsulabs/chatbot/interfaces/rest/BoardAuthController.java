package com.katsulabs.chatbot.interfaces.rest;

import com.katsulabs.chatbot.application.ListBoardAuthUseCase;
import com.katsulabs.chatbot.infrastructure.auth.AuthContext;
import com.katsulabs.chatbot.interfaces.rest.dto.BoardAuthPageResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/board-auth")
public class BoardAuthController {

    private final ListBoardAuthUseCase listBoardAuthUseCase;

    public BoardAuthController(ListBoardAuthUseCase listBoardAuthUseCase) {
        this.listBoardAuthUseCase = listBoardAuthUseCase;
    }

    @GetMapping
    public BoardAuthPageResponse list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest
    ) {
        String userId = (String) httpRequest.getAttribute(AuthContext.USER_ID_ATTRIBUTE);
        var result = listBoardAuthUseCase.list(userId, page, size);
        return new BoardAuthPageResponse(
                result.items().stream()
                        .map(item -> new BoardAuthPageResponse.BoardAuthItemResponse(item.boardName()))
                        .toList(),
                result.totalElements(),
                result.pageNumber(),
                result.pageSize(),
                result.hasNext()
        );
    }
}
