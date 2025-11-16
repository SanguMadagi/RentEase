package com.rentease.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChatRequest {
    private String message;
    private List<String> lastMessages;
    private Double userLat;
    private Double userLon;

}
