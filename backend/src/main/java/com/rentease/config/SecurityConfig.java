package com.rentease.config;

import com.rentease.security.CustomOAuth2AuthorizationRequestResolver;
import com.rentease.security.JwtAuthenticationFilter;
import com.rentease.security.LastActivityFilter;
import com.rentease.security.OAuth2LoginFailureHandler;
import com.rentease.security.OAuth2LoginSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final LastActivityFilter lastActivityFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;
    private final ClientRegistrationRepository clientRegistrationRepository;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          LastActivityFilter lastActivityFilter,
                          OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,
                          OAuth2LoginFailureHandler oAuth2LoginFailureHandler,
                          ClientRegistrationRepository clientRegistrationRepository) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.lastActivityFilter = lastActivityFilter;
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
        this.oAuth2LoginFailureHandler = oAuth2LoginFailureHandler;
        this.clientRegistrationRepository = clientRegistrationRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/error", "/oauth2/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .anyRequest().authenticated()
                )

                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\":\"Logged out successfully.\"}");
                        })
                        .clearAuthentication(true)
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authorization -> authorization
                                .authorizationRequestResolver(
                                        new CustomOAuth2AuthorizationRequestResolver(clientRegistrationRepository)
                                ))
                        .successHandler(oAuth2LoginSuccessHandler)
                        .failureHandler(oAuth2LoginFailureHandler))
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json");
                    response.setStatus(401);
                    response.getWriter().write("{\"error\": \"Unauthorized\"}");
                }))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(lastActivityFilter, JwtAuthenticationFilter.class);



        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
