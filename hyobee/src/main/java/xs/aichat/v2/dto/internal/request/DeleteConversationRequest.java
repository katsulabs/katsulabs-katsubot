package xs.aichat.v2.dto.internal.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DeleteConversationRequest {

    @NotBlank(message = "사용자 아이디는 필수 값입니다")
    private String userId;

    @NotEmpty(message = "대화방 아이디 목록은 필수 값입니다")
    private List<String> conversationIds;
}

