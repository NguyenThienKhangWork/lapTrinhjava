package com.aitasker.service;

import org.springframework.stereotype.Service;

@Service
public class JobPostService {

    public String createJobPost() {
        return "Create JobPost";
    }

    public String getAllJobPosts() {
        return "All JobPosts";
    }

    public String getJobPostById(Long id) {
        return "JobPost " + id;
    }

    public String updateJobPost(Long id) {
        return "Update JobPost " + id;
    }

    public String deleteJobPost(Long id) {
        return "Delete JobPost " + id;
    }
}