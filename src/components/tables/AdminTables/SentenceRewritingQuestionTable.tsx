import { useEffect, useState, useMemo, Fragment } from "react";
import axiosInstance from "../../../services/axiosConfig";
import { FaSearch } from "react-icons/fa";
import AddSentenceRewritingModal from "../../modals/AddSentenceRewritingModal";

interface SentenceRewritingQuestion {
  questionId: number;
  exerciseId: number;
  lessonId: number;
  originalSentence: string;
  rewrittenSentence: string;
  linkMedia?: string;
}

interface SentenceRewritingQuestionTableProps {
  lessonId: number;
  exerciseId?: number; // Thêm exerciseId prop
}

export default function SentenceRewritingQuestionTable({ lessonId, exerciseId = 1 }: SentenceRewritingQuestionTableProps) {
  const [items, setItems] = useState<SentenceRewritingQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // States cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<SentenceRewritingQuestion | null>(null);

  // States cho image preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch data from BE with search & pagination
  const fetchQuestions = async () => {
    if (!lessonId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/api/sentence-rewriting/lesson/${lessonId}/paged`, {
        params: {
          keyword: searchTerm,
          page: pageNumber,
          size: 5,
        },
      });
      setItems(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch {
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [lessonId, pageNumber, searchTerm]);

  // Pagination logic
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

  // Handle add click - mở modal để thêm mới
  const handleAddClick = () => {
    setSelectedQuestion(null);
    setIsModalOpen(true);
  };

  // Handle edit click - mở modal để sửa
  const handleEditClick = (question: SentenceRewritingQuestion) => {
    console.log("Edit question data:", question);
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (questionId: number, originalSentence: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa câu hỏi "${originalSentence}"?`)) {
      try {
        setLoading(true);
        await axiosInstance.delete(`/api/sentence-rewriting/${questionId}`);
        alert("Xóa câu hỏi thành công!");
        fetchQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
        alert("Xóa thất bại");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle modal success
  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
    fetchQuestions();
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  // Image preview handlers
  const openImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  return (
    <Fragment>
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
        {/* Thanh tìm kiếm */}
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

        {/* Header: Tổng số, phân trang */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-2" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
          <span className="font-semibold" style={{ color: '#333333' }}>
            ✏️ Tổng số câu hỏi: <strong>{totalElements}</strong>
          </span>
          
          {/* Nút Thêm câu hỏi */}
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
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              Trước
            </button>
            {paginationPages.map((p, index) =>
              p === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2" style={{ color: '#999999' }}>…</span>
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
              disabled={pageNumber + 1 >= totalPages}
              onClick={() => setPageNumber(pageNumber + 1)}
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
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '35%' }}>Câu gốc</th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '35%' }}>Câu viết lại</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35', width: '80px' }}>Media</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35', width: '120px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" 
                           style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                      <span style={{ color: '#666666' }}>Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="text-center py-12" style={{ color: '#C62828' }}>
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
                    {/* Câu gốc */}
                    <td className="px-4 py-4" style={{ color: '#333333', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <span className="block" title={q.originalSentence}>{q.originalSentence}</span>
                    </td>
                    
                    {/* Câu viết lại */}
                    <td className="px-4 py-4" style={{ color: '#666666', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <span className="block" title={q.rewrittenSentence}>{q.rewrittenSentence}</span>
                    </td>
                    
                    {/* Media Column */}
                    <td className="px-4 py-4 text-center">
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
                    <td className="px-4 py-4">
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
                          onClick={() => handleDelete(q.questionId, q.originalSentence)}
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
                  <td colSpan={4} className="text-center py-16">
                    <div className="text-6xl mb-4">✏️</div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>Không có câu hỏi</h3>
                    <p style={{ color: '#666666' }}>Chưa có câu hỏi viết lại câu nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa câu hỏi */}
      <AddSentenceRewritingModal
        lessonId={lessonId}
        exerciseId={exerciseId}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editData={selectedQuestion}
      />

      {/* Image Preview Modal */}
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