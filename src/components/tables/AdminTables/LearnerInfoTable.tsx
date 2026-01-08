// src/components/tables/AdminTables/LearnerInfoTable.tsx
import { useEffect, useState, useMemo, useCallback } from "react";
import axiosInstance from "../../../services/axiosConfig"; import { AxiosError } from "axios";
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

    axiosInstance
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
      const response = await axiosInstance.post<ApiResponse>(`/api/users/${userId}/${action}`);
      
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
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
      {/* Notification */}
      {notification && (
        <div className="mx-6 mt-4 p-4 rounded-lg" style={{
          backgroundColor: notification.type === 'success' ? '#E8F5E9' : '#FFEBEE',
          color: notification.type === 'success' ? '#2E7D32' : '#C62828',
          border: `1px solid ${notification.type === 'success' ? '#A5D6A7' : '#FFCDD2'}`
        }}>
          <p className="font-medium text-sm">
            <span className="font-bold">
              {notification.type === 'success' ? '✅ Thành công: ' : '❌ Lỗi: '}
            </span>
            {notification.message}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-6 py-5" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold mr-4" style={{ color: '#333333' }}>
              👥 Quản lý học viên
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
                  style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}>
              {totalElements.toLocaleString()} học viên
            </span>
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <span className="text-sm mr-2" style={{ color: '#666666' }}>
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button
              className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
              disabled={currentPage === 0 || loading}
              onClick={() => goToPage(Math.max(0, currentPage - 1))}
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
                  disabled={loading}
                >
                  {p}
                </button>
              )
            )}
            <button
              className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
              disabled={currentPage + 1 >= totalPages || loading}
              onClick={() => goToPage(Math.min(totalPages - 1, currentPage + 1))}
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: '#FFE8DC' }}>
            <tr>
              <th className="px-6 py-3 text-center font-bold w-16" style={{ color: '#FF6B35' }}>Avatar</th>
              <th className="px-6 py-3 text-left font-bold min-w-[200px]" style={{ color: '#FF6B35' }}>Thông tin cá nhân</th>
              <th className="px-6 py-3 text-left font-bold min-w-[250px]" style={{ color: '#FF6B35' }}>Liên hệ</th>
              <th className="px-6 py-3 text-center font-bold w-32" style={{ color: '#FF6B35' }}>Trạng thái</th>
              <th className="px-6 py-3 text-center font-bold w-36" style={{ color: '#FF6B35' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" 
                         style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                    <span style={{ color: '#666666' }}>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr 
                  key={u.userId}
                  className="border-t transition-colors"
                  style={{ borderColor: '#FFE8DC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Avatar column */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {imageErrors.has(u.userId) ? (
                        <div className="h-12 w-12 rounded-full flex items-center justify-center" 
                             style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}>
                          <span className="text-white text-sm font-semibold">
                            {u.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={u.avatarImage || "/default-avatar.png"}
                          alt={u.fullName}
                          className="h-12 w-12 rounded-full object-cover border-2"
                          style={{ borderColor: '#FFE8DC' }}
                          onError={() => handleImageError(u.userId)}
                          loading="lazy"
                        />
                      )}
                    </div>
                  </td>
                  
                  {/* Personal info column */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#333333' }}>
                        {u.fullName}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#666666' }}>
                        {u.gender === "male" ? "Nam" : 
                         u.gender === "female" ? "Nữ" : 
                         u.gender === "MALE" ? "Nam" :
                         u.gender === "FEMALE" ? "Nữ" :
                         u.gender ? u.gender : "Chưa cập nhật giới tính"} • {" "}
                        {u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật ngày sinh'}
                      </div>
                    </div>
                  </td>
                  
                  {/* Contact column */}
                  <td className="px-6 py-4">
                    <div className="text-sm" style={{ color: '#666666' }}>
                      {u.email}
                    </div>
                  </td>
                  
                  {/* Status column */}
                  <td className="px-6 py-4 text-center">
                    {u.userStatus === 1 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2' }}>
                        Đóng băng
                      </span>
                    )}
                  </td>
                  
                  {/* Action column */}
                  <td className="px-6 py-4 text-center">
                    {u.userStatus === 1 ? (
                      <button
                        onClick={() => handleUserAction(u.userId, u.fullName, 'freeze')}
                        disabled={actionLoading === u.userId}
                        className="px-4 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50 min-w-[100px]"
                        style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                        onMouseEnter={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = '#FFCDD2')}
                        onMouseLeave={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = '#FFEBEE')}
                      >
                        {actionLoading === u.userId ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: '#C62828', borderTopColor: 'transparent' }}></div>
                            <span>Đang xử lý...</span>
                          </div>
                        ) : (
                          'Đóng băng'
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUserAction(u.userId, u.fullName, 'unfreeze')}
                        disabled={actionLoading === u.userId}
                        className="px-4 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50 min-w-[100px]"
                        style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
                        onMouseEnter={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = '#C8E6C9')}
                        onMouseLeave={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = '#E8F5E9')}
                      >
                        {actionLoading === u.userId ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: '#2E7D32', borderTopColor: 'transparent' }}></div>
                            <span>Đang xử lý...</span>
                          </div>
                        ) : (
                          'Mở băng'
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>
                    {keyword ? 'Không tìm thấy học viên' : 'Chưa có học viên nào'}
                  </h3>
                  <p style={{ color: '#666666' }}>
                    {keyword ? `Không có học viên nào khớp với từ khóa "${keyword}"` : 'Hệ thống chưa có học viên nào được đăng ký'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
