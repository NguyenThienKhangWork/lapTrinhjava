package com.aitasker.controller;

import com.aitasker.dto.*;
import com.aitasker.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/job-assistant")
    public ResponseEntity<JobPostAiResponse> improveJobPost(@RequestBody JobPostAiRequest request) {
        JobPostAiResponse response = aiService.improveJobPost(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/service-generator")
    public ResponseEntity<ServiceAiResponse> generateServiceDetails(@RequestBody ServiceAiRequest request) {
        ServiceAiResponse response = aiService.generateServiceDetails(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendations/{jobPostId}")
    public ResponseEntity<List<ExpertRecommendationResponse>> recommendExperts(@PathVariable Long jobPostId) {
        List<ExpertRecommendationResponse> response = aiService.recommendExperts(jobPostId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    public ResponseEntity<java.util.Map<String, String>> chat(@RequestBody java.util.Map<String, Object> body) {
        String message = (String) body.get("message");
        @SuppressWarnings("unchecked")
        java.util.List<java.util.Map<String, String>> history =
            (java.util.List<java.util.Map<String, String>>) body.getOrDefault("history", new java.util.ArrayList<>());
        String reply = aiService.chat(message, history);
        return ResponseEntity.ok(java.util.Map.of("reply", reply));
    }
}
