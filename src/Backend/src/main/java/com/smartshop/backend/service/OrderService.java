package com.smartshop.backend.service;

import com.smartshop.backend.models.Cart;
import com.smartshop.backend.models.Order;
import com.smartshop.backend.models.OrderItem;
// import com.smartshop.backend.repositories.CartRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.smartshop.backend.repositories.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    public Order placeOrder(String userId, String address, String paymentMethod) {
        logger.info("Placing order for user: {}", userId);
        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("userId is required");
        }

        if (address == null || address.trim().isEmpty()) {
            throw new RuntimeException("address is required");
        }

        if (paymentMethod == null || paymentMethod.trim().isEmpty()) {
            throw new RuntimeException("paymentMethod is required");
        }
        if (!paymentMethod.equalsIgnoreCase("COD") &&
                !paymentMethod.equalsIgnoreCase("UPI") &&
                !paymentMethod.equalsIgnoreCase("CARD")) {
            throw new RuntimeException("Invalid payment method");
        }

        Cart cart = cartService.getCart(userId);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            logger.error("Cart is empty for user: {}", userId);
            throw new RuntimeException("Cart is empty");
        }
        Order order = new Order();
        logger.info("Creating order object...");
        order.setUserId(userId);
        order.setAddress(address);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus("Pending");
        order.setStatus("Pending");

        // Convert CartItems → OrderItems
        order.setOrderItems(
                cart.getItems().stream().map(item -> {
                    OrderItem oi = new OrderItem();
                    oi.setProductId(item.getProductId());
                    oi.setQuantity(item.getQuantity());
                    oi.setPrice(0.0);
                    return oi;
                }).toList());

        order.setTotalAmount(0.0); // skip calculation for now

        Order saved = orderRepository.save(order);
        logger.info("Order saved with ID: {}", saved.getId());
        // clear cart after order
        cart.getItems().clear();
        cartService.clearCart(userId);
        logger.info("Cart cleared for user: {}", userId);
        return saved;
    }

    public List<Order> getUserOrders(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("userId is required");
        }
        return orderRepository.findByUserId(userId);
    }
}