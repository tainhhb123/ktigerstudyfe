import React, { useState } from 'react';
import KoreanScenarioSelector from '../components/chatai/KoreanScenarioSelector';
import KoreanChatInterface from '../components/chatai/KoreanChatInterface';
import { KoreanChatScenario, KoreanDifficultyLevel } from '../types/koreanChat';
import { koreanChatApi } from '../services/koreanChatApi';

export default function KoreanChatPage() {
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [currentScenario, setCurrentScenario] = useState<KoreanChatScenario | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<KoreanDifficultyLevel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectScenario = async (scenario: KoreanChatScenario, difficulty: KoreanDifficultyLevel) => {
    setIsLoading(true);
    try {
      // TODO: Lấy userId thực từ auth context
      const userId = 1;
      const conversation = await koreanChatApi.createConversation({ 
        userId, 
        scenario, 
        difficulty 
      });
      setCurrentConversationId(conversation.conversationId);
      setCurrentScenario(scenario);
      setCurrentDifficulty(difficulty);
    } catch (error) {
      console.error('Lỗi khi tạo cuộc trò chuyện:', error);
      alert('Không thể tạo cuộc trò chuyện. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentConversationId(null);
    setCurrentScenario(null);
    setCurrentDifficulty(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🇰🇷</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Giáo viên AI đang chuẩn bị...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Sắp có thể bắt đầu trò chuyện tiếng Hàn
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {currentConversationId && currentScenario && currentDifficulty ? (
        <KoreanChatInterface
          conversationId={currentConversationId}
          scenario={currentScenario}
          difficulty={currentDifficulty}
          onBack={handleBack}
        />
      ) : (
        <KoreanScenarioSelector onSelectScenario={handleSelectScenario} />
      )}
    </div>
  );
}