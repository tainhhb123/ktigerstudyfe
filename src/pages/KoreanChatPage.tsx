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
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#FFE8DC', borderTopColor: '#FF6B35' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🇰🇷</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#333333' }}>
            Giáo viên AI đang chuẩn bị...
          </h3>
          <p style={{ color: '#666666' }}>
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