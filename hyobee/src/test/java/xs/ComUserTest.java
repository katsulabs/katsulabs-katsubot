package xs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.transaction.annotation.Transactional;
import xs.core.utility.XtrmCryptoUtil;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.Set;
import java.util.stream.Collectors;

@Transactional
class ComUserTest {

    private enum DbEnv { DEV, REAL, TEST }

    private JdbcTemplate LocalJdbcTemplate(DbEnv env) {
        String driver = "org.postgresql.Driver";
        String url;
        String user;
        String pass;

        switch (env) {
            case DEV:
                url = "jdbc:postgresql://10.11.3.124:15432/xtrmvob?tcpKeepAlive=true&applicationName=xtrmVOB";
                user = "XtrmSalesDev";
                pass = "Xtrm-Sales#Dev#86";
                break;
            case REAL:
                url = "jdbc:postgresql://10.11.3.118:15433/xtrmvob?tcpKeepAlive=true&applicationName=xtrmVOB";
                user = "XtrmSalesProd";
                pass = "Xtrm-Sales#Prod#86";
                break;
            case TEST:
            default:
                url = "jdbc:postgresql://10.10.224.28:53254/xtrmvob?tcpKeepAlive=true&applicationName=xtrmVOB";
                user = "XtrmSalesDev";
                pass = "Xtrm-Sales#Dev#86";
                break;
        }

        var ds = new DriverManagerDataSource();
        ds.setDriverClassName(driver);
        ds.setUrl(url);
        ds.setUsername(user);
        ds.setPassword(pass);

        return new JdbcTemplate(ds);
    }

    // 조회 대상 아이디 목록
    private static final Set<String> TARGET_IDS = Set.of(
            "itx202501672",
            "itx202500594"
    );

//    @Transactional
    @Test
    void initUserPassword() {
        // 메서드에서만 쓸 datasource(전역 설정 아님)
        var jdbcTemplate = LocalJdbcTemplate(DbEnv.TEST);

        // 1) 회사별 암호화 키 조회
        var companyCode = "1000";
        var encryptKey = jdbcTemplate.queryForObject(
                "select encpt_key_info from com_company where company_code = ?",
                String.class,
                companyCode
        );

        // 2) TARGET_IDS 전체 암호화 값 생성 (userId -> encryptedPassword)
        var targetUserIds = TARGET_IDS.stream()
                .map(id -> {
                    try {
                        String encrypted = XtrmCryptoUtil.encryptSHA256(id, "");
                        for (int i = 0; i < 5; i++) {
                            encrypted = XtrmCryptoUtil.encryptSHA256(encrypted + encryptKey, "");
                        }
                        return InitUserPassParam.of(companyCode, id, encrypted);
                    } catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toMap(
                        InitUserPassParam::getUserId,
                        InitUserPassParam::getEncryptedPassword
                ));

        // 3) com_user 업데이트
        var updateSql = "update com_user set update_dt = current_timestamp, password_encpt = ? where company_code = ? and user_id = ?";
        TARGET_IDS.forEach(id -> {
            String encrypted = targetUserIds.get(id);
            int updated = jdbcTemplate.update(updateSql, encrypted, companyCode, id);
            System.out.println(id + " -> " + encrypted + " (updated=" + updated + ")");
        });
    }

    @Getter
    @AllArgsConstructor(staticName = "of")
    private static class InitUserPassParam {

        public String companyCode;

        public String userId;

        public String encryptedPassword;
    }
}