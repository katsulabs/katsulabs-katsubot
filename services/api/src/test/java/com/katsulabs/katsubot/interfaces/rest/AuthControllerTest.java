package com.katsulabs.katsubot.interfaces.rest;

import com.katsulabs.katsubot.application.LoginException;
import com.katsulabs.katsubot.application.LoginUseCase;
import com.katsulabs.katsubot.interfaces.rest.dto.EncryptedLoginRequest;
import com.katsulabs.katsubot.interfaces.rest.dto.ErrorResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private LoginUseCase loginUseCase;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new AuthController(loginUseCase)).build();
    }

    @Test
    void encryptKeyReturnsKey() throws Exception {
        when(loginUseCase.createEncryptKey(any())).thenReturn("12345678901234567890123456789012");

        mockMvc.perform(post("/api/v1/auth/encrypt-key"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.encrypt_key").value("12345678901234567890123456789012"));
    }

    @Test
    void loginAcceptsSnakeCaseRequestBody() throws Exception {
        when(loginUseCase.login(any(), any())).thenReturn("jwt-token");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "company_code_encrypt": "a",
                                  "user_id_encrypt": "b",
                                  "password_encrypt": "c"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    void loginReturnsUnauthorizedOnFailure() throws Exception {
        when(loginUseCase.login(any(), any()))
                .thenThrow(new LoginException(HttpStatus.UNAUTHORIZED, "LOGIN_NMP", "아이디 또는 비밀번호가 올바르지 않습니다."));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "company_code_encrypt": "a",
                                  "user_id_encrypt": "b",
                                  "password_encrypt": "c"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("LOGIN_NMP"));
    }
}
