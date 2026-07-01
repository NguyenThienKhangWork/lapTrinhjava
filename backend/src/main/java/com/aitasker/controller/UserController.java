package com.aitasker.controller;

import com.aitasker.dto.UpdateProfileRequest;
import com.aitasker.dto.UserDTO;
import com.aitasker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserDTO userDTO = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestBody UpdateProfileRequest request) {
        UserDTO userDTO = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/experts")
    public ResponseEntity<List<UserDTO>> getExperts(
            @RequestParam(required = false) String skill) {
        List<UserDTO> experts = userService.getExperts(skill);
        return ResponseEntity.ok(experts);
    }
}
