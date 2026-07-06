package com.aitasker.controller;

import com.aitasker.dto.MilestoneRequest;
import com.aitasker.dto.MilestoneResponse;
import com.aitasker.dto.MilestoneSubmitRequest;
import com.aitasker.dto.MilestoneApproveRequest;
import com.aitasker.service.MilestoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;

    @PostMapping("/projects/{projectId}/milestones")
    public ResponseEntity<MilestoneResponse> createMilestone(@PathVariable Long projectId,
                                                             @AuthenticationPrincipal UserDetails userDetails,
                                                             @Valid @RequestBody MilestoneRequest request) {
        MilestoneResponse response = milestoneService.createMilestone(projectId, userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/projects/{projectId}/milestones")
    public ResponseEntity<List<MilestoneResponse>> getMilestonesByProject(@PathVariable Long projectId,
                                                                          @AuthenticationPrincipal UserDetails userDetails) {
        List<MilestoneResponse> response = milestoneService.getMilestonesByProject(projectId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/milestones/{id}/submit")
    public ResponseEntity<MilestoneResponse> submitMilestone(@PathVariable Long id,
                                                             @AuthenticationPrincipal UserDetails userDetails,
                                                             @RequestBody MilestoneSubmitRequest request) {
        MilestoneResponse response = milestoneService.submitMilestone(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/milestones/{id}/approve")
    public ResponseEntity<MilestoneResponse> approveMilestone(@PathVariable Long id,
                                                              @AuthenticationPrincipal UserDetails userDetails,
                                                              @RequestBody MilestoneApproveRequest request) {
        MilestoneResponse response = milestoneService.approveMilestone(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }
}
