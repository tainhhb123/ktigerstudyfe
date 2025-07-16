// src/components/tables/AdminTables/LearnerInfoTable.tsx
import { useEffect, useState, useMemo, useCallback } from "react";
import axios, { AxiosError } from "axios";
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

interface ApiResponse {
  success: boolean;
  message: string;
  userId: number;
  userStatus: number;
  userData?: User;
}

interface ErrorResponse {
  message: string;
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
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Reset page when keyword changes
  useEffect(() => {
    setData((d) => ({ ...d, number: 0 }));
    setImageErrors(new Set());
  }, [keyword]);

  // Show notification and auto-hide
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Extract error message from response
  const getErrorMessage = (error: AxiosError<ErrorResponse>, defaultMsg: string) => {
    return error.response?.data?.message || defaultMsg;
  };

  // Fetch data
  const fetchData = useCallback(() => {
    setLoading(true);
    
    const url = keyword.trim()
      ? `/api/users/learners/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&size=${pageSize}`
      : `/api/users/learners?page=${currentPage}&size=${pageSize}`;

    axios
      .get<Paged<User>>(url)
      .then((res) => {
        setData(res.data);
        setImageErrors(new Set());
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        setData({ content: [], totalElements: 0, totalPages: 1, number: currentPage, size: pageSize });
        showNotification('error', getErrorMessage(error, 'Không thể tải dữ liệu học viên'));
      })
      .finally(() => setLoading(false));
  }, [keyword, currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle image error
  const handleImageError = (userId: number) => {
    setImageErrors(prev => new Set(prev).add(userId));
  };

  // Update user status in local state
  const updateUserStatus = (userId: number, status: number) => {
    setData(prevData => ({
      ...prevData,
      content: prevData.content.map(user => 
        user.userId === userId ? { ...user, userStatus: status } : user
      )
    }));
  };

  // Handle user action (freeze/unfreeze)
  const handleUserAction = async (
    userId: number, 
    userName: string, 
    action: 'freeze' | 'unfreeze'
  ) => {
    const actionText = action === 'freeze' ? 'đóng băng' : 'mở băng';
    const newStatus = action === 'freeze' ? 0 : 1;
    
    const confirmMessage = `Bạn có chắc muốn ${actionText} tài khoản của "${userName}"?`;
    if (!window.confirm(confirmMessage)) return;
    
    setActionLoading(userId);
    try {
      const response = await axios.post<ApiResponse>(`/api/users/${userId}/${action}`);
      
      if (response.status === 200 && response.data.success === true) {
        updateUserStatus(userId, newStatus);
        showNotification('success', `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} tài khoản "${userName}" thành công!`);
      } else {
        throw new Error(response.data?.message || `Không thể ${actionText} tài khoản`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      showNotification('error', `Lỗi: ${getErrorMessage(axiosError, `Có lỗi xảy ra khi ${actionText} tài khoản`)}`);
    } finally {
      setActionLoading(null);
    }
  };

  const { content: users, totalElements, totalPages } = data;

  // Build pagination
  const pages = useMemo<(number | string)[]>(() => {
    if (totalPages <= 1) return [];
    
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

  const goToPage = (pageIndex: number) => setCurrentPage(pageIndex);

  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {/* ✅ Clean notification - NO ICONS */}
      {notification && (
        <div className={`mx-6 mt-4 p-4 rounded-lg border ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' 
            : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
        }`}>
          <div className="flex items-start">
            <div className="flex-1">
              <p className="font-medium text-sm">
                <span className="font-bold">
                  {notification.type === 'success' ? 'Thành công: ' : 'Lỗi: '}
                </span>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-4">
              Quản lý học viên
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {totalElements.toLocaleString()} học viên
            </span>
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
              Trang {currentPage + 1} / {totalPages}
            </span>
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
          <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
            <TableRow>
              <TableCell isHeader className="font-semibold px-6 py-4 text-left text-gray-900 dark:text-gray-200 w-16">
                Avatar
              </TableCell>
              <TableCell isHeader className="font-semibold px-6 py-4 text-left text-gray-900 dark:text-gray-200 min-w-[200px]">
                Thông tin cá nhân
              </TableCell>
              <TableCell isHeader className="font-semibold px-6 py-4 text-left text-gray-900 dark:text-gray-200 min-w-[250px]">
                Liên hệ
              </TableCell>
              <TableCell isHeader className="font-semibold px-6 py-4 text-center text-gray-900 dark:text-gray-200 w-32">
                Trạng thái
              </TableCell>
              <TableCell isHeader className="font-semibold px-6 py-4 text-center text-gray-900 dark:text-gray-200 w-36">
                Hành động
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((u) => (
                <TableRow key={u.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  {/* Avatar column */}
                  <TableCell className="px-6 py-4">
                    <div className="flex justify-center">
                      {imageErrors.has(u.userId) ? (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-sm">
                          <span className="text-white text-sm font-semibold">
                            {u.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={u.avatarImage || "/default-avatar.png"}
                          alt={u.fullName}
                          className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                          onError={() => handleImageError(u.userId)}
                          loading="lazy"
                        />
                      )}
                    </div>
                  </TableCell>
                  
                  {/* ✅ Personal info column - NO ICONS */}
                  <TableCell className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        {u.fullName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {u.gender === "male" ? "Nam" : 
                         u.gender === "female" ? "Nữ" : 
                         u.gender === "MALE" ? "Nam" :
                         u.gender === "FEMALE" ? "Nữ" :
                         u.gender ? u.gender : "Chưa cập nhật giới tính"} • {" "}
                        {u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật ngày sinh'}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Contact column */}
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {u.email}
                    </div>
                  </TableCell>
                  
                  {/* ✅ Status column - NO DOTS */}
                  <TableCell className="px-6 py-4 text-center">
                    {u.userStatus === 1 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                        Đóng băng
                      </span>
                    )}
                  </TableCell>
                  
                  {/* Action column */}
                  <TableCell className="px-6 py-4 text-center">
                    {u.userStatus === 1 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(u.userId, u.fullName, 'freeze')}
                        disabled={actionLoading === u.userId}
                        className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20 min-w-[100px]"
                      >
                        {actionLoading === u.userId ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                            <span>Đang xử lý...</span>
                          </div>
                        ) : (
                          'Đóng băng'
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(u.userId, u.fullName, 'unfreeze')}
                        disabled={actionLoading === u.userId}
                        className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20 min-w-[100px]"
                      >
                        {actionLoading === u.userId ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                            <span>Đang xử lý...</span>
                          </div>
                        ) : (
                          'Mở băng'
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // ✅ Empty state - NO ICONS
              <TableRow>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {keyword ? 'Không tìm thấy học viên' : 'Chưa có học viên nào'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {keyword ? `Không có học viên nào khớp với từ khóa "${keyword}"` : 'Hệ thống chưa có học viên nào được đăng ký'}
                      </p>
                    </div>
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
