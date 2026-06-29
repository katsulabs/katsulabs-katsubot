package com.katsulabs.katsubot.interfaces.rest;

import com.katsulabs.katsubot.application.EncryptedLoginCommand;
import com.katsulabs.katsubot.application.LoginException;
import com.katsulabs.katsubot.application.LoginUseCase;
import com.katsulabs.katsubot.interfaces.rest.dto.ErrorResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/encrypt-key")
    public ResponseEntity<?> createEncryptKey(HttpSession session) {
        String encryptKey = loginUseCase.createEncryptKey(session);
        return ResponseEntity.ok(Map.of("encrypt_key", encryptKey));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody EncryptedLoginCommand command, HttpSession session) {
        try {
            String token = loginUseCase.login(command, session);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (LoginException ex) {
            return ResponseEntity.status(ex.status())
                    .body(new ErrorResponse(ex.code(), ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("LOGIN", "로그인 처리 중 오류가 발생했습니다."));
        }
    }
}
