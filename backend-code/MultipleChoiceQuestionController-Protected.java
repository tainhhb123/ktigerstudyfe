package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.MultipleChoiceQuestionRequest;
import org.example.ktigerstudybe.dto.resp.MultipleChoiceQuestionResponse;
import org.example.ktigerstudybe.service.multiplechoicequestion.MultipleChoiceQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mcq")
public class MultipleChoiceQuestionController {

    @Autowired
    private MultipleChoiceQuestionService service;

    /**
     * Xem tất cả multiple choice questions
     * ✅ USER + ADMIN - User xem questions để làm bài tập
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<MultipleChoiceQuestionResponse> getAll() {
        return service.getAll();
    }

    /**
     * Xem chi tiết 1 question
     * ✅ USER + ADMIN - User xem chi tiết question khi làm bài
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<MultipleChoiceQuestionResponse> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xem questions theo exercise
     * ✅ USER + ADMIN - User xem questions trong exercise để làm
     */
    @GetMapping("/exercise/{exerciseId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<MultipleChoiceQuestionResponse> getByExercise(@PathVariable Long exerciseId) {
        return service.getByExerciseId(exerciseId);
    }

    /**
     * Tạo question mới
     * ⚠️ ADMIN ONLY - Chỉ admin tạo questions
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public MultipleChoiceQuestionResponse create(@RequestBody MultipleChoiceQuestionRequest request) {
        return service.create(request);
    }

    /**
     * Sửa question
     * ⚠️ ADMIN ONLY - Chỉ admin sửa questions
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<MultipleChoiceQuestionResponse> update(@PathVariable Long id, @RequestBody MultipleChoiceQuestionRequest request) {
        try {
            return ResponseEntity.ok(service.update(id, request));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa question
     * ⚠️ ADMIN ONLY - Chỉ admin xóa questions
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Admin - Xem questions với pagination (trang quản lý)
     * ⚠️ ADMIN ONLY - Chỉ admin xem trang quản lý questions
     */
    @GetMapping("/lesson/{lessonId}/paged")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public Page<MultipleChoiceQuestionResponse> getByLessonIdPaged(
            @PathVariable Long lessonId,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return service.getByLessonIdPaged(lessonId, keyword, page, size);
    }
}
