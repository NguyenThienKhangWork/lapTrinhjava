package com.aitasker.entity;

import com.aitasker.enums.JobStatus;
import com.aitasker.enums.JobType;

public class JobPost {

    private Long id;

    private String title;

    private String description;

    private Double budgetMin;

    private Double budgetMax;

    private String skillsRequired;

    private JobStatus status;

    private JobType type;
}