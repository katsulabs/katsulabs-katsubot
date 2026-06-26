package com.katsulabs.chatbot.application;

import com.katsulabs.chatbot.domain.model.BoardAuthPage;
import com.katsulabs.chatbot.domain.port.BoardAuthPort;
import org.springframework.stereotype.Service;

@Service
public class ListBoardAuthUseCase {

    private final BoardAuthPort boardAuthPort;

    public ListBoardAuthUseCase(BoardAuthPort boardAuthPort) {
        this.boardAuthPort = boardAuthPort;
    }

    public BoardAuthPage list(String userId, int page, int size) {
        return boardAuthPort.listAccessibleBoards(userId, page, size);
    }
}
