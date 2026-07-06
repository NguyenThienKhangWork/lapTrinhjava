package com.aitasker.dto;
import com.aitasker.enums.JobStatus;
import com.aitasker.enums.JobType;

public class JobPostResponse {
    private Long id;
    private String title;
    private String description;
    private Double budgetMin;
    private Double budgetMax;
    private String skillsRequired;
    private String timeline;
    private JobStatus status;
    private JobType type;
}
