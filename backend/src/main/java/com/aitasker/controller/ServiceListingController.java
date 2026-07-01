package com.aitasker.controller;

import com.aitasker.dto.ServiceListingRequest;
import com.aitasker.dto.ServiceListingResponse;
import com.aitasker.service.ServiceListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceListingController {

    private final ServiceListingService serviceListingService;

    @GetMapping
    public ResponseEntity<List<ServiceListingResponse>> getAllServices() {
        return ResponseEntity.ok(serviceListingService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceListingResponse> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceListingService.getServiceById(id));
    }

    @GetMapping("/expert/{expertId}")
    public ResponseEntity<List<ServiceListingResponse>> getServicesByExpert(@PathVariable Long expertId) {
        return ResponseEntity.ok(serviceListingService.getServicesByExpert(expertId));
    }

    @PostMapping
    public ResponseEntity<ServiceListingResponse> createService(
            @Valid @RequestBody ServiceListingRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(serviceListingService.createService(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceListingResponse> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceListingRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(serviceListingService.updateService(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id, Authentication authentication) {
        serviceListingService.deleteService(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
