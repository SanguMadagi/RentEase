package com.rentease.controller;

import com.rentease.payload.LoginRequest;
import com.rentease.payload.RegisterRequest;
import com.rentease.payload.JwtResponse;
import com.rentease.payload.OtpRequest;
import com.rentease.service.UserService;
import com.rentease.service.OtpService;
import com.rentease.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final OtpService otpService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtils;

    // Send OTP for login or registration
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest request) {
        try {
            String purpose = request.getPurpose() != null ? request.getPurpose().toUpperCase() : "LOGIN";

            if (purpose.equals("REGISTER") && userService.getUserByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already registered. Please login instead."));
            }

            // For REGISTER, check if email already exists
            if (purpose.equals("REGISTER") && userService.getUserByEmail(request.getEmail()).isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Email already registered. Please login instead.");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // For LOGIN, check if user exists
            if (purpose.equals("LOGIN") && userService.getUserByEmail(request.getEmail()).isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Email not registered. Please register first.");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            boolean sent = otpService.sendOtp(request.getEmail(), purpose);
            if (sent) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "OTP sent to your email");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Failed to send OTP. Please try again after a minute.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // Verify OTP and login/register
//    @PostMapping("/verify-otp")
//    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
//        try {
//            String purpose = request.getPurpose() != null ? request.getPurpose().toUpperCase() : "LOGIN";
//
//            if (request.getOtp() == null || request.getOtp().isEmpty()) {
//                Map<String, String> errorResponse = new HashMap<>();
//                errorResponse.put("message", "OTP is required");
//                return ResponseEntity.badRequest().body(errorResponse);
//            }
//
//            // Verify OTP
//            boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp(), purpose);
//
//            if (!isValid) {
//                Map<String, String> errorResponse = new HashMap<>();
//                errorResponse.put("message", "Invalid or expired OTP");
//                return ResponseEntity.status(401).body(errorResponse);
//            }
//
//            String token;
//            if (purpose.equals("REGISTER")) {
//                // Register new user
//                if (request.getName() == null || request.getName().isEmpty()) {
//                    Map<String, String> errorResponse = new HashMap<>();
//                    errorResponse.put("message", "Name is required for registration");
//                    return ResponseEntity.badRequest().body(errorResponse);
//                }
//                token = userService.register(request.getEmail(), request.getName());
//            } else {
//                // Login existing user
//                token = userService.login(request.getEmail());
//            }
//
//            return ResponseEntity.ok(new JwtResponse(token));
//        } catch (Exception e) {
//            Map<String, String> errorResponse = new HashMap<>();
//            errorResponse.put("message", "Error: " + e.getMessage());
//            return ResponseEntity.status(500).body(errorResponse);
//        }
//    }
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
        try {
            String purpose = request.getPurpose() != null ? request.getPurpose().toUpperCase() : "LOGIN";

            if (request.getOtp() == null || request.getOtp().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "OTP is required"));
            }

            // Verify OTP
            boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp(), purpose);
            if (!isValid) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired OTP"));
            }

            // REGISTER: only verify OTP, no user creation
            if (purpose.equals("REGISTER")) {
                return ResponseEntity.ok(Map.of(
                        "message", "OTP verified successfully",
                        "verified", true
                ));
            }

            // LOGIN: generate token immediately
            String token = userService.login(request.getEmail());

            return ResponseEntity.ok(Map.of(
                    "message", "OTP verified successfully",
                    "verified", true,
                    "token", token
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String name = payload.get("name");
            String password = payload.get("password");

            if (email == null || name == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "email, name and password are required"));
            }

            // Check if user already exists — block duplicate
            if (userService.getUserByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "User already exists"));
            }

            // Create user with password
            String token = userService.registerWithPassword(email, name, password);

            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful",
                    "token", token
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }
    }


    // Legacy password-based register (kept for backward compatibility)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String token = userService.register(request);
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Legacy password-based login (kept for backward compatibility)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            Set<String> roles = userService.getRolesByEmail(userDetails.getUsername());

            String jwt = jwtUtils.generateToken(userDetails.getUsername(), roles);
            return ResponseEntity.ok(new JwtResponse(jwt));
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(400).body(errorResponse); // always JSON
        }

    }

    /**
     * Logout endpoint
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            // Clear security context
            SecurityContextHolder.clearContext();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Logged out successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("userMessage", "Something went wrong during logout. Please try again.");
            errorResponse.put("debugId", UUID.randomUUID().toString());
            System.err.println("Logout error: " + e.getMessage() + " [debugId: " + errorResponse.get("debugId") + "]");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Update last activity timestamp
     * POST /api/auth/update-activity
     */
    @PostMapping("/update-activity")
    public ResponseEntity<?> updateActivity(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("userMessage", "Authentication required.");
                errorResponse.put("debugId", UUID.randomUUID().toString());
                return ResponseEntity.status(401).body(errorResponse);
            }

            String token = authHeader.substring(7);
            String email = jwtUtils.extractUsername(token);
            Set<String> roles = jwtUtils.extractRoles(token);
            
            // Generate new token with updated lastActivity
            String newToken = jwtUtils.generateToken(email, roles);
            
            Map<String, String> response = new HashMap<>();
            response.put("token", newToken);
            response.put("message", "Activity updated");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("userMessage", "Failed to update activity. Please try again.");
            errorResponse.put("debugId", UUID.randomUUID().toString());
            System.err.println("Update activity error: " + e.getMessage() + " [debugId: " + errorResponse.get("debugId") + "]");
            return ResponseEntity.status(500).body(errorResponse);
        }




    }
    // Allow FORGOT as a purpose in sendOtp (if you prefer to keep validation centralized,
// add FORGOT to the earlier allowed list — shown here as a helper endpoint)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody OtpRequest request) {
        try {
            String email = request.getEmail();
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            // ensure user exists
            if (userService.getUserByEmail(email).isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email not registered."));
            }
            boolean sent = otpService.sendOtp(email, "FORGOT");
            if (sent) return ResponseEntity.ok(Map.of("message", "OTP sent to your email for password reset"));
            else return ResponseEntity.status(500).body(Map.of("message", "Failed to send OTP. Try again later"));
        }catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(400).body(errorResponse); // always JSON
        }

    }
    /**
     * Reset password with email + otp + newPassword.
     * Body: { "email": "...", "otp": "...", "newPassword": "..." }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String otp = payload.get("otp");
            String newPassword = payload.get("newPassword");
            String confirmPassword = payload.get("confirmPassword"); // optional check

            if (email == null || otp == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "email, otp and newPassword are required"));
            }
            if (confirmPassword != null && !newPassword.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Passwords do not match"));
            }

            boolean verified = otpService.verifyOtp(email, otp, "FORGOT");
            if (!verified) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired OTP"));
            }

            // Delegate password update to userService (implement/update this method)
            userService.updatePassword(email, newPassword);

            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        }catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(400).body(errorResponse); // always JSON
        }
    }
}
