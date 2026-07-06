package com.aitasker.controller;

import com.aitasker.dto.PaymentRequest;
import com.aitasker.dto.PaymentResponse;
import com.aitasker.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/payments")
    public ResponseEntity<PaymentResponse> createEscrowPayment(@AuthenticationPrincipal UserDetails userDetails,
                                                               @Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createEscrowPayment(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/payments/{id}/release")
    public ResponseEntity<PaymentResponse> releaseEscrowPayment(@PathVariable Long id,
                                                                @AuthenticationPrincipal UserDetails userDetails) {
        PaymentResponse response = paymentService.releaseEscrowPayment(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/payments/{id}/refund")
    public ResponseEntity<PaymentResponse> refundEscrowPayment(@PathVariable Long id,
                                                               @AuthenticationPrincipal UserDetails userDetails) {
        PaymentResponse response = paymentService.refundEscrowPayment(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/projects/{projectId}/payments")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByProject(@PathVariable Long projectId,
                                                                      @AuthenticationPrincipal UserDetails userDetails) {
        List<PaymentResponse> response = paymentService.getPaymentsByProject(projectId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
