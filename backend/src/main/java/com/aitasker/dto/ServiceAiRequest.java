package com.aitasker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceAiRequest {
    private String title;
    private String category;
    private Double price;
    private String deliveryTime;
    private String description;
}
