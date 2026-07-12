package com.rentease.service;

import com.rentease.model.Otp;
import com.rentease.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
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
        log.info("sendOtp called for email={}, purpose={}", email, purpose);
        try {
            // Normalize purpose
            if (purpose == null) purpose = "LOGIN";
            purpose = purpose.trim().toUpperCase();

            // Validate purpose (optional — keep flexible)
            if (!purpose.equals("LOGIN") && !purpose.equals("REGISTER") && !purpose.equals("FORGOT")) {
                // default fallback to LOGIN
                purpose = "LOGIN";
            }

            // Invalidate previous unused OTPs for this email and purpose (rate limiting)
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
            log.info("Saved OTP for email={}, purpose={}", email, purpose);
            // Prepare subject & body depending on purpose
            String subject;
            String bodyIntro;
            if (purpose.equals("REGISTER")) {
                subject = "Your RentEase Registration OTP";
                bodyIntro = "Use this OTP to verify your email and complete registration.";
            } else if (purpose.equals("FORGOT")) {
                subject = "Your RentEase Password Reset OTP";
                bodyIntro = "Use this OTP to reset your RentEase account password.";
            } else { // LOGIN
                subject = "Your RentEase Login OTP";
                bodyIntro = "Use this OTP to sign in to RentEase.";
            }

            String body = String.format(
                    "%s\n\nOTP: %s\n\nThis OTP is valid for %d minutes.\n\nIf you didn't request this, please ignore this email.",
                    bodyIntro, otpCode, OTP_EXPIRY_MINUTES
            );

            emailService.sendEmail(email, subject, body);
            return true;
        } catch (Exception e) {
            log.error("Error in sendOtp: ", e);
            return false;
        }
    }


    public boolean verifyOtp(String email, String otpCode, String purpose) {
        if (purpose == null) purpose = "LOGIN";
        purpose = purpose.toUpperCase();

        Optional<Otp> otpOptional = otpRepository
                .findTopByEmailAndPurposeAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                        email, purpose, LocalDateTime.now()
                );

        if (otpOptional.isPresent()) {
            Otp otp = otpOptional.get();
            log.info("Found OTP in DB for purpose={}", otp.getPurpose());
            if (otp.getOtpCode().equals(otpCode)) {
                otp.setUsed(true);
                otpRepository.save(otp);
                return true;
            }
        } else {
            log.info("No valid OTP found for email={}, purpose={}", email, purpose);
        }

        return false;
    }


    // Clean up expired OTPs (runs every hour)
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void cleanupExpiredOtps() {
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}

