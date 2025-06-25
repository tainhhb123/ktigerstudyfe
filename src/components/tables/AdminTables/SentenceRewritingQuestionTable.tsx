import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";
import { FaSearch } from "react-icons/fa";

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
}

export default function SentenceRewritingQuestionTable({ lessonId }: SentenceRewritingQuestionTableProps) {
  const [items, setItems] = useState<SentenceRewritingQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Omit<SentenceRewritingQuestion, "questionId" | "lessonId" | "exerciseId">>({
    originalSentence: "",
    rewrittenSentence: "",
    linkMedia: "",
  });

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
    // eslint-disable-next-line
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

  // Edit logic
  const handleEditClick = (q: SentenceRewritingQuestion) => {
    setEditingId(q.questionId);
    setEditValues({
      originalSentence: q.originalSentence,
      rewrittenSentence: q.rewrittenSentence,
      linkMedia: q.linkMedia || "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cập nhật: phải truyền exerciseId
  const handleUpdate = async (questionId: number) => {
    try {
      const current = items.find(item => item.questionId === questionId);
      await axios.put(`/api/sentence-rewriting/${questionId}`, {
        ...editValues,
        exerciseId: current?.exerciseId, // truyền đúng exerciseId
      });
      setEditingId(null);
      fetchQuestions();
    } catch {
      alert("Cập nhật thất bại");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({
      originalSentence: "",
      rewrittenSentence: "",
      linkMedia: "",
    });
  };

  const handleDelete = async (questionId: number, originalSentence: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa câu hỏi "${originalSentence}"?`)) {
      try {
        await axios.delete(`/api/sentence-rewriting/${questionId}`);
        fetchQuestions();
      } catch {
        alert("Xóa thất bại");
      }
    }
  };

  return (
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
            <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">Câu gốc</TableCell>
            <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">Câu viết lại</TableCell>
            <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">Media</TableCell>
            <TableCell isHeader className="font-bold text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-zinc-700">Thao tác</TableCell>
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
              <TableCell colSpan={4} className="text-center py-4 text-red-500 border border-gray-300 dark:border-zinc-700 dark:text-red-400">{error}</TableCell>
            </TableRow>
          ) : items.length > 0 ? (
            items.map((q) => (
              <TableRow key={q.questionId} className="border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-900">
                <TableCell className="border border-gray-300 dark:border-zinc-700 dark:text-gray-100">
                  {editingId === q.questionId ? (
                    <textarea
                      name="originalSentence"
                      value={editValues.originalSentence}
                      onChange={handleInputChange}
                      className="w-full border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-100"
                    />
                  ) : (
                    q.originalSentence
                  )}
                </TableCell>
                <TableCell className="border border-gray-300 dark:border-zinc-700 dark:text-gray-100">
                  {editingId === q.questionId ? (
                    <textarea
                      name="rewrittenSentence"
                      value={editValues.rewrittenSentence}
                      onChange={handleInputChange}
                      className="w-full border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-100"
                    />
                  ) : (
                    q.rewrittenSentence
                  )}
                </TableCell>
                <TableCell className="border border-gray-300 dark:border-zinc-700 dark:text-gray-100">
                  {editingId === q.questionId ? (
                    <input
                      name="linkMedia"
                      value={editValues.linkMedia}
                      onChange={handleInputChange}
                      className="w-full border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-100"
                    />
                  ) : (
                    q.linkMedia || "—"
                  )}
                </TableCell>
                <TableCell className="border border-gray-300 dark:border-zinc-700">
                  <div className="flex space-x-2 justify-center">
                    {editingId === q.questionId ? (
                      <>
                        <Button size="sm" variant="primary" onClick={() => handleUpdate(q.questionId)}>
                          Lưu
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEditClick(q)}>
                          Sửa
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(q.questionId, q.originalSentence)}>
                          Xóa
                        </Button>
                      </>
                    )}
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
  );
}