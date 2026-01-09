package org.example.ktigerstudybe.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Configuration for RestTemplate
 * Required for AIGradingServiceImpl and GroqAIService
 * 
 * ⏱️ TIMEOUT CONFIG:
 * - Connect timeout: 30s (kết nối tới OpenRouter)
 * - Read timeout: 180s (chờ AI xử lý bài dài)
 */
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(30000); // 30s để kết nối
        factory.setReadTimeout(180000);   // 180s để đọc response (essay dài)
        
        return builder
                .setConnectTimeout(Duration.ofSeconds(30))
                .setReadTimeout(Duration.ofSeconds(180))
                .requestFactory(() -> factory)
                .build();
    }
}
