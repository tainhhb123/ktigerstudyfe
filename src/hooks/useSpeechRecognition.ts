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
  isProcessing: boolean;
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
  onaudiostart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onaudioend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onnomatch: ((this: ISpeechRecognition, ev: Event) => void) | null;
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
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const hasSpeechDetectedRef = useRef(false);
  const finalTranscriptRef = useRef('');

  // Check microphone permission with better handling
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setHasPermission(permission.state === 'granted');
          
          permission.onchange = () => {
            setHasPermission(permission.state === 'granted');
            if (permission.state === 'denied') {
              setError('Quyền truy cập microphone đã bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.');
            }
          };
        } else {
          // For browsers that don't support permissions API, try getUserMedia
          try {
            if (
              typeof navigator !== 'undefined' &&
              typeof (navigator as Navigator).mediaDevices !== 'undefined' &&
              (navigator as Navigator).mediaDevices &&
              typeof (navigator as Navigator).mediaDevices.getUserMedia === 'function'
            ) {
              const stream = await (navigator as Navigator).mediaDevices.getUserMedia({ audio: true });
              stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
              setHasPermission(true);
            } else {
              setHasPermission(false);
              setError('Trình duyệt không hỗ trợ truy cập microphone.');
            }
          } catch {
            setHasPermission(false);
            setError('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.');
          }
        }
      } catch {
        setHasPermission(true); // Fallback
      }
    };

    checkPermission();
  }, []);

  // Initialize speech recognition with better configuration
  useEffect(() => {
    if (isInitializedRef.current) return;

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionClass) {
      setError('Trình duyệt không hỗ trợ Web Speech API. Vui lòng sử dụng Chrome, Edge hoặc Safari.');
      return;
    }

    const recognition = new SpeechRecognitionClass();
    
    // Optimized settings for better Korean recognition
    recognition.lang = 'ko-KR';
    recognition.continuous = true; // Changed to true for longer speech
    recognition.interimResults = true;
    recognition.maxAlternatives = 3; // More alternatives for better accuracy

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setIsProcessing(false);
      setError(null);
      setInterimTranscript('');
      hasSpeechDetectedRef.current = false;
      finalTranscriptRef.current = '';
      
      // Extended timeout for longer speech
      timeoutRef.current = setTimeout(() => {
        console.log('Recognition timeout - stopping');
        if (recognitionRef.current) {
          recognition.stop();
        }
      }, 30000); // Increased to 30 seconds
    };

    recognition.onaudiostart = () => {
      console.log('Audio capture started');
      setIsProcessing(true);
    };

    recognition.onspeechstart = () => {
      console.log('Speech detected');
      hasSpeechDetectedRef.current = true;
      setIsProcessing(true);
      
      // Clear initial timeout when speech is detected
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('Recognition result received', event);
      let finalTranscript = '';
      let interim = '';
      let maxConfidence = 0;

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const resultTranscript = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += resultTranscript;
          maxConfidence = Math.max(maxConfidence, result[0].confidence || 0);
          console.log('Final result:', resultTranscript);
        } else {
          interim += resultTranscript;
          console.log('Interim result:', resultTranscript);
        }
      }

      // Update interim results immediately
      if (interim) {
        setInterimTranscript(interim);
      }

      // Handle final results
      if (finalTranscript) {
        finalTranscriptRef.current += finalTranscript;
        setTranscript(finalTranscriptRef.current.trim());
        setConfidence(maxConfidence);
        setInterimTranscript('');
        
        // Start silence detection timer
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        silenceTimeoutRef.current = setTimeout(() => {
          console.log('Silence detected - stopping recognition');
          recognition.stop();
        }, 2000); // Stop after 2 seconds of silence
      }
    };

    recognition.onspeechend = () => {
      console.log('Speech ended');
      setIsProcessing(false);
      
      // Wait a bit more before stopping in case there's more speech
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      
      silenceTimeoutRef.current = setTimeout(() => {
        console.log('Speech end timeout - stopping');
        recognition.stop();
      }, 1500);
    };

    recognition.onaudioend = () => {
      console.log('Audio capture ended');
      setIsProcessing(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);
      
      let errorMessage = 'Lỗi không xác định';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Không có quyền truy cập microphone. Vui lòng cấp quyền và thử lại.';
          setHasPermission(false);
          break;
        case 'no-speech':
          if (!hasSpeechDetectedRef.current) {
            errorMessage = 'Không nghe thấy giọng nói. Vui lòng nói to hơn hoặc kiểm tra microphone.';
          } else {
            // Don't show error if we already detected some speech
            setIsListening(false);
            setIsProcessing(false);
            return;
          }
          break;
        case 'audio-capture':
          errorMessage = 'Không thể truy cập microphone. Kiểm tra thiết bị âm thanh.';
          break;
        case 'network':
          errorMessage = 'Lỗi mạng. Kiểm tra kết nối internet và thử lại.';
          break;
        case 'aborted':
          // Don't show error for user-initiated abort
          setIsListening(false);
          setIsProcessing(false);
          return;
        case 'language-not-supported':
          errorMessage = 'Ngôn ngữ tiếng Hàn không được hỗ trợ trên thiết bị này.';
          break;
        default:
          errorMessage = `Lỗi nhận diện: ${event.error}`;
      }
      
      setError(errorMessage);
      setIsListening(false);
      setIsProcessing(false);
    };

    recognition.onend = () => {
      console.log('Recognition ended');
      setIsListening(false);
      setIsProcessing(false);
      
      // Clean up timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    };

    // Handle no match
    recognition.onnomatch = () => {
      console.log('No match found');
      if (!hasSpeechDetectedRef.current) {
        setError('Không nhận diện được giọng nói. Vui lòng nói rõ hơn.');
      }
    };

    recognitionRef.current = recognition;
    isInitializedRef.current = true;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    console.log('Start listening requested');
    
    if (!hasPermission) {
      setError('Không có quyền truy cập microphone. Vui lòng cấp quyền trong cài đặt trình duyệt.');
      return;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
    finalTranscriptRef.current = '';
    hasSpeechDetectedRef.current = false;

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech recognition start error:', err);
        setError('Không thể bắt đầu nhận diện giọng nói. Vui lòng thử lại.');
      }
    }
  }, [isListening, hasPermission]);

  const stopListening = useCallback(() => {
    console.log('Stop listening requested');
    
    // Clean up all timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Speech recognition stop error:', err);
      }
    }
    
    setIsListening(false);
    setIsProcessing(false);
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
    setError(null);
    finalTranscriptRef.current = '';
    hasSpeechDetectedRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
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
    isProcessing,
  };
};