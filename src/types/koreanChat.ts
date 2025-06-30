export interface ChatConversation {
  conversationId: number;
  userId: number;
  title: string;
  scenario: string;
  difficulty: string;
  createdAt: string;
  messageCount: number;
}

export interface ChatMessage {
  messageId: number;
  conversationId: number;
  content: string;
  messageType: 'user' | 'ai';
  sender: 'user' | 'ai'; // <-- Thêm dòng này
  timestamp: string;
}

export interface CreateConversationRequest {
  userId: number;
  scenario: string;
  difficulty: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface ChatResponsePair {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
}

export type KoreanChatScenario = 'restaurant' | 'shopping' | 'direction' | 'introduction' | 'daily';
export type KoreanDifficultyLevel = 'beginner' | 'intermediate' | 'advanced';