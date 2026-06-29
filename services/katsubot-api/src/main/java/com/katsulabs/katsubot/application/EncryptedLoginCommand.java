package com.katsulabs.katsubot.application;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EncryptedLoginCommand(
        @JsonProperty("company_code_encrypt") String companyCodeEncrypt,
        @JsonProperty("user_id_encrypt") String userIdEncrypt,
        @JsonProperty("password_encrypt") String passwordEncrypt,
        @JsonProperty("language_code") String languageCode
) {
}
