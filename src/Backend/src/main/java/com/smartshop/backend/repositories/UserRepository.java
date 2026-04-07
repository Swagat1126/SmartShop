package com.smartshop.backend.repositories;

import com.smartshop.backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Essential for Login: Maps to "email (unique)"
    List<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
