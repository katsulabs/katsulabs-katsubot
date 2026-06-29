package xs.aichat.controller.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class AichatEncryptedLoginRequest {

    private String companyCodeEncrypt;

    private String userIdEncrypt;

    private String passwordEncrypt;

    private String languageCode;
}
