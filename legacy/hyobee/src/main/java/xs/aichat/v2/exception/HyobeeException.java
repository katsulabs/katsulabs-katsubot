package xs.aichat.v2.exception;

import lombok.Getter;

@Getter
public class HyobeeException extends RuntimeException {

    private final String errorCode;

    public HyobeeException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}

