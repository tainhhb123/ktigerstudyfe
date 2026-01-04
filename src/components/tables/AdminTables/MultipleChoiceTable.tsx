import { useEffect, useState, useMemo, Fragment } from "react";
import axiosInstance from "../../../services/axiosConfig";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";
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
      <div className="rounded-lg bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10 overflow-x-auto">
        {/* Search Bar */}
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
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100"
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

        {/* Pagination Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-2">
          <span className="font-semibold text-gray-700 dark:text-white">
            Tổng số câu hỏi: {items.length}
          </span>
          
          <Button onClick={handleAddClick} variant="primary">
            Thêm câu hỏi
          </Button>

          <div className="flex items-center space-x-2 md:justify-end mt-2 md:mt-0">
            <Button 
              size="sm" 
              variant="outline" 
              disabled={pageNumber === 0} 
              onClick={() => setPageNumber(prev => prev - 1)}
            >
              Trước
            </Button>
            {paginationPages.map((p, index) =>
              p === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">
                  …
                </span>
              ) : (
                <Button
                  key={`page-${p}`}
                  size="sm"
                  variant={(p as number) === pageNumber + 1 ? "primary" : "outline"}
                  onClick={() => setPageNumber((p as number) - 1)}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={pageNumber >= totalPages - 1}
              onClick={() => setPageNumber(prev => prev + 1)}
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
                Câu hỏi
              </TableCell>
              <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">
                A
              </TableCell>
              <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">
                B
              </TableCell>
              <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">
                C
              </TableCell>
              <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">
                D
              </TableCell>
              <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">
                Đúng
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
                <TableCell colSpan={8} className="text-center py-4 border border-gray-300 dark:border-zinc-700 dark:text-gray-200">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-red-500 border border-gray-300 dark:border-zinc-700 dark:text-red-400">
                  {error}
                </TableCell>
              </TableRow>
            ) : items.length > 0 ? (
              items.map((q) => (
                <TableRow key={q.questionId} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/10">
                  {/* Câu hỏi */}
                  <TableCell className="border border-gray-300 dark:border-zinc-700 p-2 text-gray-800 dark:text-white max-w-xs">
                    <div className="truncate" title={q.questionText}>
                      {q.questionText}
                    </div>
                  </TableCell>
                  
                  {/* Options A, B, C, D */}
                  <TableCell className="border border-gray-300 dark:border-zinc-700 p-2 text-gray-600 dark:text-gray-300 max-w-xs">
                    <div className="truncate" title={q.optionA}>
                      {q.optionA}
                    </div>
                  </TableCell>
                  <TableCell className="border border-gray-300 dark:border-zinc-700 p-2 text-gray-600 dark:text-gray-300 max-w-xs">
                    <div className="truncate" title={q.optionB}>
                      {q.optionB}
                    </div>
                  </TableCell>
                  <TableCell className="border border-gray-300 dark:border-zinc-700 p-2 text-gray-600 dark:text-gray-300 max-w-xs">
                    <div className="truncate" title={q.optionC}>
                      {q.optionC}
                    </div>
                  </TableCell>
                  <TableCell className="border border-gray-300 dark:border-zinc-700 p-2 text-gray-600 dark:text-gray-300 max-w-xs">
                    <div className="truncate" title={q.optionD}>
                      {q.optionD}
                    </div>
                  </TableCell>
                  
                  {/* Correct Answer */}
                  <TableCell className="border border-gray-300 dark:border-zinc-700 p-2 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {q.correctAnswer}
                    </span>
                  </TableCell>
                  
                  {/* 🔍 Media Column - đơn giản hóa */}
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
                        onClick={() => handleDelete(q.questionId, q.questionText)}
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
                <TableCell colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-zinc-700">
                  Không có câu hỏi nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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