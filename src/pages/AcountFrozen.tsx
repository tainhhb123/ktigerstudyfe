import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '../icons';

const AccountFrozen: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Get saved info from localStorage
    const savedEmail = localStorage.getItem("frozenAccountEmail") || "";
    const savedMessage = localStorage.getItem("frozenAccountMessage") || "";
    
    setUserEmail(savedEmail);
    setErrorMessage(savedMessage);

    // Clear the saved info after reading
    localStorage.removeItem("frozenAccountEmail");
    localStorage.removeItem("frozenAccountMessage");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* ❄️ Frozen Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-6">
            <span className="text-6xl">❄️</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Tài khoản đã bị đóng băng
          </h1>

          {/* User Email Display */}
          {userEmail && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">
                <strong>Tài khoản:</strong> {userEmail}
              </p>
            </div>
          )}

          {/* Dynamic Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                <strong>Chi tiết:</strong> {errorMessage}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p className="text-lg">
              Tài khoản của bạn hiện đang bị tạm khóa và không thể truy cập các tính năng của hệ thống.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                🔍 Lý do có thể khiến tài khoản bị đóng băng:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-400">
                <li>Vi phạm điều khoản sử dụng</li>
                <li>Hoạt động đáng ngờ được phát hiện</li>
                <li>Yêu cầu từ quản trị viên</li>
                <li>Bảo trì tài khoản</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                📞 Cách giải quyết:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                <li>Liên hệ bộ phận hỗ trợ qua email: support@ktiger.vn</li>
                <li>Gọi hotline: 1900-1234</li>
                <li>Truy cập trung tâm hỗ trợ để biết thêm chi tiết</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
              📧 Thông tin liên hệ
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Email:</strong> support@ktiger.vn</p>
              <p><strong>Hotline:</strong> 1900-1234</p>
              <p><strong>Giờ hỗ trợ:</strong> 8:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <Link
              to="/contact"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              📞 Liên hệ hỗ trợ
            </Link>
            
            <Link
              to="/signin"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              🔄 Thử đăng nhập lại
            </Link>
            
            <Link
              to="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Quay về trang chủ
            </Link>
          </div>

          {/* Footer Note */}
          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            Nếu bạn cho rằng đây là sai sót, vui lòng liên hệ ngay với chúng tôi để được hỗ trợ khẩn cấp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountFrozen;
