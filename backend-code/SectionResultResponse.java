package org.example.ktigerstudybe.dto.resp;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
@NoArgsConstructor
public class SectionResultResponse {
    
    private String sectionType; // LISTENING, WRITING, READING
    private BigDecimal score = BigDecimal.ZERO;
    private BigDecimal totalPoints = BigDecimal.ZERO;
    private Integer correctCount = 0;
    private Integer totalCount = 0;
    private Double percentage;

    public SectionResultResponse(String sectionType) {
        this.sectionType = sectionType;
    }

    /**
     * Thêm kết quả của 1 câu hỏi vào section
     */
    public void addQuestion(BigDecimal questionScore, BigDecimal questionMaxScore) {
        if (questionScore != null) {
            this.score = this.score.add(questionScore);
        }
        if (questionMaxScore != null) {
            this.totalPoints = this.totalPoints.add(questionMaxScore);
        }
        this.totalCount++;
        
        if (questionScore != null && questionScore.compareTo(BigDecimal.ZERO) > 0) {
            this.correctCount++;
        }
        
        // Tính phần trăm
        if (this.totalPoints.compareTo(BigDecimal.ZERO) > 0) {
            this.percentage = this.score
                .divide(this.totalPoints, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
        } else {
            this.percentage = 0.0;
        }
    }
}
