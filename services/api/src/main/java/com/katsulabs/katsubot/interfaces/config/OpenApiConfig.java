package com.katsulabs.katsubot.interfaces.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI katsubotOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Katsubot chat-api")
                        .version("0.2.0")
                        .description("""
                                browser ↔ chat-api REST/SSE 계약.
                                RAG outbound 경로는 `docs/modernization/api-path-inventory.md` 참고.
                                """))
                .addServersItem(new Server().url("http://localhost:8081").description("로컬 chat-api"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("레거시 SSO/JWT 브릿지 — docs/auth-bridge.md")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
