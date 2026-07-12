package com.aitasker.controller;

import com.aitasker.dto.ReviewRequest;
import com.aitasker.dto.ReviewResponse;
import com.aitasker.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@AuthenticationPrincipal UserDetails userDetails,
                                                       @Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.createReview(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByReviewee(@PathVariable Long userId) {
        List<ReviewResponse> response = reviewService.getReviewsByReviewee(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProject(@PathVariable Long projectId) {
        List<ReviewResponse> response = reviewService.getReviewsByProject(projectId);
        return ResponseEntity.ok(response);
    }
}
