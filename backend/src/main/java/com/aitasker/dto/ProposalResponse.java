package com.aitasker.dto;
import com.aitasker.enums.ProposalStatus;

public class ProposalResponse {
    private Long id;
    private Long jobPostId;
    private String coverLetter;
    private Double proposedBudget;
    private String proposedTimeline;
    private ProposalStatus status; 
}
