import axiosInstance from './axiosConfig';
import {
  ExamResponse,
  ExamRequest,
  ExamSectionResponse,
  ExamSectionRequest,
  QuestionResponse,
  QuestionRequest,
  AnswerChoiceResponse,
  AnswerChoiceRequest,
  ExamAttemptResponse,
  ExamAttemptRequest,
  UserAnswerResponse,
  UserAnswerRequest,
  ExamResultResponse,
} from '../types/exam';
import { WritingGradingRequest, WritingGradingResult } from './aiGradingService';

// Exam APIs
export const examApi = {
  // Get all active exams for users
  getActiveExams: async (): Promise<ExamResponse[]> => {
    const response = await axiosInstance.get<ExamResponse[]>('/api/exams/active');
    return response.data;
  },

  // Get all exams (admin)
  getAllExams: async (): Promise<ExamResponse[]> => {
    const response = await axiosInstance.get<ExamResponse[]>('/api/exams');
    return response.data;
  },

  // Get exam by ID
  getExamById: async (id: number): Promise<ExamResponse> => {
    const response = await axiosInstance.get<ExamResponse>(`/api/exams/${id}`);
    return response.data;
  },

  // Create new exam (admin)
  createExam: async (request: ExamRequest): Promise<ExamResponse> => {
    const response = await axiosInstance.post<ExamResponse>('/api/exams', request);
    return response.data;
  },

  // Update exam (admin)
  updateExam: async (id: number, request: Partial<ExamRequest>): Promise<ExamResponse> => {
    const response = await axiosInstance.put<ExamResponse>(`/api/exams/${id}`, request);
    return response.data;
  },

  // Delete exam (admin)
  deleteExam: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/exams/${id}`);
  },
};

// Exam Section APIs
export const examSectionApi = {
  // Get sections by exam ID
  getSectionsByExam: async (examId: number): Promise<ExamSectionResponse[]> => {
    const response = await axiosInstance.get<ExamSectionResponse[]>(`/api/exam-sections/exam/${examId}`);
    return response.data;
  },

  // Get section by ID
  getSectionById: async (id: number): Promise<ExamSectionResponse> => {
    const response = await axiosInstance.get<ExamSectionResponse>(`/api/exam-sections/${id}`);
    return response.data;
  },

  // Create new section (admin)
  createSection: async (request: ExamSectionRequest): Promise<ExamSectionResponse> => {
    const response = await axiosInstance.post<ExamSectionResponse>('/api/exam-sections', request);
    return response.data;
  },

  // Update section (admin)
  updateSection: async (id: number, request: Partial<ExamSectionRequest>): Promise<ExamSectionResponse> => {
    const response = await axiosInstance.put<ExamSectionResponse>(`/api/exam-sections/${id}`, request);
    return response.data;
  },

  // Delete section (admin)
  deleteSection: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/exam-sections/${id}`);
  },
};

// Exam Attempt APIs
export const examAttemptApi = {
  // Start exam
  startExam: async (request: ExamAttemptRequest): Promise<ExamAttemptResponse> => {
    const response = await axiosInstance.post<ExamAttemptResponse>('/api/exam-attempts/start', request);
    return response.data;
  },

  // Get attempt by ID
  getAttemptById: async (id: number): Promise<ExamAttemptResponse> => {
    const response = await axiosInstance.get<ExamAttemptResponse>(`/api/exam-attempts/${id}`);
    return response.data;
  },

  // Get user's attempts
  getAttemptsByUser: async (userId: number): Promise<ExamAttemptResponse[]> => {
    const response = await axiosInstance.get<ExamAttemptResponse[]>(`/api/exam-attempts/user/${userId}`);
    return response.data;
  },

  // Submit exam (with extended timeout for AI grading)
  submitExam: async (attemptId: number): Promise<ExamAttemptResponse> => {
    const response = await axiosInstance.post<ExamAttemptResponse>(
      `/api/exam-attempts/${attemptId}/submit`,
      {},
      { timeout: 120000 } // 2 minutes timeout for AI grading
    );
    return response.data;
  },

  // Get exam result
  getResult: async (attemptId: number): Promise<ExamResultResponse> => {
    const response = await axiosInstance.get<ExamResultResponse>(`/api/exam-attempts/${attemptId}/result`);
    return response.data;
  },
};

// Question APIs
export const questionApi = {
  // Get questions by section ID
  getQuestionsBySection: async (sectionId: number): Promise<QuestionResponse[]> => {
    const response = await axiosInstance.get<QuestionResponse[]>(`/api/questions/section/${sectionId}`);
    return response.data;
  },

  // Get question by ID
  getQuestionById: async (id: number): Promise<QuestionResponse> => {
    const response = await axiosInstance.get<QuestionResponse>(`/api/questions/${id}`);
    return response.data;
  },

  // Create new question (admin)
  createQuestion: async (request: QuestionRequest): Promise<QuestionResponse> => {
    const response = await axiosInstance.post<QuestionResponse>('/api/questions', request);
    return response.data;
  },

  // Update question (admin)
  updateQuestion: async (id: number, request: Partial<QuestionRequest>): Promise<QuestionResponse> => {
    const response = await axiosInstance.put<QuestionResponse>(`/api/questions/${id}`, request);
    return response.data;
  },

  // Delete question (admin)
  deleteQuestion: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/questions/${id}`);
  },
};

// Answer Choice APIs
export const answerChoiceApi = {
  // Get answer choices by question ID
  getChoicesByQuestion: async (questionId: number): Promise<AnswerChoiceResponse[]> => {
    const response = await axiosInstance.get<AnswerChoiceResponse[]>(`/api/answer-choices/question/${questionId}`);
    return response.data;
  },

  // Get answer choice by ID
  getChoiceById: async (id: number): Promise<AnswerChoiceResponse> => {
    const response = await axiosInstance.get<AnswerChoiceResponse>(`/api/answer-choices/${id}`);
    return response.data;
  },

  // Create new answer choice (admin)
  createChoice: async (request: AnswerChoiceRequest): Promise<AnswerChoiceResponse> => {
    const response = await axiosInstance.post<AnswerChoiceResponse>('/api/answer-choices', request);
    return response.data;
  },

  // Update answer choice (admin)
  updateChoice: async (id: number, request: Partial<AnswerChoiceRequest>): Promise<AnswerChoiceResponse> => {
    const response = await axiosInstance.put<AnswerChoiceResponse>(`/api/answer-choices/${id}`, request);
    return response.data;
  },

  // Delete answer choice (admin)
  deleteChoice: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/answer-choices/${id}`);
  },
};

// User Answer APIs
export const userAnswerApi = {
  // Save user's answer to a question
  saveUserAnswer: async (request: UserAnswerRequest): Promise<UserAnswerResponse> => {
    const response = await axiosInstance.post<UserAnswerResponse>('/api/user-answers', request);
    return response.data;
  },

  // Get all user answers for an attempt
  getAnswersByAttempt: async (attemptId: number): Promise<UserAnswerResponse[]> => {
    const response = await axiosInstance.get<UserAnswerResponse[]>(`/api/user-answers/attempt/${attemptId}`);
    return response.data;
  },
};

// AI Grading APIs - Gọi backend để xử lý AI grading
export const aiGradingApi = {
  // Grade all writing answers for an exam attempt
  gradeAllWritingAnswers: async (attemptId: number): Promise<Record<number, WritingGradingResult>> => {
    const response = await axiosInstance.post<Record<number, WritingGradingResult>>(
      `/api/exam-attempts/${attemptId}/grade-writing`
    );
    return response.data;
  },
};

export default axiosInstance;
