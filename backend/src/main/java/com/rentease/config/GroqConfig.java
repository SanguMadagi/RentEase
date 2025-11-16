package com.rentease.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuration for Groq API integration
 * Uses free Groq API models - no billing required
 */
@Configuration
public class GroqConfig {

    @Value("${groq.api-key}")
    private String groqApiKey;

    private static final String GROQ_API_BASE_URL = "https://api.groq.com/openai/v1";

    @Bean
    public WebClient groqWebClient() {
        if (groqApiKey == null || groqApiKey.isEmpty()) {
            System.err.println("WARNING: GROQ_API_KEY is not set. AI features will not work.");
        }
        return WebClient.builder()
                .baseUrl(GROQ_API_BASE_URL)
                .defaultHeader("Authorization", "Bearer " + (groqApiKey != null ? groqApiKey : ""))
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Bean
    public String groqApiKey() {
        return groqApiKey;
    }
}


