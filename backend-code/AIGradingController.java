package org.example.ktigerstudybe.controller;

import lombok.RequiredArgsConstructor;
import org.example.ktigerstudybe.dto.req.WritingGradingRequest;
import org.example.ktigerstudybe.dto.resp.WritingGradingResult;
import org.example.ktigerstudybe.service.aiGrading.AIGradingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * API Controller cho AI Grading (Groq)
 * Frontend gọi endpoint này để chấm điểm Writing
 */
@RestController
@RequestMapping("/api/ai-grading")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIGradingController {

    private final AIGradingService aiGradingService;

    /**
     * Chấm 1 bài viết
     * POST /api/ai-grading/grade-writing
     */
    @PostMapping("/grade-writing")
    public ResponseEntity<WritingGradingResult> gradeWriting(
            @RequestBody WritingGradingRequest request
    ) {
        WritingGradingResult result = aiGradingService.gradeWriting(request);
        return ResponseEntity.ok(result);
    }

    /**
     * Chấm nhiều bài viết cùng lúc
     * POST /api/ai-grading/grade-multiple
     */
    @PostMapping("/grade-multiple")
    public ResponseEntity<Map<Integer, WritingGradingResult>> gradeMultiple(
            @RequestBody Map<String, Object> payload
    ) {
        // Extract requests from payload
        // ...
        return ResponseEntity.ok(Map.of());
    }
}
