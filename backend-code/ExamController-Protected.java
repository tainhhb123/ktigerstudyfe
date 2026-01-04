package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.ExamRequest;
import org.example.ktigerstudybe.dto.resp.ExamResponse;
import org.example.ktigerstudybe.service.exam.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    // ⚠️ ADMIN ONLY - Lấy tất cả exam (kể cả inactive)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public List<ExamResponse> getAllExams() {
        return examService.getAllExams();
    }

    // ✅ USER + ADMIN - Lấy exam active (để user làm bài)
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<ExamResponse> getActiveExams() {
        return examService.getActiveExams();
    }

    // ✅ AUTHENTICATED - Xem chi tiết 1 exam
    // Hoặc nếu muốn public: Bỏ @PreAuthorize
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public ResponseEntity<ExamResponse> getExamById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(examService.getExamById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ⚠️ ADMIN ONLY - Tạo exam mới
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ExamResponse createExam(@RequestBody ExamRequest request) {
        return examService.createExam(request);
    }

    // ⚠️ ADMIN ONLY - Sửa exam
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<ExamResponse> updateExam(
            @PathVariable Long id,
            @RequestBody ExamRequest request
    ) {
        try {
            return ResponseEntity.ok(examService.updateExam(id, request));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ⚠️ ADMIN ONLY - Xóa exam
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }
}
