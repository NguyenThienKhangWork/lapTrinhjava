package com.aitasker.repository;

import com.aitasker.entity.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByJobPostId(Long jobPostId);
    List<Proposal> findByExpertId(Long expertId);
}
