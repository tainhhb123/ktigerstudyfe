// src/components/chatai/KoreanChatInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import axiosInstance from '../../services/axiosConfig';
import { KoreanChatScenario, KoreanDifficultyLevel, ChatMessage, ChatResponsePair } from '../../types/koreanChat';
import { koreanChatApi } from '../../services/koreanChatApi';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { KaraokeText } from './KaraokeText';
import Button from '../ui/button/Button';
import { Send, Mic, Square } from 'lucide-react';

interface KoreanChatInterfaceProps {
  conversationId: number;
  scenario: KoreanChatScenario;
  difficulty: KoreanDifficultyLevel;
  onBack: () => void;
}

interface ChatMessageWithTranslation extends ChatMessage {
  translation?: string;
}

const quickPhrases = {
  restaurant: ['안녕하세요!', '메뉴 추천해 주세요', '이것은 얼마예요?', '계산해 주세요', '감사합니다'],
  shopping: ['안녕하세요!', '이것 얼마예요?', '더 큰 사이즈 있어요?', '카드로 결제할게요', '감사합니다'],
  direction: ['실례합니다', '지하철역이 어디예요?', '얼마나 걸려요?', '감사합니다', '안녕히 계세요'],
  introduction: ['안녕하세요!', '처음 뵙겠습니다', '이름이 뭐예요?', '어디서 왔어요?', '반갑습니다'],
  daily: ['안녕!', '오늘 어때?', '뭐 해?', '날씨 좋다', '나중에 봐']
};

const scenarioConfig = {
  restaurant: { title: 'Nhà hàng', icon: '🍽️' },
  shopping: { title: 'Mua sắm', icon: '🛍️' },
  direction: { title: 'Hỏi đường', icon: '🗺️' },
  introduction: { title: 'Làm quen', icon: '👋' },
  daily: { title: 'Hàng ngày', icon: '💬' }
};

const difficultyConfig = {
  beginner: { title: 'Cơ bản', icon: '🌱' },
  intermediate: { title: 'Trung cấp', icon: '🌿' },
  advanced: { title: 'Nâng cao', icon: '🌳' }
};

export default function KoreanChatInterface({
  conversationId,
  scenario,
  difficulty,
  onBack
}: KoreanChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageWithTranslation[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickPhrases, setShowQuickPhrases] = useState(true);
  const [translationVisible, setTranslationVisible] = useState<{ [key: number]: boolean }>({});
  const [currentSpeakingId, setCurrentSpeakingId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<number | null>(null);

  // Speech Recognition
  const {
    isListening,
    transcript,
    interimTranscript,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: speechRecognitionSupported,
    error: speechError
  } = useSpeechRecognition();

  // Text To Speech
  const {
    speak,
    stop,
    toggle,
    isSpeaking,
    isPaused,
    isSupported: ttsSupported,
    error: ttsError,
    currentWordIndex,
    words
  } = useTextToSpeech();

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await koreanChatApi.getMessages(conversationId);
        setMessages(fetchedMessages as ChatMessageWithTranslation[]);
      } catch (error) {
        console.error('Lỗi khi tải tin nhắn:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, [conversationId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  // Speech recognition -> input (Real-time update với smooth transition)
  useEffect(() => {
    if (isListening) {
      // Cập nhật real-time trong khi đang nói
      if (interimTranscript.trim()) {
        setInputMessage(interimTranscript.trim());
      }
    } else if (transcript.trim() && !isListening) {
      // ✅ Giữ nguyên text khi dừng (không reset đột ngột)
      setInputMessage(transcript.trim());
      // Reset sau khi đã update để tránh giật lag
      setTimeout(() => resetTranscript(), 100);
    }
  }, [transcript, interimTranscript, isListening, resetTranscript]);

  // Tự động đọc tin nhắn AI mới
  useEffect(() => {
    if (!ttsSupported || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.messageType === 'ai' &&
      lastMessage.content &&
      lastMessage.messageId !== lastMessageIdRef.current
    ) {
      lastMessageIdRef.current = lastMessage.messageId;
      stop();
      setTimeout(() => {
        setCurrentSpeakingId(lastMessage.messageId);
        speak(lastMessage.content);
      }, 400);
    }
  }, [messages, ttsSupported, speak, stop]);

  // Xóa currentSpeakingId khi đọc xong
  useEffect(() => {
    if (!isSpeaking) {
      setCurrentSpeakingId(null);
    }
  }, [isSpeaking]);

  // ✅ Ưu tiên inputMessage để tránh text nhấp nháy
  const displayInput = inputMessage || (isListening ? interimTranscript : '');

  const sendMessage = async (content: string) => {
    const clean = content.trim();
    if (!clean || isLoading) return;

    stop(); 
    setIsLoading(true);
    setShowQuickPhrases(false);

    try {
      const tempUserMsg: ChatMessageWithTranslation = {
        messageId: Date.now(),
        conversationId,
        content: clean,
        timestamp: new Date().toISOString(),
        messageType: 'user',
        sender: 'user'
      };
      setMessages(prev => [...prev, tempUserMsg]);
      setInputMessage('');

      const response: ChatResponsePair = await koreanChatApi.sendMessage(conversationId, { content: clean });
      const aiMessageWithTranslation: ChatMessageWithTranslation = {
        ...response.aiMessage,
        translation: (response.aiMessage as ChatMessageWithTranslation).translation || ''
      };

      // Gộp lại: thay thế userMsg tạm thời và thêm AI msg
      setMessages(prev =>
        prev
          .map(msg => (msg.messageId === tempUserMsg.messageId ? response.userMessage as ChatMessageWithTranslation : msg))
          .concat(aiMessageWithTranslation)
      );
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
      if (axios.isAxiosError(err) && err.response) {
        alert(`Không thể gửi tin nhắn: ${err.response.data.message || err.message}`);
      } else {
        alert(`Không thể gửi tin nhắn: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
      }
    } finally {
      setIsLoading(false);
      resetTranscript();
    }
  };

  const handleMicroClick = () => {
    if (isListening) {
      stopListening();
      resetTranscript();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleSendButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      sendMessage(inputMessage);
    }
  };

  const toggleTranslation = (messageId: number) => {
    setTranslationVisible(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const handleSpeakerClick = (messageId: number, text: string) => {
    if (currentSpeakingId === messageId) {
      // Đang click cùng tin nhắn => toggle
      toggle();
    } else {
      // Chuyển sang đọc tin nhắn mới
      stop();
      setTimeout(() => {
        setCurrentSpeakingId(messageId);
        speak(text);
      }, 300);
    }
  };

  const getSpeakerIcon = (messageId: number) => {
    if (currentSpeakingId === messageId) {
      if (isSpeaking && !isPaused) return '🔊'; // đang đọc
      if (isPaused) return '⏸️'; // dừng tạm
    }
    return '🔈'; // chưa đọc
  };

  const getSpeakerTitle = (messageId: number) => {
    if (currentSpeakingId === messageId) {
      if (isSpeaking && !isPaused) return 'Nhấn để dừng';
      if (isPaused) return 'Nhấn để tiếp tục';
    }
    return 'Nhấn để đọc';
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #BDBDBD' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
              >
                ← Quay lại
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: '#FFE8DC' }}>
                  {scenarioConfig[scenario].icon}
                </div>
                <div>
                  <h1 className="text-lg font-semibold" style={{ color: '#333333' }}>
                    {scenarioConfig[scenario].title}
                  </h1>
                  <span className="text-sm" style={{ color: '#666666' }}>
                    {difficultyConfig[difficulty].icon} {difficultyConfig[difficulty].title}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4CAF50' }} />
              <span className="text-sm" style={{ color: '#4CAF50' }}>AI online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: '#FFE8DC' }}>
                🤖
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#333333' }}>Bắt đầu trò chuyện</h3>
              <p style={{ color: '#666666' }}>Chọn gợi ý hoặc nhập tin nhắn để bắt đầu</p>
              {ttsSupported && (
                <p className="text-sm mt-2" style={{ color: '#4CAF50' }}>
                  🎤 AI sẽ tự động đọc câu trả lời với hiệu ứng karaoke
                </p>
              )}
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.messageId}
              className={`flex ${msg.messageType === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-md px-4 py-3 rounded-2xl shadow-sm"
                style={{
                  backgroundColor: msg.messageType === 'user' ? '#FF6B35' : '#FFFFFF',
                  color: msg.messageType === 'user' ? '#FFFFFF' : '#333333',
                  border: msg.messageType === 'user' ? 'none' : '1px solid #BDBDBD'
                }}
              >
                {/* Karaoke text for AI message when speaking */}
                <div className="text-sm leading-relaxed">
                  {msg.messageType === 'ai' && currentSpeakingId === msg.messageId && isSpeaking ? (
                    <KaraokeText
                      text={msg.content}
                      words={words}
                      currentWordIndex={currentWordIndex}
                      isSpeaking={isSpeaking}
                    />
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>

                {/* AI translation */}
                {msg.messageType === 'ai' && msg.translation && (
                  <div className="mt-2">
                    <button
                      onClick={() => toggleTranslation(msg.messageId)}
                      className="text-xs hover:underline"
                      style={{ color: '#4CAF50' }}
                    >
                      {translationVisible[msg.messageId] ? 'Ẩn bản dịch' : 'Hiển thị bản dịch'}
                    </button>
                    
                    {translationVisible[msg.messageId] && (
                      <div className="mt-2 p-2 rounded text-xs" style={{ backgroundColor: '#FFF8F0', color: '#666666' }}>
                        {msg.translation}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span
                    className="text-xs"
                    style={{ color: msg.messageType === 'user' ? 'rgba(255,255,255,0.7)' : '#999999' }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>

                  {/* Loa đọc */}
                  {msg.messageType === 'ai' && ttsSupported && (
                    <button
                      onClick={() => handleSpeakerClick(msg.messageId, msg.content)}
                      title={getSpeakerTitle(msg.messageId)}
                      className="ml-2 p-1 rounded-full text-lg transition-all"
                      style={{
                        backgroundColor: currentSpeakingId === msg.messageId && isSpeaking ? '#E8F5E9' : 'transparent'
                      }}
                    >
                      {getSpeakerIcon(msg.messageId)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#FF6B35' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#FF6B35', animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#FF6B35', animationDelay: '0.2s' }}></div>
                  <span className="text-sm ml-2" style={{ color: '#666666' }}>AI đang trả lời...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick phrases */}
      {showQuickPhrases && (
        <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #BDBDBD' }}>
          <div className="max-w-4xl mx-auto px-4 py-3">
            <p className="text-sm mb-2" style={{ color: '#666666' }}>Gợi ý:</p>
            <div className="flex flex-wrap gap-2">
              {quickPhrases[scenario].map((phrase, idx) => (
                <button
                  key={idx}
                  disabled={isLoading || isListening}
                  onClick={() => sendMessage(phrase)}
                  className="text-sm px-3 py-1.5 rounded-full transition-all"
                  style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input - Redesigned với icons chuyên nghiệp */}
      <div style={{ backgroundColor: '#FFFFFF', borderTop: '2px solid #E0E0E0' }}>
        <div className="max-w-4xl mx-auto p-5">
          <div className="flex items-center space-x-3">
            {/* Voice Button - Bên trái */}
            {speechRecognitionSupported && (
              <button
                onClick={handleMicroClick}
                disabled={isLoading}
                className="p-3.5 rounded-2xl transition-all flex-shrink-0 shadow-md hover:shadow-lg"
                style={{
                  backgroundColor: isListening ? '#FF6B35' : '#FFE8DC',
                  color: isListening ? '#FFFFFF' : '#FF6B35',
                  border: isListening ? '2px solid #FF6B35' : '2px solid transparent',
                  transform: isListening ? 'scale(1.08)' : 'scale(1)',
                  minWidth: '56px',
                  minHeight: '56px'
                }}
                title={isListening ? '⏹ Dừng ghi âm (Ctrl+D)' : '🎤 Bắt đầu nói (Ctrl+M)'}
              >
                {isListening ? (
                  <Square className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            )}

            {/* Text Input - Giữa (PHÓNG TO) */}
            <div className="flex-1">
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
                placeholder={isListening ? '🎤 Đang lắng nghe... (nói tự nhiên, không cần vội)' : 'Nhập tin nhắn tiếng Hàn... (hoặc nhấn 🎤)'}
                className="w-full resize-none rounded-2xl px-5 py-4 focus:outline-none transition-all text-base"
                style={{
                  backgroundColor: isListening ? '#FFF4E6' : '#F8F9FA',
                  border: isListening ? '2px solid #FF6B35' : '2px solid #E0E0E0',
                  color: '#333333',
                  minHeight: '72px',
                  maxHeight: '180px',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  boxShadow: isListening ? '0 0 0 4px rgba(255, 107, 53, 0.15)' : '0 2px 4px rgba(0,0,0,0.05)'
                }}
                rows={2}
                disabled={isLoading}
                readOnly={isListening}
              />
            </div>

            {/* Send Button - Bên phải (ICON CHUYÊN NGHIỆP) */}
            <button
              onClick={handleSendButtonClick}
              disabled={!displayInput.trim() || isLoading}
              className="p-3.5 rounded-2xl font-medium transition-all flex-shrink-0 shadow-md hover:shadow-lg group"
              style={{
                backgroundColor: !displayInput.trim() || isLoading ? '#E0E0E0' : '#FF6B35',
                color: !displayInput.trim() || isLoading ? '#999999' : '#FFFFFF',
                cursor: !displayInput.trim() || isLoading ? 'not-allowed' : 'pointer',
                minWidth: '56px',
                minHeight: '56px',
                transform: displayInput.trim() && !isLoading ? 'scale(1)' : 'scale(0.95)'
              }}
              title="Gửi tin nhắn (Enter)"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <Send className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </div>

          {/* ✅ LOẠI BỎ tất cả status indicators phía dưới để giao diện gọn gàng */}
        </div>
      </div>
    </div>
  );
}