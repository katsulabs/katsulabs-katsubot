package com.katsulabs.katsubot.infrastructure.admindb;

/** {@code UserMapper.findLoginCredentials} — 비밀번호·계정 상태 검증 전용. */
public record AdminLoginCredentials(
        String companyCode,
        String userId,
        String passwordEncpt,
        String encptKeyInfo,
        String accountUseAt,
        int passwordErrorCount,
        String isLockAccount
) {
}
