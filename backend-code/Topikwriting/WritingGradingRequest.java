package org.example.ktigerstudybe.dto.req;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO cho AI Grading
 * 
 * LOGIC CHẤM ĐIỂM:
 * - SHORT (Q51, Q52): So sánh studentAnswer với referenceAnswer (đáp án đúng)
 * - ESSAY (Q53, Q54): Đánh giá studentAnswer dựa trên questionText (đề bài)
 *                     + tham khảo referenceAnswer (bài mẫu) nếu có
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingGradingRequest {
    
    private Integer questionNumber;     // 51, 52, 53, 54
    
    private String questionType;        // "SHORT" hoặc "ESSAY"
    
    private String questionText;        // Đề bài (passage_text từ DB)
                                        // - SHORT: Đoạn văn có chỗ trống
                                        // - ESSAY: Yêu cầu đề bài
    
    private String referenceAnswer;     // correct_answer từ DB
                                        // - SHORT: Đáp án đúng (có thể nhiều đáp án, phân cách "|")
                                        // - ESSAY: Bài mẫu tham khảo
    
    private String studentAnswer;       // Câu trả lời của học sinh
    
    private Integer minChars;           // Số ký tự tối thiểu
                                        // - SHORT: 1
                                        // - ESSAY Q53: 200
                                        // - ESSAY Q54: 600
    
    private Integer maxChars;           // Số ký tự tối đa
                                        // - SHORT: 50
                                        // - ESSAY Q53: 300
                                        // - ESSAY Q54: 700
    
    private Integer maxPoints;          // Điểm tối đa của câu hỏi
                                        // - SHORT: 5 (mỗi chỗ trống)
                                        // - ESSAY Q53: 30
                                        // - ESSAY Q54: 50
}
