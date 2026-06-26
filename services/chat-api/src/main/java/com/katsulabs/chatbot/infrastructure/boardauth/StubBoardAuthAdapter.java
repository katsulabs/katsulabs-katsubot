package com.katsulabs.chatbot.infrastructure.boardauth;

import com.katsulabs.chatbot.domain.model.BoardAuthPage;
import com.katsulabs.chatbot.domain.port.BoardAuthPort;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile({"in-memory", "jpa"})
public class StubBoardAuthAdapter implements BoardAuthPort {

    @Override
    public BoardAuthPage listAccessibleBoards(String userId, int page, int size) {
        return new BoardAuthPage(List.of(), 0, page, size, false);
    }
}
