package xs.webbase.main.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("LoginLandingController 테스트")
class LoginLandingControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new LoginLandingController()).build();
    }

    @Test
    @DisplayName("GET /login?logout → 로그인 화면으로 리다이렉트")
    void logout_redirectsToLoginPage() throws Exception {
        mockMvc.perform(get("/login").param("logout", ""))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/webapps/xs/webbase/login/login010.jsp"));
    }

    @Test
    @DisplayName("GET /login?logout + SSO 쿠키 → 로그인 화면으로 이동하지 않음")
    void logout_ssoCookie_skipsLoginRedirect() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("USER_ID", "testuser");

        mockMvc.perform(get("/login").param("logout", "").cookie(new javax.servlet.http.Cookie("loginType", "SSO"))
                        .session(session))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/webapps/xs/aichat/v2/aichat010.jsp"));
    }

    @Test
    @DisplayName("GET /login?logout → loginType 쿠키 제거")
    void logout_clearsLoginTypeCookie() throws Exception {
        mockMvc.perform(get("/login").param("logout", ""))
                .andExpect(status().is3xxRedirection())
                .andExpect(cookie().maxAge("loginType", 0));
    }
}
