package com.aitasker.dto;

import com.aitasker.enums.ProposalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalResponse {
    private Long id;
    private Long jobPostId;
    private UserDTO expert;
    private String coverLetter;
    private Double proposedBudget;
    private String proposedTimeline;
    private ProposalStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProposalResponse fromEntity(com.aitasker.entity.Proposal proposal) {
        if (proposal == null) return null;
        return ProposalResponse.builder()
                .id(proposal.getId())
                .jobPostId(proposal.getJobPost().getId())
                .expert(UserDTO.fromEntity(proposal.getExpert()))
                .coverLetter(proposal.getCoverLetter())
                .proposedBudget(proposal.getProposedBudget())
                .proposedTimeline(proposal.getProposedTimeline())
                .status(proposal.getStatus())
                .createdAt(proposal.getCreatedAt())
                .updatedAt(proposal.getUpdatedAt())
                .build();
    }
}
