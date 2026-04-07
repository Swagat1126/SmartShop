package com.smartshop.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartshop.backend.models.Product;
import com.smartshop.backend.exceptions.ResourceNotFoundException;
import com.smartshop.backend.repositories.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new RuntimeException("Product id is required");
        }
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
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

    public Product updateProduct(String id, Product updates) {
        Product existing = getProductById(id);
        if (updates == null) {
            throw new RuntimeException("Product is required");
        }

        if (updates.getName() != null) {
            existing.setName(updates.getName());
        }
        if (updates.getDescription() != null) {
            existing.setDescription(updates.getDescription());
        }
        if (updates.getPrice() != null) {
            existing.setPrice(updates.getPrice());
        }
        if (updates.getCategory() != null) {
            existing.setCategory(updates.getCategory());
        }
        if (updates.getImageUrl() != null) {
            existing.setImageUrl(updates.getImageUrl());
        }
        if (updates.getStock() != null) {
            existing.setStock(updates.getStock());
        }

        return productRepository.save(existing);
    }

    public void deleteProduct(String id) {
        Product existing = getProductById(id);
        productRepository.delete(existing);
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