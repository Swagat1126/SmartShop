package com.smartshop.backend.dto;

public record UserDto(
        String id,
        String name,
        String email,
        String role,
        String token
) {}
