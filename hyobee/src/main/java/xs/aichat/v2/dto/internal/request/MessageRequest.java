package xs.aichat.v2.dto.internal.request;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 내부 API 요청: 메시지 목록 조회 파라미터.
 * (외부 Wrtn API와 동일한 필드이지만, 내부 계약으로 분리)
 */
@Data
public class MessageRequest {

    @NotBlank(message = "대화방 아이디는 필수 값입니다.")
    private String conversationId;
    
    @NotBlank(message = "사용자 아이디는 필수 값입니다.")
    private String userId;

    @NotNull(message = "커서는 필수 값입니다.")
    @Min(value = 0, message = "커서는 0보다 작을 수 없습니다.")
    private Integer cursor;

    @Min(value = 0, message = "페이지 크기는 0보다 작을 수 없습니다.")
    private Integer size;
}
