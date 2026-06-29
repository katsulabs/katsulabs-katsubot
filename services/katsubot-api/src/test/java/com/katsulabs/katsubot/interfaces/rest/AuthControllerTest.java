package com.katsulabs.katsubot.interfaces.rest;

import com.katsulabs.katsubot.application.GetCurrentUserUseCase;
import com.katsulabs.katsubot.application.LoginException;
import com.katsulabs.katsubot.application.LoginResult;
import com.katsulabs.katsubot.application.LoginUseCase;
import com.katsulabs.katsubot.infrastructure.admindb.AdminChatUser;
import com.katsulabs.katsubot.infrastructure.auth.AuthContext;
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

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private LoginUseCase loginUseCase;

    @Mock
    private GetCurrentUserUseCase getCurrentUserUseCase;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new AuthController(loginUseCase, getCurrentUserUseCase)).build();
    }

    @Test
    void meReturnsProfileWhenAuthenticated() throws Exception {
        when(getCurrentUserUseCase.getByUserId(eq("test20230128")))
                .thenReturn(Optional.of(new AdminChatUser(
                        "test20230128", "한재혁", "H", "H01", "00", "65H00", "효성기술원 PP/DH연구팀")));

        mockMvc.perform(get("/api/v1/auth/me")
                        .requestAttr(AuthContext.USER_ID_ATTRIBUTE, "test20230128"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user_id").value("test20230128"))
                .andExpect(jsonPath("$.user_name").value("한재혁"))
                .andExpect(jsonPath("$.team_name").value("효성기술원 PP/DH연구팀"));
    }

    @Test
    void meReturnsUnauthorizedWithoutUser() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
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
        when(loginUseCase.login(any(), any())).thenReturn(new LoginResult("jwt-token", "홍길동", "DX팀"));

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
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user_name").value("홍길동"))
                .andExpect(jsonPath("$.team_name").value("DX팀"));
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
