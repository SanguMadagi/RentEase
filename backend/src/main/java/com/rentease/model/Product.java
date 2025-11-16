package com.rentease.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    private String id;

    private String name;
    private String description;
    private double price;

    private double latitude;
    private double longitude;
    private String locationName; // e.g., "Bangalore, Karnataka"

    private List<String> images; // Base64 encoded images or image URLs

    private String lenderId;  // User ID of the lender
    
    @Builder.Default
    private boolean available = true;
}
