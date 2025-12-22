package org.example.ktigerstudybe.dto.req;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingGradingRequest {
    private Integer questionNumber; // 53 or 54
    private String questionText;
    private String referenceAnswer; // Câu trả lời mẫu
    private String studentAnswer;
    private Integer minChars; // 200 or 600
    private Integer maxChars; // 300 or 700
}
