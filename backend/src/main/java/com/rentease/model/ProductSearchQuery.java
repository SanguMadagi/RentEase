package com.rentease.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchQuery {
    private String keywords;
    private String location;
    private Double priceMin;
    private Double priceMax;
    private String category;

}
