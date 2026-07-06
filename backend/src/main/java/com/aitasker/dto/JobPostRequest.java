package com.aitasker.dto;
import com.aitasker.enums.JobType;

public class JobPostRequest {
    private String title;
    private String description;
    private Double budgetMin;
    private Double budgetMax;
    private String skillsRequired;
    private String timeline;
    private JobType type;
}
