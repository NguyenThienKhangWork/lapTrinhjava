package com.aitasker.service;

import com.aitasker.dto.JobPostRequest;
import com.aitasker.dto.JobPostResponse;
import com.aitasker.entity.JobPost;
import com.aitasker.entity.User;
import com.aitasker.enums.JobStatus;
import com.aitasker.exception.BadRequestException;
import com.aitasker.exception.ResourceNotFoundException;
import com.aitasker.repository.JobPostRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPostService {

    private final JobPostRepository jobPostRepository;
    private final UserRepository userRepository;

    @Transactional
    public JobPostResponse createJobPost(String email, JobPostRequest request) {
        User client = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        JobPost jobPost = JobPost.builder()
                .client(client)
                .title(request.getTitle())
                .description(request.getDescription())
                .budgetMin(request.getBudgetMin())
                .budgetMax(request.getBudgetMax())
                .timeline(request.getTimeline())
                .skillsRequired(request.getSkillsRequired())
                .type(request.getType())
                .status(JobStatus.OPEN)
                .build();

        JobPost savedJob = jobPostRepository.save(jobPost);
        return JobPostResponse.fromEntity(savedJob);
    }

    public List<JobPostResponse> getAllJobPosts() {
        return jobPostRepository.findAll().stream()
                .map(JobPostResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public JobPostResponse getJobPostById(Long id) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));
        return JobPostResponse.fromEntity(jobPost);
    }

    public List<JobPostResponse> getJobPostsByClient(Long clientId) {
        return jobPostRepository.findByClientId(clientId).stream()
                .map(JobPostResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobPostResponse updateJobPost(Long id, String email, JobPostRequest request) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));

        if (!jobPost.getClient().getEmail().equals(email)) {
            throw new BadRequestException("You are not authorized to update this job post.");
        }

        jobPost.setTitle(request.getTitle());
        jobPost.setDescription(request.getDescription());
        jobPost.setBudgetMin(request.getBudgetMin());
        jobPost.setBudgetMax(request.getBudgetMax());
        jobPost.setTimeline(request.getTimeline());
        jobPost.setSkillsRequired(request.getSkillsRequired());
        jobPost.setType(request.getType());

        JobPost updatedJob = jobPostRepository.save(jobPost);
        return JobPostResponse.fromEntity(updatedJob);
    }

    @Transactional
    public void deleteJobPost(Long id, String email) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));

        if (!jobPost.getClient().getEmail().equals(email)) {
            throw new BadRequestException("You are not authorized to delete this job post.");
        }

        jobPostRepository.delete(jobPost);
    }
}
