import React, { useEffect, useState } from "react";
import axiosInstance from '../../../services/axiosConfig';
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
  userStatus: number; // 1-active, 0-frozen
  userName: string;
  role: string;
  joinDate: string | null;
}

export default function UserInfoTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => alert("Không load được users: " + err))
      .finally(() => setLoading(false));
  }, []);

  /*──────────  UI  ──────────*/
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* HEADER */}
          <TableHeader className="border-b border-gray-100 dark:border-white/10">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Ảnh
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Họ&nbsp;tên
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Giới&nbsp;tính
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Ngày&nbsp;sinh
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                Trạng&nbsp;thái
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/10">
            {/* Loading / Empty state */}
            {loading && (
              <TableRow>
                <td colSpan={6} className="py-6 text-center text-sm text-gray-500">
                  Đang tải…
                </td>
              </TableRow>
            )}
            {!loading && users.length === 0 && (
              <TableRow>
                <td colSpan={6} className="py-6 text-center text-sm text-gray-500">
                  Không có dữ liệu
                </td>
              </TableRow>
            )}

            {/* DATA rows */}
            {!loading &&
              users.map((u) => (
                <TableRow key={u.userId} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <TableCell className="px-5 py-4">
                    <img
                      src={u.avatarImage}
                      alt={u.fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {u.fullName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {u.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {u.gender}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {u.dateOfBirth}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    {u.userStatus === 1 ? (
                      <span className="rounded bg-green-100 px-3 py-[2px] text-xs font-semibold text-green-700 dark:bg-green-800/30 dark:text-green-300">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="rounded bg-red-100 px-3 py-[2px] text-xs font-semibold text-red-700 dark:bg-red-800/30 dark:text-red-300">
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
