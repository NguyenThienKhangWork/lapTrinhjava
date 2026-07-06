package com.aitasker.entity;

import com.aitasker.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private String avatar;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String skills; // Comma-separated values

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(columnDefinition = "TEXT")
    private String portfolio;

    private Double balance;

    @Column(name = "hourly_rate")
    private Double hourlyRate;

    private Double rating;

    @Column(name = "is_locked")
    private Boolean isLocked;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (rating == null) {
            rating = 0.0;
        }
        if (balance == null) {
            balance = 0.0;
        }
        if (isLocked == null) {
            isLocked = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
