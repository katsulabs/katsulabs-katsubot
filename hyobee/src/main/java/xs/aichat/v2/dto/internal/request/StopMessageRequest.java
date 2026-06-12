package xs.aichat.v2.dto.internal.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class StopMessageRequest {

    @JsonProperty("conversation_id")
    @NotBlank(message = "대화방 아이디는 필수 값입니다.")
    private String conversationId;

    @JsonProperty("user_id")
    @NotBlank(message = "사용자 아이디는 필수 값입니다.")
    private String userId;

    @JsonProperty("message_id")
    @NotBlank(message = "메시지 아이디는 필수 값입니다.")
    private String messageId;
}

