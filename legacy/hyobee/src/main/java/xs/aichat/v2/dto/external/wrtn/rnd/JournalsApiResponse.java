package xs.aichat.v2.dto.external.wrtn.rnd;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class JournalsApiResponse {

    private List<JournalApiItem> content;

    private int totalCount;

    private int page;

    private int size;

    private Boolean hasNext;

    private Boolean first;

    private Boolean last;

    private int total_pages;
}
