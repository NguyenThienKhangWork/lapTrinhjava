package com.aitasker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPostAiResponse {
    private String improvedTitle;
    private String improvedDescription;
    private List<String> recommendedSkills;
    private Double suggestedBudget;
    private Double suggestedBudgetMin;
    private Double suggestedBudgetMax;
    private String suggestedSkills;
    private String tips;
}
