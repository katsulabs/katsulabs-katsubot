package xs.aichat.v2.dto.external.wrtn.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;
import xs.aichat.dto.AttachFileInfo;

import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@AllArgsConstructor
public class SendMessageApiRequest {

    @JsonProperty("conversation_id")
    private String conversationId;

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("chat_category")
    private String chatCategory;

    private String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<AttachFileInfo> files;

    @JsonProperty("web_search_enabled")
    private String webSearchEnabled;

    public static SendMessageApiRequest initialize(
            String conversationId,
            String userId,
            String chatCategory,
            String message,
            String webSearchEnabled
    ) {
        return new SendMessageApiRequest(
                conversationId,
                userId,
                chatCategory,
                message,
                null,
                webSearchEnabled
        );
    }
}

