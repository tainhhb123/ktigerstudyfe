import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Copy, Eye, FileText, CheckCircle, AlertCircle, Image, Volume2, Download } from 'lucide-react';
import { ExamSectionResponse, QuestionResponse, QuestionType } from '../../../types/exam';
import { examSectionApi, questionApi } from '../../../services/ExamApi';

const QuestionManager = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();

  const [section, setSection] = useState<ExamSectionResponse | null>(null);
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | QuestionType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [sectionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sectionData, questionsData] = await Promise.all([
        examSectionApi.getSectionById(Number(sectionId)),
        questionApi.getQuestionsBySection(Number(sectionId))
      ]);
      setSection(sectionData);
      setQuestions(questionsData.sort((a, b) => a.questionNumber - b.questionNumber));
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Không thể tải danh sách câu hỏi');
      navigate('/admin/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId: number, questionNumber: number) => {
    if (!confirm(`Bạn có chắc muốn xóa câu hỏi số ${questionNumber}?`)) {
      return;
    }

    try {
      setDeletingId(questionId);
      await questionApi.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q.questionId !== questionId));
      alert('Xóa câu hỏi thành công!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Không thể xóa câu hỏi');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (question: QuestionResponse) => {
    if (!confirm(`Nhân bản câu hỏi số ${question.questionNumber}?`)) return;

    try {
      const maxNumber = Math.max(...questions.map(q => q.questionNumber));
      const newQuestion = {
        ...question,
        questionNumber: maxNumber + 1,
        questionId: undefined // Let backend generate new ID
      };
      const created = await questionApi.createQuestion(newQuestion);
      setQuestions([...questions, created].sort((a, b) => a.questionNumber - b.questionNumber));
      alert('Nhân bản thành công!');
    } catch (error) {
      console.error('Error duplicating question:', error);
      alert('Không thể nhân bản câu hỏi');
    }
  };

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchType = filterType === 'ALL' || q.questionType === filterType;
    const matchSearch = q.questionText?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       q.questionNumber.toString().includes(searchTerm);
    return matchType && matchSearch;
  });

  // Group questions by groupId
  const questionGroups = new Map<number | null, QuestionResponse[]>();
  filteredQuestions.forEach(q => {
    const key = q.groupId || null;
    if (!questionGroups.has(key)) {
      questionGroups.set(key, []);
    }
    questionGroups.get(key)!.push(q);
  });

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'MCQ': return <CheckCircle className="w-4 h-4" />;
      case 'SHORT': return <FileText className="w-4 h-4" />;
      case 'ESSAY': return <FileText className="w-4 h-4" />;
    }
  };

  const getQuestionTypeColor = (type: QuestionType) => {
    switch (type) {
      case 'MCQ': return { bg: '#E3F2FD', text: '#1976D2' };
      case 'SHORT': return { bg: '#FFF3E0', text: '#E65100' };
      case 'ESSAY': return { bg: '#E8F5E9', text: '#2E7D32' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#666666' }}>Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/admin/exams/${section?.examId}/sections`)}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-all"
          style={{ color: '#666666', backgroundColor: '#FFFFFF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFE8DC'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại Sections
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#333333' }}>
              📝 Quản lý Câu hỏi
            </h1>
            <p className="text-lg" style={{ color: '#666666' }}>
              {section?.sectionType} Section • <span className="font-semibold">{questions.length}</span> câu hỏi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/admin/sections/${sectionId}/preview`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all"
              style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
              title="Preview như học viên"
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>
            <button
              onClick={() => navigate(`/admin/sections/${sectionId}/questions/create`)}
              className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#FF6B35' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E55A2B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
            >
              <Plus className="w-5 h-5" />
              Thêm câu hỏi
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <div className="text-sm mb-1" style={{ color: '#666666' }}>Tổng câu hỏi</div>
          <div className="text-2xl font-bold" style={{ color: '#333333' }}>{questions.length}</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#E3F2FD', border: '1px solid #90CAF9' }}>
          <div className="text-sm mb-1" style={{ color: '#1565C0' }}>MCQ</div>
          <div className="text-2xl font-bold" style={{ color: '#1976D2' }}>
            {questions.filter(q => q.questionType === 'MCQ').length}
          </div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFF3E0', border: '1px solid #FFB74D' }}>
          <div className="text-sm mb-1" style={{ color: '#E65100' }}>SHORT</div>
          <div className="text-2xl font-bold" style={{ color: '#E65100' }}>
            {questions.filter(q => q.questionType === 'SHORT').length}
          </div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#E8F5E9', border: '1px solid #81C784' }}>
          <div className="text-sm mb-1" style={{ color: '#2E7D32' }}>ESSAY</div>
          <div className="text-2xl font-bold" style={{ color: '#2E7D32' }}>
            {questions.filter(q => q.questionType === 'ESSAY').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 p-4 rounded-xl mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo số câu hoặc nội dung..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border-2"
          style={{ borderColor: '#BDBDBD', backgroundColor: '#FFF8F0' }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 rounded-lg border-2 font-medium"
          style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF' }}
        >
          <option value="ALL">Tất cả loại</option>
          <option value="MCQ">MCQ</option>
          <option value="SHORT">SHORT</option>
          <option value="ESSAY">ESSAY</option>
        </select>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-16 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>
            {searchTerm || filterType !== 'ALL' ? 'Không tìm thấy câu hỏi' : 'Chưa có câu hỏi nào'}
          </h3>
          <p className="mb-4" style={{ color: '#666666' }}>
            {searchTerm || filterType !== 'ALL' 
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm' 
              : 'Hãy tạo câu hỏi đầu tiên cho section này'}
          </p>
          {!searchTerm && filterType === 'ALL' && (
            <button
              onClick={() => navigate(`/admin/sections/${sectionId}/questions/create`)}
              className="px-6 py-3 text-white font-semibold rounded-lg transition-all"
              style={{ backgroundColor: '#FF6B35' }}
            >
              Tạo câu hỏi đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(questionGroups.entries()).map(([groupId, groupQuestions]) => (
            <div 
              key={groupId || 'single'} 
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}
            >
              {/* Group Header (if grouped) */}
              {groupId && (
                <div className="px-4 py-2 border-b" style={{ backgroundColor: '#FFE8DC', borderColor: '#BDBDBD' }}>
                  <span className="font-semibold" style={{ color: '#FF6B35' }}>
                    📚 Nhóm câu hỏi {groupId} • {groupQuestions.length} câu
                  </span>
                </div>
              )}

              {/* Questions Table */}
              <table className="w-full">
                <thead style={{ backgroundColor: '#FFF8F0' }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#666666' }}>Số</th>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#666666' }}>Loại</th>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#666666' }}>Nội dung</th>
                    <th className="px-4 py-3 text-center font-bold" style={{ color: '#666666' }}>Điểm</th>
                    <th className="px-4 py-3 text-center font-bold" style={{ color: '#666666' }}>Media</th>
                    <th className="px-4 py-3 text-center font-bold" style={{ color: '#666666' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {groupQuestions.map((question, index) => {
                    const typeColors = getQuestionTypeColor(question.questionType);
                    return (
                      <tr 
                        key={question.questionId}
                        className="border-t hover:bg-opacity-50 transition-colors"
                        style={{ borderColor: '#FFE8DC' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Question Number */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg" style={{ color: '#333333' }}>
                              {question.questionNumber}
                            </span>
                            {question.groupId && (
                              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}>
                                G{question.groupId}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Question Type */}
                        <td className="px-4 py-4">
                          <div 
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: typeColors.bg, color: typeColors.text }}
                          >
                            {getQuestionTypeIcon(question.questionType)}
                            {question.questionType}
                          </div>
                        </td>

                        {/* Question Text */}
                        <td className="px-4 py-4">
                          <div className="max-w-md">
                            <p className="font-medium line-clamp-2" style={{ color: '#333333' }}>
                              {question.questionText || '(Không có nội dung)'}
                            </p>
                            {question.passageText && (
                              <p className="text-sm mt-1 line-clamp-1" style={{ color: '#999999' }}>
                                📄 Có đoạn văn
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Points */}
                        <td className="px-4 py-4 text-center">
                          <span className="font-semibold" style={{ color: '#FF6B35' }}>
                            {question.points}
                          </span>
                        </td>

                        {/* Media Icons */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {question.imageUrl && (
                              <div className="p-1 rounded" style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }} title="Có hình ảnh">
                                <Image className="w-4 h-4" />
                              </div>
                            )}
                            {question.audioUrl && (
                              <div className="p-1 rounded" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }} title="Có audio">
                                <Volume2 className="w-4 h-4" />
                              </div>
                            )}
                            {!question.imageUrl && !question.audioUrl && (
                              <span style={{ color: '#BDBDBD' }}>—</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit */}
                            <button
                              onClick={() => navigate(`/admin/sections/${sectionId}/questions/${question.questionId}/edit`)}
                              className="p-2 rounded-lg transition-all"
                              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Duplicate */}
                            <button
                              onClick={() => handleDuplicate(question)}
                              className="p-2 rounded-lg transition-all"
                              style={{ backgroundColor: '#F3E5F5', color: '#7B1FA2' }}
                              title="Nhân bản"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(question.questionId, question.questionNumber)}
                              disabled={deletingId === question.questionId}
                              className="p-2 rounded-lg transition-all disabled:opacity-50"
                              style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                              title="Xóa"
                            >
                              {deletingId === question.questionId ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Bulk Actions Footer (if questions exist) */}
      {questions.length > 0 && (
        <div className="mt-6 p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <div style={{ color: '#666666' }}>
            Hiển thị <strong>{filteredQuestions.length}</strong> / <strong>{questions.length}</strong> câu hỏi
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
              style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
              title="Xuất Excel"
            >
              <Download className="w-4 h-4" />
              Xuất Excel
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
              title="Import từ file"
            >
              <Plus className="w-4 h-4" />
              Import
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManager;
