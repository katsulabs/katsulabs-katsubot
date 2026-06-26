package xs.aichat.v2.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class User {

    private String userId;

    private String name;

    private String pgCode;

    private String pgName;

    private String puCode;

    private String puName;

    private String corpCode;

    private String corpName;

    private String teamCode;

    private String teamName;

    private String officialPositionName;
}
