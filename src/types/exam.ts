// Exam Types based on backend JPA models

// Enums matching backend
export type ExamType = "TOPIK_I" | "TOPIK_II";
export type SectionType = "LISTENING" | "READING" | "WRITING";
export type QuestionType = "MCQ" | "SHORT" | "ESSAY"; // ✅ Match backend enum
export type ExamAttemptStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export interface ExamResponse {
  examId: number;
  title: string;
  examType: ExamType;
  totalQuestion: number;
  durationMinutes: number;
  isActive: boolean;
  sections?: ExamSectionResponse[];
}

export interface ExamSectionResponse {
  sectionId: number;
  examId?: number;
  exam?: ExamResponse;
  sectionType: SectionType;
  examType: ExamType;
  sectionOrder: number;
  totalQuestions: number;
  durationMinutes: number;
  audioUrl?: string | null; // Audio file cho toàn bộ section (dùng cho Listening section)
  questions?: QuestionResponse[];
}

export interface QuestionResponse {
  questionId: number;
  sectionId?: number;
  section?: ExamSectionResponse;
  groupId?: number | null;
  questionNumber: number;
  questionType: QuestionType;
  questionText?: string | null;
  passageText?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
  correctAnswer?: string | null;
  points: number; // BigDecimal from backend as number
  choices?: AnswerChoiceResponse[];
}

export interface AnswerChoiceResponse {
  choiceId: number;
  questionId?: number;
  question?: QuestionResponse;
  choiceLabel: string; // "A", "B", "C", "D" or "①", "②", "③", "④"
  choiceText: string;
  isCorrect: boolean;
}

export interface ExamAttemptResponse {
  attemptId: number;
  examId?: number;
  userId?: number;
  exam?: ExamResponse;
  startTime: string; // LocalDateTime from backend as ISO string
  endTime?: string | null;
  status: ExamAttemptStatus;
  totalScore?: number | null;
  listeningScore?: number | null;
  readingScore?: number | null;
  writingScore?: number | null;
}

export interface UserAnswerResponse {
  userAnswerId: number;
  attemptId?: number;
  questionId?: number;
  choiceId?: number | null;
  attempt?: ExamAttemptResponse;
  question?: QuestionResponse;
  choice?: AnswerChoiceResponse;
  answerText?: string | null;
  score?: number;
}

// Request types
export interface ExamRequest {
  title: string;
  examType: string;
  totalQuestion: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface ExamSectionRequest {
  examId: number;
  sectionType: SectionType;
  examType: ExamType;
  sectionOrder: number;
  totalQuestions: number;
  durationMinutes: number;
  audioUrl?: string | null;
}

export interface QuestionRequest {
  sectionId: number;
  groupId?: number | null;
  questionNumber: number;
  questionType: QuestionType;
  questionText?: string | null;
  passageText?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
  correctAnswer?: string | null;
  points: number;
}

export interface ExamAttemptRequest {
  examId: number;
  userId: number;
}

export interface UserAnswerRequest {
  attemptId: number;
  questionId: number;
  choiceId?: number;
  answerText?: string;
}

export interface AnswerChoiceRequest {
  questionId: number;
  choiceLabel: string;
  choiceText: string;
  isCorrect: boolean;
}

// ===== Exam Result Types (matching Backend) =====
export interface ExamResultResponse {
  attemptId: number;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  sectionResults: Record<string, SectionResultResponse>; // Map<String, SectionResultResponse> from BE
  questions: QuestionResultResponse[];
}

export interface SectionResultResponse {
  sectionType: string; // "LISTENING" | "WRITING" | "READING"
  score: number;
  totalPoints: number;
  correctCount: number;
  totalCount: number;
  percentage: number;
}

// ✨ AI Score Breakdown cho ESSAY questions
export interface AIScoreBreakdown {
  content: number;       // Nội dung (0-40)
  grammar: number;       // Ngữ pháp (0-30)
  vocabulary: number;    // Từ vựng (0-20)
  organization: number;  // Tổ chức (0-10)
}

export interface QuestionResultResponse {
  questionId: number;
  questionNumber: number;
  questionText: string;
  questionType: string; // "MCQ" | "SHORT" | "ESSAY"
  sectionType: string; // "LISTENING" | "WRITING" | "READING"
  userAnswer?: string;
  correctAnswer?: string;
  isCorrect: boolean; // @JsonProperty("isCorrect") from BE
  score: number;
  maxScore: number;
  
  // ✨ AI Grading fields (cho ESSAY questions)
  aiScore?: number;                 // Điểm AI (0-100)
  aiFeedback?: string;              // Nhận xét từ AI
  aiBreakdown?: AIScoreBreakdown;   // Chi tiết điểm theo tiêu chí
  aiSuggestions?: string[];         // Gợi ý cải thiện
}
