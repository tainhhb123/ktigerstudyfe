package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.SentenceRewritingQuestionRequest;
import org.example.ktigerstudybe.dto.resp.SentenceRewritingQuestionResponse;
import org.example.ktigerstudybe.service.sentencerewritingquestion.SentenceRewritingQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sentence-rewriting")
public class SentenceRewritingQuestionController {

    @Autowired
    private SentenceRewritingQuestionService service;

    /**
     * Xem tất cả sentence rewriting questions
     * ✅ USER + ADMIN - User xem questions để làm bài tập
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<SentenceRewritingQuestionResponse> getAll() {
        return service.getAll();
    }

    /**
     * Xem chi tiết 1 question
     * ✅ USER + ADMIN - User xem chi tiết question khi làm bài
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<SentenceRewritingQuestionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /**
     * Xem questions theo exercise
     * ✅ USER + ADMIN - User xem questions trong exercise để làm
     */
    @GetMapping("/exercise/{exerciseId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<SentenceRewritingQuestionResponse> getByExercise(@PathVariable Long exerciseId) {
        return service.getByExerciseId(exerciseId);
    }

    /**
     * Tạo question mới
     * ⚠️ ADMIN ONLY - Chỉ admin tạo questions
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public SentenceRewritingQuestionResponse create(@RequestBody SentenceRewritingQuestionRequest request) {
        return service.create(request);
    }

    /**
     * Sửa question
     * ⚠️ ADMIN ONLY - Chỉ admin sửa questions
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public SentenceRewritingQuestionResponse update(@PathVariable Long id, @RequestBody SentenceRewritingQuestionRequest request) {
        return service.update(id, request);
    }

    /**
     * Xóa question
     * ⚠️ ADMIN ONLY - Chỉ admin xóa questions
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    /**
     * Admin - Xem questions với pagination (trang quản lý)
     * ⚠️ ADMIN ONLY - Chỉ admin xem trang quản lý questions
     */
    @GetMapping("/lesson/{lessonId}/paged")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public Page<SentenceRewritingQuestionResponse> getByLessonIdPaged(
            @PathVariable Long lessonId,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return service.getByLessonIdPaged(lessonId, keyword, page, size);
    }
}
