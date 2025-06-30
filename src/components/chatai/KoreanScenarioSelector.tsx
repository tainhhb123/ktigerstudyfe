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
    gradient: 'from-orange-400 to-red-500',
    examples: ['Hỏi menu', 'Đặt món ăn', 'Thanh toán']
  },
  { 
    id: 'shopping' as KoreanChatScenario, 
    title: 'Mua sắm', 
    icon: '🛍️', 
    description: 'Giao tiếp khi mua sắm tại cửa hàng hoặc chợ',
    gradient: 'from-pink-400 to-purple-500',
    examples: ['Hỏi giá', 'Kiểm tra size', 'Thanh toán']
  },
  { 
    id: 'direction' as KoreanChatScenario, 
    title: 'Hỏi đường', 
    icon: '🗺️', 
    description: 'Hỏi đường và tìm kiếm địa điểm ở Hàn Quốc',
    gradient: 'from-blue-400 to-indigo-500',
    examples: ['Tìm ga tàu điện', 'Đến điểm du lịch', 'Thông tin xe buýt']
  },
  { 
    id: 'introduction' as KoreanChatScenario, 
    title: 'Chào hỏi làm quen', 
    icon: '👋', 
    description: 'Làm quen và chào hỏi với người Hàn Quốc',
    gradient: 'from-green-400 to-blue-500',
    examples: ['Tự giới thiệu', 'Hỏi thăm', 'Trao đổi liên lạc']
  },
  { 
    id: 'daily' as KoreanChatScenario, 
    title: 'Trò chuyện hàng ngày', 
    icon: '💬', 
    description: 'Trò chuyện thường ngày với bạn bè người Hàn',
    gradient: 'from-yellow-400 to-orange-500',
    examples: ['Nói về thời tiết', 'Chia sẻ sở thích', 'Lập kế hoạch']
  }
];

const difficulties = [
  { 
    id: 'beginner' as KoreanDifficultyLevel, 
    title: 'Cơ bản', 
    description: 'Từ vựng cơ bản và câu đơn giản',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: '🌱'
  },
  { 
    id: 'intermediate' as KoreanDifficultyLevel, 
    title: 'Trung cấp', 
    description: 'Từ vựng thông dụng và ngữ pháp cơ bản',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: '🌿'
  },
  { 
    id: 'advanced' as KoreanDifficultyLevel, 
    title: 'Nâng cao', 
    description: 'Biểu đạt tự nhiên như người Hàn',
    color: 'bg-red-100 text-red-800 border-red-300',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Trò chuyện tiếng Hàn với AI 🇰🇷
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Luyện tập hội thoại tiếng Hàn thực tế cùng AI
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Giáo viên AI đã sẵn sàng</span>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🎯 Chọn tình huống giao tiếp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedScenario === scenario.id
                    ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
                    : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <div className={`bg-gradient-to-br ${scenario.gradient} p-1`}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full">
                    <div className="text-4xl mb-4 text-center">{scenario.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">
                      {scenario.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                      {scenario.description}
                    </p>
                    <div className="space-y-1">
                      {scenario.examples.map((example, index) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-center"
                        >
                          {example}
                        </div>
                      ))}
                    </div>
                    {selectedScenario === scenario.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            📊 Chọn trình độ của bạn
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {difficulties.map((difficulty) => (
              <div
                key={difficulty.id}
                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  selectedDifficulty === difficulty.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 transform scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-lg'
                }`}
                onClick={() => setSelectedDifficulty(difficulty.id)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{difficulty.icon}</div>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-3 border-2 ${difficulty.color}`}>
                    {difficulty.title}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {difficulty.description}
                  </p>
                  {selectedDifficulty === difficulty.id && (
                    <div className="mt-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button
            onClick={handleStart}
            disabled={!selectedScenario || !selectedDifficulty}
            size="lg"
            className={`px-12 py-4 text-xl font-semibold rounded-2xl transition-all duration-300 ${
              selectedScenario && selectedDifficulty
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            🚀 Bắt đầu trò chuyện
          </Button>
          {(!selectedScenario || !selectedDifficulty) && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Vui lòng chọn tình huống và trình độ
            </p>
          )}
        </div>
      </div>
    </div>
  );
}