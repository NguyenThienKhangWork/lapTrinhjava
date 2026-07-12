package com.aitasker.dto;

import com.aitasker.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private UserRole role;
    private String avatar;
    private String bio;
    private String skills;
    private String certifications;
    private String portfolio;
    private Double balance;
    private Double hourlyRate;
    private Double rating;
    private Boolean isLocked;

    public static UserDTO fromEntity(com.aitasker.entity.User user) {
        if (user == null) return null;
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .skills(user.getSkills())
                .certifications(user.getCertifications())
                .portfolio(user.getPortfolio())
                .balance(user.getBalance())
                .hourlyRate(user.getHourlyRate())
                .rating(user.getRating())
                .isLocked(user.getIsLocked() != null ? user.getIsLocked() : false)
                .build();
    }
}
