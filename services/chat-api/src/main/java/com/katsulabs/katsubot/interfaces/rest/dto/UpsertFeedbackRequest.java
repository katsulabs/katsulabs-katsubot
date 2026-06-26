package com.katsulabs.katsubot.interfaces.rest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpsertFeedbackRequest(
        @NotBlank(message = "feedback_type은 필수입니다")
        @Pattern(regexp = "like|dislike", message = "feedback_type은 like 또는 dislike여야 합니다")
        String feedback_type
) {}
