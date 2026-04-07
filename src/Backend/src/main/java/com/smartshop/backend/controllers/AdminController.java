package com.smartshop.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartshop.backend.dto.AdminDashboardStats;
import com.smartshop.backend.dto.AdminLoginResponse;
import com.smartshop.backend.dto.LoginRequest;
import com.smartshop.backend.dto.UserDto;
import com.smartshop.backend.models.Order;
import com.smartshop.backend.models.Product;
import com.smartshop.backend.repositories.OrderRepository;
import com.smartshop.backend.repositories.ProductRepository;
import com.smartshop.backend.service.AuthService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/login")
    public AdminLoginResponse adminLogin(@RequestBody LoginRequest request) {
        UserDto admin = authService.adminLogin(request.email(), request.password());
        return new AdminLoginResponse(admin);
    }

    @GetMapping("/dashboard")
    public AdminDashboardStats dashboard() {
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        double totalRevenue = orderRepository.findAll().stream()
                .map(Order::getTotalAmount)
                .filter(v -> v != null)
                .mapToDouble(Double::doubleValue)
                .sum();
        return new AdminDashboardStats(totalProducts, totalOrders, totalRevenue);
    }

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
