package com.aitasker.service;

import com.aitasker.dto.ProjectResponse;
import com.aitasker.entity.*;
import com.aitasker.enums.JobStatus;
import com.aitasker.enums.ProjectStatus;
import com.aitasker.enums.ProposalStatus;
import com.aitasker.exception.BadRequestException;
import com.aitasker.exception.ResourceNotFoundException;
import com.aitasker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;
    private final JobPostRepository jobPostRepository;
    private final ServiceListingRepository serviceListingRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProjectResponse createProjectFromProposal(Long proposalId, String clientEmail) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", proposalId));

        JobPost jobPost = proposal.getJobPost();
        if (!jobPost.getClient().getEmail().equals(clientEmail)) {
            throw new BadRequestException("You are not authorized to start a project from this proposal.");
        }

        // Accept the proposal
        proposal.setStatus(ProposalStatus.ACCEPTED);
        proposalRepository.save(proposal);

        // Reject other proposals
        List<Proposal> otherProposals = proposalRepository.findByJobPostId(jobPost.getId());
        for (Proposal other : otherProposals) {
            if (!other.getId().equals(proposal.getId()) && other.getStatus() == ProposalStatus.PENDING) {
                other.setStatus(ProposalStatus.REJECTED);
                proposalRepository.save(other);
            }
        }

        // Update Job Post status
        jobPost.setStatus(JobStatus.IN_PROGRESS);
        jobPostRepository.save(jobPost);

        // Create Project
        Project project = Project.builder()
                .jobPost(jobPost)
                .client(jobPost.getClient())
                .expert(proposal.getExpert())
                .title(jobPost.getTitle())
                .totalAmount(proposal.getProposedBudget())
                .status(ProjectStatus.ACTIVE)
                .startDate(LocalDateTime.now())
                .build();

        Project savedProject = projectRepository.save(project);
        return ProjectResponse.fromEntity(savedProject);
    }

    @Transactional
    public ProjectResponse createProjectFromService(Long serviceId, String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", clientEmail));

        ServiceListing serviceListing = serviceListingRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceListing", "id", serviceId));

        if (serviceListing.getExpert().getEmail().equals(clientEmail)) {
            throw new BadRequestException("You cannot order your own service.");
        }

        // Create Project
        Project project = Project.builder()
                .serviceListing(serviceListing)
                .client(client)
                .expert(serviceListing.getExpert())
                .title(serviceListing.getTitle())
                .totalAmount(serviceListing.getPrice())
                .status(ProjectStatus.ACTIVE)
                .startDate(LocalDateTime.now())
                .build();

        Project savedProject = projectRepository.save(project);
        return ProjectResponse.fromEntity(savedProject);
    }

    public ProjectResponse getProjectById(Long id, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        if (!project.getClient().getEmail().equals(email) && !project.getExpert().getEmail().equals(email)) {
            throw new BadRequestException("You are not authorized to view this project.");
        }

        return ProjectResponse.fromEntity(project);
    }

    public List<ProjectResponse> getProjectsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        List<Project> projects;
        if (user.getRole() == com.aitasker.enums.UserRole.CLIENT) {
            projects = projectRepository.findByClientId(user.getId());
        } else if (user.getRole() == com.aitasker.enums.UserRole.EXPERT) {
            projects = projectRepository.findByExpertId(user.getId());
        } else {
            projects = projectRepository.findAll();
        }

        return projects.stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponse completeProject(Long projectId, String clientEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        if (!project.getClient().getEmail().equals(clientEmail)) {
            throw new BadRequestException("Only the client can complete the project.");
        }

        project.setStatus(ProjectStatus.COMPLETED);
        project.setEndDate(LocalDateTime.now());

        if (project.getJobPost() != null) {
            JobPost job = project.getJobPost();
            job.setStatus(JobStatus.COMPLETED);
            jobPostRepository.save(job);
        }

        Project savedProject = projectRepository.save(project);
        return ProjectResponse.fromEntity(savedProject);
    }
}
