package com.katsulabs.katsubot.interfaces.rest.dto;

import java.util.List;

public record BoardAuthPageResponse(
        List<BoardAuthItemResponse> items,
        long total_elements,
        int page_number,
        int page_size,
        boolean has_next
) {
    public record BoardAuthItemResponse(String board_name) {}
}
