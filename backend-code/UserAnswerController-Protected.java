package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.UserAnswerRequest;
import org.example.ktigerstudybe.dto.resp.UserAnswerResponse;
import org.example.ktigerstudybe.service.userAnswer.UserAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-answers")
public class UserAnswerController {

    @Autowired
    private UserAnswerService userAnswerService;

    /**
     * User trả lời câu hỏi trong exam
     * ✅ USER + ADMIN - User lưu câu trả lời khi làm bài
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - User chỉ lưu answer cho attemptId của mình
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public UserAnswerResponse saveUserAnswer(@RequestBody UserAnswerRequest request) {
        return userAnswerService.saveUserAnswer(request);
    }

    /**
     * Lấy toàn bộ câu trả lời của 1 attempt
     * ✅ AUTHENTICATED - User xem câu trả lời của attempt mình
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - User chỉ xem answers của attempt mình tạo
     * - Admin xem được tất cả attempts
     */
    @GetMapping("/attempt/{attemptId}")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public List<UserAnswerResponse> getAnswersByAttempt(@PathVariable Long attemptId) {
        return userAnswerService.getAnswersByAttempt(attemptId);
    }
}
