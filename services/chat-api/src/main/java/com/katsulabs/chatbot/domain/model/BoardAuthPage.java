package com.katsulabs.chatbot.domain.model;

import java.util.List;

public record BoardAuthPage(
        List<BoardAuthItem> items,
        long totalElements,
        int pageNumber,
        int pageSize,
        boolean hasNext
) {
    public record BoardAuthItem(String boardName) {}
}
