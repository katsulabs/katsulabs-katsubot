package com.katsulabs.katsubot.infrastructure.persistence;

import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@Profile("jpa")
@EnableJpaRepositories(basePackages = "com.katsulabs.katsubot.infrastructure.persistence")
@EntityScan(basePackages = "com.katsulabs.katsubot.infrastructure.persistence.entity")
public class JpaConfig {
}
