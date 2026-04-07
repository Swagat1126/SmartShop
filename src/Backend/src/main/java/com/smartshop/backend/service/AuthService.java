package com.smartshop.backend.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartshop.backend.dto.UserDto;
import com.smartshop.backend.models.User;
import com.smartshop.backend.repositories.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public UserDto register(String name, String email, String password) {
        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        if (userRepository.existsByEmail(email.trim().toLowerCase())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(name.trim());
        user.setEmail(email.trim().toLowerCase());
        user.setPassword(password);
        user.setRole("USER");

        User saved = userRepository.save(user);
        return toDtoWithToken(saved);
    }

    public UserDto login(String email, String password) {
        User user = getByEmail(email);
        if (!passwordMatches(user, password)) {
            throw new RuntimeException("Invalid credentials");
        }
        if (user.getRole() != null && user.getRole().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("Use admin login");
        }
        return toDtoWithToken(user);
    }

    public UserDto adminLogin(String email, String password) {
        User user = getByEmail(email);
        if (!passwordMatches(user, password)) {
            throw new RuntimeException("Invalid credentials");
        }
        if (user.getRole() == null || !user.getRole().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("Not an admin");
        }
        return toDtoWithToken(user);
    }

    private User getByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        var users = userRepository.findByEmail(email.trim().toLowerCase());
        if (users.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }
        return users.get(0); // If there are duplicates, just take the first one
    }

    private boolean passwordMatches(User user, String password) {
        if (password == null) return false;
        // NOTE: plain-text comparison for now (no Spring Security yet)
        return password.equals(user.getPassword());
    }

    private UserDto toDtoWithToken(User user) {
        String token = UUID.randomUUID().toString();
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), token);
    }
}
