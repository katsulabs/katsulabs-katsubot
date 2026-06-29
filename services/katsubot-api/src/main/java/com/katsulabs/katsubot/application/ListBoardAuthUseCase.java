package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.domain.model.BoardAuthPage;
import com.katsulabs.katsubot.domain.port.BoardAuthPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListBoardAuthUseCase {

    private final BoardAuthPort boardAuthPort;

    public BoardAuthPage list(String userId, int page, int size) {
        return boardAuthPort.listAccessibleBoards(userId, page, size);
    }
}
