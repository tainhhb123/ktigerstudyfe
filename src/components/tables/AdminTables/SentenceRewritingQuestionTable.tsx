import { useEffect, useState, useMemo, Fragment } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";
import { FaSearch } from "react-icons/fa";
import AddSentenceRewritingModal from "../../modals/AddSentenceRewritingModal"; // Import modal

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
      const response = await axios.get(`/api/sentence-rewriting/lesson/${lessonId}/paged`, {
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
        await axios.delete(`/api/sentence-rewriting/${questionId}`);
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
      <div className="rounded-lg bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10 overflow-x-auto">
        {/* Thanh tìm kiếm */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent">
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPageNumber(0);
                }}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setPageNumber(0);
                  }}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                  aria-label="Xóa tìm kiếm"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Header: Tổng số, phân trang */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-2">
          <span className="font-semibold text-gray-700 dark:text-white">
            Tổng số câu hỏi: {totalElements}
          </span>
          
          {/* Nút Thêm câu hỏi */}
          <Button onClick={handleAddClick} variant="primary">
            Thêm câu hỏi
          </Button>

          <div className="flex items-center space-x-2 md:justify-end mt-2 md:mt-0">
            <Button size="sm" variant="outline" disabled={pageNumber === 0} onClick={() => setPageNumber(pageNumber - 1)}>
              Trước
            </Button>
            {paginationPages.map((p, index) =>
              p === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">…</span>
              ) : (
                <Button
                  key={p as number}
                  size="sm"
                  variant={p === pageNumber + 1 ? "primary" : "outline"}
                  onClick={() => setPageNumber((p as number) - 1)}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={pageNumber + 1 >= totalPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Sau
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-300 dark:bg-zinc-800 dark:border-zinc-700">
            <TableRow>
              <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">
                Câu gốc
              </TableCell>
              <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">
                Câu viết lại
              </TableCell>
              <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">
                Media
              </TableCell>
              <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 border border-gray-300 dark:border-zinc-700 dark:text-gray-200">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-red-500 border border-gray-300 dark:border-zinc-700 dark:text-red-400">
                  {error}
                </TableCell>
              </TableRow>
            ) : items.length > 0 ? (
              items.map((q) => (
                <TableRow key={q.questionId} className="border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-900">
                  {/* Câu gốc */}
                  <TableCell className="border border-gray-300 dark:border-zinc-700 p-2 text-gray-800 dark:text-white max-w-xs">
                    <div className="truncate" title={q.originalSentence}>
                      {q.originalSentence}
                    </div>
                  </TableCell>
                  
                  {/* Câu viết lại */}
                  <TableCell className="border border-gray-300 dark:border-zinc-700 p-2 text-gray-600 dark:text-gray-300 max-w-xs">
                    <div className="truncate" title={q.rewrittenSentence}>
                      {q.rewrittenSentence}
                    </div>
                  </TableCell>
                  
                  {/* Media Column */}
                  <TableCell className="border border-gray-300 dark:border-zinc-700 p-2 text-center">
                    {q.linkMedia ? (
                      <div className="flex justify-center">
                        {q.linkMedia.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                          <img
                            src={q.linkMedia}
                            alt="Question media"
                            className="w-12 h-12 object-cover rounded border cursor-pointer hover:opacity-80"
                            onClick={() => openImagePreview(q.linkMedia!)}
                          />
                        ) : q.linkMedia.match(/\.(mp3|wav|ogg)$/i) ? (
                          <div className="w-12 h-12 bg-blue-100 rounded border flex items-center justify-center">
                            🎵
                          </div>
                        ) : q.linkMedia.match(/\.(mp4|webm|mov)$/i) ? (
                          <div className="w-12 h-12 bg-purple-100 rounded border flex items-center justify-center">
                            🎬
                          </div>
                        ) : (
                          <a
                            href={q.linkMedia}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-blue-600 hover:text-blue-800"
                          >
                            📎
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  
                  {/* Actions */}
                  <TableCell className="border border-gray-300 dark:border-zinc-700 p-2 text-center">
                    <div className="flex justify-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(q)}
                        className="text-xs px-2 py-1"
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(q.questionId, q.originalSentence)}
                        className="text-xs px-2 py-1 text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-zinc-700">
                  Không có câu hỏi nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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