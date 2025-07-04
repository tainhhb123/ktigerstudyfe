// filepath: d:\ktigerstudyproject\ktigerstudyfe-main\src\hooks\useTextToSpeech.ts
import { useState, useRef, useCallback, useEffect } from 'react';

interface TextToSpeechHook {
  speak: (text: string) => void;
  stop: () => void;
  toggle: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  error: string | null;
  currentWordIndex: number;
  words: string[];
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [words, setWords] = useState<string[]>([]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentTextRef = useRef<string>('');

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Chuẩn bị voice sẵn
  useEffect(() => {
    if (isSupported) {
      speechSynthesis.getVoices();
      const handleVoicesChange = () => {
        speechSynthesis.getVoices();
      };
      speechSynthesis.addEventListener('voiceschanged', handleVoicesChange);
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', handleVoicesChange);
      };
    }
  }, [isSupported]);

  // Tìm giọng tiếng Hàn
  const getKoreanVoice = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    const koreanVoice = voices.find(
      (v) => v.lang.startsWith('ko') || v.name.toLowerCase().includes('korean')
    );
    return koreanVoice || voices[0];
  }, []);

  // Bắt đầu nói
  const speak = useCallback(
    (text: string) => {
      // Loại bỏ icon/emoji
      const cleanedText = text.replace(/\p{Extended_Pictographic}/gu, '').trim();
      if (!isSupported || !cleanedText) return;

      // Dừng speech cũ
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
      }
      
      // Tách từ trước khi tạo utterance
      const wordsArray = cleanedText.split(/\s+/).filter(Boolean);
      setWords(wordsArray);
      setCurrentWordIndex(-1);
      setError(null);
      currentTextRef.current = cleanedText;

      // Tạo utterance
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utteranceRef.current = utterance;

      utterance.voice = getKoreanVoice();
      utterance.rate = 0.9; // Chậm hơn để dễ theo dõi
      utterance.pitch = 1;
      utterance.volume = 1;

      // Đánh dấu từng "word boundary"
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          let sum = 0;
          let foundIndex = 0;
          
          // Tính index dựa trên charIndex
          for (let i = 0; i < wordsArray.length; i++) {
            if (charIndex <= sum + wordsArray[i].length) {
              foundIndex = i;
              break;
            }
            sum += wordsArray[i].length + 1; // +1 cho dấu cách
          }
          setCurrentWordIndex(foundIndex);
        }
      };

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentWordIndex(0); // Bắt đầu từ từ đầu tiên
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          setError(`Lỗi: ${e.error}`);
        }
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
      };

      speechSynthesis.speak(utterance);
    },
    [isSupported, getKoreanVoice]
  );

  // Dừng nói
  const stop = useCallback(() => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    setWords([]);
    utteranceRef.current = null;
    currentTextRef.current = '';
  }, []);

  // Tạm dừng / tiếp tục / đọc lại
  const toggle = useCallback(() => {
    if (isSpeaking && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else if (currentTextRef.current) {
      speak(currentTextRef.current);
    }
  }, [isSpeaking, isPaused, speak]);

  // Dọn dẹp
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    speak,
    stop,
    toggle,
    isSpeaking,
    isPaused,
    isSupported,
    error,
    currentWordIndex,
    words
  };
};