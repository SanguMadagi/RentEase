//package com.rentease.security;
//
//import com.rentease.config.JwtUtil;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.core.annotation.Order;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Component
//@Order(2)
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//    private final JwtUtil jwtUtil;
//    private final UserDetailsService userDetailsService;
//
//    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
//        this.jwtUtil = jwtUtil;
//        this.userDetailsService = userDetailsService;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//
//        final String authHeader = request.getHeader("Authorization");
//        final String jwt;
//        final String userEmail;
//
//        // Check if Authorization header exists and starts with Bearer
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        try {
//            jwt = authHeader.substring(7);
//            userEmail = jwtUtil.extractUsername(jwt);
//
//            // Authenticate only if no existing context
//            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                try {
//                    UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
//
//                    if (jwtUtil.isTokenValid(jwt, userDetails)) {
//                        UsernamePasswordAuthenticationToken authToken =
//                                new UsernamePasswordAuthenticationToken(
//                                        userDetails, null, userDetails.getAuthorities());
//
//                        authToken.setDetails(
//                                new WebAuthenticationDetailsSource().buildDetails(request)
//                        );
//
//                        SecurityContextHolder.getContext().setAuthentication(authToken);
//                    }
//                } catch (Exception e) {
//                    // If user not found or token invalid, just continue without authentication
//                    // This allows public endpoints to work
//                    System.err.println("JWT Filter error (non-critical): " + e.getMessage());
//                }
//            }
//        } catch (Exception e) {
//            // If JWT parsing fails, just continue without authentication
//            // This allows requests without tokens to proceed to public endpoints
//            System.err.println("JWT Filter error (non-critical): " + e.getMessage());
//        }
//
//        filterChain.doFilter(request, response);
//    }
//}
package com.rentease.security;

import com.rentease.config.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // If no header or not Bearer, skip filter (public endpoints)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        System.out.println("Incoming JWT: " + jwt);
        try {
            userEmail = jwtUtil.extractUsername(jwt);
            System.out.println("user email " + userEmail);
            if (userEmail == null) {
                sendUnauthorized(response, "Invalid JWT token: missing username");
                return;
            }

            // Only authenticate if not already set
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                System.out.println("User details: " + userDetails);
                if (!jwtUtil.isTokenValid(jwt, userDetails)) {
                    sendUnauthorized(response, "JWT token is expired or invalid");
                    return;
                }

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

            // Proceed normally
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            sendUnauthorized(response, "JWT processing error: " + e.getMessage());
        }
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}
