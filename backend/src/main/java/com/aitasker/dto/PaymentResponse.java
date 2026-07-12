package com.aitasker.dto;

import com.aitasker.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long projectId;
    private Long milestoneId;
    private Double amount;
    private PaymentStatus status;
    private String paymentMethod;
    private String escrowStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PaymentResponse fromEntity(com.aitasker.entity.Payment payment) {
        if (payment == null) return null;
        return PaymentResponse.builder()
                .id(payment.getId())
                .projectId(payment.getProject().getId())
                .milestoneId(payment.getMilestone() != null ? payment.getMilestone().getId() : null)
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .escrowStatus(payment.getEscrowStatus())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
