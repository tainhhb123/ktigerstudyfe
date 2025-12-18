import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Copy, Eye, Power } from 'lucide-react';
import { ExamResponse, ExamType } from '../../../types/exam';
import { examApi } from '../../../services/ExamApi';

const ExamList = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | ExamType>('ALL');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await examApi.getAllExams();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
      alert('Không thể tải danh sách bài thi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId: number, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài thi "${title}"?\n\nThao tác này sẽ xóa tất cả sections và questions liên quan!`)) {
      return;
    }

    try {
      setDeletingId(examId);
      await examApi.deleteExam(examId);
      setExams(exams.filter(e => e.examId !== examId));
      alert('Xóa bài thi thành công!');
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Không thể xóa bài thi. Có thể bài thi đang được sử dụng.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (examId: number, currentStatus: boolean) => {
    try {
      await examApi.updateExam(examId, { isActive: !currentStatus });
      setExams(exams.map(e => 
        e.examId === examId ? { ...e, isActive: !currentStatus } : e
      ));
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const handleDuplicate = async (exam: ExamResponse) => {
    if (!confirm(`Nhân bản bài thi "${exam.title}"?`)) return;

    try {
      const newExam = {
        ...exam,
        title: `${exam.title} (Copy)`,
        isActive: false
      };
      const created = await examApi.createExam(newExam);
      setExams([created, ...exams]);
      alert('Nhân bản thành công! Bạn có thể chỉnh sửa bài thi mới.');
    } catch (error) {
      console.error('Error duplicating exam:', error);
      alert('Không thể nhân bản bài thi');
    }
  };

  // Filter exams
  const filteredExams = exams.filter(exam => {
    const matchSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'ALL' || exam.examType === filterType;
    return matchSearch && matchType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#666666' }}>Đang tải danh sách bài thi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#333333' }}>
              🎯 Quản lý Bài thi TOPIK
            </h1>
            <p style={{ color: '#666666' }}>
              Tổng số: <strong>{exams.length}</strong> bài thi | Đang hiển thị: <strong>{filteredExams.length}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/exams/create')}
            className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            style={{ backgroundColor: '#FF6B35' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E55A2B'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
          >
            <Plus className="w-5 h-5" />
            Tạo bài thi mới
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#999999' }} />
            <input
              type="text"
              placeholder="Tìm kiếm bài thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none"
              style={{ 
                borderColor: '#BDBDBD',
                backgroundColor: '#FFF8F0'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
              onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 rounded-lg border-2 font-medium focus:outline-none"
            style={{ 
              borderColor: '#BDBDBD',
              backgroundColor: '#FFFFFF',
              color: '#333333'
            }}
          >
            <option value="ALL">Tất cả loại</option>
            <option value="TOPIK_I">TOPIK I</option>
            <option value="TOPIK_II">TOPIK II</option>
          </select>
        </div>
      </div>

      {/* Exam List */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-16 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>
            {searchTerm || filterType !== 'ALL' ? 'Không tìm thấy bài thi' : 'Chưa có bài thi nào'}
          </h3>
          <p style={{ color: '#666666' }}>
            {searchTerm || filterType !== 'ALL' 
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm' 
              : 'Hãy tạo bài thi đầu tiên của bạn'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <table className="w-full">
            <thead style={{ backgroundColor: '#FFE8DC' }}>
              <tr>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>ID</th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Tiêu đề</th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Loại</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Số câu</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Thời gian</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Trạng thái</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam, index) => (
                <tr 
                  key={exam.examId}
                  className="border-t hover:bg-opacity-50 transition-colors"
                  style={{ borderColor: '#FFE8DC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="px-4 py-4 font-mono" style={{ color: '#666666' }}>
                    #{exam.examId}
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold" style={{ color: '#333333' }}>
                      {exam.title}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: exam.examType === 'TOPIK_I' ? '#E3F2FD' : '#FFE8DC',
                        color: exam.examType === 'TOPIK_I' ? '#1976D2' : '#FF6B35'
                      }}
                    >
                      {exam.examType === 'TOPIK_I' ? 'TOPIK I' : 'TOPIK II'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center font-semibold" style={{ color: '#333333' }}>
                    {exam.totalQuestion}
                  </td>
                  <td className="px-4 py-4 text-center" style={{ color: '#666666' }}>
                    {exam.durationMinutes} phút
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(exam.examId, exam.isActive)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all"
                      style={{
                        backgroundColor: exam.isActive ? '#E8F5E9' : '#FFEBEE',
                        color: exam.isActive ? '#2E7D32' : '#C62828'
                      }}
                    >
                      <Power className="w-4 h-4" />
                      {exam.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* View/Manage Sections */}
                      <button
                        onClick={() => navigate(`/admin/exams/${exam.examId}/sections`)}
                        className="p-2 rounded-lg transition-all"
                        style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                        title="Quản lý sections"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BBDEFB'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E3F2FD'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/admin/exams/${exam.examId}/edit`)}
                        className="p-2 rounded-lg transition-all"
                        style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                        title="Chỉnh sửa"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFDCC8'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFE8DC'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(exam)}
                        className="p-2 rounded-lg transition-all"
                        style={{ backgroundColor: '#F3E5F5', color: '#7B1FA2' }}
                        title="Nhân bản"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E1BEE7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F3E5F5'}
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(exam.examId, exam.title)}
                        disabled={deletingId === exam.examId}
                        className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                        title="Xóa"
                        onMouseEnter={(e) => !deletingId && (e.currentTarget.style.backgroundColor = '#FFCDD2')}
                        onMouseLeave={(e) => !deletingId && (e.currentTarget.style.backgroundColor = '#FFEBEE')}
                      >
                        {deletingId === exam.examId ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamList;
