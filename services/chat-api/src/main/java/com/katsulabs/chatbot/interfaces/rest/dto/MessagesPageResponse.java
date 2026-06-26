package com.katsulabs.chatbot.interfaces.rest.dto;

import java.util.List;

public record MessagesPageResponse(
        List<MessageResponse> messages,
        boolean has_more,
        Integer next_cursor
) {}
