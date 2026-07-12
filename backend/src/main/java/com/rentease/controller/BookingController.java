package com.rentease.controller;

import com.rentease.model.Booking;
import com.rentease.model.User;
import com.rentease.service.BookingService;
import com.rentease.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(error);
            }

            String email = auth.getName();
            Optional<User> userOpt = userService.getUserByEmail(email);
            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(404).body(error);
            }

            booking.setRenterId(userOpt.get().getId());
            booking.setPaymentStatus("PAID");

            Booking saved = bookingService.createBooking(booking);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error creating booking: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable String id, @RequestParam String status) {
        Booking updated = bookingService.updateBookingStatus(id, status);
        if(updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Booking>> getBookingsByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(bookingService.getBookingsByProduct(productId));
    }

    @GetMapping("/renter/{renterId}")
    public ResponseEntity<List<Booking>> getBookingsByRenter(@PathVariable String renterId) {
        return ResponseEntity.ok(bookingService.getBookingsByRenter(renterId));
    }
}
