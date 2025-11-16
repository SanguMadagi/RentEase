package com.rentease.controller;

import com.rentease.model.User;
import com.rentease.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // email stored in Authentication principal

        return userService.getUserByEmail(email)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(user))
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            Optional<User> userOpt = userService.getUserByEmail(email);
            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(404).body(error);
            }

            User user = userOpt.get();

            // Update fields if provided
            if (updates.containsKey("username")) {
                user.setUsername((String) updates.get("username"));
            }
            if (updates.containsKey("phone")) {
                user.setPhone((String) updates.get("phone"));
            }
            if (updates.containsKey("profilePicture")) {
                user.setProfilePicture((String) updates.get("profilePicture"));
            }
            if (updates.containsKey("address")) {
                user.setAddress((String) updates.get("address"));
            }
            if (updates.containsKey("city")) {
                user.setCity((String) updates.get("city"));
            }
            if (updates.containsKey("state")) {
                user.setState((String) updates.get("state"));
            }
            if (updates.containsKey("pincode")) {
                user.setPincode((String) updates.get("pincode"));
            }

            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating profile: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/verify-aadhaar")
    public ResponseEntity<?> verifyAadhaar(@RequestBody Map<String, String> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            String aadhaarNumber = request.get("aadhaarNumber");
            if (aadhaarNumber == null || aadhaarNumber.length() != 12 || !aadhaarNumber.matches("\\d{12}")) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid Aadhaar number. Must be 12 digits.");
                return ResponseEntity.badRequest().body(error);
            }

            // In production, this would call UIDAI API for verification
            // For demo, we'll just validate format and mark as verified
            User user = userService.verifyAadhaar(email, aadhaarNumber);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Aadhaar verified successfully");
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error verifying Aadhaar: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
