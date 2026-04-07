package com.smartshop.backend.service;

import com.smartshop.backend.dto.CartDto;
import com.smartshop.backend.dto.CartItemDto;
import com.smartshop.backend.models.Cart;
import com.smartshop.backend.models.CartItem;
import com.smartshop.backend.models.Product;
import com.smartshop.backend.repositories.CartRepository;
import com.smartshop.backend.repositories.ProductRepository;
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

    @Autowired
    private ProductRepository productRepository;

    private CartDto convertToDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUserId());

        for (CartItem item : cart.getItems()) {
            CartItemDto itemDto = new CartItemDto();
            itemDto.setId(item.getProductId()); // React maps item.id -> product.id
            itemDto.setProductId(item.getProductId());
            itemDto.setQuantity(item.getQuantity());

            // Populate the product safely
            productRepository.findById(item.getProductId()).ifPresentOrElse(
                product -> itemDto.setProduct(product),
                () -> logger.warn("Product not found for productId: {}", item.getProductId())
            );

            dto.getItems().add(itemDto);
        }
        return dto;
    }

    public CartDto getCart(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("userId is required");
        }
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    newCart.setItems(new ArrayList<>());
                    return cartRepository.save(newCart);
                });
        return convertToDto(cart);
    }

    private Cart getRawCart(String userId) {
        return cartRepository.findByUserId(userId).orElseThrow();
    }

    // Add item to cart
    public CartDto addToCart(String userId, CartItem item) {
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

        // Validate product existence
        productRepository.findById(item.getProductId()).orElseThrow(
            () -> new RuntimeException("Product not found for productId: " + item.getProductId())
        );

        // Ensure cart exists
        getCart(userId);
        Cart cart = getRawCart(userId);

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

        return convertToDto(cartRepository.save(cart));
    }

    public CartDto clearCart(String userId) {
        logger.info("Clearing cart for user: {}", userId);
        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("userId is required");
        }
        // ensure exists
        getCart(userId);
        Cart cart = getRawCart(userId);
        cart.getItems().clear();
        return convertToDto(cartRepository.save(cart));
    }

    public CartDto removeItem(String userId, String productId) {
        logger.info("Removing item from cart for user: {}", userId);
        if (productId == null || productId.trim().isEmpty()) {
            throw new RuntimeException("productId is required");
        }

        // ensure exists
        getCart(userId);
        Cart cart = getRawCart(userId);
        cart.getItems().removeIf(i -> productId.equals(i.getProductId()));
        return convertToDto(cartRepository.save(cart));
    }

    public CartDto updateQuantity(String userId, String productId, Integer quantity) {
        logger.info("Updating cart item quantity for user: {}", userId);
        if (productId == null || productId.trim().isEmpty()) {
            throw new RuntimeException("productId is required");
        }
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("quantity must be greater than 0");
        }

        // ensure exists
        getCart(userId);
        Cart cart = getRawCart(userId);
        boolean found = false;
        for (CartItem i : cart.getItems()) {
            if (productId.equals(i.getProductId())) {
                i.setQuantity(quantity);
                found = true;
                break;
            }
        }
        if (!found) {
            throw new RuntimeException("Item not found in cart");
        }
        return convertToDto(cartRepository.save(cart));
    }
}