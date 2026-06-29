package xs.aichat.v2.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import xs.aichat.v2.dto.LoginUserCredentials;
import xs.aichat.v2.exception.AichatLoginException;
import xs.aichat.v2.mapper.UserMapper;
import xs.core.database.XtrmDAOWeb;
import xs.core.property.XtrmProperty;
import xs.vob.cmmn.service.CmmnService;

import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("AichatUserLoginService")
class AichatUserLoginServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private CmmnService cmmnService;

    @Mock
    private XtrmDAOWeb xtrmDao;

    private XtrmProperty xtrmConfig;

    private AichatUserLoginService loginService;

    @BeforeEach
    void setUp() {
        xtrmConfig = new XtrmProperty();
        Properties properties = new Properties();
        properties.setProperty("LIMIT_PASSWORD_FAIL_COUNT", "5");
        properties.setProperty("MASTER_LOGIN_AVAILABLE", "false");
        xtrmConfig.setProperties(properties);
        loginService = new AichatUserLoginService(userMapper, cmmnService, xtrmDao, xtrmConfig);
    }

    @Test
    @DisplayName("UserMapper 조회 후 비밀번호가 일치하면 통과한다")
    void validateDecryptedPassword_success() throws Exception {
        var credentials = new LoginUserCredentials();
        credentials.setUserId("user01");
        credentials.setCompanyCode("1000");
        credentials.setAccountUseAt("Y");
        credentials.setPasswordErrorCount(0);
        credentials.setPasswordEncpt("db-hash");
        credentials.setEncptKeyInfo("key");
        credentials.setIsLockAccount("N");

        when(userMapper.findLoginCredentials("1000", "user01")).thenReturn(credentials);
        when(cmmnService.validationUserPassword(
                org.mockito.ArgumentMatchers.anyString(),
                eq("db-hash"),
                eq("key")
        )).thenReturn(true).thenReturn(false);

        assertThatCode(() -> loginService.validateDecryptedPassword("1000", "user01", "client-hash"))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("비밀번호 불일치 시 실패 카운트를 올리고 거부한다")
    void validateDecryptedPassword_wrongPassword() throws Exception {
        var credentials = new LoginUserCredentials();
        credentials.setUserId("user01");
        credentials.setCompanyCode("1000");
        credentials.setAccountUseAt("Y");
        credentials.setPasswordErrorCount(1);
        credentials.setPasswordEncpt("db-hash");
        credentials.setEncptKeyInfo("key");

        when(userMapper.findLoginCredentials("1000", "user01")).thenReturn(credentials);
        when(cmmnService.validationUserPassword(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString()
        )).thenReturn(false);

        assertThatThrownBy(() -> loginService.validateDecryptedPassword("1000", "user01", "bad"))
                .isInstanceOf(AichatLoginException.class);

        verify(cmmnService).increaseWrongPasswordCount(eq("1000"), eq("user01"), eq(1), eq(xtrmDao));
    }
}
