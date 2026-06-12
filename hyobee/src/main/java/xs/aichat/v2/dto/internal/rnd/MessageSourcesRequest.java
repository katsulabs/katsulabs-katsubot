package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class MessageSourcesRequest {

    @JsonProperty("user_id")
    @NotBlank(message = "사용자 아이디는 필수 값입니다")
    private String userId;

    @JsonProperty("doc_type")
    private String docType;

    @JsonProperty("sort_by")
    private String sortBy;

    @JsonProperty("sort_order")
    private String sortOrder;

    @Min(value = 1, message = "페이지 번호는 1보다 작을 수 없습니다.")
    private int page;

    @Min(value = 1, message = "페이지 번호는 1보다 작을 수 없습니다.")
    @Range(min = 1, max =100, message = "페이지 크기는 {min}이상 ~ {max}이하입니다.")
    private int size;

    @JsonIgnore
    @AssertTrue(message = "허용되지 않는 카테고리 입니다.")
    public boolean isValidDocType() {
        var validChatCategories = List.of("paper", "patent", "article", "internal");
        return docType == null || validChatCategories.contains(docType);
    }
}

