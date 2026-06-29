package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class SendMessageBody {

    @NotBlank(message = "content는 필수입니다")
    @Size(min = 1, max = 8000, message = "content 길이가 유효하지 않습니다")
    private String content;

    @JsonProperty("chat_category")
    private String chatCategory;
}
