package com.katsulabs.katsubot.infrastructure.admindb;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@ConditionalOnProperty(prefix = "katsubot.admin-db", name = "url")
public class AdminLoginUserRepository {

    private static final String FIND_LOGIN_CREDENTIALS_SQL = """
            select cu.company_code as company_code,
                   cu.user_id as user_id,
                   cu.user_name as user_name,
                   cu.password_encpt as password_encpt,
                   (select cc.encpt_key_info
                      from com_company cc
                     where cc.company_code = cu.company_code) as encpt_key_info,
                   cu.account_use_at as account_use_at,
                   coalesce(cu.password_error_count, 0) as password_error_count,
                   case when cu.recent_login_dt is not null
                             and (current_timestamp - cast(cu.recent_login_dt as date)) > interval '180 days'
                        then 'Y'
                        else 'N'
                    end as is_lock_account,
                   vue.pg_code as pg_code,
                   vue.pu_code as pu_code,
                   vue.corp_code as corp_code,
                   cu.dept_code as dept_code,
                   vdl.dept_code as team_code,
                   vdl.dept_name as team_name
             from com_user cu
            inner join vob_user_ext vue
               on cu.user_id = vue.user_id
              and vue.dept_code = cu.dept_code
              and vue.company_code = cu.company_code
              and vue.company_code = ?
            inner join vob_dept_lang vdl
               on vue.corp_code = vdl.corp_code
              and vdl.language_code = 'ko'
              and vue.company_code = vdl.company_code
              and vdl.dept_code = vue.dept_special_code
            where cu.company_code = ?
              and cu.user_id = ?
            """;

    private static final RowMapper<AdminLoginUser> ROW_MAPPER = (rs, rowNum) -> new AdminLoginUser(
            rs.getString("company_code"),
            rs.getString("user_id"),
            rs.getString("user_name"),
            rs.getString("password_encpt"),
            rs.getString("encpt_key_info"),
            rs.getString("account_use_at"),
            rs.getInt("password_error_count"),
            rs.getString("is_lock_account"),
            rs.getString("pg_code"),
            rs.getString("pu_code"),
            rs.getString("corp_code"),
            rs.getString("dept_code"),
            rs.getString("team_code"),
            rs.getString("team_name")
    );

    private final JdbcTemplate jdbcTemplate;

    public AdminLoginUserRepository(@Qualifier("adminJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<AdminLoginUser> findLoginCredentials(String companyCode, String userId) {
        var results = jdbcTemplate.query(
                FIND_LOGIN_CREDENTIALS_SQL,
                ROW_MAPPER,
                companyCode,
                companyCode,
                userId
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.getFirst());
    }

    public void increaseWrongPasswordCount(String companyCode, String userId, int currentCount, int limit) {
        int nextCount = currentCount + 1;
        String accountUseAt = nextCount >= limit ? "N" : null;
        if (accountUseAt != null) {
            jdbcTemplate.update(
                    """
                    update com_user
                       set password_error_count = ?,
                           account_use_at = ?,
                           last_update_user_id = ?,
                           last_update_dt = current_timestamp
                     where company_code = ?
                       and user_id = ?
                    """,
                    nextCount,
                    accountUseAt,
                    userId,
                    companyCode,
                    userId
            );
            return;
        }
        jdbcTemplate.update(
                """
                update com_user
                   set password_error_count = ?,
                       last_update_user_id = ?,
                       last_update_dt = current_timestamp
                 where company_code = ?
                   and user_id = ?
                """,
                nextCount,
                userId,
                companyCode,
                userId
        );
    }
}
