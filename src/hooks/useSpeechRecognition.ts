// src/hooks/useSpeechRecognition.ts
import { useState, useRef, useEffect, useCallback } from 'react';

export interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  error: string | null;
  hasPermission: boolean;
}

// Enhanced type definitions
type SpeechRecognitionResultItem = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionResult = {
  readonly isFinal: boolean;
  readonly 0: SpeechRecognitionResultItem;
  readonly length: number;
};

type SpeechRecognitionResultList = Array<SpeechRecognitionResult>;

interface ISpeechRecognition extends EventTarget {
  lang: string;
  maxAlternatives: number;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onspeechstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onspeechend: ((this: ISpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): ISpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): ISpeechRecognition;
    };
  }
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Check microphone permission
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setHasPermission(permission.state === 'granted');
          
          permission.onchange = () => {
            setHasPermission(permission.state === 'granted');
          };
        } else {
          // Fallback for browsers that don't support permissions API
          setHasPermission(true);
        }
      } catch {
        setHasPermission(true);
      }
    };

    checkPermission();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (isInitializedRef.current) return;

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionClass) {
      setError('Trình duyệt không hỗ trợ Web Speech API. Vui lòng sử dụng Chrome, Edge hoặc Safari.');
      return;
    }

    const recognition = new SpeechRecognitionClass();
    
    // Optimized settings for Korean
    recognition.lang = 'ko-KR';
    recognition.continuous = false; // Changed to false for better UX
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setInterimTranscript('');
      
      // Auto-stop after 10 seconds of listening
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognition.stop();
        }
      }, 10000);
    };

    recognition.onspeechstart = () => {
      // Clear timeout when speech is detected
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const resultTranscript = result[0].transcript.trim();
        
        if (result.isFinal) {
          finalTranscript += resultTranscript;
          maxConfidence = Math.max(maxConfidence, result[0].confidence);
        } else {
          interim += resultTranscript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        setConfidence(maxConfidence);
        setInterimTranscript('');
        // Auto-stop after getting final result
        setTimeout(() => recognition.stop(), 100);
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Lỗi không xác định';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Không có quyền truy cập microphone. Vui lòng cấp quyền và thử lại.';
          setHasPermission(false);
          break;
        case 'no-speech':
          errorMessage = 'Không nghe thấy giọng nói. Vui lòng thử lại.';
          break;
        case 'audio-capture':
          errorMessage = 'Không thể truy cập microphone. Kiểm tra thiết bị âm thanh.';
          break;
        case 'network':
          errorMessage = 'Lỗi mạng. Kiểm tra kết nối internet.';
          break;
        case 'aborted':
          // Don't show error for user-initiated abort
          setIsListening(false);
          return;
        default:
          errorMessage = `Lỗi nhận diện: ${event.error}`;
      }
      
      setError(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    recognitionRef.current = recognition;
    isInitializedRef.current = true;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!hasPermission) {
      setError('Không có quyền truy cập microphone. Vui lòng cấp quyền trong cài đặt trình duyệt.');
      return;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError('Không thể bắt đầu nhận diện giọng nói. Vui lòng thử lại.');
        console.error('Speech recognition start error:', err);
      }
    }
  }, [isListening, hasPermission]);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Speech recognition stop error:', err);
      }
    }
    
    setIsListening(false);
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    error,
    hasPermission,
  };
};