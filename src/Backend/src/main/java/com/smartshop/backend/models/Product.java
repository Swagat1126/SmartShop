package com.smartshop.backend.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "products")
@Data
public class Product {
    @Id
    private String id; // Maps to "id (Primary Key)"
    private String name; //
    private String description; //
    private Double price; //
    private String category; //
    private String imageUrl; // Maps to "image_url"
    private Integer stock; //
    private LocalDateTime createdAt = LocalDateTime.now(); //
}
