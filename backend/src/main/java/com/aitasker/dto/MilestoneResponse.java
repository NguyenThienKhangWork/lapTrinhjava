package com.aitasker.dto;

import com.aitasker.enums.MilestoneStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneResponse {
    private Long id;
    private Long projectId;
    private String title;
    private String description;
    private String deliverables;
    private String feedback;
    private Double amount;
    private LocalDateTime dueDate;
    private MilestoneStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MilestoneResponse fromEntity(com.aitasker.entity.Milestone milestone) {
        if (milestone == null) return null;
        return MilestoneResponse.builder()
                .id(milestone.getId())
                .projectId(milestone.getProject().getId())
                .title(milestone.getTitle())
                .description(milestone.getDescription())
                .deliverables(milestone.getDeliverables())
                .feedback(milestone.getFeedback())
                .amount(milestone.getAmount())
                .dueDate(milestone.getDueDate())
                .status(milestone.getStatus())
                .createdAt(milestone.getCreatedAt())
                .updatedAt(milestone.getUpdatedAt())
                .build();
    }
}
