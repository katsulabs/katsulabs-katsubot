package xs.aichat.v2.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import xs.aichat.v2.dto.wrapper.ApiResponse;
import xs.core.utility.XtrmCmmnUtil;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.springframework.validation.BindException;

import java.util.*;
import java.util.stream.Collectors;

/**
 * aichat v2 공통 예외 처리기.
 * HEADER.ERROR_FLAG=true, ERROR_CODE/ERROR_MSG 세팅
 * - 그 외 예외는 HEADER.ERROR_FLAG=true, ERROR_CODE=E500, ERROR_MSG=일반 시스템 오류 메시지
 */
@Slf4j
@RestControllerAdvice(basePackages = "xs.aichat.v2.controller")
public class HyobeeExceptionHandler {

    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleExternalApi(ExternalApiException ex, HttpServletRequest request) {
        log.warn("ExternalApiException: status={}, code={}, message={}, stacktrace={}",
                ex.getHttpStatus(), ex.getErrorCode(), ex.getMessage(), ex.getStackTrace());

        ApiResponse.Header header = new ApiResponse.Header(
                true,
                ex.getErrorCode(),
                ex.getMessage(),
                XtrmCmmnUtil.getFormatDateTime(),
                resolveRequestId(request)
        );
        List<Map<String, Object>> data = new ArrayList<>();
        Map<String, Object> error = new HashMap<>();
        error.put("code", ex.getUpstreamCode() != null ? ex.getUpstreamCode() : ex.getHttpStatus().value());
        error.put("message", ex.getMessage());
        error.put("type", ex.getUpstreamType());
        error.put("stacktrace", Arrays.toString(ex.getStackTrace()));
        data.add(error);
        return ResponseEntity.status(ex.getHttpStatus()).body(new ApiResponse<>(header, data));
    }

    @ExceptionHandler(HyobeeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleBusiness(HyobeeException ex, HttpServletRequest request) {
        log.warn("HyobeeException: code={}, message={}", ex.getErrorCode(), ex.getMessage());

        ApiResponse.Header header = new ApiResponse.Header(
                true,
                ex.getErrorCode(),
                ex.getMessage(),
                XtrmCmmnUtil.getFormatDateTime(),
                resolveRequestId(request)
        );
        return new ApiResponse<>(header, Collections.emptyList());
    }

    /**
     * {@code @Validated} 컨트롤러 + 메서드 파라미터 검증(@Valid 등) 시 발생하는 Bean Validation 예외.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
        String message = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(" "));
        if (message.isEmpty()) {
            message = "입력값을 확인해 주세요.";
        }
        log.warn("ConstraintViolationException: {}", message);

        ApiResponse.Header header = new ApiResponse.Header(
                true,
                String.valueOf(HttpStatus.BAD_REQUEST.value()),
                message,
                XtrmCmmnUtil.getFormatDateTime(),
                resolveRequestId(request)
        );
        return new ApiResponse<>(header, Collections.emptyList());
    }

    /**
     * {@code @RequestBody} + {@code @Valid} 필드 검증 실패.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .filter(m -> m != null && !m.isEmpty())
                .collect(Collectors.joining(" "));
        if (message.isEmpty()) {
            message = ex.getBindingResult().getAllErrors().stream()
                    .map(ObjectError::getDefaultMessage)
                    .filter(m -> m != null && !m.isEmpty())
                    .collect(Collectors.joining(" "));
        }
        if (message.isEmpty()) {
            message = "입력값을 확인해 주세요.";
        }
        log.warn("MethodArgumentNotValidException: {}", message);

        ApiResponse.Header header = new ApiResponse.Header(
                true,
                String.valueOf(HttpStatus.BAD_REQUEST.value()),
                message,
                XtrmCmmnUtil.getFormatDateTime(),
                resolveRequestId(request)
        );
        return new ApiResponse<>(header, Collections.emptyList());
    }

    /**
     * {@code @ModelAttribute} + {@code @Valid} 필드 검증 실패.
     */
    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleBindException(BindException ex, HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .filter(m -> m != null && !m.isEmpty())
                .collect(Collectors.joining(" "));
        if (message.isEmpty()) {
            message = "입력값을 확인해 주세요.";
        }
        log.warn("BindException: {}", message);

        ApiResponse.Header header = new ApiResponse.Header(
                true,
                String.valueOf(HttpStatus.BAD_REQUEST.value()),
                message,
                XtrmCmmnUtil.getFormatDateTime(),
                resolveRequestId(request)
        );
        return new ApiResponse<>(header, Collections.emptyList());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Unexpected exception in aichat v2", ex);

        ApiResponse.Header header = new ApiResponse.Header(
                true,
                String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()),
                "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                XtrmCmmnUtil.getFormatDateTime(),
                resolveRequestId(request)
        );
        return new ApiResponse<>(header, Collections.emptyList());
    }

    private String resolveRequestId(HttpServletRequest request) {
        Object attr = request.getAttribute("REQUEST_ID");
        if (attr != null) {
            return attr.toString();
        }
        String headerId = request.getHeader("X-Request-Id");
        return headerId != null ? headerId : "";
    }
}

