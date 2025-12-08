package com.taskflow.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@ConfigurationProperties(prefix = "application.security.jwt")
@Data
public class JwtProperties {
    private String secretKey;
    private long expiration;
}
