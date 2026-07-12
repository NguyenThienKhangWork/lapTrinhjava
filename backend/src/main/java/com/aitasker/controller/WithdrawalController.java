package com.aitasker.controller;

import com.aitasker.dto.WithdrawalRequest;
import com.aitasker.dto.WithdrawalResponse;
import com.aitasker.service.WithdrawalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/withdrawals")
@RequiredArgsConstructor
public class WithdrawalController {

    private final WithdrawalService withdrawalService;

    @PostMapping
    public ResponseEntity<WithdrawalResponse> createWithdrawal(@AuthenticationPrincipal UserDetails userDetails,
                                                               @Valid @RequestBody WithdrawalRequest request) {
        WithdrawalResponse response = withdrawalService.createWithdrawal(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<WithdrawalResponse>> getMyWithdrawals(@AuthenticationPrincipal UserDetails userDetails) {
        List<WithdrawalResponse> response = withdrawalService.getMyWithdrawals(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<WithdrawalResponse>> getAllWithdrawals() {
        List<WithdrawalResponse> response = withdrawalService.getAllWithdrawals();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<WithdrawalResponse> approveWithdrawal(@PathVariable Long id) {
        WithdrawalResponse response = withdrawalService.approveWithdrawal(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<WithdrawalResponse> rejectWithdrawal(@PathVariable Long id) {
        WithdrawalResponse response = withdrawalService.rejectWithdrawal(id);
        return ResponseEntity.ok(response);
    }
}
