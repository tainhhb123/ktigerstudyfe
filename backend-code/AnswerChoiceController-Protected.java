package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.AnswerChoiceRequest;
import org.example.ktigerstudybe.dto.resp.AnswerChoiceResponse;
import org.example.ktigerstudybe.service.answerChoice.AnswerChoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answer-choices")
public class AnswerChoiceController {

    @Autowired
    private AnswerChoiceService answerChoiceService;

    // ✅ PUBLIC hoặc AUTHENTICATED - Lấy đáp án khi làm bài
    // Nếu muốn chỉ USER/ADMIN: @PreAuthorize("isAuthenticated()")
    @GetMapping("/question/{questionId}")
    public List<AnswerChoiceResponse> getChoicesByQuestion(@PathVariable Long questionId) {
        return answerChoiceService.getChoicesByQuestion(questionId);
    }

    // ✅ PUBLIC hoặc AUTHENTICATED - Xem chi tiết đáp án
    @GetMapping("/{id}")
    public ResponseEntity<AnswerChoiceResponse> getChoiceById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(answerChoiceService.getChoiceById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ⚠️ ADMIN ONLY - Tạo đáp án mới
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public AnswerChoiceResponse createChoice(@RequestBody AnswerChoiceRequest request) {
        return answerChoiceService.createChoice(request);
    }

    // ⚠️ ADMIN ONLY - Sửa đáp án
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<AnswerChoiceResponse> updateChoice(
            @PathVariable Long id,
            @RequestBody AnswerChoiceRequest request
    ) {
        try {
            return ResponseEntity.ok(answerChoiceService.updateChoice(id, request));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ⚠️ ADMIN ONLY - Xóa đáp án
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<Void> deleteChoice(@PathVariable Long id) {
        answerChoiceService.deleteChoice(id);
        return ResponseEntity.noContent().build();
    }
}
