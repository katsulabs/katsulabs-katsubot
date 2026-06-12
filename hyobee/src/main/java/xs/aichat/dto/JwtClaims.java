package xs.aichat.dto;

import java.util.List;

public record JwtClaims(
        String pgCode,
        String puCode,
        String corpCode,
        String teamCode,
        List<String> roles
) {
    public static JwtClaims of(String pgCode, String puCode, String corpCode, String teamCode, List<String> roles) {
        return new JwtClaims(pgCode, puCode, corpCode, teamCode, roles);
    }
}
