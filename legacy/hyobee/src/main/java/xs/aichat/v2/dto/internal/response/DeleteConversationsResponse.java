package xs.aichat.v2.dto.internal.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor(staticName = "of")
public class DeleteConversationsResponse {

    private int status;

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("deleted_date")
    private String deletedDate;

    @JsonProperty("deleted_count")
    private int deletedCount;

    private List<DeleteConversationResultItem> results;
}

