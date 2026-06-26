package com.katsulabs.chatbot.interfaces.config;

import com.katsulabs.chatbot.infrastructure.auth.AuthProperties;
import com.katsulabs.chatbot.infrastructure.auth.BearerAuthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {

    @Bean
    FilterRegistrationBean<BearerAuthFilter> bearerAuthFilterRegistration(BearerAuthFilter filter) {
        var registration = new FilterRegistrationBean<>(filter);
        registration.setOrder(1);
        return registration;
    }
}
