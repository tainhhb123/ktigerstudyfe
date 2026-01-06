import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../../services/axiosConfig";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";
import { FaSearch } from "react-icons/fa";

interface Exercise {
  exerciseId: number;
  lessonId: number;
  exerciseTitle: string;
  exerciseType: string;
  exerciseDescription?: string;
}

interface ExerciseTableProps {
  lessonId: number;
  onViewDetail?: (exercise: Exercise) => void; // Optional: callback khi bấm xem chi tiết
}

export default function ExerciseTable({ lessonId, onViewDetail }: ExerciseTableProps) {
  const [items, setItems] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({
    exerciseTitle: "",
    exerciseType: "",
    exerciseDescription: ""
  });

  const fetchExercises = async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/exercises/lesson/${lessonId}/paged`, {
        params: {
          title: searchTerm,
          page: pageNumber,
          size: 10
        }
      });
      setItems(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch {
      setError("Không thể tải dữ liệu bài tập");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line
  }, [lessonId, pageNumber, searchTerm]);

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

  const handleEditClick = (exercise: Exercise) => {
    setEditingId(exercise.exerciseId);
    setEditValues({
      exerciseTitle: exercise.exerciseTitle,
      exerciseType: exercise.exerciseType,
      exerciseDescription: exercise.exerciseDescription || ""
    });
  };

  const handleUpdate = async (exerciseId: number) => {
    try {
      await axiosInstance.put(`/api/exercises/${exerciseId}`, {
        ...editValues,
        lessonId
      });
      setEditingId(null);
      fetchExercises();
    } catch {
      alert("Cập nhật thất bại");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({
      exerciseTitle: "",
      exerciseType: "",
      exerciseDescription: ""
    });
  };

  const handleDelete = async (exerciseId: number, exerciseTitle: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài tập "${exerciseTitle}"?`)) {
      try {
        await axiosInstance.delete(`/api/exercises/${exerciseId}`);
        fetchExercises();
      } catch {
        alert("Xóa thất bại");
      }
    }
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
      {/* Search Bar */}
      <div className="p-4" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
        <div className="relative w-full max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3" style={{ color: '#999999' }} />
            <input
              type="text"
              placeholder="Tìm kiếm tiêu đề bài tập..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageNumber(0);
              }}
              className="w-full pl-10 pr-10 py-2 rounded-lg border-2 focus:outline-none"
              style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF' }}
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
          📝 Tổng số bài tập: <strong>{items.length}</strong>
        </span>
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
            disabled={pageNumber >= totalPages - 1}
            onClick={() => setPageNumber(prev => prev + 1)}
          >
            Sau
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: '#FFE8DC' }}>
            <tr>
              <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Tiêu đề</th>
              <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Loại</th>
              <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Mô tả</th>
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={4} className="text-center py-12" style={{ color: '#C62828' }}>
                  <div className="text-4xl mb-2">⚠️</div>
                  {error}
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" 
                         style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                    <span style={{ color: '#666666' }}>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((exercise) => (
                <tr 
                  key={exercise.exerciseId}
                  className="border-t transition-colors"
                  style={{ borderColor: '#FFE8DC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="px-4 py-4" style={{ color: '#333333' }}>
                    {editingId === exercise.exerciseId ? (
                      <input
                        type="text"
                        name="exerciseTitle"
                        value={editValues.exerciseTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none"
                        style={{ borderColor: '#FF6B35', backgroundColor: '#FFF8F0' }}
                      />
                    ) : (
                      <span className="font-semibold">{exercise.exerciseTitle}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {editingId === exercise.exerciseId ? (
                      <select
                        name="exerciseType"
                        value={editValues.exerciseType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none"
                        style={{ borderColor: '#FF6B35', backgroundColor: '#FFF8F0' }}
                      >
                        <option value="multiple_choice">Trắc nghiệm</option>
                        <option value="fill_blank">Điền từ</option>
                        <option value="sentence_rewriting">Viết lại câu</option>
                      </select>
                    ) : (
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: exercise.exerciseType === 'multiple_choice' ? '#E3F2FD' : 
                                          exercise.exerciseType === 'fill_blank' ? '#F3E5F5' : '#FFE8DC',
                          color: exercise.exerciseType === 'multiple_choice' ? '#1976D2' : 
                                exercise.exerciseType === 'fill_blank' ? '#7B1FA2' : '#FF6B35'
                        }}
                      >
                        {exercise.exerciseType === "multiple_choice"
                          ? "Trắc nghiệm"
                          : exercise.exerciseType === "fill_blank"
                          ? "Điền từ"
                          : exercise.exerciseType === "sentence_rewriting"
                          ? "Viết lại câu"
                          : exercise.exerciseType}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4" style={{ color: '#666666' }}>
                    {editingId === exercise.exerciseId ? (
                      <textarea
                        name="exerciseDescription"
                        value={editValues.exerciseDescription}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none resize-y"
                        style={{ borderColor: '#FF6B35', backgroundColor: '#FFF8F0' }}
                      />
                    ) : (
                      exercise.exerciseDescription || "—"
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      {editingId === exercise.exerciseId ? (
                        <>
                          <button
                            onClick={() => handleUpdate(exercise.exerciseId)}
                            className="px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
                            style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C8E6C9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8F5E9'}
                          >
                            Cập nhật
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
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
                            onClick={() => handleEditClick(exercise)}
                            className="px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
                            style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFDCC8'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFE8DC'}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(exercise.exerciseId, exercise.exerciseTitle)}
                            className="px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
                            style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFCDD2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                          >
                            Xóa
                          </button>
                          {onViewDetail && (
                            <button
                              onClick={() => onViewDetail(exercise)}
                              className="px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
                              style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BBDEFB'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E3F2FD'}
                            >
                              Xem chi tiết
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>Không có dữ liệu</h3>
                  <p style={{ color: '#666666' }}>Chưa có bài tập nào trong bài học này</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}