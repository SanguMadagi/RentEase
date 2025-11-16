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
            
            if (!purpose.equals("LOGIN") && !purpose.equals("REGISTER")) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Purpose must be LOGIN or REGISTER");
                return ResponseEntity.badRequest().body(errorResponse);
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
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
        try {
            String purpose = request.getPurpose() != null ? request.getPurpose().toUpperCase() : "LOGIN";
            
            if (request.getOtp() == null || request.getOtp().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "OTP is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Verify OTP
            boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp(), purpose);
            
            if (!isValid) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid or expired OTP");
                return ResponseEntity.status(401).body(errorResponse);
            }

            String token;
            if (purpose.equals("REGISTER")) {
                // Register new user
                if (request.getName() == null || request.getName().isEmpty()) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("message", "Name is required for registration");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
                token = userService.register(request.getEmail(), request.getName());
            } else {
                // Login existing user
                token = userService.login(request.getEmail());
            }

            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
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
            return ResponseEntity.status(401).body("Error: Invalid email or password");
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
}
