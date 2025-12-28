package com.rentzy.backend.controller;

import com.rentzy.backend.dto.AuthResponse;
import com.rentzy.backend.dto.LoginRequest;
import com.rentzy.backend.dto.RegisterRequest;
import com.rentzy.backend.dto.UserProfileResponse; // Import DTO này
import com.rentzy.backend.service.AuthService;
import com.rentzy.backend.service.UserService; // Import UserService
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService; // Cần UserService để lấy profile

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        // Nếu chưa đăng nhập -> Lỗi
        if (userDetails == null) {
            return ResponseEntity.status(403).build();
        }
        
        // Gọi UserService để lấy thông tin đầy đủ (bao gồm Role)
        UserProfileResponse profile = userService.getUserProfile(userDetails.getUsername());
        
        // Trả về JSON Object
        return ResponseEntity.ok(profile);
    }
}