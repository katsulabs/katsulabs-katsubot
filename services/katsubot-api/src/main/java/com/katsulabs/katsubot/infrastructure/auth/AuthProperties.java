package com.katsulabs.katsubot.infrastructure.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "katsubot.auth")
public record AuthProperties(
        boolean devBypass,
        String devToken,
        String jwtSecret,
        String companyCode,
        int limitPasswordFailCount,
        boolean masterLoginAvailable,
        String masterLoginPasswordEnc,
        long jwtExpireHours
) {
    public AuthProperties {
        if (devToken == null || devToken.isBlank()) {
            devToken = "dev-token";
        }
        if (jwtSecret != null && jwtSecret.isBlank()) {
            jwtSecret = null;
        }
        if (companyCode == null || companyCode.isBlank()) {
            companyCode = "1000";
        }
        if (limitPasswordFailCount <= 0) {
            limitPasswordFailCount = 5;
        }
        if (masterLoginPasswordEnc != null && masterLoginPasswordEnc.isBlank()) {
            masterLoginPasswordEnc = null;
        }
        if (jwtExpireHours <= 0) {
            jwtExpireHours = 87600L;
        }
    }
}
