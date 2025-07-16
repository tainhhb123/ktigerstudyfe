import React, { useState } from "react";
import { changePassword } from "../../services/ChangePasswordApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Xác định xem component đang được dùng như trang độc lập hay không
  const isStandalone = !onSuccess;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const email = user.email;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp nhau không
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
    
    setLoading(true);
    try {
      const result = await changePassword({
        email,
        currentPassword,
        newPassword,
      });

      setMessage("Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Xử lý sau khi đổi mật khẩu thành công
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      } else {
        // Nếu là trang độc lập, chuyển về trang profile
        setTimeout(() => navigate("/profile"), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data || "Lỗi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className={isStandalone ? "max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md" : "p-4 bg-red-50 text-red-600 rounded-md"}>
        <p className="text-red-600">Vui lòng đăng nhập để thay đổi mật khẩu</p>
        {isStandalone && (
          <button 
            onClick={() => navigate("/profile")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại trang cá nhân
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={isStandalone ? "max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md" : "w-full"}>
      {isStandalone && (
        <div className="mb-6">
          <button 
            onClick={() => navigate("/profile")}
            className="text-blue-600 hover:underline flex items-center gap-1 mb-4"
          >
            <ArrowLeft size={16} /> Quay lại trang cá nhân
          </button>
          <h2 className="text-2xl font-bold">Thay đổi mật khẩu</h2>
        </div>
      )}
      
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mật khẩu mới
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>

        {message && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md">
            {message}
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChangePasswordForm;
