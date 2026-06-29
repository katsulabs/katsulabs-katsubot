package com.katsulabs.katsubot.infrastructure.auth;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * 레거시 XtrmCryptoUtil AES/CBC/PKCS5Padding 호환.
 */
public final class LegacyAesCrypto {

    private static final byte[] ZERO_IV = new byte[16];

    private LegacyAesCrypto() {
    }

    public static String createOtpEncryptKey() throws Exception {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(256, new SecureRandom());
        byte[] raw = keyGenerator.generateKey().getEncoded();
        String encoded = Base64.getEncoder().encodeToString(raw);
        return encoded.substring(0, 32);
    }

    public static String decrypt(String cipherText, String key) throws Exception {
        byte[] encrypted = Base64.getDecoder().decode(normalizeCipher(cipherText));
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(
                Cipher.DECRYPT_MODE,
                new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES"),
                new IvParameterSpec(ZERO_IV)
        );
        return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
    }

    private static String normalizeCipher(String value) {
        return value == null ? "" : value.replace(" ", "+");
    }
}
