package com.aitasker.controller;

import com.aitasker.service.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService proposalService;

    @PostMapping
    public String submitProposal() {
        return proposalService.submitProposal();
    }

    @PutMapping("/{id}/accept")
    public String acceptProposal(@PathVariable Long id) {
        return proposalService.acceptProposal(id);
    }

    @PutMapping("/{id}/reject")
    public String rejectProposal(@PathVariable Long id) {
        return proposalService.rejectProposal(id);
    }
}