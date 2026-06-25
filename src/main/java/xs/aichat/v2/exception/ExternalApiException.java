package xs.aichat.v2.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(staticName = "of")
public class ExternalApiException extends RuntimeException {

    private final HttpStatus httpStatus;

    private final String errorCode;

    private final Integer upstreamCode;

    private final String upstreamType;

    private ExternalApiException(HttpStatus httpStatus, String errorCode, String message) {
        this(httpStatus, errorCode, message, null, null);
    }

    public ExternalApiException(
            HttpStatus httpStatus,
            String errorCode,
            String message,
            Integer upstreamCode,
            String upstreamType
    ) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.upstreamCode = upstreamCode;
        this.upstreamType = upstreamType;
    }

    public static ExternalApiException of(HttpStatus httpStatus, String errorCode, String message) {
        return new ExternalApiException(httpStatus, errorCode, message);
    }
}
