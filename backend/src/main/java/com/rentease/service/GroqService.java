package com.rentease.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for Groq AI API integration
 * Uses free models: llama3-70b-8192, gemma2-9b-it, mixtral-8x7b-32768
 */
@Service
@RequiredArgsConstructor
public class GroqService {

    private final WebClient groqWebClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Value("${groq.api-key}")
    private String apiKey;
    /**
     * Clean and structure address text reliably
     */
    public Mono<String> cleanAddressSimple(String rawAddress) {
        String prompt = "Clean this address and return ONLY the properly formatted address " +
                "with street, city, state, and postal code. Do not add extra text:\n" + rawAddress;

        Map<String, Object> requestBody = Map.of(
                "model", "llama-3.1-70b-versatile",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                )
        );

        return groqWebClient.post()
                .uri("/openai/v1/chat/completions")
                .header("Authorization", "Bearer " + this.apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    // Extract AI text from response structure
                    try {
                        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                        if (choices != null && !choices.isEmpty()) {
                            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                            return message.get("content").toString().trim();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return rawAddress; // fallback
                });
    }



    /**
     * Generate product description from keywords
     * Model: "llama-3.1-70b-versatile"
     */
    public Mono<String> generateProductDescription(String keywords) {
        String prompt = String.format(
            "Generate a professional, concise product description for a rental marketplace. " +
            "Product keywords: %s. " +
            "Description should be 2-3 sentences, highlight key features, and be suitable for a peer-to-peer rental platform. " +
            "Do not include pricing or contact information.",
            keywords
        );

        return callGroqAPI("llama-3.1-70b-versatile", prompt);
    }

    /**
     * Clean and structure address text
     * Model: llama3-70b-8192
     */
    public Mono<String> cleanAddress(String rawAddress) {
        String prompt = String.format(
            "Clean and format this address into a well-structured format: %s. " +
            "Return only the cleaned address, properly formatted with street, city, state, and pincode if available. " +
            "Keep it concise and readable.",
            rawAddress
        );

        return callGroqAPI("llama-3.1-70b-versatile", prompt);
    }

    /**
     * Detect spam or inappropriate content
     * Model: gemma2-9b-it
     */
    public Mono<String> detectSpam(String text) {
        String prompt = String.format(
            "Analyze this text for spam, inappropriate content, or policy violations: \"%s\". " +
            "Respond with only 'SPAM' if it's spam/inappropriate, or 'SAFE' if it's acceptable. " +
            "Be strict about offensive language, scams, or misleading information.",
            text
        );

        return callGroqAPI("llama-3.1-8b-instant"
                    , prompt)
                .map(response -> response.toUpperCase().contains("SPAM") ? "SPAM" : "SAFE");
    }

    /**
     * Generate semantic search query from natural language
     * Model: mixtral-8x7b-32768
     */
    public Mono<String> semanticSearchQuery(String userQuery) {
        String prompt = String.format(
            "Convert this natural language search query into optimized search keywords and filters: \"%s\". " +
            "Extract: 1) Product name/keywords, 2) Location if mentioned, 3) Price range if mentioned, 4) Category. " +
            "Return as JSON: {\"keywords\":\"...\",\"location\":\"...\",\"priceMin\":0,\"priceMax\":0,\"category\":\"...\"}. " +
            "If a field is not mentioned, use null.",
            userQuery
        );

        return callGroqAPI("llama-3.1-8b-instant"
                , prompt);
    }

    /**
     * Generic method to call Groq API
     * Made public for chat endpoint
     */
    public Mono<String> callGroqAPI(String model, String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", new Object[]{
            Map.of("role", "user", "content", prompt)
        });
        requestBody.put("temperature", 0.7);
        requestBody.put("max_tokens", 500);

        return groqWebClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    try {
                        JsonNode jsonNode = objectMapper.readTree(response);
                        JsonNode choices = jsonNode.get("choices");
                        if (choices != null && choices.isArray() && choices.size() > 0) {
                            JsonNode message = choices.get(0).get("message");
                            if (message != null && message.has("content")) {
                                String content = message.get("content").asText();
                                // Clean up any error messages in the response
                                if (content != null && !content.isEmpty()) {
                                    return content;
                                }
                            }
                        }
                        // Return a helpful fallback message instead of error
                        return "I'm here to help you with RentEase! You can ask me about finding products, using the app, or anything else related to renting items.";
                    } catch (Exception e) {
                        // Log error for developers but return user-friendly message
                        System.err.println("Error processing Groq API response: " + e.getMessage());
                        return "I'm here to help you with RentEase! You can ask me about finding products, using the app, or anything else related to renting items.";
                    }
                })
                .onErrorResume(error -> {
                    // Log error for developers
                    System.err.println("Error calling Groq API: " + error.getMessage());
                    // Return a helpful fallback message
                    return Mono.just("I'm here to help you with RentEase! You can ask me about finding products, using the app, or anything else related to renting items.");
                });
    }
}

