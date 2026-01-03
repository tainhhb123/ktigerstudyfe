package Topikwriting;

/**
 * Service interface cho AI Grading
 * 
 * Lưu ý khi copy vào BE:
 * - Đổi package thành: org.example.ktigerstudybe.service.aiGrading
 * - Import WritingGradingRequest và WritingGradingResult từ package dto
 */
public interface AIGradingService {
    
    /**
     * Chấm điểm bài viết TOPIK Writing
     * 
     * @param request Thông tin câu hỏi và câu trả lời
     * @return Kết quả chấm điểm (0-100) + feedback
     */
    WritingGradingResult gradeWriting(WritingGradingRequest request);
}
