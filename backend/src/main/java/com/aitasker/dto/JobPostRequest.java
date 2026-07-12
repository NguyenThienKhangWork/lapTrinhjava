package com.aitasker.dto;

import com.aitasker.enums.JobType;
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
public class JobPostRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private Double budgetMin;
    private Double budgetMax;
    private String timeline;
    private String skillsRequired;

    @NotNull(message = "Job type is required")
    private JobType type;
}
