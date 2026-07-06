package com.aitasker.service;

import com.aitasker.dto.MilestoneRequest;
import com.aitasker.dto.MilestoneResponse;
import com.aitasker.dto.MilestoneSubmitRequest;
import com.aitasker.dto.MilestoneApproveRequest;
import com.aitasker.entity.Milestone;
import com.aitasker.entity.Payment;
import com.aitasker.entity.Project;
import com.aitasker.entity.User;
import com.aitasker.enums.MilestoneStatus;
import com.aitasker.enums.PaymentStatus;
import com.aitasker.exception.BadRequestException;
import com.aitasker.exception.ResourceNotFoundException;
import com.aitasker.repository.MilestoneRepository;
import com.aitasker.repository.PaymentRepository;
import com.aitasker.repository.ProjectRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Transactional
    public MilestoneResponse createMilestone(Long projectId, String clientEmail, MilestoneRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        if (!project.getClient().getEmail().equals(clientEmail)) {
            throw new BadRequestException("Only the client can create project milestones.");
        }

        Milestone milestone = Milestone.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .amount(request.getAmount())
                .dueDate(request.getDueDate())
                .status(MilestoneStatus.PENDING)
                .build();

        Milestone saved = milestoneRepository.save(milestone);
        return MilestoneResponse.fromEntity(saved);
    }

    public List<MilestoneResponse> getMilestonesByProject(Long projectId, String email) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        if (!project.getClient().getEmail().equals(email) && !project.getExpert().getEmail().equals(email)) {
            throw new BadRequestException("You are not authorized to view this project's milestones.");
        }

        return milestoneRepository.findByProjectId(projectId).stream()
                .map(MilestoneResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public MilestoneResponse submitMilestone(Long milestoneId, String expertEmail, MilestoneSubmitRequest request) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "id", milestoneId));

        Project project = milestone.getProject();
        if (!project.getExpert().getEmail().equals(expertEmail)) {
            throw new BadRequestException("Only the project expert can submit milestone work.");
        }

        if (milestone.getStatus() != MilestoneStatus.PENDING) {
            throw new BadRequestException("Milestone is not in PENDING state.");
        }

        milestone.setDeliverables(request.getDeliverables());
        milestone.setStatus(MilestoneStatus.SUBMITTED);
        Milestone saved = milestoneRepository.save(milestone);
        return MilestoneResponse.fromEntity(saved);
    }

    @Transactional
    public MilestoneResponse approveMilestone(Long milestoneId, String clientEmail, MilestoneApproveRequest request) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "id", milestoneId));

        Project project = milestone.getProject();
        if (!project.getClient().getEmail().equals(clientEmail)) {
            throw new BadRequestException("Only the project client can approve milestone work.");
        }

        if (milestone.getStatus() != MilestoneStatus.SUBMITTED) {
            throw new BadRequestException("Milestone must be in SUBMITTED state to be approved.");
        }

        milestone.setFeedback(request.getFeedback());
        milestone.setStatus(MilestoneStatus.APPROVED);
        Milestone saved = milestoneRepository.save(milestone);

        // Find the payment associated with this milestone and release it
        List<Payment> payments = paymentRepository.findByProjectId(project.getId());
        for (Payment payment : payments) {
            if (payment.getMilestone() != null && payment.getMilestone().getId().equals(milestoneId)) {
                if (payment.getStatus() == PaymentStatus.ESCROWED) {
                    payment.setStatus(PaymentStatus.RELEASED);
                    payment.setEscrowStatus("RELEASED");
                    paymentRepository.save(payment);

                    // Add to Expert balance
                    User expert = project.getExpert();
                    if (expert != null) {
                        double currentBalance = expert.getBalance() != null ? expert.getBalance() : 0.0;
                        expert.setBalance(currentBalance + payment.getAmount());
                        userRepository.save(expert);
                    }
                }
            }
        }

        return MilestoneResponse.fromEntity(saved);
    }
}
