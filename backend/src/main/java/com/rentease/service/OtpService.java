package com.rentease.service;

import com.rentease.model.Otp;
import com.rentease.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;

    // Generate 6-digit OTP
    private String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    // Send OTP to email
    public boolean sendOtp(String email, String purpose) {
        try {
            // Invalidate previous unused OTPs for this email and purpose
            Optional<Otp> existingOtp = otpRepository.findTopByEmailAndPurposeAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                    email, purpose, LocalDateTime.now());
            
            if (existingOtp.isPresent()) {
                Otp otp = existingOtp.get();
                // If OTP was created less than 1 minute ago, don't send new one (rate limiting)
                if (otp.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(1))) {
                    return false; // Too soon to send another OTP
                }
            }

            String otpCode = generateOtp();
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expiresAt = now.plusMinutes(OTP_EXPIRY_MINUTES);

            Otp otp = Otp.builder()
                    .email(email)
                    .otpCode(otpCode)
                    .purpose(purpose)
                    .createdAt(now)
                    .expiresAt(expiresAt)
                    .used(false)
                    .build();

            otpRepository.save(otp);

            // Send email
            String subject = purpose.equals("LOGIN") ? "Your RentEase Login OTP" : "Your RentEase Registration OTP";
            String body = String.format(
                    "Your OTP for %s is: %s\n\nThis OTP is valid for %d minutes.\n\nIf you didn't request this, please ignore this email.",
                    purpose.toLowerCase(), otpCode, OTP_EXPIRY_MINUTES
            );

            emailService.sendEmail(email, subject, body);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Verify OTP
    public boolean verifyOtp(String email, String otpCode, String purpose) {
        Optional<Otp> otpOptional = otpRepository.findByEmailAndOtpCodeAndUsedFalseAndExpiresAtAfter(
                email, otpCode, LocalDateTime.now());

        if (otpOptional.isPresent()) {
            Otp otp = otpOptional.get();
            if (otp.getPurpose().equals(purpose)) {
                // Mark OTP as used
                otp.setUsed(true);
                otpRepository.save(otp);
                return true;
            }
        }
        return false;
    }

    // Clean up expired OTPs (runs every hour)
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void cleanupExpiredOtps() {
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}

