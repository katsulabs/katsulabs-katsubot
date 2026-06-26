package xs.aichat.v2.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Global query-parameter binder for aichat v2 controllers.
 * Maps snake_case query keys to camelCase DTO fields.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class RequestBindingArgumentResolver implements HandlerMethodArgumentResolver {

    private final ObjectMapper objectMapper;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        Class<?> parameterType = parameter.getParameterType();

        if (BeanUtils.isSimpleProperty(parameterType)) {
            return false;
        }
        if (parameterType.isArray() || Map.class.isAssignableFrom(parameterType)) {
            return false;
        }
        if (parameter.hasParameterAnnotation(RequestBody.class)
                || parameter.hasParameterAnnotation(RequestParam.class)
                || parameter.hasParameterAnnotation(PathVariable.class)
                || parameter.hasParameterAnnotation(RequestHeader.class)
                || parameter.hasParameterAnnotation(RequestPart.class)
                || parameter.hasParameterAnnotation(CookieValue.class)
                || parameter.hasParameterAnnotation(MatrixVariable.class)
                || parameter.hasParameterAnnotation(ModelAttribute.class)) {
            return false;
        }

        String packageName = parameterType.getPackage() != null ? parameterType.getPackage().getName() : "";
        return packageName.startsWith("xs.aichat.v2.dto.internal");
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory) {

        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
        if (request == null) {
            return null;
        }

        Map<String, Object> normalized = new LinkedHashMap<>();
        request.getParameterMap().forEach((key, values) -> {
            Object value = values == null ? null : (values.length == 1 ? values[0] : values);
            normalized.put(key, value);
            normalized.putIfAbsent(toCamelCase(key), value);
        });

        try {
            return objectMapper.convertValue(normalized, parameter.getParameterType());
        } catch (IllegalArgumentException e) {
            String targetType = parameter.getParameterType().getName();
            String requestUri = request.getRequestURI();

            log.error(
                    "RequestBindingArgumentResolver failed: uri={}, targetType={}, queryKeys={}, rawQuery={}",
                    requestUri,
                    targetType,
                    normalized.keySet(),
                    request.getQueryString(),
                    e
            );

            throw new IllegalArgumentException(
                    "Failed to bind query parameters to " + targetType
                            + " for request [" + requestUri + "]. Check DTO constructor/setter and parameter names.",
                    e
            );
        }
    }

    private String toCamelCase(String key) {
        StringBuilder sb = new StringBuilder();
        boolean upperNext = false;
        for (int i = 0; i < key.length(); i++) {
            char c = key.charAt(i);
            if (c == '_') {
                upperNext = true;
                continue;
            }
            if (upperNext) {
                sb.append(Character.toUpperCase(c));
                upperNext = false;
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
