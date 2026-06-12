package xs.aichat.v2.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.lang.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import xs.aichat.v2.annotation.LoggedInUser;
import xs.aichat.v2.dto.User;
import xs.aichat.service.HyobeeJwtTokenService;
import xs.aichat.v2.exception.HyobeeException;
import xs.aichat.v2.service.ChatUserResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Component
@RequiredArgsConstructor
public class LoggedInUserArgumentResolver implements HandlerMethodArgumentResolver {

    private static final String SESSION_JWT_ATTRIBUTE = "jwt";
    private static final String SESSION_USER_ID_ATTRIBUTE = "USER_ID";

    private final HyobeeJwtTokenService hyobeeJwtTokenService;

    private final ChatUserResolver chatUserResolver;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(LoggedInUser.class)
                && User.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(@NonNull MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {

        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
        if (request == null) {
            return null;
        }

        HttpSession session = request.getSession(false);
        if (session == null) {
            return null;
        }

        String userId = (String) session.getAttribute(SESSION_USER_ID_ATTRIBUTE);
        if (userId != null && !userId.isBlank()) {
            return chatUserResolver.requireById(userId);
        }

        String token = (String) session.getAttribute(SESSION_JWT_ATTRIBUTE);
        if (token == null || token.isBlank()) {
            throw new HyobeeException(HttpStatus.UNAUTHORIZED.toString(), "???????????????.");
        }

        Claims claims;
        try {
            claims = hyobeeJwtTokenService.validateToken(token);
        } catch (JwtException e) {
            throw new HyobeeException(HttpStatus.UNAUTHORIZED.toString(), "????????? ???? ??????????");
        }

        userId = claims.getSubject();
        if (userId == null || userId.isBlank()) {
            throw new HyobeeException(HttpStatus.UNAUTHORIZED.toString(), "????????????????? ??????????.");
        }
        session.setAttribute(SESSION_USER_ID_ATTRIBUTE, userId);
        return chatUserResolver.requireById(userId);
    }
}
