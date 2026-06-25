package xs.aichat.v2.dto.internal.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class SendMessageRequest {

    @NotBlank(message = "대화방 번호는 필수 값입니다.")
    private String conversationId;

    @NotBlank(message = "사용자 아이디는 필수 값입니다.")
    private String userId;

    @NotBlank(message = "대화방 유형은 필수 값입니다.")
    private String chatCategory;

    @NotBlank(message = "사용자 질의는 필수 값입니다.")
    private String message;

    private String files;

    @JsonIgnore
    @AssertTrue(message = "허용되지 않는 대화방 유형입니다.")
    public boolean isValidChatCategory() {
        var validChatCategories = List.of("internal_rules", "web_search", "rnd_search");
        // 바인딩 실패/누락으로 chatCategory가 null로 들어올 수 있어 NPE 방어
        return chatCategory != null && validChatCategories.contains(chatCategory);
    }
}

