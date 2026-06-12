package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor(staticName = "of")
public class JournalRelatedItemsRequest {

    @JsonProperty("journal_id")
    private String journal_id;
}

