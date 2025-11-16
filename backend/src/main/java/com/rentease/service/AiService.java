package com.rentease.service;

import com.rentease.model.Product;
import com.rentease.model.ProductSearchQuery;
import com.rentease.model.Review;
import com.rentease.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiService {

    @Autowired
    private ProductRepository productRepository;

    // Parse product search queries like "find camera near me under 50"
    public ProductSearchQuery parseSearchQuery(String userMessage) {
        if (userMessage == null || userMessage.isEmpty()) return null;

        String lower = userMessage.toLowerCase();
        ProductSearchQuery query = new ProductSearchQuery();

        // Extract price range
        if (lower.matches(".*under \\d+.*")) {
            String priceStr = lower.replaceAll(".*under (\\d+).*", "$1");
            try { query.setPriceMax(Double.parseDouble(priceStr)); } catch (NumberFormatException ignored) {}
        }
        if (lower.matches(".*over \\d+.*")) {
            String priceStr = lower.replaceAll(".*over (\\d+).*", "$1");
            try { query.setPriceMin(Double.parseDouble(priceStr)); } catch (NumberFormatException ignored) {}
        }

        // Always treat input as keywords
        String keywords = lower.replaceAll("find|search|near|me|under \\d+|over \\d+", "").trim();
        if (keywords.isEmpty()) keywords = lower; // fallback: use whole input
        query.setKeywords(keywords);

        // Optional: detect category/location
        for (String city : List.of("bangalore","mumbai","delhi")) if (lower.contains(city)) query.setLocation(city);
        for (String category : List.of("camera","watch","bike","car")) if (lower.contains(category)) query.setCategory(category);

        return query;
    }



    // Extract product ID if user asks for reviews
    public String extractProductId(String userMessage) {
        if (userMessage == null || userMessage.isEmpty()) return null;

        String lower = userMessage.toLowerCase();
        if (!(lower.contains("review") || lower.contains("ratings"))) return null;

        // Match full product name
        for (Product p : productRepository.findAll()) {
            if (lower.contains(p.getName().toLowerCase())) return p.getId();
        }

        // Partial match (first word)
        for (Product p : productRepository.findAll()) {
            String firstWord = p.getName().split(" ")[0].toLowerCase();
            if (lower.contains(firstWord)) return p.getId();
        }

        return null;
    }

    // Build prompt for AI
    public String buildPrompt(String userMessage, List<String> lastMessages, List<Product> products, List<Review> reviews) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are RentEase AI assistant. Answer user queries concisely.\n");

        if (lastMessages != null) {
            prompt.append("Conversation so far:\n");
            for (String msg : lastMessages) prompt.append("- ").append(msg).append("\n");
        }

        prompt.append("User: ").append(userMessage).append("\n");

        if (products != null && !products.isEmpty()) {
            prompt.append("Nearby products:\n");
            for (Product p : products) {
                prompt.append("- ").append(p.getName())
                        .append(" (").append(p.getDescription() != null ? p.getDescription() : "No category").append(")")
                        .append(" - ₹").append(p.getPrice()).append("\n");
            }
        }

        if (reviews != null && !reviews.isEmpty()) {
            prompt.append("Product reviews:\n");
            for (Review r : reviews) {
                prompt.append("- Rating: ").append(r.getRating())
                        .append(" Comment: ").append(r.getComment()).append("\n");
            }
        }

        prompt.append("Respond concisely, like a friendly assistant.");
        return prompt.toString();
    }
}
