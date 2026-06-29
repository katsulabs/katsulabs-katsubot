package xs.aichat.v2.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AichatLoginException extends RuntimeException {

    private final HttpStatus status;

    private final String code;

    /** 레거시 ApiEnvelope ERROR_CODE (webbase loginBase 호환) */
    private final String legacyCode;

    public AichatLoginException(HttpStatus status, String code, String message) {
        this(status, code, message, code);
    }

    public AichatLoginException(HttpStatus status, String code, String message, String legacyCode) {
        super(message);
        this.status = status;
        this.code = code;
        this.legacyCode = legacyCode;
    }
}
