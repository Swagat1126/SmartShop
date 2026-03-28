package com.smartshop.backend.repositories;

import com.smartshop.backend.models.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // Supports "Category browsing" in the Product Catalog
    List<Product> findByCategory(String category);
    
    // Supports "full-text search"
    List<Product> findByNameContainingIgnoreCase(String name);
}