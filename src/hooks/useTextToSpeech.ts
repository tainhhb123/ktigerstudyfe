import { useState, useRef, useCallback, useEffect } from 'react';

interface TextToSpeechHook {
  speak: (text: string, autoPlay?: boolean) => void;
  stop: () => void;
  toggle: () => void; // New: toggle play/pause
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  error: string | null;
  currentText: string;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load voices when available
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Listen for voices changed event
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported]);

  const getBestKoreanVoice = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    
    // Priority order for Korean voices
    const priorities = [
      'ko-KR', // Standard Korean
      'ko', // Generic Korean
      'kr' // Alternative Korean code
    ];

    for (const priority of priorities) {
      const voice = voices.find(v => 
        v.lang.toLowerCase().includes(priority.toLowerCase()) ||
        v.name.toLowerCase().includes('korean') ||
        v.name.toLowerCase().includes('한국')
      );
      if (voice) return voice;
    }

    // Fallback to any voice if no Korean found
    return voices[0] || null;
  }, []);

  const speak = useCallback((text: string, autoPlay: boolean = false) => {
    if (!isSupported) {
      setError('Trình duyệt không hỗ trợ text-to-speech');
      return;
    }

    if (!text.trim()) return;

    // Stop any current speech
    stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      setCurrentText(text);

      // Wait for voices to load before setting voice
      const setVoiceAndSpeak = () => {
        const koreanVoice = getBestKoreanVoice();
        if (koreanVoice) {
          utterance.voice = koreanVoice;
        }

        // Optimized settings for Korean learning
        utterance.lang = 'ko-KR';
        utterance.rate = 0.7; // Slower for better comprehension
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsPaused(false);
          setError(null);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentText('');
        };

        utterance.onpause = () => {
          setIsPaused(true);
        };

        utterance.onresume = () => {
          setIsPaused(false);
        };

        utterance.onerror = (event) => {
          console.error('Speech error:', event.error);
          setError(`Lỗi đọc văn bản: ${event.error}`);
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentText('');
        };

        // Auto play or manual trigger
        if (autoPlay) {
          speechSynthesis.speak(utterance);
        }
      };

      // If voices are already loaded, set voice immediately
      if (voicesLoadedRef.current || speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
      } else {
        // Wait for voices to load
        const handleVoicesChanged = () => {
          setVoiceAndSpeak();
          speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
        speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      }

    } catch (error) {
      console.error('Error in text-to-speech:', error);
      setError('Không thể đọc văn bản');
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText('');
    }
  }, [isSupported, getBestKoreanVoice]);

  const stop = useCallback(() => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentText('');
    utteranceRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    if (!isSupported) return;

    if (isSpeaking && !isPaused) {
      // Currently speaking - pause it
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      // Currently paused - resume it
      speechSynthesis.resume();
      setIsPaused(false);
    } else if (currentText && utteranceRef.current) {
      // Has text but not speaking - start speaking
      speechSynthesis.speak(utteranceRef.current);
    }
  }, [isSupported, isSpeaking, isPaused, currentText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    speak,
    stop,
    toggle,
    isSpeaking,
    isPaused,
    isSupported,
    error,
    currentText
  };
};