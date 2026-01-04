package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.LessonRequest;
import org.example.ktigerstudybe.dto.resp.LessonResponse;
import org.example.ktigerstudybe.dto.resp.LessonWithProgressResponse;
import org.example.ktigerstudybe.service.lesson.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    /**
     * Lấy tất cả bài học hoặc theo Level
     * ✅ USER + ADMIN - User xem lessons để học
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<LessonResponse> getLessons(@RequestParam(required = false) Long levelId) {
        if (levelId != null) {
            return lessonService.getLessonsByLevelId(levelId);
        }
        return lessonService.getAllLessons();
    }

    /**
     * Xem chi tiết 1 lesson
     * ✅ USER + ADMIN - User xem chi tiết lesson để học
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public LessonResponse getLessonById(@PathVariable Long id) {
        return lessonService.getLessonById(id);
    }

    /**
     * Tạo lesson mới
     * ⚠️ ADMIN ONLY - Chỉ admin tạo lessons
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public LessonResponse createLesson(@RequestBody LessonRequest lessonRequest) {
        return lessonService.createLesson(lessonRequest);
    }

    /**
     * Sửa lesson
     * ⚠️ ADMIN ONLY - Chỉ admin sửa lessons
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public LessonResponse updateLesson(@PathVariable Long id, @RequestBody LessonRequest lessonRequest) {
        return lessonService.updateLesson(id, lessonRequest);
    }

    /**
     * Xóa lesson
     * ⚠️ ADMIN ONLY - Chỉ admin xóa lessons
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Xem lessons với progress của user
     * ✅ AUTHENTICATED - User xem progress của mình
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - User chỉ xem progress với userId = mình
     * - Admin xem được tất cả userId
     */
    @GetMapping("/progress")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public List<LessonWithProgressResponse> getLessonsWithProgress(
            @RequestParam Long levelId,
            @RequestParam Long userId
    ) {
        return lessonService.getLessonsWithProgress(levelId, userId);
    }

    /**
     * Complete lesson - User hoàn thành bài học
     * ✅ USER + ADMIN - User complete lesson để nhận XP
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - User chỉ complete cho userId = mình
     */
    @PostMapping("/complete")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public Map<String, Object> completeLesson(
            @RequestParam Long userId,
            @RequestParam Long lessonId,
            @RequestParam Integer score
    ) {
        return lessonService.completeLesson(userId, lessonId, score);
    }

    /**
     * Admin - Xem lessons với pagination (trang quản lý)
     * ⚠️ ADMIN ONLY - Chỉ admin xem trang quản lý lessons
     */
    @GetMapping("/paged")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<Page<LessonResponse>> getLessonsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) Long levelId,
            @RequestParam(required = false) String keyword
    ) {
        Page<LessonResponse> result = lessonService.getLessons(page, size, levelId, keyword);
        return ResponseEntity.ok(result);
    }
}
