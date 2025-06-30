import { useState, useRef, useCallback } from 'react';

interface TextToSpeechHook {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  error: string | null;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      setError('Trình duyệt không hỗ trợ text-to-speech');
      return;
    }

    // Stop any current speech
    stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Configure voice for Korean
      const voices = speechSynthesis.getVoices();
      const koreanVoice = voices.find(voice => 
        voice.lang.includes('ko') || voice.lang.includes('KR')
      );
      
      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }

      utterance.lang = 'ko-KR';
      utterance.rate = 0.8; // Slower for learning
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
        console.log('Speech started');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('Speech ended');
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event.error);
        setError(`Lỗi đọc văn bản: ${event.error}`);
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Error in text-to-speech:', error);
      setError('Không thể đọc văn bản');
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    error
  };
};