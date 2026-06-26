package xs.aichat.v2.dto.internal.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/** sidebar 팀 콤보 → WRTN JWT teamCode 갱신 요청 */
@Data
public class UpdateSessionDeptRequest {

    @NotBlank(message = "팀 코드는 필수 값입니다.")
    private String code;
}
