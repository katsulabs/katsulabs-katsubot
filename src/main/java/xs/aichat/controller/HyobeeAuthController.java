package xs.aichat.controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xs.aichat.service.HyobeeJwtTokenService;

import java.util.stream.Collectors;
import java.util.*;

@RestController
@RequestMapping("/xs/vob/aichat/auth")
@RequiredArgsConstructor
public class HyobeeAuthController {

    private final HyobeeJwtTokenService jwtTokenService;

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authorizationHeader) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Missing or invalid Authorization header"));
        }

        String token = authorizationHeader.substring(7); // "Bearer " ?�거

        try {
            Claims claims = jwtTokenService.validateToken(token);

            Map<String, Object> body = new HashMap<>();
            body.put("valid", true);
            body.put("userId", claims.getSubject());

            // String ?�레?�들 (null ?�전 처리)
            body.put("corpCode", claims.get("corpCode", String.class));
            body.put("pgCode", claims.get("pgCode", String.class));
            body.put("puCode", claims.get("puCode", String.class));
            body.put("teamCode", claims.get("teamCode", String.class));

            // roles 처리???�전?�게 변??(?�큰??List<String>?�로 ?�어가 ?�으�??�부�?List�??�옴)
            Object rolesObj = claims.get("roles");
            List<String> roles = Collections.emptyList();
            if (rolesObj instanceof List) {
                roles = ((List<?>) rolesObj).stream()
                        .filter(Objects::nonNull)
                        .map(Object::toString)
                        .collect(Collectors.toList());
            } else if (rolesObj instanceof String) {
                // ?�시 String?�로 직렬?�되???�어?�을 경우 (?? "ROLE_USER,ROLE_ADMIN")
                roles = Arrays.stream(((String) rolesObj).split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());
            }
            body.put("roles", roles);

            // issuedAt / expiration (null ?�전)
            body.put("issuedAt", claims.getIssuedAt());
            body.put("expireAt", claims.getExpiration());

            return ResponseEntity.ok(body);

        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "error", "Token expired"));
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "error", "Invalid token"));
        }
    }

    @GetMapping("/verify1")
    public ResponseEntity<?> verifyToken1(@RequestHeader("Authorization") String authorizationHeader) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Missing or invalid Authorization header"));
        }

        String token = authorizationHeader.substring(7); // Bearer ?�거

        try {
            Claims claims = jwtTokenService.validateToken(token);

            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "userId", claims.getSubject(),
                    "roles", claims.get("roles"),
                    "issuedAt", claims.getIssuedAt(),
                    "expireAt", claims.getExpiration()
            ));

        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "error", "Token expired"));
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "error", "Invalid token"));
        }
    }
}
