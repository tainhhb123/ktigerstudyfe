// src/components/tables/AdminTables/DocumentListTable.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";

// DTO backend trả về trường 'fullName' cho tên học viên
interface DocumentListResponse {
  listId: number;
  fullName: string;
  title: string;
  createdAt: string;
}

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // zero-based page index
  size: number;
}

interface Props {
  keyword: string;
  onSelectList: (id: number) => void;
}

export default function DocumentListTable({ keyword, onSelectList }: Props) {
  const pageSize = 5;
  const [data, setData] = useState<PagedResponse<DocumentListResponse>>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: pageSize
  });
  const [loading, setLoading] = useState(true);

  // Reset to first page when keyword changes
  useEffect(() => {
    setData(d => ({ ...d, number: 0 }));
  }, [keyword]);

  useEffect(() => {
    setLoading(true);
    const page = data.number;
    // Call paged API with keyword, page, size
        axios.get<PagedResponse<DocumentListResponse>>(
        `/api/document-lists/public/paged?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${pageSize}`
        )
      .then(res => setData(res.data))
      .catch(() => setData({ content: [], totalElements: 0, totalPages: 1, number: 0, size: pageSize }))
      .finally(() => setLoading(false));
  }, [keyword, data.number]);

  const { content: lists, totalElements, totalPages, number: page } = data;

  return (
    <div className="rounded-xl bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10">
      {/* Header with total count and pagination controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
        <span className="font-semibold text-gray-700 dark:text-white">
          Tổng số tài liệu chia sẻ: {totalElements}
        </span>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <button
            disabled={page === 0}
            onClick={() => setData(d => ({ ...d, number: Math.max(0, d.number - 1) }))}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-white disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Trang {page + 1}/{totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setData(d => ({ ...d, number: Math.min(totalPages - 1, d.number + 1) }))}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-white disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-center border-r border-gray-200 dark:border-gray-700">Học viên</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left border-r border-gray-200 dark:border-gray-700">Tiêu đề</TableCell>
              <TableCell isHeader className="px-5 py-3 text-center border-r border-gray-200 dark:border-gray-700">Ngày chia sẻ</TableCell>
              <TableCell isHeader className="px-5 py-3 text-center">Hành động</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={4} className="py-6 text-center text-gray-500">Đang tải…</td>
              </TableRow>
            )}
            {!loading && lists.length === 0 && (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={4} className="py-6 text-center text-gray-500">Không có tài liệu</td>
              </TableRow>
            )}
            {!loading && lists.map(l => (
              <TableRow key={l.listId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10">
                <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700">{l.fullName}</TableCell>
                <TableCell className="px-5 py-4 text-left border-r border-gray-200 dark:border-gray-700">{l.title}</TableCell>
                <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700">{new Date(l.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="px-5 py-4 text-center">
                  <Button size="sm" variant="outline" onClick={() => onSelectList(l.listId)}>
                    Xem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}