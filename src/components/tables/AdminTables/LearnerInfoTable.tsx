// src/components/tables/AdminTables/UserInfoTable.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../ui/table";

interface User {
  userId: number;
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  avatarImage: string;
  userStatus: number;
  userName: string;
  role: string;
  joinDate: string | null;
}

interface UserPage {
  content: User[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

interface UserInfoTableProps {
  keyword: string;
}

export default function UserInfoTable({ keyword }: UserInfoTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Reset page when keyword changes
  useEffect(() => setPage(0), [keyword]);

  useEffect(() => {
    setLoading(true);
    const apiPath = keyword.trim()
      ? `/api/users/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=5`
      : `/api/users?page=${page}&size=5`;

    axios
      .get<UserPage>(apiPath)
      .then((res) => {
        const nonAdmin = res.data.content.filter((u) => u.role.toLowerCase() !== "admin");
        setUsers(nonAdmin);
        const totalNonAdmin = res.data.totalElements - (res.data.content.length - nonAdmin.length);
        setTotalElements(totalNonAdmin);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => {
        setUsers([]);
        setTotalElements(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [page, keyword]);

  return (
    <div className="rounded-xl bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10">
      {/* Header + Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
        <span className="font-semibold text-gray-700 dark:text-white">
          Tổng số học viên: {totalElements}
        </span>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {page + 1}/{totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {/* Table with grid lines */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="font-bold px-5 py-3 text-center border-r border-gray-200 dark:border-gray-700">Ảnh</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700">Họ tên</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700">Email</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700">Giới tính</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700">Ngày sinh</TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 text-center">Trạng thái</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={6} className="py-6 text-center text-gray-500 align-middle">Đang tải…</td>
              </TableRow>
            )}
            {!loading && users.length === 0 && (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={6} className="py-6 text-center text-gray-500 align-middle">Không có dữ liệu</td>
              </TableRow>
            )}
            {!loading &&
              users.map((u) => (
                <TableRow key={u.userId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10">
                  <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700 align-middle">
                    <img
                      src={u.avatarImage}
                      alt={u.fullName}
                      className="h-10 w-10 rounded-full object-cover mx-auto"
                    />
                  </TableCell>
                  <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700 align-middle">{u.fullName}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">{u.email}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">{u.gender}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">{u.dateOfBirth}</TableCell>
                  <TableCell className="px-5 py-4 text-center align-middle">
                    {u.userStatus === 1 ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-[2px] text-xs font-semibold text-green-700 dark:bg-green-800/40 dark:text-green-200">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-3 py-[2px] text-xs font-semibold text-red-700 dark:bg-red-800/40 dark:text-red-200">
                        Đóng băng
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}