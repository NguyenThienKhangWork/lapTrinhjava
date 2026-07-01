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
public class AdminAnalyticsResponse {
    private Double totalRevenue;
    private Long totalTransactions;
    private Long newUsersCount;
    private List<ExpertStat> topExperts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExpertStat {
        private String name;
        private Double rating;
        private Double income;
    }
}
