package com.aitasker.repository;

import com.aitasker.entity.JobPost;
import com.aitasker.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Long> {
    List<JobPost> findByClientId(Long clientId);
    List<JobPost> findByStatus(JobStatus status);
}
