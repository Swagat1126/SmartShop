package com.smartshop.backend.models;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "carts")
@Data
public class Cart {
    @Id
    private String id; // [cite: 19]
    private String userId; // [cite: 20]
    private List<CartItem> items = new ArrayList<>();// Combined Product and Quantity 
}


