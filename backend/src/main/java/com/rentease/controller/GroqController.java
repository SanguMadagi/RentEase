package com.rentease.controller;

import com.rentease.model.Product;
import com.rentease.model.ProductSearchQuery;
import com.rentease.model.Review;
import com.rentease.payload.ChatRequest;
import com.rentease.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Controller for AI features using Groq API (free)
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GroqController {

    private final GroqService groqService;
    private final ImageDetectService imageDetectService;
    private final AiService aiService;
    private final ProductService productService;
    private final ReviewService reviewService;

    /**
     * Generate product description from keywords
     * POST /api/ai/product-description
     */
    @PostMapping("/product-description")
    public Mono<ResponseEntity<Map<String, String>>> generateProductDescription(
            @RequestBody Map<String, String> request) {
        String keywords = request.getOrDefault("keywords", "");

        if (keywords.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Keywords are required");
            return Mono.just(ResponseEntity.badRequest().body(error));
        }

        return groqService.generateProductDescription(keywords)
                .map(description -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("description", description);
                    return ResponseEntity.ok(response);
                })
                .onErrorReturn(ResponseEntity.status(500).body(Map.of("error", "Failed to generate description")));
    }

    /**
     * Clean and format address
     * POST /api/ai/clean-address
     */
    @PostMapping("/clean-address")
    public Mono<ResponseEntity<Map<String, String>>> cleanAddress(@RequestBody Map<String, String> request) {
        String rawAddress = request.getOrDefault("address", "");
        if (rawAddress.isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().body(Map.of("error", "Address is required")));
        }

        return groqService.cleanAddressSimple(rawAddress)
                .map(cleaned -> ResponseEntity.ok(Map.of("cleanedAddress", cleaned)))
                .onErrorReturn(ResponseEntity.status(500).body(Map.of("error", "Failed to clean address")));
    }


//    public Mono<ResponseEntity<Map<String, String>>> cleanAddress(
//            @RequestBody Map<String, String> request) {
//        String rawAddress = request.getOrDefault("address", "");
//
//        if (rawAddress.isEmpty()) {
//            Map<String, String> error = new HashMap<>();
//            error.put("error", "Address is required");
//            return Mono.just(ResponseEntity.badRequest().body(error));
//        }
//
//        return groqService.cleanAddress(rawAddress)
//                .map(cleanedAddress -> {
//                    Map<String, String> response = new HashMap<>();
//                    response.put("cleanedAddress", cleanedAddress);
//                    return ResponseEntity.ok(response);
//                })
//                .onErrorReturn(ResponseEntity.status(500).body(Map.of("error", "Failed to clean address")));
//    }

    /**
     * Detect spam or inappropriate content
     * POST /api/ai/spam-detect
     */
    @PostMapping("/spam-detect")
    public Mono<ResponseEntity<Map<String, Object>>> detectSpam(
            @RequestBody Map<String, String> request) {
        String text = request.getOrDefault("text", "");

        if (text.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Text is required");
            return Mono.just(ResponseEntity.badRequest().body(error));
        }

        return groqService.detectSpam(text)
                .map(result -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("isSpam", result.equals("SPAM"));
                    response.put("result", result);
                    return ResponseEntity.ok(response);
                })
                .onErrorReturn(ResponseEntity.status(500).body(Map.of("error", "Failed to detect spam")));
    }

    /**
     * Generate semantic search query
     * POST /api/ai/search
     */
    @PostMapping("/search")
    public Mono<ResponseEntity<Map<String, Object>>> semanticSearch(
            @RequestBody Map<String, String> request) {
        String userQuery = request.getOrDefault("query", "");

        if (userQuery.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Query is required");
            return Mono.just(ResponseEntity.badRequest().body(error));
        }

        return groqService.semanticSearchQuery(userQuery)
                .map(searchQuery -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("searchQuery", searchQuery);
                    // Try to parse JSON if possible
                    try {
                        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                        Map<?, ?> parsed = mapper.readValue(searchQuery, Map.class);
                        response.put("parsed", parsed);
                    } catch (Exception e) {
                        // Keep as string if not valid JSON
                    }
                    return ResponseEntity.ok(response);
                })
                .onErrorReturn(ResponseEntity.status(500).body(Map.of("error", "Failed to process search query")));
    }

    /**
     * Detect product from image
     * POST /api/ai/image-detect
     */
    @PostMapping("/image-detect")
    public Mono<ResponseEntity<Map<String, String>>> detectImage(
            @RequestBody Map<String, String> request) {
        String base64Image = request.getOrDefault("image", "");

        if (base64Image.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Image is required");
            return Mono.just(ResponseEntity.badRequest().body(error));
        }

        return imageDetectService.detectProductImage(base64Image)
                .map(productName -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("productName", productName);
                    response.put("suggestion", "Suggested product: " + productName);
                    return ResponseEntity.ok(response);
                })
                .onErrorReturn(ResponseEntity.status(500).body(Map.of("error", "Failed to detect product")));
    }

    /**
     * Chat endpoint for AI chatbot
     * POST /api/ai/chat
     */
    @PostMapping("/chat")


    public Mono<ResponseEntity<Map<String, Object>>> chat(
            @RequestBody Map<String, Object> request) {
        String debugId = UUID.randomUUID().toString();

        @SuppressWarnings("unchecked")
        java.util.List<Map<String, String>> messages = (java.util.List<Map<String, String>>) request.get("messages");

        if (messages == null || messages.isEmpty()) {
            Map<String, Object> result = new HashMap<>();
            result.put("response", "I'm here to help! What would you like to know about RentEase?");
            return Mono.just(ResponseEntity.ok(result));
        }

        // Get the last user message
        String lastUserMessage = messages.stream()
                .filter(m -> "user".equals(m.get("role")))
                .reduce((first, second) -> second)
                .map(m -> m.get("content"))
                .orElse("");

        if (lastUserMessage == null || lastUserMessage.trim().isEmpty()) {
            Map<String, Object> result = new HashMap<>();
            result.put("response", "It looks like you didn't type anything. What product are you looking for?");
            return Mono.just(ResponseEntity.ok(result));
        }

        // Use llama3-70b-8192 for chat
        return groqService.callGroqAPI("llama3-70b-8192", lastUserMessage.trim())
                .map(response -> {
                    Map<String, Object> result = new HashMap<>();
                    // Ensure response is never null or empty
                    if (response == null || response.trim().isEmpty()) {
                        result.put("response", "I'm here to help you with RentEase! You can ask me about finding products, using the app, or anything else related to renting items.");
                    } else {
                        result.put("response", response);
                    }
                    return ResponseEntity.ok(result);
                })
                .onErrorResume(error -> {
                    // Log error for developers
                    System.err.println("Chat endpoint error: " + error.getMessage() + " [debugId: " + debugId + "]");
                    // Return user-friendly message with standardized format
                    Map<String, Object> result = new HashMap<>();
                    result.put("userMessage", "I'm having trouble right now. Please try again in a moment.");
                    result.put("suggestion", "Try a simpler query or check your connection.");
                    result.put("debugId", debugId);
                    return Mono.just(ResponseEntity.ok(result));
                });
    }
}
