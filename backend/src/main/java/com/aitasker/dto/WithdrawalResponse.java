package com.aitasker.dto;

import com.aitasker.entity.Withdrawal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String userFullName;
    private Double amount;
    private String bankName;
    private String accountNumber;
    private String accountHolderName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static WithdrawalResponse fromEntity(Withdrawal w) {
        if (w == null) return null;
        return WithdrawalResponse.builder()
                .id(w.getId())
                .userId(w.getUser().getId())
                .userEmail(w.getUser().getEmail())
                .userFullName(w.getUser().getFullName())
                .amount(w.getAmount())
                .bankName(w.getBankName())
                .accountNumber(w.getAccountNumber())
                .accountHolderName(w.getAccountHolderName())
                .status(w.getStatus())
                .createdAt(w.getCreatedAt())
                .updatedAt(w.getUpdatedAt())
                .build();
    }
}
