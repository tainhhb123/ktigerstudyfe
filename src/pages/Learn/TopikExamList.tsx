import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, BookOpen, Award } from 'lucide-react';
import { examApi } from '../../services/ExamApi';
import { ExamResponse, ExamType } from '../../types/exam';

type TabType = ExamType | 'ALL';

const TopikExamList = () => {
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('ALL');

  useEffect(() => {
    fetchExams();
  }, []);

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
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Lỗi tải dữ liệu
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchExams}
            className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
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
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Chưa có đề thi
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Hiện tại chưa có đề thi TOPIK nào được mở. Vui lòng quay lại sau.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">


      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 -mb-px">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'ALL'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Tất cả ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('TOPIK_I')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'TOPIK_I'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            TOPIK I ({topikICount})
          </button>
          <button
            onClick={() => setActiveTab('TOPIK_II')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'TOPIK_II'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
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
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              {/* Exam Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getExamTypeColor(
                    exam.examType
                  )}`}
                >
                  {getExamTypeLabel(exam.examType)}
                </span>
                {exam.isActive && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded text-xs font-medium">
                    Đang mở
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {exam.title}
              </h3>

              {/* Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <BookOpen className="w-5 h-5 mr-3" />
                  <span className="text-sm">{exam.totalQuestion} câu hỏi</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="w-5 h-5 mr-3" />
                  <span className="text-sm">{exam.durationMinutes} phút</span>
                </div>
                {exam.sections && exam.sections.length > 0 && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FileText className="w-5 h-5 mr-3" />
                    <span className="text-sm">{exam.sections.length} phần thi</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Link
                to={`/learn/topik/exam/${exam.examId}`}
                className="block w-full py-3 bg-brand-500 text-white text-center rounded-lg font-medium hover:bg-brand-600 transition"
              >
                Bắt đầu thi
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Về kỳ thi TOPIK
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
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
