package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.infrastructure.admindb.AdminChatUser;
import com.katsulabs.katsubot.infrastructure.admindb.AdminLoginCredentials;
import com.katsulabs.katsubot.infrastructure.admindb.AdminUserRepository;
import com.katsulabs.katsubot.infrastructure.auth.AuthProperties;
import com.katsulabs.katsubot.infrastructure.auth.LegacyJwtTokenIssuer;
import com.katsulabs.katsubot.infrastructure.auth.LegacyJwtTokenValidator;
import com.katsulabs.katsubot.infrastructure.auth.LegacyPasswordValidator;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpSession;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoginUseCaseTest {

    private static final String TEST_SECRET = "yZp3n4W8LkqS1tDbE9mV0rXuA7wC2pTfG5hQ8jR3xU6sNcKdF4vB1zYeH0aMiOwP";

    @Mock
    private AdminUserRepository adminUserRepository;

    private LegacyPasswordValidator passwordValidator;
    private LoginUseCase loginUseCase;

    @BeforeEach
    void setUp() {
        passwordValidator = new LegacyPasswordValidator();
        var authProperties = new AuthProperties(false, "dev-token", TEST_SECRET, "1000", 5, false, null, 87600L);
        loginUseCase = new LoginUseCase(
                adminUserRepository,
                passwordValidator,
                new LegacyJwtTokenIssuer(authProperties),
                authProperties
        );
    }

    @Test
    void createEncryptKeyStoresSessionValue() {
        HttpSession session = new MockHttpSession();
        String encryptKey = loginUseCase.createEncryptKey(session);
        assertThat(encryptKey).hasSize(32);
    }

    @Test
    void loginRejectsWhenEncryptKeyMissing() {
        HttpSession session = new MockHttpSession();
        var command = new EncryptedLoginCommand("a", "b", "c", "ko");

        assertThatThrownBy(() -> loginUseCase.login(command, session))
                .isInstanceOf(LoginException.class)
                .extracting(ex -> ((LoginException) ex).code())
                .isEqualTo("LOGIN_ENF");
    }

    @Test
    void loginIssuesJwtFromFindByIdProfile() throws Exception {
        HttpSession session = new MockHttpSession();
        String encryptKey = loginUseCase.createEncryptKey(session);

        String companyCode = "1000";
        String userId = "user01";
        String passwordHash = passwordValidator.sha256Hex("secret");
        String encptKeyInfo = "key-info";
        String dbHash = passwordHash;
        for (int i = 0; i < 5; i++) {
            dbHash = passwordValidator.sha256Hex(dbHash + encptKeyInfo);
        }

        when(adminUserRepository.findLoginCredentials(companyCode, userId)).thenReturn(Optional.of(
                new AdminLoginCredentials(companyCode, userId, dbHash, encptKeyInfo, "Y", 0, "N")
        ));
        when(adminUserRepository.findById(companyCode, userId)).thenReturn(Optional.of(
                new AdminChatUser(userId, "User", "H", "H01", "00", "65H00", "Team")
        ));

        var command = new EncryptedLoginCommand(
                encryptLegacy(companyCode, encryptKey),
                encryptLegacy(userId, encryptKey),
                encryptLegacy(passwordHash, encryptKey),
                "ko"
        );

        String token = loginUseCase.login(command, session);
        assertThat(token).isNotBlank();

        var validator = new LegacyJwtTokenValidator(new AuthProperties(false, "dev-token", TEST_SECRET, "1000", 5, false, null, 87600L));
        var user = validator.validate(token);
        assertThat(user).isPresent();
        assertThat(user.get().userId()).isEqualTo(userId);
        assertThat(user.get().corpCode()).isEqualTo("00");
        assertThat(user.get().teamCode()).isEqualTo("65H00");

        verify(adminUserRepository).findById(companyCode, userId);
    }

    @Test
    void loginIncrementsWrongPasswordCount() throws Exception {
        HttpSession session = new MockHttpSession();
        String encryptKey = loginUseCase.createEncryptKey(session);

        when(adminUserRepository.findLoginCredentials("1000", "user01")).thenReturn(Optional.of(
                new AdminLoginCredentials("1000", "user01", "db-hash", "key-info", "Y", 1, "N")
        ));

        var command = new EncryptedLoginCommand(
                encryptLegacy("1000", encryptKey),
                encryptLegacy("user01", encryptKey),
                encryptLegacy("bad-hash", encryptKey),
                "ko"
        );

        assertThatThrownBy(() -> loginUseCase.login(command, session))
                .isInstanceOf(LoginException.class);

        verify(adminUserRepository).increaseWrongPasswordCount(eq("1000"), eq("user01"), eq(1), anyInt());
    }

    private static String encryptLegacy(String plain, String key) throws Exception {
        javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(
                javax.crypto.Cipher.ENCRYPT_MODE,
                new javax.crypto.spec.SecretKeySpec(key.getBytes(java.nio.charset.StandardCharsets.UTF_8), "AES"),
                new javax.crypto.spec.IvParameterSpec(new byte[16])
        );
        return java.util.Base64.getEncoder().encodeToString(cipher.doFinal(plain.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
    }
}
