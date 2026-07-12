package com.rentease.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@rentease.com}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't throw - OTP will still be saved in DB
            log.error("Failed to send email: {}", e.getMessage());
            // In development, print OTP to console
            log.info("=== OTP EMAIL (DEV MODE) ===");
            log.info("To: {}", to);
            log.info("Subject: {}", subject);
            log.info("Body: {}", body);
            log.info("===========================");
        }
    }
}

