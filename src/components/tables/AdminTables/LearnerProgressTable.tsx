// src/components/tables/AdminTables/StudentProgressTable.tsx
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
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
    axios
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
    <div className="rounded-xl bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10">
      {/* Header & Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
        <span className="font-semibold text-gray-700 dark:text-white">
          Tổng số tiến trình học viên: {totalElements}
        </span>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 0}
            onClick={() => goToPage(Math.max(0, currentPage - 1))}
          >
            Trước
          </Button>
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2 text-gray-500 dark:text-gray-400">…</span>
            ) : (
              <Button
                key={idx}
                size="sm"
                variant={p === currentPage + 1 ? "primary" : "outline"}
                onClick={() => goToPage((p as number) - 1)}
              >
                {p}
              </Button>
            )
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage + 1 >= totalPages}
            onClick={() => goToPage(Math.min(totalPages - 1, currentPage + 1))}
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-center font-bold border-r border-gray-200 dark:border-gray-700 dark:text-white">
                Ảnh
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left font-bold border-r border-gray-200 dark:border-gray-700 dark:text-white">
                Họ tên
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-center font-bold border-r border-gray-200 dark:border-gray-700 dark:text-white">
                Ngày tham gia
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-center font-bold border-r border-gray-200 dark:border-gray-700 dark:text-white">
                Cấp độ
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-center font-bold dark:text-white">
                Bài học hiện tại
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  Đang tải…
                </td>
              </TableRow>
            ) : filtered.length > 0 ? (
              filtered.map((u) => (
                <TableRow key={u.userId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10">
                  <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700">
                    <img
                      src={u.avatarImage}
                      alt={u.fullName}
                      className="h-10 w-10 rounded-full object-cover mx-auto"
                    />
                  </TableCell>
                  <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-700 font-medium text-gray-800 dark:text-white">
                    {u.fullName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    {u.joinDate}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    {u.currentLevel}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-gray-600 dark:text-gray-400">
                    {u.currentLesson}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  Không có dữ liệu
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
