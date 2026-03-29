package com.example.smartshop.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.smartshop.model.Product;

public interface ProductRepository extends MongoRepository<Product, String> {
}