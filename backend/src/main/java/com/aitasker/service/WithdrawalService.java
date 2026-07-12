package com.aitasker.service;

import com.aitasker.dto.WithdrawalRequest;
import com.aitasker.dto.WithdrawalResponse;
import com.aitasker.entity.User;
import com.aitasker.entity.Withdrawal;
import com.aitasker.exception.BadRequestException;
import com.aitasker.exception.ResourceNotFoundException;
import com.aitasker.repository.UserRepository;
import com.aitasker.repository.WithdrawalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WithdrawalService {

    private final WithdrawalRepository withdrawalRepository;
    private final UserRepository userRepository;

    @Transactional
    public WithdrawalResponse createWithdrawal(String email, WithdrawalRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        double balance = user.getBalance() != null ? user.getBalance() : 0.0;
        if (balance < request.getAmount()) {
            throw new BadRequestException("Số dư không đủ để thực hiện yêu cầu rút tiền. Số dư khả dụng: " + balance + " VND");
        }

        Withdrawal w = Withdrawal.builder()
                .user(user)
                .amount(request.getAmount())
                .bankName(request.getBankName())
                .accountNumber(request.getAccountNumber())
                .accountHolderName(request.getAccountHolderName())
                .status("PENDING")
                .build();

        // Note: We do NOT deduct balance here. We only deduct when the withdrawal is APPROVED.
        // This is safe because when calculating if user can withdraw, we can also check pending withdrawals if we want,
        // but since it's dev/demo, checking balance directly and deducting upon approval is standard.

        Withdrawal saved = withdrawalRepository.save(w);
        return WithdrawalResponse.fromEntity(saved);
    }

    public List<WithdrawalResponse> getMyWithdrawals(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return withdrawalRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(WithdrawalResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<WithdrawalResponse> getAllWithdrawals() {
        return withdrawalRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(WithdrawalResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public WithdrawalResponse approveWithdrawal(Long id) {
        Withdrawal w = withdrawalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Withdrawal", "id", id));

        if (!"PENDING".equals(w.getStatus())) {
            throw new BadRequestException("Chỉ có thể duyệt yêu cầu rút tiền đang ở trạng thái PENDING.");
        }

        User user = w.getUser();
        double balance = user.getBalance() != null ? user.getBalance() : 0.0;
        if (balance < w.getAmount()) {
            // Force status to REJECTED if balance is no longer sufficient
            w.setStatus("REJECTED");
            withdrawalRepository.save(w);
            throw new BadRequestException("Số dư tài khoản người dùng không đủ để duyệt yêu cầu này.");
        }

        // Deduct balance
        user.setBalance(balance - w.getAmount());
        userRepository.save(user);

        w.setStatus("APPROVED");
        Withdrawal saved = withdrawalRepository.save(w);
        return WithdrawalResponse.fromEntity(saved);
    }

    @Transactional
    public WithdrawalResponse rejectWithdrawal(Long id) {
        Withdrawal w = withdrawalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Withdrawal", "id", id));

        if (!"PENDING".equals(w.getStatus())) {
            throw new BadRequestException("Chỉ có thể từ chối yêu cầu rút tiền đang ở trạng thái PENDING.");
        }

        w.setStatus("REJECTED");
        Withdrawal saved = withdrawalRepository.save(w);
        return WithdrawalResponse.fromEntity(saved);
    }
}
