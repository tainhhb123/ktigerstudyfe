package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.ExamSectionRequest;
import org.example.ktigerstudybe.dto.resp.ExamSectionResponse;
import org.example.ktigerstudybe.service.examSection.ExamSectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-sections")
public class ExamSectionController {

    @Autowired
    private ExamSectionService examSectionService;

    /**
     * Lấy sections theo exam
     * ✅ USER + ADMIN - User cần xem sections để làm bài thi
     */
    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<ExamSectionResponse> getSectionsByExam(@PathVariable Long examId) {
        return examSectionService.getSectionsByExam(examId);
    }

    /**
     * Xem chi tiết 1 section
     * ✅ USER + ADMIN - User xem chi tiết section khi làm bài
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<ExamSectionResponse> getSectionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(examSectionService.getSectionById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tạo section mới
     * ⚠️ ADMIN ONLY - Chỉ admin tạo sections cho exam
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ExamSectionResponse createSection(@RequestBody ExamSectionRequest request) {
        return examSectionService.createSection(request);
    }

    /**
     * Sửa section
     * ⚠️ ADMIN ONLY - Chỉ admin sửa sections
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<ExamSectionResponse> updateSection(
            @PathVariable Long id,
            @RequestBody ExamSectionRequest request
    ) {
        try {
            return ResponseEntity.ok(examSectionService.updateSection(id, request));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa section
     * ⚠️ ADMIN ONLY - Chỉ admin xóa sections
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        examSectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
