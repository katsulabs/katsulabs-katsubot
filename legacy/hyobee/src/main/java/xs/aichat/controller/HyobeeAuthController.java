package xs.aichat.controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xs.aichat.controller.dto.AichatEncryptedLoginRequest;
import xs.aichat.service.HyobeeJwtTokenService;
import xs.aichat.v2.exception.AichatLoginException;
import xs.aichat.v2.service.AichatUserLoginService;
import xs.aichat.v2.util.JwtSessionHelper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.util.stream.Collectors;
import java.util.*;

@RestController
@RequestMapping("/xs/vob/aichat/auth")
@RequiredArgsConstructor
public class HyobeeAuthController {

    private final HyobeeJwtTokenService jwtTokenService;
    private final AichatUserLoginService aichatUserLoginService;

    /**
     * chat-web·레거시 공통 OTP 키 발급 (세션 ENCRYPT_KEY).
     */
    @PostMapping("/encrypt-key")
    public ResponseEntity<?> createEncryptKey(HttpSession session) {
        try {
            String encryptKey = aichatUserLoginService.createOtpEncryptKey(session);
            return ResponseEntity.ok(Map.of("encrypt_key", encryptKey));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("code", "ENCRYPT_KEY", "message", "암호화 키 생성에 실패했습니다."));
        }
    }

    /**
     * UserMapper + 복호화 비밀번호 로그인. 성공 시 세션·JWT를 한 번에 반환한다.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AichatEncryptedLoginRequest request,
            HttpServletRequest httpRequest,
            HttpSession session
    ) {
        try {
            aichatUserLoginService.loginWithEncryptedFields(request, session, httpRequest);
            String token = JwtSessionHelper.obtainAuthorizationJwt(session, jwtTokenService);
            if (!StringUtils.hasText(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("code", "TOKEN", "message", "JWT 발급에 실패했습니다."));
            }
            return ResponseEntity.ok(Map.of("token", token));
        } catch (AichatLoginException ex) {
            return ResponseEntity.status(ex.getStatus())
                    .body(Map.of("code", ex.getCode(), "message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("code", "LOGIN", "message", "로그인 처리 중 오류가 발생했습니다."));
        }
    }

    /**
     * loginBase 등 레거시 세션 로그인 후 chat-web JWT handoff용.
     */
    @GetMapping("/session-token")
    public ResponseEntity<?> issueSessionToken(HttpSession session) {
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No session"));
        }

        String token = JwtSessionHelper.obtainAuthorizationJwt(session, jwtTokenService);
        if (!StringUtils.hasText(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }

        return ResponseEntity.ok(Map.of("token", token));
    }

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
