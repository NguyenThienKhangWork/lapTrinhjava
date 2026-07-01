package com.aitasker.controller;

import com.aitasker.dto.AdminAnalyticsResponse;
import com.aitasker.dto.UserDTO;
import com.aitasker.dto.ReviewResponse;
import com.aitasker.entity.Dispute;
import com.aitasker.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(adminService.getAllReviews());
    }

    @PutMapping("/users/{id}/toggle-lock")
    public ResponseEntity<UserDTO> toggleUserLock(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserLock(id));
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @GetMapping("/disputes")
    public ResponseEntity<List<Dispute>> getAllDisputes() {
        return ResponseEntity.ok(adminService.getAllDisputes());
    }

    @PutMapping("/disputes/{id}/resolve")
    public ResponseEntity<Dispute> resolveDispute(@PathVariable Long id, @RequestParam String resolution) {
        return ResponseEntity.ok(adminService.resolveDispute(id, resolution));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJobPost(@PathVariable Long id) {
        adminService.deleteJobPost(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteServiceListing(@PathVariable Long id) {
        adminService.deleteServiceListing(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        adminService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/projects")
    public ResponseEntity<List<com.aitasker.dto.ProjectResponse>> getAllProjects() {
        return ResponseEntity.ok(adminService.getAllProjects());
    }
}
