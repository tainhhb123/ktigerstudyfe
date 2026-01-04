// src/components/tables/AdminTables/LessonTable.tsx
import { useEffect, useState, useMemo, useCallback } from "react"; // Thêm useCallback
import axiosInstance from "../../../services/axiosConfig";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";
// import { useNavigate } from "react-router-dom";

interface Lesson {
  lessonId: number;
  lessonName: string;
  lessonDescription: string;
}

interface Paged<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;    // zero-based
  size: number;
}

export interface LessonTableProps {
  levelId: number;
  keyword: string;
  onViewDetail: (lessonId: number) => void;
}

// Hàm này có thể được đặt ở một file utility riêng nếu muốn tái sử dụng rộng rãi
const generatePageNumbers = (current: number, total: number): (number | string)[] => {
  const pagesArray: (number | string)[] = [];
  const maxPagesToShow = 5;

  if (total === 0) return [];

  if (total <= maxPagesToShow + 2) {
    for (let i = 0; i < total; i++) {
      pagesArray.push(i + 1);
    }
  } else {
    pagesArray.push(1);

    if (current > Math.floor(maxPagesToShow / 2) + 1) {
      pagesArray.push('...');
    }

    const startInnerPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
    const endInnerPage = Math.min(total - 2, current + Math.floor(maxPagesToShow / 2));

    for (let i = startInnerPage; i <= endInnerPage; i++) {
      pagesArray.push(i + 1);
    }

    if (current < total - Math.floor(maxPagesToShow / 2) - 2) {
      pagesArray.push('...');
    }

    if (total > 1 && !pagesArray.includes(total)) {
      pagesArray.push(total);
    }
  }

  const finalPages: (number | string)[] = [];
  pagesArray.forEach((p, idx) => {
    if (p === '...' && idx > 0 && finalPages[finalPages.length - 1] === '...') {
      // Skip duplicate '...'
    } else {
      finalPages.push(p);
    }
  });

  return finalPages.filter((p, i, arr) => !(p === '...' && (i === 0 || i === arr.length - 1 || arr[i-1] === '...' || arr[i+1] === '...')));
};


export default function LessonTable({ levelId, keyword, onViewDetail }: LessonTableProps) {
  const pageSize = 5;
  const [data, setData] = useState<Paged<Lesson>>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: pageSize,
  });
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ lessonName: string; lessonDescription: string }>({
    lessonName: "",
    lessonDescription: "",
  });

  // Fetch data helper - Using useCallback to memoize
  const fetchData = useCallback(() => {
    setLoading(true);
    const { number: page } = data; // Get current page from state
    axios
      .get<Paged<Lesson>>("/api/lessons/paged", {
        params: { page, size: pageSize, levelId, keyword: keyword.trim() || undefined },
      })
      .then((res) => setData(res.data))
      .catch((error) => { // Thêm log lỗi
        console.error("Error fetching lessons data:", error);
        setData({ content: [], totalElements: 0, totalPages: 1, number: 0, size: pageSize });
      })
      .finally(() => setLoading(false));
  }, [data.number, pageSize, levelId, keyword]); // Dependencies for useCallback

  // Reset page on levelId/keyword change
  useEffect(() => {
    setData((d) => ({ ...d, number: 0 }));
  }, [levelId, keyword]);

  // Fetch on page or filter change
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Depend on fetchData memoized function

  // Start inline edit
  const handleEditClick = (lesson: Lesson) => {
    setEditingId(lesson.lessonId);
    setEditValues({
      lessonName: lesson.lessonName,
      lessonDescription: lesson.lessonDescription,
    });
  };

  // Cancel inline edit
  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ lessonName: "", lessonDescription: "" }); // Reset edit values
  };

  // Handle field change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  // Submit inline update
  const handleUpdate = (id: number) => {
    if (!id) { // Thêm kiểm tra id
      console.error("Attempted to update with invalid Lesson ID:", id);
      return;
    }
    setLoading(true);
    axios
      .put(`/api/lessons/${id}`, {
        lessonName: editValues.lessonName,
        lessonDescription: editValues.lessonDescription,
      })
      .then(() => {
        setEditingId(null);
        fetchData(); // Re-fetch data to show updated values
      })
      .catch((error) => { // Thêm log lỗi
        console.error("Error updating lesson:", error);
        // Optionally show an error message to the user
      })
      .finally(() => setLoading(false));
  };

  const { content: lessons, totalElements, totalPages, number: currentPage } = data;

  const paginationPages = useMemo(() => generatePageNumbers(currentPage, totalPages), [currentPage, totalPages]);

  const goToPage = (idx: number) => setData((d) => ({ ...d, number: idx }));

  // Add console.log to debug
  const handleViewDetail = (lessonId: number) => {
    console.log('Clicked lesson ID:', lessonId);
    onViewDetail(lessonId);
  };

  return (
    <div className="rounded-lg bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10">
      {/* Header & Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-700"> {/* Adjusted dark mode border */}
        <span className="font-semibold text-gray-700 dark:text-gray-100"> {/* Adjusted dark mode text color */}
          Tổng số bài: {totalElements}
        </span>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <Button size="sm" variant="outline" disabled={currentPage === 0} onClick={() => goToPage(currentPage - 1)}>
            Trước
          </Button>
          {paginationPages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-500 dark:text-gray-400">…</span>
            ) : (
              <Button
                key={`page-${p}`} // Use page number as key for uniqueness
                size="sm"
                variant={p === currentPage + 1 ? "primary" : "outline"}
                onClick={() => goToPage((p as number) - 1)}
              >
                {p}
              </Button>
            )
          )}
          <Button size="sm" variant="outline" disabled={currentPage + 1 >= totalPages} onClick={() => goToPage(currentPage + 1)}>
            Sau
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-gray-50 border-b border-gray-200 dark:bg-zinc-700 dark:border-zinc-600"> {/* Adjusted dark mode header background/border */}
          <TableRow>
            <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-zinc-600 font-bold text-gray-700 dark:text-gray-100"> {/* Adjusted dark mode text/border */}
              Tên bài
            </TableCell>
            <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-zinc-600 font-bold text-gray-700 dark:text-gray-100"> {/* Adjusted dark mode text/border */}
              Mô tả
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-bold text-gray-700 dark:text-gray-100"> {/* Adjusted dark mode text */}
              Hành động
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow key="loading-lessons"> {/* Added a more specific key */}
              <td colSpan={3} className="py-6 text-center text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-zinc-700"> {/* Adjusted dark mode border/text */}
                Đang tải…
              </td>
            </TableRow>
          ) : lessons.length > 0 ? (
            lessons.map((l) => (
              <TableRow key={l.lessonId} className="border-b border-gray-200 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-700"> {/* Adjusted dark mode border/hover */}
                {/* Inline edit or static view */}
                <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-gray-200"> {/* Adjusted dark mode border/text */}
                  {editingId === l.lessonId ? (
                    <input
                      name="lessonName"
                      value={editValues.lessonName}
                      onChange={handleInputChange}
                      className="w-full border rounded shadow-sm focus:ring focus:border-blue-500
                                 bg-white text-gray-900
                                 dark:bg-zinc-700 dark:text-gray-100 dark:border-zinc-600" // Dark mode styles for input
                    />
                  ) : (
                    l.lessonName
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"> {/* Adjusted dark mode border/text */}
                  {editingId === l.lessonId ? (
                    <textarea
                      name="lessonDescription"
                      value={editValues.lessonDescription}
                      onChange={handleInputChange}
                      className="w-full border rounded shadow-sm focus:ring focus:border-blue-500 h-20 resize-y
                                 bg-white text-gray-900
                                 dark:bg-zinc-700 dark:text-gray-100 dark:border-zinc-600" // Dark mode styles for textarea
                    />
                  ) : (
                    l.lessonDescription
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-center space-x-2">
                  {editingId === l.lessonId ? (
                    <>
                      <Button size="sm" variant="primary" onClick={() => handleUpdate(l.lessonId)}>
                        Cập nhật
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(l)}>
                        Sửa
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewDetail(l.lessonId)}>
                        Xem chi tiết
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow key="no-lessons"> {/* Added a more specific key */}
              <td colSpan={3} className="py-6 text-center text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-zinc-700"> {/* Adjusted dark mode border/text */}
                Không có bài học
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}