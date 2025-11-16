package com.rentease.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

/**
 * Service for image detection using HuggingFace Inference API
 * Uses free model: vit-base-patch16-224 (no API key required for public models)
 */
@Service
public class ImageDetectService {

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ImageDetectService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }
    
    // Note: objectMapper is used in detectProductImage method

    private static final String HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/google/vit-base-patch16-224";

    /**
     * Detect product type from base64 image
     * Returns product label/category
     */
    public Mono<String> detectProductImage(String base64Image) {
        // Remove data URL prefix if present
        String imageData = base64Image;
        if (base64Image.contains(",")) {
            imageData = base64Image.split(",")[1];
        }

        WebClient webClient = webClientBuilder
                .baseUrl(HUGGINGFACE_API_URL)
                .defaultHeader("Content-Type", "application/json")
                .build();

        // HuggingFace expects base64 image in JSON format
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("inputs", imageData);

        return webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    try {
                        JsonNode jsonNode = objectMapper.readTree(response);
                        if (jsonNode.isArray() && jsonNode.size() > 0) {
                            JsonNode firstResult = jsonNode.get(0);
                            if (firstResult.has("label")) {
                                String label = firstResult.get("label").asText();
                                // Clean up label (remove ImageNet prefixes)
                                return cleanLabel(label);
                            }
                        }
                        return "Unknown product";
                    } catch (Exception e) {
                        // Fallback: try to extract any meaningful text
                        return extractProductNameFromResponse(response);
                    }
                })
                .onErrorReturn("Unable to detect product. Please enter manually.");
    }

    /**
     * Clean up ImageNet labels to readable product names
     */
    private String cleanLabel(String label) {
        // Remove common ImageNet prefixes
        label = label.replace("n", "").replaceAll("^\\d+", "");
        
        // Convert to readable format
        label = label.replace("_", " ");
        label = label.substring(0, 1).toUpperCase() + label.substring(1);
        
        // Common product mappings
        Map<String, String> productMap = new HashMap<>();
        productMap.put("mobile phone", "Mobile Phone");
        productMap.put("laptop", "Laptop");
        productMap.put("camera", "Camera");
        productMap.put("bicycle", "Bicycle");
        productMap.put("car", "Vehicle");
        productMap.put("furniture", "Furniture");
        
        return productMap.getOrDefault(label.toLowerCase(), label);
    }

    /**
     * Extract product name from response if JSON parsing fails
     */
    private String extractProductNameFromResponse(String response) {
        // Simple fallback - look for common product keywords
        String lowerResponse = response.toLowerCase();
        if (lowerResponse.contains("phone") || lowerResponse.contains("mobile")) {
            return "Mobile Phone";
        } else if (lowerResponse.contains("laptop") || lowerResponse.contains("computer")) {
            return "Laptop";
        } else if (lowerResponse.contains("camera")) {
            return "Camera";
        } else if (lowerResponse.contains("bicycle") || lowerResponse.contains("bike")) {
            return "Bicycle";
        } else if (lowerResponse.contains("car") || lowerResponse.contains("vehicle")) {
            return "Vehicle";
        }
        return "Product";
    }
}

