package com.aitasker.service;

import org.springframework.stereotype.Service;

@Service
public class ProposalService {

    public String submitProposal() {
        return "Proposal submitted";
    }

    public String acceptProposal(Long id) {
        return "Proposal accepted " + id;
    }

    public String rejectProposal(Long id) {
        return "Proposal rejected " + id;
    }
}