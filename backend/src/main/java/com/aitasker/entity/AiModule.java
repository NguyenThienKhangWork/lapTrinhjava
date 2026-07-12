package com.aitasker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ai_modules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiModule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String config; // JSON string

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
