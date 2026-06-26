package xs.aichat.v2.dto.internal.request;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Data
public class ConversationRequest {

    @NotBlank(message = "사용자 아이디는 필수 값입니다")
    private String userId;

    @Min(value = 0, message = "페이지 번호는 0보다 작을 수 없습니다.")
    private int page;

    @Min(value = 0, message = "페이지 크기는 0보다 작을 수 없습니다.")
    private int size;
}

