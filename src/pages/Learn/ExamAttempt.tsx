import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, List, Volume2, Play } from 'lucide-react';
import { 
  examAttemptApi, 
  examSectionApi, 
  questionApi,
  userAnswerApi 
} from '../../services/ExamApi';
import { 
  ExamAttemptResponse, 
  ExamSectionResponse, 
  QuestionResponse
} from '../../types/exam';
import TopikWritingGrid from '../../components/exam/TopikWritingGrid';

const ExamAttempt = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<ExamAttemptResponse | null>(null);
  const [sections, setSections] = useState<ExamSectionResponse[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(new Map());
  const [textAnswers, setTextAnswers] = useState<Map<number, string>>(new Map()); // For SHORT and ESSAY
  const [savingText, setSavingText] = useState<Set<number>>(new Set()); // Track which questions are being saved
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [loading, setLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false); // Đã bắt đầu phát audio
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const saveTextTimerRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (attemptId) {
      fetchAttemptData();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attemptId]);

  useEffect(() => {
    if (sections.length > 0 && currentSectionIndex < sections.length) {
      fetchQuestionsForSection(sections[currentSectionIndex].sectionId);
      
      // Load saved time or reset timer for new section
      const saved = localStorage.getItem('topik_in_progress');
      let shouldLoadSavedTime = false;
      
      if (saved) {
        try {
          const data = JSON.parse(saved);
          
          // If resuming the same section, restore the saved time
          if (data.attemptId === attemptId && data.currentSectionIndex === currentSectionIndex && data.timeLeft) {
            setTimeLeft(data.timeLeft);
            shouldLoadSavedTime = true;
            console.log('⏱️ Restoring timer:', data.timeLeft, 'seconds');
          }
          
          // Update position
          data.currentSectionIndex = currentSectionIndex;
          data.currentQuestionIndex = currentQuestionIndex;
          if (!shouldLoadSavedTime) {
            const section = sections[currentSectionIndex];
            const newTime = section.durationMinutes * 60;
            setTimeLeft(newTime);
            data.timeLeft = newTime;
          }
          localStorage.setItem('topik_in_progress', JSON.stringify(data));
        } catch (err) {
          console.error('Error updating section position:', err);
          const section = sections[currentSectionIndex];
          setTimeLeft(section.durationMinutes * 60);
        }
      } else {
        const section = sections[currentSectionIndex];
        setTimeLeft(section.durationMinutes * 60);
      }
      
      startTimer();
    }
  }, [currentSectionIndex, sections]);

  const fetchAttemptData = async () => {
    try {
      setLoading(true);
      const attemptData = await examAttemptApi.getAttemptById(Number(attemptId));
      setAttempt(attemptData);

      // Load saved position from localStorage
      const saved = localStorage.getItem('topik_in_progress');
      let savedSectionIndex = 0;
      let savedQuestionIndex = 0;
      let savedTimeLeft = null;
      
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.attemptId === attemptId) {
            savedSectionIndex = data.currentSectionIndex || 0;
            savedQuestionIndex = data.currentQuestionIndex || 0;
            savedTimeLeft = data.timeLeft;
            console.log('📍 Restoring position: Section', savedSectionIndex, 'Question', savedQuestionIndex, 'Time:', savedTimeLeft);
          }
        } catch (err) {
          console.error('Error parsing saved position:', err);
        }
      }

      // Save to localStorage for resume functionality
      localStorage.setItem('topik_in_progress', JSON.stringify({
        attemptId: attemptId,
        examTitle: attemptData.examTitle || 'Bài thi TOPIK',
        startedAt: new Date().toISOString(),
        currentSectionIndex: savedSectionIndex,
        currentQuestionIndex: savedQuestionIndex,
        timeLeft: savedTimeLeft
      }));

      if (attemptData.examId) {
        const sectionsData = await examSectionApi.getSectionsByExam(attemptData.examId);
        setSections(sectionsData.sort((a, b) => a.sectionOrder - b.sectionOrder));
        
        // Restore position AFTER sections are loaded
        setCurrentSectionIndex(savedSectionIndex);
        setCurrentQuestionIndex(savedQuestionIndex);
      }

      // Load saved answers
      await loadSavedAnswers();
    } catch (err) {
      console.error('Error fetching attempt:', err);
      alert('Không thể tải thông tin bài thi');
      navigate('/learn/topik');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedAnswers = async () => {
    try {
      const savedAnswers = await userAnswerApi.getAnswersByAttempt(Number(attemptId));
      console.log('📥 Loaded saved answers:', savedAnswers.length);

      const mcqAnswers = new Map<number, number>();
      const textAnswersMap = new Map<number, string>();

      savedAnswers.forEach(answer => {
        if (answer.questionId) {
          // MCQ answer (has choiceId)
          if (answer.choiceId) {
            mcqAnswers.set(answer.questionId, answer.choiceId);
          }
          // Text answer (SHORT/ESSAY)
          if (answer.answerText) {
            textAnswersMap.set(answer.questionId, answer.answerText);
          }
        }
      });

      setSelectedAnswers(mcqAnswers);
      setTextAnswers(textAnswersMap);
      console.log('✅ Restored answers - MCQ:', mcqAnswers.size, 'Text:', textAnswersMap.size);
    } catch (err) {
      console.error('Error loading saved answers:', err);
      // Don't alert - this is not critical, user can continue
    }
  };

  const fetchQuestionsForSection = async (sectionId: number) => {
    try {
      console.log('🔍 Fetching questions for section:', sectionId);
      const questionsData = await questionApi.getQuestionsBySection(sectionId);
      console.log('📦 Raw response:', questionsData);
      console.log('📊 Type:', typeof questionsData);
      console.log('📏 Is Array:', Array.isArray(questionsData));
      console.log('🔢 Length:', questionsData?.length);
      
      if (!questionsData || questionsData.length === 0) {
        console.warn('⚠️ No questions found for this section');
        console.log('Debug - questionsData value:', questionsData);
        setQuestions([]);
        return;
      }
      
      console.log('✅ Questions found:', questionsData.length);
      setQuestions(questionsData.sort((a, b) => a.questionNumber - b.questionNumber));
      setCurrentQuestionIndex(0);
      
      questionsData.forEach(q => {
        console.log(`Question ${q.questionNumber}:`, {
          id: q.questionId,
          type: q.questionType,
          groupId: q.groupId,
          text: q.questionText,
          choicesCount: q.choices?.length || 0
        });
      });
    } catch (err) {
      console.error('❌ Error fetching questions:', err);
      setQuestions([]);
      alert('Không thể tải câu hỏi: ' + (err as Error).message);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit(); // Auto submit when time's up
          return 0;
        }
        
        const newTime = prev - 1;
        
        // Save time to localStorage every 5 seconds to avoid too many writes
        if (newTime % 5 === 0) {
          const saved = localStorage.getItem('topik_in_progress');
          if (saved) {
            try {
              const data = JSON.parse(saved);
              data.timeLeft = newTime;
              localStorage.setItem('topik_in_progress', JSON.stringify(data));
            } catch (err) {
              console.error('Error saving timer:', err);
            }
          }
        }
        
        return newTime;
      });
    }, 1000);
  };

  const handleAutoSubmit = async () => {
    try {
      await examAttemptApi.submitExam(Number(attemptId));
      localStorage.removeItem('topik_in_progress'); // Clear saved attempt
      alert('Hết giờ! Bài thi đã được tự động nộp.');
      navigate(`/learn/topik/result/${attemptId}`);
    } catch (err) {
      console.error('Error auto-submitting exam:', err);
      alert('Hết giờ nhưng có lỗi khi tự động nộp bài');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = async (questionId: number, choiceId: number) => {
    // Toggle: Nếu đã chọn đáp án này rồi thì bỏ chọn
    const currentAnswer = selectedAnswers.get(questionId);
    
    if (currentAnswer === choiceId) {
      // Bỏ chọn
      const newAnswers = new Map(selectedAnswers);
      newAnswers.delete(questionId);
      setSelectedAnswers(newAnswers);
      
      // Xóa answer ở backend (có thể gửi null hoặc không gửi gì)
      try {
        await userAnswerApi.saveUserAnswer({
          attemptId: Number(attemptId),
          questionId: questionId,
          choiceId: null, // hoặc có thể call API delete nếu có
        });
      } catch (err) {
        console.error('Error removing answer:', err);
      }
    } else {
      // Chọn đáp án mới
      setSelectedAnswers(new Map(selectedAnswers.set(questionId, choiceId)));

      // Save to backend
      try {
        await userAnswerApi.saveUserAnswer({
          attemptId: Number(attemptId),
          questionId: questionId,
          choiceId: choiceId,
        });
      } catch (err) {
        console.error('Error saving answer:', err);
      }
    }
  };

  const handleTextAnswerChange = (questionId: number, text: string) => {
    setTextAnswers(new Map(textAnswers.set(questionId, text)));
    
    // Debounce auto-save: Chờ 2s sau khi user ngừng gõ mới lưu
    const existingTimer = saveTextTimerRef.current.get(questionId);
    if (existingTimer) clearTimeout(existingTimer);
    
    const newTimer = setTimeout(() => {
      handleTextAnswerSave(questionId);
    }, 2000); // 2 seconds
    
    saveTextTimerRef.current.set(questionId, newTimer);
  };

  const handleTextAnswerSave = async (questionId: number) => {
    const text = textAnswers.get(questionId);
    if (!text || text.trim() === '') return;

    setSavingText(new Set(savingText.add(questionId)));
    
    try {
      await userAnswerApi.saveUserAnswer({
        attemptId: Number(attemptId),
        questionId: questionId,
        answerText: text,
      });
    } catch (err) {
      console.error('Error saving text answer:', err);
    } finally {
      setSavingText(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    if (currentQ.groupId) {
      // Find next question that's NOT in the same group
      const nextIndex = questions.findIndex((q, idx) => 
        idx > currentQuestionIndex && q.groupId !== currentQ.groupId
      );
      if (nextIndex !== -1) {
        setCurrentQuestionIndex(nextIndex);
        updateSavedPosition(currentSectionIndex, nextIndex);
      }
    } else {
      // Single question, move to next
      if (currentQuestionIndex < questions.length - 1) {
        const newIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(newIndex);
        updateSavedPosition(currentSectionIndex, newIndex);
      }
    }
  };

  const handlePreviousQuestion = () => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    if (currentQ.groupId) {
      // Find previous question that's NOT in the same group
      for (let i = currentQuestionIndex - 1; i >= 0; i--) {
        if (questions[i].groupId !== currentQ.groupId) {
          setCurrentQuestionIndex(i);
          updateSavedPosition(currentSectionIndex, i);
          return;
        }
      }
    } else {
      // Single question, move to previous
      if (currentQuestionIndex > 0) {
        const newIndex = currentQuestionIndex - 1;
        setCurrentQuestionIndex(newIndex);
        updateSavedPosition(currentSectionIndex, newIndex);
      }
    }
  };

  const updateSavedPosition = (sectionIdx: number, questionIdx: number) => {
    const saved = localStorage.getItem('topik_in_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        data.currentSectionIndex = sectionIdx;
        data.currentQuestionIndex = questionIdx;
        localStorage.setItem('topik_in_progress', JSON.stringify(data));
      } catch (err) {
        console.error('Error updating question position:', err);
      }
    }
  };

  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      const newSectionIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(newSectionIndex);
      setCurrentQuestionIndex(0);
      updateSavedPosition(newSectionIndex, 0);
    } else {
      handleSubmitExam();
    }
  };

  const handleSubmitExam = async () => {
    if (!confirm('Bạn có chắc chắn muốn nộp bài?')) return;

    try {
      await examAttemptApi.submitExam(Number(attemptId));
      localStorage.removeItem('topik_in_progress'); // Clear saved attempt
      alert('Nộp bài thành công!');
      navigate(`/learn/topik/result/${attemptId}`);
    } catch (err: any) {
      console.error('Error submitting exam:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Không xác định';
      alert(`Có lỗi khi nộp bài:\n${errorMessage}`);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  // Helper: Get all questions in the same group
  const getQuestionGroup = (question: QuestionResponse): QuestionResponse[] => {
    if (!question.groupId) {
      return [question]; // Single question
    }
    return questions.filter(q => q.groupId === question.groupId);
  };

  // Helper: Get unique question numbers for navigator (group by question_number)
  const getUniqueQuestions = (): QuestionResponse[] => {
    const seen = new Set<number>();
    return questions.filter(q => {
      if (seen.has(q.questionNumber)) {
        return false;
      }
      seen.add(q.questionNumber);
      return true;
    });
  };

  // Helper: Check if a specific question has answer (fix logic để chỉ check câu đó)
  const hasQuestionAnswer = (question: QuestionResponse): boolean => {
    return selectedAnswers.has(question.questionId) || textAnswers.has(question.questionId);
  };

  if (loading || !attempt || sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#666666' }}>Đang tải bài thi...</p>
        </div>
      </div>
    );
  }

  const currentSection = sections[currentSectionIndex];
  const currentQuestion = questions[currentQuestionIndex];
  const uniqueQuestions = getUniqueQuestions();
  const currentUniqueIndex = uniqueQuestions.findIndex(q => q.questionNumber === currentQuestion?.questionNumber);
  const progress = currentUniqueIndex >= 0 ? ((currentUniqueIndex + 1) / uniqueQuestions.length) * 100 : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Header */}
      <div className="border-b sticky top-0 z-10" style={{ backgroundColor: '#FFFFFF', borderColor: '#BDBDBD' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold" style={{ color: '#333333' }}>
                {currentSection.sectionType} - Phần {currentSectionIndex + 1}
              </h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}>
                Câu {currentQuestion?.questionNumber || currentQuestionIndex + 1}/{uniqueQuestions.length}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                style={{
                  backgroundColor: timeLeft < 300 ? '#FFEBEE' : '#FFE8DC',
                  color: timeLeft < 300 ? '#FF5252' : '#FF6B35'
                }}
              >
                <Clock className="w-5 h-5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full rounded-full h-2" style={{ backgroundColor: '#FFE8DC' }}>
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: '#FF6B35' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="rounded-xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
              {/* Audio Player (for Listening section) */}
              {currentSection.sectionType === 'LISTENING' && currentSection.audioUrl && (
                <div className="mb-6 p-4 rounded-lg border-2" style={{ backgroundColor: '#E8F5E9', borderColor: '#4CAF50' }}>
                 
                  <style>{`
                    .audio-no-seek::-webkit-media-controls-timeline,
                    .audio-no-seek::-webkit-media-controls-current-time-display,
                    .audio-no-seek::-webkit-media-controls-time-remaining-display {
                      pointer-events: none;
                      cursor: not-allowed;
                    }
                    .audio-no-seek.audio-started::-webkit-media-controls-play-button {
                      pointer-events: none;
                      opacity: 0.5;
                      cursor: not-allowed;
                    }
                    .audio-no-seek {
                      pointer-events: auto;
                    }
                    .audio-no-seek::-webkit-media-controls-volume-slider,
                    .audio-no-seek::-webkit-media-controls-mute-button {
                      pointer-events: auto;
                      cursor: pointer;
                    }
                  `}</style>
                  <audio
                    ref={audioRef}
                    src={currentSection.audioUrl}
                    onPlay={(e) => {
                      if (!audioStarted) {
                        const confirmed = confirm('Bắt đầu phát audio? Audio sẽ chạy liên tục và không thể tạm dừng.');
                        if (confirmed) {
                          setAudioStarted(true);
                          setAudioPlaying(true);
                          e.currentTarget.classList.add('audio-started');
                        } else {
                          e.currentTarget.pause();
                        }
                      } else {
                        setAudioPlaying(true);
                      }
                    }}
                    onPause={(e) => {
                      // Prevent pause after started
                      if (audioStarted && !e.currentTarget.ended) {
                        e.preventDefault();
                        setTimeout(() => {
                          e.currentTarget.play();
                        }, 0);
                      } else {
                        setAudioPlaying(false);
                      }
                    }}
                    onEnded={() => setAudioPlaying(false)}
                    onSeeking={(e) => {
                      // Prevent seeking - reset to stored position
                      e.preventDefault();
                      const audio = e.currentTarget;
                      if (audioStarted && audio.dataset.lastTime) {
                        const lastTime = parseFloat(audio.dataset.lastTime);
                        setTimeout(() => {
                          audio.currentTime = lastTime;
                          audio.play();
                        }, 0);
                      }
                    }}
                    onTimeUpdate={(e) => {
                      // Store current time to prevent seeking
                      const audio = e.currentTarget;
                      audio.dataset.lastTime = audio.currentTime.toString();
                    }}
                    className={`w-full audio-no-seek ${audioStarted ? 'audio-started' : ''}`}
                    controls
                    controlsList="nodownload noplaybackrate"
                    style={{ cursor: 'default' }}
                  />
               
                </div>
              )}


              {currentQuestion ? (
                <>
                  {(() => {
                    const questionGroup = getQuestionGroup(currentQuestion);
                    const isGrouped = questionGroup.length > 1;

                    return (
                      <>
                        {/* Group Title (if grouped) */}
                  

                        {/* Shared Audio (for grouped questions) */}
                        {isGrouped && currentQuestion.audioUrl && (
                          <div className="mb-6 p-4 rounded-lg border-2" style={{ backgroundColor: '#E8F5E9', borderColor: '#4CAF50' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <Volume2 className="w-5 h-5" style={{ color: '#4CAF50' }} />
                              <span className="text-sm font-medium" style={{ color: '#2E7D32' }}>Audio cho nhóm câu hỏi</span>
                            </div>
                            <audio
                              src={currentQuestion.audioUrl}
                              className="w-full"
                              controls
                            />
                          </div>
                        )}

                        {/* Shared Passage Text (for grouped questions) */}
                        {isGrouped && currentQuestion.passageText && (
                          <div className="mb-6 p-6 rounded-lg border" style={{ backgroundColor: '#FFF8F0', borderColor: '#BDBDBD' }}>
                            <div className="mb-3 pb-2 border-b" style={{ borderColor: '#FFE8DC' }}>
                            
                            
                            </div>
                            <p className="text-xl font-bold whitespace-pre-wrap leading-relaxed" style={{ color: '#333333' }}>
                              {currentQuestion.passageText}
                            </p>
                          </div>
                        )}

                        {/* Individual Question Image (for single questions) */}
                        {!isGrouped && currentQuestion.imageUrl && (
                          <div className="mb-6">
                            <img 
                              src={currentQuestion.imageUrl} 
                              alt={`Question ${currentQuestion.questionNumber}`}
                              className="max-w-full h-auto rounded-lg border"
                              style={{ borderColor: '#BDBDBD' }}
                            />
                          </div>
                        )}

                        {/* Individual Passage Text (for single questions) */}
                        {!isGrouped && currentQuestion.passageText && (
                          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#FFF8F0', borderColor: '#BDBDBD' }}>
                            <p className="whitespace-pre-wrap leading-relaxed" style={{ color: '#333333' }}>
                              {currentQuestion.passageText}
                            </p>
                          </div>
                        )}

                        {/* Render all questions in the group */}
                        {questionGroup.map((q, idx) => (
                          <div key={q.questionId} className={idx > 0 ? 'mt-8 pt-6 border-t-2' : ''} style={idx > 0 ? { borderColor: '#FFE8DC' } : {}}>
                            {/* Use TopikWritingGrid for questions 53 and 54 in WRITING section */}
                            {currentSection.sectionType === 'WRITING' && (q.questionNumber === 53 || q.questionNumber === 54) ? (
                              <TopikWritingGrid
                                questionNumber={q.questionNumber}
                                maxCharacters={q.questionNumber === 53 ? 300 : 700}
                                minCharacters={q.questionNumber === 53 ? 200 : 600}
                                prompt={q.questionText || ''}
                                imageUrl={q.imageUrl || undefined}
                                value={textAnswers.get(q.questionId) || ''}
                                onChange={(value) => handleTextAnswerChange(q.questionId, value)}
                              />
                            ) : (
                              <>
                                {/* Individual Question Image - Show for EACH question if it has imageUrl */}
                                {q.imageUrl && (
                                  <div className="mb-6">
                                    <img 
                                      src={q.imageUrl} 
                                      alt={`Question ${q.questionNumber}`}
                                      className="max-w-full h-auto rounded-lg border"
                                      style={{ borderColor: '#BDBDBD' }}
                                    />
                                  </div>
                                )}

                                {/* Question Text - Always show */}
                                <div className="mb-6">
                                  <h2 className="text-xl font-bold mb-4" style={{ color: '#333333', whiteSpace: 'pre-line' }}>
                                    {q.questionNumber}. {q.questionText}
                                  </h2>
                                </div>

                                {/* Answer Choices */}
                                <div>
                                  {q.questionType === 'SHORT' || q.questionType === 'ESSAY' ? (
                                // Text input for SHORT and ESSAY
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <label className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-lg">
                                      {q.questionText?.match(/\((.)\)/)?.[1] || q.questionNumber}
                                    </label>
                                    <textarea
                                      value={textAnswers.get(q.questionId) || ''}
                                      onChange={(e) => handleTextAnswerChange(q.questionId, e.target.value)}
                                      onBlur={() => handleTextAnswerSave(q.questionId)}
                                      placeholder={q.questionType === 'ESSAY' ? 'Nhập câu trả lời của bạn (tối thiểu 200 ký tự)...' : 'Nhập câu trả lời ngắn...'}
                                      className={`flex-1 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:outline-none dark:bg-gray-800 dark:text-white resize-none ${
                                        q.questionType === 'ESSAY' ? 'h-64' : 'h-16'
                                      }`}
                                    />
                                  </div>
                                      <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                          <span style={{ color: '#666666' }}>
                                            {textAnswers.get(q.questionId)?.length || 0} ký tự
                                            {q.questionType === 'ESSAY' && ' (tối thiểu 200)'}
                                          </span>
                                          {savingText.has(q.questionId) && (
                                            <span className="text-sm flex items-center gap-1" style={{ color: '#FF6B35' }}>
                                              <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                                              Đang lưu...
                                            </span>
                                          )}
                                          {!savingText.has(q.questionId) && textAnswers.has(q.questionId) && (
                                            <span className="text-sm" style={{ color: '#4CAF50' }}>✓ Đã lưu</span>
                                          )}
                                        </div>
                                        <button
                                          onClick={() => handleTextAnswerSave(q.questionId)}
                                          disabled={savingText.has(q.questionId)}
                                          className="px-4 py-2 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                          style={{ backgroundColor: '#FF6B35' }}
                                          onMouseEnter={(e) => !savingText.has(q.questionId) && (e.currentTarget.style.backgroundColor = '#E55A2B')}
                                          onMouseLeave={(e) => !savingText.has(q.questionId) && (e.currentTarget.style.backgroundColor = '#FF6B35')}
                                        >
                                          {savingText.has(q.questionId) ? 'Đang lưu...' : 'Lưu câu trả lời'}
                                        </button>
                                      </div>
                                    </div>
                                  ) : q.choices && q.choices.length > 0 ? (
                                    (() => {
                                      // Check if all choices are images
                                      const hasImageChoices = q.choices.every(choice => 
                              choice.choiceText.startsWith('http') && 
                              (choice.choiceText.includes('cloudinary') || 
                               choice.choiceText.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                            );

                                      if (hasImageChoices) {
                                        // Grid layout 2x2 for image choices
                                        return (
                                          <div className="grid grid-cols-2 gap-4">
                                            {q.choices.map((choice) => (
                                              <button
                                                key={choice.choiceId}
                                                onClick={() => handleAnswerSelect(q.questionId, choice.choiceId)}
                                                className="p-3 rounded-lg border-2 transition"
                                                style={{
                                                  borderColor: selectedAnswers.get(q.questionId) === choice.choiceId ? '#FF6B35' : '#BDBDBD',
                                                  backgroundColor: selectedAnswers.get(q.questionId) === choice.choiceId ? '#FFE8DC' : '#FFFFFF'
                                                }}
                                                onMouseEnter={(e) => selectedAnswers.get(q.questionId) !== choice.choiceId && (e.currentTarget.style.borderColor = '#FFE8DC')}
                                                onMouseLeave={(e) => selectedAnswers.get(q.questionId) !== choice.choiceId && (e.currentTarget.style.borderColor = '#BDBDBD')}
                                              >
                                                <div className="flex flex-col gap-2">
                                                  <div className="flex items-center justify-between">
                                                    <span className="w-7 h-7 flex items-center justify-center rounded-full font-semibold text-sm" style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}>
                                                      {choice.choiceLabel}
                                                    </span>
                                                    {selectedAnswers.get(q.questionId) === choice.choiceId && (
                                                      <span className="text-xl" style={{ color: '#FF6B35' }}>✓</span>
                                                    )}
                                                  </div>
                                                  <img 
                                                    src={choice.choiceText} 
                                                    alt={`Option ${choice.choiceLabel}`}
                                                    className="w-full h-auto max-h-64 object-contain rounded-lg border"
                                                    style={{ backgroundColor: '#FFFFFF', borderColor: '#BDBDBD' }}
                                                    onError={(e) => {
                                                      console.error('Image load error:', choice.choiceText);
                                                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EError%3C/text%3E%3C/svg%3E';
                                                    }}
                                                  />
                                                </div>
                                              </button>
                                            ))}
                                          </div>
                                        );
                                      } else {
                                        // List layout for text choices
                                        return (
                                          <div className="space-y-3">
                                            {q.choices.map((choice) => (
                                              <button
                                                key={choice.choiceId}
                                                onClick={() => handleAnswerSelect(q.questionId, choice.choiceId)}
                                                className="w-full text-left p-4 rounded-lg border-2 transition"
                                                style={{
                                                  borderColor: selectedAnswers.get(q.questionId) === choice.choiceId ? '#FF6B35' : '#BDBDBD',
                                                  backgroundColor: selectedAnswers.get(q.questionId) === choice.choiceId ? '#FFE8DC' : '#FFFFFF'
                                                }}
                                                onMouseEnter={(e) => selectedAnswers.get(q.questionId) !== choice.choiceId && (e.currentTarget.style.borderColor = '#FFE8DC')}
                                                onMouseLeave={(e) => selectedAnswers.get(q.questionId) !== choice.choiceId && (e.currentTarget.style.borderColor = '#BDBDBD')}
                                              >
                                                <div className="flex items-start gap-3">
                                                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-semibold" style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}>
                                                    {choice.choiceLabel}
                                                  </span>
                                                  <span className="flex-1" style={{ color: '#333333' }}>
                                                    {choice.choiceText}
                                                  </span>
                                                </div>
                                              </button>
                                        ))}
                                      </div>
                                    );
                                  }
                                })()
                                  ) : (
                                    <p style={{ color: '#666666' }}>Không có đáp án</p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg mb-4" style={{ color: '#666666' }}>Không có câu hỏi cho phần thi này</p>
                  <p className="text-sm" style={{ color: '#999999' }}>
                    Vui lòng kiểm tra:
                  </p>
                  <ul className="text-sm mt-2 space-y-1" style={{ color: '#999999' }}>
                    <li>• Database đã có questions cho WRITING section chưa?</li>
                    <li>• Backend API /api/questions/section/{'{sectionId}'} hoạt động chưa?</li>
                    <li>• Kiểm tra Console (F12) để xem log chi tiết</li>
                  </ul>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: '#BDBDBD' }}>
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#FFE8DC', color: '#666666' }}
                  onMouseEnter={(e) => currentQuestionIndex !== 0 && (e.currentTarget.style.backgroundColor = '#FFDCC8')}
                  onMouseLeave={(e) => currentQuestionIndex !== 0 && (e.currentTarget.style.backgroundColor = '#FFE8DC')}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Câu trước
                </button>

                <div className="flex items-center gap-3">
                  {/* Next Question Button */}
                  {currentQuestionIndex < questions.length - 1 && (
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition"
                      style={{ backgroundColor: '#FF6B35' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E55A2B'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
                    >
                      Câu tiếp theo
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {/* Next Section / Submit Button */}
                  {currentSectionIndex < sections.length - 1 ? (
                    <button
                      onClick={handleNextSection}
                      className="px-6 py-3 text-white rounded-lg transition font-semibold"
                      style={{ backgroundColor: '#4CAF50' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45A049'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                    >
                      Chuyển sang {sections[currentSectionIndex + 1]?.sectionType || 'phần tiếp theo'} →
                    </button>
                  ) : (
                    currentQuestionIndex === questions.length - 1 && (
                      <button
                        onClick={handleNextSection}
                        className="px-6 py-3 text-white rounded-lg transition font-semibold"
                        style={{ backgroundColor: '#FF5252' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E64747'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF5252'}
                      >
                        Nộp bài
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border p-6 sticky top-24" style={{ backgroundColor: '#FFFFFF', borderColor: '#BDBDBD' }}>
              <div className="flex items-center gap-2 mb-4">
                <List className="w-5 h-5" style={{ color: '#FF6B35' }} />
                <h3 className="font-semibold" style={{ color: '#333333' }}>Danh sách câu hỏi</h3>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {uniqueQuestions.map((q) => {
                  const questionIndex = questions.findIndex(quest => quest.questionId === q.questionId);
                  const isActive = currentQuestion?.questionNumber === q.questionNumber;
                  const hasAnswer = hasQuestionAnswer(q);
                  
                  return (
                    <button
                      key={q.questionId}
                      onClick={() => setCurrentQuestionIndex(questionIndex)}
                      className="aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition"
                      style={{
                        backgroundColor: isActive ? '#FF6B35' : hasAnswer ? '#E8F5E9' : '#FFE8DC',
                        color: isActive ? '#FFFFFF' : hasAnswer ? '#2E7D32' : '#666666'
                      }}
                      onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = hasAnswer ? '#C8E6C9' : '#FFDCC8')}
                      onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = hasAnswer ? '#E8F5E9' : '#FFE8DC')}
                    >
                      {q.questionNumber}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t text-sm" style={{ borderColor: '#BDBDBD' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E8F5E9' }}></div>
                  <span style={{ color: '#666666' }}>Đã trả lời: {uniqueQuestions.filter(q => hasQuestionAnswer(q)).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFE8DC' }}></div>
                  <span style={{ color: '#666666' }}>Chưa trả lời: {uniqueQuestions.length - uniqueQuestions.filter(q => hasQuestionAnswer(q)).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamAttempt;
