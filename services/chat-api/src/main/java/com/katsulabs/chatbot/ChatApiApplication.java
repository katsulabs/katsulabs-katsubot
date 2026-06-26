package com.katsulabs.chatbot;

import com.katsulabs.chatbot.infrastructure.legacy.LegacyBridgeProperties;
import com.katsulabs.chatbot.infrastructure.rag.RagServiceProperties;
import com.katsulabs.chatbot.infrastructure.auth.AuthProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({RagServiceProperties.class, AuthProperties.class, LegacyBridgeProperties.class})
public class ChatApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatApiApplication.class, args);
    }
}
