package com.smartshop.backend.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id; // [cite: 3]
    private String name; // [cite: 4]
    @Indexed(unique = true)
    private String email; // [cite: 5]
    private String password; // [cite: 6]
    private String role; // USER or ADMIN [cite: 7]
    private LocalDateTime createdAt = LocalDateTime.now(); // [cite: 8]
}