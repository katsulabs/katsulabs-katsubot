package xs.aichat.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import xs.aichat.dto.VobLoginResult;
import xs.aichat.service.HyobeeSSOServiceImpl;
import xs.core.property.XtrmProperty;

import java.util.Properties;

import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("HyobeeSSOController ???")
class HyobeeSSOControllerTest {

    private static final String SSO_LOGIN_URL = "/xs/vob/aichat/ssologin";
    private static final String VOB_LOGIN_URL = "/xs/vob/aichat/voblogin";
    private static final String MAIN_REDIRECT_URL = "/webapps/xs/aichat/main.jsp";
    private static final int LOGIN_TYPE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

    @Mock
    private HyobeeSSOServiceImpl hyobeeSSOServiceImpl;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        XtrmProperty config = buildConfig();
        HyobeeSSOController controller = new HyobeeSSOController(hyobeeSSOServiceImpl, config);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("GET /ssologin ? ssoLogin ??")
    void ssologin_get_delegatesToService() throws Exception {
        doNothing().when(hyobeeSSOServiceImpl).ssoLogin(any(), any());

        mockMvc.perform(get(SSO_LOGIN_URL))
                .andDo(print())
                .andExpect(status().isOk());

        verify(hyobeeSSOServiceImpl).ssoLogin(any(), any());
    }

    @Test
    @DisplayName("POST /ssologin ? ssoLogin ??")
    void ssologin_post_delegatesToService() throws Exception {
        doNothing().when(hyobeeSSOServiceImpl).ssoLogin(any(), any());

        mockMvc.perform(post(SSO_LOGIN_URL))
                .andDo(print())
                .andExpect(status().isOk());

        verify(hyobeeSSOServiceImpl).ssoLogin(any(), any());
    }

    @Test
    @DisplayName("GET /voblogin ?? ? ?? + main.jsp ?????")
    void voblogin_get_success_redirectsWithCookie() throws Exception {
        when(hyobeeSSOServiceImpl.handleVobLogin(any(), any())).thenReturn(VobLoginResult.success());

        mockMvc.perform(get(VOB_LOGIN_URL))
                .andDo(print())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(MAIN_REDIRECT_URL))
                .andExpect(cookie().value("loginType", "SSO"))
                .andExpect(cookie().path("loginType", "/"))
                .andExpect(cookie().maxAge("loginType", LOGIN_TYPE_COOKIE_MAX_AGE));

        verify(hyobeeSSOServiceImpl).handleVobLogin(any(), any());
    }

    @Test
    @DisplayName("POST /voblogin ?? ? ?? ?????")
    void voblogin_post_success_redirectsWithCookie() throws Exception {
        when(hyobeeSSOServiceImpl.handleVobLogin(any(), any())).thenReturn(VobLoginResult.success());

        mockMvc.perform(post(VOB_LOGIN_URL))
                .andDo(print())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(MAIN_REDIRECT_URL))
                .andExpect(cookie().value("loginType", "SSO"))
                .andExpect(cookie().path("loginType", "/"))
                .andExpect(cookie().maxAge("loginType", LOGIN_TYPE_COOKIE_MAX_AGE));
    }

    @Test
    @DisplayName("GET /voblogin ?? ? 403 + XTRM_ERROR_DATA, ??/????? ??")
    void voblogin_get_failure_forbiddenWithErrorHeader() throws Exception {
        when(hyobeeSSOServiceImpl.handleVobLogin(any(), any()))
                .thenReturn(VobLoginResult.fail("SSO ??"));

        mockMvc.perform(get(VOB_LOGIN_URL))
                .andDo(print())
                .andExpect(status().isForbidden())
                .andExpect(header().string("XTRM_ERROR_DATA", "SSO ??"))
                .andExpect(header().string("Location", nullValue()))
                .andExpect(cookie().doesNotExist("loginType"));

        verify(hyobeeSSOServiceImpl).handleVobLogin(any(), any());
    }

    @Test
    @DisplayName("POST /voblogin ?? ? 403 + XTRM_ERROR_DATA, ??/????? ??")
    void voblogin_post_failure_forbiddenWithErrorHeader() throws Exception {
        when(hyobeeSSOServiceImpl.handleVobLogin(any(), any()))
                .thenReturn(VobLoginResult.fail("??? ?? ?? ? ??? ??????."));

        mockMvc.perform(post(VOB_LOGIN_URL))
                .andDo(print())
                .andExpect(status().isForbidden())
                .andExpect(header().string("XTRM_ERROR_DATA", "??? ?? ?? ? ??? ??????."))
                .andExpect(header().string("Location", nullValue()))
                .andExpect(cookie().doesNotExist("loginType"));

        verify(hyobeeSSOServiceImpl).handleVobLogin(any(), any());
    }

    private static XtrmProperty buildConfig() {
        Properties props = new Properties();
        props.setProperty("MAIN_PAGE_URL", "webapps/xs/aichat/main.jsp");
        var property = new XtrmProperty();
        property.setProperties(props);
        return property;
    }
}
