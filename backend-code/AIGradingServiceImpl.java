package org.example.ktigerstudybe.service.aiGrading;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.ktigerstudybe.dto.req.WritingGradingRequest;
import org.example.ktigerstudybe.dto.resp.WritingGradingResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIGradingServiceImpl implements AIGradingService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama-3.1-8b-instant"; // Faster model

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public WritingGradingResult gradeWriting(WritingGradingRequest request) {
        // 1. Check if answer is empty
        int charCount = request.getStudentAnswer().length();
        if (charCount == 0) {
            return createEmptyAnswerResult(request);
        }
        
        // 2. For SHORT questions only - strict character validation
        boolean isShort = request.getMinChars() <= 50;
        if (isShort && (charCount < request.getMinChars() || charCount > request.getMaxChars())) {
            return createInvalidLengthResult(request, charCount);
        }
        
        // 3. For ESSAY - still grade even if under character limit (with penalty)

        try {
            // 4. Build prompt
            String prompt = buildGradingPrompt(request);

            // 5. Call Groq API
            String aiResponse = callGroqAPI(prompt);

            // 6. Parse result
            return parseAIResponse(aiResponse);

        } catch (Exception e) {
            System.err.println("AI Grading Error: " + e.getMessage());
            e.printStackTrace();
            return createFallbackResult(request);
        }
    }

    /**
     * Gọi Groq API
     */
    private String callGroqAPI(String prompt) {
        try {
            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", MODEL);
            requestBody.put("temperature", 0.3);
            requestBody.put("max_tokens", 2000);

            // Messages
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

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Call API
            ResponseEntity<String> response = restTemplate.exchange(
                    GROQ_API_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // Parse response
            JsonNode root = objectMapper.readTree(response.getBody());
            String content = root.path("choices").get(0).path("message").path("content").asText();

            return content;

        } catch (Exception e) {
            throw new RuntimeException("Failed to call Groq API: " + e.getMessage(), e);
        }
    }

    /**
     * System prompt cho Groq
     * 
     * TOPIK II Writing Section (Tổng: 100 điểm):
     * - Câu 51: 10 điểm = 2 chỗ trống (ㄱ, ㄴ) × 5 điểm
     * - Câu 52: 10 điểm = 2 chỗ trống (ㄱ, ㄴ) × 5 điểm
     * - Câu 53: 30 điểm (ESSAY 200-300 ký tự)
     * - Câu 54: 50 điểm (ESSAY 600-700 ký tự)
     * 
     * Mỗi chỗ trống trong DB là 1 question riêng với 5 điểm.
     * AI trả về điểm 0-100 (percentage), backend sẽ convert sang điểm thực tế (5 điểm).
     */
    private String buildSystemPrompt() {
        return """
                Bạn là giáo viên tiếng Hàn chuyên nghiệp, có nhiều năm kinh nghiệm chấm thi TOPIK II.
                Nhiệm vụ của bạn là chấm điểm bài viết/câu trả lời tiếng Hàn của học sinh.
                
                === THANG ĐIỂM TOPIK II WRITING (Tổng 100 điểm) ===
                • Câu 51: 10 điểm = 2 chỗ trống × 5 điểm mỗi chỗ
                • Câu 52: 10 điểm = 2 chỗ trống × 5 điểm mỗi chỗ
                • Câu 53: 30 điểm (viết đoạn văn 200-300 ký tự)
                • Câu 54: 50 điểm (viết bài luận 600-700 ký tự)
                
                === TIÊU CHÍ CHẤM ESSAY (trả về điểm 0-100) ===
                - Nội dung (Content): 40/100 điểm - Đúng chủ đề, đầy đủ ý
                - Ngữ pháp (Grammar): 30/100 điểm - Đúng cấu trúc, ít lỗi
                - Từ vựng (Vocabulary): 20/100 điểm - Phong phú, phù hợp
                - Tổ chức (Organization): 10/100 điểm - Mạch lạc, logic
                
                === TIÊU CHÍ CHẤM SHORT - mỗi chỗ trống 5 điểm (trả về điểm 0-100) ===
                - 100 điểm: Đúng hoàn toàn → 5/5 điểm
                - 70-90 điểm: Gần đúng (thiếu 1 từ nhưng đúng ý chính) → 3.5-4.5/5 điểm
                - 50-70 điểm: Đúng một phần → 2.5-3.5/5 điểm
                - 0-50 điểm: Sai nhiều hoặc hoàn toàn → 0-2.5/5 điểm
                
                Hãy trả lời theo định dạng JSON chính xác.
                """;
    }

    /**
     * Build prompt cho từng câu hỏi
     * 
     * TOPIK II Writing:
     * - SHORT (Q51, Q52): Mỗi chỗ trống 5 điểm (2 chỗ/câu = 10 điểm/câu)
     * - ESSAY (Q53): 200-300 ký tự → 30 điểm
     * - ESSAY (Q54): 600-700 ký tự → 50 điểm
     */
    private String buildGradingPrompt(WritingGradingRequest request) {
        // Detect SHORT vs ESSAY based on minChars
        boolean isShort = request.getMinChars() <= 50;
        
        System.out.println("🤖 Building prompt for Q" + request.getQuestionNumber() + 
                           " (" + (isShort ? "SHORT" : "ESSAY") + ")");
        
        if (isShort) {
            return buildShortPrompt(request);
        }
        return buildEssayPrompt(request);
    }
    
    /**
     * Prompt cho SHORT answer (điền từ)
     * Câu 51 và 52 mỗi câu có 2 chỗ trống (ㄱ) và (ㄴ)
     * Mỗi chỗ trống = 5 điểm → Mỗi câu = 10 điểm
     * Trong DB, mỗi chỗ trống là 1 question riêng với points = 5
     */
    private String buildShortPrompt(WritingGradingRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Hãy chấm điểm câu trả lời điền từ TOPIK II:\n\n");
        prompt.append("**Câu ").append(request.getQuestionNumber()).append(" (5 điểm/chỗ trống)**\n");
        
        if (request.getQuestionText() != null) {
            prompt.append("Đề bài: ").append(request.getQuestionText()).append("\n");
        }
        
        prompt.append("\n**Đáp án đúng:** ").append(request.getReferenceAnswer()).append("\n");
        prompt.append("**Câu trả lời của học sinh:** ").append(request.getStudentAnswer()).append("\n\n");

        prompt.append("""
                PHÂN TÍCH SO SÁNH CHI TIẾT trước khi chấm điểm:
                1. So sánh TỪNG TỪ giữa đáp án và câu trả lời
                2. Xác định CHÍNH XÁC từ nào thiếu, từ nào thừa, từ nào sai
                3. Đánh giá ý nghĩa có thay đổi không
                
                Trả về JSON:
                {
                  "content": <0-100 điểm>,
                  "grammar": 0,
                  "vocabulary": 0,
                  "organization": 0,
                  "feedback": "<nhận xét CHI TIẾT: nêu rõ từ nào đúng, từ nào sai/thiếu>",
                  "suggestions": ["<đáp án đúng đầy đủ>"]
                }
                
                ⚠️ QUY TẮC CHẤM ĐIỂM:
                
                🟢 100 điểm: Đúng hoàn toàn (có thể khác dấu cách)
                
                🟡 70-90 điểm: Gần đúng - thiếu 1 từ/âm tiết nhưng ý nghĩa chính đúng
                   VD: "바꿔 주겠어요" vs "바꿔 주시겠어요" → 80 điểm (thiếu '시' - kính ngữ)
                   VD: "주시겠어요" vs "바꿔 주시겠어요" → 70 điểm (thiếu '바꿔')
                
                🟠 50-70 điểm: Đúng một phần - đúng cấu trúc nhưng sai 1-2 từ quan trọng
                
                🔴 20-50 điểm: Có liên quan nhưng thiếu nhiều hoặc sai nghĩa
                
                ⚫ 0 điểm: Sai hoàn toàn hoặc nghĩa NGƯỢC với đáp án
                   VD: "잘 되면" vs "잘 안 되면" → 0 điểm (thiếu '안' = nghĩa ngược)
                
                LƯU Ý QUAN TRỌNG về feedback:
                - Nêu RÕ RÀNG từ nào thiếu/sai, KHÔNG nhầm lẫn
                - VD: Nếu đáp án là "바꿔 주시겠어요" và user viết "바꿔 주겠어요"
                  → Feedback: "Thiếu '시' trong '주시겠어요', đây là dạng kính ngữ"
                  → KHÔNG nói "thiếu 바꿔" vì user ĐÃ CÓ từ này
                
                Chỉ trả về JSON.
                """);

        return prompt.toString();
    }
    
    /**
     * Prompt cho ESSAY (viết dài)
     * - Câu 53: 30 điểm (200-300 ký tự) - Viết đoạn văn mô tả biểu đồ/bảng
     * - Câu 54: 50 điểm (600-700 ký tự) - Viết bài luận về chủ đề cho trước
     */
    private String buildEssayPrompt(WritingGradingRequest request) {
        int charCount = request.getStudentAnswer().length();
        int minChars = request.getMinChars();
        int maxChars = request.getMaxChars();
        
        // Câu 53 hoặc 54
        if (request.getQuestionNumber() == 53) {
            return buildEssay53Prompt(request, charCount, minChars, maxChars);
        } else {
            return buildEssay54Prompt(request, charCount, minChars, maxChars);
        }
    }
    
    /**
     * Prompt cho Câu 53 - Viết đoạn văn mô tả biểu đồ/bảng (30 điểm, 200-300 ký tự)
     */
    private String buildEssay53Prompt(WritingGradingRequest request, int charCount, int minChars, int maxChars) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("=== CHẤM ĐIỂM CÂU 53 - TOPIK II WRITING (30 điểm) ===\n\n");
        prompt.append("**Loại câu hỏi:** Viết đoạn văn mô tả biểu đồ/bảng số liệu\n");
        prompt.append("**Yêu cầu số ký tự:** ").append(minChars).append("-").append(maxChars).append(" ký tự\n");
        prompt.append("**Số ký tự học sinh viết:** ").append(charCount).append(" ký tự\n\n");
        
        prompt.append("**Đề bài:**\n").append(request.getQuestionText()).append("\n\n");
        
        if (request.getReferenceAnswer() != null && !request.getReferenceAnswer().isEmpty()) {
            prompt.append("**Bài mẫu tham khảo:**\n").append(request.getReferenceAnswer()).append("\n\n");
        }
        
        prompt.append("**Bài viết của học sinh:**\n").append(request.getStudentAnswer()).append("\n\n");
        
        prompt.append("""
                === TIÊU CHÍ CHẤM CÂU 53 (Tổng 100 điểm → quy đổi 30 điểm) ===
                
                📊 NỘI DUNG (40 điểm):
                - Đọc và hiểu đúng biểu đồ/bảng số liệu
                - Nêu được xu hướng chính (tăng/giảm/ổn định)
                - So sánh các số liệu quan trọng
                - Giải thích nguyên nhân (nếu có trong đề)
                - Dự đoán xu hướng tương lai (nếu phù hợp)
                
                📝 NGỮ PHÁP (30 điểm):
                - Sử dụng đúng các cấu trúc so sánh: ~보다, ~에 비해
                - Cấu trúc biến đổi: ~(으)ㄴ/는 반면, ~는 데 비해
                - Cấu trúc nguyên nhân: ~기 때문에, ~(으)므로
                - Thì quá khứ, hiện tại, tương lai phù hợp
                - Không có lỗi ngữ pháp nghiêm trọng
                
                📚 TỪ VỰNG (20 điểm):
                - Từ vựng mô tả số liệu: 증가하다, 감소하다, 변화하다
                - Từ vựng so sánh: 높다, 낮다, 크다, 작다
                - Đơn vị: 조, 억, 원, 퍼센트(%)
                - Từ nối: 반면, 그러나, 따라서, 그 결과
                
                🏗️ TỔ CHỨC (10 điểm):
                - Mở bài: Giới thiệu chủ đề biểu đồ
                - Thân bài: Mô tả chi tiết số liệu
                - Kết bài: Tổng kết hoặc dự đoán
                
                === HƯỚNG DẪN TRỪ ĐIỂM SỐ KÝ TỰ ===
                - Đủ 200-300 ký tự: Không trừ điểm
                - 150-199 ký tự: Trừ 10-15 điểm tổng
                - 100-149 ký tự: Trừ 20-25 điểm tổng
                - Dưới 100 ký tự: Trừ 30-40 điểm tổng
                - Quá 300 ký tự: Trừ 5 điểm (không nghiêm trọng)
                
                === TRẢ VỀ JSON ===
                {
                  "content": <0-40>,
                  "grammar": <0-30>,
                  "vocabulary": <0-20>,
                  "organization": <0-10>,
                  "feedback": "<NHẬN XÉT CHI TIẾT gồm: \\n✅ ƯU ĐIỂM: [liệt kê 2-3 điểm tốt]\\n❌ NHƯỢC ĐIỂM: [liệt kê 2-3 điểm cần cải thiện]\\n📊 Về số liệu: [đánh giá việc sử dụng số liệu]>",
                  "suggestions": [
                    "<Cách khắc phục cụ thể 1 - về nội dung>",
                    "<Cách khắc phục cụ thể 2 - về ngữ pháp/từ vựng>",
                    "<Cách khắc phục cụ thể 3 - về cấu trúc bài>"
                  ]
                }
                
                Chỉ trả về JSON.
                """);
        
        return prompt.toString();
    }
    
    /**
     * Prompt cho Câu 54 - Viết bài luận (50 điểm, 600-700 ký tự)
     * QUAN TRỌNG: Vẫn chấm điểm nếu thiếu ký tự, chỉ trừ điểm phù hợp
     */
    private String buildEssay54Prompt(WritingGradingRequest request, int charCount, int minChars, int maxChars) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("=== CHẤM ĐIỂM CÂU 54 - TOPIK II WRITING (50 điểm) ===\n\n");
        prompt.append("**Loại câu hỏi:** Viết bài luận nghị luận\n");
        prompt.append("**Yêu cầu số ký tự:** ").append(minChars).append("-").append(maxChars).append(" ký tự\n");
        prompt.append("**Số ký tự học sinh viết:** ").append(charCount).append(" ký tự\n");
        
        // Tính % hoàn thành
        int completionPercent = (charCount * 100) / minChars;
        prompt.append("**Mức độ hoàn thành:** ").append(completionPercent).append("% so với yêu cầu tối thiểu\n\n");
        
        prompt.append("**Đề bài:**\n").append(request.getQuestionText()).append("\n\n");
        
        if (request.getReferenceAnswer() != null && !request.getReferenceAnswer().isEmpty()) {
            prompt.append("**Bài mẫu tham khảo:**\n").append(request.getReferenceAnswer()).append("\n\n");
        }
        
        prompt.append("**Bài viết của học sinh:**\n").append(request.getStudentAnswer()).append("\n\n");
        
        prompt.append("""
                === TIÊU CHÍ CHẤM CÂU 54 (Tổng 100 điểm → quy đổi 50 điểm) ===
                
                ⚠️ QUAN TRỌNG: Vẫn chấm điểm bài viết ngay cả khi thiếu ký tự!
                Đánh giá những gì học sinh ĐÃ VIẾT ĐƯỢC, sau đó trừ điểm theo tỷ lệ hoàn thành.
                
                📊 NỘI DUNG (40 điểm):
                - Hiểu đúng chủ đề và yêu cầu đề bài
                - Có luận điểm rõ ràng, mạch lạc
                - Đưa ra ví dụ, dẫn chứng phù hợp
                - Lập luận logic, thuyết phục
                - Thể hiện quan điểm cá nhân
                
                📝 NGỮ PHÁP (30 điểm):
                - Cấu trúc câu phức tạp: ~(으)ㄴ/는데, ~기 때문에, ~(으)므로
                - Liên kết câu: 그러나, 따라서, 그러므로, 반면에
                - Thể trang trọng: -ㅂ니다/습니다 hoặc -아/어요
                - Cấu trúc nhấn mạnh: ~는 것이다, ~(으)ㄹ 수밖에 없다
                - Ít lỗi ngữ pháp
                
                📚 TỪ VỰNG (20 điểm):
                - Từ vựng học thuật, trang trọng
                - Từ vựng đa dạng, không lặp lại
                - Sử dụng thành ngữ, tục ngữ phù hợp
                - Collocations tự nhiên
                
                🏗️ BỐ CỤC (10 điểm):
                - MỞ BÀI: Giới thiệu chủ đề, nêu luận điểm chính
                - THÂN BÀI: 2-3 đoạn với luận điểm + dẫn chứng
                - KẾT BÀI: Tổng kết, nhấn mạnh quan điểm
                - Đoạn văn rõ ràng, chuyển ý mượt mà
                
                === HƯỚNG DẪN CHẤM KHI THIẾU KÝ TỰ ===
                
                1. CHẤM NỘI DUNG ĐÃ VIẾT trước (giả sử đủ ký tự)
                2. SAU ĐÓ trừ điểm theo mức độ hoàn thành:
                
                | Số ký tự    | % hoàn thành | Hệ số điểm |
                |-------------|--------------|------------|
                | 600-700     | 100%         | x 1.0      |
                | 500-599     | 83-99%       | x 0.8      |
                | 400-499     | 67-82%       | x 0.6      |
                | 300-399     | 50-66%       | x 0.5      |
                | 200-299     | 33-49%       | x 0.4      |
                | 100-199     | 17-32%       | x 0.2      |
                | <100        | <17%         | x 0.1      |
                
                VÍ DỤ: Bài viết 295 ký tự → ~49% hoàn thành
                - Nếu nội dung viết tốt (32/40), sau khi nhân hệ số 0.4 → 13/40
                - Áp dụng tương tự cho grammar, vocabulary, organization
                
                === TRẢ VỀ JSON ===
                {
                  "content": <0-40 - ĐÃ ÁP DỤNG hệ số trừ điểm>,
                  "grammar": <0-30 - ĐÃ ÁP DỤNG hệ số trừ điểm>,
                  "vocabulary": <0-20 - ĐÃ ÁP DỤNG hệ số trừ điểm>,
                  "organization": <0-10 - ĐÃ ÁP DỤNG hệ số trừ điểm>,
                  "feedback": "<NHẬN XÉT CHI TIẾT gồm:\\n📏 VỀ ĐỘ DÀI: [nhận xét về số ký tự, % hoàn thành]\\n✅ ƯU ĐIỂM: [liệt kê 2-3 điểm tốt trong phần đã viết]\\n❌ NHƯỢC ĐIỂM: [liệt kê 2-3 điểm cần cải thiện]\\n🏗️ VỀ BỐ CỤC: [đánh giá mở-thân-kết]>",
                  "suggestions": [
                    "<Cách phát triển thêm nội dung để đủ ký tự>",
                    "<Cách cải thiện lập luận/dẫn chứng>",
                    "<Cách cải thiện ngữ pháp/từ vựng cụ thể>"
                  ]
                }
                
                Chỉ trả về JSON.
                """);
        
        return prompt.toString();
    }

    /**
     * Parse JSON response từ AI
     */
    private WritingGradingResult parseAIResponse(String aiResponse) {
        try {
            // Remove markdown code blocks if present
            String jsonStr = aiResponse.trim();
            if (jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.replaceAll("```json\\n?", "").replaceAll("```\\n?", "");
            } else if (jsonStr.startsWith("```")) {
                jsonStr = jsonStr.replaceAll("```\\n?", "");
            }

            JsonNode root = objectMapper.readTree(jsonStr);

            WritingGradingResult result = new WritingGradingResult();
            
            WritingGradingResult.Breakdown breakdown = new WritingGradingResult.Breakdown();
            breakdown.setContent(root.path("content").asInt(0));
            breakdown.setGrammar(root.path("grammar").asInt(0));
            breakdown.setVocabulary(root.path("vocabulary").asInt(0));
            breakdown.setOrganization(root.path("organization").asInt(0));
            result.setBreakdown(breakdown);

            int totalScore = breakdown.getContent() + breakdown.getGrammar() 
                    + breakdown.getVocabulary() + breakdown.getOrganization();
            result.setScore(totalScore);

            result.setFeedback(root.path("feedback").asText("Đã chấm điểm xong."));

            List<String> suggestions = new ArrayList<>();
            JsonNode suggestionsNode = root.path("suggestions");
            if (suggestionsNode.isArray()) {
                suggestionsNode.forEach(node -> suggestions.add(node.asText()));
            }
            result.setSuggestions(suggestions);

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response: " + e.getMessage(), e);
        }
    }

    /**
     * Kết quả khi bài viết không đủ số ký tự (chỉ dùng cho SHORT)
     */
    private WritingGradingResult createInvalidLengthResult(WritingGradingRequest request, int charCount) {
        WritingGradingResult result = new WritingGradingResult();
        result.setScore(0);
        result.setFeedback(String.format(
                "Câu trả lời không đạt yêu cầu. Yêu cầu: %d-%d ký tự, bạn viết: %d ký tự.",
                request.getMinChars(), request.getMaxChars(), charCount
        ));

        WritingGradingResult.Breakdown breakdown = new WritingGradingResult.Breakdown();
        breakdown.setContent(0);
        breakdown.setGrammar(0);
        breakdown.setVocabulary(0);
        breakdown.setOrganization(0);
        result.setBreakdown(breakdown);

        List<String> suggestions = new ArrayList<>();
        suggestions.add(String.format(
                "Hãy viết đủ %d-%d ký tự để đạt yêu cầu.",
                request.getMinChars(), request.getMaxChars()
        ));
        result.setSuggestions(suggestions);

        return result;
    }
    
    /**
     * Kết quả khi câu trả lời trống
     */
    private WritingGradingResult createEmptyAnswerResult(WritingGradingRequest request) {
        WritingGradingResult result = new WritingGradingResult();
        result.setScore(0);
        result.setFeedback("Bạn chưa viết câu trả lời.");

        WritingGradingResult.Breakdown breakdown = new WritingGradingResult.Breakdown();
        breakdown.setContent(0);
        breakdown.setGrammar(0);
        breakdown.setVocabulary(0);
        breakdown.setOrganization(0);
        result.setBreakdown(breakdown);

        List<String> suggestions = new ArrayList<>();
        suggestions.add("Hãy đọc kỹ đề bài và viết câu trả lời.");
        result.setSuggestions(suggestions);

        return result;
    }

    /**
     * Fallback kết quả khi AI lỗi
     */
    private WritingGradingResult createFallbackResult(WritingGradingRequest request) {
        int charCount = request.getStudentAnswer().length();
        int targetMid = (request.getMinChars() + request.getMaxChars()) / 2;
        int lengthScore = Math.min(100, (charCount * 100) / targetMid);
        int score = (int) (lengthScore * 0.6); // 60% of length-based score

        WritingGradingResult result = new WritingGradingResult();
        result.setScore(score);
        result.setFeedback("Hệ thống AI tạm thời không khả dụng. Điểm tạm tính dựa trên độ dài bài viết.");

        WritingGradingResult.Breakdown breakdown = new WritingGradingResult.Breakdown();
        breakdown.setContent((int) (score * 0.4));
        breakdown.setGrammar((int) (score * 0.3));
        breakdown.setVocabulary((int) (score * 0.2));
        breakdown.setOrganization((int) (score * 0.1));
        result.setBreakdown(breakdown);

        List<String> suggestions = new ArrayList<>();
        suggestions.add("Vui lòng thử lại sau khi hệ thống AI phục hồi.");
        suggestions.add("Liên hệ giáo viên để được chấm điểm thủ công.");
        result.setSuggestions(suggestions);

        return result;
    }
}
