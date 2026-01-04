package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.ExerciseRequest;
import org.example.ktigerstudybe.dto.resp.ExerciseResponse;
import org.example.ktigerstudybe.service.exercise.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    /**
     * Xem tất cả exercises
     * ✅ USER + ADMIN - User xem exercises để học
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<ExerciseResponse> getAllExercises() {
        return exerciseService.getAllExercises();
    }

    /**
     * Xem chi tiết 1 exercise
     * ✅ USER + ADMIN - User xem chi tiết để làm bài tập
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<ExerciseResponse> getExerciseById(@PathVariable Long id) {
        try {
            ExerciseResponse resp = exerciseService.getExerciseById(id);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xem exercises theo lesson
     * ✅ USER + ADMIN - User xem exercises trong lesson để học
     */
    @GetMapping("/lesson/{lessonId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<ExerciseResponse> getExercisesByLesson(@PathVariable Long lessonId) {
        return exerciseService.getExercisesByLessonId(lessonId);
    }

    /**
     * Tạo exercise mới
     * ⚠️ ADMIN ONLY - Chỉ admin tạo exercises
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ExerciseResponse createExercise(@RequestBody ExerciseRequest request) {
        return exerciseService.createExercise(request);
    }

    /**
     * Sửa exercise
     * ⚠️ ADMIN ONLY - Chỉ admin sửa exercises
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<ExerciseResponse> updateExercise(
            @PathVariable Long id,
            @RequestBody ExerciseRequest request) {
        try {
            ExerciseResponse updated = exerciseService.updateExercise(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa exercise
     * ⚠️ ADMIN ONLY - Chỉ admin xóa exercises
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Admin - Xem exercises với pagination (trang quản lý)
     * ⚠️ ADMIN ONLY - Chỉ admin xem trang quản lý exercises
     */
    @GetMapping("/lesson/{lessonId}/paged")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public Page<ExerciseResponse> getExercisesByLessonPaged(
            @PathVariable Long lessonId,
            @RequestParam(defaultValue = "") String title,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return exerciseService.getExercisesByLessonIdPaged(lessonId, title, page, size);
    }
}
