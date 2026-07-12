package com.rentease.controller;

import com.rentease.model.Review;
import com.rentease.model.User;
import com.rentease.service.ReviewService;
import com.rentease.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(error);
            }

            String email = auth.getName();
            Optional<User> userOpt = userService.getUserByEmail(email);
            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(404).body(error);
            }

            review.setUserId(userOpt.get().getId());

            Review saved = reviewService.addReview(review);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error adding review: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }
}
