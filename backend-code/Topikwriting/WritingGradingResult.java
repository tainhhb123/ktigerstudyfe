package org.example.ktigerstudybe.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO cho AI Grading
 * 
 * AI trả về điểm 0-100 (percentage)
 * Backend sẽ quy đổi sang điểm thực tế:
 * - SHORT: (score/100) × 5 điểm
 * - ESSAY Q53: (score/100) × 30 điểm
 * - ESSAY Q54: (score/100) × 50 điểm
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WritingGradingResult {
    
    private Integer score;              // Tổng điểm 0-100
    
    private String feedback;            // Nhận xét chi tiết từ AI
    
    private Breakdown breakdown;        // Chi tiết điểm theo tiêu chí (chỉ dùng cho ESSAY)
    
    private List<String> suggestions;   // Gợi ý cải thiện
    
    /**
     * Chi tiết điểm theo 4 tiêu chí (cho ESSAY)
     * Tổng = content + grammar + vocabulary + organization = 100 điểm
     * 
     * Với SHORT: chỉ dùng content (0-100), các field khác = 0
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Breakdown {
        private Integer content;        // Nội dung: 0-40 (ESSAY) hoặc 0-100 (SHORT)
        private Integer grammar;        // Ngữ pháp: 0-30
        private Integer vocabulary;     // Từ vựng: 0-20
        private Integer organization;   // Tổ chức/Bố cục: 0-10
    }
}
