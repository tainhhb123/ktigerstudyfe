package org.example.ktigerstudybe.dto.resp;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResultResponse {
    
    private Long questionId;
    private Integer questionNumber;
    private String questionText;
    private String questionType;  // "MCQ" | "SHORT" | "ESSAY"
    private String sectionType;   // "LISTENING" | "WRITING" | "READING"
    
    private String userAnswer;
    private String correctAnswer;
    
    @JsonProperty("isCorrect")
    private boolean isCorrect;
    
    private BigDecimal score;
    private BigDecimal maxScore;
    
    // ===== ✨ AI Grading Fields =====
    
    private Integer aiScore;           // Điểm AI (0-100)
    private String aiFeedback;         // Nhận xét từ AI
    private AIScoreBreakdown aiBreakdown;  // Chi tiết điểm theo tiêu chí
    private List<String> aiSuggestions;    // Gợi ý cải thiện
    
    // ===== AI Score Breakdown (cho ESSAY) =====
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AIScoreBreakdown {
        private Integer content;       // Nội dung (0-40)
        private Integer grammar;       // Ngữ pháp (0-30)
        private Integer vocabulary;    // Từ vựng (0-20)
        private Integer organization;  // Tổ chức (0-10)
    }
}
