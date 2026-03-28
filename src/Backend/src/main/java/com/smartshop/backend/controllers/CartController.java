package com.smartshop.backend.controllers;

import com.smartshop.backend.models.Cart;
import com.smartshop.backend.models.CartItem;
import com.smartshop.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // GET cart
    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable String userId) {
        return cartService.getCart(userId);
    }

    // ADD to cart
    @PostMapping("/{userId}/add")
    public Cart addToCart(
        @PathVariable String userId,
        @RequestBody CartItem item
    ){
        return cartService.addToCart(userId, item);
    }
    
}