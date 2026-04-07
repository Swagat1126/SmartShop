package com.smartshop.backend.dto;

import lombok.Data;
import com.smartshop.backend.models.Product;

@Data
public class CartItemDto {
    private String id; // maps to productId for frontend logic
    private String productId;
    private Integer quantity;
    private Product product;
}
