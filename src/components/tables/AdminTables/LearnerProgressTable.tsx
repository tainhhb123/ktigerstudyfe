// src/components/tables/AdminTables/StudentProgressTable.tsx
import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../../services/axiosConfig";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";

interface UserProgress {
  userId: number;
  avatarImage: string;
  fullName: string;
  joinDate: string;
  currentLevel: string;
  currentLesson: string;
}

interface Paged<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // zero-based
  size: number;
}

interface StudentProgressTableProps {
  keyword: string;
}

export default function StudentProgressTable({ keyword }: StudentProgressTableProps) {
  const pageSize = 10;
  const [data, setData] = useState<Paged<UserProgress>>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: pageSize,
  });
  const [loading, setLoading] = useState(false);

  // Reset page when keyword changes
  useEffect(() => {
    setData((d) => ({ ...d, number: 0 }));
  }, [keyword]);

  // Fetch paged data
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get<Paged<UserProgress>>(`/api/user-progress`, {
        params: {
          keyword,
          page: data.number,
          size: pageSize,
        },
      })
      .then((res) => setData(res.data))
      .catch(() =>
        setData({ content: [], totalElements: 0, totalPages: 1, number: 0, size: pageSize })
      )
      .finally(() => setLoading(false));
  }, [data.number, keyword]);

  const { content, totalElements, totalPages, number: currentPage } = data;

  // Client-side filter
  // Không cần filter phía client nữa vì đã filter ở backend
  const filtered = content;

  // Generate pagination with ellipsis
  const pages = useMemo<(number | string)[]>(() => {
    const result: (number | string)[] = [];
    const total = totalPages;
    const curr = currentPage + 1;
    const delta = 1;
    const left = Math.max(2, curr - delta);
    const right = Math.min(total - 1, curr + delta);
    result.push(1);
    if (left > 2) result.push("...");
    for (let i = left; i <= right; i++) result.push(i);
    if (right < total - 1) result.push("...");
    if (total > 1) result.push(total);
    return result;
  }, [currentPage, totalPages]);

  const goToPage = (idx: number) => setData((d) => ({ ...d, number: idx }));

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
      {/* Header & Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
        <span className="font-semibold" style={{ color: '#333333' }}>
          📊 Tổng số tiến trình học viên: <strong>{totalElements}</strong>
        </span>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <button
            className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
            disabled={currentPage === 0}
            onClick={() => goToPage(Math.max(0, currentPage - 1))}
          >
            Trước
          </button>
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2" style={{ color: '#999999' }}>…</span>
            ) : (
              <button
                key={idx}
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
            onClick={() => goToPage(Math.min(totalPages - 1, currentPage + 1))}
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
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Ảnh</th>
              <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Họ tên</th>
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Ngày tham gia</th>
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Cấp độ</th>
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Bài học hiện tại</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" 
                         style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                    <span style={{ color: '#666666' }}>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((u) => (
                <tr 
                  key={u.userId}
                  className="border-t transition-colors cursor-pointer"
                  style={{ borderColor: '#FFE8DC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="px-4 py-4 text-center">
                    <img
                      src={u.avatarImage}
                      alt={u.fullName}
                      className="h-10 w-10 rounded-full object-cover mx-auto border-2"
                      style={{ borderColor: '#FFE8DC' }}
                    />
                  </td>
                  <td className="px-4 py-4 font-semibold" style={{ color: '#333333' }}>
                    {u.fullName}
                  </td>
                  <td className="px-4 py-4 text-center" style={{ color: '#666666' }}>
                    {u.joinDate}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-sm font-medium" 
                          style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}>
                      {u.currentLevel}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center" style={{ color: '#666666' }}>
                    {u.currentLesson}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>Không có dữ liệu</h3>
                  <p style={{ color: '#666666' }}>Chưa có tiến trình học viên nào được ghi nhận</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
