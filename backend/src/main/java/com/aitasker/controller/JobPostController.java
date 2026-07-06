package com.aitasker.controller;

import com.aitasker.service.JobPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/job-posts")
@RequiredArgsConstructor
public class JobPostController {

    private final JobPostService jobPostService;

    @PostMapping
    public String createJobPost() {
        return jobPostService.createJobPost();
    }

    @GetMapping
    public String getAllJobPosts() {
        return jobPostService.getAllJobPosts();
    }

    @GetMapping("/{id}")
    public String getJobPostById(@PathVariable Long id) {
        return jobPostService.getJobPostById(id);
    }

    @PutMapping("/{id}")
    public String updateJobPost(@PathVariable Long id) {
        return jobPostService.updateJobPost(id);
    }

    @DeleteMapping("/{id}")
    public String deleteJobPost(@PathVariable Long id) {
        return jobPostService.deleteJobPost(id);
    }
}