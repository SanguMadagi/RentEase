package com.rentease.security;

import com.rentease.security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Filter to check token expiry and inactivity
 * Enforces 48-hour token expiry and inactivity timeout
 */
@Component
@Order(1)
@Slf4j
public class LastActivityFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Inactivity timeout: 48 hours in milliseconds
    private static final long INACTIVITY_TIMEOUT = 1000L * 60 * 60 * 48; // 48 hours

    public LastActivityFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Skip for public endpoints
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth/") || 
            path.startsWith("/oauth2/") || 
            path.startsWith("/error") ||
            path.equals("/api/products") ||
            (path.startsWith("/api/products/") && "GET".equals(request.getMethod()))) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        
        // Only check tokens for authenticated requests
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                
                // Check if token is expired
                Boolean isExpired = jwtUtil.isTokenExpiredGraceful(token);
                if (isExpired == null) {
                    // Token is malformed
                    sendErrorResponse(response, "Session expired. Please sign in again.", 401);
                    return;
                }
                
                if (isExpired) {
                    sendErrorResponse(response, "Session expired. Please sign in again.", 401);
                    return;
                }

                // Check inactivity timeout
                Long lastActivity = jwtUtil.extractLastActivity(token);
                if (lastActivity != null) {
                    long now = System.currentTimeMillis();
                    long inactivityDuration = now - lastActivity;
                    
                    if (inactivityDuration >= INACTIVITY_TIMEOUT) {
                        sendErrorResponse(response, "You were logged out due to 2 days of inactivity. Please sign in.", 401);
                        return;
                    }
                }
                
            } catch (Exception e) {
                // Log error for developers
                log.error("LastActivityFilter error: {}", e.getMessage(), e);
                // Continue to next filter - let JwtAuthenticationFilter handle it
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response, String userMessage, int status) throws IOException {
        String debugId = UUID.randomUUID().toString();
        
        // Log full error for developers
        log.error("LastActivityFilter: {} [debugId: {}]", userMessage, debugId);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("userMessage", userMessage);
        errorResponse.put("debugId", debugId);
        
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}

