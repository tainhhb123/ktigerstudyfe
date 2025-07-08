// src/components/tables/AdminTables/LearnerInfoTable.tsx
import { useEffect, useState, useMemo } from "react";
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
  number: number;
  size: number;
}

interface UserInfoTableProps {
  keyword: string;
}

export default function LearnerInfoTable({ keyword }: UserInfoTableProps) {
  const pageSize = 5;
  const [data, setData] = useState<Paged<User>>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: pageSize,
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Reset page when keyword changes
  useEffect(() => {
    setData((d) => ({ ...d, number: 0 }));
    setImageErrors(new Set()); // Reset image errors
  }, [keyword]);

  // Fetch data
  const fetchData = () => {
    setLoading(true);
    const page = data.number;
    
    const url = keyword.trim()
      ? `/api/users/learners/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${pageSize}`
      : `/api/users/learners?page=${page}&size=${pageSize}`;

    axios
      .get<Paged<User>>(url)
      .then((res) => {
        setData(res.data);
        // Reset image errors when new data loads
        setImageErrors(new Set());
      })
      .catch((error) => {
        console.error("Error fetching learners:", error);
        setData({ content: [], totalElements: 0, totalPages: 1, number: 0, size: pageSize });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [keyword, data.number]);

  // Handle image error
  const handleImageError = (userId: number) => {
    setImageErrors(prev => new Set(prev).add(userId));
  };

  // Đóng băng tài khoản
  const handleFreezeUser = async (userId: number, userName: string) => {
    const confirmMessage = `Bạn có chắc muốn đóng băng tài khoản của "${userName}"?\n\nTài khoản sẽ không thể đăng nhập sau khi bị đóng băng.`;
    if (!window.confirm(confirmMessage)) return;
    
    setActionLoading(userId);
    try {
      const response = await axios.post(`/api/users/${userId}/freeze`);
      
      if (response.status === 200) {
        // Update local state immediately for better UX
        setData(prevData => ({
          ...prevData,
          content: prevData.content.map(user => 
            user.userId === userId 
              ? { ...user, userStatus: 0 } 
              : user
          )
        }));
        
        // Show success message
        alert(`Đóng băng tài khoản "${userName}" thành công!`);
      }
    } catch (error: unknown) {
      console.error("Error freezing user:", error);
      let errorMessage = "Có lỗi xảy ra khi đóng băng tài khoản!";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Mở băng tài khoản
  const handleUnfreezeUser = async (userId: number, userName: string) => {
    const confirmMessage = `Bạn có chắc muốn mở băng tài khoản của "${userName}"?\n\nTài khoản sẽ có thể đăng nhập trở lại sau khi được mở băng.`;
    if (!window.confirm(confirmMessage)) return;
    
    setActionLoading(userId);
    try {
      const response = await axios.post(`/api/users/${userId}/unfreeze`);
      
      if (response.status === 200) {
        // Update local state immediately for better UX
        setData(prevData => ({
          ...prevData,
          content: prevData.content.map(user => 
            user.userId === userId 
              ? { ...user, userStatus: 1 } 
              : user
          )
        }));
        
        // Show success message
        alert(`Mở băng tài khoản "${userName}" thành công!`);
      }
    } catch (error: unknown) {
      console.error("Error unfreezing user:", error);
      let errorMessage = "Có lỗi xảy ra khi mở băng tài khoản!";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  const { content: users, totalElements, totalPages, number: currentPage } = data;

  // Build pagination with ellipsis
  const pages = useMemo<(number | string)[]>(() => {
    const result: (number | string)[] = [];
    const curr = currentPage + 1;
    const delta = 1;
    const left = Math.max(2, curr - delta);
    const right = Math.min(totalPages - 1, curr + delta);

    if (totalPages <= 1) return [];

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
          Tổng số học viên: {totalElements.toLocaleString()}
        </span>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 0 || loading}
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
                  disabled={loading}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage + 1 >= totalPages || loading}
              onClick={() => goToPage(Math.min(totalPages - 1, currentPage + 1))}
            >
              Sau
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="font-bold px-5 py-3 text-center border-r border-gray-200 dark:border-gray-700 dark:text-white w-20">
                Ảnh
              </TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700 dark:text-white min-w-[150px]">
                Họ tên
              </TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700 dark:text-white min-w-[200px]">
                Email
              </TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700 dark:text-white w-24">
                Giới tính
              </TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700 dark:text-white w-28">
                Ngày sinh
              </TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 border-r border-gray-200 dark:border-gray-700 dark:text-white text-center w-28">
                Trạng thái
              </TableCell>
              <TableCell isHeader className="font-bold px-5 py-3 text-center dark:text-white w-32">
                Hành động
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((u) => (
                <TableRow key={u.userId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10">
                  <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700">
                    <div className="flex justify-center">
                      {imageErrors.has(u.userId) ? (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                            {u.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={u.avatarImage || "/default-avatar.png"}
                          alt={u.fullName}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={() => handleImageError(u.userId)}
                          loading="lazy"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700">
                    {u.fullName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                    {u.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                    {u.gender === "male" ? "Nam" : u.gender === "female" ? "Nữ" : u.gender || "Chưa cập nhật"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                    {u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center border-r border-gray-200 dark:border-gray-700">
                    {u.userStatus === 1 ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-800/40 dark:text-green-200">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-800/40 dark:text-red-200">
                        Đóng băng
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <div className="flex justify-center">
                      {u.userStatus === 1 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFreezeUser(u.userId, u.fullName)}
                          disabled={actionLoading === u.userId}
                          className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 hover:bg-red-50 min-w-[80px]"
                        >
                          {actionLoading === u.userId ? (
                            <div className="flex items-center space-x-1">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                              <span>Đang xử lý...</span>
                            </div>
                          ) : (
                            "Đóng băng"
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnfreezeUser(u.userId, u.fullName)}
                          disabled={actionLoading === u.userId}
                          className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400 hover:bg-green-50 min-w-[80px]"
                        >
                          {actionLoading === u.userId ? (
                            <div className="flex items-center space-x-1">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                              <span>Đang xử lý...</span>
                            </div>
                          ) : (
                            "Mở băng"
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>
                      {keyword ? `Không tìm thấy học viên nào với từ khóa "${keyword}"` : "Chưa có học viên nào"}
                    </span>
                  </div>
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
