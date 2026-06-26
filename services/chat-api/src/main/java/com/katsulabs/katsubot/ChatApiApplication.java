package com.katsulabs.katsubot;

import com.katsulabs.katsubot.infrastructure.legacy.LegacyBridgeProperties;
import com.katsulabs.katsubot.infrastructure.rag.RagServiceProperties;
import com.katsulabs.katsubot.infrastructure.auth.AuthProperties;
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
