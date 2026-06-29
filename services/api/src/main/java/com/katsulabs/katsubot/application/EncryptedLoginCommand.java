package com.katsulabs.katsubot.application;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record EncryptedLoginCommand(
        String companyCodeEncrypt,
        String userIdEncrypt,
        String passwordEncrypt,
        String languageCode
) {
}
