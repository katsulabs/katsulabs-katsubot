package com.katsulabs.katsubot.interfaces.rest;

import com.katsulabs.katsubot.application.GetCurrentUserUseCase;
import com.katsulabs.katsubot.application.LoginException;
import com.katsulabs.katsubot.application.LoginResult;
import com.katsulabs.katsubot.application.LoginUseCase;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
import com.katsulabs.katsubot.interfaces.rest.dto.EncryptedLoginRequest;
import com.katsulabs.katsubot.interfaces.rest.dto.ErrorResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "auth")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@ConditionalOnBean(LoginUseCase.class)
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final GetCurrentUserUseCase getCurrentUserUseCase;

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        String userId = AuthContext.userId(request);
        if (userId == null || userId.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("UNAUTHORIZED", "인증이 필요합니다."));
        }
        return getCurrentUserUseCase.getByUserId(userId)
                .map(user -> ResponseEntity.ok(Map.of(
                        "user_id", user.userId(),
                        "user_name", user.userName(),
                        "team_name", user.teamName())))
                .orElse(ResponseEntity.ok(Map.of(
                        "user_id", userId,
                        "user_name", userId,
                        "team_name", "")));
    }

    @PostMapping("/encrypt-key")
    public ResponseEntity<?> createEncryptKey(HttpSession session) {
        String encryptKey = loginUseCase.createEncryptKey(session);
        return ResponseEntity.ok(Map.of("encrypt_key", encryptKey));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody EncryptedLoginRequest request, HttpSession session) {
        try {
            LoginResult result = loginUseCase.login(request.toCommand(), session);
            return ResponseEntity.ok(Map.of(
                    "token", result.token(),
                    "user_name", result.userName(),
                    "team_name", result.teamName()
            ));
        } catch (LoginException ex) {
            return ResponseEntity.status(ex.status())
                    .body(new ErrorResponse(ex.code(), ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("LOGIN", "로그인 처리 중 오류가 발생했습니다."));
        }
    }
}
