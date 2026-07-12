package com.rentease.controller;

import com.rentease.model.Product;
import com.rentease.model.ProductSearchQuery;
import com.rentease.model.User;
import com.rentease.service.ProductService;
import com.rentease.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            log.info("POST /api/products called");
            // Get current user from JWT
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(error);
            }
            
            String email = auth.getName();
            log.info("User email: {}", email);
            Optional<User> userOpt = userService.getUserByEmail(email);
            
            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(404).body(error);
            }
            
            // Set lenderId from current user
            product.setLenderId(userOpt.get().getId());
            product.setAvailable(true);
            
            log.info("Adding product: {}", product.getName());
            Product savedProduct = productService.addProduct(product);
            log.info("Product saved with ID: {}", savedProduct.getId());
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            log.error("ERROR in addProduct: {}: {}", e.getClass().getName(), e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestBody ProductSearchQuery query) {
        List<Product> products = productService.findProductsByQuery(query);
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
        Product updated = productService.updateProduct(id, product);
        if(updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable String id) {
        boolean deleted = productService.deleteProduct(id);
        if(deleted) return ResponseEntity.ok("Deleted successfully");
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) Double userLat,
            @RequestParam(required = false) Double userLon
    ) {
        try {
            log.info("GET /api/products called with userLat={}, userLon={}", userLat, userLon);
            List<Product> products;
            if (userLat != null && userLon != null) {
                log.info("Calling getAllProductsSortedByDistance");
                products = productService.getAllProductsSortedByDistance(userLat, userLon);
            } else {
                log.info("Calling getAllProducts");
                products = productService.getAllProducts();
            }
            log.info("Found {} products", products.size());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("ERROR in getAllProducts: {}: {}", e.getClass().getName(), e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching products: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable String id) {
        try {
            Optional<Product> productOpt = productService.getProductById(id);
            if (productOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Product not found");
                return ResponseEntity.status(404).body(error);
            }

            Product product = productOpt.get();
            
            // Get owner information if lenderId exists
            if (product.getLenderId() != null) {
                Optional<User> ownerOpt = userService.getUserById(product.getLenderId());
                if (ownerOpt.isPresent()) {
                    User owner = ownerOpt.get();
                    Map<String, Object> response = new HashMap<>();
                    Map<String, Object> ownerInfo = new HashMap<>();
                    ownerInfo.put("id", owner.getId() != null ? owner.getId() : "");
                    ownerInfo.put("username", owner.getUsername() != null ? owner.getUsername() : "");
                    ownerInfo.put("email", owner.getEmail() != null ? owner.getEmail() : "");
                    ownerInfo.put("phone", owner.getPhone() != null ? owner.getPhone() : "");
                    response.put("product", product);
                    response.put("owner", ownerInfo);
                    return ResponseEntity.ok(response);
                }
            }
            
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching product: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    @GetMapping("/my-products")
    public ResponseEntity<?> getMyProducts() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            Optional<User> userOpt = userService.getUserByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }

            List<Product> products = productService.getProductsByLenderId(userOpt.get().getId());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching products: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double userLat,
            @RequestParam(required = false) Double userLon,
            @RequestParam(required = false) Double latMin,
            @RequestParam(required = false) Double latMax,
            @RequestParam(required = false) Double lonMin,
            @RequestParam(required = false) Double lonMax
    ) {
        try {
            if(name != null) {
                return ResponseEntity.ok(productService.searchProductsByName(name, userLat, userLon));
            } else if(latMin != null && latMax != null && lonMin != null && lonMax != null) {
                return ResponseEntity.ok(productService.searchProductsByLocation(latMin, latMax, lonMin, lonMax));
            } else {
                return ResponseEntity.badRequest().body("Invalid search parameters");
            }
        } catch (Exception e) {
            log.error("ERROR in searchProducts: {}: {}", e.getClass().getName(), e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error searching products: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
