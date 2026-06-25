package xs.aichat.v2.dto.internal.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class StopMessageResponse {

    private boolean returnStop;
}

