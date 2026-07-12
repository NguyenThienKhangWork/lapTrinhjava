package com.aitasker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long projectId;
    private Long reviewerId;
    private String reviewerName;
    private Long revieweeId;
    private String revieweeName;
    private Double rating;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewResponse fromEntity(com.aitasker.entity.Review review) {
        if (review == null) return null;
        return ReviewResponse.builder()
                .id(review.getId())
                .projectId(review.getProject().getId())
                .reviewerId(review.getReviewer().getId())
                .reviewerName(review.getReviewer().getFullName())
                .revieweeId(review.getReviewee().getId())
                .revieweeName(review.getReviewee().getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
