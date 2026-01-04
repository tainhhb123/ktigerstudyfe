package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.GrammarTheoryRequest;
import org.example.ktigerstudybe.dto.resp.GrammarTheoryResponse;
import org.example.ktigerstudybe.service.grammarTheory.GrammarTheoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@RestController
@RequestMapping("/api/grammar-theories")
public class GrammarTheoryController {

    @Autowired
    private GrammarTheoryService grammarTheoryService;

    /**
     * Lấy danh sách tất cả grammar theory
     * ✅ USER + ADMIN - User xem grammar để học
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<GrammarTheoryResponse> getAllGrammarTheories() {
        return grammarTheoryService.getAllGrammarTheories();
    }

    /**
     * Lấy chi tiết grammar theory theo id
     * ✅ USER + ADMIN - User xem chi tiết grammar để học
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<GrammarTheoryResponse> getGrammarTheoryById(@PathVariable Long id) {
        try {
            GrammarTheoryResponse resp = grammarTheoryService.getGrammarTheoryById(id);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tạo mới grammar theory
     * ⚠️ ADMIN ONLY - Chỉ admin tạo grammar
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public GrammarTheoryResponse createGrammarTheory(@RequestBody GrammarTheoryRequest request) {
        return grammarTheoryService.createGrammarTheory(request);
    }

    /**
     * Sửa grammar theory
     * ⚠️ ADMIN ONLY - Chỉ admin sửa grammar
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<GrammarTheoryResponse> updateGrammarTheory(
            @PathVariable Long id,
            @RequestBody GrammarTheoryRequest request) {
        try {
            GrammarTheoryResponse updated = grammarTheoryService.updateGrammarTheory(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa grammar theory
     * ⚠️ ADMIN ONLY - Chỉ admin xóa grammar
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<Void> deleteGrammarTheory(@PathVariable Long id) {
        grammarTheoryService.deleteGrammarTheory(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy grammar theo lesson
     * ✅ USER + ADMIN - User xem grammar trong lesson để học
     */
    @GetMapping("/lesson/{lessonId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<GrammarTheoryResponse> getGrammarByLesson(@PathVariable Long lessonId) {
        return grammarTheoryService.getGrammarByLessonId(lessonId);
    }

    /**
     * Lấy grammar theo level
     * ✅ USER + ADMIN - User xem grammar theo level để học
     */
    @GetMapping("/level/{levelId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<GrammarTheoryResponse> getGrammarByLevel(@PathVariable Long levelId) {
        return grammarTheoryService.getGrammarByLevelId(levelId);
    }

    /**
     * Admin - Xem grammar với pagination (trang quản lý)
     * ⚠️ ADMIN ONLY - Chỉ admin xem trang quản lý grammar
     */
    @GetMapping("/lessons/{lessonId}/grammar/paged")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public Page<GrammarTheoryResponse> getGrammarPaged(
            @PathVariable Long lessonId,
            @RequestParam(required = false) String searchTerm,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return grammarTheoryService.getPagedGrammarByLesson(lessonId, searchTerm, page, size);
    }
}
