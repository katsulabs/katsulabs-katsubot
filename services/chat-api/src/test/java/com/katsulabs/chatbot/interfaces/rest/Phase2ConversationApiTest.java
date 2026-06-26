package com.katsulabs.chatbot.interfaces.rest;

import com.katsulabs.chatbot.application.CreateConversationUseCase;
import com.katsulabs.chatbot.infrastructure.auth.BearerAuthFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class Phase2ConversationApiTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private BearerAuthFilter bearerAuthFilter;

    @Autowired
    private CreateConversationUseCase createConversationUseCase;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .addFilters(bearerAuthFilter)
                .build();
    }

    @Test
    void deletesConversation() throws Exception {
        var conversation = createConversationUseCase.create("dev-user", "삭제 대상");
        var body = "{\"conversation_ids\":[\"" + conversation.id() + "\"]}";

        mockMvc.perform(delete("/api/v1/conversations")
                        .header("Authorization", "Bearer dev-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deleted_count").value(1));
    }

    @Test
    void listsMessagesForConversation() throws Exception {
        var conversation = createConversationUseCase.create("dev-user", "히스토리");

        mockMvc.perform(get("/api/v1/conversations/" + conversation.id() + "/messages")
                        .header("Authorization", "Bearer dev-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messages").isArray())
                .andExpect(jsonPath("$.has_more").value(false));
    }

    @Test
    void listsBoardAuth() throws Exception {
        mockMvc.perform(get("/api/v1/board-auth")
                        .header("Authorization", "Bearer dev-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray());
    }
}
