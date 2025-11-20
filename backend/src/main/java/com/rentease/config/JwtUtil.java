package com.rentease.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static io.jsonwebtoken.Jwts.*;

/**
 * JWT Utility class for token generation and validation
 * Token expiry: 48 hours (2 days)
 */
@Component
public class JwtUtil {

    @Value("${app.secret-key}")
    private String SECRET_KEY;

    // Token expiry: 48 hours (2 days) in milliseconds
    private static final long TOKEN_EXPIRATION_TIME = 1000L * 60 * 60 * 48; // 48 hours

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    @SuppressWarnings("unchecked")
    public Set<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof java.util.List<?>) {
            return new HashSet<>((List<String>) rolesObj);
        }
        return new HashSet<>();
    }


    /**
     * Extract last activity timestamp from token claims
     */
    public Long extractLastActivity(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Object lastActivity = claims.get("lastActivity");
            if (lastActivity instanceof Number) {
                return ((Number) lastActivity).longValue();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }


    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Gracefully check if token is expired without throwing exception
     * Returns true if expired, false if valid, null if token is invalid/malformed
     */
    public Boolean isTokenExpiredGraceful(String token) {
        try {
            Date expiration = extractExpiration(token);
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (Exception e) {
            // Token is malformed or invalid
            return null;
        }
    }

    /**
     * Generate token with 48-hour expiry and lastActivity claim
     */
    public String generateToken(String username, Set<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("lastActivity", System.currentTimeMillis());
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        long now = System.currentTimeMillis();

        return Jwts.builder()
                .setClaims(claims)               // <-- Use setClaims instead of claims()
                .setSubject(subject)
                .setHeaderParam("typ", "JWT")    // <-- Add custom header
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + TOKEN_EXPIRATION_TIME))
                .signWith(getSigningKey())       // HMAC-SHA key
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }
}
