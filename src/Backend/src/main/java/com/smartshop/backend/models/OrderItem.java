package com.smartshop.backend.models;

import lombok.Data;

@Data
public class OrderItem {
    private String productId; // [cite: 35]
    private Integer quantity; // [cite: 36]
    private Double price; // Price at time of purchase [cite: 37]
}
