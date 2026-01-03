package org.example.ktigerstudybe.service.aiGrading;

import org.example.ktigerstudybe.dto.req.WritingGradingRequest;
import org.example.ktigerstudybe.dto.resp.WritingGradingResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AI Grading Service Implementation
 * 
 * Sử dụng OpenRouter API (Gemini 2.0 Flash) để chấm điểm Writing TOPIK II
 * OpenRouter hỗ trợ nhiều free models với rate limit cao hơn Groq
 * 
 * LOGIC CHẤM ĐIỂM:
 * ================
 * 
 * 1. SHORT (Q51, Q52) - Điền từ vào chỗ trống:
 *    - Input: questionText (đề bài có chỗ trống), referenceAnswer (đáp án đúng), studentAnswer
 *    - Logic: So sánh studentAnswer với referenceAnswer
 *    - Output: Điểm 0-100 dựa trên mức độ đúng
 *    - Quy đổi: (score/100) × 5 điểm
 * 
 * 2. ESSAY (Q53, Q54) - Viết văn:
 *    - Input: questionText (ĐỀ BÀI), referenceAnswer (bài mẫu tham khảo), studentAnswer
 *    - Logic: AI đánh giá bài viết DỰA TRÊN ĐỀ BÀI (không phải so sánh với bài mẫu)
 *    - Output: Điểm 0-100 theo 4 tiêu chí: Content/Grammar/Vocabulary/Organization
 *    - Quy đổi: Q53: (score/100) × 30đ, Q54: (score/100) × 50đ
 * 
 * Lưu ý khi copy vào BE:
 * - Đổi package thành: org.example.ktigerstudybe.service.aiGrading
 * - Import WritingGradingRequest, WritingGradingResult từ package dto tương ứng
 */
@Service
@RequiredArgsConstructor
public class AIGradingServiceImpl implements AIGradingService {

    @Value("${openrouter.api.key}")
    private String openRouterApiKey;

    private static final String OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
    
    // Danh sách models fallback - nếu model chính bị rate limit, tự động chuyển sang model tiếp theo
    private static final String[] FALLBACK_MODELS = {
        "meta-llama/llama-3.3-70b-instruct:free",      // Llama 3.3 70B - multilingual tốt
        "deepseek/deepseek-r1-0528:free",              // DeepSeek R1 - reasoning mạnh
        "mistralai/mistral-small-3.1-24b-instruct:free", // Mistral 24B
        "qwen/qwen3-4b:free",                          // Qwen 3 4B - backup nhẹ
        "google/gemma-3-27b-it:free"                   // Gemma 3 27B
    };
    
    @Value("${openrouter.model:meta-llama/llama-3.3-70b-instruct:free}")
    private String primaryModel;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public WritingGradingResult gradeWriting(WritingGradingRequest request) {
        // 1. Validate input
        if (request.getStudentAnswer() == null || request.getStudentAnswer().trim().isEmpty()) {
            return createEmptyAnswerResult();
        }

        int charCount = request.getStudentAnswer().length();
        
        // 2. Xác định loại câu hỏi
        boolean isShort = "SHORT".equalsIgnoreCase(request.getQuestionType());
        
        // 3. Với SHORT: Thử exact match trước
        if (isShort && request.getReferenceAnswer() != null) {
            WritingGradingResult exactMatch = tryExactMatch(request);
            if (exactMatch != null) {
                return exactMatch;
            }
        }

        // 4. Gọi AI để chấm
        try {
            String prompt = isShort ? buildShortPrompt(request) : buildEssayPrompt(request);
            String aiResponse = callOpenRouterAPI(prompt);
            return parseAIResponse(aiResponse, isShort);
        } catch (Exception e) {
            System.err.println("❌ AI Grading Error: " + e.getMessage());
            e.printStackTrace();
            return createFallbackResult(request);
        }
    }

    /**
     * Thử exact match cho SHORT answer
     * Nếu đúng hoàn toàn → trả về 100 điểm ngay, không cần gọi AI
     */
    private WritingGradingResult tryExactMatch(WritingGradingRequest request) {
        String studentAnswer = request.getStudentAnswer().trim();
        String[] possibleAnswers = request.getReferenceAnswer().split("\\|");
        
        for (String possible : possibleAnswers) {
            String trimmed = possible.trim();
            // So sánh không phân biệt dấu cách thừa
            if (studentAnswer.equalsIgnoreCase(trimmed) || 
                studentAnswer.replace(" ", "").equalsIgnoreCase(trimmed.replace(" ", ""))) {
                
                return WritingGradingResult.builder()
                        .score(100)
                        .feedback("✅ Đúng hoàn toàn!")
                        .breakdown(WritingGradingResult.Breakdown.builder()
                                .content(100)
                                .grammar(0)
                                .vocabulary(0)
                                .organization(0)
                                .build())
                        .suggestions(List.of("Câu trả lời chính xác, tốt lắm!"))
                        .build();
            }
        }
        return null; // Không exact match → cần AI chấm partial credit
    }

    /**
     * Gọi OpenRouter API với fallback models
     * Nếu model chính bị rate limit, tự động chuyển sang model khác
     */
    private String callOpenRouterAPI(String prompt) {
        // Tạo danh sách models: primary + fallbacks
        List<String> modelsToTry = new ArrayList<>();
        modelsToTry.add(primaryModel);
        for (String fallback : FALLBACK_MODELS) {
            if (!fallback.equals(primaryModel)) {
                modelsToTry.add(fallback);
            }
        }
        
        Exception lastException = null;
        
        for (String currentModel : modelsToTry) {
            try {
                System.out.println("🤖 Trying model: " + currentModel);
                String result = callWithModel(prompt, currentModel);
                System.out.println("✅ Success with model: " + currentModel);
                return result;
                
            } catch (org.springframework.web.client.HttpClientErrorException.TooManyRequests e) {
                System.out.println("⚠️ Rate limited on " + currentModel + ", trying next model...");
                lastException = e;
                // Đợi 1 giây trước khi thử model tiếp theo
                try { Thread.sleep(1000); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                
            } catch (Exception e) {
                System.out.println("❌ Error with " + currentModel + ": " + e.getMessage());
                lastException = e;
            }
        }
        
        throw new RuntimeException("All models failed. Last error: " + 
                (lastException != null ? lastException.getMessage() : "Unknown"), lastException);
    }
    
    /**
     * Gọi API với model cụ thể
     */
    private String callWithModel(String prompt, String modelName) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", modelName);
        requestBody.put("temperature", 0.3);
        requestBody.put("max_tokens", 2000);

        List<Map<String, String>> messages = new ArrayList<>();
        
        // System message
        Map<String, String> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", buildSystemPrompt());
        messages.add(systemMsg);

        // User message
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);
        messages.add(userMsg);

        requestBody.put("messages", messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openRouterApiKey);
        headers.set("HTTP-Referer", "https://ktiger-study.com");
        headers.set("X-Title", "KTiger Study TOPIK Grading");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                OPENROUTER_API_URL,
                HttpMethod.POST,
                entity,
                String.class
        );

        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response: " + e.getMessage(), e);
        }
    }

    /**
     * System prompt cho AI
     */
    private String buildSystemPrompt() {
        return """
                Bạn là giáo viên tiếng Hàn chuyên nghiệp, có nhiều năm kinh nghiệm chấm thi TOPIK II.
                Nhiệm vụ: Chấm điểm bài viết tiếng Hàn của học sinh.
                
                === THANG ĐIỂM TOPIK II WRITING (Tổng 100 điểm) ===
                • Câu 51, 52: 10 điểm/câu = 2 chỗ trống × 5 điểm
                • Câu 53: 30 điểm (viết đoạn văn 200-300 ký tự)
                • Câu 54: 50 điểm (viết bài luận 600-700 ký tự)
                
                === TIÊU CHÍ CHẤM ESSAY (tổng 100 điểm) ===
                - Content (Nội dung): 40 điểm - Đúng chủ đề, đầy đủ ý
                - Grammar (Ngữ pháp): 30 điểm - Đúng cấu trúc, ít lỗi
                - Vocabulary (Từ vựng): 20 điểm - Phong phú, phù hợp
                - Organization (Tổ chức): 10 điểm - Mạch lạc, logic
                
                === TIÊU CHÍ CHẤM SHORT (0-100 điểm) ===
                - 100: Đúng hoàn toàn
                - 70-90: Gần đúng (thiếu 1 từ nhưng đúng ý)
                - 50-70: Đúng một phần
                - 20-50: Có liên quan nhưng sai nhiều
                - 0: Sai hoàn toàn hoặc nghĩa ngược
                
                LUÔN trả về JSON hợp lệ.
                """;
    }

    // ==================== PROMPT CHO SHORT ====================
    
    /**
     * Build prompt cho SHORT answer (Q51, Q52)
     * Logic: So sánh studentAnswer với referenceAnswer (đáp án đúng)
     */
    private String buildShortPrompt(WritingGradingRequest request) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("=== CHẤM ĐIỂM CÂU ").append(request.getQuestionNumber())
              .append(" - ĐIỀN TỪ (5 điểm/chỗ trống) ===\n\n");
        
        // Đề bài (passage_text)
        if (request.getQuestionText() != null && !request.getQuestionText().isEmpty()) {
            prompt.append("📝 **ĐỀ BÀI:**\n").append(request.getQuestionText()).append("\n\n");
        }
        
        // Đáp án đúng (correct_answer)
        prompt.append("✅ **ĐÁP ÁN ĐÚNG:** ").append(request.getReferenceAnswer()).append("\n");
        prompt.append("(Nếu có nhiều đáp án, phân cách bằng '|')\n\n");
        
        // Câu trả lời học sinh
        prompt.append("📝 **CÂU TRẢ LỜI CỦA HỌC SINH:** ").append(request.getStudentAnswer()).append("\n\n");
        
        prompt.append("""
                === HƯỚNG DẪN CHẤM ĐIỂM ===
                
                So sánh câu trả lời học sinh với đáp án đúng:
                
                🟢 100 điểm: Đúng hoàn toàn (cho phép khác dấu cách)
                
                🟡 70-90 điểm: Gần đúng
                   - Thiếu 1 âm tiết nhưng ý nghĩa chính đúng
                   - VD: "바꿔 주겠어요" vs "바꿔 주시겠어요" → 80 điểm (thiếu '시')
                
                🟠 50-70 điểm: Đúng một phần
                   - Đúng cấu trúc nhưng sai 1-2 từ quan trọng
                
                🔴 20-50 điểm: Có liên quan nhưng thiếu nhiều hoặc sai nghĩa
                
                ⚫ 0 điểm: Sai hoàn toàn hoặc NGHĨA NGƯỢC
                   - VD: "잘 되면" vs "잘 안 되면" → 0 điểm (thiếu '안' = nghĩa ngược)
                
                === TRẢ VỀ JSON ===
                {
                  "content": <0-100>,
                  "grammar": 0,
                  "vocabulary": 0,
                  "organization": 0,
                  "feedback": "<Nhận xét chi tiết: từ nào đúng, từ nào sai/thiếu>",
                  "suggestions": ["<Đáp án đúng đầy đủ>"]
                }
                
                Chỉ trả về JSON, không giải thích thêm.
                """);
        
        return prompt.toString();
    }

    // ==================== PROMPT CHO ESSAY ====================
    
    /**
     * Build prompt cho ESSAY (Q53, Q54)
     * Logic: Đánh giá bài viết DỰA TRÊN ĐỀ BÀI, tham khảo bài mẫu (nếu có)
     */
    private String buildEssayPrompt(WritingGradingRequest request) {
        int charCount = request.getStudentAnswer().length();
        int minChars = request.getMinChars() != null ? request.getMinChars() : 200;
        int maxChars = request.getMaxChars() != null ? request.getMaxChars() : 700;
        
        // Xác định câu 53 hay 54
        boolean isQ53 = request.getQuestionNumber() != null && request.getQuestionNumber() == 53;
        
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("=== CHẤM ĐIỂM CÂU ").append(request.getQuestionNumber())
              .append(" - TOPIK II WRITING (").append(isQ53 ? "30" : "50").append(" điểm) ===\n\n");
        
        prompt.append("**Loại câu hỏi:** ").append(isQ53 ? 
                "Viết đoạn văn mô tả biểu đồ/bảng số liệu" : 
                "Viết bài luận nghị luận").append("\n");
        prompt.append("**Yêu cầu số ký tự:** ").append(minChars).append("-").append(maxChars).append(" ký tự\n");
        prompt.append("**Số ký tự học sinh viết:** ").append(charCount).append(" ký tự\n\n");
        
        // ĐỀ BÀI (passage_text) - QUAN TRỌNG NHẤT
        prompt.append("📋 **ĐỀ BÀI:**\n").append(request.getQuestionText()).append("\n\n");
        
        // Bài mẫu tham khảo (correct_answer) - Chỉ để tham khảo mức độ kỳ vọng
        if (request.getReferenceAnswer() != null && !request.getReferenceAnswer().isEmpty()) {
            prompt.append("📖 **BÀI MẪU THAM KHẢO** (để hiểu mức độ kỳ vọng, KHÔNG phải để so sánh trực tiếp):\n");
            prompt.append(request.getReferenceAnswer()).append("\n\n");
        }
        
        // Bài viết của học sinh
        prompt.append("✏️ **BÀI VIẾT CỦA HỌC SINH:**\n").append(request.getStudentAnswer()).append("\n\n");
        
        // Tiêu chí chấm
        if (isQ53) {
            prompt.append(buildEssay53Criteria(charCount, minChars, maxChars));
        } else {
            prompt.append(buildEssay54Criteria(charCount, minChars, maxChars));
        }
        
        return prompt.toString();
    }
    
    /**
     * Tiêu chí chấm câu 53 (Mô tả biểu đồ/bảng)
     */
    private String buildEssay53Criteria(int charCount, int minChars, int maxChars) {
        return """
                === TIÊU CHÍ CHẤM CÂU 53 (Tổng 100 điểm → quy đổi 30 điểm) ===
                
                ⚠️ QUAN TRỌNG: Đánh giá bài viết DỰA TRÊN ĐỀ BÀI, không phải so sánh với bài mẫu!
                
                📊 NỘI DUNG (40 điểm):
                - Hiểu đúng biểu đồ/bảng số liệu trong đề bài
                - Nêu được xu hướng chính (tăng/giảm/ổn định)
                - So sánh các số liệu quan trọng
                - Giải thích nguyên nhân (nếu đề yêu cầu)
                
                📝 NGỮ PHÁP (30 điểm):
                - Cấu trúc so sánh: ~보다, ~에 비해
                - Cấu trúc biến đổi: ~(으)ㄴ/는 반면
                - Cấu trúc nguyên nhân: ~기 때문에, ~(으)므로
                - Ít lỗi ngữ pháp
                
                📚 TỪ VỰNG (20 điểm):
                - Từ vựng số liệu: 증가하다, 감소하다, 변화하다
                - Từ vựng so sánh: 높다, 낮다, 크다, 작다
                - Từ nối phù hợp
                
                🏗️ TỔ CHỨC (10 điểm):
                - Mở bài: Giới thiệu chủ đề
                - Thân bài: Mô tả số liệu
                - Kết bài: Tổng kết/Dự đoán
                
                === TRỪ ĐIỂM THEO SỐ KÝ TỰ ===
                - Đủ 200-300: Không trừ
                - 150-199: Trừ 10-15 điểm
                - 100-149: Trừ 20-25 điểm
                - Dưới 100: Trừ 30-40 điểm
                
                === TRẢ VỀ JSON ===
                {
                  "content": <0-40>,
                  "grammar": <0-30>,
                  "vocabulary": <0-20>,
                  "organization": <0-10>,
                  "feedback": "<Nhận xét chi tiết: ✅ Ưu điểm... ❌ Nhược điểm...>",
                  "suggestions": ["<Gợi ý 1>", "<Gợi ý 2>"]
                }
                
                Chỉ trả về JSON.
                """;
    }
    
    /**
     * Tiêu chí chấm câu 54 (Viết luận)
     */
    private String buildEssay54Criteria(int charCount, int minChars, int maxChars) {
        int completionPercent = minChars > 0 ? (charCount * 100) / minChars : 0;
        
        return String.format("""
                === TIÊU CHÍ CHẤM CÂU 54 (Tổng 100 điểm → quy đổi 50 điểm) ===
                
                ⚠️ QUAN TRỌNG: 
                - Đánh giá bài viết DỰA TRÊN ĐỀ BÀI, không phải so sánh với bài mẫu!
                - Vẫn chấm điểm ngay cả khi thiếu ký tự, chỉ trừ điểm theo tỷ lệ
                
                📏 Mức độ hoàn thành: %d%% (%d/%d ký tự)
                
                📊 NỘI DUNG (40 điểm):
                - Hiểu đúng chủ đề và yêu cầu đề bài
                - Luận điểm rõ ràng, mạch lạc
                - Có ví dụ, dẫn chứng phù hợp
                - Lập luận logic, thuyết phục
                
                📝 NGỮ PHÁP (30 điểm):
                - Cấu trúc câu phức: ~(으)ㄴ/는데, ~기 때문에, ~(으)므로
                - Liên kết câu: 그러나, 따라서, 그러므로, 반면에
                - Thể trang trọng: -ㅂ니다/습니다
                - Ít lỗi ngữ pháp
                
                📚 TỪ VỰNG (20 điểm):
                - Từ vựng học thuật, trang trọng
                - Đa dạng, không lặp lại
                - Collocations tự nhiên
                
                🏗️ BỐ CỤC (10 điểm):
                - MỞ BÀI: Giới thiệu chủ đề
                - THÂN BÀI: 2-3 luận điểm + dẫn chứng
                - KẾT BÀI: Tổng kết quan điểm
                
                === HỆ SỐ TRỪ ĐIỂM THEO SỐ KÝ TỰ ===
                | Số ký tự  | Hệ số |
                |-----------|-------|
                | 600-700   | x1.0  |
                | 500-599   | x0.8  |
                | 400-499   | x0.6  |
                | 300-399   | x0.5  |
                | 200-299   | x0.4  |
                | 100-199   | x0.2  |
                | <100      | x0.1  |
                
                Áp dụng hệ số VÀO từng tiêu chí trước khi tổng hợp.
                
                === TRẢ VỀ JSON ===
                {
                  "content": <0-40 đã áp dụng hệ số>,
                  "grammar": <0-30 đã áp dụng hệ số>,
                  "vocabulary": <0-20 đã áp dụng hệ số>,
                  "organization": <0-10 đã áp dụng hệ số>,
                  "feedback": "<Nhận xét: 📏 Về độ dài... ✅ Ưu điểm... ❌ Nhược điểm...>",
                  "suggestions": ["<Gợi ý 1>", "<Gợi ý 2>", "<Gợi ý 3>"]
                }
                
                Chỉ trả về JSON.
                """, completionPercent, charCount, minChars);
    }

    // ==================== PARSE RESPONSE ====================
    
    /**
     * Parse JSON response từ AI
     */
    private WritingGradingResult parseAIResponse(String aiResponse, boolean isShort) {
        try {
            // Remove markdown code blocks
            String jsonStr = aiResponse.trim();
            if (jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.replaceAll("```json\\n?", "").replaceAll("```\\n?", "");
            } else if (jsonStr.startsWith("```")) {
                jsonStr = jsonStr.replaceAll("```\\n?", "");
            }

            JsonNode root = objectMapper.readTree(jsonStr);

            WritingGradingResult.Breakdown breakdown = WritingGradingResult.Breakdown.builder()
                    .content(root.path("content").asInt(0))
                    .grammar(root.path("grammar").asInt(0))
                    .vocabulary(root.path("vocabulary").asInt(0))
                    .organization(root.path("organization").asInt(0))
                    .build();

            // Tính tổng điểm
            int totalScore;
            if (isShort) {
                // SHORT: Chỉ dùng content score
                totalScore = breakdown.getContent();
            } else {
                // ESSAY: Tổng 4 tiêu chí
                totalScore = breakdown.getContent() + breakdown.getGrammar() 
                        + breakdown.getVocabulary() + breakdown.getOrganization();
            }

            List<String> suggestions = new ArrayList<>();
            JsonNode suggestionsNode = root.path("suggestions");
            if (suggestionsNode.isArray()) {
                suggestionsNode.forEach(node -> suggestions.add(node.asText()));
            }

            return WritingGradingResult.builder()
                    .score(totalScore)
                    .feedback(root.path("feedback").asText("Đã chấm điểm xong."))
                    .breakdown(breakdown)
                    .suggestions(suggestions)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response: " + e.getMessage(), e);
        }
    }

    // ==================== FALLBACK RESULTS ====================
    
    /**
     * Kết quả khi câu trả lời trống
     */
    private WritingGradingResult createEmptyAnswerResult() {
        return WritingGradingResult.builder()
                .score(0)
                .feedback("❌ Bạn chưa viết câu trả lời.")
                .breakdown(WritingGradingResult.Breakdown.builder()
                        .content(0).grammar(0).vocabulary(0).organization(0).build())
                .suggestions(List.of("Hãy đọc kỹ đề bài và viết câu trả lời."))
                .build();
    }

    /**
     * Fallback khi AI lỗi
     */
    private WritingGradingResult createFallbackResult(WritingGradingRequest request) {
        int charCount = request.getStudentAnswer() != null ? request.getStudentAnswer().length() : 0;
        int minChars = request.getMinChars() != null ? request.getMinChars() : 100;
        int lengthScore = Math.min(100, (charCount * 100) / Math.max(minChars, 1));
        int score = (int) (lengthScore * 0.5); // 50% of length-based score

        return WritingGradingResult.builder()
                .score(score)
                .feedback("⚠️ Hệ thống AI tạm thời không khả dụng. Điểm tạm tính dựa trên độ dài bài viết.")
                .breakdown(WritingGradingResult.Breakdown.builder()
                        .content((int) (score * 0.4))
                        .grammar((int) (score * 0.3))
                        .vocabulary((int) (score * 0.2))
                        .organization((int) (score * 0.1))
                        .build())
                .suggestions(List.of(
                        "Vui lòng thử lại sau khi hệ thống AI phục hồi.",
                        "Liên hệ giáo viên để được chấm điểm thủ công."))
                .build();
    }
}
