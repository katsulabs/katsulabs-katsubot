package com.katsulabs.katsubot.infrastructure.boardauth;

import com.katsulabs.katsubot.domain.model.BoardAuthPage;
import com.katsulabs.katsubot.domain.port.BoardAuthPort;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("!legacy-bridge")
public class StubBoardAuthAdapter implements BoardAuthPort {

    @Override
    public BoardAuthPage listAccessibleBoards(String userId, int page, int size) {
        return new BoardAuthPage(List.of(), 0, page, size, false);
    }
}
