package xs.aichat.v2.dto.internal.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CreateConversationRequest {

    @NotBlank(message = "사용자 아이디는 필수 값입니다")
    private String userId;

    @NotBlank(message = "사용자 첫 질의는 필수 값입니다")
    private String userQuery;

    @NotBlank(message = "대화방 유형은 필수 값입니다.")
    private String chatCategory;

    @JsonIgnore
    @AssertTrue(message = "허용되지 않는 대화방 유형입니다.")
    public boolean isValidChatCategory() {
        var validChatCategories = List.of("internal_rules", "web_search", "rnd_search");
        // 바인딩 실패/누락으로 chatCategory가 null로 들어올 수 있어 NPE 방어
        // @AssertTrue 이므로 "유효하면 true"로 반환해야 함
        return chatCategory != null && validChatCategories.contains(chatCategory);
    }
}

