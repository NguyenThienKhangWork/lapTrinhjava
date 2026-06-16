package com.aitasker.dto;

import com.aitasker.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private Long projectId;
    private Long senderId;
    private String senderName;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;

    // chuyển đổi từ Entity sang DTO
    public static MessageResponse fromEntity(Message message) {
        if (message == null)
            return null;

        return MessageResponse.builder()
                .id(message.getId())
                // check null để tránh sập server
                .projectId(message.getProject() != null ? message.getProject().getId() : null)
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .senderName(message.getSender() != null ? message.getSender().getFullName() : null)
                .content(message.getContent())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}