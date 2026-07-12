package com.aitasker.service;

import com.aitasker.dto.ServiceListingRequest;
import com.aitasker.dto.ServiceListingResponse;
import com.aitasker.dto.UserDTO;
import com.aitasker.entity.ServiceListing;
import com.aitasker.entity.User;
import com.aitasker.repository.ServiceListingRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceListingService {

    private final ServiceListingRepository serviceListingRepository;
    private final UserRepository userRepository;

    public List<ServiceListingResponse> getAllServices() {
        return serviceListingRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ServiceListingResponse> getServicesByExpert(Long expertId) {
        return serviceListingRepository.findByExpertId(expertId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ServiceListingResponse getServiceById(Long id) {
        ServiceListing service = serviceListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + id));
        return toResponse(service);
    }

    public ServiceListingResponse createService(ServiceListingRequest request, String userEmail) {
        User expert = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));

        ServiceListing service = ServiceListing.builder()
                .expert(expert)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .deliveryTime(request.getDeliveryTime())
                .category(request.getCategory())
                .createdAt(LocalDateTime.now())
                .build();

        ServiceListing saved = serviceListingRepository.save(service);
        return toResponse(saved);
    }

    public ServiceListingResponse updateService(Long id, ServiceListingRequest request, String userEmail) {
        ServiceListing service = serviceListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ."));

        if (!service.getExpert().getEmail().equals(userEmail)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa dịch vụ này.");
        }

        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDeliveryTime(request.getDeliveryTime());
        service.setCategory(request.getCategory());

        ServiceListing saved = serviceListingRepository.save(service);
        return toResponse(saved);
    }

    public void deleteService(Long id, String userEmail) {
        ServiceListing service = serviceListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ."));

        if (!service.getExpert().getEmail().equals(userEmail)) {
            throw new RuntimeException("Bạn không có quyền xóa dịch vụ này.");
        }

        serviceListingRepository.delete(service);
    }

    private ServiceListingResponse toResponse(ServiceListing service) {
        return ServiceListingResponse.builder()
                .id(service.getId())
                .expert(UserDTO.fromEntity(service.getExpert()))
                .title(service.getTitle())
                .description(service.getDescription())
                .price(service.getPrice())
                .deliveryTime(service.getDeliveryTime())
                .category(service.getCategory())
                .createdAt(service.getCreatedAt())
                .build();
    }
}
