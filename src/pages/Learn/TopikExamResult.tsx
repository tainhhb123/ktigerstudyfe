import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Award, BarChart3, Home } from 'lucide-react';
import { examAttemptApi } from '../../services/ExamApi';

interface SectionResult {
  score: number;
  totalPoints: number;
  correctCount: number;
  totalCount: number;
  percentage: number;
}

interface QuestionResult {
  questionId: number;
  questionNumber: number;
  questionText: string;
  questionType: 'MCQ' | 'SHORT' | 'ESSAY';
  userAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean;  // Backend có thể trả "isCorrect"
  correct?: boolean;    // hoặc "correct" (do Jackson serialize)
  score: number;
  maxScore: number;
  sectionType: string;
}

interface ExamResult {
  attemptId: number;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  sectionResults: {
    LISTENING?: SectionResult;
    WRITING?: SectionResult;
    READING?: SectionResult;
  };
  questions: QuestionResult[];
}

const TopikExamResult = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>('all');

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const data = await examAttemptApi.getResult(Number(attemptId));
      console.log('📊 Exam Result Data:', data);
      console.log('📝 Questions:', data.questions);
      // Debug từng câu
      data.questions?.forEach((q: any) => {
        console.log(`Câu ${q.questionNumber}: score=${q.score}, maxScore=${q.maxScore}, isCorrect=${q.isCorrect}`);
      });
      setResult(data);
    } catch (err) {
      console.error('Error fetching result:', err);
      alert('Không thể tải kết quả bài thi');
    } finally {
      setLoading(false);
    }
  };

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

  // Helper: Lấy isCorrect từ backend (xử lý cả "isCorrect" và "correct")
  const getIsCorrect = (question: QuestionResult): boolean => {
    // Backend có thể trả "isCorrect" hoặc "correct" (do Jackson serialize)
    return question.isCorrect ?? (question as any).correct ?? false;
  };

  const sections = Object.entries(result.sectionResults);
  const filteredQuestions = selectedSection === 'all' 
    ? result.questions 
    : result.questions.filter(q => q.sectionType === selectedSection);

  const totalPossibleScore = sections.reduce((sum, [_, section]) => sum + section.totalPoints, 0);
  const passPercentage = (result.totalScore / totalPossibleScore) * 100;
  const isPassed = passPercentage >= 60; // TOPIK pass = 60%

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="rounded-xl p-8 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Award className="w-16 h-16" style={{ color: isPassed ? '#4CAF50' : '#FF6B35' }} />
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                  Kết quả bài thi
                </h1>
                <p className="mt-1" style={{ color: '#666666' }}>
                  Attempt ID: {attemptId}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/learn/topik')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg transition"
              style={{ backgroundColor: '#FFF8F0', color: '#666666', border: '1px solid #BDBDBD' }}
            >
              <Home className="w-5 h-5" />
              Quay lại
            </button>
          </div>

          {/* Overall Score */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-lg p-6" style={{ backgroundColor: '#FFE8DC', border: '2px solid #FF6B35' }}>
              <div className="text-sm mb-1" style={{ color: '#FF6B35' }}>Tổng điểm</div>
              <div className="text-4xl font-bold" style={{ color: '#FF6B35' }}>
                {result.totalScore.toFixed(1)}
                <span className="text-xl" style={{ color: '#999999' }}>/{totalPossibleScore}</span>
              </div>
            </div>
            
            <div className="rounded-lg p-6" style={{ backgroundColor: '#E8F5E9', border: '2px solid #4CAF50' }}>
              <div className="text-sm mb-1" style={{ color: '#4CAF50' }}>Đúng</div>
              <div className="text-4xl font-bold" style={{ color: '#4CAF50' }}>
                {result.correctAnswers}
                <span className="text-xl" style={{ color: '#999999' }}>/{result.totalQuestions}</span>
              </div>
            </div>
            
            <div className="rounded-lg p-6" style={{ backgroundColor: '#E3F2FD', border: '2px solid #2196F3' }}>
              <div className="text-sm mb-1" style={{ color: '#2196F3' }}>Tỷ lệ đúng</div>
              <div className="text-4xl font-bold" style={{ color: '#2196F3' }}>
                {((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)}%
              </div>
            </div>
            
            <div 
              className="rounded-lg p-6"
              style={{
                backgroundColor: isPassed ? '#E8F5E9' : '#FFF3E0',
                border: isPassed ? '2px solid #4CAF50' : '2px solid #FF6B35'
              }}
            >
              <div className="text-sm mb-1" style={{ color: isPassed ? '#4CAF50' : '#FF6B35' }}>
                Kết quả
              </div>
              <div className="text-3xl font-bold" style={{ color: isPassed ? '#4CAF50' : '#FF6B35' }}>
                {isPassed ? '✓ ĐẠT' : '✗ CHƯA ĐẠT'}
              </div>
            </div>
          </div>
        </div>

        {/* Section Scores */}
        <div className="rounded-xl p-8 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#333333' }}>
            <BarChart3 className="w-6 h-6" />
            Điểm theo phần thi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map(([sectionType, section]) => (
              <div key={sectionType} className="rounded-lg p-6" style={{ border: '1px solid #BDBDBD' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#333333' }}>{sectionType}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#666666' }}>Điểm:</span>
                    <span className="font-bold text-lg" style={{ color: '#FF6B35' }}>
                      {section.score.toFixed(1)} / {section.totalPoints}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#666666' }}>Đúng:</span>
                    <span className="font-semibold" style={{ color: '#333333' }}>{section.correctCount} / {section.totalCount}</span>
                  </div>
                  <div className="w-full rounded-full h-3" style={{ backgroundColor: '#E0E0E0' }}>
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ backgroundColor: '#FF6B35', width: `${section.percentage}%` }}
                    />
                  </div>
                  <div className="text-center text-sm font-semibold" style={{ color: '#FF6B35' }}>
                    {section.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Details */}
        <div className="rounded-xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#333333' }}>Chi tiết câu hỏi</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSection('all')}
                className="px-4 py-2 rounded-lg transition"
                style={{
                  backgroundColor: selectedSection === 'all' ? '#FF6B35' : '#FFF8F0',
                  color: selectedSection === 'all' ? '#FFFFFF' : '#666666',
                  border: selectedSection === 'all' ? 'none' : '1px solid #BDBDBD'
                }}
              >
                Tất cả
              </button>
              {sections.map(([sectionType]) => (
                <button
                  key={sectionType}
                  onClick={() => setSelectedSection(sectionType)}
                  className="px-4 py-2 rounded-lg transition"
                  style={{
                    backgroundColor: selectedSection === sectionType ? '#FF6B35' : '#FFF8F0',
                    color: selectedSection === sectionType ? '#FFFFFF' : '#666666',
                    border: selectedSection === sectionType ? 'none' : '1px solid #BDBDBD'
                  }}
                >
                  {sectionType}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div 
                key={question.questionId}
                className="rounded-lg p-6"
                style={{
                  border: getIsCorrect(question) ? '2px solid #4CAF50' : '2px solid #FF5252',
                  backgroundColor: getIsCorrect(question) ? '#F1F8F4' : '#FFEBEE'
                }}
              >
                <div className="flex items-start gap-4">
                  {getIsCorrect(question) ? (
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#4CAF50' }} />
                  ) : (
                    <XCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#FF5252' }} />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: '#FFF8F0', color: '#333333' }}>
                        Câu {question.questionNumber}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E3F2FD', color: '#2196F3' }}>
                        {question.questionType}
                      </span>
                      <span className="text-sm" style={{ color: '#666666' }}>
                        {question.score}/{question.maxScore} điểm
                      </span>
                    </div>
                    
                    <p className="mb-3 font-medium" style={{ color: '#333333' }}>
                      {question.questionText}
                    </p>
                    
                    {question.questionType !== 'ESSAY' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-sm mb-1" style={{ color: '#666666' }}>Câu trả lời của bạn:</div>
                          <div 
                            className="p-3 rounded-lg"
                            style={{
                              backgroundColor: getIsCorrect(question) ? '#E8F5E9' : '#FFEBEE',
                              color: getIsCorrect(question) ? '#4CAF50' : '#FF5252'
                            }}
                          >
                            {(() => {
                              const answer = question.userAnswer || '(Không trả lời)';
                              // Kiểm tra nếu là URL ảnh
                              const isImageUrl = answer.startsWith('http') && 
                                (answer.includes('cloudinary') || answer.match(/\.(jpg|jpeg|png|gif|webp)$/i));
                              
                              if (isImageUrl) {
                                return (
                                  <img 
                                    src={answer} 
                                    alt="User answer" 
                                    className="max-w-full h-auto max-h-32 object-contain rounded"
                                  />
                                );
                              }
                              return answer;
                            })()}
                          </div>
                        </div>
                        
                        {!getIsCorrect(question) && (
                          <div>
                            <div className="text-sm mb-1" style={{ color: '#666666' }}>Đáp án đúng:</div>
                            <div className="p-3 rounded-lg" style={{ backgroundColor: '#E8F5E9', color: '#4CAF50' }}>
                              {(() => {
                                const answer = question.correctAnswer;
                                // Kiểm tra nếu là URL ảnh
                                const isImageUrl = answer.startsWith('http') && 
                                  (answer.includes('cloudinary') || answer.match(/\.(jpg|jpeg|png|gif|webp)$/i));
                                
                                if (isImageUrl) {
                                  return (
                                    <img 
                                      src={answer} 
                                      alt="Correct answer" 
                                      className="max-w-full h-auto max-h-32 object-contain rounded"
                                    />
                                  );
                                }
                                return answer;
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {question.questionType === 'ESSAY' && (
                      <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#FFF8F0', border: '1px solid #FF6B35' }}>
                        <p className="text-sm" style={{ color: '#FF6B35' }}>
                          ⚠️ Câu luận cần chấm thủ công bởi giáo viên
                        </p>
                        <div className="mt-2 text-sm" style={{ color: '#333333' }}>
                          <strong>Câu trả lời của bạn:</strong>
                          <p className="mt-1 p-3 rounded" style={{ backgroundColor: '#FFFFFF' }}>{question.userAnswer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate('/learn/topik')}
            className="px-8 py-3 text-white rounded-lg transition font-semibold"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Làm đề khác
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 rounded-lg transition font-semibold"
            style={{ backgroundColor: '#FFF8F0', color: '#666666', border: '1px solid #BDBDBD' }}
          >
            In kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopikExamResult;
