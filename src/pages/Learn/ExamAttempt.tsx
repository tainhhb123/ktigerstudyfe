import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, List, Volume2, VolumeX } from 'lucide-react';
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
      // Reset timer for new section
      const section = sections[currentSectionIndex];
      setTimeLeft(section.durationMinutes * 60);
      startTimer();
    }
  }, [currentSectionIndex, sections]);

  const fetchAttemptData = async () => {
    try {
      setLoading(true);
      const attemptData = await examAttemptApi.getAttemptById(Number(attemptId));
      setAttempt(attemptData);

      if (attemptData.examId) {
        const sectionsData = await examSectionApi.getSectionsByExam(attemptData.examId);
        setSections(sectionsData.sort((a, b) => a.sectionOrder - b.sectionOrder));
      }
    } catch (err) {
      console.error('Error fetching attempt:', err);
      alert('Không thể tải thông tin bài thi');
      navigate('/learn/topik');
    } finally {
      setLoading(false);
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
          handleNextSection(); // Auto move to next section when time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = async (questionId: number, choiceId: number) => {
    // Update local state
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
      }
    } else {
      // Single question, move to next
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
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
          return;
        }
      }
    } else {
      // Single question, move to previous
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    }
  };

  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      handleSubmitExam();
    }
  };

  const handleSubmitExam = async () => {
    if (!confirm('Bạn có chắc chắn muốn nộp bài?')) return;

    try {
      await examAttemptApi.submitExam(Number(attemptId));
      alert('Nộp bài thành công!');
      navigate(`/learn/topik/result/${attemptId}`);
    } catch (err) {
      console.error('Error submitting exam:', err);
      alert('Có lỗi khi nộp bài');
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

  // Helper: Check if any question in group has answer
  const hasGroupAnswer = (groupId: number | null): boolean => {
    if (!groupId) return false;
    const groupQuestions = questions.filter(q => q.groupId === groupId);
    return groupQuestions.some(q => selectedAnswers.has(q.questionId) || textAnswers.has(q.questionId));
  };

  if (loading || !attempt || sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải bài thi...</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentSection.sectionType} - Phần {currentSectionIndex + 1}
              </h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-medium">
                Câu {currentQuestion?.questionNumber || currentQuestionIndex + 1}/{uniqueQuestions.length}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                timeLeft < 300 ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                <Clock className="w-5 h-5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-brand-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
              {/* Audio Player (for Listening section) */}
              {currentSection.sectionType === 'LISTENING' && currentSection.audioUrl && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <audio
                    ref={audioRef}
                    src={currentSection.audioUrl}
                    onPlay={() => setAudioPlaying(true)}
                    onPause={() => setAudioPlaying(false)}
                    onEnded={() => setAudioPlaying(false)}
                    className="w-full"
                    controls
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
                          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-2">
                              <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Audio cho nhóm câu hỏi</span>
                            </div>
                            <audio
                              src={currentQuestion.audioUrl}
                              className="w-full"
                              controls
                            />
                          </div>
                        )}

                        {/* Shared Image (for grouped questions) */}
                        {isGrouped && currentQuestion.imageUrl && (
                          <div className="mb-6">
                            <img 
                              src={currentQuestion.imageUrl} 
                              alt="Shared content for question group"
                              className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                          </div>
                        )}

                        {/* Shared Passage Text (for grouped questions) */}
                        {isGrouped && currentQuestion.passageText && (
                          <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="mb-3 pb-2 border-b border-gray-300 dark:border-gray-600">
                            
                            
                            </div>
                            <p className="text-xl font-bold  whitespace-pre-wrap leading-relaxed">
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
                              className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                          </div>
                        )}

                        {/* Individual Passage Text (for single questions) */}
                        {!isGrouped && currentQuestion.passageText && (
                          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                              {currentQuestion.passageText}
                            </p>
                          </div>
                        )}

                        {/* Render all questions in the group */}
                        {questionGroup.map((q, idx) => (
                          <div key={q.questionId} className={idx > 0 ? 'mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700' : ''}>
                            {/* Question Text - Always show */}
                            <div className="mb-6">
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {textAnswers.get(q.questionId)?.length || 0} ký tự
                                        {q.questionType === 'ESSAY' && ' (tối thiểu 200)'}
                                      </span>
                                      {savingText.has(q.questionId) && (
                                        <span className="text-brand-500 text-sm flex items-center gap-1">
                                          <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                                          Đang lưu...
                                        </span>
                                      )}
                                      {!savingText.has(q.questionId) && textAnswers.has(q.questionId) && (
                                        <span className="text-green-600 dark:text-green-400 text-sm">✓ Đã lưu</span>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => handleTextAnswerSave(q.questionId)}
                                      disabled={savingText.has(q.questionId)}
                                      className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            className={`p-3 rounded-lg border-2 transition ${
                                              selectedAnswers.get(q.questionId) === choice.choiceId
                                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700'
                                            }`}
                                          >
                                            <div className="flex flex-col gap-2">
                                              <div className="flex items-center justify-between">
                                                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 font-semibold text-sm">
                                                  {choice.choiceLabel}
                                                </span>
                                                {selectedAnswers.get(q.questionId) === choice.choiceId && (
                                                  <span className="text-brand-500 text-xl">✓</span>
                                                )}
                                              </div>
                                              <img 
                                                src={choice.choiceText} 
                                                alt={`Option ${choice.choiceLabel}`}
                                                className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900"
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
                                            className={`w-full text-left p-4 rounded-lg border-2 transition ${
                                              selectedAnswers.get(q.questionId) === choice.choiceId
                                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700'
                                            }`}
                                          >
                                            <div className="flex items-start gap-3">
                                              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 font-semibold">
                                                {choice.choiceLabel}
                                              </span>
                                              <span className="text-gray-900 dark:text-white flex-1">
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
                                <p className="text-gray-500 dark:text-gray-400">Không có đáp án</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Không có câu hỏi cho phần thi này</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Vui lòng kiểm tra:
                  </p>
                  <ul className="text-sm text-gray-400 dark:text-gray-500 mt-2 space-y-1">
                    <li>• Database đã có questions cho WRITING section chưa?</li>
                    <li>• Backend API /api/questions/section/{'{sectionId}'} hoạt động chưa?</li>
                    <li>• Kiểm tra Console (F12) để xem log chi tiết</li>
                  </ul>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Câu trước
                </button>

                <div className="flex items-center gap-3">
                  {/* Next Question Button */}
                  {currentQuestionIndex < questions.length - 1 && (
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
                    >
                      Câu tiếp theo
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {/* Next Section / Submit Button */}
                  {currentSectionIndex < sections.length - 1 ? (
                    <button
                      onClick={handleNextSection}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Chuyển sang {sections[currentSectionIndex + 1]?.sectionType || 'phần tiếp theo'} →
                    </button>
                  ) : (
                    currentQuestionIndex === questions.length - 1 && (
                      <button
                        onClick={handleNextSection}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
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
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <List className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Danh sách câu hỏi</h3>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {uniqueQuestions.map((q) => {
                  const questionIndex = questions.findIndex(quest => quest.questionId === q.questionId);
                  const isActive = currentQuestion?.questionNumber === q.questionNumber;
                  const hasAnswer = q.groupId ? hasGroupAnswer(q.groupId) : (selectedAnswers.has(q.questionId) || textAnswers.has(q.questionId));
                  
                  return (
                    <button
                      key={q.questionId}
                      onClick={() => setCurrentQuestionIndex(questionIndex)}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                        isActive
                          ? 'bg-brand-500 text-white'
                          : hasAnswer
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {q.questionNumber}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Đã trả lời: {uniqueQuestions.filter(q => q.groupId ? hasGroupAnswer(q.groupId) : (selectedAnswers.has(q.questionId) || textAnswers.has(q.questionId))).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Chưa trả lời: {uniqueQuestions.length - uniqueQuestions.filter(q => q.groupId ? hasGroupAnswer(q.groupId) : (selectedAnswers.has(q.questionId) || textAnswers.has(q.questionId))).length}</span>
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
