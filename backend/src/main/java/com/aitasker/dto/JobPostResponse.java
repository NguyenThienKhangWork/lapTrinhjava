package com.aitasker.dto;

import com.aitasker.enums.JobStatus;
import com.aitasker.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPostResponse {
    private Long id;
    private UserDTO client;
    private String title;
    private String description;
    private Double budgetMin;
    private Double budgetMax;
    private String timeline;
    private String skillsRequired;
    private JobStatus status;
    private JobType type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static JobPostResponse fromEntity(com.aitasker.entity.JobPost jobPost) {
        if (jobPost == null) return null;
        return JobPostResponse.builder()
                .id(jobPost.getId())
                .client(UserDTO.fromEntity(jobPost.getClient()))
                .title(jobPost.getTitle())
                .description(jobPost.getDescription())
                .budgetMin(jobPost.getBudgetMin())
                .budgetMax(jobPost.getBudgetMax())
                .timeline(jobPost.getTimeline())
                .skillsRequired(jobPost.getSkillsRequired())
                .status(jobPost.getStatus())
                .type(jobPost.getType())
                .createdAt(jobPost.getCreatedAt())
                .updatedAt(jobPost.getUpdatedAt())
                .build();
    }
}
