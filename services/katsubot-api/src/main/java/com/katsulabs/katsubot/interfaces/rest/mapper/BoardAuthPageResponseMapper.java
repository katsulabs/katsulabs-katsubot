package com.katsulabs.katsubot.interfaces.rest.mapper;

import com.katsulabs.katsubot.domain.model.BoardAuthPage;
import com.katsulabs.katsubot.interfaces.rest.dto.BoardAuthPageResponse;

public final class BoardAuthPageResponseMapper {

    private BoardAuthPageResponseMapper() {
    }

    public static BoardAuthPageResponse toResponse(BoardAuthPage page) {
        return new BoardAuthPageResponse(
                page.items().stream()
                        .map(item -> new BoardAuthPageResponse.BoardAuthItemResponse(item.boardName()))
                        .toList(),
                page.totalElements(),
                page.pageNumber(),
                page.pageSize(),
                page.hasNext()
        );
    }
}
