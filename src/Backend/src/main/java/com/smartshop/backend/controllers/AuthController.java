package com.smartshop.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartshop.backend.dto.LoginRequest;
import com.smartshop.backend.dto.RegisterRequest;
import com.smartshop.backend.dto.UserDto;
import com.smartshop.backend.dto.UserLoginResponse;
import com.smartshop.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserLoginResponse> register(@RequestBody RegisterRequest request) {
        UserDto user = authService.register(request.name(), request.email(), request.password());
        return ResponseEntity.status(HttpStatus.CREATED).body(new UserLoginResponse(user));
    }

    @PostMapping("/login")
    public UserLoginResponse login(@RequestBody LoginRequest request) {
        UserDto user = authService.login(request.email(), request.password());
        return new UserLoginResponse(user);
    }
}
