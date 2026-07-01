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
public class ExpertRecommendationResponse {
    private Long expertId;
    private String fullName;
    private String avatar;
    private Double rating;
    private Double compatibilityScore;
    private String skills;
    private Integer suitabilityScore;
    private String reason;
    private List<String> specializations;
}
