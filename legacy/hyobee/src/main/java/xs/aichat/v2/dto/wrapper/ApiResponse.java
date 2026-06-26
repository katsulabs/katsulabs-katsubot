package xs.aichat.v2.dto.wrapper;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import xs.aichat.v2.dto.internal.rnd.PageResponse;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    @JsonProperty("HEADER")
    private Header header;

    @JsonProperty("DATA")
    private List<T> data;

    @Data
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Header {

        @JsonProperty(value = "ERROR_FLAG")
        private boolean errorFlag;

        @JsonProperty(value = "ERROR_CODE")
        private String errorCode;

        @JsonProperty(value = "ERROR_MSG")
        private String errorMsg;

        @JsonProperty(value = "CURRENT_DT")
        private String currentDt;

        @JsonProperty(value = "REQUEST_ID")
        private String requestId;

        /** 현재 페이지 원소 수 (Spring {@code Page#getNumberOfElements()}와 동일 개념) */
        @JsonProperty(value = "COUNT")
        private Integer numberOfElements;

        @JsonProperty(value = "TOT_COUNT")
        private Long totalElements;

        @JsonProperty(value = "PAGE_NO")
        private Integer pageNumber;

        @JsonProperty(value = "ROW_PER_PAGE")
        private Integer pageSize;

        public Header(boolean errorFlag, String errorCode, String errorMsg, String currentDt, String requestId) {
            this.errorFlag = errorFlag;
            this.errorCode = errorCode;
            this.errorMsg = errorMsg;
            this.currentDt = currentDt;
            this.requestId = requestId;
        }

        /**
         * 내부 {@link PageResponse} 값을 그대로 옮기고, JSON으로 나갈 때만 레거시 HEADER 키로 직렬화된다.
         */
        public void copyPagingFrom(PageResponse<?> page, int numberOfElements) {
            this.numberOfElements = numberOfElements;
            this.totalElements = page.getTotalElements();
            this.pageNumber = page.getPageNumber();
            this.pageSize = page.getPageSize();
        }
    }
}
