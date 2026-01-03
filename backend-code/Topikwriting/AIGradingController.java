package Topikwriting;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * API Controller cho AI Grading (Groq)
 * 
 * Endpoint: POST /api/ai-grading/grade-writing
 * 
 * Lưu ý khi copy vào BE:
 * - Đổi package thành: org.example.ktigerstudybe.controller
 * - Import WritingGradingRequest, WritingGradingResult, AIGradingService từ package tương ứng
 */
@RestController
@RequestMapping("/api/ai-grading")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIGradingController {

    private final AIGradingService aiGradingService;

    /**
     * Chấm điểm 1 câu Writing
     * POST /api/ai-grading/grade-writing
     * 
     * Request Body Example (SHORT - Q51):
     * {
     *   "questionNumber": 51,
     *   "questionType": "SHORT",
     *   "questionText": "안녕하세요. 제가 13일에 일이 생겨서...",
     *   "referenceAnswer": "바꿔 주시겠어요|변경하고 싶습니다",
     *   "studentAnswer": "바꿔 주세요",
     *   "minChars": 1,
     *   "maxChars": 50,
     *   "maxPoints": 5
     * }
     * 
     * Request Body Example (ESSAY - Q54):
     * {
     *   "questionNumber": 54,
     *   "questionType": "ESSAY",
     *   "questionText": "다음을 주제로 하여 자신의 생각을 600~700자로...",
     *   "referenceAnswer": "정보 통신 기술의 발달과...(bài mẫu)",
     *   "studentAnswer": "(bài viết của học sinh)",
     *   "minChars": 600,
     *   "maxChars": 700,
     *   "maxPoints": 50
     * }
     */
    @PostMapping("/grade-writing")
    public ResponseEntity<WritingGradingResult> gradeWriting(
            @RequestBody WritingGradingRequest request
    ) {
        WritingGradingResult result = aiGradingService.gradeWriting(request);
        return ResponseEntity.ok(result);
    }
}
