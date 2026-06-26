package com.katsulabs.chatbot.infrastructure.rag;

import io.micrometer.observation.ObservationRegistry;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    WebClient.Builder webClientBuilder(ObjectProvider<ObservationRegistry> observationRegistry) {
        WebClient.Builder builder = WebClient.builder();
        observationRegistry.ifAvailable(builder::observationRegistry);
        return builder;
    }
}
