package com.katsulabs.katsubot.domain.port;

import com.katsulabs.katsubot.domain.model.BoardAuthPage;

public interface BoardAuthPort {

    BoardAuthPage listAccessibleBoards(String userId, int page, int size);
}
