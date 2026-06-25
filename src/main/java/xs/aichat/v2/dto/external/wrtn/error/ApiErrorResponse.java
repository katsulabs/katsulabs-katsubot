package xs.aichat.v2.dto.external.wrtn.error;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiErrorResponse {

    private ApiErrorPayload error;
}
