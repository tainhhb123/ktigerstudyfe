import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, BookOpen, Award, PlayCircle } from 'lucide-react';
import { examApi } from '../../services/ExamApi';
import { ExamResponse, ExamType } from '../../types/exam';

type TabType = ExamType | 'ALL';

interface InProgressExam {
  attemptId: string;
  examTitle: string;
  startedAt: string;
}

const TopikExamList = () => {
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [inProgressExam, setInProgressExam] = useState<InProgressExam | null>(null);

  useEffect(() => {
    fetchExams();
    checkInProgressExam();
  }, []);

  const checkInProgressExam = () => {
    const saved = localStorage.getItem('topik_in_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved) as InProgressExam;
        setInProgressExam(data);
      } catch (err) {
        console.error('Error parsing saved exam:', err);
        localStorage.removeItem('topik_in_progress');
      }
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await examApi.getActiveExams();
      setExams(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách đề thi');
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const getExamTypeLabel = (type: string) => {
    switch (type) {
      case 'TOPIK_I':
        return 'TOPIK I';
      case 'TOPIK_II':
        return 'TOPIK II';
      default:
        return type;
    }
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'TOPIK_I':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'TOPIK_II':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Filter exams based on active tab
  const filteredExams = activeTab === 'ALL' 
    ? exams 
    : exams.filter(exam => exam.examType === activeTab);

  const topikICount = exams.filter(e => e.examType === 'TOPIK_I').length;
  const topikIICount = exams.filter(e => e.examType === 'TOPIK_II').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full animate-spin mx-auto mb-4" style={{ border: '4px solid #FF6B35', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#666666' }}>Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFEBEE' }}>
            <FileText className="w-8 h-8" style={{ color: '#FF5252' }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#333333' }}>
            Lỗi tải dữ liệu
          </h3>
          <p className="mb-4" style={{ color: '#666666' }}>{error}</p>
          <button
            onClick={fetchExams}
            className="px-6 py-2 text-white rounded-lg transition"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFF8F0' }}>
            <FileText className="w-8 h-8" style={{ color: '#BDBDBD' }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#333333' }}>
            Chưa có đề thi
          </h3>
          <p style={{ color: '#666666' }}>
            Hiện tại chưa có đề thi TOPIK nào được mở. Vui lòng quay lại sau.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* In-Progress Exam Banner */}
      {inProgressExam && (
        <div 
          className="rounded-xl p-6 mb-6 flex items-center justify-between"
          style={{ 
            backgroundColor: '#FFF3E0', 
            border: '2px solid #FF6B35',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FFE8DC' }}
            >
              <PlayCircle className="w-8 h-8" style={{ color: '#FF6B35' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#FF6B35' }}>
                Bài thi đang làm dở
              </h3>
              <p className="text-sm" style={{ color: '#666666' }}>
                {inProgressExam.examTitle}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.removeItem('topik_in_progress');
                setInProgressExam(null);
              }}
              className="px-4 py-2 rounded-lg text-sm transition"
              style={{ 
                backgroundColor: '#FFFFFF',
                color: '#666666',
                border: '1px solid #BDBDBD'
              }}
            >
              Bỏ qua
            </button>
            <Link
              to={`/learn/topik/attempt/${inProgressExam.attemptId}`}
              className="px-6 py-2 rounded-lg text-white font-semibold text-sm transition hover:opacity-90"
              style={{ backgroundColor: '#FF6B35' }}
            >
              Tiếp tục làm bài
            </Link>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6" style={{ borderBottom: '1px solid #BDBDBD' }}>
        <div className="flex gap-2 -mb-px">
          <button
            onClick={() => setActiveTab('ALL')}
            className="px-6 py-3 font-medium text-sm transition-colors"
            style={{
              borderBottom: activeTab === 'ALL' ? '3px solid #FF6B35' : '3px solid transparent',
              color: activeTab === 'ALL' ? '#FF6B35' : '#666666'
            }}
          >
            Tất cả ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('TOPIK_I')}
            className="px-6 py-3 font-medium text-sm transition-colors"
            style={{
              borderBottom: activeTab === 'TOPIK_I' ? '3px solid #FF6B35' : '3px solid transparent',
              color: activeTab === 'TOPIK_I' ? '#FF6B35' : '#666666'
            }}
          >
            TOPIK I ({topikICount})
          </button>
          <button
            onClick={() => setActiveTab('TOPIK_II')}
            className="px-6 py-3 font-medium text-sm transition-colors"
            style={{
              borderBottom: activeTab === 'TOPIK_II' ? '3px solid #FF6B35' : '3px solid transparent',
              color: activeTab === 'TOPIK_II' ? '#FF6B35' : '#666666'
            }}
          >
            TOPIK II ({topikIICount})
          </button>
        </div>
      </div>

      {/* Exam List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.examId}
            className="rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}
          >
            <div className="p-6">
              {/* Exam Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: exam.examType === 'TOPIK_I' ? '#FFE8DC' : '#F3E8FF',
                    color: exam.examType === 'TOPIK_I' ? '#FF6B35' : '#9333EA'
                  }}
                >
                  {getExamTypeLabel(exam.examType)}
                </span>
                {exam.isActive && (
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#E8F5E9', color: '#4CAF50' }}>
                    Đang mở
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-4" style={{ color: '#333333' }}>
                {exam.title}
              </h3>

              {/* Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center" style={{ color: '#666666' }}>
                  <BookOpen className="w-5 h-5 mr-3" />
                  <span className="text-sm">{exam.totalQuestion} câu hỏi</span>
                </div>
                <div className="flex items-center" style={{ color: '#666666' }}>
                  <Clock className="w-5 h-5 mr-3" />
                  <span className="text-sm">{exam.durationMinutes} phút</span>
                </div>
                {exam.sections && exam.sections.length > 0 && (
                  <div className="flex items-center" style={{ color: '#666666' }}>
                    <FileText className="w-5 h-5 mr-3" />
                    <span className="text-sm">{exam.sections.length} phần thi</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Link
                to={`/learn/topik/exam/${exam.examId}`}
                className="block w-full py-3 text-white text-center rounded-lg font-medium transition"
                style={{ backgroundColor: '#FF6B35' }}
              >
                Bắt đầu thi
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-12 rounded-xl p-6" style={{ backgroundColor: '#FFF8F0', border: '1px solid #FF6B35' }}>
        <div className="flex items-start">
          <Award className="w-6 h-6 mr-3 mt-1 flex-shrink-0" style={{ color: '#FF6B35' }} />
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#333333' }}>
              Về kỳ thi TOPIK
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>
              TOPIK (Test of Proficiency in Korean) là kỳ thi đánh giá năng lực tiếng Hàn của người 
              nước ngoài. TOPIK I dành cho người mới bắt đầu, TOPIK II dành cho trình độ trung cấp và nâng cao.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopikExamList;
