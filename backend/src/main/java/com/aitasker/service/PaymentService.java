package com.aitasker.service;

import com.aitasker.dto.PaymentRequest;
import com.aitasker.dto.PaymentResponse;
import com.aitasker.entity.Milestone;
import com.aitasker.entity.Payment;
import com.aitasker.entity.Project;
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
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;

    @Transactional
    public PaymentResponse createEscrowPayment(String clientEmail, PaymentRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        if (!project.getClient().getEmail().equals(clientEmail)) {
            throw new BadRequestException("Only the client can fund this project.");
        }

        Milestone milestone = null;
        if (request.getMilestoneId() != null) {
            milestone = milestoneRepository.findById(request.getMilestoneId())
                    .orElseThrow(() -> new ResourceNotFoundException("Milestone", "id", request.getMilestoneId()));
        }

        Payment payment = Payment.builder()
                .project(project)
                .milestone(milestone)
                .amount(request.getAmount())
                .status(PaymentStatus.ESCROWED)
                .paymentMethod(request.getPaymentMethod())
                .escrowStatus("HELD")
                .build();

        Payment saved = paymentRepository.save(payment);
        return PaymentResponse.fromEntity(saved);
    }

    @Transactional
    public PaymentResponse releaseEscrowPayment(Long paymentId, String clientEmail) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        if (!payment.getProject().getClient().getEmail().equals(clientEmail)) {
            throw new BadRequestException("Only the client can release escrow funds.");
        }

        if (payment.getStatus() != PaymentStatus.ESCROWED) {
            throw new BadRequestException("Payment is not in escrow.");
        }

        payment.setStatus(PaymentStatus.RELEASED);
        payment.setEscrowStatus("RELEASED");

        Payment saved = paymentRepository.save(payment);

        // Add funds to expert's balance
        com.aitasker.entity.User expert = payment.getProject().getExpert();
        if (expert != null) {
            double currentBalance = expert.getBalance() != null ? expert.getBalance() : 0.0;
            expert.setBalance(currentBalance + payment.getAmount());
            userRepository.save(expert);
        }

        return PaymentResponse.fromEntity(saved);
    }

    @Transactional
    public PaymentResponse refundEscrowPayment(Long paymentId, String clientEmail) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        if (!payment.getProject().getClient().getEmail().equals(clientEmail)) {
            throw new BadRequestException("Only the client can refund escrow funds.");
        }

        if (payment.getStatus() != PaymentStatus.ESCROWED) {
            throw new BadRequestException("Payment is not in escrow.");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setEscrowStatus("REFUNDED");

        Payment saved = paymentRepository.save(payment);
        return PaymentResponse.fromEntity(saved);
    }

    public List<PaymentResponse> getPaymentsByProject(Long projectId, String email) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        if (!project.getClient().getEmail().equals(email) && !project.getExpert().getEmail().equals(email)) {
            throw new BadRequestException("You are not authorized to view this project's payments.");
        }

        return paymentRepository.findByProjectId(projectId).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
