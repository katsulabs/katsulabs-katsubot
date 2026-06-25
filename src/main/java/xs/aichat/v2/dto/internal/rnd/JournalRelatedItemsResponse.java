package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalRelatedItemsResponse {

    @JsonProperty("related_items")
    private List<JournalRelatedItem> relatedItems;

    private boolean cached;
}