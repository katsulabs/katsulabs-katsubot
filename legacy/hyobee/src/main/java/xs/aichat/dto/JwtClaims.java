package xs.aichat.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Value;
import lombok.experimental.Accessors;

@Value
@AllArgsConstructor
@Accessors(fluent = true)
public class JwtClaims {
    String pgCode;
    String puCode;
    String corpCode;
    String teamCode;
    List<String> roles;

    public static JwtClaims of(String pgCode, String puCode, String corpCode, String teamCode, List<String> roles) {
        return new JwtClaims(pgCode, puCode, corpCode, teamCode, roles);
    }
}
