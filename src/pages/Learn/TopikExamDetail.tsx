import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, FileText, AlertCircle, Play, ArrowLeft } from 'lucide-react';
import { examApi, examSectionApi, examAttemptApi } from '../../services/ExamApi';
import { ExamResponse, ExamSectionResponse, SectionType } from '../../types/exam';
import { authService } from '../../services/authService';

const TopikExamDetail = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<ExamResponse | null>(null);
  const [sections, setSections] = useState<ExamSectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (examId) {
      fetchExamDetails();
    }
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const [examData, sectionsData] = await Promise.all([
        examApi.getExamById(Number(examId)),
        examSectionApi.getSectionsByExam(Number(examId))
      ]);
      
      setExam(examData);
      setSections(sectionsData.sort((a, b) => a.sectionOrder - b.sectionOrder));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin đề thi');
      console.error('Error fetching exam details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async () => {
    const userId = authService.getUserId();
    if (!userId) {
      alert('Vui lòng đăng nhập để thi');
      navigate('/signin');
      return;
    }

    try {
      setStarting(true);
      const attempt = await examAttemptApi.startExam({
        examId: Number(examId),
        userId: userId
      });

      // Navigate to exam taking page với attemptId
      navigate(`/learn/topik/attempt/${attempt.attemptId}`);
    } catch (err: any) {
      alert(err.message || 'Không thể bắt đầu bài thi');
      console.error('Error starting exam:', err);
    } finally {
      setStarting(false);
    }
  };

  const getSectionIcon = (type: SectionType) => {
    switch (type) {
      case 'LISTENING':
        return '🎧';
      case 'READING':
        return '📖';
      case 'WRITING':
        return '✍️';
      default:
        return '📝';
    }
  };

  const getSectionName = (type: SectionType) => {
    switch (type) {
      case 'LISTENING':
        return 'Nghe hiểu';
      case 'READING':
        return 'Đọc hiểu';
      case 'WRITING':
        return 'Viết';
      default:
        return type;
    }
  };

  const getSectionColor = (type: SectionType) => {
    switch (type) {
      case 'LISTENING':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'READING':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'WRITING':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full animate-spin mx-auto mb-4" style={{ border: '4px solid #FF6B35', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#666666' }}>Đang tải thông tin đề thi...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#FF5252' }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#333333' }}>
            Lỗi tải dữ liệu
          </h3>
          <p className="mb-4" style={{ color: '#666666' }}>{error}</p>
          <button
            onClick={() => navigate('/learn/topik')}
            className="px-6 py-2 text-white rounded-lg transition"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/learn/topik')}
        className="flex items-center gap-2 mb-6 transition"
        style={{ color: '#666666' }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại danh sách</span>
      </button>

      {/* Exam Header */}
      <div className="rounded-xl p-8 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <span 
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
              style={{
                backgroundColor: exam.examType === 'TOPIK_I' ? '#FFE8DC' : '#F3E8FF',
                color: exam.examType === 'TOPIK_I' ? '#FF6B35' : '#9333EA'
              }}
            >
              {exam.examType === 'TOPIK_I' ? 'TOPIK I' : 'TOPIK II'}
            </span>
            <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
              {exam.title}
            </h1>
          </div>
          {exam.isActive && (
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#E8F5E9', color: '#4CAF50' }}>
              Đang mở
            </span>
          )}
        </div>

        {/* Exam Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
            <BookOpen className="w-8 h-8" style={{ color: '#FF6B35' }} />
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Tổng số câu</p>
              <p className="text-xl font-bold" style={{ color: '#333333' }}>{exam.totalQuestion}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
            <Clock className="w-8 h-8" style={{ color: '#FF6B35' }} />
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Thời gian</p>
              <p className="text-xl font-bold" style={{ color: '#333333' }}>{exam.durationMinutes} phút</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
            <FileText className="w-8 h-8" style={{ color: '#FF6B35' }} />
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Số phần thi</p>
              <p className="text-xl font-bold" style={{ color: '#333333' }}>
                {sections.length > 0 ? sections.length : (exam.examType === 'TOPIK_I' ? 2 : 3)}
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartExam}
          disabled={starting || !exam.isActive}
          className="w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition"
          style={{
            backgroundColor: starting || !exam.isActive ? '#E0E0E0' : '#FF6B35',
            color: starting || !exam.isActive ? '#999999' : '#FFFFFF',
            cursor: starting || !exam.isActive ? 'not-allowed' : 'pointer'
          }}
        >
          <Play className="w-6 h-6" />
          {starting ? 'Đang khởi tạo bài thi...' : 'Bắt đầu làm bài'}
        </button>
      </div>

      {/* Exam Sections */}
      <div className="rounded-xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#333333' }}>
            Cấu trúc đề thi
          </h2>
          <span className="text-sm" style={{ color: '#666666' }}>
            {exam.examType === 'TOPIK_I' ? '2 phần thi' : '3 phần thi'}
          </span>
        </div>
        
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.sectionId}
              className="p-5 rounded-lg"
              style={{
                backgroundColor: '#FFF8F0',
                border: '2px solid #FFE8DC'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <span className="text-4xl">{getSectionIcon(section.sectionType)}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#333333' }}>
                      Phần {index + 1}: {getSectionName(section.sectionType)}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#666666' }}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{section.totalQuestions} câu hỏi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{section.durationMinutes} phút</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#FFFFFF', color: '#333333', border: '1px solid #BDBDBD' }}>
                  Thứ tự: {section.sectionOrder}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 rounded-xl p-6" style={{ backgroundColor: '#FFF8F0', border: '1px solid #FF6B35' }}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#FF6B35' }} />
          <div>
            <h3 className="font-semibold mb-2" style={{ color: '#333333' }}>
              Lưu ý quan trọng
            </h3>
            <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: '#666666' }}>
              <li>
                {exam.examType === 'TOPIK_I' 
                  ? 'TOPIK I gồm 2 phần: Nghe hiểu (듣기) và Đọc hiểu (읽기)'
                  : 'TOPIK II gồm 3 phần: Nghe hiểu (듣기), Viết (쓰기) và Đọc hiểu (읽기)'
                }
              </li>
              <li>Bạn sẽ làm lần lượt từng phần thi theo thứ tự</li>
              <li>Mỗi phần có thời gian riêng, hết giờ sẽ tự động chuyển phần</li>
              <li>Không thể quay lại phần đã hoàn thành</li>
              <li>Đảm bảo kết nối internet ổn định trong suốt bài thi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopikExamDetail;
