import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../../services/axiosConfig";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";

export interface DocumentListResponse {
  listId: number;
  fullName: string;
  title: string;
  createdAt: string;
}

interface Paged<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // zero-based
  size: number;
}

interface DocumentListTableProps {
  keyword: string;
  selectedListId: number | null;
  onSelectList: (id: number | null) => void;
  onDeleteList: (id: number) => void;
  compact?: boolean; // hide header/pagination
}

export default function DocumentListTable({
  keyword,
  selectedListId,
  onSelectList,
  onDeleteList,
  compact = false,
}: DocumentListTableProps) {
  const pageSize = 5;
  const [data, setData] = useState<Paged<DocumentListResponse>>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: pageSize,
  });
  const [loading, setLoading] = useState(false);

  // Reset về page 0 khi đổi từ khóa tìm kiếm hoặc đổi tài liệu đang xem
  useEffect(() => {
    setData((d) => ({ ...d, number: 0 }));
  }, [keyword, selectedListId]);

  // Hàm fetch dữ liệu phân trang
  const fetchData = () => {
    setLoading(true);
    
    // Sử dụng API mới: chỉ có /public/paged (tìm kiếm tất cả tài liệu)
    const baseUrl = `/api/document-lists/public/paged`;
    
    axiosInstance
      .get<Paged<DocumentListResponse>>(baseUrl, {
        params: {
          keyword: keyword.trim(), // Tìm kiếm theo title hoặc tên tác giả
          page: data.number,
          size: pageSize,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Lỗi khi fetch dữ liệu:", err);
        // Hiển thị thông báo lỗi cho user
        alert("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!");
      })
      .finally(() => setLoading(false));
  };

  // Fetch khi thay đổi keyword hoặc page
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [keyword, data.number]);

  // Trigger refetch khi có thay đổi (sau khi xóa)
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [selectedListId]); // Refetch khi selectedListId thay đổi

  const { content, totalElements, totalPages, number: currentPage } = data;

  // Hiển thị 1 tài liệu nếu đang xem chi tiết, ngược lại hiển thị tất cả
  const lists = useMemo(
    () =>
      selectedListId != null
        ? content.filter((l) => l.listId === selectedListId)
        : content,
    [content, selectedListId]
  );

  // Pagination logic
  const pages = useMemo<(number | string)[]>(() => {
    const result: (number | string)[] = [];
    const curr = currentPage + 1;
    const delta = 1;
    const left = Math.max(2, curr - delta);
    const right = Math.min(totalPages - 1, curr + delta);

    result.push(1);
    if (left > 2) result.push("...");
    for (let i = left; i <= right; i++) result.push(i);
    if (right < totalPages - 1) result.push("...");
    if (totalPages > 1) result.push(totalPages);
    return result;
  }, [currentPage, totalPages]);

  const goToPage = (i: number) => setData((d) => ({ ...d, number: i }));

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
      {/* Header & pagination */}
      {!compact && (
        <div className="flex justify-between items-center p-4" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
          <span className="font-semibold" style={{ color: '#333333' }}>
            📚 Tổng số tài liệu: <strong>{totalElements}</strong>
            {keyword && (
              <span className="ml-2 text-sm" style={{ color: '#666666' }}>
                (Tìm kiếm: "{keyword}")
              </span>
            )}
          </span>
          {selectedListId == null && (
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
                style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
                disabled={currentPage === 0}
                onClick={() => goToPage(currentPage - 1)}
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
                onClick={() => goToPage(currentPage + 1)}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: '#FFE8DC' }}>
            <tr>
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Học viên</th>
              <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Tiêu đề</th>
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Ngày chia sẻ</th>
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Hành động</th>
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
            ) : lists.length > 0 ? (
              lists.map((l) => (
                <tr 
                  key={l.listId}
                  className="border-t transition-colors"
                  style={{ borderColor: '#FFE8DC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="px-4 py-4 text-center font-medium" style={{ color: '#333333' }}>
                    {l.fullName}
                  </td>
                  <td className="px-4 py-4 font-semibold" style={{ color: '#333333' }}>
                    {l.title}
                  </td>
                  <td className="px-4 py-4 text-center" style={{ color: '#666666' }}>
                    {new Date(l.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      {selectedListId === l.listId ? (
                        <button
                          onClick={() => onSelectList(null)}
                          className="px-3 py-1.5 rounded-lg font-medium transition-all"
                          style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BBDEFB'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E3F2FD'}
                        >
                          Đóng chi tiết
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectList(l.listId)}
                          className="px-3 py-1.5 rounded-lg font-medium transition-all"
                          style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFDCC8'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFE8DC'}
                        >
                          Chi tiết
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteList(l.listId)}
                        className="px-3 py-1.5 rounded-lg font-medium transition-all"
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
                <td colSpan={4} className="py-16 text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>
                    {keyword ? 'Không tìm thấy tài liệu' : 'Chưa có tài liệu nào'}
                  </h3>
                  <p style={{ color: '#666666' }}>
                    {keyword ? `Không tìm thấy tài liệu nào với từ khóa "${keyword}"` : 'Hãy thêm tài liệu mới'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
