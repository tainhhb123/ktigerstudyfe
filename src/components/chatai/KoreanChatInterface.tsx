// src/components/chatai/KoreanChatInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { KoreanChatScenario, KoreanDifficultyLevel, ChatMessage, ChatResponsePair } from '../../types/koreanChat';
import { koreanChatApi } from '../../services/koreanChatApi';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { KaraokeText } from './KaraokeText';
import Button from '../ui/button/Button';

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

  // Speech recognition -> input
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      setInputMessage(transcript.trim());
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

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

  const displayInput = isListening ? interimTranscript || '' : inputMessage;

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
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                ← Quay lại
              </Button>
              
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{scenarioConfig[scenario].icon}</span>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {scenarioConfig[scenario].title}
                  </h1>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {difficultyConfig[difficulty].icon} {difficultyConfig[difficulty].title}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600 dark:text-gray-300">AI online</span>
              
              {/* Optional debug button */}
              <button
                onClick={() => speak('안녕하세요, 테스트 문장입니다!')}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Test TTS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Bắt đầu trò chuyện</h3>
              <p className="text-gray-600 dark:text-gray-400">Chọn gợi ý hoặc nhập tin nhắn để bắt đầu</p>
              {ttsSupported && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
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
                className={
                  msg.messageType === 'user'
                    ? 'max-w-md px-4 py-3 rounded-lg bg-green-500 text-white'
                    : 'max-w-md px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }
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
                      className="text-xs text-green-600 dark:text-green-400 hover:underline"
                    >
                      {translationVisible[msg.messageId] ? 'Ẩn bản dịch' : 'Hiển thị bản dịch'}
                    </button>
                    
                    {translationVisible[msg.messageId] && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                        {msg.translation}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span
                    className={
                      msg.messageType === 'user'
                        ? 'text-xs text-green-100'
                        : 'text-xs text-gray-500 dark:text-gray-400'
                    }
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
                      className={`ml-2 p-1 rounded text-lg transition-all ${
                        currentSpeakingId === msg.messageId && isSpeaking
                          ? 'bg-green-100 dark:bg-green-900/30 animate-pulse'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
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
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">AI đang trả lời...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick phrases */}
      {showQuickPhrases && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Gợi ý:</p>
            <div className="flex flex-wrap gap-2">
              {quickPhrases[scenario].map((phrase, idx) => (
                <button
                  key={idx}
                  disabled={isLoading || isListening}
                  onClick={() => sendMessage(phrase)}
                  className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto p-4">
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
                placeholder={isListening ? '🎤 Đang ghi âm...' : 'Nhập tin nhắn tiếng Hàn...'}
                className={`w-full resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isListening
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                rows={2}
                disabled={isLoading}
                readOnly={isListening}
              />

              {speechRecognitionSupported && (
                <button
                  onClick={handleMicroClick}
                  disabled={isLoading}
                  className={`absolute right-2 top-2 p-2 rounded text-lg ${
                    isListening
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  {isListening ? '🛑' : '🎤'}
                </button>
              )}
            </div>

            <Button
              onClick={handleSendButtonClick}
              disabled={!displayInput.trim() || isLoading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Đang gửi...' : 'Gửi'}
            </Button>
          </div>

          {/* Error status */}
          {isListening && (
            <div className="mt-2 text-sm text-green-600 dark:text-green-400">
              🎤 Đang lắng nghe...
            </div>
          )}

          {speechError && !isListening && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              ⚠️ {speechError}
            </div>
          )}

          {ttsError && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              ⚠️ {ttsError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}