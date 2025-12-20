import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Award, BarChart3, Home, Brain, AlertCircle, ChevronDown, ChevronUp, Eye, EyeOff, FileText, Headphones, BookOpen, PenTool } from 'lucide-react';
import { examAttemptApi } from '../../services/ExamApi';
import { ExamResultResponse, QuestionResultResponse } from '../../types/exam';

const TopikExamResult = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ExamResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [showOnlyWrong, setShowOnlyWrong] = useState(false);

  const fetchResult = useCallback(async () => {
    try {
      setLoading(true);
      const data = await examAttemptApi.getResult(Number(attemptId));
      console.log('📊 Exam Result Data:', data);
      
      setResult(data);
      // ✨ AI grading đã được backend xử lý khi submit exam
      // Không cần gọi AI từ frontend nữa
    } catch (err) {
      console.error('Error fetching result:', err);
      alert('Không thể tải kết quả bài thi');
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full animate-spin mx-auto mb-4" style={{ border: '4px solid #FF6B35', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#666666' }}>Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: '#666666' }}>Không tìm thấy kết quả</p>
          <button
            onClick={() => navigate('/learn/topik')}
            className="px-6 py-2 text-white rounded-lg transition"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Quay lại danh sách đề thi
          </button>
        </div>
      </div>
    );
  }

  // Helper: Lấy isCorrect từ backend
  const getIsCorrect = (question: QuestionResultResponse): boolean => {
    return question.isCorrect;
  };

  // Toggle expand/collapse câu hỏi
  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Expand/Collapse tất cả trong section
  const expandAllInSection = (sectionType: string) => {
    const sectionQuestions = result!.questions.filter(q => q.sectionType === sectionType);
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      sectionQuestions.forEach(q => newSet.add(q.questionId));
      return newSet;
    });
  };

  const collapseAllInSection = (sectionType: string) => {
    const sectionQuestions = result!.questions.filter(q => q.sectionType === sectionType);
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      sectionQuestions.forEach(q => newSet.delete(q.questionId));
      return newSet;
    });
  };

  const sections = Object.entries(result.sectionResults);
  
  // Lấy câu hỏi theo tab hiện tại
  const getFilteredQuestions = () => {
    if (activeTab === 'overview') return [];
    let questions = result.questions.filter(q => q.sectionType === activeTab);
    if (showOnlyWrong) {
      questions = questions.filter(q => !q.isCorrect);
    }
    return questions;
  };

  // Icon cho từng section
  const getSectionIcon = (sectionType: string) => {
    switch (sectionType) {
      case 'LISTENING': return <Headphones className="w-5 h-5" />;
      case 'READING': return <BookOpen className="w-5 h-5" />;
      case 'WRITING': return <PenTool className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  // Màu cho từng section
  const getSectionColor = (sectionType: string) => {
    switch (sectionType) {
      case 'LISTENING': return { bg: '#E3F2FD', border: '#2196F3', text: '#2196F3' };
      case 'READING': return { bg: '#E8F5E9', border: '#4CAF50', text: '#4CAF50' };
      case 'WRITING': return { bg: '#F3E5F5', border: '#9C27B0', text: '#9C27B0' };
      default: return { bg: '#FFF8F0', border: '#FF6B35', text: '#FF6B35' };
    }
  };

  // ===== TOPIK II Scoring System =====
  // Listening: 50 câu × 2 điểm = 100 điểm
  // Reading: 50 câu × 2 điểm = 100 điểm
  // Writing: Q51(10) + Q52(10) + Q53(30) + Q54(50) = 100 điểm
  // Tổng: 300 điểm
  const totalPossibleScore = 300;
  
  // Tính TOPIK Level dựa trên tổng điểm
  const getTopikLevel = (score: number): { level: string; color: string; bgColor: string } => {
    if (score >= 230) return { level: 'TOPIK 6', color: '#9C27B0', bgColor: '#F3E5F5' };
    if (score >= 190) return { level: 'TOPIK 5', color: '#2196F3', bgColor: '#E3F2FD' };
    if (score >= 150) return { level: 'TOPIK 4', color: '#4CAF50', bgColor: '#E8F5E9' };
    if (score >= 120) return { level: 'TOPIK 3', color: '#FF9800', bgColor: '#FFF3E0' };
    return { level: 'Chưa đạt', color: '#FF5252', bgColor: '#FFEBEE' };
  };

  const topikLevel = getTopikLevel(result.totalScore);
  const passPercentage = (result.totalScore / totalPossibleScore) * 100;
  const isPassed = result.totalScore >= 120; // TOPIK II pass = 120 điểm (Level 3)

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12" style={{ color: isPassed ? '#4CAF50' : '#FF6B35' }} />
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#333333' }}>
                  Kết quả bài thi TOPIK
                </h1>
                <p className="text-sm" style={{ color: '#666666' }}>
                  Attempt #{attemptId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* TOPIK Level Badge */}
              <div 
                className="px-4 py-2 rounded-lg text-center"
                style={{ backgroundColor: topikLevel.bgColor, border: `2px solid ${topikLevel.color}` }}
              >
                <div className="text-xs font-medium" style={{ color: topikLevel.color }}>Cấp độ</div>
                <div className="text-xl font-bold" style={{ color: topikLevel.color }}>
                  {topikLevel.level}
                </div>
              </div>
              {/* Quick Score */}
              <div className="text-right">
                <div className="text-3xl font-bold" style={{ color: '#FF6B35' }}>
                  {result.totalScore.toFixed(1)}
                  <span className="text-lg" style={{ color: '#999999' }}>/300</span>
                </div>
                <div className="text-sm" style={{ color: isPassed ? '#4CAF50' : '#FF5252' }}>
                  {isPassed ? '✅ Đạt' : '❌ Chưa đạt'} ({passPercentage.toFixed(1)}%)
                </div>
              </div>
              <button
                onClick={() => navigate('/learn/topik')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
                style={{ backgroundColor: '#FFF8F0', color: '#666666', border: '1px solid #BDBDBD' }}
              >
                <Home className="w-4 h-4" />
                Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="rounded-xl mb-6 overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <div className="flex border-b" style={{ borderColor: '#BDBDBD' }}>
            {/* Overview Tab */}
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 px-6 py-4 font-medium transition-all"
              style={{
                backgroundColor: activeTab === 'overview' ? '#FF6B35' : 'transparent',
                color: activeTab === 'overview' ? '#FFFFFF' : '#666666',
                borderBottom: activeTab === 'overview' ? '3px solid #FF6B35' : '3px solid transparent'
              }}
            >
              <BarChart3 className="w-5 h-5" />
              Tổng quan
            </button>
            
            {/* Section Tabs */}
            {sections.map(([sectionType, section]) => {
              const colors = getSectionColor(sectionType);
              const isActive = activeTab === sectionType;
              return (
                <button
                  key={sectionType}
                  onClick={() => setActiveTab(sectionType)}
                  className="flex items-center gap-2 px-6 py-4 font-medium transition-all relative"
                  style={{
                    backgroundColor: isActive ? colors.bg : 'transparent',
                    color: isActive ? colors.text : '#666666',
                    borderBottom: isActive ? `3px solid ${colors.border}` : '3px solid transparent'
                  }}
                >
                  {getSectionIcon(sectionType)}
                  <span>{sectionType}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ 
                    backgroundColor: isActive ? colors.border : '#E0E0E0',
                    color: isActive ? '#FFFFFF' : '#666666'
                  }}>
                    {section.correctCount}/{section.totalCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Score Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="rounded-lg p-5" style={{ backgroundColor: '#FFE8DC', border: '2px solid #FF6B35' }}>
                    <div className="text-sm mb-1" style={{ color: '#FF6B35' }}>Tổng điểm</div>
                    <div className="text-3xl font-bold" style={{ color: '#FF6B35' }}>
                      {result.totalScore.toFixed(1)}
                      <span className="text-lg" style={{ color: '#999999' }}>/300</span>
                    </div>
                  </div>
                  
                  {/* TOPIK Level Card */}
                  <div className="rounded-lg p-5" style={{ backgroundColor: topikLevel.bgColor, border: `2px solid ${topikLevel.color}` }}>
                    <div className="text-sm mb-1" style={{ color: topikLevel.color }}>Cấp độ đạt</div>
                    <div className="text-3xl font-bold" style={{ color: topikLevel.color }}>
                      {topikLevel.level}
                    </div>
                  </div>
                  
                  <div className="rounded-lg p-5" style={{ backgroundColor: '#E8F5E9', border: '2px solid #4CAF50' }}>
                    <div className="text-sm mb-1" style={{ color: '#4CAF50' }}>Câu đúng</div>
                    <div className="text-3xl font-bold" style={{ color: '#4CAF50' }}>
                      {result.correctAnswers}
                      <span className="text-lg" style={{ color: '#999999' }}>/{result.totalQuestions}</span>
                    </div>
                  </div>
                  
                  <div className="rounded-lg p-5" style={{ backgroundColor: '#E3F2FD', border: '2px solid #2196F3' }}>
                    <div className="text-sm mb-1" style={{ color: '#2196F3' }}>Tỷ lệ điểm</div>
                    <div className="text-3xl font-bold" style={{ color: '#2196F3' }}>
                      {passPercentage.toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="rounded-lg p-5" style={{ backgroundColor: isPassed ? '#E8F5E9' : '#FFEBEE', border: `2px solid ${isPassed ? '#4CAF50' : '#FF5252'}` }}>
                    <div className="text-sm mb-1" style={{ color: isPassed ? '#4CAF50' : '#FF5252' }}>Kết quả</div>
                    <div className="text-3xl font-bold" style={{ color: isPassed ? '#4CAF50' : '#FF5252' }}>
                      {isPassed ? 'ĐẠT' : 'CHƯA ĐẠT'}
                    </div>
                  </div>
                </div>

                {/* Section Summary */}
                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#333333' }}>
                    📊 Điểm theo phần thi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sections.map(([sectionType, section]) => {
                      const colors = getSectionColor(sectionType);
                      return (
                        <div 
                          key={sectionType} 
                          className="rounded-lg p-5 cursor-pointer hover:shadow-lg transition-shadow"
                          style={{ backgroundColor: colors.bg, border: `2px solid ${colors.border}` }}
                          onClick={() => setActiveTab(sectionType)}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            {getSectionIcon(sectionType)}
                            <h4 className="font-bold text-lg" style={{ color: colors.text }}>{sectionType}</h4>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm" style={{ color: '#666666' }}>Điểm:</span>
                              <span className="font-bold text-xl" style={{ color: colors.text }}>
                                {section.score.toFixed(1)}/{section.totalPoints}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm" style={{ color: '#666666' }}>Câu đúng:</span>
                              <span className="font-bold" style={{ color: colors.text }}>
                                {section.correctCount}/{section.totalCount}
                              </span>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="w-full rounded-full h-3" style={{ backgroundColor: '#E0E0E0' }}>
                              <div 
                                className="h-3 rounded-full transition-all"
                                style={{ backgroundColor: colors.border, width: `${section.percentage}%` }}
                              />
                            </div>
                            <div className="text-center text-sm font-semibold" style={{ color: colors.text }}>
                              {section.percentage.toFixed(1)}%
                            </div>
                          </div>
                          
                          <div className="mt-3 text-center text-sm" style={{ color: '#666666' }}>
                            Click để xem chi tiết →
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TOPIK Level Reference Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Level Table */}
                  <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
                    <h3 className="text-lg font-bold mb-4" style={{ color: '#333333' }}>
                      🎯 Bảng xếp loại TOPIK II
                    </h3>
                    <div className="space-y-2">
                      {[
                        { level: 'TOPIK 6', range: '≥ 230 điểm', color: '#9C27B0', bg: '#F3E5F5' },
                        { level: 'TOPIK 5', range: '190 - 229 điểm', color: '#2196F3', bg: '#E3F2FD' },
                        { level: 'TOPIK 4', range: '150 - 189 điểm', color: '#4CAF50', bg: '#E8F5E9' },
                        { level: 'TOPIK 3', range: '120 - 149 điểm', color: '#FF9800', bg: '#FFF3E0' },
                        { level: 'Chưa đạt', range: '< 120 điểm', color: '#FF5252', bg: '#FFEBEE' },
                      ].map(item => (
                        <div 
                          key={item.level}
                          className="flex justify-between items-center p-3 rounded-lg"
                          style={{ 
                            backgroundColor: topikLevel.level === item.level ? item.bg : '#F5F5F5',
                            border: topikLevel.level === item.level ? `2px solid ${item.color}` : '1px solid transparent'
                          }}
                        >
                          <span className="font-bold" style={{ color: item.color }}>{item.level}</span>
                          <span className="text-sm" style={{ color: '#666666' }}>{item.range}</span>
                          {topikLevel.level === item.level && (
                            <span className="text-lg">👈 Bạn</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Score Structure */}
                  <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
                    <h3 className="text-lg font-bold mb-4" style={{ color: '#333333' }}>
                      📝 Cấu trúc điểm TOPIK II
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Headphones className="w-4 h-4" style={{ color: '#2196F3' }} />
                            <span className="font-medium" style={{ color: '#2196F3' }}>Listening</span>
                          </div>
                          <span className="text-sm" style={{ color: '#666666' }}>50 câu × 2 điểm = <b>100</b></span>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" style={{ color: '#4CAF50' }} />
                            <span className="font-medium" style={{ color: '#4CAF50' }}>Reading</span>
                          </div>
                          <span className="text-sm" style={{ color: '#666666' }}>50 câu × 2 điểm = <b>100</b></span>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#F3E5F5' }}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <PenTool className="w-4 h-4" style={{ color: '#9C27B0' }} />
                            <span className="font-medium" style={{ color: '#9C27B0' }}>Writing</span>
                          </div>
                          <span className="text-sm font-bold" style={{ color: '#9C27B0' }}>= 100</span>
                        </div>
                        <div className="text-xs space-y-1 pl-6" style={{ color: '#666666' }}>
                          <div>• Câu 51, 52: 10 + 10 = 20 điểm</div>
                          <div>• Câu 53: 30 điểm</div>
                          <div>• Câu 54: 50 điểm</div>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg font-bold text-center" style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}>
                        Tổng điểm: 300 điểm
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats - Câu sai */}
                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#333333' }}>
                    ❌ Câu trả lời sai ({result.totalQuestions - result.correctAnswers} câu)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.questions.filter(q => !q.isCorrect).map(q => (
                      <button
                        key={q.questionId}
                        onClick={() => {
                          setActiveTab(q.sectionType);
                          setExpandedQuestions(new Set([q.questionId]));
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition hover:scale-105"
                        style={{ backgroundColor: '#FFEBEE', color: '#FF5252', border: '1px solid #FF5252' }}
                      >
                        Câu {q.questionNumber}
                      </button>
                    ))}
                    {result.questions.filter(q => !q.isCorrect).length === 0 && (
                      <div className="text-sm" style={{ color: '#4CAF50' }}>
                        🎉 Chúc mừng! Bạn đã trả lời đúng tất cả câu hỏi!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Section Tab Content */}
            {activeTab !== 'overview' && (
              <div>
                {/* Section Header with controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold" style={{ color: getSectionColor(activeTab).text }}>
                      {getSectionIcon(activeTab)}
                      <span className="ml-2">{activeTab}</span>
                    </h3>
                    
                    {/* Filter: Chỉ hiện câu sai */}
                    <button
                      onClick={() => setShowOnlyWrong(!showOnlyWrong)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition"
                      style={{
                        backgroundColor: showOnlyWrong ? '#FFEBEE' : '#F5F5F5',
                        color: showOnlyWrong ? '#FF5252' : '#666666',
                        border: showOnlyWrong ? '1px solid #FF5252' : '1px solid #BDBDBD'
                      }}
                    >
                      {showOnlyWrong ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showOnlyWrong ? 'Đang lọc câu sai' : 'Chỉ xem câu sai'}
                    </button>
                  </div>
                  
                  {/* Expand/Collapse All */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => expandAllInSection(activeTab)}
                      className="px-3 py-1.5 rounded-lg text-sm transition"
                      style={{ backgroundColor: '#E3F2FD', color: '#2196F3' }}
                    >
                      Mở tất cả
                    </button>
                    <button
                      onClick={() => collapseAllInSection(activeTab)}
                      className="px-3 py-1.5 rounded-lg text-sm transition"
                      style={{ backgroundColor: '#F5F5F5', color: '#666666' }}
                    >
                      Thu gọn
                    </button>
                  </div>
                </div>

                {/* Question List */}
                <div className="space-y-3">
                  {getFilteredQuestions().map((question) => {
                    const isExpanded = expandedQuestions.has(question.questionId);
                    const isCorrect = getIsCorrect(question);
                    
                    return (
                      <div 
                        key={question.questionId}
                        className="rounded-lg overflow-hidden transition-all"
                        style={{
                          border: isCorrect ? '2px solid #4CAF50' : '2px solid #FF5252',
                          backgroundColor: isCorrect ? '#F1F8F4' : '#FFEBEE'
                        }}
                      >
                        {/* Question Header - Always visible, clickable */}
                        <div
                          className="p-4 cursor-pointer flex items-center justify-between hover:opacity-90 transition"
                          onClick={() => toggleQuestion(question.questionId)}
                        >
                          <div className="flex items-center gap-3">
                            {isCorrect ? (
                              <CheckCircle className="w-6 h-6" style={{ color: '#4CAF50' }} />
                            ) : (
                              <XCircle className="w-6 h-6" style={{ color: '#FF5252' }} />
                            )}
                            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: '#FFFFFF' }}>
                              Câu {question.questionNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#E3F2FD', color: '#2196F3' }}>
                              {question.questionType}
                            </span>
                            <span className="text-sm font-medium" style={{ color: isCorrect ? '#4CAF50' : '#FF5252' }}>
                              {question.score}/{question.maxScore} điểm
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!isExpanded && question.questionText && (
                              <span className="text-sm truncate max-w-xs" style={{ color: '#666666' }}>
                                {question.questionText.substring(0, 50)}...
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" style={{ color: '#666666' }} />
                            ) : (
                              <ChevronDown className="w-5 h-5" style={{ color: '#666666' }} />
                            )}
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: isCorrect ? '#4CAF50' : '#FF5252', backgroundColor: '#FFFFFF' }}>
                            {/* Question Text */}
                            <p className="mb-4 font-medium" style={{ color: '#333333' }}>
                              {question.questionText}
                            </p>
                            
                            {/* MCQ/SHORT Answer Display */}
                            {question.questionType !== 'ESSAY' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <div className="text-sm mb-1 font-medium" style={{ color: '#666666' }}>Câu trả lời của bạn:</div>
                                  <div 
                                    className="p-3 rounded-lg"
                                    style={{
                                      backgroundColor: question.userAnswer 
                                        ? (isCorrect ? '#E8F5E9' : '#FFEBEE')
                                        : '#F5F5F5',
                                      color: question.userAnswer
                                        ? (isCorrect ? '#4CAF50' : '#FF5252')
                                        : '#999999',
                                      fontWeight: 500
                                    }}
                                  >
                                    {renderAnswer(question.userAnswer)}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-sm mb-1 font-medium" style={{ color: '#666666' }}>Đáp án đúng:</div>
                                  <div className="p-3 rounded-lg font-medium" style={{ backgroundColor: '#E8F5E9', color: '#4CAF50' }}>
                                    {renderAnswer(question.correctAnswer)}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* AI Feedback for SHORT */}
                            {question.questionType === 'SHORT' && (question.aiFeedback || question.aiScore !== undefined) && (
                              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#F3E5F5', border: '1px solid #9C27B0' }}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Brain className="w-4 h-4" style={{ color: '#9C27B0' }} />
                                    <span className="text-sm font-semibold" style={{ color: '#9C27B0' }}>Chấm điểm AI</span>
                                  </div>
                                  {question.aiScore !== undefined && (
                                    <span className="px-2 py-1 rounded text-sm font-bold" style={{ backgroundColor: '#9C27B0', color: '#FFFFFF' }}>
                                      {question.aiScore}/100
                                    </span>
                                  )}
                                </div>
                                {question.aiFeedback && (
                                  <div className="text-sm" style={{ color: '#333333' }}>
                                    💬 {question.aiFeedback}
                                  </div>
                                )}
                                {question.aiSuggestions && question.aiSuggestions.length > 0 && (
                                  <div className="mt-2 text-sm" style={{ color: '#666666' }}>
                                    💡 {question.aiSuggestions[0]}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* ESSAY Display */}
                            {question.questionType === 'ESSAY' && (
                              <div className="space-y-4">
                                {/* User Answer */}
                                <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF8F0', border: '1px solid #BDBDBD' }}>
                                  <div className="text-sm font-semibold mb-2" style={{ color: '#666666' }}>
                                    📝 Bài làm của bạn ({question.userAnswer?.length || 0} ký tự):
                                  </div>
                                  <div className="p-3 rounded whitespace-pre-wrap text-sm" style={{ backgroundColor: '#FFFFFF', color: '#333333', maxHeight: '200px', overflowY: 'auto' }}>
                                    {question.userAnswer || '(Không có bài làm)'}
                                  </div>
                                </div>

                                {/* AI Grading Result */}
                                {question.aiScore !== undefined && question.aiScore !== null ? (
                                  <AIGradingResultCard question={question} />
                                ) : question.userAnswer && question.userAnswer !== '(Không trả lời)' ? (
                                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF3E0', border: '1px solid #FF9800' }}>
                                    <div className="flex items-center gap-2" style={{ color: '#FF9800' }}>
                                      <AlertCircle className="w-5 h-5" />
                                      <span>Chưa có kết quả chấm AI</span>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {getFilteredQuestions().length === 0 && showOnlyWrong && (
                    <div className="text-center py-8" style={{ color: '#4CAF50' }}>
                      🎉 Tuyệt vời! Bạn đã trả lời đúng tất cả câu hỏi trong phần này!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate('/learn/topik')}
            className="px-8 py-3 text-white rounded-lg transition font-semibold hover:opacity-90"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Làm đề khác
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 rounded-lg transition font-semibold hover:bg-gray-100"
            style={{ backgroundColor: '#FFFFFF', color: '#666666', border: '1px solid #BDBDBD' }}
          >
            In kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== Sub Components ====================

// Helper function: Render answer (handle images)
const renderAnswer = (answer: string | null | undefined) => {
  if (!answer) return '❌ Chưa trả lời';
  
  const isImageUrl = answer.startsWith('http') && 
    (answer.includes('cloudinary') || answer.match(/\.(jpg|jpeg|png|gif|webp)$/i));
  
  if (isImageUrl) {
    return (
      <img 
        src={answer} 
        alt="Answer" 
        className="max-w-full h-auto max-h-32 object-contain rounded"
      />
    );
  }
  return answer;
};

// AI Grading Result Card Component
const AIGradingResultCard = ({ question }: { question: QuestionResultResponse }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '2px solid #9C27B0' }}>
      {/* Header - Always visible */}
      <div 
        className="p-4 cursor-pointer"
        style={{ backgroundColor: '#F3E5F5' }}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6" style={{ color: '#9C27B0' }} />
            <span className="font-bold text-lg" style={{ color: '#9C27B0' }}>
              Kết quả chấm AI
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-3xl font-bold" style={{ color: '#9C27B0' }}>
                {question.aiScore}
              </span>
              <span className="text-lg" style={{ color: '#999999' }}>/100</span>
              <div className="text-xs" style={{ color: '#666666' }}>
                → {question.score}/{question.maxScore} điểm
              </div>
            </div>
            {showDetails ? (
              <ChevronUp className="w-5 h-5" style={{ color: '#9C27B0' }} />
            ) : (
              <ChevronDown className="w-5 h-5" style={{ color: '#9C27B0' }} />
            )}
          </div>
        </div>
      </div>
      
      {/* Details - Expandable */}
      {showDetails && (
        <div className="p-4 space-y-4" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Score Breakdown */}
          {question.aiBreakdown && (
            <div>
              <div className="text-sm font-semibold mb-3" style={{ color: '#666666' }}>
                📊 Chi tiết điểm:
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <ScoreBox label="Nội dung" score={question.aiBreakdown.content} max={40} />
                <ScoreBox label="Ngữ pháp" score={question.aiBreakdown.grammar} max={30} />
                <ScoreBox label="Từ vựng" score={question.aiBreakdown.vocabulary} max={20} />
                <ScoreBox label="Tổ chức" score={question.aiBreakdown.organization} max={10} />
              </div>
            </div>
          )}

          {/* Feedback */}
          {question.aiFeedback && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
              <div className="text-sm font-semibold mb-2" style={{ color: '#666666' }}>
                💬 Nhận xét:
              </div>
              <div style={{ color: '#333333' }} className="whitespace-pre-wrap text-sm">
                {question.aiFeedback}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {question.aiSuggestions && question.aiSuggestions.length > 0 && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF8E1' }}>
              <div className="text-sm font-semibold mb-2" style={{ color: '#F57C00' }}>
                💡 Gợi ý cải thiện:
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: '#333333' }}>
                {question.aiSuggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Score Box Component
const ScoreBox = ({ label, score, max }: { label: string; score: number; max: number }) => {
  const percentage = (score / max) * 100;
  const getColor = () => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#2196F3';
    if (percentage >= 40) return '#FF9800';
    return '#FF5252';
  };
  
  return (
    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-xs mb-1" style={{ color: '#666666' }}>{label}</div>
      <div className="text-xl font-bold" style={{ color: getColor() }}>
        {score}
        <span className="text-sm" style={{ color: '#999999' }}>/{max}</span>
      </div>
      <div className="w-full rounded-full h-1.5 mt-2" style={{ backgroundColor: '#E0E0E0' }}>
        <div className="h-1.5 rounded-full" style={{ backgroundColor: getColor(), width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default TopikExamResult;
