// src/components/tables/AdminTables/DocumentReportTable.tsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";

interface DocumentReport {
  reportId: number;
  userName: string;
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
    axios
      .get<Paged<DocumentReport>>(`/api/document-reports/paged?page=${data.number}&size=${pageSize}`)
      .then((res) => setData(res.data))
      .catch(() => setData({ content: [], totalElements: 0, totalPages: 1, number: 0, size: pageSize }))
      .finally(() => setLoading(false));
  }, [data.number]);

  const filteredReports = useMemo(
    () => data.content.filter(
      (r) =>
        r.userName.toLowerCase().includes(keyword.toLowerCase()) ||
        r.listTitle.toLowerCase().includes(keyword.toLowerCase())
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
    axios.delete(`/api/document-reports/${id}`)
      .then(() => axios.get<Paged<DocumentReport>>(`/api/document-reports/paged?page=${currentPage}&size=${pageSize}`))
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700">
      {/* Header & Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Tổng số báo cáo: {totalElements}</span>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            disabled={currentPage === 0}
            onClick={() => goToPage(currentPage - 1)}
          >
            Trước
          </button>
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2 text-gray-500 dark:text-gray-400">…</span>
            ) : (
              <button
                key={idx}
                className={`px-2 py-1 rounded ${p === currentPage + 1 ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 border'}`}
                onClick={() => goToPage((p as number) - 1)}
              >
                {p}
              </button>
            )
          )}
          <button
            className="px-2 py-1 border rounded disabled:opacity-50 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            disabled={currentPage + 1 >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Sau
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-600 font-bold text-gray-700 dark:text-gray-200">Người báo cáo</TableCell>
              <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-600 font-bold text-gray-700 dark:text-gray-200">Tài liệu</TableCell>
              <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-600 font-bold text-gray-700 dark:text-gray-200">Lý do</TableCell>
              <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-600 font-bold text-gray-700 dark:text-gray-200">Ngày báo cáo</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-700 dark:text-gray-200">Hành động</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <td colSpan={6} className="py-6 text-center text-gray-500 dark:text-gray-400">Đang tải…</td>
              </TableRow>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((r) => (
                <TableRow key={r.reportId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">{r.userName}</TableCell>
                  <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">{r.listTitle}</TableCell>
                  <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">{r.reason}</TableCell>
                  <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">{new Date(r.reportDate).toLocaleString()}</TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <button
                      className="px-2 py-1 border rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-600/20 border-gray-300 dark:border-gray-600"
                      onClick={() => handleDelete(r.reportId)}
                    >
                      Xóa báo cáo
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td colSpan={6} className="py-6 text-center text-gray-500 dark:text-gray-400">Không có báo cáo</td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}