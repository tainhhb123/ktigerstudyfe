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
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Không tìm thấy kết quả</p>
          <button
            onClick={() => navigate('/learn/topik')}
            className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Award className={`w-16 h-16 ${isPassed ? 'text-green-500' : 'text-orange-500'}`} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Kết quả bài thi
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Attempt ID: {attemptId}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/learn/topik')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <Home className="w-5 h-5" />
              Quay lại
            </button>
          </div>

          {/* Overall Score */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg p-6 border-2 border-brand-200 dark:border-brand-800">
              <div className="text-sm text-brand-600 dark:text-brand-400 mb-1">Tổng điểm</div>
              <div className="text-4xl font-bold text-brand-700 dark:text-brand-300">
                {result.totalScore.toFixed(1)}
                <span className="text-xl text-gray-500">/{totalPossibleScore}</span>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">Đúng</div>
              <div className="text-4xl font-bold text-green-700 dark:text-green-300">
                {result.correctAnswers}
                <span className="text-xl text-gray-500">/{result.totalQuestions}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Tỷ lệ đúng</div>
              <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                {((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className={`rounded-lg p-6 border-2 ${
              isPassed 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            }`}>
              <div className={`text-sm mb-1 ${isPassed ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                Kết quả
              </div>
              <div className={`text-3xl font-bold ${isPassed ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                {isPassed ? '✓ ĐẠT' : '✗ CHƯA ĐẠT'}
              </div>
            </div>
          </div>
        </div>

        {/* Section Scores */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Điểm theo phần thi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map(([sectionType, section]) => (
              <div key={sectionType} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{sectionType}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Điểm:</span>
                    <span className="font-bold text-lg text-brand-600 dark:text-brand-400">
                      {section.score.toFixed(1)} / {section.totalPoints}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Đúng:</span>
                    <span className="font-semibold">{section.correctCount} / {section.totalCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-brand-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${section.percentage}%` }}
                    />
                  </div>
                  <div className="text-center text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {section.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết câu hỏi</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSection('all')}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedSection === 'all'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Tất cả
              </button>
              {sections.map(([sectionType]) => (
                <button
                  key={sectionType}
                  onClick={() => setSelectedSection(sectionType)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedSection === sectionType
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
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
                className={`border-2 rounded-lg p-6 ${
                  getIsCorrect(question) 
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' 
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  {getIsCorrect(question) ? (
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold">
                        Câu {question.questionNumber}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                        {question.questionType}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {question.score}/{question.maxScore} điểm
                      </span>
                    </div>
                    
                    <p className="text-gray-900 dark:text-white mb-3 font-medium">
                      {question.questionText}
                    </p>
                    
                    {question.questionType !== 'ESSAY' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Câu trả lời của bạn:</div>
                          <div className={`p-3 rounded-lg ${
                            getIsCorrect(question) 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
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
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đáp án đúng:</div>
                            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
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
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          ⚠️ Câu luận cần chấm thủ công bởi giáo viên
                        </p>
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <strong>Câu trả lời của bạn:</strong>
                          <p className="mt-1 p-3 bg-white dark:bg-gray-800 rounded">{question.userAnswer}</p>
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
            className="px-8 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition font-semibold"
          >
            Làm đề khác
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-semibold"
          >
            In kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopikExamResult;
