package com.katsulabs.katsubot.interfaces.rest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendMessageRequest(
        @NotBlank(message = "content는 필수입니다")
        @Size(max = 8000, message = "content는 8000자 이하여야 합니다")
        String content
) {
}
