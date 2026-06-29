package com.katsulabs.katsubot.infrastructure.auth;

import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class LegacyJwtTokenIssuer {

    private final AuthProperties authProperties;

    public String issueToken(
            String userId,
            String corpCode,
            String pgCode,
            String puCode,
            String teamCode,
            String userName,
            String teamName,
            List<String> roles
    ) {
        SecretKey signingKey = LegacyJwtTokenValidator.resolveSigningKey(authProperties.jwtSecret());
        if (signingKey == null) {
            throw new IllegalStateException("JWT secret is not configured");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("corpCode", corpCode);
        claims.put("pgCode", pgCode);
        claims.put("puCode", puCode);
        claims.put("teamCode", teamCode);
        claims.put("roles", roles);
        if (userName != null && !userName.isBlank()) {
            claims.put("userName", userName);
        }
        if (teamName != null && !teamName.isBlank()) {
            claims.put("teamName", teamName);
        }

        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(authProperties.jwtExpireHours() * 3600L);

        return Jwts.builder()
                .subject(userId)
                .claims(claims)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(signingKey, Jwts.SIG.HS512)
                .compact();
    }
}
