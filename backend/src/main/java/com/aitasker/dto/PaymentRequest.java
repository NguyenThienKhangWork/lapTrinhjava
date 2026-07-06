package com.aitasker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Long milestoneId;

    @NotNull(message = "Amount is required")
    private Double amount;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
