package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.VocabularyTheoryRequest;
import org.example.ktigerstudybe.dto.resp.VocabularyTheoryResponse;
import org.example.ktigerstudybe.service.vocabularyTheory.VocabularyTheoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary-theories")
public class VocabularyTheoryController {

    @Autowired
    private VocabularyTheoryService vocabularyTheoryService;

    /**
     * Lấy tất cả vocabulary
     * ✅ USER + ADMIN - User xem vocabulary để học
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<VocabularyTheoryResponse> getAllVocabularyTheories() {
        return vocabularyTheoryService.getAllVocabularyTheories();
    }

    /**
     * Xem chi tiết vocabulary
     * ✅ USER + ADMIN - User xem chi tiết vocabulary
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<VocabularyTheoryResponse> getVocabularyTheoryById(@PathVariable Long id) {
        try {
            VocabularyTheoryResponse resp = vocabularyTheoryService.getVocabularyTheoryById(id);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xem vocabulary theo lesson
     * ✅ USER + ADMIN - User xem vocabulary trong lesson để học
     */
    @GetMapping("/lesson/{lessonId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<VocabularyTheoryResponse> getVocabsByLesson(@PathVariable Long lessonId) {
        return vocabularyTheoryService.getVocabulariesByLessonId(lessonId);
    }

    /**
     * Xem vocabulary theo level
     * ✅ USER + ADMIN - User xem vocabulary theo level
     */
    @GetMapping("/level/{levelId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<VocabularyTheoryResponse> getVocabsByLevel(@PathVariable Long levelId) {
        return vocabularyTheoryService.getVocabulariesByLevelId(levelId);
    }

    /**
     * Tạo vocabulary mới
     * ⚠️ ADMIN ONLY - Chỉ admin tạo vocabulary
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public VocabularyTheoryResponse createVocabularyTheory(@RequestBody VocabularyTheoryRequest request) {
        return vocabularyTheoryService.createVocabularyTheory(request);
    }

    /**
     * Sửa vocabulary
     * ⚠️ ADMIN ONLY - Chỉ admin sửa vocabulary
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<VocabularyTheoryResponse> updateVocabularyTheory(
            @PathVariable Long id,
            @RequestBody VocabularyTheoryRequest request) {
        try {
            VocabularyTheoryResponse updated = vocabularyTheoryService.updateVocabularyTheory(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa vocabulary
     * ⚠️ ADMIN ONLY - Chỉ admin xóa vocabulary
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<Void> deleteVocabularyTheory(@PathVariable Long id) {
        vocabularyTheoryService.deleteVocabularyTheory(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Admin - Xem vocabulary với pagination (trang quản lý)
     * ⚠️ ADMIN ONLY - Chỉ admin xem trang quản lý vocabulary
     */
    @GetMapping("/lessons/{lessonId}/vocab/paged")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public Page<VocabularyTheoryResponse> getVocabPaged(
            @PathVariable Long lessonId,
            @RequestParam(required = false) String searchTerm,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return vocabularyTheoryService.getPagedVocabByLesson(lessonId, searchTerm, page, size);
    }
}
