import React, { useState } from 'react';
import Button from '../ui/button/Button';
import { KoreanChatScenario, KoreanDifficultyLevel } from '../../types/koreanChat';

interface KoreanScenarioSelectorProps {
  onSelectScenario: (scenario: KoreanChatScenario, difficulty: KoreanDifficultyLevel) => void;
}

const scenarios = [
  {
    id: 'restaurant' as KoreanChatScenario,
    title: 'Đặt món tại nhà hàng',
    icon: '🍽️',
    description: 'Luyện tập đặt món và giao tiếp tại nhà hàng Hàn Quốc',
    examples: ['Hỏi menu', 'Đặt món ăn', 'Thanh toán']
  },
  {
    id: 'shopping' as KoreanChatScenario,
    title: 'Mua sắm',
    icon: '🛍️',
    description: 'Giao tiếp khi mua sắm tại cửa hàng hoặc chợ',
    examples: ['Hỏi giá', 'Kiểm tra size', 'Thanh toán']
  },
  {
    id: 'direction' as KoreanChatScenario,
    title: 'Hỏi đường',
    icon: '🗺️',
    description: 'Hỏi đường và tìm kiếm địa điểm ở Hàn Quốc',
    examples: ['Tìm ga tàu điện', 'Đến điểm du lịch', 'Thông tin xe buýt']
  },
  {
    id: 'introduction' as KoreanChatScenario,
    title: 'Chào hỏi làm quen',
    icon: '👋',
    description: 'Làm quen và chào hỏi với người Hàn Quốc',
    examples: ['Tự giới thiệu', 'Hỏi thăm', 'Trao đổi liên lạc']
  },
  {
    id: 'daily' as KoreanChatScenario,
    title: 'Trò chuyện hàng ngày',
    icon: '💬',
    description: 'Trò chuyện thường ngày với bạn bè người Hàn',
    examples: ['Nói về thời tiết', 'Chia sẻ sở thích', 'Lập kế hoạch']
  }
];

const difficulties = [
  {
    id: 'beginner' as KoreanDifficultyLevel,
    title: 'Cơ bản',
    description: 'Từ vựng cơ bản và câu đơn giản',
    color: 'bg-green-50 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700',
    icon: '🌱'
  },
  {
    id: 'intermediate' as KoreanDifficultyLevel,
    title: 'Trung cấp',
    description: 'Từ vựng thông dụng và ngữ pháp cơ bản',
    color: 'bg-green-100 text-green-900 border-green-400 dark:bg-green-800 dark:text-green-100 dark:border-green-600',
    icon: '🌿'
  },
  {
    id: 'advanced' as KoreanDifficultyLevel,
    title: 'Nâng cao',
    description: 'Biểu đạt tự nhiên như người Hàn',
    color: 'bg-green-200 text-green-900 border-green-500 dark:bg-green-700 dark:text-green-50 dark:border-green-500',
    icon: '🌳'
  }
];

export default function KoreanScenarioSelector({ onSelectScenario }: KoreanScenarioSelectorProps) {
  const [selectedScenario, setSelectedScenario] = useState<KoreanChatScenario | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<KoreanDifficultyLevel | null>(null);

  const handleStart = () => {
    if (selectedScenario && selectedDifficulty) {
      onSelectScenario(selectedScenario, selectedDifficulty);
    }
  };

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span style={{ color: '#FF6B35' }}>Trò chuyện tiếng Hàn</span>
            <span style={{ color: '#4CAF50' }}> với AI</span>
            <span className="ml-2">🇰🇷</span>
          </h1>
          <p className="text-lg mb-3" style={{ color: '#666666' }}>
            Luyện tập hội thoại tiếng Hàn thực tế cùng AI
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm" style={{ color: '#4CAF50' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4CAF50' }}></span>
            <span>Giáo viên AI đã sẵn sàng</span>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#333333' }}>
            🎯 Chọn tình huống giao tiếp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: selectedScenario === scenario.id ? '#FFE8DC' : '#FFFFFF',
                  borderColor: selectedScenario === scenario.id ? '#FF6B35' : '#BDBDBD',
                  boxShadow: selectedScenario === scenario.id ? '0 4px 12px rgba(255,107,53,0.2)' : 'none'
                }}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <div className="text-3xl mb-2 text-center">{scenario.icon}</div>
                <h3 className="text-lg font-bold mb-1 text-center" style={{ color: '#333333' }}>
                  {scenario.title}
                </h3>
                <p className="text-sm mb-3 text-center" style={{ color: '#666666' }}>
                  {scenario.description}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {scenario.examples.map((example, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: '#FFF8F0', color: '#FF6B35', border: '1px solid #FFE8DC' }}
                    >
                      {example}
                    </span>
                  ))}
                </div>
                {selectedScenario === scenario.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B35' }}>
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#333333' }}>
            📊 Chọn trình độ của bạn
          </h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficulties.map((difficulty) => (
              <div
                key={difficulty.id}
                className="relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: selectedDifficulty === difficulty.id ? '#E8F5E9' : '#FFFFFF',
                  borderColor: selectedDifficulty === difficulty.id ? '#4CAF50' : '#BDBDBD',
                  boxShadow: selectedDifficulty === difficulty.id ? '0 4px 12px rgba(76,175,80,0.2)' : 'none'
                }}
                onClick={() => setSelectedDifficulty(difficulty.id)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{difficulty.icon}</div>
                  <div 
                    className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-2"
                    style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                  >
                    {difficulty.title}
                  </div>
                  <p className="text-sm" style={{ color: '#666666' }}>{difficulty.description}</p>
                  {selectedDifficulty === difficulty.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4CAF50' }}>
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStart}
            disabled={!selectedScenario || !selectedDifficulty}
            className="px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{
              backgroundColor: selectedScenario && selectedDifficulty ? '#FF6B35' : '#E0E0E0',
              color: selectedScenario && selectedDifficulty ? '#FFFFFF' : '#999999',
              cursor: selectedScenario && selectedDifficulty ? 'pointer' : 'not-allowed'
            }}
          >
            🚀 Bắt đầu trò chuyện
          </button>
          {(!selectedScenario || !selectedDifficulty) && (
            <p className="text-sm mt-3" style={{ color: '#666666' }}>
              Vui lòng chọn tình huống và trình độ
            </p>
          )}
        </div>
      </div>
    </div>
  );
}