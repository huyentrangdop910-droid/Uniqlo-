package com.rentzy.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint để Frontend kết nối: http://localhost:8080/ws
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Cho phép React kết nối
                .withSockJS(); // Hỗ trợ fallback
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Tiền tố để gửi tin nhắn từ Client lên Server
        registry.setApplicationDestinationPrefixes("/app");
        
        // Tiền tố để gửi tin nhắn từ Server về Client
        registry.enableSimpleBroker("/topic", "/user");
        
        registry.setUserDestinationPrefix("/user");
    }
}