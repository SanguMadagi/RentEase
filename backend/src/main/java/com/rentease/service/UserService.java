package com.rentease.service;

import com.rentease.model.User;
import com.rentease.payload.LoginRequest;
import com.rentease.payload.RegisterRequest;
import com.rentease.repository.UserRepository;
import com.rentease.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class    UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register user (OTP-based, no password required)
    public String register(String email, String name) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(name);
        user.setEmail(email);
        // No password needed for OTP-based auth
        user.setPassword(null);

        Set<String> roles = new HashSet<>();
        roles.add("USER");
        user.setRoles(roles);
        user.setVerified(true); // OTP verification means email is verified

        userRepository.save(user);

        return jwtUtil.generateToken(user.getEmail(), user.getRoles());
    }

    // Register user (legacy password-based - kept for backward compatibility)
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Set<String> roles = request.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = new HashSet<>();
            roles.add("USER");
        }
        user.setRoles(roles);

        userRepository.save(user);

        return jwtUtil.generateToken(user.getEmail(), user.getRoles());
    }

    // Login user (OTP-based)
    public String login(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jwtUtil.generateToken(user.getEmail(), user.getRoles());
    }

    // Login user (legacy password-based - kept for backward compatibility)
    public String login(LoginRequest request) {
        User user = userRepository.findByEmailOrUsername(request.getEmail(), request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPassword() == null) {
            throw new RuntimeException("Please use OTP to login");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRoles());
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Get user by ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // Get roles for JWT
    public Set<String> getRolesByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getRoles)
                .orElse(Collections.emptySet());
    }

    // Update user
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    // Update user by ID
    public boolean updateUserById(String id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setPhone(updatedUser.getPhone());
            user.setEmail(updatedUser.getEmail());
            userRepository.save(user);
            return true;
        }).orElse(false);
    }

    // Verify Aadhaar
    public User verifyAadhaar(String email, String aadhaarNumber) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // In production, hash/encrypt the Aadhaar number before storing
        // For demo, we'll store it as-is (NOT recommended for production!)
        user.setAadhaarNumber(aadhaarNumber);
        user.setAadhaarVerified(true);
        
        return userRepository.save(user);
    }

    // Delete user
    public boolean deleteUserById(String id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }
    /**
     * Update password for an existing user (used by forgot-password flow).
     * This method hashes the password and updates the user record.
     */
    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    public String registerWithPassword(String email, String name, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        Set<String> roles = new HashSet<>();
        roles.add("USER");
        user.setRoles(roles);
        user.setVerified(true);

        userRepository.save(user);

        return jwtUtil.generateToken(user.getEmail(), user.getRoles());
    }


}
