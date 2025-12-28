
package com.rentzy.backend.config;

import com.rentzy.backend.config.jwt.JwtAuthFilter;
import com.rentzy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorize -> authorize
                // --- 1. CÁC API CÔNG KHAI ---
                .requestMatchers("/api/v1/health", "/api/v1/auth/**").permitAll()
                // ảnh lưu vào thư mục /uploads mở quyền đọc ở đây
                .requestMatchers("/uploads/**").permitAll() 
                
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**", "/api/v1/products/search").permitAll() 
                .requestMatchers(HttpMethod.GET, "/api/v1/reviews/**").permitAll()
                .requestMatchers("/api/v1/payment/**").permitAll()
                //Chat
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/api/v1/chat/**").permitAll() // Mở API lấy lịch sử chat

                // --- 2. CÁC API CHO NGƯỜI DÙNG ĐĂNG NHẬP (STAFF & ADMIN & USER) ---
                .requestMatchers("/api/v1/addresses/**").authenticated()

                
                
                .requestMatchers("/api/v1/users/avatar").authenticated() 
                .requestMatchers("/api/v1/users/me").authenticated()
                .requestMatchers("/api/v1/users/me/**").authenticated()

                // --- 3. QUYỀN NHÂN VIÊN & QUẢN LÝ ---
                .requestMatchers("/api/v1/users/customers").hasAnyAuthority("STAFF", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/products/**").hasAnyAuthority("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasAnyAuthority("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasAnyAuthority("ADMIN", "STAFF")

                // --- 4. CÁC API RIÊNG CHO ADMIN ---
                .requestMatchers("/api/v1/admin/**").hasAuthority("ADMIN")
                // Dòng này chặn tất cả /users/... nên phải để cuối cùng trong nhóm users
                .requestMatchers("/api/v1/users/**").hasAuthority("ADMIN") 

                // --- 5. CÒN LẠI ---
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ... (Các Bean bên dưới giữ nguyên)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}