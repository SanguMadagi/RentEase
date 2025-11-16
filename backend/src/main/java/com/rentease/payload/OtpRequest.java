package com.rentease.payload;

import lombok.Data;

@Data
public class OtpRequest {
    private String email;
    private String otp;
    private String purpose; // "LOGIN" or "REGISTER"
    private String name; // Required only for REGISTER
}

