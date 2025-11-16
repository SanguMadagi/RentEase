package com.rentease.security;

import com.rentease.config.JwtUtil;
import com.rentease.model.User;
import com.rentease.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;
import java.util.Set;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauthUser.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.getOrDefault("name", "Google User");

        // Ensure user exists in database
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(email)
                        .username(name)
                        .password(null)
                        .roles(Collections.singleton("USER"))
                        .verified(true)
                        .build()));

        Set<String> roles = user.getRoles();
        // Generate JWT
        String token = jwtUtil.generateToken(email , roles);

        String redirectUrl = frontendUrl + "/oauth2/callback?token=" +
                URLEncoder.encode(token, StandardCharsets.UTF_8) +
                "&name=" + URLEncoder.encode(name, StandardCharsets.UTF_8);

        response.sendRedirect(redirectUrl);
    }
}



