package com.rentzy.backend.service;

import com.rentzy.backend.dto.AuthResponse;
import com.rentzy.backend.dto.LoginRequest;
import com.rentzy.backend.dto.RegisterRequest;
import com.rentzy.backend.model.Role;
import com.rentzy.backend.model.User;
import com.rentzy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Xử lý logic Đăng Ký
     */
    public AuthResponse register(RegisterRequest request) {
        // 1. Kiểm tra xem username đã tồn tại chưa
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Tên người dùng đã tồn tại");
        }

        // 2. Tạo đối tượng User mới
        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword())) // Mã hóa mật khẩu
                .phone(request.getPhone())
                .address(request.getAddress())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .role(Role.USER) // Gán vai trò mặc định là USER
                .build();

        // 3. Lưu user vào database
        userRepository.save(user);

        // 4. Tạo token và trả về
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }

    /**
     * Xử lý logic Đăng Nhập
     */
    public AuthResponse login(LoginRequest request) {
        // 1. Xác thực người dùng (username/password)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 2. Nếu xác thực thành công, tìm lại user trong DB
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Lỗi xác thực"));

        // 3. Tạo token và trả về
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }
    
}