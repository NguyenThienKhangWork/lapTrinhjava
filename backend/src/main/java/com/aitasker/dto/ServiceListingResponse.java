package com.aitasker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceListingResponse {
    private Long id;
    private UserDTO expert;
    private String title;
    private String description;
    private Double price;
    private String deliveryTime;
    private String category;
    private LocalDateTime createdAt;
}
