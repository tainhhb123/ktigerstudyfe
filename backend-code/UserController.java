package org.example.ktigerstudybe.controller;

import lombok.RequiredArgsConstructor;
import org.example.ktigerstudybe.entity.User;
import org.example.ktigerstudybe.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class UserController {

    private final UserRepository userRepository;

    /**
     * GET /api/user/profile
     * Lấy thông tin user từ JWT token
     * Yêu cầu: Bearer Token trong Authorization header
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            // Lấy user_id từ JWT (đã được parse bởi JwtAuthenticationFilter)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Unauthorized: No valid JWT token");
            }
            
            // Get user_id từ principal (String)
            String userIdStr = authentication.getName();
            Long userId = Long.parseLong(userIdStr);
            
            // Tìm user trong database
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            // Tạo response (không trả về password)
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("role", user.getRole());
            response.put("avatarUrl", user.getAvatarUrl());
            response.put("createdAt", user.getCreatedAt());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in getProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}
