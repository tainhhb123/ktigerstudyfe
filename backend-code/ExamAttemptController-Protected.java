package org.example.ktigerstudybe.controller;

import lombok.RequiredArgsConstructor;
import org.example.ktigerstudybe.dto.req.ExamAttemptRequest;
import org.example.ktigerstudybe.dto.resp.ExamAttemptResponse;
import org.example.ktigerstudybe.dto.resp.ExamResultResponse;
import org.example.ktigerstudybe.service.examAttempt.ExamAttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-attempts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExamAttemptController {

    private final ExamAttemptService examAttemptService;

    /**
     * Bắt đầu bài thi mới
     * POST /api/exam-attempts/start
     * ✅ USER + ADMIN - Ai cũng có thể làm bài
     */
    @PostMapping("/start")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<ExamAttemptResponse> startExam(@RequestBody ExamAttemptRequest request) {
        ExamAttemptResponse response = examAttemptService.startExam(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thông tin attempt
     * GET /api/exam-attempts/{id}
     * ✅ AUTHENTICATED - Phải đăng nhập
     * 
     * ⚠️ LƯU Ý: Nên kiểm tra trong Service:
     * - USER chỉ xem được attempt của mình
     * - ADMIN xem được tất cả
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public ResponseEntity<ExamAttemptResponse> getAttemptById(@PathVariable Long id) {
        ExamAttemptResponse response = examAttemptService.getAttemptById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách attempt của user
     * GET /api/exam-attempts/user/{userId}
     * ✅ AUTHENTICATED - User xem lịch sử của mình
     * 
     * ⚠️ LƯU Ý: Nên kiểm tra trong Service:
     * - USER chỉ xem được userId = mình
     * - ADMIN xem được tất cả userId
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public ResponseEntity<List<ExamAttemptResponse>> getAttemptsByUser(@PathVariable Long userId) {
        List<ExamAttemptResponse> responses = examAttemptService.getAttemptsByUser(userId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Nộp bài thi (tính điểm)
     * POST /api/exam-attempts/{attemptId}/submit
     * ✅ USER + ADMIN - Ai làm bài thì nộp bài
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - Chỉ người tạo attempt mới nộp được
     */
    @PostMapping("/{attemptId}/submit")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<ExamAttemptResponse> submitExam(@PathVariable Long attemptId) {
        ExamAttemptResponse response = examAttemptService.submitExam(attemptId);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy kết quả chi tiết
     * GET /api/exam-attempts/{attemptId}/result
     * ✅ AUTHENTICATED - Xem kết quả sau khi nộp bài
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - USER chỉ xem kết quả của mình
     * - ADMIN xem được tất cả
     */
    @GetMapping("/{attemptId}/result")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public ResponseEntity<ExamResultResponse> getExamResult(@PathVariable Long attemptId) {
        ExamResultResponse response = examAttemptService.getExamResult(attemptId);
        return ResponseEntity.ok(response);
    }
}
