package com.example.smartshop.service;

import com.example.smartshop.model.Product;
import com.example.smartshop.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public Product addProduct(Product product) {
        return repo.save(product);
    }

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product updateProduct(String id, Product product) {
        product.setId(id);
        return repo.save(product);
    }

    public void deleteProduct(String id) {
        repo.deleteById(id);
    }
}
