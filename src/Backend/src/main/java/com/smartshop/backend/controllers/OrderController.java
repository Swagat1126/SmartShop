package com.smartshop.backend.controllers;

import com.smartshop.backend.models.Order;
import com.smartshop.backend.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // PLACE ORDER
    @PostMapping("/{userId}")
    public Order placeOrder(
            @PathVariable String userId,
            @RequestBody Order request) {
        return orderService.placeOrder(
                userId,
                request.getAddress(),
                request.getPaymentMethod());
    }

    // ADMIN: GET ALL ORDERS
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // GET USER ORDERS
    @GetMapping("/{userId}")
    public List<Order> getOrders(@PathVariable String userId) {
        return orderService.getUserOrders(userId);
    }

    // GET USER ORDERS (explicit)
    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable String userId) {
        return orderService.getUserOrders(userId);
    }

    // ADMIN: UPDATE STATUS
    @PutMapping("/{orderId}/status")
    public Order updateStatus(@PathVariable String orderId, @RequestBody Order request) {
        return orderService.updateOrderStatus(orderId, request.getStatus());
    }
}