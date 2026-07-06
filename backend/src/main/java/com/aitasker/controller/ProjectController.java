package com.aitasker.controller;

import com.aitasker.dto.ProjectResponse;
import com.aitasker.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/proposal/{proposalId}")
    public ResponseEntity<ProjectResponse> createProjectFromProposal(@PathVariable Long proposalId,
                                                                     @AuthenticationPrincipal UserDetails userDetails) {
        ProjectResponse response = projectService.createProjectFromProposal(proposalId, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/service/{serviceId}")
    public ResponseEntity<ProjectResponse> createProjectFromService(@PathVariable Long serviceId,
                                                                    @AuthenticationPrincipal UserDetails userDetails) {
        ProjectResponse response = projectService.createProjectFromService(serviceId, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        ProjectResponse response = projectService.getProjectById(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(@AuthenticationPrincipal UserDetails userDetails) {
        List<ProjectResponse> response = projectService.getProjectsByUser(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ProjectResponse> completeProject(@PathVariable Long id,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        ProjectResponse response = projectService.completeProject(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
