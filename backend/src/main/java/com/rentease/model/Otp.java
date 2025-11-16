package com.rentease.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "otps")
public class Otp {
    @Id
    private String id;

    @Indexed
    private String email;

    private String otpCode;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    private boolean used;

    private String purpose; // "LOGIN" or "REGISTER"
}

