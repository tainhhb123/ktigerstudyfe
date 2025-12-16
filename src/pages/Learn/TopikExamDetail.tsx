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
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải thông tin đề thi...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Lỗi tải dữ liệu
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/learn/topik')}
            className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
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
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại danh sách</span>
      </button>

      {/* Exam Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
              exam.examType === 'TOPIK_I'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
            }`}>
              {exam.examType === 'TOPIK_I' ? 'TOPIK I' : 'TOPIK II'}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {exam.title}
            </h1>
          </div>
          {exam.isActive && (
            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm font-medium">
              Đang mở
            </span>
          )}
        </div>

        {/* Exam Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <BookOpen className="w-8 h-8 text-brand-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số câu</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{exam.totalQuestion}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Clock className="w-8 h-8 text-brand-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Thời gian</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{exam.durationMinutes} phút</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <FileText className="w-8 h-8 text-brand-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Số phần thi</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {sections.length > 0 ? sections.length : (exam.examType === 'TOPIK_I' ? 2 : 3)}
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartExam}
          disabled={starting || !exam.isActive}
          className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition ${
            starting || !exam.isActive
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-brand-500 text-white hover:bg-brand-600'
          }`}
        >
          <Play className="w-6 h-6" />
          {starting ? 'Đang khởi tạo bài thi...' : 'Bắt đầu làm bài'}
        </button>
      </div>

      {/* Exam Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cấu trúc đề thi
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {exam.examType === 'TOPIK_I' ? '2 phần thi' : '3 phần thi'}
          </span>
        </div>
        
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.sectionId}
              className={`p-5 rounded-lg border-2 ${getSectionColor(section.sectionType)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <span className="text-4xl">{getSectionIcon(section.sectionType)}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Phần {index + 1}: {getSectionName(section.sectionType)}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  Thứ tự: {section.sectionOrder}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Lưu ý quan trọng
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
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
