// src/components/tables/AdminTables/UserInfoTable.tsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../ui/table";
import Button from "../../ui/button/Button";

interface User {
  userId: number;
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  avatarImage: string;
  userStatus: number;
  role: string;
}

interface Paged<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;    // zero-based
  size: number;
}

interface UserInfoTableProps {
  keyword: string;
}

export default function UserInfoTable({ keyword }: UserInfoTableProps) {
  const pageSize = 5;
  const [data, setData] = useState<Paged<User>>({
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

  // Fetch data
  useEffect(() => {
    setLoading(true);
    const page = data.number;
    const url = keyword.trim()
      ? `/api/users/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${pageSize}`
      : `/api/users?page=${page}&size=${pageSize}`;

    axios
      .get<Paged<User>>(url)
      .then((res) => {
        // Filter out admins
        const nonAdmin = res.data.content.filter((u) => u.role.toLowerCase() !== "admin");
        const totalNonAdmin =
          res.data.totalElements - (res.data.content.length - nonAdmin.length);
        setData({
          content: nonAdmin,
          totalElements: totalNonAdmin,
          totalPages: res.data.totalPages,
          number: res.data.number,
          size: res.data.size,
        });
      })
      .catch(() => {
        setData({ content: [], totalElements: 0, totalPages: 1, number: 0, size: pageSize });
      })
      .finally(() => setLoading(false));
  }, [keyword, data.number]);

  const { content: users, totalElements, totalPages, number: currentPage } = data;

  // Build pagination with ellipsis
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

  const goToPage = (pageIndex: number) =>
    setData((d) => ({ ...d, number: pageIndex }));

  return (
    <div className="rounded-xl bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10">
      {/* Header & Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
        <span className="font-semibold text-gray-700 dark:text-white">
          Tổng số học viên: {totalElements}
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
              <span key={idx} className="px-2 text-gray-500">…</span>
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

      {/* Table with grid lines */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="font-bold px-5 py-3 text-center border-r border-gray-200 dark:border-gray-700 dark:text-white">Ảnh</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700 dark:text-white">Họ tên</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700 dark:text-white">Email</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700 dark:text-white">Giới tính</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700 dark:text-white">Ngày sinh</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 text-center dark:text-white">Trạng thái</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={6} className="py-6 text-center text-gray-500">Đang tải…</td>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((u) => (
                <TableRow key={u.userId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10">
                  <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700">
                    <img
                      src={u.avatarImage}
                      alt={u.fullName}
                      className="h-10 w-10 rounded-full object-cover mx-auto"
                    />
                  </TableCell>
                  <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700">{u.fullName}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">{u.email}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">{u.gender}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">{u.dateOfBirth}</TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    {u.userStatus === 1 ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-[2px] text-xs font-semibold text-green-700 dark:bg-green-800/40 dark:text-green-200">Hoạt động</span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-3 py-[2px] text-xs font-semibold text-red-700 dark:bg-red-800/40 dark:text-red-200">Đóng băng</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={6} className="py-6 text-center text-gray-500">Không có dữ liệu</td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
