package com.aitasker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPostAiRequest {
    private String title;
    private String description;
    private Double budgetMin;
    private Double budgetMax;
    private String skillsRequired;
    private String timeline;
}
