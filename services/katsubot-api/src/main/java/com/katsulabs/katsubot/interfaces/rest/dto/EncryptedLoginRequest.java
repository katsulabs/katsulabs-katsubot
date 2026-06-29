package com.katsulabs.katsubot.interfaces.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.katsulabs.katsubot.application.EncryptedLoginCommand;

public record EncryptedLoginRequest(
        @JsonProperty("company_code_encrypt") String companyCodeEncrypt,
        @JsonProperty("user_id_encrypt") String userIdEncrypt,
        @JsonProperty("password_encrypt") String passwordEncrypt,
        @JsonProperty("language_code") String languageCode
) {
    public EncryptedLoginCommand toCommand() {
        return new EncryptedLoginCommand(companyCodeEncrypt, userIdEncrypt, passwordEncrypt, languageCode);
    }
}
