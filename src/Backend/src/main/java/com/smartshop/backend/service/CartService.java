package com.smartshop.backend.service;

import com.smartshop.backend.models.Cart;
import com.smartshop.backend.models.CartItem;
import com.smartshop.backend.repositories.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;

@Service
public class CartService {
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);
    @Autowired
    private CartRepository cartRepository;

    public Cart getCart(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("userId is required");
        }
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    newCart.setItems(new ArrayList<>());
                    return cartRepository.save(newCart);
                });
    }

    // Add item to cart
    public Cart addToCart(String userId, CartItem item) {
        logger.info("Adding item to cart for user: {}", userId);

        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("userId is required");
        }

        if (item == null) {
            throw new RuntimeException("Cart item is required");
        }

        if (item.getProductId() == null || item.getProductId().trim().isEmpty()) {
            throw new RuntimeException("productId is required");
        }

        if (item.getQuantity() == null || item.getQuantity() <= 0) {
            throw new RuntimeException("quantity must be greater than 0");
        }
        Cart cart = getCart(userId);

        boolean found = false;

        for (CartItem i : cart.getItems()) {
            if (i.getProductId().equals(item.getProductId())) {
                i.setQuantity(i.getQuantity() + item.getQuantity());
                found = true;
                break;
            }
        }

        if (!found) {
            cart.getItems().add(item);
        }

        return cartRepository.save(cart);
    }

    public Cart clearCart(String userId) {
        logger.info("Clearing cart for user: {}", userId);
        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("userId is required");
        }
        Cart cart = getCart(userId);
        cart.getItems().clear();
        return cartRepository.save(cart);
    }
}