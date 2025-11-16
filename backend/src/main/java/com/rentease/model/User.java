package com.rentease.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String phone;

    private Set<String> roles; // e.g. ["USER", "ADMIN"]

    @Builder.Default
    private boolean verified = false; // KYC/email verification later
    
    // Profile fields
    private String profilePicture; // Base64 or URL
    private String address;
    private String city;
    private String state;
    private String pincode;
    
    // Aadhaar verification
    private String aadhaarNumber; // Encrypted or hashed
    @Builder.Default
    private boolean aadhaarVerified = false;
}
