// src/components/tables/AdminTables/DocumentReportTable.tsx
import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../../services/axiosConfig";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";

interface DocumentReport {
  reportId: number;
  fullName: string;
  listTitle: string;
  listId: number;
  reason: string;
  reportDate: string;
}

interface Paged<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface DocumentReportTableProps {
  keyword?: string;
}

export default function DocumentReportTable({ keyword = "" }: DocumentReportTableProps) {
  const pageSize = 5;
  const [data, setData] = useState<Paged<DocumentReport>>({ content: [], totalElements: 0, totalPages: 1, number: 0, size: pageSize });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData((prev) => ({ ...prev, number: 0 }));
  }, [keyword]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get<Paged<DocumentReport>>(`/api/document-reports/paged?page=${data.number}&size=${pageSize}`)
      .then((res) => {
        console.log('API document-reports data:', res.data);
        setData(res.data);
      })
      .catch(() => setData({ content: [], totalElements: 0, totalPages: 1, number: 0, size: pageSize }))
      .finally(() => setLoading(false));
  }, [data.number]);

  const filteredReports = useMemo(
    () =>
      data.content.filter(
        (r) =>
          (r.fullName?.toLowerCase() ?? "").includes(keyword.toLowerCase()) ||
          (r.listTitle?.toLowerCase() ?? "").includes(keyword.toLowerCase())
      ),
    [data.content, keyword]
  );

  const { totalElements, totalPages, number: currentPage } = data;

  const pages = useMemo<(number | string)[]>(() => {
    const visible: (number | string)[] = [];
    const curr = currentPage + 1;
    const delta = 1;
    const left = Math.max(2, curr - delta);
    const right = Math.min(totalPages - 1, curr + delta);

    visible.push(1);
    if (left > 2) visible.push("...");
    for (let i = left; i <= right; i++) visible.push(i);
    if (right < totalPages - 1) visible.push("...");
    if (totalPages > 1) visible.push(totalPages);
    return visible;
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => setData((prev) => ({ ...prev, number: page }));

  const handleDelete = (id: number) => {
    if (!window.confirm("Xác nhận xóa báo cáo này?")) return;
    setLoading(true);
    axiosInstance.delete(`/api/document-reports/${id}`)
      .then(() => axiosInstance.get<Paged<DocumentReport>>(`/api/document-reports/paged?page=${currentPage}&size=${pageSize}`))
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
      {/* Header & Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
        <span className="font-semibold" style={{ color: '#333333' }}>
          ⚠️ Tổng số báo cáo: <strong>{totalElements}</strong>
        </span>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: '#FFE8DC' }}>
            <tr>
              <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Người báo cáo</th>
              <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Tài liệu</th>
              <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Lý do</th>
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Ngày báo cáo</th>
              <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" 
                         style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                    <span style={{ color: '#666666' }}>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((r) => (
                <tr 
                  key={r.reportId}
                  className="border-t transition-colors"
                  style={{ borderColor: '#FFE8DC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="px-4 py-4 font-medium" style={{ color: '#333333' }}>{r.fullName}</td>
                  <td className="px-4 py-4" style={{ color: '#333333' }}>{r.listTitle}</td>
                  <td className="px-4 py-4" style={{ color: '#666666' }}>{r.reason}</td>
                  <td className="px-4 py-4 text-center" style={{ color: '#666666' }}>
                    {new Date(r.reportDate).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleDelete(r.reportId)}
                      className="px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFCDD2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                    >
                      Xóa báo cáo
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>Không có báo cáo</h3>
                  <p style={{ color: '#666666' }}>Chưa có báo cáo vi phạm nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}