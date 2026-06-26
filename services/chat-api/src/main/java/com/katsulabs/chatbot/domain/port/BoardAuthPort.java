package com.katsulabs.chatbot.domain.port;

import com.katsulabs.chatbot.domain.model.BoardAuthPage;

public interface BoardAuthPort {

    BoardAuthPage listAccessibleBoards(String userId, int page, int size);
}
