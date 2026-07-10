package com.rentease.controller;

import com.rentease.model.User;
import com.rentease.repository.UserRepository;
import com.rentease.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequiredArgsConstructor
public class OAuth2Controller {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @GetMapping("/api/auth/oauth2/success")
    public String handleGoogleSuccess(org.springframework.security.core.Authentication authentication) {
        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String username = oauthUser.getAttribute("name"); // Google provides "name" field → your model has "username"

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .username(username)
                            .password("") // empty, since OAuth2 users don't need passwords
                            .roles(Collections.singleton("USER"))
                            .verified(true)
                            .build();
                    return userRepository.save(newUser);
                });

        String token = jwtUtil.generateToken(email , user.getRoles());

        return "✅ Google Login Successful!\nJWT Token: " + token;
    }

    @GetMapping("/api/auth/oauth2/failure")
    public String handleGoogleFailure() {
        return "❌ Google Login Failed. Please try again.";
    }
}
