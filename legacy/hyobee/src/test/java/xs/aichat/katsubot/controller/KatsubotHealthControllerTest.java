package xs.aichat.katsubot.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import xs.aichat.katsubot.exception.KatsubotExceptionHandler;
import xs.aichat.v2.service.ChatService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("KatsubotHealthController")
class KatsubotHealthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ChatService chatService;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new KatsubotHealthController())
                .setControllerAdvice(new KatsubotExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/v1/health는 인증 없이 UP을 반환한다")
    void health_returnsUp() throws Exception {
        mockMvc.perform(get("/api/v1/health").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.module").value("legacy-katsubot-facade"));
    }
}
