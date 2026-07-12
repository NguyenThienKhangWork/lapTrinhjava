package com.aitasker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalRequest {
    @NotBlank(message = "Cover letter is required")
    private String coverLetter;

    @NotNull(message = "Proposed budget is required")
    private Double proposedBudget;

    @NotBlank(message = "Proposed timeline is required")
    private String proposedTimeline;
}
