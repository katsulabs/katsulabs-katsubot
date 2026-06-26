package xs.aichat.service;

import io.jsonwebtoken.Claims;

import java.util.List;

public interface HyobeeJwtTokenService {

    String generateToken(String userId, String corpCode, String pgCode, String puCode, String teamCode, List<String> roles);

    String generateTokenByUserId(String userId);

    Claims validateToken(String token);
}