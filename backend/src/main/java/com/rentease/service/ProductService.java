package com.rentease.service;

import com.rentease.model.Product;
import com.rentease.model.ProductSearchQuery;
import com.rentease.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    // Calculate distance between two coordinates using Haversine formula (in km)
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<Product> getProductsByLenderId(String lenderId) {
        return productRepository.findByLenderId(lenderId);
    }

    public List<Product> findProductsByQuery(ProductSearchQuery query) {
        return productRepository.findAll().stream()
                .peek(this::migrateProductCategory)
                .filter(p -> query.getKeywords() == null || p.getName().toLowerCase().contains(query.getKeywords().toLowerCase()))
                .filter(p -> query.getLocation() == null || p.getLocationName().equalsIgnoreCase(query.getLocation()))
                .filter(p -> query.getCategory() == null || query.getCategory().isEmpty() || query.getCategory().equalsIgnoreCase("All")
                        || (p.getCategory() != null && p.getCategory().equalsIgnoreCase(query.getCategory())))
                .filter(p -> query.getPriceMin() == null || p.getPrice() >= query.getPriceMin())
                .filter(p -> query.getPriceMax() == null || p.getPrice() <= query.getPriceMax())
                .collect(Collectors.toList());
    }


    // Get all products sorted by distance from user location
    public List<Product> getAllProductsSortedByDistance(Double userLat, Double userLon) {
        try {
            List<Product> products = productRepository.findAll();
            products.forEach(this::migrateProductCategory);

            if (userLat != null && userLon != null) {
                // Separate products with and without coordinates
                List<ProductWithDistance> withCoords = new ArrayList<>();
                List<Product> withoutCoords = new ArrayList<>();

                for (Product product : products) {
                    try {
                        // Check if product has valid coordinates (not 0,0 which is in the ocean)
                        double lat = product.getLatitude();
                        double lon = product.getLongitude();
                        if (lat != 0.0 && lon != 0.0 && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
                            try {
                                double distance = calculateDistance(userLat, userLon, lat, lon);
                                withCoords.add(new ProductWithDistance(product, distance));
                            } catch (Exception e) {
                                log.error("Error calculating distance for product {}: {}", product.getId(), e.getMessage());
                                // If distance calculation fails, add to withoutCoords
                                withoutCoords.add(product);
                            }
                        } else {
                            // Product doesn't have valid coordinates
                            withoutCoords.add(product);
                        }
                    } catch (Exception e) {
                        log.error("Error processing product: {}", e.getMessage());
                        withoutCoords.add(product);
                    }
                }

                // Sort products with coordinates by distance
                withCoords.sort(Comparator.comparingDouble(ProductWithDistance::getDistance));

                // Combine: products with coordinates (sorted) + products without coordinates
                List<Product> result = new ArrayList<>();
                result.addAll(withCoords.stream().map(ProductWithDistance::getProduct).collect(Collectors.toList()));
                result.addAll(withoutCoords);

                log.info("Returning {} products (withCoords: {}, withoutCoords: {})", result.size(), withCoords.size(), withoutCoords.size());
                return result;
            }

            log.info("Returning {} products (no sorting)", products.size());
            return products;
        } catch (Exception e) {
            // If anything fails, just return all products without sorting
            log.error("ERROR in getAllProductsSortedByDistance: {}: {}", e.getClass().getName(), e.getMessage(), e);
            try {
                return productRepository.findAll();
            } catch (Exception e2) {
                log.error("CRITICAL: Cannot fetch products from repository: {}", e2.getMessage(), e2);
                return new ArrayList<>(); // Return empty list as last resort
            }
        }
    }

    // Search products by name, sorted by distance
    public List<Product> searchProductsByName(String name, Double userLat, Double userLon) {
        try {
            log.info("ProductService.searchProductsByName() called with name={}, userLat={}, userLon={}", name, userLat, userLon);
            List<Product> products = productRepository.findByNameContainingIgnoreCase(name);
            log.info("Repository returned {} products for search: {}", products.size(), name);

            if (userLat != null && userLon != null) {
                List<ProductWithDistance> withCoords = new ArrayList<>();
                List<Product> withoutCoords = new ArrayList<>();

                for (Product product : products) {
                    try {
                        double lat = product.getLatitude();
                        double lon = product.getLongitude();
                        if (lat != 0.0 && lon != 0.0 && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
                            try {
                                double distance = calculateDistance(userLat, userLon, lat, lon);
                                withCoords.add(new ProductWithDistance(product, distance));
                            } catch (Exception e) {
                                log.error("Error calculating distance for product {}: {}", product.getId(), e.getMessage());
                                withoutCoords.add(product);
                            }
                        } else {
                            withoutCoords.add(product);
                        }
                    } catch (Exception e) {
                        log.error("Error processing product in search: {}", e.getMessage());
                        withoutCoords.add(product);
                    }
                }

                withCoords.sort(Comparator.comparingDouble(ProductWithDistance::getDistance));

                List<Product> result = new ArrayList<>();
                result.addAll(withCoords.stream().map(ProductWithDistance::getProduct).collect(Collectors.toList()));
                result.addAll(withoutCoords);

                log.info("Returning {} products from search (withCoords: {}, withoutCoords: {})", result.size(), withCoords.size(), withoutCoords.size());
                return result;
            }

            log.info("Returning {} products from search (no sorting)", products.size());
            return products;
        } catch (Exception e) {
            log.error("ERROR in searchProductsByName: {}: {}", e.getClass().getName(), e.getMessage(), e);
            // Return empty list instead of throwing to prevent 500 errors
            return new ArrayList<>();
        }
    }

    // Helper class to store product with distance
    private static class ProductWithDistance {
        private final Product product;
        private final double distance;

        public ProductWithDistance(Product product, double distance) {
            this.product = product;
            this.distance = distance;
        }

        public Product getProduct() {
            return product;
        }

        public double getDistance() {
            return distance;
        }
    }

    // Add a new product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Update existing product
    public Product updateProduct(String id, Product updatedProduct) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isPresent()) {
            Product prod = existing.get();
            prod.setName(updatedProduct.getName());
            prod.setDescription(updatedProduct.getDescription());
            prod.setPrice(updatedProduct.getPrice());
            prod.setLatitude(updatedProduct.getLatitude());
            prod.setLongitude(updatedProduct.getLongitude());
            prod.setLocationName(updatedProduct.getLocationName());
            prod.setCategory(updatedProduct.getCategory());
            prod.setImages(updatedProduct.getImages());
            prod.setAvailable(updatedProduct.isAvailable());
            return productRepository.save(prod);
        }
        return null;
    }

    // Delete product
    public boolean deleteProduct(String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get all products (legacy - use getAllProductsSortedByDistance instead)
    public List<Product> getAllProducts() {
        try {
            log.info("ProductService.getAllProducts() called");
            List<Product> products = productRepository.findAll();
            products.forEach(this::migrateProductCategory);
            log.info("Repository returned {} products", products.size());
            return products;
        } catch (Exception e) {
            log.error("ERROR in getAllProducts: {}: {}", e.getClass().getName(), e.getMessage(), e);
            // Return empty list instead of throwing to prevent 500 errors
            return new ArrayList<>();
        }
    }

    public List<Product> searchProducts(ProductSearchQuery query, Double userLat, Double userLon, Double maxDistanceKm) {
        return productRepository.findAll().stream()
                .peek(this::migrateProductCategory)
                .filter(Product::isAvailable)
                .filter(p -> query.getKeywords() == null || query.getKeywords().isEmpty()
                        || p.getName().toLowerCase().contains(query.getKeywords().toLowerCase())
                        || (p.getDescription() != null && p.getDescription().toLowerCase().contains(query.getKeywords().toLowerCase())))
                .filter(p -> query.getCategory() == null || query.getCategory().isEmpty() || query.getCategory().equalsIgnoreCase("All")
                        || (p.getCategory() != null && p.getCategory().equalsIgnoreCase(query.getCategory())))
                .filter(p -> query.getPriceMin() == null || p.getPrice() >= query.getPriceMin())
                .filter(p -> query.getPriceMax() == null || p.getPrice() <= query.getPriceMax())
                .filter(p -> userLat == null || userLon == null || maxDistanceKm == null
                        || distanceInKm(userLat, userLon, p.getLatitude(), p.getLongitude()) <= maxDistanceKm)
                .collect(Collectors.toList());
    }

    private double distanceInKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Get product by ID
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    // Search products by name (legacy)
    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // Search products by location (lat/lng range)
    public List<Product> searchProductsByLocation(double latMin, double latMax, double lonMin, double lonMax) {
        return productRepository.findByLatitudeBetweenAndLongitudeBetween(latMin, latMax, lonMin, lonMax);
    }

    // Helper to dynamically infer category for products
    public String inferCategory(String name, String description, String existingCategory) {
        if (existingCategory != null && !existingCategory.trim().isEmpty() && !existingCategory.equalsIgnoreCase("All")) {
            String normalized = normalizeCategory(existingCategory);
            if (normalized != null) return normalized;
        }

        String searchString = ((name != null ? name : "") + " " + (description != null ? description : "")).toLowerCase();

        if (searchString.contains("camera") || searchString.contains("dslr") || searchString.contains("canon")
                || searchString.contains("sony") || searchString.contains("nikon") || searchString.contains("gopro")
                || searchString.contains("lens") || searchString.contains("tripod")) {
            return "Cameras";
        }
        if (searchString.contains("watch") || searchString.contains("wearable") || searchString.contains("smartwatch")
                || searchString.contains("titan") || searchString.contains("rolex") || searchString.contains("fitbit")) {
            return "Wearables";
        }
        if (searchString.contains("laptop") || searchString.contains("computer") || searchString.contains("mobile")
                || searchString.contains("phone") || searchString.contains("headphones") || searchString.contains("speaker")
                || searchString.contains("projector") || searchString.contains("earbuds") || searchString.contains("tv")
                || searchString.contains("television") || searchString.contains("monitor") || searchString.contains("keyboard")
                || searchString.contains("mouse") || searchString.contains("console") || searchString.contains("ipad")
                || searchString.contains("tablet") || searchString.contains("macbook")) {
            return "Electronics";
        }
        if (searchString.contains("bicycle") || searchString.contains("football") || searchString.contains("bike")
                || searchString.contains("sport") || searchString.contains("soccer") || searchString.contains("cricket")
                || searchString.contains("racket") || searchString.contains("tennis") || searchString.contains("helmet")
                || searchString.contains("ball")) {
            return "Sports";
        }
        if (searchString.contains("tent") || searchString.contains("camping") || searchString.contains("backpack")
                || searchString.contains("sleeping bag") || searchString.contains("outdoor")) {
            return "Camping";
        }
        if (searchString.contains("chair") || searchString.contains("table") || searchString.contains("furniture")
                || searchString.contains("desk") || searchString.contains("sofa") || searchString.contains("couch")
                || searchString.contains("bed") || searchString.contains("stool")) {
            return "Furniture";
        }
        if (searchString.contains("mixer") || searchString.contains("appliance") || searchString.contains("blender")
                || searchString.contains("oven") || searchString.contains("microwave") || searchString.contains("fridge")
                || searchString.contains("refrigerator") || searchString.contains("vacuum") || searchString.contains("iron")) {
            return "Home Appliances";
        }

        return "Electronics"; // Default category
    }

    private String normalizeCategory(String category) {
        String cat = category.trim().toLowerCase();
        if (cat.contains("camera")) return "Cameras";
        if (cat.contains("wearable") || cat.contains("watch") || cat.contains("titan")) return "Wearables";
        if (cat.contains("electronic") || cat.contains("laptop") || cat.contains("mobile") || cat.contains("app")) return "Electronics";
        if (cat.contains("sport") || cat.contains("bicycle") || cat.contains("football")) return "Sports";
        if (cat.contains("camp") || cat.contains("tent")) return "Camping";
        if (cat.contains("furnit") || cat.contains("chair") || cat.contains("table")) return "Furniture";
        if (cat.contains("appliance") || cat.contains("mixer")) return "Home Appliances";
        return null;
    }

    private void migrateProductCategory(Product p) {
        if (p.getCategory() == null || p.getCategory().trim().isEmpty()) {
            String category = inferCategory(p.getName(), p.getDescription(), null);
            p.setCategory(category);
            try {
                productRepository.save(p);
            } catch (Exception e) {
                // Ignore silent migration errors
            }
        }
    }
}
