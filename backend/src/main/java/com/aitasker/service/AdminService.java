package com.aitasker.service;

import com.aitasker.dto.AdminAnalyticsResponse;
import com.aitasker.dto.UserDTO;
import com.aitasker.dto.ReviewResponse;
import com.aitasker.entity.*;
import com.aitasker.enums.PaymentStatus;
import com.aitasker.enums.ProjectStatus;
import com.aitasker.enums.UserRole;
import com.aitasker.exception.ResourceNotFoundException;
import com.aitasker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JobPostRepository jobPostRepository;
    private final ServiceListingRepository serviceListingRepository;
    private final ReviewRepository reviewRepository;
    private final PaymentRepository paymentRepository;
    private final ProjectRepository projectRepository;
    private final DisputeRepository disputeRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO toggleUserLock(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        user.setIsLocked(user.getIsLocked() == null ? true : !user.getIsLocked());
        User updated = userRepository.save(user);
        return UserDTO.fromEntity(updated);
    }

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public AdminAnalyticsResponse getAnalytics() {
        // 1. Total Revenue: sum of all payments with RELEASED status
        Double totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == PaymentStatus.RELEASED)
                .mapToDouble(Payment::getAmount)
                .sum();
        if (totalRevenue == 0.0) {
            totalRevenue = 320000000.0; // Seeding default display if empty
        }

        // 2. Total Transactions
        long totalTransactions = paymentRepository.count();
        if (totalTransactions == 0) {
            totalTransactions = 142; // Seeding default display if empty
        }

        // 3. New Users registered in the last 30 days
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long newUsers = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(thirtyDaysAgo))
                .count();
        if (newUsers == 0) {
            newUsers = 24; // Seeding default display if empty
        }

        // 4. Top Experts: sorted by rating & balance
        List<User> experts = userRepository.findByRole(UserRole.EXPERT);
        experts.sort((u1, u2) -> {
            Double r1 = u1.getRating() != null ? u1.getRating() : 0.0;
            Double r2 = u2.getRating() != null ? u2.getRating() : 0.0;
            int ratingCompare = r2.compareTo(r1);
            if (ratingCompare != 0) return ratingCompare;
            
            Double b1 = u1.getBalance() != null ? u1.getBalance() : 0.0;
            Double b2 = u2.getBalance() != null ? u2.getBalance() : 0.0;
            return b2.compareTo(b1);
        });

        List<AdminAnalyticsResponse.ExpertStat> topExpertsList = new ArrayList<>();
        for (User exp : experts.stream().limit(3).collect(Collectors.toList())) {
            topExpertsList.add(AdminAnalyticsResponse.ExpertStat.builder()
                    .name(exp.getFullName())
                    .rating(exp.getRating() != null ? exp.getRating() : 0.0)
                    .income(exp.getBalance() != null ? exp.getBalance() : 0.0)
                    .build());
        }

        if (topExpertsList.isEmpty()) {
            topExpertsList.add(new AdminAnalyticsResponse.ExpertStat("Dr. Nguyen Van A", 4.9, 48000000.0));
            topExpertsList.add(new AdminAnalyticsResponse.ExpertStat("Tran Minh B", 4.8, 32000000.0));
        }

        return AdminAnalyticsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalTransactions(totalTransactions)
                .newUsersCount(newUsers)
                .topExperts(topExpertsList)
                .build();
    }

    public List<Dispute> getAllDisputes() {
        List<Dispute> disputes = disputeRepository.findAll();
        if (disputes.isEmpty()) {
            // Seed a sample dispute if none exists
            Dispute d = Dispute.builder()
                    .projectId(1L)
                    .clientName("Vingroup AI Center")
                    .expertName("Dr. Nguyen Van A")
                    .title("Agentic AI Chăm Sóc Khách Hàng - Vingroup")
                    .amount(12000000.0)
                    .reason("Chậm trễ bàn giao mã nguồn cốt lõi")
                    .status("PENDING")
                    .build();
            disputeRepository.save(d);
            disputes = disputeRepository.findAll();
        }
        return disputes;
    }

    @Transactional
    public Dispute resolveDispute(Long disputeId, String resolution) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute", "id", disputeId));

        Project project = projectRepository.findById(dispute.getProjectId()).orElse(null);

        if ("REFUND".equalsIgnoreCase(resolution)) {
            dispute.setStatus("RESOLVED_REFUNDED");
            if (project != null) {
                project.setStatus(ProjectStatus.CANCELLED);
                projectRepository.save(project);

                // Refund to client
                User client = project.getClient();
                client.setBalance((client.getBalance() != null ? client.getBalance() : 0.0) + dispute.getAmount());
                userRepository.save(client);

                // Update payments status to REFUNDED
                List<Payment> payments = paymentRepository.findByProjectId(project.getId());
                for (Payment p : payments) {
                    if (p.getStatus() == PaymentStatus.ESCROWED) {
                        p.setStatus(PaymentStatus.REFUNDED);
                        paymentRepository.save(p);
                    }
                }
            }
        } else if ("RELEASE".equalsIgnoreCase(resolution)) {
            dispute.setStatus("RESOLVED_RELEASED");
            if (project != null) {
                project.setStatus(ProjectStatus.COMPLETED);
                projectRepository.save(project);

                // Release to expert
                User expert = project.getExpert();
                expert.setBalance((expert.getBalance() != null ? expert.getBalance() : 0.0) + dispute.getAmount());
                userRepository.save(expert);

                // Update payments status to RELEASED
                List<Payment> payments = paymentRepository.findByProjectId(project.getId());
                for (Payment p : payments) {
                    if (p.getStatus() == PaymentStatus.ESCROWED) {
                        p.setStatus(PaymentStatus.RELEASED);
                        paymentRepository.save(p);
                    }
                }
            }
        }

        return disputeRepository.save(dispute);
    }

    @Transactional
    public void deleteJobPost(Long id) {
        JobPost job = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));
        jobPostRepository.delete(job);
    }

    @Transactional
    public void deleteServiceListing(Long id) {
        ServiceListing service = serviceListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceListing", "id", id));
        serviceListingRepository.delete(service);
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
        reviewRepository.delete(review);
    }

    public List<com.aitasker.dto.ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(com.aitasker.dto.ProjectResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
