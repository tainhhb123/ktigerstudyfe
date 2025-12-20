package org.example.ktigerstudybe.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingGradingResult {
    private Integer score; // 0-100
    private String feedback;
    private Breakdown breakdown;
    private List<String> suggestions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Breakdown {
        private Integer content; // 0-40
        private Integer grammar; // 0-30
        private Integer vocabulary; // 0-20
        private Integer organization; // 0-10
    }
}
