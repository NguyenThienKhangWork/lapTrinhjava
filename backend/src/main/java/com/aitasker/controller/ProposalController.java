package com.aitasker.controller;

import com.aitasker.dto.ProposalRequest;
import com.aitasker.dto.ProposalResponse;
import com.aitasker.service.ProposalService;
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
public class ProposalController {

    private final ProposalService proposalService;

    @PostMapping("/jobs/{jobId}/proposals")
    public ResponseEntity<ProposalResponse> submitProposal(@PathVariable Long jobId,
                                                           @AuthenticationPrincipal UserDetails userDetails,
                                                           @Valid @RequestBody ProposalRequest request) {
        ProposalResponse response = proposalService.submitProposal(jobId, userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/jobs/{jobId}/proposals")
    public ResponseEntity<List<ProposalResponse>> getProposalsByJob(@PathVariable Long jobId) {
        List<ProposalResponse> response = proposalService.getProposalsByJob(jobId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/proposals/my")
    public ResponseEntity<List<ProposalResponse>> getMyProposals(@AuthenticationPrincipal UserDetails userDetails) {
        List<ProposalResponse> response = proposalService.getProposalsByExpert(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/proposals/{proposalId}/accept")
    public ResponseEntity<ProposalResponse> acceptProposal(@PathVariable Long proposalId,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        ProposalResponse response = proposalService.acceptProposal(proposalId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/proposals/{proposalId}/reject")
    public ResponseEntity<ProposalResponse> rejectProposal(@PathVariable Long proposalId,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        ProposalResponse response = proposalService.rejectProposal(proposalId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
