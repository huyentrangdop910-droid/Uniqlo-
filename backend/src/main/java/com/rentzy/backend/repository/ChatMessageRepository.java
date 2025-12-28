package com.rentzy.backend.repository;

import com.rentzy.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Tìm tin nhắn giữa user A và user B (2 chiều)
    // VD: Lấy tin nhắn của "Trang" gửi "STAFF" HOẶC "STAFF" gửi "Trang"
    List<ChatMessage> findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderByTimestampAsc(
        String senderId1, String recipientId1, String senderId2, String recipientId2
    );
}