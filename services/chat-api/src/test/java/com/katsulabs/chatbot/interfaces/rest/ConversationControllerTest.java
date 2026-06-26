package com.katsulabs.chatbot.interfaces.rest;

import com.katsulabs.chatbot.infrastructure.auth.BearerAuthFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class ConversationControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private BearerAuthFilter bearerAuthFilter;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .addFilters(bearerAuthFilter)
                .build();
    }

    @Test
    void returns401WithoutBearerToken() throws Exception {
        mockMvc.perform(get("/api/v1/conversations"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    void createsConversationWithDevToken() throws Exception {
        mockMvc.perform(post("/api/v1/conversations")
                        .header("Authorization", "Bearer dev-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"MVP\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("MVP"))
                .andExpect(jsonPath("$.id").isNotEmpty());
    }

    @Test
    void rejectsInvalidJwtWhenSecretConfigured() throws Exception {
        mockMvc.perform(get("/api/v1/conversations")
                        .header("Authorization", "Bearer invalid.jwt.token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsEmptyMessageContent() throws Exception {
        mockMvc.perform(post("/api/v1/conversations/c0000000-0000-0000-0000-000000000001/messages")
                        .header("Authorization", "Bearer dev-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));
    }
}
