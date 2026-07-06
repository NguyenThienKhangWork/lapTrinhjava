package com.aitasker.dto;

import com.aitasker.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private Long jobPostId;
    private Long serviceListingId;
    private UserDTO client;
    private UserDTO expert;
    private String title;
    private ProjectStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Double totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProjectResponse fromEntity(com.aitasker.entity.Project project) {
        if (project == null) return null;
        return ProjectResponse.builder()
                .id(project.getId())
                .jobPostId(project.getJobPost() != null ? project.getJobPost().getId() : null)
                .serviceListingId(project.getServiceListing() != null ? project.getServiceListing().getId() : null)
                .client(UserDTO.fromEntity(project.getClient()))
                .expert(UserDTO.fromEntity(project.getExpert()))
                .title(project.getTitle())
                .status(project.getStatus())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .totalAmount(project.getTotalAmount())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
