package xs.aichat.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import xs.aichat.dto.JwtClaims;
import xs.aichat.util.JsonAdapter;
import xs.aichat.v2.service.ChatUserResolver;
import xs.core.property.XtrmProperty;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class HyobeeJwtTokenServiceImpl implements HyobeeJwtTokenService {

    private final ChatUserResolver chatUserResolver;

    private final JsonAdapter jsonAdapter;

    private final XtrmProperty mobjXtrmConfig;

    private long expireTimeMs;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        String secretKey = mobjXtrmConfig.getString("SECRET_KEY");
        long hours = Long.parseLong(mobjXtrmConfig.getString("EXPIRE_HOURS"));
        this.expireTimeMs = hours * 60 * 60 * 1000;
        this.expireTimeMs = 1000L * 60 * 60 * 24 * 365 * 10; // 10y pilot override

        this.signingKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String generateToken(String userId, String corpCode, String pgCode, String puCode,
                                String teamCode, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("corpCode", corpCode);
        claims.put("pgCode", pgCode);
        claims.put("puCode", puCode);
        claims.put("teamCode", teamCode);
        claims.put("roles", roles);

        return Jwts.builder()
                .subject(userId)
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expireTimeMs))
                .signWith(signingKey)
                .compact();
    }

    @Override
    public String generateTokenByUserId(String userId) {
        var user = chatUserResolver.requireById(userId);
        var claims = JwtClaims.of(
                user.getPgCode(),
                user.getPuCode(),
                user.getCorpCode(),
                user.getTeamCode(),
                List.of("ROLE_USER", "ROLE_ADMIN")
        );

        return Jwts.builder()
                .subject(userId)
                .claims(jsonAdapter.toMap(claims))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expireTimeMs))
                .signWith(signingKey)
                .compact();
    }

    @Override
    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
