package com.rentease.repository;

import com.rentease.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByLatitudeBetweenAndLongitudeBetween(double latMin, double latMax, double lonMin, double lonMax);
    List<Product> findByLenderId(String lenderId);
}
