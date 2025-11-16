package com.rentease.repository;

import com.rentease.model.Otp;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends MongoRepository<Otp, String> {
    Optional<Otp> findByEmailAndOtpCodeAndUsedFalseAndExpiresAtAfter(
            String email, String otpCode, LocalDateTime now);
    
    Optional<Otp> findTopByEmailAndPurposeAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String email, String purpose, LocalDateTime now);
    
    void deleteByExpiresAtBefore(LocalDateTime now);
}

