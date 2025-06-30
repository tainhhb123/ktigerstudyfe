// src/components/chatai/KoreanChatInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { KoreanChatScenario, KoreanDifficultyLevel, ChatMessage, ChatResponsePair } from '../../types/koreanChat';
import { koreanChatApi } from '../../services/koreanChatApi';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import Button from '../ui/button/Button';

interface KoreanChatInterfaceProps {
  conversationId: number;
  scenario: KoreanChatScenario;
  difficulty: KoreanDifficultyLevel;
  onBack: () => void;
}

const quickPhrases = {
  restaurant: ['안녕하세요!', '메뉴 추천해 주세요', '이것은 얼마예요?', '계산해 주세요', '감사합니다'],
  shopping: ['안녕하세요!', '이것 얼마예요?', '더 큰 사이즈 있어요?', '카드로 결제할게요', '감사합니다'],
  direction: ['실례합니다', '지하철역이 어디예요?', '얼마나 걸려요?', '감사합니다', '안녕히 계세요'],
  introduction: ['안녕하세요!', '처음 뵙겠습니다', '이름이 뭐예요?', '어디서 왔어요?', '반갑습니다'],
  daily: ['안녕!', '오늘 어tte?', '뭐 해?', '날씨 좋다', '나중에 봐']
};

export default function KoreanChatInterface({
  conversationId,
  scenario,
  difficulty,
  onBack
}: KoreanChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickPhrases, setShowQuickPhrases] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: speechRecognitionSupported,
    error: speechError
  } = useSpeechRecognition();

  // Load messages ban đầu
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await koreanChatApi.getMessages(conversationId);
        setMessages(fetchedMessages);
      } catch {
        // Có thể hiển thị lỗi nếu muốn
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, [conversationId]);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  // Khi transcript final về, đẩy vào input (không gửi tự động)
  useEffect(() => {
    if (!isListening && transcript && transcript.trim()) {
      setInputMessage(transcript.trim());
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  // Tính toán giá trị hiển thị cho input: nếu đang nghe thì show interimTranscript, không thì show inputMessage
  const displayInput = isListening ? (interimTranscript || '') : inputMessage;

  // Gửi message khi bấm gửi (hoặc Enter)
  const sendMessage = async (content: string) => {
    const cleanMessage = content.trim();
    if (!cleanMessage || isLoading) return;

    setIsLoading(true);
    setShowQuickPhrases(false);

    try {
      // Thêm tin nhắn user vào UI ngay lập tức
      const tempUserMessage: ChatMessage = {
        messageId: Date.now(),
        conversationId: conversationId,
        content: cleanMessage,
        timestamp: new Date().toISOString(),
        messageType: 'user',
        sender: 'user'
      };
      setMessages(prev => [...prev, tempUserMessage]);
      setInputMessage('');

      const response: ChatResponsePair = await koreanChatApi.sendMessage(conversationId, { content: cleanMessage });

      setMessages(prev =>
        prev.map(msg => (msg.messageId === tempUserMessage.messageId ? response.userMessage : msg))
        .concat(response.aiMessage)
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(`Không thể gửi tin nhắn: ${error.response.data.message || error.message}`);
      } else {
        alert(`Không thể gửi tin nhắn: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
      }
    } finally {
      setIsLoading(false);
      resetTranscript();
    }
  };

  // Xử lý micro
  const handleMicroClick = async () => {
    if (isListening) {
      stopListening();
      resetTranscript();
    } else {
      resetTranscript();
      startListening();
    }
  };

  // Xử lý gửi nút gửi
  const handleSendButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      sendMessage(inputMessage);
    }
  };

  const scenarioInfo = {
    restaurant: { title: 'Đặt món tại nhà hàng', icon: '🍽️', color: 'from-orange-400 to-red-500' },
    shopping: { title: 'Mua sắm', icon: '🛍️', color: 'from-pink-400 to-purple-500' },
    direction: { title: 'Hỏi đường', icon: '🗺️', color: 'from-blue-400 to-indigo-500' },
    introduction: { title: 'Chào hỏi làm quen', icon: '👋', color: 'from-green-400 to-blue-500' },
    daily: { title: 'Trò chuyện hàng ngày', icon: '💬', color: 'from-yellow-400 to-orange-500' }
  }[scenario];

  const difficultyInfo = {
    beginner: { title: 'Cơ bản', color: 'bg-green-100 text-green-800', icon: '🌱' },
    intermediate: { title: 'Trung cấp', color: 'bg-yellow-100 text-yellow-800', icon: '🌿' },
    advanced: { title: 'Nâng cao', color: 'bg-red-100 text-red-800', icon: '🌳' }
  }[difficulty];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${scenarioInfo.color} p-1`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg mx-1 my-1">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ← Quay lại
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  {scenarioInfo.icon} {scenarioInfo.title}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${difficultyInfo.color}`}>
                    {difficultyInfo.icon} {difficultyInfo.title}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Giáo viên AI đang online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">{scenarioInfo.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Bắt đầu luyện tập {scenarioInfo.title.toLowerCase()}!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Nhấn vào gợi ý bên dưới hoặc tự nhập tin nhắn
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.messageId}
            className={`flex ${message.messageType === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg relative ${
                message.messageType === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="space-y-2">
                <p className="text-sm whitespace-pre-wrap font-medium">{message.content}</p>
                <div className="flex items-center justify-between">
                  <p className={`text-xs ${
                    message.messageType === 'user'
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Phrases */}
      {showQuickPhrases && (
        <div className="px-4 pb-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">💡 Gợi ý câu nói:</h4>
            <div className="flex flex-wrap gap-2">
              {quickPhrases[scenario].map((phrase, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(phrase)}
                  className="text-sm bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-full hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-800 dark:hover:to-purple-800 transition-all duration-200 border border-blue-200 dark:border-blue-700"
                  disabled={isLoading || isListening}
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={displayInput}
                onChange={e => {
                  if (!isListening) setInputMessage(e.target.value);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendButtonClick();
                  }
                }}
                placeholder={
                  isListening
                    ? "🎤 Đang ghi âm... (nói tiếng Hàn)"
                    : "Nhập tin nhắn tiếng Hàn... (ví dụ: 안녕하세요!)"
                }
                className={`w-full resize-none border-0 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isListening
                    ? 'bg-red-50 dark:bg-red-900/20 ring-2 ring-red-400 text-gray-900 dark:text-white'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500'
                } placeholder-gray-500`}
                rows={2}
                disabled={isLoading}
                readOnly={isListening}
              />

              {speechRecognitionSupported && (
                <div className="absolute right-3 top-3 flex items-center space-x-2">
                  <button
                    onClick={handleMicroClick}
                    className={`relative p-2 rounded-full transition-all duration-200 ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse shadow-lg scale-110'
                        : speechError
                          ? 'bg-red-400 hover:bg-red-500 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                    }`}
                    disabled={isLoading}
                    title={
                      isListening ? 'Dừng ghi âm' :
                        speechError ? 'Thử lại ghi âm' : 'Bắt đầu ghi âm'
                    }
                  >
                    {isListening ? '🛑' : speechError ? '🔁' : '🎤'}

                    {isListening && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                    )}
                  </button>
                </div>
              )}
            </div>

            <Button
              onClick={handleSendButtonClick}
              disabled={!displayInput.trim() || isLoading}
              className="self-end bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi...</span>
                </div>
              ) : (
                <>Gửi 🚀</>
              )}
            </Button>
          </div>

          {/* Status indicators */}
          <div className="mt-3 space-y-2">
            {isListening && (
              <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                </div>
                <span className="font-medium">🎤 Đang lắng nghe tiếng Hàn...</span>
              </div>
            )}

            {transcript.trim() !== '' && !isListening && !speechError && (
              <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 p-3 rounded-lg">
                <span>✅ Đã nhận diện lời nói. Nhấn Gửi để gửi tin nhắn.</span>
              </div>
            )}

            {speechError && !isListening && (
              <div className="flex items-center justify-between text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span>⚠️ {speechError}</span>
                </div>
                <button
                  onClick={() => {
                    resetTranscript();
                    startListening();
                  }}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline transition-colors"
                  disabled={isListening || isLoading}
                >
                  Thử lại 🔄
                </button>
              </div>
            )}

            {!isListening && !speechError && !isLoading && (
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="space-y-1">
                  <div>💡 <strong>Cách sử dụng micro hiệu quả:</strong></div>
                  <div>• Nhấn 🎤 → nói tiếng Hàn (hệ thống sẽ tự nhận diện khi bạn ngừng nói 3s)</div>
                  <div>• Hoặc nhấn 🛑 để dừng ghi âm thủ công → sau đó nhấn Gửi</div>
                </div>
              </div>
            )}
            {!speechRecognitionSupported && (
              <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                💡 Trình duyệt của bạn không hỗ trợ Web Speech API. Vui lòng sử dụng Chrome/Edge để có trải nghiệm tốt nhất.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}