package com.katsulabs.katsubot.infrastructure.auth;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Component
public class LegacyPasswordValidator {

    /**
     * 레거시 CmmnServiceImpl.validationUserPassword — SHA-256 5회 + encptKeyInfo.
     */
    public boolean matches(String clientPasswordHash, String dbPasswordHash, String encptKeyInfo) {
        if (clientPasswordHash == null || dbPasswordHash == null || encptKeyInfo == null) {
            return false;
        }
        String hashed = clientPasswordHash;
        for (int i = 0; i < 5; i++) {
            hashed = sha256Hex(hashed + encptKeyInfo);
        }
        return hashed.equals(dbPasswordHash);
    }

    public String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder(bytes.length * 2);
            for (byte b : bytes) {
                builder.append(Integer.toString((b & 0xff) + 0x100, 16).substring(1));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 unavailable", ex);
        }
    }
}
