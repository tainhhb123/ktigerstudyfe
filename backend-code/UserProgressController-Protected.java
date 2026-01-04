package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.UserProgressRequest;
import org.example.ktigerstudybe.dto.resp.UserProgressDTO;
import org.example.ktigerstudybe.dto.resp.UserProgressResponse;
import org.example.ktigerstudybe.model.UserProgress;
import org.example.ktigerstudybe.service.userprogress.UserProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-progress")
public class UserProgressController {

    @Autowired
    private UserProgressService userProgressService;

    /**
     * Complete lesson - User hoàn thành bài học
     * ✅ USER + ADMIN - User complete lesson để cập nhật tiến trình
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - User chỉ complete lesson với userId = mình
     */
    @PostMapping("/complete")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<Map<String, String>> completeLesson(@RequestBody UserProgressRequest request) {
        userProgressService.completeLesson(request.getUserId(), request.getLessonId());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Tiến trình học đã được cập nhật");
        return ResponseEntity.ok(response);
    }

    /**
     * Admin - Xem tất cả user progress với pagination
     * ⚠️ ADMIN ONLY - Trang quản lý tiến trình học của learners
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public Page<UserProgressResponse> getUserProgressList(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return userProgressService.getUserProgressList(keyword, pageable);
    }

    /**
     * Lấy progress của user - Cho Profile page
     * ✅ AUTHENTICATED - User xem progress của mình
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - USER chỉ xem progress với userId = mình
     * - ADMIN xem được tất cả userId
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public ResponseEntity<List<UserProgressDTO>> getUserProgress(@PathVariable Long userId) {
        try {
            List<UserProgress> progressList = userProgressService.findByUserId(userId);

            // Convert sang DTO để tránh infinite recursion
            List<UserProgressDTO> dtoList = progressList.stream()
                    .map(p -> UserProgressDTO.builder()
                            .progressId(p.getProgressId())
                            .lessonId(p.getLesson() != null ? p.getLesson().getLessonId() : null)
                            .lessonName(p.getLesson() != null ? p.getLesson().getLessonName() : null)
                            .lastAccessed(p.getLastAccessed())
                            .isLessonCompleted(p.getIsLessonCompleted())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
