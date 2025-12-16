package org.example.ktigerstudybe.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultResponse {
    
    private Long attemptId;
    private BigDecimal totalScore;
    private Integer totalQuestions;
    private Integer correctAnswers;
    
    // Điểm từng phần: LISTENING, WRITING, READING
    private Map<String, SectionResultResponse> sectionResults;
    
    // Chi tiết từng câu hỏi
    private List<QuestionResultResponse> questions;
}
