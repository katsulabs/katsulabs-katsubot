package xs.aichat.v2.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class HyobeeWebConfig implements WebMvcConfigurer {

    private final RequestBindingArgumentResolver requestBindingArgumentResolver;

    private final LoggedInUserArgumentResolver loggedInUserArgumentResolver;

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(requestBindingArgumentResolver);
        resolvers.add(loggedInUserArgumentResolver);
    }
}

