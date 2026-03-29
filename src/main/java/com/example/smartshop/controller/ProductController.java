
package com.example.smartshop.controller;

import com.example.smartshop.model.Product;
import com.example.smartshop.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // Add Product
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return service.addProduct(product);
    }

    // Get All Products
    @GetMapping
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    // Update Product
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable String id, @RequestBody Product product) {
        return service.updateProduct(id, product);
    }

    // Delete Product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable String id) {
        service.deleteProduct(id);
        return "Product deleted successfully";
    }
}
