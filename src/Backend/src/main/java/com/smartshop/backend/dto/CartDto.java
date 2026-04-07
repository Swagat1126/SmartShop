package com.smartshop.backend.dto;

import lombok.Data;
import java.util.List;
import java.util.ArrayList;
import com.smartshop.backend.models.Product;

@Data
public class CartDto {
    private String id;
    private String userId;
    private List<CartItemDto> items = new ArrayList<>();
}
