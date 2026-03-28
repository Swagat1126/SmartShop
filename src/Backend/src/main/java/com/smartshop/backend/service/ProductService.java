package com.smartshop.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartshop.backend.models.Product;
import com.smartshop.backend.repositories.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(Product product) {
        if (product == null) {
            throw new RuntimeException("Product is required");
        }

        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new RuntimeException("Product name is required");
        }

        if (product.getPrice() == null || product.getPrice() <= 0) {
            throw new RuntimeException("Product price must be greater than 0");
        }
        return productRepository.save(product);
    }

    public List<Product> getByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new RuntimeException("Category is required");
        }
        return productRepository.findByCategory(category);
    }

    public List<Product> searchProducts(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Search term is required");
        }
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}