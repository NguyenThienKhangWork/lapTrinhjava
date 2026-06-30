package com.aitasker.service;

import com.aitasker.dto.ReviewRequest;
import com.aitasker.dto.ReviewResponse;
import com.aitasker.entity.Project;
import com.aitasker.entity.Review;
import com.aitasker.entity.User;
import com.aitasker.exception.BadRequestException;
import com.aitasker.exception.ResourceNotFoundException;
import com.aitasker.repository.ProjectRepository;
import com.aitasker.repository.ReviewRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(String reviewerEmail, ReviewRequest request) {
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", reviewerEmail));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        // Validate reviewer participation
        if (!project.getClient().getId().equals(reviewer.getId()) && !project.getExpert().getId().equals(reviewer.getId())) {
            throw new BadRequestException("You are not authorized to review this project.");
        }

        User reviewee = userRepository.findById(request.getRevieweeId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getRevieweeId()));

        // Check reviewee is indeed the other party
        boolean isValidReviewee = (project.getClient().getId().equals(reviewer.getId()) && project.getExpert().getId().equals(reviewee.getId())) ||
                (project.getExpert().getId().equals(reviewer.getId()) && project.getClient().getId().equals(reviewee.getId()));

        if (!isValidReviewee) {
            throw new BadRequestException("Reviewee must be the other participant in the project.");
        }

        // Check if review already exists for this project by this reviewer
        List<Review> existingReviews = reviewRepository.findByProjectId(project.getId());
        for (Review r : existingReviews) {
            if (r.getReviewer().getId().equals(reviewer.getId())) {
                throw new BadRequestException("You have already reviewed this project.");
            }
        }

        Review review = Review.builder()
                .project(project)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        // Recalculate and update rating for reviewee
        List<Review> allReviewsOfReviewee = reviewRepository.findByRevieweeId(reviewee.getId());
        double totalRating = 0.0;
        for (Review r : allReviewsOfReviewee) {
            totalRating += r.getRating();
        }
        double avgRating = allReviewsOfReviewee.isEmpty() ? 0.0 : totalRating / allReviewsOfReviewee.size();
        reviewee.setRating(avgRating);
        userRepository.save(reviewee);

        return ReviewResponse.fromEntity(saved);
    }

    public List<ReviewResponse> getReviewsByReviewee(Long revieweeId) {
        return reviewRepository.findByRevieweeId(revieweeId).stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getReviewsByProject(Long projectId) {
        return reviewRepository.findByProjectId(projectId).stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
