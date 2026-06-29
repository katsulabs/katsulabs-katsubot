package xs.aichat.katsubot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DeleteConversationsBody {

    @NotEmpty(message = "conversation_ids는 필수입니다")
    @JsonProperty("conversation_ids")
    private List<String> conversationIds;
}
