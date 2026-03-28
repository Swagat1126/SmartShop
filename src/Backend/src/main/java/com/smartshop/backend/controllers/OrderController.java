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

    // GET USER ORDERS
    @GetMapping("/{userId}")
    public List<Order> getOrders(@PathVariable String userId) {
        return orderService.getUserOrders(userId);
    }
}