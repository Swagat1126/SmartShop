package com.smartshop.backend.repositories;

import com.smartshop.backend.models.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    // Maps "user_id (Foreign Key)" to find a user's specific cart
    Optional<Cart> findByUserId(String userId);
}