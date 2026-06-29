package com.katsulabs.katsubot.infrastructure.admindb;

public record AdminLoginUser(
        String companyCode,
        String userId,
        String userName,
        String passwordEncpt,
        String encptKeyInfo,
        String accountUseAt,
        int passwordErrorCount,
        String isLockAccount,
        String pgCode,
        String puCode,
        String corpCode,
        String deptCode,
        String teamCode,
        String teamName
) {
    public String resolveTeamCode() {
        if (teamCode != null && !teamCode.isBlank()) {
            return teamCode;
        }
        return deptCode == null ? "" : deptCode;
    }
}
