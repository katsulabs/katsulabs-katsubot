package xs.aichat.v2.config;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import xs.aichat.v2.dto.wrapper.ApiResponse;
import xs.aichat.v2.dto.wrapper.JsonDataWrapper;
import xs.core.utility.XtrmCmmnUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestControllerAdvice(basePackages = "xs.aichat.v2.controller")
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if (body instanceof SseEmitter) {
            return body;
        }
        if (body instanceof ResponseEntity) {
            return body;
        }
        // 컨트롤러가 이미 JsonDataWrapper를 반환한 경우: 헤더만 보정 후 그대로 반환 (List 직렬화 컨버터 방지)
        if (body instanceof JsonDataWrapper) {
            Object inner = ((JsonDataWrapper<?>) body).getJsonData();
            if (inner instanceof ApiResponse) {
                ApiResponse<?> innerResp = (ApiResponse<?>) inner;
                innerResp.setHeader(mergeHeader(innerResp.getHeader(), request));
            }
            return body;
        }

        ApiResponse.Header header = buildHeader(request);
        ApiResponse<?> apiResponse;

        if (body == null) {
            apiResponse = new ApiResponse<>(header, Collections.emptyList());
        } else if (body instanceof ApiResponse) {
            apiResponse = (ApiResponse<?>) body;
            apiResponse.setHeader(mergeHeader(apiResponse.getHeader(), request));
        } else if (body instanceof Collection) {
            apiResponse = new ApiResponse<>(header, new ArrayList<>((Collection<?>) body));
        } else {
            apiResponse = new ApiResponse<>(header, Collections.singletonList(body));
        }

        return new JsonDataWrapper<>(apiResponse);
    }

    private ApiResponse.Header buildHeader(ServerHttpRequest request) {
        String currentDt = XtrmCmmnUtil.getFormatDateTime();
        String requestId = resolveRequestId(request);
        return new ApiResponse.Header(false, "", "", currentDt, requestId);
    }

    /**
     * 컨트롤러가 세팅한 페이징 등 HEADER 필드는 유지하고, CURRENT_DT / REQUEST_ID 만 갱신한다.
     */
    private ApiResponse.Header mergeHeader(ApiResponse.Header existing, ServerHttpRequest request) {
        ApiResponse.Header generated = buildHeader(request);
        if (existing == null) {
            return generated;
        }
        ApiResponse.Header merged = new ApiResponse.Header();
        merged.setErrorFlag(existing.isErrorFlag());
        merged.setErrorCode(existing.getErrorCode() != null ? existing.getErrorCode() : generated.getErrorCode());
        merged.setErrorMsg(existing.getErrorMsg() != null ? existing.getErrorMsg() : generated.getErrorMsg());
        merged.setCurrentDt(generated.getCurrentDt());
        merged.setRequestId(generated.getRequestId());
        merged.setNumberOfElements(existing.getNumberOfElements());
        merged.setTotalElements(existing.getTotalElements());
        merged.setPageNumber(existing.getPageNumber());
        merged.setPageSize(existing.getPageSize());
        return merged;
    }

    private String resolveRequestId(ServerHttpRequest request) {
        if (request instanceof ServletServerHttpRequest) {
            HttpServletRequest servletRequest = ((ServletServerHttpRequest) request).getServletRequest();
            Object attr = servletRequest.getAttribute("REQUEST_ID");
            if (attr != null) {
                return attr.toString();
            }
        }
        String headerId = request.getHeaders().getFirst("X-Request-Id");
        return headerId != null ? headerId : "";
    }
}
