package com.smartshop.backend.models;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "orders")
@Data
public class Order {
    @Id
    private String id; // [cite: 24]
    private String userId; // [cite: 25]
    private Double totalAmount; // [cite: 26]
    private String status; // Pending/Shipped/Delivered [cite: 27]
    private String address; // [cite: 28]
    private String paymentStatus; // Pending/Paid [cite: 29]
    private String paymentMethod; // UPI/Card/COD [cite: 30]
    private List<OrderItem> orderItems; // Embedded "Order_Items" table [cite: 32]
    private LocalDateTime createdAt = LocalDateTime.now(); // [cite: 31]
}

// Helper class for embedded items
