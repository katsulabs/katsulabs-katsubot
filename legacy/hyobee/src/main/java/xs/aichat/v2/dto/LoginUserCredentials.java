package xs.aichat.v2.dto;

import lombok.Data;

import java.sql.Timestamp;

/**
 * {@link xs.aichat.v2.mapper.UserMapper#findLoginCredentials} — 로그인 검증·세션/JWT용.
 */
@Data
public class LoginUserCredentials {

    private String companyCode;

    private String userId;

    private String userName;

    private String passwordEncpt;

    private String encptKeyInfo;

    private String accountUseAt;

    private Integer passwordErrorCount;

    private String isLockAccount;

    private Timestamp recentPasswordChangeDate;

    private String pgCode;

    private String puCode;

    private String corpCode;

    private String deptCode;

    private String teamCode;

    private String teamName;
}
