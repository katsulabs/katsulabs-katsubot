package com.katsulabs.katsubot.infrastructure.admindb;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
@ConditionalOnProperty(prefix = "katsubot.admin-db", name = "url")
public class AdminDbConfig {

    @Bean(name = "adminDataSource")
    DataSource adminDataSource(AdminDbProperties properties) {
        var dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(properties.url());
        dataSource.setUsername(properties.username());
        dataSource.setPassword(properties.password());
        dataSource.setMaximumPoolSize(5);
        dataSource.setPoolName("hyobee-admin-db");
        return dataSource;
    }

    @Bean(name = "adminJdbcTemplate")
    JdbcTemplate adminJdbcTemplate(@Qualifier("adminDataSource") DataSource adminDataSource) {
        return new JdbcTemplate(adminDataSource);
    }
}
