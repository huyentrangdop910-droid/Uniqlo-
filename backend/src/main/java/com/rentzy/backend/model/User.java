package com.rentzy.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data // Tự tạo getter, setter, toString...
@Builder // Giúp tạo đối tượng dễ dàng
@NoArgsConstructor // Tự tạo constructor rỗng
@AllArgsConstructor // Tự tạo constructor có tham số
@Entity // Báo cho JPA đây là 1 thực thể
@Table(name = "users") // Tên của bảng trong database
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;
    @Column(name = "avatar_url") // Tên cột trong Database
    private String avatarUrl;    // <-- THÊM DÒNG NÀY VÀO

    private String phone;
    private String address;
    // ... (các trường id, username, password, role giữ nguyên) ...

    // THÊM 3 TRƯỜNG MỚI
    private String fullName;
    private String email;
    private String phoneNumber;

    // ...

    @Enumerated(EnumType.STRING) // Lưu vai trò dưới dạng Chuỗi (USER, ADMIN)
    private Role role;

    // --- Các phương thức bắt buộc của UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Tài khoản không bao giờ hết hạn
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Tài khoản không bị khóa
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Mật khẩu không bao giờ hết hạn
    }

    @Override
    public boolean isEnabled() {
        return true; // Tài khoản luôn được bật
    }
   
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    
    

} 
