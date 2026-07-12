package com.aitasker.controller;

import com.aitasker.dto.JobPostRequest;
import com.aitasker.dto.JobPostResponse;
import com.aitasker.service.JobPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobPostController {

    private final JobPostService jobPostService;

    @PostMapping
    public ResponseEntity<JobPostResponse> createJobPost(@AuthenticationPrincipal UserDetails userDetails,
                                                         @Valid @RequestBody JobPostRequest request) {
        JobPostResponse response = jobPostService.createJobPost(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<JobPostResponse>> getAllJobPosts() {
        List<JobPostResponse> response = jobPostService.getAllJobPosts();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostResponse> getJobPostById(@PathVariable Long id) {
        JobPostResponse response = jobPostService.getJobPostById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<JobPostResponse>> getJobPostsByClient(@PathVariable Long clientId) {
        List<JobPostResponse> response = jobPostService.getJobPostsByClient(clientId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPostResponse> updateJobPost(@PathVariable Long id,
                                                         @AuthenticationPrincipal UserDetails userDetails,
                                                         @Valid @RequestBody JobPostRequest request) {
        JobPostResponse response = jobPostService.updateJobPost(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobPost(@PathVariable Long id,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        jobPostService.deleteJobPost(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
