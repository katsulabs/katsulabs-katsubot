package xs.core.dto;

import lombok.AllArgsConstructor;
import lombok.Value;

/**
 * 레거시 API wire format HEADER 블록 (TB-006).
 * {@link ApiEnvelope} 내부 Jackson 노드와 동기화된다.
 */
@Value
@AllArgsConstructor
public class ResponseHeader {
    boolean errorFlag;
    String errorCode;
    String errorMsg;
    int count;
    int totCount;
    int pageNo;
    int rowPerPage;

    public static ResponseHeader empty() {
        return new ResponseHeader(false, "", "", 0, 0, 0, 0);
    }

    public static ResponseHeader error(String errorCode, String errorMsg) {
        return new ResponseHeader(true, errorCode != null ? errorCode : "", errorMsg != null ? errorMsg : "", 0, 0, 0, 0);
    }

    public static ResponseHeader from(ApiEnvelope envelope) {
        if (envelope == null) {
            return empty();
        }
        return new ResponseHeader(
                envelope.getErrorFlag(),
                envelope.getErrorCode(),
                envelope.getErrorMsg(),
                envelope.getCount(),
                envelope.getTotalCount(),
                envelope.getHeaderInt("PAGE_NO"),
                envelope.getHeaderInt("ROW_PER_PAGE"));
    }

    public void applyTo(ApiEnvelope envelope) {
        if (envelope == null) {
            return;
        }
        envelope.setResultHeader(errorFlag, errorMsg, errorCode);
        envelope.setHeader("COUNT", count);
        envelope.setHeader("TOT_COUNT", totCount);
        if (pageNo > 0) {
            envelope.setHeader("PAGE_NO", pageNo);
        }
        if (rowPerPage > 0) {
            envelope.setHeader("ROW_PER_PAGE", rowPerPage);
        }
    }
}
