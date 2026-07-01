package com.aitasker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceAiResponse {
    private String description;
    private String deliveryProcess;
    private Double price;
    private String deliveryTime;
    private List<String> keywords;
}
