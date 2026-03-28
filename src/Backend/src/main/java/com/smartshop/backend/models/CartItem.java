package com.smartshop.backend.models;

import lombok.Data;

// Helper class (not a separate collection)
@Data
public class CartItem {
    private String productId; // [cite: 21]
    private Integer quantity; // [cite: 22]
}
