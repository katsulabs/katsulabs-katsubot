package com.katsulabs.katsubot.interfaces.rest;

import com.katsulabs.katsubot.application.ListBoardAuthUseCase;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import com.katsulabs.katsubot.interfaces.rest.dto.BoardAuthPageResponse;
import com.katsulabs.katsubot.interfaces.rest.mapper.BoardAuthPageResponseMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "board-auth")
@RestController
@RequestMapping("/api/v1/board-auth")
@RequiredArgsConstructor
public class BoardAuthController {

    private final ListBoardAuthUseCase listBoardAuthUseCase;

    @Operation(summary = "접근 가능 게시판 목록")
    @GetMapping
    public BoardAuthPageResponse list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest
    ) {
        return BoardAuthPageResponseMapper.toResponse(
                listBoardAuthUseCase.list(AuthContext.userId(httpRequest), page, size));
    }
}
