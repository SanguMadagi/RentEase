package com.rentease.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;

    private String productId;
    private String renterId;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String paymentStatus = "PENDING"; // PENDING, PAID, CANCELLED

}
