import axiosInstance from './axiosConfig';
import { ChatConversation, ChatMessage, CreateConversationRequest, SendMessageRequest, ChatResponsePair } from '../types/koreanChat';

const API_BASE_URL = '/api/chat';

export const koreanChatApi = {
  createConversation: async (request: CreateConversationRequest): Promise<ChatConversation> => {
    const response = await axiosInstance.post(`${API_BASE_URL}/conversations`, request);
    return response.data;
  },

  sendMessage: async (conversationId: number, request: SendMessageRequest): Promise<ChatResponsePair> => {
    const response = await axiosInstance.post(`${API_BASE_URL}/conversations/${conversationId}/messages`, request);
    return response.data;
  },

  getMessages: async (conversationId: number): Promise<ChatMessage[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/conversations/${conversationId}/messages`);
    return response.data;
  },

  getUserConversations: async (userId: number): Promise<ChatConversation[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/users/${userId}/conversations`);
    return response.data;
  },

  deleteConversation: async (conversationId: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE_URL}/conversations/${conversationId}`);
  }
};