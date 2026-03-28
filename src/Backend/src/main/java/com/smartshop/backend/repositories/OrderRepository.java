package com.smartshop.backend.repositories;

import com.smartshop.backend.models.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    // Supports "order history" for a specific user
    List<Order> findByUserId(String userId);
    
    // Supports "Admin Dashboard" for fulfillment
    List<Order> findByStatus(String status);
}