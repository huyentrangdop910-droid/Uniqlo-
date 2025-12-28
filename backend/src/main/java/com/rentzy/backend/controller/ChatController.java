package com.rentzy.backend.controller;

import com.rentzy.backend.model.ChatMessage;
import com.rentzy.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody; // Quan trọng
import org.springframework.web.bind.annotation.DeleteMapping; 

import java.util.Date;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository; // <-- Inject Repo

    // 1. WebSocket: Nhận và Gửi tin nhắn
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId, @Payload ChatMessage chatMessage) {
        // Gán thời gian nếu chưa có
        chatMessage.setTimestamp(new Date());
        
        chatMessageRepository.save(chatMessage);

        // Gửi qua WebSocket cho Frontend hiển thị ngay
        messagingTemplate.convertAndSend("/topic/room/" + roomId, chatMessage);
    }

    // 2. API REST: Lấy lịch sử chat (Để load lại khi F5)
    @GetMapping("/api/v1/chat/history/{username}")
    @ResponseBody // Trả về JSON
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable String username) {
        // Lấy tin nhắn giữa "username" và "STAFF"
        List<ChatMessage> history = chatMessageRepository
            .findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderByTimestampAsc(
                username, "STAFF", "STAFF", username
            );
        return ResponseEntity.ok(history);
    }
    @DeleteMapping("/api/v1/chat/message/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        if (chatMessageRepository.existsById(id)) {
            chatMessageRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}