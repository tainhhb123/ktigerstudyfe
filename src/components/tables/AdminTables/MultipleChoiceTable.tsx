import { useEffect, useState, useMemo, Fragment } from "react";
import axiosInstance from "../../../services/axiosConfig";
import { FaSearch } from 'react-icons/fa';
import AddMultipleChoiceModal from "../../modals/AddMultipleChoiceModal";

interface MultipleChoice {
  questionId: number;
  exerciseId: number;
  lessonId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  linkMedia?: string;
}

interface MultipleChoiceTableProps {
  lessonId: number;
  exerciseId: number;  // ✅ Bắt buộc, không có default value
}

export default function MultipleChoiceTable({ lessonId, exerciseId }: MultipleChoiceTableProps) {
  const [items, setItems] = useState<MultipleChoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // States cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<MultipleChoice | null>(null);

  // 🔍 Đơn giản hóa image preview states
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (!lessonId || !exerciseId) {
      console.warn("Missing lessonId or exerciseId");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // ✅ Có thể filter theo cả lessonId và exerciseId nếu API hỗ trợ
      const response = await axiosInstance.get(`/api/mcq/lesson/${lessonId}/paged`, {
        params: {
          searchTerm,
          page: pageNumber,
          size: 10,
          exerciseId: exerciseId  // ✅ Thêm exerciseId vào params nếu API hỗ trợ
        }
      });
      
      // ✅ Hoặc filter ở frontend nếu API chưa hỗ trợ
      let questions = response.data.content || [];
      if (exerciseId) {
        questions = questions.filter((q: MultipleChoice) => q.exerciseId === exerciseId);
      }
      
      setItems(questions);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [lessonId, exerciseId, pageNumber, searchTerm]);  // ✅ Thêm exerciseId vào dependency

  const paginationPages = useMemo(() => {
    const pages: (number | string)[] = [];
    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 ||
        i === totalPages - 1 ||
        (i >= pageNumber - 1 && i <= pageNumber + 1)
      ) {
        pages.push(i + 1);
      } else if (i === pageNumber - 2 || i === pageNumber + 2) {
        pages.push("...");
      }
    }
    return pages;
  }, [totalPages, pageNumber]);

  const handleAddClick = () => {
    setSelectedQuestion(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (question: MultipleChoice) => {
    console.log("Edit question data:", question);
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleDelete = async (questionId: number, questionText: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa câu hỏi "${questionText.substring(0, 50)}..."?`)) {
      try {
        setLoading(true);
        await axiosInstance.delete(`/api/mcq/${questionId}`);
        alert("Xóa câu hỏi thành công!");
        fetchQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Lỗi khi xóa câu hỏi!');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
    fetchQuestions();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  // 🔍 Đơn giản hóa image handlers
  const openImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  return (
    <Fragment>
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
        {/* Search Bar */}
        <div className="p-4" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-3" style={{ color: '#999999' }} />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPageNumber(0);
                }}
                className="w-full pl-10 pr-10 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setPageNumber(0);
                  }}
                  className="absolute right-3 text-xl font-bold transition-colors"
                  style={{ color: '#999999' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#999999'}
                  aria-label="Xóa tìm kiếm"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-2" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
          <span className="font-semibold" style={{ color: '#333333' }}>
            📝 Tổng số câu hỏi: <strong>{items.length}</strong>
          </span>
          
          <button
            onClick={handleAddClick}
            className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#FF6B35', color: '#FFFFFF' }}
          >
            + Thêm câu hỏi
          </button>

          <div className="flex items-center space-x-2 md:justify-end mt-2 md:mt-0">
            <button
              className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
              disabled={pageNumber === 0}
              onClick={() => setPageNumber(prev => prev - 1)}
            >
              Trước
            </button>
            {paginationPages.map((p, index) =>
              p === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2" style={{ color: '#999999' }}>
                  …
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  className="px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: (p as number) === pageNumber + 1 ? '#FF6B35' : '#FFFFFF',
                    color: (p as number) === pageNumber + 1 ? '#FFFFFF' : '#FF6B35',
                    border: '1px solid #FF6B35'
                  }}
                  onClick={() => setPageNumber((p as number) - 1)}
                >
                  {p}
                </button>
              )
            )}
            <button
              className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
              disabled={pageNumber >= totalPages - 1}
              onClick={() => setPageNumber(prev => prev + 1)}
            >
              Sau
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <thead style={{ backgroundColor: '#FFE8DC' }}>
              <tr>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '25%' }}>Câu hỏi</th>
                <th className="px-3 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '12%' }}>A</th>
                <th className="px-3 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '12%' }}>B</th>
                <th className="px-3 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '12%' }}>C</th>
                <th className="px-3 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '12%' }}>D</th>
                <th className="px-3 py-3 text-center font-bold" style={{ color: '#FF6B35', width: '60px' }}>Đúng</th>
                <th className="px-3 py-3 text-center font-bold" style={{ color: '#FF6B35', width: '60px' }}>Media</th>
                <th className="px-3 py-3 text-center font-bold" style={{ color: '#FF6B35', width: '110px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" 
                           style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                      <span style={{ color: '#666666' }}>Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="text-center py-12" style={{ color: '#C62828' }}>
                    <div className="text-4xl mb-2">⚠️</div>
                    {error}
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((q) => (
                  <tr
                    key={q.questionId}
                    className="border-t transition-colors"
                    style={{ borderColor: '#FFE8DC' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Câu hỏi */}
                    <td className="px-4 py-4" style={{ color: '#333333', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <span className="block line-clamp-2" title={q.questionText}>{q.questionText}</span>
                    </td>
                    
                    {/* Options A, B, C, D */}
                    <td className="px-3 py-4" style={{ color: '#666666', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <span className="block line-clamp-2" title={q.optionA}>{q.optionA}</span>
                    </td>
                    <td className="px-3 py-4" style={{ color: '#666666', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <span className="block line-clamp-2" title={q.optionB}>{q.optionB}</span>
                    </td>
                    <td className="px-3 py-4" style={{ color: '#666666', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <span className="block line-clamp-2" title={q.optionC}>{q.optionC}</span>
                    </td>
                    <td className="px-3 py-4" style={{ color: '#666666', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <span className="block line-clamp-2" title={q.optionD}>{q.optionD}</span>
                    </td>
                    
                    {/* Correct Answer */}
                    <td className="px-3 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                        {q.correctAnswer}
                      </span>
                    </td>
                    
                    {/* Media Column */}
                    <td className="px-3 py-4 text-center">
                      {q.linkMedia ? (
                        <div className="flex justify-center">
                          {q.linkMedia.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                            <img
                              src={q.linkMedia}
                              alt="Question media"
                              className="w-10 h-10 object-cover rounded cursor-pointer hover:opacity-80"
                              style={{ border: '1px solid #BDBDBD' }}
                              onClick={() => openImagePreview(q.linkMedia!)}
                            />
                          ) : q.linkMedia.match(/\.(mp3|wav|ogg)$/i) ? (
                            <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: '#E3F2FD' }}>
                              🎵
                            </div>
                          ) : q.linkMedia.match(/\.(mp4|webm|mov)$/i) ? (
                            <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: '#F3E5F5' }}>
                              🎬
                            </div>
                          ) : (
                            <a
                              href={q.linkMedia}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded flex items-center justify-center"
                              style={{ backgroundColor: '#FFF8F0', color: '#FF6B35' }}
                            >
                              📎
                            </a>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#999999' }}>—</span>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-3 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(q)}
                          className="px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
                          style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFDCC8'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFE8DC'}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(q.questionId, q.questionText)}
                          className="px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
                          style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFCDD2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>Không có câu hỏi</h3>
                    <p style={{ color: '#666666' }}>Chưa có câu hỏi trắc nghiệm nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa câu hỏi */}
      <AddMultipleChoiceModal
        lessonId={lessonId}
        exerciseId={exerciseId}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editData={selectedQuestion}
      />

      {/* 🔍 Image Preview Modal - kích thước cố định và bg trong suốt */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeImagePreview}
        >
          <div className="relative">
            <button
              onClick={closeImagePreview}
              className="absolute -top-8 right-0 text-gray-600 hover:text-gray-800 text-2xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
            >
              ×
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="w-96 h-96 object-contain rounded-lg shadow-xl bg-white border"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}