package xs.aichat.v2.dto.external.wrtn.rnd;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class MessageSourcesApiResponse {

    private List<MessageSourceApiItem> sources;

    private Integer totalCount;

    private Integer page;

    private Integer size;

    private Integer totalPages;

    private Boolean hasNext;

    private Boolean first;

    private Boolean last;

    private CategoryCounts categoryCounts;

    @Data
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class CategoryCounts {

        private Integer paper;

        private Integer patent;

        private Integer article;

        private Integer internal;

        private Integer totalCount;
    }
}
