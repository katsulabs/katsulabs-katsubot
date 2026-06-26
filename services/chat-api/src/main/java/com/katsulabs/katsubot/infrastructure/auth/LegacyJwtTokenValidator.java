package com.katsulabs.katsubot.infrastructure.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
public class LegacyJwtTokenValidator implements JwtTokenValidator {

    private final SecretKey signingKey;

    public LegacyJwtTokenValidator(AuthProperties authProperties) {
        this.signingKey = resolveSigningKey(authProperties.jwtSecret());
    }

    @Override
    public Optional<AuthenticatedUser> validate(String token) {
        if (signingKey == null) {
            return Optional.empty();
        }
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String userId = claims.getSubject();
            if (userId == null || userId.isBlank()) {
                return Optional.empty();
            }
            return Optional.of(new AuthenticatedUser(
                    userId,
                    claims.get("corpCode", String.class),
                    claims.get("teamCode", String.class)
            ));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    static SecretKey resolveSigningKey(String jwtSecret) {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            return null;
        }
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
