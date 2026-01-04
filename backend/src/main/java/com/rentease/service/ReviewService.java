package com.rentease.service;

import com.rentease.model.Review;
import com.rentease.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // Add review
    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    // Get reviews for product
    public List<Review> getReviewsByProduct(String productId) {

        return reviewRepository.findByProductId(productId);
    }

    public List<Review> getReviewsForProduct(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    public double getAverageRating(String productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        if (reviews.isEmpty()) return 0;
        return reviews.stream().mapToInt(Review::getRating).average().orElse(0);
    }

}
