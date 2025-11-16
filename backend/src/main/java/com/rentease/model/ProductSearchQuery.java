package com.rentease.model;

public class ProductSearchQuery {
    private String keywords;
    private String location;
    private Double priceMin;
    private Double priceMax;
    private String category;

    // Getters and Setters
    public String getKeywords() { return keywords; }
    public void setKeywords(String keywords) { this.keywords = keywords; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getPriceMin() { return priceMin; }
    public void setPriceMin(Double priceMin) { this.priceMin = priceMin; }

    public Double getPriceMax() { return priceMax; }
    public void setPriceMax(Double priceMax) { this.priceMax = priceMax; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
