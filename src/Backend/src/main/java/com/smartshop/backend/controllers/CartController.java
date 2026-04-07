package com.smartshop.backend.controllers;

import com.smartshop.backend.dto.CartDto;
import com.smartshop.backend.models.CartItem;
import com.smartshop.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // GET cart
    @GetMapping("/{userId}")
    public CartDto getCart(@PathVariable String userId) {
        return cartService.getCart(userId);
    }

    // ADD to cart
    @PostMapping("/{userId}/add")
    public CartDto addToCart(
        @PathVariable String userId,
        @RequestBody CartItem item
    ){
        return cartService.addToCart(userId, item);
    }

    // REMOVE from cart (itemId maps to productId)
    @DeleteMapping("/{userId}/remove/{itemId}")
    public CartDto removeFromCart(@PathVariable String userId, @PathVariable String itemId) {
        return cartService.removeItem(userId, itemId);
    }

    // UPDATE quantity (itemId maps to productId)
    @PutMapping("/{userId}/update/{itemId}")
    public CartDto updateQuantity(
            @PathVariable String userId,
            @PathVariable String itemId,
            @RequestBody Map<String, Integer> body
    ) {
        Integer quantity = body == null ? null : body.get("quantity");
        return cartService.updateQuantity(userId, itemId, quantity);
    }

    // CLEAR cart
    @DeleteMapping("/{userId}/clear")
    public CartDto clearCart(@PathVariable String userId) {
        return cartService.clearCart(userId);
    }
    
}