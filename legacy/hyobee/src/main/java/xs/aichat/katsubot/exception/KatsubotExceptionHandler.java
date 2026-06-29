package xs.aichat.katsubot.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import xs.aichat.katsubot.dto.ErrorResponse;
import xs.aichat.v2.exception.ExternalApiException;
import xs.aichat.v2.exception.HyobeeException;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice(basePackages = "xs.aichat.katsubot.controller")
public class KatsubotExceptionHandler {

    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<ErrorResponse> handleExternalApi(ExternalApiException ex) {
        HttpStatus status = ex.getHttpStatus() != null ? ex.getHttpStatus() : HttpStatus.BAD_GATEWAY;
        if (status.is5xxServerError() && status != HttpStatus.BAD_GATEWAY) {
            status = HttpStatus.BAD_GATEWAY;
        }
        String code = ex.getErrorCode() != null ? ex.getErrorCode() : toErrorCode(status);
        log.warn("ExternalApiException: status={}, message={}", status.value(), ex.getMessage());
        return ResponseEntity.status(status).body(new ErrorResponse(code, ex.getMessage()));
    }

    @ExceptionHandler(HyobeeException.class)
    public ResponseEntity<ErrorResponse> handleHyobee(HyobeeException ex) {
        HttpStatus status = resolveStatus(ex.getErrorCode());
        String code = toErrorCode(status);
        log.warn("HyobeeException: status={}, message={}", status.value(), ex.getMessage());
        return ResponseEntity.status(status).body(new ErrorResponse(code, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .filter(m -> m != null && !m.isEmpty())
                .collect(Collectors.joining(" "));
        if (message.isEmpty()) {
            message = "요청이 유효하지 않습니다";
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("BAD_REQUEST", message));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraint(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(" "));
        if (message.isEmpty()) {
            message = "요청이 유효하지 않습니다";
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("BAD_REQUEST", message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex) {
        log.error("Unexpected katsubot API error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("INTERNAL_ERROR", "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."));
    }

    private static HttpStatus resolveStatus(String errorCode) {
        if (errorCode == null) {
            return HttpStatus.BAD_REQUEST;
        }
        try {
            int code = Integer.parseInt(errorCode);
            HttpStatus resolved = HttpStatus.resolve(code);
            return resolved != null ? resolved : HttpStatus.BAD_REQUEST;
        } catch (NumberFormatException ignored) {
            return HttpStatus.BAD_REQUEST;
        }
    }

    private static String toErrorCode(HttpStatus status) {
        if (status == HttpStatus.UNAUTHORIZED) {
            return "UNAUTHORIZED";
        }
        if (status == HttpStatus.FORBIDDEN) {
            return "FORBIDDEN";
        }
        if (status == HttpStatus.NOT_FOUND) {
            return "NOT_FOUND";
        }
        if (status == HttpStatus.BAD_REQUEST) {
            return "BAD_REQUEST";
        }
        if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
            return "INTERNAL_ERROR";
        }
        return String.valueOf(status.value());
    }
}
