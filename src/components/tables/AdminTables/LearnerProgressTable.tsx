// src/components/tables/AdminTables/StudentProgressTable.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";

interface UserProgress {
  userId: number;
  avatarImage: string;
  fullName: string;
  joinDate: string;
  levelName: string;
  lessonName: string;
}

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // current page (zero-based)
  size: number;     // page size
}

interface StudentProgressTableProps {
  keyword: string;
}

export default function StudentProgressTable({ keyword }: StudentProgressTableProps) {
  const pageSize = 10;
  const [data, setData] = useState<PagedResponse<UserProgress>>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: pageSize,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // reset page when keyword changes
  useEffect(() => {
    setPage(0);
  }, [keyword]);

  useEffect(() => {
    setLoading(true);
    axios
      .get<PagedResponse<UserProgress>>(
        `/api/user-progress/paged?page=${page}&size=${pageSize}`
      )
      .then((res) => setData(res.data))
      .catch(() =>
        setData({ content: [], totalElements: 0, totalPages: 1, number: 0, size: pageSize })
      )
      .finally(() => setLoading(false));
  }, [page]);

  // client-side filter if needed
  const filtered = keyword.trim().length
    ? data.content.filter(
        (u) =>
          u.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
          u.levelName.toLowerCase().includes(keyword.toLowerCase()) ||
          u.lessonName.toLowerCase().includes(keyword.toLowerCase())
      )
    : data.content;

  return (
    <div className="rounded-xl bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10">
      {/* Header with total count and pagination controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
        <span className="font-semibold text-gray-700 dark:text-white">
          Tổng số tiến trình học viên: {data.totalElements}
        </span>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-white disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Trang {page + 1}/{data.totalPages}
          </span>
          <button
            disabled={page + 1 >= data.totalPages}
            onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
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
              <TableCell isHeader className="font-bold px-5 py-3 text-center border-r border-gray-200 dark:border-gray-700">Ảnh</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 text-left border-r border-gray-200 dark:border-gray-700">Họ tên</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 text-center border-r border-gray-200 dark:border-gray-700">Ngày tham gia</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 text-center border-r border-gray-200 dark:border-gray-700">Cấp độ</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 text-center">Bài học hiện tại</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={5} className="py-6 text-center text-sm text-gray-500">
                  Đang tải…
                </td>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={5} className="py-6 text-center text-sm text-gray-500">
                  Không có dữ liệu
                </td>
              </TableRow>
            )}
            {!loading &&
              filtered.map((u) => (
                <TableRow key={u.userId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10">
                  <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700">
                    <img
                      src={u.avatarImage}
                      alt={u.fullName}
                      className="h-10 w-10 rounded-full object-cover mx-auto"
                    />
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left border-r border-gray-200 dark:border-gray-700 font-medium text-gray-800 dark:text-white">
                    {u.fullName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    {u.joinDate}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    {u.levelName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-gray-600 dark:text-gray-400">
                    {u.lessonName}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}