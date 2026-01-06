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
    axiosInstance
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
    axiosInstance
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
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
      {/* Header & Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
        <span className="font-semibold" style={{ color: '#333333' }}>
          📚 Tổng số bài: <strong>{totalElements}</strong>
        </span>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <button 
            className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
            disabled={currentPage === 0} 
            onClick={() => goToPage(currentPage - 1)}
          >
            Trước
          </button>
          {paginationPages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2" style={{ color: '#999999' }}>…</span>
            ) : (
              <button
                key={`page-${p}`}
                className="px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: p === currentPage + 1 ? '#FF6B35' : '#FFFFFF',
                  color: p === currentPage + 1 ? '#FFFFFF' : '#FF6B35',
                  border: '1px solid #FF6B35'
                }}
                onClick={() => goToPage((p as number) - 1)}
              >
                {p}
              </button>
            )
          )}
          <button 
            className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
            disabled={currentPage + 1 >= totalPages} 
            onClick={() => goToPage(currentPage + 1)}
          >
            Sau
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: '#FFE8DC' }}>
            <tr>
              <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Tên bài</th>
              <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Mô tả</th>
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" 
                         style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                    <span style={{ color: '#666666' }}>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : lessons.length > 0 ? (
              lessons.map((l) => (
                <tr 
                  key={l.lessonId}
                  className="border-t transition-colors"
                  style={{ borderColor: '#FFE8DC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="px-4 py-4" style={{ color: '#333333' }}>
                    {editingId === l.lessonId ? (
                      <input
                        name="lessonName"
                        value={editValues.lessonName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none"
                        style={{ borderColor: '#FF6B35', backgroundColor: '#FFF8F0' }}
                      />
                    ) : (
                      <span className="font-semibold">{l.lessonName}</span>
                    )}
                  </td>
                  <td className="px-4 py-4" style={{ color: '#666666' }}>
                    {editingId === l.lessonId ? (
                      <textarea
                        name="lessonDescription"
                        value={editValues.lessonDescription}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none h-20 resize-y"
                        style={{ borderColor: '#FF6B35', backgroundColor: '#FFF8F0' }}
                      />
                    ) : (
                      l.lessonDescription
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      {editingId === l.lessonId ? (
                        <>
                          <button
                            onClick={() => handleUpdate(l.lessonId)}
                            className="px-3 py-1.5 rounded-lg font-medium transition-all"
                            style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C8E6C9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8F5E9'}
                          >
                            Cập nhật
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1.5 rounded-lg font-medium transition-all"
                            style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFCDD2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(l)}
                            className="px-3 py-1.5 rounded-lg font-medium transition-all"
                            style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFDCC8'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFE8DC'}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleViewDetail(l.lessonId)}
                            className="px-3 py-1.5 rounded-lg font-medium transition-all"
                            style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BBDEFB'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E3F2FD'}
                          >
                            Xem chi tiết
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-16 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>Không có bài học</h3>
                  <p style={{ color: '#666666' }}>Chưa có bài học nào trong cấp độ này</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}