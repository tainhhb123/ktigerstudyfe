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
    private String questionType;
    private String sectionType;
    
    private String userAnswer;
    private String correctAnswer;
    
    @JsonProperty("isCorrect")
    private boolean isCorrect;
    
    private BigDecimal score;
    private BigDecimal maxScore;
    
    // AI Grading Fields
    private Integer aiScore;
    private String aiFeedback;
    private AIScoreBreakdown aiBreakdown;
    private List<String> aiSuggestions;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AIScoreBreakdown {
        private Integer content;
        private Integer grammar;
        private Integer vocabulary;
        private Integer organization;
    }
}
