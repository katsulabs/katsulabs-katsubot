package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.infrastructure.admindb.AdminLoginUser;
import com.katsulabs.katsubot.infrastructure.admindb.AdminLoginUserRepository;
import com.katsulabs.katsubot.infrastructure.auth.AuthProperties;
import com.katsulabs.katsubot.infrastructure.auth.LegacyAesCrypto;
import com.katsulabs.katsubot.infrastructure.auth.LegacyJwtTokenIssuer;
import com.katsulabs.katsubot.infrastructure.auth.LegacyPasswordValidator;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "katsubot.admin-db", name = "url")
public class LoginUseCase {

    private static final String SESSION_ENCRYPT_KEY = "ENCRYPT_KEY";

    private final AdminLoginUserRepository adminLoginUserRepository;
    private final LegacyPasswordValidator passwordValidator;
    private final LegacyJwtTokenIssuer jwtTokenIssuer;
    private final AuthProperties authProperties;

    public String createEncryptKey(HttpSession session) {
        try {
            String encryptKey = LegacyAesCrypto.createOtpEncryptKey();
            session.setAttribute(SESSION_ENCRYPT_KEY, encryptKey);
            return encryptKey;
        } catch (Exception ex) {
            throw new LoginException(HttpStatus.INTERNAL_SERVER_ERROR, "ENCRYPT_KEY", "암호화 키 생성에 실패했습니다.");
        }
    }

    public String login(EncryptedLoginCommand command, HttpSession session) {
        DecryptedLogin decrypted = decryptLoginFields(command, session);
        AdminLoginUser user = validatePassword(
                decrypted.companyCode(),
                decrypted.userId(),
                decrypted.passwordHash()
        );
        return jwtTokenIssuer.issueToken(
                user.userId(),
                user.corpCode(),
                user.pgCode(),
                user.puCode(),
                user.resolveTeamCode(),
                List.of("ROLE_USER", "ROLE_ADMIN")
        );
    }

    private DecryptedLogin decryptLoginFields(EncryptedLoginCommand command, HttpSession session) {
        if (session == null) {
            throw loginError(HttpStatus.UNAUTHORIZED, "LOGIN_ENF", "로그인 세션이 만료되었습니다.");
        }

        Object keyObject = session.getAttribute(SESSION_ENCRYPT_KEY);
        session.removeAttribute(SESSION_ENCRYPT_KEY);
        if (!(keyObject instanceof String encryptKey) || !StringUtils.hasText(encryptKey)) {
            throw loginError(HttpStatus.UNAUTHORIZED, "LOGIN_ENF", "로그인 세션이 만료되었습니다.");
        }

        if (!StringUtils.hasText(command.companyCodeEncrypt())
                || !StringUtils.hasText(command.userIdEncrypt())
                || !StringUtils.hasText(command.passwordEncrypt())) {
            throw loginError(HttpStatus.BAD_REQUEST, "LOGIN_EMPTY", "아이디와 비밀번호를 입력해 주세요.");
        }

        try {
            String companyCode = LegacyAesCrypto.decrypt(command.companyCodeEncrypt(), encryptKey);
            String userId = LegacyAesCrypto.decrypt(command.userIdEncrypt(), encryptKey);
            String passwordHash = LegacyAesCrypto.decrypt(command.passwordEncrypt(), encryptKey);
            String languageCode = StringUtils.hasText(command.languageCode()) ? command.languageCode() : "ko";
            return new DecryptedLogin(companyCode, userId, passwordHash, languageCode);
        } catch (Exception ex) {
            throw loginError(HttpStatus.UNAUTHORIZED, "LOGIN_ENF", "로그인 정보를 확인할 수 없습니다.");
        }
    }

    private AdminLoginUser validatePassword(String companyCode, String userId, String clientPasswordHash) {
        AdminLoginUser user = adminLoginUserRepository.findLoginCredentials(companyCode, userId)
                .orElseThrow(() -> loginError(
                        HttpStatus.UNAUTHORIZED,
                        "PASSWORD_CHANGE_ERROR02",
                        "아이디 또는 비밀번호가 올바르지 않습니다."
                ));

        int limit = authProperties.limitPasswordFailCount();
        int errorCount = user.passwordErrorCount();
        boolean isMaster = authProperties.masterLoginAvailable()
                && StringUtils.hasText(authProperties.masterLoginPasswordEnc())
                && clientPasswordHash.equals(authProperties.masterLoginPasswordEnc());

        if (!"Y".equals(user.accountUseAt()) && errorCount > limit) {
            throw loginError(HttpStatus.UNAUTHORIZED, "LOGIN_PFO", "비밀번호 오류 횟수를 초과했습니다.");
        }

        if (!"Y".equals(user.accountUseAt())) {
            throw loginError(HttpStatus.UNAUTHORIZED, "LOGIN_UTL", "사용할 수 없는 계정입니다.");
        }

        if (!passwordValidator.matches(clientPasswordHash, user.passwordEncpt(), user.encptKeyInfo()) && !isMaster) {
            adminLoginUserRepository.increaseWrongPasswordCount(companyCode, userId, errorCount, limit);
            throw loginError(HttpStatus.UNAUTHORIZED, "LOGIN_NMP", "아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        if ("Y".equals(user.isLockAccount())) {
            throw loginError(HttpStatus.UNAUTHORIZED, "LOGIN_LNL", "장기 미접속으로 계정이 잠겼습니다.");
        }

        if (passwordValidator.matches(
                passwordValidator.sha256Hex(user.userId()),
                user.passwordEncpt(),
                user.encptKeyInfo()
        )) {
            throw loginError(HttpStatus.UNAUTHORIZED, "LOGIN_EUP", "초기 비밀번호 변경이 필요합니다.");
        }

        return user;
    }

    private static LoginException loginError(HttpStatus status, String code, String message) {
        return new LoginException(status, code, message);
    }

    private record DecryptedLogin(String companyCode, String userId, String passwordHash, String languageCode) {
    }
}
