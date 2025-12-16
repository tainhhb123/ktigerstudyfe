package org.example.ktigerstudybe.dto.resp;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResultResponse {
    
    private Long questionId;
    private Integer questionNumber;
    private String questionText;
    private String questionType; // MCQ, SHORT, ESSAY
    private String sectionType; // LISTENING, WRITING, READING
    
    private String userAnswer;
    private String correctAnswer;
    
    // QUAN TRỌNG: Dùng @JsonProperty để Jackson serialize đúng tên field
    @JsonProperty("isCorrect")
    private boolean isCorrect;
    
    private BigDecimal score;
    private BigDecimal maxScore;
}
