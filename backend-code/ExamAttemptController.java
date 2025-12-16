package org.example.ktigerstudybe.controller;

import lombok.RequiredArgsConstructor;
import org.example.ktigerstudybe.dto.req.ExamAttemptRequest;
import org.example.ktigerstudybe.dto.resp.ExamAttemptResponse;
import org.example.ktigerstudybe.dto.resp.ExamResultResponse;
import org.example.ktigerstudybe.service.examAttempt.ExamAttemptService;
import org.springframework.http.ResponseEntity;
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
     */
    @PostMapping("/start")
    public ResponseEntity<ExamAttemptResponse> startExam(@RequestBody ExamAttemptRequest request) {
        ExamAttemptResponse response = examAttemptService.startExam(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thông tin attempt
     * GET /api/exam-attempts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExamAttemptResponse> getAttemptById(@PathVariable Long id) {
        ExamAttemptResponse response = examAttemptService.getAttemptById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách attempt của user
     * GET /api/exam-attempts/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExamAttemptResponse>> getAttemptsByUser(@PathVariable Long userId) {
        List<ExamAttemptResponse> responses = examAttemptService.getAttemptsByUser(userId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Nộp bài thi (tính điểm)
     * POST /api/exam-attempts/{attemptId}/submit
     */
    @PostMapping("/{attemptId}/submit")
    public ResponseEntity<ExamAttemptResponse> submitExam(@PathVariable Long attemptId) {
        ExamAttemptResponse response = examAttemptService.submitExam(attemptId);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy kết quả chi tiết
     * GET /api/exam-attempts/{attemptId}/result
     */
    @GetMapping("/{attemptId}/result")
    public ResponseEntity<ExamResultResponse> getExamResult(@PathVariable Long attemptId) {
        ExamResultResponse response = examAttemptService.getExamResult(attemptId);
        return ResponseEntity.ok(response);
    }
}
