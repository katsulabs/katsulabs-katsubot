package xs.aichat.v2.dto.internal.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class ConversationItem {

    @JsonProperty("conversation_id")
    private Integer conversationId;

    private String title;

    @JsonProperty("chat_category")
    private String chatCategory;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;

    /** BFF enrichment: 스트림/JWT용 대상 dept_code (WRTN 원본 아님) */
    @JsonProperty("target_dept_code")
    private String targetDeptCode;
}

