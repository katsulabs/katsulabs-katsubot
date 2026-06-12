package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.function.Function;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<R> {

    protected List<R> content;

    @JsonProperty("total_elements")
    protected long totalElements;

    @JsonProperty("page_number")
    protected int pageNumber;

    @JsonProperty("page_size")
    protected int pageSize;

    @JsonProperty("has_next")
    protected boolean hasNext;

    public <T> PageResponse(
            Page<T> page,
            Function<Page<T>, List<R>> function
    ) {
        var pageable = page.getPageable();

        this.content = function.apply(page);
        this.totalElements = page.getTotalElements();
        this.pageNumber = pageable.getPageNumber() + 1;
        this.pageSize = pageable.getPageSize();
        this.hasNext = page.hasNext();
    }

    public <T> PageResponse(
            T t,
            Pageable pageable,
            Function<T, R> function
    ) {
        this.content = List.of(function.apply(t));
        this.totalElements = 1;
        this.pageNumber = 1;
        this.pageSize = pageable.getPageSize();
        this.hasNext = false;
    }

}
