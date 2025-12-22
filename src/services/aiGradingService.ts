import axios from 'axios';

// API gọi đến backend, backend sẽ xử lý Groq API
const API_BASE_URL = '/api/ai-grading';

export interface WritingGradingRequest {
  questionNumber: number; // 53 or 54
  questionText: string;
  referenceAnswer?: string; // Câu trả lời mẫu
  studentAnswer: string;
  minChars: number; // 200 or 600
  maxChars: number; // 300 or 700
}

export interface WritingGradingResult {
  score: number; // 0-100
  feedback: string;
  breakdown: {
    content: number; // 0-40
    grammar: number; // 0-30
    vocabulary: number; // 0-20
    organization: number; // 0-10
  };
  suggestions: string[];
}

class AIGradingService {
  /**
   * Gọi backend để chấm điểm Writing
   * Backend sẽ xử lý Groq API và trả về kết quả
   */
  async gradeWriting(request: WritingGradingRequest): Promise<WritingGradingResult> {
    try {
      const response = await axios.post<WritingGradingResult>(
        `${API_BASE_URL}/grade-writing`,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error('AI Grading Error:', error);
      
      // Fallback: basic grading if backend fails
      return this.getFallbackGrading(request);
    }
  }

  /**
   * Chấm nhiều bài viết cùng lúc
   */
  async gradeMultipleWriting(requests: WritingGradingRequest[]): Promise<WritingGradingResult[]> {
    try {
      const response = await axios.post<WritingGradingResult[]>(
        `${API_BASE_URL}/grade-multiple`,
        { requests }
      );
      return response.data;
    } catch (error) {
      console.error('Batch grading error:', error);
      // Fallback: grade one by one
      const results = await Promise.all(
        requests.map(request => this.gradeWriting(request))
      );
      return results;
    }
  }

  /**
   * Fallback grading nếu backend lỗi
   */
  private getFallbackGrading(request: WritingGradingRequest): WritingGradingResult {
    const charCount = request.studentAnswer.length;
    
    // Check character count
    if (charCount < request.minChars || charCount > request.maxChars) {
      return {
        score: 0,
        feedback: `Bài viết không đạt yêu cầu về số ký tự. Yêu cầu: ${request.minChars}-${request.maxChars} ký tự, bạn viết: ${charCount} ký tự.`,
        breakdown: {
          content: 0,
          grammar: 0,
          vocabulary: 0,
          organization: 0,
        },
        suggestions: [
          `Hãy viết đủ ${request.minChars}-${request.maxChars} ký tự để đạt yêu cầu đề bài.`
        ],
      };
    }

    // Simple length-based scoring
    const targetMid = (request.minChars + request.maxChars) / 2;
    const lengthScore = Math.min(100, (charCount / targetMid) * 100);
    const score = Math.round(lengthScore * 0.6); // 60% of length-based score

    return {
      score,
      feedback: 'Hệ thống AI tạm thời không khả dụng. Điểm tạm tính dựa trên độ dài bài viết.',
      breakdown: {
        content: Math.round(score * 0.4),
        grammar: Math.round(score * 0.3),
        vocabulary: Math.round(score * 0.2),
        organization: Math.round(score * 0.1),
      },
      suggestions: [
        'Vui lòng thử lại sau khi hệ thống AI phục hồi.',
        'Liên hệ giáo viên để được chấm điểm thủ công.',
      ],
    };
  }
}

export const aiGradingService = new AIGradingService();
export default aiGradingService;
