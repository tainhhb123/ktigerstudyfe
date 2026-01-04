package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.QuestionRequest;
import org.example.ktigerstudybe.dto.resp.QuestionResponse;
import org.example.ktigerstudybe.service.question.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    /**
     * Lấy câu hỏi theo section (trong exam)
     * ✅ USER + ADMIN - User xem questions khi làm bài thi
     */
    @GetMapping("/section/{sectionId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<QuestionResponse> getQuestionsBySection(@PathVariable Long sectionId) {
        return questionService.getQuestionsBySection(sectionId);
    }

    /**
     * Xem chi tiết 1 question
     * ✅ USER + ADMIN - User xem chi tiết question khi làm bài
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<QuestionResponse> getQuestionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(questionService.getQuestionById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tạo question mới
     * ⚠️ ADMIN ONLY - Chỉ admin tạo questions cho exam
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public QuestionResponse createQuestion(@RequestBody QuestionRequest request) {
        return questionService.createQuestion(request);
    }

    /**
     * Sửa question
     * ⚠️ ADMIN ONLY - Chỉ admin sửa questions
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable Long id,
            @RequestBody QuestionRequest request
    ) {
        try {
            return ResponseEntity.ok(questionService.updateQuestion(id, request));
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
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
