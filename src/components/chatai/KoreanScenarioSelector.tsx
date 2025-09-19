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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">
            Trò chuyện tiếng Hàn với AI 🇰🇷
          </h1>
          <p className="text-lg text-green-700 dark:text-green-200 mb-2">
            Luyện tập hội thoại tiếng Hàn thực tế cùng AI
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-green-600 dark:text-green-400">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Giáo viên AI đã sẵn sàng</span>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4 text-center">
            🎯 Chọn tình huống giao tiếp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`relative rounded-xl border-2 p-5 cursor-pointer transition
                  ${
                    selectedScenario === scenario.id
                      ? 'border-green-600 bg-green-100 dark:bg-green-800'
                      : 'border-green-200 bg-white hover:border-green-400 dark:border-green-700 dark:bg-gray-800 dark:hover:border-green-400'
                  }
                `}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <div className="text-3xl mb-2 text-center">{scenario.icon}</div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-100 mb-1 text-center">
                  {scenario.title}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-200 mb-2 text-center">
                  {scenario.description}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {scenario.examples.map((example, index) => (
                    <span
                      key={index}
                      className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded-full border border-green-100 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
                    >
                      {example}
                    </span>
                  ))}
                </div>
                {selectedScenario === scenario.id && (
                  <div className="absolute top-2 right-2">
                    <span className="text-green-600 dark:text-green-200 text-lg font-bold">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4 text-center">
            📊 Chọn trình độ của bạn
          </h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficulties.map((difficulty) => (
              <div
                key={difficulty.id}
                className={`relative border-2 rounded-xl p-5 cursor-pointer transition
                  ${
                    selectedDifficulty === difficulty.id
                      ? 'border-green-600 bg-green-100 dark:bg-green-800'
                      : 'border-green-200 bg-white hover:border-green-400 dark:border-green-700 dark:bg-gray-800 dark:hover:border-green-400'
                  }
                `}
                onClick={() => setSelectedDifficulty(difficulty.id)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{difficulty.icon}</div>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-2 border-2 ${difficulty.color}`}>
                    {difficulty.title}
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-200">{difficulty.description}</p>
                  {selectedDifficulty === difficulty.id && (
                    <div className="mt-2">
                      <span className="text-green-600 dark:text-green-200 text-lg font-bold">✓</span>
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
            className={`px-10 py-3 text-lg font-semibold rounded-xl ${
              selectedScenario && selectedDifficulty
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-100 text-green-400 cursor-not-allowed dark:bg-green-900 dark:text-green-700'
            }`}
          >
            🚀 Bắt đầu trò chuyện
          </Button>
          {(!selectedScenario || !selectedDifficulty) && (
            <p className="text-sm text-green-600 dark:text-green-300 mt-3">
              Vui lòng chọn tình huống và trình độ
            </p>
          )}
        </div>
      </div>
    </div>
  );
}